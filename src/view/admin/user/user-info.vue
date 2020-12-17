<template>
  <div class="container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      :label-position="labelPosition"
      ref="form"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="用户名" prop="userName">
        <el-input size="medium" clearable v-model="form.userName" :disabled="isEdited"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input size="medium" clearable v-model="form.email" :disabled="isEdited"></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="密码" prop="password">
        <el-input size="medium" clearable type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="确认密码" prop="confirm_password" label-position="top">
        <el-input size="medium" clearable type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="选择角色"
        prop="roleId"
        :rules="{
          required: true,
          message: '角色不能为空',
          trigger: 'blur',
        }"
      >
        <el-radio-group v-model="form.roleId" size="small" style="transform: translateY(5px)">
          <el-radio v-for="item in groups" :key="item.id" :label="item.id" border style="margin-left: 0">{{
            item.roleName
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="submit" class="submit">
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('form')"
          v-permission="{ permission: 'admin:user:add', type: 'disabled' }"
          >保 存</el-button
        >
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Admin from '@/model/admin'
// import User from '@/model/user'

export default {
  props: {
    submit: {
      type: Boolean, // 表单是否显示功能按钮
      default: true,
    },
    id: {
      // 用户id
      type: Number,
      default: undefined,
    },
    groups: {
      // 所有角色
      type: Array,
      default: () => {},
    },
    labelPosition: {
      // 表单label位置
      type: String,
      default: 'right',
    },
    info: {
      // 用户信息
      type: Object,
      default: () => {},
    },
    pageType: {
      type: String,
      default: 'add', // 区分编辑页面/添加页面
    },
  },
  inject: ['eventBus'],
  data() {
    // 验证回调函数
    const checkUserName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        callback(new Error('用户名不能为空'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false, // 加载动画
      isEdited: false, // 能否编辑
      form: {
        userName: '',
        password: '',
        confirm_password: '',
        email: '',
        roleId: '',
        // isEnabled: 0,
        // isLocked: 0,
      },
      // 验证规则
      rules: {
        userName: [
          {
            validator: checkUserName,
            trigger: ['blur', 'change'],
            required: true,
          },
        ],
        password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址或者不填',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  methods: {
    // 提交表单
    async submitForm(formName) {
      console.log('a')
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          console.log('b')
          // 新增用户
          let res
          // if (this.form.isEnabled) {
          //   this.form.isEnabled = 1
          // } else {
          //   this.form.isEnabled = 0
          // }
          // if (this.form.isLocked) {
          //   this.form.isLocked = 1
          // } else {
          //   this.form.isLocked = 0
          // }
          if (this.pageType === 'add') {
            console.log('c')
            try {
              // console.log(this.form.roleId)
              if (!this.form.roleId) {
                this.$message.error('请选择一个角色')
                return
              }
              this.loading = true
              res = await Admin.saveUser(this.form)

              // if (res.code < window.MAX_SUCCESS_CODE) {
              this.loading = false
              this.$message.success(`${res.msg}`)
              this.$emit('handleInfoResult', true)
              this.resetForm(formName)
              // }
            } catch (e) {
              console.log(e)
              this.loading = false
              // if (e.data.code === 10073) {
              //   this.$message.error(e.data.message)
              // } else {
              //   this.$message.error('新增用户失败')
              // }
              // console.log(e)
            }
          } else {
            console.log('d')
            // 更新用户信息
            if (
              this.form.userName === this.info.userName &&
              this.form.email === this.info.email &&
              this.form.roleId === this.info.roleId
            ) {
              console.log('e')
              this.$emit('handleInfoResult', false)
              return
            }
            try {
              if (!this.form.roleId) {
                this.$message.error('请选择一个角色')
                return
              }
              this.loading = true
              this.form.id = this.id
              this.form.type = 1
              res = await Admin.updateUser(this.form)
              this.loading = false
              this.$message.success(`${res.msg}`)
              this.$emit('handleInfoResult', true)
            } catch (e) {
              this.loading = false
              console.log(e)
            }
            // if (res.code < window.MAX_SUCCESS_CODE) {
            //   this.loading = false
            //   this.$message.success(`${res.message}`)
            //   this.$emit('handleInfoResult', true)
            // } else {
            //   this.loading = false
            //   this.$message.error(`${res.message}`)
            // }
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      if (this.pageType === 'edit') {
        this.setInfo()
      } else {
        // this.form.roleId = ''
        this.$refs[formName].resetFields()
      }
    },
    setInfo() {
      this.form.userName = this.info.userName
      this.form.email = this.info.email
      // if (this.info.isEnabled) {
      //   this.form.isEnabled = true
      // }
      // if (this.info.isLocked) {
      //   this.form.isLocked = true
      // }
      // const temp = []
      // this.info.roleId.forEach(item => {
      //   temp.push(item.id)
      // })
      this.form.roleId = this.info.roleId
    },
  },
  created() {
    // console.log(this.groups)
    // console.log(this.form)
    // console.log(this.info)
    // 通过是否接收到数据来判断当前页面是添加数据还是编辑数据
    if (this.pageType === 'edit') {
      this.setInfo()
      // this.isEdited = true
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  max-width: 800px;

  .submit {
    float: left;
  }
}
</style>

<style lang="scss">
// .el-radio-group {
//   &.user-info {
//     display: flex;
//     flex-wrap: wrap;
//     > .el-radio {
//       width: 150px;
//       margin-left: 0px !important;
//       margin-right: 10px;
//       margin-bottom: 20px;
//       white-space: normal;
//       display: flex;
//     }
//   }
// }
</style>
