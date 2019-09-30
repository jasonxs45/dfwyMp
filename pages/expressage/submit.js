import MComponent from '../../common/MComponent'
import { _options } from '../../api/expressage'
const app = getApp()
MComponent({
  data: {
    ways: [],
    wayIndex: '',
    positions: [],
    positionIndex: '',
    companys: [],
    companyIndex: '',
    boxs: [],
    boxIndex: '',
    kinds: [],
    kindIndex: '',
    weight: 0,
    maxWeight: 0,
    disabled: false,
    calcTimeout: null
  },
  computed: {
    fromInfo () {
      return ''
    },
    toInfo () {
      return ''
    },
    selectedWay() {
      let res = ''
      if (this.data.wayIndex === '') {
        res = ''
      } else {
        res = this.data.ways[this.data.wayIndex]
      }
      return res
    },
    selectedPosition() {
      let res = ''
      if (this.data.positionIndex === '') {
        res = ''
      } else {
        res = this.data.positions[this.data.positionIndex]
        res.coordinate = {
          latitude: Number(res.PointY),
          longitude: Number(res.PointX)
        }
      }
      return res
    },
    selectedCompany() {
      let res = ''
      if (this.data.companyIndex === '') {
        res = ''
      } else {
        res = this.data.companys[this.data.companyIndex]
      }
      return res
    },
    selectedKind() {
      let res = ''
      if (this.data.kindIndex === '') {
        res = ''
      } else {
        res = this.data.kinds[this.data.kindIndex]
      }
      return res
    },
    selectedBox() {
      let res = ''
      if (this.data.boxIndex === '') {
        res = ''
      } else {
        res = this.data.boxs[this.data.boxIndex]
      }
      return res
    },
    shownPrice () {
      return 1
    }
  },
  methods: {
    getOptions () {
      _options()
        .then(res => {
          wx.hideLoading()
          const { code, msg, data } = res.data
          if (code == 0) {
            const {
              ExpressTypeList: companys,
              GoodsTypeList: kinds,
              PackTypeList: boxs,
              SendWayList: ways,
              StationList: positions,
              MaxWeight: maxWeight
            } = data
            this.set({ companys, kinds, boxs, ways, positions, maxWeight})
          } else {
            wx.showModal({
              title: '对不起',
              content: msg,
              showCancel: false
            })
          }
        })
        .catch(err => {
          console.log(err)
          wx.hideLoading()
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onChange (e) {
      const item = e.currentTarget
      const { attr } = e.currentTarget.dataset
      const { value } = e.detail
      if (attr === 'weight') {
        this.set({
          [`${attr}`]: value
        })
      } else {
        this.set({
          [`${attr}Index`]: value
        })
      }
      if(attr==='way') {
        return
      }
      // 延迟操作，若有点击行为则取消掉延时请求
      let timeout = this.data.calcTimeout
      if (timeout) {
        clearTimeout(timeout)
      }
      this.data.calcTimeout = setTimeout(() => {
        console.log(123123)
      }, 1000)
    },
    onLoad(options) {
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
            this.getOptions()
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
    onShow() {}
  }
})