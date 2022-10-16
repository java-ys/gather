<template>
  <div>
    <el-button size="small" type="text" @click="photoInit">点击拍照</el-button>
    <el-dialog
      :visible.sync="photoing"
      append-to-body
      class="dialog-size"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="text-align: center; margin-top: 10px">
        <div id="photo-text" style="font-size: 18px">
          正在生成并上传照片，请稍等片刻...
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  photoParamSet,
  photoParamGet,
  photoGrabImage,
  uploadPhoto,
} from "_o/api/salary/profile";
import { convertBase64UrlToFile } from "_o/common/common";
import { toResult } from "_o/common/baseMixin";
import { getToken } from "_o/api/salary/common.js";
import  { uploadPrivateImage } from "_o/api/salary/image";

export default {
  props: {
    propName: { type: String, required: true },
    camera: { type: String, required: false, default: "0" },
  },
  data() {
    return {
      photoing: false,
      photoErrorMsg:
        "拍摄失败，可能原因： 1.未安装高拍仪程序 2.未连接高拍仪设备 3.未开启高拍仪服务 4.服务状态异常",
    };
  },
  methods: {
    // 拍照参数初始化 ：像素、镜头
    photoInit() {
      let that = this;
      that.photoing = true;
      // camidx 0 文档头 1 人像头
      photoParamSet({ camidx: this.camera })
        .then((res) => {
          if (res.data.code != "0") {
            this.$alert(this.photoErrorMsg);
            that.photoing = false;
          } else {
            that.startPhoto();
          }
        })
        .catch((error) => {
          that.photoing = false;
          this.$alert(this.photoErrorMsg);
        });
    },
    // 拍照启动检查
    startPhoto() {
      let that = this;
      // camidx 0 文档头 1 人像头
      photoParamGet({ type: "resolution", camidx: this.camera })
        .then((res) => {
          if (res.data.code != "0") {
            that.$alert(this.photoErrorMsg);
            that.photoing = false;
          } else {
            // // console.log("高拍仪启动成功√");
            that.makePhoto();
          }
        })
        .catch((error) => {
          that.photoing = false;
          that.$alert(this.photoErrorMsg);
        });
    },
    // 拍照
    makePhoto() {
      let that = this;
      // camidx 0 文档头 1 人像头
      photoGrabImage({
        filepath: "base64",
        rotate: "0",
        camidx: this.camera,
        cutpage: "1",
      })
        .then((res) => {
          if (res.data.code != "0") {
            that.$alert(this.photoErrorMsg);
            that.photoing = false;
          } else {
            let photoBase64 = res.data.photoBase64;
            let file = convertBase64UrlToFile(
              "data:image/jpeg;base64," + photoBase64,
              "photoImage" + new Date().getTime()
            );
            let params = new FormData();
            params.append("file", file);
            that.uploadPhoto(params);
          }
        })
        .catch((error) => {
          that.photoing = false;
          that.$alert(this.photoErrorMsg);
        });
    },
    // 上传拍照图片
    async uploadPhoto(params) {
      let [err, data] = await this.toResult(getToken({}));
      if (err) {
        this.$alert("图片上传获取token失败，请稍后再试");
        return
      }
      if (data) {
        [err, data] = await this.toResult(uploadPrivateImage(params, { token: data }));
        if (err) {
          this.$alert("图片上传服务器失败，请稍后重新上传图片");
          return
        }
        let json = {
          imgUrl: data.privateUrl,
          propName: this.propName
        };
        this.$emit("resolveImgUrl", json);
      }

      // let that = this;
      // uploadPhoto(params)
      //   .then((res) => {
      //     if (res.data.success && res.data.data) {
      //       let json = {
      //         imgUrl: res.data.data,
      //         propName: this.propName,
      //       };
      //       this.$emit("resolveImgUrl", json);
      //     } else {
      //       that.$alert("图片上传服务器失败，请稍后重新上传图片");
      //     }
      //     that.photoing = false;
      //   })
      //   .catch((error) => {
      //     that.photoing = false;
      //     that.$alert("图片上传服务器失败，请稍后重新上传图片");
      //   });
    },
  },
};
</script>
