<template>
  <Modal v-model="show" :mask-closable="false" :title="modalTitle" width="800px" footer-hide>
    <div class="view-wrapper">
      <Row class="view-row">
        <Col span="2">合同名称：</Col>
        <Col span="6">{{contractName}}</Col>
        <Col span="2">合同类型：</Col>
        <Col span="6">{{signNum|signNumFmt}}</Col>
        <Col span="2">分类：</Col>
        <Col span="6">{{customizationFlag|customization}}</Col>
      </Row>
      <Row class="view-row">
        <Col>适用对象:</Col>
        <p v-if="customizationFlag === 0">所有CP公司（已配置定制版的CP公司除外）</p>
        <p v-else>{{cpNames}}</p>
      </Row>
      <Row class="view-row">
        <Col>有效期:</Col>
        <p>{{startTime}}&nbsp;&nbsp;至&nbsp;&nbsp;{{endTime}}</p>
      </Row>
      <Row class="view-row">
        <Col>合同模板:</Col>
        <p>{{templateName}}</p>
        <br>
        <a v-if="contractAgreement&&contractAgreement.attachment" @click="downloadFile">下载模板查看</a>
      </Row>
    </div>
  </Modal>
</template>

<script>
import {
  queryContractDetail
} from "_o/api/lease";
import oss from "@/mixins/oss";
import axios from "axios";
import fileDownload from "js-file-download";
import { getToken } from "@/libs/util";
import config from "@/config/config" // 为引入的配置文件
const headersObject = config.headers // 取出headers对象
export default {
  name: "viewmodal",
  mixins: [oss],
  filters: {
    customization(val) {
      let res = ""
      switch (val) {
        case 0:
          res = "基线版";
          break;
        case 1:
          res = "定制版";
          break;
        default:
          res = "";
          break;
      }
      return res
    },
    signNumFmt(val) {
      let res = ""
      switch (val) {
        case 3:
          res = "三方合同";
          break;
        case 4:
          res = "四方合同";
          break;
        default:
          res = "";
          break;
      }
      return res
    }
  },
  props: {
    value: {
      default: false
    },
    modalTitle: {
      default: "代扣合同详情"
    },
    contractId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: this.value,
      contractType: 2,
      customizationFlag: 0,
      contractName: "",
      templateId: "",
      templateName: "",
      startTime: "",
      endTime: "",
      cpNames: "",
      signNum: "",
      contractAgreement:{}
    }
  },
  watch: {
    value(value) {
      this.show = value;
      if (value) {
        this.getContractDetail()
      }
    },
    show(value) {
      this.$emit("input", value);
    }
  },
  mounted() {
    this.getContractDetail()
  },
  methods: {
    getContractDetail() {
      if (!this.contractId) {
        return;
      }
      let params = {
        contractId: this.contractId
      }
      queryContractDetail(params).then(async (res) => {
        if (res && res.data && res.data.success) {
          let { data } = res.data
          this.contractName = data.name;
          this.customizationFlag = data.customizationFlag;
          this.templateId = data.templateId;
          this.templateName = data.templateName;
          this.startTime = this.$moment(data.startTime).format("YYYY-MM-DD HH:mm:ss");
          this.endTime = this.$moment(data.endTime).format("YYYY-MM-DD HH:mm:ss");
          this.signNum = data.signNum;
          if (data.customizationFlag === 1) {
            this.cpNames = data.cpNameList.join("、");
          }
          if (
            data.contractAgreement &&
            data.contractAgreement.attachment
          ) {
            let [, url] = await this.getOssFile({
              uuid: data.contractAgreement.attachment
            });
            this.imgURL = url;
            this.contractAgreement = data.contractAgreement
          }
        } else {
          this.$Message.error(res.data.msg || "获取详情失败")
        }
      })
    },
    downloadFile() {
      let sendMsg = {
        method: "get",
        url: this.imgURL,
        responseType: "blob",
        headers: {
          "Authorization": getToken(),
          ...headersObject
        }, 
      };
      axios(sendMsg)
        .then(res => {
          if (res.data) {
            fileDownload(res.data, this.contractAgreement.fileName+'.'+this.contractAgreement.fileExtension);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  }
}
</script>

<style lang="less" scoped>
  .info-title {
    font-size: 24px;
    font-weight: bold;
    padding: 15px 0;
  }

  .buttons {
    width: 100%;
    text-align: right;

    .ivu-form-item-content {
      text-align: right;

      > button {
        margin-left: 10px;
      }
    }
  }
  .view-wrapper{
    min-height:400px;
    .view-row{
      font-size:14px;
      padding:10px;
    }
  }
</style>
