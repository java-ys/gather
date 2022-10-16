<!--
 * @description: 支持 logo，文字，下载的二维码
 * @author: wuxuan
 * @date: 2019-09-19 15:21:26
 * @后台人员:
!-->
<template>
  <div id="meQrcode" :title="qrText">
    <div class="qrcode_box">
      <a v-if="!isFirefox" @click.stop.prevent="downloadQrImg">
        <!-- 带logo和文字的二维码图片 -->
        <img
          id="qrcode_canvas"
          ref="qrcode_canvas"
          class="qrcode_canvas"
          style="border:1px solid #ddd;"
          alt="二维码图片"
        />
        <Button
          v-if="!isImg"
          :type="btnType"
          :ghost="btnType ? true : false"
          size="small"
          >保存二维码</Button
        >
      </a>
      <a
        v-if="isFirefox"
        :href="qrcodeImg"
        download="二维码图片.png"
        class="qrcode"
      >
        <!-- 带logo和文字的二维码图片 -->
        <img
          id="qrcode_canvas"
          ref="qrcode_canvas"
          class="qrcode_canvas"
          style="border:1px solid #ddd;"
          alt="二维码图片"
        />
        <Button
          v-if="!isImg"
          :type="btnType"
          :ghost="btnType ? true : false"
          size="small"
          >保存二维码</Button
        >
      </a>
      <!-- logo图片 -->
      <img
        v-if="qrLogo"
        ref="qrcode_logo"
        class="qrcode_logo"
        :src="qrLogo"
        alt="logo图片"
      />
      <!-- 带logo和文字的二维码图片canvas画布 -->
      <canvas ref="canvas" :width="qrSize" :height="qrSize" class="canvas" />
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
import logo from "./images/small-logo.png";
export default {
  /**
   * @argument qrUrl        二维码内容 （url，必填）
   * @argument qrMargin     二维码内容边距 （默认2.5）
   * @argument qrSize       二维码大小（默认200px）
   * @argument qrText       二维码中间显示文字(默认没有)
   * @argument qrTextSize   二维码中间显示文字大小(默认14px)
   * @argument isLogo       二维码中间是否显示图片
   * @argument qrLogo       二维码中间显示图片(有默认)
   * @argument qrLogoSize   二维码中间显示图片大小(默认为40)
   * @argument isDownload   是否有点击下载功能
   * @argument isImg        是否显示二维码图片，否则显示下载二维码按钮
   * @argument btnType      按钮type
   */
  props: {
    qrUrl: {
      type: String,
      default: "",
      required: true
    },
    qrMargin: {
      type: Number,
      default: 2.5
    },
    qrSize: {
      type: Number,
      default: 200
    },
    qrText: {
      default: ""
    },
    isLogo: {
      type: Boolean,
      default: true
    },
    qrLogo: {
      type: String,
      default: logo
    },
    qrLogoSize: {
      type: Number,
      default: 52
    },
    qrTextSize: {
      type: Number,
      default: 14
    },
    isDownload: {
      type: Boolean,
      default: true
    },
    isImg: {
      type: Boolean,
      default: true
    },
    btnType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isFirefox: false, // 是否为火狐浏览器
      qrcodeImg: "" // 带logo的二维码
    };
  },
  mounted() {
    // 判断浏览器是否是火狐
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      this.isFirefox = true;
    }
    this.handleQrcodeToDataUrl();
  },
  updated() {
    this.handleQrcodeToDataUrl();
  },
  methods: {
    /**
     * 生成带logo和文字的二维码，
     * 背景：qrcode插件不支持添加logo和文字
     * 实现方法：qrocde生成的二维码图片和logo，文字，一起划入新的canvas画布，生成图片
     * 1.使用qrcode将qrUrl链接地址生成二维码，调用qrcode的toDataURL方法，
     * 2.在回调方法中，获取生成的二维码图片：url
     * 3.在自己新建的canvas画布中，将2步骤获取的url以image的方式画到画布中
     * 4.判断如果传入logo，将logo画入画布中间
     * 5.判断如果传入文字，将文字放在画布底部
     */
    handleQrcodeToDataUrl() {
      let qrcode_canvas = this.$refs.qrcode_canvas;
      let qrcode_logo = this.$refs.qrcode_logo;
      let canvas = this.$refs.canvas;
      const that = this;
      QRCode.toDataURL(
        this.qrUrl,
        {
          errorCorrectionLevel: "H", // 容错度：高
          width: that.qrSize, // 二维码宽度
          height: that.qrSize, // 二维码高度
          margin: that.qrMargin // 二维码举例边框的白色边距
        },
        // eslint-disable-next-line handle-callback-err
        (err, url) => {
          qrcode_canvas.src = url;
          // 画二维码里的logo// 在canvas里进行拼接
          let ctx = canvas.getContext("2d");

          // qrcode_logo加载完成之后，再去画二维码，否则会有logo丢失的情况
          qrcode_logo.onload = function() {
            setTimeout(() => {
              // 获取图片
              ctx.drawImage(qrcode_canvas, 0, 0, that.qrSize, that.qrSize);
              if (that.isLogo && that.qrLogo) {
                // 设置logo大小
                // 设置获取的logo将其变为圆角以及添加白色背景
                ctx.fillStyle = "transparent";
                ctx.beginPath();
                let logoPosition = (that.qrSize - that.qrLogoSize) / 2; // logo相对于canvas居中定位
                let h = that.qrLogoSize + 10; // 圆角高 10为基数(logo四周白色背景为10/2)
                let w = that.qrLogoSize + 10; // 圆角宽
                let x = logoPosition - 5;
                let y = logoPosition - 5;
                let r = 5; // 圆角半径
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
                ctx.fill();
                ctx.drawImage(
                  qrcode_logo,
                  logoPosition,
                  logoPosition,
                  that.qrLogoSize,
                  that.qrLogoSize
                );
              }
              // 文字拼接进入画布
              if (that.qrText) {
                // 设置字体
                // eslint-disable-next-line no-unused-vars
                let fpadd = 10; // 规定内间距
                ctx.font = "bold " + that.qrTextSize + "px Arial";
                let tw = ctx.measureText(that.qrText).width; // 文字真实宽度
                let ftop = that.qrSize - that.qrTextSize; // 根据字体大小计算文字top
                let fleft = (that.qrSize - tw) / 2; // 根据字体大小计算文字left
                let tp = that.qrTextSize / 2; // 字体边距为字体大小的一半可以自己设置
                ctx.fillStyle = "#fff";
                ctx.fillRect(
                  fleft - tp / 2,
                  ftop - tp / 2,
                  tw + tp,
                  that.qrTextSize + tp
                );
                ctx.textBaseline = "top"; // 设置绘制文本时的文本基线。
                ctx.fillStyle = "#333";
                ctx.fillText(that.qrText, fleft, ftop);
              }
              canvas.style.display = "none";
              qrcode_canvas.src = canvas.toDataURL();
              that.isImg && (qrcode_canvas.style.display = "inline-block");
              that.qrcodeImg = canvas.toDataURL();
            }, 0);
          };
        }
      );
    },
    // 点击下载二维码
    downloadQrImg() {
      if (!this.isDownload) {
        return false;
      }
      // 这里是获取到的图片base64编码
      const imgUrl = this.qrcodeImg;
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        let bstr = atob(imgUrl.split(",")[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr]);
        // eslint-disable-next-line no-useless-concat
        window.navigator.msSaveOrOpenBlob(blob, "二维码图片" + "." + "png");
      } else {
        // 这里就按照chrome等新版浏览器来处理
        let a = document.createElement("a");
        a.href = imgUrl;
        a.setAttribute("download", "二维码图片");
        a.click();
      }
    }
  }
};
</script>
<style scoped>
.qrcode_box,
#meQrcode {
  display: inline-block;
}
.qrcode_box img {
  display: none;
}
</style>
