<template>
  <section class="blueprint-manage-page">
    <xuqiu-page-header
      title="蓝图及标准功能基线库信息"
      :sub-title="
        `${demandDetail.demandCode || ''} ${
          demandDetail.demandName || ''
        }`.trim() || '—'
      "
      @back="goBack"
    />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="需求信息" name="info">
        <div class="section-title">基础信息</div>
        <div class="info-section">
          <div class="info-row">
            <span class="label">申报编号：</span
            ><span>{{ demandDetail.demandCode || "—" }}</span>
          </div>
          <div class="info-row">
            <span class="label">需求名称：</span
            ><span>{{ demandDetail.demandName || "—" }}</span>
          </div>
          <div class="info-row">
            <span class="label">申报批次：</span
            ><span>{{ demandDetail.batchName || "—" }}</span>
          </div>
          <div class="info-row">
            <span class="label">项目类型：</span
            ><span>{{ demandDetail.projectType || "—" }}</span>
          </div>
          <div class="info-row">
            <span class="label">需求提出单位：</span
            ><span>{{ demandDetail.demandUnit || "—" }}</span>
          </div>
          <div class="info-row">
            <span class="label">计划总投资：</span
            ><span>{{
              demandDetail.totalInvestment
                ? `${demandDetail.totalInvestment} 万元`
                : "—"
            }}</span>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="附件" name="attachment">
        <el-table :data="demandDetail.materials || []" border size="small">
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="name" label="文件名" min-width="220" />
          <el-table-column
            prop="status"
            label="上传状态"
            width="120"
            align="center"
          />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="蓝图及标准功能基线库信息" name="blueprint">
        <div class="section-title">业务蓝图信息</div>
        <div class="blueprint-info-row">
          <span class="label">业务蓝图：</span>
          <el-input
            v-model="blueprintData.blueprintName"
            placeholder="请输入业务蓝图"
            style="width: 360px"
          />
          <el-button type="text" @click="previewBlueprint">预览</el-button>
        </div>

        <div class="baseline-header">
          <div class="section-title baseline-title">标准功能基线库</div>
          <div class="baseline-toolbar">
            <el-button size="small" @click="expandAll">全部展开</el-button>
            <el-button size="small" @click="collapseAll">全部收起</el-button>
            <el-button type="primary" size="small" @click="openAddLevel1"
              >添加一级功能</el-button
            >
          </div>
        </div>

        <div v-if="!blueprintData.systems.length" class="empty-block">
          暂无标准功能基线数据，请点击「添加一级功能」
        </div>

        <div
          v-for="system in blueprintData.systems"
          :key="system.id"
          class="nest-card system-card"
          :class="{ 'is-collapsed': !system.expanded }"
        >
          <div class="nest-header">
            <span class="expand-trigger" @click="toggleExpand(system)">
              <i
                :class="
                  system.expanded
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
              />
            </span>
            <div class="nest-header-main">
              <span class="nest-label">系统名称</span>
              <el-select
                v-model="system.systemId"
                placeholder="请选择系统"
                size="small"
                style="width: 360px"
                @change="(val) => handleSystemChange(system, val)"
              >
                <el-option
                  v-for="item in systemOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>
            <div class="nest-header-actions">
              <el-button
                type="text"
                class="danger-text"
                @click="removeSystem(system.id)"
                >删除系统</el-button
              >
            </div>
          </div>

          <div v-show="system.expanded" class="nest-body">
            <div
              v-for="subsystem in system.subsystems"
              :key="subsystem.id"
              class="nest-card subsystem-card"
              :class="{ 'is-collapsed': !subsystem.expanded }"
            >
              <div class="nest-header">
                <span class="expand-trigger" @click="toggleExpand(subsystem)">
                  <i
                    :class="
                      subsystem.expanded
                        ? 'el-icon-caret-bottom'
                        : 'el-icon-caret-right'
                    "
                  />
                </span>
                <div class="nest-header-main">
                  <span class="nest-label">子系统/微应用</span>
                  <el-select
                    v-model="subsystem.subsystemId"
                    placeholder="请选择子系统/微应用"
                    size="small"
                    style="width: 320px"
                    @change="
                      (val) => handleSubsystemChange(system, subsystem, val)
                    "
                  >
                    <el-option
                      v-for="item in getSubsystemOptions(system.systemId)"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </div>
                <div class="nest-header-actions">
                  <el-button
                    type="text"
                    class="danger-text"
                    @click="removeSubsystem(system, subsystem.id)"
                    >删除微应用</el-button
                  >
                </div>
              </div>

              <div v-show="subsystem.expanded" class="nest-body">
                <div
                  v-for="level1 in subsystem.level1Functions"
                  :key="level1.id"
                  class="nest-card level1-card"
                  :class="{ 'is-collapsed': !level1.expanded }"
                >
                  <div class="nest-header">
                    <span class="expand-trigger" @click="toggleExpand(level1)">
                      <i
                        :class="
                          level1.expanded
                            ? 'el-icon-caret-bottom'
                            : 'el-icon-caret-right'
                        "
                      />
                    </span>
                    <div class="nest-header-main">
                      <span class="nest-label">一级功能名称</span>
                      <el-input
                        v-model="level1.level1Name"
                        size="small"
                        placeholder="请输入一级功能名称"
                        style="width: 280px"
                      />
                    </div>
                    <div class="nest-header-actions">
                      <el-button type="text" @click="openAddLevel2(level1)"
                        >添加二级功能</el-button
                      >
                      <el-button
                        type="text"
                        class="danger-text"
                        @click="removeLevel1(subsystem, level1.id)"
                        >删除一级功能</el-button
                      >
                    </div>
                  </div>

                  <div
                    v-show="level1.expanded"
                    class="nest-body level2-table-wrap"
                  >
                    <el-table
                      :data="level1.level2Functions"
                      border
                      size="small"
                    >
                      <el-table-column
                        type="index"
                        label="序号"
                        width="60"
                        align="center"
                      />
                      <el-table-column
                        prop="level2Name"
                        label="二级功能"
                        min-width="140"
                      />
                      <el-table-column
                        label="二级功能描述（建设前）"
                        min-width="220"
                      >
                        <template slot-scope="scope">
                          <div class="desc-cell">
                            {{ scope.row.descBefore }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="二级功能描述（建设后）"
                        min-width="220"
                      >
                        <template slot-scope="scope">
                          <el-input
                            v-model="scope.row.descAfter"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入建设后描述"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80" align="center">
                        <template slot-scope="scope">
                          <el-button
                            type="text"
                            class="danger-text"
                            @click="removeLevel2(level1, scope.row.id)"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="footer-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveBlueprint">保存</el-button>
    </div>

    <select-baseline-function-modal
      :visible="selectModalVisible"
      :select-type="selectModalType"
      :level1-pool-id="currentLevel1PoolId"
      :exclude-pool-ids="excludePoolIds"
      @confirm="handleSelectConfirm"
      @close="selectModalVisible = false"
    />
  </section>
</template>

<script>
import selectBaselineFunctionModal from "./selectBaselineFunctionModal.vue";
import { getDemandDetail } from "./mockData.js";
import {
  systemOptions,
  getBlueprintData,
  saveBlueprintData,
  getSubsystemOptions,
  nextId,
} from "./blueprintMockData.js";

export default {
  name: "blueprintManage",

  components: {
    selectBaselineFunctionModal,
  },

  props: {
    demandId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      activeTab: "blueprint",
      demandDetail: {},
      blueprintData: {
        demandId: "",
        blueprintName: "",
        systems: [],
      },
      systemOptions,
      selectModalVisible: false,
      selectModalType: "level1",
      currentLevel1: null,
      currentLevel1PoolId: "",
      excludePoolIds: [],
    };
  },

  mounted() {
    this.initPage();
  },

  watch: {
    demandId() {
      this.initPage();
    },
  },

  methods: {
    getSubsystemOptions,

    initPage() {
      this.demandDetail = getDemandDetail(this.demandId);
      this.blueprintData = getBlueprintData(this.demandId);
      this.normalizeExpandState();
    },

    normalizeExpandState() {
      (this.blueprintData.systems || []).forEach((system) => {
        if (typeof system.expanded !== "boolean") {
          this.$set(system, "expanded", true);
        }
        (system.subsystems || []).forEach((subsystem) => {
          if (typeof subsystem.expanded !== "boolean") {
            this.$set(subsystem, "expanded", true);
          }
          (subsystem.level1Functions || []).forEach((level1) => {
            if (typeof level1.expanded !== "boolean") {
              this.$set(level1, "expanded", true);
            }
          });
        });
      });
    },

    toggleExpand(node) {
      this.$set(node, "expanded", !node.expanded);
    },

    expandAll() {
      this.blueprintData.systems.forEach((system) => {
        this.$set(system, "expanded", true);
        system.subsystems.forEach((subsystem) => {
          this.$set(subsystem, "expanded", true);
          subsystem.level1Functions.forEach((level1) => {
            this.$set(level1, "expanded", true);
          });
        });
      });
    },

    collapseAll() {
      this.blueprintData.systems.forEach((system) => {
        this.$set(system, "expanded", false);
        system.subsystems.forEach((subsystem) => {
          this.$set(subsystem, "expanded", false);
          subsystem.level1Functions.forEach((level1) => {
            this.$set(level1, "expanded", false);
          });
        });
      });
    },

    handleSystemChange(system, systemId) {
      const option = systemOptions.find((item) => item.key === systemId);
      system.systemName = option ? option.value : "";
      system.subsystems.forEach((subsystem) => {
        const subOptions = getSubsystemOptions(systemId);
        if (!subOptions.find((item) => item.key === subsystem.subsystemId)) {
          subsystem.subsystemId = subOptions[0] ? subOptions[0].key : "";
          subsystem.subsystemName = subOptions[0] ? subOptions[0].value : "";
        }
      });
    },

    handleSubsystemChange(system, subsystem, subsystemId) {
      const option = getSubsystemOptions(system.systemId).find(
        (item) => item.key === subsystemId,
      );
      subsystem.subsystemName = option ? option.value : "";
    },

    openAddLevel1() {
      this.selectModalType = "level1";
      this.currentLevel1 = null;
      this.currentLevel1PoolId = "";
      this.excludePoolIds = this.collectExistingLevel1PoolIds();
      this.selectModalVisible = true;
    },

    openAddLevel2(level1) {
      this.selectModalType = "level2";
      this.currentLevel1 = level1;
      this.currentLevel1PoolId = level1.poolId || "";
      this.excludePoolIds = (level1.level2Functions || [])
        .map((item) => item.poolId)
        .filter(Boolean);
      this.selectModalVisible = true;
    },

    collectExistingLevel1PoolIds() {
      const ids = [];
      this.blueprintData.systems.forEach((system) => {
        system.subsystems.forEach((subsystem) => {
          subsystem.level1Functions.forEach((level1) => {
            if (level1.poolId) ids.push(level1.poolId);
          });
        });
      });
      return ids;
    },

    handleSelectConfirm(rows) {
      if (this.selectModalType === "level1") {
        rows.forEach((row) => this.mergeLevel1FromPool(row));
        this.$message.success(`已添加 ${rows.length} 条一级功能`);
        return;
      }

      if (!this.currentLevel1) return;
      rows.forEach((row) => {
        this.currentLevel1.level2Functions.push({
          id: nextId("L2_"),
          poolId: row.id,
          level2Name: row.level2Name,
          descBefore: row.descBefore,
          descAfter: row.descAfter || "",
        });
      });
      this.currentLevel1.expanded = true;
      this.$message.success(`已添加 ${rows.length} 条二级功能`);
    },

    mergeLevel1FromPool(row) {
      let system = this.blueprintData.systems.find(
        (item) => item.systemId === row.systemId,
      );
      if (!system) {
        system = {
          id: nextId("SYS_"),
          systemId: row.systemId,
          systemName: row.systemName,
          expanded: true,
          subsystems: [],
        };
        this.blueprintData.systems.push(system);
      }

      let subsystem = system.subsystems.find(
        (item) => item.subsystemId === row.subsystemId,
      );
      if (!subsystem) {
        subsystem = {
          id: nextId("SUB_"),
          subsystemId: row.subsystemId,
          subsystemName: row.subsystemName,
          expanded: true,
          level1Functions: [],
        };
        system.subsystems.push(subsystem);
      }

      subsystem.level1Functions.push({
        id: nextId("L1_"),
        poolId: row.id,
        level1Name: row.level1Name,
        expanded: true,
        level2Functions: [],
      });
      system.expanded = true;
      subsystem.expanded = true;
    },

    removeSystem(systemId) {
      this.$confirm("确认删除该系统及其下全部功能？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.blueprintData.systems = this.blueprintData.systems.filter(
            (item) => item.id !== systemId,
          );
        })
        .catch(() => {});
    },

    removeSubsystem(system, subsystemId) {
      this.$confirm("确认删除该微应用及其下全部功能？", "提示", {
        type: "warning",
      })
        .then(() => {
          system.subsystems = system.subsystems.filter(
            (item) => item.id !== subsystemId,
          );
          if (!system.subsystems.length) {
            this.blueprintData.systems = this.blueprintData.systems.filter(
              (item) => item.id !== system.id,
            );
          }
        })
        .catch(() => {});
    },

    removeLevel1(subsystem, level1Id) {
      this.$confirm("确认删除该一级功能及其下全部二级功能？", "提示", {
        type: "warning",
      })
        .then(() => {
          subsystem.level1Functions = subsystem.level1Functions.filter(
            (item) => item.id !== level1Id,
          );
        })
        .catch(() => {});
    },

    removeLevel2(level1, level2Id) {
      level1.level2Functions = level1.level2Functions.filter(
        (item) => item.id !== level2Id,
      );
    },

    previewBlueprint() {
      this.$message.info(
        `预览业务蓝图「${this.blueprintData.blueprintName || "—"}」（模拟）`,
      );
    },

    saveBlueprint() {
      saveBlueprintData(this.demandId, this.blueprintData);
      this.$message.success("蓝图及标准功能基线库信息保存成功（模拟）");
      this.$emit("saved");
    },

    goBack() {
      this.$emit("back");
    },
  },
};
</script>

<style scoped>
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  margin: 16px 0 8px;
  font-weight: bold;
}

.info-section {
  padding: 8px 12px;
}

.info-row {
  display: flex;
  line-height: 32px;
}

.label {
  width: 120px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}

.blueprint-info-row {
  display: flex;
  align-items: center;
  padding: 8px 12px 16px;
}

.blueprint-info-row .label {
  width: auto;
  text-align: left;
}

.baseline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.baseline-title {
  margin-bottom: 0;
  flex: 1;
}

.baseline-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-right: 12px;
}

.empty-block {
  margin: 16px 12px;
  padding: 24px;
  text-align: center;
  color: #909399;
  background: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.nest-card {
  margin: 0 12px 12px;
  background: #fff;
  border: 1px solid #cddede;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(14, 68, 70, 0.08);
  overflow: hidden;
}

.system-card {
  background: #fafafa;
}

.subsystem-card {
  margin: 12px;
  background: #fff;
}

.level1-card {
  margin: 12px 0 0;
  background: #fcfcfc;
}

.nest-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: linear-gradient(90deg, #ecfaf9 0%, #ffffff 72%);
  border-bottom: 1px solid #e2eeee;
}

.nest-card.is-collapsed .nest-header {
  border-bottom: none;
}

.expand-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  flex-shrink: 0;
  cursor: pointer;
  color: #13c2c2;
  border-radius: 2px;
}

.expand-trigger:hover {
  background: rgba(19, 194, 194, 0.12);
}

.expand-trigger i {
  font-size: 14px;
}

.nest-header-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.nest-label {
  color: #606266;
  white-space: nowrap;
}

.nest-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #909399;
}

.nest-body {
  padding: 12px;
}

.level2-table-wrap {
  padding-top: 0;
}

.desc-cell {
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.danger-text {
  color: #f56c6c !important;
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}
</style>
