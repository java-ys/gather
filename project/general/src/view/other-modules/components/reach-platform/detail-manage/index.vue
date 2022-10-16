<template>
  <div class="detail-manage">
    <Alert>跳转至大数据平台：<a href="https://bi.m2cn.cn/webroot/decision/v5/design/report/41c59531771b4f6ca5c4b1958966d8d1/view" target="_blank">https://bi.m2cn.cn/webroot/decision/v5/design/report/41c59531771b4f6ca5c4b1958966d8d1/view</a></Alert>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" />
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
import { queryDetailList } from "_o/api/reach-platform";
import { indexMixin } from "../mixin";
import { getDateRange, formatSearchDataTimeField } from "../util";

export default {
  name: "detail-manage",
  mixins: [indexMixin],
  data: () => ({
    inputList: [
      {
        name: "text-input",
        bind_key: "account",
        value: "",
        title: "账号",
        titleWidth: 60,
      },
      {
        name: "date-input",
        bind_key: ["reachTimeStart", "reachTimeEnd"],
        placeholder: "请选择日期",
        value: getDateRange(),
        title: "触达时间：",
        inputWidth: 200,
      },
    ],
    columns: [
      {
        title: "账号",
        key: "account",
        minWidth: 120
      },
      {
        title: "触达方式",
        key: "reachWay",
        minWidth: 120,
      },
      {
        title: "应用名称",
        key: "applicationName",
        tooltip: true,
        ellipsis: true,
        minWidth: 120,
      },
      {
        title: "模板类型",
        key: "templateType",
        minWidth: 100,
      },
      {
        title: "业务场景",
        key: "businessScenario",
        minWidth: 100,
      },
      {
        title: "模板编码",
        key: "templateCode",
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: "模板名称",
        key: "templateName",
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: "触达内容",
        key: "reachContent",
        ellipsis: true,
        tooltip: true,
        minWidth: 120,
      },
      {
        title: "触达时间",
        key: "reachTime",
        minWidth: 150,
      },
      {
        title: "状态",
        key: "status",
        minWidth: 80,
      },
      {
        title: "失败原因",
        key: "failReason",
        ellipsis: true,
        tooltip: true,
        minWidth: 160,
      },
      {
        title: "创建人",
        key: "creator",
        minWidth: 100,
      },
      {
        title: "创建组织",
        key: "createGroup",
        minWidth: 100,
      },
    ],
    searchData: getDateRange(true).reduce((res, v, i) => {
      res[i ? "reachTimeEnd" : "reachTimeStart"] = v;
      return res;
    }, {}),
  }),
  methods: {
    request(data) {
      return queryDetailList(formatSearchDataTimeField(data, "reachTimeStart", "reachTimeEnd"));
    },
    onFieldChange(data, name) {
      if (name !== "date") return;
      if ((new Date(data[1]) - new Date(data[0]) > 30 * 24 * 60 * 60 * 1000)) {
        this.$Message.error("时间跨域不能超过30天");
        this.inputList.find(v => v.name === "date-input").value = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>

</style>