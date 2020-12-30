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
            label-width="156px"
            @submit.native.prevent
          >
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="form.type" size="medium">
                <el-radio :label="1" border>平台券</el-radio>
                <el-radio :label="2" border>券码券</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="优惠券名称" prop="name">
              <el-input size="medium" clearable v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="可发放总数" prop="totalNum">
              <el-input size="medium" type="number" clearable v-model="form.totalNum"></el-input>
            </el-form-item>
            <el-form-item label="每人限制领取" prop="limitNum">
              <el-input size="medium" type="number" clearable v-model="form.limitNum"></el-input>
            </el-form-item>

            <el-form-item label="领取后有效天数" prop="vaildDays">
              <el-input size="medium" type="number" clearable v-model="form.vaildDays"></el-input>
            </el-form-item>

            <el-form-item label="面额" prop="formValue">
              <el-input size="medium" type="number" clearable v-model="form.formValue"></el-input>
            </el-form-item>

            <el-form-item label="使用门槛" prop="threshold">
              <el-radio-group v-model="form.threshold" size="medium">
                <el-radio :label="1" border>不限制</el-radio>
                <el-radio :label="2" border>满额使用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="门槛额度" prop="thresholdValue" v-if="form.threshold === 2">
              <el-input size="medium" type="number" clearable v-model="form.thresholdValue"></el-input>
            </el-form-item>

            <el-form-item prop="startTime" label="优惠券开始时间">
              <el-date-picker
                size="medium"
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
                size="medium"
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
            <el-form-item label="是否可叠加使用" prop="overlayUse">
              <el-switch
                v-model="form.overlayUse"
                :active-value="1"
                active-text="是"
                :inactive-value="2"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="指定商品" prop="assign">
              <el-switch v-model="form.assign" :active-value="2" :inactive-value="1"> </el-switch>
            </el-form-item>
            <el-form-item label="添加商品" v-if="form.assign === 2">
              <div v-if="selectedGoods.length > 0" class="goods-tags">
                <el-tag
                  class="goodsid-tag"
                  v-for="item in selectedGoods"
                  size="small"
                  :key="item.goodsId"
                  effect="plain"
                >
                  {{ item.goodsName }}
                </el-tag>
              </div>
              <div>
                <el-button
                  type="primary"
                  size="medium"
                  plain
                  @click="addGoods()"
                  v-permission="['admin:coupon:edit', 'admin:coupon:add']"
                >
                  {{ selectedGoods.length ? '修 改' : '添 加' }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status" size="medium">
                <el-radio :label="1" border>上架</el-radio>
                <el-radio :label="2" border>下架</el-radio>
                <!-- <el-radio :label="3" border>回收站</el-radio> -->
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

    <!-- 弹窗 -->
    <el-dialog center :visible.sync="outerVisible" custom-class="outer-dialog">
      <div slot="title" class="outer-title">添加商品</div>
      <div class="container form-container">
        <el-form
          :model="filterForm"
          status-icon
          label-position="right"
          @submit.native.prevent
          class="goods-form"
          inline
        >
          <div class="form-item-div">
            <el-form-item label="商品名称" prop="filter_goodsName">
              <el-input size="mini" clearable v-model="filterForm.filter_goodsName"></el-input>
            </el-form-item>
          </div>

          <div class="form-item-div">
            <el-form-item label="一级分类" prop="filter_firstCategoryId">
              <el-select
                size="mini"
                v-model="filterForm.filter_firstCategoryId"
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
          </div>
          <div class="form-item-div">
            <el-form-item label="二级分类" prop="filter_secondCategoryId">
              <el-select size="mini" v-model="filterForm.filter_secondCategoryId" placeholder="请选择">
                <el-option
                  v-for="(group, index) in secondCategoryId"
                  :key="index"
                  :label="group.catName"
                  :value="group.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="form-item-div">
            <el-form-item class="submit">
              <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="tableData" stripe v-loading="loading1" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45"> </el-table-column>
          <el-table-column prop="goodsId" label="id" width="50"> </el-table-column>
          <el-table-column prop="goodsName" label="名称"> </el-table-column>
          <el-table-column label="一级分类" width="80" prop="firstCategoryName"> </el-table-column>
          <el-table-column label="二级分类" width="80" prop="secondCategoryName"> </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageSize"
          :current-page="pageNumber"
          layout="prev, pager, next, jumper"
          :total="total_nums"
        >
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="close()">关 闭</el-button>
        <el-button type="primary" plain @click="confirmDone()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Goods from '@/model/goods'
import Category from '@/model/category'
import Coupon from '@/model/coupon'
import Util from '@/util/util'

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
        assign: 1,
        overlayUse: 2,
        goodsIds: null,
        status: 1,
        type: 1,
        vaildDays: null,
      },
      rules: {
        name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        totalNum: [{ validator: checkAmount, trigger: ['blur', 'change'], required: true }],
        limitNum: [{ validator: checkAmount, trigger: ['blur', 'change'], required: true }],
        formValue: [{ validator: checkPrice, required: true }],
      },
      loading: false,
      outerVisible: false,
      filterForm: {
        filter_goodsName: null,
        filter_firstCategoryId: null, // 一级分类
        filter_secondCategoryId: null, // 二级分类
      },

      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],

      pageNumber: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      tableData: [], // 表格数据

      selectedGoods: [],
      tempGoods: [],
      loading1: false,
      total_nums: 0, // 分组内的用户总数
    }
  },
  methods: {
    // 获取商品详情
    async getView(id) {
      try {
        const res = await Coupon.view(id) // eslint-disable-line
        Object.assign(this.form, res.data)
        this.form.startTime = res.data.startTime ? Util.getDateString(res.data.startTime) : res.data.startTime
        this.form.endTime = res.data.endTime ? Util.getDateString(res.data.endTime) : res.data.endTime
        if (res.data.assign === 2 && res.data.goodsCouponVos) {
          this.selectedGoods = res.data.goodsCouponVos
        }
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
          if (this.form.assign === 2 && this.selectedGoods.length < 1) {
            this.$message.error('请添加指定商品')
            return
          }
          if (!this.form.vaildDays) {
            if (!this.form.startTime || !this.form.endTime) {
              this.$message.error('开始时间或者结束时间不能为空')
              return
            }
          }
          const list = []
          this.selectedGoods.forEach(item => {
            list.push(item.goodsId)
          })
          this.form.goodsIds = list.join(',')
          try {
            this.loading = true
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
              assign,
              overlayUse,
              goodsIds,
              status,
              type,
              vaildDays,
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
                assign,
                overlayUse,
                goodsIds,
                status,
                type,
                vaildDays,
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
                assign,
                overlayUse,
                goodsIds,
                status,
                type,
                vaildDays,
              })
            }
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.$router.push('/coupon/list')
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

    addGoods() {
      if (this.categoryList.length < 1) {
        this.getAllCategory()
        this.getGoodsList()
      }
      this.outerVisible = true
    },
    submitFilterForm() {
      this.getGoodsList()
    },
    async getGoodsList() {
      const { pageNumber, pageSize } = this
      try {
        this.loading1 = true
        const res = await Goods.goodsList({ ...this.filterForm, pageSize, pageNumber }) // eslint-disable-line
        // console.log(res)
        this.loading1 = false
        res.data.rows.forEach(item => {
          item.goodsName = item.goods.goodsName
          item.goodsId = item.goods.id
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
      } catch (e) {
        this.loading1 = false
        console.log(e)
      }
    },
    // 获取所有分类
    async getAllCategory() {
      try {
        this.loading1 = true
        const res = await Category.categoryList()
        this.categoryList = res.data.rows
        this.categoryList.forEach(item => {
          const { catName, id } = item
          this.firstCategoryId.push({ catName, id })
        })
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
        console.log(e)
      }
    },
    firstCategoryIdChange(val) {
      this.filterForm.filter_secondCategoryId = null
      this.secondCategoryId = []
      const obj = this.categoryList.find(item => item.id === val)
      if (obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },
    handleSelectionChange(val) {
      this.tempGoods = val
    },
    close() {
      this.outerVisible = false
    },
    confirmDone() {
      if (this.tempGoods.length < 1) {
        this.$message.info('请至少选择一个商品')
      } else {
        this.selectedGoods = this.tempGoods
        this.outerVisible = false
      }
    },

    // 切换table页
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getGoodsList()
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
