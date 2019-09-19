import Page from '../../common/Page'
import { _evaluate } from '../../api/repair'
import { _uploadFile } from '../../api/uploadfile'
const questions = ['响应速度', '服务态度', '解决问题', '维修保护']
const decoration = ['非常不满意', '不满意', '一般', '满意', '非常满意']
const app = getApp()
Page({
  data: {
    questions,
    scores: ['', '', '', ''],
    decoration,
    mark: '',
    files: []
  },
  onChange (e) {
    const { index } = e.currentTarget.dataset
    let { value } = e.detail
    value = parseInt(value) - 1
    const { scores } = this.data
    scores[index] = value
    this.set({
      scores
    })
  },
  onInput (e) {
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
    console.log(files)
    this.data.files = files
  },
  submit () {
    let { id: ID, scores, mark: EvaluateContent, files } = this.data
    const UnionID = wx.getStorageSync('uid')
    const EvaluateImages = files.map(item => item.url).join(',')
    scores = scores.map(item => {
      item = item !== '' ? item + 1 : ''
      return item
    })
    const [EvaluateScore1, EvaluateScore2, EvaluateScore3, EvaluateScore4] = scores
    for (let i = 0, len = scores.length; i < len; i++) {
      if (scores[i] === '') {
        app.toast(`请对${questions[i]}打分`)
        return
      }
    }
    const opt = { UnionID, ID, EvaluateScore1, EvaluateScore2, EvaluateScore3, EvaluateScore4, EvaluateContent, EvaluateImages }
    console.log(opt)
    app.loading('加载中')
    _evaluate(opt)
      .then(res => {
        wx.hideLoading()
        const { code, msg } = res.data
        wx.showModal({
          title: code == 0 ? '温馨提示' : '对不起',
          content: msg,
          showCancel: false,
          success: r => {
            if (r.confirm && code == 0) {
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
  },
  onLoad(opt) {
    this.data.id = opt.id
    this.set({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  onShow() {
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
        wx.hideLoading()
        if (memberInfo.Type === '未绑定') {
          wx.showModal({
            title: '温馨提示',
            content: '还未绑定房源',
            showCancel: false,
            success: r => {
              if (r.confirm) {
                wx.redirectTo({
                  url: '/pages/regist/enter'
                })
              }
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '还未绑定房源',
          showCancel: false,
          success: r => {
            if (r.confirm) {
              wx.redirectTo({
                url: '/pages/regist/enter'
              })
            }
          }
        })
      })
  }
})
