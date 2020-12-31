<template>
  <div class="container form-container">
    <div class="title">信用额度列表</div>
    <el-row>
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
        <el-table :data="tableData" stripe v-loading="loading">
          <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
          <el-table-column fixed prop="riskinfoNsfCommon" label="信用等级" width="100"> </el-table-column>
          <el-table-column fixed prop="precent" label="百分比(%)" width="180"> </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" width="150"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="props">
              <el-button
                v-permission="'admin:credit:payment:edit'"
                type="primary"
                plain
                @click="handleEdit(props.row)"
                size="mini"
                >编辑</el-button
              >
              <el-button
                v-permission="'admin:credit:payment:del'"
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
            :page-size="pageSize"
            :current-page="pageNumber"
            layout="prev, pager, next, jumper"
            :total="total_nums"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Credit from '@/model/credit'
import Util from '@/util/util'

export default {
  data() {
    return {
      total_nums: 0, // 分组内的用户总数
      pageNumber: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      tableData: [], // 表格数据
      loading: false,
      Util,
    }
  },

  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getCreditList() {
      const { pageNumber, pageSize } = this
      try {
        this.loading = true
        const res = await Credit.list({ pageSize, pageNumber }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
          item.precent *= 100
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    handleEdit(row) {
      this.$router.push({
        path: '/credit/add',
        query: { row },
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该额度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Credit.delete(id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getCreditList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    // 切换table页
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getCreditList()
    },
  },
  created() {
    this.getCreditList()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 20px;
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
.goodsid-tag {
  margin: 2px 5px 2px 0;
}
</style>
