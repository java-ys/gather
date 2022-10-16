<template>
  <Form label-position="right" :label-width="0" class="ques-ana">
    <div class="topTitle">{{$route.query.configName}}</div>
    <Tabs v-model="activeTab">
      <TabPane
        v-for="(itemTab, indexTab) in anasyleData"
        :key="indexTab"
        :name="String(indexTab + 1)"
        :label="itemTab.questionnaireName"
      >
        <h2 class="cellTitle">触达数据</h2>
        <div class="numBar">
          <span>短信发送人次：{{itemTab.sendSmsCount}}</span>
          <span>触达人次：{{itemTab.sendCount}}</span>
          <span>问卷回收人次：{{itemTab.retrieveCount}}</span>
        </div>
        <div>截止时间至：{{$moment(itemTab.endTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <Divider />
        <template v-if="itemTab.answerList.length">
          <div style="margin-right:16px">
            <div class="loadBar">
              <div>提交时间&nbsp;&nbsp;</div>
              <DatePicker
                v-model="dateTimeValue"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择"
                style="width: 280px"
                @on-change="handleDTChange"
              ></DatePicker>
              <Button type="primary" :disabled="!canExport"
                      @click="downloadAnswerExcel(false, itemTab, 1)"
              >
                导出答题详细excel
              </Button>
              <Button type="primary" :disabled="!canExport"
                      @click="downloadAnswerExcel(false, itemTab, 2)"
              >
                导出答题详细csv
              </Button>
              <Button type="success" :disabled="canExport" @click="downloadAnswerExcel(true, itemTab)">下载</Button>
            </div>
            <div class="loadBar">
              <Button type="info"
                      @click="handleViewTotalDetail(itemTab)"
              >
                查看答题详细
              </Button>
            </div>
          </div>

          <h2 class="cellTitle">题目分析</h2>
          <div v-for="(item, index) in itemTab.answerList" :key="index" class="ques-item">
            <div
              :class="[
                'questionTitle',
                item.answerRequired === 1 ? 'isrequired' : '',
              ]"
            >
              {{index +
                1 +
                "、" +
                item.titleName +
                "(" +
                questionTypeArr[item.titleType] +
                ")"}}
            </div>
            <!-- 单选题/多选题 -->
            <ul v-if="item.titleType === 1 || item.titleType === 2">
              <li><span>选项</span><span>小计</span><span>比例</span></li>
              <li v-for="(item1, index1) in item.choiceAnswerList" :key="index1">
                <span>{{item1.choiceName}}</span>
                <span>{{item1.count}}</span>
                <span>
                  <Progress v-if="item1.percent !== 100" :percent="item1.percent" />
                  <Progress v-else :percent="100">100%</Progress>
                </span>
              </li>
              <li>
                <span>有效填写人次</span><span>{{item.validCount}}</span>
              </li>
            </ul>
            <!-- 填空题 -->
            <Button
              v-else-if="item.titleType === 3"
              class="margin8"
              type="info"
              @click="handleViewBlankDetail(item, itemTab, index)"
            >
              查看详细
            </Button>
            <!-- 量表题 -->
            <div v-else>
              <div v-for="(item2, index2) in item.npsAnswerList" :key="index2">
                <!-- 量表矩阵title -->
                <div v-if="[5, 6].indexOf(item.titleType) > -1" class="margin8">{{item2.leftName}}</div>
                <ul>
                  <li><span>选项</span><span>小计</span><span>比例</span></li>
                  <li v-for="(item3, index3) in item2.npsScoreList" :key="index3">
                    <span v-if="item.titleType === 4">{{getScoreName(
                      item2,
                      item3,
                      index3
                    )}}</span>
                    <span v-else>{{item3.score}}</span>
                    <span>{{item3.count}}</span>
                    <span>
                      <Progress v-if="item3.percent !== 100" :percent="item3.percent" />
                      <Progress v-else :percent="100">100%</Progress>
                    </span>
                  </li>
                  <li>
                    <span>有效填写人次</span><span>{{item2.npsValidCount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </TabPane>
    </Tabs>

    <!-- 填空题答题统计弹框 -->
    <Modal v-model="isShowBlankModal" title="" width="80%" footer-hide>
      <p :class="[
        'questionTitle answer margin8',
        currentQuestion && currentQuestion.answerRequired === 1 ? 'isrequired' : '',
      ]"
      >
        {{currentQuestionIndex + '、' + (currentQuestion && currentQuestion.titleName) + '（填空题）'}}
      </p>
      <v-table
        :current="current"
        :total="total"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></v-table>
    </Modal>

    <!-- 查看答题详细弹框 -->
    <Modal v-model="isShowTotalModal" title="" width="80%" footer-hide>
      <p class="margin8">{{currentTab.questionnaireName}}</p>
      <v-table
        :current="current"
        :total="total"
        :pageSize="pageSize"
        :parColumns="columnsTotal"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></v-table>
    </Modal>

    <!-- 查看答案弹框 -->
    <Modal v-model="isShowAnswerModal" class="viewAnswer" title="" width="60%" footer-hide>
      <div class="topBar">
        <span>序号：{{currentAnswerRow._index + 1}}</span>
        <span>手机号：{{renderTel(currentAnswerRow.mobileNo)}}</span>
        <span>提交问卷时间：{{$moment(currentAnswerRow.submitTime).format('YYYY/MM/DD HH:mm:ss')}}</span>
        <span>来源：{{pushChannelMap[currentAnswerRow.channel]}}</span>
      </div>
      <div v-for="(item, index) in answerDetailObj.answerList" :key="index">
        <div label="" :class="[
          'questionTitle answer',
          item.answerRequired === 1 ? 'isrequired' : '',
        ]"
        >
          {{(item.showTitleIndex || (index + 1)) +
            "、" +
            item.titleName +
            "(" +
            questionTypeArr[item.titleType] +
            ")"}}
        </div>
        <div
          v-if="item.titleType === 1 || item.titleType === 2"
          class="change-line"
        >
          <div v-for="(item1, index1) in item.choiceAnswerList.filter((item) => item.selectFlag)" :key="index1">
            <p>{{item1.name}}  <span v-if="item1.optionExtraText">[填空项:{{item1.optionExtraText}}]</span></p>
          </div>
        </div>
        <div v-if="item.titleType === 3" class="flexHorizontal">
          <div>{{item.blankAnswer}}</div>
        </div>
        <div v-else>
          <div v-for="(item1, index1) in item.npsAnswerList"
               :key="index1"
               class="flexHorizontal"
          >
            <span v-if="item.titleType !== 4" class="mr8">{{item1.leftName}}</span>
            <span v-if="item1.npsValue || item1.npsValue === 0">{{item1.npsValue}}分</span>
          </div>
        </div>
      </div>
    </Modal>
  </Form>
</template>

<script>
import { pushChannelMap } from "../../fields";
import { blankColumns, totalColumns } from "./fields";
import { renderTel } from "../fields";
import {
  analyseHome,
  blankAnswerSummary,
  answerSummary,
  deleteAnswer,
  answerDetail,
  exportAnswerDetail,
} from "_o/api/nps/app.js";

export default {
  name: "fixed-url-ques-analyse",
  components: {},
  props: {
    configId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let { columns } = blankColumns;
    let { columnsTotal } = totalColumns;
    return {
      activeTab: "1",
      anasyleData: [],
      dateTimeValue: ["", ""],
      isShowBlankModal: false, // 填空题查看详细弹框
      isShowTotalModal: false, // 查看答题详细弹框
      isShowAnswerModal: false, // 查看答案弹框
      currentQuestion: {},
      currentQuestionIndex: 0,
      currentTab: {},
      currentAnswerRow: {},
      questionTypeArr: [
        "文本",
        "单选题",
        "多选题",
        "填空题",
        "NPS量表题",
        "5级量表矩阵",
        "NPS量表矩阵",
      ],
      columns: columns(this),
      columnsTotal: columnsTotal(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      currentFun: () => {},
      answerDetailObj: {},
      canExport: true,
      downloadIndex: 1,
      pushChannelMap,
      renderTel
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      analyseHome({ configId: this.$route.query.configId }).then((res) => {
        // console.log("问卷分析", res);
        if (res.data.success) {
          this.anasyleData = res.data.data || [];
        }
      });
    },
    downloadAnswerExcel(downloadFlag, itemTab, type) {
      type && (this.canExport = false)
      type && (this.downloadIndex = type)
      let params = {
        configId: Number(this.$route.query.configId),
        questionnaireId: itemTab.questionnaireId,
        exportType: type || this.downloadIndex,
        submitTimeFrom: this.dateTimeValue[0] ? (new Date(this.dateTimeValue[0])).getTime() : "",
        submitTimeTo: this.dateTimeValue[0] ? (new Date(this.dateTimeValue[1])).getTime() : ""
      };
      if (!downloadFlag) {
        this.$Modal.info({
          title: "提示",
          content: "正在准备数据，请耐心等待"
        });
      }
      exportAnswerDetail(params).then((res) => {
        if (res.data.success) {
          if (downloadFlag) {
            this.canExport = true
            window.location.href = res.data.data.fileUrl
          }
        } else {
          this.canExport = true
        }
      });
    },
    handleDTChange(val) {
      this.dateTimeValue = val
    },
    getScoreName(itemParent, item, index) {
      let len = itemParent.npsScoreList.length
      if (index === 0) {
        return itemParent.leftName || item.score;
      } else if (index === len - 1) {
        return itemParent.rightName || item.score;
      } else {
        return item.score;
      }
    },
    handleViewTotalDetail(itemTab) {
      this.isShowTotalModal = true;
      this.currentQuestion = null
      this.currentTab = itemTab;
      this.currentFun = answerSummary;
      this.tableParamsInit();
      this.getTableList();
    },
    handleViewBlankDetail(item, itemTab, index) {
      this.isShowBlankModal = true;
      this.currentQuestion = item;
      this.currentQuestionIndex = index + 1
      this.currentTab = itemTab;
      this.currentFun = blankAnswerSummary;
      this.tableParamsInit();
      this.getTableList();
    },

    tableParamsInit() {
      this.tableData = [];
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    getTableList() {
      let params = {
        configId: Number(this.$route.query.configId),
        questionnaireId: this.currentTab.questionnaireId,
        analysisId: this.currentQuestion && this.currentQuestion.analysisId,
        currPage: this.current,
        pageSize: this.pageSize,
      };
      !this.currentQuestion && delete params.analysisId
      this.currentFun(params).then((res) => {
        if (res.data.success) {
          let data = res.data.data || {};
          this.tableData = data.list || [];
          this.total = data.totalCount;
        }
      });
    },
    handleDelete(answerSnapshotId) {
      this.$Modal.confirm({
        title: "删除",
        content: "确定删除该答案？",
        onOk: () => {
          deleteAnswer({ answerSnapshotId }).then((res) => {
            if (res.data.success) {
              this.getTableList()
              this.init()
            }
          });
        },
      });
    },
    handleCheckAnswers(row) {
      this.isShowBlankModal = false;
      this.isShowTotalModal = false;
      this.currentAnswerRow = row;
      this.isShowAnswerModal = true;
      let params = {
        configId: this.$route.query.configId,
        questionnaireId: this.currentTab.questionnaireId,
        answerSnapshotId: row.answerSnapshotId,
      };
      answerDetail(params).then((res) => {
        if (res.data.success) {
          this.answerDetailObj = res.data.data || {};
        }
      });

      // 以下内容联调后删除
      this.answerDetailObj = {
        questionnaireId: 1,
        questionnaireName: "问卷一",
        submitState: 0,
        answerList: [
          {
            titleType: 1,
            titleName: "这是题目名称",
            answerRequired: 0,
            choiceAnswerList: [],
            npsAnswerList: [],
            blankAnswer: "",
          },
        ],
      };
    },
  },
};
</script>

<style lang="less" scoped>
.ques-ana{
  .ques-item{
    margin: 24px 0;
    ul{
      margin: 10px;
    }
  }
}
.topTitle{
  font-size: 18px;
}
.ivu-tabs-tabpane {
  padding-top: 10px;
  overflow: auto;
}
.cellTitle {
  font-size: 18px;
}
.numBar {
  display: flex;
  justify-content: flex-start;
  span {
    margin-right: 15px;
  }
}

.loadBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 15px 0;
  button {
    margin-left: 15px;
  }
}
.questionTitle {
  font-size: 16px;
  font-weight: bolder;
  &:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: transparent;
  }
  &.isrequired:before{
    color: #ed4014;
  }
}
.answer{
  font-size: 14px;
  margin-bottom: 8px;
}
.margin8 {
  margin: 8px 0 !important;
}
.mr8{
  margin-right: 8px;
}
ul {
  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-height: 40px;
    // line-height: 40px;
    padding: 0 15px;
    &:nth-child(2n) {
      background-color: #f8f8f9;
    }
    & > span:first-child {
      width: 33%;
    }
    & > span:nth-of-type(2) {
      width: 33%;
    }
    & > span:nth-of-type(3) {
      width: 34%;
    }
    &:hover,
    &:active{
      background-color: #ebf7ff;
    }
  }
}
.topBar {
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
  margin-bottom: 10px;
  span {
    margin-right: 15px;
  }
}
.change-line{
   padding-left: 30px;
   margin-bottom: 8px;
}
.flexHorizontal {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
  padding-left: 30px;
}
.viewAnswer .ivu-form-item{
  margin-bottom: 0px;
}
</style>
