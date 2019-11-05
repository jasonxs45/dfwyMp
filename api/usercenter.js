import { fetch } from './index'
// 通过uid查询管理员入口
export const _managelist = UnionID => fetch({
  action: 'GetAdminEnter',
  UnionID
})
// 获取菜单列表
export const _wholelist = UnionID => fetch({
  action: 'GetUserEnter',
  UnionID
})