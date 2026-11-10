/**
 * 绿电直连评估 — API 封装（本地单用户，无需认证头）
 */
const API = {
  BASE: '/green-power-api',

  /** 带超时的 fetch；代理 HTML / 无 Content-Type 时仍尝试解析 JSON */
  async _fetch(url, options, timeoutMs) {
    options = options || {}
    timeoutMs = timeoutMs == null ? 60000 : timeoutMs
    const controller = new AbortController()
    const timer = timeoutMs > 0 ? setTimeout(() => { controller.abort() }, timeoutMs) : null
    let resp
    try {
      resp = await fetch(url, Object.assign({}, options, { signal: controller.signal }))
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('请求超时，请检查绿电直连服务是否已启动（python run.py，端口 8003）')
      }
      throw new Error('网络错误: ' + e.message)
    } finally {
      if (timer) clearTimeout(timer)
    }

    const text = await resp.text()
    let data = null
    const ct = (resp.headers.get('content-type') || '').toLowerCase()
    const looksJson = text && (ct.indexOf('json') >= 0 || text.charAt(0) === '{' || text.charAt(0) === '[')
    if (looksJson) {
      try { data = JSON.parse(text) } catch (e) { data = null }
    }
    if (!resp.ok) {
      const detail = data && data.detail !== undefined ? data.detail : null
      throw new Error(this._parseErrorDetail(detail, '请求失败 (HTTP ' + resp.status + ')'))
    }
    if (data == null) {
      throw new Error('接口返回非 JSON，请确认绿电直连服务已启动（python run.py，端口 8003）并已重启前端 devServer')
    }
    return data
  },

  _parseErrorDetail(detail, fallback) {
    if (!detail) return fallback || '请求失败'
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      const msgs = detail.map((item) => {
        if (typeof item === 'string') return item
        if (item && item.msg) return item.msg
        return JSON.stringify(item)
      })
      return msgs.join('；') || fallback || '参数校验失败'
    }
    return String(detail)
  },

  /**
   * 从 Content-Disposition 解析下载文件名（兼容 filename / filename*=UTF-8''）。
   * Java 对接时请设置：Content-Disposition: attachment; filename="xxx.csv"
   */
  filenameFromDisposition(header, fallback) {
    if (!header) return fallback
    const star = /filename\*=(?:UTF-8''|utf-8'')?([^;]+)/i.exec(header)
    if (star) {
      try {
        return decodeURIComponent(star[1].replace(/["']/g, '').trim())
      } catch (e) { /* ignore */ }
    }
    const plain = /filename=(?:"([^"]+)"|([^;]+))/i.exec(header)
    if (plain) return (plain[1] || plain[2] || '').trim()
    return fallback
  },

  /**
   * 拉取二进制文件。成功返回 { blob, filename }，filename 优先取响应头。
   */
  _fetchBlob(url, options, timeoutMs, errorFallback) {
    options = options || {}
    timeoutMs = timeoutMs == null ? 120000 : timeoutMs
    const controller = new AbortController()
    const timer = timeoutMs > 0 ? setTimeout(() => { controller.abort() }, timeoutMs) : null
    return fetch(url, Object.assign({}, options, { signal: controller.signal })).then((resp) => {
      if (!resp.ok) {
        return resp.text().then((text) => {
          let msg = errorFallback || '下载失败'
          try {
            const data = JSON.parse(text)
            if (data && data.detail) msg = this._parseErrorDetail(data.detail, msg)
          } catch (e) { /* ignore */ }
          throw new Error(msg)
        })
      }
      return resp.blob().then((blob) => {
        return {
          blob: blob,
          filename: this.filenameFromDisposition(resp.headers.get('content-disposition'), '')
        }
      })
    }).catch((e) => {
      if (e.name === 'AbortError') throw new Error('请求超时，请检查绿电直连服务是否已启动')
      throw e
    }).then((res) => {
      if (timer) clearTimeout(timer)
      return res
    }, (err) => {
      if (timer) clearTimeout(timer)
      throw err
    })
  },

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  /**
   * 下载内置示例数据。kind: load | renewable | market
   * Java 对接：GET {BASE}/api/data/download/{kind}
   */
  downloadSample(kind) {
    const fallback = {
      load: '用户负荷曲线(9MW).csv',
      renewable: '新能源发电曲线(12MW).csv',
      market: '市场电价参数.xlsx'
    }[kind] || (kind + '.bin')
    return this._fetchBlob(
      this.BASE + '/api/data/download/' + encodeURIComponent(kind),
      {},
      120000,
      '下载失败'
    ).then((res) => {
      this.downloadBlob(res.blob, res.filename || fallback)
    })
  },

  uploadData(loadFile, renewableFile) {
    const fd = new FormData()
    fd.append('load_file', loadFile)
    fd.append('renewable_file', renewableFile)
    return this._fetch(this.BASE + '/api/data/upload', { method: 'POST', body: fd }, 120000)
  },
  loadDefaultData() {
    return this._fetch(this.BASE + '/api/data/load-default', {}, 120000)
  },
  getStats() {
    return this._fetch(this.BASE + '/api/data/stats')
  },
  getChartData(start, end, loadScale, renewableScale) {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    if (loadScale != null) params.set('load_scale', loadScale)
    if (renewableScale != null) params.set('renewable_scale', renewableScale)
    return this._fetch(this.BASE + '/api/data/chart-data?' + params.toString())
  },
  previewScaling(loadScale, renewableScale) {
    return this._fetch(this.BASE + '/api/data/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load_scale: loadScale, renewable_scale: renewableScale })
    })
  },

  run632(params) {
    return this._fetch(this.BASE + '/api/analysis/run-632', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 180000)
  },
  runSizing(params) {
    return this._fetch(this.BASE + '/api/analysis/sizing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 300000)
  },
  getDetail(start, end) {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    return this._fetch(this.BASE + '/api/analysis/detail?' + params.toString())
  },
  getPowerStats() {
    return this._fetch(this.BASE + '/api/analysis/power-stats')
  },
  downloadDetail(start, end) {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    return this._fetchBlob(this.BASE + '/api/analysis/download?' + params.toString(), {}, 120000, '下载失败').then((res) => {
      this.downloadBlob(res.blob, res.filename || 'storage_detail.csv')
    })
  },

  getMarketParams() {
    return this._fetch(this.BASE + '/api/market/params')
  },
  uploadMarketPrice(file) {
    const fd = new FormData()
    fd.append('file', file)
    return this._fetch(this.BASE + '/api/market/upload', { method: 'POST', body: fd }, 120000)
  },

  calculateElectricityCost(params) {
    return this._fetch(this.BASE + '/api/electricity-cost/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 120000)
  },
  calculateEconomicEval(params) {
    return this._fetch(this.BASE + '/api/economic-eval/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 120000)
  },
  aiFetchParams(params) {
    return this._fetch(this.BASE + '/api/economic-eval/ai-fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }, 120000)
  },
  generateReport() {
    return this._fetchBlob(this.BASE + '/api/report/generate', { method: 'POST' }, 180000, '报告生成失败')
  }
}

export default API
