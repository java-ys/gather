<template>
  <div>
    <Form
      inline="inline"
      :label-width="85"
    >
      <FormItem label="业务标签:">
        <Input
          v-model="businessTagName"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
          placeholder="请输入业务标签"
        />
      </FormItem>
      <FormItem label="问题标签:">
        <Input
          v-model="problemTagName"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
          placeholder="请输入问题标签"
        />
      </FormItem>
      <FormItem label="版本号:">
        <Input
          v-model="appVersion"
          clearable
          style="width:250px"
          :maxlength="50"
          placeholder="请输入版本号"
        />
      </FormItem>
      <FormItem label="问题描述:">
        <Input
          v-model="description"
          clearable
          style="width:250px"
          :maxlength="50"
          placeholder="请输入问题描述"
        />
      </FormItem>
      <FormItem label="反馈时间:">
        <DatePicker
          v-model="effectDate"
          :value="effectDate"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          placement="bottom-end"
          placeholder="请选择反馈时间"
          style="width: 300px"
          @on-change="dateChange"
        ></DatePicker>
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">
          重置
        </Button>
      </FormItem>
    </Form>
    <div style="margin-bottom: 20px;">
      <Button
        v-hasAuth="'suggestion-feedback-business'"
        style="margin-right:20px"
        @click="addData(1)"
      >
        业务标签
      </Button>
      <Button
        v-hasAuth="'suggestion-feedback-question'"
        style="margin-right:20px"
        @click="addData(2)"
      >
        问题标签
      </Button>
      <export-file
        v-hasAuth="'suggestion-feedback-download'"
        baseUrlKey="_baseUrl4Crm"
        exportUrl="/api/problem/feedback/export"
        exportFileName="意见反馈列表.xlsx"
        :queryData="searchData"
        btnText="下载"
        :disabled="!total || total === 0"
      ></export-file>
    </div>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <add
      ref="add"
      @reload="init"
    />
    <lookImage
      ref="lookImage"
      @reload="init"
    />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import add from "./add";
import lookImage from "./lookImage";
import ExportFile from "_a/export-file/exportFile";
import fileDownload from "js-file-download";

import {
  feedbackList,
  feedbackTag,
  feedbackTagAdd,
  feedbackTagDelete
} from "_o/api/userStudy";
export default {
  components: {
    add,
    ExportFile,
    lookImage
  },
  data() {
    let { columns } = listColumns;
    const beforeOneMonth = this.$moment(new Date()).subtract(1, "months").format("YYYY-MM-DD HH:mm:ss")
    const currentDate = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

    return {
      businessTagName: "",
      problemTagName: "",
      feedbackStartTime: beforeOneMonth,
      feedbackEndTime: currentDate,
      // 默认一个月
      effectDate: [beforeOneMonth, currentDate],
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      appVersion: '',
      description: ''
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    init() {
      this.businessTagName = "";
      this.problemTagName = "";
      this.feedbackStartTime = "";
      this.feedbackEndTime = "";
      this.effectDate = "";
      this.appVersion = ''
      this.description = ''
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        businessTagName: this.businessTagName,
        problemTagName: this.problemTagName,
        feedbackStartTime: this.feedbackStartTime,
        feedbackEndTime: this.feedbackEndTime,
        appVersion: this.appVersion,
        description: this.description
      };
      this.searchData = params;
      feedbackList(params).then(res => {
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
    goDetail(val) {
      this.$refs.detail.init(val);
    },
    addData(val) {
      this.$refs.add.init(val);
    },
    dateChange(val) {
      this.feedbackStartTime = val[0];
      this.feedbackEndTime = val[1];
    },
    lookImg(val) {
      this.$refs.lookImage.init(val);
    },
    goEdit(val) {
      this.$refs.add.init(val);
    }
  }
};
</script>

