import { Item } from '../../../../types/item'

export const homepageLayoutItems: Item[] = [
  {
    type: 'list',
    id: 'homepage-layout',
    name: '视频列表列数',
    defaultValue: 'homepage-layout-disable',
    disableValue: 'homepage-layout-disable',
    options: [
      {
        id: 'homepage-layout-disable',
        name: '未启用',
      },
      {
        id: 'homepage-layout-4-column',
        name: '4 列布局',
      },
      {
        id: 'homepage-layout-5-column',
        name: '5 列布局',
      },
      {
        id: 'homepage-layout-6-column',
        name: '6 列布局',
      },
    ],
  },
  {
    type: 'number',
    id: 'homepage-layout-padding',
    name: '修改 页面两侧边距 (-1禁用)',
    minValue: -1,
    maxValue: 500,
    defaultValue: -1,
    disableValue: -1,
    addonText: 'px',
    fn: (value: number) => {
      document.documentElement.style.setProperty('--homepage-layout-padding', `${value}px`)
    },
  },
]
