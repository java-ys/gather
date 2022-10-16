<template>
  <div>
    <div class="task-list_wrap">
      <SearchList
        :inputList="inputList"
        @on-search="queryData"
        @on-reset="clearQueryData"
        @on-change="handleSelectChange"
      ></SearchList>
      <Button type="primary" @click="addNew"> 新增任务</Button>
      <m2-table
        style="margin-top: 20px"
        class="task-table-container"
        :total="total"
        :current="current"
        :isLoading="isLoading"
        :pageSize="pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </m2-table>
      <!-- 日志 -->
      <log
        v-if="showLog"
        @update:visible="showLog = false"
        :basicUuid="logId"
      ></log>
      <!-- 拷贝 -->
      <copy
        v-if="showCopy"
        @update:visible="showCopy = false"
        @copySuccess="copySuccess"
        :basicUuid="copyId"
      ></copy>
    </div>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import {
  queryAgentList,
  getManageTaskList,
  updateManageTaskStatus,
  queryTaskDetail,
  queryOpenCityList,
  commitOaProcess,
  removeManageTask,
} from "_o/api/task-manager";
import { listPageData, inputList, tableTitle } from "./config/fields.js";
import countyCity from "_g/mixins/countyCity";
import log from "./components/log/log";
import copy from "./components/copy/copy";
import { timeFormat } from "@/libs/util.js";
export default {
  name: "taskList",
  // mixins: [countyCity],
  data() {
    return {
      inputList,
      tableTitle,
      isLoading: false,
      cascaderCityList: [],
      cityList: [],
      showLog: false,
      ...listPageData,
      copyId: "",
      showCopy: false,
      logId: "",
    };
  },
  created() {
    this.tableColumns = tableTitle(this);
  },
  components: {
    log,
    copy,
    m2Table,
  },
  mounted() {
    this.getList();
    this.getCityList();
  },
  watch: {},
  methods: {
    // 获取城市列表
    async getCityList() {
      const res = await queryOpenCityList({});
      if (!res) {
        this.cityList = [];
        this.$Message.error("获取城市失败");
        return false;
      }
      if (res.data && res.data.data && res.data.success) {
        this.cityList = res.data.data.map((item) => ({
          value: item.cityCode,
          label: item.cityName,
        }));
        if (this.cityList.length > 0) {
          this.cityList.unshift({
            value: 0,
            label: "全部",
          });
        }
        this.inputList[2].dropList = this.cityList;
      } else {
        this.cityList = [];
        this.$Message.error(res.data.msg);
      }
    },
    // 根据城市code 获取运营商列表
    getPageAgentList(cityCode) {
      queryAgentList({
        cityCode,
      }).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          let data = res.data.data || [];
          this.inputList[3].dropList = data.map((item) => ({
            value: item.agentUuid,
            label: item.agentName,
          }));
          if (this.inputList[3].dropList.length > 0) {
            this.inputList[3].dropList.unshift({
              value: 0,
              label: "全部",
            });
          }
        } else {
          this.inputList[3].dropList = [];
          this.inputList[3].value = "";
        }
      });
    },
    handleSelectChange(value, name) {
      console.log(value);
      if (name === "cityCode") {
        // const [privinceCode, cityCode] = value;
        if (value && value.length === 6) {
          this.inputList[3].value = [];
          this.getPageAgentList(value);
        }
      }
      if (name === "agentUuidList") {
        this.inputList[3].value = value;
        if (value && value.length > 0 && value.includes(0)) {
          this.inputList[3].value = [0];
          this.inputList[3].needDisabled = true;
          this.inputList[3].disabledIndex = 0;
        } else {
          this.inputList[3].needDisabled = false;
          this.inputList[3].disabledIndex = "";
        }
      }
    },
    queryData(data) {
      // 点击查询
      this.current = 1;
      this.queryParams = data;

      this.queryParams = {
        ...this.queryParams,
        taskStatus: data.taskStatus === 10 ? "" : data.taskStatus,
        taskType: data.taskType === 0 ? "" : data.taskType,
        cityCode: data.cityCode === 0 ? "" : data.cityCode,
        agentUuidList:
          data.agentUuidList && data.agentUuidList[0] === 0
            ? ""
            : data.agentUuidList,
      };
      // 选择全部多传一个参数
      if (this.queryParams.agentUuidList === "") {
        this.queryParams.choseAllAgent = 1;
      } else {
        this.queryParams.choseAllAgent = 0;
      }
      // 没传值删除
      this.queryParams.agentUuidList &&
        this.queryParams.agentUuidList.length === 0 &&
        delete this.queryParams.agentUuidList;
      this.getList();
    },
    clearQueryData() {
      // 点击清空
      this.queryParams = {};
      this.current = 1;
      this.inputList[3].dropList = [];
      this.queryParams.agentUuidList = [];
      this.getList();
    },
    async getList() {
      this.isLoading = true;
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      let requestParams = Object.assign(params, this.queryParams);
      const res = await getManageTaskList({
        ...requestParams,
      });
      if (!res) {
        this.isLoading = false;
        return false;
      }
      if (res && res.data && res.data.code === 200 && res.data.success) {
        console.log("res.data", res.data.data);
        this.tableData = res.data.data.list || [];
        this.total = res.data.data.totalCount || 0;
        this.isLoading = false;
        return true;
      } else {
        this.$Message.error(res.data.msg);
      }
      this.isLoading = false;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    // 详情页面
    goDetail(row) {
      this.$router.push({
        name: "task-config",
        query: {
          isDetail: 1,
          uuid: row.basicUuid,
        },
      });
    },
    viewLog(row) {
      this.showLog = true;
      this.logId = row.basicUuid;
    },
    // 停用
    toggleStatus(row) {
      let message = "";
      let title = "";
      if (
        row.taskStatus &&
        (String(row.taskStatus) === "2" || String(row.taskStatus) === "4")
      ) {
        message = "停用成功";
        title = "确认停用任务？";
      }
      this.$Modal.confirm({
        title: title,
        onOk: () => {
          updateManageTaskStatus({ basicUuid: row.basicUuid }).then((res) => {
            this.$Message.success(message);
            this.current = 1;
            this.getList();
          });
        },
      });
    },
    // 编辑
    goEdit(row) {
      this.showEdit = true;
      this.$router.push({
        name: "task-config",
        query: {
          isEdit: 1,
          uuid: row.basicUuid,
        },
      });
    },
    // 复制
    copyTask(row) {
      this.showCopy = true;
      this.copyId = row.basicUuid;
    },
    copySuccess(taskInfo) {
      // 复制成功，page重置
      this.current = 1;
      this.getList();
      this.$router.push({
        name: "task-config",
        query: {
          cc: 1,
          uuid: this.copyId,
          taskInfo: encodeURIComponent(JSON.stringify(taskInfo)),
        },
      });
    },
    // 新增任务
    addNew() {
      this.showAdd = true;
      this.$router.push({
        name: "task-config",
      });
    },
    // 审核任务
    goApprove(row) {
      commitOaProcess({ basicUuid: row.basicUuid }).then((res) => {
        this.$Message.success("提交审核成功");
        this.current = 1;
        this.getList();
      });
    },
    deleteTask(row) {
      this.$Modal.confirm({
        title: "确认",
        content: "<p>确认删除任务？</p>",
        onOk: () => {
          this.confirmDeleteTask(row);
        },
        onCancel: () => {},
      });
    },
    confirmDeleteTask(row) {
      removeManageTask({
        basicUuid: row.basicUuid,
        creator: row.creator,
        updater: row.updater,
      })
        .then((res) => {
          if (res && res.data && res.data.code === 200 && res.data.success) {
            this.$Message.success("删除任务成功");
            this.current = 1;
            this.getList();
          } else {
            this.$Message.error("删除任务失败");
          }
        })
        .catch((e) => {
          this.$Message.error("删除任务失败");
        });
    },
  },
};
</script>
<style lang="less">
.task-list_wrap {
  /deep/ .operate {
    display: flex;
    flex-wrap: wrap;
  }
  /deep/ .agentName {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
