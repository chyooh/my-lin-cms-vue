const orderRouter = {
  route: null,
  name: null,
  title: '信用评估管理',
  type: 'folder',
  icon: 'iconfont icon-shangpinliebiao',
  filePath: 'view/credit/',
  order: null,
  inNav: true,
  children: [
    {
      title: '用户评估结果',
      type: 'view',
      name: 'creditAssessList',
      route: '/credit/assess/list',
      filePath: 'view/credit/credit-assess-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:app:user:list'],
    }, {
      title: '信用额度列表',
      type: 'view',
      name: 'creditList',
      route: '/credit/list',
      filePath: 'view/credit/credit-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:credit:payment:list'],
    },
  ],
}
// admin:app:user:list 用户评估结果列表
// admin:app:user:view 用户评估结果列表查询
// admin:credit:payment:list 信用风险额度管理
// admin:credit:payment:add 信用额度的添加
// admin:credit:payment:view 信用额度的查询
// admin:credit:payment:del 信用额度的删除
// admin:credit:payment:edit 信用额度的更新
export default orderRouter
