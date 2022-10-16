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

        <p class="title">流程处理记录</p>
        <Table border :columns="columns2" :data="data2"></Table>
        <div style="height: 40px"></div>

        <div v-if="isNotSubmit">
          <p class="title">处理意见</p>
          <Input
            v-model="formData.opinion"
            type="textarea"
            class="desc-con"
            placeholder="请输入处理意见"
          />
        </div>
      </div>
      <div slot="footer">
        <Button v-if="isNotSubmit" type="primary" @click="suspend">作废</Button>
        <!--        <Button v-if="isNotSubmit" type="primary" @click="temporaryStorage"-->
        <!--          >暂存</Button-->
        <!--        >-->
        <Button v-if="isNotSubmit" type="primary" @click="submit">提交</Button>
        <Button @click="() => cancel()">{{!isNotSubmit ? "关闭" : "取消"}}</Button>
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
// 未提交 有提交按钮和处理意见  其他状态只能关闭

import {
  detailTableBusinessDetail,
  columnsFile,
  reissueColumns,
  getBusinessType,
  getOperateType,
  reductColumns,
  billSourceMap
} from "../fields";
import { tool } from "_o/api/baseMixin.js";
import add from "./view.vue"
// import Upload from "../upload";
import {
  flowSubmitService,
  flowSuspendService,
} from "_o/api/settle";
import { freeze } from "@/mixins/base";
import oss from "@/mixins/oss";

const rowData = {
  completeRate: "",
  indexName: "",
  ratio: "",
  score: "",
  weight: "",
};
export default {
  name: "bills-detail",
  components: {
    add
  },
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
      billingRecordResList,
      billingAttachResList,
      billingRes,
      basicAmountRes,
      deductionAmountRes,
      reissueAmountRes,
    } = this.detail;
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
    // let isNotSubmit = `${billingRes.billingStatus}` === "0";
    return {
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

      columns2: freeze([
        { title: "时间", key: "createTime" },
        { title: "节点名称", key: "nodeName" },
        { title: "节点处理人", key: "nodeHandler" },
        { title: "操作", key: "handle" },
        { title: "处理意见", key: "handleOpinion" },
      ]),
      data2: billingRecordResList,

      columnsFile,
      dataFile: billingAttachResList,
      billSourceMap,
      showAdd: false,
      detailData: {}
    };
  },
  computed: {
    // isFileUpload() {
    //   return [1, 4, 5].includes(+this.detail.billingRes.billingStatus);
    // },
    // isOver() {
    //   return [6, 7].includes(+this.detail.billingRes.billingStatus);
    // },
    isNotSubmit({ detail }) {
      return `${detail.billingRes.billingStatus}` === "0";
    },
  },
  methods: {
    cancel(refresh) {
      this.$emit("close", refresh);
    },
    async suspend() {
      let p = {
        opinion: this.formData.opinion,
        billingUuid: this.formData.billingRes.uuid,
      };
      const [err] = await this.toResult(flowSuspendService(p));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      this.$Message.success("中止成功");
      this.cancel(true);
    },
    async submit() {
      const [err, data] = await this.toResult(flowSubmitService(this.getSubmitParams()));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("提交成功");
      this.cancel(true);
    },
    // async temporaryStorage() {
    //   const [err] = await this.toResult(
    //     flowTemporaryStorageService(this.getSubmitParams())
    //   );
    //
    //   if (err) {
    //     // this.$Message.error(err.message);
    //     return;
    //   }
    //   this.$Message.success("暂存成功");
    //   this.cancel(true);
    // },
    getSubmitParams() {
      return {
        opinion: this.formData.opinion,
        billingUuid: this.detail.rowData.uuid,
      };
    },
    async toFile() {
      const { billingRes } = this.detail;
      if (!billingRes?.protocolFileUuid) return
      const [, url] = await this.getOssFile({ uuid: billingRes.protocolFileUuid });
      url && window.open(url);
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
/deep/ .f-f {
  cursor: pointer;
  color: #2d8cf0;
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
  margin-bottom: 28px;
}

.desc-con {
  width: 90%;
  margin-top: 20px;
}
.th1 {
  background-color: red;
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
