import Page from '../../common/Page'
import { _userdetail as _detail } from '../../api/advise'
const app = getApp()
Page({
  data: {
    detail: {}
  },
  getDetail () {
    const UnionID = wx.getStorageSync('uid')
    const { id: SuggestID } = this.data
    wx.showNavigationBarLoading()
    _detail({ UnionID, SuggestID })
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        data.className = data.Type.includes('投诉')
                        ? 'red'
                        : data.Type.includes('表扬')
                        ? 'yellow'
                        : 'blue'
        data.imgs = data.Images ? data.Images.split(',') : []
        data.Record.imgs = data.Record.ImageList ? data.Record.ImageList.split(',') : []
        if (code == 0) {
          this.set({
            detail: data
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: msg.toString(),
            showCancel: false
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
  },
  onShow () {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
        wx.hideLoading()
        if (memberInfo.Type === '未绑定') {
          wx.showModal({
            title: '温馨提示',
            content: '还未绑定房源',
            showCancel: false,
            success: r => {
              if (r.confirm) {
                wx.redirectTo({
                  url: '/pages/regist/enter'
                })
              }
            }
          })
        } else {
          this.getDetail()
        }
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '还未绑定房源',
          showCancel: false,
          success: r => {
            if (r.confirm) {
              wx.redirectTo({
                url: '/pages/regist/enter'
              })
            }
          }
        })
      })
  }
})
