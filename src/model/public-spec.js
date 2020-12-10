// import Vue from 'vue'
import { get, post } from '@/lin/plugin/axios'
// 商品公有属性
class Public {
  // 添加
  async save(data) {
    const res = await post('goods/public/spec/save.json', data)
    return res
  }

  // 删除
  async delete(id) {
    const res = await post('goods/public/spec/delete.json', { id })
    return res
  }

  // 更新
  async update(data) {
    const res = await post('goods/public/spec/update.json', data)
    return res
  }

  // 查询全部
  async list(data) {
    const res = await get('goods/public/spec/list.json', data)
    return res
  }

  // 查询大属性和小属性全部
  async all() {
    const res = await get('goods/public/spec/specAndInfo/list.json')
    return res
  }

  // 添加小属性
  async infoSave(data) {
    const res = await post('goods/public/spec/info/save.json', data)
    return res
  }

  // 删除小属性
  async infoDelete(id) {
    const res = await post('goods/public/spec/info/delete.json', { id })
    return res
  }

  // 更新小属性
  async infoUpdate(data) {
    const res = await post('goods/public/spec/info/update.json', data)
    return res
  }

  // 查询全部
  // async infoList() {
  //   const res = await get('goods/public/spec/info/list.json')
  //   return res
  // }

  // 根据公有大属性值获取当前属性下的小属性值
  async infoList(id) {
    const res = await get('goods/public/spec/findPublicSpecInfoBySpecId.json', { id })
    return res
  }

  // 商品公有属性大属性列表查询(根据商品一级分类Id,商品二级分类Id查询) firstCategoryId secondCategoryId
  async infoListByCategory({ firstCategoryId, secondCategoryId }) {
    const res = await get('goods/public/spec/goodsPublicSpecList.json', { firstCategoryId, secondCategoryId })
    return res
  }
}

export default new Public()
