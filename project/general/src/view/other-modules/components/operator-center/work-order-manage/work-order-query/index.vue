<template>
  <div class="insurance-info">
    <!-- <Cascader :data="[]" filterable></Cascader> -->
    <searchList
      ref="searchList"
      :inputList="inputList"
      :spreadStatus="true"
      :selectNumber="4"
      :showNumber="7"
      @cascade-change="handleCascadeChange"
      @on-change="changetype"
      @on-search="searchData"
      @on-reset="resetData"
      @loadData="loadData"
    >
    </searchList>
    <div class="action">
      <!-- <a href="/#/work-order-manage/work-order-detail">详情</a> -->
      <Button type="default" @click="handleSelector">自定义显示列</Button>
      <Button type="primary" @click="openAdd">新建工单</Button>
      <Button
        v-hasAuth="'work-order-remove'"
        type="primary"
        @click="() => delData(null, true)"
      >批量删除</Button>
      <Button type="primary" @click="exportData">数据导出</Button>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['xlsx', 'xls']"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="action"
        :headers="headers"
      >
        <Button type="primary">数据导入</Button>
      </Upload>
      <Button type="primary" @click="downloadTemplate">模板下载</Button>
      <Button
        v-hasAuth="'work-order-assign'"
        type="primary"
        @click="handleAssign"
      >工单指派</Button>
      <Button
        v-hasAuth="'work-order-assign-log'"
        type="primary"
        @click="handleAssignLog"
      >指派记录</Button>
    </div>
    <VTable
      isLoading
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columnFields"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="selectingRow"
    >
    </VTable>
    <Modal v-model="isShowSelector" title="自定义列表" :width="1200">
      <ColumnSelector
        v-if="isShowSelector"
        ref="columnSelector"
        :totalColumn="totalColumnFields"
        :searchType="searchData.type"
        @takeFun="dealSeleted"
      ></ColumnSelector>
      <div slot="footer">
        <Button type="default" @click="isShowSelector = false">取消</Button>
        <Button class="blue" @click="handleSaveInLocal">设置为默认展示</Button>
        <Button type="primary" @click="handleComfirm">确定</Button>
      </div>
    </Modal>
    <Modal
      ref="modal-assign"
      v-model="showModalAssign"
      title="工单指派"
      :width="800"
      :mask-closable="false"
      :loading="okAssignLoading"
      @on-ok="onOkAssign"
    >
      <Form
        ref="form-assign"
        :model="formAssign"
        :rules="formRuleAssign"
        :label-width="120"
      >
        <FormItem :label="usersLabel" prop="users">
          <Select
            v-model="formAssign.users"
            clearable
            filterable
            multiple
            style="width: 200px"
          >
            <Option
              v-for="(item, index) in userList"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <add ref="add" @reload="getTableData" />
  </div>
</template>
<script>
import searchList from "_a/search-list/search-list.vue";
import { queryDriverTypeList } from "_o/api/task-manager";
import { queryAllJudgeType } from "_o/api/work-order/work-order-config";
import woType from "../mixins/woType.js";
import {
  inputList,
  tableColumns,
  driverColumn,
  woCategoryList,
  formRuleAssign,
  reassignMap,
} from "./fields";
import {
  ordersSearch,
  getAgentList,
  getOpenAreaAll,
  fetchNextFlowUsers,
  getOrderSource,
  getBizState
} from "_o/api/work-order/common.js";
import {
  exportworkOrderData,
  delWorkOrder,
  pullReassign
} from "_o/api/work-order/dashboard.js";
import { fetchViolationTpyes } from "_o/api/work-order/wo-detail.js";
import { fetchCityList } from "_o/api/work-order/work-order-config";
import Add from "./add";
import ColumnSelector from "./components/columnSelector";
import ExportFile from "./components/exportFile";
import fileDownload from "js-file-download";
import config from "@/config/config";
import { getToken } from "@/libs/util.js";
import { mapState } from "vuex";
export default {
  name: "work-order-query",
  components: { searchList, ColumnSelector, ExportFile, Add },
  mixins: [woType],
  data() {
    return {
      driverTypeList: [],
      runStateLabelMap:{},
      // 深拷贝用于页面关闭后不缓存数据
      inputList: JSON.parse(JSON.stringify(inputList)),
      searchParams: {},
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: tableColumns(this),
      tableData: [],
      searchCityUuid: "",
      isShowSelector: false,
      columnFields: driverColumn(this),
      detail: false,
      totalColumnFields: [],
      add: false,
      downUrl: "/m2-manager-web/api/data/center/driverOperationReportDownload", // 下载api
      exportParams: {
        // 导出参数
        operationType: 2,
        businessId: 4,
        type: 1,
        // startDate: this.searchData.startDate,
        // endDate: this.searchData.endDate,
        excelHeaderListStr: "",
        uuidList: ""
      },
      isDisabled: false,
      selectRow: [],
      action: `${
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro
      }/partner-workorder-web/manage/order/yy/excel/import`,
      headers: {
        Authorization: getToken(),
        ...config.headers
      },
      showModalAssign: false,
      formAssign: {},
      formRuleAssign: formRuleAssign(this),
      userList: [],
      usersLabel: "",
      // 司机类型
      dirverTypeList: [],
      okAssignLoading: false,
    };
  },
  created() {
    this.inputList[6].dropList = this.businessGradeList;
    this.inputList[7].dropList = this.bizTypeList;
  },
  mounted() {
    this.init();
  },
  activated() {},
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList,
      bizTypeList: state => state.common.bizTypeList
    })
  },
  watch: {
    showModalAssign(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs["form-assign"].resetFields();
        });
      }
    },
    businessGradeList(val) {
      this.inputList[6].dropList = val;
    },
    bizTypeList(val) {
      this.inputList[7].dropList = val;
    }
  },
  methods: {
    init() {
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.fetchOptions();
      this.getTableData({ startTime: this.$moment().subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"), endTime: this.$moment().format("YYYY-MM-DD HH:mm:ss") });
      this.queryDriverTypeList();
      this.loadData(null, () => {}, true);
    },
    async fetchOptions() {
      this.queryOptions()
      const [
        {
          data: { data: agentList }
        },
        // {
        //   data: { data: openAreaList }
        // },
        {
          data: { data: orderSourceList }
        },
        {
          data: { data: BizStateList }
        }
      ] = await Promise.all([getAgentList(), getOrderSource(), getBizState({ appId: "520315b4d7524001a27a3bde5d052c51" })]);
      const agentInput = this.inputList.find(item => item.bind_key === "agentId");
      agentInput.dropList = agentList;
      // const cityInput = this.inputList.find(
      //   item => item.bind_key === "cityCode"
      // );
      // cityInput.dropList = openAreaList;
      const orderSourceInput = this.inputList.find(item => item.bind_key === "orderSource");
      orderSourceInput.dropList = orderSourceList.map(it => {
        let tempObj = {
          ...it,
          label: it.desc,
          value: it.code
        }
        return tempObj
      });
      const BizStateInput = this.inputList.find(item => item.bind_key === "bizState");
      BizStateInput.dropList = BizStateList.map(it => {
        let temObj = {
          ...it,
          label: it.desc,
          value: it.code
        }
        return temObj
      })

      let resultMap = {}
      for (let item of BizStateList) {
        resultMap[item.code] = item.desc
      }
      this.runStateLabelMap = resultMap
    },
    async queryOptions() {
      let param = {
        bizTypes: [1, 2, 4, 6, 7]
      }
      const { data: { success, data }} = await fetchCityList(param);
      if (success) {
        this.cityList = data.map(it => {
          return {
            label: it.cityName,
            value: it.cityCode
          }
        });
        const idx = this.inputList.findIndex(input => input.bind_key === "cityCode")
        this.inputList[idx].dropList = data.map(it => {
          return {
            label: it.cityName,
            value: it.cityCode
          }
        })
      }
    },
    setSelectorColumns() {
      switch (this.searchData.type) {
        case 1:
          this.totalColumnFields = driverColumn(this);
          break;
        case 2:
          this.totalColumnFields = this.motorcadeColumn;
          break;
        case 3:
          this.totalColumnFields = this.operationColumn;
          break;
        default:
          this.totalColumnFields = driverColumn(this);
          break;
      }
    },
    formatParams(params) {
      const {
        judgeType0,
        judgeType1,
        judgeType2,
        judgeType3,
        startTime,
        endTime,
        finishStartTime,
        finishEndTime,
        ...extParams
      } = params;
      const judgeType = [judgeType0, judgeType1, judgeType2, judgeType3]
        .filter(Boolean)
        .join("/");
      return {
        ...extParams,
        judgeType: judgeType || undefined,
        startTime: startTime
          ? this.$moment(startTime).format("YYYY-MM-DD HH:mm:ss")
          : startTime,
        endTime: endTime
          ? this.$moment(endTime).format("YYYY-MM-DD HH:mm:ss")
          : endTime,
        finishStartTime: finishStartTime
          ? this.$moment(finishStartTime).format("YYYY-MM-DD HH:mm:ss")
          : finishStartTime,
        finishEndTime: finishEndTime
          ? this.$moment(finishEndTime).format("YYYY-MM-DD HH:mm:ss")
          : finishEndTime
      };
    },
    searchData(params) {
      if (Math.abs(this.$moment(params.startTime).diff(this.$moment(params.endTime), "days")) > 30) {
        this.$store.commit("changeLoadingFlag", false);
        return this.$Message.error({ content: "创建时间仅限间隔31天内" });
      }
      const reqParams = this.formatParams(params);
      this.current = 1;
      this.searchParams = reqParams;
      this.getTableData(reqParams);
    },
    resetData() {
      this.current = 1;
      this.inputList[7].dropList = this.businessGradeList;
      this.searchParams = {};
      this.getTableData();
    },
    handleSaveInLocal() {
      this.$refs["columnSelector"].comfirmMethod();
      this.$refs["columnSelector"].saveInCache();
      this.isShowSelector = false;
      setTimeout(() => {
        this.getLocalColumns();
      }, 500);
    },
    handleComfirm() {
      this.$refs["columnSelector"].comfirmMethod();
      this.isShowSelector = false;
    },
    getTableData(params = this.searchParams) {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let conf2 = Object.assign(conf, params);
      ordersSearch(conf2).then(res => {
        // 关闭表格loading
        this.$store.commit("changeLoadingFlag", false);
        let data = res.data.data.list;
        this.tableData = data;
        this.total = res.data.data.totalCount;
      });
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    selectingRow(items) {
      this.selectRow = items;
    },

    handleCascadeChange(value, selectedData, item) {
      console.log(value, selectedData, item);
      if (item.bind_key[0] === "categoryFirst") {
        // 工单分类
        this.handleWoCategoryChange(value);
      }
    },
    changetype(val, val1) {
      if (val1 === "expandBizLine") {
        this.inputList[7].dropList =
          (this.businessGradeList.find(it => it.value === val) || {})
            .children || [];
      }
    },
    async handleWoCategoryChange(value) {
      if (value.length < 2) {
        return (this.inputList[2].cascaderList = []);
      }
      // 搜索判责类型.flat()用于将嵌套的数组“拉平”，变成一维数组。该方法返回一个新数组，对原数据没有影响。
      const list = woCategoryList.map(item => item.children).flat();
      let woObj = list.find(item => item.value === value[1]);
      const res = await queryAllJudgeType({
        woType: woObj.type === "GD" ? "SFGD" : woObj.type,
        woWay: "1"
      });
      if (res.status === 200) {
        this.inputList[2].cascaderList = this.handelListData(res.data.data.list);
        // console.log(this.inputList[2].cascaderList)
      }
    },
    handelListData(list) {
      let tmp = list.map(it => {
        let tempObj = {
          ...it,
          label: it.judgeName,
          value: it.id
        };
        if (it.children.length) {
          tempObj.children = this.handelListData(it.children);
        }
        return tempObj;
      });
      return tmp;
    },

    handleSelector() {
      this.isShowSelector = true;
    },
    // 处理已选
    dealSeleted(data) {
      this.columnFields = [{ type: "selection", width: 60, align: "center" }];
      if (this.columnFields && data.length) {
        this.columnFields.push(...data);
        let arr = [];
        this.getColumnKeys();
      }
    },
    // 获取表头
    getColumnKeys() {
      if (this.columnFields) {
        let str = "";
        let arr = [];
        this.columnFields.map(item => {
          if (item.type !== "selection") {
            arr.push(item.key);
          }
        });
        str = arr.join(",");
        this.exportParams.excelHeaderListStr = str;
      }
    },
    openAdd() {
      this.$refs.add.init({
        flag: "add"
      });
    },

    async exportData() {
      const searchParams = this.$refs.searchList.getSearchData();
      const reqParams = this.formatParams(searchParams);
      const { selectRow = [] } = this;
      const batchExport =
        Object.keys(reqParams).every(k => !reqParams[k]) &&
        selectRow.length === 0;
      try {
        await exportworkOrderData({
          batchExport,
          codeList: selectRow.map(item => item.woCode),
          ...(selectRow.length === 0 ? reqParams : {})
        });
      } catch (res) {
        if (res.data.type.match("json")) {
          const jsonStr = await res.data.text();
          return this.$Message.error(JSON.parse(jsonStr).msg)
        }
        const head = res.headers["content-disposition"];
        if (head) {
          let name;
          if (head.split(";")[1]) {
            name = head.split(";")[1].split("=")[1];
          }
          fileDownload(res.data, decodeURIComponent(name));
          this.$Message.success("成功");
        } else {
          this.$Message.error("无可导出内容!");
        }
      }
    },

    downloadTemplate() {
      window.open("./excel/evaluation-text-template.xlsx");
    },

    handleSuccess(res, file) {
      this.$Message.info(res.msg);
    },
    handleFormatError(file) {
      this.$Message.error("格式错误");
    },
    handleMaxSize(file) {},
    handleBeforeUpload() {},

    delData(row, batch) {
      let params = {};
      if (batch) {
        const { selectRow } = this;
        if (!selectRow.length) {
          this.$Message.info("请选择工单!");
          return;
        }
        params = {
          flag: 2,
          woCodeList: selectRow.map(item => item.woCode)
        };
      } else {
        const { woCode } = row;
        params = {
          flag: 1,
          woCode
        };
      }
      this.$Modal.confirm({
        title: "确定删除数据吗，删除后将无法恢复？",
        onOk: async () => {
          try {
            const {
              data: { success }
            } = await delWorkOrder(params);
            if (success) {
              this.$Message.success("成功");
              this.getTableData();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    async queryuserList(params) {
      try {
        const {
          data: { success, data }
        } = await fetchNextFlowUsers(params);
        if (success) {
          this.userList = data.map(item => ({
            label: `${item.userName} ${item.userPhone}`,
            value: item.userId,
            userName: item.userName
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleAssign() {
      const { selectRow } = this;
      if (selectRow.length) {
        const { bizState, woType } = selectRow[0];
        const isEqual = selectRow.every(item => item.bizState === bizState && item.woType === woType);
        if (!isEqual) {
          this.$Message.warning("请选择相同类型和状态的工单");
          return;
        }
        const item = reassignMap.find(item => item.value === bizState);
        if (item) {
          this.usersLabel = `${item.label}人员：`;
        } else {
          this.$Message.warning("工单当前状态不可指派");
          return;
        }
        this.queryuserList({ woType, bizState });
        this.showModalAssign = !this.showModalAssign;
      } else {
        this.$Message.warning("请选择工单");
      }
    },

    async onOkAssign() {
      this.showModalAssign = true;
      this.$refs["modal-assign"].visible = true;
      try {
        const res = await this.$refs["form-assign"].validate();
        if (res && !this.okAssignLoading) {
          this.okAssignLoading = true;
          const {
            selectRow,
            formAssign: { users }
          } = this;
          const params = {
            woCodeList: selectRow.map(item => item.woCode),
            userList: this.userList
              .filter(item => users.indexOf(item.value) > -1)
              .map(item => ({
                userId: item.value,
                username: item.userName
              }))
          };
          const {
            data: { success }
          } = await pullReassign(params);
          if (success) {
            this.$Message.success("成功");
            this.selectRow = [];
            this.showModalAssign = false;
            this.getTableData();
          }
        }
        setTimeout(() => {
          this.okAssignLoading = false;
        }, 500);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          this.okAssignLoading = false;
        }, 500);
      }
    },

    handleAssignLog() {
      this.$router.push({ name: "work-order-assigin-log" });
    },

    // 获取司机类型
    async queryDriverTypeList() {
      const {
        data: { success, data }
      } = await queryDriverTypeList();
      if (success) {
        const target = this.inputList.find(item => item.bind_key === "driverTypes");
        this.driverTypeList = data;
        target.dropList = data.map(item => {
          return {
            value: item.driverType.toString(),
            label: item.driverTypeDesc
          };
        });
      }
    },
  }
};
</script>
<style lang="less">
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.ivu-upload {
  display: inline-block;
  vertical-align: bottom;
}
.ivu-upload-drag,
.ivu-upload-drag:hover {
  border: none;
}

.action {
  margin: 0 0 15px;
}
</style>
