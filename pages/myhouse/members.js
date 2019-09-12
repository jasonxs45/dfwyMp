import Page from '../../common/Page'
import { _memberlist, _houseinfo, _offBind } from '../../api/bind'
const app = getApp()
Page({
  data: {
    id: '',
    houseInfo: null,
    members: []
  },
  initQuery () {
    const { id: HouseID } = this.data
    const UnionID = wx.getStorageSync('uid')
    wx.showNavigationBarLoading()
    Promise.all([
      _houseinfo(HouseID),
      _memberlist({ HouseID, UnionID })
    ])
      .then(res => {
        wx.hideNavigationBarLoading()
        const datas = res.map(item => item.data)
        if (datas[0].code == 0) {
          this.set({
            houseInfo: datas[0].data
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: datas[0].msg,
            showCancel: false,
            success: r => {
              wx.redirectTo({
                url: '/pages/myhouse/index'
              })
            }
          })
        }
        if (datas[1].code == 0) {
          this.set({
            members: datas[1].data.map(item => {
              item.className = item.Type === '业主'
                               ? 'red'
                               : item.Type === '家属'
                               ? 'blue'
                               : 'yellow'
              return item
            })
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: datas[1].msg,
            showCancel: false
          })
        }
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
      })
  },
  offBind (e) {
    const { id: HouseId } = this.data
    const { mid: MemberId } = e.currentTarget.dataset
    wx.showModal({
      title: '温馨提示',
      content: '确定要解除绑定吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          _offBind({
            HouseId,
            MemberId
          })
            .then(res => {
              wx.hideLoading()
              const { code, data, msg } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: rr => {
                  if (rr.confirm && code == 0) {
                    this.initQuery()
                  }
                }
              })
            })
            .catch(err => {
              console.log(err)
              wx.hideLoading()
              wx.showModal({
                title: '对不起',
                content: err.ToString(),
                showCancel: false
              })
            })
        }
      }
    })
  },
  onLoad(opt) {
    const { id } = opt
    this.data.id = id
    this.initQuery()
  }
})
