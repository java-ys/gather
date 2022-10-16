

<template>
  <div>
    <div class="up-out">
      <Upload
        ref="upload"
        :data="params"
        :action="action"
        :headers="headers"
        :accept="accept"
        :format="format"
        :max-size="maxSize"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :on-format-error="formatError"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :on-exceeded-size="exceedError"
      >
        <!-- <Icon
          type="ios-cloud-upload-outline"
          class="up-icon"
        /> -->
        <slot />
      </Upload>
    </div>

    <!-- <Modal v-model="visible" title="查看图片">
      <img :src="defaultImg" style="width: 100%" />
    </Modal> -->
  </div>
</template>

<script>
// 运用公共文件上传服务
// http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=2699704
import { getUpLoadTokenService } from "_o/api/coupon-manage";
import { tool } from "_o/api/baseMixin.js";

export default {
  name: "common-img-upload",
  mixins: [tool],
  props: {
    defaultImg: {
      // 默认图片
      type: String,
      default: "",
    },
    width: {
      // 上传图片的宽度
      type: Number,
      default: 0,
    },
    height: {
      // 上传图片的高度
      type: Number,
      default: 0,
    },
    action: {
      // 上传图片的地址
      type: String,
      default: "",
    },
    accept: {
      // 文件过滤
      type: String,
      // default: "image/*",
    },
    maxSize: {
      // 限制文件上传的大小,单位KB
      type: Number,
      default: 10 * 1024,
    },
    format: {
      type: Array,
      default: () => {
        return ["jpg", "jpeg", "png"];
      },
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    largestNum: {
      type: Number,
      default: 9999,
    },
    // 如果有特殊限制，可以讲限制内容放在imgInfo中传进来
    imgInfo: {},
  },
  data() {
    return {
      visible: false,
      headers: {
        token: "",
      },
      uploadListArr: [],
      file: {},
    };
  },
  computed: {
    sheep() {
      let BaseValue = 72;
      let diff = 12;
      let res = {
        width: `${BaseValue}px`,
        height: `${BaseValue}px`,
        iconLineHeight: `${BaseValue - diff}px`,
      };
      if (this.width && this.height && this.width !== this.height) {
        let name =
          this.width < this.height
            ? { min: "width", max: "height" }
            : { min: "height", max: "width" };
        let minVal = this[name.min];
        let ratio = BaseValue / minVal;
        res[name.min] = `${BaseValue}px`;
        res[name.max] = `${this[name.max] * ratio}px`;
        res.iconLineHeight = `${Number(res.height.replace("px", "")) - diff}px`;
      }
      return res;
    },
  },
  methods: {
    handleRemove() {
      this.$emit("remove", "", {});
    },
    async beforeUpload(file) {
      let that = this;
      this.file = file;
      return new Promise(async (reslove, reject) => {
        if (this.fileList.length > this.largestNum - 1) {
          that.$Message.error(`最多上传${this.largestNum}个`);
          return reject(false);
        }
        const [err, data] = await this.toResult(getUpLoadTokenService({}));

        if (err || !data) {
          // that.$Message.error("获取token失败");
          return reject(false);
        }
        this.headers.token = data;

        return reslove(true);
      });
    },
    // 文件格式验证失败
    formatError() {
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式图片`);
    },
    async uploadSuccess(res) {
      if (res.success) {
        this.$emit("on-success", res.data);
      } else {
        this.$Message.error(res.msg);
      }
    },
    uploadError(res) {
      this.$Message.error(res.msg);
    },
    exceedError(file, fileList) {
      let msg=`单文件不能超过${this.maxSize/1024}M`
      this.$Message.error(msg);
    }
  },
};
</script>
<style scoped lang='less'>
.demo-upload-list {
  text-align: center;
  // line-height: 72px;
  overflow: hidden;
  position: relative;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  // margin: 0 2px;
}
.up-out {
  // display: flex;
  height: 75px;
  align-items: flex-end;
}
.info-list {
  line-height: 22px;
  color: #999;
  margin-left: 15px;
}
.up-icon {
  font-size: 60px;
  // border: 1px dashed #e3e3e3;
  cursor: pointer;
  padding: 5px;
  color: #c3c3c3;
  text-align: center;
}
.width-img {
  .up-icon,
  .demo-upload-list {
    width: 120px;
  }
  .demo-upload-list-cover i {
    font-size: 23px;
    margin: 0 10px;
  }
}
.height-img {
  height: 120px;
  .up-icon,
  .demo-upload-list {
    height: 120px;
    line-height: 120px;
  }
  .demo-upload-list-cover i {
    font-size: 23px;
  }
}
</style>
