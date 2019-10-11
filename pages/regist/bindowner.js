import Page from '../../common/Page'
import { _getProjects, _getHouses, _bindOwner } from '../../api/bind'
import { NAME_REG } from '../../utils/reg'
const app = getApp()
Page({
  data: {
    step: 1,
    pid: '',
    name: '',
    projects: [],
    houses: [],
    houseIndex: '',
    houseid: '',
    id: ''
  },
  getProjects () {
    wx.showNavigationBarLoading()
    _getProjects()
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, data, msg } = res.data
        this.set({
          projects: data
        })
        if (code != 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
        }
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  getHouses () {
    const { pid: ProjectID, name: OwnName } = this.data
    wx.showNavigationBarLoading()
    _getHouses({ ProjectID, OwnName})
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, data, msg } = res.data
        this.set({
          houses: data
        })
        if (code != 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
        }
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  onChange (e) {
    const { projects } = this.data
    const { value } = e.detail
    this.data.pid = projects[value].ID
  },
  houseChange (e) {
    const { value: houseIndex } = e.detail
    this.data.houseIndex = houseIndex
    this.data.houseid = this.data.houses[houseIndex].HouseID
  },
  onInput (e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.set({
      [attr]: value
    })
  },
  prev () {
    this.set({
      step: this.data.step - 1
    })
  },
  next () {
    const { pid, name } = this.data
    if (pid === '') {
      app.toast('请选择项目')
      return
    }
    if (!NAME_REG.test(name)) {
      app.toast('请填写正确格式的姓名')
      return
    }
    this.set({
      step: this.data.step + 1
    }).then(() => {
      this.getHouses()
    })
  },
  submit () {
    const { houseid: HouseId, name: OwenName, id: CardId } = this.data
    const UnionId = wx.getStorageSync('uid')
    if (!HouseId) {
      app.toast('请选择房源')
      return
    }
    if (!CardId.trim()) {
      app.toast('请填写身份证后四位')
      return
    }
    app.loading('提交中')
    console.log(UnionId, HouseId, OwenName, CardId)
    _bindOwner({ UnionId, HouseId, OwenName, CardId })
      .then(res => {
        wx.hideLoading()
        const { code, msg } = res.data
        wx.showModal({
          title: code == 0 ? '温馨提示' : '对不起',
          content: msg,
          showCancel: false,
          success: r => {
            console.log(r.confirm, code)
            if (r.confirm && code == 0) {
              wx.switchTab({
                url: '/pages/usercenter/index'
              })
            }
          }
        })
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  onLoad() {
    this.getProjects()
  }
})