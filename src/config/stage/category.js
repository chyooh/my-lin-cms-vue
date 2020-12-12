const categoryRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder',
  icon: 'iconfont icon-shangpinguanli',
  filePath: 'view/goods/',
  order: null,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      inNav: true,
      route: '/category/list',
      icon: null,
      name: 'categoryList',
      filePath: 'view/category/category-list.vue',
      permission: ['admin:spec:list'],
    },
    {
      title: '子分类列表',
      type: 'view',
      inNav: false,
      route: '/category/child',
      icon: null,
      name: 'categoryChild',
      filePath: 'view/category/category-child.vue',
      permission: ['admin:user:add'],
    },
  ],
}

export default categoryRouter
