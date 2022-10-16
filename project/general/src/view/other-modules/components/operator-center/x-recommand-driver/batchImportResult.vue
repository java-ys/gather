<template>
  <Modal
    title="导入结果详情"
    style="text-align: center; overflow-y: scroll"
    :value="resultVisible"
    @on-cancel="closeDialog"
    width="70%"
  >
    <Row class="detail-style">
      <p class="detail-text">
        导入总数： {{ resultData.successCount + resultData.importFailCount }},
        成功： <span style="color: green">{{ resultData.successCount }}</span
        >条， 失败：
        <span style="color: red"> {{ resultData.importFailCount }}</span
        >条
      </p>
      <p
        class="detail-text"
        v-if="errNo == false && resultData.importFailCount >= 1"
        style="margin-bottom: 50px"
      >
        错误及重复信息汇总请点击下载
      </p>
      <template
        v-if="
          resultData.failedRowArrL &&
          resultData.failedRowArrL.length == 1 &&
          resultData.failedRowArrR &&
          resultData.failedRowArrR.length == 0
        "
      >
        <div
          style="margin: 25px 0 10px 5px; font-weight: bold; font-size: 18px"
        >
          错误及重复信息汇总
        </div>
        <Col :span="24" style="margin-bottom: 10px">
          <Table :columns="columns" :data="resultData.failedRowArrL" border></Table>
        </Col>
      </template>
      <template v-if=" resultData.failedRowArrR && resultData.failedRowArrR.length > 0">
        <div
          style="margin: 25px 0 10px 5px; font-weight: bold; font-size: 18px"
        >
          错误及重复信息汇总
        </div>
        <Col :span="12" style="margin-bottom: 10px">
          <Table :columns="columns" :data="resultData.failedRowArrL" border></Table>
        </Col>
        <Col :span="12" style="margin-bottom: 10px">
          <Table :columns="columns" :data="resultData.failedRowArrR" border></Table>
        </Col>
      </template>
    </Row>
    <div>
      <Button @click="closeDialog" type="info" style="margin-top: 15px" >关闭</Button
      >
      <Button
        @click="downloadClick"
        type="info"
        style="margin-top: 15px"
        v-if="errNo == false && resultData.importFailCount >= 1"
        >下载错误信息</Button
      >
    </div>
    <p
      class="detail-text"
      style="margin-top: 50px"
      v-if="errNo == false && resultData.importFailCount >= 1"
    >
      请在十分钟内下载错误信息列表
    </p>
  </Modal>
</template>

<script>
export default {
  props: {
    batchAddResultData: {
      required: false,
      type: Object,
      default: () => {
        return {};
      },
    },
    resultVisible: {
      required: false,
      type: Boolean,
    },
    errNo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      resultData: {},
      columns: [
        {
          title: "行",
          key: "rowNum",
        },
        {
          title: "错误/重复信息",
          key: "msg",
        },
      ],
    };
  },
  watch: {
    resultVisible(value) {
      console.log(value, '--------------------');
      if (value) {
        this.catchResult();
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "result");
    },
    downloadClick() {
      this.$emit("downloadClick");
    },
    catchResult() {
      if (this.batchAddResultData && this.batchAddResultData.response) {
        let x = eval(this.batchAddResultData.response);
        this.resultData = x.data;
        if (this.resultData) {
          if (this.resultData.flag == "false") {
            this.$alert(
              "导入的简历数据超过100条，系统已对最靠前的100条记录进行筛选处理"
            );
          }
          this.resultData.failedRowArrL = [];
          this.resultData.failedRowArrR = [];
          this.resultData.dupRowArrL = [];
          this.resultData.dupRowArrR = [];
          let all = [];
          let count = 0;
          if (this.errNo) {
            this.resultData.failReasonMap.forEach((each) => {
              for (let key in each) {
                if (each.hasOwnProperty(key)) {
                  if (count % 2 == 0) {
                    this.resultData.failedRowArrL.push({
                      rowNum: key,
                      msg: each[key],
                    });
                  } else {
                    this.resultData.failedRowArrR.push({
                      rowNum: key,
                      msg: each[key],
                    });
                  }
                  count++;
                  // all.push({rowNum: key, msg: each[key]});
                }
              }
            });
          }
        } else {
          console.log();
        }
      } else {
        this.$emit("errorImport");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail-style {
  font-size: 14px;
}

.detail-text {
  font-weight: bold;
  font-size: 18px;
  margin: 15px 0 10px 8px;
}
</style>
