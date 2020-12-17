<template>
  <div class="container form-container">
    <div class="title">优惠券列表</div>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column fixed prop="name" label="名称" width="150"> </el-table-column>
      <el-table-column fixed prop="totalNum" label="可发放总数" width="90"> </el-table-column>
      <el-table-column fixed prop="limitNum" label="每人限制领取" width="110"> </el-table-column>
      <el-table-column label="状态" width="50">
        <template slot-scope="props">
          {{
            props.row.status === 1 ? '上架' : props.row.status === 2 ? '下架' : props.row.status === 3 ? '草稿' : '过期'
          }}
        </template>
      </el-table-column>
      <el-table-column label="面额" width="100">
        <template slot-scope="props">
          {{ Util.getPriceString(props.row.formValue) }}
        </template>
      </el-table-column>
      <el-table-column label="使用门槛" width="80">
        <template slot-scope="props">
          {{ props.row.threshold === 1 ? '不限制' : '满额使用' }}
        </template>
      </el-table-column>
      <el-table-column label="门槛额度" width="80">
        <template slot-scope="props">
          {{ props.row.threshold === 1 ? '无门槛' : props.row.thresholdValue }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="startTime" label="优惠券开始时间" width="150"> </el-table-column>
      <el-table-column sortable prop="endTime" label="优惠券结束时间" width="150"> </el-table-column>
      <el-table-column prop="url" label="优惠券活动页面链接"> </el-table-column>
      <!-- <el-table-column sortable prop="createTime" label="创建时间" width="150"> </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="props">
          <el-button
            v-permission="['admin:coupon:view', 'admin:coupon:edit']"
            type="primary"
            plain
            @click="handleEdit(props.row.id)"
            size="mini"
            >查看</el-button
          >
          <el-button
            v-permission="'admin:coupon:edit'"
            v-if="props.row.status === 2"
            type="success"
            plain
            @click="handleOn(props.row.id)"
            size="mini"
            >上架</el-button
          >
          <el-button
            v-permission="'admin:coupon:edit'"
            v-if="props.row.status === 1"
            type="info"
            plain
            @click="handleOff(props.row.id)"
            size="mini"
            >下架</el-button
          >
          <el-button
            v-permission="'admin:coupon:del'"
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
  </div>
</template>

<script>
import Coupon from '@/model/coupon'
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
    async getGoodsList() {
      const { pageNumber, pageSize } = this
      try {
        this.loading = true
        const res = await Coupon.list({ pageSize, pageNumber }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        if (res.data.rows.length) {
          res.data.rows.forEach(item => {
            // item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
            item.startTime = new Date(item.startTime).toLocaleString('chinese', { hour12: false })
            item.endTime = new Date(item.endTime).toLocaleString('chinese', { hour12: false })
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
    handleEdit(id) {
      this.$router.push({
        path: '/coupon/add',
        query: { id },
      })
    },
    // 上架
    async handleOn(id) {
      try {
        this.loading = true
        const res = await Coupon.on(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getGoodsList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 下架
    async handleOff(id) {
      try {
        this.loading = true
        const res = await Coupon.off(id)
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
          const res = await Coupon.delete(id)
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
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getGoodsList()
    },
  },
  created() {
    this.getGoodsList()
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
    text-indent: 40px;
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
