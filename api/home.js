import { fetch, post } from './index'
/**================================
 *           投诉建议
 ================================*/
 export const _entries = () => fetch({
   action: 'GetIndexPath'
 })