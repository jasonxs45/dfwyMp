import Page from '../../common/Page'
import { _getSecondProjects, _bindsecond } from '../../api/bind'
import { _uploadFile } from '../../api/uploadfile'
import { NAME_REG, TEL_REG } from '../../utils/reg'
const app = getApp()
Page({
  data: {
    pid: '',
    building: '',
    unit: '',
    room: '',
    name: '',
    idcard: '',
    tel: '',
    projects: [],
    files: []
  },
  getProjects() {
    wx.showNavigationBarLoading()
    _getSecondProjects()
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
  onChange(e) {
    const { projects } = this.data
    const { value } = e.detail
    this.data.pid = projects[value].ID
  },
  onInput(e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.set({
      [attr]: value
    })
  },
  chooseImage (e) {
    wx.chooseImage({
      success: res => {
        console.log(res)
        this.set({
          files: this.data.files.concat(res.tempFilePaths)
        })
      }
    })
  },
  previewImage (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },
  selectFile (files) {
    return true
  },
  uplaodFile (files) {
    const { tempFilePaths } = files
    const funs = tempFilePaths.map(temp => _uploadFile(temp))
    return Promise.all(funs)
            .then(res => {
              const urls = res.map(r => {
                if (r.statusCode === 200) {
                  return JSON.parse(r.data).url
                } else {
                  return ''
                }
              })
              return Promise.resolve({ urls })
            })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    let { files } = this.data
    files = files.concat(e.detail.urls.map(item => ({ url: item })))
    this.set({
      files
    })
  },
  onDelete (e) {
    const { index } = e.detail
    const files = this.data.files.slice()
    files.splice(index, 1)
    console.log(files)
    this.data.files = files
  },
  submit() {
    const {
      pid: StateID,
      building: Building,
      unit: Unit,
      room: HouseNo,
      name: Name,
      idcard: CertNumber,
      tel: Tel,
      files
    } = this.data
    const images = files.map(item => item.url).join(',')
    const UnionID = wx.getStorageSync('uid')
    console.log(UnionID, StateID, Building, Unit, HouseNo, Name, CertNumber, Tel, images)
    if (StateID === '') {
      app.toast('请选择所在房源')
      return
    }
    if (!Building.trim()) {
      app.toast('请输入楼栋')
      return
    }
    if (!Unit.trim()) {
      app.toast('请输入单元')
      return
    }
    if (!HouseNo.trim()) {
      app.toast('请输入房号')
      return
    }
    if (!NAME_REG.test(Name)) {
      app.toast('请输入正确格式的中文姓名')
      return
    }
    if (!CertNumber.trim()) {
      app.toast('请输入身份证')
      return
    }
    if (!TEL_REG.test(Tel)) {
      app.toast('请输入正确格式的电话号码')
      return
    }
    if (!images.length) {
      app.toast('请上传照片')
      return
    }
    _bindsecond({ UnionID, StateID, Building, Unit, HouseNo, Name, CertNumber, Tel, images })
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
  onLoad(options) {
    this.set({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    this.getProjects()
  }
})