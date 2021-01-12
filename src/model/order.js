import { get, post, postJson } from '@/lin/plugin/axios'

class Order {
  // 回收商品订单列表查询
  async list(data) {
    const res = await get('recovery/order/list.json', data)
    return res
  }

  // 订单详情
  async detail(orderNo) {
    const res = await post('recovery/order/view.json', { orderNo })
    return res
  }

  // 取消订单
  async cancel(orderNo) {
    const res = await post('recovery/order/cancel.json', { orderNo })
    return res
  }

  // 审核通过订单
  async pickupTheOrder(orderNo) {
    const res = await post('recovery/order/pickupTheOrder.json', { orderNo })
    return res
  }

  // 通过用户取消订单请求
  async passCancel(orderNo) {
    const res = await post('recovery/order/passAppUserCancelOrder.json', { orderNo })
    return res
  }

  // 拒绝用户取消订单请求
  async rejectCancel(orderNo) {
    const res = await post('recovery/order/rejectCancelOrder.json', { orderNo })
    return res
  }

  // 预支付
  async payPrepayment(orderNo) {
    const res = await post('recovery/order/payPrepayment.json', { orderNo })
    return res
  }

  // 订单批量导出
  async exportOrder(data) {
    const res = await post('recovery/order/export.json', data)
    return res
  }

  // 预授权解冻(对预付款账单)
  async unfreeze(orderBillId) {
    const res = await post('recovery/order/unfreeze.json', { orderBillId })
    return res
  }

  // 计算回收价格
  async account(data) {
    const res = await postJson('assessmentReport/account.json', data)
    return res
  }

  // 保存或者更新评估结果
  async assess(data) {
    const res = await postJson('assessmentReport/saveOrUpdateAssessment.json', data)
    return res
  }
}

export default new Order()
