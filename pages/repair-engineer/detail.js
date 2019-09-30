import Page from '../../common/Page'
import { _userdetail as _detail, _enginnerdone } from '../../api/repair'
import { _uploadFile } from '../../api/uploadfile'
const app = getApp()
Page({
  data: {
    id: '',
    detail: null,
    logList: null,
    detail: null,
    mark: '',
    files: []
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
  refuse () {
    wx.navigateTo({
      url: `./refuse?id=${this.data.id}`
    })
  },
  done () {
    const UnionID = wx.getStorageSync('uid')
    const { mark: Desc, files, id: RepairID } = this.data
    const Images = files.map(item => item.url).join(',')
    console.log(UnionID, Desc, Images, RepairID)
    if (!Desc.trim()) {
      app.toast('请添维修加整改情况说明')
      return
    }
    app.loading('加载中')
    _enginnerdone({ UnionID, Desc, Images, RepairID })
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
