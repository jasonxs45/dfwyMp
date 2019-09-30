import Page from '../../common/Page'
import { _dealerList as _list, _dispatch } from '../../api/advise'
const app = getApp()
Page({
  data: {
    list: [],
    id: '',
    mid: ''
  },
  back() {
    wx.navigateBack()
  },
  onChange(e) {
    const { value } = e.detail
    const { list } = this.data
    this.data.mid = list[value].ID
  },
  getList() {
    const UnionID = wx.getStorageSync('uid')
    _list(UnionID)
      .then(res => {
        wx.hideLoading()
        const { code, msg, data } = res.data
        if (code == 0) {
          this.set({
            list: data
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  dispatch() {
    const UnionID = wx.getStorageSync('uid')
    const { mid: AdminID, id: SuggestID } = this.data
    if (AdminID == '') {
      app.toast('请选择客服')
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '确定指派吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          _dispatch({ UnionID, AdminID, SuggestID })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: rr => {
                  if (rr.confirm && code == 0) {
                    wx.navigateBack()
                  }
                }
              })
            })
            .catch(err => {
              wx.hideLoading()
              console.log(err)
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
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        this.getList()
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
        const path = encodeURIComponent(this.route)
        wx.redirectTo({
          url: `/pages/auth/index?redirect=${path}`
        })
      })
  }
})
