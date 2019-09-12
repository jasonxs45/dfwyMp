import Page from '../../common/Page'
const app = getApp()
Page({
  data: {},
  onGetWXUserInfo(e) {
    const { index } = e.currentTarget.dataset
    const { navs } = this.data
    app.onGetWXUserInfo(e)
      .then(res => {
        const { path } = this.data
        if (path) {
          wx.redirectTo({
            url: path
          })
        } else {
          wx.navigateBack()
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  onLoad(opt) {
    const { redirect } = opt
    const path = redirect ? `/${decodeURIComponent(redirect)}` : ''
    this.data.path = path
    app.checkAuth()
      .then(res => {
      })
      .catch(err => {
        console.log(err)
      })
  }
})
