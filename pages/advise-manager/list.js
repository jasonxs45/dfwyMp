import MComponent from '../../common/MComponent'
import { _managerList as _list } from '../../api/advise'
const app = getApp()
MComponent({
  data: {
    currentIndex: 0,
    tabs: [
      {
        text: '待受理',
        value: 0
      },
      {
        text: '已受理',
        value: 1
      },
      {
        text: '已处理',
        value: 2
      }
    ],
    loading: [],
    lists: [],
    pageIndexes: [],
    totalCount: []
  },
  computed: {
    finishes() {
      return this.data.totalCount.map((item, index) => {
        return item <= (this.data.lists[index] ? this.data.lists[index].length : 0)
      })
    },
    showLists() {
      return this.data.lists.map(item => {
        return item.map(ele => {
          ele.className = ele.Type.includes('投诉')
            ? 'red'
            : ele.Type.includes('表扬')
              ? 'yellow'
              : 'blue'
          return ele
        })
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
        loading: [false, false, false],
        pageIndexes: [1, 1, 1],
        lists: [[], [], []],
        totalCount: [0, 0, 0]
      })
      .then(() => {
        this.initQuery()
      })
    },
    initQuery() {
      const UnionID = wx.getStorageSync('uid')
      const PageSize = 10
      const { currentIndex, tabs, pageIndexes } = this.data
      const funcs = pageIndexes.map((item, index) => _list({ UnionID, State: tabs[index].value, PageIndex: item, PageSize }))
      this.set({
        [`loading[${currentIndex}]`]: true
      })
      Promise.all(funcs)
        .then(res => {
          this.set({
            [`loading[${currentIndex}]`]: false
          })
          if (res[0].data.code == 0) {
            const totalCount = res.map(item => item.data.data.PageCount)
            const lists = res.map(item => item.data.data.list)
            this.set({
              totalCount,
              lists
            })
          } else {
            wx.showModal({
              title: '对不起',
              content: res[0].data.msg,
              showCancel: false
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.set({
            [`loading[${currentIndex}]`]: false
          })
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    loadMore(current) {
      const { tabs, pageIndexes, lists } = this.data
      let PageIndex = pageIndexes[current] + 1
      const UnionID = wx.getStorageSync('uid')
      const PageSize = 10
      this.set({
        [`loading[${current}]`]: true
      })
      _list({ UnionID, State: tabs[current].value, PageIndex, PageSize })
        .then(res => {
          const data = res.data.data.list
          const list = lists[current].slice().concat(data)
          this.set({
            [`loading[${current}]`]: false,
            [`lists[${current}]`]: list,
            [`pageIndexes[${current}]`]: PageIndex
          })
        })
        .catch(err => {
          console.log(err)
          this.set({
            [`loading[${current}]`]: false
          })
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onReachLower() {
      const { currentIndex, finishes } = this.data
      const finished = finishes[currentIndex]
      if (!finished) {
        this.loadMore(currentIndex)
      }
    },
    onLoad(opt) {
      this.set({
        role: opt.role
      })
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          wx.hideLoading()
          this.init()
        })
        .catch(err => {
          wx.hideLoading()
          const path =  encodeURIComponent(this.route)
          wx.redirectTo({
            url: `/pages/auth/index?redirect=${path}`
          })
        })
    },
    onShow () {}
  }
})
