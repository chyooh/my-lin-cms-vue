<template>
  <div class="container form-container">
    <el-form
      :model="filterForm"
      status-icon
      label-position="right"
      ref="filterForm"
      @submit.native.prevent
      class="form"
      inline
    >
      <div class="form-left">
        <div class="main-input">
          <div class="form-item-div form-item-long">
            <el-form-item label="订单号" prop="orderNo">
              <el-input size="mini" clearable v-model="filterForm.orderNo"></el-input>
            </el-form-item>
          </div>

          <div class="form-item-div">
            <el-form-item label="创建时间">
              <el-form-item prop="filter_createTimes">
                <el-date-picker
                  size="mini"
                  v-model="filterForm.filter_createTimes"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始时间"
                  :picker-options="{
                    disabledDate(time) {
                      return time.getTime() > Date.now()
                    },
                  }"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
              <div class="line">-</div>
              <el-form-item prop="filter_createTimee">
                <el-date-picker
                  size="mini"
                  v-model="filterForm.filter_createTimee"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="{
                    disabledDate(time) {
                      return (
                        time.getTime() > Date.now() ||
                        time.getTime() < new Date(filterForm.filter_createTimes + ' 00:00:00')
                      )
                    },
                  }"
                  placeholder="选择结束时间"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="sub-input">
          <el-collapse-transition>
            <div v-show="isOpen">
              <div class="form-item-div">
                <el-form-item label="更新时间">
                  <el-form-item prop="filter_updateTimes">
                    <el-date-picker
                      size="mini"
                      v-model="filterForm.filter_updateTimes"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择开始时间"
                      :picker-options="{
                        disabledDate(time) {
                          return time.getTime() > Date.now()
                        },
                      }"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <div class="line">-</div>
                  <el-form-item prop="filter_updateTimee">
                    <el-date-picker
                      size="mini"
                      v-model="filterForm.filter_updateTimee"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="{
                        disabledDate(time) {
                          return (
                            time.getTime() > Date.now() ||
                            time.getTime() < new Date(filterForm.filter_updateTimes + ' 00:00:00')
                          )
                        },
                      }"
                      placeholder="选择结束时间"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <div class="form-right">
        <div class="form-item-div">
          <el-form-item class="submit">
            <el-button size="mini" @click="isOpen = !isOpen">{{ isOpen ? '关闭' : '开启' }}高级筛选</el-button>
            <el-button size="mini" type="success" @click="exportOrder">订单导出</el-button>
            <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
            <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <sticky-top>
      <el-tabs v-model="activeId" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in status" :key="item.id" :name="item.id">
          <span slot="label" class="tabs-label">{{ item.label }}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="table-title">
        <el-row>
          <el-col :span="4">商品信息</el-col>
          <el-col :span="3">回收价格</el-col>
          <el-col :span="2">预付款</el-col>
          <el-col :span="2">运费</el-col>
          <el-col :span="4">加价券</el-col>
          <!-- <el-col :span="2">交易状态</el-col> -->
          <el-col :span="6">用户地址</el-col>
          <el-col :span="3">备注</el-col>
        </el-row>
      </div>
    </sticky-top>
    <div class="table-container" v-loading="loading">
      <template v-if="tableData.length > 0">
        <div class="goods-item" v-for="(goods, index) in tableData" :key="index">
          <el-row class="goods-title">
            <div class="margin-right10">{{ goods.order.createTime }}</div>
            <div class="margin-right10">订单号：{{ goods.order.orderNo }}</div>
            <div>
              订单状态：<span class="status-text">{{ goods.order.statusText }}</span>
            </div>
          </el-row>
          <el-row class="content order-info">
            <el-col :span="4">
              <div class="shangpin">
                <img :src="goods.goodsVos[0].goods.goodsImage" alt="" />
                <div class="right-shangpin">
                  <div class="name">{{ goods.goodsVos[0].goods.goodsName }}</div>
                  <div class="tag-container">
                    <!-- <span>属性值：</span> -->
                    <!-- <div> -->
                    <el-tag size="small" type="info" v-for="(item, index) in goods.specs" :key="index">
                      {{ item }}
                    </el-tag>
                    <!-- </div> -->
                  </div>
                  <!-- <div>
                    <l-icon name="shen" color="#ff9900" width="12" height="12"></l-icon>
                    <l-icon name="qi" color="orange" width="12" height="12"></l-icon>
                  </div> -->
                  <!-- <div>
                    <el-button size="mini" type="primary" @click="modifyPrice(goods.id)">修改价格</el-button>
                    <el-button size="mini" @click="addOrder(goods.id)">补订单</el-button>
                  </div> -->
                </div>
              </div>
            </el-col>
            <el-col :span="3">
              <div>{{ Util.getPriceString(goods.order.price) }}</div>
              <div v-if="goods.coupons.length">(含加价券)</div>
            </el-col>
            <el-col :span="2">
              <div>{{ Util.getPriceString(goods.order.prePayment || 0) }}</div>
            </el-col>
            <el-col :span="2">
              <div>{{ Util.getPriceString(goods.order.postFee || 0) }}</div>
            </el-col>
            <el-col :span="4">
              <template v-if="goods.coupons.length">
                <template v-for="(item, index) in goods.coupons">
                  <el-tag size="small" type="danger" v-if="item && item.formValue" :key="index">
                    {{ item && '￥' + item.formValue }}
                  </el-tag>
                </template>
              </template>
              <span v-else>-</span>
            </el-col>
            <!-- <el-col :span="2">
              {{ goods.order.statusText }}
            </el-col> -->
            <el-col :span="6">
              <div>{{ goods.orderShipping.senderName }}</div>
              <div>{{ goods.orderShipping.senderMobile }}</div>
              <div>
                {{
                  `${goods.orderShipping.senderState} ${goods.orderShipping.senderCity} ${goods.orderShipping.senderDistrict} ${goods.orderShipping.senderAddress}`
                }}
              </div>
            </el-col>
            <el-col :span="3">{{ goods.order.remark || '-' }}</el-col>
          </el-row>
          <el-row class="content">
            <el-col>
              <div class="margin-bottom10" v-if="goods.order.status === 7">
                取消原因：<span>{{ goods.order.cancelReason }}</span>
              </div>
              <el-button type="info" size="mini" @click="checkDetail(goods.order.orderNo)">查看详情</el-button>
              <template v-if="goods.order.status === 1">
                <el-button
                  v-permission="'admin:order:receive'"
                  type="success"
                  size="mini"
                  @click="pickupTheOrder(goods.order.orderNo)"
                  >审核通过</el-button
                >
              </template>
              <template v-if="goods.order.status === 7">
                <el-button
                  v-permission="'admin:order:cancel'"
                  type="danger"
                  size="mini"
                  @click="passCancel(goods.order.orderNo)"
                  >通过取消请求</el-button
                >
                <el-button
                  v-permission="'admin:order:cancel:reject'"
                  type="warning"
                  size="mini"
                  @click="rejectCancel(goods.order.orderNo)"
                  >驳回取消请求</el-button
                >
              </template>
              <!-- <el-button type="primary" size="mini">交易快照</el-button> -->
              <template v-if="goods.order.status < 3">
                <el-button
                  v-permission="'admin:order:cancel'"
                  type="danger"
                  size="mini"
                  @click="confirmCancel(goods.order.orderNo)"
                  >取消订单</el-button
                >
              </template>
              <template v-if="goods.order.status === 9">
                <el-button
                  v-permission="'admin:order:prepayment:pay'"
                  type="warning"
                  size="mini"
                  @click="payPrepayment(goods.order.orderNo)"
                  >支付预付款</el-button
                >
              </template>
              <template v-if="goods.order.status === 4 || goods.order.status > 8">
                <el-button
                  v-permission="'admin:order:assessment'"
                  type="success"
                  size="mini"
                  @click="assess(goods.goodsVos[0])"
                  >评 估</el-button
                >
              </template>
              <template v-if="goods.order.status === 5">
                <el-button
                  v-permission="'admin:order:unfreeze'"
                  type="success"
                  size="mini"
                  @click="unfreeze(goods.order.orderNo)"
                  >解冻预授权</el-button
                >
              </template>
            </el-col>
          </el-row>
          <!-- <el-row class="content">
            <el-col>
              风控信息：【风控建议】风控通过，需核实用户家庭/公司地址，详细到门牌号。走区块链流程（即收集并录入凭证：身份证图片、纸质签收回单须有本人签名、沟通记录等，如有原件，注意保存原件。）。核实收货人与下单人关系，收取两方身份证复印件。
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col> <l-icon name="edit"></l-icon>用户留言：无 </el-col>
          </el-row>
          <el-row class="content"><span class="beizhu">无备注</span></el-row> -->
        </div>
      </template>
      <div v-else class="empty">暂无订单</div>
      <el-row></el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Order from '@/model/order'
// import { orderList } from './data'
import Util from '@/util/util'
// import LinTable from '@/component/base/table/lin-table'

export default {
  data() {
    return {
      id: 0, // 用户id
      // editIndex: null, // 编辑的行
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableData: [], // 表格数据
      filterForm: {
        orderNo: null,
        filter_createDates: null,
        filter_createDatee: null,
        filter_updateTimes: null,
        filter_updateTimee: null,
        status: null,
      },
      Util,
      activeId: '1',
      // 订单状态  1.待处理  2.待取件  3.运输中  4.已签收  5.交易完成 6.订单取消 7.取消中 8.已评价 9.待支付预付款 10.已支付预付款 11.已评估
      status: [
        { id: '1', label: '全部', value: null },
        { id: '2', label: '待处理', value: 1 },
        { id: '3', label: '待取件', value: 2 },
        { id: '4', label: '运输中', value: 3 },
        { id: '5', label: '已签收', value: 4 },
        { id: '10', label: '待支付预付款', value: 9 },
        { id: '11', label: '已支付预付款', value: 10 },
        { id: '12', label: '已评估', value: 11 },
        { id: '6', label: '已完成', value: 5 },
        { id: '7', label: '已取消', value: 6 },
        { id: '8', label: '取消中', value: 7 },
        // { id: '9', label: '已评价', value: 8 },
      ],
      isOpen: false,
      loading: false,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getOrderList() {
      const { currentPage } = this
      // const loading = this.$loading({ target: '.table-container' })
      this.loading = true
      try {
        const res = await Order.list({
          ...this.filterForm,
          pageSize: this.pageCount,
          pageNumber: currentPage,
        }) // eslint-disable-line
        // console.log(res)
        // loading.close()
        this.loading = false
        res.data.rows.forEach(item => {
          item.order.createTime = Util.getDateString(item.order.createTime)
          item.order.statusText = this.getStatusText(item.order.status)
          item.specs = []
          item.goodsVos[0].goodsPublicSpecVos.forEach(value => {
            if (value.goodsPublicSpec.priceFlag) {
              value.goodsPublicSpecInfos.forEach(el => {
                if (el) item.specs.push(el.goodsPublicSpecValue)
              })
            }
          })
          // item.goodsVos[0].goodsPrivateSpecVos.forEach(value => {
          //   value.goodsPrivateSpecInfos.forEach(el => {
          //     if (el) item.specs.push(el.goodsPrivateSpecValue)
          //   })
          // })
          item.goodsVos[0].userOrderPrice = item.order.price
          item.goodsVos[0].orderNo = item.order.orderNo
        })
        this.tableData = res.data.rows
        // console.log(this.tableData)
        this.total_nums = res.data.total
      } catch (e) {
        // loading.close()
        this.loading = false
        console.log(e)
      }
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '待处理'
        case 2:
          return '待取件'
        case 3:
          return '运输中'
        case 4:
          return '已签收'
        case 5:
          return '交易完成'
        case 6:
          return '订单取消'
        case 7:
          return '订单取消中'
        case 8:
          return '已评价'
        case 9:
          return '待支付预付款'
        case 10:
          return '已支付预付款'
        case 11:
          return '已评估'
        default:
          return '待处理'
      }
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.backTop()
      this.currentPage = val
      // console.log(this.currentPage)
      await this.getOrderList()
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.currentPage = 1
          await this.getOrderList()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.isOpen = false
      this.$refs[formName].resetFields()
      this.getOrderList()
    },

    modifyPrice(id) {
      console.log(id)
    },
    addOrder(id) {
      console.log(id)
    },
    handleTabClick() {
      const obj = this.status.find(item => item.id === this.activeId)
      if (this.filterForm.status !== obj.value) {
        this.filterForm.status = obj.value
        this.getOrderList()
      }
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    handleScroll(e) {
      this.scrollY = e.target.scrollTop
      this.showBackTop = e.target.scrollTop > 100 // 页面滚动距离大于100的时候显示回到top的标识
      this.targetDom = e
    },
    // 滑动到顶部
    backTop() {
      const _this = this
      let timer = requestAnimationFrame(function fn() {
        const currentTop = _this.targetDom.target.scrollTop
        if (currentTop > 0) {
          // 平滑滚动
          const scrollSpeed = currentTop + (0 - currentTop) / 6
          _this.targetDom.target.scrollTop = scrollSpeed
          timer = requestAnimationFrame(fn)
        } else {
          cancelAnimationFrame(timer)
        }
      })
    },
    confirmCancel(orderNo) {
      this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.cancel(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    passCancel(orderNo) {
      this.$confirm('此操作将同意用户的取消订单请求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.passCancel(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    rejectCancel(orderNo) {
      this.$confirm('此操作将拒绝用户的取消订单请求, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.rejectCancel(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    pickupTheOrder(orderNo) {
      this.$confirm('此操作将通过该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.pickupTheOrder(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    payPrepayment(orderNo) {
      this.$confirm('此操作将支付预付款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.payPrepayment(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    unfreeze(orderNo) {
      this.$confirm('此操作将解冻该订单的预授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Order.unfreeze(orderNo)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getOrderList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    assess(goods) {
      this.$router.push({
        path: '/order/assess',
        query: { goods },
      })
    },
    async exportOrder() {
      const { currentPage } = this
      // const loading = this.$loading({ target: '.table-container' })
      this.loading = true
      try {
        const res = await Order.exportOrder({
          ...this.filterForm,
          pageSize: this.pageCount,
          pageNumber: currentPage,
        }) // eslint-disable-line
        console.log(res)
        // loading.close()
        this.loading = false
        // res.data.rows.forEach(item => {
        //   item.order.createTime = Util.getDateString(item.order.createTime)
        //   item.order.statusText = this.getStatusText(item.order.status)
        // })
        // this.tableData = res.data.rows
        // // console.log(this.tableData)
        // this.total_nums = res.data.total
      } catch (e) {
        // loading.close()
        this.loading = false
        console.log(e)
      }
    },
    checkDetail(id) {
      this.$router.push({
        path: '/order/detail',
        query: { id },
      })
    },
  },
  async created() {
    await this.getOrderList()
    // this.tableData = orderList
  },
  mounted() {
    // 监听页面滚动
    window.addEventListener('scroll', this.handleScroll, true)
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  beforeRouteEnter(to, from, next) {
    // to.meta.keepAlive = true;
    to.meta.keepAlive = true
    next()
  },
  // beforeRouteLeave(to, from, next) {
  //   // to.meta.keepAlive = true;
  //   const { path } = to
  //   if (path === '/about') {
  //     // console.log('t')
  //     from.meta.keepAlive = false
  //   } else {
  //     // console.log('f')
  //     from.meta.keepAlive = true
  //   }
  //   next()
  // },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
  .form {
    display: flex;
    .form-left {
      flex: 1;
    }
    .form-right {
      width: 210px;
      text-align: right;
    }
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
// .my-draw {
//   .form {
//     padding: 0 20px;
//   }
//   .el-date-editor.el-input {
//     width: 100%;
//   }
// }

.table-title {
  padding: 5px 0px 20px;
  font-size: 14px;
  border-bottom: solid 1px #ddd;
  .el-col {
    font-weight: 700;
    text-align: center;
    padding: 0 10px;
  }
  .el-col:first-child {
    text-align: left;
  }
}
.table-container {
  font-size: 12px;
  position: relative;
  background-color: #ffffff;
  .el-col {
    text-align: center;
  }
  .el-col:first-child {
    text-align: left;
  }
  .goods-title {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f1f1f1;
    .status-text {
      color: $theme;
      font-weight: 700;
    }
  }
  .goods-item {
    border: solid 1px #cccccc;
    border-bottom: 0;
    margin-bottom: 20px;
  }
  .content {
    padding: 10px 0;
    border-bottom: solid 1px #cccccc;
    .el-col {
      padding: 0 10px;
      div {
        margin: 5px 0;
      }
    }
    .beizhu {
      border-bottom: dashed 1px #cccccc;
    }
    .el-tag {
      margin-bottom: 5px;
    }

    .shangpin {
      display: flex;
      align-items: flex-start;
      .right-shangpin {
        margin: 0;
      }
      img {
        width: 70px;
        margin-right: 10px;
      }
      .name {
        color: $theme;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .order-info {
    display: flex;
    align-items: center;
  }
  .tag-container {
    .el-tag {
      margin-right: 5px;
      line-height: 16px;
      height: 17px;
    }
  }
}
.empty {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 14px;
}
</style>
