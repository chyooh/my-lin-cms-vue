<template>
  <div class="container goods-create">
    <div class="title">
      {{ title }}
      <span v-if="type === 'edit'" class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <div class="content">
          <el-form
            status-icon
            :rules="rules"
            :model="form"
            ref="form"
            label-position="right"
            label-width="120px"
            @submit.native.prevent
          >
            <el-form-item label="信用等级" prop="riskinfoNsfCommon">
              <el-radio-group v-model="form.riskinfoNsfCommon" size="medium" :disabled="type === 'edit'">
                <el-radio label="rank1" border>高</el-radio>
                <el-radio label="rank2" border>中</el-radio>
                <el-radio label="rank3" border>低</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="百分比(%)" prop="precent">
              <el-input size="medium" type="number" :min="0" :max="100" v-model="form.precent"></el-input>
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
import Credit from '@/model/credit'
// import Util from '@/util/util'

export default {
  data() {
    const checkPrice = (rule, value, callback) => {
      if (!value || value > 100) {
        return callback(new Error('百分比只能为0-100'))
      }
      callback()
    }

    return {
      title: '添加信用额度',
      type: 'add',
      form: {
        id: null,
        precent: null,
        riskinfoNsfCommon: 'rank1',
      },
      rules: {
        precent: [{ validator: checkPrice, required: true }],
      },
      loading: false,
    }
  },
  methods: {
    // 获取商品详情
    // async getView(id) {
    //   try {
    //     const res = await Credit.view(id) // eslint-disable-line
    //     Object.assign(this.form, res.data)
    //     this.form.startTime = res.data.startTime ? Util.getDateString(res.data.startTime) : res.data.startTime
    //     this.form.endTime = res.data.endTime ? Util.getDateString(res.data.endTime) : res.data.endTime
    //     if (res.data.assign === 2 && res.data.goodsCouponVos) {
    //       this.selectedGoods = res.data.goodsCouponVos
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },

    // 提交商品表单
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          try {
            this.loading = true
            const { id, precent, riskinfoNsfCommon } = this.form

            let res
            if (this.type === 'add') {
              res = await Credit.save({
                precent: precent / 100,
                riskinfoNsfCommon,
              })
            } else {
              res = await Credit.update({
                id,
                precent: precent / 100,
                riskinfoNsfCommon,
              })
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/credit/list')
          } catch (e) {
            this.loading = false
            // console.log(e)
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

    back() {
      this.$router.go(-1)
    },
  },

  async created() {
    // try {
    //   const res = await Credit.list(1)
    //   console.log(res)
    // } catch (e) {
    //   console.log(e)
    // }
    const { row } = this.$route.query
    if (row) {
      this.type = 'edit'
      this.title = '编辑信用额度'
      Object.assign(this.form, row)
      // await this.getView(id)
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-right: 20%;
      cursor: pointer;
    }
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
.goods-form {
  display: flex;
  flex-wrap: wrap;
}
.goods-tags {
  padding: 0 10px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  .goodsid-tag {
    margin-right: 10px;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
}
</style>
