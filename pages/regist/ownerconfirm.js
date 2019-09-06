import Page from '../../common/Page'
import { _getMyHouse, _getrelatives, _pass } from '../../api/bind'
const app = getApp()
Page({
  data: {
    id: '',
    type: '',
    role: '',
    houses: [],
    houseIndex: '',
    houseid: '',
    memberInfo: null
  },
  initQuery () {
    app.loading('加载中')
    const UnionID = wx.getStorageSync('uid')
    const { id } = this.data
    Promise.all([
      _getrelatives(id),
      _getMyHouse(UnionID)
    ])
      .then(res => {
        wx.hideLoading()
        const datas = res.map(item => item.data)
        if (datas[0].code == 0) {
          this.set({
            memberInfo: datas[0].data
          })
        } else {
          wx.showModal({
            title: '对不起',
            content: datas[0].msg,
            showCancel: false
          })
        }
        if (datas[1].code == 0) {
          this.set({
            houses: datas[1].data
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
        wx.hideLoading()
        console.log(err)
      })
  },
  onChange(e) {
    const { value: houseIndex } = e.detail
    this.data.houseIndex = houseIndex
    this.data.houseid = this.data.houses[houseIndex].id
  },
  submit () {
    const {
      houseid: HouseID,
      type: Type,
      memberInfo
    } = this.data
    if (HouseID == '') {
      app.toast('请选择房源')
      return
    }
    const MemberID = memberInfo.Memberid
    wx.showModal({
      title: '温馨提示',
      content: '确定审核通过吗',
      success: re => {
        if (re.confirm) {
          app.loading('提交中')
          _pass({ MemberID, HouseID, Type })
            .then(res => {
              wx.hideLoading()
              const { code, data, msg } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: r => {
                  if (r.confirm && code == 0) {
                    wx.switchTab({
                      url: '/pages/usercenter/index'
                    })
                  }
                }
              })
            })
            .catch(err => {
              console.log(err)
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
  onLoad (options) {
    const { type, id } = options
    this.data.type = type
    this.data.id = id
    this.set({
      role: type == 1 ? '租户' : '家属'
    })
      .then(res => {
        this.initQuery()
      })
  }
})