import Page from '../../common/Page'
const app = getApp()
const entries = [
  {
    icon: './myhouse.png',
    label: '我的房源',
    path: '/pages/myhouse/index'
  },
  {
    icon: './rent.png',
    label: '房屋租赁',
    path: '/pages/rent/list'
  },
  {
    icon: './rent.png',
    label: '房屋租赁(我的记录)',
    path: '/pages/rent/record'
  },
  {
    icon: './repair.png',
    label: '故障报修',
    path: '/pages/myhouse/index'
  },
  {
    icon: './advise.png',
    label: '投诉建议（业主）',
    path: '/pages/advise-user/list'
  },
  {
    icon: './advise.png',
    label: '投诉建议（物业客服）',
    path: '/pages/advise-user/list?role=物业'
  },
  {
    icon: './advise.png',
    label: '投诉建议（地产客服）',
    path: '/pages/advise-user/list?role=地产'
  },
  {
    icon: './news.png',
    label: '新闻中心',
    path: '/pages/news/list'
  },
  {
    icon: './notice.png',
    label: '社区通知',
    path: '/pages/myhouse/index'
  },
  {
    icon: './deliver.png',
    label: '快递代收',
    path: '/pages/myhouse/index'
  },
  {
    icon: './fee.png',
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
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
        wx.hideLoading()
        this.set({
          memberInfo
        })
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })
  }
})