<template>
  <section>
    <hyNewModal  :dialogVisible="dialogVisible" :showClose="true" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" :width="width" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="用餐日期">
           <el-radio-group v-model="form.dinnerDate" @change="changeRadio()" disabled>
            <el-radio-button border size="small" v-for="(item) in haveMealData" :key="item" :label="item"></el-radio-button>
            </el-radio-group>
          <!-- <el-date-picker type="date" value-format="yyyy-MM-dd"  v-model="form.dinnerDate" placehodel="选择日期"  :picker-options="pickerOptions"></el-date-picker > -->
        </el-form-item>
         <el-form-item label="用户信息" prop="userName">
          <el-input v-model="form.userInfo" placehodel="姓名" disabled/>
        </el-form-item>
        <el-form-item label="用餐类型 (可多选)" prop="ycType" >
          <!-- <el-checkbox-group v-model="form.group"> -->
            <div style="display:flex;flex-direction: column;">
              <div v-for="(item,index) in haveMealsBox" :key="index" class="flexDiv">
                <el-button :type="item.checked?'primary':''" class="spliceButton" @click="typeChange(item)">{{item.label}}</el-button>
                <el-input-number  class="special"  v-model="item.num" v-if="item.checked" :min="1" :step="1" :precision="0"></el-input-number> 
              </div>
            </div>
        
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :row="4"  v-model="form.remark" :maxlength="100" show-word-limit placehodel="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="medium" @click="cancle">取消</el-button>
        <el-button type="primary" size="medium" @click="confirm">确定</el-button>
      </template>
    </hyNewModal>
  </section>
</template>
<script>

import { getDictTree  } from "@/api/common.js";
import { insertMeal,queryMeal,updateMeal,queryMealDate  } from "@/api/szhApi/haveMeals.js";
import common from '@/utils/common.js'
export default {
  name: "haveMeals", // 用餐填报
  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => "用餐填报"
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    width:{
      type: String,
      default: () => "960px"
    },
    role:{
       type: String,
      default: () => "0"
    }
  },
  data() {
     const typeValidator=(rule,value,callback)=>{
       if(!this.form.ycType){
         callback(new Error('用餐类型不能为空'))
       }else{
         callback()
       }
     };
    return {
      // 禁用
      pickerOptions:{
        disabledDate(time){
          let nowTime=new Date(new Date().toLocaleDateString()).getTime()
          if(new Date().getTime()<new Date(new Date().toLocaleDateString()+" 20:00:00").getTime()){
            return time.getTime()<nowTime
          }else{
            return time.getTime()<Date.now()
          }
        }
      },
      form:{
        userInfo:'',
        breakfastNum: "",
        dinnerDate: "",
        dinnerNum: "",
        isTb: "",
        lunchNum: "",
        remark: "",
        tel: "",
        userName: "",
        ycType:''
      },
      haveMealData:[],//天数
      haveMealsBox:[
        {value:'breakfastNum',label:'早餐',checked:false,num:1},
        {value:'lunchNum',label:'午餐',checked:false,num:1},
        {value:'dinnerNum',label:'晚餐',checked:false,num:1},
      ],
      rules:{
        userName:[{
          required:true,message:'用户信息不能为空',trigger:'blur'
        }],
        ycType:[{
          validator:typeValidator,trigger:'blur'
        }]
      },
      isTb:false,//是否填报
    };
  },
  mounted () {
    // this.queryMealDate()
    
    this.getQueryMeal()
  },
  methods: {
        // 获取日期
    // queryMealDate() {
      // this.m_apiFn(queryMealDate, {
      //   meetingId: this.rowData.tdmId
      // }).then(res => {
      //   if (res.result) {
      //     this.haveMealData = this.m_copy(res.result);
      //   }
      // });
    // },
    changeRadio(){

    },
    typeChange(item){
      item.checked=!item.checked
      let resArr=this.haveMealsBox.filter(item=>item.checked)
      if(resArr.length>0){
        this.form.ycType='1'
      }else{
        this.form.ycType=''
      }
      this.$refs.form.validateField('ycType')
    },
    // 获取详情
    getQueryMeal(){
      let params={
      }
       this.m_apiFn(queryMeal)(params).then(res => {
        if (res.result) {
          this.isTb=res.result.isTb=='0'?false:true
          Object.assign(this.form,res.result)
          this.form.userInfo=res.result.professorNumber+'/'+res.result.userName
          // debugger
          if(new Date().getTime()<new Date(new Date().toLocaleDateString()+" 20:00:00").getTime()){
            this.form.dinnerDate=common.dateFormat('yyyy-MM-dd',new Date())
          }else{
            let day=new Date()
            day.setTime(day.getTime()+3600*24000)
            this.form.dinnerDate=common.dateFormat('yyyy-MM-dd',day)
          }
          this.haveMealData=[this.form.dinnerDate]
          if(this.isTb){
            this.editList()
          }          
        }
      });
    },
    editList(){
      // debugger
    this.haveMealsBox.forEach(item=>{
        if(this.form.breakfastNum>0&&item.value=='breakfastNum'){
          item.checked=true
          item.num=this.form.breakfastNum
        }
        if(this.form.lunchNum>0&&item.value=='lunchNum'){
          item.checked=true
          item.num=this.form.lunchNum
        }
        if(this.form.dinnerNum>0&&item.value=='dinnerNum'){
          item.checked=true
          item.num=this.form.dinnerNum
        }
      })
      let resArr=this.haveMealsBox.filter(item=>item.checked)
      if(resArr.length>0){
        this.form.ycType='1'
      }else{
        this.form.ycType=''
      }
    },
    editForm(obj,name){
      if(obj.value==name){
        this.form[name]=obj.num
      }
    },
    // 确定
    confirm(){

      let resArr=this.haveMealsBox.filter(item=>item.checked)
      if(resArr.length>0){
       resArr= resArr.map(item=>{
          this.editForm(item,'breakfastNum');
          this.editForm(item,'lunchNum');
          this.editForm(item,'dinnerNum');
          return item
        })
      }
      this.$nextTick(()=>{
        this.$refs.form.clearValidate()
        this.$refs.form.validate((valid)=>{
          if(valid){
            if(this.isTb){
              this.updateMeal()
            }else{
              this.addInsertMeal()
            }

          }
        })
      })
    },
    // 添加
    addInsertMeal(){
      let params={
        ...this.form,
        accountType:this.role,
        dinnerNum: this.haveMealsBox[2].checked?this.haveMealsBox[2].num:0,
        lunchNum: this.haveMealsBox[1].checked?this.haveMealsBox[1].num:0,
        breakfastNum: this.haveMealsBox[0].checked?this.haveMealsBox[0].num:0,
      }
       this.m_apiFn(insertMeal)(params).then(res => {
        if (res.result) {
          this.$message.success(res.result)
          this.$emit('closeHandle')
        }
      });
    },
    // 更新
    updateMeal(){
      let params={
        ...this.form,
        accountType:this.role,
        dinnerNum: this.haveMealsBox[2].checked?this.haveMealsBox[2].num:0,
        lunchNum: this.haveMealsBox[1].checked?this.haveMealsBox[1].num:0,
        breakfastNum: this.haveMealsBox[0].checked?this.haveMealsBox[0].num:0,
      }
       this.m_apiFn(updateMeal)(params).then(res => {
        if (res.result) {
          this.$message.success(res.result)
          this.$emit('closeHandle')
        }
      });
    },
    // 取消
    cancle(){
      this.form={},
      this.$refs.form.resetFields()
      this.$emit('closeHandle')

    },
    closeHandle() {
      this.$emit('closeHandle')
    }

  }
};
</script>
<style  scoped>
.flexDiv{
  display:flex;
  padding-top:5px;
  margin-top:5px;

} 
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width:100%
}
/* .flexDiv >>>.el-input-number{
    line-height:36px;
} */
.btn-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
} 
.el-radio-group .el-radio-button {
  border-left: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  margin: 10px;
}
.el-radio-group .el-radio-button >>> .el-radio-button__inner {
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.special{
  line-height: 30px !important;
  height: 30px !important;
}
.special >>>.el-input__inner{
  height: 32px!important;
  line-height: 30px!important;
}
.flexDiv >>>.spliceButton{
    line-height:0;
    margin-right: 40px;
    width: 60px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
