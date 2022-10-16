<template>
  <div>
    <Modal
      v-model="visible"
      title="运营商考核账单"
      width="1080"
      :mask-closable="false"
      :closable="false"
    >
<!--      <div class="m-con" v-if="!isFinish && isReview">-->
<!--        <Row>-->
<!--          <Col span="12"><span>补发：</span><Input-->
<!--            v-model="detail.billingRes.reissueLea"-->
<!--            style="width: 240px"-->
<!--            class="no-arrow"-->
<!--            type="number"-->
<!--            :maxlength="20"-->
<!--            placeholder="请输入金额"-->
<!--          ></Input></Col>-->
<!--        </Row>-->
<!--        <div class="gap"></div>-->
<!--        <Row>-->
<!--          <Col span="12">-->
<!--          <span>补发说明：</span><Input-->
<!--          v-model="detail.billingRes.reissueDesc"-->
<!--          type="textarea"-->
<!--          :rows="4"-->
<!--          :maxlength="200"-->
<!--          placeholder="请输入..."-->
<!--        ></Input>-->
<!--          </Col>-->
<!--        </Row>-->
<!--        <div class="gap"></div>-->

<!--        <Row>-->
<!--          <Col span="12"><span>扣减：</span><Input-->
<!--            v-model="detail.billingRes.deductionLea"-->
<!--            style="width: 240px"-->
<!--            class="no-arrow"-->
<!--            type="number"-->
<!--            :maxlength="20"-->
<!--            placeholder="请输入金额"-->
<!--          ></Input></Col>-->
<!--        </Row>-->
<!--        <div class="gap"></div>-->

<!--        <Row>-->
<!--        <Col span="12">-->
<!--          <span>扣减说明：</span><Input-->
<!--          v-model="detail.billingRes.deductionDesc"-->
<!--          type="textarea"-->
<!--          :rows="4"-->
<!--          :maxlength="200"-->
<!--          placeholder="请输入..."-->
<!--        ></Input>-->
<!--        </Col>-->
<!--        </Row>-->
<!--        <div class="gap"></div>-->
<!--      </div>-->
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
          :maxlength="200"
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
                :largestNum="20"
                @before-upload="res => beforeUpload(res)"
                @on-success="res => uploadSuccess(res)"
                @on-error="err => uploadError(err)"
                @on-format-error="formatError"
              >
                <Button type="primary">上传附件</Button>
              </Upload>
            </Col>
            <Col>
              <p class="desc">
                文件支持：图片、WORD、PDF，附件最多上传20个
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
                  class="ico"/><Icon
                  type="ios-close"
                  @click="removeFile(item, index)"
                  class="ico"
              /></Col>
            </Row>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button type="primary" v-if="!isFinish" @click="beforeSubmit">提交</Button>
        <Button @click="e => cancel()">{{ isFinish ? "关闭" : "取消" }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import { tool } from "_o/api/baseMixin.js";
import { dcpBillHandleService } from "_o/api/settle";
import oss from "@/mixins/oss";
// import { dcpAddReissueDeductionService } from "_o/api/settle";
import Upload from "../upload";
import {
  calModeConvert,
  operationModeConvert,
  columnProcess,
  columnsFile
} from "../fields";

export default {
  name: "bills-detail",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    detail: {
      type: Object,
      default: () => {
        return {
          billingRes: {},
          billingRecordResList: [],
          rowData: {}
        };
      }
    }
  },
  components: { Upload },
  mixins: [tool, oss],
  filters: {
    calModeConvert,
    operationModeConvert
  },
  computed: {
    isFileUpload({detail}) {
      return [1, 4, 5].includes(detail.billingRes.billingStatus);
    },
    isFinish({detail}) {
      return detail.finish;
    },
    isReview({detail}) {
      return detail.billingRes.billingStatus - 4 === 0
    }
  },
  data() {
    let { billingRecordResList, billingAttachResList } = this.detail;
    return {
      that: this,
      formData: {
        ...JSON.parse(JSON.stringify(this.detail)),
        opinion: ""
      },

      columns2: columnProcess,
      data2: billingRecordResList,

      columnsFile,
      dataFile: billingAttachResList,

      idea: "",

      actionUrl: this._uploadUrl + "/file/upload/private", // 公共文件上传服务
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["PDF", "pdf", "doc", "docx", "jpg", "jpeg", "png"],
      uploadFiles: {},

      fileList: []
    };
  },
  methods: {
    cancel(refresh) {
      this.$emit("close", refresh);
    },
    validParams() {
      if (this.idea === "") {
        this.$Message.error("请选择处理结果");
        return;
      }
      return true
    },
    beforeSubmit() {
      if(!this.validParams()) {
        return
      }
      if(!this.isFinish && this.isReview) {
        this.$Modal.confirm({
          content: "<p>同意运营商对结算账单的申诉，可能需要调整账单数据，如已修改账单数据请点击下发至运营商？</p>",
          cancelText: "调整账单金额",
          okText: "重新下发至运营商",
          onOk: () => {
            this.submit();
          },
          onCancel: () => {
            this.$router.push({
              name: "settle-management-order",
              query: {
                tab: 1
              }
            })
          }
        });
        return
      }
      this.submit()
    },
    // 更新补发补扣信息
    // async updateReissueAndDeduct() {
    //   const [err] = await this.toResult(dcpAddReissueDeductionService(this.getExtraParams()));
    //   if(err) return
    // },
    async submit() {
      let handleP = {
        handle: this.getHandle(),
        taskId: this.detail.rowData.taskId,
        opinion: this.formData.opinion,
        billingUuid: this.detail.billingRes.uuid,
        billingAttachList: this.fileList.map(it => ({
          attachName: it.fileName,
          attachUrl: it.publicUrl,
          attachUuid: it.uuid
        }))
      };
      const [err, data] = await this.toResult(dcpBillHandleService(handleP));
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
      if (this.fileList.length >= 20) {
        this.$Message.error("最多上传20个");
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
    // 补发扣减入参
    getExtraParams() {
      let { uuid, reissueLea, reissueDesc, deductionLea, deductionDesc} = this.detail.billingRes
      return {
        reissueLea, reissueDesc, deductionLea, deductionDesc,
        billingUuid: uuid }
    },
  }
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

/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
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
.mt-10 {
  margin-bottom: 10px !important;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.m-con {
  font-size: 14px;
}
.gap {
  height: 24px;
}
</style>
