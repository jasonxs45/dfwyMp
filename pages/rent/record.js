import MComponent from '../../common/MComponent'
import { formatDate } from '../../utils/util'
import { _record } from '../../api/rent'
const app = getApp()
MComponent({
  data: {
    loading: [],
    list: [],
    pageIndex: 1,
    totalCount: 0
  },
  computed: {
    finished() {
      return this.data.totalCount <= this.data.list.length
    },
    showList() {
      return this.data.list.map(ele => {
        ele.imgs = ele.ImgList ? ele.ImgList.split(',').splice(0, 4) : []
        ele.AddTime = formatDate(new Date(ele.AddTime), 'yyyy-MM-dd')
        return ele
      })
    }
  },
  methods: {
    init() {
      this.set({
        loading: false,
        pageIndex: 1,
        list: [],
        totalCount: 0
      }).then(() => {
        this.doQuery()
      })
    },
    doQuery() {
      const UnionID = wx.getStorageSync('uid')
      const { pageIndex: PageIndex } = this.data
      this.set({
        loading: true
      })
      wx.showNavigationBarLoading()
      _record({ UnionID })
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          const totalCount = res.data.data.dateCount
          const list = res.data.data.dt
          this.set({
            loading: false,
            totalCount,
            list
          })
        })
        .catch(err => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          console.log(err)
          this.set({
            loading: false
          })
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onLoad() {
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          const uid = res
          return app.getUserInfoByUid(uid)
        })
        .then(memberInfo => {
          console.log(memberInfo.Type)
          wx.hideLoading()
          if (memberInfo.Type === '未绑定' || !memberInfo.Type) {
            wx.showModal({
              title: '温馨提示',
              content: '还未绑定房源',
              showCancel: false,
              success: r => {
                if (r.confirm) {
                  wx.redirectTo({
                    url: '/pages/regist/enter'
                  })
                }
              }
            })
          } else {
            this.init()
          }
        })
        .catch(err => {
          wx.hideLoading()
          wx.showModal({
            title: '温馨提示',
            content: '还未绑定房源',
            showCancel: false,
            success: r => {
              if (r.confirm) {
                wx.redirectTo({
                  url: '/pages/regist/enter'
                })
              }
            }
          })
        })
    }
  }
})
