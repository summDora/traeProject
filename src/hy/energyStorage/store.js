import Vue from "vue";

export const esStore = new Vue({
  data() {
    return {
      // —— 源荷数据 ——
      dataLoaded: false, // 是否已加载/上传源荷数据
      sourceStats: null, // GET /api/data/stats | load-default | upload 返回的统计摘要
      sourceChart: null, // 源荷曲线：{ chart_labels, chart_load, chart_renewable, chart_net }
      scalingPreview: null, // POST /api/data/preview 缩放预览；优先于 sourceChart 绘图
      loadScale: 1, // 负荷缩放系数 → API load_scale
      renewableScale: 1, // 新能源缩放系数 → API renewable_scale
      chartDateStart: "", // 曲线起始日期 YYYY-MM-DD，同步 opt.start_date
      chartDateEnd: "", // 曲线结束日期 YYYY-MM-DD，同步 opt.end_date

      // —— 储能参数 Tab2 → OptimizeRequest.storage ——
      storage: {
        rated_power: 3, // 额定充放电功率 MW → storage.rated_power
        energy_capacity: 9, // 储能容量 MWh → storage.energy_capacity
        charge_efficiency: 0.95, // 充电效率 0~1 → storage.charge_efficiency
        discharge_efficiency: 0.95, // 放电效率 0~1 → storage.discharge_efficiency
        soc_min: 0.2, // SOC 下限 0~1 → storage.soc_min
        soc_max: 0.95, // SOC 上限 0~1 → storage.soc_max
        initial_soc: 0.2, // 初始 SOC 0~1 → storage.initial_soc
        require_daily_cycle: false, // 日循环约束 → storage.require_daily_cycle
      },

      // —— 优化计算 Tab3 → OptimizeRequest（不含 storage） ——
      opt: {
        start_date: "2023-03-01", // 优化起始日期 → start_date
        end_date: "2023-03-03", // 优化结束日期 → end_date
        dt_hours: 0.5, // 时间步长小时 → dt_hours
        base_price: 500, // 平段基准电价 元/MWh → base_price
        export_price: 200, // 上网电价 元/MWh → export_price
        grid_power_min: "", // 净功率下限 MW，空=不传 → grid_power_min
        grid_power_max: "", // 净功率上限 MW，空=不传 → grid_power_max
      },
      optimizeParams: null, // 最近一次提交的优化请求快照（前端缓存）
      optimizeResult: null, // POST /api/optimize/run 响应 OptimizeResponse
      optimizeStatus: "", // 优化进度/结果文案（仅前端）
      optimizeStatusType: "", // 状态色：ok / err / ''（仅前端）
      optimizing: false, // 是否正在优化（仅前端）
      progressVisible: false, // 进度条是否显示（仅前端）
      progressPct: 0, // 进度百分比 0~100（仅前端）
      progressText: "", // 进度主文案（仅前端）
      progressLatest: "", // 最新一条进度日志（仅前端）
      progressTotalDays: 0, // 任务总天数（仅前端）
      progressDone: 0, // 已完成天数（仅前端）
      cancelling: false, // 是否正在取消任务（仅前端）
      activeTaskId: null, // 当前优化任务 id → /api/optimize/status/{id}

      // —— 电费计算 Tab5 → ElectricityCostRequest ——
      cost: {
        voltageValue: "", // 电压等级标识，页面字段；接口 voltage（形如 two_part|35kV）
        billingMethod: "demand", // 计费方式 demand按需量 / capacity按容量 → billing_method
        transformerCapacity: 10, // 变压器容量 MW → transformer_capacity
        exportPrice: 200, // 上网电价 元/MWh → export_price
      },
      voltageLevels: [], // 市场电价返回的电压等级下拉 { value, label }（仅前端）
      costResult: null, // POST /api/electricity-cost/calculate 响应
      annualBenefit: null, // 年度效益 万元，由电费结果写入 econ.annual_benefit

      // —— 经济性评价 Tab6：页面多为百分数，提交时需 /100 转为接口小数 ——
      econ: {
        annual_benefit: 0, // 年度效益 万元含税 → annual_benefit（来自 Tab5）
        revenue_deduction: 0, // 收益扣除 万元 → revenue_deduction
        degradation_rate: 0.5, // 年衰减率 % → degradation_rate（接口小数，需 /100）
        project_type: "distributed_pv", // 项目类型 → project_type：distributed_pv / centralized_pv / onshore_wind / offshore_wind
        re_max_power: 0, // 最大发电功率 MW → re_max_power_mw
        capacity_ratio: 1.2, // 容配比 → capacity_ratio
        re_capacity: 0, // 装机容量 MW → re_capacity_mw
        re_epc_price: 300, // 本体EPC单价 万元/MW含税 → re_epc_price
        other_costs: 0, // 其它费用 万元 → other_costs
        storage_capacity: 0, // 储能容量 MWh → storage_capacity_mwh
        storage_epc_price: 120, // 储能EPC单价 万元/MWh含税 → storage_epc_price
        storage_lifespan: 10, // 储能寿命 年 → storage_lifespan
        storage_replacement_ratio: 0.6, // 更换成本比例 0~1 → storage_replacement_ratio
        voltage_level: "35kV", // 送出电压等级（仅前端，用于查 ECON_DEFAULTS 单价）
        overhead_price: 30, // 架空线单价 万元/km → overhead_line_price
        overhead_distance: 0, // 架空线距离 km → overhead_line_distance
        cable_price: 80, // 电缆单价 万元/km → cable_price
        cable_distance: 0, // 电缆距离 km → cable_distance
        operating_years: 20, // 经营期 年 → operating_years
        loan_ratio: 70, // 贷款比例 % → loan_ratio（接口小数，需 /100）
        loan_rate: 4, // 贷款年利率 % → loan_rate（接口小数，需 /100）
        loan_years: 15, // 贷款期限 年 → loan_years
        repay_method: "equal_pi", // 还款方式 equal_pi等额本息 / equal_p等额本金 → repay_method
        om_rate: 1, // 运维费率 % → om_rate（接口小数，需 /100）
        income_tax: 25, // 所得税率 % → income_tax_rate（接口小数，需 /100）
        equip_vat_rate: 13, // 设备增值税率 % → equip_vat_rate（接口小数，需 /100）
        price_vat_rate: 13, // 电价增值税率 % → price_vat_rate（接口小数，需 /100）
        input_tax_years: 5, // 进项税抵扣年限 年 → input_tax_years
        surcharge_rate: 12, // 附加税率 % → surcharge_rate（接口小数，需 /100）
        dep_years: 15, // 折旧年限 年 → depreciation_years
        residual_rate: 5, // 残值率 % → residual_rate（接口小数，需 /100）
        discount_rate: 8, // 折现率/基准收益率 % → discount_rate（接口小数，需 /100）
        autoMaxPower: true, // 最大功率是否随源荷数据自动回填（仅前端）
        autoCapacity: true, // 装机容量是否按容配比自动算（仅前端）
        autoStorage: true, // 储能容量是否取 Tab2（仅前端）
        autoBenefit: true, // 年度效益是否取 Tab5（仅前端）
      },
      econResult: null, // POST /api/economic-eval/calculate 响应 EconomicEvalResponse
    };
  },
  methods: {
    resetSource() {
      this.dataLoaded = false;
      this.sourceStats = null;
      this.sourceChart = null;
      this.scalingPreview = null;
      this.optimizeResult = null;
      this.optimizeParams = null;
      this.costResult = null;
      this.annualBenefit = null;
      this.econResult = null;
    },
  },
});

export const esMixin = {
  computed: {
    es() {
      return esStore;
    },
  },
};
