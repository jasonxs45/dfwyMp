import Page from '../../common/Page'
import {
  _engineers,
  _dispatch
} from '../../api/repair'
const app = getApp()
Page({
  data: {
    id: '',
    mark: '',
    list: [],
    index: ''
  },
  onChange (e) {
    this.data.index = e.detail.value
  },
  onInput(e) {
    this.data.mark = e.detail.value
  },
  back() {
    wx.navigateBack()
  },
  getList() {
    const { id: ID } = this.data
    const UnionID = wx.getStorageSync('uid')
    _engineers({ UnionID, ID })
      .then(res => {
        wx.hideLoading()
        const { code, msg, data } = res.data
        if(code == 0) {
          this.set({
            list: data
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: msg,
            showCancel: false
          })
        }
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
  },
  submit() {
    const { id: RepairID, mark: ReturnMsg, index, list } = this.data
    const UnionID = wx.getStorageSync('uid')
    if (index === '') {
      app.toast('请选择处理人')
      return
    }
    const BuilderID = list[index].ID
    wx.showModal({
      title: '提示',
      content: '确定进行此操作吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          _dispatch({ UnionID, RepairID, BuilderID, ReturnMsg })
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
                      url: '/pages/repair-engin-manager/list'
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
  },
  onShow() {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        // wx.hideLoading()
        this.getList()
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
