import Page from '../../common/Page'
import { _bindrelatives } from '../../api/bind'
import { NAME_REG, TEL_REG } from '../../utils/reg'
const app = getApp()
Page({
  data: {
    name: '',
    idcard:'',
    tel: '',
    checkId: ''
  },
  onInput(e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.set({
      [attr]: value
    })
  },
  submit() {
    const {
      name: Name,
      idcard: CertNo,
      tel: Tel
    } = this.data
    const UnionID = wx.getStorageSync('uid')
    if (!NAME_REG.test(Name)) {
      app.toast('请输入正确格式的中文姓名')
      return
    }
    if (!CertNo.trim()) {
      app.toast('请输入身份证')
      return
    }
    if (!TEL_REG.test(Tel)) {
      app.toast('请输入正确格式的电话号码')
      return
    }
    _bindrelatives({ UnionID, Name, CertNo, Tel })
      .then(res => {
        wx.hideLoading()
        const { code, msg, data } = res.data
        wx.showModal({
          title: code == 0 ? '温馨提示' : '对不起',
          content: msg,
          showCancel: false,
          success: r => {
            console.log(r.confirm, code)
            if (r.confirm && code == 0) {
              this.set({
                checkId: data
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
  onLoad(options) {
    this.set({
      role: options.role
    })
  },
  onShareAppMessage () {
    let shareInfo = app.shareInfo
    const { checkId, role } = this.data
    const type = role === '家属' ? 2 : 1
    if (checkId) {
      shareInfo = {
        title: `${this.data.name}申请绑定房源`,
        path: `/pages/regist/ownerconfirm?id=${checkId}&type=${type}`
      }
    }
    return shareInfo
  }
})