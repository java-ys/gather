<template>
  <div>
    <Form inline="inline" :label-width="100">
      <FormItem label="司机姓名:">
        <Input
          v-model="driverName"
          clearable="clearable"
          style="width:160px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="司机手机号:">
        <Input
          v-model="driverPhone"
          clearable="clearable"
          style="width:160px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="运营商名称:">
        <Input
          v-model="agentName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="司管姓名:" v-if="isShowMore">
        <Input
          v-model="driverManagerName"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="司管手机号:" v-if="isShowMore">
        <Input
          v-model="driverManagerPhone"
          clearable="clearable"
          style="width:200px"
          :maxlength="50"
      /></FormItem>
      <FormItem label="任务接收时间:" v-if="isShowMore">
        <DatePicker
          v-model="checkTaskTime"
          type="datetimerange"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择生效时间"
          style="width: 200px"
          transfer
        ></DatePicker
      ></FormItem>
      <FormItem label="任务执行状态:" v-if="isShowMore">
        <Select v-model="taskStatus" clearable style="width:150px">
          <Option :value="1">待执行</Option>
          <Option :value="2">已执行</Option>
          <Option :value="3">过期未执行</Option>
          <Option :value="4">已作废</Option>
          <Option :value="5">已终止</Option>
          <Option :value="6">无需执行</Option>
          <Option :value="7">未上线</Option>

        </Select>
      </FormItem>
      <FormItem label="任务审核结果:" v-if="isShowMore">
        <Select v-model="reviewResult" clearable style="width:150px">
          <Option :value="1">待审核</Option>
          <Option :value="2">通过</Option>
          <Option :value="3">违规</Option>
          <Option :value="4">过期未审核</Option>
        </Select>
      </FormItem>
      <FormItem label="任务复核结果:" v-if="isShowMore">
        <Select v-model="reCheckStatus" clearable style="width:150px">
          <Option :value="0">初始</Option>
          <Option :value="1">待复核</Option>
          <Option :value="2">通过</Option>
          <Option :value="3">驳回</Option>
        </Select>
      </FormItem>
      <FormItem label="违规级别:" v-if="isShowMore">
        <Select v-model="violationLevel" clearable style="width:150px">
          <Option :value="1">轻微</Option>
          <Option :value="2">一般</Option>
          <Option :value="3">严重</Option>
          <Option :value="4">特大</Option>
        </Select>
      </FormItem>
      <FormItem label="是否申诉:" v-if="isShowMore">
        <Select v-model="doAppeal" clearable style="width:150px">
          <Option :value="1">是</Option>
          <Option :value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem label="申诉结果:" v-if="isShowMore">
        <Select v-model="appealResult" clearable style="width:150px">
          <Option :value="0">待审核</Option>
          <Option :value="2">申诉驳回</Option>
          <Option :value="3">申诉通过</Option>
          <Option :value="4">过期未审核</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <div class="query-btn">
          <a class="show-more" @click="isShowMore = !isShowMore">
            <Icon type="md-remove" v-show="isShowMore" />
            <Icon type="md-add" v-show="!isShowMore" />
            <span v-show="!isShowMore">查看更多</span>
            <span v-show="isShowMore">收起更多</span>
          </a>
          <Button @click="init">重置</Button>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </FormItem>
    </Form>

    
    <Modal title="检核任务复核" v-model="detailModal" width="650px" :closable="false">
			<div class="modalbox" v-if="detailData">
				<div class="driverInfoClass">
					<span>任务名称：{{detailData.taskName}}</span>
				</div>
				<div class="driverInfoClass">
					<span>任务分类：{{TASK_CLASSIFY_MAP[detailData.taskClassify]}}</span>
				</div>
				<div class="driverInfoClass">
					<span>司机姓名：{{detailData.driverName}}</span>
				</div>
				<div class="driverInfoClass">
					<span>司机ID：{{detailData.driverId}}</span>
				</div>
				<div class="driverInfoClass">
					<span>手机号：{{detailData.mobile}}</span>
				</div>
				<div class="driverInfoClass">
					<span>所属运营商：{{detailData.agentName}}</span>
				</div>
				<div class="driverInfoClass">
					<span>司管姓名：{{detailData.managerDriverName}}</span>
				</div>
				<div class="driverInfoClass">
					<span>司管手机号：{{detailData.managerDriverMobile}}</span>
				</div>
				<div class="driverInfoClass">
          <br>
					<span>核检图片：</span>
				</div>
				<div>
					<div class="pd-top-20 pd-left-30 checkItem" v-for="(item, index) in detailData.enclosureVoList" :key="index">
						<span class="item-name">{{item.localtion}}:</span>
						<img :src="item.fileUrl"
                 v-if="item && item.fileUrl && item.fileUrl.length"
                 @click="previewImgandVideo(item.fileUrl)"/>
					</div>
				</div>
        <div style="padding-top:30px">
          <div>复核意见：</div>
          <Input
            v-model="detailData.reCheckRemark"
            style="width:380px;padding-top:5px"
            type="textarea"
            :maxlength='800'
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请说明原因（非必填）"
          ></Input>
        </div>
			</div>
			 <div slot="footer">
          <Button type="primary" @click="closeReModel">关闭</Button>
          <Button type="primary" @click="passModal(3)">复核驳回（下一个）</Button>
          <Button type="primary" @click="passModal(2)">复核通过（下一个）</Button>
        </div>
		</Modal>

    <Modal title="预览图片" v-model="imgvisible" :width="700">
			<Carousel :imgList="picUrl" v-if="imgvisible"></Carousel>
		</Modal>

    <export-file
      style="margin-bottom: 10px;"
      exportUrl="/admin/sysAgent/checkTaskManager/exportDriverCheckTaskList"
      exportFileName="检核列表.xlsx"
      :queryData="searchData"
      btnText="数据导出"
      :disabled="!total || total === 0"
    ></export-file>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
  </div>
</template>

<script>
import { checkListColumns, TASK_CLASSIFY_MAP } from "./fields";
import ExportFile from "_a/export-file/exportFile";
import Carousel from "./components/carousel.vue";

import { driverCheckTaskList, driverList, reCheckTaskList ,passCheckTaskList} from "_o/api/operator-check";
export default {
  components: {
    ExportFile,
    Carousel
  },
  mounted() {
    this.init();
  },
  data() {
    let { columns } = checkListColumns;
    return {
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      isShowMore: false,
      driverName: "",
      driverPhone: "",
      driverName:'',
      agentName: "",
      driverList: [],
      driverUuid:"",
      detailModal:false,
      detailData: {
        enclosureVoList: [],
        reCheckRemark:""
      },
      picUrl: '',
      imgvisible:false,
      temCheckDara:{},
      TASK_CLASSIFY_MAP
    };
  },
  methods: {
    init() {
      this.driverUuid = ""; // 司机名称
      this.driverPhone = ""; // 司机手机号
      this.driverName = ''; //司机姓名
      this.agentName = ""; // 运营商名称
      this.driverManagerName = ""; // 司管姓名
      this.driverManagerPhone = ""; // 司管手机号
      this.checkTaskTime = ""; // 任务执行日期
      this.operateTimeStart = ""; // 任务执行日期开始
      this.operateTimeEnd = ""; // 任务执行日期结束
      this.taskStatus = ""; // 任务执行状态
      this.reviewResult = ""; // 任务审核结果
      this.reCheckStatus = ""; // 任务复核结果
      this.violationLevel = ""; // 违规级别
      this.doAppeal = ""; // 是否申诉
      this.appealResult = ""; // 申诉结果
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
      // this.getDriverList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        driverUuid: this.driverUuid,
        driverPhone: this.driverPhone,
        driverName:this.driverName,
        agentName: this.agentName,
        driverManagerName: this.driverManagerName,
        driverManagerPhone: this.driverManagerPhone,
        operateTimeStart: this.checkTaskTime[0],
        operateTimeEnd: this.checkTaskTime[1],
        taskStatus: this.taskStatus,
        reviewResult: this.reviewResult,
        reCheckStatus: this.reCheckStatus,
        violationLevel: this.violationLevel,
        doAppeal: this.doAppeal,
        appealResult: this.appealResult,
        taskUuid: this.$route.query.uuid
      };
      this.searchData = params;
      driverCheckTaskList(params).then(res => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    // getDriverList() {
    //   driverList({}).then(res => {
    //     let data = res.data.data || {};
    //     this.driverList = data.list;
    //   });
    // },
    goDetail(val) {
      this.$router.push({
        name: "check-detail",
        query: {
          uuid: val.recordUuid
        }
      });
    },
    checkOrderList(val){
      this.temCheckDara = val;
      let params = {
        recordUuid: val.recordUuid // recordUuid 检核记录UUID 必须
      }   
      reCheckTaskList(params).then(res => {
        this.detailData = res.data.data || {};
      });
      this.detailModal = true;
    },
    previewImgandVideo(url) {
      this.picUrl = url
      // debugger
      this.imgvisible = true

    },
    // 驳回复核
    // returnModal(){
    //   let params = {
    //     recordUuid: this.detailData.recordUuid,
    //     recordId: this.detailData.recordId,
    //     reCheckStatus: 3,
    //     reCheckRemark: this.detailData.reCheckRemark || "",
    //     taskUuid:this.detailData.taskUuid,
    //   }  
    //   passCheckTaskList(params).then(res => {
    //     if(res.data.data.hasMore){
    //       this.detailData = res.data.data || {};
    //     }else{
    //       this.$Message.info("已是最后一个了")
    //     }
    //   });

    // },
    // 通过复核
    passModal(val){
      let params = {
        recordUuid: this.detailData.recordUuid,
        recordId: this.detailData.recordId,
        reCheckStatus: val,
        reCheckRemark: this.detailData.reCheckRemark || "",
        taskUuid:this.detailData.taskUuid,
      }  
      passCheckTaskList(params).then(res => {
        if(res.data.data.hasMore){
          this.detailData = res.data.data || {};
        }else{
          this.detailModal = false
          this.getTableList();
          this.$Message.info("已是最后一个了")

        }
      });

    },
    closeReModel(){
      this.detailModal = false
      this.getTableList();
    },

  }
};
</script>

<style lang="less" scoped>
.modalbox {
  padding-left: 60px;

  .pd-top-20 {
    padding-top: 10px;
  }

  .pd-left-30 {
    padding-left: 30px;
  }

  .checkItem {
    .item-name {
      width: 150px;
      height: 50px;
      display: inline-block;
    }

    img {
      width: 100px;
      cursor: pointer;
      height: 100px;
    }
  }
}
.driverInfoClass {
  font-size: 14px;
  padding-top: 5px;
  padding-bottom: 7px;
}
</style>