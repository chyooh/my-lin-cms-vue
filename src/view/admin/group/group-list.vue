<template>
  <div class="container">
    <div class="title">角色列表信息</div>

    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="ID" sortable width="100"> </el-table-column>
      <el-table-column fixed prop="roleName" label="名称" width="100"> </el-table-column>
      <el-table-column prop="descriptions" label="描述"> </el-table-column>
      <el-table-column sortable prop="createDate" label="创建时间" width="150">
        <template slot-scope="props">
          <div>
            {{ props.row.createDate.split('T')[0] + ' ' + props.row.createDate.split('T')[1].split('.')[0] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="updateDate" label="更新时间" width="150">
        <template slot-scope="props">
          <div>
            {{
              props.row.updateDate
                ? props.row.updateDate.split('T')[0] + ' ' + props.row.updateDate.split('T')[1].split('.')[0]
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="80"> </el-table-column>
      <el-table-column prop="updator" label="更新人" width="80"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="235">
        <template slot-scope="props">
          <el-button type="primary" plain @click="handleEdit(props.row)" size="mini">编辑</el-button>
          <el-button type="info" plain @click="goToGroupEditPage(props.row)" size="mini">分配权限</el-button>
          <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="角色信息"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      class="groupListInfoDialog"
    >
      <div style="margin-top: -25px">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="form"
          label-position="labelPosition"
          :rules="rules"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input size="medium" clearable v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="descriptions">
            <el-input size="medium" clearable v-model="form.descriptions"></el-input>
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
import Admin from '@/model/admin'
// import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    // LinTable,
  },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 是否弹窗
      labelPosition: 'right', // 设置label位置
      form: {
        // 表单信息
        roleName: '',
        descriptions: '',
      },
      cacheForm: {
        // 缓存第一次的表单信息
        roleName: '',
        descriptions: '',
      },
      loading: false,
      activeTab: '修改信息', // tab 标题
      rules: {
        // 表单验证规则
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        descriptions: [],
      },
    }
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getRoleList() {
      try {
        this.loading = true
        const res = await Admin.getRoleList()
        this.tableData = res.data.rows
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async confirmEdit() {
      // 修改角色信息
      if (this.form.roleName === '') {
        this.$message.warning('请将信息填写完整')
        return
      }
      if (this.cacheForm.roleName !== this.form.roleName || this.cacheForm.descriptions !== this.form.descriptions) {
        // eslint-disable-line
        this.form.id = this.id
        const res = await Admin.updateRole(this.form)
        this.$message.success(`${res.msg}`)
        this.getRoleList()
      }
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      this.id = val.id
      this.form.roleName = val.roleName
      this.form.descriptions = val.descriptions
      this.cacheForm = { ...this.form }
      this.dialogFormVisible = true
    },
    goToGroupEditPage(val) {
      this.id = val.id
      this.$router.push({ path: '/admin/group/edit', query: { id: val.id } })
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteRole(val.id)
          await this.getRoleList()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        // if (res.code < window.MAX_SUCCESS_CODE) {
        //   await this.getRoleList()
        //   this.$message({
        //     type: 'success',
        //     message: `${res.message}`,
        //   })
        // } else {
        //   this.loading = false
        //   this.$message({
        //     type: 'error',
        //     message: `${res.message}`,
        //   })
        // }
      })
    },
    // 双击 table row
    // rowClick(row) {
    //   this.handleEdit(row)
    // },
    // 弹框 右上角 X
    handleClose(done) {
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听分添加组是否成功
    async addGroup(flag) {
      if (flag === true) {
        await this.getRoleList()
      }
    },
  },
  async created() {
    await this.getRoleList()
    this.tableColumn = [{ prop: 'roleName', label: '名称' }, { prop: 'descriptions', label: '信息' }] // 设置表头信息
    this.operate = [
      { name: '信息', func: 'handleEdit', type: 'primary' },
      { name: '权限', func: 'goToGroupEditPage', type: 'info' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 监听添加角色是否成功
    this.eventBus.$on('addGroup', this.addGroup)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addGroup)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
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
