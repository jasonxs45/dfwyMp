import Page from '../../common/Page'
import {
  _managernotaccept as _notaccept,
  _managernotpass as _notpass
} from '../../api/repair'
const app = getApp()
const titleMap = {
  accept: '拒绝受理',
  pass: '拒绝通过'
}
Page({
  data: {
    id: '',
    tar: '',
    title: '',
    mark: ''
  },
  _notaccept,
  _notpass,
  onInput(e) {
    this.data.mark = e.detail.value
  },
  back() {
    wx.navigateBack()
  },
  submit() {
    const { id: RepairID, mark: ReturnMsg, tar, title } = this.data
    const todo = `_not${tar}`
    const UnionID = wx.getStorageSync('uid')
    if (!ReturnMsg.trim()) {
      app.toast(`${title}原因不能为空`)
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定进行此操作吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          this[todo]({ UnionID, RepairID, ReturnMsg })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: r => {
                  if (r.confirm && code == 0) {
                    wx.redirectTo({
                      url: './list'
                    })
                  }
                }
              })
            })
            .catch(err => {
              console.log(err)
              wx.hideLoading()
              wx.showModal({
                title: '对不起',
                content: err.toString(),
                showCancel: false
              })
            })
        }
      }
    })
  },
  onLoad(opt) {
    this.data.id = opt.id
    this.data.tar = opt.tar
    const title = titleMap[opt.tar]
    wx.setNavigationBarTitle({
      title
    })
    this.set({
      title
    })
  },
  onShow() {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        wx.hideLoading()
        // this.init()
      })
      .catch(err => {
        wx.hideLoading()
        const path = encodeURIComponent(this.route)
        wx.redirectTo({
          url: `/pages/auth/index?redirect=${path}`
        })
      })
  }
})
