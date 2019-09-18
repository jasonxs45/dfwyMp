import MComponent from '../../common/MComponent'
import { _userlist as _list } from '../../api/advise'
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
    finishes () {
      return this.data.totalCount.map((item, index) => {
        return item <= (this.data.lists[index] ? this.data.lists[index].length : 0)
      })
    },
    showLists () {
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
      }).then(() => {
        this.initQuery()
      })
    },
    initQuery() {
      const UnionID = wx.getStorageSync('uid')
      const Type = ''
      const PageSize = 10
      const { currentIndex, tabs, pageIndexes } = this.data
      const funcs = pageIndexes.map((item, index) => _list({ UnionID, Type, State: tabs[index].value, PageIndex: item, PageSize }))
      this.set({
        [`loading[${currentIndex}]`]: true
      })
      Promise.all(funcs)
        .then(res => {
          console.log(res)
          const totalCount = res.map(item => {
            let count = item.data.data ? item.data.data.PageCount : 0
            return count
          })
          const lists = res.map(item => item.data.data.list)
          this.set({
            [`loading[${currentIndex}]`]: false,
            totalCount,
            lists
          })
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
      const Type = ''
      const PageSize = 10
      this.set({
        [`loading[${current}]`]: true
      })
      _list({ UnionID, Type, State: tabs[current].value, PageIndex, PageSize })
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
    onLoad() {
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          const uid = res
          return app.getUserInfoByUid(uid)
        })
        .then(memberInfo => {
          wx.hideLoading()
          if (memberInfo.Type === '未绑定') {
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
