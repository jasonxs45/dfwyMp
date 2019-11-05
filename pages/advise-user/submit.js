import Page from '../../common/Page'
import { _getMyHouse } from '../../api/bind'
import { _uploadFile } from '../../api/uploadfile'
import { _submit } from '../../api/advise'
const app = getApp()
Page({
  data: {
    tags: ['表扬', '投诉', '建议'],
    tagIndex: null,
    houses: [],
    houseIndex: '',
    houseid: '',
    mark: '',
    files: []
  },
  getMyHouse() {
    wx.showNavigationBarLoading()
    const UnionID = wx.getStorageSync('uid')
    _getMyHouse(UnionID)
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
  onChange(e) {
    const { attr } = e.currentTarget.dataset
    const { value } = e.detail
    this.set({
      [attr]: value
    })
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
    const { houses, houseIndex, tags, tagIndex, mark, files } = this.data
    if (houseIndex == '') {
      app.toast('请选择房源')
      return
    }
    if (tagIndex == null) {
      app.toast('请选择类别')
      return
    }
    if (!mark.trim()) {
      app.toast('请填写详情')
      return
    }
    const Type = tags[tagIndex],
          HouseID = houses[houseIndex].id,
          Content = mark,
          Images = files.map(item => item.url).join(',')
    console.log(Type,HouseID,Content,Images)
    app.loading('提交中')
    const UnionId = wx.getStorageSync('uid')
    _submit({ UnionId, Type, HouseID, Content, Images })
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
              wx.navigateTo({
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
  onLoad() {
    this.set({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    app.loading('加载中')
    app.checkAuth()
      .then(res => {
        const uid = res
        return app.getUserInfoByUid(uid)
      })
      .then(memberInfo => {
        wx.hideLoading()
        if (memberInfo.Type === '未绑定' || !memberInfo.Type) {
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
        } else {
          this.getMyHouse()
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
  },
  onShow() { }
})
