<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>一键生成评估报告</h2>
      <p class="es-table-note">汇总源荷数据、632 指标、最小储能定容、电费计算与经济性评价，生成 Word 报告并下载。</p>
      <div style="margin-top:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <button class="btn primary btn-large" :disabled="generating" @click="generate">
          {{ generating ? '报告生成中...' : '生成并下载报告' }}
        </button>
        <div class="status" style="margin:0" :style="{ color: statusColor }">{{ status }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'

export default {
  name: 'GdReportPanel',
  props: {
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      generating: false,
      status: '',
      statusType: ''
    }
  },
  computed: {
    statusColor() {
      if (this.statusType === 'ok') return '#2e7d32'
      if (this.statusType === 'err') return '#c62828'
      return '#666'
    }
  },
  methods: {
    generate() {
      this.generating = true
      this.status = '报告生成中…'
      this.statusType = ''
      API.generateReport().then((res) => {
        const ts = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '')
        API.downloadBlob(res.blob, res.filename || ('绿电直连项目评估报告_' + ts + '.docx'))
        this.status = '报告已生成并开始下载'
        this.statusType = 'ok'
      }).catch((e) => {
        this.status = e.message
        this.statusType = 'err'
      }).then(() => {
        this.generating = false
      })
    }
  }
}
</script>
