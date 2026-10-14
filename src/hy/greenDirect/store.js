import Vue from 'vue'

export const gdStore = new Vue({
  data() {
    return {
      tabHandler: null, // 父页注入的切 tab 函数（仅前端）

      // —— 源荷数据 ——
      dataLoaded: false, // 是否已加载/上传源荷数据
      sourceStats: null, // GET /api/data/stats | load-default | upload 返回的统计摘要
      sourceChart: null, // 源荷曲线：{ chart_labels, chart_load, chart_renewable, chart_net }
      scalingPreview: null, // POST /api/data/preview 缩放预览；优先于 sourceChart 绘图
      loadScale: 1, // 负荷缩放系数 → API load_scale
      renewableScale: 1, // 新能源缩放系数 → API renewable_scale
      chartDateStart: '', // 曲线起始日期
      chartDateEnd: '', // 曲线结束日期
      dateStart: '', // 数据日期范围起（来自 sourceStats.date_start）
      dateEnd: '', // 数据日期范围止（来自 sourceStats.date_end）

      // —— 储能参数 → 632 Run632Request / 定容 SizingRequest ——
      storage: {
        rated_power: 0, // 额定功率 P MW → P
        energy_capacity: 0, // 储能容量 E MWh → E
        eta: 0.95, // 单侧效率 0~1 → eta
        soc_min: 0.2, // SOC 下限 0~1 → soc_min_frac
        soc_max: 0.95, // SOC 上限 0~1 → soc_max_frac
        initial_soc: 0.5 // 起始 SOC 0~1 → init_soc_frac
      },
      basePrice: 500, // 平段基准电价 元/MWh → base_price（仅影响分时电价曲线）
      analysisDone: false, // 632 是否已跑完（仅前端）
      analysisResult: null, // POST /api/analysis/run-632 响应

      // —— 最小储能定容 Tab3 → SizingRequest ——
      sizing: {
        T2: 0.2, // 倒送电量占比上限 0~1 → T2
        T3: 0.3, // 自发自用电量占比下限 0~1 → T3
        E_tol: 0.5, // 容量搜索精度 MWh → E_tol
        P_tol: 0.5 // 功率搜索精度 MW → P_tol
      },
      sizingResult: null, // POST /api/analysis/size-storage 响应
      lastDetail: null, // 最近一次 632/定容明细曲线（结果页绘图）
      powerStats: null, // 功率统计表数据（结果页）

      // —— 电费计算 Tab5 → ElectricityCostRequest ——
      cost: {
        voltageValue: '', // 电压等级标识，页面字段；接口 voltage
        billingMethod: 'demand', // 计费方式 demand按需量 / capacity按容量 → billing_method
        transformerCapacity: 10, // 变压器容量 MW → transformer_capacity
        exportPrice: 200 // 上网电价 元/MWh → export_price
      },
      voltageLevels: [], // 市场电价返回的电压等级下拉（仅前端）
      costResult: null, // POST /api/electricity-cost/calculate 响应
      annualBenefit: null, // 年度效益 万元，写入 econ.annual_benefit
      selfUseFeeHint: '', // 自发自用缴费提示文案（仅前端）

      // —— 经济性评价 Tab6：页面多为百分数，提交时需 /100 转为接口小数 ——
      econ: {
        annual_benefit: 0, // 年度效益 万元含税 → 提交时与 revenue_deduction 轧差后写入 annual_benefit
        revenue_deduction: 0, // 收益扣除 万元（前端轧差，绿电接口无独立字段）
        degradation_rate: 0.5, // 年衰减率 % → degradation_rate（接口小数，需 /100）
        project_type: 'onshore_wind', // 项目类型 → project_type：onshore_wind / offshore_wind / centralized_pv / distributed_pv
        other_costs: 0, // 其它费用 万元 → other_costs
        re_max_power: 12.45, // 最大发电功率 MW → re_max_power_mw
        capacity_ratio: 1, // 容配比 → capacity_ratio
        re_capacity: 12.45, // 装机容量 MW → re_capacity_mw
        re_epc_price: 410, // 本体EPC单价 万元/MW含税 → re_epc_price
        storage_capacity: 0, // 储能容量 MWh → storage_capacity_mwh
        storage_power: 0, // 储能功率 MW → storage_power_mw
        storage_epc_price: 80, // 储能EPC单价 万元/MWh含税 → storage_epc_price
        storage_lifespan: 10, // 储能寿命 年 → storage_lifespan
        storage_replacement_ratio: 0.6, // 更换成本比例 0~1 → storage_replacement_ratio
        voltage_level: '35kV', // 送出电压等级（仅前端，用于查 ECON_DEFAULTS / AI 获取）
        overhead_price: 50, // 架空线单价 万元/km → overhead_line_price
        overhead_distance: 0, // 架空线距离 km → overhead_line_distance
        cable_price: 120, // 电缆单价 万元/km → cable_price
        cable_distance: 0, // 电缆距离 km → cable_distance
        operating_years: 20, // 经营期 年 → operating_years
        loan_ratio: 70, // 贷款比例 % → loan_ratio（接口小数，需 /100）
        loan_rate: 3.5, // 贷款年利率 % → loan_rate（接口小数，需 /100）
        loan_years: 15, // 贷款期限 年 → loan_years
        repay_method: 'equal_pi', // 还款方式 equal_pi等额本息 / equal_p等额本金 → repay_method
        om_rate: 2, // 运维费率 % → om_rate（接口小数，需 /100）
        income_tax: 25, // 所得税率 % → income_tax_rate（接口小数，需 /100）
        elec_vat_rate: 13, // 电费增值税率 % → electricity_vat_rate（接口小数，需 /100）
        equip_vat_rate: 13, // 设备增值税率 % → equipment_vat_rate（接口小数，需 /100）
        input_vat_years: 5, // 进项税抵扣年限 年 → input_vat_deduct_years
        dep_years: 15, // 折旧年限 年 → depreciation_years
        residual_rate: 5, // 残值率 % → residual_rate（接口小数，需 /100）
        discount_rate: 8 // 折现率/基准收益率 % → discount_rate（接口小数，需 /100）
      },
      econResult: null // POST /api/economic-eval/calculate 响应
    }
  },
  methods: {
    goTab(id) {
      if (typeof this.tabHandler === 'function') this.tabHandler(id)
    },
    resetSource() {
      this.dataLoaded = false
      this.sourceStats = null
      this.sourceChart = null
      this.scalingPreview = null
      this.analysisDone = false
      this.analysisResult = null
      this.sizingResult = null
      this.lastDetail = null
      this.powerStats = null
      this.costResult = null
      this.annualBenefit = null
      this.selfUseFeeHint = ''
      this.econResult = null
    }
  }
})

export const gdMixin = {
  computed: {
    gd() {
      return gdStore
    }
  }
}
