import Page from '../../common/Page'
import { _getMyHouse } from '../../api/bind'
import { formatDate } from '../../utils/util'
const app = getApp()
Page({
  data: {
    list: [],
    loading: true,
    finished: true
  },
  getMyHouse () {
    wx.showNavigationBarLoading()
    const UnionID = wx.getStorageSync('uid')
    this.set({
      loading: true,
      finished: false
    })
    _getMyHouse(UnionID)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, data, msg } = res.data
        this.set({
          list: data.map(item => {
            item.SignTime = formatDate(new Date(item.SignTime), 'yyyy年MM月dd日')
            item.Warranty = formatDate(new Date(item.Warranty), 'yyyy年MM月dd日')
            item.className = item.Type == 3
                            ? 'red'
                            : item.Type == 2
                            ? 'blue'
                            : 'yellow'
            return item
          }),
          loading: false,
          finished: true
        })
        if (code != 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
        }
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        this.set({
          loading: false,
          finished: true
        })
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  onLoad() { },
  onShow() {
    this.getMyHouse()
  }
})