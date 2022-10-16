<template>
  <div class="question_modal">
    <Modal
      v-model="modalStatus"
      :title="'问卷反馈详情'"
      :width="1080"
      class="question-modal"
      :mask-closable="false"
      @on-cancel="cancelData"
    >
      <div class="row">
        <div class="left">
          <div>{{ detail.name || '-' }}</div>
        </div>
        <div class="right">
          <div>
            <!-- <Button
              type="primary"
              @click="downloadFeed"
            >
              下载
            </Button> -->
            <ExportFile
              v-hasAuth="'question-detail-download'"
              exportUrl="/api/short/questionnaire/downloadAnswerStatistics"
              exportFileName="短问卷问题详情.xls"
              :queryData="downloadParams"
              btnText="下载"
              :baseUrlKey="baseUrl"
              :disabled="tableData && tableData.length === 0"
            >
            </ExportFile>
          </div>
        </div>
      </div>
      <!-- 车牌号表格 -->
      <VTable
        ref="questionDetailTable"
        :total="pageObj.total"
        :current="pageObj.current"
        :pageSize="pageObj.pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />
      <!-- 底部按钮 -->
      <div slot="footer">
        <Button
          type="primary"
          @click="cancelData"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="showFullMask"
      :closable="false"
      style="text-align: center;"
    >
      <div style="position: relative;">
        <img
          style="width:100%;"
          :src="bigImgUrl"
        >
      </div>
      <div slot="footer">
        <Button
          type="primary"
          @click="showFullMask = false"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import ExportFile from "_a/export-file/exportFile"
import { queryQuestionDetail } from "_o/api/operator-carrier";

export default {
  name: "QuestionModal",
  components: {
    ExportFile
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    detail: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    const _self = this
    return {
      baseUrl: "_baseUrl4CommonWeb",
      modalStatus: this.visible,
      tableData: [],
      // 新建弹框表格列
      tableColumns: [{
        title: "订单号",
        key: "routeNo",
        minWidth: 120,
      },
      {
        title: "车牌号",
        key: "carNo",
        minWidth: 120,
      },
      {
        title: "司机姓名",
        key: "driverName",
        minWidth: 150,
      },
      {
        title: "反馈时间",
        key: "answerDate",
        minWidth: 150,
      },
      {
        title: "反馈人",
        key: "mobile",
        minWidth: 150,
      },
      {
        title: "反馈意见",
        key: "answerContent",
        minWidth: 150,
      },
      {
        title: "车内照片",
        key: "imageUrl",
        minWidth: 150,
        render(h, params) {
          if (!params.row.imageUrl) {
            return h("span", {}, "-")
          }
          return h("img", {
            "class": {
              "carPhoto": true
            },
            on: {
              click: () => {
                _self.showFullImg(params.row.imageUrl)
              }
            },
            attrs: {
              src: params.row.imageUrl
            },
          })
        }
      }],
      pageObj: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      downloadParams: {
        questionId: this.detail.questionId,
        optionId: this.detail.optionId,
      },
      bigImgUrl: "",
      showFullMask: false
    }
  },
  watch: {
    visible(newValue) {
      this.modalStatus = newValue
    }
  },
  mounted() {
    this.requestPlateDetail()
  },
  methods: {
    // 展示完整的图片
    showFullImg(url) {
      this.showFullMask = true
      this.bigImgUrl = url
    },
    async requestPlateDetail() {
      const res = await queryQuestionDetail({
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        questionId: this.detail.questionId,
        optionId: this.detail.optionId,
      })
      if (!res) {
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success) {
        let data = res.data.data;
        this.pageObj.total = data ? data.totalCount : 0;
        this.tableData = data ? data.list : [];
        this.tableData = this.tableData.map((item, index) => ({
          ...item,
          index: Number(index) + 1
        }))
      }
    },
    changePage: function (val) {
      this.pageObj.current = val;
      this.requestPlateDetail();
    },
    changePageSize: function (val) {
      this.pageObj.pageSize = val;
      this.requestPlateDetail();
    },
    handleReset() {
      this.pageObj.current = 1;
      this.requestPlateDetail()
    },
    handleQuery() {
      this.requestPlateDetail()
    },
    cancelData() {
      this.modalStatus = false;
      // 清空记录
      this.tableData = [];
      this.pageObj.current = 1;
      this.pageObj.total = 0;
      this.pageObj.pageSize = 10;
      this.$emit("update:visible")
    },
  }
}
</script>
<style lang="less" scoped>
.question-modal {
  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .left {
      flex: 1;
      font-size: 16px;
      color: #000;
      font-weight: 600;
      height: 48px;
    }
    .right {
      flex: 1;
      height: 48px;
      display: flex;
      justify-content: flex-end;
    }
  }
  /deep/ .carPhoto {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
</style>
