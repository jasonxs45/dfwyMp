import { fetch, post } from './index'
/**================================
 *           投诉建议
 ================================*/
//  用户提交
export const _submit = ({ UnionId, Type, HouseID, Content, Images }) => post({
  action: 'MobSuggestSave',
  UnionId,
  Type,
  HouseID,
  Content,
  Images
})
// 用户列表
export const _userlist = ({ UnionID, Type, State, PageIndex, PageSize }) => fetch({
  action: 'SuggestGetMyHistory',
  UnionID,
  Type,
  State,
  PageIndex,
  PageSize	
})
// 用户详情
export const _userdetail = ({ UnionID, SuggestID }) => fetch({
  action: 'MobSuggestGetInfo',
  UnionID,
  SuggestID
})
// 地产客服受理
export const _managerAccept = ({ UnionID, SuggestID }) => fetch({
  action: 'SuggestAccept',
  UnionID,
  SuggestID
})