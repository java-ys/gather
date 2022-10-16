<!--电子围栏管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
      <Button
        v-hasAuth="'externalFee_control-add'"
        type="primary"
        @click="popView"
      >
        新增
      </Button>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        style="margin-top: 25px;"
        @sort="sort"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></VTable>
      <Float
        :floatParams="floatParams"
        :uuid="uuid"
        :cityList="cityList"
        :optList="optList"
        :updateType="updateType"
        :title="title"
        :popView="isPop"
        :invalidEditor="invalidEditor"
        :width="700"
        @on-confirm="confirm"
      ></Float>
    </div>
  </div>
</template>

<script>
import {
  returnFields,
  inputList,
  railTypeMap,
} from "./index";
import { getCarrierList } from "_o/api/operator-carrier";
import { keys } from "@/libs/tools";
import VTable from "_a/v-table/v-table";
import Float from "./float";
import SearchList from "_a/search-list/search-list";
import { getAppointedProvinceCityInAuth } from "_g/api/common.js";
import { cpTranslate, formatCitySingle } from "@/libs/tools";
import {
  surchargePageQuery,
  surchargeDetai,
  updateFenceStatus,
  deleteItem
} from "_o/api/configData.js";
export default {
  components: {
    VTable,
    SearchList,
    Float
  },
  data() {
    return {
      ...returnFields(this),
      title: "新建附加费配置",
      uuid: "",
      updateType: 1, // 1 新建 2 编辑 3 详情
      tableData: [],
      inputList: [],
      cityList: [],
      isPop: false,
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      floatParams: {
        cityDtos: [],
        sameCityHighSpeedFeeBasicPrice: "",
        sameCityHighSpeedFeeEveryMile: "",
        crossCityHighSpeedFeeBasicPrice: "",
        crossCityHighSpeedFeeEveryMile: "",
        otherFeeTimesEveryDay: "",
        otherFeeTotalEveryDay: "",
        otherFeeTotalEveryOrder: "",
        roadBridgeFee: "",
        // othersFee:{
        //   driverOneDayTwice:"",
        //   driverOneDayTotal:"",
        //   singleOrderTotal:""
        // },
        // roadBridgeFee:{
        //   singleOrderTotal:""
        // },
        parkCarFeeEveryHour: "",
        attachments: [],
        remark: ""
      },
      optList:[],
      invalidEditor: false,
      searchListParams: {} // 保存搜索条件参数
    };
  },
  mounted() {
    // console.log("mounted");
    this.getTableList();
    this.getCityListData();
    this.inputList = inputList;
    // console.log(inputList, "inputList");
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      let params = {
        areaType: 1, // 已开启城市
        businessLineList: [1, 2, 4, 6, 7] // 快车、专车，包车，顺风车,企业用车
      };
      getAppointedProvinceCityInAuth(params).then(res => {
        let list = formatCitySingle(res.data.data || []);
        this.inputList[0].dropList = [{ value: "1", label: "全国" }, ...list];
        this.cityList = [...list]; // { value: "1", label: "全国" },
      });
    },
    getTableList() {
      const params = this.searchListParams;
      // 获取表格数据
      params.pageSize = this.pageSize;
      params.currPage = this.current;
      if (params.cityId) params.cityCode = params.cityId;
      if (params.provinceId) params.provinceCode = params.provinceId;
      if (params.serviceType) params.serviceType = Number(params.serviceType);
      delete params.cityId;
      delete params.provinceId;
      surchargePageQuery(params).then(res => {
        this.tableData = (res.data.data && res.data.data.list) || [];
        // 过滤营销围栏
        // this.tableData = this.tableData.filter(item => item.railType === 3)
        this.total = (res.data.data && res.data.data.totalCount) || 0;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    resetForm() {
      this.floatParams = {
        cityDtos: [],
        sameCityHighSpeedFeeBasicPrice: "",
        sameCityHighSpeedFeeEveryMile: "",
        crossCityHighSpeedFeeBasicPrice: "",
        crossCityHighSpeedFeeEveryMile: "",
        otherFeeTimesEveryDay: "",
        otherFeeTotalEveryDay: "",
        otherFeeTotalEveryOrder: "",
        roadBridgeFee: "",
        // othersFee:{
        //   driverOneDayTwice:"",
        //   driverOneDayTotal:"",
        //   singleOrderTotal:""
        // },
        // roadBridgeFee:{
        //   singleOrderTotal:""
        // },
        parkCarFeeEveryHour: "",
        attachments: [],
        remark: "",
        isCopy: false
      };
    },
    popView() {
      this.isPop = true;
      this.title = "新建附加费配置";
      this.floatParams = {
        cityDtos: [],
        sameCityHighSpeedFeeBasicPrice: "",
        sameCityHighSpeedFeeEveryMile: "",
        crossCityHighSpeedFeeBasicPrice: "",
        crossCityHighSpeedFeeEveryMile: "",
        otherFeeTimesEveryDay: "",
        otherFeeTotalEveryDay: "",
        otherFeeTotalEveryOrder: "",
        roadBridgeFee: "",
        parkCarFeeEveryHour: "",
        attachments: [],
        remark: ""
      };
      this.invalidEditor = false;
      this.updateType = 1;
      // const params = {
      //     cityCode:"1"
      // };
      // this.getAllCountryConfig(params)
    },
    getAllCountryConfig(params){
      surchargePageQuery(params).then((res)=>{
        if(res.data.success){
          if(res.data.data.list && res.data.data.list.length){
            const pms = {
              uuid:res.data.data.list[0].uuid
            }
            this.getDetail(pms)
          }
        }
      })
    },
    confirm(data) {
      if (data) this.getTableList();
      this.isPop = false;
    },
    search(data) {
      this.current = 1;
      this.searchListParams = { ...data };
      this.getTableList();
    },
    reset(data) {
      this.current = 1;
      this.searchListParams = {};
      this.getTableList();
    },
    sort() {},
    selectObj(val) {
      this.current = val;
      this.getTableList();
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    rowActive(row) {
      const {  uuid } = row;
      const params = {
        uuid
      };
      updateFenceStatus(params).then(res => {
        if (res.data && res.data.success) {
          this.$Message.success("状态更新成功！");
          this.getTableList();
        } else {
          this.$Message.warning("状态更新失败！");
        }
      });
    },
    getDefaultJson() {
      let newJSON = {
        cityDtos: [],
        sameCityHighSpeedFeeBasicPrice: "",
        sameCityHighSpeedFeeEveryMile: "",
        crossCityHighSpeedFeeBasicPrice: "",
        crossCityHighSpeedFeeEveryMile: "",
        otherFeeTimesEveryDay: "",
        otherFeeTotalEveryDay: "",
        otherFeeTotalEveryOrder: "",
        roadBridgeFee: "",
        parkCarFeeEveryHour: "",
        attachments: [],
        remark: ""
      };
      return JSON.parse(JSON.stringify(newJSON));
    },
    getDetail(params) {
      surchargeDetai(params).then(res => {
        // console.log(res, "res");
        if (res.data.success) {
          const paramData = res.data.data;
          let newJSON = this.getDefaultJson();
          for (let key in newJSON) {
            if (key === "cityDtos") {
              newJSON[key] = [paramData.cityCode];
            }
            if (paramData[key]) newJSON[key] = paramData[key];
          }
          // 复制 不带入城市
          if(this.isCopy) {
            newJSON.cityDtos = []
            this.isCopy = false
          }
          this.isPop = true;
          this.floatParams = newJSON;
        }
      });
    },
    // 删除表格
    deleteItem(params){
      this.$Modal.confirm({
        title: "请再次确认要执行该 删除 操作！",
        onOk: () => {
          deleteItem(params).then(res=>{
            if(res.data.success){
              this.getTableList();
              this.$Message.info("操作成功！");
            }
          })
        },
      });

    },
    copy(row) {
      let { uuid } = row
      this.title = '复制附加费配置'
      this.updateType = 1;
      this.invalidEditor = false;
      this.isPop = true;
      this.uuid = uuid;
      this.isCopy = true
      this.getDetail({ uuid });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
