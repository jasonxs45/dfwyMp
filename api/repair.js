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
export const _evaluate = ({ UnionID, ID, EvaluateScore1, EvaluateScore2, EvaluateScore3, EvaluateScore4, EvaluateContent, EvaluateImages }) => post({
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
// 工程师列表
export const _engineerlist = ({ UnionID, State, PageIndex, PageSize }) => fetch({
  action: 'GetBuilderRepairListForPage',
  UnionID,
  State,
  PageIndex,
  PageSize
})
// 工程师完成报修单
export const _enginnerdone = ({ UnionID, Desc, Images, RepairID }) => fetch({
  action: 'RepairDeal',
  UnionID,
  Desc,
  Images,
  RepairID
})
// 工程师拒单
export const _enginnerrefuse = ({UnionID,RefuseReason,Images,RepairID}) => fetch({
  action: 'RepairBuilderRefuse',
  UnionID,
  RefuseReason,
  Images,
  RepairID
})
// 工程师主管列表
export const _enginemanagerlist = ({ UnionID, State, PageIndex, PageSize }) => fetch({
  action: 'GetEngineerManagerRepairListForPage',
  UnionID,
  State,
  PageIndex,
  PageSize
})
const _enginemanageroperate = ({ action, UnionID, RepairID, ReturnMsg }) => post({
  action,
  UnionID,
  RepairID,
  ReturnMsg
})
// 工程师主管拒绝通过
export const _engineermanagerrefuse = opt =>  _enginemanageroperate({
  action: 'RepairManagerReturn',
  ...opt
})
// 工程师主管拒绝申请重新分配
export const _engineermanagerdispatch = opt => _enginemanageroperate({
  action: 'RepairManagerReturnToEdit',
  ...opt
})
// 工程师主管关单
export const _engineermanagershut = opt => _enginemanageroperate({
  action: 'RepairManagerCancel',
  ...opt
})

// 物业客服列表
export const _managerlist = ({ UnionID, State, PageIndex, PageSize }) => fetch({
  action: 'GetManageRepairListForPage',
  UnionID,
  State,
  PageIndex,
  PageSize
})
// 物业客服拒绝
const _manageroperate = ({ action, UnionID, RepairID, ReturnMsg }) => post({
  action,
  UnionID,
  RepairID,
  ReturnMsg
})
// 物业客服不受理
export const _managernotaccept = opt => _enginemanageroperate({
  action: 'RepairRefuse',
  ...opt
})
// 物业客服拒绝通过
export const _managernotpass = opt => _enginemanageroperate({
  action: 'RepairDealRefuse',
  ...opt
})
// 物业客服通过报修单
export const _managerpass = ({ UnionID, RepairID }) => fetch({
  action: 'RepairDealPass',
  UnionID,
  RepairID
})
// 物业客服获取技术员列表
export const _engineers = ({ UnionID, ID }) => fetch({
  action: 'RepairGetBuilder',
  UnionID,
  ID
})
// 物业客服分配
export const _dispatch = ({ UnionID, RepairID, BuilderID, ReturnMsg }) => fetch({
  action: 'RepairAllot',
  UnionID,
  RepairID,
  BuilderID,
  ReturnMsg
})