<template>
  <div>
    <Modal
      v-model="visible"
      title="结算审核"
      width="1080"
      :mask-closable="false"
      :closable="false"
    >
      <div class="container">
        <Table border :columns="businessColumns" :data="businessData"></Table>
        <!--        <Divider />-->
        <p class="title">账户信息，<span class="font-12">(如有误请联系城市运营人员进行账户信息变更)</span></p>
        <div>
          <Form ref="_form" :model="addForm" :label-width="120" :rules="{}">
            <Row>
              <Col span="12">
                <FormItem label="公司账户名称：" prop="title">
                  <Input
                    v-model="addForm.bankAccountName"
                    class="input-item"
                    :maxlength="15"
                    placeholder="请输入"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="开户分行：" prop="title">
                  <Input
                    v-model="addForm.openingBank"
                    class="input-item"
                    :maxlength="15"
                    placeholder="请输入"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="银行账户：" prop="">
                  <Input
                    v-model="addForm.bankAccount"
                    class="input-item"
                    :maxlength="15"
                    placeholder="请输入"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="开户城市：" prop="">
                  <Input
                    v-model="addForm.openingCity"
                    class="input-item"
                    :maxlength="15"
                    placeholder="请输入"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="银行类型：" prop="">
                  <Input
                    v-model="addForm.bankType"
                    class="input-item"
                    :maxlength="15"
                    placeholder="请输入"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider />

        <p class="title">发票信息</p>
        <div class="bill-c">
          <Row class-name="mb-10">
            <span>发票税率:</span>
            <Select v-model="addForm.taxRate" style="width: 160px">
              <Option :value="1">1%</Option>
              <Option :value="3">3%</Option>
              <Option :value="6">6%</Option>
            </Select>
          </Row>
          <Row>
            <Col span="8">总金额：{{ total }}</Col>
            <Col span="8">税费：{{ taxTotal }}</Col>
            <Col span="8">不含税金额：{{ total - taxTotal }}</Col>
          </Row>
        </div>
        <p class="title">流程处理</p>
        <Table border :columns="columns2" :data="data2"></Table>
        <div style="height: 40px"></div>

        <div>
          <p class="title">处理意见</p>
          <Row type="flex" style="margin: 20px 0">
            <Col span="4">
              <RadioGroup v-model="idea">
                <Radio :label="1">同意</Radio>
                <Radio :label="0">驳回</Radio>
              </RadioGroup>
            </Col>
          </Row>
<!--          <p class="po">即将流向: 总部财务团队</p>-->
          <Input
            v-model="formData.opinion"
            type="textarea"
            class="desc-con"
            placeholder="请输入处理意见"
          />
          <div>
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
                :key="index"
                v-for="(item, index) in fileList"
                class="bot-dashed"
              >
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
                    @click="getUrlByUuid(item.uuid)"
                    class="ico" /><Icon
                    type="ios-close"
                    @click="removeFile(item, index)"
                    class="ico"
                /></Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button type="primary" @click="submit">提交</Button>
        <Button @click="(e) => cancel()">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import {
  columnProcess,
  columnsFile,
  reissueColumns,
  getBusinessType,
  getOperateType,
  settleColumns,
} from "../fields";
import { tool } from "_o/api/baseMixin.js";
import Upload from "../upload";
import {
  flowHandleService,
  settleHandleService,
  flowTemporaryStorageService,
} from "_o/api/settle";
import oss from "@/mixins/oss";

const rowData = {
  completeRate: "",
  indexName: "",
  ratio: "",
  score: "",
  weight: "",
};
export default {
  name: "settle-review",
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
  components: { Upload },
  mixins: [tool, oss],
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
  },
  computed: {
    total({ detail }) {
      return detail?.billingRes?.totalAmount || 0;
    },
    taxTotal({ total, addForm }) {
      if (addForm.taxRate > 0) {
        return (addForm.taxRate * total) / 100;
      }
      return 0;
    },
  },
  watch: {
    visible(v) {
      if (v) {
        this.init();
      }
    },
  },
  data() {
    return {
      that: this,
      formData: {
        ...JSON.parse(JSON.stringify(this.detail)),
        opinion: "",
      },
      addForm: {
        taxRate: "",
        bankAccountName: "",
        openingBank: "",
        bankAccount: "",
        openingCity: "",
        bankType: "",
      },

      businessColumns: settleColumns,
      businessData: [],

      // 补发佣金数据
      reissueColumns: reissueColumns(this),
      reissueData: [],
      // 补扣数据
      deductColumns: reissueColumns(this),
      deductData: [],

      columns2: columnProcess,
      data2: [],

      columnsFile,
      dataFile: [],

      idea: "",

      actionUrl: this._uploadUrl + "/file/upload/private", // 公共文件上传服务
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["PDF", "pdf", "doc", "docx", "jpg", "jpeg", "png"],
      uploadFiles: {},

      fileList: [],
    };
  },
  methods: {
    init() {
      if (!this.detail.rowData.uuid) return;

      let {
        billingIndexResList,
        billingAccountRes,
        billingRecordResList,
        billingAttachResList,
        basicAmountRes,
        deductionAmountRes,
        reissueAmountRes,
        billingRes,
      } = this.detail;
      this.businessData = [billingRes];
      this.data2 = billingRecordResList;
      this.reissueData = reissueAmountRes.reissueAmountDetailList;
      this.deductData = deductionAmountRes.deductionAmountDetailList;
      this.dataFile = billingAttachResList;
      Object.keys(this.addForm).forEach((key) => {
        this.addForm[key] = billingAccountRes[key];
      });
      this.addForm.taxRate = billingRes.taxRate
    },
    cancel(refresh) {
      this.$emit("close", refresh);
    },
    async submit() {
      // if (this.idea === "") {
      //   this.$Message.error("请选择处理结果");
      //   return;
      // }
      if (this.assertErrorMsg([this.idea === "", "请选择处理结果"])) return;
      if (
        this.assertErrorMsg([
          Object.keys(this.addForm)
            .filter((key) => key !== "taxRate")
            .map((key) => this.addForm[key])
            .some((v) => !v),
          "账户信息不得为空",
        ])
      )
        return;
      if (this.assertErrorMsg([!this.addForm.taxRate, "请选择税率"])) return;

      let handleP = {
        handle: this.idea - 1 === 0 ? 12 : 13,
        taskId: this.detail.rowData.taskId,
        opinion: this.formData.opinion,
        billingUuid: this.detail.billingRes.uuid,
        ...this.addForm,
        billingAttachList: this.fileList.map((it) => ({
          attachName: it.fileName,
          attachUrl: it.publicUrl,
          attachUuid: it.uuid,
        })),
      };
      const [err, data] = await this.toResult(settleHandleService(handleP));
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("提交成功");
      this.cancel(true);
    },
    assertErrorMsg([bool, msg]) {
      if (bool) {
        msg && this.$Message.error(msg);
        return true;
      }
      return false;
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
    async getUrlByUuid(uuid) {
      const [, v] = await this.getOssFile({ uuid });
      this.toOpen(v);
    },
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
.input-item {
  width: 280px;
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
.bill-c {
  margin-bottom: 12px;
}
</style>
