import MComponent from '../../common/MComponent'
import { _enginemanagerlist as _list } from '../../api/repair'
import { formatDate } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    loading: false,
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
        ele.AddTime = formatDate(new Date(ele.AddTime), 'yyyy-MM-dd')
        return ele
      })
    }
  },
  methods: {
    init() {
      this.set({
        loading: false,
        pageIndexes: 1,
        lists: [],
        totalCount: 0
      }).then(() => {
        this.initQuery()
      })
    },
    initQuery() {
      const UnionID = wx.getStorageSync('uid')
      const PageSize = 10
      const { pageIndex } = this.data
      this.set({
        loading: true
      })
      _list({ UnionID, State: '待审核', PageIndex: pageIndex, PageSize })
        .then(res => {
          const { code, msg, data } = res.data
          if (code == 0) {
            const totalCount = res.data.data ? res.data.data.count : 0
            const list = res.data.data ? res.data.data.repairList : []
            this.set({
              totalCount,
              list
            })
          } else {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
            })
          }
          this.set({
            loading: false
          })
        })
        .catch(err => {
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
    loadMore() {
      const { pageIndex, list } = this.data
      let PageIndex = pageIndex + 1
      const UnionID = wx.getStorageSync('uid')
      const PageSize = 10
      this.set({
        loading: true
      })
      _list({ UnionID, State: '待审核', PageIndex, PageSize })
        .then(res => {
          const data = res.data.data.repairList
          const list1 = list.slice().concat(data)
          this.set({
            loading: false,
            list: list1,
            pageIndex: PageIndex
          })
        })
        .catch(err => {
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
    onReachBottom() {
      const { finished } = this.data
      if (!finished) {
        this.loadMore()
      }
    },
    onLoad() {
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          wx.hideLoading()
          this.init()
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
          const path = encodeURIComponent(this.route)
          wx.redirectTo({
            url: `/pages/auth/index?redirect=${path}`
          })
        })
    }
  }
})
