<template>
  <div class="page-pre-reserve-form">
    <div class="card">
      <div class="form-header">
        <span class="form-title">{{ pageTitle }}</span>
        <el-button v-if="!isDetail" type="text" class="back-link" @click="goBack">返回列表</el-button>
      </div>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        size="small"
        :disabled="isDetail"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="申报编号">
              <el-input v-model="form.declarationNo" placeholder="保存后自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求名称" prop="requirementName">
              <el-input v-model="form.requirementName" placeholder="请输入需求名称" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="form.projectType" placeholder="请选择项目类型" style="width: 100%">
                <el-option
                  v-for="item in projectTypes"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核心系统" prop="coreSystem">
              <el-select v-model="form.coreSystem" placeholder="请选择核心系统" style="width: 100%">
                <el-option
                  v-for="item in coreSystems"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="计划总投资（万元）" prop="plannedInvestment">
              <el-input
                v-model="form.plannedInvestment"
                placeholder="请输入金额"
                @input="onInvestmentInput"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求提出部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
                <el-option
                  v-for="item in departments"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="需求负责人" prop="personInCharge">
              <el-input v-model="form.personInCharge" placeholder="请输入负责人" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col v-if="isDetail || isEdit" :span="12">
            <el-form-item label="状态">
              <el-input v-model="form.status" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="需求描述" prop="requirementDesc">
          <el-input
            v-model="form.requirementDesc"
            type="textarea"
            :rows="4"
            placeholder="请输入需求描述"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div v-if="!isDetail" class="form-footer">
        <el-button type="primary" class="btn-teal" :loading="saving" @click="handleSave">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </div>
      <div v-else class="form-footer">
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PROJECT_TYPES,
  CORE_SYSTEMS,
  DEPARTMENTS,
  getById,
  addRecord,
  updateRecord,
} from './utils/preReserveStore';

export default {
  name: 'PagePreReserveForm',
  data() {
    const validateInvestment = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入计划总投资'));
        return;
      }
      const num = Number(value);
      if (Number.isNaN(num) || num < 0) {
        callback(new Error('请输入有效的金额数值'));
        return;
      }
      callback();
    };

    return {
      projectTypes: PROJECT_TYPES,
      coreSystems: CORE_SYSTEMS,
      departments: DEPARTMENTS,
      saving: false,
      form: {
        declarationNo: '',
        requirementName: '',
        projectType: '',
        coreSystem: '',
        plannedInvestment: '',
        department: '',
        personInCharge: '',
        requirementDesc: '',
        status: '暂存',
      },
      rules: {
        requirementName: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
        projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        coreSystem: [{ required: true, message: '请选择核心系统', trigger: 'change' }],
        plannedInvestment: [{ required: true, validator: validateInvestment, trigger: 'blur' }],
        department: [{ required: true, message: '请选择需求提出部门', trigger: 'change' }],
        personInCharge: [{ required: true, message: '请输入需求负责人', trigger: 'blur' }],
        requirementDesc: [{ required: true, message: '请输入需求描述', trigger: 'blur' }],
      },
    };
  },
  computed: {
    recordId() {
      return this.$route.query.id;
    },
    mode() {
      return this.$route.query.mode || 'add';
    },
    isDetail() {
      return this.mode === 'detail';
    },
    isEdit() {
      return this.mode === 'edit';
    },
    pageTitle() {
      if (this.isDetail) return '预储备需求详情';
      if (this.isEdit) return '预储备需求编辑';
      return '预储备需求新增';
    },
  },
  mounted() {
    if (this.recordId) {
      const record = getById(this.recordId);
      if (record) {
        this.form = {
          declarationNo: record.declarationNo,
          requirementName: record.requirementName,
          projectType: record.projectType,
          coreSystem: record.coreSystem,
          plannedInvestment: record.plannedInvestment,
          department: record.department,
          personInCharge: record.personInCharge,
          requirementDesc: record.requirementDesc || '',
          status: record.status,
        };
      }
    }
  },
  methods: {
    onInvestmentInput(val) {
      this.form.plannedInvestment = String(val).replace(/[^\d.]/g, '');
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('存在未填写的必填项，请核查！');
          return;
        }
        this.saving = true;
        const payload = {
          requirementName: this.form.requirementName.trim(),
          projectType: this.form.projectType,
          coreSystem: this.form.coreSystem,
          plannedInvestment: Number(this.form.plannedInvestment).toFixed(2),
          department: this.form.department,
          personInCharge: this.form.personInCharge.trim(),
          requirementDesc: this.form.requirementDesc.trim(),
        };

        setTimeout(() => {
          if (this.isEdit && this.recordId) {
            updateRecord(this.recordId, payload);
          } else {
            addRecord(payload);
          }
          this.saving = false;
          this.$message.success('保存成功！');
          this.$router.push({ name: 'PreReserveList' });
        }, 300);
      });
    },
    goBack() {
      this.$router.push({ name: 'PreReserveList' });
    },
  },
};
</script>

<style scoped>
.page-pre-reserve-form {
  min-height: calc(100vh - 96px);
}

.card {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.back-link {
  color: #00796b;
}

.form-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  text-align: center;
}

.btn-teal {
  background-color: #00796b !important;
  border-color: #00796b !important;
  min-width: 100px;
}

.btn-teal:hover,
.btn-teal:focus {
  background-color: #00695c !important;
  border-color: #00695c !important;
}
</style>
