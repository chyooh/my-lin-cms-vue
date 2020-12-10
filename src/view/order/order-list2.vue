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
        <el-form-item label="订单号" prop="filter_orderId">
          <el-input size="mini" clearable v-model="filterForm.filter_orderId"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="手机号" prop="filter_tel">
          <el-input size="mini" clearable v-model="filterForm.filter_tel"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="姓名" prop="filter_nickname">
          <el-input size="mini" clearable v-model="filterForm.filter_nickname" placeholder="请输入用户全名"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="种类" prop="filter_roleId">
          <el-select size="mini" v-model="filterForm.filter_roleId" placeholder="请选择角色">
            <el-option v-for="(group, index) in groupsWithEmpty" :key="index" :label="group.roleName" :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="状态" prop="filter_isLocked">
          <el-select size="mini" v-model="filterForm.filter_isLocked" placeholder="请选择">
            <el-option v-for="(group, index) in isLockedSelects" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="产品名称" prop="filter_name">
          <el-input size="mini" clearable v-model="filterForm.filter_name" placeholder="请输入产品名称"></el-input>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="时间">
          <el-date-picker
            size="mini"
            v-model="filterForm.filter_createDates"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期..."
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now()
              },
            }"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabs" :key="item.name" :name="item.name">
        <span slot="label" class="tabs-label">{{ item.title + '（' + item.amount + '）' }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="table-container">
      <div class="table-title">
        <el-row>
          <el-col :span="6">商品信息</el-col>
          <el-col :span="2">租金</el-col>
          <el-col :span="2">押金</el-col>
          <el-col :span="2">其他</el-col>
          <el-col :span="3">租期</el-col>
          <el-col :span="3">实付款</el-col>
          <el-col :span="3">交易状态</el-col>
          <el-col :span="3">用户地址</el-col>
        </el-row>
      </div>
      <template v-if="tableData.length > 0">
        <div class="goods-item" v-for="(goods, index) in tableData" :key="index">
          <el-row class="goods-title">
            <div class="margin-right10">{{ goods.date }}</div>
            <div>订单号：{{ goods.orderId }}</div>
          </el-row>
          <el-row class="content">
            <el-col :span="6">
              <div class="shangpin">
                <img :src="goods.goodsImg" alt="" />
                <div class="right-shangpin">
                  <div class="name">{{ goods.goodsName }}</div>
                  <div>套餐:{{ goods.taocan }}</div>
                  <div>
                    <l-icon name="shen" color="#ff9900" width="12" height="12"></l-icon>
                    <l-icon name="qi" color="orange" width="12" height="12"></l-icon>
                  </div>
                  <div>
                    <el-button size="mini" type="primary" @click="modifyPrice(goods.id)">修改价格</el-button>
                    <el-button size="mini" @click="addOrder(goods.id)">补订单</el-button>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <div>{{ Util.getPriceString(goods.zujin) }}</div>
              <div>{{ Util.getPriceString(goods.zujin2) }}({{ goods.qishu }}期)</div>
            </el-col>
            <el-col :span="2">
              <div>{{ Util.getPriceString(goods.yajin1 - goods.jianyajin) }}</div>
              <div>原{{ Util.getPriceString(goods.yajin1) }}</div>
              <div>减{{ Util.getPriceString(goods.jianyajin) }}</div>
              <div>商品押金{{ Util.getPriceString(goods.yajin2) }}</div>
            </el-col>
            <el-col :span="2">
              <div>数量<l-icon name="close" width="12" height="12"></l-icon>{{ goods.shuliang }}</div>
              <div>运费：{{ Util.getPriceString(goods.yunfei) }}</div>
              <div>保险：{{ Util.getPriceString(goods.baoxian) }}</div>
            </el-col>
            <el-col :span="3">租期</el-col>
            <el-col :span="3">实付款</el-col>
            <el-col :span="3">交易状态</el-col>
            <el-col :span="3">用户地址</el-col>
          </el-row>
          <el-row class="content">
            <el-col>
              <div class="margin-bottom10">
                认证资料：周（33333****99999），人脸识别通过 性别：男性 年龄：28 <span>会员等级：VIP0</span>
              </div>
              <div>
                <el-button type="primary" size="mini">复制地址</el-button>
                <el-button type="warning" size="mini">未设置地址</el-button>
                <el-button type="success" size="mini">区块链</el-button>
                <el-button type="primary" size="mini">交易快照</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col>
              风控信息：【风控建议】风控通过，需核实用户家庭/公司地址，详细到门牌号。走区块链流程（即收集并录入凭证：身份证图片、纸质签收回单须有本人签名、沟通记录等，如有原件，注意保存原件。）。核实收货人与下单人关系，收取两方身份证复印件。
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col> <l-icon name="edit"></l-icon>用户留言：无 </el-col>
          </el-row>
          <el-row class="content"><span class="beizhu">无备注</span></el-row>
        </div>
      </template>
      <div v-else class="empty">暂无订单</div>
      <el-row></el-row>
    </div>
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
  </div>
</template>

<script>
import Admin from '@/model/admin'
import { orderList, tabs } from './data'
import Util from '@/util/util'
// import LinTable from '@/component/base/table/lin-table'

export default {
  components: {},
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
      Util,
      activeName: '1',
      tabs,
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
      this.form.isEnabled = row.isEnabled
      this.form.isLocked = row.isLocked
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
      console.log(this.currentPage)
      const loading = this.$loading({ target: '.table-container' })
      await this.getAdminUsers()
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
      // const loading = this.$loading({ target: '.table-container' })
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

    modifyPrice(id) {
      console.log(id)
    },
    addOrder(id) {
      console.log(id)
    },
    handleTabClick() {
      console.log(this.activeName)
    },
  },
  async created() {
    // await this.getAdminUsers()
    // await Admin.getAllMenuList()
    // await this.getAllGroups()
    this.tableData = orderList
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
  background-color: #ffffff;

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
.tabs-label {
}
.table-container {
  font-size: 12px;
  .el-col {
    text-align: center;
  }
  .el-col:first-child {
    text-align: left;
  }
  .table-title {
    padding: 10px 0;
  }
  .goods-title {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f1f1f1;
  }
  .goods-item {
    border: solid 1px #cccccc;
    border-bottom: 0;
    margin-bottom: 20px;
  }
  .content {
    padding: 10px 0;
    border-bottom: solid 1px #cccccc;
    .el-col {
      padding: 0 10px;
    }
    .beizhu {
      border-bottom: dashed 1px #cccccc;
    }
  }
  .shangpin {
    display: flex;
    align-items: flex-start;
    img {
      width: 30%;
    }
    .name {
      color: $theme;
    }
  }
}
</style>
