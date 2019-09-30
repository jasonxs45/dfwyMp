import { fetch, post } from './index'
/**================================
 *           社区通知
 ================================*/
//  社区通知列表
export const _list = ({ UnionID, PageIndex, PageSize }) => fetch({
  action: 'GetNoticListForPage',
  UnionID,
  PageIndex,
  PageSize
})