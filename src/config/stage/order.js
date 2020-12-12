const orderRouter = {
  route: null,
  name: null,
  title: '订单管理',
  type: 'folder',
  icon: 'iconfont icon-dingdanguanli',
  filePath: 'view/order/',
  order: null,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'userList',
      route: '/order/list',
      filePath: 'view/order/order-list.vue',
      inNav: true,
      icon: 'iconfont icon-dingdanliebiao',
      permission: ['admin:order:view'],
    },
  ],
}

export default orderRouter
