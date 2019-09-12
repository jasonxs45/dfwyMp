import Page from '../../common/Page'
import { _detail } from '../../api/news'
const app = getApp()
Page({
  data: {
    id: '',
    content: ''
  },
  initQuery() {
    wx.showNavigationBarLoading()
    const { id } = this.data
    _detail(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        if (code != 0) {
          wx.showModal({
            title: '对不起',
            content: msg,
            showCancel: false
          })
        } else {
          this.set({
            content: data
          })
        }
        
      })
      .catch(err => {
        console.log(err)
        wx.hideNavigationBarLoading()
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  onLoad(opt) {
    this.data.id = opt.id
    this.initQuery()
  }
})
