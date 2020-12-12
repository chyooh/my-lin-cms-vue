import { get, post } from '@/lin/plugin/axios'

class Logistics {
  // 添加
  async save(data) {
    const res = await post('logistics/company/save.json', data)
    return res
  }

  // 删除
  async delete(id) {
    const res = await post('logistics/company/delete.json', { id })
    return res
  }

  // 更新
  async update(data) {
    const res = await post('logistics/company/update.json', data)
    return res
  }

  // 查询全部
  async list(data) {
    const res = await get('logistics/company/list.json', data)
    return res
  }

  // 根据id查询物流公司信息
  async view(id) {
    const res = await get('logistics/company/findById.json', { id })
    return res
  }

  // 启用
  async enable(id) {
    const res = await post('logistics/company/enable.json', { id })
    return res
  }

  // 禁用
  async disable(id) {
    const res = await post('logistics/company/disable.json', { id })
    return res
  }
}

export default new Logistics()
