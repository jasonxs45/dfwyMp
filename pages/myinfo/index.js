import Page from '../../common/Page'
const app = getApp()
Page({
  data: {
    memberInfo: null
  },
  onLoad() {
    const memberInfo = app.globalData.memberInfo
    if (app.globalData.memberInfo) {
      this.set({
        memberInfo
      })
    } else {
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          const uid = res
          return app.getUserInfoByUid(uid)
        })
        .then(memberInfo => {
          wx.hideLoading()
          console.log(app.globalData.memberInfo)
          this.set({
            memberInfo
          })
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
        })
    }
  }
})
