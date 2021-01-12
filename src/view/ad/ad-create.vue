<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="space-between">
      <el-col :lg="10" :md="16" :sm="20" :xs="20">
        <div class="flex-container">
          <div class="header">
            <span v-permission="['admin:ad:edit', 'admin:ad:add']">{{ title }}</span>
          </div>
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
          <el-form-item label="标题" prop="title">
            <el-input size="medium" clearable v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="广告分类" prop="categoryId">
            <el-select size="medium" v-model="form.categoryId" placeholder="请选择">
              <el-option v-for="(group, index) in categoryId" :key="index" :label="group.name" :value="group.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="广告跳转类型" prop="type">
            <el-select size="medium" v-model="form.type" placeholder="请选择">
              <el-option v-for="(group, index) in typeList" :key="index" :label="group.name" :value="group.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小程序appId" prop="appId" v-if="form.type === 3">
            <el-input size="medium" clearable v-model="form.appId"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" prop="url">
            <el-input
              size="medium"
              clearable
              v-model="form.url"
              placeholder="小程序内跳转链接 例：'/pages/index/index'"
            ></el-input>
          </el-form-item>
          <el-form-item prop="imageUrl" label="图片">
            <upload-imgs
              ref="uploadImgs"
              :value="form.initImg"
              :rules="rules1"
              :max-num="1"
              :remote-fuc="remoteFuc"
              @onChange="handleChange('uploadImgs')"
              @upload="handleUpload"
              :width="100"
              :height="100"
            />
          </el-form-item>
          <el-form-item label="广告内容" prop="content">
            <el-input size="medium" type="textarea" clearable v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="2"
              active-text="上线"
              inactive-text="下线"
            >
            </el-switch>
          </el-form-item>
          <el-form-item class="submit" v-permission="['admin:ad:edit', 'admin:ad:add']">
            <el-button type="primary" :loading="loading" @click="submitForm('form')">保 存</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Ad from '@/model/ad'
import UploadImgs from '@/component/base/upload-image'
import User from '@/model/user'

/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
}
export default {
  components: {
    UploadImgs,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('标题不能为空'))
      }
      callback()
    }
    const checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('链接不能为空'))
      }
      callback()
    }
    const checkImg = (rule, value, callback) => {
      if (!this.form.imageUrl) {
        return callback(new Error('图片不能为空'))
      }
      callback()
    }
    const checkCategory = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('分类不能为空'))
      }
      callback()
    }
    return {
      type: 'add',
      title: '新建广告',
      loading: false,
      form: {
        id: null,
        title: '',
        url: '',
        content: '',
        categoryId: null,
        status: 1,
        imageUrl: '',
        type: 1, // 1.小程序内跳转 2.H5页面跳转 3.跳转到小程序
        appId: '',
      },
      rules: {
        title: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        url: [{ validator: checkUrl, trigger: ['blur', 'change'], required: true }],
        imageUrl: [{ validator: checkImg, trigger: ['blur', 'change'], required: true }],
        categoryId: [{ validator: checkCategory, trigger: ['blur', 'change'], required: true }],
        type: [{ trigger: ['blur', 'change'], required: true }],
      },
      rules1: {},
      categoryId: [],
      typeList: [
        { name: '小程序内跳转', id: 1 },
        { name: 'H5页面跳转', id: 2 },
        { name: '跳转到小程序', id: 3 },
      ],
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
            const { id, url, title, content, imageUrl, status, categoryId, type, appId } = this.form
            if (type === 3 && !appId) {
              this.$message.error('请填写小程序appId')
              return
            }
            this.loading = true
            let res
            if (this.type === 'add') {
              res = await Ad.adSave({ url, title, content, imageUrl, status, categoryId, type, appId })
            } else {
              res = await Ad.adUpdate({ id, url, title, content, imageUrl, status, categoryId, type, appId })
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/ad/list')
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
    // 获取所有分类
    async getAllCategory() {
      try {
        const res = await Ad.list()
        res.data.rows.forEach(item => {
          const { name, id } = item
          this.categoryId.push({ name, id })
        })
      } catch (e) {
        console.log(e)
      }
    },
    back() {
      this.$router.go(-1)
    },

    // 图片上传
    async remoteFuc(img) {
      try {
        const res = await User.upload(img.file)
        const data = { url: img.display, path: JSON.parse(res.data).base, id: img.id }
        return data
      } catch (e) {
        console.log(e)
      }
    },
    async handleChange(name) {
      await this.$refs[name].getValue()
    },
    handleUpload(result) {
      if (result.length) {
        this.form.imageUrl = result[0].src
      } else {
        this.form.imageUrl = ''
      }
    },
  },
  async created() {
    if (this.$route.query.val) {
      const val = JSON.parse(this.$route.query.val)
      this.type = 'edit'
      this.title = '编辑广告'
      Object.assign(this.form, val)
      this.form.initImg = [
        {
          id: createId(),
          display: this.form.imageUrl,
          src: '',
          imgId: createId(),
        },
      ]
    }
    this.getAllCategory()
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
.info {
  color: #999999;
  font-size: 12px;
  line-height: 1.5;
}
</style>
