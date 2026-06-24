<template>
  <div class="page10-container">
    <div class="filter-bar">
      <div class="year-switch">
        <span
          :class="['switch-btn', { active: yearSwitch === 'evaluate' }]"
          @click="yearSwitch = 'evaluate'"
          >评价年份</span
        >
        <span
          :class="['switch-btn', { active: yearSwitch === 'project' }]"
          @click="yearSwitch = 'project'"
          >项目年份</span
        >
      </div>
      <div class="filter-item">
        <el-select
          v-model="filters.year"
          :placeholder="yearSwitch === 'evaluate' ? '评价年份' : '项目年份'"
          class="filter-select"
        >
          <el-option label="2024" value="2024"></el-option>
          <el-option label="2025" value="2025"></el-option>
          <el-option label="2026" value="2026"></el-option>
          <el-option label="全部" value="all"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          v-model="filters.batch"
          placeholder="评价批次"
          class="filter-select"
        >
          <el-option label="批次一" value="1"></el-option>
          <el-option label="批次二" value="2"></el-option>
          <el-option label="批次三" value="3"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          v-model="filters.unit"
          placeholder="需求填报单位"
          class="filter-select"
        >
          <el-option label="单位A" value="A"></el-option>
          <el-option label="单位B" value="B"></el-option>
          <el-option label="单位C" value="C"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-select
          v-model="filters.type"
          placeholder="项目类型"
          class="filter-select"
        >
          <el-option label="类型一" value="1"></el-option>
          <el-option label="类型二" value="2"></el-option>
          <el-option label="类型三" value="3"></el-option>
        </el-select>
      </div>
      <div class="filter-actions">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <div class="stats-card">
      <div class="stat-item left-bar">
        <div class="stat-left-bar green-bar"></div>
        <div class="stat-content">
          <div class="stat-label">年度评价项目数</div>
          <div class="stat-value green">
            {{ statsData.totalProjects }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-top-bar cyan-bar"></div>
        <div class="stat-content">
          <div class="stat-label">成效明显</div>
          <div class="stat-value cyan">
            {{ statsData.excellent }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-top-bar blue-bar"></div>
        <div class="stat-content">
          <div class="stat-label">成效良好</div>
          <div class="stat-value blue">
            {{ statsData.good }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-top-bar orange-bar"></div>
        <div class="stat-content">
          <div class="stat-label">成效一般</div>
          <div class="stat-value orange">
            {{ statsData.normal }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-top-bar gray-bar"></div>
        <div class="stat-content">
          <div class="stat-label">成效不明</div>
          <div class="stat-value gray">
            {{ statsData.unknown }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-top-bar red-bar"></div>
        <div class="stat-content">
          <div class="stat-label">成效不佳</div>
          <div class="stat-value red">
            {{ statsData.bad }}<span class="stat-unit">个</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="left-panel">
        <div class="panel-card risk-analysis">
          <div class="panel-header">
            <div class="header-left">
              <el-icon class="header-icon" style="color: #409eff">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </el-icon>
              <div>
                <span class="panel-title">项目人员风险分析</span>
                <span class="panel-desc"
                  >按项目关联人员成效不佳+成效不明的项目总数从高到低排名</span
                >
              </div>
            </div>
            <div class="header-legend">
              <span class="legend-item">
                <span class="legend-color unknown"></span>
                <span class="legend-text">成效不明</span>
              </span>
              <span class="legend-item">
                <span class="legend-color bad"></span>
                <span class="legend-text">成效不佳</span>
              </span>
            </div>
          </div>
          <div class="risk-content">
            <div class="risk-column">
              <div class="column-title">项目负责人</div>
              <div class="risk-scroll">
                <div
                  v-for="(item, index) in personRiskData"
                  :key="index"
                  class="risk-item"
                >
                  <div style="display: flex">
                    <span class="risk-name">{{ item.name }}</span>
                    <div class="risk-bar" :style="{ width: getBarWidth(item) }">
                      <div
                        v-if="item.unknown > 0"
                        class="bar-segment unknown"
                        :style="{ width: getUnknownWidth(item) }"
                      >
                        <span class="bar-text">{{ item.unknown }}</span>
                      </div>
                      <div
                        v-if="item.bad > 0"
                        class="bar-segment bad"
                        :style="{ width: getBadWidth(item) }"
                      >
                        <span class="bar-text">{{ item.bad }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="risk-count">{{ item.total }}项</span>
                </div>
              </div>
            </div>
            <div class="risk-column">
              <div class="column-title">需求填报人</div>
              <div class="risk-scroll">
                <div
                  v-for="(item, index) in reporterRiskData"
                  :key="index"
                  class="risk-item"
                >
                  <div style="display: flex">
                    <span class="risk-name">{{ item.name }}</span>
                    <div class="risk-bar" :style="{ width: getBarWidth(item) }">
                      <div
                        v-if="item.unknown > 0"
                        class="bar-segment unknown"
                        :style="{ width: getUnknownWidth(item) }"
                      >
                        <span class="bar-text">{{ item.unknown }}</span>
                      </div>
                      <div
                        v-if="item.bad > 0"
                        class="bar-segment bad"
                        :style="{ width: getBadWidth(item) }"
                      >
                        <span class="bar-text">{{ item.bad }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="risk-count">{{ item.total }}项</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card cause-focus">
          <div class="panel-header">
            <div class="header-left">
              <el-icon class="header-icon" style="color: #409eff">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </el-icon>
              <div>
                <span class="panel-title">原因聚焦</span>
                <span class="panel-desc"
                  >聚焦高频评价原因，辅助识别项目问题与亮点</span
                >
              </div>
            </div>
          </div>
          <div class="cause-content">
            <div class="cause-card success">
              <div class="cause-icon-wrap success">
                <el-icon class="cause-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                    />
                  </svg>
                </el-icon>
              </div>
              <div class="cause-header">
                <span class="cause-title">成效明显</span>
                <span class="title-divider"></span>
              </div>
              <div class="cause-reasons">
                <span
                  v-for="(item, index) in causeData.success"
                  :key="index"
                  class="reason-item"
                >
                  <span class="reason-dot"></span>
                  <span class="reason-text">{{ item.reason }}</span>
                  <span class="reason-count">{{ item.count }}</span>
                </span>
              </div>
            </div>
            <div class="cause-card warning">
              <div class="cause-icon-wrap warning">
                <el-icon class="cause-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    />
                  </svg>
                </el-icon>
              </div>
              <div class="cause-header">
                <span class="cause-title">成效不明</span>
                <span class="title-divider"></span>
              </div>
              <div class="cause-reasons">
                <span
                  v-for="(item, index) in causeData.warning"
                  :key="index"
                  class="reason-item"
                >
                  <span class="reason-dot"></span>
                  <span class="reason-text">{{ item.reason }}</span>
                  <span class="reason-count">{{ item.count }}</span>
                </span>
              </div>
            </div>
            <div class="cause-card danger">
              <div class="cause-icon-wrap danger">
                <el-icon class="cause-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6-6.59L22 12V6h-6z"
                    />
                  </svg>
                </el-icon>
              </div>
              <div class="cause-header">
                <span class="cause-title">成效不佳</span>
                <span class="title-divider"></span>
              </div>
              <div class="cause-reasons">
                <span
                  v-for="(item, index) in causeData.danger"
                  :key="index"
                  class="reason-item"
                >
                  <span class="reason-dot"></span>
                  <span class="reason-text">{{ item.reason }}</span>
                  <span class="reason-count">{{ item.count }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="panel-card ranking-table">
          <div class="tables-container">
            <div class="table-section">
              <div class="table-header">
                <div class="header-left">
                  <el-icon class="header-icon" style="color: #409eff">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                      />
                    </svg>
                  </el-icon>
                  <div>
                    <span class="panel-title">建设单位排名</span>
                    <span class="panel-subtitle"
                      ><span class="stat-label">统计维度:</span> 评价年份
                      <span class="stat-gap"></span>
                      <span class="stat-label">统计范围:</span> 2024, 2025,
                      2026年</span
                    >
                  </div>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  :data="constructionData"
                  border
                  :show-header="true"
                  class="rank-table"
                  :max-height="tableHeight"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="rank"
                    label="序号"
                    width="60"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="rank-number">{{ scope.row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit"
                    label="建设单位"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="count"
                    label="评价项目总数"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="amount"
                    label="投资金额(万元)"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="avgScore"
                    label="平均分"
                    width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="score-cell">
                        <span class="score-value">{{
                          scope.row.avgScore
                        }}</span>
                        <div class="score-bar-wrapper">
                          <div
                            class="score-bar"
                            :style="{ width: scope.row.avgScore + '%' }"
                          ></div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="excellent"
                    label="成效明显"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #67c23a">{{
                        scope.row.excellent
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="good"
                    label="成效良好"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #409eff">{{
                        scope.row.good
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="normal"
                    label="成效一般"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #e6a23c">{{
                        scope.row.normal
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="unknown"
                    label="成效不明"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #606266">{{
                        scope.row.unknown
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="bad"
                    label="成效不佳"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #f56c6c">{{
                        scope.row.bad
                      }}</span></template
                    >
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="table-section">
              <div class="table-header">
                <div class="header-left">
                  <el-icon class="header-icon" style="color: #409eff">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                      />
                    </svg>
                  </el-icon>
                  <div>
                    <span class="panel-title">专业排名</span>
                    <span class="panel-subtitle"
                      ><span class="stat-label">统计维度:</span> 评价年份
                      <span class="stat-gap"></span>
                      <span class="stat-label">统计范围:</span> 2024, 2025,
                      2026年</span
                    >
                  </div>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  :data="majorData"
                  border
                  :show-header="true"
                  class="rank-table"
                  :max-height="tableHeight"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="rank"
                    label="序号"
                    width="60"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="rank-number">{{ scope.row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="major"
                    label="专业"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="count"
                    label="评价项目总数"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="amount"
                    label="投资金额(万元)"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="avgScore"
                    label="平均分"
                    width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="score-cell">
                        <span class="score-value">{{
                          scope.row.avgScore
                        }}</span>
                        <div class="score-bar-wrapper">
                          <div
                            class="score-bar"
                            :style="{ width: scope.row.avgScore + '%' }"
                          ></div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="excellent"
                    label="成效明显"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #67c23a">{{
                        scope.row.excellent
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="good"
                    label="成效良好"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #409eff">{{
                        scope.row.good
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="normal"
                    label="成效一般"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #e6a23c">{{
                        scope.row.normal
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="unknown"
                    label="成效不明"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #606266">{{
                        scope.row.unknown
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="bad"
                    label="成效不佳"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #f56c6c">{{
                        scope.row.bad
                      }}</span></template
                    >
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="table-section">
              <div class="table-header">
                <div class="header-left">
                  <el-icon class="header-icon" style="color: #409eff">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                      />
                    </svg>
                  </el-icon>
                  <div>
                    <span class="panel-title">系统排名</span>
                    <span class="panel-subtitle"
                      ><span class="stat-label">统计维度:</span> 评价年份
                      <span class="stat-gap"></span>
                      <span class="stat-label">统计范围:</span> 2024, 2025,
                      2026年</span
                    >
                  </div>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  :data="systemData"
                  border
                  :show-header="true"
                  class="rank-table"
                  :max-height="tableHeight"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="rank"
                    label="序号"
                    width="60"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span class="rank-number">{{ scope.row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="system"
                    label="系统"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="count"
                    label="评价项目总数"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="amount"
                    label="投资金额(万元)"
                    width="130"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    sortable
                    prop="avgScore"
                    label="平均分"
                    width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="score-cell">
                        <span class="score-value">{{
                          scope.row.avgScore
                        }}</span>
                        <div class="score-bar-wrapper">
                          <div
                            class="score-bar"
                            :style="{ width: scope.row.avgScore + '%' }"
                          ></div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="excellent"
                    label="成效明显"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #67c23a">{{
                        scope.row.excellent
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="good"
                    label="成效良好"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #409eff">{{
                        scope.row.good
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="normal"
                    label="成效一般"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #e6a23c">{{
                        scope.row.normal
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="unknown"
                    label="成效不明"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #606266">{{
                        scope.row.unknown
                      }}</span></template
                    >
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="bad"
                    label="成效不佳"
                    width="90"
                    align="center"
                  >
                    <template slot-scope="scope"
                      ><span style="color: #f56c6c">{{
                        scope.row.bad
                      }}</span></template
                    >
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPage10Data } from "@/api/page10";

export default {
  name: "Page10",
  data() {
    return {
      filters: {
        year: "all",
        batch: "",
        unit: "",
        type: "",
      },
      yearSwitch: "evaluate",
      riskTab: "person",
      tableHeight: 500,
      activeTable: "construction",
      loading: false,
      personRiskData: [],
      reporterRiskData: [],
      constructionData: [],
      majorData: [],
      systemData: [],
      statsData: {
        totalProjects: 0,
        excellent: 0,
        good: 0,
        normal: 0,
        unknown: 0,
        bad: 0,
      },
      causeData: {
        success: [],
        warning: [],
        danger: [],
      },
    };
  },
  computed: {
    tableConfigs() {
      return [
        {
          title: "建设单位排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.constructionData,
          nameProp: "unit",
          nameLabel: "建设单位",
        },
        {
          title: "专业排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.majorData,
          nameProp: "major",
          nameLabel: "专业",
        },
        {
          title: "系统排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.systemData,
          nameProp: "system",
          nameLabel: "系统",
        },
      ];
    },
    currentTable() {
      const tables = {
        construction: {
          title: "建设单位排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.constructionData,
          nameProp: "unit",
          nameLabel: "建设单位",
        },
        major: {
          title: "专业排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.majorData,
          nameProp: "major",
          nameLabel: "专业",
        },
        system: {
          title: "系统排名",
          subtitle: "统计维度: 评价年份 统计范围: 2024, 2025, 2026年",
          data: this.systemData,
          nameProp: "system",
          nameLabel: "系统",
        },
      };
      return tables[this.activeTable] || tables.construction;
    },
  },
  mounted() {
    this.calculateTableHeight();
    window.addEventListener("resize", this.calculateTableHeight);
    this.fetchData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateTableHeight);
  },
  methods: {
    calculateTableHeight() {
      const windowHeight = window.innerHeight;
      const filterBarHeight = 64;
      const statsCardHeight = 90;
      const gaps = 36;

      const availableHeight =
        windowHeight - filterBarHeight - statsCardHeight - gaps;
      const rightPanelHeight = availableHeight;

      this.leftPanelHeight = rightPanelHeight;
      this.tableHeight = (rightPanelHeight - 120) / 3;
    },
    async fetchData() {
      this.loading = true;
      try {
        const response = await fetchPage10Data(this.filters);
        if (response.code === 200) {
          const data = response.data;
          this.personRiskData = data.personRiskData;
          this.reporterRiskData = data.reporterRiskData;
          this.constructionData = data.constructionData;
          this.majorData = data.majorData;
          this.systemData = data.systemData;
          this.statsData = data.statsData;
          this.causeData = data.causeData;
        }
      } catch (error) {
        this.$message.error("数据获取失败");
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          this.refreshTableLayout();
        });
      }
    },
    refreshTableLayout() {
      const tables = document.querySelectorAll(".rank-table");
      tables.forEach((table) => {
        const elTable = table.querySelector(".el-table");
        if (elTable) {
          const width = elTable.parentNode.offsetWidth;
          elTable.style.width = width + "px";
          elTable.style.minWidth = width + "px";
          const inner = elTable.querySelector(".el-table__inner");
          if (inner) {
            inner.style.width = "100%";
          }
        }
      });
    },
    handleQuery() {
      this.fetchData();
    },
    handleReset() {
      this.filters = {
        year: "all",
        batch: "",
        unit: "",
        type: "",
      };
    },
    getScoreColor(score) {
      if (score >= 90) return "#67c23a";
      if (score >= 80) return "#409eff";
      if (score >= 70) return "#e6a23c";
      return "#f56c6c";
    },
    getUnknownWidth(item) {
      if (!item || item.unknown === undefined || item.bad === undefined) {
        return "0%";
      }
      if (item.unknown === 0 && item.bad === 0) {
        return "0%";
      }
      if (item.unknown === 0) {
        return "0%";
      }
      if (item.bad === 0) {
        return "100%";
      }
      const total = item.unknown + item.bad;
      const width = Math.round((item.unknown / total) * 70);
      return `${Math.max(width, 0)}%`;
    },
    getBadWidth(item) {
      if (!item || item.unknown === undefined || item.bad === undefined) {
        return "0%";
      }
      if (item.unknown === 0 && item.bad === 0) {
        return "0%";
      }
      if (item.bad === 0) {
        return "0%";
      }
      if (item.unknown === 0) {
        return "100%";
      }
      const total = item.unknown + item.bad;
      const width = Math.round((item.bad / total) * 70);
      return `${Math.max(width, 0)}%`;
    },
    getBarWidth(item) {
      if (!item || item.total === undefined || item.total === null) {
        return "0px";
      }
      const maxTotal = 10;
      const baseWidth = 100;
      const ratio = Math.min(Math.max(item.total / maxTotal, 0), 1);
      const width = Math.round(ratio * baseWidth);
      return `${Math.max(width, 40)}px`;
    },
  },
};
</script>

<style scoped>
.page10-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  padding: 12px;
  background-color: #f5f7fa;
  overflow: hidden;
  box-sizing: border-box;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.year-switch {
  display: flex;
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 2px;
}

.switch-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.switch-btn.active {
  background-color: #409eff;
  color: #fff;
}

.filter-item {
  flex: 1;
  min-width: 120px;
}

.filter-select {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.stats-card {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.stat-item {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.stat-item.left-bar {
  flex-direction: row;
}

.stat-top-bar {
  height: 6px;
  border-radius: 8px 8px 0 0;
}

.stat-left-bar {
  width: 6px;
  border-radius: 8px 0 0 8px;
}

.green-bar {
  background-color: #67c23a;
}

.cyan-bar {
  background-color: #409eff;
}

.blue-bar {
  background-color: #409eff;
}

.orange-bar {
  background-color: #e6a23c;
}

.gray-bar {
  background-color: #909399;
}

.red-bar {
  background-color: #f56c6c;
}

.stat-content {
  padding: 12px 14px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  margin-bottom: 0;
  font-weight: bold;
}

.stat-gap {
  margin: 0 8px;
}

.rank-number {
  font-size: 12px;
  font-weight: bold;
  color: #2c8295;
  background-color: #f2f8f8;
  padding: 2px 8px;
  border-radius: 10px;
}

.stat-value {
  margin-left: 8px;
}

.stat-unit {
  color: #909399;
  margin-left: 8px;
  font-weight: normal;
  font-size: 12px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.stat-value.green {
  color: #67c23a;
}

.stat-value.cyan {
  color: #409eff;
}

.stat-value.blue {
  color: #409eff;
}

.stat-value.orange {
  color: #e6a23c;
}

.stat-value.gray {
  color: #909399;
}

.stat-value.red {
  color: #f56c6c;
}

.main-content {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 0;
}

.left-panel {
  width: 33%;
  min-width: 476px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
}

.panel-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.risk-analysis {
  flex: 1;
  min-height: 0;
  min-width: 476px;
}

.cause-focus {
  flex: 1;
  min-height: 0;
}

.ranking-table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

.panel-subtitle {
  font-size: 11px;
  color: #999;
}

.header-tabs {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.tab {
  font-size: 11px;
  color: #999;
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.tab.active {
  color: #409eff;
  background-color: #ecf5ff;
}

.header-badges {
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.badge-warning {
  background-color: #fef7e8;
  color: #e6a23c;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 18px;
  height: 18px;
}

.panel-desc {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.header-legend {
  display: flex;
  gap: 16px;
  margin-left: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.unknown {
  background-color: #606266;
}

.legend-color.bad {
  background-color: #e6a23c;
}

.legend-text {
  font-size: 11px;
  color: #666;
}

.risk-content {
  padding: 12px;
  flex: 1;
  overflow: hidden;
  display: flex;
  gap: 12px;
  min-width: 0;
}

.risk-column {
  flex: 1;
  min-width: 0;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  margin-bottom: 10px;
}

.risk-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
}

.column-title {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.risk-bar {
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 20px;
  transition: width 0.3s;
}

.bar-segment.unknown {
  background-color: #606266;
}

.bar-segment.bad {
  background-color: #e6a23c;
}

.bar-text {
  color: #fff;
  font-size: 11px;
  font-weight: bold;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.risk-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  justify-content: space-between;
}

.risk-name {
  width: 52px;
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
}

.risk-progress {
  flex: 1;
}

.risk-count {
  width: 35px;
  font-size: 11px;
  color: #999;
  text-align: right;
}

.cause-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.cause-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid;
}

.cause-card.success {
  background-color: #f0f9eb;
  border-color: #d9f7be;
}

.cause-card.warning {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
}

.cause-card.danger {
  background-color: #fef7f0;
  border-color: #fde9d9;
}

.cause-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cause-icon-wrap.success {
  background-color: #67c23a;
}

.cause-icon-wrap.warning {
  background-color: #606266;
}

.cause-icon-wrap.danger {
  background-color: #e6a23c;
}

.cause-icon {
  width: 18px;
  height: 18px;
  color: #fff;
}

.cause-header {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.cause-title {
  font-size: 13px;
  font-weight: bold;
  flex-shrink: 0;
  min-width: 70px;
}

.title-divider {
  width: 2px;
  height: 30px;
}

.cause-card.success .title-divider {
  background-color: rgba(103, 194, 58, 0.3);
}

.cause-card.warning .title-divider {
  background-color: rgba(96, 98, 102, 0.3);
}

.cause-card.danger .title-divider {
  background-color: rgba(230, 162, 60, 0.3);
}

.cause-card.success .cause-title {
  color: #67c23a;
}

.cause-card.warning .cause-title {
  color: #606266;
}

.cause-card.danger .cause-title {
  color: #e6a23c;
}

.cause-reasons {
  display: flex;
  gap: 16px;
  flex: 1;
  flex-wrap: wrap;
}

.reason-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reason-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.cause-card.success .reason-dot {
  background-color: #67c23a;
}

.cause-card.warning .reason-dot {
  background-color: #606266;
}

.cause-card.danger .reason-dot {
  background-color: #e6a23c;
}

.reason-text {
  font-size: 12px;
  color: #666;
}

.reason-count {
  font-size: 12px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.cause-card.success .reason-count {
  background-color: #d9f7be;
  color: #67c23a;
}

.cause-card.warning .reason-count {
  background-color: #e4e7ed;
  color: #606266;
}

.cause-card.danger .reason-count {
  background-color: #fde9d9;
  color: #e6a23c;
}

.cause-item {
  padding: 8px 10px;
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cause-item.success {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.cause-item.warning {
  background-color: #f5f7fa;
  border-left: 3px solid #909399;
}

.cause-item.danger {
  background-color: #fef0f0;
  border-left: 3px solid #f56c6c;
}

.cause-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.cause-icon {
  width: 14px;
  height: 14px;
}

.cause-title {
  font-size: 12px;
  font-weight: bold;
}

.cause-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.table-wrapper {
  flex: 1;
  padding: 0 12px 12px;
  overflow: hidden;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
}

.rank-table {
  font-size: 11px;
  width: 100%;
  table-layout: fixed;
}

.tables-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.table-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  min-height: 0;
}

.table-section:last-child {
  border-bottom: none;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.sortable-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sortable-header::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #c0c4cc;
  margin-top: 2px;
}

.rank-table :deep(.el-table__header th) {
  background-color: #f5f7fa;
  font-weight: bold;
  padding: 8px 4px;
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-table :deep(.el-table__header-wrapper),
.rank-table :deep(.el-table__body-wrapper) {
  width: 100%;
  overflow-x: hidden;
}

.rank-table :deep(.el-table__header),
.rank-table :deep(.el-table__body) {
  width: 100%;
}

.rank-table :deep(.el-table__row:nth-child(even)) {
  background-color: #fafafa;
}

.rank-table :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

.rank-table :deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
}

.rank-table :deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.rank-table :deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

.rank-table :deep(.el-table__header) {
  display: table-header-group;
}

.rank-table :deep(.el-table__footer-wrapper) {
  display: none;
}
.rank-table :deep(.el-table__header th) {
  padding: 0;
}
.el-table :deep(.el-table__cell) {
  padding: 0;
}
/* 隐藏表头的. gutter 占位符 */
:deep(.el-table th.gutter) {
  display: none;
  width: 0;
}

/* 隐藏内容区的对应列 */
:deep(.el-table colgroup col[name="gutter"]) {
  display: none;
  width: 0;
}

/* 可选：让内容区宽度自适应，避免右侧出现空白 */
:deep(.el-table__body) {
  width: 100% !important;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-value {
  font-size: 13px;
  font-weight: bold;
  color: #409eff;
}

.score-bar-wrapper {
  width: 50%;
  height: 6px;
  background-color: #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
  background-color: #409eff;
}

.rank-table :deep(.el-table) {
  width: 100%;
}

.rank-table :deep(.el-table__cell) {
  font-weight: bold;
}
</style>
