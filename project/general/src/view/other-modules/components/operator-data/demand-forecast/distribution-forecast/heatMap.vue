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
        <div>供</div>
        <div :class="['linerBar','model'+model]"></div>
        <div>需</div>
      </div>
    </div>
    <slot name="loading"> </slot>
  </div>
</template>
<script>
import markerIcon from "../assets/data-center/icon_location.png";
import offFence from "../assets/data-center/icon_fence.png";
import onFence from "../assets/data-center/icon_fence_choosed.png";
import { getEfenceForCity, getCityCodeList } from "_o/api/map.js";
import { mapState } from "vuex";
import { getLonAndLat } from "./helper";
export default {
  name: "",
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    queryType: {
      type: Number,
      default: 1,
    },
    centerLoction: {
      type: Array,
      default: () => {
        return [];
      },
    },
    efenceList: {
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
        return '3'
      }
    },
    loading:{
      type:Boolean,
      default:false
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
      this.hexData =newData;
      // 经纬度去重
      // newData.map((d) => {
      //   if (
      //     !this.hexData.find(
      //       (k) => k.callLng === d.callLng && k.callLat === d.callLat
      //     )
      //   ) {
      //     this.hexData.push({ ...d });
      //   }
      // });
      return newData
    },
  },
  data() {
    return {
      map: null, // 全局地图对象
      mapOption: {
        // 生成地图的对象
        // mapStyle: 'amap://styles/darkblue',
        unit: "meter",
        zoom:12,
        center: this.getCenter, // 经度在前，维度在后
        zooms: [10, 15],
        viewMode: "2D", // 3D会影响围栏绘制
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
        mode: "max",// 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
        style: {
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
              if(Number(gap)>0){
                return "#249670"
              }else if(Number(gap)<0){
                return "#C93A3A"
              }else{
                return "#faebd7"
              }
            }
          },
           radius: 1300,
          opacity: [0.6,1],//透明度从低到高
          //  opacity: [0.66,0.78,1],
          //  opacity: [0.64],
          gap: 20,
          height: [0, 0],
        },

        fitView: true, // 每次渲染更新后，图形是否按照适合屏幕位置展现。也可以通过 setFitView() 主动调用。
      },
      layer: null,
      markerIcon: markerIcon,
      offFence: offFence,
      onFence: onFence,
      marker: null,
      hexData: [],
      innerEfenceList: [],
      windowInfo: null,
      isOpenEfence: true, // 是否开启地图围栏
      bussinessType: 4,
      selCls: "selCls",
      cityName: "",
      selCity: "selCity",
      cityList: [],
      cityCode: "",
      infoWindow: null,
      overlays: [],
      MouseTool: null,
      layerLimit: 1,
      overlaysObj: {},
      multipleStatus: false,
      // bussinessTypeList:[{"name":"快享", "id":4},{"name":"出租车", "id":1}]
    };
  },
  mounted() {
    this.initMapContainer(this.mapOption);
    this.initHexagonLayer();
    window.onkeydown = this.handleKeyDownFn;
    window.onkeyup = this.handleKeyupFn;
  },
  methods: {
    handleKeyDownFn(e) {
      if (e.keyCode === 18) {
        this.multipleStatus = true;
      }
    },
    handleKeyupFn(e) {
      if (e.keyCode === 18) {
        this.multipleStatus = false;
        // 松开ctrol 或option键后筛选六边形数据
        this.searchFilterHex()
      }
    },
    searchFilterHex(){
      this.$emit('choose-hex',this.overlaysObj)
    },
    // 地图对象
    initMapContainer(params) {
      // eslint-disable-next-line no-undef
      debugger
      const $elMap = this.$refs.xcontainer;
      this.map = new AMap.Map($elMap, params);
      this.renderControlPlugin();
    },
    closeInfoWindow() {
      if (this.windowInfo) {
        this.windowInfo.close();
      }
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    },
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
    // 清空选择区域
    clearOverLayer(){
       if(Object.keys(this.overlaysObj).length){
        for (const key in this.overlaysObj) {
          this.removePolygon(this.overlaysObj[key])
        }
        this.overlaysObj = {}
      }
    },
    initHexagonLayer() {
      // let self = this
      if (this.layer) {
        this.map.remove(this.layer)
        this.layer.setMap(null);
        // this.layer.off("click",this.handleLayerClick)
        this.layer._clean()
        this.layer = null;
      }
      this.clearOverLayer()
      this.layer = new Loca.HexagonLayer({
        map: this.map, // 指定要添加的地图实例。
        fitView: true,
        eventSupport: true,
      });
    },
    setHexagonData(hexData) {
      this.initHexagonLayer()
      this.closeInfoWindow();
      if (!this.layer) {
        this.layer = new Loca.HexagonLayer({
          map: this.map, // 指定要添加的地图实例。
          fitView: false,
          eventSupport: true,
        });
      } else {
        // this.layer.setMap(null)
        let arr = JSON.parse(JSON.stringify(hexData));
        if(!arr.length){
          this.layer.setMap(null)
        }
        this.layer.setData(arr, {
          // 设置热点数据
          lnglat: function (obj) {
            const value = obj.value
            return [value["lng"], value["lat"]]
          },
          value: function (obj) {
            let val_return =obj.gap;
            if(Number(val_return)<0){
              val_return = 1 / val_return
            }
            return Number(val_return);
          },
          type: "json",
        });
        this.layer.setOptions(this.layOption);
        this.layer.on("click",this.handlelayerClick);
        this.layer.setFitView()
        this.layer.render();
        // this.createPolygons(arr)
      }
    },
    getLayerPath(lntLat) {
      if (!lntLat[0] || !lntLat[1]) {
        return;
      }
      const latitude = lntLat[1];
      const longitude = lntLat[0];
      let path = [];
      path.push(this.getLatlng(1300, { latitude, longitude }, 0));
      path.push(this.getLatlng(1300, { latitude, longitude }, 60));
      path.push(this.getLatlng(1300, { latitude, longitude }, 120));
      path.push(this.getLatlng(1300, { latitude, longitude }, 180));
      path.push(this.getLatlng(1300, { latitude, longitude }, 240));
      path.push(this.getLatlng(1300, { latitude, longitude }, 300));
      return path;
    },
    handlelayerClick(ev) {
      const lngLat = ev.lngLat;
      if(!this.multipleStatus){
        this.$alert("按住alt或option键后多选")
        return
      }
      ev.rawData.map((row) => {
        const path = this.getLayerPath(lngLat);
        let gridID = row.gridID || `${row.callLng},${row.callLat}`;
        if (this.overlaysObj[gridID]) {
          this.map.remove(this.overlaysObj[gridID]);
          delete this.overlaysObj[gridID];
          return;
        }
        this.createPolygon(path, gridID);
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
    closeMouseTool() {
      let polygons = this.map.getAllOverlays("polygon");
      polygons.length && this.map.remove(polygons);
      this.overlays.length &&
        this.overlays.forEach((item) => {
          this.map.remove(item);
        });
      this.overlays = [];
      this.MouseTool && this.MouseTool.close(true);
      this.MouseTool = null;
    },
    handleMapClick() {
      if (this.overlays.length) {
        this.MouseTool && this.MouseTool.close(false);
      }
    },
    getLatlng(distance, latlngA, angle) {
      // let lng = latlngA.longitude+(distance*Math.sin(angle*Math.PI/180))/(111*Math.cos(latlngA.latitude*Math.PI/180));
      // let lat = latlngA.latitude+(distance*Math.cos(angle*Math.PI/180))/111;
      let path = getLonAndLat(
        latlngA.longitude,
        latlngA.latitude,
        angle,
        distance
      );
      return path;
      // return [lng,lat]
    },
    createPolygon(path, keyLngLat) {
      var polygon = new AMap.Polygon({
        bubble: true,
        map: this.map,
        strokeWeight: 1,
        path: path,
        fillOpacity: 0.3,
        fillColor: "#CCF3FF",
        // strokeColor: '#CC66CC'
      });
      this.overlaysObj[keyLngLat] = polygon;
    },
    createPolygons(arr) {
      for (let index = 0; index < arr.length; index++) {
        let c = arr[index];
        c.path = [];
        c.path.push(
          this.getLatlng(1300, { latitude: c.callLat, longitude: c.callLng }, 0)
        );
        c.path.push(
          this.getLatlng(
            1300,
            { latitude: c.callLat, longitude: c.callLng },
            60
          )
        );
        c.path.push(
          this.getLatlng(
            1300,
            { latitude: c.callLat, longitude: c.callLng },
            120
          )
        );
        c.path.push(
          this.getLatlng(
            1300,
            { latitude: c.callLat, longitude: c.callLng },
            180
          )
        );
        c.path.push(
          this.getLatlng(
            1300,
            { latitude: c.callLat, longitude: c.callLng },
            240
          )
        );
        c.path.push(
          this.getLatlng(
            1300,
            { latitude: c.callLat, longitude: c.callLng },
            300
          )
        );
        this.createPolygon(c.path);
      }
    },
    removePolygon(polygon){
      this.map.remove(polygon)
    },
    initMouseTool() {
      this.MouseTool && this.MouseTool.close(true); // 关闭，并清除覆盖物
      this.MouseTool = null;
      this.MouseTool = new AMap.MouseTool(this.map);
      this.MouseTool.polygon({
        fillColor: "#00b0ff",
        strokeColor: "#80d8ff",
        extData: {
          id: "markerSelf",
        },
      });
      this.map.on("click", this.handleMapClick);
      this.MouseTool.on("draw", (e) => {
        let newarray = [];
        // 筛选围栏选中的六边形
        // this.checkRingRing()
        if (this.overlays.length >= this.layerLimit) {
          this.MouseTool && this.MouseTool.close(false);
        }
        this.overlays.push(e.obj); //记录路径对象
        e.obj &&
          e.obj.getPath().forEach((item) => {
            let latlng = `${item.lng},${item.lat}`;
            newarray.push(latlng);
          });
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
