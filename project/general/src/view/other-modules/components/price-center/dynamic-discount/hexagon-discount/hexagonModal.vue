<template>
  <div>
    <Modal
      v-model="showModal"
      width="1000"
      title="选择六边形"
      draggable
      :z-index="9999"
      @on-visible-change="modalChange"
    >
      <div
        style="font-size:16px"
        class="modal_box"
      >
        <div class="modal_right">
          当前城市:&nbsp;{{propData.cityName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已选择六边形数:&nbsp;
          {{checkedData.length}}
        </div>
        <div class="modal_left">
          <AutoComplete
            v-model="address"
            placeholder="请输入地址"
            style="width:200px"
            @on-change="handleChange"
          >
            <Option
              v-for="(item,index) in addressData"
              :key="index"
              :value="item.name"
              @click.native="handleSelect(item)"
            >
              {{item.name}}
            </Option>
          </AutoComplete>
          <Button
            icon="ios-search"
            @click="handleSelect(1)"
          ></Button>
        </div>
      </div>
      <div class="cityHeatMap">
        <div id="container"></div>
      </div>

      <div slot="footer">
        <Button @click="cancleClose">
          取消
        </Button>
        <Button
          v-lazy-click="saveData"
          type="primary"
        >
          保存
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryMarketSysDynamic,queryHexagonByLngLat } from "_o/api/priceCenter";
export default {
  data() {
    return {
      showModal: true,
      title: "选择六边形",
      map: null, // 全局地图对象
      layer: null, // 蜂窝图层
      checkedData: [], // 选中的六边形集合数据
      propData: {}, // 父组件传入的数据
      addressData: [],
      address: ""
    };
  },
  mounted() {},
  methods: {
    init(val) {
      this.propData = val;
      this.map = new AMap.Map("container", {
        mapStyle: "amap://styles/normal",
        zoom: 12,
        center: [118.812555, 32.079009], // 经度在前,维度在后
        zooms: [4, 20],
        viewMode: "2D"
      });
      // 请求城市六边形数据
      queryMarketSysDynamic({ cityCode: val.cityCode }).then(res => {
        this.mapData = [];
        this.mapData = res.data.data || [];
        // 根据城市名称获取城市中心点
        this.map.setCity(this.propData.cityName, val => {
          // 设置缩放级别和中心点
          this.map.setZoomAndCenter(12, [val[0], val[1]]);
        });

        if (this.mapData.length > 0) {
          this.$nextTick(() => {
            this.getLayer();
          });
        }
      });
    },

    getLayer() {
      this.mapData = JSON.parse(JSON.stringify(this.mapData));
      this.checkedData = JSON.parse(JSON.stringify(this.propData.data)) || [];
      // 编辑的时候 自动选中六边形
      if (this.checkedData.length > 0) {
        this.mapData = this.mapData.map(item => {
          this.checkedData.map(yItem => {
            if (item.hexagonId === yItem.hexagonId) {
              item.isChecked = true;
            }
          });
          return item;
        });
      }
      this.layer = new Loca.HexagonLayer({
        map: this.map, // 指定要添加的地图实例。
        fitView: false, // 每次渲染更新后，图形是否按照适合屏幕位置展现。也可以通过 setFitView() 主动调用。
        eventSupport: true, // 对图层交互事件的响应，默认关闭。开启后可响应鼠标、触屏事件。 如需 selectStyle 生效，也需要开启这里
        collision: false // 是否开启文字自动避让
      });
      this.layer.setData(this.mapData, {
        // 设置热点数据
        lnglat: function(obj) {
          let val = obj.value;
          return [val["lng"], val["lat"]];
        },
        value: 1,
        type: "json"
      });
      this.layer.setOptions({
        // 设置热点的样式
        unit: "meter", // 图形长度单位，默认像素。支持 米 meter和像素px。
        mode: "sum", // 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
        style: {
          color: obj => {
            if (obj.rawData[0].isChecked) {
              return "pink";
            } else {
              return "#ffffff";
            }
          },
          radius: 1220.629, // 蜂窝热力半径，单位：米
          opacity: 0.85, // 图层透明度
          gap: 0, // 网格间距，单位：米
          height: [0, 0],
          borderColor: "#797979"
        }
      });
      this.layer.on("click", e => {
        // 当前选择数据的角标
        let index = e.indexes[0];
        console.log("当前数据", this.mapData[index])
        // 当前选择六边形id
        let currentHexagonId = this.mapData[index].hexagonId;
        if (this.mapData[index].isChecked) {
          this.mapData[index].isChecked = false;
          // 取消选中
          this.checkedData = this.checkedData.filter(item => {
            if (item.hexagonId !== currentHexagonId) {
              return item;
            }
          });
        } else {
          // 选中六边形
          if (this.checkedData.length === 15) {
            this.$Message.warning("最多可选择15个六边形");
            return;
          }
          this.mapData[index].isChecked = true;
          this.checkedData.push({
            hexagonId: currentHexagonId
          });
        }
        this.setStyle();
      });
      this.layer.render();
    },
    setStyle() {
      this.layer.setData(this.mapData, {
        // 设置热点数据
        lnglat: function(obj) {
          let val = obj.value;
          return [val["lng"], val["lat"]];
        },
        value: 1,
        type: "json"
      });
      this.layer.setOptions({
        // 设置热点的样式
        unit: "meter", // 图形长度单位，默认像素。支持 米 meter和像素px。
        mode: "sum", // 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
        style: {
          color: obj => {
            if (obj.rawData[0].isChecked) {
              return "pink";
            } else {
              return "#ffffff";
            }
          },
          radius: 1220.629, // 蜂窝热力半径，单位：米
          opacity: 0.85, // 图层透明度
          gap: 0, // 网格间距，单位：米
          height: [0, 0],
          borderColor: "#797979"
        }
      });
      this.layer.render();
    },
    saveData() {
      if (this.checkedData.length === 0) {
        this.$emit("getSixData", {
          flag: this.propData.flag,
          data: []
        });
        this.$emit("close");
      } else {
        this.$emit("getSixData", {
          flag: this.propData.flag,
          data: this.checkedData
        });
        this.$emit("close");
      }
    },
    modalChange(val) {
      if (!val) {
        this.$emit("close");
      }
    },
    cancleClose() {
      this.$emit("close");
    },
    handleSearch(val) {
        //构造地点查询类
        console.log(this.propData.cityUuid)
        var placeSearch = new AMap.PlaceSearch({ 
            pageSize: 8, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: this.propData.cityUuid, // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            // map: map, // 展现结果的地图实例
            // panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        placeSearch.search(val,(status,result)=>{
          this.addressData=result&&result.poiList?result.poiList.pois:[]
          console.log(result.poiList)
        });
    },
    handleSelect(val) {
      let data= val===1 ? this.addressData[0] : val
      queryHexagonByLngLat({ lng: data.location.lng,lat:data.location.lat }).then(res => {
        console.log(res.data.data)
        if(res.data.data){
          var status=false;
          this.mapData.forEach((item,index)=>{
            if(res.data.data.hexagonId == item.hexagonId){
              this.map.setZoomAndCenter(12, [res.data.data.lng, res.data.data.lat]);
              status=true;
            }
          })
          if(!status){
            this.$Message.warning('无匹配地址');
          }
        }else{
          this.$Message.warning('无匹配地址');
        }
      })
    },
    handleChange(val){
      if(val.length>50){
        this.$nextTick(()=>{
            this.address=val.substring(0,50)
        })
      }
      this.handleSearch(this.address)
    }
  }
};
</script>

<style>
#container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 600px;
}

.cityHeatMap {
  height: 100%;
  width: 100%;
  margin-top: 30px;
}
.modal_box{
  display: flex;
  justify-content: space-between;
}
</style>