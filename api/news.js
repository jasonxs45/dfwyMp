import { fetch, post } from './index'
/**================================
 *           新闻中心
 ================================*/
//  新闻列表
 export const _list = ({ PageIndex, PageSize }) => fetch({
   action: 'NewsGetList',
   PageIndex,
   PageSize
 })
//  新闻详情
export const _detail = id => fetch({
  action: 'NewsGetInfo',
  NewID: id
})