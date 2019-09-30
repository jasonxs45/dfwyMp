import Page from '../../common/Page'
const app = getApp()
const entries = [
  {
    icon: './myhouse.png',
    label: '我的房源',
    path: '/pages/myhouse/index',
    needMember: true
  },
  {
    icon: './rent.png',
    label: '房屋租赁',
    path: '/pages/rent/list',
    needMember: false
  },
  {
    icon: './rent.png',
    label: '房屋租赁(我的记录)',
    path: '/pages/rent/record',
    needMember: true
  },
  {
    icon: './repair.png',
    label: '故障报修（业主）',
    path: '/pages/repair-user/list',
    needMember: true
  },
  {
    icon: './repair.png',
    label: '故障报修（技术员）',
    path: '/pages/repair-engineer/list',
    needMember: false
  },
  {
    icon: './repair.png',
    label: '故障报修（技术员主管）',
    path: '/pages/repair-engin-manager/list',
    needMember: false
  },
  {
    icon: './repair.png',
    label: '故障报修（物业客服）',
    path: '/pages/repair-manager/list',
    needMember: false
  },
  {
    icon: './advise.png',
    label: '投诉建议（业主）',
    path: '/pages/advise-user/list',
    needMember: true
  },
  {
    icon: './advise.png',
    label: '投诉建议（物业客服）',
    path: '/pages/advise-manager/list?role=物业',
    needMember: false
  },
  {
    icon: './advise.png',
    label: '投诉建议（地产客服）',
    path: '/pages/advise-manager/list?role=地产',
    needMember: false
  },
  {
    icon: './news.png',
    label: '新闻中心',
    path: '/pages/news/list',
    needMember: false
  },
  {
    icon: './notice.png',
    label: '社区通知',
    path: '/pages/message/list',
    needMember: false
  },
  {
    icon: './deliver.png',
    label: '快递代收',
    path: '/pages/myhouse/index',
    needMember: true
  },
  {
    icon: './fee.png',
    label: '物业缴费',
    path: '/pages/myhouse/index',
    needMember: true
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
  onLoad (options) {},
  onShow () {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid, true)
      })
      .then(memberInfo => {
        wx.hideLoading()
        this.set({
          memberInfo,
          entries: entries.map(item => {
            if (item.needMember) {
              item.needMember = false
            }
            return item
          })
        })
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })
  }
})