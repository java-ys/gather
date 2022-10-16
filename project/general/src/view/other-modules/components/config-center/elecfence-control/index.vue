<!--电子围栏管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @on-change="selectChange"
      />
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
        style="margin-top: 25px;"
        @sort="sort"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />
      <Float
         ref="float"
        :floatParams="floatParams"
        :polygonPath="polygonPath"
        :uuid="uuid"
        :cityList="cityList"
        :optList="bizTypeList"
        :type="updateType"
        :title="title"
        :popView="isPop"
        :invalidEditor="invalidEditor"
        :width="700"
        @on-confirm="confirm"
      />
    </div>
  </div>
</template>

<script>
import { returnFields, inputList, railTypeMap, statusData, serviceTypeData } from "./index"
import { getCarrierList } from "_o/api/operator-carrier"
import { keys } from "@/libs/tools"
import VTable from "_a/v-table/v-table"
import Float from "./float"
import SearchList from "_a/search-list/search-list"
import { cpTranslate } from "@/libs/tools";
import {mapActions, mapGetters, mapState} from "vuex";
import {
  selectPen,
  getPenDetail,
  updateFenceStatus,
  getCitys
} from "_o/api/configData.js"
export default {
  components: {
    VTable,
    SearchList,
    Float
  },
  data() {
    return {
      ...returnFields(this),
      title: "新建电子围栏",
      uuid: "",
      updateType: "",
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
            lat: ""
          }
        ],
        timeRanges: [
          {
            effectiveTime: null
          }
        ]
      },
      status: keys(statusData).map(key => ({
        value: key,
        label: statusData[key]
      })),
      optList: keys(serviceTypeData).map(key => ({
        value: key,
        label: serviceTypeData[key]
      })),
      railTypeMap,
      invalidEditor: false,
      polygonPath: [],
      searchListParams: {} // 保存搜索条件参数
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      carLevelList: (state) => state.common.carLevelList.map(it=>{
        return {
          ...it,
          value: it.vehicleLevel,
          label: it.vehicleName,
        }
      }),
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  mounted() {
    console.log(this.bizTypeList);
    this.getTableList()
    this.getCityListData()
    this.inputList = inputList
    this.inputList[2].dropList = [{ value: 5, label: "全部" }, ...this.bizTypeList]
    this.inputList[4].dropList = this.railTypeMap
    this.inputList[6].dropList = this.status
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      let params = {
        areaType: 1, // 已开启城市
        businessLineList: [1, 2, 4]// 快车、专车，包车，顺风车,企业用车
      }
      getCitys({}).then(res => {
        let list = cpTranslate(res.data.data || [])
        this.inputList[1].cascaderList = list
        this.cityList = list
      });
    },
    getTableList() {
      const params = this.searchListParams
      // 获取表格数据
      params.pageSize = this.pageSize
      params.currPage = this.current
      if (params.cityId) params.cityCode = params.cityId
      if (params.provinceId) params.provinceCode = params.provinceId
      if (params.serviceType) params.serviceType = Number(params.serviceType)
      if(!params.railType) {
        params.railTypes = this.railTypeMap.map( item => item.value)
        delete params.railType
      } 
      //过滤查询条件
      delete params.cityId
      delete params.provinceId
      selectPen(params).then(res => {
        this.tableData  = (res.data.data && res.data.data.list) || []
        // 过滤运营围栏和人车证过滤围栏
        // this.tableData = list.filter(item => item.railType !== 1 &&  item.railType !== 28)
        this.total = (res.data.data && res.data.data.totalCount) || 0
        this.$store.commit("changeLoadingFlag", false)
      })
    },
    popView() {
      this.isPop = true
      this.title = "新建电子围栏"
      this.floatParams = {
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
        direction: null,
        filterType: null,
        filterTagList: [],
        addressTypeList: [],
        centerPoint: {},
        navCoords: [
          {
            lng: "",
            lat: ""
          }
        ],
        timeRanges: [
          {
            effectiveTime: null
          }
        ],
        reasonType: 0,
        reason: "",
        carLevelList:[]
      }
      this.polygonPath = []
      this.invalidEditor = false
      this.updateType = "add"
    },
    confirm(data) {
      if (data) this.getTableList()
      this.isPop = false
    },
    search(data) {
      this.current = 1
      this.searchListParams = { ...data }
      this.getTableList()
    },
    reset(data) {
      this.current = 1
      this.searchListParams = {}
      this.getTableList()
    },
    sort() {},
    selectObj(val) {
      this.current = val
      this.getTableList()
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    rowActive(row) {
      const { status, uuid } = row;
      const params = { status: (status - 1 === 0 || status - 2 === 0) ? 4 : 1, uuid }
      updateFenceStatus(params).then(res => {
        if (res.data && res.data.success) {
          this.$Message.success("状态更新成功！")
          this.getTableList()
        } else {
          this.$Message.warning("状态更新失败！")
        }
      })
    },
    selectChange(data,name){
      if(name === 'serviceType') {
        let carTypes = this.bizTypeList.find(it => it.value === data) || {}
        this.inputList[3].dropList = carTypes.children || []
        this.inputList[3].value = ""
      }
    }
  }
}
</script>
<style scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
