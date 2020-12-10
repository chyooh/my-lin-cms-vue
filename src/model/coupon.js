import { get } from '@/lin/plugin/axios'

class Coupon {
  // 回收商品订单列表查询
  async list(couponId) {
    const res = await get('coupon/alipayCodeCoupon/export.json', { couponId })
    return res
  }
}

export default new Coupon()
