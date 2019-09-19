import { fetch, post } from './index'
/**================================
 *           报修
 ================================*/
//  获取报修部位
export const _getPart = id => fetch({
  action: 'RepairPart',
  PID: id
})
//  提交报修
export const _submit = ({ UnionID, HouseID, Name, Tel, ToubleID, Part, Content, Image }) => post({
  action: 'AddRepair',
  UnionID,
  HouseID,
  Name,
  Tel,
  ToubleID,
  Part,
  Content,
  Image
})
// 用户列表
export const _userlist = ({ UnionID, State, PageIndex, PageSize }) => fetch({
  action: 'GetUserRepairListForPage',
  UnionID,
  State,
  PageIndex,
  PageSize
})
// 用户获取详情
export const _userdetail = ID => fetch({
  action: 'GetRepairDetal',
  ID
})
// 用户提交评价
export const _evaluate = ({ UnionID,
  ID, EvaluateScore1, EvaluateScore2, EvaluateScore3,
  EvaluateScore4, EvaluateContent, EvaluateImages }) => post({
    action: 'RepairEvaluate',
    UnionID,
    ID,
    EvaluateScore1,
    EvaluateScore2,
    EvaluateScore3,
    EvaluateScore4,
    EvaluateContent,
    EvaluateImages
  })