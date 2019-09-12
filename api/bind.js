import { fetch, post } from './index'
/**================================
 *           绑定房源
 ================================*/
//  查询项目
export const _getProjects = () => fetch({
  action: 'GetProjectList'
})
// 查询房源
export const _getHouses = ({ ProjectID, OwnName }) => fetch({
  action: 'GetHouseListForOwn',
  ProjectID,
  OwnName
})
// 查询业主的房源
export const _getMyHouse = UnionID => fetch({
  action: 'GetHouseListForUnionID',
  UnionID
})
// 绑定业主
export const _bindOwner = ({ UnionId, HouseId, OwenName, CardId}) => fetch({
  action: 'OwnBindHouse',
  UnionId,
  HouseId,
  OwenName,
  CardId
})
// 二手业主查询项目
export const _getSecondProjects = () => fetch({
  action: 'GetStageList'
})
// 二手业主绑定
export const _bindsecond = ({ UnionID, StateID, Building, Unit, HouseNo, Name, CertNumber, Tel, images}) => post({
  action: 'SecondWonBand',
  UnionID,
  StateID,
  Building,
  Unit,
  HouseNo,
  Name,
  CertNumber,
  Tel,
  images
})
// 家属租户绑定前查询
export const _checkrelatives = UnionID => fetch({
  action: 'GetFamilyBindInfo',
  UnionID
})
// 家属、租户绑定
export const _bindrelatives = ({ UnionID, Name, CertNo, Tel }) => fetch({
  action: 'FamilyBindHouse',
  UnionID,
  Name,
  CertNo,
  Tel
})
// 查询家属租户提交的信息
export const _getrelatives = CheckID => fetch({
  action: 'GetCheckFamilyInfo',
  CheckID
})
// 审核通过
export const _pass = ({ MemberID, HouseID, Type }) => fetch({
  action: 'OwnChackFamily',
  MemberID,
  HouseID,
  Type
})
// 获取单个房源的成员列表
export const _memberlist = ({ HouseID, UnionID }) => fetch({
  action: 'GetPersonList',
  HouseID,
  UnionID
})
// 获取单个房源的信息
export const _houseinfo = id => fetch({
  action: 'GetHouseDetalInfo',
  HouseID: id
})
// 成员解绑
export const _offBind = ({ MemberId, HouseId }) => fetch({
  action: 'HouseUnBind',
  MemberId,
  HouseId
})