<template>
  <div class="container form-container">
    <!-- <div class="header">
      <div class="title">用户列表</div>
    </div> -->
    <el-form
      :model="filterForm"
      status-icon
      label-position="right"
      ref="filterForm"
      @submit.native.prevent
      class="form"
      inline
    >
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
      <div class="form-item-div">
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-tabs v-model="activeId" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in status" :key="item.id" :name="item.id">
        <span slot="label" class="tabs-label">{{ item.label }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="table-container">
      <div class="table-title">
        <el-row>
          <el-col :span="6">商品信息</el-col>
          <el-col :span="2">回收价格</el-col>
          <el-col :span="2">优惠券</el-col>
          <el-col :span="2">运费</el-col>
          <el-col :span="3">预付款</el-col>
          <el-col :span="3">交易状态</el-col>
          <el-col :span="3">用户地址</el-col>
          <el-col :span="3">备注</el-col>
        </el-row>
      </div>
      <template v-if="tableData.length > 0">
        <div class="goods-item" v-for="(goods, index) in tableData" :key="index">
          <el-row class="goods-title">
            <div class="margin-right10">{{ goods.order.createTime }}</div>
            <div>订单号：{{ goods.order.orderNo }}</div>
          </el-row>
          <el-row class="content">
            <el-col :span="6">
              <div class="shangpin">
                <img :src="goods.goodsVos[0].goods.goodsImage" alt="" />
                <div class="right-shangpin">
                  <div class="name">{{ goods.goodsVos[0].goods.goodsName }}</div>
                  <div class="tag-container">
                    <span>规格：</span>
                    <div>
                      <el-tag
                        size="small"
                        type="info"
                        v-for="(item, index) in goods.goodsVos[0].goodsPublicSpecVos"
                        :key="index"
                      >
                        {{ item.goodsPublicSpecInfos[0].goodsPublicSpecValue }}
                      </el-tag>
                    </div>
                  </div>
                  <div>
                    <l-icon name="shen" color="#ff9900" width="12" height="12"></l-icon>
                    <l-icon name="qi" color="orange" width="12" height="12"></l-icon>
                  </div>
                  <div>
                    <el-button size="mini" type="primary" @click="modifyPrice(goods.id)">修改价格</el-button>
                    <el-button size="mini" @click="addOrder(goods.id)">补订单</el-button>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <div>{{ Util.getPriceString(goods.goodsPrice) }}</div>
            </el-col>
            <el-col :span="2">
              <div v-for="(item, index) in goods.coupons" :key="index">
                <el-tag size="small" type="danger">
                  {{ item && item.name }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="2">
              <div>运费：{{ Util.getPriceString(goods.order.postFee || 0) }}</div>
            </el-col>
            <el-col :span="3">
              <div>{{ Util.getPriceString(goods.order.prePayment || 0) }}</div>
            </el-col>
            <el-col :span="3">
              {{ goods.order.status === 0 ? '未完成' : goods.order.status === 1 ? '已完成' : '已取消' }}
            </el-col>
            <el-col :span="3">
              <div>{{ goods.orderShipping.senderName }}</div>
              <div>{{ goods.orderShipping.senderMobile }}</div>
              <div>
                {{
                  `${goods.orderShipping.senderState} ${goods.orderShipping.senderCity} ${goods.orderShipping.senderDistrict} ${goods.orderShipping.senderAddress}`
                }}
              </div>
            </el-col>
            <el-col :span="3">{{ goods.order.remark }}</el-col>
          </el-row>
          <el-row class="content">
            <el-col>
              <div class="margin-bottom10">
                认证资料：周（33333****99999），人脸识别通过 性别：男性 年龄：28 <span>会员等级：VIP0</span>
              </div>
              <div>
                <el-button type="primary" size="mini">复制地址</el-button>
                <el-button type="warning" size="mini">未设置地址</el-button>
                <el-button type="success" size="mini">区块链</el-button>
                <el-button type="primary" size="mini">交易快照</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col>
              风控信息：【风控建议】风控通过，需核实用户家庭/公司地址，详细到门牌号。走区块链流程（即收集并录入凭证：身份证图片、纸质签收回单须有本人签名、沟通记录等，如有原件，注意保存原件。）。核实收货人与下单人关系，收取两方身份证复印件。
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col> <l-icon name="edit"></l-icon>用户留言：无 </el-col>
          </el-row>
          <el-row class="content"><span class="beizhu">无备注</span></el-row>
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
        status: null,
      },
      Util,
      activeId: '1',
      status: [
        { id: '1', label: '全部', value: null },
        { id: '3', label: '未完成', value: 0 },
        { id: '2', label: '已完成', value: 1 },
        { id: '4', label: '已取消', value: 2 },
      ],
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getOrderList() {
      const { currentPage } = this
      const loading = this.$loading({ target: '.table-container' })
      try {
        const res = await Order.list({
          ...this.filterForm,
          pageSize: this.pageCount,
          pageNumber: currentPage,
        }) // eslint-disable-line
        // console.log(res)
        loading.close()
        res.data.rows.forEach(item => {
          item.order.createTime = Util.getDateString(item.order.createTime)
        })
        this.tableData = res.data.rows
        // console.log(this.tableData)
        this.total_nums = res.data.total
      } catch (e) {
        loading.close()
        console.log(e)
      }
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      console.log(this.currentPage)
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
  },
  async created() {
    await this.getOrderList()
    // this.tableData = orderList
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;
  background-color: #ffffff;

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
.my-draw {
  .form {
    padding: 0 20px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
.table-container {
  font-size: 12px;
  .el-col {
    text-align: center;
  }
  .el-col:first-child {
    text-align: left;
  }
  .table-title {
    padding: 10px 0;
    font-size: 14px;
    .el-col {
      font-weight: 700;
    }
  }
  .goods-title {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f1f1f1;
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
        margin-bottom: 10px;
      }
    }
    .beizhu {
      border-bottom: dashed 1px #cccccc;
    }
  }
  .shangpin {
    display: flex;
    align-items: flex-start;
    img {
      width: 100px;
      margin-right: 10px;
    }
    .name {
      color: $theme;
    }
  }
  .tag-container {
    display: flex;
    div {
      flex: 1;
      .el-tag {
        margin-right: 5px;
        margin-bottom: 5px;
        line-height: 16px;
        height: 17px;
      }
    }
  }
}
.empty {
  text-align: center;
  margin: 50px;
  color: #999;
  font-size: 14px;
}
</style>
