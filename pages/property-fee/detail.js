import MComponent from '../../common/MComponent'
import { _detail } from '../../api/properties'
import { formatNumber } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    id: '',
    content: null
  },
  computed: {
    price () {
      let str = '￥0.00'
      if (this.data.content !== null) {
        str = '￥' + formatNumber(this.data.content.Price.replace(/,/g, ''), 2)
      }
      return str
    },
    list () {
      let arr
      if (this.data.content) {
        arr = this.data.content.dtDetal.map(item => {
          item.price = '￥' + formatNumber(Number(item.Price), 2)
          return item
        })
      } else {
        arr = []
      }
      return arr
    }
  },
  methods: {
    initQuery() {
      wx.showNavigationBarLoading()
      const UnionID = wx.getStorageSync('uid')
      const { id: ID } = this.data
      _detail({ UnionID, ID })
        .then(res => {
          wx.hideNavigationBarLoading()
          const { code, msg, data } = res.data
          if (code != 0) {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false,
              success: r => {
                if (r.confirm) {
                  wx.navigateBack()
                }
              }
            })
          } else {
            this.set({
              content: data
            })
          }

        })
        .catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onLoad(opt) {
      this.data.id = opt.id
      app.loading('加载中')
      app.checkAuth()
        .then(res => {
          wx.hideLoading()
          this.initQuery()
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
