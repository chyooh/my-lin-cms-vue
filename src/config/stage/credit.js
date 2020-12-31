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
      permission: ['admin:app:user:view'],
    }, {
      title: '信用额度列表',
      type: 'view',
      name: 'creditList',
      route: '/credit/list',
      filePath: 'view/credit/credit-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:credit:payment:view'],
    }, {
      title: '添加信用额度',
      type: 'view',
      name: 'creditCreate',
      route: '/credit/add',
      filePath: 'view/credit/credit-create.vue',
      inNav: true,
      icon: 'iconfont icon-add',
      permission: ['admin:credit:payment:add'],
    },
  ],
}
// admin:credit:payment:del
// admin:credit:payment:edit
export default orderRouter
