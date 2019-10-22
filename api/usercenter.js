import { fetch } from './index'
// 通过uid查询管理员入口
export const _managelist = UnionID => fetch({
  action: 'GetAdminEnter',
  UnionID
})