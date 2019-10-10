import Page from '../../common/Page'
import { _contractors, _delcontractor } from '../../api/expressage'
const app = getApp()
Page({
  data: {
    role: '',
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
    console.log('拉取列表')
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
  goForm(e) {
    const { index } = e.currentTarget.dataset
    const { list, role } = this.data
    if (role) {
      wx.setStorage({
        key: role,
        data: list[index],
        success: res => {
          wx.redirectTo({
            url: './submit'
          })
        },
        fail: err => {
          console.log(err)
          wx.showModal({
            title: '对不起',
            content: err.errMsg,
            showCancel: false
          })
        }
      })
    }
  },
  slideButtonTap(e) {
    const { list } = this.data
    const { index } = e.currentTarget.dataset
    let { index: btnIndex } = e.detail
    console.log(btnIndex, index)
    btnIndex = Number(btnIndex)
    if (btnIndex === 0) {
      const id = list[index].id
      this.doDel(id)
    }
  },
  doDel(id) {
    wx.showModal({
      title: '温馨提示',
      content: '确定删除吗？',
      success: r => {
        if (r.confirm) {
          const UnionID = wx.getStorageSync('uid')
          app.loading('加载中')
          _delcontractor({UnionID, ID: id})
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code === 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: rr => {
                  if(rr.confirm && code === 0) {
                    this.getContractors()
                    const sender = wx.getStorageSync('sender')
                    const receiver = wx.getStorageSync('receiver')
                    if (sender && sender.id == id) {
                      wx.removeStorageSync('sender')
                    }
                    if (receiver && receiver.id == id) {
                      wx.removeStorageSync('receiver')
                    }
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
  onLoad(options) {
    const { role } = options
    this.data.role = role
  },
  onShow() {
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
  }
})