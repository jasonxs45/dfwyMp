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
// 下单
export const _submit = ({
  UnionID,
  StationID,
  SendManID,
  ReceiveManID,
  SenderType,
  GoodsTypeList,
  ExpressCompany,
  Weight,
  Price,
  Goods_name,
  Goods_count
}) => post({
  action: 'CreateExpressBill',
  UnionID,
  StationID,
  SendManID,
  ReceiveManID,
  SenderType,
  GoodsTypeList,
  ExpressCompany,
  Weight,
  Price,
  Goods_name,
  Goods_count
})
// 支付
export const _pay = ({ UnionID, OrderID }) => fetch({
  action: 'ExpressBillPay',
  UnionID,
  OrderID
})
// 订单列表
export const _list = ({ UnionID, State, PageIndex, PageSize }) => fetch({
  action: 'GetExpressBillListForPage',
  UnionID,
  State,
  PageIndex,
  PageSize
})
// 订单详情
export const _detail = OrderID => fetch({
  action: 'GetExpressBillDetail',
  OrderID
})