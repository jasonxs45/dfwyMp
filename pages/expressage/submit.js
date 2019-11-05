import MComponent from '../../common/MComponent'
import { _options, _calculate, _submit } from '../../api/expressage'
import { formatNumber } from '../../utils/util'
const app = getApp()
MComponent({
  data: {
    sender: null,
    receiver: null,
    ways: [],
    wayIndex: 0,
    positions: [],
    positionIndex: '',
    companys: [],
    companyIndex: '',
    boxs: [],
    boxIndex: '',
    kinds: [],
    kindIndex: '',
    weight: 1.5,
    maxWeight: Infinity,
    disabled: false,
    calcTimeout: null,
    calculating: false,
    originPrice: 0,
    count: ''
  },
  computed: {
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
        if (this.data.kindIndex instanceof Array) {
          res = this.data.kindIndex.map(item => this.data.kinds[item].Title).join(',')
        } else {
          res = this.data.kinds[this.data.kindIndex].Title
        }
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
    shownPrice() {
      let msg
      if (!this.data.sender) {
        msg = '请填写寄件人信息'
      } else if (!this.data.receiver) {
        msg = '请填写收件人信息'
      } else if (this.data.companyIndex === '') {
        msg = '请选择快递公司'
      } else if (this.data.boxIndex === '') {
        msg = '请选择包装规格'
      } else if (this.data.calculating) {
        msg = '计算中'
      } else {
        msg = '￥ ' + formatNumber(this.data.originPrice, 2)
      }
      return msg
    }
  },
  observers: {
    weight(val) {
      this.calculate()
    },
    boxIndex(val) {
      this.calculate()
    },
    companyIndex(val) {
      this.calculate()
    },
    'receiver.CityCode'(val) {
      this.calculate()
    }
  },
  methods: {
    getOptions() {
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
            this.set({ companys, kinds, boxs, ways, positions, maxWeight })
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
    onChange(e) {
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
    },
    onInput(e) {
      this.data.count = e.detail.value
    },
    onBlur() {
      if (isNaN(Number(this.data.count))) {
        app.toast('请填写数字')
        this.set({
          count: ''
        })
      } else {
        this.set({
          count: this.data.count
        })
      }
    },
    _doCalculate(opt) {
      this.set({
        calculating: true
      })
      _calculate(opt)
        .then(res => {
          const { code, msg, data: originPrice } = res.data
          this.set({
            calculating: false
          })
          if (code === 0) {
            this.set({
              originPrice
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.set({
            calculating: false
          })
        })
    },
    calculate() {
      const {
        companys,
        companyIndex,
        weight: Weight,
        boxs,
        boxIndex,
        receiver
      } = this.data
      const ExpressType = companyIndex !== '' && companys[companyIndex] ? companys[companyIndex].Value : ''
      const BoxType = boxIndex !== '' && boxs[boxIndex] ? boxs[boxIndex].Value : ''
      const CityCode = receiver && receiver.CityCode
      // ExpressType, Weight, CityCode, BoxType
      console.log(ExpressType, BoxType, Weight, CityCode)
      if (ExpressType && BoxType && Weight && CityCode) {
        // 延迟操作，若有点击行为则取消掉延时请求
        console.log('参数齐全，开始计算')
        if (this.data.calcTimeout) {
          clearTimeout(this.data.calcTimeout)
        }
        this.data.calcTimeout = setTimeout(() => {
          clearTimeout(this.data.calcTimeout)
          this._doCalculate({ ExpressType, BoxType, Weight, CityCode })
        }, 500)
      } else {
        console.log('参数不齐，不计算')
      }
    },
    submit() {
      const {
        sender,
        receiver,
        wayIndex,
        positionIndex,
        companyIndex,
        kindIndex,
        weight,
        boxIndex,
        count,
        selectedKind
      } = this.data
      if (!sender) {
        app.toast('请填写寄件人信息')
        return
      }
      if (!receiver) {
        app.toast('请填写寄件人信息')
        return
      }
      if (wayIndex === '') {
        app.toast('请选择寄件方式')
        return
      }
      if (companyIndex === '') {
        app.toast('请选择快递公司')
        return
      }
      if (positionIndex === '') {
        app.toast('请选择发件站点')
        return
      }
      if (kindIndex === '') {
        app.toast('请选择托寄物类型')
        return
      }
      if (count === '') {
        app.toast('请填写件数')
        return
      }
      if (!weight) {
        app.toast('请填写重量')
        return
      }
      if (boxIndex === '') {
        app.toast('请选择包装规格')
        return
      }
      // UnionID,StationID,SendManID,ReceiveManID,SenderType,GoodsTypeList,ExpressCompany,Weight,Price,Goods_name,Goods_count
      const UnionID = wx.getStorageSync('uid'),
        StationID = this.data.selectedPosition.ID,
        SendManID = sender.id,
        ReceiveManID = receiver.id,
        SenderType = 1,
        GoodsTypeList = this.data.selectedKind,
        ExpressCompany = this.data.selectedCompany.Value,
        Weight = weight,
        Price = this.data.originPrice,
        Goods_count = count
      console.log(UnionID, StationID, SendManID, ReceiveManID, SenderType, GoodsTypeList, ExpressCompany, Weight, Price, Goods_count)
      wx.showModal({
        title: '温馨提示',
        content: '确定下单吗？',
        success: r => {
          if (r.confirm) {
            app.loading('提交中')
            _submit({ UnionID, StationID, SendManID, ReceiveManID, SenderType, GoodsTypeList, ExpressCompany, Weight, Price, Goods_count })
              .then(res => {
                wx.hideLoading()
                const { code, msg } = res.data
                wx.showModal({
                  title: code === 0 ? '温馨提示' : '对不起',
                  content: msg,
                  showCancel: false,
                  success: rrr => {
                    if (rrr.confirm) {
                      wx.redirectTo({
                        url: './record',
                      })
                    }
                  }
                })
              })
              .catch(err => {
                wx.hideLoading()
              })
          }
        }
      })
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
    onShow() {
      const sender = wx.getStorageSync('sender')
      const receiver = wx.getStorageSync('receiver')
      this.set({
        sender,
        receiver
      })
    }
  }
})