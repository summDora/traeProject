const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../src/api');

const modules = {
  'common.js': [
    'getDictTree', 'selectBatchList', 'querySysOrgTree', 'queryTableById',
    'queryTableTitle', 'getSBDWList', 'queryDictTree', 'getCommonCltjbTree',
    'uploadTreeFiles', 'downloadFile', 'downloadFiles', 'deleteFileById',
    'downloadClbModel', 'getUserRole', 'delTable', 'commonPassFlow', 'closePass',
    'doCheckFileByProject', 'getPageOfficeFileType', 'uploadSystemFileCheckCommon',
    'checkFileState', 'uploadSystemFile', 'queryOrgByUserOrg', 'getCydwList',
    'addTable', 'updateTable', 'queryTableFrom', 'queryOrgByUserId',
    'commonQueryOrgByUserOrg', 'queryDemandGuide', 'getDemandSuggestions',
    'getDemandBeforeOpinion', 'getGusEmptyTableByXmid', 'getDwsb4SuanData'
  ],
  'workCalculate.js': ['processProjectMeasure'],
  'reviewSummary.js': ['getScores'],
  'csBatchManage.js': ['getAddProjectTableData'],
  'flow.js': ['findProcDefHis'],
  'bannerManagement.js': ['queryBannerList'],
  'requirementBatchMangement.js': ['revisedSuggestions', 'getDemandList'],
  'materialDeclaration.js': ['submitSsFiles', 'getManufacturerByProjectCode', 'queryProjectInfoForYw'],
  'serverName.js': { GATEWAY: '/mock-gateway' },
  'electronicSignatureManagement.js': ['expertStampCreateSignFile'],
  'feasibilityReport.js': ['getList', 'getXmcddwList', 'getAllDepartList'],
  'closedMaterialUpload.js': ['querrySkglxm', 'queryZjpsxm'],
  'batchManage.js': ['savePcxx', 'getKindList', 'getSelectXq', 'saveProjectYws', 'saveProjects', 'getAllDeptList'],
  'projectManagement.js': ['queryPsyj', 'getXmPsqyj', 'queryPcbhmcByYear', 'queryOrgByUserOrg'],
  'requirementReview.js': ['getUserRole'],
  'pwApi/pwProjectDeclaration.js': ['submitProject'],
  'szhApi/common.js': [
    'getProjectBeforeOpinion', 'revisedSuggestions', 'querySysOrgTree',
    'queryHymcTree', 'queryPcbhmcByYear'
  ],
  'szhApi/csProjectInternalAudit.js': [
    'selectBatchList', 'getBatchListForProject', 'queryMeetingInfoByProjectCode',
    'reqRecallCloseProject', 'getBatchListForProjectData', 'getProjectListData',
    'getProjectList', 'importInProject', 'submitProject', 'getRelationalProjectList',
    'saveRelationalProject', 'deleteRelationalProject', 'exportProject', 'batchSubmitPreAudit'
  ],
  'szhApi/szhProjectManagement.js': ['queryProjectManageList', 'exportProjectManage', 'importInProject'],
  'szhApi/szhBatchManage.js': [
    'getRelationalProjectList', 'deleteRelationalProject', 'getProjectData',
    'getBatchListOption', 'saveRelationalProject'
  ],
  'szhApi/csSzhInternetCsConstruction.js': ['getAuditorByPart', 'downloadTempApi'],
  'szhApi/szhProjectDeclaration.js': [
    'submitPreAudit', 'queryUploadSortNumber', 'queryUploadWorkList',
    'confirmUploadWork', 'getMaterialFileId', 'judgeHasUploadProject', 'submitProjectUrl'
  ],
  'szhApi/szhDuplicateCheck.js': ['exportProjectResult', 'queryProjectInfomationList'],
  'szhApi/szhExpertsPreliminary.js': ['getExpertsRecordList'],
  'szhApi/szhGroupLeaderSummary.js': [
    'getMeetingExpertTableData', 'getProjectExpertTableData', 'queryExpertReviewList',
    'queryExpertReviewDetail', 'saveExpertReview'
  ],
  'szhApi/haveMeals.js': ['insertMeal', 'queryMeal', 'updateMeal', 'queryMealDate', 'meetingReplyDetail']
};

const mockBatchList = [
  {
    batchName: '2024年第一批次',
    batchCode: 'B2024001',
    modify: 1,
    professionalType: '0',
    declareStartDate: '2024-01-01',
    declareEndDate: '2024-12-31',
    opend: false,
    checkList: [],
    children: [
      {
        projectName: '示例项目A',
        projectCode: 'P2024001',
        isReject: '0',
        projectStatus: '1'
      }
    ]
  }
];

const mockProjectList = [
  {
    projectName: '示例项目A',
    projectCode: 'P2024001',
    batchName: '2024年第一批次',
    demandCode: 'XQ001',
    createByName: '张三',
    sbsj: '2024-06-01'
  }
];

function writeFnModule(filePath, names, defaultResult = []) {
  const relImport = filePath.includes('szhApi/')
    ? "import { createMockFn } from '../mockFactory.js';"
    : filePath.includes('pwApi/')
      ? "import { createMockFn } from '../mockFactory.js';"
      : "import { createMockFn } from './mockFactory.js';";
  const resultJson = JSON.stringify(defaultResult);
  const body = names.map((n) => {
    if (['getProjectList', 'getBatchListForProject', 'selectBatchList'].includes(n)) {
      return `export const ${n} = createMockFn(${resultJson});`;
    }
    if (['queryProjectManageList', 'getRelationalProjectList', 'getAddProjectTableData'].includes(n)) {
      return `export const ${n} = createMockFn(${JSON.stringify(mockProjectList)});`;
    }
    return `export const ${n} = createMockFn([]);`;
  }).join('\n');
  const content = `${relImport}\n\n${body}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function writeConstModule(filePath, obj) {
  const entries = Object.entries(obj).map(([k, v]) => {
    const val = typeof v === 'string' ? `'${v}'` : JSON.stringify(v);
    return `export const ${k} = ${val};`;
  }).join('\n');
  fs.writeFileSync(filePath, `${entries}\n`);
}

Object.entries(modules).forEach(([file, value]) => {
  const filePath = path.join(root, file);
  if (Array.isArray(value)) {
    const defaultResult = file.includes('csProjectInternalAudit') ? mockBatchList : [];
    writeFnModule(filePath, value, defaultResult);
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    writeConstModule(filePath, value);
  }
});

console.log('Mock API files generated.');
