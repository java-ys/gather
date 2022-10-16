// 运用公共文件上传服务
// http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=2699704

<template>
  <div>
    <!-- <div class="up-out" :class="{'width-img':shape==='width','height-img':shape==='height'}"> -->
    <div class="up-out" :style="{height:sheep.height}">
      <div
        v-if="defaultImg"
        class="demo-upload-list"
        :style="{width:sheep.width,height:sheep.height,lineHeight:sheep.height}"
      >
        <img :src="defaultImg" style="display: block;" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
          <Icon v-if="!isDetail" type="ios-trash-outline" @click.native="handleRemove"></Icon>
        </div>
      </div>
      <Upload
        v-else
        ref="upload"
        :data="params"
        :action="action"
        :headers="headers"
        :accept="accept"
        :format="format"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :on-format-error="formatError"
        :on-error="uploadError"
        :on-success="uploadSuccess"
      >
        <Icon
          type="ios-cloud-upload-outline"
          class="up-icon"
          :style="{width:sheep.width,height:sheep.height,lineHeight:sheep.iconLineHeight}"
        />
      </Upload>
      <ul class="info-list" v-show="!isDetail">
        <li>
          <span v-if="maxSize">大小：{{ maxSize }}KB以内</span>
        </li>
        <li>
          <span v-if="mixMsg">{{ mixMsg }}</span>
        </li>
        <li>
          <span v-if="format.length>0">格式：{{ format.join(', ') }}</span>
        </li>
        <li>
          <span v-if="width && height">分辨率：{{ width }}*{{ height }}px</span>
        </li>
        <li>
          <span v-if="width && !height">分辨率：宽 {{ width }}px</span>
        </li>
        <li>
          <span v-if="!width && height">分辨率：高 {{ height }}px</span>
        </li>
        <li>
          <span v-if="otherMsg">{{ otherMsg }}</span>
        </li>
      </ul>
    </div>

    <Modal v-model="visible" title="查看图片">
      <img :src="defaultImg" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
// 限制宽高，大小，格式，单图片上传组件
import { getUpLoadTokenService } from "_o/api/coupon-manage";
import { tool } from "_o/api/baseMixin.js";

export default {
  name: "common-img-upload",
  mixins: [tool],
  props: {
    defaultImg: {
      // 默认图片
      type: String,
      default: ""
    },
    width: {
      // 上传图片的宽度
      type: Number,
      default: 0
    },
    height: {
      // 上传图片的高度
      type: Number,
      default: 0
    },
    action: {
      // 上传图片的地址
      type: String,
      default: ""
    },
    accept: {
      // 文件过滤
      type: String,
      default: "image/*"
    },
    maxSize: {
      // 限制文件上传的大小,单位KB
      type: Number,
      default: 0
    },
    mixMsg: {
      // 特殊大小限制
      type: String,
      default: ""
    },
    otherMsg: {
      // 特殊大小限制
      type: String,
      default: ""
    },
    format: {
      type: Array,
      default: () => {
        return ["jpg", "jpeg", "png"];
      }
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    shape: {
      // 长方形、正方形，竖长方形
      type: String,
      default: ""
    },
    isDetail: {
      default: false
    },
    // 如果有特殊限制，可以讲限制内容放在imgInfo中传进来
    imgInfo: {}
  },
  data() {
    return {
      visible: false,
      headers: {
        token: ""
      },
      uploadListArr: [],
      file: {}
    };
  },
  computed: {
    sheep() {
      let BaseValue = 72;
      let diff = 12;
      let res = {
        width: `${BaseValue}px`,
        height: `${BaseValue}px`,
        iconLineHeight: `${BaseValue - diff}px`
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
    }
  },
  mounted() {},
  methods: {
    handleView() {
      this.visible = true;
    },
    handleRemove() {
      this.$emit("on-change", "", {});
    },
    beforeUpload(file) {
      return new Promise(async (reslove, reject) => {
        let isAllow = true;
        let msg = "";
        let that = this;
        this.file = file;
        // 文件的大小
        if (this.maxSize) {
          isAllow = file.size / 1024 > this.maxSize ? false : true;
          msg = `请上传大小在 ${this.maxSize}KB 以内的图片`;
          if (!isAllow) {
            that.$Message.error(msg);
            return reject(false);
          }
        }
        if (this.mixMsg) {
          // result:{isSuccess:是否满足验证，msg：不满足验证的提示信息}
          let result = this.imgInfo.mixValid(file);
          if (!result.isSuccess) {
            that.$Message.error(result.msg);
            return reject(false);
          }
        }
        const [err, data] = await this.toResult(getUpLoadTokenService({}));

        if (err || !data) {
          // that.$Message.error("获取上传图片token失败");
          return reject(false);
        }
        this.headers.token = data

        return reslove(true);
      });
    },
    // 校验图片宽高
    async validSize(file) {
      let isAllow = true;
      let msg = "";
      let that = this;
      let reader = new FileReader();
      let loadPromise = new Promise(reslove => {
        reader.onload = async function(e) {
          let data = e.target.result;
          // 加载图片获取图片真实宽度和高度
          let image = new Image();
          image.onload = function() {
            let width = image.width;
            let height = image.height;
            if (that.width && that.height) {
              isAllow =
                width === that.width && height === that.height ? true : false;
              msg = `请上传分辨率为 ${that.width}*${that.height}px 的图片`;
            } else if (that.width && !that.height) {
              isAllow = width === that.width ? true : false;
              msg = `请上传宽度为 ${that.width}px 的图片`;
            } else if (!that.width && that.height) {
              isAllow = height === that.height ? true : false;
              msg = `请上传高度为 ${that.height}px 的图片`;
            }
            reslove();
          };
          image.src = data;
        };
      });
      reader.readAsDataURL(file);
      await loadPromise;
      return { isAllow, msg };
    },
    // 文件格式验证失败
    formatError() {
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式图片`);
    },
    async uploadSuccess(res) {
      // console.log(res)
      if (res.success) {
        // 文件宽高
        if (this.width || this.height) {
          let res = await this.validSize(this.file);
          let isAllow = res.isAllow;
          let msg = res.msg;
          if (!isAllow) {
            this.$Message.error(msg);
            return false;
          }
        }

        this.$emit("on-change", res.data.publicUrl, res.data);
      } else {
        this.$Message.error(res.msg);
      }
    },
    uploadError(res) {
      this.$Message.error(res.msg);
    }
  }
};
</script>
<style scoped lang='less'>
.demo-upload-list {
  text-align: center;
  line-height: 72px;
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
  display: flex;
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
  border: 1px dashed #e3e3e3;
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
