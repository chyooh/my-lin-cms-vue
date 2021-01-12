<template>
  <div class="container goods-create">
    <sticky-top>
      <div class="title">
        <div>
          <span>{{ title }}</span>
        </div>
        <div class="goods-container" v-if="goods.goodsImage">
          <img :src="goods.goodsImage" alt="" />
          <div class="name">{{ goods.goodsName }}</div>
        </div>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
    </sticky-top>
    <div class="content">
      <table class="reference" v-loading="loading">
        <tbody>
          <tr>
            <th style="width: 120px">属性名</th>
            <th style="width: 300px">用户选择项</th>
            <th>
              <div class="flex-containter">
                <div class="title2">评估选择项</div>
                <div class="info">提示:若检测结果不一致,可点击每项右侧的方框上传图片凭证.</div>
              </div>
            </th>
            <th></th>
          </tr>
          <tr v-for="(item, index) in tableData" :key="index">
            <td style="width: 120px">{{ item.label }}</td>
            <td style="width: 400px">
              <div class="value-container">
                <div class="value-item" v-for="value in item.userSelect.values" :key="value.id">
                  {{ value.name }}{{ item.userSelect.priceFlag === 1 ? `(${value.price}元)` : `(-${value.price}元)` }}
                </div>
              </div>
            </td>
            <td>
              <div class="item-container">
                <el-radio-group
                  v-if="item.goodsSpecs.onlyOneSelect === 1"
                  v-model="item.goodsSpecs.selectedId"
                  :disabled="item.goodsSpecs.disabled"
                >
                  <div class="child-container" v-for="(child, j) in item.goodsSpecs.children" :key="j">
                    <el-radio size="mini" :label="child.id" border
                      >{{ child.value
                      }}{{ item.goodsSpecs.priceFlag === 1 ? `(${child.price}元)` : `(-${child.price}元)` }}</el-radio
                    >
                  </div>
                </el-radio-group>
                <el-checkbox-group v-else v-model="item.goodsSpecs.selectedIds" :disabled="item.goodsSpecs.disabled">
                  <div class="child-container" v-for="(child, j) in item.goodsSpecs.children" :key="j">
                    <el-checkbox size="mini" :label="child.id" border
                      >{{ child.value
                      }}{{
                        item.goodsSpecs.priceFlag === 1 ? `(${child.price}元)` : `(-${child.price}元)`
                      }}</el-checkbox
                    >
                  </div>
                </el-checkbox-group>
                <div class="img-input-container">
                  <upload-imgs
                    :value="item.goodsSpecs.initImg"
                    :ref="'uploadImgs' + index"
                    :rules="rules1"
                    :max-num="1"
                    :remote-fuc="remoteFuc"
                    @onChange="handleChange('uploadImgs' + index, item.goodsSpecs)"
                    @upload="handleUpload"
                    :width="60"
                    :height="60"
                    :disabled="item.goodsSpecs.disabled"
                  />
                </div>
              </div>
            </td>
            <td>
              <div class="btn">
                <el-button type="success" size="mini" @click="tempConfirm(item.goodsSpecs)">确定审核</el-button>
              </div>
              <div>
                <el-button type="info" size="mini" @click="enable(item.goodsSpecs)">重新评估</el-button>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">用户评估价：￥{{ userOrderPrice }}</td>
            <td colspan="2">
              <div class="now-price">
                <div>当前评估价：￥{{ nowPrice }}</div>
                <el-button type="success" :loading="loading2" @click="account()">获取评估价格</el-button>
              </div>
              <el-form
                status-icon
                :rules="rules"
                :model="form"
                ref="form"
                label-position="right"
                label-width="100px"
                @submit.native.prevent
                class="form"
              >
                <el-form-item label="描述" prop="description">
                  <el-input
                    size="medium"
                    type="textarea"
                    clearable
                    v-model="form.description"
                    placeholder="详细描述结算价格的评定"
                  ></el-input>
                </el-form-item>
                <el-form-item label="等级" prop="assessmentLevel">
                  <el-input
                    size="medium"
                    clearable
                    v-model="form.assessmentLevel"
                    placeholder="请填写设备等级(例如:99新)"
                  ></el-input>
                </el-form-item>
                <el-form-item label="结算价格" prop="settlePrice">
                  <el-input
                    size="medium"
                    type="number"
                    clearable
                    v-model="form.settlePrice"
                    placeholder="请填写最终结算价格"
                  ></el-input>
                </el-form-item>
              </el-form>
            </td>
          </tr>
        </tbody>
      </table>
      <el-row>
        <el-col>
          <div class="submit">
            <el-button type="primary" :loading="loading1" @click="submitForm()">提 交</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'
import User from '@/model/user'
import Goods from '@/model/goods'
import Order from '@/model/order'

/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
}
const checkPrice = (rule, value, callback) => {
  if (!value || value < 1) {
    return callback(new Error('价格为大于0的数字'))
  }
  callback()
}
export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      title: '订单评估',
      type: 'add',

      loading: false,
      loading1: false,
      loading2: false,
      rules1: {
        // maxSize: 128,
        // type: ['webp'],
      },
      dynamicValidateForm: {
        assessList: [],
      },
      userList: [],
      goods: {},
      tableData: [],
      form: {
        description: '',
        assessmentLevel: '',
        settlePrice: null,
      },

      rules: {
        assessmentLevel: [{ required: true, message: '等级不能为空' }],
        settlePrice: [{ validator: checkPrice, trigger: ['blur', 'change'], required: true }],
      },
      userOrderPrice: 0,
      nowPrice: 0,
      tempObj: {},
      needGetAgain: false,
      orderNo: '',
    }
  },
  methods: {
    // 获取商品详情
    async getView(id) {
      try {
        this.loading = true
        const res = await Goods.view(id) // eslint-disable-line
        // Object.assign(this.goods, res.data.goods)
        res.data.goodsPublicSpecVos.forEach(item => {
          const obj = {}
          obj.isPublic = true
          obj.name = item.goodsPublicSpec.goodsPublicSpecName
          obj.specId = item.goodsPublicSpec.id
          obj.mustSelect = item.goodsPublicSpec.mustSelect
          obj.onlyOneSelect = item.goodsPublicSpec.onlyOneSelect
          obj.priceFlag = item.goodsPublicSpec.priceFlag
          obj.disabled = false
          obj.initImg = []
          if (obj.onlyOneSelect === 1) {
            obj.selectedId = null
          } else {
            obj.selectedIds = []
          }
          obj.children = []
          item.goodsPublicSpecInfos.forEach(child => {
            const obj1 = {}
            obj1.id = child.id
            obj1.specId = child.goodsPublicSpecId
            obj1.value = child.goodsPublicSpecValue
            obj1.price = child.price
            obj.children.push(obj1)
          })
          this.dynamicValidateForm.assessList.push(obj)
        })
        res.data.goodsPrivateSpecVos.forEach(item => {
          const obj = {}
          obj.isPublic = false
          obj.name = item.goodsPrivateSpec.goodsPrivateSpecName
          obj.specId = item.goodsPrivateSpec.id
          obj.onlyOneSelect = item.goodsPrivateSpec.onlyOneSelect
          obj.mustSelect = item.goodsPrivateSpec.mustSelect
          obj.priceFlag = item.goodsPrivateSpec.priceFlag
          obj.disabled = false
          obj.initImg = []
          if (obj.onlyOneSelect === 1) {
            obj.selectedId = null
          } else {
            obj.selectedIds = []
          }
          obj.children = []
          item.goodsPrivateSpecInfos.forEach(child => {
            const obj1 = {}
            obj1.id = child.id
            obj1.specId = child.goodsPrivateSpecId
            obj1.value = child.goodsPrivateSpecValue
            obj1.price = child.price
            obj.children.push(obj1)
          })
          this.dynamicValidateForm.assessList.push(obj)
        })
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    checkForm() {
      try {
        this.dynamicValidateForm.assessList.forEach(item => {
          if (item.mustSelect === 1) {
            if (
              (item.onlyOneSelect === 1 && !item.selectedId) ||
              (item.onlyOneSelect !== 1 && item.selectedIds.length < 1)
            ) {
              this.$message.error(`请选择 ${item.name} 的值`)
              throw new Error('ending')
            }
            // if (item.onlyOneSelect !== 1 && item.selectedIds.length < 1) {
            //   this.$message.error(`请选择 ${item.name} 的值`)
            //   throw new Error('ending')
            // }
          }
        })
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    },
    // 提交商品表单
    submitForm() {
      console.log(this.dynamicValidateForm)
      // return

      if (this.checkForm()) {
        if (this.nowPrice < 1) {
          this.$message.error('请先获取评估价格')
          return
        }
        if (this.needGetAgain) {
          this.$message.error('请重新获取评估价格')
          return
        }
        this.$refs.form.validate(async valid => {
          // eslint-disable-line
          if (valid) {
            try {
              this.loading1 = true
              const { settlePrice, assessmentLevel, description } = this.form
              const {
                publicSpecIdMap,
                privateSpecIdMap,
                priceGoodsPublicSpecInfoId,
                goodsId,
                publicSpecAssessmentImages,
                privateSpecAssessmentImages,
              } = this.tempObj
              const price = this.nowPrice
              const { orderNo } = this
              const res = await Order.assess({
                settlePrice,
                assessmentLevel,
                description,
                publicSpecIdMap,
                privateSpecIdMap,
                priceGoodsPublicSpecInfoId,
                goodsId,
                publicSpecAssessmentImages,
                privateSpecAssessmentImages,
                price,
                orderNo,
              })
              this.loading1 = false
              this.$message.success(`${res.msg}`)
              this.back()
            } catch (e) {
              this.loading1 = false
              console.log(e)
            }
          }
        })
      }
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
    async handleChange(name, obj) {
      await this.$refs[name][0].getValue(obj)
    },
    handleUpload(result, obj) {
      if (result.length) {
        obj.imageUrl = result[0].src
      } else {
        obj.imageUrl = ''
      }
    },
    back() {
      this.$router.go(-1)
    },
    getUserSelectedList(goods) {
      goods.goodsPublicSpecVos.forEach(item => {
        const obj = {}
        obj.name = item.goodsPublicSpec.goodsPublicSpecName
        obj.priceFlag = item.goodsPublicSpec.priceFlag
        obj.values = []
        item.goodsPublicSpecInfos.forEach(child => {
          const obj1 = {}
          obj1.id = child.id
          obj1.name = child.goodsPublicSpecValue
          obj1.price = child.price
          obj.values.push(obj1)
        })
        this.userList.push(obj)
      })
      goods.goodsPrivateSpecVos.forEach(item => {
        const obj = {}
        obj.name = item.goodsPrivateSpec.goodsPrivateSpecName
        obj.priceFlag = item.goodsPrivateSpec.priceFlag
        obj.values = []
        item.goodsPrivateSpecInfos.forEach(child => {
          const obj1 = {}
          obj1.id = child.id
          obj1.name = child.goodsPrivateSpecValue
          obj1.price = child.price
          obj.values.push(obj1)
        })
        this.userList.push(obj)
      })
    },
    getTabelData() {
      this.userList.forEach((item, index) => {
        const obj = {}
        obj.label = item.name
        obj.userSelect = item
        obj.goodsSpecs = this.dynamicValidateForm.assessList[index]
        this.tableData.push(obj)
      })
    },
    tempConfirm(row) {
      if (row.mustSelect) {
        if (row.onlyOneSelect === 1) {
          if (!row.selectedId) {
            this.$message.error('请先选择项目')
            return
          }
        } else if (row.selectedIds.length < 1) {
          this.$message.error('请先选择项目')
          return
        }
      }
      row.disabled = true
    },
    enable(row) {
      row.disabled = false
      this.needGetAgain = true
    },
    // 获取价格
    async account() {
      // console.log(this.dynamicValidateForm)
      // return
      if (this.checkForm()) {
        const obj = {}
        obj.goodsId = this.goods.id
        obj.publicSpecIdMap = {}
        obj.priceGoodsPublicSpecInfoId = null
        obj.privateSpecIdMap = {}
        const publicSpecAssessmentImages = []
        const privateSpecAssessmentImages = []
        this.dynamicValidateForm.assessList.forEach(item => {
          item.disabled = true
          if (item.isPublic) {
            publicSpecAssessmentImages.push(item.imageUrl || '')
            if (item.priceFlag === 1) {
              obj.priceGoodsPublicSpecInfoId = item.selectedId
            } else if (item.onlyOneSelect) {
              obj.publicSpecIdMap[item.specId] = [item.selectedId]
            } else {
              obj.publicSpecIdMap[item.specId] = item.selectedIds
            }
          } else {
            privateSpecAssessmentImages.push(item.imageUrl || '')
            if (item.onlyOneSelect) {
              obj.privateSpecIdMap[item.specId] = [item.selectedId]
            } else {
              obj.privateSpecIdMap[item.specId] = item.selectedIds
            }
          }
        })
        Object.assign(this.tempObj, obj)
        Object.assign(this.tempObj, { publicSpecAssessmentImages, privateSpecAssessmentImages })
        // this.tempObj = obj
        try {
          this.loading2 = true
          const res = await Order.account(obj)
          this.nowPrice = res.data
          this.needGetAgain = false
          this.loading2 = false
          this.$message.success(`当前估价${res.data}元`)
          // this.back()
        } catch (e) {
          this.loading2 = false
          console.log(e)
        }
      }
    },
  },

  async created() {
    const { goods } = this.$route.query
    if (goods) {
      // console.log(goods)
      this.userOrderPrice = goods.userOrderPrice
      this.orderNo = goods.orderNo
      this.getUserSelectedList(goods)
      Object.assign(this.goods, goods.goods)
      await this.getView(this.goods.id)
      this.getTabelData()
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
      margin-right: 40px;
      cursor: pointer;
    }
    .goods-container {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
      }
      .name {
        font-size: 12px;
        text-indent: 10px;
      }
    }
  }
  .flex-containter {
    display: flex;
    align-items: baseline;
  }
  .content {
    margin: 10px;
    .form {
      padding: 10px 0;
    }
    .btn {
      margin-bottom: 10px;
    }
    .reference {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 4px;
      margin-top: 4px;
      font-size: 12px;
      tr:nth-child(odd) {
        background-color: #f6f4f0;
      }
      tr:last-child {
        background-color: #ffffff;
      }
      th {
        background-color: #ffffff;
        border: 1px solid #d4d4d4;
        font-size: 14px;
        font-weight: 500;
        padding: 3px;
        text-align: left;
      }
      td {
        line-height: 2em;
        min-width: 24px;
        border: 1px solid #d4d4d4;
        padding: 5px;
        padding-top: 7px;
        padding-bottom: 7px;
        vertical-align: top;
      }
      .now-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
      }
    }
  }

  .submit {
    float: right;
    margin: 20px 60px;
  }
  .public-spec-container {
    display: flex;
    align-items: flex-start;
    padding: 0 20px;
    background-color: #ffffff;
    .demo-dynamic {
      width: 100%;
    }
  }
  .user-spec-container {
    padding: 1px 20px;
    background-color: #ffffff;
    .item-title {
      font-size: 14px;
      color: $theme;
      padding: 20px 0;
    }
    .value-container {
      padding-left: 10px;
      .value-item {
        line-height: 20px;
        margin-bottom: 10px;
      }
    }
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
.empty {
  color: #999;
}
.item-container {
  position: relative;
  // min-height: 100px;
  .el-radio-group,
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 110px);
  }
}

.child-container {
  margin-bottom: 10px;
  margin-right: 10px;
}
.add-container {
  display: flex;
  align-items: center;
}
.addbtn {
  margin-left: 20px;
  margin-bottom: 10px;
}
.private-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.el-collapse {
  border-bottom: 0;
  border-top: 0;
  // .el-collapse-item:last-child /deep/ .el-collapse-item__header {
  //   border-bottom: 0;
  // }
  // .el-collapse-item:last-child /deep/ .el-collapse-item__wrap {
  //   border-bottom: 0;
  // }
}

.info {
  color: #999999;
  font-size: 12px;
  line-height: 1.5;
}
.title2 {
  padding: 20px;
  white-space: nowrap;
}
.img-input-container {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
