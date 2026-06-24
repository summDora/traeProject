<template>
<!--会议签到-->
    <hyNewModal :dialogVisible="dialogVisible" :title="qiandaoTitle" :width="'960px'" :ifThird="true" :showClose="true" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
      <!-- 选人的时候 -->
      <div >
        <hyNewForm class="form-box" :formConfig='amaFormConfig' :formData='amaFormData' :rules='amaFormRules' ifInLine :labelPosition="'left'">
        </hyNewForm>
      </div>
      <!-- 用v-for来循环增加或减少 -->
      <div v-if="newManData">
        <div v-for="(item,index) in newManData" :key="index">
          <div class="newMan">
            <div>
              <i class="iconfont" :class="'iconuser'" style="color:#298BF5"></i>
              其他参会人员
            </div>
            <div>
              <el-button style="width:100px" size='medium' @click="deleteNewMan(item,index)" type="primary">删除
              </el-button>
            </div>
          </div>
        <hyNewForm ref="formRef" class="form-box" :formConfig='xzryFormConfig' :formData='item' :rules='xzryFormRules' ifInLine :labelPosition="'left'">
        </hyNewForm>
        </div>
      </div>
      <template  slot="footer">
        <div v-if="dialogVisible">
        <!-- 外面没选用户直接点且此时里面没有   或者 选了且角色为专家组长负责人  或者  修改-->
          <el-button size='medium' type="primary" @click="addNewMan" v-if="pageType=='clsb'">新增会议人员
          </el-button>
          <el-button size='medium' type="info" @click="closeHandle" v-else-if="pageType === 'zjps'">取消
          </el-button>
          <el-button size='medium' type="primary" @click="onSubmit" v-if="pageType === 'zjps'">会议签到
          </el-button>
          <el-button size='medium' type="primary" @click="onSure" v-else>确定
          </el-button>
        </div>
      </template>
    </hyNewModal>
</template>
<script>
import common from '@/utils/common.js'
import {
  tableDownload,
  getDetailTableData,
  detailTableDownload,
  getKindList,
  querySignSelected,
  addMeetingAutograph,
  querySceneSignByUserId
} from "@/api/meetSignStatisticsTable";
import {
 xzryFormConfig,
  xzryFormData,
  xzryFormRules,
  amaFormConfig,
  amaFormData,
  amaFormRules
} from "./meetingSignIn";
export default {
  components: {},
  props: {
    rowData: {
      type: Object,
      default: () => {}
    },
    dialogVisible:{
      required: true,
      type: Boolean,
      default: () => false
    },
    pageType:{
      // required: true,
      type: String,
      default: () => ''
    },

  },
  data() {
    return {
      qiandaoTitle: "会议签到",
      amaFormConfig: this.m_copy(amaFormConfig),
      amaFormData: this.m_copy(amaFormData),
      amaFormRules: amaFormRules,
      xzryFormConfig: this.m_copy(xzryFormConfig),
      xzryFormData: this.m_copy(xzryFormData),
      xzryFormRules: xzryFormRules,
      newManData: [],
      qdList:[],
      userInfo:'',
    };
  },
  created() {

    this.getData();
  },
  methods: {
    getData(){
        const params = {
        tdmId: this.rowData.tdmId, //会议id
        businessType: this.rowData.businessType //会议类型 
      }
      this.m_apiFn(querySceneSignByUserId,params).then(resp => {
          if(resp.result&&resp.result.children) {
            this.newManData = resp.result.children.filter(item=>item.isZry!=0)  
            this.amaFormData.xqmc = this.rowData.meetingName;
            if(this.pageType=='zjps'){
              this.amaFormData.roleName='评审专家'
            }else{
              this.amaFormData.roleName='项目单位'
            }
            
            this.userInfo=resp.result.userId
            this.amaFormData.phone =resp.result.phone
            this.amaFormData.orgName = resp.result.orgName
            this.amaFormData.kjxqdl = resp.result.userName
             let obj = {}
            obj.userName = resp.result.userName
            obj.orgName = resp.result.orgName
            obj.phone = resp.result.phone
            obj.isZry = resp.result.isZry
            this.qdList.push(obj)
            if(this.newManData&&this.newManData.lenght>0){
              this.qiandaoTitle = "修改会议签到";
            }
          }
      })
     
      // // 
    
      
    },


    //弹框关闭
    closeHandle() {
      this.$emit("closeHandle");
    },
   // 确定修改
    onSure() {
      //  this.$refs.formRef[0].validate(valid => {
      //     console.log(valid)
      //  })
        const params = {
          createDate:new Date(),
          meetingId: this.rowData.tdmId,
          userId: this.userInfo,
          list: this.qdList.concat(this.newManData)
        } 
      // call api
      this.m_apiFn(addMeetingAutograph,params).then(resp => {
          if(resp.statusCode === '200') {
            this.$message.success(resp.message);
            this.$emit("successClose");
          }
      })       
     
    },
    // 会议签到
    onSubmit() {
      let obj = {}
      // call api
      
        // this.newManData.push(obj)
      const params = {
        createDate:new Date(),
        meetingId: this.rowData.tdmId,
        userId: this.userInfo,
        list: this.qdList
      }
      this.m_apiFn(addMeetingAutograph,params).then(resp => {
        if(resp.statusCode === '200') {
          this.$message.success("签到成功");
          this.$emit("successClose");
        }
      })
         
      
 
    },
    //   新增会议人员
    addNewMan() {
      this.newManData.push({
        userName: '',
        orgName: '',
        phone: '',
        isZry: '1',
      });
      this.xzryFormConfig = this.m_copy(xzryFormConfig)
      this.xzryFormData = this.m_copy(xzryFormData)
    },
    // 删除会议人员
    deleteNewMan(e, i) {
      // console.log(e, i, 2999999999);
      this.newManData.splice(i, 1);
    },



  },
  mounted() {
    // this.getTableClientHeight();
  }
};
</script>
<style lang="less" scoped>
.minuTitle {
  background-color: #e3e8e9;
  height: 50px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 16px;
  font-weight: bold;
}
.newButtons {
  display: flex;
  justify-content: flex-end;
}
.el-form--inline .el-form-item {
  line-height: 46px;
  margin-right: 18px !important;
  margin-bottom: 0 !important;
}
.newMan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin: 10px;
  border-bottom: 1px solid #e3e8e9;
}
</style>
