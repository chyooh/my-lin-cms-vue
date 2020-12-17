const pickupTimeRouter = {
  route: null,
  name: null,
  title: '取件时间',
  type: 'folder',
  icon: 'iconfont icon-dingdanguanli',
  filePath: 'view/pickup/',
  order: null,
  inNav: true,
  children: [
    {
      title: '时间列表',
      type: 'view',
      name: 'pickupList',
      route: '/pickup/list',
      filePath: 'view/pickup/pickup-list.vue',
      inNav: true,
      icon: 'iconfont icon-shangpinliebiao',
      permission: ['admin:pickup:time:view'],
    }, {
      title: '时间范围列表',
      type: 'view',
      name: 'pickupHour',
      route: '/pickup/hour',
      filePath: 'view/pickup/pickup-hour.vue',
      inNav: false,
      icon: null,
      permission: ['admin:pickup:time:view'],
    },
  ],
}

export default pickupTimeRouter
