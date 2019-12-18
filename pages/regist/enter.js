import Page from '../../common/Page'
const app = getApp()
Page({
  data: {
    navs: [
      {
        name: '业主',
        img: 'http://dongfangwuye.1juke.cn/Content/Upload/PagePath/owner.png',
        path: './bindowner'
      },
      {
        name: '家属',
        img: 'http://dongfangwuye.1juke.cn/Content/Upload/PagePath/family.png',
        path: './bindsubs?role=家属'
      },
      {
        name: '租户',
        img: 'http://dongfangwuye.1juke.cn/Content/Upload/PagePath/renter.png',
        path: './bindsubs?role=租户'
      },
      {
        name: '二手业主',
        img: 'http://dongfangwuye.1juke.cn/Content/Upload/PagePath/second.png',
        path: './bindsecond'
      },
      {
        name: '商写用户',
        img: 'http://dongfangwuye.1juke.cn/Content/Upload/PagePath/shop.png',
        path: './bindshop'
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