<template>
  <section>
    <div class="hy-new-search-box" ref="searchRef">
      <hyProjectForm :formConfig="searchConfig" :formData="searchData" :ifSearch="true" :isReset="true" @onSearch="onSearch" @onReset="onReset" @formSelectChange="formSelectChange">
      </hyProjectForm>
    </div>
    <div class="page-content-box" :style="{height: maxHeight + 'px'}">
      <el-collapse v-model="activeNames" @change="handleChange">
        <div v-for="(item, index) in tableData" :key="index" @click.stop="titleHandleClick(item, index)" :style="{backgroundColor: item.modify == 1 ? 'rgba(41, 139, 245, 0.15)' : 'rgba(245, 247, 250, 0.7)'}" style="margin-bottom: 8px;">
          <el-collapse-item :name="index">
            <template slot="title">
              <div class="title-left">
                <div v-if="item.professionalType == '0'" class="sign-cs">初设</div>
                <div v-else-if="item.professionalType == '1'" class="sign-gs">概设</div>
                <div class="title-message">
                  <div class="title">
                    <span class="name">{{ item.batchName }}</span>
                    <div v-if="item.modify == 1">
                      <i class="icon iconfont iconzuixin"></i>
                      <span>进行中</span>
                    </div>
                  </div>
                  <div class="message">
                    <div class="code">
                      <i class="icon iconfont iconbianhao" :style="{color: item.modify == 1 ? '#0089ee' : ''}"></i>
                      <span>{{ item.batchCode }}</span>
                    </div>
                    <div class="time">
                      <i class="icon iconfont iconshijian" :style="{color: item.modify == 1 ? '#0089ee' : ''}"></i>
                      <span>{{ item.declareStartDate }}~{{ item.declareEndDate }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="title-right">
                <div class="btn-box">
                  <div class="export" @click.stop="batchSubmit(item)">
                    <i class="icon iconfont iconpiliangxiada"></i>
                    <span>批量审核</span>
                  </div>
                  
                  <!-- <div v-if="item.modify == 1&&isSb" class="declare" @click.stop="goDeclare(item)">
                    <i class="icon iconfont icontianjia"></i>
                    <span>评审计划申报</span>
                  </div> -->
                  <!-- <div v-if="item.modify == 1" class="export" @click.stop="downloadTemp(item)">
                    <i class="icon iconfont iconzu1192"></i>
                    <span>模板下载</span>
                  </div> -->
                  <!-- <div class="export" @click.stop="typeDownloadTemp(item)">
                    <i class="icon iconfont iconzu1192"></i>
                    <span>{{businessType==='BUSINESSTYPE_KY'?'可研模板下载':businessType==='BUSINESSTYPE_CS'?'初/概设模板下载':'安全防护模板下载'}}</span>
                  </div>
                  <div v-if="item.modify == 1&&isSb"  class="export" @click.stop="importProject(item)">
                    <i class="icon iconfont iconshangchuan"></i>
                    <span>导入</span>
                  </div> -->
                  <div class="export" @click.stop="exportProject(item)">
                    <i class="icon iconfont iconzu1192"></i>
                    <span>项目导出</span>
                  </div>
                </div>
                <div v-if="item.opend" class="fold">
                  <i class="icon iconfont iconshouqi"></i>
                  <span>收起项目</span>
                </div>
                <div v-else class="fold">
                  <i class="icon iconfont iconzhankai"></i>
                  <span>查看项目</span>
                </div>
              </div>
            </template>
            <div class="project-box" @click.stop="projectBoxStopClick">
              <el-checkbox-group v-model="item.checkList">
                <el-checkbox v-for="(sub, i) in item.children" :key="i" :label="sub" :style="{backgroundColor: item.modify == 1 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(243, 244, 244, 0.5)'}">
                  <div class="project-content" @dblclick.stop="dblclick(item, sub)">
                    <div class="project-info">
                      <span class="name">
                        {{ sub.projectName }}
                        <span class="nameMessage" v-if="sub.isReject==='1'">
                          内审驳回
                        </span>
                        <!-- <span :class=" sub.analysisStatus == '1' ? 'analysisStatusOne' : sub.analysisStatus == '2' ? 'analysisStatusTwo' : sub.analysisStatus == '3' || sub.analysisStatus == '4' ? 'analysisStatusThree' : ''" v-if="sub.analysisStatus&&sub.analysisStatus != '0'">
                          {{ sub.analysisStatus == '1' ? '校核通过' : sub.analysisStatus == '2' ? '校核中' : sub.analysisStatus == '3' ? '校核不通过' : sub.analysisStatus == '4' ? '校核失败' : ''}}
                        </span> -->
                        <span :class=" sub.declareFileStatus == '2' && sub.declareFileResult == '0' ? 'analysisStatusOne' 
                            : sub.declareFileStatus == '1' ? 'analysisStatusTwo' : sub.declareFileStatus == '3' || (sub.declareFileStatus == '2' && sub.declareFileResult == '1') ? 'analysisStatusThree' : ''" >
                            {{ sub.declareFileStatus == '2' && sub.declareFileResult == '0' ? '校核通过' 
                              : sub.declareFileStatus == '1' ? '校核中' 
                              : sub.declareFileStatus == '2' && sub.declareFileResult == '1' ? '校核不通过' 
                              : sub.declareFileStatus == '3' ? '校核失败' : ''}}
                          </span>
                      </span>
                      <span class="code">{{ businessType == "BUSINESSTYPE_CS" ? sub.erpProjectCode : sub.projectCode }}（{{ sub.projectStatusName }}）</span>
                    </div>
                    <div class="project-state">
                      <div class="state-box">
                        <div v-for="(iteration, j) in sub.stateList" :key="j" class="state">
                          <div class="state-item" :style="{marginLeft: j != 0 ? '-3px' : '0'}" @click.stop="stateHandleClick(item, sub, iteration)">
                            <i v-if="iteration.state == '1'" class="icon iconfont iconwancheng"></i>
                            <i v-if="iteration.state == '2'" class="icon iconfont iconjinhangzhong"></i>
                            <i v-if="iteration.state == '3'" class="icon iconfont iconweikaishi"></i>
                            <i v-if="iteration.state == '4'" class="el-icon-circle-close"></i>
                            <span class="text">{{ iteration.text }}</span>
                          </div>
                          <div v-if="j != sub.stateList.length - 1" class="wire" :style="{backgroundColor: iteration.state == '1' ? '#5aad7a' : '#dedee0'}"></div>
                        </div>
                      </div>
                      <div class="project-btn">
                        <el-tooltip effect="dark" content="审核" placement="top">
                          <i v-if="sub.projectStatus == '18' && sub.auditStatus == '1'" class="el-icon-search" @click.stop="goExamine(item, sub)"></i>
                        </el-tooltip>

                        <!-- <el-tooltip effect="dark" content="申报材料上传" placement="top">
                          <i v-if="(sub.projectProgress == '申报' && isSb) || ((sub.projectProgress == '评审' || sub.projectProgress == '准备') && ((sub.projectStatusName =='已提报'&&sub.meetingId)||sub.projectStatusName =='已生成'||sub.projectStatusName =='预审驳回')) || sub.projectProgress == '延审'" 
                            class="icon iconfont iconshangchuan" @click.stop="materialUpload(item, sub, 'IPHONEDIY_SB')"
                          ></i>
                        </el-tooltip> -->
                        <el-tooltip effect="dark" content="收口材料上传" placement="top">
                          <i v-if="sub.projectProgress == '整改'" class="icon iconfont iconshangchuan" @click.stop="materialUpload(item, sub, 'IPHONEDIY_SK')"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="盖章收口材料上传" placement="top">
                          <i v-if="sub.projectProgress == '收口' || sub.projectProgress == '发文' || sub.projectProgress == '下达'" class="icon iconfont iconshangchuan" @click.stop="materialUpload(item, sub, 'IPHONEDIY_GZSK')"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="申报材料查看" placement="top">
                          <i v-if="(sub.projectProgress == '申报' && isSh)  || sub.projectProgress == '内审' || sub.projectProgress == '准备' || sub.projectProgress == '评审' || sub.projectProgress == '取消'" class="icon iconfont iconshenbaocailiaochakan" @click.stop="materialCheck(item, sub, 'IPHONEDIY_SB')"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="收口材料查看" placement="top">
                          <i v-if="sub.projectProgress == '收口'" class="icon iconfont iconshoukoucailiaochakan" @click.stop="materialCheck(item, sub, 'IPHONEDIY_SK')"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="盖章收口材料查看" placement="top">
                          <i v-if="sub.projectProgress == '收口' || sub.projectProgress == '发文'" class="icon iconfont icongaizhangcailiaochakan" @click.stop="materialCheck(item, sub, 'IPHONEDIY_GZSK')"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="修改" placement="top">
                          <i v-if="(sub.projectProgress == '申报' && isSb) || sub.projectProgress == '整改' || sub.projectProgress == '延审'" class="icon iconfont iconxiugai" @click.stop="editProjectInfo(item, sub)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top">
                          <i v-if="sub.projectProgress == '申报' && isSb" class="el-icon-delete" @click.stop="deleteProject(item, sub)"></i>
                        </el-tooltip>
                        <!-- 关联可研编号 -->
                        <template slot="feasibilityCode" slot-scope="scope">
                          <el-tag v-if="!scope.data.feasibilityCode" :closable="false" style="cursor: pointer;">关联可研</el-tag>
                          <el-tag class="tag" v-else-if="scope.data.feasibilityCode" closable style="cursor: pointer;" @close="deleteBh(scope.data,'2')">
                            <span class="tagSpan">{{ scope.data.feasibilityCode }}</span>
                          </el-tag>
                          <span v-else>--</span>
                        </template>
                        <el-tooltip  v-if="sub.feasibilityCode" effect="dark" content="查看可研" placement="top">
                          <i class="icon iconfont iconguanlianxuqiu" @click.stop="readKybhClick(item,sub,'2')"></i>
                        </el-tooltip>
                        <el-tooltip v-else  effect="dark" content="关联可研" placement="top">
                          <i class="icon iconfont iconguanlianxuqiu" @click.stop="glbhHandleClick(item,sub,'2')"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="评审前意见" placement="top">
                           <i v-if="sub.projectProgress == '申报'||sub.projectProgress == '内审'||sub.projectProgress == '准备'" class="icon iconfont iconpingshenqianyijian" @click.stop="checkOpinions('', item, sub)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="修改意见" placement="top">
                          <i v-if="sub.projectProgress == '评审' || sub.projectProgress == '整改' || sub.projectProgress == '取消' || sub.projectProgress == '延审'" class="icon iconfont iconxiugaiyijian" @click.stop="checkOpinions('0', item, sub)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="收口意见" placement="top">
                          <i v-if="sub.projectProgress == '收口' || sub.projectProgress == '发文' || sub.projectProgress == '下达'" class="icon iconfont iconshoukouyijianchakan" @click.stop="checkOpinions('1', item, sub)"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="item.childrenTotal > item.children.length" class="check-more" @click.stop="checkMoreData(item)">
                <span>展开更多</span>
                <i class="icon iconfont iconzhankai"></i>
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <div class="hy_two_pageBox">
      <div class="table-total">共 {{ tableTotal }} 条结果</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.rows" :total="tableTotal" :page-sizes="[20, 40, 60, 100]" layout="sizes, prev, pager, next"></el-pagination>
    </div>

    <!-- 添加项目 -->
    <addDialogTemp ref="addDialogTemp"  :businessType="businessType" @addSuccessSumbit="addSuccessSumbit"></addDialogTemp>

    <!-- 项目新增/修改弹框 -->
    <projectEdit
      v-if="projectInfoDialogVisible"
      :dialogVisible="projectInfoDialogVisible"
      :apiParams="projectInfoDialogVisibleApiParams"
      :title="projectInfoModalTitle"
      :needProjectData="needProjectData"
      :disabled="projectInfoDisabled"
      :formData="projectInfoRowData"
      :batchData="rowData"
      :submitBtnShow="submitBtnShow"
      :btnShow="true"
      page="yxProjectDeclaration"
      @closeHandle="projectInfoDialogVisible=false"
      @sureHandle="sureHandle">
    </projectEdit>

    <!--关联可研/查看可研/概设/安全编号-->
    <readAssociationNumber 
      v-if="readAssociationNumberShow" :dialogVisible="readAssociationNumberShow"  
      :title="readAssociationTitle"
      :apiParams="readAssociationApiParams"
      :batchRowData="rowData"
      :readAssociationRelationType="readAssociationRelationType"
      :readAssociationModelType="readAssociationModelType"
      :pageTypeTable="pageTypeTable" :businessType="businessType" 
      :rowData="readAssociatioRowData"
      @readAssociationSumbit="readAssociationSumbit"
      @readAssociationClose="readAssociationNumberShow=false"
    ></readAssociationNumber>

    <!-- 单个材料审核弹框 -->
    <expertReview 
      v-if="expertReviewShow" 
      @expertReviewclose="expertReviewclose" 
      :expertReviewShow="expertReviewShow" 
      expertReviewTitle="评审" 
      :batchRowData="batchRowData"
      :expertReviewData="materialScienceData"  
      :apiParams="apiParams"
      :projectType="projectType"
      :businessType="businessType"
    ></expertReview>


    <!-- 材料查看/上传弹框 -->
    <materialUpload 
      v-if="materialScienceModalShow" 
      :dialogVisible="materialScienceModalShow" 
      :title="materialScienceModalTitle" 
      :rowData="projectRowData" 
      :isMaterialUpload="isMaterialUpload" 
      :clblx="projectRowData.clblx" 
      :isSubmitBtn="isMaterialUpload&&isMaterialSubmitBtn"
      @onSubmit="materialSubmit"
      :getCommonCltjbTree="getCommonCltjbTree"
      :uploadTreeFiles="uploadTreeFiles"
      :downloadFile="downloadFile"
      :downloadFiles="downloadFiles"
      :deleteFileById="deleteFileById"
      control="digital"
      @closeHandle="materialUploadHandleClose">
    </materialUpload>

    <!-- 查看意见 -->
    <checkOpinions
      v-if="checkOpinionsModalDialogShow"
      :dialogVisible="checkOpinionsModalDialogShow"
      :rowData="opinionsProjectRowData"
      :title="checkOpinionsModalTitle"
      :yjlx="checkOpinionsModalYjlx"
      :apiParams="apiParams"
      :getPsqyj="getProjectBeforeOpinion"
      :getPsyj="revisedSuggestions"
      :projectType="projectType"
      :businessType="businessType"
      @closeHandle="checkOpinionsModalDialogShow=false"
    ></checkOpinions>
    <!-- 申报审核人信息 -->
    <hyModal v-if="applicationExaminerInfoModal" smallModel :dialogVisible="applicationExaminerInfoModal" title="查看审核人" width="600px" :ifCancle="false" @closeHandle="applicationExaminerInfoModalHandleClose">
      <div class="auditor-box">
        <div class="auditor-title">内审人信息：</div>
        <div class="auditor-content">
          <span v-for="(item, index) in auditorList" :key="index">{{ item.userId }}（{{ item.userName }}）;</span>
        </div>
      </div>
    </hyModal>

    <!-- 会议详情 -->
    <hyModal v-if="meetingInfoModal" smallModel :dialogVisible="meetingInfoModal" title="查看会议信息" width="600px" :ifCancle="false" @closeHandle="meetingInfoModalHandleClose">
      <div class="meeting-box">
        <div class="meeting-item">
          <span class="title">会议名称：</span>
          <span>{{ meetingInfo.meetingName }}</span>
        </div>
        <div class="meeting-item">
          <span class="title">会议地址：</span>
          <span>{{ meetingInfo.meetingPlace }}</span>
        </div>
        <div class="meeting-item">
          <span class="title">会议时间：</span>
          <span>{{ meetingInfo.meetingStartDate }}~{{ meetingInfo.meetingEndDate }}</span>
        </div>
      </div>
    </hyModal>

    <!-- 发文详情 -->
    <hyModal v-if="postInfoModal" smallModel :dialogVisible="postInfoModal" title="发文信息" width="600px" :ifCancle="false" @closeHandle="postInfoModalHandleClose">
      <div class="post-box">
        <div class="post-item">
          <span class="title">评审意见文号：</span>
          <span class="content">{{ projectRowData.opinionsNumber }}</span>
        </div>
        <div class="post-item">
          <span class="title">评审意见名称：</span>
          <span class="content">{{ projectRowData.opinionsName }}</span>
        </div>
      </div>
    </hyModal>

    <!-- 导入 -->
    <hyNewModal
      :smallModel="false"
      :modalTop="'300px'"
      v-if="uploadModalShow"
      :dialogVisible='uploadModalShow'
      title='导入'
      :showClose="true"
      @closeHandle="uploadModalCloseHandle"
      :ifSure="false"
      :ifCancle="false"
      width='450px'>
      <uploadFile 
        :fileName="fileName"
        :fileList="uploadFileList"
        @beforeUpload="beforeUpload"
        @uploadFile="uploadModalUploadFile"
      ></uploadFile>
    </hyNewModal>


    <!-- 模板下载 -->
    <hyModal v-if="tempDownloadModal" smallModel :dialogVisible="tempDownloadModal" title="模板下载" width="420px" :ifCancle="false" @closeHandle="tempDownloadModalHandleClose">
      <div class="temp-download-btn-box">
        <div @click.stop="tempDownload">
          <span class="temp-icon">W</span>
          <span v-if="businessType == 'BUSINESSTYPE_KY' && rowData.professionalType == '0'">初步设计模版下载</span>
          <span v-if="businessType == 'BUSINESSTYPE_KY' && rowData.professionalType == '1'">概要设计模版下载</span>
          <span v-if="businessType == 'BUSINESSTYPE_AQ'">安全防护模版下载</span>
        </div>
        <div @click.stop="importTempDownload">
          <span class="temp-icon">S</span>
          <span>导入模版下载</span>
        </div>
      </div>
    </hyModal>

    <!--下载模板弹框-->
    <hyNewModal :smallModel="true" :modalTop="'360px'" v-if="templateDownloadModelShow" :dialogVisible='templateDownloadModelShow' title='下载模板' :showClose="true" @closeHandle="templateDownloadModelClose" :ifSure="false" :ifCancle="false" width='22%'>
      <el-select style="width:100%;margin:15px 0" v-model="templateValue">
        <el-option v-for="(item,index) in templateOption" :key="index" :label="item.dataLabel" :value="item.dataVal">
        </el-option>
      </el-select>
      <div style="text-align:center;margin:15px 0;display:flex;justify-content: center;">
        <el-button style="width:150px;" @click="templateDownloadModelClose">关闭</el-button>
        <el-button style="width:150px;" type="primary" @click="templateDownload">下载</el-button>
      </div>
    </hyNewModal>



    <!--批量上传-->
    <batchImportModal
      v-if="batchImportModelShow" 
      :batchImportModelShow='batchImportModelShow' 
      :apiParams="apiParams"
      :batchRowData="batchRowData"
      @batchImportModelClose="batchImportModelClose"
      :businessType="businessType"
      :projectType="projectType"
    >
    </batchImportModal>

    <!--批量上传(有上传任务)-->
    <hyNewModal :smallModel="true" :modalTop="'360px'" v-if="batchImportTaskModelShow" :dialogVisible='batchImportTaskModelShow' title='批量上传' :showClose="true" @closeHandle="batchImportTaskModelShow=false" :ifSure="false" :ifCancle="false" width='35%'>
      <div style="margin:15px 0 30px;">当前有X个批量上传任务正在匹配,是否继续进行批量上传?</div>
      <div style="text-align:center;margin:15px 0;display:flex;justify-content: center;">
        <el-button style="width:150px;" @click="batchImportTaskModelShow=false">取消</el-button>
        <el-button style="width:150px;" type="primary" @click="nextTask">继续</el-button>
        <el-button style="width:150px;" type="primary" @click="readTask">查看详情</el-button>
      </div>
    </hyNewModal>
    <!--批量上传队列弹窗-->
    <hyNewModal v-if="batchImportQueueModelShow" :dialogVisible='batchImportQueueModelShow' title='批量上传队列' :showClose="true" @closeHandle="batchImportQueueModelShow=false" :ifSure="false" :ifCancle="false" width='70%'>
      <div class="importBlock">
        <div>
          <div
            class="filsListBlock"
            v-for="(item, index) in batchImportQueueList"
            :key="index"
          >
            <div style="display: flex;width: 100%;">
              <div class="fileListIcon">
                <i
                  style="font-size: 50px"
                  class="icon iconfont iconcailiaoshangchuan"
                ></i>
              </div>
              <div class="fileListBody">
                <div class="fileListBodyClose">
                  <div
                    :style="{
                      color:
                        item.stateName === '正在匹配'
                          ? '#409eff'
                          : item.stateName === '上传完成'
                          ? '#67C23A'
                          : '#F56C6C',
                    }"
                  >
                    {{ item.stateName }}
                  </div>
                  <div style="margin-left: 8px">
                    <i
                      style="cursor: pointer; font-size: 16px"
                      class="el-icon-circle-close"
                      @click="delQueueList(item, index)"
                    ></i>
                  </div>
                </div>
                <div>
                  <div><span>{{ item.name }}</span><span style="display:inline-block;margin-left:10px">上传时间:{{ item.time }}</span></div>
                </div>
              </div>
            </div>
            <div v-if="item.stateName === '上传完成'" class="successBlock">
              <div>匹配上传结果说明:</div>
              <div>本次上传材料XX个,匹配成功XX个,未匹配XX个,上传失败XX个,点击查看详情可查看上传文件的错误原因</div>
              <div style="text-align:center;margin:15px 0;display:flex;justify-content: center;">
                <el-button size="mini" style="width:150px;" @click="batchImportQueueSubmit">确认</el-button>
                <el-button size="mini" style="width:150px;" type="primary" @click="readQueueDetail">查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </hyNewModal>

    <!-- 上传详情弹窗 -->
    <hyModal
      :modalTop="'20px'"
      :showClose="true"
      v-if="reviewRecordModalShow"
      :dialogVisible="reviewRecordModalShow"
      :title="'上传详情'"
      @closeHandle="reviewRecordModalShow=false"
      :ifSure="false"
      :ifCancle="false"
      width="80%"
      :modalAppendToBody="true"
      :appendToBody="true"
    >
      <batchImportDetail
        @reviewRecordOnCancle="reviewRecordModalShow=false"
        :batchRowData="batchRowData"
        :businessType="businessType"
        :projectType="projectType"
      ></batchImportDetail>
    </hyModal>

    <!-- <materialUploadModel
      :materialUploadModalShow="materialUploadModalShow"
      :apiParams="apiParams"
      :batchRowData="batchRowData"
      :projectRowData="projectRowData"
      :businessType="businessType"
      :projectType="projectType"
      @materialUploadModalShowCancle="materialUploadModalShow=false"
    ></materialUploadModel> -->

    <!--批量预审-->
    <batchPreReview v-if="batchPreReviewShow" :apiParams="apiParams" :batchPreReviewShow="batchPreReviewShow" :batchRowData="batchRowData" @batchPreReviewSubmit="batchPreReviewSubmit" @batchPreReviewCancle="batchPreReviewShow=false" ></batchPreReview>

    <!-- newMaterialUploadModel 组件未接入，暂注释
    <newMaterialUploadModel
      v-if="materialUploadModalShow" 
      :dialogVisible="materialUploadModalShow" 
      :levelNum="levelNum"
      :apiParams="projectInfoDialogVisibleApiParams"
      :batchRowData="batchRowData"
      :rowData="projectRowData" 
      :isMaterialUpload="isMaterialUpload" 
      :materialViewing="materialViewing"
      :submitBtnShow="submitBtnShow" 
      :clblx="projectRowData.clblx" 
      :isSaveBtn="isSaveBtn"
      :isActive="isActive"
      :isSubmitBtn="isMaterialUpload&&isMaterialSubmitBtn"
      @newMaterialUploadSureHandle="newMaterialUploadSureHandle"
      :getCommonCltjbTree="getCommonCltjbTree"
      :uploadTreeFiles="uploadTreeFiles"
      :downloadFile="downloadFile"
      :downloadFiles="downloadFiles"
      :deleteFileById="deleteFileById"
      control="digital"
      :projectDisabled="projectInfoDisabled"
      @materialUploadModalShowCancle="newMaterialUploadSureHandle"
    ></newMaterialUploadModel>
    -->

  </section>
</template>
<script>
import {                       
  processProjectMeasure,
} from '@/api/workCalculate.js';
import {
  getAuditorByPart,
  downloadTempApi,
} from "@/api/szhApi/csSzhInternetCsConstruction.js";
import { selectBatchList,getBatchListForProject,queryMeetingInfoByProjectCode,reqRecallCloseProject,
getBatchListForProjectData,getProjectListData,
 getProjectList, importInProject, submitProject} from "@/api/szhApi/csProjectInternalAudit.js";
 import { getRelationalProjectList,saveRelationalProject,deleteRelationalProject,exportProject} from '@/api/szhApi/csProjectInternalAudit.js'



 
 import { getProjectBeforeOpinion, revisedSuggestions } from "@/api/szhApi/common.js";
 import {
  getCommonCltjbTree,
  uploadTreeFiles,
  downloadFile,
  downloadFiles,
  deleteFileById,
  downloadClbModel,
  getUserRole,
  delTable,
  getDictTree,
} from "@/api/common.js";

import {
  searchConfig,
  searchData,
  stateListOne,
  stateListTwo,
  stateListThree
} from "./config.js";
import projectEdit from "../common/projectEdit/projectEdit.vue";
import addDialogTemp from "./addDialogTemp/addDialogTemp.vue";
import materialUpload from "../common/materialUpload/materialUpload.vue";
import checkOpinions from "../common/checkOpinions/checkOpinions.vue";
import readAssociationNumber from "../common/readAssociationNumber/readAssociationNumber.vue";
import expertReview from "./expertReview.vue";
import uploadFile from "@/pages/public/uploadFile.vue";
import batchImportModal from "./batchImportModal/batchImportModal.vue";
import batchImportDetail from "./batchImportModal/batchImportDetail.vue";
import materialUploadModel from "./materialUploadModel/materialUpload.vue";
import batchPreReview from './batchPreReview/batchPreReview.vue'
// import newMaterialUploadModel from "@/pages/szh_base/cs_base/csSzhProjectDeclaration/newMaterialUploadModel/newMaterialUploadModel.vue";
import store from "@/store";
const { userId } = store.state;

export default {
  name: "csProjectInternalAudit", // 项目内审

  components: {
    addDialogTemp,
    materialUploadModel,
    checkOpinions,
    readAssociationNumber,
    projectEdit,
    expertReview,
    uploadFile,
    batchImportModal,
    batchImportDetail,
    materialUpload,
    batchPreReview,
    // newMaterialUploadModel
  },

  /**
   * @param businessType 业务类型
   * @param pageName 页面
   */
  props: {
    pageTypeTable: {
      type: String,
      default: "csProjectInternalAudit"
    },
    pageType: {
      type: String,
      default: () => "xmns"
    },
    businessType: {
      type: String,
      default: "BUSINESSTYPE_CS"
    },
    pageName: {
      type: String,
      default: "csProjectInternalAudit"
    },
    projectType: {
      type: String,
      default: () => "PROJECTTYPE_XXH"
    },
  },

  data() {
    return {
      apiParams: {
        pageTypeTable: this.pageTypeTable,
        projectType: this.projectType,
        businessType: this.businessType,
        configType: "1",
        pageType:this.pageType,
      },
      searchConfig, // 搜索配置
      searchData: this.m_copy(searchData), // 搜索条件
      tableData: [], // 批次数据
      tableTotal: 0, // 批次总数
      activeNames: [0], // 默认展开项
      stateListOne,
      stateListTwo,
      stateListThree,
      maxHeight: 0, // 页面最大高度
      rowData: {}, // 批次行数据
      addModalType: "", // add组件类型
      control: "construction", // 接口地址
      projectRowData: {}, // 项目行数据
      applicationExaminerInfoModal: false, // 申报审核人信息
      meetingInfoModal: false, // 会议信息弹窗
      auditorList: [], // 审核人列表
      meetingInfo: {}, // 会议信息
      postInfoModal: false, // 发文信息
      isSh: false, // 是否审核角色
      isSb: false, // 是否申报角色
      sign: "", // 标记-初概设关联可研
      tempDownloadModal: false, // 模板下载
      //查看关联可研/初概设/安全编号
      readAssociationNumberShow:false,
      readAssociationRelationType:"",
      readAssociationTitle:"",
      readAssociatioRowData:{},
      readAssociationApiParams:{},
      // 评审前意见/修改意见
      checkOpinionsModalDialogShow:false,
      checkOpinionsModalTitle:"",
      opinionsProjectRowData:"",
      checkOpinionsModalYjlx:"",
      
      getProjectBeforeOpinion,
      revisedSuggestions,
      //项目修改/查看
      projectInfoDialogVisible:false,
      projectInfoDialogVisibleApiParams:{},
      projectInfoModalTitle:"",
      projectInfoDisabled: false,
      projectInfoRowData: {},
      needProjectData:true,
      submitBtnShow: false,
      // 单个材料审核弹框
      expertReviewShow:false,
      materialScienceData:{},
      // 材料查看/上传弹框
      materialScienceModalShow:false,
      materialScienceModalTitle: '',
      isMaterialUpload:false,
      isMaterialSubmitBtn:false,
      getCommonCltjbTree,
      uploadTreeFiles,
      downloadFile,
      downloadFiles,
      deleteFileById,
      // 权限
      // 导入弹框
      uploadModalShow:false,
      fileName:"",
      files:"",
      uploadFileList:[],
      //下载模板弹框
      batchRowData:{},
      templateDownloadModelShow: false,
      templateValue: "",
      templateOption: [],
      aqbhModalShow: false,
      associateAqModal: false,
      //批量上传弹框
      fileStep:1,
      batchImportModelShow:false,
      batchImportStateList:[
        {name:"上传材料",status:"2"},
        {name:"材料匹配上传",status:"0"},
        {name:"上传详情",status:"0"},
      ],
      fileType:"zip,pdf,ipg,png,gif,bmp,tif,jpeg,doc,docx,mps,mptdot,dotx,docm,txt,xls,xlsx,et,ett,xlt,xlsm,xltx,xtm,ppt,ptx,dpx,dpt,pps,pot,rar",
      timer:null,
      num:0,
      nextBtnShow:false,
      //批量上传(有上传任务时)
      batchImportTaskModelShow:false,
      //批量上传队列弹窗
      batchImportQueueModelShow:false,
      batchImportQueueList:[
        {name:"杭州智能峰谷电1",time:"2024-05-25",stateName:"上传完成"},
        {name:"杭州智能峰谷电2",time:"2024-06-25",stateName:"正在匹配"},
        {name:"杭州智能峰谷电3",time:"2024-07-25",stateName:"正在匹配"},
      ],
      //[评审记录弹窗]
      reviewRecordModalShow: false,
      //材料上传
      materialUploadModalShow:false,
      //批量内审
      batchPreReviewShow:false,


      //智能校核
      // materialUploadModalShow:false,
      // isMaterialUpload:false,
      // isMaterialSubmitBtn:false,
      // getCommonCltjbTree,
      // uploadTreeFiles,
      // downloadFile,
      // downloadFiles,
      // deleteFileById,
      // projectInfoDisabled:false,
      levelNum:'3',
      materialViewing:false,
      submitBtnShow:false,
      isSaveBtn:false,
      isActive:false,
    };
  },

  mounted() {
    this.getUserRole();
    this.getTableClientHeight();
    this.getSearchBatchList();
    this.getTableData();
  },

  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer)
    }
    this.timer=null
  },

  methods: {
    // 获取用户角色
   async getUserRole() {
      const param = {
        userId,
        control: this.control,
        businessType:this.businessType,
        projectType:this.projectType
      };
      let res=await this.m_apiFn(getUserRole)(param)
          if (res && res.result && res.result.length > 0) {
            let roles = [];
            for (const iterator of res.result) {
              roles.push(iterator.code);
            }
            let userRoleId = roles.join(",");

            if (this.businessType == "BUSINESSTYPE_KY") {
              if (
                // userRoleId.includes("SB_CS_XXH") ||
                // userRoleId.includes("SBSH_CS_XXH") ||
                // userRoleId.includes("QSBSH_CS_XXH")
                userRoleId.includes("SB_CS") ||
                userRoleId.includes("QSB_CS")
              ) {
                this.isSb = true;
              }

              if (
                // userRoleId.includes("SH_CS_XXH") ||
                // userRoleId.includes("SBSH_CS_XXH") ||
                // userRoleId.includes("QSBSH_CS_XXH")
                userRoleId.includes("SBSH_CS") ||
                userRoleId.includes("QSBSH_CS")
              ) {
                this.isSh = true;
              }
            }

            if (this.businessType == "BUSINESSTYPE_AQ") {
              if (
                // userRoleId.includes("SB_AQ_XXH") ||
                // userRoleId.includes("SBSH_AQ_XXH") ||
                // userRoleId.includes("QSBSH_AQ_XXH")
                userRoleId.includes("SB_AQ") ||
                userRoleId.includes("QSB_AQ")
              ) {
                this.isSb = true;
              }

              if (
                // userRoleId.includes("SH_AQ_XXH") ||
                // userRoleId.includes("SBSH_AQ_XXH") ||
                // userRoleId.includes("QSBSH_AQ_XXH")
                userRoleId.includes("SBSH_AQ") ||
                userRoleId.includes("QSBSH_AQ")
              ) {
                this.isSh = true;
              }
            }
          }
    },


    // 批次名称
    async getSearchBatchList() {
      const params = {
        projectType: "PROJECTTYPE_XXH",
        businessType: this.businessType,
        batchYear: this.searchData.batchYear,
        control: this.control
      };
      let resp= await this.m_apiFn(selectBatchList)(params)
      if (resp && resp.result) {
        for (const iterator of this.searchConfig) {
          if (iterator.key === "batchCodeStr") {
            iterator.options = resp.result
            iterator.options.unshift({ name: "全部", value: "" });
          }
        }
      }
    },

    // 查询
    onSearch(e) {
      this.searchData = Object.assign(this.searchData, e, {
        page: 1
      });
      this.getTableData();
    },

    // 重置
    onReset() {
      this.searchData = this.m_copy(searchData);
      this.getTableData();
      this.getSearchBatchList();
    },

    // 查询下拉
    formSelectChange(key, v) {
      if (key === "batchYear") {
        this.searchData.batchCodeStr = [""];
        this.getSearchBatchList();
      }
    },

    // 获取数据列表
   async getTableData() { 
      this.activeNames = [0];

      this.searchData = Object.assign({}, this.searchData, {
        projectType: this.projectType,
        businessType: this.businessType,
        batchStatus: "1",
        pageType: "xmns",
        skType: "0"
      });
      let params={... this.searchData}
      params.batchCodeStr=params.batchCodeStr.toString()
      let res=await this.m_apiFn(getBatchListForProject)(params)
          if (
            res &&
            res.result &&
            res.result.rows &&
            res.result.rows.length > 0
          ) {
            this.tableData = res.result.rows.map((item, index) => {
              if (index == 0) {
                item.opend = true;
              } else {
                item.opend = false;
              }
              item.children = [];
              item.childrenTotal = 0;
              item.childrenPage = 1;
              item.checkList = [];
              return item;
            });
            this.tableTotal = res.result.total;
            this.getProjectList(this.tableData[0], 5);
          } else {
            this.tableData = [];
            this.tableTotal = 0;
          }
    },

    // 获取项目列表
   async getProjectList(row, rows) {
      const param = {
        batchCode: row.batchCode,
        professionalType: row.professionalType,
        control: this.control,
        page: row.childrenPage,
        projectQuery:this.searchData.projectQuery,
        rows: rows,
        configType:'1',
        ...this.apiParams,
      };
      let res=await this.m_apiFn(getProjectList)(param)
      if (
        res &&
        res.result &&
        res.result.rows &&
        res.result.rows.length > 0
      ) {
        let rows = res.result.rows.map(item => {
          let list = [];
          if (item.projectProgress == "取消") {
            list = this.m_copy(stateListTwo);
          } else if (item.projectProgress == "延审") {
            list = this.m_copy(stateListThree);
          } else if (item.projectProgress == "下达") {
            list = this.m_copy(stateListOne);
          } else {
            list = this.m_copy(stateListOne);
            const index = list.findIndex(i => i.text == item.projectProgress);
            for (let j = 0; j < list.length; j++) {
              const element = list[j];
              if (j < index) {
                element.state = "1";
              }
              if (j == index) {
                element.state = "2";
              }
              if (j > index) {
                element.state = "3";
              }
            }
          }
          item.stateList = list;
          return item;
        });
        row.children = row.children.concat(rows);
        row.childrenTotal = res.result.total;
      }
    },

    // 每页显示条数监听
    handleSizeChange(e) {
      this.searchData.page = 1;
      this.searchData.rows = e;
      this.getTableData();
    },

    // 页码监听
    handleCurrentChange(e) {
      this.searchData.page = e;
      this.getTableData();
    },

    // 展开监听
    handleChange(val) {},

    // 批次展开监听
    titleHandleClick(item, index) {
      item.opend = !item.opend;
      if (item.opend) {
        this.getProjectList(item, 5);
      } else {
        item.children = [];
        item.childrenTotal = 0;
        item.childrenPage = 1;
        item.checkList = [];
      }
    },

    // 阻止展开事件
    projectBoxStopClick() {},

    // 查看更多数据
    checkMoreData(item) {
      item.childrenPage++;
      this.getProjectList(item, 5);
    },



    //批量上传
    batchImport(item){
      this.batchImportTaskModelShow=true

      return
      this.batchRowData={...item}
      this.batchImportModelShow=true
    },
    batchImportModelClose(){
      this.batchImportModelShow=false
    },
    //批量上传(有任务时)继续按钮
    nextTask(){

    },
    //批量上传(有任务时)查看详情
    readTask(){
      this.batchImportTaskModelShow=false
      this.batchImportQueueModelShow=true
    },
    
    //批量上传队列弹窗删除文件
    delQueueList(){
      // 上传完成”状态的显示该按钮，点击按钮后，本条批量上传记录不会在显示再批量上传队列弹窗中。
    },
    //队列弹窗确认
    batchImportQueueSubmit(){
      // 上传完成”状态的显示该按钮，点击按钮后，本条批量上传记录不会在显示再批量上传队列弹窗中。
    },
    //队列弹窗查看详情
    readQueueDetail(){
      this.reviewRecordModalShow=true
    },
    


    // 评审计划申报
    goDeclare(row) {
      let params = {
        creatProjrctModalShow: true,
        popTitle: "添加项目",
        popType: "creatProject",
        popFormData: row,
        relationStatus:'0',
        pageTypeTable: "",
        pageType:"xmns",
      };
      if(this.businessType==="BUSINESSTYPE_KY"){
        params.pageTypeTable="csSzhProjectDeclaration"
      }else if(this.businessType==="BUSINESSTYPE_AQ"){
        params.pageTypeTable="aqSzhProjectDeclaration"
      }
      this.rowData=row
      this.$refs.addDialogTemp.open(params);
    },

    // 添加项目成功回调
    addSuccessSumbit() {
      const rows = this.rowData.children.length + 1;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
    },

    // 双击项目
    dblclick(item, sub) {
      if (
        sub.projectStatusName == "已生成" ||
        sub.projectStatusName == "预审驳回" ||
        sub.projectStatusName == "延审" ||
        sub.projectStatusName == "审定"
      ) {
        // 修改
        this.editProjectInfo(item, sub);
      } else {
        // 查看
        this.checkProjectInfo(item, sub);
      }
    },

    // 修改项目信息
    editProjectInfo(item, sub) {
  /*     this.submitBtnShow=true
      this.projectInfoDisabled=false
      this.submitBtnShow=true
      this.projectInfoModalTitle="修改"
      this.rowData=item
      this.projectInfoRowData={...sub}
      this.projectInfoDialogVisible = true
      this.projectInfoDialogVisibleApiParams={...this.apiParams}
      if(this.businessType == "BUSINESSTYPE_CS"){
        this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
      }else{
        this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
      } */
      this.projectInfoDialogVisibleApiParams={...this.apiParams}
      if(this.businessType == "BUSINESSTYPE_CS"){
        this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
      }else{
        this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
      }
      this.rowData=item
      this.isMaterialUpload=true
      this.isMaterialSubmitBtn=false
      this.projectInfoDisabled=false
      this.submitBtnShow=true
      this.materialViewing=false  //  节点 2 是否为查看状态
      this.batchRowData=item
      this.projectRowData={...item,...sub}
      this.projectRowData.xmbh=sub.projectCode // 编号
      this.projectRowData.zylx=sub.professionalType  // 专业类型
      this.projectRowData.xmlx=this.projectType         // 项目类型
      this.projectRowData.ywlx=this.businessType
      this.projectRowData.clblx= "IPHONEDIY_SB"
      this.isSaveBtn = true
      this.levelNum="1"
      // this.isActive="check"
      // if(this.pageType == 'xmsb'){
      //   if(sub.analysisStatus == '1' || sub.analysisStatus == '3'){
      //     this.isActive="edit"
      //   }else{
      //     this.isActive="check"
      //   }
      // }else if(this.pageType == 'xmsk'){
      //   if(sub.skAnalysisStatus == '1' || sub.skAnalysisStatus == '3'){
      //     this.isActive="edit"
      //   }else{
      //     this.isActive="check"
      //   }
      // }
      if(this.projectRowData.clblx == 'IPHONEDIY_SB'){
        if((sub.declareFileStatus == '2' && sub.declareFileResult == '0') || (sub.declareFileStatus == '2' && sub.declareFileResult == '1')){
          this.isActive="edit"
        }else{
          this.isActive="check"
        }
      }else if(this.projectRowData.clblx == 'IPHONEDIY_SK'){
        if((sub.closeupFileStatus == '2' && sub.closeupFileResult == '0') || (sub.closeupFileStatus == '2' && sub.closeupFileResult == '1')){
          this.isActive="edit"
        }else{
          this.isActive="check"
        }
      }
      // this.apiParams.businessType="BUSINESSTYPE_KY"
      this.materialUploadModalShow=true
    },

    // 查看项目信息
    checkProjectInfo(item, sub) {
  /*     this.projectInfoDisabled=true
      this.submitBtnShow=false
      this.projectInfoModalTitle="查看"
      this.rowData=item
      this.projectInfoRowData={...sub}
      this.projectInfoDialogVisible = true
      this.projectInfoDialogVisibleApiParams={...this.apiParams}
      if(this.businessType == "BUSINESSTYPE_CS"){
        this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
      }else{
        this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
      } */
      this.projectInfoDialogVisibleApiParams={...this.apiParams}
      if(this.businessType == "BUSINESSTYPE_CS"){
        this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
      }else{
        this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
      }
      this.isSaveBtn = false // 保存按钮
      this.submitBtnShow=false  //提交按钮
      this.projectInfoDisabled=true  // 节点 1 是否为查看状态
      this.materialViewing=true  //  节点 2 是否为查看状态
      this.batchRowData=item  // 批次数据
      this.rowData=item   // 当前项数据
      this.isMaterialUpload=true
      this.isMaterialSubmitBtn=false
      this.projectRowData={...item,...sub}
      this.projectRowData.xmbh=sub.projectCode // 编号
      this.projectRowData.zylx=sub.professionalType  // 专业类型
      this.projectRowData.xmlx=this.projectType         // 项目类型
      this.projectRowData.ywlx=this.businessType
      // this.projectRowData.clblx="IPHONEDIY_SB"
      this.projectRowData.clblx= "IPHONEDIY_SB"
      this.levelNum="1"
      // if(sub.analysisStatus == '1' || sub.analysisStatus == '3'){
      //   this.isActive="edit"
      // }else{
      //   this.isActive="check"
      // }
      if((sub.declareFileStatus == '2' && sub.declareFileResult == '0') || (sub.declareFileStatus == '2' && sub.declareFileResult == '1')){
        this.isActive="edit"
      }else{
        this.isActive="check"
      }
     
      this.materialUploadModalShow=true
    },


    // 删除项目
    deleteProject(item, sub) {
      this.rowData = item;

      this.$confirm("此操作将永久删除该项目，是否继续？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      }).then(() => {
        let params={
          isDel: "1",
          ids: sub.trpId
        }
        this._deleteProject(Object.assign({}, params, this.apiParams, {configType: "1"}))

      }).catch(() => {});
    },
   async _deleteProject(params){
    let res= await this.m_apiFn(delTable)(params)
    if(res.statusCode==="200"){
      this.$message.success("删除成功");
      const rows = this.rowData.children.length;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
    }
   },



    //新增关联编号
    glbhHandleClick(item,row,type){
      this.readAssociationApiParams= {
        pageTypeTable: this.pageTypeTable,
        projectType: this.$store.state.yxProjectType.projectType,
        businessType: "BUSINESSTYPE_KY",
        configType: "1",
      }
      switch(type){
        case '2':
          this.readAssociationTitle="关联可研编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
          this.readAssociationApiParams.pageTypeTable="szhProjectDeclaration"
        break
        case '3':
          this.readAssociationTitle="关联初设编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
          this.readAssociationApiParams.pageTypeTable="csSzhProjectDeclaration"
        break
        case '4':
          this.readAssociationTitle="关联安全编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_AQ"
          this.readAssociationApiParams.pageTypeTable="aqSzhProjectDeclaration"
        break
      }
      
      
      this.rowData=item
      this.readAssociatioRowData={...row}
      this.readAssociationModelType="关联"
      this.readAssociationRelationType=type
      this.readAssociationNumberShow=true
    },
    readAssociationSumbit(){
      const rows = this.rowData.children.length;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
      this.readAssociationNumberShow=false
    },

    //查看关联编号
    readKybhClick(item,row,type){
       this.readAssociationApiParams= {
        pageTypeTable: this.pageTypeTable,
        projectType: this.$store.state.yxProjectType.projectType,
        businessType: "BUSINESSTYPE_KY",
        configType: "1",
      }
      switch(type){
        case '2':
          this.readAssociationTitle="查看关联可研编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
          this.readAssociationApiParams.pageTypeTable="szhProjectDeclaration"
        break
        case '3':
          this.readAssociationTitle="查看关联初设编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
          this.readAssociationApiParams.pageTypeTable="csSzhProjectDeclaration"
        break
        case '4':
          this.readAssociationTitle="查看关联安全编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_AQ"
          this.readAssociationApiParams.pageTypeTable="aqSzhProjectDeclaration"
        break
      }
    
      this.rowData=item
      this.readAssociatioRowData={...row}
      this.readAssociationModelType="查看"
      this.readAssociationRelationType=type
      this.readAssociationNumberShow=true
    },



    // 清空项目列表
    clearProjectList() {
      this.rowData.children = [];
      this.rowData.childrenTotal = 0;
      this.rowData.childrenPage = 1;
      this.rowData.checkList = [];
    },

    // 审核
    goExamine(item, sub) {
      // this.rowData = item;
      this.rowData = item;
      this.batchRowData = item;
      this.materialScienceData=sub
      this.expertReviewShow = true
    },

    // 审核弹窗关闭
    expertReviewclose() {
      this.expertReviewShow = false;
      const rows = this.rowData.children.length;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
    },



    // 材料上传
    materialUpload(item, sub, clblx,clickType) {
      // this.batchRowData=item
      // this.projectRowData=sub
      // this.projectRowData.clblx=clblx
      // this.apiParams.businessType="BUSINESSTYPE_KY"
      // this.materialUploadModalShow=true
      // return

      /* this.rowData=item
      this.materialScienceModalShow=true
      this.isMaterialUpload=true
      this.isMaterialSubmitBtn=false
      this.projectRowData=sub
      this.projectRowData.xmbh=sub.projectCode // 编号
      this.projectRowData.zylx=item.professionalType  // 专业类型
      this.projectRowData.xmlx=this.projectType         // 项目类型
      this.projectRowData.ywlx=this.businessType         // 业务类型
      this.projectRowData.clblx=clblx
      if(clblx==="IPHONEDIY_SB"){
        this.projectRowData.fromPage="项目申报"
      }
      this.materialScienceModalTitle = "材料上传" */

      this.rowData=item
      this.projectInfoDialogVisibleApiParams={...this.apiParams}
      if(this.businessType == "BUSINESSTYPE_CS"){
        this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
      }else{
        this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
      }
      if(clblx==="IPHONEDIY_SB" || clblx==="IPHONEDIY_SK"){
        this.isMaterialUpload=true
        this.isMaterialSubmitBtn=false
        this.materialViewing=false
        this.projectInfoDisabled=false
        this.submitBtnShow=true
        this.batchRowData=item
        this.projectRowData={...item,...sub}
        this.projectRowData.xmbh=sub.projectCode // 编号
        this.projectRowData.zylx=sub.professionalType  // 专业类型
        this.projectRowData.xmlx=this.projectType         // 项目类型
        this.projectRowData.ywlx=this.businessType
        this.projectRowData.clblx=clblx
        this.isSaveBtn = true
        this.levelNum="2"
        // if(clblx==="IPHONEDIY_SB"){
        //   if(sub.analysisStatus == '1' || sub.analysisStatus == '3'){
        //     this.isActive="edit"
        //   }else{
        //     this.isActive="check"
        //   }
        // }else if(clblx==="IPHONEDIY_SK"){
        //   if(sub.skAnalysisStatus == '1' || sub.skAnalysisStatus == '3'){
        //     this.isActive="edit"
        //   }else{
        //     this.isActive="check"
        //   }
        // }
        if(clblx == 'IPHONEDIY_SB'){
          if((sub.declareFileStatus == '2' && sub.declareFileResult == '0') || (sub.declareFileStatus == '2' && sub.declareFileResult == '1')){
            this.isActive="edit"
          }else{
            this.isActive="check"
          }
        }else if(clblx == 'IPHONEDIY_SK'){
          if((sub.closeupFileStatus == '2' && sub.closeupFileResult == '0') || (sub.closeupFileStatus == '2' && sub.closeupFileResult == '1')){
            this.isActive="edit"
          }else{
            this.isActive="check"
          }
        }
        

        if(clickType){
          this.levelNum=clickType
        }
        // this.apiParams.businessType="BUSINESSTYPE_KY"
        this.materialUploadModalShow=true
        return
      }
      this.materialScienceModalShow=true
      this.isMaterialUpload=true
      this.isMaterialSubmitBtn=false
      this.projectRowData={...item,...sub}
      this.projectRowData.xmbh=sub.projectCode // 编号
      this.projectRowData.zylx=item.professionalType  // 专业类型
      this.projectRowData.xmlx=this.projectType         // 项目类型
      this.projectRowData.ywlx=this.businessType         // 业务类型
      this.projectRowData.clblx=clblx

      if(clblx==="IPHONEDIY_SB"){
        this.projectRowData.fromPage="项目申报"
      }
      this.materialScienceModalTitle = "材料上传"
    },

    // 收口材料
    materialCheck(item, sub, clblx) {
      /* this.materialScienceModalShow=true
      this.isMaterialUpload=false
      this.isMaterialSubmitBtn=false
      this.projectRowData=sub
      this.projectRowData.xmbh=sub.projectCode // 编号
      this.projectRowData.zylx=item.professionalType  // 专业类型
      this.projectRowData.xmlx=this.projectType         // 项目类型
      this.projectRowData.ywlx=this.businessType           // 业务类型
      this.projectRowData.clblx=clblx
      this.materialScienceModalTitle = '材料查看' */
      
      if(clblx == 'IPHONEDIY_GZSK'){
        this.materialScienceModalShow=true
        this.isMaterialUpload=false
        this.isMaterialSubmitBtn=false
        this.projectRowData=sub
        this.projectRowData.xmbh=sub.projectCode // 编号
        this.projectRowData.zylx=item.professionalType  // 专业类型
        this.projectRowData.xmlx=this.projectType         // 项目类型
        this.projectRowData.ywlx=this.businessType           // 业务类型
        this.projectRowData.clblx=clblx
        this.materialScienceModalTitle = '材料查看'

      }else{
        this.projectInfoDialogVisibleApiParams={...this.apiParams}
        if(this.businessType == "BUSINESSTYPE_CS"){
          this.projectInfoDialogVisibleApiParams.pageTypeTable="csSzhProjectDeclaration"
        }else{
          this.projectInfoDialogVisibleApiParams.pageTypeTable="aqSzhProjectDeclaration"
        }
        this.rowData=item
        this.isMaterialUpload=true
        this.isMaterialSubmitBtn=false
        this.materialViewing = true
        this.submitBtnShow=false
        this.projectInfoDisabled=true
        this.isSaveBtn = false
        this.batchRowData=item
        this.projectRowData={...item,...sub}
        this.projectRowData.xmbh=sub.projectCode // 编号
        this.projectRowData.zylx=sub.professionalType  // 专业类型
        this.projectRowData.xmlx=this.projectType         // 项目类型
        this.projectRowData.ywlx=this.businessType
        this.projectRowData.clblx=clblx
        this.levelNum="2"
        // if(clblx == 'IPHONEDIY_SB'){
        //   if(sub.analysisStatus == '1' || sub.analysisStatus == '3'){
        //     this.isActive="edit"
        //   }else{
        //     this.isActive="check"
        //   }
        // }else if(clblx == 'IPHONEDIY_SK'){
        //   if(sub.skAnalysisStatus == '1' || sub.skAnalysisStatus == '3'){
        //     this.isActive="edit"
        //   }else{
        //     this.isActive="check"
        //   }
        // }
        if(clblx == 'IPHONEDIY_SB'){
          if((sub.declareFileStatus == '2' && sub.declareFileResult == '0') || (sub.declareFileStatus == '2' && sub.declareFileResult == '1')){
            this.isActive="edit"
          }else{
            this.isActive="check"
          }
        }else if(clblx == 'IPHONEDIY_SK'){
          if((sub.closeupFileStatus == '2' && sub.closeupFileResult == '0') || (sub.closeupFileStatus == '2' && sub.closeupFileResult == '1')){
            this.isActive="edit"
          }else{
            this.isActive="check"
          }
        }
        this.materialUploadModalShow=true
      }
    },
    //提交项目
    materialSubmit(){
      this.$confirm("确认提交？", '提示', {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "",
        iconClass: "el-icon-bell",
        center: true,
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
      .then(() => {
        let params={}
        params.id=this.projectRowData.trpId
        if(this.projectRowData.clblx==="IPHONEDIY_SK"){
          params.projectStatus="9"
        }else{
          params.projectStatus="1"
        }
        params.clblx=this.projectRowData.clblx
        this.submitPro(params)
      })
      .catch(() => {});
    },
    async submitPro(params){
      let res= await this.m_apiFn(submitProject)(params)
      if(res.statusCode==="200"){
        this.$message.success(res.result);
        this.materialScienceModalShow = false
        const rows = this.rowData.children.length;
        this.clearProjectList();
        this.getProjectList(this.rowData, rows);
      }else{
        this.$message.warning(res.result);
      }
    },
    materialUploadHandleClose(val) {
      console.log(this.rowData,'this.rowDatathis.rowData')
      this.materialScienceModalShow = false;
      if(val == "sureHandle") {
        const rows = this.rowData.children.length;
        this.clearProjectList();
        this.getProjectList(this.rowData, rows);
      }
    },


    // 状态点击
    stateHandleClick(item, sub, iteration) {
      switch (iteration.text) {
        case "申报":
          if (iteration.state == "2") {
            // 进行中
            this.materialUpload(item, sub, "IPHONEDIY_SB","1");
          } else if (iteration.state == "1") {
            // 已完成
            this.materialCheck(item, sub, "IPHONEDIY_SB");
          }
          break;
        case "内审":
          if (iteration.state == "2") {
            // 进行中
            if (sub.auditStatus == "1") {
              // 审核人
              this.goExamine(item, sub);
            } else {
              // 申报人
              this.getAuditorByPart({
                businessType: this.businessType,
                projectCompanyStr: sub.projectCompany
              })
            }
          } else if (iteration.state == "1") {
            // 已完成-查看评审前意见
            // this.checkOpinions("", item, sub);
            this.materialCheck(item, sub, "IPHONEDIY_SB");
          }
          break;
        case "准备":
          if (iteration.state == "2") {
            // 进行中
            if (sub.projectStatusName == "已提报" && !sub.meetingId) {
              // 查看评审前意见
              this.checkOpinions("", item, sub);
            } else if (sub.meetingId) {
              // 查看会议详情
              this.getMeetingInfo(sub);
            }
          } else if (iteration.state == "1") {
            // 已完成-查看会议详情
            this.getMeetingInfo(sub);
          }
          break;
        case "评审":
          if (iteration.state == "2") {
            // 进行中
            this.checkOpinions("0", item, sub);
          } else if (iteration.state == "1") {
            // 已完成
            this.checkOpinions("0", item, sub);
          }
          break;
        case "整改":
          if (iteration.state == "2") {
            // 进行中
            this.materialUpload(item, sub, "IPHONEDIY_SK");
          } else if (iteration.state == "1") {
            // 已完成
            this.materialCheck(item, sub, "IPHONEDIY_SK");
          }
          break;
        case "收口":
          if (iteration.state == "2") {
            // 进行中
            this.checkOpinions("1", item, sub);
          } else if (iteration.state == "1") {
            // 已完成
            // this.checkOpinions("1", item, sub);
            this.materialCheck(item, sub, "IPHONEDIY_SK");

          }
          break;
        case "发文":
          if (iteration.state == "2") {
            // 进行中
            this.projectRowData = sub;
            this.postInfoModal = true;
          } else if (iteration.state == "1") {
            // 已完成
            this.projectRowData = sub;
            this.postInfoModal = true;
          }
          break;
        case "取消":
          this.checkOpinions("0", item, sub);
          break;
        case "延审":
          this.materialUpload(item, sub, "IPHONEDIY_SB");
          break;
        default:
          break;
      }
    },
    async getAuditorByPart(params){
      let res=await this.m_apiFn(getAuditorByPart)(params)
      if (
        res &&
        res.statusCode == "200" &&
        res.result &&
        res.result.length
      ) {
        this.auditorList = res.result;
      }
      this.applicationExaminerInfoModal = true;
    },
    // 意见查看
    checkOpinions(yjlx,item, row) {
      this.opinionsProjectRowData = row;
      this.checkOpinionsModalYjlx = yjlx;
      switch (yjlx) {
        case "":
          this.checkOpinionsModalTitle = "评审前意见";
          break;
        case "0":
          this.checkOpinionsModalTitle = "修改意见";
          break;
        case "1":
          this.checkOpinionsModalTitle = "收口意见";
          break;
        default:
          break;
      }
      this.checkOpinionsModalDialogShow = true;
    },

    // 意见查看弹窗关闭
    checkOpinionsHandleClose() {
      this.checkOpinionsModalDialogShow = false;
    },

    // 审核人信息关闭
    applicationExaminerInfoModalHandleClose() {
      this.applicationExaminerInfoModal = false;
    },

    // 获取会议信息
    async getMeetingInfo(sub) {
      let res=await this.m_apiFn(queryMeetingInfoByProjectCode)({projectCode: sub.projectCode})
      if (res && res.statusCode == "200" && res.result) {
        this.meetingInfo = res.result;
        this.meetingInfoModal = true;
      }
    },

    // 会议信息弹窗关闭
    meetingInfoModalHandleClose() {
      this.meetingInfoModal = false;
    },

    // 发文信息
    postInfoModalHandleClose() {
      this.postInfoModal = false;
    },

    // 导入
    importProject(item) {
      this.rowData = item;
      this.uploadModalShow=true
    },
    //上传弹框关闭
    uploadModalCloseHandle(){
      this.files=""
      this.fileName=""
      this.uploadModalShow=false
    },

    beforeUpload(e){
      this.files=e
      this.fileName=e.name.split('.')[0]
    },

    //上传文件
   async uploadModalUploadFile(){
      const fileData = new FormData();
      fileData.append("files", this.files);
      fileData.append("batchCode", this.rowData.batchCode);
      fileData.append("pageType", "xmns");
      fileData.append("pageTypeTable", this.pageTypeTable);
      fileData.append("projectType", this.projectType);
      fileData.append("businessType", this.businessType);
      fileData.append("professionalType",this.rowData.professionalType);
      
      fileData.append("configType", "2");
     let res= await this.m_apiFn(importInProject)(fileData)
        if(res.statusCode==="200"){
          this.$message.success(res.message);
          this.uploadModalCloseHandle();
          // this.getTableData()
          const rows = this.rowData.children.length;
          this.clearProjectList();
          this.getProjectList(this.rowData, 5);
        }else{
          // this.$message.warning(res.message);
        }
    },

    //批量审核
    batchSubmit(item){
      this.rowData=item
      this.batchRowData=item
      const param = {
        batchCode: item.batchCode,
        professionalType: item.professionalType,
        page: 1,
        rows: 20,
        configType:'1',
        ...this.apiParams,
        projectStatusStr:"18",
      };
      this.m_apiFn(getProjectList)(param).then(res=>{
        if (res.result && res.result.rows && res.result.rows.length) {
          this.batchPreReviewShow=true
        } else {
          this.$message.warning("该批次无可审核的项目")
        }
      })
      
    },
    //批量审核弹窗确认
    batchPreReviewSubmit(){
      this.batchPreReviewShow=false
      const rows = this.rowData.children.length;
      this.clearProjectList();
      // let timer = setTimeout(() => {
        this.getProjectList(this.rowData, rows);
        // clearTimeout(timer)
        // timer = null
      // }, 2000);
      
    },


    // 导出
    async exportProject(item) {
     let downloadObj={
        ...this.apiParams,
        ...this.searchData,
        batchCode: item.batchCode,
        professionalType: item.professionalType,
        projectType: this.projectType,
        businessType: this.businessType
     }
      let list = [];
      if (item.checkList && item.checkList.length) {
        for (const iterator of item.checkList) {
          list.push(iterator.trpId);
        }
      } else if (item.children && item.children.length) {
        for (const iterator of item.children) {
          list.push(iterator.trpId);
        }
      }
      downloadObj.ids=list.toString()
      downloadObj.batchCodeStr=downloadObj.batchCodeStr.toString()
      downloadObj.type="0"
      downloadObj.configType= "2"
      let res=await this.m_apiFn(exportProject)(downloadObj)
    },

    // 下载模板
    async downloadTemp(item) {
      // this.rowData = item;
      // this.tempDownloadModal = true;
      
      let param = {
        investmentChannel: item.investmentChannel,
        professionalType: item.professionalType,
        type:"1"
      }
      let res= await this.m_apiFn(exportProject)(Object.assign({}, param, this.apiParams, {configType: "2"}))
    },

    //'可研模板下载':'初/概设模板下载':'安全防护模板下载':
    async typeDownloadTemp(item){
      this.batchRowData={...item}
      if (
        this.businessType === "BUSINESSTYPE_KY" &&
        item.professionalType !== "1"
      ) {
        let res= await this.m_apiFn(getDictTree)("APP_SZH_XMFL")
        if(res.statusCode==="200"){
          this.templateOption = res.result;
          this.templateDownloadModelShow = true;
        }
      } else {
        let downloadParams={
          ywlx: this.businessType,
          zylx: item.professionalType,
          xmlx: "PROJECTTYPE_XXH"
        }
        let res = await this.m_apiFn(downloadClbModel)(downloadParams)
      }
    },
    //下载模板
    async templateDownload() {
      if (!this.templateValue) {
        this.$message.warning("请先选择类型");
        return;
      }
      let params={
        ywlx: this.businessType,
        zylx: this.batchRowData.professionalType,
        xmfl: this.templateValue,xmlx: "PROJECTTYPE_XXH",
      }
      let res= await this.m_apiFn(downloadClbModel)(params)
    },
    //下载模板弹框关闭
    templateDownloadModelClose() {
      this.templateValue = "";
      this.templateDownloadModelShow = false;
    },

    


    // 模板下载
    tempDownloadModalHandleClose() {
      this.tempDownloadModal = false;
    },

    // 初/概设/安全模板下载
   async tempDownload() {
    let res=await this.m_apiFn(downloadClbModel)({
        ywlx: this.businessType,
        zylx: this.rowData.professionalType,
        xmlx: "PROJECTTYPE_XXH"
      })
    },

    // 导入模板下载
   async importTempDownload() {
      let param = {
        ...this.apiParams,
        professionalType: this.rowData.professionalType,
        type: "1",
        configType: "2"
      };
      await this.m_apiFn(exportProject)(param)
    },


    csFuc(row,type,title){
      let confirmTitle="确定进行项目申报工作量度量测算吗？"
      this.$confirm(`${confirmTitle}`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "",
        iconClass: "el-icon-bell",
        center: true,
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      }).then(() => {
        let params={projectCodeStr:row.projectCode,version:type}
       this.processProjectMeasure(params)
      }).catch(() => {});
    },
    async processProjectMeasure(params) {
      let res=await this.m_apiFn(processProjectMeasure)( params)
      if(res.statusCode === "200"){
        this.getProjectList(this.rowData, rows);
        this.$message.success(res.message)
      }
        
    },


    // 修改/新增
    sureHandle(val){
      this.projectInfoDialogVisible=false;
      const rows = this.rowData.children.length;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
    },

    // 页面高度动态调整
    getTableClientHeight() {
      const offsetH = document.body.offsetHeight;
      const searchRefH = this.$refs.searchRef.clientHeight;
      const tableH =
        offsetH - // 页面高度
        72 - // logo栏高度
        48 - // 菜单栏高度
        40 - // 导航栏高度
        searchRefH - // 搜索栏高度
        36 - // 分页高度
        30 - // padding
        3; // border
      this.maxHeight = tableH;
    },

    //智能校核
    //新材料提交
    newMaterialUploadSureHandle(){
      this.materialUploadModalShow = false
      console.log('2222222222')
      const rows = this.rowData.children.length;
      this.clearProjectList();
      this.getProjectList(this.rowData, rows);
    },
  }
};
</script>
<style lang="less" scoped>
.page-content-box {
  border-left: 1px solid rgba(34, 39, 52, 0.15);
  border-right: 1px solid rgba(34, 39, 52, 0.15);
  padding: 8px;
  box-sizing: border-box;
  overflow: auto;

  /deep/ .el-collapse {
    border-top: none;
    border-bottom: none;

    .el-collapse-item:last-child {
      margin-bottom: 0;

      .el-collapse-item__header {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        border-bottom: none;
        background-color: transparent;  
        height:100% !important;
        .title-left {
          display: flex;

          .sign-cs,
          .sign-gs {
            font-size: 14px;
            width: 44px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 4px;
          }

          .sign-cs {
            color: #5aad7a;
            background-color: #eef7f1;
          }

          .sign-gs {
            color: #5c98ee;
            background-color: #eef5fe;
          }

          .title-message {
            display: flex;
            flex-direction: column;
            margin-left: 8px;

            .title {
              display: flex;
              align-items: center;

              .name {
                font-size: 16px;
                color: #222734;
                height: 22px;
                line-height: 22px;
              }

              div {
                width: 44px;
                height: 17px;
                line-height: 17px;
                margin-left: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                i {
                  color: #fdf0f0;
                  margin: 0;
                }

                span {
                  position: absolute;
                  font-size: 12px;
                  color: #ee767e;
                }
              }
            }
          }

          .message {
            margin-top: 8px;
            display: flex;
            align-items: center;

            .code,
            .time {
              display: flex;
              align-items: center;
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #222734;
              opacity: 0.5;

              i {
                margin-right: 6px;
                margin-left: 0;
                font-size: 14px;
              }
            }

            .time {
              margin-left: 24px;
            }
          }
        }

        .title-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .btn-box {
            display: flex;
            align-items: center;

            .declare,
            .export {
              height: 24px;
              line-height: 24px;
              border-radius: 4px;
              padding: 0 10px;
              font-size: 14px;

              i {
                margin-left: 0;
                margin-right: 4px;
                font-size: 14px;
              }
            }

            .declare {
              background-color: #eef5fe;
              color: #5c98ee;
            }

            .export {
              background-color: #e5f8fe;
              color: #00b9ee;
              margin-left: 16px;
            }
          }

          .fold {
            height: 17px;
            line-height: 17px;
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #222734;
            opacity: 0.5;
            margin-top: 13px;

            i {
              margin-left: 0;
              margin-right: 4px;
              font-size: 14px;
            }
          }
        }

        .el-collapse-item__arrow {
          display: none;
        }
      }

      .el-collapse-item__wrap {
        border-bottom: none;
        background-color: transparent;

        .el-collapse-item__content {
          padding-bottom: 0;
          line-height: 0;
        }
      }
    }
  }

  .project-box {
    /deep/ .el-checkbox-group {
      display: flex;
      flex-direction: column;
      margin-left: 64px;
      margin-right: 12px;
      margin-bottom: 4px;

      .el-checkbox {
        display: flex;
        border-radius: 2px;
        padding: 16px;
        margin-bottom: 4px;
        margin-right: 0;
        height: 100% !important;
      }

      .el-checkbox__label {
        width: 100%;

        .project-content {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          margin-left: 8px;
          padding-left: 0;
          @media screen and (max-width: 1700px) {
            .project-info {
              width: 100% !important;
            }
          }
          .project-info {
            display: flex;
            flex-direction: column;
            width: 40%;
            .name,
            .code {
              color: #222734;
              font-size: 14px;
            }

            .name {
              white-space: normal;
              display: block;
              line-height: 14px;
              display: flex;
              align-items: center;
            }

            .code {
              opacity: 0.5;
              margin-top: 6px;
              height: 20px;
              line-height: 20px;
            }
          }
          @media screen and (max-width: 1700px) {
            .project-state {
              width: 100% !important;
            }
          }
          .project-state {
            width: 59%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .state-box {
              display: flex;
              align-items: center;

              .state {
                display: flex;
                align-items: center;

                .state-item {
                  display: flex;
                  flex-direction: column;
                  align-items: center;

                  .text {
                    font-size: 12px;
                    color: #222734;
                    margin-top: 4px;
                    height: 17px;
                    line-height: 17px;
                  }

                  i {
                    font-size: 20px;
                    margin: 0;
                    transform: scale(1);
                    transition: all 1s;
                  }

                  .iconwancheng {
                    color: #5aad7a;
                  }

                  .iconjinhangzhong {
                    color: #ffb100;
                  }

                  .iconweikaishi {
                    color: #dedee0;
                    
                    border-radius: 100%;
                    padding:5px !important;
                  }
                  .iconweikaishi:before{
                    background-color: white;
                    border-radius: 50%;
                  }

                  .el-icon-circle-close {
                    color: #ed6565;
                  }
                }

                .state-item:hover i {
                  transform: scale(1.2);
                  transition: all 1s;
                }

                .wire {
                  width: 57px;
                  height: 2px;
                  margin-top: -22px;
                  margin-left: -3px;
                }
              }
            }

            .project-btn {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-left: 40px;

              i {
                font-size: 14px;
                margin-left: 16px;
                margin-right: 0;
              }

              .iconshangchuan,
              .iconguanlianxuqiu,
              .iconshenbaocailiaochakan,
              .iconshoukoucailiaochakan,
              .icongaizhangcailiaochakan,
              .iconpingshenqianyijian,
              .iconxiugaiyijian,
              .iconshoukouyijianchakan {
                color: #00b9ee;
              }

              .iconxiugai {
                color: #298bf5;
              }

              .el-icon-delete {
                color: #ed6565;
              }

              .el-icon-search {
                color: #ffb816;
              }
            }
          }
        }
      }
    }

    .check-more {
      width: 100%;
      height: 17px;
      line-height: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(34, 39, 52, 0.5);
      font-size: 12px;
      padding-bottom: 4px;
      cursor: pointer;

      i {
        margin-left: 4px;
        margin-right: 0;
      }
    }
  }
}

.hy_two_pageBox {
  justify-content: space-between;
  border-top: 1px solid rgba(34, 39, 52, 0.15);

  .table-total {
    margin-left: 40px;
    font-size: 14px;
    color: #222734;
    opacity: 0.8;
  }
}

.auditor-box {
  display: flex;
  padding: 20px 0 40px;

  .auditor-title {
    font-weight: bold;
    line-height: 20px;
  }

  .auditor-content {
    line-height: 20px;
  }
}

.meeting-box {
  display: flex;
  flex-direction: column;
  padding: 0 0 40px;

  .meeting-item {
    margin-top: 10px;

    .title {
      font-weight: bold;
    }
  }
}

.post-box {
  display: flex;
  flex-direction: column;
  padding: 0 0 40px;

  .post-item {
    margin-top: 10px;

    .title {
      line-height: 20px;
      font-weight: bold;
    }

    .content {
      line-height: 20px;
    }
  }
}

.temp-download-btn-box {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 150px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
  }
}


.importBlock {
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px;
  margin: 30px 0 5px;
  box-sizing: border-box;
  width: 100%;
  .importBody {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .importContent {
      line-height: 45px;
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
  .filsListBlock {
    box-sizing: border-box;
    width: 100%;
    margin: 12px 0;
    padding: 5px 9px;
    border-radius: 3px;
    border: 1px solid #409eff;
    display: flex;
    flex-wrap: wrap;
    .fileListIcon {
      border-right: 1px solid #1874d7;
    }
    .fileListBody {
      width: calc(100% - 80px);
      padding: 0 15px 6px;
      box-sizing: border-box;
      .fileListBodyClose {
        display: flex;
        justify-content: flex-end;
      }
    }
    .successBlock{
      width: 100%;
      border-top: 1px solid #409eff;
      margin-top: 10px;
      padding-top: 10px;
    }
  }
}
.analysisStatusOne{
  width: 71px;
  height: 19px;
  line-height: 19px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color:#fff;
  font-size: 12px;
  border-radius: 9px;
  
}

.analysisStatusTwo{
  width: 71px;
  height: 19px;
  line-height: 19px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  color:#fff;
  font-size: 12px;
  border-radius: 9px;
  
}
.analysisStatusThree{
  width: 71px;
  height: 19px;
  line-height: 19px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  color:#fff;
  font-size: 12px;
  border-radius: 9px;
  
}


</style>
