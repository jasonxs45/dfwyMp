import MComponent from '../../common/MComponent'
import { _list, _pay } from '../../api/properties'
import { formatDate, formatNumber } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    current: null,
    houses: [],
    count: 6
  },
  computed: {
    lackFee() {
      const { current, houses } = this.data
      let num
      if (current === null) {
        num = 0
      } else {
        num = houses[current].ArrearsMoney
      }
      return num
    },
    showLackFee() {
      const { current, houses } = this.data
      let str
      if (current === null) {
        str = '待查'
      } else {
        str = formatNumber(houses[current].ArrearsMoney, 2) + '元'
      }
      return str
    },
    lackMonthes() {
      const { current, houses } = this.data
      let num
      if (current === null) {
        num = '待查'
      } else {
        num = houses[current].MonthlyQuantity
      }
      return num
    },
    monthList() {
      const { current, houses } = this.data
      let month
      if (current === null) {
        month = '待查'
      } else {
        month = houses[current].MonthlyList || '查无欠费'
      }
      return month
    },
    limitMonthes() {
      const { current, houses } = this.data
      let monthes
      if (current === null) {
        monthes = 0
      } else {
        monthes = houses[current].MonthlyQuantity
      }
      return monthes
    },
    fee() {
      const { current, houses } = this.data
      let num
      if (current === null) {
        num = 0
      } else {
        const price = houses[current].ManagePrice
        const count = this.data.count
        num = Number((price * count).toFixed(2))
      }
      return num
    },
    showFee() {
      const { current, houses } = this.data
      let num
      if (current === null) {
        num = 0
      } else {
        const price = houses[current].ManagePrice
        const count = this.data.count
        num = Number((price * count).toFixed(2))
      }
      return current !== null ? formatNumber(num, 2) + '元' : '待计算'
    }
  },
  methods: {
    onChange(e) {
      const { attr } = e.currentTarget.dataset
      const { value } = e.detail
      this.set({
        [attr]: value
      })
        .then(() => {
          if (attr === 'current') {
            this.set({
              count: this.data.limitMonthes
            })
          }
        })
    },
    quick () {
      this.set({
        count: 12
      })
    },
    getList() {
      const UnionID = wx.getStorageSync('uid')
      _list(UnionID)
        .then(res => {
          wx.hideLoading()
          const { code, msg, data } = res.data
          if (code === 0) {
            const { HouseList: houses } = data
            this.set({
              houses,
              current: 0
            })
          } else {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
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
    submit() {
      const { current, houses, count: MonthlyQuantity, fee: Price } = this.data
      // UnionID, HouseID, ArrearsID, MonthlyQuantity, Price
      const UnionID = wx.getStorageSync('uid')
      const house = houses[current]
      const HouseID = house.HouseID
      const ArrearsID = house.ArrearsID
      console.log(UnionID, HouseID, ArrearsID, MonthlyQuantity, Price)
      // if () {}
      wx.showModal({
        title: '温馨提示',
        content: '确定支付吗？',
        success: r => {
          if (r.confirm) {
            app.loading('请求中')
            _pay({ UnionID, HouseID, ArrearsID, MonthlyQuantity, Price })
              .then(res => {
                wx.hideLoading()
                const { code, msg, data } = res.data
                if (code === 0) {
                  const { nonceStr, package: pack, paySign, timeStamp } = data
                  wx.requestPayment({
                    timeStamp,
                    nonceStr,
                    package: pack,
                    signType: 'RSA',
                    paySign,
                    success: res => {
                      wx.showModal({
                        title: '温馨提示',
                        content: '支付成功',
                        showCancel: false,
                        success: rr => {
                          wx.redirectTo({
                            url: './history'
                          })
                        }
                      })
                    },
                    fail: err => {
                      console.log(err)
                      wx.showModal({
                        title: '对不起',
                        content: '支付失败',
                        showCancel: false
                      })
                    }
                  })
                } else {
                  wx.showModal({
                    title: '对不起',
                    content: msg,
                    showCancel: false
                  })
                }
              })
              .catch(err => {
                console.log(err)
                wx.hideLoading()
              })
          }
        }
      })
    },
    onLoad(options) {
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
    onReady() { },
    onShow() { }
  }
})