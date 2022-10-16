<template>
  <div>
    <searchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    />
    <Button
      type="primary"
      @click.native="showAddModel"
      v-hasAuth="'exam-topic-add'"
      >添加题目</Button
    >
    <Button
      type="primary"
      style="margin-left: 20px"
      @click.native="showExportModel"
      v-hasAuth="'exam-topic-export'"
      >批量导入</Button
    >
    <m2-Table
      :isLoading="isLoading"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tabelColumns"
      :parTableData="tableData"
      style="margin-top: 20px"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
    <Modal
      v-model="addModelStatus"
      :width="800"
      :mask-closable="false"
      :title="modelTitle"
      footer-hide
      @on-cancel="cancel"
    >
      <AddModel
        ref="_add"
        :formItem="formItem"
        :action="action"
        :optionList="optionList"
        @cancel="cancel"
      />
    </Modal>
    <!-- 批量导入 -->
    <Modal
      v-model="exportModelStatus"
      :width="700"
      :mask-closable="false"
      :title="exportModelTitle"
      footer-hide
    >
      <ExportModel
        ref="exportModel"
        :exportItem="exportItem"
        :optionList="optionList"
        @cancel="exportModelCancel"
        @success="exportSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import { tool } from "_o/api/baseMixin.js";
import s from "_o/api/study-exam";
import m2Table from "_a/m2-table/v-table";
import common from "./common";
import { inputList, getTableColumns } from "./fields";
import AddModel from "./component/addModel";
import ExportModel from "./component/exportModel";

const _addItem = {
  categoryId: "",
  categoryName: "",
  questions: "",
  answerData: [
    {
      status: 0,
      value: "",
    },
    {
      status: 0,
      value: "",
    },
    {
      status: 0,
      value: "",
    },
  ],
  status: false,
};
export default {
  name: "exam-topic",
  mixins: [tool, common],
  components: {
    AddModel,
    ExportModel,
    m2Table,
  },
  data() {
    return {
      inputList: inputList(this),
      tabelColumns: getTableColumns(this),
      modelTitle: "添加题目",
      exportModelTitle: "批量导入",
      addModelStatus: false,
      exportModelStatus: false,
      optionList: [],
      otherParams: {},
      action: "add",
      formItem: JSON.parse(JSON.stringify(_addItem)),
      exportItem: {},
    };
  },
  created() {
    this.func = s.questionList;
    this.getList();
  },
  mounted() {
    this.getCategoryList();
  },
  computed: {
    params() {
      return {
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.otherParams,
      };
    },
  },
  methods: {
    handelReset() {
      this.current = 1;
      this.otherParams = {};
      this.getList(this.params);
    },
    async getCategoryList() {
      const [err, data] = await this.toResult(s.questionCategoryList({}));
      if (err) {
        return;
      }
      this.inputList[1].dropList = this.formatData(data.list);
      this.optionList = this.formatData(data.list);
    },
    formatData(v) {
      let arr = v.map((it) => {
        return {
          value: it.categoryId,
          label: it.categoryName,
        };
      });
      return arr;
    },
    showAddModel() {
      this.addModelStatus = true;
      // this.formItem = {
      //   answerData: [
      //     {
      //       status: 0,
      //       value: "",
      //     },
      //     {
      //       status: 0,
      //       value: "",
      //     },
      //     {
      //       status: 0,
      //       value: "",
      //     },
      //   ],
      //   status: false,
      // };

      this.formItem = JSON.parse(JSON.stringify(_addItem))
      this.action = "add";
    },
    showExportModel() {
      // this.$refs.exportModel.clear();
      this.exportItem = {};
      this.$refs.exportModel.file = null;
      this.exportModelStatus = true;
    },
    queryList(res) {
      this.otherParams = res;
      this.current = 1;
      this.getList();
    },
    cancel(refresh) {
      this.addModelStatus = false;
      if(this.$refs._add) {
        this.$refs._add.clear()
      }
      if (refresh) {
        this.getList();
        this.getCategoryList();
      }
    },
    exportModelCancel() {
      this.exportModelStatus = false;
    },
    exportSuccess() {
      this.exportModelStatus = false;
      this.getList();
    },
    toEdit({ id, questions, questionAnswerDtoList, categoryId }) {
      this.addModelStatus = true;
      this.action = "edit";

      let answerData = []; // 题目选项
      let triggerCondition = []; // 选中答案 索引
      if (questionAnswerDtoList && questionAnswerDtoList.length !== 0) {
        for (let i = 0; i < questionAnswerDtoList.length; i++) {
          if (questionAnswerDtoList[i].optionStatus - 1 === 0) {
            triggerCondition.push(i + 1);
          }
          answerData.push({
            value: questionAnswerDtoList[i].optionDescription,
            status: questionAnswerDtoList[i].optionStatus,
          });
        }
      } else {
        answerData.push(
          {
            status: 0,
            value: "",
          },
          {
            status: 0,
            value: "",
          },
          {
            status: 0,
            value: "",
          }
        );
      }
      this.formItem = {
        id,
        questions,
        answerData,
        optCheck: triggerCondition,
        categoryId: `${categoryId}`,
      };
    },
  },
};
</script>

<style lang="less">
.cursor {
  cursor: pointer;
}
</style>
