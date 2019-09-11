import Page from '../../common/Page'
const app = getApp()
const entries = [
  {
    icon: './我的房源.png',
    label: '我的房源',
    path: '/pages/myhouse/index'
  },
  {
    icon: './房屋租赁.png',
    label: '房屋租赁',
    path: '/pages/myhouse/index'
  },
  {
    icon: './故障报修.png',
    label: '故障报修',
    path: '/pages/myhouse/index'
  },
  {
    icon: './投诉建议.png',
    label: '投诉建议',
    path: '/pages/advise-user/list'
  },
  {
    icon: './新闻中心.png',
    label: '新闻中心',
    path: '/pages/myhouse/index'
  },
  {
    icon: './社区通知.png',
    label: '社区通知',
    path: '/pages/myhouse/index'
  },
  {
    icon: './快递代收.png',
    label: '快递代收',
    path: '/pages/myhouse/index'
  },
  {
    icon: './物业缴费.png',
    label: '物业缴费',
    path: '/pages/myhouse/index'
  }
]
Page({
  data: {
    memberInfo: null,
    entries
  },
  goInfo () {
    wx.navigateTo({
      url: '/pages/myinfo/index'
    })
  },
  onLoad (options) {
  },
  onShow () {
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