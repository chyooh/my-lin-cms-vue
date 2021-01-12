const adRouter = {
  route: null,
  name: null,
  title: '首页广告管理',
  type: 'folder',
  icon: 'iconfont icon-shangpinliebiao',
  filePath: 'view/ad/',
  order: null,
  inNav: true,
  children: [
    {
      title: '广告内容列表',
      type: 'view',
      name: 'adList',
      route: '/ad/list',
      filePath: 'view/ad/ad-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:ad:list'],
    }, {
      title: '添加广告',
      type: 'view',
      name: 'adCreate',
      route: '/ad/add',
      filePath: 'view/ad/ad-create.vue',
      inNav: true,
      icon: 'iconfont icon-add',
      permission: ['admin:ad:add'],
    }, {
      title: '广告分类',
      type: 'view',
      name: 'adCategory',
      route: '/ad/category',
      filePath: 'view/ad/ad-category.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:ad:category:list'],
    },
  ],
}
// admin:ad:add 广告内容添加
// admin:ad:del
// admin:ad:edit 广告内容修改
// admin:ad:category:view 广告分类查询
// admin:ad:category:list 广告分类列表
// admin:ad:list 广告内容
export default adRouter
