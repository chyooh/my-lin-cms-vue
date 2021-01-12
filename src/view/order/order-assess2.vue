<template>
  <div class="container goods-create">
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

    <el-row v-loading="loading">
      <el-col :span="6">
        <div class="title2">用户选择项</div>
        <div class="content">
          <div class="user-spec-container">
            <div v-for="(item, index) in userList" :key="index">
              <div class="item-title">{{ item.name }}</div>
              <div class="value-container">
                <div class="value-item" v-for="value in item.values" :key="value.id">{{ value.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="flex-containter">
          <div class="title2">评估选择项</div>
          <div class="info">提示:若检测结果不一致,可点击每项右侧的方框上传图片凭证.</div>
        </div>
        <div class="content">
          <div class="public-spec-container">
            <el-form
              :model="dynamicValidateForm"
              ref="dynamicValidateForm"
              class="demo-dynamic"
              :inline="true"
              @submit.native.prevent
              v-if="dynamicValidateForm.assessList.length"
            >
              <el-collapse v-model="activeName">
                <el-collapse-item :name="index" v-for="(item, index) in dynamicValidateForm.assessList" :key="index">
                  <div class="private-title" slot="title">
                    <div>{{ item.name }}</div>
                  </div>
                  <div class="item-container">
                    <el-radio-group v-if="item.onlyOneSelect === 1" v-model="item.selectedId">
                      <div class="child-container" v-for="(child, j) in item.children" :key="j">
                        <el-radio :label="child.id" border>{{ child.value }}</el-radio>
                      </div>
                    </el-radio-group>
                    <el-checkbox-group v-else v-model="item.selectedIds">
                      <div class="child-container" v-for="(child, j) in item.children" :key="j">
                        <el-checkbox :label="child.id" border>{{ child.value }}</el-checkbox>
                      </div>
                    </el-checkbox-group>
                    <div class="img-input-container">
                      <upload-imgs
                        :value="item.initImg"
                        :ref="'uploadImgs' + index"
                        :rules="rules1"
                        :max-num="1"
                        :remote-fuc="remoteFuc"
                        @onChange="handleChange('uploadImgs' + index, item)"
                        @upload="handleUpload"
                        :width="100"
                        :height="100"
                      />
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div class="submit">
          <el-button type="primary" :loading="loading1" @click="submitForm()">确 定</el-button>
          <el-button @click="resetForm()">重 置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'
import User from '@/model/user'
import Goods from '@/model/goods'

/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
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
      rules1: {
        maxSize: 128,
        type: ['webp'],
      },
      dynamicValidateForm: {
        assessList: [],
      },
      userList: [],
      activeName: [],
      goods: {},
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
          obj.name = item.goodsPublicSpec.goodsPublicSpecName
          obj.specId = item.goodsPublicSpec.id
          obj.mustSelect = item.goodsPublicSpec.mustSelect
          obj.onlyOneSelect = item.goodsPublicSpec.onlyOneSelect
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
            obj.children.push(obj1)
          })
          this.dynamicValidateForm.assessList.push(obj)
        })
        res.data.goodsPrivateSpecVos.forEach(item => {
          const obj = {}
          obj.name = item.goodsPrivateSpec.goodsPrivateSpecName
          obj.specId = item.goodsPrivateSpec.id
          obj.onlyOneSelect = item.goodsPrivateSpec.onlyOneSelect
          obj.mustSelect = item.goodsPrivateSpec.mustSelect
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
            obj.children.push(obj1)
          })
          this.dynamicValidateForm.assessList.push(obj)
        })
        // const num = this.dynamicValidateForm.assessList.length
        // for (let i = 0; i < num; i++) {
        //   this.activeName.push(i)
        // }
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
    async submitForm() {
      // console.log(this.dynamicValidateForm)
      // return
      if (this.checkForm()) {
        try {
          this.loading1 = true
          console.log('c')
          return
          const res = await Goods.save({})
          this.loading1 = false
          this.$message.success(`${res.msg}`)
          this.$router.push('/order/list')
        } catch (e) {
          this.loading1 = false
          console.log(e)
        }
      }
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
        obj.values = []
        item.goodsPublicSpecInfos.forEach(child => {
          const obj1 = {}
          obj1.id = child.id
          obj1.name = child.goodsPublicSpecValue
          obj.values.push(obj1)
        })
        this.userList.push(obj)
      })
      goods.goodsPrivateSpecVos.forEach(item => {
        const obj = {}
        obj.name = item.goodsPrivateSpec.goodsPrivateSpecName
        obj.values = []
        item.goodsPrivateSpecInfos.forEach(child => {
          const obj1 = {}
          obj1.id = child.id
          obj1.name = child.goodsPrivateSpecValue
          obj.values.push(obj1)
        })
        this.userList.push(obj)
      })
    },
  },

  async created() {
    const { goods } = this.$route.query
    if (goods) {
      // console.log(goods)
      this.getUserSelectedList(goods)
      Object.assign(this.goods, goods.goods)
      await this.getView(this.goods.id)
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
      margin-right: 28%;
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
    padding: 0 25px;
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
  min-height: 100px;
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
