import Page from '../../common/Page'
import { _contractor, _addcontractor } from '../../api/expressage'
import { NAME_REG, TEL_REG } from '../../utils/reg'
const app = getApp()
Page({
  data: {
    initValue: [],
    name: '',
    tel: '',
    area: '',
    areaValue: '',
    areaDetail: ''
  },
  onChange(e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.data.areaValue = value
    this.data[attr] = value.value.join('')
  },
  onInput(e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.data[attr] = value
  },
  getDetail () {
    const { id } = this.data
    if (!id) {
      console.log('没有ID，需要新建联系人记录')
      return
    }
    app.loading('加载中')
    _contractor(id)
      .then(res => {
        wx.hideLoading()
        const { code, msg, data } = res.data
        if (code === 0) {
          const { ProvinceName, CityName, Area, ProvinceCode, CityCode, AreaCode, name, Tel: tel, Address: areaDetail } = data[0]
          this.set({
            name,
            tel,
            areaDetail,
            areaValue: {
              code: [ProvinceCode, CityCode, AreaCode],
              value: [ProvinceName, CityName, Area]
            },
            initValue: [ProvinceName, CityName, Area]
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
        console.log(err)
        wx.showModal({
          title: '对不起',
          content: err.toString(),
          showCancel: false
        })
      })
  },
  update () {
    // app.loading('加载中')
    // ID, UnionID, Name, Tel, ProvinceCode, CityCode, AreaCode, Address, Company
    const {
      id: ID,
      name: Name,
      tel: Tel,
      areaValue,
      areaDetail: Address
    } = this.data
    let ProvinceCode, CityCode, AreaCode
    if (areaValue) {
      [ProvinceCode, CityCode, AreaCode] = areaValue.code
    }
    const UnionID = wx.getStorageSync('uid')
    if (!NAME_REG.test(Name)) {
      app.toast('请输入正确格式的中文姓名')
      return
    }
    if (!TEL_REG.test(Tel)) {
      app.toast('请输入正确格式的手机号码')
      return
    }
    if (!areaValue) {
      app.toast('请选择城市/区域')
      return
    }
    if (!Address.trim()) {
      app.toast('请填写详细地址')
      return
    }
    const obj = { ID, UnionID, Name, Tel, ProvinceCode, CityCode, AreaCode, Address }
    _addcontractor(obj)
      .then(res => {
        const { code, msg, data } = res.data
        wx.showModal({
          title: code === 0 ? '温馨提示' : '对不起',
          content: msg,
          showCancel: false,
          success: r => {
            if (r.confirm) {
              if (code === 0) {
                const { role } = this.data
                if (role !== undefined) {
                  wx.setStorage({
                    key: role,
                    data: data[0],
                    success: rr => {
                      wx.navigateBack()
                    }
                  })
                } else {
                  const sender = wx.getStorageSync('sender')
                  const receiver = wx.getStorageSync('receiver')
                  if (sender && sender.id == data[0].id) {
                    wx.setStorageSync('sender', data[0])
                  }
                  if (receiver && receiver.id == data[0].id) {
                    wx.setStorageSync('receiver', data[0])
                  }
                  let timeout = setTimeout(() => {
                    clearTimeout(timeout)
                    wx.navigateBack()
                  }, 40)
                }
              }
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
  },
  onLoad(options) {
    const { role, id } = options
    this.data.id = id
    this.data.role = role
    if (!role) {
      // 通过ID查
      console.log('从列表过来，通过ID查')
      this.getDetail()
    } else {
      // 从缓存查
      console.log('从提交快递单页面过来，通过缓存查')
      this.data[role] = wx.getStorageSync(role)
      if (this.data[role]) {
        const { id, ProvinceName, CityName, Area, ProvinceCode, CityCode, AreaCode, name, Tel: tel, Address: areaDetail } = this.data[role]
        this.data.id = id
        this.set({
          name,
          tel,
          areaDetail,
          areaValue: {
            code: [ProvinceCode, CityCode, AreaCode],
            value: [ProvinceName, CityName, Area]
          },
          initValue: [ProvinceName, CityName, Area]
        })
      } else {
        console.log('缓存内没有，需新建联系人')
      }
    }
  },
  onReady() { },
  onShow() { }
})