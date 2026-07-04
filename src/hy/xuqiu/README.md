# xuqiu 需求开发目录

本目录用于承接新需求页面开发，**优先复用** `src/hy/demo` 下的组件与公共能力，尽量不改动 demo 内部代码。

## 新页面开发规范（2026-06-04 起）

以下约定自 **2026-06-04** 起生效，**后续新增的需求页面默认遵守**。  
**今天之前已开发完成的页面不做追溯修改**；仅在改版或新增同类能力时按新规范实现。

| # | 规范 | 说明 |
|---|------|------|
| 1 | **不提供「高级查询」** | 查询区仅保留 `hyProjectForm` 的「查询 / 重置」，不增加「高级查询 →」入口及对应方法。 |
| 2 | **查询区样式全局引入** | `xuqiuSearch.less` 已在 `src/main.js` 全局引入，新页面**不要**在组件内写 `@import '../xuqiuSearch.less'`。查询区容器统一使用 `hy-new-search-box`。 |
| 3 | **表单字段工具统一路径** | `config.js` 中引用表单字段工具：`import { createInputField, createSelectField } from '@/utils/formField.js'`。文件位置：`src/utils/formField.js`，勿再使用 `../utils/formField.js` 等相对路径。 |
| 4 | **列表工具栏容器** | 列表上方操作按钮区使用 `total-content_table-content-message`，**不用** `toolbar-wrap`。示例：

```vue
<div class="total-content_table-content-message">
  <hyNewButtons
    :buttonsData="toolbarButtonsConfig"
    @selectButtons="selectButtons"
    style="padding: 10px"
  />
</div>
```

`.total-content_table-content-message` 样式已定义在 `xuqiuSearch.less` 中（与 demo 列表页工具栏风格一致）。

---

## 目录约定

```
xuqiu/
├── README.md           # 本说明
├── xxxPage/            # 单个需求模块
│   ├── xxxPage.vue     # 入口组件（含子页面切换）
│   ├── config.js       # 静态配置（搜索、表格、按钮等，全模块共用一份）
│   ├── mockData.js     # 模拟数据与筛选/分页逻辑（接口未接入时）
│   └── ...             # 子页面组件、弹窗等
└── ...
```

**配置约定**：同一需求模块内只保留一个 `config.js` 存放静态常量；若有额外事件或业务逻辑，可单独增加 `mockData.js` 等文件，不再拆分多个 config 文件。

**操作区约定**：
- **需求储备库**（表格行内 `el-button type="text"`）：详情 / 标签维护 / 导出
- **需求报表管理**（工具栏 `hyNewButtons`）：报表统计 / 导出 / 刷新统计；表格行内可保留「报表统计」快捷入口
- 两个模块的操作按钮职责不同，勿混用

## 组件引用

- 公共业务组件：`../demo/common/...`（如 `projectEdit`、`materialUpload`、`checkOpinions`）
- 全局 UI 组件：已在 `main.js` 中通过 `registerComponents.js` 注册，模板中直接使用（如 `hyProjectForm`、`newTable`、`hyNewModal`、`colorTitle`、`xuqiuPageHeader`）
- 子页面标题栏：统一使用 `xuqiuPageHeader`（内部基于 `colorTitle`），副标题传 `sub-title`，返回按钮通过 flex 布局置于右侧
- 工具方法：`this.m_copy()`（深拷贝）、`this.m_apiFn()`（接口调用，见下方）
- 查询区 / 工具栏样式：`xuqiuSearch.less`（`main.js` 全局引入，见上方「新页面开发规范」）
- 表单字段配置：`@/utils/formField.js` 中的 `createInputField`、`createSelectField`
- 接口：`@/api/...`（未接入真实接口时使用 mock，见 `src/api/mockFactory.js`）

### 接口调用（m_apiFn）

接口未通时，`@/api` 下函数由 `createMockFn` 生成，可直接配合全局 `m_apiFn` 使用：

```javascript
import { queryProjectManageList } from '@/api/szhApi/szhProjectManagement';

// 写法 1
const res = await this.m_apiFn(queryProjectManageList)(params);

// 写法 2
const res = await this.m_apiFn(queryProjectManageList, params);
```

`m_apiFn` 会自动解包 axios 风格的 `res.data`；mock 函数返回的数据则原样 resolve。

## 路由与页面切换

- **菜单级入口**：每个成效需求只注册 **一条路由**（如 `/demo/xuqiu/demandCoordination`）。
- **需求内跳转**：同一需求下的子页面（列表、详情、处理页等）**不使用路由**，在入口组件内通过 `v-if` / `v-else-if` 切换子组件显示。
- **子组件约定**：通过 `props` 接收上下文参数，通过 `@back` / `@saved` 等事件通知父组件返回或刷新。

```vue
<!-- 入口组件示例 -->
<coordination-manage
  v-if="activeView === 'manage'"
  :batch-code="pageContext.batchCode"
  @back="handleBack"
/>
```

## 路由注册

新页面路由与菜单统一在 `src/router/index.js` 的「成效页面」分组下追加，路径建议：

```
/demo/xuqiu/<pageName>
```

## 修改 demo 的约束

| 情况 | 处理方式 |
|------|----------|
| 仅新页面逻辑 | 只在 `xuqiu/` 内开发，**不改动** demo |
| 必须改 demo（缺组件、缺全局注册、路径别名等） | **先询问** 或在本文档「demo 变更记录」中说明原因与改动点 |

### demo 变更记录

| 日期 | 文件 | 原因 | 改动摘要 |
|------|------|------|----------|
| 2026-06-04 | `src/main.js` | xuqiu 查询区样式统一全局加载 | 全局引入 `xuqiuSearch.less` |
| 2026-06-04 | `src/utils/formField.js` | 表单字段工具跨模块复用 | 自 `xuqiu/utils` 迁至 `src/utils`，统一 `@/utils/formField.js` 引用 |
| 2026-06-04 | `src/main.js`、`src/utils/mApiFn.js` | demo/xuqiu 需统一接口调用方式 | 全局注册 `m_apiFn` mock 封装 |
| 2026-06-10 | `src/hy/demo/registerComponents.js` | xuqiu 子页面标题栏复用 demo 风格 | 全局注册 `colorTitle`、`xuqiuPageHeader` |

## 已开发模块

### 需求统筹（demandCoordination）

- 入口路由：`/demo/xuqiu/demandCoordination`
- 子页面：`coordinationManage.vue`、`coordinationOverview.vue` 作为组件内嵌切换；「统筹信息」为弹窗

### 需求收口（demandClosing）

- 入口路由：`/demo/xuqiu/demandClosing`
- 子页面：`closingProcess.vue`、`hqCoordinationList.vue` 作为组件内嵌切换
- 弹窗：上传收口材料

### 需求储备库（demandReservePool）

- 入口路由：`/demo/xuqiu/demandReservePool`
- 弹窗：需求详情、标签维护

### 需求报表管理（demandReportManagement）

- 入口路由：`/demo/xuqiu/demandReportManagement`
- 子页面：`reportStatistics.vue` 报表统计（组件内嵌切换）

### 需求初审（demandPreliminaryReview）

- 入口路由：`/demo/xuqiu/demandPreliminaryReview`
- 子页面：`preliminaryReviewList.vue` 初审列表、`preliminaryReviewProcess.vue` 初审审核、`blueprintManage.vue` 蓝图及标准功能基线库（组件内嵌切换）
- 弹窗：审查报告查看、选择一级/二级功能（`selectBaselineFunctionModal.vue`）
- 表格行内：蓝图 / 初审 / 详情 / 查看报告

### 预储备库（demandPreReservePool）

- 入口路由：`/demo/xuqiu/demandPreReservePool`
- 子页面：`preReserveDetail.vue` 详情、`preReserveEdit.vue` 编辑（组件内嵌切换）
- 弹窗：分配批次、上传盖章版汇总需求表
- 工具栏：分配批次 / 上传盖章版汇总需求表 / 导出盖章版汇总需求表 / 删除需求
- 表格行内：详情 / 编辑

### 需求申报（demandDeclaration）

- 入口路由：`/demo/xuqiu/demandDeclaration`
- 主页面：上下双表格 + 可拖拽绿色分隔条，各自独立分页
- 子页面：`declarationEdit.vue` 新增/编辑需求（含需求信息、附件、蓝图 Tab）
- 弹窗：选择预储备库需求
- 工具栏：新增 / 选择预储备库需求 / 删除 / 查重 / 历史关联性审查 / 全部提交 / 导出
- 表格行内：编辑 / 提交

### 评审汇总（reviewSummary）

- 入口路由：`/demo/xuqiu/reviewSummary`
- 主页面：上下分栏，上区选会议、下区展示会议关联需求；可拖拽分隔条
- 子页面：`reviewRecordList.vue` 评审记录（组件内嵌切换）
- 弹窗：意见汇总、专家查看（复用 `demandReviewMeeting`）
- 工具栏：评审记录 / 批量提交 / 材料导出 / 导出
- 表格行内：意见汇总 / 提交

### 需求标签库（demandTagLibrary）

- 入口路由：`/demo/xuqiu/demandTagLibrary`
- 主页面：树形表格展示标签类别与标签明细
- 弹窗：`tagEditModal.vue` 新增/编辑标签
- 工具栏：新增
- 表格行内：编辑 / 删除 / 启用 / 停用（标签行）；关联需求总数可点击查看

### 需求模板管理（demandTemplateManagement）

- 入口路由：`/demo/xuqiu/demandTemplateManagement`
- 主页面：申报模板列表（查询：申报模板名称、项目类型、投资渠道）
- 子页面：`templateEdit.vue` 模板新建/编辑/详情（左右分栏：字段配置 + 字段预览）
- 弹窗：`selectTemplateModal.vue` 选择模板（载入字段配置）
- 工具栏：新建
- 表格行内：详情 / 删除（无关联批次时可删）；关联批次列支持展开/收起

## 参考页面

开发时可对照 demo 中已有页面的结构与风格：

- `demo/szhProjectManagement/` — 搜索 + 按钮 + 表格列表
- `demo/csProjectInternalAudit/` — 批次折叠 + 嵌套项目 + 多弹窗
