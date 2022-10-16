<template>
<div>
  
  <Modal
    v-model="showModal"
    :title="title"
    width="850px"
    :z-index="1"
    :mask-closable="false"
  >
    <Form
      ref="form"
      :class="fromSource== 3 ? 'formCenter formItem_margin0' : 'formCenter'"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
    >
      <FormItem
        label="城市："
        prop="provinceCityCode"
      >
        <Cascader
          v-if="fromSource !== 3"
          v-model="formData.provinceCityCode"
          @on-change="initFence"
          :data="provinceCityList"
          trigger="hover"
          filterable
          :clearable="false"
          placeholder="请选择城市"
          class="city_item"
        ></Cascader>
        
        <template
          v-else
        >
          <div>{{ formData.provinceCityCodeName }}</div>
        </template>
      </FormItem>

      <FormItem
        label="策略名称："
        prop="ruleName"
      >
        <Input 
        v-if="fromSource !== 3"
        :maxlength="30"
        show-word-limit
        v-model="formData.ruleName"
        class="width200"
        placeholder="请输入策略名称" 
        />
        <template
          v-else
        >
          <div>{{ formData.ruleName }}</div>
        </template>
      </FormItem> 

      <FormItem
        label="策略类型："
        prop="strategyType"
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.strategyType"
          class="width200"
          placeholder="请选择策略类型"
          @on-change="selectedstrategyType"
        >
          <Option
            v-for="item in clList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
        
        <template
          v-else
        >
          <div>{{ formData.strategyType }}</div>
        </template>
      </FormItem> 
      
      <!-- <FormItem
        label="司机首次进入限行区域后可畅行"
        prop="travelDay"
        class="travelfreely_item"
        v-if="showtravelDayBlock"
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.travelDay"
          placeholder="请选择天数"
          class="free_item"
        >
          <Option
            v-for="item in travelDayList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
        
        <template
          v-else
        >
          <div class="displayInB">{{ formData.travelDay }}</div>
        </template>
        <span class="freeDay">天</span>
      </FormItem>  -->
      
      <FormItem        
        label="司机首次进入限行区域后,连续行驶时间最长不得超过"
        prop="limitDay"
        class="travelfreely_item_1"
        v-if="showtravelDayBlock"      
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.limitDay"
          placeholder="请选择天数"
          class="free_item"
          style="width: 200px"
        >
          <Option
            v-for="item in limitDayList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
        
        <template
          v-else
        >
          <div class="displayInB">{{ formData.limitDay }}</div>
        </template>
        <span class="freeDay">天,再次驶入需要间隔相同天数。</span>
      </FormItem> 
      
      <!-- <FormItem
        label="针对车辆："
        prop="forCar"
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.forCar"
          class="width200"
          placeholder="请选择针对车辆"
          multiple
          :max-tag-count="1"
        >
          <Option
            v-for="item in forCarList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>

        <template
          v-else
        >
          <div>{{ formData.forCar }}</div>
        </template>
      </FormItem>

      <FormItem
        label="燃料类型："
        prop="fuelTypes"
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.fuelTypes"
          class="width200"
          placeholder="请选择燃料类型"
          multiple
          :max-tag-count="1"
        >
          <Option
            v-for="item in fuelTypesList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
        
        <template
          v-else
        >
          <div>{{ formData.fuelTypes }}</div>
        </template>
      </FormItem>  -->
      
      <FormItem
        label="电子围栏："
        prop="fenceNameUuid"
      >
        <Select
          v-if="fromSource !== 3"
          v-model="formData.fenceNameUuid"
          class="width200"
          placeholder="请选择电子围栏"
          @on-change="changefenceName"
        >
          <Option
            v-for="item in fenceNameUuidList"
            :key="item.uuid"
            :value="item.uuid"
            :label="item.name"
          >
          </Option>
        </Select>
        <template
          v-else
        >
          <div>{{ formData.fenceName }}</div>
          <a class="checkMap" @click="mapModalShow">地图查看</a>
        </template>
      </FormItem> 
    </Form>

    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="submit">确认</Button>
    </div>
  </Modal>

  <!--详情 查看电子围栏 -->
  <Modal
    v-model="mapModal"
    title="查看电子围栏"
    width="850px"
    :z-index="1"
    :mask-closable="false"
  >
  <!-- 
      :events="mapData.events" -->

    <el-amap
      ref="map"
      :id="domId"
      vid="amapDemo"
      class="amap-demo"
      style="width: 100%;height: 400px;"
    ></el-amap>

  </Modal>
</div>
</template>

<script>
import '@/styles/cyk-style.css'
import {
  axiosPriorityStrategySave,
  axiosPriorityStrategyUpdate,
} from "_o/api/configData.js";
import { nonSave, nonUpdate, fetchFenceList, fetchLngLatList } from "_o/api/non-license-strategy.js"
import twoRuleVue from '../../../work-shift-manager/work-rule/twoRule.vue';
import { automationInitData } from '../../strategy-control/components/fields';

export default {
  name: "handle",
  props: ["provinceCityList"],
  data() {
    let self = this;
    
    // 行N限N(非车牌类限制策略) 畅行天数 限制天数
    const travelDayList = () => {
      let dayList = 31
      let newList = []
      for(let i=1; i<=31; i++){
        newList.push({label: i, value:  i})
      }
      return newList
    };

    const limitDayList = () => {
      let dayList = 31
      let newList = []
      for(let i=1; i<=31; i++){
        newList.push({label: i, value:  i})
      }
      return newList
    };
  
    return {
      showModal: false,
      title: "新增策略",
      uuid: "",
      editCityCode: "",
      fromSource: "", // 1.新增 2.编辑 3.详情
      formData: {}, // 简单表单数据 
      formValidate: {
        provinceCityCode: [{ required: true, message: "请选择城市", type: "array", trigger: 'change' }],
        provinceCityCodeName: [{ required: true, trigger:'blur' }],
        ruleName: [{ required: true, message: "请选择策略名称", type: "string", trigger: 'blur' }],
        strategyType: [{ required: true, message: "请选择策略类型", type: "number", trigger: 'change' }],
        // travelDay: [{ required: true, message: "请选择畅行天数", type: "number", trigger: 'change' }],
        limitDay: [{ required: true, message: "请选择限制天数", type: "number", trigger: 'change' }],
        // forCar: [{ required: true, message: "请选择针对车辆", type: "array", trigger: 'change' }],
        // fuelTypes: [{ required: true, message: "请选择燃料类型", type: "array", trigger: 'change' }],
        fenceNameUuid: [{ required: true, message: "请选择电子围栏", trigger: 'change' }],
      },
      productOptions: [ //产品线 下拉选项
        {label: '快享', value: 1},
        {label: '专享', value: 2},
        {label: '出租车', value: 3},
        {label: '企业用车', value: 4}
        ], 
      clList: [ //策略类型
        {label: '行N限N', value: 1},
      ],
      // travelDayList: travelDayList(), ////畅行天数
      limitDayList: limitDayList(), //限制天数
      // forCarList: [ //针对车辆
      //   {label: '本地车辆', value: 1},
      //   {label: '外地车辆', value: 2},
      // ],
      fenceNameUuidList: [ //电子围栏
        // {label: '电子围栏1', value: 1},
        // {label: '电子围栏2', value: 2},
      ],
      // fuelTypesList: [ //燃料类型
      //   {label: '汽油', value: "1"},
      //   {label: '纯电动', value: "3"},
      //   {label: '油电混合', value: "11"},
      // ],
      showtravelDayBlock: false, //标识- 选择策略类型，显示2个travelDay下拉block
      mapModal: false, //查看电子围栏 modal
      mapData: {
        // zoom: 4, // 地图显示级别//全国范围
        markers: [],
        markerRefs: [],
        // events: {
        //   init (o) {
        //     console.log(21,o)
        //     // self.maps = self.$refs.map.$$getInstance()
        //   }
        // }
      },
      fenceUuid: '', //围栏uuid
      list: [], //坐标点集合
      domId: "map-container", // 地图domid
      map: null,
      polygons: null
    };
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.off("mouseout");
      this.map && this.map.destroy();
      this.map = null;
    }
  },
  methods: {
    initFence(value) {
      if(!value)return
      let params = {
        "cityCode": value[1],
        "status": 1,
        "railType": 19,
      }
      this.fenceNameUuidList = []
      fetchFenceList(params).then((res) => {
        let response = res.data.data || []
        this.fenceNameUuidList = response
        if(response.length === 0){
          this.formData.fenceNameUuid && (this.formData.fenceNameUuid = '')
        }
      });
    },
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.showtravelDayBlock = false 
      // 新增
      if (!val) {
        this.title = "新建非号牌类限制策略";
        this.fromSource = 1;

        this.formData = {
          provinceCityCode: [], // 城市编码
          ruleName:'',
          strategyType:'',
          // travelDay:'',
          limitDay:'',
          // forCar:'',
          // fuelTypes:'',
          fenceNameUuid:'',
          fenceName:''
        };

      }
      // 编辑/详情
      else {
        this.title = "编辑非号牌类限制策略";
        this.fromSource = 2;
        this.uuid = val.uuid;
        
        this.showtravelDayBlock = twoRuleVue
        let obj = val.nonNumberPlateDto
        let cur_cityCode = this.returnCity(val)

        this.formData = {
          provinceCityCode: [cur_cityCode.provinceID, val.cityCode], // 城市编码
          ruleName: val.ruleName,
          strategyType: obj.strategyType,
          // travelDay: obj.travelDay ? obj.travelDay : null,
          limitDay: obj.limitDay ? obj.limitDay : null,
          // forCar: obj.forCar,
          // fuelTypes: obj.fuelTypes,
          fenceNameUuid: obj.fenceUuid,
          fenceName: obj.fenceName,
        };
        
        if(this.fromSource === 2){ //编辑时,请求围栏下拉数据
            this.initFence(this.formData.provinceCityCode);
        }

        if (val.isDetail) {
          this.formData = {}
          this.title = "非号牌类限制策略详情";
          this.fromSource = 3;
          
          this.formData = {
            provinceCityCodeName: val.cityName , // 城市编码
            ruleName: val.ruleName,
            strategyType: "行N限N",
            // travelDay: val.nonNumberPlateDto.travelDay,
            limitDay: val.nonNumberPlateDto.limitDay || '',
            // forCar: this.format_detailList(1,val.nonNumberPlateDto.forCar),
            // fuelTypes: this.format_detailList(2,val.nonNumberPlateDto.fuelTypes),
            fenceNameUuid: val.nonNumberPlateDto.fenceUuid,
            fenceName: val.nonNumberPlateDto.fenceName,
          };  
          
        }
        this.editCityCode = val.cityCode;
        this.fenceUuid = val.nonNumberPlateDto.fenceUuid
      }
    },
    returnCity(val) { //取出符合条件的city obj
        let cur_cityCode = null 
        this.provinceCityList.map(item => {
          item.citys.find(o => {
            if(o.cityID === val.cityCode){
              return cur_cityCode = item
            }
          })
        })
      if(cur_cityCode){
        return cur_cityCode
      }
    },
    // format_detailList(idx, forCar) {
    //   let forCarList = []
    //   forCar.map(item => {
    //     let itemName = null
    //     if( idx === 1 ){
    //       itemName = item === 1 ? "本地车辆" : "外地车辆"
    //     }
    //     if( idx === 2 ){
    //       if(item === "1"){
    //         itemName = "汽油"
    //       }else if(item === "3"){
    //         itemName = "纯电动"
    //       }else if(item === "11"){
    //         itemName = "油电混合"
    //       }
    //     }
    //     forCarList.push(itemName)
    //   })

    //   let forCarName = forCarList.join("、")
    //   return forCarName
    // },
    selectedstrategyType() {
      this.showtravelDayBlock = true
    },
    mapModalShow() {
      
      this.mapModal = true
      fetchLngLatList({uuid: this.fenceUuid}).then((res) => {
          // let objArray = []; // 围栏经纬度集合 eg: [[[Lng, lat], ...], ...]
            // let newArray = []; // 所有点集合
        let str = res.data.data.scope
        let objArray = []
        let newArray = str.split(";") 
        newArray.forEach(item => {
            let arraybox = [];
            let a = item.split(",")
            a.forEach( j => {
              arraybox.push(j);
            })
            objArray.push(arraybox);
        });
        this.ftScopeData( objArray, () => { this.renderScopeMap(); });        
      });

    },
    ftScopeData(arr=[], callback) {
        this.list = [arr];
        if (callback) callback();
    },
    renderScopeMap() {
        if (this.polygons) {
            this.polygons.clearOverlays();
            this.polygons.setMap(null);
            this.polygons = null;
            if (!this.list || this.list.length === 0) return false;
        }
        this.polygons = new AMap.OverlayGroup(); // 初始化电子围栏 
        this.list.forEach(item => { //[[[Lng, lat]]]
            const polygon = new AMap.Polygon({
                path: item,
                fillColor: "#008AFF",
                strokeColor: "#008AFF",
                strokeWeight: 2,
                strokeOpacity: 1,
                fillOpacity: 0.1,
                zIndex: 8
            })
            this.polygons.addOverlay(polygon);
        });
        this.polygons.setMap(this.map);
        this.map.setFitView(); // 视口自适应
    },  
    // 初始化地图
    initMap () {
      this.map = new AMap.Map(this.domId, {
          resizeEnable: true,
          zooms: [1, 19],
          labelzIndex: 111,
          mapStyle: "amap://styles/c8eaf9b19a5ad463c2b3c87c67272320"
      })
    },
    changefenceName(v) {
      if(!v)return
      let obj = this.fenceNameUuidList.find( o => o.uuid === v)
      this.formData["fenceName"] = obj.name || ''
    },
    submit() {
      if (this.fromSource === 3) {//详情时，确定提交，关闭pop
         this.showModal = false
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        let params =  {}
        params = {
          "ruleName": this.formData.ruleName,
          "cityCode": this.formData.provinceCityCode[1],
          "nonNumberPlateDto": {
              "strategyType": this.formData.strategyType,
              // "travelDay": this.formData.travelDay,
              // "forCar": this.formData.forCar,
              // "fuelTypes": this.formData.fuelTypes,
              "fenceUuid": this.formData.fenceNameUuid, 
              "fenceName": this.formData.fenceName,
              "limitDay": this.formData.limitDay,
          }
        }
        if (this.fromSource === 1) {
          nonSave(params).then((res) => {
            this.showModal = false;
            this.$emit("reload");
            this.$Message.success(res.data.msg);
          });
        }

      // if (this.fromSource !== 3) { //新增
      //   // 处理省的情况
      //   if (this.formData.provinceCityCode[1]) {
      //     params.cityCode = this.formData.provinceCityCode[1];
      //   } else {
      //     params.cityCode = this.formData.provinceCityCode[0];
      //   }
      //   console.log("新增params：", params)
      //   // axiosPriorityStrategySave(params).then((res) => {
      //   //   this.showModal = false;
      //   //   this.$emit("reload");
      //   //   this.$Message.success(res.data.msg);
      //   // });
      // }
      if (this.fromSource === 2) { //编辑
        params.uuid = this.uuid;
        params.cityCode = this.editCityCode;
        nonUpdate(params).then((res) => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      }
      
      })
    },
  },
};
</script>

<style lang="less" scoped>
.formCenter.formItem_margin0 {
  width: 450px;
  .ivu-form-item {
    margin-bottom: 10px;
    .displayInB {
        margin: 0 60px;
    }
  }
}

.formCenter {
  width: 350px;
  margin: 0 auto;
  .width200 {
    width: 200px;
  }
  .checkMap {
    color: royalblue;
    text-decoration: underline;
    cursor: pointer;
  }
  .city_item {
    width: 200px;
    display: inline-block;
  }
  .travelfreely_item {
    /deep/ .ivu-form-item-label {
      width: 205px!important;
    }
    .free_item {
      width: 100px;
      margin-right: 10px;
    }
    .freeDay {
      display: inline-block;
    }
    .displayInB {
      display: inline-block;
      color: red;
    }
  }
  .travelfreely_item_1 {
    /deep/ .ivu-form-item-label {
      width: 320px!important;
    }
    .free_item {
      width: 100px;
      margin-right: 10px;
    }
    .freeDay {
      display: inline-block;
    }
    .displayInB {
      display: inline-block;
      color: red;
    }
  }
}

</style>
