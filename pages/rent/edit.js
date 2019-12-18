import MComponent from '../../common/MComponent'
import { formatDate } from '../../utils/util'
import { _detail, _modify } from '../../api/rent'
import { _uploadFile } from '../../api/uploadfile'
import { TEL_REG } from '../../utils/reg'
import { formatNumber } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    id: '',
    detail: null,
    area: '', 
    title: '',
    mark: '',
    tel: '',
    files: [],
    unit: ''
  },
  methods: {
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
          case 'price':
            const { type } = this.data
            // if (type == 1) {
            //   value = value / 10000
            // }
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
    getDetail() {
      const { id } = this.data
      wx.showNavigationBarLoading()
      app.loading('加载中')
      _detail(id)
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          const { code, msg, data } = res.data
          if (code != 0) {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
            })
          } else {
            data.AddTime = formatDate(new Date(data.AddTime), 'yyyy-MM-dd')
            data.imgs = data.ImgList ? data.ImgList.split(',') : []
            this.set({
              detail: data,
              files: data.imgs.map(item => ({url: item})),
              price: data.Price.replace(/[^\d\.]/g, ''),
              area: data.Acreage,
              title: data.Title,
              tel: data.Contact,
              mark: data.Desc,
              unit: data.Mode === '出租' ? '元/月' : '万元'
            })
          }
        })
        .catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    submit() {
      let {
        id: ID,
        area: Acreage,
        price: Price,
        tel: Phone,
        title: Title,
        mark: Desc,
        files,
        unit
      } = this.data
      if (!Acreage.trim()) {
        app.toast('请填写面积')
        return
      }
      if (!Price.trim()) {
        app.toast(`请填写${type == 0 ? '价格' : '总价'}`)
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
      const UnionID = wx.getStorageSync('uid'),
      ImageList = files.map(item => item.url).join(',')
      Price = Price + unit
      console.log(UnionID, ID, Title, Desc, ImageList, Phone, Acreage, Price)
      app.loading('提交中')
      _modify({ UnionID, ID, Title, Desc, ImageList, Phone, Acreage, Price })
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
    onLoad (options) {
      this.set({
        selectFile: this.selectFile.bind(this),
        uplaodFile: this.uplaodFile.bind(this)
      })
      const { id } = options
      this.data.id = id
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
            this.getDetail()
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
    }
  }
})