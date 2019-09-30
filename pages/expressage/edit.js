Page({
  data: {
    name: '',
    tel: '',
    area: '',
    areaValue: '',
    'area-detail': ''
  },
  onChange (e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.data.areaValue = value
    this.data[attr] = value.value.join('')
  },
  onInput(e) {
    const { value } = e.detail
    const { attr } = e.currentTarget.dataset
    this.data[attr] = value
  },
  onLoad (options) {},
  onReady () {},
  onShow () {}
})