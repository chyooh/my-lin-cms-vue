import { get, post } from '@/lin/plugin/axios'

class Order {
  // 回收商品订单列表查询
  async list(data) {
    const res = await get('recovery/order/list.json', data)
    return res
  }

  // 取消订单
  async cancel(orderNo) {
    const res = await post('recovery/order/cancel.json', { orderNo })
    return res
  }
}

export default new Order()
