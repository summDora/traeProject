<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>储能系统参数</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>额定充放电功率 (MW)</label>
          <el-input size="small" type="number" v-model.number="es.storage.rated_power" :step="0.1" :min="0.1"></el-input>
        </div>
        <div class="form-group">
          <label>储能容量 (MWh)</label>
          <el-input size="small" type="number" v-model.number="es.storage.energy_capacity" :step="0.1" :min="0.1"></el-input>
        </div>
        <div class="form-group">
          <label>充电效率</label>
          <el-input size="small" type="number" v-model.number="es.storage.charge_efficiency" :step="0.01" :min="0.01" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>放电效率</label>
          <el-input size="small" type="number" v-model.number="es.storage.discharge_efficiency" :step="0.01" :min="0.01" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>SOC 下限</label>
          <el-input size="small" type="number" v-model.number="es.storage.soc_min" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>SOC 上限</label>
          <el-input size="small" type="number" v-model.number="es.storage.soc_max" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>起始 SOC</label>
          <el-input size="small" type="number" v-model.number="es.storage.initial_soc" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>日循环约束</label>
          <el-select v-model="cycleFlag" size="small" popper-class="es-select-dropdown">
            <el-option label="否 (每日SOC终值自由)" value="false"></el-option>
            <el-option label="是 (SOC回归初值)" value="true"></el-option>
          </el-select>
        </div>
      </div>
      <div class="param-summary">{{ summary }}</div>
    </div>
  </section>
</template>

<script>
import { esMixin } from '../store'

export default {
  name: 'StorageParamsPanel',
  mixins: [esMixin],
  props: {
    active: { type: Boolean, default: false }
  },
  computed: {
    cycleFlag: {
      get: function () {
        return this.es.storage.require_daily_cycle ? 'true' : 'false'
      },
      set: function (v) {
        this.es.storage.require_daily_cycle = v === 'true'
      }
    },
    summary: function () {
      const s = this.es.storage
      return s.rated_power + 'MW / ' + s.energy_capacity + 'MWh · SOC ' +
        (s.soc_min * 100).toFixed(0) + '%~' + (s.soc_max * 100).toFixed(0) +
        '% · 初值 ' + (s.initial_soc * 100).toFixed(0) + '%'
    }
  }
}
</script>
