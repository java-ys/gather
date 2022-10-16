<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="任务类型:">
        <Select v-model="taskType" clearable style="width:150px">
          <Option v-for="(task,key) in TASK_TYPE_MAP" :key="key" :value="key">{{task}}</Option>
        </Select>
      </FormItem>
      <FormItem label="任务分类:">
        <Select v-model="taskClassify" clearable style="width:150px">
          <Option v-for="(task,key) in TASK_CLASSIFY_MAP" :key="key" :value="key">{{task}}</Option>
        </Select>
      </FormItem>
      <FormItem label="任务名称:">
        <Input
          v-model="taskName"
          clearable="clearable"
          style="width:150px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="任务范围:">
        <Select v-model="targetType" clearable style="width:150px">
          <Option :value="3">指定城市</Option>
          <Option :value="2">指定司机</Option>
          <Option :value="1">指定运营商</Option>
        </Select>
      </FormItem>
      <FormItem label="检核日期:">
        <DatePicker
          v-model="checkDate"
          type="daterange"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择"
          style="width: 220px"
          :options="options"
          @on-change="changeTime"
        ></DatePicker>
      </FormItem>
      <FormItem label="状态:">
        <Select v-model="taskStatus" clearable style="width:150px">
          <Option :value="1">待执行</Option>
          <Option :value="2">执行中</Option>
          <Option :value="3">已完成</Option>
          <Option :value="4">已作废</Option>
          <Option :value="5">已终止</Option>
        </Select>
      </FormItem>
      <FormItem label="关联上线:">
        <Select v-model="onlineRelation" clearable style="width:150px">
          <Option :value="1">是</Option>
          <Option :value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">重置</Button>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'operator-check-add'"
      type="primary"
      style="margin-bottom: 10px;"
      @click="addData"
    >
      新建检核任务
    </Button>
    <export-file
      v-hasAuth="'operator-check-export'"
      style="margin-bottom: 10px;"
      exportUrl="/admin/sysAgent/checkTaskManager/exportCheckTaskList"
      exportFileName="检核管理列表.xlsx"
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
    <editDetail ref="editDetail" @reload="init" />
    <log ref="log" @reload="init" />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import editDetail from "./editDetail";
import log from "./log";
import ExportFile from "_a/export-file/exportFile";
import {
  queryPageCheckTaskList,
  setCheckTaskStatus,
  queryCheckTaskDetail,
  checkTaskLog
} from "_o/api/operator-check";
import { TASK_TYPE_MAP, TASK_CLASSIFY_MAP } from "_o/components/operator-center/carrier-management/operator-check/fields";

export default {
  components: {
    editDetail,
    log,
    ExportFile
  },
  data() {
    let { columns } = listColumns;
    return {
      taskType: "",
      taskClassify: "", //任务分类
      taskName: "", // 检核任务名称
      targetType: "", // 任务范围
      checkDate: "", // 核检日期
      startTimeCheckDate: "", // 开始核检日期
      endTimeCheckDate: "", // 结束核检日期
      taskStatus: "", // 状态
      onlineRelation: "", // 关联上线
      columns: columns(this),
      TASK_TYPE_MAP,
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      options: {},
      TASK_CLASSIFY_MAP,
    };
  },
  mounted() {
    this.init();
  },
  // activated() {
  //   this.init();
  // },
  methods: {
    init() {
      this.taskType = "";
      this.taskClassify = ""; //任务分类
      this.taskName = "";
      this.targetType = "";
      this.startTimeCheckDate = "";
      this.endTimeCheckDate = "";
      this.checkDate = "";
      this.taskStatus = "";
      this.onlineRelation = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        taskName: this.taskName,
        taskType: this.taskType,
        taskClassify: this.taskClassify, //任务分类
        targetType: this.targetType,
        startTimeCheckDate: this.startTimeCheckDate,
        endTimeCheckDate: this.endTimeCheckDate,
        taskStatus: this.taskStatus,
        onlineRelation: this.onlineRelation,
        currPage: this.current,
        pageSize: this.pageSize
      };
      this.searchData = params;
      queryPageCheckTaskList(params).then(res => {
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
    changeTime(val) {
      if (!val) return;
      // 选日
      let obj = { operateTimeStart: val[0], operateTimeEnd: val[1] }
      if (this.$moment(val[1]).valueOf() - this.$moment(val[0]).valueOf() > 7948800000) {
        this.$Message.error("选择日期跨度不可以超过92日");
        this.startTimeCheckDate = "";
        this.endTimeCheckDate = "";
        this.checkDate = "";
      } else {
        this.startTimeCheckDate = val[0];
        this.endTimeCheckDate = val[1];
      }
    },
    goLog(val) {
      this.$refs.log.init(val);
    },
    addData() {
      this.$refs.editDetail.init({
        flag: 1
      });
    },
    goEditDetail(val) {
      queryCheckTaskDetail({ taskUuid: val.taskUuid }).then(res => {
        if (res.data.success) {
          this.$refs.editDetail.init({ ...res.data.data, flag: val.flag });
        }
      });
    },
    deleteData(val) {
      let params = {
        taskUuid: val.taskUuid,
        taskStatus: val.name === "作废" ? 4 : 5
      };
      let modalData = {
        title: "任务" + val.name,
        detail:
          val.name === "作废"
            ? "警告：作废后,该检核任务不再生效,司机将无法接受该任务并执行,请谨慎操作"
            : "警告：任务终止后,该检核任务不再生效,未执行任务司机将无法执行该任务,请谨慎操作"
      };
      this.$Modal.confirm({
        title: modalData.title,
        content: modalData.detail,
        onOk: () => {
          setCheckTaskStatus(params).then(res => {
            if (res.data.success) {
              this.$Message.info("操作成功！");
              this.getTableList();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    }
  }
};
</script>

