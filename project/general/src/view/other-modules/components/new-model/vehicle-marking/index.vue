<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></SearchList>
    <div>
      <span style="line-height: 30px;">
        本页面数据仅供新模式验证车辆打标使用
      </span>
      <Button
        v-hasAuth="'vehicle-marking-import'"
        type="primary"
        style="float: right"
        @click="openNew"
      >
        导入数据
      </Button>
    </div>
    <VTable
      :total="total"
      :current="currPage"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      class="top15"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <Modal
      v-model="isModal"
      :width="600"
      :mask-closable="false"
      :title="modalTitle"
    >
      <div style="text-align:center">
        <div v-if="true">
          <Alert
            type="warning"
            :style="{color: error === true ? 'red' : ''}"
          >
            {{ importMessage }}
          </Alert>
          <div class="down-container">
            <download-btn
              :toUrl="toDownTemplateUrl"
              baseUrlName="_baseUrlCommon"
              style="display: inline-block;width:150px;"
            ></download-btn>
            <Upload
              ref="importFile"
              multiple
              :data="parameter"
              type="drag"
              :action="importFileUrl_"
              class="file-box"
              :headers="header"
              :before-upload="beforeUpHandle"
              :show-upload-list="false"
              :on-success="importSuccess"
              :on-error="importFiled"
              :format="['xlsx']"
              accept=".xlsx"
              :on-format-error="formatError"
            >
              <div style="padding: 20px 0">
                <Icon
                  type="ios-cloud-upload"
                  size="52"
                  style="color: #3399ff"
                ></Icon>
                <p>点击(拖拽)上传文件</p>
              </div>
              <Progress
                v-show="isShowUpBar"
                :percent="upPercent"
              />
            </Upload>
          </div>
        </div>
        <!-- <div
          v-if="tables"
          class="indetail"
        >
          <p
            v-if="message.failMsg"
            :style="{color: 'red', 'margin-bottom': '8px', 'margin-top': '24px'}"
          >
            {{ message.failMsg }}
          </p>
          <p>
            导入总数{{ message.uploadNum }}, 成功:{{ message.successNum }}条，失败:{{ message.failNum }}条（失败的信息默认不导入）
          </p>
          <p v-if="message.canDownloadFail">
            错误及重复信息汇总
          </p>
          <div
            v-if="message.canDownloadFail"
            style="text-align:center"
          >
            <ExportFile
              exportUrl="/admin/driverGroupMember/exportFail"
              exportFileName="错误信息.xlsx"
              :queryData="importFailData"
              :btnText="deriveText"
            ></ExportFile>
          </div>
        </div> -->
      </div>
      <div slot="footer">
        <Button
          type="text"
          style="margin-left: 8px"
          size="large"
          @click="isModal = false"
        >
          取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="addSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getToken } from "@/libs/util.js";
import { returnFields, inputList } from "./fields.js";
import VTable from "_a/v-table/v-table";
// import ExportFile from "_a/export-file/exportFile";
import downloadBtn from "_a/download-btn/index.vue";
import { getCarrierList } from "_o/api/operator-carrier";
import { vehicleMarkingList, vehicleMarkingCancel } from "_o/api/operationAdmin";
import { cpTranslate } from "@/libs/tools";
import { getAppointedProvinceCityInAuth } from "_g/api/common.js";
// import { columns } from "../../carrier-management/carrier/operation/basic/basic-info";

export default {
  components: {
    VTable,
    // ExportFile,
    downloadBtn
  },
  data() {
    return {
      // deriveText: "下载错误信息",
      modalTitle: "导入数据",
      isModal: false, // 弹出框
      inputList,
      returnFields,
      queryAjaxPramas: {},
      total: 0, // 分页数据总数
      currPage: 1, // 页数
      pageSize: 10, // 条数
      // editorModal: false, // 是否为编辑，否则为新建
      parColumns: [], // 表格的配置
      importTables: false, // 导入
      tables: false, // 导入结果详情
      // importFailData: {}, // 导入失败结果详情数据
      importMessage: "新模式验证车辆打标或取消打标",
      parameter: {}, // 导入时附带的uuid参数
      // message: {
      //   uploadNum: 0,
      //   successNum: 0,
      //   failNum: 0,
      //   // canDownloadFail: false,
      //   failMsg: ""
      // },
      tableData: [],
      upPercent: 0,
      header: { Authorization: getToken() },
      isShowUpBar: false,
      importFileUrl_: this._baseUrlCommon + "/operation-admin-api/admin/vehicle/import", // 导入路径地址
      toDownTemplateUrl: "/operation-admin-api/download/vehicle_marking.xlsx", // 导入下载模板路径
      error: false,
    };
  },
  watch: {
    "inputList": {
      handler(newVal) {
        // console.log(newVal);
        const cityValue = newVal[0].value;
        if (JSON.stringify(cityValue) !== this.$options.cityCode) {
          this.getSupplierList(cityValue);
          this.$options.cityCode = JSON.stringify(cityValue);
        }
      },
      deep: true
    }
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
    this.getCityList().then(() => {
      this.getList();
    });
  },
  methods: {
    getCityList() {
      if (sessionStorage.getItem("supplierCityList")) {
        const list = JSON.parse(sessionStorage.getItem("supplierCityList"));
        this.inputList[0].cascaderList = list;
        this.$options.cityList = list;
        return Promise.resolve(true);
      } else {
        let params = {
          areaType: 2, // 已开启城市
          authDimension: 2, // 省市+机构维度
          businessLineList: [1, 2, 4, 6, 7] // 快车、专车、出租车
        };
        return getAppointedProvinceCityInAuth(params).then(res => {
          let list = cpTranslate(res.data.data || []);
          // this.inputList = JSON.parse(JSON.stringify(inputList));
          this.inputList[0].cascaderList = list;
          this.$options.cityList = list;
          sessionStorage.setItem("supplierCityList", JSON.stringify(list));
        });
        // cityList({}).then(res => { //
        //   let list = res.data.data || [];
        //   let params = {
        //     list: list,
        //     labelKey: "provinceName",
        //     valueKey: "provinceCode",
        //     children: "cityDtoList",
        //     sonLableKey: "orgName",
        //     sonValueKey: "orgCode",
        //     isDeep: true,
        //   };
        //   list = cpLabelValue(params);
        //   this.inputList[0].cascaderList = list;
        //   sessionStorage.setItem("supplierCityList", JSON.stringify(list));
        // });
      }
    },
    /* 切换城市更新运营商 */
    getSupplierList(query) {
      this.inputList[1].value = ""; // 重置选中运营商
      if (query && query.length === 2) {
        getCarrierList({
          cityId: query[1],
          currPage: 1,
          pageSize: 999,
          provinceId: query[0],
          _silence: 1, // 不触发store的changeLoadingFlag
        }).then(res => {
          if (res.data.success) {
            this.inputList[1].dropList = (res.data.data.list || []).map(item => ({
              label: item.name,
              value: item.uuid
            }));
          }
        })
      } else {
        this.inputList[1].dropList = [];
      }
    },
    getList() {
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      vehicleMarkingList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.pageSize = res.data.data.pageSize;
        const cityList = this.$options.cityList;
        this.tableData = (res.data.data.list || []).map(item => {
          let cityName = "";
          const cityUuid = item.cityUuid;
          if (cityUuid) {
            cityList.forEach(province => {
              if (!province.children) {
                return false;
              }
              // eslint-disable-next-line
              province.children.forEach(city => {
                if (city.value === cityUuid) {
                  cityName = province.label + city.label;
                }
              });
            });
          }
          item.cityName = cityName;
          return item;
        });
      });
    },
    /** 取消 */
    outOfService(vin) {
      vehicleMarkingCancel({ vin }).then(res => {
        this.$Message.success("取消成功!");
        this.getList();
      });
    },
    /** 新增群组弹出框触发 */
    openNew() {
      // this.modalTitle = "导入数据";
      // this.importMessage = "新模式验证车辆打标或取消打标";
      this.error = false;
      this.isModal = true;
      this.importTables = true;
      this.isShowUpBar = false;
      // this.tables = false;
    },
    queryData(data) {
      this.currPage = 1;
      this.queryAjaxPramas = data;
      this.getList();
    },
    clearQueryData() {
      this.queryAjaxPramas = {};
      this.currPage = 1;
      this.getList();
    },
    changePage: function (val) {
      this.currPage = val;
      this.getList();
    },
    changePageSize: function (val) {
      this.pageSize = val;
      this.getList();
    },
    /** 弹出框 */
    addSubmit(name) {
      // if (this.upPercent === 0) {
      //   this.isModal = true;
      // }
      if (this.importTables) {
        // 导入
        if (this.upPercent === 0) {
          this.isModal = true;
          this.importMessage = "请上传文件";
        } else if (this.upPercent === 100) {
          this.importTables = false;
          this.isModal = false;
        }
      } else {
        this.isModal = false;
      }
    },
    beforeUpHandle(res, file) {
      // this.tables = false;
      this.upPercent = 0;
      this.isShowUpBar = true;
    },
    importSuccess(res, file, fileList) {
      if (res.success) {
        // 导入成功
        let successmsg = res.msg || "导入成功!";
        this.error = false;
        this.importMessage = successmsg;
        // this.importTables = false;
        // this.tables = true;
        // this.message = {
        //   uploadNum: res.data.doUploadExcelNum || 0,
        //   successNum: res.data.successNum || 0,
        //   failNum: res.data.failNum || 0,
        //   // canDownloadFail: res.data.failNum > 0,
        //   failMsg: ""
        // }
        this.getList();
      } else {
        if (res.data === null) {
          this.importMessage = res.msg || "导入失败";
          this.upPercent = 0;
          this.isShowUpBar = false;
          // this.message.canDownloadFail = false
          // this.importTables = true
          // this.editorModal = false;
          // this.tables = false;
          this.error = true
          return false
        }
        // if (res.data === null && res.msg.indexOf("系统异常") > -1) {
        //   this.importMessage = "文件不合法，请下载模板"
        //   this.upPercent = 0;
        //   this.isShowUpBar = false;
        //   // this.message.canDownloadFail = false
        //   this.importTables = true
        //   // this.editorModal = false;
        //   this.tables = false;
        //   this.error = true
        //   return false
        // }
        // // 没有具体错误行数，不能展示下载错误信息按钮
        // if (res.data === null) {
        //   this.upPercent = 0;
        //   this.isShowUpBar = false;
        //   // this.message.canDownloadFail = false
        //   this.importTables = false
        //   // this.editorModal = false;
        //   this.error = false
        //   this.tables = true;
        //   this.message.failMsg = res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg
        //   return false
        // } else {
        //   // 有具体错误行数，优先展示msg，并且可以下载错误信息
        //   this.isShowUpBar = false;
        //   // this.editorModal = false;
        //   this.importTables = false
        //   this.tables = true;
        //   this.error = false
        //   // let ts = (res.data && res.data.failRowTypeMapJsonStr) || ""
        //   // eslint-disable-next-line
        //   // let obj = (new Function("return " + ts))();
        //   // let arr = Object.keys(obj);
        //   // this.importFailData = {
        //   //   "failRowTypeMapJsonStr": ts
        //   // }
        //   this.message = {
        //     uploadNum: res.data.doUploadExcelNum || 0,
        //     successNum: res.data.successNum || 0,
        //     // canDownloadFail: arr.length > 0,
        //     failNum: res.data.failNum || 0,
        //     failMsg: res.msg === "导入失败" ? "导入失败：请下载错误信息查看" : res.msg
        //   }
        //   return false
        // }
      }
      // 用于取消定时器
      this.upPercent = 100;
    },
    importFiled(res, file, fileList) {
      if (!res.success) {
        // 用于取消定时器
        this.upPercent = 0;
        this.isShowUpBar = false;
        let errormsg = res.msg || "服务器错误!";
        this.error = true;
        this.$Notice.error({
          desc: errormsg,
          duration: 10
        });
      }
    },
    formatError(file, fileList) {
      this.$Message.warning("文件格式不正确");
      this.isShowUpBar = false;
    }
  }
};
</script>

<style lang="less" scoped>
.indetail {
  p {
    margin-bottom: 15px;
  }
}
.down-container {
  display: flex;
  align-items: center;
  a {
    width: 150px;
    height: 35px;
    flex: 1;
    margin: 0 10px 0 0;
  }
  .file-box {
    flex: 2;
    margin: 0 10px;
  }
}
</style>
