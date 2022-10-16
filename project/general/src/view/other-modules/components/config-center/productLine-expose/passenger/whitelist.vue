<!--白名单管理-->
<template>
  <div class="whitelist">
    <div
      class="header"
      style="font-size:14px;color:black;margin-left: 32px;margin-bottom:16px;"
    >
      <span>{{ businessName || "" }}</span>
    </div>
    <div
      class="whitelist-header"
      style="font-size:16px;color:black;margin-left: 32px;"
    >
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
    </div>

    <div
      class="operation"
      style="font-size:16px;color:black;margin-left: 32px;"
    >
      <!-- v-hasAuth="'product_whitelist-addNew'" -->
      <Button type="primary" @click="addNew">新增手机号</Button>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <!-- v-hasAuth="'product_whitelist-batchImport'" -->
      <Upload
        ref="upload"
        :data="uploadData"
        accept=".xlsx,.xls"
        :headers="uploadHeaders"
        :show-upload-list="false"
        :default-file-list="[]"
        :on-success="
          (res, file, fileList) => handleSuccess(res, file, fileList)
        "
        :format="['xlsx', 'xls']"
        :max-size="4096"
        :on-format-error="(file, fileList) => handleFormatError(file, fileList)"
        :on-exceeded-size="(file, fileList) => handleMaxSize(file, fileList)"
        :on-error="
          (error, file, fileList) => handleUploadError(error, file, fileList)
        "
        :before-upload="handleBeforeUpload"
        :action="actionUrl"
        style="display: inline-block;margin-right:20px"
      >
        <Button type="primary">批量导入</Button>
      </Upload>
      <export-file
        :isDisabled="isExportBtn"
        baseUrlKey="_baseUrl4CommonWeb"
        exportUrl="/api/common/business/batchExportWhiteExcel"
        exportFileName="白名单列表.xlsx"
        :queryData="searchData"
        btnText="批量导出"
        :disabled="!total || total===0"
      ></export-file>
      <ExportFile
        exportUrl="/download/business_white_tmpl.xlsx"
        exportFileName="手机号模板.xlsx"
        :queryData="{}"
        baseUrlKey="_baseUrl4CommonWeb"
        btnText="下载模板"
        ajaxMethod="get"
        style="color: #2d8cf0;background-color: #fff;border: none;font-size:13px;margin-left: 16px;text-decoration: underline;"
      >
      </ExportFile>
    </div>
    <div class="whitelist-content">
      <VTable
        :total="total"
        :current="currPage"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
        style="margin-top: 25px;"
      ></VTable>
      <!-- 编辑露出策略列表 -->
      <PhonePop
        v-if="isPop"
        :floatParams="floatParams"
        :type="updateType"
        :title="title"
        :popView="isPop"
        @on-confirm="confirm"
        :width="720"
        class="phone_pop_wrap"
      ></PhonePop>
    </div>
  </div>
</template>

<script>
import { returnFields, inputList } from "./whitelist";
import SearchList from "_a/search-list/search-list";
import VTable from "_a/v-table/v-table";
import PhonePop from "./phonePop";
import ExportFile from '_a/export-file/exportFile';
import {
  getProductWhitelist,
  batchImportApi,
  removeUserApi
} from "_o/api/configData.js";
import { getToken } from "@/libs/util.js";
import config from "@/config/config"; // 为引入的配置文件
const headersObject = config.headers; // 取出headers对象

export default {
  components: {
    VTable,
    PhonePop,
    SearchList,
    ExportFile
  },
  data() {
    const {
      businessType,
      businessName: bsName,
      productLine
    } = this.$route.query;
    const newBusinessName = decodeURI(bsName);

    return {
      ...returnFields(this),
      uploadData: {
        businessType,
        productLine
      },
      uploadHeaders: {
        Authorization: getToken(),
        ...headersObject
      },
      actionUrl:
        this._baseUrl4CommonWeb + "/api/common/business/batchUploadWhiteExcel",
      title: "新增手机号",
      businessName: newBusinessName,
      updateType: "add",
      tableData: [],
      isPop: false,
      isLoading: false,
      pageSize: 10,
      currPage: 1,
      inputList: JSON.parse(JSON.stringify(inputList)),
      // 编辑时的数据
      floatParams: {},
      searchListParams: {},
      batchFile: null,
      uploadList: "",
      businessType,
      productLine,
      isExportBtn: false,
      searchData: {}
    };
  },
  mounted() {
    this.getTableList();
    this.uploadList = this.$refs.upload && this.$refs.upload.fileList;
  },
  methods: {
    // 新增手机号
    addNew() {
      this.isPop = true;
      this.updateType = "add";
      this.title = "新增手机号";
      this.floatParams = {
        phoneList: [
          {
            phone: ""
          }
        ],
        businessName: this.businessName,
        businessType: this.businessType,
        productLine: this.productLine
      };
    },
    // 批量导入
    batchImport() {
      batchImportApi({
        file: this.batchFile,
        businessType: this.businessType
      })
        .then(res => {
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleSuccess(type, res, file, fileList) {
      // eslint-disable-next-line
      console.log("upload file success", res.response);
      const resData = res.response && res.response.data;
      if (res && res.response && res.response.data && res.response.success) {
        // this.$Message.success('批量导入手机号成功')
        this.$Message.success({
          content: `合计数据${resData.totalCount ||
            0}条，导入成功${resData.successCount ||
            0}条，失败${resData.failCount || 0}条，重复${resData.repeatCount ||
            0}条`,
          duration: 4
        });
        this.getTableList();
      }
    },
    handleFormatError(type, file, fileList) {
      this.$Notice.warning({
        title: "格式不正确",
        desc: `格式不正确`
      });
    },
    handleMaxSize(type, file, fileList) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 4M."
      });
    },
    handleUploadError(error, file, fileList) {
      console.log(error);
      this.$Notice.warning({
        title: "批量导入失败",
        desc: "批量导入失败"
      });
    },
    handleBeforeUpload(type) {
      if (this.uploadList) {
        const check = this.uploadList.length < 2;
        if (!check) {
          this.$Notice.warning({
            title: "不能上传超过两份文件"
          });
        }
        return check;
      }
      return true;
    },
    search(data) {
      this.currPage = 1;
      this.searchListParams = { ...data };
      this.getTableList();
    },
    reset(data) {
      this.currPage = 1;
      this.searchListParams = {};
      this.getTableList();
    },
    getTableList() {
      this.isLoading = true;
      let params = {
        ...this.searchListParams,
        businessType: this.businessType,
        productLine: this.productLine
      };
      // 获取表格数据
      params.pageSize = this.pageSize;
      params.currPage = this.currPage;
      this.searchData = params;
      getProductWhitelist(params)
        .then(res => {
          this.tableData = (res.data.data && res.data.data.list) || [];
          this.total = (res.data.data && res.data.data.totalCount) || 0;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    confirm(flag) {
      if (flag) this.getTableList();
      this.isPop = false;
    },
    selectObj(val) {
      this.currPage = val;
      this.getTableList();
    },
    changePage(val) {
      this.currPage = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 移除白名单
    removeUser(row) {
      const { id } = row;
      const params = {
        id,
        businessType: this.businessType,
        productLine: this.productLine
      };
      this.$Modal.confirm({
        title: "确认移除用户？",
        onOk: () => {
          removeUserApi(params).then(res => {
            if (res.data && res.data.success) {
              this.$Message.success("移除成功！");
              this.getTableList();
            } else {
              this.$Message.warning("移除失败！");
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.whitelist-header {
  margin-top: 10px;
}
.whitelist-content {
  width: 95%;
  margin: 0 auto;
}
.phone_pop_wrap {
  display: block;
  /deep/ .level_container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    .left {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
    }
    .right {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      margin-left: -15px;
      .delete_icon {
        cursor: pointer;
        /deep/ .ivu-icon {
          margin-bottom: 20px;
          margin-right: -10px;
          font-size: 20px;
          color: red;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
