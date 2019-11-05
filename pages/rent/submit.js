import Page from '../../common/Page'
import { _getProjects, _getStates, _getHouseType } from '../../api/bind'
import { _uploadFile } from '../../api/uploadfile'
import { _submit } from '../../api/rent'
import { TEL_REG } from '../../utils/reg'
import { formatNumber } from '../../utils/util'
const app = getApp()
Page({
  data: {
    projects: [],
    projectIndex: '',
    states: [],
    stateIndex: '',
    houseTypes: [],
    houseTypeIndex: '',
    floor: '',
    room: '',
    area: '',
    price: '',
    title: '',
    mark: '',
    tel: '',
    files: [],
    types: [
      {
        label: '租赁',
        value: '出租'
      },
      {
        label: '售卖',
        value: '出售'
      }
    ],
    type: '',
    unit: '元/月'
  },
  getProjects() {
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
  getHouseTypes() {
    wx.showNavigationBarLoading()
    _getHouseType()
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, data, msg } = res.data
        this.set({
          houseTypes: data
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
  getStates(id) {
    wx.showNavigationBarLoading()
    _getStates(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, data, msg } = res.data
        this.set({
          states: data
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
      .then(() => {
        if (attr === 'projectIndex') {
          const id = this.data.projects[value].ID
          this.set({
            stateIndex: '',
            states: [],
            houseTypeIndex: '',
            houseTypes: []
          })
            .then(() => {
              this.getStates(id)
              this.getHouseTypes()
            })
        }
        if (attr === 'type') {
          this.set({
            unit: this.data.type == 1 ? '元' : '元/月'
          })
        }
      })
  },
  onInput(e) {
    const { attr } = e.currentTarget.dataset
    const { value } = e.detail
    this.data[attr] = value
  },
  onBlur(e) {
    const { attr } = e.currentTarget.dataset
    let { value } = e.detail
    if (value === '') {
      return
    }
    if (isNaN(Number(value))) {
      let str = ''
      switch (attr) {
        case 'floor':
          str = '楼层'
          break
        case 'room':
          str = '房号'
          break
        case 'area':
          str = '面积'
          break
        case 'price':
          str = '价格'
          break
      }
      app.toast(`请在${str}栏输入正确格式的数字`)
      value = ''
    } else {
      switch (attr) {
        case 'floor':
          value = '' + Math.trunc(value)
          break
        case 'room':
          value = '' + Math.trunc(value)
          break
        case 'price':
          value = formatNumber(value, 2)
          break
      }
    }
    this.set({
      [attr]: value
    })
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
  submit() {
    let {
      projects,
      projectIndex,
      states,
      stateIndex,
      houseTypes,
      houseTypeIndex,
      types,
      type,
      floor: Floor,
      room: HouseID,
      area: Acreage,
      price: Price,
      tel: Phone,
      title: Title,
      mark: Desc,
      files,
      unit
    } = this.data
    if (projectIndex == '') {
      app.toast('请选择项目')
      return
    }
    if (stateIndex == '') {
      app.toast('请选择项目分期')
      return
    }
    if (houseTypeIndex == '') {
      app.toast('请选择户型')
      return
    }
    if (!Floor.trim()) {
      app.toast('请填写楼层')
      return
    }
    if (!HouseID.trim()) {
      app.toast('请填写房号')
      return
    }
    if (!Acreage.trim()) {
      app.toast('请填写面积')
      return
    }
    if (type == '') {
      app.toast('请选择租售类型')
      return
    }
    if (!Price.trim()) {
      app.toast(`请填写${type == 0 ? '价格':'总价'}`)
      return
    }
    if (!TEL_REG.test(Phone)) {
      app.toast('请填写正确格式的手机号')
      return
    }
    if (!Title.trim()) {
      app.toast('请填写标题')
      return
    }
    if (!Desc.trim()) {
      app.toast('请填写对您的房源描述')
      return
    }
    const UnionID = wx.getStorageSync('uid')
    const StageID = states[stateIndex].ID,
      HouseType = houseTypes[houseTypeIndex],
      Mode = types[type].value,
      ImgList = files.map(item => item.url).join(',')
    Price = Price + unit
    console.log(UnionID, StageID, Title, Desc, ImgList, Phone, HouseID, Acreage, Mode, Price, Floor, HouseType)
    app.loading('提交中')
    _submit({ UnionID, StageID, Title, Desc, ImgList, Phone, HouseID, Acreage, Mode, Price, Floor, HouseType })
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
                url: './record'
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
        console.log(memberInfo.Type)
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
          this.getProjects()
        }
      })
      .catch(err => {
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
