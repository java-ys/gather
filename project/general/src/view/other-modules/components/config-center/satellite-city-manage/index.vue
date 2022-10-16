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
        v-hasAuth="'satellite-city-manage-add'"
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
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></VTable>
      <Float
        :floatParams="floatParams"
        :uuid="uuid"
        :cityList="cityList"
        :title="title"
        :popView="isPop"
        :isEdit="isEdit"
        @on-confirm="confirm"
      ></Float>
    </div>
  </div>
</template>

<script>
import {
  returnFields,
  inputList,
} from "./index";
import VTable from "_a/v-table/v-table";
import Float from "./float";
import SearchList from "_a/search-list/search-list";
import { getCitys } from "_o/api/configData.js";
import { cpTranslate } from "@/libs/tools";
import {
  querySatellite,
  deleteSatellite,
  changeSatelliteStatus,
} from "_o/api/satelliteCity.js"; 
export default {
  components: {
    VTable,
    SearchList,
    Float
  },
  data() {
    return {
      ...returnFields(this),
      title: "开通城市",
      uuid: "",
      tableData: [],
      inputList: [],
      cityList: [],
      isPop: false,
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      copy: false,
      floatParams: {
        provinceParentCode: '',
        parentCode:'',
        cityCode:'',
        provinceCityCode:'',
      },
      isEdit: false,
      polygonPath: [],
      searchListParams: {} // 保存搜索条件参数
    };
  },
  mounted() {
    console.log("mounted");
    this.getTableList();
    this.getCityListData();
    this.inputList = inputList;
    console.log(inputList, "inputList");
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      getCitys().then(res => {
        let list = cpTranslate(res.data.data);
        this.inputList[0].cascaderList = list;
        this.cityList = list;
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
      querySatellite(params).then(res => {
        this.tableData = (res.data.data && res.data.data.list) || [];
        // 过滤营销围栏
        // this.tableData = this.tableData.filter(item => item.railType === 3)
        this.total = (res.data.data && res.data.data.totalCount) || 0;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    popView() {
      this.isPop = true;
      this.title = "新增卫星城关系";
      this.isEdit = false;
    },
    confirm(data) {
      this.floatParams = {
        provinceParentCode: '',
        parentCode:'',
        cityCode:'',
        provinceCityCode:'',
      }
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
        uuid,
        cityStatus:row.cityStatus===0?1:0
      };
      changeSatelliteStatus(params).then(res => {
        if (res.data && res.data.success) {
          this.$Message.success("状态更新成功！");
          this.getTableList();
        } else {
          this.$Message.warning("状态更新失败！");
        }
      });
    },
    // 删除表格
    deleteItem(paramData){
      this.$Modal.confirm({
        title: "请再次确认要执行该 删除 操作！",
        onOk: () => {
          deleteSatellite({uuid:paramData.uuid}).then(res=>{
            if(res.data.success){
              this.getTableList();
              this.$Message.info("操作成功！");
            }
          })
        },
      });
    },
    // 
    edit(paramData){
      this.isEdit = true;
      this.uuid = paramData.uuid;
      //根据城市code获取省code
      let provinceCityCode = this.getProvinceCode(paramData.cityCode)
      let provinceParentCode = this.getProvinceCode(paramData.parentCode)
      this.isPop = true;
      this.$nextTick(()=>{
        this.floatParams = {
          provinceCityCode:provinceCityCode,
          provinceParentCode:provinceParentCode,
          cityCode:paramData.cityCode,
          parentCode:paramData.parentCode 
        };
      })
    },
    getProvinceCode(cityCode){
      let provinceCode = ''
      this.cityList.forEach(item1=>{
        item1.citys.forEach(item2=>{
          if(item2.cityID===cityCode){
            provinceCode=item1.provinceID
          }
        })
      })
      console.log('provinceCode',provinceCode)
      return provinceCode
    }
  }
};
</script>
