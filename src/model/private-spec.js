import { get, post } from '@/lin/plugin/axios'
// 商品私有属性
class Private {
  // 添加
  async save(data) {
    const res = await post('goods/private/spec/save.json', data)
    return res
  }

  // 删除
  async delete(id) {
    const res = await post('goods/private/spec/delete.json', { id })
    return res
  }

  // 更新
  async update(data) {
    const res = await post('goods/private/spec/update.json', data)
    return res
  }

  // 查询全部
  async list() {
    const res = await get('goods/private/spec/list.json')
    return res
  }

  // 查询大属性和小属性全部
  async all() {
    const res = await get('goods/private/spec/specAndInfo/list.json')
    return res
  }

  // 添加小属性
  async infoSave(data) {
    const res = await post('goods/private/spec/info/save.json', data)
    return res
  }

  // 删除小属性
  async infoDelete(id) {
    const res = await post('goods/private/spec/info/delete.json', { id })
    return res
  }

  // 更新小属性
  async infoUpdate(data) {
    const res = await post('goods/private/spec/info/update.json', data)
    return res
  }

  // 查询全部小属性
  // async infoList() {
  //   const res = await get('goods/private/spec/info/list.json')
  //   return res
  // }

  // 根据私有大属性id查询当前属性下的小属性值
  async infoList(id) {
    const res = await get('goods/private/spec/findGoodsPrivateSpecInfoList.json', { id })
    return res
  }

  // 商品私有属性大属性列表查询(根据商品一级分类Id,商品二级分类Id查询) firstCategoryId secondCategoryId
  async infoListByCategory({ firstCategoryId, secondCategoryId }) {
    const res = await get('goods/private/spec/goodsPrivateSpecList.json', { firstCategoryId, secondCategoryId })
    return res
  }
}

export default new Private()
