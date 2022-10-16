<template>
  <Button
    :type="type"
    :ghost="ghost"
    @click="getModal">
    <Icon v-if="isIcon" size="16" type="ios-cloud-download-outline" />{{text}}
  </Button>
</template>
<script>
import { getToken } from "@/libs/util.js";
import axios from 'axios'
import fileDownload from 'js-file-download'

export default {
  name:'download-btn',
  props:{
    type:{
      default: 'primary'
    },
    isIcon:{
      default: true
    },
    text:{
      default: '下载模板'
    },
    fileName:{
      default:''
    },
    baseUrlName:{
      default:'_baseUrl'
    },
    toUrl: {
      type: String,
      required: true
    },
    ghost: {
      default: false
    }
  },
  data(){
    return {
      header: { Authorization: getToken() },
    }
  },
  methods: {
    getModal(){
      let self = this;
      let fileName = this.fileName

      if(!fileName){
        let fileNameList = this.toUrl.split('/')
        fileName = fileNameList[fileNameList.length-1]
      }
      axios({
        method: 'get',
        url: this[this.baseUrlName] + this.toUrl,
        responseType: 'blob',
        headers: this.header
      }).then(function (res) {
        let data = res.data||{}
        if(data.type === 'application/json'){
          // 如果返回是json格式，将blob转json，报错
          let reader = new FileReader()
          reader.addEventListener("loadend", function () { // 
            let res = JSON.parse(reader.result); // 返回的数据
            let errormsg = res.errorMsg || res.msg || "服务器错误!";
            self.$Message.error(errormsg);
          });
          reader.readAsText(data, 'utf-8')
        }else{  
          data && fileDownload(res.data,fileName)
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
</style>