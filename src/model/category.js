import { get, post } from '@/lin/plugin/axios'

class Category {
  // 查询所有分类列表(树状结构)
  async categoryList() {
    const res = await get('category/list.json')
    return res
  }

  // 添加商品分类
  async save(data) {
    const res = await post('category/save.json', data)
    return res
  }

  // 更新商品分类
  async update(data) {
    const res = await post('category/update.json', data)
    return res
  }

  // 删除商品分类
  async delete(id) {
    const res = await post('category/delete.json', { id })
    return res
  }

  // 查询商品分类详情
  async view(id) {
    const res = await get(`category/view/${id}`, { id })
    return res
  }

  // 根据分类父节点id查询
  async findByParentId(parentId) {
    const res = await get(`category/findByParentId/${parentId}`, { parentId })
    return res
  }
}

export default new Category()
