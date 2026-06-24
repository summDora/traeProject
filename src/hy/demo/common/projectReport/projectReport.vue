<template>
  <hyModal 
    :dialogVisible="dialogVisible" 
    :ifThird="true"
    :ifCancle="false"
    :ifSure="false" 
    :title="title" 
    :width="width"
    @closeHandle="closeHandle"
  >
    <div class="ky-modal-box">
      <div class="title" style="margin-top: 0px;">基本信息</div>
      <hyNewForm class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled" @formSelectchange="formSelectchange">
      </hyNewForm>

      <div v-if="type === 'js'">
        <div>
          <div class="title">总投资（万元）</div>
          <hyNewForm class="form-box" :formConfig='jsBottomZtzFormConfig' :formData='leftFormObj' :ifInLine='true' :ifSearch2="false" :disabled="true">
          </hyNewForm>
        </div>
        <div>
          <div class="title">年计划（万元）</div>
          <hyNewForm class="form-box" ref="rightFormRef" :formConfig='jsBottomJhFormConfig' :formData='rightFormObj' :rules="jhFormRules" :ifInLine='true' :ifSearch2="false" :disabled="disabled" @inputHandleChange="rightFormInputHandleChange">
          </hyNewForm>
        </div>
        <div>
          <div class="title">已完成支出（万元）（跨年项目）</div>
          <hyNewForm class="form-box" ref="centerFormRef" :formConfig='jsBottomYwcFormConfig' :formData='centerFormObj' :rules="ywcFormRules" :ifInLine='true' :ifSearch2="false" :disabled="disabled" @inputHandleChange="centerFormInputHandleChange">
          </hyNewForm>
        </div>
      </div>
    </div>
    <template slot="footer">
      <el-button v-if="!disabled" size="medium"  @click="closeHandle">取消</el-button>
      <el-button v-if="!disabled" size="medium" type="primary" @click="sureHandle">确定</el-button>
    </template>
  </hyModal>
</template>
<script>
import {
  jsFormConfig,
  jsFormData,
  jsFormRules,
  jsBottomZtzFormConfig,
  ztzFormData,
  jsBottomYwcFormConfig,
  ywcFormData,
  ywcFormRules,
  jsBottomJhFormConfig,
  jhFormData,
  jhFormRules,
  ywFormConfig,
  ywFormData,
  ywFormRules,
  jsBottomZtzFormConfigZXSJ,
  jsBottomZtzFormConfigXTKFOrJCSS,
  jsBottomZtzFormConfigYWYY,
  jsBottomZtzFormConfigSJGC,
  jsBottomZtzFormConfigCPGZ,
  jsBottomZtzFormConfigJF,
  ztzFormDataZXSJ,
  ztzFormDataXTKFOrJCSS,
  ztzFormDataYWYY,
  ztzFormDataSJGC,
  ztzFormDataCPGZ,
  ztzFormDataJF,
  jsBottomYwcFormConfigZXSJ,
  ywcFormDataZXSJ,
  jsBottomYwcFormConfigXTKFOrJCSS,
  ywcFormDataXTKFOrJCSS,
  jsBottomYwcFormConfigYWYY,
  ywcFormDataYWYY,
  jsBottomYwcFormConfigSJGC,
  ywcFormDataSJGC,
  jsBottomYwcFormConfigCPGZ,
  ywcFormDataCPGZ,
  jsBottomYwcFormConfigJF,
  ywcFormDataJF,
  jsBottomJhFormConfigZXSJ,
  jhFormDataZXSJ,
  jsBottomJhFormConfigXTKFOrJCSS,
  jhFormDataXTKFOrJCSS,
  jsBottomJhFormConfigYWYY,
  jhFormDataYWYY,
  jsBottomJhFormConfigSJGC,
  jhFormDataSJGC,
  jsBottomJhFormConfigCPGZ,
  jhFormDataCPGZ,
  jsBottomJhFormConfigJF,
  jhFormDataJF
} from "./config.js";
import {
  // getDictTree,
  // queryOrgByUserOrg,
  querySysOrgTree,
} from "@/api/common.js";
// import { queryProjectInfoForYw } from "@/api/materialDeclaration.js";
export default {
  name: "projectReport", // 项目填报

  /**
   * @param dialogVisible 弹窗展示
   * @param type 材料类型：建设材料-js，运维材料-yw
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
    pageName: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      formConfig:
        this.type === "js"
          ? this.m_copy(jsFormConfig)
          : this.m_copy(ywFormConfig),
      formObj:
        this.type === "js" ? this.m_copy(jsFormData) : this.m_copy(ywFormData),
      formRules: this.type === "js" ? jsFormRules : ywFormRules,
      jsBottomZtzFormConfig: this.m_copy(jsBottomZtzFormConfig),
      jsBottomYwcFormConfig: this.m_copy(jsBottomYwcFormConfig),
      jsBottomJhFormConfig: this.m_copy(jsBottomJhFormConfig),
      leftFormObj: this.m_copy(ztzFormData),
      centerFormObj: this.m_copy(ywcFormData),
      ywcFormRules,
      rightFormObj: this.m_copy(jhFormData),
      jhFormRules,
      realFormData: this.m_copy(this.formData)
    };
  },

  mounted() {
    // 应用维度
    this.getDict("APP_XXH_YYWD");
    if (this.type === "js") {
      // 项目属性
      this.getDict("APP_PROJECTCLASSIFY");
      // 项目分类-建设
      this.getDict("APP_SZH_XMFL");
      // 专业大类
      this.getDict("APP_SZH_XQZY");
      // 项目建设情况
      this.getDict("APP_SZH_KY_XMJSQK");
    } else if (this.type === "yw") {
      // 项目分类-运维
      this.getDict("APP_XXH_XMFL_YW");
    }
    // 业务部门
    this._getAllDeptList();

    // 项目单位
    this.getOrgByUserOrg();
    if (
      this.realFormData &&
      Object.keys(this.realFormData).length &&
      this.realFormData.xmbh
    ) {
      this.getProjectInfo();
    } else {
      if (this.realFormData.isAdd) {
        this.formObj = this.realFormData;
        if (this.type === "js") {
          this.formSelectchange(this.realFormData.projectClassify, "projectClassify", true);
        }
      } else {
        this.formObj = this.realFormData;
        this.leftFormObj = this.realFormData;
        this.centerFormObj = this.realFormData;
        this.rightFormObj = this.realFormData;

        if (this.type === "js") {
          this.formSelectchange(this.realFormData.projectClassify, "projectClassify", true);
        }
      }
    }

    this.$set(
      this.formObj,
      "xmbh",
      this.formObj.xmbh ? this.formObj.xmbh : "项目编码自动生成"
    );
  },

  methods: {
   async getDict(dataVal) {
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
                (dataVal === "APP_SZH_XMFL" && iterator.key === "projectClassify") ||
                (dataVal === "APP_XXH_XMFL_YW" && iterator.key === "projectClassify") ||
                (dataVal === "APP_XXH_YWBM" && iterator.key === "ywubm") ||
                (dataVal === "APP_SZH_XQZY" && iterator.key === "zydl") ||
                (dataVal === "APP_SZH_KY_XMJSQK" && iterator.key === "xmjsqk")
              ) {
                iterator.options = res.result.children;

                if (
                  this.type === "yw" &&
                  dataVal === "APP_XXH_XMFL_YW" &&
                  iterator.key === "projectClassify"
                ) {
                  this.formSelectchange(this.realFormData.projectClassify, "projectClassify", true);
                }

                if (
                  this.type === "js" &&
                  dataVal === "APP_SZH_XQZY" &&
                  iterator.key === "zydl"
                ) {
                  this.formSelectchange(this.realFormData.zydl, "zydl", true);
                }
              }
            }
          }
    },

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
      let param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        pageType: "sb"
      };
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
            this.$refs[this.formRef].$refs.form.clearValidate();

            if (this.realFormData.isAdd) {
              this.formObj = this.realFormData;
            } else {
              this.formObj = this.realFormData;
              this.leftFormObj = this.realFormData;
              this.centerFormObj = this.realFormData;
              this.rightFormObj = this.realFormData;
              console.log(1111)
              if (this.type === "js") {
                this.formSelectchange(this.realFormData.projectClassify, "projectClassify", true);
                this.formSelectchange(this.realFormData.zydl, "zydl", true);
              }
              
            }
          }
    },

    closeHandle() {
      this.$emit("closeHandle");
    },


    sureHandle() {
      let formRefValid = true;
      let rightFormRefValid = true;
      let centerFormRefValid = true;
      this.$refs[this.formRef].$refs.form.validate(valid => {
        formRefValid = valid;
      });

      if (this.type === "js") {
        this.$refs.rightFormRef.$refs.form.validate(valid => {
          rightFormRefValid = valid;
        });

        this.$refs.centerFormRef.$refs.form.validate(valid => {
          centerFormRefValid = valid;
        });
      }

      if (this.type === "js") {
        if (!formRefValid || !rightFormRefValid || !centerFormRefValid) {
          this.$message.warning("请检查必填信息是否填写完整。");
          return false;
        }
      } else {
        if (!formRefValid) {
          this.$message.warning("请检查必填信息是否填写完整。");
          return false;
        }
      }

      if (this.type === "js") {
        if (!this.rightFormObj.jhHj || this.rightFormObj.jhHj == "0") {
          this.$message.warning("请填写项目年计划各项金额");
          return false;
        }
      }

      const obj = {
        formObj: this.formObj,
        leftFormObj: this.leftFormObj,
        centerFormObj: this.centerFormObj,
        rightFormObj: this.rightFormObj
      };
      this.$emit("sureHandle", obj);
    },

    formSelectchange(val, e, clearable) {
      this.$emit("formSelectchange", val, e);
      if (e === "projectClassify") {
        for (const iterator of this.formConfig) {
          if (iterator.key === "projectClassify") {
            for (const item of iterator.options) {
              if (item.dataVal === val) {
                this.$set(this.formObj, "xmflm", item.dataLabel);
              }
            }
          }
        }
      }
      if (e === "projectClassify" && this.type === "yw") {
        let options = [];
        for (const iterator of this.formConfig) {
          if (iterator.key === "projectClassify") {
            for (const item of iterator.options) {
              if (item.dataVal === val) {
                options = item.children;
              }
            }
          }
        }
        for (const iterator of this.formConfig) {
          if (iterator.key === "xmxl") {
            iterator.options = options;
            if (!clearable) {
              this.$set(this.formObj, "xmxl", "");
            }
            this.$nextTick(() => {
              this.$refs[this.formRef].$refs.form.clearValidate();
            });
          }
        }
      }

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
        console.log(2222)
      }

      if (e === "projectClassify" && this.type === "js") {
        switch (val) {
          case "ZXSJ":
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfigZXSJ);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfigZXSJ);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfigZXSJ);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataZXSJ);
              this.centerFormObj = this.m_copy(ywcFormDataZXSJ);
              this.rightFormObj = this.m_copy(jhFormDataZXSJ);
            }
            break;
          case "XTKF":
          case "JCSS":
            this.jsBottomZtzFormConfig = this.m_copy(
              jsBottomZtzFormConfigXTKFOrJCSS
            );
            this.jsBottomYwcFormConfig = this.m_copy(
              jsBottomYwcFormConfigXTKFOrJCSS
            );
            this.jsBottomJhFormConfig = this.m_copy(
              jsBottomJhFormConfigXTKFOrJCSS
            );

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataXTKFOrJCSS);
              this.centerFormObj = this.m_copy(ywcFormDataXTKFOrJCSS);
              this.rightFormObj = this.m_copy(jhFormDataXTKFOrJCSS);
            }
            break;
          case "YWYY":
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfigYWYY);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfigYWYY);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfigYWYY);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataYWYY);
              this.centerFormObj = this.m_copy(ywcFormDataYWYY);
              this.rightFormObj = this.m_copy(jhFormDataYWYY);
            }
            break;
          case "SJGC":
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfigSJGC);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfigSJGC);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfigSJGC);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataSJGC);
              this.centerFormObj = this.m_copy(ywcFormDataSJGC);
              this.rightFormObj = this.m_copy(jhFormDataSJGC);
            }
            break;
          case "CPGZ":
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfigCPGZ);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfigCPGZ);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfigCPGZ);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataCPGZ);
              this.centerFormObj = this.m_copy(ywcFormDataCPGZ);
              this.rightFormObj = this.m_copy(jhFormDataCPGZ);
            }
            break;
          case "JF":
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfigJF);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfigJF);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfigJF);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormDataJF);
              this.centerFormObj = this.m_copy(ywcFormDataJF);
              this.rightFormObj = this.m_copy(jhFormDataJF);
            }
            break;
          default:
            this.jsBottomZtzFormConfig = this.m_copy(jsBottomZtzFormConfig);
            this.jsBottomYwcFormConfig = this.m_copy(jsBottomYwcFormConfig);
            this.jsBottomJhFormConfig = this.m_copy(jsBottomJhFormConfig);

            if (!clearable) {
              this.leftFormObj = this.m_copy(ztzFormData);
              this.centerFormObj = this.m_copy(ywcFormData);
              this.rightFormObj = this.m_copy(jhFormData);
            }
            break;
        }

        this.ztzTotal();
      }
    },

    rightFormInputHandleChange(val, key) {
      // 年计划
      // if (!val && val !== 0) {
      //   return false;
      // }

      const b = isNaN(Number(val));
      if (b) {
        return false;
      }

      this.rightFormObj[key] = Number(val).toFixed(2);
      switch (key) {
        case "jhRj":
        // 软件购置
        case "jhYj":
        // 硬件购置
        case "jhKf":
        // 系统开发
        case "jhSjcp":
          // 数据产品
          this.$set(
            this.rightFormObj,
            "jhZbj",
            (
              Number(this.rightFormObj.jhRj ? this.rightFormObj.jhRj : 0) +
              Number(this.rightFormObj.jhYj ? this.rightFormObj.jhYj : 0) +
              Number(this.rightFormObj.jhKf ? this.rightFormObj.jhKf : 0) +
              Number(this.rightFormObj.jhSjcp ? this.rightFormObj.jhSjcp : 0)
            ).toFixed(2)
          );
          break;

        case "jhJagc":
        // 建安工程
        case "jhSs":
        // 集成实施
        case "jhZxsj":
        // 咨询设计
        case "jhYyfw":
        // 运营服务
        case "jhSjbz":
        // 数据标准
        case "jhSjcpss":
        // 数据产品实施
        case "jhQt":
          // 其他费用
          this.$set(
            this.rightFormObj,
            "jhCbj",
            (
              Number(this.rightFormObj.jhJagc ? this.rightFormObj.jhJagc : 0) +
              Number(this.rightFormObj.jhSs ? this.rightFormObj.jhSs : 0) +
              Number(this.rightFormObj.jhZxsj ? this.rightFormObj.jhZxsj : 0) +
              Number(this.rightFormObj.jhYyfw ? this.rightFormObj.jhYyfw : 0) +
              Number(this.rightFormObj.jhSjbz ? this.rightFormObj.jhSjbz : 0) +
              Number(
                this.rightFormObj.jhSjcpss ? this.rightFormObj.jhSjcpss : 0
              ) +
              Number(this.rightFormObj.jhQt ? this.rightFormObj.jhQt : 0)
            ).toFixed(2)
          );
          break;
        default:
          break;
      }

      this.$set(
        this.rightFormObj,
        "jhHj",
        (
          Number(this.rightFormObj.jhZbj ? this.rightFormObj.jhZbj : 0) +
          Number(this.rightFormObj.jhCbj ? this.rightFormObj.jhCbj : 0)
        ).toFixed(2)
      );

      this.ztzTotal();
    },

    centerFormInputHandleChange(val, key) {
      // 已完成支出
      // if (!val && val !== 0) {
      //   return false;
      // }

      const b = isNaN(Number(val));
      if (b) {
        return false;
      }

      this.centerFormObj[key] = Number(val).toFixed(2);
      switch (key) {
        case "ywcRj":
        // 软件购置
        case "ywcYj":
        // 硬件购置
        case "ywcKf":
        // 系统开发
        case "ywcSjcp":
          // 数据产品
          this.$set(
            this.centerFormObj,
            "ywcZbj",
            (
              Number(this.centerFormObj.ywcRj ? this.centerFormObj.ywcRj : 0) +
              Number(this.centerFormObj.ywcYj ? this.centerFormObj.ywcYj : 0) +
              Number(this.centerFormObj.ywcKf ? this.centerFormObj.ywcKf : 0) +
              Number(
                this.centerFormObj.ywcSjcp ? this.centerFormObj.ywcSjcp : 0
              )
            ).toFixed(2)
          );
          break;

        case "ywcJagc":
        // 建安工程
        case "ywcSs":
        // 集成实施
        case "ywcZxsj":
        // 咨询设计
        case "ywcYyfw":
        // 运营服务
        case "ywcSjbz":
        // 数据标准
        case "ywcSjcpss":
        // 数据产品实施
        case "ywcQt":
          // 其他费用
          this.$set(
            this.centerFormObj,
            "ywcCbj",
            (
              Number(
                this.centerFormObj.ywcJagc ? this.centerFormObj.ywcJagc : 0
              ) +
              Number(this.centerFormObj.ywcSs ? this.centerFormObj.ywcSs : 0) +
              Number(
                this.centerFormObj.ywcZxsj ? this.centerFormObj.ywcZxsj : 0
              ) +
              Number(
                this.centerFormObj.ywcYyfw ? this.centerFormObj.ywcYyfw : 0
              ) +
              Number(
                this.centerFormObj.ywcSjbz ? this.centerFormObj.ywcSjbz : 0
              ) +
              Number(
                this.centerFormObj.ywcSjcpss ? this.centerFormObj.ywcSjcpss : 0
              ) +
              Number(this.centerFormObj.ywcQt ? this.centerFormObj.ywcQt : 0)
            ).toFixed(2)
          );
          break;
        default:
          break;
      }

      this.$set(
        this.centerFormObj,
        "ywcHj",
        (
          Number(this.centerFormObj.ywcZbj ? this.centerFormObj.ywcZbj : 0) +
          Number(this.centerFormObj.ywcCbj ? this.centerFormObj.ywcCbj : 0)
        ).toFixed(2)
      );

      this.ztzTotal();
    },

    ztzTotal() {
      this.ztzTotalFormula("ztzHj", "jhHj", "ywcHj");
      this.ztzTotalFormula("ztzJagc", "jhJagc", "ywcJagc");
      this.ztzTotalFormula("ztzRj", "jhRj", "ywcRj");
      this.ztzTotalFormula("ztzYj", "jhYj", "ywcYj");
      this.ztzTotalFormula("ztzZxsj", "jhZxsj", "ywcZxsj");
      this.ztzTotalFormula("ztzKf", "jhKf", "ywcKf");
      this.ztzTotalFormula("ztzSs", "jhSs", "ywcSs");
      this.ztzTotalFormula("ztzYyfw", "jhYyfw", "ywcYyfw");
      this.ztzTotalFormula("ztzQt", "jhQt", "ywcQt");
      this.ztzTotalFormula("ztzSjcp", "jhSjcp", "ywcSjcp");
      this.ztzTotalFormula("ztzSjbz", "jhSjbz", "ywcSjbz");
      this.ztzTotalFormula("ztzSjcpss", "jhSjcpss", "ywcSjcpss");
    },

    ztzTotalFormula(ztz, jh, ywc) {
      this.$set(
        this.leftFormObj,
        ztz,
        (
          Number(this.rightFormObj[jh] ? this.rightFormObj[jh] : 0) +
          Number(this.centerFormObj[ywc] ? this.centerFormObj[ywc] : 0)
        ).toFixed(2)
      );
    }
  }
};
</script>
<style lang="less" scoped>
// .ky-modal-box {
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
</style>