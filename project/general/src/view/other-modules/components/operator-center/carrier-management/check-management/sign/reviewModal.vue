<!--
 * @Description: 审核协议 Modal
 * @Author: songy
 * @Date: 2022-04-19 11:23:16
-->
<template>
  <Modal
    v-model="visible"
    :width="832"
    title="审核协议"
    :mask-closable="false"
    :closable="false"
  >
    <Alert type="error">
      <p class="text-center">
        该运营商无电子签，请仔细对比考核模板与运营商上传的签约文件。
      </p>
    </Alert>
    <p class="title">运营商考核协议模板</p>
    <iframe
      style="width: 100%; height: 300px"
      :src="originalFileUrl"
      title=""
    ></iframe>
    <p class="title">运营商上传的协议</p>
    <iframe style="width: 100%; height: 300px" :src="fileUrl" title=""></iframe>
    <div style="width: 100%">
      <p class="title">审核意见</p>
      <Input
        v-model="remark"
        placeholder="如果驳回，请填写意见，便于运营商对应调整。"
        style="width: 100%"
        type="textarea"
        :maxlength="100"
      ></Input>
    </div>
    <div slot="footer">
      <Button type="primary" @click="review(0)">驳回</Button>
      <Button type="primary" @click="review(1)">通过</Button>
      <Button @click="close(false)">取消</Button>
    </div>
  </Modal>
</template>

<script>
import {
  queryProtocolDetailService,
  reviewPassService,
  reviewRejectService,
} from "_o/api/proto";
import common from "../tool/common";

export default {
  name: "check-management-sign-review",
  mixins: [common],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      isShowReview: false,
      remark: "",
      fileUrl: "",
    };
  },
  mounted() {
    this.getFileUrl();
  },
  methods: {
    async getFileUrl() {
      const [err, data] = await this.toResult(queryProtocolDetailService({ protocolUuid: this.detail.uuid }));
      if (err) {
        return;
      }
      this.fileUrl = data.fileUrl;
      this.originalFileUrl = data.originalFileUrl;
    },
    // 审核协议
    async review(pass) {
      const method = pass ? reviewPassService : reviewRejectService;
      const [err, data] = await this.toResult(method({ protocolUuid: this.detail.uuid, remark: this.remark }));
      if (err) {
        return;
      }
      this.$Message.success("成功");
      this.close(true);
    },
    close(boo) {
      this.$emit("close", boo);
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 14px;
  padding: 10px 0;
}
</style>
