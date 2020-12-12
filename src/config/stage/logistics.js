const logisticsRouter = {
  route: null,
  name: null,
  title: '物流信息',
  type: 'folder',
  icon: 'iconfont icon-shangpinguanli',
  filePath: 'view/logistics/',
  order: null,
  inNav: true,
  children: [
    {
      title: '物流公司列表',
      type: 'view',
      name: 'logisticsList',
      route: '/logistics/list',
      filePath: 'view/logistics/logistics-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:goods:list'],
    },
    {
      title: '添加物流公司',
      type: 'view',
      inNav: true,
      route: '/logistics/add',
      icon: 'iconfont icon-add',
      name: 'logisticsCreate',
      filePath: 'view/logistics/logistics-create.vue',
      permission: ['admin:goods:add'],
    },
  ],
}

export default logisticsRouter
