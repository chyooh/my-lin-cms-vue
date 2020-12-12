<template>
  <div class="container form-container">
    <!-- <div class="header">
      <div class="title">分类列表</div>
      <el-button type="primary" plain @click="create" size="medium">创建规格</el-button>
    </div> -->
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
        <el-form-item label="规格名" prop="goodsPublicSpecNameLike">
          <el-input size="mini" clearable v-model="filterForm.goodsPublicSpecNameLike"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="一级分类" prop="firstCategoryId">
          <el-select
            size="mini"
            v-model="filterForm.firstCategoryId"
            placeholder="请选择"
            @change="firstCategoryIdChange"
          >
            <el-option v-for="(group, index) in firstCategoryId" :key="index" :label="group.catName" :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="二级分类" prop="secondCategoryId">
          <el-select size="mini" v-model="filterForm.secondCategoryId" placeholder="请选择">
            <el-option v-for="(group, index) in secondCategoryId" :key="index" :label="group.catName" :value="group.id">
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
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
      <el-table-column fixed prop="goodsPublicSpecName" label="名称" width="100"> </el-table-column>
      <el-table-column label="分类" width="150">
        <template slot-scope="props">
          {{ `${props.row.secondCategoryName}-${props.row.firstCategoryName}` }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="orderNumber" label="排序" width="100"> </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="235">
        <template slot-scope="props">
          <el-button type="primary" plain @click="goToChildren(props.row)" size="mini">查看</el-button>
          <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
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
import Public from '@/model/public-spec'
import Category from '@/model/category'

export default {
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名称不能为空'))
      }
      callback()
    }
    const checkOrder = (rule, value, callback) => {
      if (!value || value < 1) {
        return callback(new Error('排序只能为大于0的数字'))
      }
      callback()
    }
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      dialogFormVisible: false, // 是否弹窗
      form: {
        goodsPublicSpecName: '',
        orderNumber: 1,
        firstCategoryId: null,
        secondCategoryId: null,
        onlyOneSelect1: false,
        mustSelect1: true,
      },
      rules: {
        goodsPublicSpecName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      loading: false,
      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],
      filterForm: {
        goodsPublicSpecNameLike: null,
        firstCategoryId: null, // 一级分类
        secondCategoryId: null, // 二级分类
        filter_createTimes: null,
        filter_createTimee: null, // 日期搜索区间,包括创建时间,更新时间
      },
    }
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getSpecList() {
      try {
        this.loading = true
        const res = await Public.list({ ...this.filterForm, pageSize: this.pageCount, pageNumber: this.currentPage })
        if (res.data.rows.length) {
          res.data.rows.forEach(item => {
            item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
          })
          this.tableData = res.data.rows
        } else {
          this.tableData = []
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    goToChildren(val) {
      this.$router.push({ path: '/spec/view', query: { val: JSON.stringify(val) } })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Public.delete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getSpecList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    // create() {
    //   console.log('create')
    //   this.dialogFormVisible = true
    // },
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
    firstCategoryIdChange(val) {
      this.form.secondCategoryId = null
      this.secondCategoryId = []
      const obj = this.categoryList.find(item => item.id === val)
      if (obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },
    setFirstCategoryName(id) {
      const obj = this.firstCategoryId.find(item => item.id === id)
      this.form.firstCategoryName = obj.catName
    },
    setSecondCategoryName(id) {
      const obj = this.secondCategoryId.find(item => item.id === id)
      this.form.secondCategoryName = obj.catName
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getSpecList()
      this.loading = false
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.currentPage = 1
          await this.getSpecList()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.$refs[formName].resetFields()
      this.getSpecList()
    },
  },
  created() {
    this.getSpecList()
    this.getAllCategory()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .header {
    display: flex;
    align-items: center;

    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    margin-right: 30px;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
