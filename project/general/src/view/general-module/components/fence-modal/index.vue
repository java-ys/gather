<template>
  <div>
    <Modal
      v-model="isShow"
      :width="700"
      title="查看围栏"
      :mask-closable="false"
      class="fance-modal"
      @on-cancel="$emit('close')"
      @on-ok="$emit('close')">
      <div class="amap-page-container">
        <el-amap
          :center="position"
          :zoom="zoom"
          ref="map">
        </el-amap>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getPenDetail } from '_o/api/configData.js'
export default {
  name: "fance-modal",
  props: {
    show: {
      type: Boolean
    },
    uuid:{
      default: ''
    },
    scopes:{}
  },
  data() {
    return {
      zoom: 9,
      position: [118.52846, 32.222381],
      isShow:this.show,
      eleScopes:''
    };
  },
  mounted(){
  },
  methods: {
    getFenceInfo(data){
      getPenDetail({uuid: data || this.uuid}).then(res => {
        let eleInfo = res.data.data || {}
        this.eleScopes = eleInfo.scope
        this.renderElefence()
      })
    },
    // 添加电子围栏
    renderElefence(scpopes) {
      // 渲染电子围栏
      let map = this.$refs.map.$$getInstance()
      let polygons = map.getAllOverlays("polygon"); // 获取地图上所有得图形区域
      map.remove(polygons); // 清楚地图上的所有图形区域
      
      let scopes = scpopes || this.eleScopes
      let plioylist = scopes.split("&");
      let polyitem = [];
      let ployitemLngLat = [];
      let overlays = []
      plioylist.forEach(ele => {
        if(ele){
          let lonlat = ele.split(";");
          polyitem.push(lonlat);
        }
      });
      polyitem.forEach(item => {
        let currentArray = [];
        item.forEach(i => {
          currentArray.push(i.split(","));
        });
        overlays.push(new AMap.Polygon({
          path: currentArray,
          fillColor: '#2196f3',
          strokeColor: '#2196f3',
          strokeWeight: 2,
          strokeOpacity: 0.8,
          fillOpacity: 0.2,
          zIndex: 1
        }));
      });
      overlays.forEach(item => {
        item.setMap(map);
      });
      map.setFitView(overlays)
    },
  },
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.uuid && this.getFenceInfo()
        this.scopes && this.renderElefence(this.scopes)
      }
    }
  }
};
</script>
<style lang="less">
.amap-page-container{
  width:650px;
  height:450px;
}
</style>
