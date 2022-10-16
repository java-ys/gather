<template>
  <div>
    <Modal
      v-model="visible"
      title="运营商考核账单"
      width="1180"
      :mask-closable="false"
      :closable="false"
    >
      <Row type="flex" justify="center" class="row-c">
        <Col span="6">结算月份</Col>
        <Col span="6">运营商</Col>
        <Col span="6">运营模式</Col>
        <Col span="6">计算方法</Col>
      </Row>
      <Row type="flex" justify="center" class="row-c">
        <Col span="6">{{ formData.billingRes.billingDate }} </Col>
        <Col span="6">{{ detail.billingRes.agentName }}</Col>
        <Col span="6">{{
          detail.billingRes.operationMode | operationModeConvert
        }}</Col>
        <!-- <Col span="6">非阶梯流水模式：总流水*服务费率</Col> -->
        <Col span="6">{{ detail.billingRes.calMode | calModeConvert }}</Col>
      </Row>
      <div style="height: 40px"></div>
      <Row type="flex" justify="center" class="row-c code-row-bg">
        <Col span="2">实际结算</Col>
        <Col span="1">=</Col>
        <Col span="2">结算流水</Col>
        <Col span="1">*</Col>
        <Col span="2">服务费率</Col>
        <Col span="1">*</Col>
        <Col span="2">运营效率总得分</Col>
        <Col span="1">+</Col>
        <Col span="2">奖励</Col>
        <Col span="1">-</Col>
        <Col span="2">当期扣减</Col>
        <Col span="1">-</Col>
        <Col span="2">上期扣减</Col>
        <Col span="1">+</Col>
        <Col span="2">上期补发</Col>
      </Row>
      <Row v-if="isNotSubmit" type="flex" justify="center" class="row-c">
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.realSettleAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input>
        </Col>
        <Col span="1">=</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.shouldSettleAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">*</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.serviceRate"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">*</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.totalScore"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">+</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.rewardAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">-</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.deductionAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">-</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.lastDeductionAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">+</Col>
        <Col span="2">
          <Input
            v-model.number="formData.billingRes.lastReissueAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
      </Row>

      <Row v-else type="flex" justify="center" class="row-c">
        <Col span="2">
          <span>{{ formData.billingRes.realSettleAmount }}</span>
        </Col>
        <Col span="1">=</Col>
        <Col span="2">
          <span>{{ formData.billingRes.shouldSettleAmount }}</span></Col
        >
        <Col span="1">*</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.serviceRate }}</span></Col
        >
        <Col span="1">*</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.totalScore }}</span></Col
        >
        <Col span="1">+</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.rewardAmount }}</span></Col
        >
        <Col span="1">-</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.deductionAmount }}</span></Col
        >
        <Col span="1">-</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.lastDeductionAmount }}</span></Col
        >
        <Col span="2">+</Col>
        <Col span="2"
          ><span>{{ formData.billingRes.lastReissueAmount }}</span></Col
        >
      </Row>

      <div style="height: 40px"></div>
      <p class="mt-10">结算流水=业务A流水+业务B流水+……+业务N流水-其他扣减</p>
      <Table
        border
        :columns="businessColumns"
        width="400"
        :data="businessData"
      ></Table>
      <div style="height: 40px"></div>

      <div class="mt-10 flex">
        <span>运营效率总得分=指标A得分+指标B得分+……+指标N得分</span>
        <Button v-if="isNotSubmit" @click="addRow" type="primary">新增</Button>
      </div>
      <Table
        border
        :columns="columns1"
        :data="this.formData.billingIndexResList"
      ></Table>
      <div style="height: 40px"></div>

      <p class="title">流程处理记录</p>
      <Table border :columns="columns2" :data="data2"></Table>
      <div style="height: 40px"></div>

      <p class="title">附件列表</p>
      <Table border :columns="columnsFile" :data="dataFile"></Table>
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
      <div slot="footer">
        <Button v-if="isNotSubmit" type="primary" @click="suspend">作废</Button>
        <Button v-if="isNotSubmit" type="primary" @click="temporaryStorage"
          >暂存</Button
        >
        <Button v-if="isNotSubmit" type="primary" @click="submit">提交</Button>
        <Button @click="(e) => cancel()">{{
          !isNotSubmit ? "关闭" : "取消"
        }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// 未提交 有提交按钮和处理意见  其他状态只能关闭

// import { getToken } from "@/libs/util.js";
import {
  detailTable1,
  detailTableBusiness,
  detailTable1Detail,
  detailTableBusinessDetail,
  calModeConvert,
  operationModeConvert,
  columnsFile,
} from "../fields";
import { tool } from "_o/api/baseMixin.js";
import Upload from "../upload";
import {
  flowSubmitService,
  flowSuspendService,
  flowTemporaryStorageService,
} from "_o/api/settle";

const rowData = {
  completeRate: "",
  indexName: "",
  ratio: "",
  score: "",
  weight: "",
};
export default {
  name: "bills-detail",
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
          billingFlowResList: [],
          failureBillingNoList: [],
          billingRecordResList: [],
        };
      },
    },
  },
  components: { Upload },
  mixins: [tool],
  filters: {
    calModeConvert,
    operationModeConvert,
  },
  // watch: {
  //   visible: {
  //     handler(v) {
  //       this.showModal = v;
  //     },
  //     immediate: true,
  //   },
  // },
  computed: {
    isFileUpload() {
      return [1, 4, 5].includes(+this.detail.billingRes.billingStatus);
    },
    isOver() {
      return [6, 7].includes(+this.detail.billingRes.billingStatus);
    },
    isNotSubmit({ detail }) {
      return `${detail.billingRes.billingStatus}` === "0";
    },
  },
  data() {
    let {
      billingFlowResList,
      billingRecordResList,
      billingAttachResList,
      billingRes,
    } = this.detail;
    let isNotSubmit = `${billingRes.billingStatus}` === "0";
    return {
      formData: {
        ...JSON.parse(JSON.stringify(this.detail)),
        opinion: "",
      },

      // showModal: false,
      columns1: isNotSubmit ? detailTable1(this) : detailTable1Detail(this),

      businessColumns: isNotSubmit
        ? detailTableBusiness(this)
        : detailTableBusinessDetail(this),
      businessData: billingFlowResList,

      columns2: [
        { title: "时间", key: "createTime" },
        { title: "节点名称", key: "nodeName" },
        { title: "节点处理人", key: "nodeHandler" },
        { title: "操作", key: "handle" },
        { title: "处理意见", key: "handleOpinion" },
      ],
      data2: billingRecordResList,

      columnsFile,
      dataFile: billingAttachResList,
    };
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
      const [err, data] = await this.toResult(flowSuspendService(p));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      this.$Message.success("中止成功");
      this.cancel(true);
    },
    async submit() {
      let p = {
        opinion: this.formData.opinion,
        billingReq: { ...this.formData.billingRes },
        billingFlowReqList: this.formData.billingFlowResList,
        billingIndexReqList: this.formData.billingIndexResList,
      };
      if (!this.checkP(p)) {
        return;
      }
      const [err, data] = await this.toResult(flowSubmitService(p));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("提交成功");
      this.cancel(true);
    },
    async temporaryStorage() {
      let p = {
        opinion: this.formData.opinion,
        billingReq: { ...this.formData.billingRes },
        billingFlowReqList: this.formData.billingFlowResList,
        billingIndexReqList: this.formData.billingIndexResList,
      };
      if (!this.checkP(p)) {
        return;
      }
      const [err, data] = await this.toResult(flowTemporaryStorageService(p));

      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("暂存成功");
      this.cancel(true);
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
    checkP(p) {
      console.log(p.billingIndexReqList);
      let len = p.billingIndexReqList.length;
      let msg = "";
      for (let i = 0; i < len; i++) {
        let o = p.billingIndexReqList[i];
        let keys = Object.keys(o);
        let has = keys.every((key) => !!o[key]);
        if (!has) {
          msg = "指标所有选项不得为空";
          break;
        }
      }
      if (msg) {
        this.$Message.error(msg);
        return false;
      }
      return true;
    },
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
  width: 1000px;
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
  margin-bottom: 10px !important;
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>