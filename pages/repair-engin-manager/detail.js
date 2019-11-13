import Page from '../../common/Page'
import { _userdetail as _detail, _managerpass as _pass } from '../../api/repair'
const app = getApp()
Page({
  data: {
    id: '',
    detail: null,
    logList: null,
    detail: null
  },
  formatStatus(val) {
    let str = ''
    switch (val) {
      case 0:
        str = '待处理'
        break
      case 1:
        str = '处理中'
        break
      case 2:
        str = '处理中'
        break
      case 3:
        str = '已完成'
        break
      case 4:
        str = '已完成'
        break
      case 5:
        str = '已取消'
        break
      default:
        break
    }
    return str
  },
  goOperate (e) {
    const { tar } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./operate?id=${this.data.id}&tar=${tar}`,
    })
  },
  getDetail() {
    const { id } = this.data
    wx.showNavigationBarLoading()
    _detail(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        // data.Record.imgs = data.Record.ImageList ? data.Record.ImageList.split(',') : []
        if (code == 0) {
          let { detailList, logList, repair: detail } = data
          detail.imgs = detail.Images ? detail.Images.split(',') : [],
            detail.status = this.formatStatus(detail.State)
          detail.statusColor = detail.State == 5
            ? 'red'
            : detail.State < 4
              ? 'yellow'
              : 'blue'
          detailList = detailList.map(item => {
            item.imgs = item.Images ? item.Images.split(',') : []
            return item
          })
          this.set({
            detailList,
            logList,
            detail
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
  goDispatch() {
    wx.navigateTo({
      url: `/pages/repair-manager/dispatch?id=${this.data.id}`
    })
  },
  goRefuse(e) {
    const { tar } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/repair-manager/refuse?id=${this.data.id}&tar=${tar}`
    })
  },
  pass() {
    const UnionID = wx.getStorageSync('uid')
    const { id: RepairID } = this.data
    wx.showModal({
      title: '提示',
      content: '确定进行此操作吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          _pass({ UnionID, RepairID })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: r => {
                  if (r.confirm && code == 0) {
                    wx.redirectTo({
                      url: '/pages/repair-manager/list'
                    })
                  }
                }
              })
            })
            .catch(err => {
              console.log(err)
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
