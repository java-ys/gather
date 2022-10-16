import { getToken } from "@/libs/util";
import oss from "@/mixins/oss";

export default {
  mixins: [oss],
  data() {
    return {
      actionUrl: this._baseUrl + "/api/operate/control/upload",
      header: { Authorization: getToken() },
      maxSize: 51200,
      format: ["PDF", "pdf"],
      uploadFiles: {},
    }
  },
  methods: {
    async uploadSuccess(res) {
      this.uploadLoading = false;
      this.regulationFileUuid = res.data.fileUuid;
      if (res.data) {
        const [, v] = await this.getOssFile({ uuid: res.data.fileUuid });
        this.formData.regulationFilePath = v || "";
        this.regulationSelect.title = this.formData.regulationFileName;
        this.regulationSelect.fileUrl = v || "";
      }
    },
    async beforeUpload(file) {
      if (this.formData.regulationFilePath) {
        this.$Message.error(`只能上传一份模板内容`);
        return false;
      }
      this.formData.regulationFileName = file.name;
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
    async toFile() {
      let uuid =
        this.detail.regulationFilePath || this.detail.regulationFileUrl;
      const [, v] = await this.getOssFile({ uuid });
      v && window.open(v);
    },
  }
}
