<template>
  <div class="container">
    <div class="header">
      <span>{{ title }}</span>
      <span class="back" @click="back"><i class="iconfont icon-fanhui"></i>返回列表</span>
    </div>
    <div class="content" v-loading="loading">
      <el-row>
        <el-col>
          <div class="item-title">订单基本信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div class="item">
            <div class="item-left">订单编号</div>
            <div class="item-right">{{ order.orderNo }}</div>
          </div>
          <div class="item">
            <div class="item-left">取件时间</div>
            <div class="item-right">{{ order.pickupTime }}</div>
          </div>
          <div class="item">
            <div class="item-left">金额</div>
            <div class="item-right">{{ Util.getPriceString(order.price) }}</div>
          </div>
          <div class="item">
            <div class="item-left">预付款</div>
            <div class="item-right">{{ Util.getPriceString(order.prePayment) }}</div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="item">
            <div class="item-left">订单状态</div>
            <div class="item-right">{{ getStatusText(order.status) }}</div>
          </div>
          <div class="item">
            <div class="item-left">下单时间</div>
            <div class="item-right">{{ Util.getDateString(order.createTime) }}</div>
          </div>
          <div class="item">
            <div class="item-left">信用等级</div>
            <div class="item-right">-</div>
          </div>
          <div class="item">
            <div class="item-left">运费</div>
            <div class="item-right">-</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="item-title">用户信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div class="item">
            <div class="item-left">收件人</div>
            <div class="item-right">{{ orderShipping.senderName }}</div>
          </div>
          <div class="item">
            <div class="item-left">收货人地址</div>
            <div class="item-right">
              {{
                `${orderShipping.senderState} ${orderShipping.senderCity} ${orderShipping.senderDistrict} ${orderShipping.senderAddress}`
              }}
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="item">
            <div class="item-left">收货电话</div>
            <div class="item-right">{{ orderShipping.senderMobile }}</div>
          </div>
          <div class="item">
            <div class="item-left">买家留言</div>
            <div class="item-right">{{ order.remark || '-' }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="item-title">商品信息</div>
        </el-col>
      </el-row>
      <div class="goods-item">
        <el-row class="goods-title">
          <el-col :span="4">商品图片</el-col>
          <el-col :span="4">商品名称</el-col>
          <el-col :span="8">商品属性</el-col>
          <el-col :span="8">加价券</el-col>
        </el-row>
        <el-row class="table-row order-info">
          <el-col :span="4">
            <div class="shangpin">
              <img :src="goods.goodsImage" alt="" />
            </div>
          </el-col>
          <el-col :span="4">
            <div>{{ goods.goodsName }}</div>
          </el-col>
          <el-col :span="8">
            <div class="tag-container">
              <el-tag size="small" type="info" v-for="(item, index) in goods.specs" :key="index">
                {{ item }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <template v-if="goods.coupons && goods.coupons.length">
              <template v-for="(item, index) in goods.coupons">
                <el-tag size="small" type="danger" v-if="item && item.formValue" :key="index">
                  {{ item && '￥' + item.formValue }}
                </el-tag>
              </template>
            </template>
            <span v-else>-</span>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col>
          <div class="margin-bottom10" v-if="order.status === 7">
            取消原因：<span>{{ order.cancelReason }}</span>
          </div>
          <template v-if="order.status === 1">
            <el-button
              v-permission="'admin:order:receive'"
              type="success"
              size="mini"
              @click="pickupTheOrder(order.orderNo)"
              >审核通过</el-button
            >
          </template>
          <template v-if="order.status === 7">
            <el-button v-permission="'admin:order:cancel'" type="danger" size="mini" @click="passCancel(order.orderNo)"
              >通过取消请求</el-button
            >
            <el-button
              v-permission="'admin:order:cancel:reject'"
              type="warning"
              size="mini"
              @click="rejectCancel(order.orderNo)"
              >驳回取消请求</el-button
            >
          </template>
          <template v-if="order.status < 3">
            <el-button
              v-permission="'admin:order:cancel'"
              type="danger"
              size="mini"
              @click="confirmCancel(order.orderNo)"
              >取消订单</el-button
            >
          </template>
          <template v-if="order.status === 9">
            <el-button
              v-permission="'admin:order:prepayment:pay'"
              type="warning"
              size="mini"
              @click="payPrepayment(order.orderNo)"
              >支付预付款</el-button
            >
          </template>
          <template v-if="order.status === 4 || order.status > 8">
            <el-button v-permission="'admin:order:assessment'" type="success" size="mini" @click="assess()"
              >评 估</el-button
            >
          </template>
          <template v-if="order.status === 5">
            <el-button v-permission="'admin:order:unfreeze'" type="success" size="mini" @click="unfreeze(order.orderNo)"
              >解冻预授权</el-button
            >
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Order from '@/model/order'
import Util from '@/util/util'

export default {
  data() {
    return {
      title: '订单详情',
      loading: false,
      goods: {},
      goodsVos: {},
      order: {},
      orderShipping: {},
      Util,
      id: null,
    }
  },

  methods: {
    async getDetail() {
      try {
        this.loading = true
        const res = await Order.detail(this.id)
        const { coupons, goodsVos, order, orderShipping } = res.data
        this.order = order
        const [obj] = goodsVos
        this.goodsVos = obj
        this.goodsVos.userOrderPrice = order.price
        this.goodsVos.orderNo = order.orderNo
        this.goods = goodsVos[0].goods
        this.goods.coupons = coupons
        this.orderShipping = orderShipping
        this.goods.specs = []
        goodsVos[0].goodsPublicSpecVos.forEach(value => {
          value.goodsPublicSpecInfos.forEach(el => {
            if (el) this.goods.specs.push(el.goodsPublicSpecValue)
          })
        })
        goodsVos[0].goodsPrivateSpecVos.forEach(value => {
          value.goodsPrivateSpecInfos.forEach(el => {
            if (el) this.goods.specs.push(el.goodsPrivateSpecValue)
          })
        })
        this.loading = false
      } catch (e) {
        this.loading = false
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
          this.getDetail()
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
          this.getDetail()
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
          this.getDetail()
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
          this.getDetail()
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
          this.getDetail()
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
          this.getDetail()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    assess() {
      this.$router.push({
        path: '/order/assess',
        query: { goods: this.goodsVos },
      })
    },
    back() {
      this.$router.go(-1)
    },
  },
  async created() {
    const { id } = this.$route.query
    this.id = id
    this.getDetail()
  },
}
</script>

<style lang="scss" scoped>
.container {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    color: $parent-title-color;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #dae1ec;
    div {
      margin-right: 30px;
    }
    .back {
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .content {
    background-color: #ffffff;
    margin: 10px;
    padding: 10px;
    font-size: 12px;

    .item-title {
      margin: 10px 0;
      font-size: 14px;
    }
    .item {
      margin: 10px 0;
      display: flex;
      align-items: center;
    }
    .item-left {
      margin-right: 30px;
      font-weight: 500;
      min-width: 140px;
      text-align: right;
    }

    .goods-item {
      border: solid 1px #cccccc;
      border-bottom: 0;
      margin-bottom: 20px;

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

      .table-row {
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

        .tag-container {
          .el-tag {
            margin-right: 5px;
            line-height: 16px;
            height: 17px;
          }
        }
      }

      .order-info {
        display: flex;
        align-items: center;
      }
    }
  }
}
.info {
  color: #999999;
  font-size: 12px;
  line-height: 1.5;
}
</style>
