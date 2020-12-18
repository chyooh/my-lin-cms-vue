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
        <el-form-item label="物流公司名称" prop="name">
          <el-input size="mini" clearable v-model="filterForm.name"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="物流公司编号" prop="number">
          <el-input size="mini" clearable v-model="filterForm.number"></el-input>
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
          <el-form-item prop="createTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.createTimes"
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
          <el-form-item prop="createTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.createTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now() || time.getTime() < new Date(filterForm.createTimes + ' 00:00:00')
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
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column fixed prop="name" label="名称" width="150"> </el-table-column>
      <el-table-column prop="number" label="编号" width="150"> </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="props">
          {{ props.row.status === 1 ? '禁用' : '启用' }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="150">
        <template slot-scope="props">
          {{ props.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="props">
          <el-button
            v-permission="['admin:logistics_company:view', 'admin:logistics_company:edit']"
            type="primary"
            plain
            @click="handleEdit(props.row)"
            size="mini"
            >查看</el-button
          >
          <el-button
            v-permission="'admin:logistics_company:edit'"
            v-if="props.row.status === 1"
            type="success"
            plain
            @click="handleEnable(props.row.id)"
            size="mini"
          >
            启用
          </el-button>
          <el-button
            v-permission="'admin:logistics_company:edit'"
            v-if="props.row.status === 2"
            type="info"
            plain
            @click="handleDisable(props.row.id)"
            size="mini"
          >
            禁用
          </el-button>
          <el-button
            v-permission="'admin:logistics_company:del'"
            type="danger"
            plain
            @click="handleDelete(props.row.id)"
            size="mini"
            >删除</el-button
          >
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
import Logistics from '@/model/logistics'
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
        { label: '启用', value: 2 },
        { label: '禁用', value: 1 },
      ],
      loading: false,
      filterForm: {
        name: null,
        number: null,
        status: null, // 状态 1 启用 2 禁用
        createTimes: null,
        createTimee: null, // 日期搜索区间,包括创建时间,更新时间
      },
      Util,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getGoodsList() {
      const { currentPage } = this
      try {
        this.loading = true
        const res = await Logistics.list({ ...this.filterForm, pageSize: this.pageCount, pageNumber: currentPage }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        if (res.data.rows.length) {
          res.data.rows.forEach(item => {
            item.createTime = Util.getDateString(item.createTime)
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
    async handleEdit(val) {
      this.$router.push({
        path: '/logistics/add',
        query: { val: JSON.stringify(val) },
      })
    },

    // 启用
    async handleEnable(id) {
      try {
        this.loading = true
        const res = await Logistics.enable(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getGoodsList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 禁用
    async handleDisable(id) {
      try {
        this.loading = true
        const res = await Logistics.disable(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getGoodsList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Logistics.delete(id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getGoodsList()
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
  },
  async created() {
    await this.getGoodsList()
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
