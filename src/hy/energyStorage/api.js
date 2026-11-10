/**
 * API 调用层 — 封装所有后端请求（本地单用户模式，无需认证头）
 */
const API = {
  BASE: '/pv-storage-api',

  /**
   * 带超时的 fetch 封装：避免请求挂死导致按钮永久禁用。
   * 非 JSON 响应（代理 502/HTML 错误页）给出可读错误。
   */
  async _fetch(url, options = {}, timeoutMs = 60000) {
    const controller = new AbortController();
    const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;
    let resp;
    try {
      resp = await fetch(url, { ...options, signal: controller.signal });
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('请求超时，请检查服务是否正常运行');
      }
      throw new Error(`网络错误: ${e.message}`);
    } finally {
      if (timer) clearTimeout(timer);
    }

    let data = null;
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        data = await resp.json();
      } catch (e) {
        data = null;
      }
    }
    if (!resp.ok) {
      const detail = data && data.detail !== undefined ? data.detail : null;
      throw new Error(this._parseErrorDetail(detail, `请求失败 (HTTP ${resp.status})`));
    }
    return data;
  },

  /**
   * 解析后端返回的 detail 字段为可读的错误信息。
   * FastAPI 参数校验失败 (HTTP 422) 时，detail 是 Pydantic 错误对象数组，
   * 直接拼接会变成 "[object Object],[object Object]"，需要提取 msg 字段。
   */
  _parseErrorDetail(detail, fallback) {
    if (!detail) return fallback || '请求失败';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const msgs = detail.map(item => {
        if (typeof item === 'string') return item;
        // Pydantic v2 格式: { type, loc, msg, input, ctx }
        if (item && item.msg) {
          // 将 loc 路径翻译为中文提示
          const loc = (item.loc || []).join('.');
          const fieldMap = {
            'body.storage.rated_power': '额定充放电功率',
            'body.storage.energy_capacity': '储能容量',
            'body.storage.charge_efficiency': '充电效率',
            'body.storage.discharge_efficiency': '放电效率',
            'body.storage.soc_min': 'SOC下限',
            'body.storage.soc_max': 'SOC上限',
            'body.storage.initial_soc': '初始SOC',
            'body.start_date': '开始日期',
            'body.end_date': '结束日期',
            'body.load_scale': '负荷缩放系数',
            'body.renewable_scale': '新能源缩放系数',
            'body.dt_hours': '时间步长',
            'body.base_price': '基准电价',
            'body.export_price': '上网电价',
            'body.operating_years': '经营期',
            'body.loan_ratio': '贷款比例',
            'body.loan_rate': '贷款年利率',
            'body.om_rate': '运维费率',
          };
          const fieldName = fieldMap[loc] || loc;
          // 翻译常见校验消息
          let msg = item.msg;
          if (item.type === 'greater_than') msg = `必须大于 ${item.ctx?.gt ?? 0}`;
          else if (item.type === 'greater_than_equal') msg = `必须大于等于 ${item.ctx?.ge ?? 0}`;
          else if (item.type === 'less_than') msg = `必须小于 ${item.ctx?.lt ?? 0}`;
          else if (item.type === 'less_than_equal') msg = `必须小于等于 ${item.ctx?.le ?? 0}`;
          else if (item.type === 'value_error' && item.msg) msg = item.msg;
          return fieldName ? `${fieldName}: ${msg}` : msg;
        }
        return JSON.stringify(item);
      });
      return msgs.join('；') || fallback || '参数校验失败';
    }
    return String(detail);
  },

  /**
   * 从 Content-Disposition 解析下载文件名（兼容 filename / filename*=UTF-8''）。
   * Java 对接时请设置：Content-Disposition: attachment; filename="xxx.csv"
   * 中文文件名建议同时带 filename*=UTF-8''encoded
   */
  filenameFromDisposition(header, fallback) {
    if (!header) return fallback;
    const star = /filename\*=(?:UTF-8''|utf-8'')?([^;]+)/i.exec(header);
    if (star) {
      try {
        return decodeURIComponent(star[1].replace(/["']/g, '').trim());
      } catch (e) { /* ignore */ }
    }
    const plain = /filename=(?:"([^"]+)"|([^;]+))/i.exec(header);
    if (plain) return (plain[1] || plain[2] || '').trim();
    return fallback;
  },

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  /**
   * 拉取二进制文件。成功返回 { blob, filename }，filename 优先取响应头。
   */
  async _fetchBlob(url, options = {}, timeoutMs = 120000, fallbackName = 'download.bin') {
    const controller = new AbortController();
    const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;
    let resp;
    try {
      resp = await fetch(url, { ...options, signal: controller.signal });
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('请求超时，请检查服务是否正常运行');
      }
      throw new Error(`网络错误: ${e.message}`);
    } finally {
      if (timer) clearTimeout(timer);
    }

    if (!resp.ok) {
      let data = null;
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await resp.json(); } catch (e) { data = null; }
      }
      const detail = data && data.detail !== undefined ? data.detail : null;
      throw new Error(this._parseErrorDetail(detail, `下载失败 (HTTP ${resp.status})`));
    }
    const blob = await resp.blob();
    const filename = this.filenameFromDisposition(
      resp.headers.get('content-disposition'),
      fallbackName
    );
    return { blob, filename };
  },

  // ==========================================================
  // 数据管理
  // ==========================================================
  async uploadData(loadFile, renewableFile) {
    const fd = new FormData();
    fd.append('load_file', loadFile);
    fd.append('renewable_file', renewableFile);
    return this._fetch(`${this.BASE}/api/data/upload`, { method: 'POST', body: fd }, 120000);
  },

  async loadDefaultData() {
    return this._fetch(`${this.BASE}/api/data/load-default`, {}, 120000);
  },

  /**
   * 下载内置示例数据。kind: load | renewable | market
   * Java 对接：GET {BASE}/api/data/download/{kind}
   */
  async downloadSample(kind) {
    const fallback = {
      load: '1_工商业用户负荷(金属制品10MW).csv',
      renewable: '1_新能源发电出力(光伏4MW).csv',
      market: '1_市场电价参数.xlsx',
    }[kind] || `${kind}.bin`;
    const { blob, filename } = await this._fetchBlob(
      `${this.BASE}/api/data/download/${encodeURIComponent(kind)}`,
      {},
      120000,
      fallback
    );
    this.downloadBlob(blob, filename);
  },

  async getStats() {
    return this._fetch(`${this.BASE}/api/data/stats`);
  },

  async getChartData(start, end, loadScale, renewableScale) {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    if (loadScale != null) params.set('load_scale', loadScale);
    if (renewableScale != null) params.set('renewable_scale', renewableScale);
    return this._fetch(`${this.BASE}/api/data/chart-data?${params.toString()}`);
  },

  async previewScaling(loadScale, renewableScale) {
    return this._fetch(`${this.BASE}/api/data/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load_scale: loadScale, renewable_scale: renewableScale }),
    });
  },

  // ==========================================================
  // 优化
  // ==========================================================
  async runOptimization(params) {
    return this._fetch(`${this.BASE}/api/optimize/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }, 0); // 优化耗时不确定，不设超时（由后端日期范围上限保护）
  },

  async startOptimization(params) {
    return this._fetch(`${this.BASE}/api/optimize/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  },

  async getProgress(taskId) {
    return this._fetch(`${this.BASE}/api/optimize/progress/${taskId}`);
  },

  async getResult(taskId) {
    return this._fetch(`${this.BASE}/api/optimize/result/${taskId}`);
  },

  async cancelOptimization(taskId) {
    return this._fetch(`${this.BASE}/api/optimize/cancel/${taskId}`, { method: 'POST' });
  },

  // ==========================================================
  // 市场电价
  // ==========================================================
  async getMarketParams() {
    return this._fetch(`${this.BASE}/api/market/params`);
  },

  async uploadMarketPrice(file) {
    const fd = new FormData();
    fd.append('file', file);
    return this._fetch(`${this.BASE}/api/market/upload`, { method: 'POST', body: fd }, 120000);
  },

  // ==========================================================
  // 电费计算
  // ==========================================================
  async calculateElectricityCost(params) {
    return this._fetch(`${this.BASE}/api/electricity-cost/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }, 120000);
  },

  // ==========================================================
  // 经济性评价
  // ==========================================================
  async calculateEconomicEval(params) {
    return this._fetch(`${this.BASE}/api/economic-eval/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  },
};

export default API;
