import Vue from 'vue'

export const ECON_DEFAULTS = {
  distributed_pv: { epc: 300, om: 0.8, storage_epc: 100, storage_lifespan: 10, storage_replacement_ratio: 0.6, capacity_ratio: 1.2, loan_ratio: 70, loan_rate: 4.0, loan_years: 12, overhead: { '10kV': 50, '35kV': 80, '110kV': 150, '220kV': 250 }, cable: { '10kV': 100, '35kV': 200, '110kV': 400, '220kV': 600 } },
  centralized_pv: { epc: 330, om: 1.5, storage_epc: 70, storage_lifespan: 10, storage_replacement_ratio: 0.7, capacity_ratio: 1.2, loan_ratio: 70, loan_rate: 4.0, loan_years: 15, overhead: { '10kV': 30, '35kV': 50, '110kV': 100, '220kV': 180 }, cable: { '10kV': 60, '35kV': 90, '110kV': 150, '220kV': 250 } },
  onshore_wind: { epc: 550, om: 2.0, storage_epc: 90, storage_lifespan: 10, storage_replacement_ratio: 0.6, capacity_ratio: 1.0, loan_ratio: 70, loan_rate: 4.0, loan_years: 15, overhead: { '10kV': 30, '35kV': 80, '110kV': 160, '220kV': 300 }, cable: { '10kV': 100, '35kV': 200, '110kV': 450, '220kV': 900 } },
  offshore_wind: { epc: 1550, om: 2.5, storage_epc: 90, storage_lifespan: 10, storage_replacement_ratio: 0.8, capacity_ratio: 1.0, loan_ratio: 80, loan_rate: 3.5, loan_years: 15, overhead: { '10kV': 40, '35kV': 70, '110kV': 140, '220kV': 250 }, cable: { '10kV': 60, '35kV': 120, '110kV': 220, '220kV': 450 } }
}

export const esStore = new Vue({
  data: function () {
    return {
      dataLoaded: false,
      sourceStats: null,
      sourceChart: null,
      scalingPreview: null,
      loadScale: 1,
      renewableScale: 1,
      chartDateStart: '',
      chartDateEnd: '',
      storage: {
        rated_power: 3,
        energy_capacity: 9,
        charge_efficiency: 0.95,
        discharge_efficiency: 0.95,
        soc_min: 0.2,
        soc_max: 0.95,
        initial_soc: 0.2,
        require_daily_cycle: false
      },
      opt: {
        start_date: '2023-3-1',
        end_date: '2023-3-3',
        dt_hours: 0.5,
        base_price: 500,
        export_price: 200,
        grid_power_min: '',
        grid_power_max: ''
      },
      optimizeParams: null,
      optimizeResult: null,
      optimizeStatus: '',
      optimizeStatusType: '',
      optimizing: false,
      progressVisible: false,
      progressPct: 0,
      progressText: '',
      progressLatest: '',
      progressTotalDays: 0,
      progressDone: 0,
      cancelling: false,
      activeTaskId: null,
      cost: {
        voltageValue: '',
        billingMethod: 'demand',
        transformerCapacity: 10,
        exportPrice: 200
      },
      voltageLevels: [],
      costResult: null,
      annualBenefit: null,
      econ: {
        annual_benefit: 0,
        revenue_deduction: 0,
        degradation_rate: 0.5,
        project_type: 'distributed_pv',
        re_max_power: 0,
        capacity_ratio: 1.2,
        re_capacity: 0,
        re_epc_price: 300,
        other_costs: 0,
        storage_capacity: 0,
        storage_epc_price: 120,
        storage_lifespan: 10,
        storage_replacement_ratio: 0.6,
        voltage_level: '35kV',
        overhead_price: 30,
        overhead_distance: 0,
        cable_price: 80,
        cable_distance: 0,
        operating_years: 20,
        loan_ratio: 70,
        loan_rate: 4,
        loan_years: 15,
        repay_method: 'equal_pi',
        om_rate: 1,
        income_tax: 25,
        equip_vat_rate: 13,
        price_vat_rate: 13,
        input_tax_years: 5,
        surcharge_rate: 12,
        dep_years: 15,
        residual_rate: 5,
        discount_rate: 8,
        autoMaxPower: true,
        autoCapacity: true,
        autoStorage: true,
        autoBenefit: true
      },
      econResult: null
    }
  },
  methods: {
    resetSource: function () {
      this.dataLoaded = false
      this.sourceStats = null
      this.sourceChart = null
      this.scalingPreview = null
      this.optimizeResult = null
      this.optimizeParams = null
      this.costResult = null
      this.annualBenefit = null
      this.econResult = null
    }
  }
})

export const esMixin = {
  computed: {
    es: function () {
      return esStore
    }
  }
}
