import { get, post } from '@/lin/plugin/axios'

class Coupon {
  async list(data) {
    const res = await get('coupon/list.json', data)
    return res
  }

  // 创建商品优惠券
  async save(data) {
    const res = await post('coupon/save.json', data)
    return res
  }

  // 更新商品优惠券
  async update(data) {
    const res = await post('coupon/update.json', data)
    return res
  }

  // 查询商品优惠券
  async view(id) {
    const res = await get(`coupon/view/${id}`)
    return res
  }

  // 上架
  async on(couponId) {
    const res = await post('coupon/shelves/on.json', { couponId })
    return res
  }

  // 下架
  async off(couponId) {
    const res = await post('coupon/shelves/off.json', { couponId })
    return res
  }

  // 删除
  async delete(couponId) {
    const res = await post('coupon/delete.json', { couponId })
    return res
  }

  // 优惠券转换为券码券
  async exchangeCodeCoupon(couponId) {
    const res = await post('coupon/exchangeCodeCoupon.json', { couponId })
    return res
  }

  // 导出支付宝券码券
  async exportCodeCoupon(couponId) {
    const res = await post('coupon/alipayCodeCoupon/export.json', { couponId })
    return res
  }
}

export default new Coupon()
