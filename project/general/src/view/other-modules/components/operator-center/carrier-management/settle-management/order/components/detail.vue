<template>
  <div>
    <Modal
      v-model="visible"
      title="运营商考核账单"
      width="1080"
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
      <Row type="flex" justify="center" class="code-row-bg row-c">
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
        <Col span="1">-</Col>
        <Col span="2">上期补发</Col>
      </Row>

      <Row type="flex" justify="center" class="row-c">
        <Col span="2">
          <Input
            v-model="formData.billingRes.realSettleAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">=</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.shouldSettleAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">*</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.serviceRate"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">*</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.totalScore"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">+</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.rewardAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">-</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.deductionAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">-</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.lastDeductionAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
        <Col span="1">+</Col>
        <Col span="2">
          <Input
            v-model="formData.billingRes.lastReissueAmount"
            style="width: 60px"
            :maxlength="20"
            placeholder=""
          ></Input
        ></Col>
      </Row>
      <div style="height: 40px"></div>
      <Table
        border
        :columns="businessColumns"
        width="400"
        :data="businessData"
      ></Table>
      <div style="height: 40px"></div>

      <Table border :columns="columns1" :data="data1"></Table>
      <div style="height: 40px"></div>

      <p class="title">流程处理记录</p>
      <Table border :columns="columns2" :data="data2"></Table>
      <div style="height: 40px"></div>

      <!-- <p class="title">附件列表</p>
    <Table border :columns="columns3" :data="data3"></Table>
    <div style="height: 40px"></div> -->

      <p class="title">处理意见</p>

      <Row v-if="isFileUpload" type="flex" style="margin: 20px 0">
        <Col span="4">
          <RadioGroup v-model="idea">
            <Radio label="1">同意</Radio>
            <Radio label="0">驳回</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <!-- <p v-if="isFileUpload">即将流向: 合作伙伴团队</p> -->

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
              @before-upload="(res) => beforeUpload(res)"
              @on-success="(res) => uploadSuccess(res)"
              @on-error="(err) => uploadError(err)"
              @on-format-error="formatError"
            >
              <Button type="primary">上传附件</Button>
            </Upload>
          </Col>
          <Col>
            <p>文件支持：图片、WORD、PDF，每个类型附件最多上传5个</p>
          </Col>
        </Row>
        <div>
          <Row :key="index" v-for="(item, index) in fileList">
            <Col span="12"
              ><span class="name">{{ item.fileName }}</span>
              <span class="size" v-if="item.fileSize"
                >({{ item.fileSize }}KB)</span
              >
            </Col>
            <Col span="12" class="t-r"
              ><span class="time">{{ formatTime(item.createTime) }}</span>
              <Icon
                type="md-eye"
                @click="toOpen(item.publicUrl)"
                class="ico" /><Icon
                type="ios-close"
                @click="removeFile(item, index)"
                class="ico"
            /></Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button
          v-if="`${detail.billingRes.billingStatus}` === '0'"
          type="primary"
          @click="suspend"
          >作废</Button
        >
        <Button
          v-if="`${detail.billingRes.billingStatus}` === '0'"
          type="primary"
          @click="temporaryStorage"
          >暂存</Button
        >
        <Button type="primary" @click="submit">提交</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import {
  detailTable1,
  detailTableBusiness,
  calModeConvert,
  operationModeConvert,
} from "../fields";
import { tool } from "_o/api/baseMixin.js";
import Upload from "../upload";
import {
  flowSubmitService,
  flowSuspendService,
  flowTemporaryStorageService,
} from "_o/api/settle";

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
  },
  data() {
    // console.log(this.detail, "ddd");
    let { billingIndexResList, billingFlowResList, billingRecordResList } =
      this.detail;
    return {
      formData: {
        ...JSON.parse(JSON.stringify(this.detail)),
        opinion: "",
      },

      idea: "",
      // showModal: false,
      columns1: detailTable1(this),
      data1: billingIndexResList,

      businessColumns: detailTableBusiness(this),
      businessData: billingFlowResList,

      columns2: [
        { title: "时间", key: "createTime" },
        { title: "节点名称", key: "nodeName" },
        { title: "节点处理人", key: "nodeHandler" },
        { title: "操作", key: "handle" },
        { title: "处理意见", key: "handleOpinion" },
      ],
      data2: billingRecordResList,

      actionUrl: this._uploadUrl + "/file/upload/public", // 公共文件上传服务
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["PDF", "pdf", "doc", "docx", "jpg", "jpeg", "png"],
      uploadFiles: {},

      fileList: [],
    };
  },
  methods: {
    cancel(refresh) {
      this.$emit("close", refresh);
    },
    async suspend() {
      let p = {
        opinion: this.formData.opinion,
        billingUuid: this.formData.billingRes.billingUuid,
      };
      const [err, data] = await this.toResult(flowSuspendService(p));
      console.log(err, data);
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
        billingReq: { ...this.detail.billingRes },
        billingFlowReqList: this.formData.billingFlowResList,
        billingIndexReqList: this.formData.billingIndexResList,
      };
      // return
      const [err, data] = await this.toResult(flowSubmitService(p));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      this.$Message.success("提交成功");
      this.cancel(true);
    },
    async temporaryStorage() {
      let p = {
        opinion: this.formData.opinion,
        billingReq: { ...this.detail.billingRes },
        billingFlowReqList: this.formData.billingFlowResList,
        billingIndexReqList: this.formData.billingIndexResList,
      };
      const [err, data] = await this.toResult(flowTemporaryStorageService(p));
      console.log(err, data);

      if (err) {
        this.$Message.error(err.message);
        return;
      }
      this.$Message.success("暂存成功");
      this.cancel(true);
    },

    uploadSuccess(data = {}) {
      this.uploadLoading = false;
      if (data.uuid) {
        this.fileList.push(data);
      }
    },
    async beforeUpload(file) {
      if (fileList.length >= 5) {
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
    toOpen(url) {
      url && window.open(url);
    },
    removeFile(item, index) {
      this.fileList.splice(index, 1);
    },
    formatTime(t) {
      return this.$moment(t).format("YYYY-MM-DD HH:mm:ss")
    }
  },
};
</script>

<style scoped lang="less">
/deep/ textarea.ivu-input {
  resize: none;
  height: 120px;
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
.t-r {
  text-align: right;
}
</style>