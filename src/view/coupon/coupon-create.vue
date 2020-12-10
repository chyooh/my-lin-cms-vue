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
            <el-form-item label="商品属性" prop="goodsPublicSpecIds">
              <div class="public-spec-container">
                <el-cascader
                  :value="form.goodsPublicSpecList"
                  :options="publicSpec"
                  :props="props"
                  clearable
                  @change="publicSpecChange"
                  size="medium"
                ></el-cascader>

                <el-form
                  v-if="priceForm.priceList.length"
                  :model="priceForm"
                  ref="priceForm"
                  label-width="100px"
                  class="price-form"
                >
                  <el-form-item
                    v-for="(item, index) in priceForm.priceList"
                    :label="item.label"
                    :key="item.id"
                    :prop="'priceList.' + index + '.price'"
                    :rules="{
                      validator: priceCheck,
                      trigger: 'blur',
                    }"
                  >
                    <el-input type="number" :min="1" v-model="item.price" size="mini"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-form-item>

            <el-form-item label="私有属性" prop="goodsPrivateSpecIds">
              <el-table :data="privateSpec" v-loading="loading">
                <el-table-column fixed prop="id" label="id" width="60"> </el-table-column>
                <el-table-column fixed prop="goodsPrivateSpecName" label="规格名称" width="100"> </el-table-column>
                <el-table-column prop="orderNumber" label="排序" width="50"> </el-table-column>
                <el-table-column label="规格值">
                  <template slot-scope="props">
                    <el-tag
                      size="mini"
                      effect="plain"
                      v-for="(item, index) in props.row.value"
                      :key="index"
                      class="private-tag"
                      >{{ item }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="140">
                  <template slot-scope="props">
                    <el-button type="primary" plain @click="editSpec(props.row)" size="mini">编辑</el-button>
                    <el-button type="danger" plain @click="handleDeletePrivate(props.row)" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" plain size="medium" @click="createSpec">添 加</el-button>
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
    <!-- 弹窗 -->
    <el-dialog center :visible.sync="outerVisible" custom-class="outer-dialog" fullscreen>
      <div slot="title" class="outer-title">私有属性</div>
      <div class="container">
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :lg="10" :md="16" :sm="20" :xs="20">
            <div class="header">{{ title2 }}</div>
            <el-form
              status-icon
              :rules="rules3"
              :model="form3"
              ref="form3"
              label-position="right"
              label-width="120px"
              @submit.native.prevent
            >
              <el-form-item label="规格名名称" prop="goodsPublicSpecName">
                <el-input size="medium" clearable v-model="form3.goodsPrivateSpecName"></el-input>
              </el-form-item>
              <el-form-item label="规格名排序" prop="orderNumber">
                <el-input size="medium" type="number" clearable v-model="form3.orderNumber"></el-input>
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" :loading="loading3" @click="submitFormOuter('form3')">保 存</el-button>
                <el-button @click="resetForm('form3')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :lg="14" :md="20" :sm="24" :xs="24">
            <div class="header">
              <div>规格值列表</div>
              <el-button type="primary" plain @click="createValue" size="medium">添加规格值</el-button>
            </div>

            <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
              <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
              <el-table-column fixed prop="goodsPrivateSpecValue" label="规格值名称" width="100"> </el-table-column>
              <el-table-column sortable prop="orderNumber" label="排序" width="100"> </el-table-column>
              <el-table-column sortable prop="createTime" label="创建时间" min-width="200"> </el-table-column>
              <el-table-column label="操作" fixed="right" width="235">
                <template slot-scope="props">
                  <el-button type="primary" plain @click="handleEdit(props.row)" size="mini">编辑</el-button>
                  <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 弹窗 -->
        <el-dialog :title="title1" :append-to-body="true" :visible.sync="innerVisible" custom-class="inner-dialog">
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
              <el-form-item label="规格值名称" prop="goodsPrivateSpecValue">
                <el-input size="medium" clearable v-model="form4.goodsPrivateSpecValue"></el-input>
              </el-form-item>
              <el-form-item label="规格值排序" prop="orderNumber">
                <el-input size="medium" type="number" clearable v-model="form4.orderNumber"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer" style="padding-left: 5px">
            <el-button type="primary" @click="confirmEdit('form4')">确 定</el-button>
            <el-button @click="resetForm('form4')">重 置</el-button>
          </div>
        </el-dialog>
      </div>
      <div slot="footer">
        <el-button type="primary" plain :loading="loading" @click="confirmDone()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'
import User from '@/model/user'
import Goods from '@/model/goods'
import Public from '@/model/public-spec'
import Private from '@/model/private-spec'
import Category from '@/model/category'
import Coupon from '@/model/coupon'

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
  inject: ['eventBus'],
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
      if (!this.form.goodsPublicSpecIds) {
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
      title: '添加商品',
      title1: '添加规格值',
      title2: '添加规格名',
      type: 'add',
      type1: 'add',
      type2: 'add',
      outerVisible: false, // 外层弹窗
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
        goodsPublicSpecIds: null,
        goodsPrivateSpecIds: null,
        goodsPublicSpecList: [],
        initImg: [],
        price: null,
      },
      rules: {
        goodsName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        firstCategoryId: [{ required: true, message: '一级分类不能为空' }],
        secondCategoryId: [{ required: true, message: '二级分类不能为空' }],
        avgPrice: [{ validator: checkPrice, required: true }],
        goodsImage: [{ validator: checkImg, trigger: ['blur', 'change'], required: true }],
        goodsPublicSpecIds: [{ validator: checkPublic, trigger: ['blur', 'change'], required: true }],
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
      publicSpec: [],
      privateSpec: [],
      publicSpecInfo: [],
      loading1: false,
      loading3: false,
      priceForm: {
        priceList: [],
      },

      baseForm3: {
        goodsPrivateSpecName: '',
        orderNumber: 1,
      },
      cacheForm3: {
        goodsPrivateSpecName: '',
        orderNumber: 1,
      },
      form3: {
        goodsPrivateSpecName: '',
        orderNumber: 1,
      },
      rules3: {
        goodsPrivateSpecName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      tableData: [],
      baseForm4: {
        // 表单信息
        goodsPrivateSpecValue: '',
        orderNumber: 1,
      },
      form4: {
        // 表单信息
        goodsPrivateSpecValue: '',
        orderNumber: 1,
      },
      cacheForm4: {
        // 缓存第一次的表单信息
        goodsPrivateSpecValue: '',
        orderNumber: 1,
      },
      rules4: {
        // 表单验证规则
        goodsPrivateSpecValue: [{ required: true, message: '规格值名称不能为空', trigger: 'blur' }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      priceCheck: (rule, value, callback) => {
        if (!value || value < 1) {
          return callback(new Error('价格只能为大于0的数字'))
        }
        callback()
      },
      goodsPrivateSpec: null,
      goodsPrivateSpecInfo: [],
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
        const priceList = []
        res.data.goodsPublicSpecVos.forEach(item => {
          const ele1 = item.goodsPublicSpec.id
          const isPrice = item.goodsPublicSpec.priceFlag === 1
          item.goodsPublicSpecInfoVos.forEach(child => {
            if (isPrice) {
              const obj = {}
              obj.id = child.goodsPublicSpecInfo.id
              obj.label = `${item.goodsPublicSpec.goodsPublicSpecName}/${
                child.goodsPublicSpecInfo.goodsPublicSpecValue
              }`
              obj.price = child.goodsPrices[0].price
              priceList.push(obj)
            }
            const ele2 = child.goodsPublicSpecInfo.id
            list.push([ele1, ele2])
          })
        })
        this.form.goodsPublicSpecList = list
        this.priceForm.priceList = priceList
        this.form.goodsPublicSpecIds = this.publicSpecIdsTransform(list)
        const list1 = []
        res.data.goodsPrivateSpecVos.forEach(item => {
          const obj = {}
          obj.id = item.goodsPrivateSpec.id
          obj.goodsPrivateSpecName = item.goodsPrivateSpec.goodsPrivateSpecName
          obj.orderNumber = item.goodsPrivateSpec.orderNumber
          obj.value = []
          item.goodsPrivateSpecInfos.forEach(child => {
            obj.value.push(child.goodsPrivateSpecValue)
          })
          list1.push(obj)
        })
        this.privateSpec = list1
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

    // 获取所有公有属性
    async getAllPublicSpec() {
      try {
        const res = await Public.all()
        if (res.data.length) {
          this.publicSpecInfo = res.data
          res.data.forEach(item => {
            const obj = {}
            obj.value = item.goodsPublicSpec.id
            obj.label = item.goodsPublicSpec.goodsPublicSpecName
            obj.children = []
            if (item.goodsPublicSpecInfoVos.length) {
              item.goodsPublicSpecInfoVos.forEach(child => {
                const obj1 = {}
                obj1.value = child.goodsPublicSpecInfo.id
                obj1.label = child.goodsPublicSpecInfo.goodsPublicSpecValue
                obj.children.push(obj1)
              })
            }
            this.publicSpec.push(obj)
          })
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

    // 生成私有属性id
    getPrivateIds() {
      const list = []
      this.privateSpec.forEach(item => {
        list.push(item.id)
      })
      return list.join(',')
    },

    // 提交商品表单
    async submitForm(formName) {
      this.$refs.priceForm.validate(valid => {
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
            this.form.goodsPrivateSpecIds = this.getPrivateIds()
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
              price,
              goodsPublicSpecIds,
              goodsPrivateSpecIds,
            } = this.form

            let res
            if (this.type === 'add') {
              res = await Goods.save({
                id,
                goodsName,
                firstCategoryId,
                secondCategoryId,
                goodsImage,
                isHandpick,
                status,
                remarks,
                avgPrice,
                price,
                goodsPublicSpecIds,
                goodsPrivateSpecIds,
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
                price,
                goodsPublicSpecIds,
                goodsPrivateSpecIds,
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
        this.form.goodsPublicSpecIds = this.publicSpecIdsTransform(val)
        this.priceForm.priceList = this.filterPriceFlag(val)
        this.form.price = this.priceTransform()
      } else {
        this.form.goodsPublicSpecIds = null
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

    // 添加私有属性
    createSpec() {
      this.type2 = 'add'
      this.title2 = '添加规格名'
      this.form3 = { ...this.baseForm3 }
      this.cacheForm3 = { ...this.baseForm3 }
      this.outerVisible = true
    },

    // 编辑私有属性
    editSpec(val) {
      this.type2 = 'edit'
      this.title2 = '编辑规格名'
      this.form3.goodsPrivateSpecName = val.goodsPrivateSpecName
      this.form3.orderNumber = val.orderNumber

      this.cacheForm3 = { ...this.form3 }
      this.goodsPrivateSpec = val
      this.getInfoList()
      this.outerVisible = true
    },
    handleDeletePrivate(val) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Private.delete(val.id)

          const idx = this.privateSpec.findIndex(item => item.id === val.id)
          this.privateSpec.splice(idx, 1)
          this.loading = false
          this.$message.success(`${res.msg}`)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    // 确认创建规格名
    async submitFormOuter(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (
            this.cacheForm3.goodsPrivateSpecName !== this.form3.goodsPrivateSpecName
            || this.cacheForm3.orderNumber !== this.form3.orderNumber
          ) {
            try {
              this.loading3 = true
              let res
              if (this.type2 === 'add') {
                res = await Private.save(this.form3)
                this.goodsPrivateSpec = res.data
              } else {
                this.form3.id = this.goodsPrivateSpec.id
                res = await Private.update(this.form3)
                Object.assign(this.goodsPrivateSpec, this.form3)
              }
              this.loading3 = false
              this.$message.success(`${res.msg}`)
            } catch (e) {
              this.loading3 = false
              console.log(e)
            }
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
    // 创建私有属性值
    createValue() {
      if (!this.goodsPrivateSpec) {
        this.$message.error('请先创建规格名')
        return false
      }
      this.form4 = { ...this.baseForm4 }
      this.cacheForm4 = { ...this.baseForm4 }
      this.type1 = 'add'
      this.title1 = '添加规格值'
      this.innerVisible = true
    },

    // 编辑属性值
    handleEdit(val) {
      this.id = val.id
      this.form4.goodsPrivateSpecValue = val.goodsPrivateSpecValue
      this.form4.orderNumber = val.orderNumber

      this.cacheForm4 = { ...this.form4 }
      this.type1 = 'edit'
      this.title1 = '修改规格值'
      this.innerVisible = true
    },

    // 删除属性值
    handleDelete(val) {
      this.$confirm('此操作将永久删除该规格值, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Private.infoDelete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getInfoList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },

    // 确认创建属性值
    async confirmEdit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          if (
            this.cacheForm4.goodsPrivateSpecValue !== this.form4.goodsPrivateSpecValue
            || this.cacheForm4.orderNumber !== this.form4.orderNumber
          ) {
            try {
              let res
              this.form4.goodsPrivateSpecId = this.goodsPrivateSpec.id
              if (this.type1 === 'add') {
                res = await Private.infoSave(this.form4)
              } else {
                this.form4.id = this.id
                res = await Private.infoUpdate(this.form4)
              }
              this.$message.success(`${res.msg}`)
              this.innerVisible = false
              this.getInfoList()
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },

    // 确认添加私有属性
    confirmDone() {
      if (this.goodsPrivateSpecInfo.length < 1) {
        this.$message.error('请添加规格值')
        return false
      }
      const obj = {}
      obj.id = this.goodsPrivateSpec.id
      obj.goodsPrivateSpecName = this.goodsPrivateSpec.goodsPrivateSpecName
      obj.orderNumber = this.goodsPrivateSpec.orderNumber
      obj.value = []
      this.goodsPrivateSpecInfo.forEach(child => {
        obj.value.push(child.goodsPrivateSpecValue)
      })
      if (this.type2 === 'add') {
        this.privateSpec.push(obj)
      } else {
        const idx = this.privateSpec.findIndex(item => item.id === obj.id)
        this.privateSpec.splice(idx, 1, obj)
      }
      this.outerVisible = false
    },
    // 获取规格值列表
    async getInfoList() {
      try {
        this.loading = true
        const res = await Private.infoList(this.goodsPrivateSpec.id)
        if (res.data.length) {
          res.data.forEach(item => {
            item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
          })
          this.tableData = res.data
          this.goodsPrivateSpecInfo = res.data
        } else {
          this.tableData = []
          this.goodsPrivateSpecInfo = []
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
  },

  async created() {
    try {
      const res = await Coupon.list(1)
      console.log(res)
    } catch (e) {
      console.log(e)
    }
    const { id } = this.$route.query
    if (id) {
      this.type = 'edit'
      this.title = '编辑商品'
      await this.getView(id)
    }
    await this.getAllCategory()
    await this.getAllPublicSpec()
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
