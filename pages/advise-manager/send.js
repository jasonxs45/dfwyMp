import Page from '../../common/Page'
const app = getApp()
Page({
  data: {},
  back () {
    wx.navigateBack()
  },
  onLoad() {
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
        this.set({
          memberInfo
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})
