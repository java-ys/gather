<template>
  <div>
    <Modal
      v-model="visible"
      title="运营商考核账单"
      width="1080"
      :mask-closable="false"
      :closable="false"
    >
      <div class="container">
        <Row>
          <Col class-name="col-gap" span="12">考核月份：{{detail.billingRes.billingDate}}</Col>
          <Col class-name="col-gap" span="12">运营商：{{detail.billingRes.agentName}}</Col>
          <Col class-name="col-gap" span="12">城市：{{detail.billingRes.cityName}}</Col>
          <Col class-name="col-gap" span="12">运营模式：{{detail.billingRes.operateType | operateTypeF}}</Col>
          <Col class-name="col-gap" span="12">产品线：{{detail.billingRes.businessType | businessTypeF}}</Col>
          <Col class-name="col-gap" span="12">策略类型：{{detail.billingRes.strategyType | strategyTypeF}}</Col>
          <Col class-name="col-gap" span="12">管理条例：<span style="color: #2d8cf0;" @click="toFile">{{detail.billingRes.protocolName}}</span></Col>
          <Col class-name="col-gap" span="12">账单来源：{{billSourceMap[detail.billingRes.billingSource]}}</Col>
        </Row>
        <Divider />
        <Row class-name="mb-10">
          <Col span="4"><span class="bold">基础佣金：{{detail.basicAmountRes.basicAmount}}</span></Col>
          <Col><span class="font-12">基础佣金=佣金核算基数*考核指标系数</span></Col>
        </Row>
        <div class="c-c mb-10">
          <Row class-name="mb-10">
            <Col span="4"><span>佣金核算基数：{{detail.basicAmountRes.baseAmount}}</span></Col>
          </Row>
          <Row class-name="mb-10">
            <Col span="4"><span>流水维度：{{detail.basicAmountRes.baseAmountDetail.statisticsDimension | dimensionF}}</span></Col>
            <Col span="4"><span>计算方式：{{detail.basicAmountRes.baseAmountDetail.calMode | calModeF}}</span></Col>
          </Row>
          <Row class-name="mb-10">
            <Col span="24">
              <span>计佣流水：{{detail.basicAmountRes.baseAmountDetail.commissionOrderFlow}}</span>
              <span>=</span>
              <span>订单总流水：{{detail.basicAmountRes.baseAmountDetail.totalOrderFlow}}</span>
              <span>-</span>
              <span>风控订单流水：{{detail.basicAmountRes.baseAmountDetail.riskOrderFlow}}</span>
            </Col>
          </Row>
          <Row class-name="mb-10">
            <Col span="24">
              <span>计佣单量：{{detail.basicAmountRes.baseAmountDetail.commissionOrderNum}}</span>
              <span>=</span>
              <span>订单总量：{{detail.basicAmountRes.baseAmountDetail.totalOrderNum}}</span>
              <span>-</span>
              <span>风控订单量：{{detail.basicAmountRes.baseAmountDetail.riskOrderNum}}</span>
            </Col>
          </Row>
        </div>
        <div class="c-c">
          <Row class-name="mb-10">
            <Col span="4"><span class="bold">考核指标系数：{{detail.basicAmountRes.indexRatio}}</span></Col>
          </Row>
          <Table border :columns="businessColumns" :data="businessData">
            <template slot="action" slot-scope="params">
              <a @click="viewRow(params.row)">查看</a>
            </template>
          </Table>
        </div>
        <Divider />

        <Row class-name="mb-10">
          <Col span="4"><span class="bold">补发佣金：{{detail.reissueAmountRes.reissueAmount}}</span></Col>
        </Row>
        <div class="c-c">
          <Table border :columns="reissueColumns" :data="reissueData"></Table>
        </div>
        <Divider />

        <Row class-name="mb-10">
          <Col span="4"><span class="bold">补扣佣金：{{detail.deductionAmountRes.deductionAmount}}</span></Col>
        </Row>
        <div class="c-c">
          <Table border :columns="deductColumns" :data="deductData"></Table>
        </div>
        <br />
        <Row class-name="mb-10 mt-10">
          <Col span="4"><span class="bold">总分佣金额：{{detail.billingRes.totalAmount}}</span></Col>
          <Col><span class="font-12">总分佣金额=基础分佣+补发佣金-补扣佣金</span></Col>
        </Row>
        <Divider />

        <p class="title">流程处理</p>
        <Table border :columns="columns2" :data="data2"></Table>
        <div style="height: 40px"></div>

        <p class="title">附件列表</p>
        <Table border :columns="columnsFile" :data="dataFile"></Table>
        <div style="height: 40px"></div>

        <div v-if="!isFinish">
          <p class="title">处理意见</p>
          <Row v-if="isFileUpload" type="flex" style="margin: 20px 0">
            <Col span="4">
              <RadioGroup v-model="idea">
                <Radio :label="1">同意</Radio>
                <Radio :label="0">驳回</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <!-- <p class="po" v-if="isFileUpload">即将流向: 合作伙伴团队</p> -->
          <Input
            v-model="formData.opinion"
            type="textarea"
            class="desc-con"
            placeholder="请输入处理意见"
          />
          <div v-if="isFileUpload">
            <Row type="flex" style="margin: 20px 0">
              <Col span="3">
                <Upload
                  ref="_uploadFile"
                  :headers="header"
                  :format="format"
                  :action="actionUrl"
                  :data="uploadFiles"
                  :show-upload-list="false"
                  :fileList="fileList"
                  :largestNum="5"
                  @before-upload="(res) => beforeUpload(res)"
                  @on-success="(res) => uploadSuccess(res)"
                  @on-error="(err) => uploadError(err)"
                  @on-format-error="formatError"
                >
                  <Button type="primary">上传附件</Button>
                </Upload>
              </Col>
              <Col>
                <p class="desc">
                  文件支持：图片、WORD、PDF，每个类型附件最多上传5个
                </p>
              </Col>
            </Row>
            <div>
              <Row
                v-for="(item, index) in fileList"
                :key="index"
                class="bot-dashed"
              >
                <Col span="12"><span class="name">{{item.fileName}}</span>
                  <span v-if="item.fileSize" class="size">({{item.fileSize}}KB)</span>
                </Col>
                <Col span="12" class="t-r"><span class="time">{{formatTime(item.createTime)}}</span>
                  <Icon
                    type="md-eye"
                    class="ico"
                    @click="getUrlByUuid(item.uuid)"
                  /><Icon
                    type="ios-close"
                    class="ico"
                    @click="removeFile(item, index)"
                  /></Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button v-if="!isFinish" type="primary" @click="submit">提交</Button>
        <Button @click="(e) => cancel()">{{isFinish ? "关闭" : "取消"}}</Button>
      </div>
    </Modal>
    <add
      v-if="showAdd"
      :visible="showAdd"
      :detail="detailData"
      @close="close"
    ></add>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import {
  detailTableBusinessDetail,
  detailTableBusiness,
  columnProcess,
  columnsFile,
  reissueColumns,
  getBusinessType,
  getOperateType, reductColumns,
  billSourceMap
} from "../fields";
import { tool } from "_o/api/baseMixin.js";
import Upload from "../upload";
import { flowHandleService, flowTemporaryStorageService } from "_o/api/settle";
import oss from "@/mixins/oss";
import add from "./view.vue"
const rowData = {
  completeRate: "",
  indexName: "",
  ratio: "",
  score: "",
  weight: "",
};
export default {
  name: "bills-detail",
  components: { Upload, add },
  filters: {
    businessTypeF(s) {
      return getBusinessType(s);
    },
    operateTypeF(s) {
      return getOperateType(s);
    },
    strategyTypeF(s) {
      return { 0: "主策略", 1: "辅策略" }[s];
    },
    dimensionF(v) {
      const descList = ["", "司机", "运营商"];
      return descList[Number(v)]
    },
    calModeF(v) {
      const descList = ["", "阶梯", "非阶梯", "浮动"];
      return descList[Number(v)]
    }
  },
  mixins: [tool, oss],
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    detail: {
      type: Object,
      default: () => {
        return {
          billingRes: {},
          basicAmountRes: {
            baseAmountDetail: {},
            indexRatioDetailList: [],
          },
          billingAttachResList: [],
          billingRecordResList: [],
          deductionAmountRes: {
            deductionAmountDetailList: [],
          },
          reissueAmountRes: {
            reissueAmountDetailList: [],
          },
        };
      },
    },
  },
  data() {
    let {
      billingIndexResList,
      billingFlowResList,
      billingRecordResList,
      billingAttachResList,
      basicAmountRes,
      deductionAmountRes,
      reissueAmountRes,
    } = this.detail;
    let statusIsFour = this.detail.billingRes.billingStatus - 4 === 0;
    let list = [];
    if (basicAmountRes?.indexRatioDetailList) {
      basicAmountRes.indexRatioDetailList.forEach((row) => {
        list.push(row);
        if (row?.subIndexRatioDetailList?.length) {
          let firstSubRow = row.subIndexRatioDetailList[0]
          row.subIndexName = firstSubRow.indexName
          row.actualAchievement = firstSubRow.actualAchievement
          row.ratio = firstSubRow.ratio
          // row.score = firstSubRow.score
          row.subIndexRatioDetailList.slice(1).forEach((rw) => {
            const { actualAchievement, ratio, score } = rw
            let r = {
              indexName: "",
              actualAchievement,
              subIndexName: rw.indexName,
              ratio,
              score,
            };
            list.push(r);
          });
        }
      });
    }
    return {
      that: this,
      formData: {
        ...JSON.parse(JSON.stringify(this.detail)),
        opinion: "",
      },

      // 考核指标系数
      businessColumns: detailTableBusinessDetail(this),
      businessData: list,

      // 补发佣金数据
      reissueColumns: reissueColumns(this),
      reissueData: reissueAmountRes.reissueAmountDetailList,
      // 补扣数据
      deductColumns: reductColumns(this),
      deductData: deductionAmountRes.deductionAmountDetailList,

      columns2: columnProcess,
      data2: billingRecordResList,

      columnsFile: columnsFile(this),
      dataFile: billingAttachResList,

      idea: "",

      actionUrl: this._uploadUrl + "/file/upload/private", // 公共文件上传服务
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["PDF", "pdf", "doc", "docx", "jpg", "jpeg", "png"],
      uploadFiles: {},
      fileList: [],
      billSourceMap,
      showAdd: false,
      detailData: {}
    };
  },
  computed: {
    isFileUpload() {
      return [1, 4, 5].includes(this.detail.billingRes.billingStatus);
    },
    // billStatus 为4   处理意见为同意  可编辑  先调用 暂存 再调用 处理
    // 其他状态直接调用 处理 接口
    statusIsFour({ detail }) {
      return detail.billingRes.billingStatus - 4 === 0;
    },
    isFinish() {
      return this.detail.finish;
    },
  },
  methods: {
    cancel(refresh) {
      this.$emit("close", refresh);
    },
    async update() {
      let p = {
        billingReq: { ...this.formData.billingRes },
        billingFlowReqList: this.formData.billingFlowResList,
        billingIndexReqList: this.formData.billingIndexResList,
      };
      const [err, data] = await this.toResult(flowTemporaryStorageService(p));
    },
    async submit() {
      if (this.idea === "") {
        this.$Message.error("请选择处理结果");
        return;
      }

      // if (this.statusIsFour) {
      //   this.update();
      // }

      let handleP = {
        handle: this.getHandle(),
        taskId: this.detail.rowData.taskId,
        opinion: this.formData.opinion,
        billingUuid: this.detail.billingRes.uuid,
        billingAttachList: this.fileList.map((it) => ({
          attachName: it.fileName,
          attachUrl: it.publicUrl,
          attachUuid: it.uuid,
        })),
      };
      const [err, data] = await this.toResult(flowHandleService(handleP));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("提交成功");
      this.cancel(true);
    },
    getHandle() {
      /*
      billingStatus:
        待城市确认 1 -》 5 6
        待运营商确认 2 -》 9 10
        合作伙伴申诉处理中 4 -》 3 4
        城市申诉处理中 5 -》 7 8
      */
      let bs = this.detail.billingRes.billingStatus;
      if (bs - 1 === 0) {
        return this.idea - 1 === 0 ? 5 : 6;
      } else if (bs - 2 === 0) {
        return this.idea - 1 === 0 ? 9 : 10;
      } else if (bs - 4 === 0) {
        return this.idea - 1 === 0 ? 3 : 4;
      } else if (bs - 5 === 0) {
        return this.idea - 1 === 0 ? 7 : 8;
      }
    },
    uploadSuccess(data = {}) {
      this.uploadLoading = false;
      if (data.uuid) {
        this.fileList.push(data);
      }
    },
    async beforeUpload(file) {
      if (this.fileList.length >= 5) {
        this.$Message.error("最多上传5个");
        return false;
      }
      return true;
    },
    formatError() {
      this.uploadLoading = false;
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式`);
    },
    uploadError(res) {
      this.uploadLoading = false;
      this.$Message.error(res.msg);
    },
    removeFile(item, index) {
      this.fileList.splice(index, 1);
    },
    toOpen(url) {
      url && window.open(url);
    },
    formatTime(t) {
      return this.$moment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    addRow() {
      this.formData.billingIndexResList.push({ ...rowData });
    },
    deleteRow({ row, index }) {
      if (this.formData.billingIndexResList.length <= 1) {
        return;
      }
      this.formData.billingIndexResList.splice(index, 1);
    },
    async getUrlByUuid(uuid) {
      const [, v] = await this.getOssFile({ uuid });
      this.toOpen(v);
    },
    async toFile() {
      const { billingRes } = this.detail;
      if (!billingRes?.protocolFileUuid) return
      await this.getUrlByUuid(billingRes.protocolFileUuid)
    },
    viewRow(row) {
      // todo
      let data = {}
      if (row.subIndexRatioDetailList && row.subIndexRatioDetailList.length) {
        data = row.subIndexRatioDetailList.find(v => v.indexName === row.subIndexName || v.subIndexName === row.subIndexName)
        if (data.subIndexName === row.subIndexName) data.indexName = data.subIndexName
      } else {
        data = row
      }
      this.detailData = data
      this.detailData.assessTime = this.detail.billingRes.billingDate
      this.showAdd = true;
    },
    close() {
      this.detailData = {}
      this.showAdd = false;
    }
  },
};
</script>

<style scoped lang="less">
/deep/ textarea.ivu-input {
  resize: none;
  height: 120px;
}
/deep/ .ivu-modal-header-inner {
  text-align: center;
}
.t-but {
  text-align: right;
}
.b-1 {
  margin-right: 20px;
}
.row-c {
  padding: 8px 20px;
}
.code-row-bg {
  background-color: #eee;
}
.title {
  line-height: 44px;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 28px !important;
}
.bot-dashed {
  border-bottom: 1px dashed #ececec;
  padding: 10px 0;
}
.name {
  margin-right: 8px;
  font-size: 16px;
}
.time {
  margin-right: 10px;
}
.ico {
  font-size: 20px;
  padding: 2px 4px;
  cursor: pointer;
}
.po {
  margin-bottom: 10px !important;
}
.desc {
  position: relative;
  top: 6px;
}

/deep/ .f-f {
  cursor: pointer;
  color: #2d8cf0;
}

.t-r {
  text-align: right;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.mt-10 {
  margin-top: 10px !important;
}
.mb-10 {
  margin-bottom: 10px !important;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.c-c {
  background-color: #f2f2f2;
  padding: 12px 12px;
  border-radius: 4px;
}
.col-gap {
  margin-bottom: 12px;
}
.container {
  margin: 0 80px;
  font-size: 14px;
}
.bold {
  font-weight: bold;
}
.font-12 {
  font-size: 12px;
}
</style>
