<template>
  <hyModal :dialogVisible="dialogVisible" :ifCancle="disabled ? false : ifCancle" :ifSure="disabled ? false : ifSure" :title="title" :width="width" @closeHandle="closeHandle" @sureHandle="sureHandle">
    <div class="aq-modal-box">
      <div class="title">项目基本信息：</div>
      <hyNewForm class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled">
      </hyNewForm>

      <div class="title" style="margin-top: 20px;">省信通公司初审：</div>
      <hyNewForm class="form-box" :formConfig='csFormConfig' :formData='bottomFormObj' :ifInLine='true' :ifSearch2="false" :disabled="disabled">
      </hyNewForm>
    </div>
  </hyModal>
</template>
<script>
import {
  formConfig,
  formData,
  formRules,
  csFormConfig,
  csFormData
} from "./config.js";
import {
  querySysOrgTree,
} from "@/api/common.js";
export default {
  name: "aqProjectReport", // 项目填报

  /**
   * @param dialogVisible 弹窗展示
   * @param ifCancle 取消按钮
   * @param ifSure 确认按钮
   * @param title 弹窗标题
   * @param width 弹窗宽度
   * @param formRef form编辑
   * @param ifInLine form格式
   * @param disabled 是否可编辑：false可编辑，true不可编辑
   * @function getDictTreeApi 数据字典表
   * @function queryOrgByUserOrgApi 项目单位
   * @function getAllDeptListApi 业务部门
   * @function queryProjectInfoForYwApi 查询运维类附属数据
   */
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: () => false
    },
    type: {
      required: true,
      type: String,
      default: () => ""
    },
    ifCancle: {
      type: Boolean,
      default: () => true
    },
    ifSure: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      default: () => "项目填报"
    },
    width: {
      type: String,
      default: () => "1050px"
    },
    formRef: {
      type: String,
      default: () => "formRef"
    },
    ifInLine: {
      type: Boolean,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    formData: {
      type: Object,
      default: () => null
    },
    getDictTreeApi: {
      type: Function,
      default: () => null
    },
    queryOrgByUserOrgApi: {
      type: Function,
      default: () => null
    },
    getAllDeptListApi: {
      type: Function,
      default: () => null
    },
    queryProjectInfoForYwApi: {
      type: Function,
      default: () => null
    },
    page: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      formConfig: this.m_copy(formConfig),
      formObj: this.m_copy(formData),
      formRules,
      csFormConfig: this.m_copy(csFormConfig),
      bottomFormObj: this.m_copy(csFormData),
      realFormData: this.m_copy(this.formData)
    };
  },

  async mounted() {
    // 业务部门
    this._getAllDeptList();
    // 项目单位
    this.getOrgByUserOrg();

    if (this.realFormData.xmbh) {
      await this.getProjectInfo();
    }

    if (this.realFormData) {
      this.formObj = this.realFormData;
      this.bottomFormObj = this.realFormData;
    }

    if (!this.disabled) {
      if (this.page === "csBatchManage") {
        for (let item of this.csFormConfig) {
          if (
            item.key === "cssj" ||
            item.key === "sfps" ||
            item.key === "scyj" ||
            item.key === "csyj"
          ) {
            item.disabled = false;
          }
        }
      }
    }

    this.$set(
      this.formObj,
      "xmbh",
      this.formObj.xmbh ? this.formObj.xmbh : "项目编号自动生成"
    );
  },

  methods: {
    // 获取业务部门
   async _getAllDeptList() {
    let resp=await this.m_apiFn(getAllDeptList)({})
          if (resp && resp.result && resp.result.length > 0) {
            for (const iterator of this.formConfig) {
              if (iterator.key === "ywubm") {
                iterator.options = resp.result;
              }
            }
          }
    },

    // 查找项目单位
   async getOrgByUserOrg() {
      let param = {};
      if (this.queryOrgByUserOrgApi === querySysOrgTree) {
        param = {
          NotBM: true
        };
      } else {
        param = {
          xmlx: "PROJECTTYPE_XXH",
          ywlx: "BUSINESSTYPE_AQ",
          pageType: "sb"
        };
      }
      let res=await this.m_apiFn(this.queryOrgByUserOrgApi)(param)
          for (const iterator of this.formConfig) {
            if (iterator.key === "sbdw") {
              iterator.options = res.result;
            }
          }

    },

    // 查询项目信息
    async getProjectInfo() {
     let res= await this.m_apiFn(getProjectInfo)({ xmbh: this.realFormData.xmbh })
          if (res && res.result) {
            this.realFormData = Object.assign(
              {},
              this.realFormData,
              res.result
            );
          }
    },

    closeHandle() {
      this.$emit("closeHandle");
    },

    sureHandle() {
      this.$refs[this.formRef].$refs.form.validate(valid => {
        if (valid) {
          const obj = {
            formObj: this.formObj,
            bottomFormObj: this.bottomFormObj
          };
          this.$emit("sureHandle", obj);
        } else {
          this.$message.warning("请检查必填信息是否填写完整。");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
// .aq-modal-box {
//   height: 600px;
//   overflow-x: auto;
// }

.title {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: black;
}

.title::before {
  content: "";
  width: 8px;
  height: 12px;
  background-color: #409eff;
  margin-right: 4px;
}

.form-box {
  /deep/ .el-form-item__label {
    padding: 0;
    height: 16px;
  }
}

.form-box /deep/ .el-input.is-disabled .el-input__inner,
.form-box /deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #9a9a9a;
}
</style>