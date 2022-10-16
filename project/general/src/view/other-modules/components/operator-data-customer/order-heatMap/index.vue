<!--
 * @description:
 * @author: Tom Dai
 * @date: 2020-06-22 16:42:07
 * @后台人员:
!-->
<template>
    <div>
        <Card>
            <t3heatMap
                :dataList="dataList"
                :isTourData="isTourData"
                :queryType="queryType"
                :centerLoction="cityCenterLocation"
                :efenceList ="efenceList"
                ref="heatMap"
                @cityFuc = "recieveGeoCode"
                @on-changeQuery="changeQueryType"
                @on-changeBusinessType="changeBusinessType"
            ></t3heatMap>
<!--            <t3Slider @on-change="getTime"></t3Slider>-->
        </Card>
    </div>
</template>
<script>
import t3Slider from './components/slider.vue'
import t3heatMap from './components/heatMap.vue'
import { getEfenceForCity, getHexagonData ,getCityCodeList} from '../api/map.js'
export default {
    name: '',
    components: { t3Slider, t3heatMap },
    mounted () {
        this.getCityCode()
        // this.getEfence()
    },
    data () {
        return {
            timenow: '',
            queryType: 1,
            cityCenterLocation: [],
            businessType: 4,
            efenceList: [],
            cityCode: '',
            dataList: [],
            isTourData: 0,
            mockList: [
            ]
        }
    },
    methods: {
        handleGetData () { },
        // 获取时间
        getTime (val) {
            this.timenow = val
            if (this.cityCode) {
                this.getHexagonList()
            }
            // this.getHexagonList()
        },
        // 枚举类型
        changeQueryType (val) {
            this.queryType = val
            this.getHexagonList()
        },
       changeBusinessType(val) {
         this.businessType = val
         console.log("businessType:"+val)
         this.getHexagonList()
       },

       //获取城市编码
        async getCityCode () {
            // let params = {
            //     areaType:2,
            //     authDimension:1,
            //     businessLineList:["1","2","4","6","7"],
            // }
        // await   getCityCodeList(params).then(res => {
        //         this.cityName = res.data.data.openAreaConfigDtoList[0].city
        //         this.cityCode = res.data.data.openAreaConfigDtoList[0].cityId
        //         setTimeout(this.setGeoCenter(),500)
        // })
          setTimeout(this.setGeoCenter(),500)
          //获取围栏
          this.getEfence()
        },
        //设置地图中点
        setGeoCenter(){
          const { cityName } = this.$route.query
                let _this = this
               AMap.plugin('AMap.Geocoder', function () {
                    var geocoder = new AMap.Geocoder({
                        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                        city: cityName
                    })
                    geocoder.getLocation(cityName, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // result中对应详细地理坐标信息
                            // console.log('geo  ',result)
                            _this.cityCenterLocation = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
                            //  _this.$refs['heatMap'].map.setCenter(_this.cityCenterLocation)
                            _this.$refs['heatMap'].map.setZoomAndCenter(12,_this.cityCenterLocation)
                            _this.getHexagonList()

                             _this.$forceUpdate()
                        }
                    })
                })
        },
        recieveGeoCode(cityName,cityCode){
            this.cityName = cityName
            this.cityCode = cityCode
            this.setGeoCenter()
        },
        getEfence () {
            let params = {               
                serviceType: this.businessType,
                cityCode: this.cityCode,
                railType: 1,
                status: 1
            } 
            // getEfenceForCity(params).then(res => {
                // let list = res.data.data.filter( item => item.type === 1)
                // let list = res.data.data
            // })
        },
        getHexagonList () {
          const { businessType, cityCode } = this.$route.query
            let params = {
                // flag: 1,
                businessType,
                queryType: 4,
                // statDate: this.timenow,
                cityCode,
                dataType: 2
                // dataType: this.queryType === 3 ? 1 : 2
            }
            getHexagonData(params).then(res => {
                let data = res.data.data && res.data.data.heatMapInfos ? res.data.data.heatMapInfos : [];
                // let data = res.data.data ? res.data.data : [];
                this.dataList = data
                this.isTourData = res.data.data && res.data.data.isTourData ? res.data.data.isTourData : 0;
                setTimeout(() =>{
                    this.$refs['heatMap'].setHexagonData()
                    this.$refs['heatMap'].creatCenterMarker()
                }, 100)

            })
        }
    }
}
</script>
<style scoped lang='less'>
</style>
