<!--电子围栏管理-->
<template>
  <div class="carrier">
    <p>
      Tips：该页面用以展示和配置选中城市的围栏，请先选择城市。围栏可视化查询条件同列表查询，亦可按Esc
      按键快速关闭可视化页面。
    </p>
    <div class="carrier-header">
      <span class="requireSpan">*</span>
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @on-change="selectChange"
      />
      <!-- 电子围栏可视化  -->
      <Button
        v-hasAuth="'elecfence_manage-view'"
        type="primary"
        :loading="viewMapLoading"
        @click="popViewMap"
      >
        围栏可视化
      </Button>

      <Button
        v-hasAuth="'elecfence_control-add'"
        type="primary"
        @click="popView"
      >
        新建电子围栏
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
        style="margin-top: 25px"
        @sort="sort"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />
      <FenceMap
        ref="fenceMap"
        :polygonPath="polygonPath"
        :uuid="uuid"
        :cityList="cityList"
        :optList="bizTypeList"
        :invalidEditor="invalidEditor"
        :fenceStatusList="status"
        :provinceCityCodeMap="provinceCityCodeMap"
        @over-load="overLoad"
        @on-success="saveSuccess"
      />
    </div>
  </div>
</template>

<script>
import {
  returnFields,
  inputList,
  railTypeList,
  statusData,
  serviceTypeData,
  arrRailList,
} from "./index";
import { keys } from "@/libs/tools";
import { timeFormat } from "@/libs/util";
import VTable from "_a/v-table/v-table";
import FenceMap from "./fenceMap";
import SearchList from "_a/search-list/search-list";
import { cpTranslate } from "@/libs/tools";
import { mapGetters, mapState } from "vuex";
import {
  citySelectPen,
  updateFenceStatus,
  getCitys,
} from "_o/api/configData.js";
export default {
  components: {
    VTable,
    SearchList,
    FenceMap,
  },
  data() {
    return {
      ...returnFields(this),
      title: "新建电子围栏",
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
        name: "",
        carrierArea: [],
        serviceType: "",
        railType: "",
        scope: "",
        getpathData: [],
        effectiveTime: "",
        failureTime: "",
        remark: "",
        voiceDoc: "",
        useLevelTypeList: [],
        status: 0,
        tripDistance: null,
        navCoords: [
          {
            lng: "",
            lat: "",
          },
        ],
        timeRanges: [
          {
            effectiveTime: null,
          },
        ],
        limitTimeList: [
          {
            limitTime: null,
          },
        ],
        timeRangeType: 0, // 0:全天,1:部分
      },
      status: keys(statusData).map((key) => ({
        value: key,
        label: statusData[key],
      })),
      optList: keys(serviceTypeData).map((key) => ({
        value: key,
        label: serviceTypeData[key],
      })),
      railTypeList,
      invalidEditor: false,
      polygonPath: [],
      searchListParams: {}, // 保存搜索条件参数
      // todo
      isMapPop: false,
      provinceCityCodeMap: [],
      vehicleRankList: [], // 下拉的车型list
      viewMapLoading: false, // 可视化加载flag
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      carLevelList: (state) => state.common.carLevelList.map((it) => {
        return {
          ...it,
          value: it.vehicleLevel,
          label: it.vehicleName,
        };
      }),
    }),
    ...mapGetters({
      // 在store中获取产品线,这个数据是在路由跳转查询的
      businessGradeName: "getBusinessGradeName",
    }),
  },
  mounted() {
    console.log(this.bizTypeList);

    console.log("产品线:", this.businessGradeName);
    this.getCityListData();
    // this.getTableList()
    this.inputList = inputList;
    this.inputList[2].dropList = this.bizTypeList;
    this.inputList[4].dropList = this.railTypeList;
    this.inputList[6].dropList = this.status;
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      let params = {
        areaType: 1, // 已开启城市
        businessLineList: [1, 2, 4], // 快车、专车，包车，顺风车,企业用车
      };
      getCitys({}).then((res) => {
        let list = cpTranslate(res.data.data || []);
        this.inputList[0].cascaderList = list;
        this.cityList = list;
      });
    },
    // 获取整合的产品线和车型等级数组
    getMulProducts(serviceTypes, carLevels) {
      let list = [];
      serviceTypes &&
        serviceTypes.forEach((item) => {
          list.push({ serviceType: item, carLevels: [] });
        });

      let hasParentList = [];
      carLevels &&
        carLevels.forEach((item) => {
          this.vehicleRankList.some((item2) => {
            if (item2.value === item) {
              hasParentList.push({ parentId: item2.parentId, value: item });
            }
          });
        });
      list &&
        list.forEach((item) => {
          hasParentList.forEach((item2) => {
            if (item.serviceType === item2.parentId) {
              item.carLevels.push(item2.value);
            }
          });
        });
      return list;
    },

    // 搜索接口
    getTableList() {
      const searchParams = this.searchListParams;
      let mulProducts = this.getMulProducts(
        searchParams.serviceTypes,
        searchParams.carLevels
      );
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        cityCode: searchParams.cityId,
        name: searchParams.name || "",
        mulProducts: mulProducts,
        railTypes:
          searchParams.railTypes.length !== 0
            ? searchParams.railTypes
            : arrRailList,
        createTime: timeFormat(searchParams.millis) || "",
        statusList: searchParams.statusList,
        direction: searchParams.direction || "",
        addressTypeList: searchParams.addressTypeList,
      };
      console.log("请求参数：", params);
      // 整合要提交的数据
      // params.pageSize = this.pageSize
      // params.currPage = this.current
      // if (params.cityId) params.cityCode = params.cityId
      // if (params.provinceId) params.provinceCode = params.provinceId
      // if (params.serviceType) params.serviceType = Number(params.serviceType)
      // delete params.cityId
      // delete params.provinceId

      citySelectPen(params).then((res) => {
        this.tableData = (res.data.data && res.data.data.list) || [];
        // 过滤营销围栏
        // this.tableData = this.tableData.filter(item => item.railType === 3)
        this.total = (res.data.data && res.data.data.totalCount) || 0;
        this.$store.commit("changeLoadingFlag", false);
      });
    },

    // 打开电子围栏可视化
    popViewMap() {
      // 搜集search中的查询字段
      let mulProducts = this.getMulProducts(
        this.inputList[2].value,
        this.inputList[3].value
      );
      let params = {
        cityCode: this.inputList[0].value[1],
        name: this.inputList[1].value,
        // serviceTypes: this.inputList[2].value,
        mulProducts: mulProducts,
        // carLevels: this.inputList[3].value,
        railTypes: this.inputList[4].value,
        createTime: timeFormat(this.inputList[5].value),
        statusList: this.inputList[6].value,
        direction: this.inputList[7].value,
        addressTypeList: this.inputList[8].value,
      };
      // 查询前校验省市必填
      if (!params.cityCode) {
        this.$store.commit("changeLoadingFlag", false);
        this.$Message.error("省市必选");
        return false;
      }
      this.viewMapLoading = true;
      // console.log(this.inputList);
      this.$refs.fenceMap.init("", "", params);
    },
    // 结束loading的回调
    overLoad(data) {
      if (data) {
        this.viewMapLoading = false;
      }
    },

    // 电子围栏新增
    popView() {
      this.$refs.fenceMap.init("add");
    },
    confirm(data) {
      if (data) this.getTableList();
      this.isPop = false;
    },
    // 搜索事件
    search(data) {
      // 查询前校验省市必填
      if (!data.cityId) {
        this.$store.commit("changeLoadingFlag", false);
        this.$Message.error("省市必选");
        return false;
      }
      this.current = 1;
      this.searchListParams = { ...data };
      this.getTableList();
    },
    // 重置
    reset(data) {
      this.current = 1;
      this.searchListParams = {};
      // this.getTableList()
      this.tableData = [];
      this.total = 0;
      this.vehicleRankList = [];
      this.$store.commit("changeLoadingFlag", false);
    },
    sort() {},

    selectObj(val) {
      this.current = val;
      this.getTableList();
    },

    // 翻页事件
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    // 改变页容量
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 启动停用的调用接口
    rowActive(row) {
      const { status, uuid } = row;
      const params = {
        status: status - 1 === 0 || status - 2 === 0 ? 4 : 1,
        uuid,
      };
      updateFenceStatus(params).then((res) => {
        if (res.data && res.data.success) {
          this.$Message.success("状态更新成功！");
          this.getTableList();
        } else {
          this.$Message.warning("状态更新失败！");
        }
      });
    },

    // 搜索框的change事件集合
    selectChange(data, name) {
      if (name === "serviceTypes") {
        // 车型等级
        let vehicleRankList = [];
        data.forEach((item) => {
          let carTypes = this.bizTypeList.find((it) => it.value === item) || {};
          if (carTypes.children) {
            let carTip = carTypes.bizTypeName;
            let carListItem = carTypes.children;
            carListItem.forEach((carItem) => {
              vehicleRankList.push({
                parentId: carTypes.value,
                value: carItem.value,
                label: `${carTip}-${carItem.label}`,
              });
            });
          }
        });
        this.inputList[3].dropList = vehicleRankList;
        this.inputList[3].value = "";
        this.vehicleRankList = vehicleRankList;
      }
    },
    // 保存成功的回调
    saveSuccess(data) {
      if (data) {
        this.getTableList();
      }
    },
  },
};
</script>
<style scoped>
.carrier > p {
  font-weight: 700;
}
.requireSpan {
  font-size: 12px;
  color: red;
  position: absolute;
  top: 9px;
  left: -7px;
}
.carrier-header {
  margin-top: 10px;
  position: relative;
}
</style>
