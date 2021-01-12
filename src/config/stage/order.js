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
      name: 'orderList',
      route: '/order/list',
      filePath: 'view/order/order-list.vue',
      inNav: true,
      icon: 'iconfont icon-dingdanliebiao',
      permission: ['admin:order:list'],
    }, {
      title: '订单评估检测',
      type: 'view',
      name: 'orderAssess',
      route: '/order/assess',
      filePath: 'view/order/order-assess.vue',
      inNav: false,
      icon: null,
      permission: ['admin:order:assessment'],
    }, {
      title: '订单详情',
      type: 'view',
      name: 'orderDetail',
      route: '/order/detail',
      filePath: 'view/order/order-detail.vue',
      inNav: false,
      icon: null,
      permission: ['admin:order:view'],
    },
  ],
}
// admin:order:view 订单查看
// admin:order:edit 订单修改
// admin:order:receive 接受订单
// admin:order:cancel 取消订单
// admin:order:cancel:reject 拒绝订单取消
// admin:order:prepayment:pay 支付预付款
// admin:order:payment:pay 结算支付
// admin:order:assessment 订单评估
// admin:order:unfreeze 解冻预授权
export default orderRouter
