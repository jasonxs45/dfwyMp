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
      optionalTypes: [Number, String],
      value: null,
      observer: 'updateLabelValue'
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      value: false
    } 
  },
  data: {
    value: '',
    labelValue: ''
  },
  methods: {
    updateLabelValue (val) {
      const { mode } = this.data
      if (val != null && val != '') {
        const { range, rangeKey } = this.data
        let value, labelValue
        if (mode === 'region') {
          labelValue = val.value.join('')
          value = val
        } else {
          labelValue = rangeKey ? range[val][rangeKey] : range[val]
          value = val
        }
        this.set({
          value,
          labelValue
        })
      } else {
        this.set({
          value: '',
          labelValue: ''
        })
      }
    },
    onChange (e) {
      const { mode } = this.data
      let value = mode !== 'region' ? e.detail.value : e.detail
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
