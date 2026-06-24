import { createMockFn } from '../mockFactory.js';

export const selectBatchList = createMockFn([{"batchName":"2024年第一批次","batchCode":"B2024001","modify":1,"professionalType":"0","declareStartDate":"2024-01-01","declareEndDate":"2024-12-31","opend":false,"checkList":[],"children":[{"projectName":"示例项目A","projectCode":"P2024001","isReject":"0","projectStatus":"1"}]}]);
export const getBatchListForProject = createMockFn([{"batchName":"2024年第一批次","batchCode":"B2024001","modify":1,"professionalType":"0","declareStartDate":"2024-01-01","declareEndDate":"2024-12-31","opend":false,"checkList":[],"children":[{"projectName":"示例项目A","projectCode":"P2024001","isReject":"0","projectStatus":"1"}]}]);
export const queryMeetingInfoByProjectCode = createMockFn([]);
export const reqRecallCloseProject = createMockFn([]);
export const getBatchListForProjectData = createMockFn([]);
export const getProjectListData = createMockFn([]);
export const getProjectList = createMockFn([{"batchName":"2024年第一批次","batchCode":"B2024001","modify":1,"professionalType":"0","declareStartDate":"2024-01-01","declareEndDate":"2024-12-31","opend":false,"checkList":[],"children":[{"projectName":"示例项目A","projectCode":"P2024001","isReject":"0","projectStatus":"1"}]}]);
export const importInProject = createMockFn([]);
export const submitProject = createMockFn([]);
export const getRelationalProjectList = createMockFn([{"projectName":"示例项目A","projectCode":"P2024001","batchName":"2024年第一批次","demandCode":"XQ001","createByName":"张三","sbsj":"2024-06-01"}]);
export const saveRelationalProject = createMockFn([]);
export const deleteRelationalProject = createMockFn([]);
export const exportProject = createMockFn([]);
export const batchSubmitPreAudit = createMockFn([]);
