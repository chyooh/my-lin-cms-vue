<template>
  <div class="container">
    <div class="header">
      <el-button type="primary" plain @click="create" size="medium">创建时间范围</el-button>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>

      <el-table-column fixed prop="fromHour" label="开始时间" width="100"> </el-table-column>
      <el-table-column fixed prop="toHour" label="结束时间" width="100"> </el-table-column>

      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="props">
          <el-button type="primary" plain @click="handleEdit(props.row)" size="mini">编辑</el-button>
          <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogFormVisible" class="groupListInfoDialog">
      <div style="margin-top: -25px">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="form"
          label-position="right"
          :rules="rules"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="开始时间" prop="from">
            <el-time-select
              size="medium"
              v-model="form.from"
              :picker-options="{
                start: '06:00',
                step: '00:15',
                end: '21:00',
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item label="结束时间" prop="to">
            <el-time-select
              size="medium"
              v-model="form.to"
              :picker-options="{
                start: '06:00',
                step: '00:15',
                end: '21:00',
                minTime: form.from,
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left: 5px">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Time from '@/model/pickup-time'

export default {
  data() {
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      dialogFormVisible: false, // 是否弹窗
      baseForm: {
        // 表单信息
        from: null,
        to: null,
      },
      form: {
        // 表单信息
        from: null,
        to: null,
      },
      cacheForm: {
        // 缓存第一次的表单信息
        from: null,
        to: null,
      },
      loading: false,
      rules: {
        // 表单验证规则
        from: [{ required: true, message: '请选择开始时间', trigger: ['blur', 'change'] }],
        to: [{ required: true, message: '请选择结束时间', trigger: ['blur', 'change'] }],
      },
      type: 'add',
      parentId: 0,
    }
  },
  computed: {
    title() {
      let title
      if (this.type === 'add') {
        title = '新建时间范围'
      } else {
        title = '编辑时间范围'
      }
      return title
    },
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getHourList() {
      try {
        this.loading = true
        const res = await Time.findByDayId(this.parentId)
        if (res.data.length) {
          res.data.forEach(item => {
            item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
          })
          this.tableData = res.data
        } else {
          this.tableData = []
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async confirmEdit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.cacheForm.from !== this.form.from || this.cacheForm.to !== this.from.to) {
            // eslint-disable-line
            try {
              let res
              const { from, to } = this.form
              if (this.type === 'add') {
                res = await Time.saveHour(from, to, this.parentId)
              } else {
                res = await Time.updateHour(this.id, from, to, this.parentId)
              }
              this.$message.success(`${res.msg}`)
              this.dialogFormVisible = false
              this.getHourList()
            } catch (e) {
              console.log(e)
            }
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      this.id = val.id
      this.form.from = val.fromHour
      this.form.to = val.toHour
      this.cacheForm = { ...this.form }
      this.type = 'edit'
      this.dialogFormVisible = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该时间范围, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Time.deleteHour(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getHourList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    create() {
      this.form = { ...this.baseForm }
      this.cacheForm = { ...this.baseForm }
      this.type = 'add'
      this.dialogFormVisible = true
    },

    back() {
      this.$router.go(-1)
    },
  },
  async created() {
    this.parentId = this.$route.query.parentId
    await this.getHourList()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    margin-right: 30px;

    .back {
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
.groupListInfoDialog /deep/ .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}
.groupListInfoDialog /deep/ .el-dialog__header {
  padding-left: 30px;
}

.groupListInfoDialog /deep/ .el-dialog__body {
  padding: 30px;
}
</style>
