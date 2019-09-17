import Page from '../../common/Page'
import { _list as _newslist } from '../../api/news'
import { _entries } from '../../api/home'
import { _list as _rentlist } from '../../api/rent'
const app = getApp()
Page({
  data: {
    news: [],
    entries: [],
    rents: []
  },
  initQuery () {
    wx.showNavigationBarLoading()
    let stack = [
      _newslist({ PageIndex: 1, PageSize: 3 }),
      _entries(),
      _rentlist({ PageIndex: 1, PageSize: 3 })
    ]
    Promise.all(stack)
      .then(res => {
        wx.hideNavigationBarLoading()
        this.set({
          news: res[0].data.data.list,
          entries: res[1].data.data,
          rents: res[2].data.data.dt.map(ele => {
            ele.imgs = ele.ImgList ? ele.ImgList.split(',').splice(0, 4) : []
            return ele
          })
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
