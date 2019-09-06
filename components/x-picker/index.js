import MComponent from '../../common/MComponent'
MComponent({
  properties: {
    mode: {
      type: String,
      value: 'selector'
    },
    range: Array,
    rangeKey: String,
    initValue: {
      type: Number,
      value: null,
      observer: 'updateLabelValue'
    },
    placeholder: String
  },
  data: {
    value: null,
    labelValue: ''
  },
  methods: {
    updateLabelValue (val) {
      if (val != null) {
        const { range, rangeKey } = this.data
        let labelValue = rangeKey ? range[val][rangeKey] : range[val]
        this.set({
          value: val,
          labelValue
        })
      }
    },
    onChange (e) {
      let value = e.detail.value
      let currentTarget = e.currentTarget
      this.updateLabelValue(value)
      this.triggerEvent('change', { value })
    }
  },
  lifetimes: {
    ready () {
      const { value } = this.data
      this.updateLabelValue(value)
    }
  }
})
