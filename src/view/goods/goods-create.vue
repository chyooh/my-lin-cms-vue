<template>
  <div class="container goods-create">
    <div class="title">{{ title }}</div>
    <el-row>
      <el-col :lg="20" :md="20" :sm="24" :xs="24">
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
            <el-form-item label="商品名称" prop="goodsName">
              <el-input size="medium" clearable v-model="form.goodsName"></el-input>
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
              <el-select
                size="medium"
                v-model="form.secondCategoryId"
                placeholder="请选择"
                @change="secondCategoryIdChange"
              >
                <el-option
                  v-for="(group, index) in secondCategoryId"
                  :key="index"
                  :label="group.catName"
                  :value="group.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="回收均价" prop="avgPrice">
              <el-input size="medium" type="number" clearable v-model="form.avgPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="goodsImage">
              <upload-imgs
                :value="form.initImg"
                ref="uploadImgs"
                :rules="rules1"
                :max-num="1"
                :remote-fuc="remoteFuc"
                @onChange="handleChange('uploadImgs')"
                @upload="handleUpload"
              />
            </el-form-item>
            <el-form-item label="商品属性" prop="goodsPublicSpecInfos">
              <div class="public-spec-container">
                <el-form
                  :model="dynamicValidateForm"
                  ref="dynamicValidateForm"
                  class="demo-dynamic"
                  :inline="true"
                  v-if="dynamicValidateForm.list.length"
                >
                  <el-collapse>
                    <el-collapse-item
                      :title="item.label"
                      :name="index"
                      v-for="(item, index) in dynamicValidateForm.list"
                      :key="item.value"
                    >
                      <div class="item-container" v-for="(child, j) in item.children" :key="j">
                        <div class="child-title">{{ child.label + ':' }}</div>
                        <div class="child-container">
                          <el-form-item>
                            <el-switch
                              v-model="child.priceSymbol"
                              size="mini"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              active-text="+"
                              inactive-text="-"
                              :active-value="0"
                              :inactive-value="1"
                            >
                            </el-switch>
                          </el-form-item>
                          <el-form-item
                            label="价钱"
                            :key="child.key"
                            :prop="'list.' + index + '.children.' + j + '.price'"
                            :rules="{
                              validator: priceCheck,
                              trigger: 'blur',
                            }"
                          >
                            <el-input
                              size="mini"
                              v-model="child.price"
                              type="number"
                              placeholder="请输入价格"
                            ></el-input>
                          </el-form-item>
                          <el-form-item label="是否为结束标记">
                            <el-switch
                              v-model="child.end"
                              size="mini"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              :active-value="1"
                              :inactive-value="0"
                            >
                            </el-switch>
                          </el-form-item>
                          <el-form-item label="排序">
                            <el-input
                              size="mini"
                              v-model="child.orderNumber"
                              type="number"
                              placeholder="请输入排序"
                            ></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button size="mini" @click.prevent="removeDomain(item, child)">删除属性值</el-button>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="add-container">
                        <el-form-item>
                          <el-input
                            size="mini"
                            v-model="item.tempValue"
                            placeholder="请输入属性值"
                            :ref="'name' + index"
                          ></el-input>
                        </el-form-item>
                        <el-button class="addbtn" type="primary" size="mini" plain @click="addValue(item)"
                          >添 加</el-button
                        >
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>

                <div v-else class="empty">请先选择分类</div>
              </div>
            </el-form-item>

            <el-form-item label="是否推荐" prop="isHandpick">
              <el-switch v-model="isHandpick"> </el-switch>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" size="mini">
                <el-radio :label="1" border>上架</el-radio>
                <el-radio :label="2" border>下架</el-radio>
                <el-radio :label="3" border>存为草稿</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="remarks">
              <el-input size="medium" type="textarea" clearable v-model="form.remarks"></el-input>
            </el-form-item>
            <el-form-item class="submit">
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
import UploadImgs from '@/component/base/upload-image'
import User from '@/model/user'
import Goods from '@/model/goods'
import Public from '@/model/public-spec'
import Category from '@/model/category'

/** 生成随机字符串 */
function createId() {
  return Math.random()
    .toString(36)
    .substring(2)
}
export default {
  components: {
    UploadImgs,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品名称不能为空'))
      }
      callback()
    }
    const checkImg = (rule, value, callback) => {
      if (!this.form.goodsImage) {
        return callback(new Error('商品图片不能为空'))
      }
      callback()
    }
    const checkPrice = (rule, value, callback) => {
      if (value < 1) {
        return callback(new Error('回收均价不能为空'))
      }
      callback()
    }
    const checkPublic = (rule, value, callback) => {
      if (!this.form.goodsPublicSpecInfos) {
        return callback(new Error('商品属性不能为空'))
      }
      callback()
    }
    return {
      title: '添加商品',
      type: 'add',
      form: {
        id: null,
        goodsName: '',
        firstCategoryId: null,
        secondCategoryId: null,
        goodsImage: '',
        isHandpick: 2,
        status: 1,
        remarks: '',
        avgPrice: null,
        goodsPrivateSpecIds: null,
        goodsPrivateSpecList: [],
        initImg: [],
        price: null, // 每个版本不同价格(公有小属性Id:价格, 公有小属性Id:价格)
        cutPrice: null, // 每个私有属性所需要扣减的价格(私有小属性id:价格,私有小属性Id:价格)
        cutPrice1: null, // 每个公有属性所需要扣减的价格(公有小属性id:价格，公有小属性id：价格)
      },
      rules: {
        goodsName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        firstCategoryId: [{ required: true, message: '一级分类不能为空' }],
        secondCategoryId: [{ required: true, message: '二级分类不能为空' }],
        avgPrice: [{ validator: checkPrice, required: true }],
        goodsImage: [{ validator: checkImg, trigger: ['blur', 'change'], required: true }],
        goodsPublicSpecInfos: [{ validator: checkPublic, trigger: ['blur', 'change'], required: true }],
      },
      loading: false,
      rules1: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 2,
      },
      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],

      isHandpick: false,

      props: { multiple: true },
      privateSpec: [],
      publicSpecInfo: [],
      privateSpecInfo: [],
      priceForm: {
        priceList: [],
      },
      priceCheck: (rule, value, callback) => {
        if (!value || value < 0) {
          return callback(new Error('价格只能为大于0的数字'))
        }
        callback()
      },
      goodsPrivateSpec: null,
      goodsPrivateSpecInfo: [],
      dynamicValidateForm: {
        list: [],
      },
      tempValue: '',
    }
  },
  methods: {
    // 获取商品详情
    async getView(id) {
      try {
        const res = await Goods.view(id) // eslint-disable-line
        Object.assign(this.form, res.data.goods)
        // delete this.form.createTime
        // delete this.form.updateTime
        // this.getPublicSpec()
        // this.getPrivateSpec()
        this.form.initImg = [
          {
            id: createId(),
            display: this.form.goodsImage,
            src: '',
            imgId: createId(),
          },
        ]
        this.isHandpick = this.form.isHandpick === 1
        const list = []
        res.data.goodsPublicSpecVos.forEach(item => {
          const obj = {}
          obj.label = item.goodsPublicSpec.goodsPublicSpecName
          obj.value = item.goodsPublicSpec.id
          obj.children = []
          item.goodsPublicSpecInfos.forEach(child => {
            const obj1 = {}
            obj1.id = child.id
            obj1.value = child.goodsPublicSpecId
            obj1.label = child.goodsPublicSpecValue
            obj1.orderNumber = child.orderNumber
            obj1.end = child.end
            obj1.price = child.price
            obj1.priceSymbol = child.priceSymbol
            obj.children.push(obj1)
          })
          list.push(obj)
        })
        this.dynamicValidateForm.list = list
      } catch (e) {
        console.log(e)
      }
    },

    // 获取所有分类
    async getAllCategory() {
      try {
        const res = await Category.categoryList()
        if (res.data.rows.length) {
          this.categoryList = res.data.rows
          this.categoryList.forEach(item => {
            const { catName, id } = item
            this.firstCategoryId.push({ catName, id })
          })
          const obj = this.categoryList.find(item => item.id === this.form.firstCategoryId)
          if (obj && obj.children.length) {
            obj.children.forEach(item => {
              const { catName, id } = item
              this.secondCategoryId.push({ catName, id })
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 根据分类id获取公有属性
    async getPublicSpec() {
      try {
        const res = await Public.infoListByCategory({
          firstCategoryId: this.form.firstCategoryId,
          secondCategoryId: this.form.secondCategoryId,
        })
        if (res.data.length) {
          this.publicSpecInfo = res.data
          res.data.forEach(item => {
            const obj = {}
            obj.value = item.id
            obj.label = item.goodsPublicSpecName
            obj.children = []
            this.dynamicValidateForm.list.push(obj)
          })
        } else {
          this.dynamicValidateForm.list = []
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 选择一级分类
    firstCategoryIdChange(val) {
      this.form.secondCategoryId = null
      this.secondCategoryId = []
      const obj = this.categoryList.find(item => item.id === val)
      if (obj && obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },

    // 选择一级分类
    secondCategoryIdChange(val) {
      console.log(val)
      this.getPublicSpec()
      // this.getPrivateSpec()
    },

    // 提交商品表单
    async submitForm(formName) {
      this.form.goodsPublicSpecInfos = this.getPublicSpecInfos()
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
          this.form.price = this.priceTransform()
        } else {
          this.$message.error('请将价格信息填写完整')
          return false
        }
      })
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          try {
            this.loading = true
            // this.form.goodsPrivateSpecIds = this.getPrivateIds()
            const {
              id,
              goodsName,
              firstCategoryId,
              secondCategoryId,
              goodsImage,
              isHandpick,
              status,
              remarks,
              avgPrice,
              goodsPublicSpecInfos,
            } = this.form

            let res
            if (this.type === 'add') {
              res = await Goods.save({
                goodsName,
                firstCategoryId,
                secondCategoryId,
                goodsImage,
                isHandpick,
                status,
                remarks,
                avgPrice,
                goodsPublicSpecInfos,
              })
            } else {
              res = await Goods.update({
                id,
                goodsName,
                firstCategoryId,
                secondCategoryId,
                goodsImage,
                isHandpick,
                status,
                remarks,
                avgPrice,
                goodsPublicSpecInfos,
              })
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/goods/list')
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
        this.form.goodsImage = result[0].src
      } else {
        this.form.goodsImage = ''
      }
    },

    // 生成表单的price属性
    priceTransform() {
      const list1 = []
      let price = ''
      this.priceForm.priceList.forEach(item => {
        const str = `${item.id}:${item.price}`
        list1.push(str)
      })
      if (list1.length) {
        price = list1.join(',')
      }
      return price
    },

    // 选择公有属性
    publicSpecChange(val) {
      if (val.length) {
        this.priceForm.priceList = this.filterPriceFlag(val)
        this.form.price = this.priceTransform()
      } else {
        this.priceForm.priceList = []
        console.log(this.priceForm.priceList)
      }
    },

    // 筛选需要填写价格的属性列表
    filterPriceFlag(val) {
      const items = []
      const obj = {}
      val.forEach(item => {
        if (!obj[item[0]]) {
          obj[item[0]] = []
        }
        obj[item[0]].push(item[1])
      })
      const publicSpecInfo = JSON.parse(JSON.stringify(this.publicSpecInfo))
      for (const key in obj) {
        const obj1 = publicSpecInfo.find(
          item => item.goodsPublicSpec.id === Number(key) && item.goodsPublicSpec.priceFlag === 1,
        )
        if (obj1) {
          obj1.goodsPublicSpecInfoVos = obj1.goodsPublicSpecInfoVos.filter(item => obj[key].includes(item.goodsPublicSpecInfo.id),)
          if (obj1.goodsPublicSpecInfoVos.length) items.push(obj1)
        }
      }
      const list = []
      items.forEach(item => {
        item.goodsPublicSpecInfoVos.forEach(child => {
          const obj3 = this.priceForm.priceList.find(item1 => item1.id === child.goodsPublicSpecInfo.id)
          if (obj3) {
            list.push(obj3)
          } else {
            const obj2 = {}
            obj2.id = child.goodsPublicSpecInfo.id
            obj2.label = `${item.goodsPublicSpec.goodsPublicSpecName}/${child.goodsPublicSpecInfo.goodsPublicSpecValue}`
            obj2.price = child.goodsPrices ? child.goodsPrices.price : 100
            list.push(obj2)
          }
        })
      })

      return list
    },

    // 生成表单的公有属性goodsPublicSpecIds
    publicSpecIdsTransform(val) {
      const list = []
      const obj = {}
      val.forEach(item => {
        if (!obj[item[0]]) {
          obj[item[0]] = []
        }
        obj[item[0]].push(item[1])
      })
      let str = ''
      for (const key in obj) {
        str = `${key}:${obj[key].join('-')}`
        list.push(str)
      }
      return list.join(',')
    },
    addValue(item) {
      console.log(item)
      if (!item.tempValue) {
        return false
      }
      const obj = item.children.find(child => child.label === item.tempValue)
      if (!obj) {
        item.children.push({
          label: item.tempValue,
          key: Date.now(),
          priceSymbol: 1,
          price: 100,
        })
        item.tempValue = ''
      } else {
        this.$message.error('属性值已存在')
      }
    },
    removeDomain(item, child) {
      const index = item.children.indexOf(child)
      if (index !== -1) {
        item.children.splice(index, 1)
      }
    },
    getPublicSpecInfos() {
      console.log(this.dynamicValidateForm.list)
      const list = []
      this.dynamicValidateForm.list.forEach(item => {
        if (item.children.length) {
          item.children.forEach(child => {
            const obj = {}
            obj.goodsPublicSpecId = item.value
            obj.goodsPublicSpecValue = child.label
            obj.orderNumber = child.orderNumber ? Number(child.orderNumber) : 1
            obj.end = child.end
            obj.price = child.price ? Number(child.price) : 0
            obj.priceSymbol = child.priceSymbol
            list.push(obj)
          })
        }
      })
      return list
    },
  },

  async created() {
    const { id } = this.$route.query
    if (id) {
      this.type = 'edit'
      this.title = '编辑商品'
      await this.getView(id)
    }
    await this.getAllCategory()
    // await this.getAllPublicSpec()
  },
  watch: {
    isHandpick(newValue) {
      this.form.isHandpick = newValue ? 1 : 2
    },
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
    padding: 0 20px;
    background-color: #ffffff;
    .demo-dynamic {
      width: 100%;
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
  display: flex;
  margin-left: 40px;
  .child-title {
    margin-right: 30px;
    line-height: 30px;
    white-space: nowrap;
  }
  .child-container {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      display: flex;
      margin-right: 20px !important;
    }
  }
}
.add-container {
  display: flex;
  align-items: center;
}
.addbtn {
  margin-left: 20px;
  margin-bottom: 10px;
}
</style>
