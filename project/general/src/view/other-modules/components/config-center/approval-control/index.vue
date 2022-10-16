<!--
 * @description: 配置管理-审批管理（审批：赠款申请，短信任务，电补来源配置，电补发放,活动管理新增，活动管理修改，app广告位）
 * @author: wuxuan
 * @date: 2019-08-12 14:36:39
!-->
<template>
  <div class="driver-order">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <div class="approval-box">
      <Button class="right15" type="success" @click="batchHandle(1)" v-hasAuth="'approval_control-batchPass'" :disabled="selectList.length===0">审批通过</Button>
      <Button type="error" @click="batchHandle(2)" v-hasAuth="'approval_control-batchFail'" :disabled="selectList.length===0">审批不通过</Button>
    </div>
    <m2-table
      class="top15"
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="selectHandle"
    ></m2-table>
    <!-- 短信任务详情 -->
    <Modal v-model="isDetail" @on-ok="isDetail=false" title="任务详情" :width="700">
      <!-- 短信任务展示 -->
      <div  v-if="detailData.type===1">
        <div class="key-val-box">
          <span class="key-box">任务类型：</span>
          <span>{{taskMap[detailData.type]}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">任务名称：</span>
          <span>{{detailData.taskName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">提交时间：</span>
          <span>{{detailData.createTime}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送对象：</span>
          <span>{{sendMap[detailData.sendName]}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送范围：</span>
          <span>{{driverMap[detailData.driver]}}</span>
        </div>
        <div class="key-val-box" v-if="detailData.sendName==0 && detailData.driver==10">
          <span class="key-box">用户分群：</span>
          <span>{{detailData.userGroupName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送数量：</span>
          <span>{{detailData.targetNum}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送时间：</span>
          <span>{{detailData.sendTime}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">消息内容：</span>
          <span>{{detailData.content}}</span>
        </div>
      </div>
      <!-- push推送 -->
      <div  v-if="detailData.type===12">
        <div class="key-val-box">
          <span class="key-box">Push标题：</span>
          <span>{{detailData.title}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">Push副标题：</span>
          <span>{{detailData.subTitle}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送对象：</span>
          <span v-if="detailData.pushRole==1"> 司机</span>
          <span v-if="detailData.pushRole==2"> 乘客</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送城市：</span>
          <span>{{detailData.cityNames}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">用户选择方式：</span>
          <span v-if="detailData.target==1 && detailData.pushRole==1">  指定司机</span>
          <span v-if="detailData.target==1 && detailData.pushRole==2">  指定乘客</span>
          <span v-if="detailData.target==2"> 指定条件</span>
          <span v-if="detailData.target==3"> 批量</span>
          <span v-if="detailData.target==4"> 用户分群</span>
        </div>
        <div class="key-val-box" v-if="detailData.pushRole===2 && detailData.target==4">
          <span class="key-box">乘客分组类别：</span>
          <span v-if="detailData.userGroupType=='1'"> 注册城市 </span>
          <span v-if="detailData.userGroupType=='2'"> 冒泡城市 </span>
          <span v-if="detailData.userGroupType=='3'"> 完单城市 </span>
        </div>
        <div class="key-val-box">
          <span style="padding-left: 112px;"></span>
          <span v-if="detailData.target==1">手机号
              <span v-for="(item, index) in detailData.mobile" :key="index"> {{item}}</span>
          </span>
          <span v-if="detailData.target==2">
              <span v-for="(item, index) in detailData.operatorName" :key="index"> {{item}}</span>
          </span>
          <span v-if="detailData.cityName">
              <span v-for="(item, index) in detailData.cityName" :key="index"> {{item}}</span>
          </span>
          <span v-if="detailData.target==4">{{detailData.userGroupName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">跳转链接：</span>
          <span>{{detailData.pushLink}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送时间：</span>
          <span>{{detailData.pushTimeStr}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">发送人数：</span>
          <span>{{detailData.sendNum}}</span>
        </div>
      </div>
      <!-- 赠款 | 扣款 申请 -->
      <div  v-if="detailData.type === 2 || detailData.type === 11">
        <div class="key-val-box">
          <span class="key-box">企业：</span>
          <span>{{detailData.enterpriseName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">事由：</span>
          <span>{{detailData.reason}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">操作类型：</span>
          <span>{{detailData.type | filterType}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">金额：</span>
          <span>{{detailData.grantAmount}} 元</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">申请人：</span>
          <span>{{detailData.applicant}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">相关文件：</span>
          <span v-if="detailData.files && detailData.files.length === 0">暂无可下载文件</span>
          <Button v-else icon="ios-cloud-download-outline" size="small" ghost type="info" @click="downLoadFile(detailData.files)">点击下载</Button>
        </div>
      </div>
      <!-- 电补来源配置展示 -->
      <div v-if="detailData.type===3">
        <div class="key-val-box">
          <span class="key-box">任务类型：</span>
          <span>{{taskMap[detailData.type]}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">提交时间：</span>
          <span>{{detailData.createTime}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">设置城市：</span>
          <span>{{detailData.cityName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">补贴年月：</span>
          <span>{{detailData.year}}-{{detailData.month}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">数据来源：</span>
          <span>{{detailData.source==1?'手工导入':'系统获取'}}</span>
        </div>
      </div>
      <!-- 电补发放任务展示 -->
      <div v-if="detailData.type===4">
        <div class="key-val-box">
          <span class="key-box">任务类型：</span>
          <span>{{taskMap[detailData.type]}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">提交时间：</span>
          <span>{{detailData.createTime}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">司机人数：</span>
          <span>{{detailData.driverCount}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">补贴总金额：</span>
          <span>{{detailData.amount}}元</span>
        </div>
      </div>
      <!-- 新增平台协议he 新增平台协议版本 -->
      <div v-if="detailData.type===8||detailData.type===9">
        <div class="key-val-box">
          <span class="key-box">版本号：</span>
          <span>{{detailData.versionNo}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">版本内容：</span>
          <pre class="pre-text ql-snow ql-editor ql-vdetails" v-html="detailData.content"></pre>
        </div>
      </div>
      <!-- 司机心声 -->
      <div v-if="detailData.type===13">
        <div class="key-val-box">
          <span class="key-box">任务名称：</span>
          <span>{{detailData.taskName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">任务类型：</span>
          <span>{{taskMap[detailData.type]}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">提交时间：</span>
          <span>{{detailData.createTime}}</span>
        </div>
      </div>
      <!-- 上车点街景照片 -->
      <div v-if="detailData.type === 16">
        <div class="key-val-box">
          <span class="key-box">任务名称：</span>
          <span>{{detailData.taskName}}</span>
        </div>
        <div class="key-val-box">
          <span class="key-box">图片：</span>
          <span>
            <img :src="detailData.jobInfo.url" width="300" />
          </span>
        </div>
      </div>
      <!-- <app-modal
        :show="appModal"
        :infoData="detailData"
        :handleType="3"
        @close="appModal=false">
      </app-modal> -->
    </Modal>
    <Modal
      v-model="appModal"
      :width="1000"
      title="详情"
      :mask-closable="false"
      class="add-advertising"
      @on-ok="appModal=false"
      @on-cancel="appModal=false"
    >
      <iframe v-if="appModal" :src="appModalSrc" frameborder="none" width="100%" height="960" />
    </Modal>
    <Modal
        v-model="cancelModal"
        :width="650"
        @on-ok="closeCancelModal"
        @on-cancel="closeCancelModal"
        title="审批结果">
        <div class="fontsize14 color00">失败条数/总审批条数：{{cancelInfo.failCount}} / {{cancelInfo.totalCount}}</div>
        <div class="top15 line30">
            <div v-for="(item,i) in cancelInfo.failList" :key="i">{{item}}</div>
        </div>
        <div slot="footer">
            <Button type="primary" @click="closeCancelModal">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import appModal from '../app-advertising/components/add-modal'
import VTable from "_a/v-table/v-table";
import { returnFields, inputList,pageObj,sendMap,driverMap,taskMap } from "./fields";
import { timeFormat } from "@/libs/util";
import { axiosTaskApprovalList,axiosTaskApprovalSwitch,axiosTaskApprovalDetail,axiosTaskApprovalBatchSwitch } from '_o/api/configData'
import fileDownload from 'js-file-download'
import { getToken } from '@/libs/util'
import axios from 'axios'
import m2Table from "_a/m2-table/v-table";
import vEditor from "_a/v-editor/v-editor.vue";//勿删
export default {
  name: "approval_control",
  filters: {
    filterType(value) {
      if(value === 2) {
        return "赠款"
      }
      if(value === 11) {
        return "扣款"
      }
    }
  },
  components: {
    VTable,
    appModal,
    m2Table
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      pageObj,
      searchData: {},
      sendMap,
      driverMap,
      taskMap,
      parColumns: [],
      tableData: [],
      isDetail: false,
      detailData: {},
      appModal: false,
      selectList: [],
      selectTypeList: [], // 类型
      cancelModal: false,
      cancelInfo: {},
      isLoading: true,
      appModalSrc: ""
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList(this.searchData);
  },
  activated() {
    this.getList(this.searchData);
  },
  methods: {
    // 搜索回调
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      // 时间戳转日期格式，并删除原有时间戳
      data.d && (data.createTimeStart = timeFormat(data.d, "yyyy-mm-dd").substring(0,10));
      data.a && (data.createTimeEnd = timeFormat(data.a, "yyyy-mm-dd").substring(0,10));
      delete data.d;
      delete data.a;
      for(let key in this.searchData){
        delete this.searchData[key]
      }

      for(let key in data){
        this.searchData[key] = data[key]
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.getList();
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList(obj,notLoading) {
      let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }
      this.isLoading = true
      axiosTaskApprovalList(params).then(res => {
        this.isLoading = false
        if(res.data.success){
          let resdata = res.data.data;
          this.tableData = (resdata && resdata.list) || [];
          this.pageObj.total = resdata && resdata.totalCount;
          // 0、待审核-1待发送-可以审批
          this.tableData.forEach(item=>{
            item._checked = false
            item._disabled = true
            if(item.status===0) item._disabled = false
          })
          this.selectList = []
          this.selectTypeList = []
          this.$store.commit("changeLoadingFlag", false);
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      }).catch(err => {
        this.isLoading = false
      });
    },
    // 审批任务
    approvalSwitch(params){
      axiosTaskApprovalSwitch(params).then(res => {
        if(res.data.success){
          this.$Message.success('操作成功')
          this.getList(this.searchData,true)
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      });
    },
    /*
     *@description: 获取任务详情，展示详情信息
     *@params：params:{
     *  uuid:任务uuid,
     *  type:任务类型
     * }
     *@author: wuxuan
     *@date: 2019-08-12 16:23:41
    */
    getDetailInfo(params){
      if (params.type === 16) {
        this.detailData = params;
        this.isDetail = true
        return
      }
      if(params.type===13){
        this.$router.push({
          name: 'driver-voice-detail',
          // params: { uuid: params.uuid },
          query: {
            uuid: params.sourceUuid
          }
        })
        return
      }
      axiosTaskApprovalDetail(params).then(res => {
        if(res.data.success){
          this.detailData = res.data.data || {}
          if(params.type===6){
            if(this.detailData.content){
              // this.detailData = JSON.parse(this.detailData.content)
              this.appModalSrc = location.href.split('#')[0].replace('m2-web-general', 'marketing-operation-admin') + '#/app-advertising-approval?data=' + encodeURIComponent(this.detailData.content);
              // this.appModalSrc = 'http://localhost:8077' + '#/app-advertising-approval?data=' + encodeURIComponent(this.detailData.content);
              // console.log(this.appModalSrc);
              this.appModal = true
            }else{
              this.detailData = {}
              this.$Message.error('未查到详情信息')
            }
            return false
          }
          this.isDetail = true

          if(params.type===8 || params.type===12){
            if(this.detailData.content){
              this.detailData = JSON.parse(this.detailData.content)
              console.log(this.detailData)
            }else{
              this.detailData = {}
            }
            this.detailData.type = params.type
          }
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      });
    },
    // 下载赠款申请的文件-zip压缩包
    downLoadFile(file) {
      // 下载链接
      let data = {
        fileName: "相关文件下载.zip",
        files: file
      }
      axios({
        method: 'post',
        url: this._baseUrl + '/common/downloadZip',
        responseType: 'blob',
        headers: { 'Authorization': getToken() },
        data: data
      }).then(function (res) {
        if(res.data) fileDownload(res.data,'赠款申请文件.zip')
      }).catch(function (error) {
        console.log(error)
      })
    },
    selectHandle(list){
      this.selectList = list.map(item=>item.uuid)
      this.selectTypeList = list.map(item=>item.type)
    },
    batchHandle(type){
      let msg = type===1?'通过':'不通过'
      let that = this
        this.$Modal.confirm({
				title:`确认任务审批${msg}？`,
				onOk:()=>{
          let params = {
            uuidList: that.selectList,
            // type:that.selectTypeList,
            status: type,
            taskAuditReqs:[]
          }
          for(let i = 0; i<that.selectList.length;i++){
              params.taskAuditReqs.push({
                  uuid:that.selectList[i],
                  type:that.selectTypeList[i],
              })
          }
		axiosTaskApprovalBatchSwitch(params).then(res => {
            let data = res.data.data||{}
            if(data.failCount===0){
              that.$Message.success('审批成功！')
              this.closeCancelModal()
            }else {
              data.failList = data.failMsg.split('====')
              this.cancelInfo = data
              this.cancelModal = true
            }
          })
				}
			})
    },
    closeCancelModal(){
      this.cancelModal = false
      this.selectList = []
      this.selectTypeList = []
      this.getList()
    },
  }
};
</script>
<style lang="less" scoped>
.key-val-box{
  line-height:30px;
  display: flex;
  .key-box{
    display: inline-block;
    min-width:100px;
    width:100px;
    text-align: right;
    margin-right: 12px;
  }
}
.pre-text{
  padding-top:7px;
  line-height: 1.42;
  font-family: PingFangSC-Regular;
  /deep/ h1, h2, h3, h4, h5, h6{
    margin-bottom: 0;
  }
}
.approval-box{
  display: flex;
  justify-content: flex-end;
}
</style>



