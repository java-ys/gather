<template>
  <div class="declaration-validate">
    <Row class="template-col">
      <Col>
        <Button
          type="primary"
          class="download-btn"
          target="_blank"
          @click="downloadFile"
        >
          <Icon type="ios-cloud-download-outline" size="20" />
          下载模板
        </Button>
      </Col>
    </Row>
    <Row class="template-col">
      <Col span="4">
        <Upload
          ref="importFile"
          multiple
          type="drag"
          :data="importThirdData"
          :action="importTwiceFileUrl_"
          :format="format"
          class="file-box"
          :headers="header"
          :before-upload="beforeUpHandle"
          :show-upload-list="true"
          :on-success="importSuccess"
          :on-error="importFiled"
          name="file"
          :max-size="maxSize"
          :on-exceeded-size="handleMaxSize"
          :on-format-error="handleFormatFiled"
        >
          <div class="upload-btn">
            <Icon
              type="ios-cloud-upload"
              size="20"
              style="color: #3399ff"
            ></Icon>
            &nbsp;&nbsp;导入文件
          </div>
        </Upload>
      </Col>
      <Col span="20">
        <Button
          type="primary"
          class="validate-btn"
          target="_blank"
          :disabled="uploadListArr.length === 0"
          @click="doValidate"
        >
          校验
        </Button>
      </Col>
    </Row>
    <div
      v-for="(item, index) in uploadListArr"
      :key="index"
      class="upload-list"
    >
      <div class="file-name">
        {{ item.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（{{
          (item.size / 1024).toFixed(2)
        }}KB）
      </div>
      <div class="upload-option-list">
        <!-- <Icon type="ios-eye-outline" size="30" @click.native="handlePreview(item)"></Icon> -->
        <!-- <Icon type="ios-download-outline" size="30" @click.native="handleDownload(item)"></Icon> -->
        <Icon
          type="ios-trash-outline"
          size="30"
          @click.native="handleRemove(item)"
        ></Icon>
      </div>
    </div>
    <p>校验结果:</p>
    <Alert v-if="isNoError" type="success">没有错误</Alert>
    <div v-else style="width:1000px">
      <TTable
        class="staff-table-container"
        :width="1000"
        :height="300"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        :isShowPage="true"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </TTable>
    </div>
    <Row>
      <div style="width:1000px;text-align:right;padding:20px 0">
        <Button class="reset-btn" @click="resetPage">
          清空
        </Button>
      </div>
    </Row>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
import axios from "axios";
import { parColumns } from "./config.js";
import { getToken } from "@/libs/util.js";
import { checkRentOrderInfo, queryCheckResult } from "_o/api/lease";
import config from "@/config/config";
const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro;
let timer = null;
export default {
  name: "declaration-validate",
  components: {
    // ExportFile,
    // ImportFile,
  },
  data() {
    return {
      tableData: [],
      current: 1,
      pageSize: 20,
      total: 0,
      header: { Authorization: getToken(), grayVersion: "W_asset_709" },
      isLoading: false,
      toDownTemplateUrl_:
        baseUrl + "/asset-supplier-api/download/driverRentDeclaration.xls",
      toDownTemplateName: "driverRentDeclaration.xls",
      importTwiceFileUrl_:
        baseUrl + "/asset-supplier-api/api/upload/uploadFile",
      checkRentOrderInfoUrl:
        "/asset-supplier-api/api/assets/v1/rentOrderInfoCheck/checkRentOrderInfo",
      importThirdData: {},
      parColumns: parColumns(this),
      maxSize: 51200,
      isValidating: false,
      format: ["xls", "xlsx", "XLS", "XLSX"],
      uploadListArr: [],
      queryUUID: "",
      isNoError: false
    };
  },

  mounted() {},
  methods: {
    // 下载模板
    downloadFile() {
      let sendMsg = {
        method: "get",
        url: this.toDownTemplateUrl_,
        responseType: "blob" // 如果项目中引入了mock模块，会更改blob数据，返回乱码
      };
      axios(sendMsg)
        .then(res => {
          if (res.data) {
            fileDownload(res.data, this.toDownTemplateName);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    doValidate() {
      //
      if (this.isValidating) {
        this.showModal();
        return;
      }
      // 创建 formData 对象
      let formData = new FormData();
      // 向 formData 对象中添加文件
      for (let i = 0; i < this.uploadListArr.length; i++) {
        formData.append("files", this.uploadListArr[i]); // 文件对象
      }
      checkRentOrderInfo(formData).then(res => {
        if (res && res.data && res.data.success) {
          let { data } = res.data;
          this.queryUUID = data;
          this.isValidating = true;
          this.showModal();
          timer = setInterval(() => {
            this.current = 1;
            this.queryValiResult(1, this.pageSize);
            // if 200  clear
          }, 5000);
        } else {
          this.$Message.error("校验失败");
        }
      });
    },
    showModal() {
      this.$Modal.confirm({
        width: 300,
        content: "数据校验中，请稍等",
        okText: "终止",
        cancelText: "关闭",
        onOk: () => {
          clearInterval(timer);
          timer = null;
          this.isValidating = false;
        }
      });
    },
    changePage(val) {
      // 列表换页
      this.current = val;
      this.queryValiResult(val, this.pageSize);
    },
    changePageSize(val) {
      // 设置列表行数
      this.pageSize = val;
      this.queryValiResult(this.current, val);
    },
    queryValiResult(currpage, pagesize) {
      //   todo 查询结果
      queryCheckResult({
        uid: this.queryUUID,
        pageSize: pagesize,
        currPage: currpage
      })
        .then(res => {
          if (res && res.data && res.data.code === 200) {
            clearInterval(timer);
            timer = null;
            this.isValidating = false;
            this.tableData = res.data.data.list
            this.total = res.data.data.totalCount
            this.$Modal.remove();
            this.isNoError = res.data.data.list.length === 0;
          } else if (res && res.data && res.data.code === 500) {
            this.$Message.error("校验失败");
            clearInterval(timer);
            timer = null;
            this.isValidating = false;
            this.$Modal.remove();
          } else {
            // todo
          }
        })
        .catch(err => {
          clearInterval(timer);
          timer = null;
          this.isValidating = false;
          this.$Modal.remove();
          console.log(err.data.msg);
        });
    },
    beforeUpHandle(file) {
      if (this.format.indexOf(file.name.split(".")[1]) > -1) {
        this.uploadListArr.push(file);
      } else {
        this.$Message.error({
          content: "上传格式错误！",
          duration: 3
        });
      }
      return false;
    },
    importSuccess() {},
    importFiled() {},
    handleFormatFiled() {
      this.$Message.error({
        content: "上传格式错误！",
        duration: 2
      });
    },
    handleMaxSize() {
      let size = this.maxSize / 1024;
      this.$Message.error(`上传压缩文件最大只能是${size}M`);
    },
    resetPage() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      this.current = 1;
      this.total = 0;
      this.tableData = [];
      this.isNoError = false;
      this.uploadListArr.splice(0, this.uploadListArr.length);
    },
    handleRemove(file) {
      this.uploadListArr.splice(this.uploadListArr.indexOf(file), 1);
    }
  }
};
</script>

<style lang="less" scoped>
.template-col {
  padding: 20px;
  .download-btn {
    display: inline-block;
    width: 150px;
    height: 36px;
  }
  .upload-btn {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .validate-btn {
    width: 80px;
    height: 36px;
  }
}
.file-box {
  display: inline-block;
  width: 150px;
}
.upload-list {
  display: flex;
  height: 40px;
  // border-bottom:1px dashed #666 ;
  margin-bottom: 20px;
  padding: 5px;
  align-items: center;
  line-height: 24px;
  .file-name {
    width: 400px;
    font-size: 16px;
  }
  .upload-btn {
    width: 400px;
  }
  .upload-option-list {
    width: 200px;
  }
  .delay-table {
    width: 70%;
  }
}
</style>
