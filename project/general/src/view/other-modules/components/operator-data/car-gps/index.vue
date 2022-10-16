<!--
 * @description: 运营数据-车辆GPS
 * @author: wuxuan
 * @date: 2019-07-26 17:48:44
!-->
<template>
  <div class="car-gps">
    <SearchList :inputList="inputList" @on-search="getGPSData" @on-reset="clearQueryData"></SearchList>
    <div class="gps-out">
      <Spin v-if="isSpin" fix  size="large"></Spin>
      <div id="container"></div>
    </div>
  </div>
</template>
<script>
import { inputList } from './fields'
import { timeFormat } from '@/libs/util'
import { axiosCarGPSData } from '_o/api/configData.js'
import car from '_o/assets/images/carstatus/white3.png'
export default {
  name: 'car-gps',
  data () {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      searchData: {},
      map: null, // 地图实例
      marker: null, // 起点终点标记
      isSpin: false, // 是否加载状态
      lineArr: [], // 轨迹经纬度列表
      lineData: []// 轨迹点数据集
    }
  },
  mounted () {
    this.setGPS()
  },
  methods: {
    // 条件搜索后回调方法，入参为搜索条件
    getGPSData (data) {
      // 校验入参是否满足调用接口条件，（vin码、车牌不能同时空，时间段不能相同且相差小于24h）
      if ((!data.vin) && (!data.plateNum)) {
        this.$Message.warning('请先填写VIN或车牌号')
        return false
      }
      if (!data.startTime || !data.endTime) {
        this.$Message.warning('请先选择时间段')
        return false
      }
      if (data.startTime == data.endTime) {
        this.$Message.warning('时间段开始时间和结束时间不能相同')
        return false
      }
      let differ = (data.endTime - data.startTime) / 1000 / 60 / 60
      if (differ > 24) {
        this.$Message.warning('时间段不能相差24小时')
        return false
      } else {
        data.endTime = timeFormat(data.endTime, 'yyyy-mm-dd')
        data.startTime = timeFormat(data.startTime, 'yyyy-mm-dd')
      }
      this.isSpin = true
      // 调用查询接口，查到数据调用绘画轨迹fun，接口出错需要将loading变为false，清空数据
      axiosCarGPSData(data).then(res => {
        let resData = res.data.data
        let list = []
        resData.forEach(item => {
          list.push([item.longitude, item.latitude])
        })
        this.isSpin = false
        this.lineArr = list
        this.lineData = resData
        if (resData.length === 0) {
          this.$Message.error(res.data.msg)
        }
        this.setGPS()
      }).catch(err => {
        this.lineArr = []
        this.isSpin = false
        this.marker = null
        this.setGPS()
      })
    },
    // 点击清空
    clearQueryData () {
      this.searchData = {}
      this.lineArr = []
      this.marker = null
      this.setGPS()
    },
    // 绘画轨迹方法
    setGPS () {
      let that = this
      let planColor = '#3894ff'
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 15
      })
      let len = this.lineArr.length
      // 轨迹点数大于0，绘画
      if (len > 0) {
        that.marker = new AMap.Marker({
          map: that.map,
          position: that.lineArr[0],
          icon: car,
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle: -90
        })
        // 起点终点点标记
        let markStart = that.setMarker(that.lineArr[0], '起')
        let markEnd = that.setMarker(that.lineArr[len - 1], '终')
        that.map.add([markStart, markEnd])

        // 巡航轨迹
        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (
          PathSimplifier,
          $
        ) {
          if (!PathSimplifier.supportCanvas) {
            that.$Message.error('当前环境不支持 Canvas！')
            return
          }
          // 轨迹配置
          var planPathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: that.map, // 所属的地图实例

            getPath: function (pathData, pathIndex) {
              return that.lineArr
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              if (pointIndex >= 0) {
                // point hover显示点的时间
                return timeFormat(that.lineData[pointIndex].timestamp, 'yyyy-mm-dd')
              }

              return false
            },
            autoSetFitView: true,
            renderOptions: {// 轨迹样式
              pathNavigatorStyle: {
                initRotateDegree: 0,
                width: 30,
                height: 15,
                autoRotate: true,
                lineJoin: 'round',
                content: '',
                fillStyle: planColor,
                strokeStyle: planColor,
                lineWidth: 1
              },
              pathLineStyle: {
                lineWidth: 6,
                strokeStyle: planColor
              },
              pathLineHoverStyle: {
                strokeStyle: planColor
              },
              pathLineSelectedStyle: {
                lineWidth: 6,
                borderWidth: 0,
                strokeStyle: planColor
              }
            }
          })
          planPathSimplifierIns.setData([
            {
              name: '车辆gps',
              points: [],
              path: that.lineArr
            }
          ])
        })
      }
    },
    // 点标记样式绘制
    setMarker (item, content) {
      let markerItem = new AMap.Marker({
        position: new AMap.LngLat(
          item[0],
          item[1]
        ),
        // 将一张图片的地址设置为 icon
        content: `<div class="map-icon blue-icon">
          <div class="map-icon-top">${content}</div>
          <div class="map-icon-line"></div>
          <div class="map-icon-point"></div>
        </div>`,
        offset: new AMap.Pixel(-13, -30)
      })
      return markerItem
    }
  }
}
</script>
<style lang="less" src="./index.less"></style>
<style lang="less" scoped>
  #container{
    height:76vh;
    margin-top:10px;
    /deep/ .amap-maps{
      height:76vh;
    }
  }
  .car-gps{
    height:100%;
    overflow: hidden;
  }
  .gps-out{
    position: relative;
  }
</style>
