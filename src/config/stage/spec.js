const specRouter = {
  route: null,
  name: null,
  title: '属性管理',
  type: 'folder',
  icon: 'iconfont icon-dingdanguanli',
  filePath: 'view/goods/',
  order: null,
  inNav: true,
  children: [
    {
      title: '属性列表',
      type: 'view',
      name: 'specList',
      route: '/spec/list',
      filePath: 'view/spec/spec-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:goods:spec:list'],
    },
    {
      title: '创建属性',
      type: 'view',
      name: 'specDetail',
      route: '/spec/view',
      filePath: 'view/spec/spec-view.vue',
      inNav: true,
      icon: '',
      permission: ['admin:goods:spec:add'],
    },
  ],
}
// admin:goods:spec:list 商品规格
// admin:goods:spec:add 商品规格新增
// admin:goods:spec:edit 商品规格更新
// admin:goods:spec:view 商品规格查看
// admin:goods:spec:del 商品规格删除
export default specRouter
