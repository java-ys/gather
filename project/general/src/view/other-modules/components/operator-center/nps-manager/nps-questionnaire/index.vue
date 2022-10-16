<template>
  <div>
    <Form
      inline="inline"
      :label-width="85"
    >
      <FormItem label="问卷名称:">
        <Input
          v-model="taskName"
          clearable="clearable"
          style="width:200px"
          :maxlength="20"
        />
      </FormItem>
      <FormItem label="人群分类:">
        <Select
          v-model="userType"
          clearable
          style="width:150px"
        >
          <Option
            v-for="(value, key) in personGroupMap"
            :key="key"
            :value="key"
          >
            {{value}}
          </Option>
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
        <Button @click="init">
          重置
        </Button>
      </FormItem>
    </Form>
    <Form
      inline="inline"
      align="right"
      :label-width="85"
    >
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px;width:120px"
          @click="addQues('add')"
        >
          新建
        </Button>
      </FormItem>
    </Form>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <log
      ref="log"
      @reload="init"
    />
    <!--新增问卷start--->
    <Modal v-model="showAdd" width="400" :title="popTitle" :mask-closable="false" footer-hide @on-cancel="cancel">
      <CreatePop v-if="actionType === 'add'" :actionType="actionType" @cancel="cancel"></CreatePop>
      <CopyPop v-if="actionType === 'copy'" :actionType="actionType" :questionnaireInfo="questionnaireInfo" @cancel="cancel"></CopyPop>
    </Modal>
    <!--新增问卷end--->
  </div>
</template>

<script>
import { listColumns } from "./fields";
import log from "./log";
// import ExportFile from "_a/export-file/exportFile";
import { getPersonGroup, personGroupMap } from "../fields";

import CreatePop from "./nps-questionnaire-action/createPop"
import CopyPop from "./nps-questionnaire-action/copyPop"
import { getQuestionnaires } from "_o/api/nps/app.js";

export default {
  components: {
    log,
    // ExportFile,
    CreatePop,
    CopyPop
  },
  data() {
    let { columns } = listColumns;

    return {
      taskName: "", // 名称
      userType: "", // 用户类型
      personType: "",
      checkDate: "", // 核检日期
      startTimeCheckDate: "", // 开始核检日期
      endTimeCheckDate: "", // 结束核检日期
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {},
      options: {},
      personGroupMap: personGroupMap,
      // 新增问卷字段
      showAdd: false, // 创建问卷弹窗
      actionType: "",
      questionnaireData: {}, // 操作的数据
      popTitle: "",
      modalType: "",
      questionnaireInfo: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getPersonGroup,
    init() {
      this.taskName = "";
      this.userType = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        name: this.taskName,
        userType: this.userType,
        currPage: this.current,
        pageSize: this.pageSize
      };
      if (!this.taskName) {
        delete params.taskName;
      }
      if (!this.userType) {
        delete params.userType;
      }
      this.searchData = params;
      getQuestionnaires(params).then(res => {
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
    // 新增
    addQues() {
      this.actionType = "add"
      this.popTitle = "新增问卷"
      this.showAdd = true
    },
    cancel() {
      this.showAdd = false
    },
    addsuccess() {
      this.cancel()
      this.init()
    },
    // 编辑
    goEdit(item) {
      this.actionType = "edit"
      this.$route.meta.closeAlert = true;
      this.$router.push({
        name: "nps-questionnaire-edit",
        query: { actionType: this.actionType, questionnaireId: item.questionnaireId }
      });
    },
    // 详情
    goDetail(item) {
      this.actionType = "detail"
      this.$route.meta.closeAlert = true;
      this.$router.push({
        name: "nps-questionnaire-detail",
        query: { actionType: this.actionType, questionnaireId: item.questionnaireId }
      });
    },
    // 复制
    goCopy(item) {
      // 获取详情
      this.actionType = "copy"
      this.popTitle = "复制问卷"
      this.showAdd = true
      this.questionnaireInfo = item
    },
    // 日志
    goLog(val) {
      this.actionType = "log"
      this.$refs.log.init(val);
    },
    deleteData(val) {

    },
  }
};
</script>

