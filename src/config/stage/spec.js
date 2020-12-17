const specRouter = {
  route: null,
  name: null,
  title: '规格管理',
  type: 'folder',
  icon: 'iconfont icon-dingdanguanli',
  filePath: 'view/goods/',
  order: null,
  inNav: true,
  children: [
    {
      title: '规格列表',
      type: 'view',
      name: 'specList',
      route: '/spec/list',
      filePath: 'view/spec/spec-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:goods:spec:view'],
    },
    {
      title: '创建规格',
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

export default specRouter
