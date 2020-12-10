<template>
  <div class="container form-container">
    <!-- <div class="header">
      <div class="title">用户列表</div>
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
        <el-form-item label="用户名" prop="filter_usernamelike">
          <el-input
            size="mini"
            clearable
            v-model="filterForm.filter_usernamelike"
            placeholder="请输入用户名称相关字"
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="昵称" prop="filter_nickname">
          <el-input size="mini" clearable v-model="filterForm.filter_nickname" placeholder="请输入用户昵称"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="角色" prop="filter_roleId">
          <el-select size="mini" v-model="filterForm.filter_roleId" placeholder="请选择角色">
            <el-option v-for="(group, index) in groupsWithEmpty" :key="index" :label="group.roleName" :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="是否启用" prop="filter_isEnabled">
          <el-select size="mini" v-model="filterForm.filter_isEnabled" placeholder="请选择">
            <el-option
              v-for="(group, index) in isEnabledSelects"
              :key="index"
              :label="group.label"
              :value="group.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="是否锁定" prop="filter_isLocked">
          <el-select size="mini" v-model="filterForm.filter_isLocked" placeholder="请选择">
            <el-option v-for="(group, index) in isLockedSelects" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="创建时间">
          <el-form-item prop="filter_createDates">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createDates"
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
          <el-form-item prop="filter_createDatee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createDatee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() > Date.now() ||
                    time.getTime() < new Date(filterForm.filter_createDates + ' 00:00:00')
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
        <el-form-item label="更新时间">
          <el-form-item prop="filter_updateDates">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_updateDates"
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
          <el-form-item prop="filter_updateDatee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_updateDatee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() > Date.now() ||
                    time.getTime() < new Date(filterForm.filter_updateDates + ' 00:00:00')
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
      <!-- <el-table-column fixed type="index"></el-table-column> -->
      <!-- <el-table-column fixed type="expand" class-name="user-list-expand">
        <template slot-scope="props">
          <el-button type="primary" plain @click="handleEdit(props.$index, props.row)" size="mini">编辑</el-button>
          <el-button
            v-if="props.row.isEnabled"
            type="info"
            plain
            @click="handleForbidden(props.$index, props.row)"
            size="mini"
            >禁用</el-button
          >
          <el-button v-else type="success" plain @click="handleBoot(props.$index, props.row)" size="mini"
            >启用</el-button
          >
          <el-button
            v-if="props.row.isLocked"
            type="primary"
            plain
            @click="handleUnlock(props.$index, props.row)"
            size="mini"
            >解锁</el-button
          > -->
      <!-- <el-button type="danger" @click="handleDelete(props.$index, props.row)" size="mini">删除</el-button> -->
      <!-- </template>
      </el-table-column> -->
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
      <el-table-column fixed prop="userName" label="用户名称" width="100"> </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100"> </el-table-column>
      <el-table-column prop="roleName" label="角色" width="150"> </el-table-column>

      <el-table-column prop="isEnabled" label="是否启用" width="80">
        <template slot-scope="props">
          <div>
            {{ props.row.isEnabled ? '已启用' : '未启用' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isLocked" label="是否锁定" width="80">
        <template slot-scope="props">
          <div>
            {{ props.row.isLocked ? '已锁定' : '未锁定' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="createDate" label="创建时间" width="150">
        <template slot-scope="props">
          <div>
            {{ props.row.createDate.split('T')[0] + ' ' + props.row.createDate.split('T')[1].split('.')[0] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮件" :show-overflow-tooltip="false"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="310">
        <template slot-scope="props">
          <el-popover placement="bottom" width="200" trigger="hover">
            <el-select
              size="mini"
              :value="props.row.roleId"
              @change="modifyRole($event, props.row)"
              placeholder="请选择角色"
            >
              <el-option v-for="(group, index) in groups" :key="index" :label="group.roleName" :value="group.id">
              </el-option>
            </el-select>
            <el-button slot="reference" type="primary" plain size="mini" :loading="props.row.isModify"
              >编辑角色</el-button
            >
          </el-popover>
          <el-button
            v-if="props.row.isEnabled"
            type="info"
            plain
            @click="handleForbidden(props.$index, props.row)"
            size="mini"
            >禁用</el-button
          >
          <el-button v-else type="success" plain @click="handleBoot(props.$index, props.row)" size="mini"
            >启用</el-button
          >
          <el-button type="danger" plain @click="resetPassword(props.$index, props.row)" size="mini"
            >还原密码</el-button
          >

          <el-button
            v-if="props.row.isLocked"
            type="primary"
            plain
            @click="handleUnlock(props.$index, props.row)"
            size="mini"
            >解锁</el-button
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
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" :visible.sync="dialogFormVisible">
      <div style="margin-top: -25px">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              ref="userInfo"
              v-if="dialogFormVisible"
              @handleInfoResult="handleInfoResult"
              labelPosition="right"
              pageType="edit"
              :id="id"
              :groups="groups"
              :info="form"
              :submit="false"
              class="info"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password @handlePasswordResult="handlePasswordResult" ref="password" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 按键操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/model/admin'
// import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'

export default {
  components: { UserInfo, UserPassword },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 用户id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      // editIndex: null, // 编辑的行
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableData: [], // 表格数据
      // tableColumn: [], // 表头数据
      // operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      // selectGroup: '', // 选中的分组Id
      groups: [], // 所有分组
      groupsWithEmpty: [], // 下拉筛选角色
      isEnabledSelects: [{ label: '不限', value: null }, { label: '启用', value: 1 }, { label: '禁用', value: 0 }],
      isLockedSelects: [{ label: '不限', value: null }, { label: '锁定', value: 1 }, { label: '未锁定', value: 0 }],
      // group_id: undefined,
      activeTab: '修改信息',
      form: {
        // 表单信息
        userName: '',
        password: '',
        confirm_password: '',
        email: '',
        roleId: '',
      },
      loading: false,
      filterForm: {
        filter_usernamelike: null,
        filter_nickname: null,
        filter_roleId: null,
        filter_isEnabled: null,
        filter_isLocked: null,
        filter_createDates: null,
        filter_createDatee: null, // 日期搜索区间,包括创建时间,更新时间
        filter_updateDates: null,
        filter_updateDatee: null, // 日期搜索区间,包括创建时间,更新时间
        // sortName: null, // 更新时间,创建时间,用户id
        // sortOrder: null, // desc,asc
      },
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getAdminUsers() {
      const { currentPage } = this
      try {
        const obj = JSON.parse(JSON.stringify(this.filterForm))
        if (obj.filter_isEnabled === true) {
          obj.filter_isEnabled = 1
        } else if (obj.filter_isEnabled === false) {
          obj.filter_isEnabled = 0
        }
        if (obj.filter_isLocked === true) {
          obj.filter_isLocked = 1
        } else if (obj.filter_isLocked === false) {
          obj.filter_isLocked = 0
        }
        this.loading = true
        const data = Object.assign(obj, { pageSize: this.pageCount, pageNumber: currentPage })
        const res = await Admin.getUserList(data) // eslint-disable-line
        // console.log(res)
        this.loading = false
        this.tableData = this.shuffleList(res.data.rows)
        this.total_nums = res.data.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所有分组
    async getAllGroups() {
      try {
        this.loading = true
        const res = await Admin.getRoleList()
        this.groups = res.data.rows
        this.groupsWithEmpty = [{ roleName: '不限', id: null }].concat(this.groups)
        // this.groups.forEach(item => {
        //   item.text = item.roleName
        //   item.value = item.roleName
        // })
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(index, row) {
      this.id = row.id
      this.form.userName = row.userName
      this.form.email = row.email
      this.form.roleId = row.roleId
      this.dialogFormVisible = true
    },
    // 下拉框选择分组
    // async handleChange() {
    //   this.currentPage = 1
    //   this.loading = true
    //   await this.getAdminUsers()
    //   this.loading = false
    // },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getAdminUsers('changePage')
      this.loading = false
    },
    // handleDelete(index, row) {
    //   // let res
    //   this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(async () => {
    //     try {
    //       this.loading = true
    //       await Admin.deleteUser({ ids: row.id })
    //       this.loading = false
    //       if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
    //         // 判断删除的是不是每一页的最后一条数据
    //         this.currentPage--
    //       }
    //       await this.getAdminUsers()
    //     } catch (e) {
    //       this.loading = false
    //       console.log(e)
    //     }
    //   })
    // },
    async handleBoot(index, row) {
      try {
        this.loading = true
        const res = await Admin.boot(row.id)
        row.isEnabled = 1
        this.$message.success(`${res.msg}`)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleForbidden(index, row) {
      try {
        this.loading = true
        const res = await Admin.forbidden(row.id)
        row.isEnabled = 0
        this.$message.success(`${res.msg}`)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async handleUnlock(index, row) {
      try {
        this.loading = true
        const res = await Admin.unlock(row.id)
        row.isLocked = 0
        this.$message.success(`${res.msg}`)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async resetPassword(index, row) {
      this.$confirm('此操作将还原该用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Admin.resetPassword(row.id)
          this.$message.success(`${res.msg}`)
          this.loading = false
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    // 提交表单信息
    confirmEdit() {
      console.log(this.$refs)
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.submitForm('form')
        console.log(this.$refs.userInfo)
      } else {
        this.$refs.password.submitForm('form')
        console.log(this.$refs.password)
      }
    },
    // 重置
    resetForm() {
      console.log(this.$refs)
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.resetForm('form')
        console.log(this.$refs.userInfo)
      } else {
        this.$refs.password.resetForm('form')
        console.log(this.$refs.password)
      }
    },
    // 双击 table ro
    // rowClick(row) {
    //   this.handleEdit(row)
    // },
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听子组件更新用户信息是否成功
    async handleInfoResult(flag) {
      console.log('f')
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
    // 监听子组件更新密码是否成功
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    // 监听添加用户是否成功
    async addUser(flag) {
      if (flag === true) {
        if (this.total_nums % this.pageCount === 0) {
          // 判断当前页的数据是不是满了，需要增加新的页码
          this.currentPage++
        }
        await this.getAdminUsers()
        this.refreshPagination = false // 刷新pagination组件
        this.$nextTick(() => {
          this.refreshPagination = true
        })
      }
    },
    shuffleList(users) {
      const list = []
      users.forEach(element => {
        // const groups = []
        // element.groups.forEach(item => {
        //   groups.push(item.name)
        // })
        element.roleName = element.role ? element.role.roleName : '暂无'
        list.push(element)
      })
      return list
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.currentPage = 1
          await this.getAdminUsers()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.$refs[formName].resetFields()
      console.log(this.filterForm)
    },
    // 筛选控制器
    // filterHandler(value, row, column) {
    //   console.log(value, row, column)
    //   const property = column['property']
    //   return row[property] === value
    // },
    async modifyRole(val, row) {
      console.log(val, row)
      if (val !== row.roleId) {
        try {
          row.isModify = true
          const res = await Admin.updateUserRole({ roleId: val, userId: row.id })
          this.groups.forEach(item => {
            if (item.id === val) {
              row.roleName = item.roleName
            }
          })
          row.roleId = val
          this.$message.success(`${res.msg}`)

          row.isModify = false
        } catch (e) {
          row.isModify = false
          console.log(e)
        }
      }
    },
  },
  async created() {
    await this.getAdminUsers()
    // await Admin.getAllMenuList()
    await this.getAllGroups()
    // this.tableColumn = [
    //   { prop: 'userName', label: '用户名称' },
    //   { prop: 'nickname', label: '昵称' },
    //   { prop: 'groupNames', label: '所属角色' },
    // ] // 设置表头信息
    // this.operate = [
    //   { name: '编辑', func: 'handleEdit', type: 'primary' },
    //   { name: '启用', func: 'handleBoot', type: 'success' },
    //   { name: '禁用', func: 'handleForbidden', type: 'info' },
    //   { name: '解锁', func: 'handleUnlock', type: 'primary' },
    //   { name: '删除', func: 'handleDelete', type: 'danger' },
    // ]
    this.eventBus.$on('addUser', this.addUser)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addUser)
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
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
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
