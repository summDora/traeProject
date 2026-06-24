import axios from '@/utils/axios/index.js'

// 评价范围管理---------------------------------------------------------------------------------------------------------------------------------------
export const dict = () => {
  return axios({
    url: `/xmcxpj/appraisePlan/dict`,
  })
}
export const appraisePlanList = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/appraisePlanList`,
    data,
  })
}
export const appraisePlanDetail = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/appraisePlanDetail`,
    data,
  })
}
export const projectList = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/projectList`,
    data,
  })
}
export const switchAppraisePlan = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/switchAppraisePlan`,
    data,
  })
}
export const deleteAppraisePlan = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/deleteAppraisePlan`,
    data,
  })
}
export const smartProjectList = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/smartProjectList`,
    data,
  })
}
export const professorList = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/professorList`,
    data,
  })
}
//       可选专家列表 查询 接口 /reportSynergiaCompile/professorList
export const reportprofessorList = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/professorList`,
    data,
  })
}
// 一键推送 接口 /reportSynergiaCompile/pushBaseReport
export const pushBaseReport = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/pushBaseReport`,
    data,
  })
}
export const smartAssignProfessor = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/smartAssignProfessor`,
    data,
  })
}
export const setProfessorLeader = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/setProfessorLeader`,
    data,
  })
}
export const getQuestionnaireList = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/getQuestionnaireList`,
    data,
  })
}
export const addAppraisePlan = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/addAppraisePlan`,
    data,
  })
}
export const updateAppraisePlan = data => {
  return axios({
    url: `/xmcxpj/appraisePlan/updateAppraisePlan`,
    data,
  })
}
export const download = data => {
  return axios({
    url: `/xmcxpj/questionnaire/download`,
    data,
    isBlob: true,
  })
}
// 项目基础信息分析---------------------------------------------------------------------------------------------------------------------------------------

// 下拉选项查询
export const cxdict = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/dict`,
    data,
  })
}
// 评价计划列表查询
export const cxappraisePlanList = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/appraisePlanList`,
    data,
  })
}
// 评价项目详情
export const getFeasibilityStudyFunction = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/getFeasibilityStudyFunction`,
    data,
  })
}
// 评价计划列表查询
export const cxprojectList = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/projectList`,
    data,
  })
}
// 弹窗评价计划列表查询
export const statisticsProjectList = data => {
  return axios({
    url: `/xmcxpj/statistics/projectList`,
    data,
  })
}
// 评价项目详情
export const projectAppraiseDetail = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/projectAppraiseDetail`,
    data,
  })
}
// 项目统计结果
export const projectEfficiencySummary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/projectEfficiencySummary`,
    data,
  })
}
// 项目评价报告下载
// /projectEfficiency/projectReportDownload
export const projectReportDownload = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/projectReportDownload`,
    data,
    isBlob: true,
  })
}
export const reportBatchDownload = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/reportBatchDownload`,
    data,
    isBlob: true,
  })
}

// 评价项目清单导出
export const projectListDownload = data => {
  return axios({
    url: `/xmcxpj/projectEfficiency/projectListDownload`,
    data,
    isBlob: true,
  })
}
// 主观评价数据解析---------------------------------------------------------------------------------------------------------------------------------------
// 下拉选项查询
export const quesdict = () => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/dict`,
  })
}
// 问卷调查列表查询
export const questionnaireSurveyList = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/questionnaireSurveyList`,
    data,
  })
}
// 问卷调查详情查询
export const questionnaireSurveyDetail = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/questionnaireSurveyDetail`,
    data,
  })
}
// 链接问卷详情查询
export const questionnaireDetail = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/questionnaireDetail`,
    data,
  })
}
// 链接问卷提交
export const commit = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/commit`,
    data,
  })
}
export const copyLink = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/copyLink`,
    data,
  })
}
// 问卷下载
export const quesdownload = data => {
  return axios({
    url: `/xmcxpj/questionnaireSurvey/download`,
    data,
    isBlob: true,
  })
}

// 评价报告协同编制---------------------------------------------------------------------------------------------------------------------------------------
// 下拉选项查询	/xmcxpj/reportSynergiaCompile/dict
export const redict = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/dict`,
    data,
  })
}
export const downloadReport = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/downloadReport`,
    data,
    isBlob: true,
  })
}
export const downloadReportPicture = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/downloadReportPicture`,
    data,
    isBlob: true,
  })
}
export const importReport = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/importReport`,
    data,
    isFormData: true,
  })
}

// 项目列表查询	/xmcxpj/reportSynergiaCompile/projectList
export const compileProjectList = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/compileProjectList`,
    data,
  })
}
// 项目列表查询	/xmcxpj/reportSynergiaCompile/projectList
export const reprojectList = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/projectList`,
    data,
  })
}
// 编制详情查询	/xmcxpj/reportSynergiaCompile/compileDetail
export const compileDetail = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/compileDetail`,
    data,
  })
}
// 报告编制历史记录-分页	/xmcxpj/reportSynergiaCompile/historyList
export const historyList = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/historyList`,
    data,
  })
}
export const templateHistoryList = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/templateHistoryList`,
    data,
  })
}
// 保存评价数据	/xmcxpj/reportSynergiaCompile/saveAppraiseScore
export const saveAppraiseScore = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/saveAppraiseScore`,
    data,
  })
}
// 非组长填写意见保存接口 ：/reportSynergiaCompile/saveResultByNotLeader
export const saveResultByNotLeader = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/saveResultByNotLeader`,
    data,
  })
}
// 保存报告总结	/xmcxpj/reportSynergiaCompile/saveAppraiseResult
export const saveAppraiseResult = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/saveAppraiseResult`,
    data,
  })
}
// 历史版本回溯	/xmcxpj/reportSynergiaCompile/recallHistory
export const recallHistory = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/recallHistory`,
    data,
  })
}
// 项目完结	/xmcxpj/reportSynergiaCompile/finish
export const finish = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/finish`,
    data,
  })
}
// /xmcxpj/reportSynergiaCompile/sendBack
export const sendBack = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/sendBack`,
    data,
  })
}
// 退回 接口 ：/reportSynergiaCompile/sendBackReportResult
export const sendBackReportResult = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/sendBackReportResult`,
    data,
  })
}
// 协同编制里加的删除 接口 /reportSynergiaCompile/reset
export const reset = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/reset`,
    data,
  })
}
// /xmcxpj/reportSynergiaCompile/commitLeader
export const commitLeader = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/commitLeader`,
    data,
  })
}
// pdf
export const reportPreview = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/reportPreview`,
    data,
    isBlob: true,
  })
}

export const imageImport = data => {
  return axios({
    url: `/xmcxpj/reportSynergiaCompile/reportExtract`,
    data,
    isFormData: true,
  })
}

export const querytableData = data => {
  return axios({
    url: `/xmcxpj/sharedData/pageSharedData`,
    data,
  })
}

export const edittableData = data => {
  return axios({
    url: `/xmcxpj/sharedData/updateSharedData`,
    data,
  })
}
export const downloadtableDatatemplate = data => {
  return axios({
    url: `/xmcxpj/sharedData/downloadSharedDataTemplate`,
    data,
    isBlob: true,
  })
}

export const importtableData = data => {
  return axios({
    url: `/xmcxpj/sharedData/importSharedData`,
    data,
    isFormData: true,
  })
}
export const exporttableData = data => {
  return axios({
    url: `/xmcxpj/sharedData/exportSharedData`,
    data,
    isBlob: true,
  })
}
// 项目成效库管理---------------------------------------------------------------------------------------------------------------------------------------

// 下拉选项查询
export const cxdictLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/dict`,
    data,
  })
}
// 评价计划列表查询
export const cxappraisePlanListLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/appraisePlanList`,
    data,
  })
}
// 评价项目详情
export const getFeasibilityStudyFunctionLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/getFeasibilityStudyFunction`,
    data,
  })
}
// 评价计划列表查询
export const cxprojectListLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/projectList`,
    data,
  })
}
// 弹窗评价计划列表查询
export const statisticsProjectListLibrary = data => {
  return axios({
    url: `/xmcxpj/statistics/projectList`,
    data,
  })
}
// 评价项目详情
export const projectAppraiseDetailLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/projectAppraiseDetail`,
    data,
  })
}
// 项目统计结果
export const projectEfficiencySummaryLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/projectEfficiencySummary`,
    data,
  })
}
// 项目评价报告下载
// /projectEfficiencyLibrary/projectReportDownload
export const projectReportDownloadLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/projectReportDownload`,
    data,
    isBlob: true,
  })
}
export const reportBatchDownloadLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/reportBatchDownload`,
    data,
    isBlob: true,
  })
}

// 评价项目清单导出
export const projectListDownloadLibrary = data => {
  return axios({
    url: `/xmcxpj/projectEfficiencyLibrary/projectListDownload`,
    data,
    isBlob: true,
  })
}
