import { get, post } from '@/lin/plugin/axios'

class Credit {
  // 信用额度列表
  async list(data) {
    const res = await get('credit/payment/list.json', data)
    return res
  }

  // 添加
  async save(data) {
    const res = await post('credit/payment/save.json', data)
    return res
  }

  // 更新
  async update(data) {
    const res = await post('credit/payment/update.json', data)
    return res
  }

  // 删除
  async delete(id) {
    const res = await post('credit/payment/deleteById.json', { id })
    return res
  }

  // 信用额度列表
  async userCreditlist(data) {
    const res = await get('appUser/credit/list.json', data)
    return res
  }

}

export default new Credit()
