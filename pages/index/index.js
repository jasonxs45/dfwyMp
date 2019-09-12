import Page from '../../common/Page'
import { _list as _newslist } from '../../api/news'
import { _entries } from '../../api/home'
const app = getApp()
Page({
  data: {
    news: [],
    entries: []
  },
  initQuery () {
    wx.showNavigationBarLoading()
    let stack = [_newslist({ PageIndex: 1, PageSize: 3 }), _entries()]
    Promise.all(stack)
      .then(res => {
        wx.hideNavigationBarLoading()
        this.set({
          news: res[0].data.data.list,
          entries: res[1].data.data
        })
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
  onLoad () {
    this.initQuery()
  }
})
