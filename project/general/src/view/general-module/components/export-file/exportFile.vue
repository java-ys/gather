<template>
  <Button
    type="primary"
    :disabled="isDisabled"
    :icon="icon"
    @click="exportFile"
  >
    {{ btnText }}
  </Button>
</template>
<script>
import axios from "axios";
import fileDownload from "js-file-download";
import { getToken } from "@/libs/util.js";
import config from "@/config/config"; // 为引入的配置文件
const headersObject = config.headers; // 取出headers对象
export default {
  props: {
    // 查询条件
    queryData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 其他条件, 非必选查询条件
    extraQueryData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ajaxMethod: {
      type: String,
      default: "POST"
    },
    columnsTitle: {
      type: Array,
      default: () => {
        return [];
      }
    },
    exportUrl: {
      type: String,
      required: true
    },
    excelTitle: {
      type: String,
      default: "Message"
    },
    exportFileName: {
      type: String,
      default: "Message.csv"
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: "数据导出"
    },
    baseUrlKey: {
      type: String,
      default: "_baseUrl"
    },
    isMastQuery: {
      type: Boolean,
      default: false
    },
    exportCheckBefore: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 导出特殊条件检查
    extraCheck: {
      type: Boolean,
      default: false
    },
    mastCheckKey:{
      type: Array,
      default:()=>[]
    },
    mastCheckMsg:{
      type: String,
      default:''
    },
    icon:{
      type: String,
      default:''
    },
    isExportDetail: {
      type: Boolean,
      default: false
    },
    messageTips: {
      type: String,
      default: "批量导出"
    }
  },
  data() {
    return {
      exportMsgUrl: this[this.baseUrlKey] + this.exportUrl//'http://192.168.33.133:6102'+ this.exportUrl //this[this.baseUrlKey] + this.exportUrl
    };
  },
  methods: {
    exportFile() {
      if (!this.exportCheckBefore) {
        this.$Message.warning(`${this.messageTips}必须选择查询条件`);
        return false
      }
      if (this.isMastQuery) {
        let keyList = Object.keys(this.queryData);
        if (keyList.length === 0) {
          this.$Message.warning(`${this.messageTips}必须选择查询条件`);
          return false;
        }
      }
      if (this.isExportDetail) {
        // _routeAdmin
        // console.log(this.baseUrlKey)
        // debugger
        this.$Modal.confirm({
          title: "提示",
          content: `默认导出表格最新的5000条数据`,
          onOk:  () => {
            let params = {
                ...this.extraQueryData
            };
            if (this.columnsTitle.length > 0) {
              params.excelHeader = [...this.columnsTitle];
            }
            if (Object.keys(this.queryData).length > 0) {
              params = Object.assign(params, this.queryData);
            }
            let method = this.ajaxMethod.toUpperCase();
            let ajaxData = method === "GET" ? "params" : "data";
            let sendMsg = {
             method: method,
              headers: {
                Authorization: getToken(),
                ...headersObject
              },
              url: this.exportMsgUrl,
              ajaxData: params,
              responseType: "blob" // 如果项目中引入了mock模块，会更改blob数据，返回乱码
            };
            sendMsg[ajaxData] = params;
            console.log(sendMsg);
            let self = this;
            axios(sendMsg)
              .then(function(res) {
                if (res.data) {
                  if(res.data.type === 'application/json'){
                    // 如果返回是json格式，将blob转json，报错
                    let reader = new FileReader()
                    reader.addEventListener("loadend", function () { //
                      let res = JSON.parse(reader.result || '{}'); // 返回的数据
                      let errormsg = res.errorMsg || res.msg || "服务器错误!";
                      self.$Message.error(errormsg);
                    });
                    reader.readAsText(res.data, 'utf-8')
                  }else{
                    let fileName = self.exportFileName;
                    fileDownload(res.data, fileName);
                  }
                } else {
                  let errormsg = res.data.errorMsg || "服务器错误!";
                  self.$Message.error(errormsg);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
            
          },
        });
        return
      }
      // mastCheckKey中的字段为必填项
      if(this.mastCheckKey.length){
        let isCheck = this.mastCheckKey.every(k=>this.queryData[k])
        if(!isCheck){
          this.$Message.warning(this.mastCheckMsg);
          return false
        }
      }
      if (this.extraCheck) {
        this.$emit("on-extra")
        return
      }
      let params = {
        // excelTitle: this.excelTitle,
        ...this.extraQueryData
      };
      if (this.columnsTitle.length > 0) {
        params.excelHeader = [...this.columnsTitle];
      }
      if (Object.keys(this.queryData).length > 0) {
        params = Object.assign(params, this.queryData);
      }
      let method = this.ajaxMethod.toUpperCase();
      let ajaxData = method === "GET" ? "params" : "data";
      let sendMsg = {
        method: method,
        headers: {
          Authorization: getToken(),
          ...headersObject
        },
        url: this.exportMsgUrl,
        ajaxData: params,
        responseType: "blob" // 如果项目中引入了mock模块，会更改blob数据，返回乱码
      };
      sendMsg[ajaxData] = params;
      console.log(sendMsg);
      let self = this;
      axios(sendMsg)
        .then(function(res) {
          if (res.data) {
            if(res.data.type === 'application/json'){
              // 如果返回是json格式，将blob转json，报错
              let reader = new FileReader()
              reader.addEventListener("loadend", function () { //
                let res = JSON.parse(reader.result || '{}'); // 返回的数据
                let errormsg = res.errorMsg || res.msg || "服务器错误!";
                self.$Message.error(errormsg);
              });
              reader.readAsText(res.data, 'utf-8')
            }else{
              let fileName = self.exportFileName;
              fileDownload(res.data, fileName);
            }
          } else {
            let errormsg = res.data.errorMsg || "服务器错误!";
            self.$Message.error(errormsg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
