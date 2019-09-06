import Page from '../../common/Page'
const app = getApp()
Page({
  data: {
    navs: [
      {
        name: '业主',
        img: '/pages/regist/owner.png',
        path: './bindowner'
      },
      {
        name: '家属',
        img: '/pages/regist/family.png',
        path: './bindsubs?role=家属'
      },
      {
        name: '租户',
        img: '/pages/regist/renter.png',
        path: './bindsubs?role=租户'
      },
      {
        name: '二手业主',
        img: '/pages/regist/second.png',
        path: './bindsecond'
      }
    ]
  },
  onGetWXUserInfo(e) {
    const { index } = e.currentTarget.dataset
    const { navs } = this.data
    app.onGetWXUserInfo(e)
      .then(res => {
        wx.navigateTo({
          url: navs[index].path
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  onLoad() {
    app.login().catch(err => {
      wx.showModal({
        title: '对不起',
        content: err.toString(),
        showCancel: false
      })
    })
  }
})