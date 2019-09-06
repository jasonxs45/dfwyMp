import { fetch } from './index'
// 通过uid查询用户信息
export const _getUserInfoByUid = uid => fetch({
  action: 'MemberCenterData',
  UnionID: uid
})
// 
export const _getWXUserInfo = ({ OpenId, iv, encryptedData }) => fetch({
  action: 'GetUserInfo',
  OpenId,
  iv,
  encryptedData
})