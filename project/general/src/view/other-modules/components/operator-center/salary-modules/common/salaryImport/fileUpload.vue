<template>
  <div>
    <el-upload
      :headers="headers"
      :limit="limitNum"
      :auto-upload="true"
      :data="params"
      accept="['xls', 'xlsx', 'png', 'jpg', 'jpeg', 'zip', 'rar', 'doc', 'docx']"
      :action="action"
      :before-upload="beforeUploadFile"
      :on-change="fileChange"
      :on-exceed="exceedFile"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :file-list="fileList"
      :http-request="handleRequest"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { TOKEN_KEY } from "_o/common/common";
import { uploadFile, deleteFile } from "_o/api/salary/salaryRule";
import { getToken } from "@/libs/util";
export default {
  props: {
    action: {
      // 必选参数，上传的地址
      type: String,
      default: "",
    },
    params: {
      // 上传时附带的额外参数
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      limitNum: 5, // 上传excell时，同时允许上传的最大数
      fileList: [], // excel文件列表
      fileIdList: [],
      headers: {
        Authorization: getToken(),
      },
    };
  },
  methods: {
    handleRequest(params) {
      const _file = params.file;
      // 通过 FormData 对象上传文件
      let formData = new FormData();
      formData.append("file", _file);
      this.getRequest(formData, params);
    },
    getRequest(formData, params) {
      if (this.params) {
        Object.keys(this.params).forEach((key) => {
          formData.append(key, this.params[key]);
        });
      }
      return uploadFile(formData).then((res) => {
        this.handleSuccess(res.data, params.file, this.fileList);
      });
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${
        files.length + fileList.length
      } 个`);
    },
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
    },
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      let fileType = ["xls", "xlsx", "png", "jpg", "jpeg", "zip", "rar", "doc", "docx"];
      if (!fileType.includes(extension)) {
        this.$message.warning("上传的文件有误,请上传xls/xlsx/png/jpg/jpeg/zip/rar/word/doc/docx/相关的文件");
        return false;
      }
      if (size > 10) {
        this.$message.warning("文件大小不得超过10M");
        return false;
      }
    },
    async getFileId(file) {
      let uuid = "";
      this.fileIdList.map((it) => {
        if (it.uid == file.uid) {
          uuid = it.fileId;
        }
      });
      return uuid;
    },
    async getUid(file) {
      let uid = "";
      this.fileList.map((it) => {
        if (it.uid == file.uid) {
          uid = it.uid;
        }
      });
      return uid;
    },
    async handleRemove(file, fileList) {
      let uuid = await this.getFileId(file);
      let uid = await this.getUid(file);
      let list = [];
      this.fileList.map((it) => {
        if (it.uid !== uid) {
          list.push(it);
        }
      });
      this.fileList = Object.assign([], list);
      if (uuid) {
        deleteFile({ uuid: uuid }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        this.fileIdList.push({ uid: file.uid, fileId: res.data.uuid });
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error("上传的文件有误,请上传xls/xlsx/png/jpg/jpeg/zip/rar/word/doc/docx/相关的文件");
    },
  },
};
</script>
