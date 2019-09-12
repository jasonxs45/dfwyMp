import MComponent from '../../common/MComponent'
import { _list } from '../../api/news'
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
    }
  },
  methods: {
    getList() {
      const { pageIndex: PageIndex } = this.data
      const PageSize = 10
      wx.showNavigationBarLoading()
      this.set({
        loading: true
      })
      _list({ PageIndex, PageSize })
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
              list: data.list,
              totalCount: data.dateCount
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
      let{ pageIndex: PageIndex } = this.data
      const PageSize = 10
      PageIndex += 1
      _list({ PageIndex, PageSize })
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
              list: list.slice().concat(data.list),
              totalCount: data.dateCount,
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
      this.getList()
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
