import Page from '../../common/Page'
const app = getApp()
Page({
  data: {
    item: ''
  },
  onLoad(opt) {
    this.set({
      item: opt.item
    })
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
      })
      .catch(err => {
        console.log(err)
      })
  }
})
