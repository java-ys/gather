<template>
  <div>
    <el-upload
      :action="action"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :file-list="fileList"
      :data="params"
      :show-file-list="showFileList"
      :before-upload="handleBeforeUpload"
      :headers="headers"
      :drag="draggable"
    >
      <el-button v-if="!draggable && !miniButton" size="small" type="primary">{{buttonText || "点击上传"}}</el-button>
      <el-button v-if="miniButton" size="small" type="text">点击上传</el-button>
      <!-- 拖拽上传 -->
      <div v-if="draggable">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">
          只能上传excel文件，且不超过500kb
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        append-to-body
        class="dialog-size"
      >
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "_o/common/common";
import { getToken as getTokenCookie } from "@/libs/util";
import { TOKEN_KEY } from "_o/common/common";
const imageTypeList = ["image/png", "image/jpeg"];
const excelTypeList = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export default {
  name: "faceUpload",
  props: {
    type: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // faceUrl leftFaceUrl rightFaceUrl
    prop: {
      type: String,
      default: "",
    },
    // 必选参数，上传的地址
    action: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
    // 是否启用拖拽上传
    draggable: {
      type: Boolean,
      default: false,
    },
    // 是否显示小按钮
    miniButton: {
      type: Boolean,
      default: false,
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true,
    },
    // 上传时附带的额外参数
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      limit: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      headers: {
        Authorization: getTokenCookie(),
      },
      val: this.value,
    };
  },
  computed: {
    fileList() {
      let tempArray = [];
      this.val.forEach((item) => {
        tempArray.push({
          name: new Date().getTime() + ".png",
          url: item.url,
        });
      });
      return tempArray;
    },
  },
  methods: {
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.val = []; // 只能上传单张照片的这么做可行
      let json = {
        value: fileList,
        type: this.type,
        prop: this.prop,
        method: "delete",
      };
      this.$emit("handleRemove", json);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.dialogImageUrl = file.url ? file.url : file.response.data;
      this.dialogVisible = true;
    },
    // 文件上传成功时的钩子
    /*
      response 上传接口返回
      file: name, percentage, raw, size, status, uid
      fileList: [file]
     */
    handleSuccess(response, file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      let json = {
        value: fileList,
        type: this.type,
        prop: this.prop,
        method: "upload",
        response: response,
      };
      this.$emit("handleUploadSuccess", json);
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    handleBeforeUpload(file) {
      if (this.type == "image") {
        if (imageTypeList.indexOf(file.type) < 0) {
          this.$alert("上传的图片格式只能是jpg或者png，请重新选择图片上传");
          return false;
        }
        if (!this.val) {
          this.val = [];
        }
        if (this.val.length == 1) {
          // this.value = [];
          // this.$alert('只能上传一张照片')
          // return false;
        } else if (typeof this.val === "object") {
          for (let i in this.val) {
            if (this.val.hasOwnProperty(i)) {
              this.val[i].name = new Date().getTime() + ".png";
            }
          }
        }

        return new Promise((resolve, reject) => {
          getToken()
            .then((res) => {
              if (res.data.success) {
                this.headers = { token: res.data.data };
                // const isSize = file.size / 1024 / 1024 < 20;
                // if(this.imageTypeList.indexOf(file.type) < 0) {
                //   this.$message.error('上传的图片格式只能是jpg或者png，请重新选择图片上传');
                //   return false;
                // }
                // if (!isSize) {
                //   this.$message.error('上传文件不能大于20M');
                //   return false;
                // }
                resolve();
              } else {
                reject(new Error("获取token失败"));
              }
            })
            .catch(() => {
              reject(new Error("获取token失败"));
            });
        });
      } else if (this.type == "excel") {
        if (file.type && excelTypeList.indexOf(file.type) < 0) {
          this.$alert("只能上传excel文件，请重新选择");
          return false;
        }
        if (this.val.length == 1) {
          this.$alert("只能上传一个excel文件");
          return false;
        }
      }
    },
    handleOnExceed(file, fileList) {
      this.$alert("只能上传一张照片");
    },
  },
};
</script>

<style scoped>
.el-upload-dragger-extend {
  width: 200px;
}
</style>
