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
// 地产客服列表
export const _managerList = ({ UnionID, State, Type = '', Building = '', Unit = '', Name = '', PageIndex, PageSize }) => fetch({
  action: 'SuggestGetMyManage',
  UnionID,
  State,
  Type,
  Building,
  Unit,
  Name,
  PageIndex,
  PageSize
})
// 地产客服受理
export const _managerAccept = ({ UnionID, SuggestID }) => fetch({
  action: 'SuggestAccept',
  UnionID,
  SuggestID
})
// 地产客服获取物业客服处理人列表
export const _dealerList = UnionID => fetch({
  action: 'SuggestGetAdmin',
  UnionID
})
// 地产客服指派物业客服
export const _dispatch = ({ UnionID, SuggestID, AdminID }) => fetch({
  action: 'SuggestAllot',
  UnionID,
  SuggestID,
  AdminID
})
// 问题定性分类
export const _getJudge = (S_PID = '') => fetch({
  action: 'SuggestGetNature',
  S_PID
})
// 处理投诉
export const _deal = ({ UnionID, SuggestID, AdminName, Content, ImageList }) => fetch({
  action: 'SuggestDeal',
  UnionID,
  SuggestID,
  AdminName,
  Content,
  ImageList
})
