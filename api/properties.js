import { fetch, post } from './index'
/**================================
 *           物业缴费
 ================================*/
// 查询欠费
export const _list = UnionID => fetch({
  action: 'GeManagePayMessage',
  UnionID
})
// 缴费
export const _pay = ({ UnionID, HouseID, ArrearsID, MonthlyQuantity, Price }) => post({
  action: 'CreatePayBill',
  UnionID,
  HouseID,
  ArrearsID,
  MonthlyQuantity,
  Price
})
// 缴费记录
export const _history = ({ UnionID, PageIndex, PageSize = 10 }) => fetch({
  action: 'GetPayListForPage',
  UnionID,
  PageIndex,
  PageSize
})
// 详情
export const _detail = ({ UnionID, ID }) => fetch({
  action: 'GetManagePayDetail',
  UnionID,
  ID
})