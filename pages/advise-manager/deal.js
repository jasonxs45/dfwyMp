import Page from '../../common/Page'
import { _getJudge, _deal } from '../../api/advise'
import { _uploadFile } from '../../api/uploadfile'
const app = getApp()
Page({
  data: {
    id: '',
    superList: [],
    superIndex: '',
    subList: [],
    subIndex: '',
    reply: '',
    files: []
  },
  back () {
    wx.navigateBack()
  },
  onInput (e) {
    const { value } = e.detail
    this.data.reply = value
  },
  getJudge (id) {
    _getJudge(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        if (code == 0) {
          if (!id) {
            this.set({
              superList: data
            })
          } else {
            this.set({
              subList: data
            })
          }
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
  getSubJudge (e) {
    const { value } = e.detail
    this.data.superIndex = value
    const { superList } = this.data
    const id = superList[value].ID
    this.getJudge(id)
  },
  onChange (e) {
    const { value } = e.detail
    this.data.subIndex = value
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
    console.log(files)
    this.data.files = files
  },
  submit () {
    const UnionID = wx.getStorageSync('uid')
    const { superIndex, superList, subIndex, subList, reply: Content, id: SuggestID, files } = this.data
    if (superIndex == '' || (subList.length > 0 && subIndex == '')) {
      app.toast('请选择问题定性')
      return
    }
    if (!Content.trim()) {
      app.toast('请填写回复内容')
      return
    }
    const AdminName = subList.length > 0 ? `${superList[superIndex].Name}-${superList[superIndex].Name}` : `${superList[superIndex].Name}`
    const ImageList = files.map(item => item.url).join(',')
    wx.showModal({
      title: '温馨提示',
      content: '确定处理吗？',
      success: r => {
        if (r.confirm) {
          app.loading('加载中')
          _deal({ UnionID, SuggestID, AdminName, Content, ImageList })
            .then(res => {
              wx.hideLoading()
              const { code, msg, data } = res.data
              wx.showModal({
                title: code == 0 ? '温馨提示' : '对不起',
                content: msg,
                showCancel: false,
                success: rr => {
                  if (rr.confirm && code == 0) {
                    wx.navigateBack()
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
        }
      }
    })
  },
  onLoad(opt) {
    this.set({
      id: opt.id,
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    app.checkAuth()
      .then(res => {
        this.getJudge()
      })
      .catch(err => {
        console.log(err)
        const path = encodeURIComponent(this.route)
        wx.redirectTo({
          url: `/pages/auth/index?redirect=${path}`
        })
      })
  }
})
