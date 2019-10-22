import MComponent from '../../common/MComponent'
import { _managelist } from '../../api/usercenter'
const app = getApp()
const entries = [
  {
    icon: './myhouse.png',
    label: '我的房源',
    path: '/pages/myhouse/index',
    needMember: true
  },
  {
    icon: './repair.png',
    label: '故障报修',
    path: '/pages/repair-user/list',
    needMember: true
  },
  {
    icon: './advise.png',
    label: '投诉建议',
    path: '/pages/advise-user/list',
    needMember: true
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
const other = [
  {
    icon: './repair.png',
    label: '故障报修（技术员）',
    path: '/pages/repair-engineer/list'
  },
  {
    icon: './repair.png',
    label: '故障报修（技术员主管）',
    path: '/pages/repair-engin-manager/list'
  },
  {
    icon: './repair.png',
    label: '故障报修（物业客服）',
    path: '/pages/repair-manager/list'
  },
  {
    icon: './advise.png',
    label: '投诉建议（物业客服）',
    path: '/pages/advise-manager/list?role=物业'
  },
  {
    icon: './advise.png',
    label: '投诉建议（地产客服）',
    path: '/pages/advise-manager/list?role=地产'
  }
]
MComponent({
  data: {
    uid: '',
    wxInfo: null,
    memberInfo: null,
    list: [
      {
        icon: './rent.png',
        label: '房屋租赁',
        path: '/pages/rent/list',
        needMember: false,
        show: true
      },
      {
        icon: './news.png',
        label: '新闻中心',
        path: '/pages/news/list',
        needMember: false,
        show: true
      },
      {
        icon: './notice.png',
        label: '社区通知',
        path: '/pages/message/list',
        needMember: false,
        show: true
      },
    ]
  },
  computed: {
    showList() {
      let { list, memberInfo } = this.data
      let arr
      if (memberInfo && memberInfo.HouseCount) {
        arr = list.map(item => {
          item.show = true
          return item
        })
      } else {
        arr = list.map(item => {
          if (item.needMember) {
            item.show = false
          } else {
            item.show = true
          }
          return item
        })
      }
      return arr
    }
  },
  methods: {
    goInfo() {
      wx.navigateTo({
        url: '/pages/myinfo/index'
      })
    },
    getManage() {
      const UnionID = wx.getStorageSync('uid')
      _managelist(UnionID)
        .then(res => {
          const { code, data } = res.data
          if (code === 0) {
            let { list } = this.data
            list = [...list, ...entries, ...data]
            this.set({
              list
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    onGetWXUserInfo(e) {
      app.onGetWXUserInfo(e)
        .then(res => {
          const { avatarUrl, nickName, unionId: uid } = res
          this.set({
            uid,
            wxInfo: {
              avatarUrl,
              nickName
            }
          })
            .then(() => {
              this.getManage()
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onLoad(options) { },
    onShow() {
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          const uid = res
          this.set({
            uid
          })
          this.getManage()
          return app.getUserInfoByUid(uid, true)
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
  }
})