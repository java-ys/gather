
<!--
 * @description:
 * @author: Tom Dai
 * @date: 2019-12-18 22:08:05
 * @后台人员:
!-->
<template>
    <div class="mapContainer">
        <div id="xcontainer"></div>
        <div class="colorTip">
            <div>少</div>
            <div class="linerBar"></div>
            <div>多</div>
        </div>
        <!-- <div class="typeControler">
            <div
                class="tabcls"
                :class="{activeCls: queryType == item.type}"
                v-for="(item,index ) in queryMap"
                :key="index"
                @click="emitQuery(item.type)"
            >
            <Tooltip :content="item.dec" placement="top" transfer>
                {{item.text}}
            </Tooltip>
            </div>
        </div> -->
        <div class="cityNameControler">
            <Select
                v-model="cityCode"
                style="height:40px"
                size="large"
                :element-id='selCity'
            >
                <Option v-for="(item, index) in cityList"
                :value="item.cityId"
                @click.native="setCity(item)"
                :key="index">{{item.city}}</Option>
            </Select>
        </div>

        <div class="bussinessTypeControler">
            <Select
                v-model="bussinessType"
                style="height:40px"
                size="large"
                :element-id='selCls'
            >

              <Option v-for="(item, index) in bussinessTypeList"
                      :value="item.value"
                      @click.native="setProductId(item)"
                      :key="index">{{item.label}}</Option>
            </Select>
        </div>
        <div class="timeTypeControler" v-if="isTourData===1">
            <Select
                v-model="timeType"
                style="height:40px"
                size="large"
                :element-id='selCls'
            >

              <Option v-for="(item, index) in timeTypeList"
                      :value="item.id"
                      @click.native="setTimeId(item)"
                      :key="index">{{item.name}}</Option>
            </Select>
        </div>
        <div
            :class="{efenceControler: true, haveTime: isTourData===1}"
            @click="handleControlEfence"
        >
            <img
                :src="!isOpenEfence? onFence: offFence"
                style="height:80%;width:auto"
            >
        </div>
    </div>
</template>
<script>
import markerIcon from '../assets/data-center/icon_location.png'
import offFence from '../assets/data-center/icon_fence.png'
import onFence from '../assets/data-center/icon_fence_choosed.png'
import { getEfenceForCity ,getCityCodeList} from '_o/api/map.js'
import { mapState } from "vuex";
export default {
    name: '',
    props: {
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        },
        isTourData: {
            type: Number,
            default: 0
        },
        queryType: {
            type: Number,
            default: 1
        },
        centerLoction: {
            type: Array,
            default: () => {
                return []
            }
        },
        efenceList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {
        ...mapState({
            bussinessTypeList: state => state.common.bizTypeList,
        }),
        getCenter () {
            let location = this.centerLoction
            return location
        }
    },
    watch: {
        'dataList': function (newData, oldData) {
            this.hexData = newData
        },
        'isTourData': function (newData, oldData) {
            this.isTourData = newData
        },
        efenceList: function (newData, oldData) {
            this.innerEfenceList = newData
        }
    },
    data () {
        return {
            map: null, // 全局地图对象
            mapOption: {
                // 生成地图的对象
                // mapStyle: 'amap://styles/darkblue',
                zoom: 12,
                center: this.getCenter, // 经度在前，维度在后
                zooms: [11, 15],
                viewMode: '3D',
                mapStyle: 'amap://styles/light'
            },
            timeType: "1",
            timeTypeList: [
                {
                    id: "1",
                    name: "0-15分钟"
                },{
                    id: "2",
                    name: "15-30分钟"
                },{
                    id: "3",
                    name: "30-45分钟"
                }
            ],
            layOption: {
                // 设置热点的样式
                unit: 'meter', // 图形长度单位，默认像素。支持 米 meter和像素px。
                mode: 'sum', // 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
                style: {
                    color: ['#f88c44'],
                    radius: 1300,
                    opacity: [0.05, 0.9],
                    gap: 10,
                    height: [0, 0]
                },

                fitView: true // 每次渲染更新后，图形是否按照适合屏幕位置展现。也可以通过 setFitView() 主动调用。
            },
            layer: null,
            markerIcon: markerIcon,
            offFence: offFence,
            onFence: onFence,
            marker: null,
            hexData: [],
            innerEfenceList: [],
            windowInfo: null,
            queryMap: [
                { text: '订单需求', type: 1, dec: '呼叫订单数热力图' },
                { text: '运力需求', type: 2, dec: '长时间未接订单热力图' },
                { text: '车辆运力', type: 3, dec: '在线车辆数热力图' }
            ],
            isOpenEfence: true, // 是否开启地图围栏
            bussinessType: 4,
            selCls: 'selCls',
            cityName:'',
            selCity:'selCity',
            cityList:[],
            cityCode:'',
            infoWindow:null,
            overlays:[],
            // bussinessTypeList:[{"name":"快享", "id":4},{"name":"出租车", "id":1}]
        }
    },
    mounted () {
        // this.creatCenterMarker()
        this.getCityList()
        this.initMapContainer(this.mapOption)
        this.initHexagonLayer()
        // this.renderEfence()
    },
    methods: {
        // 地图对象
        initMapContainer (params) {
            // eslint-disable-next-line no-undef
            let _this = this
            this.map = new AMap.Map('xcontainer', params)
            this.renderControlPlugin()
            this.map.on('dragstart', function (e) {
                // 有窗体时关闭窗体
                // this.judgeMassCluster()
                if (_this.windowInfo) {
                    _this.windowInfo.close()
                }
                if(_this.infoWindow){
                    _this.infoWindow.close()
                }
            })
            this.map.on('zoomend', function (e) {
                // 有窗体时关闭窗体
                // this.judgeMassCluster()
                if (_this.windowInfo) {
                    _this.windowInfo.close()

                }
                if(_this.infoWindow){
                    _this.infoWindow.close()
                }
            })
        },
        initHexagonLayer () {
            // let self = this
            if (this.layer) {
                this.layer.setMap(null)
                this.layer = null
            }
            this.layer = new Loca.HexagonLayer({
                map: this.map, // 指定要添加的地图实例。
                fitView: false,
                eventSupport: true
            })
            let isTourData = this.isTourData;
            if (this.hexData && this.hexData.length > 0) {
                let timeType = this.timeType;
                this.layer.setData(this.hexData, {
                    // 设置热点数据
                    lnglat: function (obj) {
                        var val =  obj.value
                        let position = new AMap.LngLat(val['callLng'], val['callLat'])
                        return [val['callLng'], val['callLat']]
                    },
                    value: function (obj) {
                        let val_return = "";
                        if (isTourData) {
                            val_return = obj.tourPreDataMap[timeType]["preOrderNum"];
                        } else {
                            val_return = obj.routeCount;
                        }
                        return Number(val_return)
                    },
                    type: 'json'
                })
                this.layer.render()
            }
        },
        setHexagonData () {
            let _this = this;
            if (!this.layer) {
                //
                // return
                // donothing
            } else {
                // this.layer.setMap(null)
                let timeType = this.timeType;
                let arr = JSON.parse(JSON.stringify(this.hexData));
                if (this.isTourData) {
                    arr = [];
                    this.hexData.forEach(item => {
                        let obj = {...item};
                        if (obj.tourPreDataMap[1]) {
                            arr.push(obj);
                        }
                    })
                }
                this.layer.setData(arr, {
                    // 设置热点数据
                    lnglat: function (obj) {
                        let val = obj.value
                        let position = new AMap.LngLat(val['callLng'], val['callLat'])
                        return [val['callLng'], val['callLat']]
                    },
                    value: function (obj) {
                        let val_return = "";
                        if (_this.isTourData) {
                            val_return = obj.tourPreDataMap[timeType]["preOrderNum"];
                        } else {
                            val_return = obj.routeCount;
                        }
                        return Number(val_return)
                    },
                    type: 'json'
                })
                let _this = this
                this.layer.on('click', function(event) {
                    let count = '';
                    let carCount = '';
                    event.rawData.forEach(item=>{
                        let routeCount = "";
                        let carCount_this = "";
                        if (_this.isTourData) {
                            routeCount = item.tourPreDataMap[timeType]["preOrderNum"];
                            carCount_this = item.tourPreDataMap[timeType]["preGap"];
                        } else {
                            routeCount = item.routeCount;
                            carCount_this = item.carCount;
                        }
                        count = Number(count) + Number(routeCount)
                        carCount = Number(carCount_this)
                    })
                   _this.infoWindow = new AMap.InfoWindow({
                            anchor: 'top-left',
                            content: _this.isTourData ? "预估呼叫数：" + count + "&nbsp;&nbsp;&nbsp;&#10; 预估缺车数：" + carCount + "&nbsp;&nbsp;&nbsp;" : "订单数：" + count + "&nbsp;&nbsp;&nbsp;&#10; 车辆数：" + carCount + "&nbsp;&nbsp;&nbsp;",
                    });
                    _this.infoWindow.open(_this.map,event.lngLat)

                })
                this.layer.setOptions(this.layOption)

                // this.layer.setFitView()
                this.layer.render()
            }
        },
        // 创建地图重点marker
        creatCenterMarker () {
            // let centerInfo = this.map.getCenter()
            let _this = this
            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                _this.marker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: _this.map, // 依赖地图对象
                    iconStyle: {
                        // 自定义外观
                        url: _this.markerIcon, // 图片地址
                        size: [32, 32], // 要显示的点大小，将缩放图片
                        ancher: [24, 40] // 锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                    }
                })
                _this.marker.start()
                _this.marker.on('success', function (positionResult) {
                    _this.renderWindowInfo(positionResult)
                })
                _this.marker.on('fail', function (positionResult) {
                    _this.renderWindowInfo(false)
                })
            })
        },
        // 渲染地理信息窗体
        renderWindowInfo (info) {
            if (info) {
                let pixel = new AMap.Pixel(-8, -50)
                this.windowInfo = new AMap.InfoWindow({
                    content: `${info.address}  `,
                    position: info.position,
                    anchor: 'bottom-center',
                    offset: pixel
                })
                this.windowInfo.open(this.map, info.position)
            }else{
                return
            }
        },
        // 放大控件
        renderControlPlugin () {
            this.map.addControl(
                new AMap.ToolBar({
                    // 简易缩放模式，默认为 false
                    liteStyle: true,
                    position: 'LB'
                })
            )
        },
        renderEfence () {
            this.overlays = []
            let params = {
                serviceType: this.bussinessType,
                cityCode: this.cityCode,
                railType: 1,
                status: 1
            }
            getEfenceForCity(params).then(res => {
                    let fenceList = res.data.data
                    fenceList.forEach(item => {
                        let plioylist = item.scope.split('&')
                        let polyitem = []
                        plioylist.forEach(ele => {
                            let lonlat = ele.split(';')
                            polyitem.push(lonlat)
                        })
                        polyitem.forEach(atom => {
                            let currentArray = []
                            atom.forEach(i => {
                                currentArray.push(i.split(','))
                            })
                            this.overlays.push(
                                new AMap.Polygon({
                                    path: currentArray,
                                    fillColor: '#008AFF',
                                    strokeColor: '#008AFF',
                                    strokeWeight: 2,
                                    strokeStyle: 'dashed',
                                    strokeOpacity: 0.3,
                                    fillOpacity: 0.15,
                                    zIndex: 1,

                                })
                            )
                        })
                    })
                    this.map.add(this.overlays)

            })
        },
        // 选择城市
        setCity(item){
            this.cityName = item.city
            this.cityCode = item.cityId
            this.isOpenEfence = true
            // this.$parent.recieveGeoCode(this.cityName,this.cityCode)
            this.$emit('cityFuc',this.cityName,this.cityCode)
        },
        setProductId(item){
            this.$emit('on-changeBusinessType', item.value)
        },
        setTimeId(item) {
            this.setHexagonData();
            this.creatCenterMarker();
        },
        getCityList(){
             let params = {
                areaType:2,authDimension:1,businessLineList:["1","2","4","6","7"],
            }
            getCityCodeList(params).then(res=>{
               this.cityList = res.data.data.openAreaConfigDtoList
               this.cityName = this.cityList[0].city
               this.cityCode = this.cityList[0].cityId

            })
        },
        // 操作
        handleControlEfence () {
            this.isOpenEfence = !this.isOpenEfence
            if (this.isOpenEfence && this.overlays) {
                this.clearEfence()
            } else {
                this.renderEfence()
            }
        },
        emitQuery (val) {
            this.$emit('on-changeQuery', val)
        },
        clearEfence () {
            this.map.remove(this.overlays)
        }

    }
}
</script>
<style scoped lang='less'>
.mapContainer {
    position: relative;
    width: 100%;
    height: 80vh;
    overflow: hidden;
    #xcontainer {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        position: absolute;
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
            background-image: linear-gradient(
                90deg,
                rgba(255, 133, 51, 0.1) 3%,
                rgba(255, 133, 51, 0.9) 100%
            );
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
    .cityNameControler{
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
}
</style>
