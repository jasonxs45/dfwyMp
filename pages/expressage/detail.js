import Page from '../../common/Page'
import { _detail, _pay } from '../../api/expressage'
import { formatNumber } from '../../utils/util'
const app = getApp()
const tags = {
  '100001': '揽件阶段 - 揽件成功',
  '100002': '揽件阶段 - 揽件失败',
  '100003': '揽件阶段 - 分配业务员',
  '200001': '运输阶段 - 更新运输轨迹',
  '300002': '派送阶段 - 开始派送',
  '300003': '派送阶段 - 签收成功',
  '300004': '派送阶段 - 签收失败',
  '400001': '异常阶段 - 订单取消',
  '400002': '异常阶段 - 订单滞留'
}
Page({
  data: {
    id: '',
    expressBill: null,
    path_item_list: null
  },
  getDetail() {
    const { id } = this.data
    wx.showNavigationBarLoading()
    _detail(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        if (code == 0) {
          let { expressBill, ExPrePath } = data
          expressBill.Price = formatNumber(expressBill.Price, 2)
          let path_item_list = ExPrePath.path_item_list ? ExPrePath.path_item_list.map(item => {
            let arr = item.Action_Desc.split('-')
            item.tag = arr[0]
            item.desc = arr[1]
            return item
          }) : []
          this.set({
            expressBill,
            path_item_list
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: msg.toString(),
            showCancel: false
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
  pay () {
    const UnionID = wx.getStorageSync('uid')
    const { id: OrderID } = this.data
    wx.showModal({
      title: '温馨提示',
      content: '确认支付吗？',
      success: r => {
        if (r.confirm) {
          app.loading('请求中')
          _pay({ UnionID, OrderID })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              if (code === 0) {
                const { nonceStr, package: pack, paySign, timeStamp } = data
                wx.requestPayment({
                  timeStamp,
                  nonceStr,
                  package: pack,
                  signType: 'MD5',
                  paySign,
                  success: res => {
                    wx.showModal({
                      title: '温馨提示',
                      content: '支付成功',
                      showCancel: false,
                      success: rr => {
                        wx.redirectTo({
                          url: './record'
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
  onLoad(opt) {
    this.data.id = opt.id
  },
  onShow() {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        wx.hideLoading()
        this.getDetail()
      })
      .catch(err => {
        wx.hideLoading()
        const path = encodeURIComponent(this.route)
        wx.redirectTo({
          url: `/pages/auth/index?redirect=${path}`
        })
      })
  }
})
