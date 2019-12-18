import MComponent from '../../common/MComponent'
import { formatDate } from '../../utils/util'
import { _record, _switch, _del } from '../../api/rent'
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
        ele.online = ele.IsUp
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
    switchState (e) {
      const { list } = this.data
      const { index } = e.currentTarget.dataset
      const UnionID = wx.getStorageSync('uid')
      const ID = list[index].id
      const IsUp = !list[index].IsUp
      app.loading('加载中')
      _switch({
        UnionID,
        ID,
        IsUp
      })
        .then(res => {
          wx.hideLoading()
          const { code, msg, data } = res.data
          app.toast(msg)
          if (code === 0){
            this.set({
              [`list[${index}].IsUp`]: IsUp
            })
          }
        })
        .catch(err => {
          wx.hideLoading()
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    edit (e) {
      const { list } = this.data
      const { index } = e.currentTarget.dataset
      const ID = list[index].id
      wx.navigateTo({
        url: `/pages/rent/edit?id=${ID}`,
      })
    },
    del (e) {
      wx.showModal({
        title: '温馨提示',
        content: '确定要进行此操作吗？',
        success: r => {
          if (r.confirm) {
            let { list } = this.data
            const { index } = e.currentTarget.dataset
            const UnionID = wx.getStorageSync('uid')
            const ID = list[index].id
            app.loading('加载中')
            _del({ UnionID, ID })
              .then(res => {
                wx.hideLoading()
                const { code, msg, data } = res.data
                app.toast(msg)
                if (code === 0) {
                  list.splice(index, 1)
                  this.set({
                    list
                  })
                }
              })
              .catch(err => {
                wx.hideLoading()
                wx.showModal({
                  title: '对不起',
                  content: err.toString(),
                  showCancel: false
                })
              })
          }
        }
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
