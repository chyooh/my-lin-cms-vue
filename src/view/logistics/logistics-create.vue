<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="space-between">
      <el-col :lg="10" :md="16" :sm="20" :xs="20">
        <div class="flex-container">
          <div class="header">{{ title }}</div>
          <span v-if="type === 'edit'" class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
        </div>
        <el-form
          status-icon
          :rules="rules"
          :model="form"
          ref="form"
          label-position="right"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="名称" prop="name">
            <el-input size="medium" clearable v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input size="medium" clearable v-model="form.number"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-switch v-model="form.status" :active-value="2" :inactive-value="1"> </el-switch>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" :loading="loading" @click="submitForm('form')">保 存</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Logistics from '@/model/logistics'

export default {
  components: {},
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('物流名称不能为空'))
      }
      callback()
    }
    const checkOrder = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('编号不能为空'))
      }
      callback()
    }
    return {
      type: 'add',
      title: '新建物流公司',

      loading: false,
      form: {
        id: null,
        name: '',
        number: '',
        status: 2,
      },
      rules: {
        name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        number: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
    }
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            let res
            if (this.type === 'add') {
              res = await Logistics.save(this.form)
            } else {
              res = await Logistics.update(this.form)
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/logistics/list')
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
    back() {
      this.$router.go(-1)
    },
  },
  async created() {
    if (this.$route.query.val) {
      const val = JSON.parse(this.$route.query.val)
      this.type = 'edit'
      this.title = '编辑物流公司'
      this.form.id = val.id
      this.form.name = val.name
      this.form.number = val.number
      this.form.status = val.status
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .header {
    display: flex;
    align-items: center;
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    div {
      margin-right: 30px;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
