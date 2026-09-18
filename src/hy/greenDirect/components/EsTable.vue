<script>
const FORMATTERS = {
  dash: function (v) {
    return v == null || v === '' ? '-' : v
  },
  locale: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? v : n.toLocaleString()
  },
  fixed2: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? '-' : n.toFixed(2)
  },
  fixed3: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? '-' : n.toFixed(3)
  },
  fixed4: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? '-' : n.toFixed(4)
  },
  percent: function (v) {
    if (v == null || v === '' || isNaN(Number(v))) return '-'
    return (Number(v) * 100).toFixed(1) + '%'
  },
  money: function (v) {
    return Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  },
  dashMoney: function (v) {
    if (!v || Math.abs(Number(v)) <= 0.001) return '-'
    return Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  },
  wan: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? '-' : (n / 1e4).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  },
  fixed1: function (v) {
    if (v == null || v === '' || v === '-') return '-'
    const n = Number(v)
    return isNaN(n) ? '-' : n.toFixed(1)
  }
}

export default {
  name: 'EsTable',
  props: {
    data: { type: Array, default: function () { return [] } },
    columns: { type: Array, default: function () { return [] } },
    maxHeight: { type: [Number, String], default: undefined },
    summaryRow: { type: Object, default: null },
    emptyText: { type: String, default: '暂无数据' },
    visible: { type: Boolean, default: true }
  },
  methods: {
    bindCol: function (col) {
      const props = {
        prop: col.prop,
        label: col.label,
        align: col.align || 'center',
        headerAlign: col.headerAlign || 'center',
        showOverflowTooltip: col.showOverflowTooltip !== false,
        fixed: col.fixed || false
      }
      if (col.width) props.width = col.width
      if (col.minWidth) props.minWidth = col.minWidth
      if (col.labelClassName) props.labelClassName = col.labelClassName
      if (col.className) props.className = col.className
      return props
    },
    cellText: function (col, row) {
      const v = row ? row[col.prop] : undefined
      if (col.format && FORMATTERS[col.format]) return FORMATTERS[col.format](v, row)
      if (v == null || v === '') return '-'
      return v
    },
    cellStyle: function (col, row) {
      const style = {}
      const v = row ? row[col.prop] : undefined
      if (col.weight === 'bold') style.fontWeight = 600
      const color = col.color
      if (color === 'row' && row && row.color) style.color = row.color
      else if (color === 'muted') style.color = '#999'
      else if (color === 'mutedRow' && row && row._muted) style.color = '#888'
      else if (color === 'negGreen' && v < 0) style.color = '#22c55e'
      else if (color === 'signed') style.color = v >= 0 ? '#2e7d32' : '#c62828'
      else if (color === 'replace' && row && row.storage_replacement > 0) style.color = '#e65100'
      else if (color === 'signedStr' && row && row._signed != null) style.color = row._signed >= 0 ? '#2e7d32' : '#c62828'
      return style
    },
    handleSummary: function (param) {
      const self = this
      if (!this.summaryRow) return []
      return param.columns.map(function (c, i) {
        if (i === 0) return self.summaryRow[c.property] != null ? self.summaryRow[c.property] : '合计'
        const col = self.findCol(c.property)
        const format = col && col.format === 'dashMoney' ? 'money' : (col && col.format)
        const v = self.summaryRow[c.property]
        if (format && FORMATTERS[format]) return FORMATTERS[format](v, self.summaryRow)
        return v == null ? '-' : v
      })
    },
    findCol: function (prop) {
      let found = null
      const walk = function (cols) {
        ;(cols || []).forEach(function (c) {
          if (c.prop === prop) found = c
          if (c.children) walk(c.children)
        })
      }
      walk(this.columns)
      return found
    },
    handleSpan: function (meta) {
      const row = meta.row
      if (row && row._spanEnd && meta.columnIndex >= 1) {
        if (meta.columnIndex === 1) return [1, row._spanEnd]
        if (meta.columnIndex > 1 && meta.columnIndex < 1 + row._spanEnd) return [0, 0]
      }
      return [1, 1]
    },
    handleRowClass: function (meta) {
      const row = meta.row
      if (!row) return ''
      const cls = []
      if (row._rowClass) cls.push(row._rowClass)
      if (row.year === 0) cls.push('es-row-year0')
      if (row._summary) cls.push('es-row-summary')
      if (row._total) cls.push('es-row-total')
      return cls.join(' ')
    },
    layout: function () {
      const self = this
      this.$nextTick(function () {
        const table = self.$children && self.$children[0]
        if (table && typeof table.doLayout === 'function') table.doLayout()
      })
    },
    renderCol: function (h, col) {
      const self = this
      if (col.children && col.children.length) {
        return h('el-table-column', {
          key: 'g-' + col.label,
          props: {
            label: col.label,
            align: col.align || 'center',
            labelClassName: col.labelClassName
          }
        }, col.children.map(function (child) {
          return self.renderCol(h, child)
        }))
      }
      return h('el-table-column', {
        key: col.prop || col.label,
        props: this.bindCol(col),
        scopedSlots: {
          default: function (scope) {
            return h('span', { style: self.cellStyle(col, scope.row) }, [self.cellText(col, scope.row)])
          }
        }
      })
    }
  },
  watch: {
    visible: function (val) {
      if (val) this.layout()
    },
    data: function () {
      this.layout()
    }
  },
  render: function (h) {
    const self = this
    const props = {
      data: this.data,
      border: true,
      size: 'small',
      showSummary: !!this.summaryRow,
      spanMethod: this.handleSpan,
      rowClassName: this.handleRowClass,
      emptyText: this.emptyText
    }
    if (this.maxHeight) props.maxHeight = this.maxHeight
    if (this.summaryRow) props.summaryMethod = this.handleSummary
    return h('el-table', {
      class: 'es-el-table',
      style: { width: '100%' },
      props: props
    }, (this.columns || []).map(function (col) {
      return self.renderCol(h, col)
    }))
  }
}
</script>
