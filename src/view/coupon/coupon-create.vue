<template>
  <div class="container goods-create">
    <div class="title">{{ title }}</div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <div class="content">
          <el-form
            status-icon
            :rules="rules"
            :model="form"
            ref="form"
            label-position="right"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="优惠券名称" prop="name">
              <el-input size="medium" clearable v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="可发放总数" prop="totalNum">
              <el-input size="medium" type="number" clearable v-model="form.totalNum"></el-input>
            </el-form-item>
            <el-form-item label="每人限制领取" prop="limitNum">
              <el-input size="medium" type="number" clearable v-model="form.limitNum"></el-input>
            </el-form-item>

            <el-form-item label="面额" prop="formValue">
              <el-input size="medium" type="number" clearable v-model="form.formValue"></el-input>
            </el-form-item>

            <el-form-item label="使用门槛" prop="threshold">
              <el-radio-group v-model="form.threshold" size="mini">
                <el-radio :label="1" border>不限制</el-radio>
                <el-radio :label="2" border>满额使用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="门槛额度" prop="thresholdValue" v-if="form.threshold === 2">
              <el-input size="medium" type="number" clearable v-model="form.thresholdValue"></el-input>
            </el-form-item>

            <el-form-item prop="startTime" label="优惠券开始时间">
              <el-date-picker
                size="mini"
                v-model="form.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间"
                :picker-options="{
                  disabledDate(time) {
                    return time.getTime() < Date.now()
                  },
                }"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="优惠券结束时间">
              <el-date-picker
                size="mini"
                v-model="form.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间"
                :picker-options="{
                  disabledDate(time) {
                    return time.getTime() < new Date(form.startTime)
                  },
                }"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="优惠券活动页面链接" prop="url">
              <el-input size="medium" type="textarea" clearable v-model="form.url"></el-input>
            </el-form-item>

            <el-form-item label="是否指定商品" prop="assign">
              <el-switch v-model="form.assign" :active-value="2" :inactive-value="1"> </el-switch>
            </el-form-item>
            <el-form-item label="添加指定商品id" prop="goodsIdsList" v-if="form.assign === 2">
              <el-select
                v-model="form.goodsIdsList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入商品id(可输入多个)"
              >
              </el-select>
            </el-form-item>
            <el-form-item label="是否可叠加使用" prop="overlayUse">
              <el-switch v-model="form.overlayUse" :active-value="1" :inactive-value="2"> </el-switch>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" size="mini">
                <el-radio :label="1" border>上架</el-radio>
                <el-radio :label="2" border>下架</el-radio>
                <el-radio :label="3" border>回收站</el-radio>
                <el-radio :label="4" border disabled>过期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="submit" v-permission="['admin:coupon:edit', 'admin:coupon:add']">
              <el-button type="primary" :loading="loading" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Coupon from '@/model/coupon'

export default {
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('优惠券名称不能为空'))
      }
      callback()
    }

    const checkAmount = (rule, value, callback) => {
      if (value < 1) {
        return callback(new Error('数量不能小于1'))
      }
      callback()
    }
    const checkPrice = (rule, value, callback) => {
      if (value < 1) {
        return callback(new Error('面额不能为空'))
      }
      callback()
    }

    return {
      title: '添加优惠券',
      type: 'add',
      form: {
        id: null,
        name: '',
        totalNum: null,
        limitNum: null,
        formValue: null,
        threshold: 1,
        thresholdValue: null,
        startTime: null,
        endTime: null,
        url: '',
        assign: 1,
        overlayUse: 2,
        goodsIdsList: [],
        goodsIds: null,
        status: 1,
      },
      rules: {
        name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        totalNum: [{ validator: checkAmount, trigger: ['blur', 'change'], required: true }],
        limitNum: [{ validator: checkAmount, trigger: ['blur', 'change'], required: true }],
        formValue: [{ validator: checkPrice, required: true }],
        startTime: [{ required: true, message: '开始时间不能为空' }],
        endTime: [{ required: true, message: '结束时间不能为空' }],
      },
      loading: false,
    }
  },
  methods: {
    // 获取商品详情
    async getView(id) {
      try {
        const res = await Coupon.view(id) // eslint-disable-line
        Object.assign(this.form, res.data)
      } catch (e) {
        console.log(e)
      }
    },

    // 提交商品表单
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          if (this.form.threshold === 2 && !this.form.thresholdValue) {
            this.$message.error('门槛额度不能为空')
            return
          }
          if (this.form.assign === 2 && this.form.goodsIdsList.length < 1) {
            this.$message.error('请添加商品id')
            return
          }
          try {
            this.loading = true
            this.form.goodsids = this.form.goodsIdsList.join(',')
            const {
              id,
              name,
              totalNum,
              limitNum,
              formValue,
              threshold,
              thresholdValue,
              startTime,
              endTime,
              url,
              assign,
              overlayUse,
              goodsIds,
              status,
            } = this.form

            let res
            if (this.type === 'add') {
              res = await Coupon.save({
                id,
                name,
                totalNum,
                limitNum,
                formValue,
                threshold,
                thresholdValue,
                startTime,
                endTime,
                url,
                assign,
                overlayUse,
                goodsIds,
                status,
              })
            } else {
              res = await Coupon.update({
                id,
                name,
                totalNum,
                limitNum,
                formValue,
                threshold,
                thresholdValue,
                startTime,
                endTime,
                url,
                assign,
                overlayUse,
                goodsIds,
                status,
              })
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/coupon/list')
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

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },

  async created() {
    // try {
    //   const res = await Coupon.list(1)
    //   console.log(res)
    // } catch (e) {
    //   console.log(e)
    // }
    const { id } = this.$route.query
    if (id) {
      this.type = 'edit'
      this.title = '编辑优惠券'
      await this.getView(id)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .content {
    margin-top: 10px;
    padding-left: 25px;
    padding-right: 40px;
  }

  .submit {
    float: left;
  }
  .public-spec-container {
    display: flex;
    align-items: flex-start;
  }
}
.outer-dialog {
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
}
.price-form .el-form-item {
  margin-bottom: 0 !important;
}
.private-tag {
  margin: 5px 5px 5px 0;
}
</style>
