<template>
  <Button type="primary" @click="exportFile">数据导出</Button>
</template>
<script>
import axios from "axios";
import fileDownload from "js-file-download";
import { getToken } from "@/libs/util.js";
import config from "@/config/config";
const headersObject = config.headers;
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
    needTitle: {
      type: Boolean,
      default: true
    },
    setHeader: {
      Boolean,
      default: false
    }
  },
  computed: {
    exportMsgUrl: function() {
      return this._baseUrl + this.exportUrl;
    }
  },
  data() {
    return {};
  },
  methods: {
    exportFile() {
      let params = {};
      if (this.setHeader) {
        axios.interceptors.request.use(
          config => {
            config.headers.agentUuid = this.queryData.agentUuid; // 后台接收的参数，后面我们将说明后台如何接收
            return config;
          },
          err => {
            return Promise.reject(err);
          }
        );
      }
      if (this.needTitle) {
        params = { excelTitle: this.excelTitle };
      }
      if (this.columnsTitle.length > 0) {
        params.excelHeader = [...this.columnsTitle];
      }
      if (Object.keys(this.queryData).length > 0) {
        params = Object.assign(params, this.queryData);
      }
      let method = this.ajaxMethod.toUpperCase();
      let ajaxData = method == "GET" ? "params" : "data";
      let sendMsg = {
        method: method,
        withCredentials: false,
        headers: {
          Authorization: getToken("agent_token"),
          ...headersObject
        },
        url: this.exportMsgUrl,
        ajaxData: params,
        responseType: "blob" // 如果项目中引入了mock模块，会更改blob数据，返回乱码
      };
      sendMsg[ajaxData] = params;
      let title = this.excelTitle;
      axios(sendMsg)
        .then(function(res) {
          if (res.data) {
            fileDownload(res.data, title + ".xls");
          } else {
            let errormsg = res.data.errorMsg || "服务器错误!";
            this.$Message.error(msg);
          }
        })
        .catch(function(error) {});
    }
  }
};
</script>
