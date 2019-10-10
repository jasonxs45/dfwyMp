import { fetch, post } from './index'
/**================================
 *           快递代发
 ================================*/
//  获取寄件基础信息
export const _options = () => fetch({
  action: 'GetDefaultBill'
})
// 地址簿
export const _contractors = UnionID => fetch({
  action: 'GetReceiveLog',
  UnionID
})
// 查询联系人详情
export const _contractor = ID => fetch({
  action: 'GetReceiveInfo',
  ID
})
// 增加或更新地址簿联系人
export const _addcontractor = ({
  ID,
  UnionID,
  Name,
  Tel,
  ProvinceCode,
  CityCode,
  AreaCode,
  Address,
  Company
}) => post({
  action: 'AddOrUpdateReceiveInfo',
  ID,
  UnionID,
  Name,
  Tel,
  ProvinceCode,
  CityCode,
  AreaCode,
  Address,
  Company
})
// 删除联系人
export const _delcontractor = ({ UnionID, ID }) => fetch({
  action: 'DeleteReceiveInfo',
  UnionID,
  ID
})
// 计算价格
export const _calculate = ({ ExpressType, Weight, CityCode, BoxType }) => fetch({
  action: 'ComputePrice',
  ExpressType,
  Weight,
  CityCode,
  BoxType
})