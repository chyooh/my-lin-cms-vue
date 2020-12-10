import Vue from 'vue'
import { get, post } from '@/lin/plugin/axios'

class Goods {
  // 商品列表分页查询
  // 参数 filter_goodsName string 商品名称
  // filter_firstCategoryId long 商品一级分类ID
  // filter_secondCategoryId long 商品二级分类ID
  // filter_isHandPick long 是否推荐 : 1.是 2.否
  // filter_status long 状态: 1.上架 2.下架
  // filter_createTimes string 创建大于等于的日期
  // filter_createTimee string 创建小于等于的日期
  // filter_updateTimes string 更新大于等于的日期
  // filter_updateTimee string 小于等于的日期
  // pageNumber int 当前页
  // pageSize int 页面大小
  // sortName string 排序字段
  // sortOrder string 排序规则 : ASE DESC
  // avgPrices double 大于等于回收均价
  // avgPricee double 小于等于回收均价
  async goodsList(data) {
    const res = await get('goods/list.json', data)
    return res
  }

  // 添加商品
  async save(data) {
    return Vue.prototype.$axios({
      method: 'post',
      url: 'goods/save.json',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // 更新商品基本信息
  async update(data) {
    return Vue.prototype.$axios({
      method: 'post',
      url: 'goods/update.json',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // 删除商品
  async delete(id) {
    const res = await post('goods/delete.json', { id })
    return res
  }

  // 查询商品详情
  async view(goodsId) {
    const res = await get(`goods/view/${goodsId}`, { goodsId })
    return res
  }

  // 修改商品公有属性
  // 参数goodsPublicSpecIds 商品公有属性ids (拼接方式1,2,3....)
  // goodsId 商品ID
  async updatePublicSpec(data) {
    const res = await post('goods/updateGoodsPublicSpec.json', data)
    return res
  }

  // 修改商品私有属性
  // 参数 goodsPrivateSpecIds string 商品私有属性ids (拼接方式1,2,3....)
  // goodsId long 商品ID
  async updatePrivateSpec(data) {
    const res = await post('goods/updateGoodsPrivateSpec.json', data)
    return res
  }

  // 回收商品结算记录
  async goodsAccountList(data) {
    const res = await get('goods/account/record/list.json', data)
    return res
  }

  // 删除记录
  async deleteRecord(id) {
    const res = await post('goods/account/record/delete.json', { id })
    return res
  }
}

export default new Goods()
