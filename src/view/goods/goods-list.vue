<template>
  <div class="container form-container">
    <el-form
      :model="filterForm"
      status-icon
      label-position="right"
      ref="filterForm"
      @submit.native.prevent
      class="form"
      inline
    >
      <div class="form-item-div">
        <el-form-item label="商品名称" prop="filter_goodsName">
          <el-input size="mini" clearable v-model="filterForm.filter_goodsName"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="一级分类" prop="filter_firstCategoryId">
          <el-select
            size="mini"
            v-model="filterForm.filter_firstCategoryId"
            placeholder="请选择"
            @change="firstCategoryIdChange"
          >
            <el-option v-for="(group, index) in firstCategoryId" :key="index" :label="group.catName" :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="二级分类" prop="filter_secondCategoryId">
          <el-select size="mini" v-model="filterForm.filter_secondCategoryId" placeholder="请选择">
            <el-option v-for="(group, index) in secondCategoryId" :key="index" :label="group.catName" :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="是否推荐" prop="filter_isHandPick">
          <el-select size="mini" v-model="filterForm.filter_isHandPick" placeholder="请选择">
            <el-option v-for="(group, index) in isHandPick" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="状态" prop="filter_status">
          <el-select size="mini" v-model="filterForm.filter_status" placeholder="请选择">
            <el-option v-for="(group, index) in status" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="创建时间">
          <el-form-item prop="filter_createTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createTimes"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now()
                },
              }"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="filter_createTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() > Date.now() ||
                    time.getTime() < new Date(filterForm.filter_createTimes + ' 00:00:00')
                  )
                },
              }"
              placeholder="选择结束时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="回收均价">
          <el-form-item prop="avgPrices">
            <el-input
              size="mini"
              type="number"
              :min="0"
              clearable
              v-model="filterForm.avgPrices"
              placeholder="最小价格"
            ></el-input>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="avgPricee">
            <el-input
              size="mini"
              type="number"
              :min="filterForm.avgPrices"
              clearable
              v-model="filterForm.avgPricee"
              placeholder="最大价格"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="80">
        <template slot-scope="props">
          {{ props.row.goods.id }}
        </template>
      </el-table-column>
      <el-table-column fixed label="图片" width="150">
        <template slot-scope="props">
          <el-image :src="props.row.goods.goodsImage" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column fixed prop="goodsName" label="名称" width="150">
        <template slot-scope="props">
          {{ props.row.goods.goodsName }}
        </template>
      </el-table-column>
      <el-table-column label="分类" width="150">
        <template slot-scope="props">
          {{ `${props.row.secondCategoryName}-${props.row.firstCategoryName}` }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="props">
          {{
            props.row.goods.status === 1
              ? '上架'
              : props.row.goods.status === 2
              ? '下架'
              : props.row.goods.status === 3
              ? '草稿'
              : '备份'
          }}
        </template>
      </el-table-column>
      <el-table-column label="回收均价" width="150">
        <template slot-scope="props">
          {{ Util.getPriceString(props.row.goods.avgPrice) }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="150">
        <template slot-scope="props">
          {{ props.row.goods.createTime }}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注">
        <template slot-scope="props">
          {{ props.row.goods.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="props">
          <el-button type="primary" plain @click="handleEdit(props.row.goods.id)" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Goods from '@/model/goods'
import Category from '@/model/category'
import Util from '@/util/util'

export default {
  data() {
    return {
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableData: [], // 表格数据
      isHandPick: [
        { label: '不限', value: null },
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ],
      status: [
        { label: '不限', value: null },
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
        { label: '草稿', value: 3 },
        { label: '备份', value: 4 },
      ],
      loading: false,
      filterForm: {
        filter_goodsName: null,
        filter_firstCategoryId: null, // 一级分类
        filter_secondCategoryId: null, // 二级分类
        filter_isHandPick: null, // 是否推荐 1 是 2 否
        filter_status: null, // 状态 1 上架 2 下架
        filter_createTimes: null,
        filter_createTimee: null, // 日期搜索区间,包括创建时间,更新时间
        filter_updateTimes: null,
        filter_updateTimee: null, // 日期搜索区间,包括创建时间,更新时间
        // sortName: null, // 更新时间,创建时间,用户id
        // sortOrder: null, // desc,asc
        avgPrices: null, // 大于等于回收均价
        avgPricee: null, // 小于等于回收均价
      },
      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],
      Util,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getGoodsList() {
      const { currentPage } = this
      try {
        this.loading = true
        const res = await Goods.goodsList({ ...this.filterForm, pageSize: this.pageCount, pageNumber: currentPage }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        if (res.data.rows.length) {
          res.data.rows.forEach(item => {
            item.goods.createTime = new Date(item.goods.createTime).toLocaleString('chinese', { hour12: false })
          })
          this.tableData = res.data.rows
          this.total_nums = res.data.total
        } else {
          this.tableData = []
          this.total_nums = 0
        }
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所有分类
    async getAllCategory() {
      try {
        this.loading = true
        const res = await Category.categoryList()
        if (res.data.rows.length) {
          this.categoryList = res.data.rows
          this.categoryList.forEach(item => {
            const { catName, id } = item
            this.firstCategoryId.push({ catName, id })
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleEdit(id) {
      this.$router.push({
        path: '/goods/add',
        query: { id },
      })
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getGoodsList()
      this.loading = false
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.currentPage = 1
          await this.getGoodsList()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.$refs[formName].resetFields()
      this.getGoodsList()
    },
    firstCategoryIdChange(val) {
      this.filterForm.filter_secondCategoryId = null
      this.secondCategoryId = []
      const obj = this.categoryList.find(item => item.id === val)
      if (obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },
  },
  async created() {
    await this.getGoodsList()
    await this.getAllCategory()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
.my-draw {
  .form {
    padding: 0 20px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
