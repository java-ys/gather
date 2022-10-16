<template>
  <Button type="primary" :disabled="isDisabled" @click="exportFile">
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
    queryData: {
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
    }
  },
  data() {
    return {
      exportMsgUrl: this.exportUrl
    };
  },
  methods: {
    exportFile() {
      if (this.isMastQuery) {
        let keyList = Object.keys(this.queryData);
        if (keyList.length === 0) {
          this.$Message.warning("批量导出必须选择查询条件");
          return false;
        }
      }
      let params = {
        // excelTitle: this.excelTitle,
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
      let self = this;
      axios(sendMsg)
        .then(function(res) {
          if (res.data) {
            let fileName = self.exportFileName;
            fileDownload(res.data, fileName);
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
