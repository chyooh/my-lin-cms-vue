import { get, post } from '@/lin/plugin/axios'

class Ad {
  // 广告分类列表
  async list(data) {
    const res = await get('ad/category/list.json', data)
    return res
  }

  // 广告列表
  async adList(data) {
    const res = await get('ad/list.json', data)
    return res
  }

  // 添加广告
  async adSave(data) {
    const res = await post('ad/save.json', data)
    return res
  }

  // 更新广告
  async adUpdate(data) {
    const res = await post('ad/update.json', data)
    return res
  }

  // 上线
  async upline(id) {
    const res = await post('ad/upline.json', { id })
    return res
  }

  // 下线
  async offline(id) {
    const res = await post('ad/offline.json', { id })
    return res
  }

  // 删除
  async delete(id) {
    const res = await post('ad/delete.json', { id })
    return res
  }
}

export default new Ad()
