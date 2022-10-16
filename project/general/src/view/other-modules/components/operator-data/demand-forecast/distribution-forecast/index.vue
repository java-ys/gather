<template>
  <div>
    <div class="search-list-forecast" slot="search-list">
      <div class="search-list-main">
        <Form ref="formInline" :model="formData" inline>
          <!-- 模型 -->
          <Form-item label="">
            <Select
              v-model="formData.model"
              style="width: 200px"
              :disabled="true"
              :placeholder="inputList[0].placeholder"
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
          <Form-item label="">
            <DatePicker
              v-model="formData.timeRange"
              :format="dataOptions.format || 'yyyy-MM-dd HH:mm'"
              clearable
              type="datetimerange"
              class="search-input"
              placement="bottom-start"
              :options="dataOptions.options || {}"
              :placeholder="dataOptions.placeholder"
              :separator="dataOptions.separator || '-'"
              :style="{ width: dataOptions.inputWidth + 'px' }"
              :editable="false"
              @on-ok="checkTimeRange"
            />
          </Form-item>
          <Form-item label="">
            <div class="btn-wrap">
              <Button
                style="margin-right: 15px"
                type="primary"
                @click="querySearch(true)"
              >
                搜索
              </Button>
              <!-- <Button style="margin-right: 15px" @click="clearQueryData"
                >重置</Button -->
              <Button @click="exportFile">导出</Button>

              <Button @click="clearDrawLayer"> 清空区域选择 </Button>
            </div>
          </Form-item>
        </Form>
        <!-- <div slot="extendInput">
        <DatePicker
          v-model="formData.value"
          :format="dataOptions.format || 'yyyy-MM-dd HH:mm'"
          clearable
          type="datetimerange"
          class="search-input"
          placement="bottom-start"
          :options="dataOptions.options || {}"
          :placeholder="dataOptions.placeholder"
          :separator="dataOptions.separator || '-'"
          :style="{ 'width': dataOptions.inputWidth + 'px' }"
          :editable="false"
          @on-ok="checkTimeRange"
         />
      </div>
      <div :class="{ efenceControler: true }">
        <!-- <Button v-if="!efenceStatus" @click="handleDrawLayer">
          清空区域选择
        </Button> -->
      </div>
    </div>
    <Card :padding="0">
      <t3heatMap
        :mapStyles="mapStyles"
        :dataList="dataList"
        :queryType="queryType"
        :loading="loading"
        :centerLoction="cityCenterLocation"
        @choose-hex="chooseHex"
        ref="heatMap"
      >
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
    <div class="my-echarts" v-show="!loading">
      <Card :padding="0" v-if="!empty">
        <time-echarts ref="timeEcharts"> </time-echarts>
      </Card>
      <div v-if="loadData && empty" class="empty-data">
          暂无数据
        </div>
    </div>
  </div>
</template>
<script>
import t3heatMap from "./heatMap.vue";
import { inputList, dataOptions } from "./fields";
// import { getHexagonData, getCityCodeList } from "_o/api/map.js";
import timeEcharts from "./time-echarts.vue";
import {
  getPredictionDistribute as getHexagonData,
  getTypeList,
  downloadPrediction
} from "_o/api/forecastDisff";
import { getOpencityListData, getCitys } from "_o/api/configData.js";
import { cpTranslate } from "@/libs/tools";
import { exportFile } from '@/libs/tools.js'
import axios from "axios";
import fileDownload from "js-file-download"
import { getToken } from "@/libs/util.js";
import config from "@/config/config"; // 为引入的配置文件
const headersObject = config.headers; // 取出headers对象
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
        bizLine: "", //业务线
        source: "",
        bizLineCarType: [], // 产品线业务线
        carGroup: "", // 车型组
        timeRange: [],
      },
      cityCenterLocation: [],
      cityName: "南京市",
      cityCode: "",
      dataList: [],
      dataListCacheList:[],
      isTourData: 1,
      efenceList: [],
      queryType: 1,
      time: 1 * 60 * 1000, // 总共倒计时时间
      startRemain: 5 * 60 * 1000, // 开始时间 - 现在时间
      timeEmitDistance: 5 * 1000,
      mapStyles: {
        height: "400px",
      },
      efenceStatus: false,
      dataOptions,
      bizDataList: [],
      selectedLayer:[],
      loading:false,
      openCity:[],
      empty:true,
      loadData:false,
      exportUrl:'/v1/downloadPrediction',
      baseUrlKey:'_basePrediction'
    };
  },
  components: {
    t3heatMap,
    timeEcharts,
  },
  async mounted() {
    await this.getTypeListFn();
    this.getSavedCity();
    this.initFormData();
    this.getOpenCityListDataFn();
    this.querySearch(false);
  },
  computed: {
    disabledInput() {
      if (this.formData.model === "2") {
        return true;
      }
      return false;
    },
  },
  methods: {
    exportFile(){
      const url = this[this.baseUrlKey] + this.exportUrl
      let message = "";
      message = this.checkParams(this.formData);
      if (message && checkLimit) {
        this.$Message.warning(message);
        return;
      }
      if(!this.checkTimeRange()){
        return
      }
      const params = {};
      for (const k in this.formData) {
        if (this.formData[k]) {
          params[k] = this.formData[k];
        }
      }
      // this.cacheTime();
      // this.startCountDown();
      if (params.timeRange) {
        params.beginTime = moment(params.timeRange[0]).format("YYYYMMDDHHmm");
        params.endTime = moment(params.timeRange[1]).format("YYYYMMDDHHmm");
      }
      if(params.source==='全部'){
        params.source=""
      }
      if(params.carGroup=='全部'){
        params.carGroup=""
      }
      params.bizLineCarType = this.formData["bizLineCarType"].join(",");
      delete params.timeRange;
      delete params.cityIds;
      // exportFile()
      // exportFile(params, '/admin/sysAgent/assessment/result/export', '考核结果')
      let locatiobnUrl = `${url}`
      Object.keys(params).map((item,index)=>{
        if(!index){
          locatiobnUrl+=`?${item}=${params[item]}`
        }else{
          if(Array.isArray(params[item]) ){
            locatiobnUrl+=`&${item}=${params[item].join(",")}`
          }else{
            locatiobnUrl+=`&${item}=${params[item]}`
          }
        }
      })
      if(this.selectedLayer.length && this.dataList.length!==this.selectedLayer.length){
        const hexID = this.selectedLayer.map(k=>k.gridID).join(",")
        if(locatiobnUrl.indexOf("?")>=0){
          locatiobnUrl+=`&hexID=${hexID}`
        }else{
          locatiobnUrl+=`?hexID=${hexID}`
        }
      }
      console.log("locatiobnUrl",locatiobnUrl);
      // 接口改不动，浏览器直接跳转下载，底部无下载进度
      window.location.href=locatiobnUrl
      // axios({
      //   method: 'get',
      //   headers: {
      //     "Authorization": getToken(),
      //     ...headersObject
      //   },
      //   url,
      //   params: params,
      // }).then(function (file) {
      //   console.log("res",file);
      //   let fileNameStr = file.headers["content-disposition"]
      //   let index = fileNameStr.lastIndexOf("\=")
      //   let fileName = fileNameStr.substring(index + 1, fileNameStr.length)
      //   debugger
      //   if (file.data) fileDownload(file.data, `${fileName}`)
      // }).catch(function (error) {
      //   console.log(error)
      // })
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
        this.inputList[1].dropList = openCitys;
      });
    },
    getOpenCityListDataFn(options = {}) {
      const params = {
        currPage: 1,
        pageSize: 10,
        cityCode: this.formData.cityIds[1],
        provinceID: this.formData.cityIds[0],
        ...options,
      };
      getOpencityListData(params).then((res) => {
        if (res.data.success) {
          if(res.data.data.list && res.data.data.list.length){
            this.bizDataList = res.data.data.list.filter(biz=>biz.levelType===1) || [];
          }else{
            this.formData.bizLine = ''
            this.bizDataList = [];
            this.inputList[5].dropList = [];
            this.inputList[4].dropList = []
             this.$Message.warning("当前城市暂未开放");
          }
        }
      });
    },
    changeCity(v,y) {
      if (v) {
        this.formData.cityID = v;
      } else {
        this.formData.cityID = "";
      }
      // 清空业务线和产品线/车型
      this.formData.bizLine = "";
      this.formData.bizLineCarType = [];
      this.formData.carGroup = "";
      if(!v){
        return 
      }
      const cityInfo = this.inputList[1].dropList.find(city=>city.cityID===v)
      this.cityName = cityInfo.city
      const params = {
        cityCode:v,
        provinceID:cityInfo.provinceID,
      }

      this.recieveGeoCode(this.cityName,v);
      this.getOpenCityListDataFn(params);
      // 获取业务线list
    },
    changeBizLine(v) {
      let bizTypeList = [];
      this.formData.bizLineCarType = [];
      this.formData.carGroup = "";
      // 获取产品线/车型list
      if(!v){
        return 
      }
      const selectedBiz = this.bizDataList.find((k) => k.expandBizLine === v);
      this.inputList[4].dropList = selectedBiz.groupVehicleDtoList || [];
      selectedBiz.bizTypeList.map((carType) => {
        let arr = carType.levels.map((c) => {
          return {
            value: `${carType.bizType}#${c.vehicleLevel}`,
            label: `${carType.bizTypeName}-${c.vehicleName}`,
          };
        });
        bizTypeList.push(...arr);
      });
      this.inputList[5].dropList = bizTypeList;
    },
    changeCarGroup(v) {
      let bizTypeList = [];
      if (!v) {
        return;
      }
      const selectedCarGroup = this.inputList[4].dropList.find(
        (k) => k.groupID === v
      );
      selectedCarGroup.bizTypeList.map((carType) => {
        let arr = carType.levels.map((c) => {
          return {
            value: `${carType.bizType}#${c.vehicleLevel}`,
            label: `${carType.bizTypeName}-${c.vehicleName}`,
          };
        });
        bizTypeList.push(...arr);
      });
      this.inputList[5].dropList = bizTypeList;
    },
    changeSource() {
      this.formData.carGroup = "";
      // 获取车型组list
    },
    initFormData() {
      const nowTime = Date.now();
      this.formData = {
        model: "3",
        cityID: "320100",
        cityIds: ["320000", "320100"],
        bizLine: 1,
        source: "全部",
        carGroup:'全部',
        bizLineCarType: "",
        timeRange: [nowTime - 4 * 60 * 60 * 1000 - 15 * 60 * 1000, nowTime - 15 * 60 * 1000],
        bizLineCarType: [],
      };
    },
    getTypeListFn() {
      return getTypeList({})
        .then((res) => {
          if (res.data.success) {
            this.inputList[0].dropList = res.data.data.model;
            // this.inputList[1].dropList = res.data.data.city;
            this.inputList[2].dropList = res.data.data.bizLine;
            this.inputList[3].dropList = res.data.data.source;
            this.openCity = res.data.data.city || [];
            // this.inputList[4].dropList = res.data.data.carGroup;
            // this.inputList[5].dropList = res.data.data.bizLineCarType;
            // this.inputList[6].dropList = res.data.data.timeSlice;
          }
          return false;
        })
        .catch((err) => {
          return false;
        });
    },
    // 校验时间范围
    checkTimeRange() {
      if (
        this.formData.timeRange &&
        this.formData.timeRange[0] &&
        this.formData.timeRange[1]
      ) {
        const [startTime, endTime] = this.formData.timeRange;
        if (moment(endTime).isAfter(moment().subtract(15,"minute"), "minutes")) {
          this.$Message.warning("截止时间不超过当前时间-15分钟");
          return;
        }
        let diffMinitus = moment(endTime).diff(moment(startTime), "minitus");
        if (diffMinitus > 24 * 60 * 60 * 1000) {
          this.$Message.warning("开始时间和结束时间范围不超过24小时");
          return;
        }
        // if (diffMinitus > 4 * 60 * 60 * 1000) {
        //   this.$Message.warning("查询时间范围过长，请耐心等候");
        //   return true;
        // }
        return true;
      }
      return true;
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
    checkParams(queryData = {}) {
      if (!queryData.model) {
        return "请选择模型等必填项";
      }
      if (queryData.model == 1 || queryData.model == 3) {
        if (
          queryData.bizLine &&
          queryData.source &&
          queryData.cityID &&
          queryData.timeRange &&
          queryData.timeRange
        ) {
          return "";
        }
        return "请选择城市、业务线、来源、时间等必选项";
      }
      if (queryData.model == 2) {
        if (
          queryData.cityID &&
          queryData.bizLineCarType.length &&
          queryData.timeRange &&
          queryData.timeRange
        ) {
          return "";
        }
        return "请选择城市、产品线/车型、时间等必选项";
      }
    },
    chooseHex(hexObj={}){
      let newHex = this.dataList.filter(k=>{
        return hexObj[k.gridID]
      })
      if(!newHex.length){
        newHex = this.dataList;
        this.selectedLayer = JSON.parse(JSON.stringify(this.dataList))
      }else{
        this.selectedLayer = JSON.parse(JSON.stringify(newHex))
      }
      console.log("selectedLayer",this.selectedLayer);
       let { hexData, echartData } = this.handleData(newHex);
        // this.dataList = hexData;
        setTimeout(() => {
          // this.$refs["heatMap"].setHexagonData(hexData);
          this.$refs["timeEcharts"].init(echartData);
        }, 100);

    },
    querySearch(checkLimit = true) {
      let message = "";
      message = this.checkParams(this.formData);
      if (message && checkLimit) {
        this.$Message.warning(message);
        return;
      }
      if(!this.checkTimeRange()){
        return
      }
      const params = {};
      for (const k in this.formData) {
        if (this.formData[k]) {
          params[k] = this.formData[k];
        }
      }
      // this.cacheTime();
      // this.startCountDown();
      if (params.timeRange) {
        params.beginTime = moment(params.timeRange[0]).format("YYYYMMDDHHmm");
        params.endTime = moment(params.timeRange[1]).format("YYYYMMDDHHmm");
      }
      if(params.source==='全部'){
        params.source=""
      }
      if(params.carGroup=='全部'){
        params.carGroup=""
      }
      params.bizLineCarType = this.formData["bizLineCarType"].join(",");
      delete params.timeRange;
      delete params.cityIds;
      this.getHexagonList(params);
    },
    handleDrawLayer() {
      this.efenceStatus = true;
      this.$refs["heatMap"].initMouseTool();
    },
    // 清空选择区域
    clearDrawLayer() {
      this.efenceStatus = false;
      this.$refs["heatMap"].clearOverLayer();
      let { hexData, echartData } = this.handleData(this.dataListCacheList);
        // this.dataList = hexData;
        setTimeout(() => {
          // this.$refs["heatMap"].setHexagonData(hexData);
          this.$refs["timeEcharts"].init(echartData);
        }, 100);
    },
    handleData(data) {
      let hexData = [];
      let echartData = {
        predictionFreeCarList: [],
        FreeCarList: [],
        predictCallCntList: [],
        callCntList: [],
        predictGapList: [],
        gapList: [],
        timeData: [],
      };
      let timeData = [];
      let timeDiff = moment(this.formData.timeRange[1]).diff(moment(this.formData.timeRange[0]),'minutes');
      for (let index = 0; index <= timeDiff; index++) {
        let currentTime = moment(this.formData.timeRange[0]).valueOf()+index*60*1000
        echartData.timeData.push(moment(currentTime).format("YYYYMMDDHHmm"))
      }
      for (let index = 0; index < data.length; index++) {
        const hex = data[index];
        let predictGap = 0; // 预计呼叫值
        const obj = {
          ...hex,
          gridID: hex.gridID,
          lat: hex.lat,
          lng: hex.lng,
        };
        // 根据前端时间轴完善数据
        for (let p = 0; p < echartData.timeData.length; p++) {
          const timeStmap = echartData.timeData[p];
          const dataBaseHexpre = hex.prediction.find(prediction=>{
            return prediction.timeStamp == timeStmap
          }) || {}
          if(dataBaseHexpre){
            const prediction = dataBaseHexpre;
            predictGap += (prediction.predictGap || 0);
            let val1 =
              (echartData.predictionFreeCarList[p] || 0) +
              prediction.predictFreeCar || 0;
            let val2 =
              (echartData.FreeCarList[p] || 0) + (prediction.actualFreeCar || 0);
            let val3 =
              (echartData.predictCallCntList[p] || 0) + (prediction.predictCallCnt || 0);
            let val4 =
              (echartData.callCntList[p] || 0) + (prediction.actualCallCnt || 0);
            let val5 =
              (echartData.predictGapList[p] || 0) + (prediction.predictGap || 0);
            let val6 = (echartData.gapList[p] || 0) + (prediction.actualGap || 0);
            // 如果是最后一个围栏
            if (index == data.length - 1) {
              val1 = val1.toFixed(2);
              val2 = val2.toFixed(2);
              val3 = val3.toFixed(2);
              val4 = val4.toFixed(2);
              val5 = val5.toFixed(2);
              val6 = val6.toFixed(2);
            }
            echartData.predictionFreeCarList[p] = val1;
            echartData.FreeCarList[p] = val2;
            echartData.predictCallCntList[p] = val3;
            echartData.callCntList[p] = val4;
            echartData.predictGapList[p] = val5;
            echartData.gapList[p] = val6;
          }
        }
        obj.gap = (predictGap / hex.prediction.length).toFixed(2); // 预测平局值
        hexData.push(obj);
      }
      return {
        hexData,
        echartData,
      };
    },
    getHexagonList(params = {}) {
      this.loading = true
      getHexagonData(params).then((res) => {
         this.loading = false
         this.loadData = true;
         if(!res.data.success){
           return 
         }
        let data = res.data.data
          ? res.data.data.grids
            ? res.data.data.grids
            : []
          : [];
        this.dataListCacheList =  JSON.parse(JSON.stringify(data))
        this.selectedLayer = JSON.parse(JSON.stringify(data))
        let { hexData, echartData } = this.handleData(data);
        this.dataList = hexData;
        if(hexData.length){
          this.empty = false
           setTimeout(() => {
            this.$refs["heatMap"] && this.$refs["heatMap"].setHexagonData(hexData);
            this.$refs["timeEcharts"] && this.$refs["timeEcharts"].init(echartData);
          }, 100);
        }else{
          this.$Message.warning(`暂无数据`);
          this.empty = true
        }
       
      }).catch(err=>{
         this.loading = false
      });
    },
    clearQueryData() {
      this.formData = {
        model: "",
        cityID: "",
        bizLine: "",
        source: "",
        bizLineCarType: "",
        beginTime: "",
        endTime: "",
      };
    },
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
.my-echarts {
  height: 500px;
  margin-top: 20px;
}
.efenceControler {
  margin-right: 40px;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
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
  .empty-data{
    padding: 20px;
    text-align: center;
    padding-top: 100px;
  }
</style>
