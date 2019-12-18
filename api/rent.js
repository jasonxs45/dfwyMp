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
// 删除单条记录
export const _del = ({ UnionID, ID }) => fetch({
  action: 'DeleteSocia',
  UnionID,
  ID
})
// 上架下架
export const _switch = ({ UnionID, ID, IsUp }) => fetch({
  action: 'changeIsUp',
  UnionID,
  ID,
  IsUp
})
// 编辑修改
export const _modify = ({ UnionID,
  ID,
  Title,
  Desc,
  ImageList,
  Phone,
  Acreage,
  Price
}) => fetch({
  action: 'UpdateSocial',
  UnionID,
  ID,
  Title,
  Desc,
  ImageList,
  Phone,
  Acreage,
  Price
})