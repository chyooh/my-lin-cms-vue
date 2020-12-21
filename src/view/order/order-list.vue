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
        <el-form-item label="订单号" prop="orderNo">
          <el-input size="mini" clearable v-model="filterForm.orderNo"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="状态" prop="status">
          <el-select size="mini" v-model="filterForm.status" placeholder="请选择">
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
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'id', order: 'descending' }"
      default-expand-all
      row-class-name="user-list-table"
      stripe
      v-loading="loading"
    >
      <el-table-column fixed prop="id" label="id" sortable width="80"> </el-table-column>
      <el-table-column fixed prop="goodsId" label="商品id" width="150"> </el-table-column>
      <el-table-column fixed label="回收价格" width="150">
        <template slot-scope="props">
          {{ Util.getPriceString(props.row.recoveryPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="props">
          {{ props.row.status === 1 ? '已完成' : '未完成' }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="props">
          <el-button type="primary" plain @click="handleDelete(props.row.id)" size="mini">删 除</el-button>
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
import Order from '@/model/order'
import Util from '@/util/util'

export default {
  data() {
    return {
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableData: [], // 表格数据
      status: [
        { label: '不限', value: null },
        { label: '已完成', value: 1 },
        { label: '未完成', value: 0 },
        { label: '已取消', value: 2 },
      ],
      loading: false,
      filterForm: {
        orderNo: null,
        status: null, // 状态 0 未完成 1 已完成
        filter_createTimes: null,
        filter_createTimee: null, // 日期搜索区间,包括创建时间,更新时间
      },
      Util,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getOrderList() {
      const { currentPage } = this
      try {
        this.loading = true
        const res = await Order.list({
          ...this.filterForm,
          pageSize: this.pageCount,
          pageNumber: currentPage,
        }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Goods.deleteRecord(id)
          const idx = this.tableData.findIndex(item => item.id === id)
          this.tableData.splice(idx, 1)
          this.loading = false
          this.$message.success(`${res.msg}`)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getOrderList()
      this.loading = false
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.currentPage = 1
          await this.getOrderList()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.$refs[formName].resetFields()
      this.getOrderList()
    },
  },
  async created() {
    await this.getOrderList()
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
