<template>
  <div class="container">
    <div class="header">
      <div class="title">分类列表</div>
    </div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <el-table :data="tableData" stripe v-loading="loading">
          <el-table-column fixed prop="id" label="id" sortable width="80"> </el-table-column>
          <el-table-column fixed prop="name" label="名称" width="400"> </el-table-column>
          <el-table-column sortable fixed="right" prop="createTime" label="创建时间"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Ad from '@/model/ad'
import Util from '@/util/util'

export default {
  data() {
    return {
      tableData: [],
      loading: false,
    }
  },
  methods: {
    async getCategoryList() {
      try {
        this.loading = true
        const res = await Ad.list()
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
        })
        this.tableData = res.data.rows
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
  },
  async created() {
    await this.getCategoryList()
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
}
</style>
