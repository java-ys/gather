<template>
  <div>
    <div class="search-list-forecast" slot="search-list">
      <!-- <SearchList
        :inputList="inputList"
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
              :multiple="true"
              :max-tag-count="1"
              clearable
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
                @click="querySearchAll"
              >
                搜索
              </Button>
              <!-- <Button @click="clearQueryData">重置</Button> -->
            </div>
          </Form-item>
        </Form>
      </div>
      <div class="timer-counDown">
        {{ dateTime }}
      </div>
    </div>
    <div class="main-map">
      <Row>
        <Col :span="12">
          <Card :padding="10">
            <div class="card-map-wrapper">
              <t3heatMap
                :model="formData.model"
                :mapStyles="mapStyles"
                :dataList="realData"
                :isTourData="isTourData"
                :queryType="queryType"
                :centerLoction="cityCenterLocation"
                :efenceList="efenceList"
                :zoom="zoom"
                :center="center"
                ref="heatMapReal"
                :realType="1"
                @layerClick="realLayerClick"
                @cityFuc="recieveGeoCode"
                @on-changeQuery="changeQueryType"
                @on-changeBusinessType="changeBusinessType"
                @zoomEnd="zoomChange"
                @moveEnd="moveEnd"
                @movestart="movestart"
              >
              </t3heatMap>
              <div class="title-map">实际值</div>
            </div>
          </Card>
        </Col>
        <Col :span="12">
          <Card :padding="10">
            <div class="card-map-wrapper">
              <t3heatMap
                :model="formData.model"
                :mapStyles="mapStyles"
                :dataList="foreCastData"
                :isTourData="isTourData"
                :queryType="queryType"
                :centerLoction="cityCenterLocation"
                :efenceList="efenceList"
                :zoom="zoom"
                :center="center"
                ref="heatMapForecast"
                @layerClick="foreCastLayerClick"
                @cityFuc="recieveGeoCode"
                @on-changeQuery="changeQueryType"
                @on-changeBusinessType="changeBusinessType"
                @zoomEnd="zoomChange"
                @moveEnd="moveEnd"
                @movestart="movestart"
              >
              </t3heatMap>
              <div class="title-map">预测值</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <div class="footer-progress">
      <time-process ref="time-process" :stageDuration="timeConfig.value" :startTime="startTime" :endTime="endTime" @timeUpdate="timeUpdate"></time-process>
    </div>
  </div>
</template>
<script>
import t3heatMap from "../components/heatMap.vue";
import { inputList } from "./fields";
import { getCityCodeList } from "_o/api/map.js";
import countDown from "../components/countDown.vue";
import timeProcess from "../components/time-process.vue";
import {
  getHistoryPrediction as getHexagonData,
  getTypeList,
} from "_o/api/forecastDisff";
import { getCitys, getOpencityListData } from "_o/api/configData.js";
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
        cityID: "320100",
        cityIds: ["320000", "320100"],
        bizLine: "", //业务线
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
      realData: [],
      foreCastData: [],
      isTourData: 1,
      efenceList: [],
      queryType: 1,
      time: 1 * 60 * 1000, // 总共倒计时时间
      startRemain: 5 * 60 * 1000, // 开始时间 - 现在时间
      timeEmitDistance: 5 * 1000,
      mapStyles: {
        height: "600px",
      },
      bizDataList:[],
      startTime: Date.now() - 45 *60*1000,
      endTime: Date.now() - 15*60*1000,
      timeConfig:{
        label: "播放间隔",
        value: 2000
      },
      firstQury:0,
      zoom:10,
      center:null,
      openCity:[]
    };
  },
  computed: {
    dateTime() {
      return moment().format("YYYY-MM-DD");
    },
    disabledInput() {
      if (this.formData.model === "2") {
        return true;
      }
      return false;
    },
  },
  components: {
    t3heatMap,
    countDown,
    timeProcess,
  },
  async mounted() {
    // this.getCityList();
    // this.startCountDown();
    this.initFormData();
    await this.getTypeListFn();
    this.getSavedCity();
    this.getOpenCityListDataFn()
    this.querySearch(false);
  },
  methods: {
    moveEnd(v){
      if(v.lng && v.lat){
        this.center = [v.lng,v.lat]

      }
    },
    movestart(){
      this.$refs["time-process"] && this.$refs["time-process"].pause();
    },
    zoomChange({zoom,center}){
      this.zoom = zoom;
      this.center = [center.lng,center.lat]
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
            this.formData.bizLine=""
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
      if (v) {
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
      this.recieveGeoCode(this.cityName,v[1]);
      this.getOpenCityListDataFn(params)
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
      this.inputList[5].dropList =bizTypeList
    },
    changeCarGroup(v){
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
       this.inputList[5].dropList = bizTypeList;
       this.stopCountDown()
    },
    changeSource() {
      this.formData.carGroup = "";
      this.stopCountDown()
      // 获取车型组list
    },
    stopCountDown(){
      this.$refs["time-process"].pause();
      this.$refs["time-process"].value = this.startTime;
    },
    changeTime(v) {
      const [startTime, endTime] = v.split(",");
      this.formData.beginTime = Date.now() - endTime*60*1000 -  30 * 60 * 1000;
      this.formData.endTime = Date.now() - endTime*60*1000 -  30 * 60 * 1000;
      this.startTime = Date.now() - endTime*60*1000 -  30 * 60 * 1000;
      this.endTime = Date.now() - endTime*60*1000 
      this.$refs["time-process"].pause();
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
        bizLineCarType: [],
        timeSlice: "0,15",
        beginTime: nowTime - 15 * 60 * 1000,
        endTime: nowTime - 15 * 60 * 1000 - 30 * 60 * 1000 ,
      };
    },
    getTypeListFn() {
      return getTypeList({})
        .then((res) => {
          if (res.data.success) {
            this.openCity = res.data.data.city || [];
            this.inputList[0].dropList = res.data.data.model;
            // this.inputList[1].dropList = res.data.data.city;
            this.inputList[2].dropList = res.data.data.bizLine;
            this.inputList[3].dropList = res.data.data.source;
            // this.inputList[4].dropList = res.data.data.carGroup;
            // this.inputList[5].dropList = res.data.data.bizLineCarType;
            this.inputList[6].dropList = res.data.data.timeSlice;
            this.timeConfig.value = res.data.data.timeConfig[1].value - 0
            let timeConfig = res.data.data.timeConfig.find(k=>k.label==='播放间隔') 
            if(timeConfig){
              this.timeConfig.value =timeConfig.value - 0
            }
          }
          return false;
        })
        .catch((err) => {
          return false;
        });
    },
    timeUpdate(time) {
      this.formData.beginTime = time
      this.querySearch(time,true);
    },
    startCountDown() {
      this.$refs["countDown"].reset();
    },
    getCityList() {
      let params = {
        areaType: 2,
        authDimension: 1,
        businessLineList: ["1", "2", "4", "6", "7"],
      };
      getCityCodeList(params).then((res) => {
        this.cityList = res.data.data.openAreaConfigDtoList;
        this.cityName = this.cityList[0].city;
        this.cityCode = this.cityList[0].cityId;
      });
    },
    // 缓存当前时间
    cacheTime() {
      const [startTime, endTime] = this.formData.timeSlice.split(",");
      this.startRemain = startTime * 60 * 1000;
      this.time = (endTime - startTime) * 60 * 1000;
    },

    // 校验当前筛选项必填项
    checkParams(queryData = {}) {
      if (!queryData.model) {
        return "请选择模型等必填项";
      }
      if (queryData.model == 1 || queryData.model == 3) {
        if (
          queryData.bizLine &&
          queryData.source &&
          queryData.cityID &&
          queryData.timeSlice
        ) {
          return "";
        }
        return "请选择城市、业务线、来源、时间等必选项";
      }
      if (queryData.model == 2) {
        if (
          queryData.cityID &&
          queryData.bizLineCarType.length &&
          queryData.timeSlice
        ) {
          return "";
        }
        return "请选择城市、产品线/车型、时间等必选项";
      }
    },

    querySearchAll(){
      this.firstQury = 0;
      const [startTime, endTime] = this.formData.timeSlice.split(",");
      this.formData.beginTime = Date.now() - endTime*60*1000 -  30 * 60 * 1000
      this.formData.endTime = Date.now() - endTime*60*1000 -  30 * 60 * 1000
      this.startTime = Date.now() - endTime*60*1000 - 30 * 60 * 1000
      this.endTime = Date.now() - endTime*60*1000
      this.$refs["time-process"].pause();
      this.$refs["time-process"].value = this.startTime;
      // this.$refs["time-process"].start();
      this.querySearch(false,true)
    },
    /**
     * @param Boolean checkLimit 是否校验筛选必填项
     *
     */
    querySearch(time,checkLimit = true) {
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
      this.cacheTime();
      // this.startCountDown();
      if (params.timeSlice) {
        // params.beginTime = params.beginTime;
        // params.endTime = params.endTime;
        params.beginTime =time?moment(time).format("YYYYMMDDHHmm"): moment(params.beginTime).format("YYYYMMDDHHmm")
        params.endTime =params.beginTime

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
      this.getHexagonList(params);
    },
    getHexagonList(params = {}) {
      getHexagonData(params).then((res) => {
        if (res.data && res.data.success) {
          this.realData = [];
          this.foreCastData = [];
          let data = res.data.data
            ? res.data.data.prediction
              ? res.data.data.prediction
              : []
            : [];
          for (let index = 0; index < data.length; index++) {
            const {
              lat,
              lng,
              gridID,
              actualFreeCar,
              actualCallCnt,
              predictFreeCar,
              predictCallCnt,
              actualGap,
              predictGap,
            } = data[index];
            this.realData.push({
              lat,
              lng,
              gridID,
              gap: actualGap,
              FreeCarCnt: actualFreeCar,
              callCnt: actualCallCnt,
            });
            this.foreCastData.push({
              lat,
              lng,
              gridID,
              gap: predictGap,
              FreeCarCnt: predictFreeCar,
              callCnt: predictCallCnt,
            });
          }
          setTimeout(() => {
            if(!this.firstQury){
              this.$refs["time-process"].init()
            }
            this.firstQury++;
            this.$refs["heatMapForecast"] && this.$refs["heatMapForecast"].setHexagonData();
            // this.$refs["heatMapForecast"].creatCenterMarker();
            this.$refs["heatMapReal"] && this.$refs["heatMapReal"].setHexagonData();
            // this.$refs["heatMapReal"].creatCenterMarker();
          }, 100);
        }
      });
    },
    clearQueryData() {},
    recieveGeoCode(cityName, cityCode) {
      this.cityName = cityName;
      this.cityCode = cityCode;
      this.setGeoCenter();
    },
    changeQueryType() {},
    //设置地图中点
    setGeoCenter() {
      let _this = this;
      AMap.plugin("AMap.Geocoder", function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: _this.cityName,
        });
        geocoder.getLocation(_this.cityName, function (status, result) {
          if (status === "complete" && result.info === "OK") {
            // result中对应详细地理坐标信息
            _this.cityCenterLocation = [
              result.geocodes[0].location.lng,
              result.geocodes[0].location.lat,
            ];
            //  _this.$refs['heatMap'].map.setCenter(_this.cityCenterLocation)
            _this.$refs["heatMapForecast"].map.setZoomAndCenter(
              12,
              _this.cityCenterLocation
            );
             _this.$refs["heatMapReal"].map.setZoomAndCenter(
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
    realLayerClick(dataObj) {
      this.$refs["time-process"].pause();
      const lngLat = dataObj.lngLat || [dataObj.lng, dataObj.lat];
      const selectedHex = this.foreCastData.find(
        (k) => k.gridID === dataObj.gridID
      );
      this.$refs.heatMapForecast.createLayerInfoWin(selectedHex, lngLat);
    },
    foreCastLayerClick(dataObj) {
      this.$refs["time-process"].pause();
      const lngLat = dataObj.lngLat || [dataObj.lng, dataObj.lat];
      const selectedHex = this.realData.find(
        (k) => k.gridID === dataObj.gridID
      );
      this.$refs.heatMapReal.createLayerInfoWin(selectedHex, lngLat);
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .timer-counDown {
    width: 100px;
    padding: 4px 8px;
    background-color: antiquewhite;
    margin-right: 50px;
    text-align: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    color: rgba(255, 133, 51, 1);
  }
}
.time-progress {
  display: flex;
}
.card-map-wrapper {
  position: relative;
  .title-map {
    position: absolute;
    top: 10px;
    left: 20px;
    padding: 0 10px;
    line-height: 24px;
    text-align: center;
    color: #ff8533;
    background: #fff;
  }
}
</style>
