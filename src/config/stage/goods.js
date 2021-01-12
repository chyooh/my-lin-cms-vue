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
      permission: ['admin:goods:list'],
    },
    {
      title: '添加商品',
      type: 'view',
      inNav: true,
      route: '/goods/add',
      icon: 'iconfont icon-add',
      name: 'goodsCreate',
      filePath: 'view/goods/goods-create.vue',
      permission: ['admin:goods:add'],
    }
  ],
}
// admin:goods:list 商品信息
// admin:goods:add 商品新增
// admin:goods:edit 商品更新
// admin:goods:view 商品查看
// admin:goods:del 商品删除
export default goodsRouter
