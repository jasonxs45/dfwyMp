import Page from '../../common/Page'
import { _enginnerrefuse } from '../../api/repair'
import { _uploadFile } from '../../api/uploadfile'
const app = getApp()
Page({
  data: {
    id: '',
    mark: '',
    files: []
  },
  onInput(e) {
    this.data.mark = e.detail.value
  },
  selectFile(files) {
    return true
  },
  uplaodFile(files) {
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
  onDelete(e) {
    const { index } = e.detail
    const files = this.data.files.slice()
    files.splice(index, 1)
    this.data.files = files
  },
  submit () {
    const UnionID = wx.getStorageSync('uid')
    const { mark: RefuseReason, files, id: RepairID } = this.data
    const Images = files.map(item => item.url).join(',')
    if (!RefuseReason.trim()) {
      app.toast('请填写拒单原因')
      return
    }
    console.log(UnionID, RefuseReason, Images, RepairID)
    app.loading('加载中')
    _enginnerrefuse({ UnionID, RefuseReason, Images, RepairID })
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
              wx.redirectTo({
                url: './list'
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
  onLoad(opt) {
    this.data.id = opt.id
    this.set({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        wx.hideLoading()
        // this.init()
      })
      .catch(err => {
        wx.hideLoading()
        const path = encodeURIComponent(this.route)
        wx.redirectTo({
          url: `/pages/auth/index?redirect=${path}`
        })
      })
  },
  onShow() { }
})
