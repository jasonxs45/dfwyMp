import MComponent from '../../common/MComponent'
import { _history } from '../../api/properties'
import { formatDate, formatNumber } from '../../utils/util'
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
      return this.data.totalCount <= (this.data.list ? this.data.list.length : 0)
    },
    showList() {
      return this.data.list.map(ele => {
        ele.time = formatDate(new Date(ele.AddTime), 'yyyy-MM-dd hh:mm')
        ele.price = '￥' + formatNumber(ele.Price, 2)
        return ele
      })
    }
  },
  methods: {
    onChange(e) {
      const { value, current } = e.detail
      this.set({
        currentIndex: current === undefined ? value : current
      })
    },
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
      const { pageIndex } = this.data
      this.set({
        loading: true
      })
      _history({ UnionID, PageIndex: pageIndex })
        .then(res => {
          const totalCount = res.data.data ? res.data.data.DataCount : 0
          const list = res.data.data ? res.data.data.PayList : []
          this.set({
            loading: false,
            totalCount,
            list
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
      _list({ UnionID, State: '', PageIndex, PageSize })
        .then(res => {
          const data = res.data.data.PayList
          const list = list.slice().concat(data)
          this.set({
            loading: false,
            list,
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
    onReachLower() {
      const { finished } = this.data
      if (!finished) {
        this.loadMore()
      }
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
            this.init()
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
    }
  }
})
