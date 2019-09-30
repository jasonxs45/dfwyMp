import MComponent from '../../common/MComponent'
import { _getMyHouse } from '../../api/bind'
import { _uploadFile } from '../../api/uploadfile'
import { _getPart, _submit } from '../../api/repair'
import { NAME_REG, TEL_REG } from '../../utils/reg'
const app = getApp()
MComponent({
  data: {
    types: [
      {
        label: '公共',
        id: 1
      },
      {
        label: '个人',
        id: 2
      }
    ],
    typeIndex: 0,
    parts: [],
    partIndex: '',
    problems: [],
    problemIndex: '',
    houses: [],
    houseIndex: '',
    houseid: '',
    desc: '',
    files: [],
    name: '',
    tel: ''
  },
  computed: {
    houseid() {
      return this.data.houses[this.data.houseIndex] ? this.data.houses[this.data.houseIndex].id : ''
    },
    typeid() {
      return this.data.types[this.data.typeIndex].id
    },
    selectedPart() {
      return this.data.parts[this.data.partIndex] ? this.data.parts[this.data.partIndex].Name : ''
    },
    selectedPartId() {
      return this.data.parts[this.data.partIndex] ? this.data.parts[this.data.partIndex].ID : ''
    },
    selectedProblem() {
      return this.data.problems[this.data.problemIndex] ? this.data.problems[this.data.problemIndex].Name : ''
    },
    selectedProblemId() {
      return this.data.problems[this.data.problemIndex] ? this.data.problems[this.data.problemIndex].ID : ''
    }
  },
  methods: {
    init() {
      const { typeid } = this.data
      const UnionID = wx.getStorageSync('uid')
      Promise.all([
        _getMyHouse(UnionID),
        _getPart(typeid)
      ])
        .then(res => {
          const [res1, res2] = res
          if (res1.data.code == 0) {
            this.set({
              houses: res1.data.data,
              houseIndex: ''
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res1.data.msg,
              showCancel: false
            })
          }
          if (res2.data.code == 0) {
            this.set({
              parts: res2.data.data,
              partIndex: '',
              problems: [],
              problemIndex: ''
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: res2.data.msg,
              showCancel: false
            })
          }
        })
        .catch(err => {
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
          const { typeid } = this.data
          // 查询部位
          if (attr === 'typeIndex') {
            this.init()
          }
          // 查询问题
          if (attr === 'partIndex' && typeid == 2) {
            const { selectedPartId: id } = this.data
            this.getProblems(id)
          }
        })
    },
    // 查询问题
    getProblems(id) {
      _getPart(id)
        .then(res => {
          const { code, data, msg } = res.data
          this.set({
            problems: data,
            problemIndex: ''
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
          console.log(err)
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onInput(e) {
      const { attr } = e.currentTarget.dataset
      const { value } = e.detail
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
      const {
        typeid,
        houseid: HouseID,
        selectedPartId,
        selectedPart,
        selectedProblemId,
        selectedProblem,
        desc: Content,
        files,
        name: Name,
        tel: Tel
      } = this.data
      const UnionID = wx.getStorageSync('uid')
      const ToubleID = typeid == 1 ? selectedPartId : selectedProblemId
      const Part = typeid == 1
        ? selectedPart
        : selectedProblem
          ? `${selectedPart}-${selectedProblem}`
          : ''
      const Image = files.map(item => item.url).join(',')
      console.log(UnionID, HouseID, ToubleID, Part, Content, Image, Name, Tel)
      if (HouseID == '') {
        app.toast('请选择房源')
        return
      }
      if (typeid == 1) {
        if (ToubleID == '') {
          app.toast('请选择区域')
          return
        }
      }
      if (typeid == 2) {
        if (selectedPartId == '') {
          app.toast('请选择区域')
          return
        }
        if (selectedProblemId == '') {
          app.toast('请选择部位')
          return
        }
      }
      if (!Content.trim()) {
        app.toast('请填写问题描述')
        return
      }
      if (!NAME_REG.test(Name)) {
        app.toast('请填写2-6位中文姓名')
        return
      }
      if (!TEL_REG.test(Tel)) {
        app.toast('请填写正确的手机号码')
        return
      }
      app.loading('提交中')
      _submit({ UnionID, HouseID, ToubleID, Part, Content, Image, Name, Tel })
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
          } else {
            this.init()
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
  }
})
