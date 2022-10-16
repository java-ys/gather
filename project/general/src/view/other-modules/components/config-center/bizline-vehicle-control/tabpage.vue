<!--产品线管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        :resetTxt="'重置'"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
      <Button
        v-hasAuth="'bizline-vehicle-add'"
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
        ref="addForm"
        :params="floatParams"
        :cityUuid="cityUuid"
        :cityList="cityList"
        :type="updateType"
        :title="title"
        :popView="isPop"
        :gradeInfo="businessGradeList"
        :invalidEditor="invalidEditor"
        :width="1000"
        @on-confirm="confirm"
      ></Float>
    </div>
  </div>
</template>

<script>
import { returnFields, inputList, statusData } from "./index";
import { keys, cpTranslate } from "@/libs/tools";
import VTable from "_a/v-table/v-table";
import Float from "./float";
import SearchList from "_a/search-list/search-list";
import {
  getOpencityListData,
  getCitys,
  getAreaInfoByCityCode,
  switchCityStatus
} from "_o/api/configData.js";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    VTable,
    SearchList,
    Float
  },
  data() {
    return {
      ...returnFields(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      title: "新建产品线管理策略",
      cityUuid: "",
      updateType: "",
      tableData: [],
      cityList: [],
      isPop: false,
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      copy: false,
      floatParams: {
        carrierArea: [],
        expandBizLine: "",
        carTypes: [],
        partTimeBizList: [],
        partTimeBizGroupList: []
      },
      status: keys(statusData).map(key => ({
        value: key,
        label: statusData[key]
      })),
      optList: [],
      invalidEditor: false,
      polygonPath: [],
      searchListParams: {}, // 保存搜索条件参数
      currentAreaList: []
    };
  },
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList,
      bizTypeList: state => state.common.bizTypeList
    })
  },
  created() {
    this.getSavedCity();
    this.inputList[1].dropList = this.businessGradeList;
  },
  mounted() {
    let { from, cityCode, provinceCode } = this.$route.params;
    if (from === "opencity") {
      this.inputList[0].value = [provinceCode, cityCode];
      this.searchListParams = { provinceCode, cityCode };
    }
    this.getTableList();
    if (from === "opencity" && sessionStorage.getItem("biz_opened") !== "true") {
      let that = this;
      let paramData = JSON.parse(JSON.stringify(this.$route.params));
      paramData.carrierArea = [paramData.provinceCode, paramData.cityCode];
      paramData.levelType = Number(paramData.levelType);
      paramData.areaCodes = paramData.areaCode.split(",") || [];
      paramData.bizTypeList = JSON.parse(paramData.bizTypeList);
      that.$refs.addForm.changeExpandBizLine(Number(paramData.expandBizLine));
      that.$refs.addForm.queryArea(paramData.cityCode);
      if (paramData.bizTypeList.length || paramData.webGroupVehicleDtoList.length) {
        that.title = "编辑业务线与车型等级关系";
        that.updateType = "edit";
        let originList = paramData.bizTypeList.map(it => {
          let list = it.levels.map(item => {
            return {
              ...item,
              bizType: it.bizType,
              bizTypeName: it.bizTypeName,
              vehicleLevel: `${paramData.expandBizLine}#${it.bizType}#${item.vehicleLevel}`
            }
          })
          return list
        })
        paramData.carTypes = [...originList.flat().filter(it => (!it.partTimeList || !it.partTimeList.length)).map(it => it.vehicleLevel)]
        let PartTimeList = [...originList.flat().filter(it => it.partTimeList && it.partTimeList.length)]
        paramData.partTimeBizList = PartTimeList.map(it => {
          const partTimePickerList = it.partTimeList.map(itt => {
            return {
              value: [itt.split("-")[0], itt.split("-")[1]],
            }
          })
          return {
            ...it,
            partTimePickerList,
            carTypes: [it.vehicleLevel]
          }
        })
        // add车型组
        let webGroupVehicleDtoList  = paramData.webGroupVehicleDtoList
        paramData.partTimeBizGroupList = webGroupVehicleDtoList.map(it => {
          const partTimePickerList = it.partTimeList.map(itt => {
            return {
              value: [itt.split("-")[0], itt.split("-")[1]],
            }
          })
          return {
            ...it,
            partTimePickerList,
          }
        })
        paramData.carGroups = webGroupVehicleDtoList.map(it => it.groupID)
      } else {
        that.title = "新增业务线与车型等级关系";
        that.updateType = "add";
        paramData.carTypes = []
        paramData.partTimeBizList = []
      }
      that.floatParams = paramData;
      that.isPop = true;
      that.invalidEditor = false;
    }
  },
  beforeDestroy() {
    sessionStorage.setItem("biz_opened", "true")
  },
  methods: {
    ...mapActions(["getBusinessGradeProductList"]),
    getSavedCity() {
      getCitys().then(res => {
        let list = cpTranslate(res.data.data);
        this.inputList[0].cascaderList = list;
        this.cityList = list;
      });
    },
    cascadeChange(p) {
      if (p && p.length > 1) {
        this.queryArea(p[1], "1");
      }
    },
    changeCity(p) {
      if (p && p.length > 1) {
        this.queryArea(p[1], "2");
      }
    },
    queryArea(val, type) {
      getAreaInfoByCityCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          const list = res.data.data.map(it => {
            return {
              label: it.orgName,
              value: it.orgCode
            };
          });
          type === "1"
            ? (this.inputList[2].dropList = list)
            : (this.currentAreaList = list);
        }
      });
    },
    getTableList() {
      const params = this.searchListParams;
      // 获取表格数据
      params.pageSize = this.pageSize;
      params.currPage = this.current;
      if (params.cityId) params.cityCode = params.cityId;
      if (params.provinceId) params.provinceCode = params.provinceId;
      if (params.businessType) params.businessType = Number(params.businessType);
      delete params.cityId;
      delete params.provinceId;
      getOpencityListData(params).then(res => {
        this.tableData = (res.data.data && res.data.data.list) || [];
        this.total = (res.data.data && res.data.data.totalCount) || 0;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    popView() {
      this.isPop = true;
      this.title = "新增业务线与车型等级关系";
      this.floatParams = {
        carrierArea: [],
        businessType: "",
        carTypes: []
      };
      this.polygonPath = [];
      this.invalidEditor = false;
      this.updateType = "add";
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
      const { cityCode, areaCode, expandBizLine, levelType } = row;
      const params = {
        cityCode,
        areaCode,
        expandBizLine,
        levelType,
        openStatus: 1
      };
      this.$Modal.confirm({
        title: "确认启用",
        content: "确认启用该车型等级？",
        onOk: () => {
          switchCityStatus(params).then(res => {
            if (res.data && res.data.success) {
              this.$Message.success("启用成功！");
              this.getTableList();
            } else {
              this.$Message.warning(`${res.data.msg}`);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
