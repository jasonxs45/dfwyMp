import Page from '../../common/Page'
const app = getApp()
Page({
  data: {
    name: '',
    idcard: '',
    tel: '',
    address: ''
  },
  // 打开弹层
  show(e) {
    let { item: modifyItem } = e.currentTarget.dataset
    this.set({
      modifyShow: true,
      modifyItem
    })
  },
  onLoad() { }
})
