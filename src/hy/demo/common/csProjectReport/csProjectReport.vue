<template>
  <section>
    <hyModal :dialogVisible="dialogVisible" :ifCancle="disabled ? false : ifCancle" :ifSure="disabled ? false : ifSure" :title="title" :width="width" @closeHandle="closeHandle" @sureHandle="sureHandle">
      <div class="cs-modal-box">
        <div class="title" style="margin-top: 0px;">基本信息</div>
        <hyNewForm class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled" @formSelectchange="formSelectchange">
          <el-button slot="btn" size="medium" style="margin-left: 10px;" @click.stop="relatedKy">选择</el-button>
        </hyNewForm>

        <div class="title">厂商信息</div>
        <div v-for="(item, index) in vendorInfoList" :key="index" class="vendor-info">
          <hyNewForm class="form-box" :ref="'vendorInfoRef' + index" :formConfig='item.formConfig' :formData='item.formData' :rules='item.rules' :ifInLine='true' :ifSearch2="false" :disabled="disabled">
          </hyNewForm>

          <i v-if="index == 0 && !disabled" class="el-icon-circle-plus" @click.stop="addVendorInfo"></i>
          <i v-if="index != 0 && !disabled" class="el-icon-remove" @click.stop="removeVendorInfo(index)"></i>
        </div>

        <div v-if="type === 'js'">
          <div>
            <div class="title">总投资</div>
            <hyNewForm class="form-box" ref="csZtzFormRef" :formConfig='csZtzFormConfig' :formData='leftFormObj' :rules="csZtzFormRules" :ifInLine='true' :ifSearch2="false" :disabled="disabled">
            </hyNewForm>
          </div>
          <div>
            <div class="title">资金构成</div>
            <hyNewForm class="form-box" :formConfig='csZjgcFormConfig' :formData='centerFormObj' :ifInLine='true' :ifSearch2="false" :disabled="true">
            </hyNewForm>
          </div>
          <div>
            <div class="title">资金用途</div>
            <hyNewForm class="form-box" :formConfig='csZjytFormConfig' :formData='rightFormObj' :ifInLine='true' :ifSearch2="false" :disabled="true">
            </hyNewForm>
          </div>
        </div>
      </div>
    </hyModal>
  </section>
</template>
<script>
import {
  formConfig,
  formData,
  formRules,
  csZtzFormConfig,
  csZtzFormData,
  csZtzFormRules,
  csZjgcFormConfig,
  csZjgcFormData,
  csZjytFormConfig,
  csZjytFormData
} from "./config.js";
import {
  querySysOrgTree,
} from "@/api/common.js";
import { getManufacturerByProjectCode } from "@/api/materialDeclaration.js";
export default {
  name: "csProjectReport", // 项目填报

  /**
   * @param dialogVisible 弹窗展示
   * @param type 材料类型：初步设计-js，概要设计-yw
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
      formConfig:this.m_copy(formConfig),
      formObj: formData,
      formRules,
      csZtzFormConfig,
      csZjgcFormConfig,
      csZjytFormConfig,
      leftFormObj: this.m_copy(csZtzFormData),
      csZtzFormRules,
      centerFormObj: this.m_copy(csZjgcFormData),
      rightFormObj: this.m_copy(csZjytFormData),
      vendorInfoFormConfig: [
        {
          type: "input",
          label: "合同签订单位：",
          key: "manufacturer",
          placeholder: "",
          width: 300
        },
        {
          type: "input",
          label: "联系人：",
          key: "contacts",
          placeholder: "",
          width: 300
        },
        {
          type: "input",
          label: "联系方式：",
          key: "phoneNumber",
          placeholder: "",
          width: 250
        }
      ],
      vendorInfoFormData: {
        manufacturer: "",
        contacts: "",
        phoneNumber: ""
      },
      vendorInfoRules: {
        manufacturer: [
          { required: true, message: "请填写合同签订单位", trigger: "blur" }
        ],
        contacts: [
          { required: true, message: "请填写联系人", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请填写联系方式", trigger: "blur" }
        ]
      },
      vendorInfoList: [], // 厂商信息
      realFormData: this.m_copy(this.formData)
    };
  },

  async mounted() {
    if(this.realFormData.professionalType==="0"){
      this.formConfig.splice(
        this.formConfig.findIndex(item => item.key === "sfysjmx"),
        1,
      );
    }else{
      this.formConfig=this.m_copy(formConfig)
    }
    // 应用维度
    this.getDict("APP_XXH_YYWD");
    // 项目属性
    this.getDict("APP_PROJECTCLASSIFY");
    // 项目性质
    this.getDict("APP_SZH_XDXMSX");
    // 专业大类
    this.getDict("APP_SZH_XQZY");
    // 业务部门
    this._getAllDeptList();
    // 项目单位
    this.getOrgByUserOrg();
    console.log(this.realFormData)
    
    if (this.realFormData.xmbh) {
      await this.getProjectInfo();
      this._getManufacturerByProjectCode();
      for (const iterator of this.formConfig) {
        if (iterator.key === "kybh") {
          iterator.disabled = false;
        }
      }
    } else {
      this.initVendor();
    }

    if (this.realFormData) {
      this.formObj = this.realFormData;
      this.leftFormObj = this.realFormData;
      this.centerFormObj = this.realFormData;
      this.rightFormObj = this.realFormData;
    }
  },

  methods: {
  async  getDict(dataVal) {
    let res=await this.m_apiFn(this.getDictTreeApi)(dataVal)
          if (
            res &&
            res.result &&
            res.result.children &&
            res.result.children.length > 0
          ) {
            for (const iterator of this.formConfig) {
              if (
                (dataVal === "APP_XXH_YYWD" && iterator.key === "yywd") ||
                (dataVal === "APP_PROJECTCLASSIFY" && iterator.key === "xmsx") ||
                (dataVal === "APP_SZH_XDXMSX" && iterator.key === "xmxz") ||
                (dataVal === "APP_SZH_XQZY" && iterator.key === "zydl")
              ) {
                iterator.options = res.result.children;

                if (dataVal === "APP_SZH_XQZY" && iterator.key === "zydl") {
                  this.formSelectchange(this.realFormData.zydl, "zydl", true);
                }
              }
            }
          }
    },

    // 获取业务部门
  async  _getAllDeptList() {
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
          ywlx: "BUSINESSTYPE_CS",
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
       let res=await this.m_apiFn(getProjectInfo)({ xmbh: this.realFormData.xmbh })
          if (res && res.result) {
            this.realFormData = Object.assign(
              {},
              this.realFormData,
              res.result
            );
            this.formSelectchange(this.realFormData.zydl, "zydl", true);
          }
    },

    // 厂商信息
   async _getManufacturerByProjectCode() {
    let res=await this.m_apiFn(getManufacturerByProjectCode)({xmbh: this.realFormData.xmbh})
          if (res && res.result && res.result.length > 0) {
            for (const iterator of res.result) {
              let param = {};
              param.formConfig = this.m_copy(this.vendorInfoFormConfig);
              param.formData = this.m_copy(iterator);
              param.rules = this.m_copy(this.vendorInfoRules);
              this.vendorInfoList.push(param);
            }
          } else {
            this.initVendor();
          }
    },

    closeHandle() {
      this.$emit("closeHandle");
    },

    sureHandle() {
      let formRefValid = true;
      let vendorInfoRefValid = true;
      let csZtzFormRefValid = true;

      this.$refs[this.formRef].$refs.form.validate(valid => {
        formRefValid = valid;
      });

      let list = [];
      for (let index = 0; index < this.vendorInfoList.length; index++) {
        this.$refs[`vendorInfoRef${index}`][0].$refs.form.validate(valid => {
          vendorInfoRefValid = valid;
        });

        list.push(this.vendorInfoList[index].formData);
      }

      if (this.type === "js") {
        this.$refs.csZtzFormRef.$refs.form.validate(valid => {
          csZtzFormRefValid = valid;
        });
      }

      if (formRefValid && vendorInfoRefValid && csZtzFormRefValid) {
        this.formObj.manufacturerInfos = list;

        const obj = {
          formObj: this.formObj,
          leftFormObj: this.leftFormObj,
          centerFormObj: this.centerFormObj,
          rightFormObj: this.rightFormObj
        };
        this.$emit("sureHandle", obj);
      } else {
        this.$message.warning("请检查必填信息是否填写完整。");
      }
    },

    // 关联可研
    relatedKy() {
      this.$emit("relatedKy");
    },

    formSelectchange(val, e, clearable) {
      if (e === "zydl") {
        // 建设类-专业大类
        let options = [];
        for (const iterator of this.formConfig) {
          if (iterator.key === "zydl") {
            for (const item of iterator.options) {
              if (item.dataVal === val) {
                options = item.children;
              }
            }
          }
        }
        console.log(options)
        for (const iterator of this.formConfig) {
          if (iterator.key === "zyxl") {
            iterator.options = options;
            iterator.disabled = false;
            if (!clearable) {
              this.$set(this.formObj, "zyxl", "");
            }
            this.$nextTick(() => {
              this.$refs[this.formRef].$refs.form.clearValidate();
            });
          }
        }
      }
    },

    updateFormObj(formData) {
      this.formObj = formData;

      this.formSelectchange(formData.zydl, "zydl", true);

      this.$nextTick(() => {
        this.$refs[this.formRef].$refs.form.clearValidate();
      });
    },

    // 初始化厂商信息
    initVendor() {
      let param = {};
      param.formConfig = this.m_copy(this.vendorInfoFormConfig);
      param.formData = this.m_copy(this.vendorInfoFormData);
      param.rules = this.m_copy(this.vendorInfoRules);
      this.vendorInfoList.push(param);
    },

    addVendorInfo() {
      this.initVendor();
    },

    removeVendorInfo(index) {
      this.vendorInfoList.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
// .cs-modal-box {
//   height: 600px;
//   overflow-x: auto;
// }

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

.title {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: black;
  margin-top: 20px;
}

.title::before {
  content: "";
  width: 8px;
  height: 12px;
  background-color: #409eff;
  margin-right: 4px;
}

.vendor-info {
  display: flex;
  align-items: flex-end;

  i {
    font-size: 26px;
    cursor: pointer;
    margin-bottom: 6px;
  }

  .el-icon-circle-plus {
    color: #67c23a;
  }

  .el-icon-remove {
    color: #f56c6c;
  }
}
</style>