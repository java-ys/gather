<!-- 
 * @description: 大图二维码弹窗，主要为了下载大尺寸二维码
 * @author: wuxuan 
 * @date: 2019-09-19 15:21:11
 * @后台人员:  
!-->
<template>
  <div class="qr-btn">
		<Button size="small" @click="isQrcodeModal=true">查看大图</Button>
    <Modal v-model="isQrcodeModal" title="二维码" width="1035">
      <qrcodeImg 
        v-if="isQrcodeModal"
        title="点击下载"
        :qrUrl="url" 
        :qrSize="1000" 
        :qrLogoSize="250" 
        :isLogo="true" 
        :qrLogo="qrLogo"
        :qrMargin="2.6">
      </qrcodeImg>
    </Modal>
  </div>
</template>
<script>
import qrcodeImg from "./qrcodeImg.vue";
import logo from "_g/assets/images/qrcode/big-logo.png";
export default {
  name: "qrcodeModal",
  props: {
    url: {
      type: String,
      default: "",
      required: true,
    }
  },
  components: {
    qrcodeImg
  },
  data() {
    return {
      isQrcodeModal:false,
      qrLogo: logo
		};
  }
};
</script>
<style scoped lang='less'>
.qr-btn{
	display: inline-block;
}
</style>