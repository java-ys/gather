<template>
  <div class="realTime-page">
    <Card :padding="0">
      <t3heatMap
        :model="formData.model"
        :dataList="dataList"
        :isTourData="isTourData"
        :queryType="queryType"
        :centerLoction="cityCenterLocation"
        :efenceList="efenceList"
        ref="heatMap"
        @cityFuc="recieveGeoCode"
        @on-changeQuery="changeQueryType"
        @on-changeBusinessType="changeBusinessType"
      >
        <div class="search-list-forecast" slot="search-list">
          <!-- <SearchList
            :inputList="inputList"sysSwitch
            @on-search="querySearch"
            @on-reset="clearQueryData"
          ></SearchList> -->
          <div class="search-list-main">
            <!-- 模型 -->
            <Form ref="formInline" :model="formData" inline>
              <!-- 模型 -->
              <Form-item label="">
                <Select
                  v-model="formData.model"
                  style="width: 200px"
                  :placeholder="inputList[0].placeholder"
                  @on-change="changeModel"
                >
                  <Option
                    v-for="item in inputList[0].dropList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </Form-item>
              <!-- 城市 -->
              <Form-item label="">
                <Select
                  v-model="formData.cityID"
                  clearable
                  filterable
                  style="width: 200px"
                  :placeholder="inputList[1].placeholder"
                  @on-change="changeCity"
                >
                  <Option
                    v-for="item in inputList[1].dropList"
                    :value="item.cityID"
                    :key="item.cityID"
                    >{{ item.city }}</Option
                  >
                </Select>
                <!-- <Cascader
                  v-model="formData.cityIds"
                  trigger="hover"
                  placeholder="请选择城市"
                  :data="inputList[1].dropList"
                  style="width: 200px"
                  :clearable="false"
                  @on-change="
                    (value, selectedData) => changeCity(value, selectedData)
                  "
                ></Cascader> -->
                
              </Form-item>
              <!-- 业务线 -->
              <Form-item label="">
                <Select
                  :disabled="disabledInput"
                  v-model="formData.bizLine"
                  style="width: 200px"
                  :placeholder="inputList[2].placeholder"
                  @on-change="changeBizLine"
                >
                  <Option
                    v-for="item in bizDataList"
                    :value="item.expandBizLine"
                    :key="item.expandBizLine"
                    >{{ item.expandBizName }}</Option
                  >
                </Select>
              </Form-item>
              <!-- 来源 -->
              <Form-item label="">
                <Select
                  v-model="formData.source"
                  style="width: 200px"
                  :placeholder="inputList[3].placeholder"
                  :disabled="disabledInput"
                  @on-change="changeSource"
                >
                  <Option
                    v-for="item in inputList[3].dropList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </Form-item>
              <!-- 车型组 -->
              <Form-item label="">
                <Select
                  v-model="formData.carGroup"
                  style="width: 200px"
                  :placeholder="inputList[4].placeholder"
                  :disabled="disabledInput"
                  clearable
                  @on-change="changeCarGroup"
                >
                  <Option
                    v-for="item in inputList[4].dropList"
                    :value="item.groupID"
                    :key="item.groupID"
                    >{{ item.groupName }}</Option
                  >
                </Select>
              </Form-item>
              <!-- 产品线、车型 -->
              <Form-item label="">
                <Select
                  v-model="formData.bizLineCarType"
                  style="width: 200px"
                  :placeholder="inputList[5].placeholder"
                  :max-tag-count="1"
                  :multiple="true"
                  :collapse-tags="true"
                >
                  <Option
                    v-for="item in inputList[5].dropList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </Form-item>
              <!-- 时间片 -->
              <!-- <Form-item label="">
                <Select
                  v-model="formData.timeSlice"
                  style="width: 200px"
                  :placeholder="inputList[6].placeholder"
                  @on-change="changeTime"
                >
                  <Option
                    v-for="item in inputList[6].dropList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </Form-item> -->
              <Form-item label="">
                <div class="btn-wrap">
                  <Button
                    style="margin-right: 15px"
                    type="primary"
                    @click="querySearchAll(true)"
                  >
                    搜索
                  </Button>
                  
                </div>
              </Form-item>
            </Form>
          </div>
          <div class="timer-counDown">
            <countDown
              @timeUpdate="timeUpdate"
              ref="countDown"
              :countType="1"
              :time="time"
              :autoStart="false"
              :startRemain="startRemain"
              :timeEmitDistance="timeConfig.value"
            />
          </div>
        </div>
        <div
          slot="loading"
          v-if="loading"
          :style="{ height: 30 + 'px' }"
          class="table-spin-wrap"
        >
          <Spin fix size="large">
            <Icon
              type="ios-loading"
              size="20"
              class="table-spin-icon-load"
            ></Icon>
            <div style="margin-top: 5px;white-space:nowrap">
              加载中...
            </div>
          </Spin>
        </div>
      </t3heatMap>
       
    </Card>
  </div>
</template>
<script>
import t3heatMap from "../components/heatMap.vue";
import { inputList } from "./fields";
import {
  getRealPrediction as getHexagonData,
  getCityCodeList,
  getTypeList,
  
} from "_o/api/forecastDisff";
import { getCitys,getOpencityListData } from "_o/api/configData.js";
import countDown from "../components/countDown.vue";
import { cpTranslate } from "@/libs/tools";
import { getNewBusinessLine } from "_gc/status-map";
import moment from "moment";
export default {
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      amap: null,
      formData: {
        model: "1", //实时预测
        cityID: "",
        cityIds: [],
        bizLine: 1, //业务线
        source: "",
        bizLineCarType: [], // 产品线业务线
        carGroup: "", // 车型组
        beginTime: "",
        endTime: "",
        timeSlice: "0,15",
      },
      cityCenterLocation: [],
      cityName: "南京市",
      cityCode: "",
      dataList: [],
      isTourData: 1,
      efenceList: [],
      queryType: 1,
      time: 15 * 60 * 1000, // 总共倒计时时间
      startRemain: 0, // 开始时间 - 现在时间
      timeEmitDistance: 10 * 1000, // 刷新时间间隔(默认一分钟)
      timeActive: false,
      searchConfig: {},
      bizDataList:[],
      timeConfig:{
        label: "页面自动刷新",
        value: 60*1000 // 页面自动刷新时间
      },
      loading:false,
      openCity:[]
    };
  },
  components: {
    t3heatMap,
    countDown,
  },
  computed: {
    disabledInput() {
      if (this.formData.model === "2") {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    const searchConfig = await this.getTypeListFn();
    if (searchConfig) {
      return;
    }
    this.initFormData();
    this.getSavedCity();
    this.getOpenCityListDataFn()
    this.querySearch(false);
    this.startCountDown();
  },
  methods: {
    querySearchAll(){
      const [startTime, endTime] = this.formData.timeSlice.split(",");
      this.startRemain = startTime * 60 * 1000;
      this.time = (endTime - startTime) * 60 * 1000;
      this.formData.beginTime = Date.now() + startTime * 60 * 1000;
      this.formData.endTime = Date.now() + startTime * 60 * 1000 + (endTime - startTime) * 60 * 1000;;
      this.querySearch(true);
      this.startCountDown();
    },
    changeModel(v){
      this.stopCountDown()
      this.formData.bizLineCarType=[];
      if(v==2){
        this.formData.bizLine='';
        this.formData.carGroup='';
        let bizTypeList = []; 
        let businessLinelist =  getNewBusinessLine() || [];
        businessLinelist.list.map(carType=>{
            let arr = carType.levels.map(c=>{
            return {
              value:`${carType.value}#${c.vehicleLevel}`,
              label:`${carType.label}-${c.vehicleName}`,
            }
          })
          bizTypeList.push(...arr)
        })
        this.inputList[5].dropList = bizTypeList
        // carLevelList.value = getNewCarLevelList(productLineCode).list;
      }else{
        this.inputList[5].dropList = []
      }
    },
    getOpenCityListDataFn(options={}){
      const params = {
        currPage:1,
        pageSize:10,
        cityCode:this.formData.cityIds[1],
        provinceID:this.formData.cityIds[0],
        ...options
      }
      getOpencityListData(params).then(res=>{
        if(res.data.success){
          if(res.data.data.list && res.data.data.list.length){
            this.bizDataList = res.data.data.list.filter(biz=>biz.levelType===1) || [];
          }else{
            this.bizDataList = [];
            this.inputList[5].dropList = [];
            this.inputList[4].dropList = []
            this.$Message.warning("当前城市暂未开放");
          }
        }
      })
    },
    changeCity(v) {
      this.stopCountDown()
      if (v ) {
        this.formData.cityID = v;
      } else {
        this.formData.cityID = "";
      }
      // 清空业务线和产品线/车型
      this.formData.bizLine = "";
      this.formData.bizLineCarType = [];
      this.formData.carGroup=''
      if(!v){
        return 
      }
     
      const cityInfo = this.inputList[1].dropList.find(city=>city.cityID===v)
       const params = {
        cityCode:v,
        provinceID:cityInfo.provinceID,
      }
      this.cityName = cityInfo.city
      this.getOpenCityListDataFn(params)
      this.recieveGeoCode(this.cityName,v);
      // 获取业务线list
    },
    changeBizLine(v) {
      this.stopCountDown()
      let bizTypeList = [];
      this.formData.bizLineCarType = [];
      this.formData.carGroup='';
      // 获取产品线/车型list
      if(!v){
        return 
      }
      const selectedBiz = this.bizDataList.find(k=>k.expandBizLine===v);
      this.inputList[4].dropList = selectedBiz.groupVehicleDtoList;
      selectedBiz.bizTypeList.map(carType=>{
       let arr = carType.levels.map(c=>{
          return {
            value:`${carType.bizType}#${c.vehicleLevel}`,
            label:`${carType.bizTypeName}-${c.vehicleName}`,
          }
        })
        bizTypeList.push(...arr)
      })
      this.inputList[5].dropList = bizTypeList
    },
    changeCarGroup(v){
      this.stopCountDown()
      let bizTypeList = [];
      if(!v){
        return 
      }
      const selectedCarGroup =  this.inputList[4].dropList.find(k=>k.groupID===v);
      selectedCarGroup.bizTypeList.map(carType=>{
       let arr = carType.levels.map(c=>{
          return {
            value:`${carType.bizType}#${c.vehicleLevel}`,
            label:`${carType.bizTypeName}-${c.vehicleName}`,
          }
        })
        bizTypeList.push(...arr)
      })
       this.inputList[5].dropList =bizTypeList
    },
    changeSource() {
      this.formData.carGroup = "";
      this.stopCountDown()
      // 获取车型组list
    },
    changeTime(v) {
      this.stopCountDown()
      if(v & v.length){
        const [startTime, endTime] = v.split(",");
        this.startRemain = startTime * 60 * 1000;
        this.time = (endTime - startTime) * 60 * 1000;
        this.formData.beginTime = Date.now().getTime + startTime * 60 * 1000;
        this.formData.endTime = Date.now().getTime + startTime * 60 * 1000 + (endTime - startTime) * 60 * 1000;
      }
    },
    initFormData() {
      const nowTime = Date.now();
      this.formData = {
        model: "1",
        cityID: "320100",
        cityIds: ["320000", "320100"],
        bizLine: 1,
        source: "全部",
        carGroup:'全部',
        timeSlice: "0,15",
        beginTime: nowTime,
        endTime: nowTime,
        bizLineCarType: [],
      };
    },
    timeUpdate(time) {
      this.formData.beginTime = time;
      this.formData.endTime = time;
      this.querySearch(false, true);
    },
    startCountDown() {
      this.timeActive = true;
      this.$refs["countDown"].reset();
    },
    // 暂停倒计时
    stopCountDown(){
      // this.$refs["time-process"].pause();
      this.$refs["countDown"].pause();
    },
    getTypeListFn() {
      return getTypeList({})
        .then((res) => {
          if (res.data.success) {
            this.inputList[0].dropList = res.data.data.model;
            this.openCity = res.data.data.city || [];
            this.inputList[2].dropList = res.data.data.bizLine;
            this.inputList[3].dropList = res.data.data.source;
            // this.inputList[4].dropList = res.data.data.carGroup;
            // this.inputList[5].dropList = res.data.data.bizLineCarType;
            this.inputList[6].dropList = res.data.data.timeSlice;
            let timeConfig = res.data.data.timeConfig.find(k=>k.label==='页面自动刷新') 
            if(timeConfig){
                 this.timeConfig.value =(timeConfig.value - 0)*1000
            }
          }
          return false;
        })
        .catch((err) => {
          return false;
        });
    },
    // getCityList() {
    //   let params = {
    //     areaType: 2,
    //     authDimension: 1,
    //     businessLineList: ["1", "2", "4", "6", "7"],
    //   };
    //   getCityCodeList(params).then((res) => {
    //     this.cityList = res.data.data.openAreaConfigDtoList;
    //     this.cityName = this.cityList[0].city;
    //     this.cityCode = this.cityList[0].cityId;
    //   });
    // },
    getSavedCity() {
      getCitys().then((res) => {
        let cityList = res.data.data;
        let openCitys = []
        for (let index = 0; index < cityList.length; index++) {
          const element = cityList[index];
          for (const city of element.citys) {
            let sameCity = this.openCity.find((v)=>city.cityID==v.value)
            if(sameCity){
              openCitys.push({
                ...city,   
                province:element.province,
                provinceID:element.provinceID,
                uuid:element.uuid
              })
            }
          }
        
        }
        console.log(openCitys,"openCitys");
        // let list = cpTranslate(openCitys);
        // console.log(list,"list");
        // console.log(this.openCity,"openCity");
        this.inputList[1].dropList = openCitys;
        // this.cityList = list;
      });
    },
    checkParams(queryData = {}) {
      if (!queryData.model) {
        return "请选择模型等必填项";
      }
      if (queryData.model == 1 || queryData.model == 3) {
        if (queryData.bizLine && (queryData.source || queryData.source===0) && queryData.cityID) {
          return "";
        }
        return "请选择城市、业务线、来源、时间等必选项";
      }
      if (queryData.model == 2) {
        if (
          queryData.cityID &&
          queryData.bizLineCarType &&
          queryData.bizLineCarType.length && 
          queryData.timeSlice
        ) {
          return "";
        }
        return "请选择城市、产品线/车型、时间等必选项";
      }
    },
   
    cacheTime() {
      const [startTime, endTime] = this.formData.timeSlice.split(",");
      this.startRemain = startTime * 60 * 1000;
      this.time = (endTime - startTime) * 60 * 1000;
    },
    /**
     * @param Boolean checkLimit 是否校验筛选必填项
     * @param Boolean isUpdate  是否更新更新地图信息窗体
     */
    querySearch(checkLimit = true, isUpdate = false) {
      let message = "";
      message = this.checkParams(this.formData);
      if (message && checkLimit) {
        this.$Message.warning(message);
        return;
      }
      const params = {};
      for (const k in this.formData) {
        if (this.formData[k]) {
          params[k] = this.formData[k];
        }
      }
      // this.cacheTime();
      // this.startCountDown();
      if (params.timeSlice) {
        params.beginTime = moment(params.beginTime).format("YYYYMMDDHHmm")
        params.endTime = params.beginTime
      }
      if(params.source==='全部'){
        params.source=""
      }
      if(params.carGroup=='全部'){
        params.carGroup=""
      }
      params.bizLineCarType = this.formData["bizLineCarType"].join(",");
      // delete params.timeSlice;
      delete params.cityIds;
      this.getHexagonList(params, isUpdate);
    },
    getHexagonList(params = {}, isUpdate) {
      this.loading = true;
      getHexagonData(params).then((res) => {
        this.loading  = false

        if (res.data && res.data.success) {
          let data = res.data.data
            ? res.data.data.prediction
              ? res.data.data.prediction
              : []
            : [];
          this.dataList = data;
          if(!this.dataList.length){
            this.$Message.warning(`暂无数据`);
          }
          setTimeout(() => {
            this.$refs["heatMap"] && this.$refs["heatMap"].setHexagonData(isUpdate);
            // this.$refs["heatMap"].creatCenterMarker();
          }, 100);
        }
      }).catch(err=>{
        this.loading  = false
      });
    },
    clearQueryData() {
      this.formData = {};
    },
    recieveGeoCode(cityName,cityCode) {
      this.cityName = cityName;
      this.cityCode = cityCode;
      this.setGeoCenter(cityName,cityCode);
    },
    changeQueryType() {},
    //设置地图中点
    setGeoCenter(cityName,cityCode) {
      let _this = this;
      AMap.plugin("AMap.Geocoder", function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city:cityName ||  _this.cityName,
        });
        geocoder.getLocation(cityName || _this.cityName, function (status, result) {
          if (status === "complete" && result.info === "OK") {
            // result中对应详细地理坐标信息
            _this.cityCenterLocation = [
              result.geocodes[0].location.lng,
              result.geocodes[0].location.lat,
            ];
            //  _this.$refs['heatMap'].map.setCenter(_this.cityCenterLocation)
            _this.$refs["heatMap"].map.setZoomAndCenter(
              12,
              _this.cityCenterLocation
            );
            // _this.getHexagonList();

            _this.$forceUpdate();
          }
        });
      });
    },
    // 创建地图
    createMap() {},
    // 创建多边形围栏
    createPolygon() {},
    // 移除多边形
    removePolygon() {},
    changeBusinessType(val) {
      this.businessType = val;
      // this.getHexagonList()
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .input-list-wrap {
  margin: 0 15px 15px 0;
  .search-input {
    width: 150px;
  }
}
.search-list-forecast {
  /deep/ .ivu-form-inline .ivu-form-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
.search-list-forecast {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .timer-counDown {
    width: 150px;
    padding: 4px 10px;
    background-color: antiquewhite;
    margin-right: 50px;
    text-align: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    color: rgba(255, 133, 51, 1);
  }
}
.table-spin-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    // border: 1px solid #e8eaec;
  }
  .table-spin-icon-load {
    animation: ani-table-spin 1s linear infinite;
  }
  @keyframes ani-table-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
