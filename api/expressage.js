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
  action: 'GetSenderLog',
  UnionID
})