import { createSelectField } from '@/utils/formField.js';

const systemNameOptions = [
  { key: '', value: '全部' },
  { key: '能源互联网营销服务系统', value: '能源互联网营销服务系统' }
];

const microAppOptions = [
  { key: '', value: '全部' },
  { key: '95598客户服务', value: '95598客户服务' },
  { key: '电网接入', value: '电网接入' }
];

const level1FunctionOptions = [
  { key: '', value: '全部' },
  { key: '客户诉求处理', value: '客户诉求处理' },
  { key: '业扩报装', value: '业扩报装' }
];

const baselineSearchConfig = [
  createSelectField('systemName', '系统名称', '请选择系统名称', systemNameOptions),
  createSelectField('microAppName', '微应用名称', '请选择微应用名称', microAppOptions),
  createSelectField('level1Function', '一级功能', '请选择一级功能', level1FunctionOptions)
];

const baselineSearchData = {
  systemName: '',
  microAppName: '',
  level1Function: ''
};

const demandInfoTabs = [
  { key: 'baseline', label: '标准功能基线库', component: 'demandBaselineTab' },
  { key: 'blueprint', label: '关联业务蓝图', component: 'demandBlueprintTab' },
  { key: 'demandInfo', label: '需求信息', component: 'demandInfoTab' },
  { key: 'duplicate', label: '需求查重结果', component: 'demandDuplicateTab' },
  { key: 'relevance', label: '关联性审查结果', component: 'demandRelevanceTab' }
];

export {
  baselineSearchConfig,
  baselineSearchData,
  demandInfoTabs
};
