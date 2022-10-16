<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="城市:">
        <Select v-model="cityCode" clearable style="width: 200px">
          <!-- <Option v-for="(task,key) in TASK_TYPE_MAP" :key="key" :value="key">{{task}}</Option> -->
          <Option
            v-for="item in roleList1"
            :key="item.value"
            :value="item.value"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="姓名:">
        <Input
          v-model="name"
          clearable="clearable"
          style="width: 200px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="运营商:">
        <Select v-model="agentUuid" clearable filterable style="width: 200px">
          <!-- <Option :value="3">全部</Option>
          <Option :value="2">指定司机</Option>
          <Option :value="1">指定运营商</Option> -->
          <Option
            v-for="item in roleList"
            :key="item.value"
            :value="item.value"
          >{{item.label}}</Option>
        </Select>
      </FormItem>

      <FormItem label="手机号:">
        <Input
          v-model="phone"
          clearable="clearable"
          style="width: 200px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="证书编号:">
        <Input
          v-model="certificationNum"
          clearable="clearable"
          style="width: 200px"
          :maxlength="50"
        />
      </FormItem>

      <FormItem label="状态:">
        <Select v-model="status" clearable style="width: 200px">
          <Option :value="'0'" label="未创建">未创建</Option>
          <Option :value="'1'" label="待生效">待生效</Option>
          <Option :value="'2'" label="生效中">生效中</Option>
          <Option :value="'3'" label="已失效">已失效</Option>
        </Select>
      </FormItem>

      <FormItem label="有效期止:">
        <DatePicker
          v-model="seletime"
          type="daterange"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择"
          style="width: 200px"
          @on-change="handlePiker"
        ></DatePicker>
      </FormItem>

      <FormItem label="安全职业资格类别:" :label-width="120">
        <Select v-model="qualificationType" clearable style="width: 200px">
          <Option :value="'1'">注册安全工程师</Option>
          <Option :value="'2'">生产经营单位从业人员培训合格证书</Option>
          <Option :value="'3'">道路运输企业主要负责人和安全生产管理人员安全考核合格证明</Option>
          <Option :value="'99'">其他</Option>
        </Select>
      </FormItem>

      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right: 20px; margin-left: 40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">重置</Button>
      </FormItem>
    </Form>
    <Row style="margin-bottom:10px">
      <Col span="12">
        <Button type="primary" @click="ThreeData">三个月内到期</Button>
        <Button type="error" @click="endData">已到期</Button>
      </Col>
      <Col span="12" style="text-align:right">
        <Button type="primary" @click="addSafer">新增安全员</Button>
        <export-file
          type="success"
          class="right15"
          :isDisabled="tableData.length === 0"
          exportUrl="/api/operate/safeOfficer/export"
          exportFileName="安全员信息.xls"
          :queryData="searchData"
          btnText="批量导出"
        ></export-file>
      </Col>
    </Row>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <editDetail ref="editDetail" @reload="init" />
    <log ref="log" @reload="init" />
    <add-safer ref="addSafer" @on-reload="search"></add-safer>
    <Modal v-model="imgVisible" title="查看大图">
      <img
        :src="currentImg"
        style="width: 100%"
      >
    </Modal>
  </div>
</template>

<script>
import { listColumns } from "./fields";
import editDetail from "./editDetail";
import AddSafer from "./components/add-safer"
import log from "./log";
import ExportFile from "_a/export-file/exportFile";
import { getAgentList, getOpenAreaAll } from "_o/api/work-order/common";
import {
  queryPageCheckTaskList1,
  queryPageCheckTaskList,
  setCheckTaskStatus,
  queryCheckTaskDetail1,
  checkTaskLog,
  downFileUrl,
} from "_o/api/operator-check";
import { TASK_TYPE_MAP } from "_o/components/operator-center/carrier-management/operator-check/fields";
import oss from "@/mixins/oss";

export default {
  components: {
    editDetail,
    log,
    ExportFile,
    AddSafer
  },
  mixins: [oss],
  data() {
    let { columns } = listColumns;
    return {
      columns: columns(this),
      TASK_TYPE_MAP,
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      options: {},

      // 安全员
      cityName: [],
      cityCode: "",
      name: "",
      // agentName:[],
      agentUuid: "",
      phone: "",
      certificationNum: "",
      seletime: [],
      validityStartTime: "",
      validityEndTime: "",
      qualificationType: "",
      status: "",
      roleList: [],
      roleList1: [],
      temDate: "",
      temDateEnd: "",
      certificationImages: "",
      picData: {},
      // 证书图片入参
      picUuid: "",
      addModalVisible: false,
      imgVisible: false,
      currentImg: null,
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;

      // 安全员
      this.cityName = [];
      this.cityCode = "";
      this.name = "";
      this.agentName = [];
      this.agentUuid = "";
      this.phone = "";
      this.certificationNum = "";
      this.validityEndTime = "";
      this.seletime = [];
      this.qualificationType = "";
      this.status = "";
      // this.certificationImages =
      this.getRoleNameList();

      this.getTableList();
    },
    getTableList() {
      let params = {
        // 安全员
        cityName: this.cityName,
        cityCode: this.cityCode,
        name: this.name,
        agentName: this.agentName,
        agentUuid: this.agentUuid,
        phone: this.phone,
        certificationNum: this.certificationNum,
        validityEndTime: this.validityEndTime,
        validityStartTime: this.validityStartTime,
        qualificationType: this.qualificationType,
        status: this.status,
        currPage: this.current,
        pageSize: this.pageSize,
      };

      this.searchData = params;
      // queryPageCheckTaskList(params).then(res => {
      //   let data = res.data.data || {};
      //   this.tableData = data.list;
      //   this.total = data.totalCount;
      // });
      queryPageCheckTaskList1(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list;
        // debugger
        // console.log(this.tableData)

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

    // changeTime(val) {
    //   if (!val) return;
    //   // 选日
    //   let obj = { operateTimeStart: val[0], operateTimeEnd: val[1] }
    //   if (this.$moment(val[1]).valueOf() - this.$moment(val[0]).valueOf() > 7948800000) {
    //     this.$Message.error("选择日期跨度不可以超过92日");
    //     this.startTimeCheckDate = "";
    //     this.endTimeCheckDate = "";
    //     this.checkDate = "";
    //   } else {
    //     this.startTimeCheckDate = val[0];
    //     this.endTimeCheckDate = val[1];
    //   }
    // },

    goLog(val) {
      this.$refs.log.init(val);
    },
    ThreeData() {
      let params = {
        cityName: this.cityName,
        cityCode: this.cityCode,
        name: this.name,
        agentName: this.agentName,
        agentUuid: this.agentUuid,
        phone: this.phone,
        certificationNum: this.certificationNum,
        validityEndTime: this.validityEndTime,
        qualificationType: this.qualificationType,
        status: this.status,
        currPage: this.current,
        pageSize: this.pageSize,
        expireType: 0,
      };

      this.searchData = params;
      queryPageCheckTaskList1(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },
    endData() {
      let params = {
        cityName: this.cityName,
        cityCode: this.cityCode,
        name: this.name,
        agentName: this.agentName,
        agentUuid: this.agentUuid,
        phone: this.phone,
        certificationNum: this.certificationNum,
        validityEndTime: this.validityEndTime,
        qualificationType: this.qualificationType,
        status: this.status,
        currPage: this.current,
        pageSize: this.pageSize,
        expireType: 1,
      };

      this.searchData = params;
      queryPageCheckTaskList1(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
      });
    },

    goEditDetail(val) {
      // debugger
      // console.log(val)
      // let params = {

      // }
      // debugger
      // console.log(val)
      queryCheckTaskDetail1(val).then((res) => {
        // if (res.data.success) {
        // this.$refs.editDetail.init({ ...res.data.data, flag: val.flag });
        this.$refs.editDetail.init({
          flag: val.flag,
          val: val,
          temDate: val.temDate,
          temDateEnd: val.temDateEnd,
        });
        // }
      });
    },

    deleteData(val) {
      let params = {
        taskUuid: val.taskUuid,
        taskStatus: val.name === "作废" ? 4 : 5,
      };
      let modalData = {
        title: "任务" + val.name,
        detail:
          val.name === "作废"
            ? "警告：作废后,该检核任务不再生效,司机将无法接受该任务并执行,请谨慎操作"
            : "警告：任务终止后,该检核任务不再生效,未执行任务司机将无法执行该任务,请谨慎操作",
      };
      this.$Modal.confirm({
        title: modalData.title,
        content: modalData.detail,
        onOk: () => {
          setCheckTaskStatus(params).then((res) => {
            if (res.data.success) {
              this.$Message.info("操作成功！");
              this.getTableList();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },

    getRoleNameList() {
      getAgentList().then((res) => {
        this.roleList = res.data.data;
      });
      getOpenAreaAll().then((res) => {
        this.roleList1 = res.data.data;
      });
    },

    // 时间选择器
    handlePiker(data) {
      this.validityStartTime = data[0];
      this.validityEndTime = data[1];
    },
    async getUrlByUuid(uuid) {
      const [, url] = await this.getOssFile({ uuid });
      return url;
    },
    handleView() {
      downFileUrl({ uuid: this.picUuid[0] })
        .then((res) => {
          this.imgVisible = true;
          this.currentImg = res.data.data;
        })
    },
    downFileUrlPic() {
      // debugger
      // console.log()

      // debugger
      downFileUrl({ uuid: this.picUuid[0] })
        .then((res) => {
          console.log(res);
          window.location = res.data.data;
        })
        .catch((err) => {});
      this.isLoading = true;
    },
    addSafer() {
      this.$refs.addSafer.visible = true
    },
  },
};
</script>
