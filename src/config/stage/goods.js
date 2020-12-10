const goodsRouter = {
  route: null,
  name: null,
  title: '商品管理',
  type: 'folder',
  icon: 'iconfont icon-shangpinguanli',
  filePath: 'view/goods/',
  order: null,
  inNav: true,
  children: [
    {
      title: '商品列表',
      type: 'view',
      name: 'goodsList',
      route: '/goods/list',
      filePath: 'view/goods/goods-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:user:list'],
    },
    {
      title: '添加商品',
      type: 'view',
      inNav: true,
      route: '/goods/add',
      icon: 'iconfont icon-add',
      name: 'goodsCreate',
      filePath: 'view/goods/goods-create.vue',
      permission: ['admin:user:add'],
    },
    {
      title: '回收商品结算记录',
      type: 'view',
      inNav: true,
      route: '/goods/account',
      icon: 'iconfont icon-shangpinliebiao',
      name: 'goodsAccount',
      filePath: 'view/goods/goods-account.vue',
      permission: ['admin:user:add'],
    },
  ],
}

export default goodsRouter
