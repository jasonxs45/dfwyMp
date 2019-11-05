import MComponent from '../../common/MComponent'
import { _list } from '../../api/message'
import { formatDate } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    list: [],
    loading: false,
    pageIndex: 1,
    totalCount: 0
  },
  computed: {
    finished () {
      return this.data.list.length >= this.data.totalCount
    },
    showList () {
      return this.data.list.map(item =>  {
        item.addTime = formatDate(new Date(item.addTime), 'yyyy-MM-dd')
        return item
      })
    }
  },
  methods: {
    getList() {
      const UnionID = wx.getStorageSync('uid')
      const { pageIndex: PageIndex } = this.data
      const PageSize = 10
      wx.showNavigationBarLoading()
      this.set({
        loading: true
      })
      _list({ UnionID, PageIndex, PageSize })
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          this.set({
            loading: false
          })
          const { code, msg, data } = res.data
          if (code != 0) {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
            })
          } else {
            this.set({
              list: data.dtNews,
              totalCount: data.NewCount
            })
          }
        })
        .catch(err => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          this.set({
            loading: false
          })
          console.log(err)
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    loadMore() {
      this.set({
        loading: true
      })
      const UnionID = wx.getStorageSync('uid')
      let{ pageIndex: PageIndex } = this.data
      const PageSize = 10
      PageIndex += 1
      _list({ UnionID, PageIndex, PageSize })
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          this.set({
            loading: false
          })
          const { code, msg, data } = res.data
          if (code != 0) {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
            })
          } else {
            let { list } = this.data
            this.set({
              list: list.slice().concat(data.dtNews),
              totalCount: data.NewCount,
              pageIndex: PageIndex
            })
          }
        })
        .catch(err => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          this.set({
            loading: false
          })
          console.log(err)
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
            this.getList()
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
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
    },
    onPullDownRefresh () {
     this.set({
       pageIndex: 1
     })
      .then(() => {
        this.getList()
      })
    },
    onReachBottom() {
      const { finished } = this.data
      if (!finished) {
        this.loadMore()
      }
    }
  }
})
