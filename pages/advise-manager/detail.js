import Page from '../../common/Page'
import { _userdetail as _detail, _managerAccept as _accept } from '../../api/advise'
const app = getApp()
Page({
  data: {
    id: '',
    role: '',
    detail: {}
  },
  goDeal () {
    wx.navigateTo({
      url: `./deal?id=${this.data.id}&role=${this.data.role}`
    })
  },
  delay () {
    wx.navigateTo({
      url: `./delay?id=${this.data.id}`
    })
  },
  goSend() {
    wx.navigateTo({
      url: `./send?id=${this.data.id}&role=${this.data.role}`
    })
  },
  getDetail() {
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
        data.tagClassName = data.RoleType.includes('业主')
          ? 'red'
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
  accept () {
    wx.showModal({
      title: '温馨提示',
      content: '确定受理吗？',
      success: r => {
        if (r.confirm) {
          const UnionID = wx.getStorageSync('uid')
          const { id: SuggestID } = this.data
          app.loading('加载中')
          _accept({ UnionID, SuggestID })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: r => {
                  if (r.confirm && code == 0) {
                    this.getDetail()
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
    this.data.role = opt.role
    this.set({
      id: opt.id,
      role: opt.role
    })
  },
  onShow() {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        wx.hideLoading()
        this.getDetail()
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
