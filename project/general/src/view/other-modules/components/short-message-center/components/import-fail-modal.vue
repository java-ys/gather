<template>
  <div>
    <Modal
      v-model="isShow"
      :width="632"
      :mask-closable="false"
      footer-hide
      @on-cancel="closeModal()">
      <div class="err-info">
        <Icon class="err-icon" type="ios-alert"></Icon>
        {{info.msg}}
      </div>
      <div class="text-center">
        <Button 
          class="click-down right15" 
          type="text"
          @click="downLoadExcel" ghost>
          查看号码</Button>
        <Button type="primary" size="large" @click="closeModal">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { exportFile } from '@/libs/tools.js'//post data下载
export default {
  name: "carousel-modal",
  props: {
    show: {
      type: Boolean
    },
    info:{
      default:()=>{
        return {
          msg: '上传错误'
        }
      }
    }
  },
  data() {
    return {
      isShow:this.show,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    downLoadExcel(){
      if(this.info.isLink){
        // 地址下载
      }else{
        // 接口请求下载
        exportFile(this.info.params, this.info.url,  '导入失败列表','post','.xlsx',this.info.baseUrl)
      }
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
    }
  }
};
</script>
<style lang="less" scoped>
.err-info{
  font-size: 18px;
  line-height: 150px;
  text-align: center;
}
.err-icon{
  font-size: 25px;
  color:#f90;
  position: relative;
  top:-2px;
}
.click-down{
  color:#2d8cf0;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
