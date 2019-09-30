import Page from '../../common/Page'
import { _contractors } from '../../api/expressage'
const app = getApp()
Page({
  data: {
    list: [],
    loading: false,
    slideButtons: [
      {
        text: '删除',
        extClass: 'slide-btn del'
      }
    ]
  },
  getContractors() {
    const UnionID = wx.getStorageSync('uid')
    this.set({
      loading: true
    })
    _contractors(UnionID)
      .then(res => {
        wx.hideLoading()
        this.set({
          loading: false
        })
        const { code, msg, data } = res.data
        if (code == 0) {
          this.set({ list: data })
        } else {
          wx.showModal({
            title: '对不起',
            content: msg,
            showCancel: false
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
        this.set({
          loading: false
        })
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  slideButtonTap (e) {
    const { index } = e.detail
    // const id = list
    this.doDel()
  },
  doDel () {
    wx.showModal({
      title: '温馨提示',
      content: '确定删除吗？',
      success: r => {
        if (r.confirm) {

        }
      }
    })
  },
  onLoad(options) {
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
          this.getContractors()
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
  },
  onShow() { }
})