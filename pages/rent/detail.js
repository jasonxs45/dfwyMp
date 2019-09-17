import Page from '../../common/Page'
import { _detail } from '../../api/rent'
import { formatDate } from '../../utils/util'
const app = getApp()
Page({
  data: {
    id: '',
    detail: null
  },
  getDetail() {
    const { id } = this.data
    wx.showNavigationBarLoading()
    _detail(id)
      .then(res => {
        wx.hideNavigationBarLoading()
        const { code, msg, data } = res.data
        if (code != 0) {
          wx.showModal({
            title: '对不起',
            content: msg,
            showCancel: false
          })
        } else {
          data.AddTime = formatDate(new Date(data.AddTime), 'yyyy-MM-dd')
          data.imgs = data.ImgList ? data.ImgList.split(','): []
          this.set({
            detail: data
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
  onLoad(opt) {
    const { id } = opt
    this.data.id = id
    this.getDetail()
  }
})
