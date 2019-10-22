import { fetch, post } from './index'
/**================================
 *           首页菜单
 ================================*/
 export const _entries = () => fetch({
   action: 'GetIndexPath'
 })