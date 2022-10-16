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
      :http-request="handleRequest"
    >
      <el-button v-if="!draggable && !miniButton" size="small" type="primary">{{buttonText ? buttonText : '点击上传'}}</el-button>
      <el-button v-if="miniButton" size="small" type="text">点击上传</el-button>
      <div v-if="draggable">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
      </div>
      <el-dialog :visible.sync="dialogVisible" append-to-body class="dialog-size">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-upload>
  </div>
</template>
<script>
// import {uploadPhoto} from '_o/api/salary/profile';
import { checkAndHandleCompression, convertBase64UrlToFile } from "_o/common/common";
import { uploadFaceImgss } from "_o/api/salary/interview";
import { TOKEN_KEY } from "_o/common/common"
import {getToken} from "@/libs/util";

const imageTypeList = ["image/png", "image/jpeg"];
const excelTypeList = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
export default {
  name: "faceUpload",
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    prop: {
      type: String,
      default: ""
    },
    action: { // 必选参数，上传的地址
      type: String,
      default: ""
    },
    buttonText: {
      type: String,
      default: ""
    },
    draggable: { // 是否启用拖拽上传
      type: Boolean,
      default: false
    },
    miniButton: { // 是否显示小按钮
      type: Boolean,
      default: false
    },
    showFileList: { // 是否显示已上传文件列表
      type: Boolean,
      default: true
    },
    params: { // 上传时附带的额外参数
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      limit: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      headers: {
        "Authorization": getToken()
      }
    }
  },
  computed: {
    fileList() {
      let tempArray = [];
      this.value.forEach(item => {
        tempArray.push({
          name: new Date().getTime() + ".png",
          url: item.url
        })
      })
      return tempArray
    }
  },
  created() {
    // let tempArray = [];
    // if(this.value.length === 1) {
    //   tempArray.push({
    //     name: new Date().getTime()+ '.png',
    //     url: this.value[0].url
    //   })
    //   this.value = tempArray
    // }
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
      return uploadFaceImgss(formData).then(res => {
        params.onSuccess(res.data, params.file, this.fileList)
      });
    },
    handleRemove(file, fileList) { // 文件列表移除文件时的钩子
      this.value = [];  // 只能上传单张照片的这么做可行
      let json = {
        value: fileList,
        type: this.type,
        prop: this.prop,
        method: "delete"
      };
      this.$emit("handleRemove", json)
    },
    handlePreview(file) { // 点击文件列表中已上传的文件时的钩子
      this.dialogImageUrl = file.url ? file.url : file.response.data;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) { // 文件上传成功时的钩子
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      if (fileList[0].response.success) {
        // this.$alert('上传成功');
        // // console.log('上传成功')
      }
      let json = {
        value: fileList,
        type: this.type,
        prop: this.prop,
        method: "upload",
        response: response
      };
      this.$emit("handleUploadSuccess", json)
    },
    handleBeforeUpload(file) { // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      if (this.type == "image") {
        if (imageTypeList.indexOf(file.type) < 0) {
          this.$alert("上传的图片格式只能是jpg或者png，请重新选择图片上传");
          return false;
        }
        if (!this.value) {
          this.value = [];
        }
        if (this.value.length == 1) {
          // this.value = [];
          // this.$alert('只能上传一张照片')
          // return false;
        } else if (typeof this.value === "object") {
          for (let i in this.value) {
            if (this.value.hasOwnProperty(i)) {
              this.value[i].name = new Date().getTime() + ".png"
            }
          }
        }
        //  处理图片压缩 后期加上
        let size = file.size / 1024 / 1024;
        if (size > 0.512) {
          // checkAndHandleCompression 方法死循环
          // checkAndHandleCompression(file).then( fileOptions => {
          //   file = fileOptions.uploadFile
          //   file.src = fileOptions.uploadSrc
          //   let params = new FormData();
          //   let file = convertBase64UrlToFile(file.src, 'photoImage' + new Date().getTime());
          //   params.append('file', file);
          //   uploadPhoto(params).then(res => {
          //     let fileList = [{response: res.data}];
          //     this.handleSuccess(null, null, fileList)
          //   }).catch(err => {
          //     // // console.error("压缩后上传失败: %o", err)
          //   });
          // });
        }
      } else if (this.type == "excel") {
        if (file.type && excelTypeList.indexOf(file.type) < 0) {
          this.$alert("只能上传excel文件，请重新选择");
          return false;
        }
        if (this.value.length == 1) {
          this.$alert("只能上传一个excel文件")
          return false;
        }
      }
    }, handleOnExceed(file, fileList) {
      this.$alert("只能上传一张照片")
    }
  }
}
</script>

<style scoped>
  .el-upload-dragger-extend {
    width: 200px;
  }
</style>
