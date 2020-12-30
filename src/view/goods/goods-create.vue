<template>
  <div class="container goods-create">
    <div class="title">
      <div>
        <span v-show="!isView">{{ title }}</span>
      </div>
      <span v-if="type === 'edit' || isCopy" class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
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
              <el-input size="medium" clearable v-model="form.goodsName" :disabled="isView"></el-input>
            </el-form-item>

            <el-form-item label="一级分类" prop="firstCategoryId">
              <el-select
                size="medium"
                v-model="form.firstCategoryId"
                placeholder="请选择"
                @change="firstCategoryIdChange"
                :disabled="type !== 'add'"
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
                :disabled="type !== 'add'"
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
              <el-input size="medium" type="number" clearable v-model="form.avgPrice" :disabled="isView"></el-input>
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
                :disabled="isView"
              />
            </el-form-item>
            <el-form-item label="商品属性" prop="goodsPublicSpecInfos">
              <div class="public-spec-container">
                <el-form
                  :model="dynamicValidateForm"
                  ref="dynamicValidateForm"
                  class="demo-dynamic"
                  :inline="true"
                  @submit.native.prevent
                  v-if="dynamicValidateForm.list.length"
                >
                  <el-collapse>
                    <el-collapse-item
                      :name="index"
                      v-for="(item, index) in dynamicValidateForm.list"
                      :key="item.goodsPublicSpecId"
                    >
                      <div class="private-title" slot="title">
                        <div>{{ item.goodsPublicSpecName }}</div>
                        <el-button size="mini" @click.stop="removePublic(item)" :disabled="isView">删除</el-button>
                      </div>
                      <div class="item-container" v-for="(child, j) in item.children" :key="j">
                        <div class="child-title">{{ child.goodsPublicSpecValue + ':' }}</div>
                        <div class="child-container">
                          <el-form-item
                            v-if="item.priceFlag === 1"
                            label="价格"
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
                          <el-form-item
                            v-else
                            label="扣减价格"
                            :key="child.key"
                            :prop="'list.' + index + '.children.' + j + '.price'"
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
                            <el-button size="mini" @click.prevent="removeValue(item, child)" :disabled="isView"
                              >删除属性值</el-button
                            >
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
                            @keyup.enter.native="addValue(item)"
                          ></el-input>
                        </el-form-item>
                        <el-button
                          class="addbtn"
                          type="primary"
                          size="mini"
                          plain
                          @click="addValue(item)"
                          :disabled="isView"
                        >
                          添 加
                        </el-button>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>

                <div v-else class="empty">请先选择分类</div>
              </div>
            </el-form-item>

            <el-form-item label="剔除属性">
              <div class="public-spec-container">
                <el-form
                  :model="dynamicValidateFormNoUsed"
                  ref="dynamicValidateFormNoUsed"
                  class="demo-dynamic"
                  :inline="true"
                  @submit.native.prevent
                  v-if="dynamicValidateFormNoUsed.list.length"
                >
                  <el-collapse>
                    <el-collapse-item
                      :name="index"
                      v-for="(item, index) in dynamicValidateFormNoUsed.list"
                      :key="item.goodsPublicSpecId"
                      disabled
                    >
                      <div class="private-title" slot="title">
                        <div>{{ item.goodsPublicSpecName }}</div>
                        <el-button size="mini" @click.stop="cancelRemovePublic(item)" :disabled="isView"
                          >取消删除</el-button
                        >
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>

                <div v-else class="empty">暂无剔除属性</div>
              </div>
            </el-form-item>

            <el-form-item label="私有属性" prop="goodsPrivateSpecVos">
              <div class="public-spec-container">
                <el-form
                  :model="dynamicValidateFormPrivate"
                  ref="dynamicValidateFormPrivate"
                  class="demo-dynamic"
                  :inline="true"
                  @submit.native.prevent
                  v-if="dynamicValidateFormPrivate.list.length"
                >
                  <el-collapse>
                    <el-collapse-item
                      :name="index"
                      v-for="(item, index) in dynamicValidateFormPrivate.list"
                      :key="index"
                    >
                      <div class="private-title" slot="title">
                        <div>{{ item.goodsPrivateSpecName }}</div>
                        <el-button size="mini" @click.stop="removePrivate(item)" :disabled="isView">删除</el-button>
                      </div>
                      <div class="item-container" v-for="(child, j) in item.children" :key="j">
                        <div class="child-title">{{ child.goodsPrivateSpecValue + ':' }}</div>
                        <div class="child-container">
                          <el-form-item
                            label="扣减价格"
                            :key="child.key"
                            :prop="'list.' + index + '.children.' + j + '.price'"
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
                            <el-button size="mini" @click.prevent="removePrivateValue(item, child)" :disabled="isView"
                              >删除属性值</el-button
                            >
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
                            @keyup.enter.native="addPrivateValue(item)"
                          ></el-input>
                        </el-form-item>
                        <el-button
                          class="addbtn"
                          type="primary"
                          size="mini"
                          plain
                          @click="addPrivateValue(item)"
                          :disabled="isView"
                        >
                          添 加
                        </el-button>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>
              </div>
              <div class="empty">
                <el-button type="primary" size="medium" plain @click="addPrivateName()" :disabled="isView">
                  添 加
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="是否推荐" prop="isHandpick">
              <el-switch v-model="form.isHandpick" :active-value="1" :inactive-value="2" :disabled="isView">
              </el-switch>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" size="medium" :disabled="isView">
                <el-radio :label="1" border>上架</el-radio>
                <el-radio :label="2" border>下架</el-radio>
                <el-radio :label="4" border disabled>备份</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="remarks">
              <el-input size="medium" type="textarea" clearable v-model="form.remarks" :disabled="isView"></el-input>
            </el-form-item>
            <el-form-item class="submit">
              <template v-if="!isView">
                <el-button
                  v-if="type === 'add'"
                  v-permission="'admin:goods:add'"
                  type="primary"
                  :loading="loading"
                  @click="submitForm('form')"
                  >确 定</el-button
                >
                <el-button
                  v-else
                  v-permission="'admin:goods:edit'"
                  type="primary"
                  :loading="loading"
                  @click="submitForm('form')"
                  >保 存</el-button
                >
                <el-button @click="resetForm('form')">重 置</el-button>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog title="添加私有属性" :append-to-body="true" :visible.sync="innerVisible" custom-class="inner-dialog">
      <div style="margin-top: -25px">
        <el-form
          status-icon
          v-if="innerVisible"
          ref="form4"
          label-width="120px"
          :model="form4"
          label-position="right"
          :rules="rules4"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="属性名称" prop="goodsPrivateSpecName">
            <el-input size="medium" clearable v-model="form4.goodsPrivateSpecName"></el-input>
          </el-form-item>
          <el-form-item label="属性排序" prop="orderNumber">
            <el-input size="medium" type="number" clearable v-model="form4.orderNumber"></el-input>
          </el-form-item>
          <el-form-item label="是否为单选" prop="onlyOneSelect">
            <el-switch v-model="form4.onlyOneSelect" :active-value="1" :inactive-value="0"> </el-switch>
          </el-form-item>
          <el-form-item label="是否为必选" prop="mustSelect">
            <el-switch v-model="form4.mustSelect" :active-value="1" :inactive-value="0"> </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left: 5px">
        <el-button type="primary" @click="confirmEdit('form4')">确 定</el-button>
        <el-button @click="resetForm('form4')">重 置</el-button>
      </div>
    </el-dialog>
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
  return Math.random().toString(36).substring(2)
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
      if (!this.form.goodsPublicSpecInfos || this.form.goodsPublicSpecInfos.length < 1) {
        return callback(new Error('商品属性不能为空'))
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
      isView: false,
      id: null,
      title: '添加商品',
      type: 'add',
      isCopy: false,
      innerVisible: false, // 内层弹窗
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
        initImg: [],
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
        ratio: [1, 1],
        maxSize: 128,
        type: 'webp',
      },
      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],

      priceCheck: (rule, value, callback) => {
        if (!value || value < 0) {
          return callback(new Error('价格只能为大于0的数字'))
        }
        callback()
      },
      dynamicValidateForm: {
        list: [],
      },

      form4: {
        // 表单信息
        goodsPrivateSpecName: '',
        orderNumber: 1,
        onlyOneSelect: 1,
        mustSelect: 1,
      },
      rules4: {
        // 表单验证规则
        goodsPrivateSpecName: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      dynamicValidateFormPrivate: {
        list: [],
      },
      dynamicValidateFormNoUsed: {
        list: [],
      },
    }
  },
  methods: {
    // 获取商品详情
    async getView(id) {
      try {
        const res = await Goods.view(id) // eslint-disable-line
        Object.assign(this.form, res.data.goods)
        this.form.initImg = [
          {
            id: createId(),
            display: this.form.goodsImage,
            src: '',
            imgId: createId(),
          },
        ]
        res.data.goodsPublicSpecVos.forEach(item => {
          const obj = {}
          obj.goodsPublicSpecName = item.goodsPublicSpec.goodsPublicSpecName
          obj.goodsPublicSpecId = item.goodsPublicSpec.id
          obj.priceFlag = item.goodsPublicSpec.priceFlag
          obj.children = []
          item.goodsPublicSpecInfos.forEach(child => {
            const obj1 = {}
            obj1.id = child.id
            obj1.goodsPublicSpecId = child.goodsPublicSpecId
            obj1.goodsPublicSpecValue = child.goodsPublicSpecValue
            obj1.orderNumber = child.orderNumber
            obj1.end = child.end
            obj1.price = child.price
            obj.children.push(obj1)
          })
          this.dynamicValidateForm.list.push(obj)
        })
        res.data.goodsPrivateSpecVos.forEach(item => {
          const obj = {}
          obj.goodsPrivateSpecName = item.goodsPrivateSpec.goodsPrivateSpecName
          obj.orderNumber = item.goodsPrivateSpec.orderNumber
          obj.onlyOneSelect = item.goodsPrivateSpec.onlyOneSelect
          obj.mustSelect = item.goodsPrivateSpec.mustSelect
          obj.children = []
          item.goodsPrivateSpecInfos.forEach(child => {
            const obj1 = {}
            obj1.goodsPrivateSpecValue = child.goodsPrivateSpecValue
            obj1.orderNumber = child.orderNumber
            obj1.end = child.end
            obj1.price = child.price
            obj.children.push(obj1)
          })
          this.dynamicValidateFormPrivate.list.push(obj)
        })
        res.data.noUsedPublicSpecs.forEach(item => {
          const obj = {}
          obj.goodsPublicSpecId = item.id
          obj.goodsPublicSpecName = item.goodsPublicSpecName
          obj.priceFlag = item.priceFlag
          obj.children = []
          this.dynamicValidateFormNoUsed.list.push(obj)
        })
      } catch (e) {
        console.log(e)
      }
    },

    // 获取所有分类
    async getAllCategory() {
      try {
        const res = await Category.categoryList()
        this.categoryList = res.data.rows
        this.categoryList.forEach(item => {
          const { catName, id } = item
          this.firstCategoryId.push({ catName, id })
        })
        if (this.id) {
          this.updateSecondIdsByFirstId(this.form.firstCategoryId)
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
        this.dynamicValidateForm.list = []
        res.data.forEach(item => {
          const obj = {}
          obj.goodsPublicSpecId = item.id
          obj.goodsPublicSpecName = item.goodsPublicSpecName
          obj.priceFlag = item.priceFlag
          obj.children = []
          this.dynamicValidateForm.list.push(obj)
        })
      } catch (e) {
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
    // 选择一级分类
    firstCategoryIdChange(val) {
      if (val) {
        this.form.secondCategoryId = null
        this.secondCategoryId = []
        this.dynamicValidateForm.list = []
        this.updateSecondIdsByFirstId(val)
      }
    },

    // 选择二级分类
    secondCategoryIdChange() {
      this.getPublicSpec()
    },

    // 提交商品表单
    async submitForm(formName) {
      try {
        this.form.goodsPublicSpecInfos = this.getPublicSpecInfos()
        this.form.goodsPrivateSpecVos = this.getPrivateSpecVos()
        this.form.goodsPublicSpecInfoPrices = this.getPublicSpecPrices()
        if (this.dynamicValidateForm.list.length) {
          this.$refs.dynamicValidateForm.validate(valid => {
            if (!valid) {
              this.$message.error('请将价格信息填写完整')
              return false
            }
          })
        }
        this.$refs[formName].validate(async valid => {
          // eslint-disable-line
          if (valid) {
            try {
              this.loading = true
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
                goodsPrivateSpecVos,
                goodsPublicSpecInfoPrices,
              } = this.form

              let res
              if (this.type === 'add' || this.isCopy) {
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
                  goodsPrivateSpecVos,
                  goodsPublicSpecInfoPrices,
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
                  goodsPrivateSpecVos,
                  goodsPublicSpecInfoPrices,
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
      } catch (e) {
        console.log(e)
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

    addValue(item) {
      // console.log(item)
      if (!item.tempValue) {
        return false
      }
      const obj = item.children.find(child => child.goodsPublicSpecValue === item.tempValue)
      if (!obj) {
        item.children.push({
          goodsPublicSpecValue: item.tempValue,
          key: Date.now(),
          price: item.priceFlag === 1 ? 100 : 0,
          end: 0,
          orderNumber: item.children.length + 1,
        })
        item.tempValue = ''
      } else {
        this.$message.error('属性值已存在')
      }
    },
    addPrivateValue(item) {
      if (!item.tempValue) {
        return false
      }
      const obj = item.children.find(child => child.goodsPrivateSpecValue === item.tempValue)
      if (!obj) {
        item.children.push({
          goodsPrivateSpecValue: item.tempValue,
          key: Date.now(),
          price: 0,
          end: 0,
          orderNumber: item.children.length + 1,
        })
        item.tempValue = ''
      } else {
        this.$message.error('属性值已存在')
      }
    },
    addPrivateName() {
      this.innerVisible = true
    },
    removePublic(item) {
      const index = this.dynamicValidateForm.list.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.list.splice(index, 1)
        this.dynamicValidateFormNoUsed.list.push(item)
      }
    },
    cancelRemovePublic(item) {
      const index = this.dynamicValidateFormNoUsed.list.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateFormNoUsed.list.splice(index, 1)
        this.dynamicValidateForm.list.push(item)
      }
    },
    removePrivate(item) {
      const index = this.dynamicValidateFormPrivate.list.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateFormPrivate.list.splice(index, 1)
      }
    },
    removeValue(item, child) {
      const index = item.children.indexOf(child)
      if (index !== -1) {
        item.children.splice(index, 1)
      }
    },
    removePrivateValue(item, child) {
      const index = item.children.indexOf(child)
      if (index !== -1) {
        item.children.splice(index, 1)
      }
    },
    getPublicSpecInfos() {
      const list = []
      const temp = this.dynamicValidateForm.list.filter(item => item.priceFlag !== 1)
      temp.forEach(item => {
        if (item.children.length) {
          item.children.forEach(child => {
            const obj = {}
            obj.goodsPublicSpecId = item.goodsPublicSpecId
            obj.goodsPublicSpecValue = child.goodsPublicSpecValue
            obj.orderNumber = child.orderNumber ? Number(child.orderNumber) : 1
            obj.end = child.end
            obj.price = child.price ? Number(child.price) : 0
            list.push(obj)
          })
        } else {
          this.$message.error(`请添加属性“${item.goodsPublicSpecName}”的值`)
          return false
        }
      })
      return list
    },
    getPublicSpecPrices() {
      const list = []
      const temp = this.dynamicValidateForm.list.filter(item => item.priceFlag === 1)
      temp.forEach(item => {
        if (item.children.length) {
          item.children.forEach(child => {
            const obj = {}
            obj.goodsPublicSpecId = item.goodsPublicSpecId
            obj.goodsPublicSpecValue = child.goodsPublicSpecValue
            obj.orderNumber = child.orderNumber ? Number(child.orderNumber) : 1
            obj.end = child.end
            obj.price = child.price ? Number(child.price) : 0
            list.push(obj)
          })
        } else {
          this.$message.error(`请添加属性“${item.goodsPublicSpecName}”的值`)
          return false
        }
      })
      return list
    },
    getPrivateSpecVos() {
      const list = []
      if (this.dynamicValidateFormPrivate.list.length) {
        this.dynamicValidateFormPrivate.list.forEach(item => {
          const obj = {}
          obj.goodsPrivateSpec = {}
          obj.goodsPrivateSpec.goodsPrivateSpecName = item.goodsPrivateSpecName
          obj.goodsPrivateSpec.orderNumber = item.orderNumber
          obj.goodsPrivateSpec.onlyOneSelect = item.onlyOneSelect
          obj.goodsPrivateSpec.mustSelect = item.mustSelect
          obj.goodsPrivateSpecInfos = []
          if (item.children.length) {
            item.children.forEach(child => {
              const obj1 = {}
              obj1.goodsPrivateSpecValue = child.goodsPrivateSpecValue
              obj1.orderNumber = child.orderNumber ? Number(child.orderNumber) : 1
              obj1.end = child.end
              obj1.price = child.price ? Number(child.price) : 0
              obj.goodsPrivateSpecInfos.push(obj1)
            })
          } else {
            this.$message.error(`请添加私有属性“${item.goodsPrivateSpecName}”的值`)
            return false
          }
          list.push(obj)
        })
      }
      return list
    },

    // 确认创建属性值
    async confirmEdit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          const obj = this.dynamicValidateFormPrivate.list.find(
            item => item.goodsPrivateSpecName === this[form].goodsPrivateSpecName,
          )
          if (!obj) {
            const { goodsPrivateSpecName, orderNumber, onlyOneSelect, mustSelect } = this[form]
            this.dynamicValidateFormPrivate.list.push({
              goodsPrivateSpecName,
              orderNumber,
              onlyOneSelect,
              mustSelect,
              children: [],
            })
            this.innerVisible = false
            this.resetForm(form)
          } else {
            this.$message.error('属性名已存在')
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
    const { id, isView, isCopy } = this.$route.query
    if (isView) {
      this.isView = true
    }
    if (id) {
      this.id = id
      if (isCopy) {
        this.isCopy = isCopy
      } else {
        this.type = 'edit'
        this.title = '编辑商品'
      }
      await this.getView(id)
    }
    this.getAllCategory()
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
.private-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.el-collapse {
  border-bottom: 0;
  border-top: 0;
}
</style>
