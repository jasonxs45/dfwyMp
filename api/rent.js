import { fetch, post } from './index'
/**================================
 *           房屋租赁
 ================================*/
//  获取租房信息列表
export const _list = ({ HouseType = '', StageID = '', Mode = '', KeyWord = '', PageIndex, PageSize }) => fetch({
  action: 'GetSocialList',
  HouseType,
  StageID,
  Mode,
  KeyWord,
  PageIndex,
  PageSize
})
// 获取租房详情
export const _detail = id => fetch({
  action: 'GetSocialDetailForID',
  ID: id
})
// 提交租房记录
export const _submit = ({ UnionID, StageID, Title, Desc, ImgList, Phone, IsVip, Acreage, Mode, Price, Floor, HouseType, HouseID }) => post({
  action: 'AddSocial',
  UnionID,
  StageID,
  Title,
  Desc,
  ImgList,
  Phone,
  IsVip,
  Acreage,
  Mode,
  Price,
  Floor,
  HouseType,
  HouseID
})
// 我的记录
export const _record = ({ UnionID, HouseType = '', StageID = '', KeyWord = '', PageIndex = 1, PageSize = 30 }) => fetch({
  action: 'GetMySocialList',
  UnionID,
  HouseType,
  StageID,
  KeyWord,
  PageIndex,
  PageSize
})