<!--
 * @description:
 * @author: Tom Dai
 * @date: 2019-12-18 22:08:05
 * @后台人员:
!-->
<template>
  <div class="mapContainer" :style="mapStyles">
    <div class="top-header">
      <slot name="search-list"> </slot>
    </div>
    <div v-show="!loading"> 
      <div class="xcontainer" ref="xcontainer"></div>
        <div class="colorTip">
          <div>{{model==3?'供':'少'}}</div>
          <div :class="['linerBar','model'+model]"></div>
          <div>{{model==3?'需':'多'}}</div>
        </div>
    </div>
    <slot name="loading"> </slot>
  </div>
</template>
<script>
import markerIcon from "../assets/data-center/icon_location.png";
import { mapState } from "vuex";
import {getPointDetailInfoByAmap} from "./util"
export default {
  name: "",
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    centerLoction: {
      type: Array,
      default: () => {
        return [];
      },
    },
    mapStyles: {
      type: Object,
      default: () => {
        return {};
      },
    },
    model:{
      type:[String,Number],
      default(){
        return '1'
      }
    },
    realType:{
       type:[String,Number],
        default(){
          return 0
        }
    },
    loading:{
      type:Boolean,
      default:false
    },
    zoom:{
      type:Number,
      default:10
    },
    center:{
      type:Array,
      default(){
        return []
      }
    }
  },
  computed: {
    ...mapState({
      bussinessTypeList: (state) => state.common.bizTypeList,
    }),
    getCenter() {
      let location = this.centerLoction;
      return location;
    },
  },
  watch: {
    dataList: function (newData, oldData) {
      this.hexData = newData;
    },
    zoom(v){
      this.map && this.map.setZoom(v)
    },
    center(v){
      if(v && v.length==2){
        let oldCenter = this.map.getCenter()
        if(v[0] ===oldCenter.lng && v[1]===oldCenter.lat ){
          return
        }
        this.map && this.map.setCenter(v)
      }
    }
  },
  data() {
    return {
      map: null, // 全局地图对象
      mapOption: {
        // 生成地图的对象
        // mapStyle: 'amap://styles/darkblue',
        zoom: 11,
        center: this.getCenter, // 经度在前，维度在后
        zooms: [10, 15],
        viewMode: "3D",
        mapStyle: "amap://styles/light",
      },
      timeType: "1",
      timeTypeList: [
        {
          id: "1",
          name: "0-15分钟",
        },
        {
          id: "2",
          name: "15-30分钟",
        },
        {
          id: "3",
          name: "30-45分钟",
        },
      ],
      layOption: {
        // 设置热点的样式
        unit: "meter", // 图形长度单位，默认像素。支持 米 meter和像素px。
        mode: "max", // 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
        style: {
          // color: ["#C93A3A",'#faebd7',"#249670"],
          color:(v)=>{
            if(v.rawData[0]){
              const {callCnt,FreeCarCnt,gap} = v.rawData[0];
              // 需求预测
              if(this.model==1){
                return "#C93A3A"
              }
              if(this.model==2){
                return "#249670"
              }
              // 供大于需
              if(gap>0){
                return "#249670"
              }else if(gap<0){
                return "#C93A3A"
              }else{
                return "#faebd7"
              }
            }
          },
          radius: 1300,
          opacity: [0.4,1],//透明度从低到高
          //  opacity: (v)=>{
          //    console.log(v,"v");
          //    return [0.4,1]
          //  },
          //  opacity: [0.64],
          gap:10,
          height: [0, 0],
        },
        zIndex:1,
        fitView: false, // 每次渲染更新后，图形是否按照适合屏幕位置展现。也可以通过 setFitView() 主动调用。
      },
      layer: null,
      markerIcon: markerIcon,
      marker: null,
      hexData: [],
      windowInfo: null,
      selCls: "selCls",
      cityName: "",
      selCity: "selCity",
      cityList: [],
      cityCode: "",
      infoWindow: null,
      overlays: [],
      MouseTool: null,
      gridIDInfoWindow:''
      // bussinessTypeList:[{"name":"快享", "id":4},{"name":"出租车", "id":1}]
    };
  },
  mounted() {
    // this.creatCenterMarker()
    this.initMapContainer(this.mapOption);
    this.initHexagonLayer();
    // this.renderEfence()
  },
  methods: {
    // 地图对象
    initMapContainer(params) {
      // eslint-disable-next-line no-undef
      const $elMap = this.$refs.xcontainer;
      this.map = new AMap.Map($elMap, params);
      this.map.on("dragstart",this.movestartFn),
      this.map.on("moveend",this.moveendFn),
      this.map.on("zoomend", this.zoomendFn);
      this.renderControlPlugin();
      // this.map.on("dragstart", () => {
      //   // 有窗体时关闭窗体
      //   this.closeInfoWindow();
      // });
      // this.map.on("zoomend", () => {
      //   // 有窗体时关闭窗体
      //   this.closeInfoWindow();
      // });
    },
    movestartFn(){
      console.log("movestartFn");
      this.$emit("movestart")
    },
    moveendFn(v){
      const {lat,lng} =this.map.getCenter();
      this.$emit("moveEnd",{lat,lng})
    },
    zoomendFn(v){
      const zoom = this.map.getZoom();
      let center = this.map.getCenter()
      this.$emit("zoomEnd",{zoom,center})
    },
    closeInfoWindow() {
      if (this.windowInfo) {
        this.windowInfo.close();
      }
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    },
    initHexagonLayer() {
      // let self = this
      if (this.layer) {
        this.layer.setMap(null);
        this.layer = null;
      }
      this.layer = new Loca.HexagonLayer({
        map: this.map, // 指定要添加的地图实例。
        fitView: false,
        eventSupport: true,
      });
      if (this.hexData && this.hexData.length > 0) {
        this.layer.setData(this.hexData, {
          // 设置热点数据
          lnglat: function (obj) {
            var val = obj.value;
            let position = new AMap.LngLat(val["callLng"], val["callLat"]);
            return [val["callLng"], val["callLat"]];
          },
          value: function (obj) {
            let val_return = "";
            return Number(val_return);
          },
          type: "json",
        });
        this.layer.render();
      }
    },

    setHexagonData(isUpdate=false) {
      // 更新时infowinow数据同时更新否则关闭
      if(isUpdate){
        if(this.infoWindow && this.gridIDInfoWindow){
          this.updateInfoWindow()
        }
      }else{
        this.closeInfoWindow();
      }
        if (!this.layer) {
          this.layer = new Loca.HexagonLayer({
            map: this.map, // 指定要添加的地图实例。
            fitView: false,
            eventSupport: true,
          });
        } 
         this.layer.off("click",this.layerClick );
        // this.layer.setMap(null)
          // if (this.layer) {
          //   this.layer.off("click")
          //   this.layer.setMap(null);
          //   this.layer = null;
          // }
          // this.layer = new Loca.HexagonLayer({
          //   map: this.map, // 指定要添加的地图实例。
          //   fitView: false,
          //   eventSupport: true,
          // });
        let arr = JSON.parse(JSON.stringify(this.hexData));
        if(!arr.length){
          this.layer.setMap(null);
          this.layer = null;
          return 
        }
        this.layer.setData(arr, {
          // 设置热点数据
          lnglat: function (obj) {
            const value = obj.value
            return [value["lng"], value["lat"]];
          },
          value: (obj)=> {
            let val_return = obj.callCnt;
            if(this.model==1){
              val_return =obj.callCnt;
            }
            if(this.model==2){
              val_return =obj.FreeCarCnt;
            }
            if(this.model==3){
              if(obj.gap<0){
                val_return = 1 /(obj.gap);
              }else{
                val_return = obj.gap;
              }   
            }
            return Number(val_return);
          },
          type: "json",
        });
        this.layer.on("click",this.layerClick );
        this.layOption.zIndex++; 
        this.layer.setzIndex(this.layOption.zIndex++) // 很关键，防止网格中心点位置偏移
        this.layer.setOptions(this.layOption);
        if(!isUpdate){
         this.layer.setFitView()
        }
        this.layer.render();
    },
    layerClick(event){
      let dataObj = {
        callCnt:0,
        FreeCarCnt:0,
        gap:0
      }
      event.rawData.forEach((item) => {
        let carCount = 0;
        dataObj = {
            callCnt :Number(item.callCnt),
            FreeCarCnt : Number(item.FreeCarCnt),
            gap : item.gap, // 供需差
            gridID:item.gridID,
            lng:item.lng,
            lat:item.lat,
            lngLat:event.lngLat
        }
      
      });
      this.createLayerInfoWin(dataObj, event.lngLat);
      this.$emit("layerClick", dataObj);
    },
    updateInfoWindow(){
        const dataObj = this.hexData.find(k=>k.gridID === this.gridIDInfoWindow);
        if(!dataObj){
          return 
        }
        const LngLat = {
          longitude:dataObj.lng,
          latitude:dataObj.lat
        }
        const lngLatArr = [dataObj.lng,dataObj.lat]
        this.createLayerInfoWin(dataObj,lngLatArr)
    },
    async createLayerInfoWin(dataObj, lnglat) {
      const {realType} = this;
      let str = ''
      const lc = await getPointDetailInfoByAmap({longitude:lnglat[0],latitude:lnglat[1]})
      if(this.model==1){
        str = `<div class="info-window-layer"><div>六边形中心点地址:${lc.addressName}</div><div>${realType==1?'实际':'预测'}呼叫数:${dataObj.callCnt}</div></div>`
      }
      if(this.model==2){
        str = `<div class="info-window-layer"><div>六边形中心点地址:${lc.addressName}</div><div>${realType==1?'实际':'预测'}空闲车辆:${dataObj.FreeCarCnt}</div></div>`
      }
      if(this.model==3){
        str = `<div class="info-window-layer">
            <div>六边形中心点地址:${lc.addressName}</div>
             <div>${realType==1?'实际':'预测'}供需差:${dataObj.gap}</div>
              <div>${realType==1?'实际':'预测'}呼叫数:${dataObj.callCnt}</div>
              <div>${realType==1?'实际':'预测'}空闲车辆数:${dataObj.FreeCarCnt}</div>
            </div>`;
      } 
      this.gridIDInfoWindow = dataObj.gridID
      this.infoWindow = new AMap.InfoWindow({
        anchor: "top-left",
        content: str,
      });
      this.infoWindow.open(this.map, lnglat);
      this.infoWindow.on('close',this.clearCacheGridId)
    },
    clearCacheGridId(){
      this.gridIDInfoWindow = "";
      this.infoWindow.off('close')
    },
    // 创建地图重点marker
    creatCenterMarker() {
      // let centerInfo = this.map.getCenter()
      let _this = this;
      AMapUI.loadUI(["misc/PositionPicker"], function (PositionPicker) {
        _this.marker = new PositionPicker({
          mode: "dragMap", // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: _this.map, // 依赖地图对象
          iconStyle: {
            // 自定义外观
            url: _this.markerIcon, // 图片地址
            size: [32, 32], // 要显示的点大小，将缩放图片
            ancher: [24, 40], // 锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
          },
        });
        _this.marker.start();
        // _this.marker.on("success", function (positionResult) {
        //   _this.renderWindowInfo(positionResult);
        // });
        // _this.marker.on("fail", function (positionResult) {
        //   _this.renderWindowInfo(false);
        // });
      });
    },
    // 渲染地理信息窗体
    renderWindowInfo(info) {
      if (info) {
        let pixel = new AMap.Pixel(-8, -50);
        this.windowInfo = new AMap.InfoWindow({
          content: `${info.address}  `,
          position: info.position,
          anchor: "bottom-center",
          offset: pixel,
        });
        this.windowInfo.open(this.map, info.position);
      } else {
        return;
      }
    },
    // 放大控件
    renderControlPlugin() {
      this.map.addControl(
        new AMap.ToolBar({
          // 简易缩放模式，默认为 false
          liteStyle: true,
          position: "LB",
        })
      );
    },
    initMouseTool() {
      let that = this;
      that.MouseTool = new AMap.MouseTool(this.map);
      that.MouseTool.polygon({
        fillColor: "#00b0ff",
        strokeColor: "#80d8ff",
      });
      this.MouseTool.on("draw", (e) => {
        let newarray = [];
        that.overlays.push(e.obj); //记录路径对象
        let item = e.obj;
        e.obj &&
          e.obj.getPath().forEach((item) => {
            let latlng = `${item.lng},${item.lat}`;
            newarray.push(latlng);
          });
        const action = {
          type: 1,
          state: e.obj,
        };
      });
      this.map.on("click", function (e) {
        let lnglat = e.lnglat;
        if (that.overlays.length) {
          let result = true;
          that.overlays.forEach((item) => {
            let isPointInRing = AMap.GeometryUtil.isPointInRing(
              lnglat,
              item.getPath()
            );
            if (isPointInRing) {
              result = false;
            }
          });
          if (!result) {
            that.MouseTool && that.MouseTool.close(false); // 关闭，并清除覆盖物
            that.MouseTool = null;
            setTimeout(() => {
              that.initMouseTool();
            }, 100);
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.mapContainer {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  .xcontainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    /deep/ .info-window-layer {
      padding: 10px 20px 10px 10px;
    }
    /deep/ .amap-info-close {
      right: 5px !important;
    }
  }
  .colorTip {
    position: absolute;
    /* top: 20px; */
    z-index: 99;
    bottom: 25px;
    width: 164px;
    height: 32px;
    right: 35px;
    border-radius: 4px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .linerBar {
      margin-left: 5px;
      margin-right: 5px;
      width: 112px;
      height: 8px;
      &.model1{
        background-image: linear-gradient(
          90deg,
          rgba(153, 34 ,34,0.4) 0%,
          rgba(153, 34 ,34,1) 100%
        );
      }
      &.model2{
         background-image:linear-gradient(
          90deg,
          rgba(20,112, 82,0.4) 0%,
          rgba(20,112, 82,1) 100%,
        );
      }
      &.model3{
        background-image: linear-gradient(
          90deg,
          rgba(20,112, 82,1) 0%,
          rgba(20,112, 82,0.4) 45%,
          rgb(250,235,215,1) 50%,
          rgba(153, 34 ,34,0.4) 60%,
          rgba(153, 34 ,34,1) 100%
        );
      }
      
    }
  }
  .typeControler {
    position: absolute;
    margin: 0 auto;
    z-index: 99;
    top: 10px;
    left: 0;
    right: 0;
    width: 364px;
    cursor: pointer;
    // height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;

    .tabcls {
      width: 120px;
      height: 44px;
      border-radius: 4px;
      border: 1px solid rgba(49, 51, 84, 0.5);
      display: flex;
      justify-content: center;
      background: #fff;
      align-items: center;
    }
    :not(:last-child) {
      border-right: none;
    }
    .activeCls {
      background: #313354;
      color: #fff;
    }
  }
  .timeTypeControler {
    position: absolute;
    z-index: 99;
    top: 10px;
    left: 220px;
    width: 110px;
    height: 60px;
    #selCls {
      height: 40px;
    }
  }
  .efenceControler {
    position: absolute;
    z-index: 99;
    top: 10px;
    background: #fff;
    border-radius: 2px;
    cursor: pointer;
    left: 220px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .efenceControler.haveTime {
    left: 350px;
  }
  .cityNameControler {
    position: absolute;
    z-index: 99;
    top: 10px;
    left: 20px;
    width: 80px;
    height: 60px;
    #selCls {
      height: 40px;
    }
  }
  .bussinessTypeControler {
    position: absolute;
    z-index: 99;
    top: 10px;
    left: 120px;
    width: 80px;
    height: 60px;
    #selCls {
      height: 40px;
    }
  }
  /deep/.ivu-select-large.ivu-select-single .ivu-select-selection {
    height: 40px;
    line-height: 40px;
  }
  .top-header {
    padding: 10px;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 20;
  }
}
</style>
