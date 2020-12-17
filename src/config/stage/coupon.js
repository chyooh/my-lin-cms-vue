const orderRouter = {
  route: null,
  name: null,
  title: '优惠券管理',
  type: 'folder',
  icon: 'iconfont icon-dingdanguanli',
  filePath: 'view/coupon/',
  order: null,
  inNav: true,
  children: [
    {
      title: '优惠券列表',
      type: 'view',
      name: 'couponList',
      route: '/coupon/list',
      filePath: 'view/coupon/coupon-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:coupon:view'],
    }, {
      title: '添加优惠券',
      type: 'view',
      name: 'couponCreate',
      route: '/coupon/add',
      filePath: 'view/coupon/coupon-create.vue',
      inNav: true,
      icon: 'iconfont icon-add',
      permission: ['admin:coupon:add'],
    },
  ],
}

export default orderRouter
