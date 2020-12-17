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
          <el-form-item label="规格名称" prop="goodsPublicSpecName">
            <el-input size="medium" clearable v-model="form.goodsPublicSpecName"></el-input>
          </el-form-item>
          <el-form-item label="一级分类" prop="firstCategoryId">
            <el-select
              size="medium"
              v-model="form.firstCategoryId"
              placeholder="请选择"
              @change="firstCategoryIdChange"
            >
              <el-option
                v-for="(group, index) in firstCategoryId"
                :key="index"
                :label="group.catName"
                :value="group.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="secondCategoryId">
            <el-select size="medium" v-model="form.secondCategoryId" placeholder="请选择">
              <el-option
                v-for="(group, index) in secondCategoryId"
                :key="index"
                :label="group.catName"
                :value="group.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格排序" prop="orderNumber">
            <el-input size="medium" type="number" clearable v-model="form.orderNumber"></el-input>
          </el-form-item>
          <el-form-item label="是否为单选" prop="onlyOneSelect">
            <el-switch v-model="form.onlyOneSelect" :active-value="1" :inactive-value="0"> </el-switch>
          </el-form-item>
          <el-form-item label="是否为必选" prop="mustSelect">
            <el-switch v-model="form.mustSelect" :active-value="1" :inactive-value="0"> </el-switch>
          </el-form-item>
          <el-form-item label="是否决定价格" prop="priceFlag">
            <el-switch v-model="form.priceFlag" :active-value="1" :inactive-value="0"> </el-switch>
            <div class="info">
              提示：决定价格的规格一般只有一个,比如内存（128G的和256G的机型价格不同,那么内存这个规格名就是决定价格的,否则就不是决定价格的）。
            </div>
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
import Public from '@/model/public-spec'
import Category from '@/model/category'

export default {
  components: {},
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名不能为空'))
      }
      callback()
    }
    const checkOrder = (rule, value, callback) => {
      if (!value || value < 1) {
        return callback(new Error('排序只能为大于0的数字'))
      }
      callback()
    }
    return {
      type: 'add',
      title: '新建规格',

      loading: false,
      form: {
        id: null,
        goodsPublicSpecName: '',
        orderNumber: 1,
        firstCategoryId: null,
        secondCategoryId: null,
        onlyOneSelect: 1,
        mustSelect: 1,
        priceFlag: 0,
      },
      rules: {
        goodsPublicSpecName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },

      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],
    }
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    async submitForm(formName) {
      if (!this.form.firstCategoryId) {
        this.$message.error('请选择一级分类')
        return false
      }
      if (!this.form.secondCategoryId) {
        this.$message.error('请选择二级分类')
        return false
      }
      this.setFirstCategoryName(this.form.firstCategoryId)
      this.setSecondCategoryName(this.form.secondCategoryId)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            let res
            if (this.type === 'add') {
              res = await Public.save(this.form)
            } else {
              res = await Public.update(this.form)
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/spec/list')
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
        this.loading = true
        const res = await Category.categoryList()
        if (res.data.rows.length) {
          this.categoryList = res.data.rows
          this.categoryList.forEach(item => {
            const { catName, id } = item
            this.firstCategoryId.push({ catName, id })
          })
          if (this.form.firstCategoryId) {
            this.updateSecondIdsByFirstId(this.form.firstCategoryId)
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    updateSecondIdsByFirstId(val) {
      const obj = this.categoryList.find(item => item.id === val)
      if (obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },
    firstCategoryIdChange(val) {
      if (val) {
        this.form.secondCategoryId = null
        this.secondCategoryId = []
        this.updateSecondIdsByFirstId(val)
      }
    },
    back() {
      this.$router.go(-1)
    },
    setFirstCategoryName(id) {
      const obj = this.firstCategoryId.find(item => item.id === id)
      this.form.firstCategoryName = obj.catName
    },
    setSecondCategoryName(id) {
      const obj = this.secondCategoryId.find(item => item.id === id)
      this.form.secondCategoryName = obj.catName
    },
  },
  async created() {
    if (this.$route.query.val) {
      const val = JSON.parse(this.$route.query.val)
      this.type = 'edit'
      this.title = '编辑规格'
      this.form.id = val.id
      this.form.goodsPublicSpecName = val.goodsPublicSpecName
      this.form.firstCategoryId = val.firstCategoryId || null
      this.form.secondCategoryId = val.secondCategoryId || null
      this.form.orderNumber = val.orderNumber
      this.form.onlyOneSelect = val.onlyOneSelect
      this.form.mustSelect = val.mustSelect
      this.form.priceFlag = val.priceFlag
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
