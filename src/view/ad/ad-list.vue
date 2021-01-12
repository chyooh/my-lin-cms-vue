<template>
  <div class="container form-container">
    <div class="header">
      <div class="title">广告列表</div>
    </div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="60"> </el-table-column>
      <el-table-column fixed label="图片" width="200">
        <template slot-scope="props">
          <el-image class="img" :src="props.row.imageUrl" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column fixed prop="title" label="标题" width="150"> </el-table-column>
      <el-table-column prop="categoryName" label="分类" width="200"> </el-table-column>
      <el-table-column prop="url" label="页面链接" width="400"> </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="props"> {{ props.row.status === 1 ? '已上线' : '已下线' }} </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" width="100"> </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="150"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="props">
          <el-button
            type="primary"
            plain
            @click="off(props.row.id)"
            size="mini"
            v-permission="'admin:ad:edit'"
            v-if="props.row.status === 1"
            >下线</el-button
          >
          <el-button type="primary" plain @click="up(props.row.id)" size="mini" v-permission="'admin:ad:edit'" v-else
            >上线</el-button
          >
          <el-button type="" plain @click="handleView(props.row)" size="mini">查看</el-button>
          <el-button type="danger" plain @click="handleDelete(props.row.id)" size="mini" v-permission="'admin:ad:del'"
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
  </div>
</template>

<script>
import Ad from '@/model/ad'
import Util from '@/util/util'

export default {
  data() {
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      total_nums: 0, // 分组内的用户总数
      pageNumber: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      loading: false,
      firstCategoryId: [],
    }
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getAdList() {
      try {
        const { pageSize, pageNumber } = this
        this.loading = true
        const res = await Ad.adList({ pageSize, pageNumber })
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
          item.categoryName = this.setFirstCategoryName(item.categoryId)
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleDelete(id) {
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Ad.delete(id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getAdList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    async up(id) {
      try {
        this.loading = true
        const res = await Ad.upline(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getAdList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async off(id) {
      try {
        this.loading = true
        const res = await Ad.offline(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getAdList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所有分类
    async getAllCategory() {
      try {
        const res = await Ad.list()
        res.data.rows.forEach(item => {
          const { name, id } = item
          this.firstCategoryId.push({ name, id })
        })
      } catch (e) {
        console.log(e)
      }
    },
    setFirstCategoryName(id) {
      const obj = this.firstCategoryId.find(item => item.id === id)
      return obj.name
    },
    // 切换table页
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getAdList()
    },
    handleView(val) {
      this.$router.push({ path: '/ad/add', query: { val: JSON.stringify(val) } })
    },
  },
  async created() {
    await this.getAllCategory()
    this.getAdList()
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
  .img {
    display: block;
    height: 100px;
  }
}
</style>
