import MComponent from '../../common/MComponent'
import { formatDate } from '../../utils/util'
import { _list } from '../../api/rent'
import { _getStates, _getHouseType } from '../../api/bind'
const app = getApp()
MComponent({
  data: {
    states: [],
    stateIndex: '',
    houseTypes: [],
    houseTypeIndex: '',
    keyword: '',
    loading: [],
    list: [],
    pageIndex: 1,
    totalCount: 0,
    filterShow: false,
    scroll: true
  },
  computed: {
    finished() {
      return this.data.totalCount <= this.data.list.length
    },
    showList() {
      return this.data.list.map(ele => {
        ele.imgs = ele.ImgList ? ele.ImgList.split(',').splice(0, 4) : []
        ele.AddTime = formatDate(new Date(ele.AddTime), 'yyyy-MM-dd')
        return ele
      })
    },
    choosedState () {
      return this.data.states[this.data.stateIndex] ? this.data.states[this.data.stateIndex].Name : ''
    },
    choosedHouseType() {
      return this.data.houseTypes[this.data.houseTypeIndex]
    }
  },
  methods: {
    showFilter () {
      this.set({
        filterShow: true,
        scroll: false
      })
      this.getFilters()
    },
    hideFilter () {
      this.set({
        filterShow: false,
        scroll: true
      })
    },
    reset () {
      this.set({
        stateIndex: '',
        houseTypeIndex: ''
      })
    },
    doFilter () {
      this.data.pageIndex = 1
      this.hideFilter()
      this.doQuery()
    },
    onInput (e) {
      const { value: keyword } = e.detail
      this.set({
        keyword
      })
    },
    onChange (e) {
      const { attr } = e.currentTarget.dataset
      const { value } = e.detail
      this.set({
        [attr]: value
      })
    },
    getFilters () {
      const { states, houseTypes } = this.data
      if (states.length>0 && houseTypes.length > 0) {
        return
      }
      wx.showNavigationBarLoading()
      Promise.all([
        _getStates(),
        _getHouseType()
      ])
        .then(res => {
          wx.hideNavigationBarLoading()
          const { code, data: states, msg } = res[0].data
          const { data: houseTypes } = res[1].data
          this.set({
            states,
            houseTypes
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
    init() {
      this.set({
        loading: false,
        pageIndex: 1,
        list: [],
        totalCount: 0
      }).then(() => {
        this.doQuery()
      })
    },
    doQuery() {
      const { states, stateIndex, houseTypes, houseTypeIndex, keyword: KeyWord } = this.data
      const HouseType = houseTypes[houseTypeIndex] || ''
      const StageID = states[stateIndex] ? states[stateIndex].ID : ''
      const PageSize = 10
      const { pageIndex: PageIndex } = this.data
      this.set({
        loading: true
      })
      wx.showNavigationBarLoading()
      _list({ HouseType, StageID, KeyWord, PageIndex, PageSize })
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          const totalCount = res.data.data.dateCount
          const list = res.data.data.dt
          this.set({
            loading: false,
            totalCount,
            list
          })
        })
        .catch(err => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          console.log(err)
          this.set({
            loading: false
          })
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    doSearch () {
      this.data.pageIndex = 1
      this.doQuery()
    },
    loadMore() {
      let { pageIndex, list } = this.data
      let PageIndex = pageIndex + 1
      const UnionID = wx.getStorageSync('uid')
      const Type = ''
      const PageSize = 10
      this.set({
        loading: true
      })
      _list({ UnionID, Type, State: '', PageIndex, PageSize })
        .then(res => {
          const data = res.data.data.dt
          list = list.slice().concat(data)
          this.set({
            loading: false,
            list,
            pageIndex: PageIndex
          })
        })
        .catch(err => {
          console.log(err)
          this.set({
            loading: false
          })
          wx.showModal({
            title: '对不起',
            content: err.toString(),
            showCancel: false
          })
        })
    },
    onReachLower() {
      const { finished } = this.data
      if (!finished) {
        this.loadMore()
      }
    },
    onPullDownRefresh () {
      this.data.pageIndex = 1
      this.doQuery()
    },
    onLoad() {
      this.init()
    }
  }
})
