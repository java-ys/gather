<template>
  <div class="task-manage">
    <SearchList :inputList="inputList" @on-change="onFieldChange" @on-search="search" @on-reset="search" />
    <m2-table
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
  </div>
</template>

<script>
import { queryTaskList, queryAppList } from "_o/api/reach-platform";
import { indexMixin } from "../mixin";
import { REACH_WAY_LIST, TEMPLATE_TYPE_LIST, TASK_STATUS_LIST } from "../field"
import { getDateRange, formatSearchDataTimeField, throttle } from "../util";

export default {
  name: "task-manage",
  mixins: [indexMixin],
  data: () => ({
    inputList: [
      {
        name: "drop-input",
        bind_key: "appCode",
        value: "",
        dropList: [],
        title: "应用",
        titleWidth: 60,
      },
      {
        name: "text-input",
        bind_key: "organID",
        value: "",
        title: "创建组织",
        titleWidth: 60,
      },
      {
        name: "text-input",
        bind_key: "creator",
        value: "",
        title: "创建人",
        titleWidth: 60,
      },
      {
        name: "text-input",
        bind_key: "templateCode",
        value: "",
        title: "模板编码",
        titleWidth: 60,
      },
      {
        name: "drop-input",
        bind_key: "taskStatus",
        value: "",
        dropList: TASK_STATUS_LIST,
        title: "任务状态",
        titleWidth: 60,
      },
      {
        name: "date-input",
        bind_key: ["startTime", "endTime"],
        placeholder: "请选择日期",
        value: getDateRange(),
        title: "任务时间：",
        inputWidth: 200,
      },
    ],
    columns: [
      {
        title: "创建人",
        key: "creatorName",
        minWidth: 120
      },
      {
        title: "任务名称",
        key: "taskName",
        minWidth: 120,
        ellipsis: true,
      },
      {
        title: "创建组织",
        key: "organName",
        minWidth: 120
      },
      {
        title: "应用名称",
        key: "appName",
        ellipsis: true,
        minWidth: 120,
      },
      {
        title: "模板名称",
        key: "templateName",
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: "触达方式",
        key: "protocol",
        minWidth: 80,
        render: (h, params) => h("span", REACH_WAY_LIST.map(v => v.label)[params.row.protocol])
      },
      {
        title: "模板类型",
        key: "templateType",
        minWidth: 80,
        render: (h, params) => h("span", TEMPLATE_TYPE_LIST.map(v => v.label)[params.row.templateType])
      },
      {
        title: "触达内容",
        key: "content",
        tooltip: true,
        ellipsis: true,
        minWidth: 120,
      },
      {
        title: "发送人数",
        key: "targetNum",
        minWidth: 120,
      },
      {
        title: "发送成功人数",
        key: "successNum",
        minWidth: 160,
      },
      {
        title: "状态",
        key: "taskStatus",
        minWidth: 120,
        render: (h, params) => h("span", TASK_STATUS_LIST.map(v => v.label)[params.row.taskStatus])
      },
    ],
    searchData: getDateRange(true).reduce((res, v, i) => {
      res[i ? "endTime" : "startTime"] = v;
      return res;
    }, {}),
  }),
  created() {
    this.updateAppList();
  },
  methods: {
    request(data) {
      return queryTaskList(formatSearchDataTimeField(data, "startTime", "endTime"));
    },
    onFieldChange(data, name) {
      if (name !== "date") return;
      if ((new Date(data[1]) - new Date(data[0]) > 30 * 24 * 60 * 60 * 1000)) {
        this.$Message.error("时间跨域不能超过30天");
        this.inputList.find(v => v.name === "date-input").value = "";
      }
    },
    updateAppList: throttle(function() {
      const item = this.inputList.find(v => v.bind_key === "appCode");
      const appList = item.dropList;
      if (appList.length % 20) return;
      queryAppList({ currPage: 1 + (appList.length / 20 | 0), pageSize: 20 }).then(res => {
        item.dropList = appList.concat(res.list.map(v => ({ label: v.appName, value: v.appCode })));
      })
    }),
  }
};
</script>

<style lang="less" scoped>

</style>