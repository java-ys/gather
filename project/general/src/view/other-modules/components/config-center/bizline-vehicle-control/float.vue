<template>
  <div v-show="popView" class="popView">
    <div class="ivu-modal-mask"></div>
    <div class="popView-wrap" :style="{top: top + 'px'}">
      <div class="popView-content" :style="{width: width + 'px'}">
        <div class="popView-title-wrap" :style="{width: width + 'px', top: top + 'px'}">
          <span class="popView-title">
            {{ title }}
          </span>
          <div class="popView-icon">
            <Icon class="close-icon" type="md-close" @click="commit(0)" />
          </div>
        </div>
        <div class="popView-body-wrap policemodalstyle">
          <Form
            ref="formValidate"
            :model="floatParams"
            :rules="ruleUser"
            :label-width="100"
          >
            <FormItem label="行政区类型：" prop="levelType">
              <Select
                v-model="floatParams.levelType"
                style="width: 300px"
                :disabled="type === 'edit' || type === 'view'"
              >
                <Option :value="1">市级</Option>
                <Option :value="2">区县级</Option>
              </Select>
            </FormItem>
            <FormItem label="城市：" prop="carrierArea">
              <Cascader
                v-model="floatParams.carrierArea"
                :data="cityList"
                :clearable="false"
                :disabled="type === 'edit' || type === 'view'"
                style="width: 300px"
                placeholder="请选择城市"
                @on-change="(value, selectedData) => changeCity(value, selectedData)"
              ></Cascader>
            </FormItem>
            <FormItem label="区县：" prop="areaCodes" v-if="floatParams.levelType === 2">
              <Select
                v-model="floatParams.areaCodes"
                style="width: 300px"
                multiple
                label-in-value
                :disabled="type === 'edit' || type === 'view'"
                @on-change="changeArea"
              >
                <Option
                  v-for="item in currentAreaList"
                  :key="item.label"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="业务线：" prop="expandBizLine">
              <!-- <span v-if="type === 'edit' || type === 'view'">{{(gradeInfo.find(
                (it) => it.value === floatParams.expandBizLine
              )||{}).label}}</span> -->
              <Select
                v-model="floatParams.expandBizLine"
                style="width: 300px"
                :disabled="type === 'edit' || type === 'view'"
                @on-change="changeExpandBizLine"
              >
                <Option
                  v-for="(item, index) in gradeInfo"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <Row>
              <Alert style="width: 100px; padding-right: 0">单一车型：</Alert>
            </Row>
            <FormItem label="" prop="carTypes">
              <!-- 车型等级 -->
              <Select
                v-model="floatParams.carTypes"
                multiple
                style="width: 300px"
                placeholder="请选择车型等级"
                :disabled="type === 'view'"
                @on-change="changevehicleLevelSingle"
              >
                <Option
                  v-for="item in carListShow"
                  :key="item.vehicleLevel"
                  :value="item.vehicleLevel"
                >
                  {{ item.bizTypeName }}-{{ item.vehicleName }}
                </Option>
              </Select>
            </FormItem>
            <Row>
              <Alert style="width: 100px; padding-right: 0">车型露出时间</Alert>
            </Row>
            <div
              class="time-con"
              v-for="(item, index) in floatParams.partTimeBizList"
              :key="'carType'+index"
            >
              <Row style="padding-left: 110px">
                <span>{{ item.label }}</span>
              </Row>
              <div
                :ref="`formValidate${index}`"
                v-for="(yItem, yIndex) in floatParams.partTimeBizList[index]
                  .partTimePickerList"
                :key="yIndex"
              >
                <FormItem
                  :label="'时段' + (yIndex + 1) + ':'"
                  :prop="`partTimeBizList[${index}].partTimePickerList[${yIndex}].value`"
                  :rules="{required: true, validator: validateTime}"
                >
                  <TimePicker
                    v-model="
                      floatParams.partTimeBizList[index].partTimePickerList[yIndex].value
                    "
                    confirm
                    type="timerange"
                    placement="bottom-start"
                    placeholder="请选择时间段"
                    style="width: 168px"
                    :disabled="type === 'view'"
                    @on-change="(val) => changeTime(index, yIndex, val)"
                  ></TimePicker>
                  <span
                    class="sliderRemove"
                    v-if="type !== 'view'"
                    @click="deleteTime(index, yIndex)"
                  >
                    删除
                  </span>
                </FormItem>
              </div>
              <Button
                type="dashed"
                icon="md-add"
                style="margin-left: 100px"
                v-if="type !== 'view'"
                @click="addTime(index)"
              >
                新增时段
              </Button>
            </div>
            <!-- 车型组 -->
            <br>
            <br>
            <Row>
              <Alert style="width: 100px; padding-right: 0">车型组：</Alert>
            </Row>
            <FormItem label="" prop="carTypes">
              <!-- 车型等级 -->
              <Select
                v-model="floatParams.carGroups"
                multiple
                style="width: 300px"
                placeholder="请选择车型组"
                :disabled="type === 'view'"
                @on-change="changevehicleLevelGroup"
              >
                <Option
                  v-for="item in carGroupListShow"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.configStatus!==1"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <Row>
              <Alert style="width: 100px; padding-right: 0">车型露出时间</Alert>
            </Row>
            <div
              class="time-con"
              v-for="(item, index) in floatParams.partTimeBizGroupList"
              :key="index + 'carType'"
            >
              <Row style="padding-left: 110px">
                <span>{{ item.label }}</span>
              </Row>
              <div
                :ref="`formValidate${index}`"
                v-for="(yItem, yIndex) in floatParams.partTimeBizGroupList[index]
                  .partTimePickerList"
                :key="yIndex"
              >
                <FormItem
                  :label="'时段' + (yIndex + 1) + ':'"
                  :prop="`partTimeBizGroupList[${index}].partTimePickerList[${yIndex}].value`"
                  :rules="{required: true, validator: validateTime}"
                >
                  <TimePicker
                    v-model="
                      floatParams.partTimeBizGroupList[index].partTimePickerList[yIndex].value
                    "
                    confirm
                    type="timerange"
                    placement="bottom-start"
                    placeholder="请选择时间段"
                    style="width: 168px"
                    :disabled="type === 'view'"
                    @on-change="(val) => changeGroupTime(index, yIndex, val)"
                  ></TimePicker>
                  <span
                    class="sliderRemove"
                    v-if="type !== 'view'"
                    @click="deleteGroupTime(index, yIndex)"
                  >
                    删除
                  </span>
                </FormItem>
              </div>
              <Button
                type="dashed"
                icon="md-add"
                style="margin-left: 100px"
                v-if="type !== 'view'"
                @click="addGroupTime(index)"
              >
                新增时段
              </Button>
            </div>
          </Form>
          <div v-if="!invalidEditor" class="popView-footer-wrap" style="margin: 37px 0">
            <Button size="large" type="text" style="margin-right: 8px" @click="commit(0)">
              取消
            </Button>
            <Button
              v-if="type !== 'view'"
              v-lazy-click="{fn: commit, params: {params: 1}}"
              size="large"
              type="primary"
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
import {updateExpandBizLine, getAreaInfoByCityCode} from "_o/api/configData.js";
import {vehicleGroupList} from "_o/components/config-center/vehicle-group-manage/api"
//验证方法 validateTime
const validateTime = (rule, value, callback, index) => {
  //时间为数组处理-time
  if (!value) {
    return callback(new Error("请选择时间"));
  } else {
    //时间为数组处理
    value.map((item) => {
      if (!item) {
        return callback(new Error("请选择时间"));
      }
    });
    callback();
  }
};
export default {
  props: {
    popView: {
      default: false,
      type: Boolean,
    },
    type:String,
    width: Number,
    top: {
      default: 100,
      type: Number,
    },
    title: {
      default: "新建弹窗",
      type: String,
    },
    type: String, // 新增or编辑or 详情
    cityUuid: {
      default: "",
      type: String,
    },
    cityList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    optList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    gradeInfo: {
      default: () => {
        return [];
      },
      type: Array,
    },
    bizTypeList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    invalidEditor: {
      default: false,
      type: Boolean,
    },
    params: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      floatParams: {},
      currentAreaList: [],
      carList: [],
      carGroupList:[],
      ruleUser: {
        levelType: [
          {
            required: true,
            message: "行政区类型不能为空",
          },
        ],
        expandBizLine: [
          {
            required: true,
            message: "业务线不能为空",
          },
        ],
        // carTypes: [
        //   {
        //     required: true,
        //     message:"车型等级不能为空"
        //   }
        // ],
        carrierArea: [
          {
            required: true,
            message: "城市不能为空",
          },
        ],
        areaCodes: [
          {
            required: true,
            message: "区县不能为空",
          },
        ],
      },
      validateTime,
    };
  },
  watch: {
    popView(val) {
      if (val) {
        this.$set(this,'floatParams',JSON.parse(JSON.stringify(this.params)))
        this.floatParams.partTimeBizList = this.floatParams.partTimeBizList || [
          {
            carTypes: "",
            partTimePickerList: [],
          },
        ];
        this.floatParams.partTimeBizGroupList = this.floatParams.partTimeBizGroupList || [
          {
            carGroups: "",
            partTimePickerList: [],
          },
        ];
        if(this.type === 'add'){
          this.$refs.formValidate.resetFields();

        }
        this.changevehicleLevelGroup()
      }
    }
  },
  computed:{
    carGroupListShow(){
      let carTypes = this.floatParams.carTypes || []
      let filterStr = carTypes.length ?carTypes.map(it => it? `${it.split('#')[1]}#${it.split('#')[2]}`:''):[]
      let list = this.carGroupList.filter(it=>{
        const {groupVehicleList="[]"} = it
        let jsonList = JSON.parse(groupVehicleList)
        jsonList= jsonList.map(item=>{
          return item.levels.map(itt=>{
            return {
              ...itt,
              bizType:item.bizType,
              value:`${item.bizType}#${itt.vehicleLevel}`
            }
          })
        })
        let res = true
        jsonList.forEach(i=>{
          i.forEach(j=>{
            if(filterStr.indexOf(j.value)>-1){
              res = false
            }
          })
        })
        return res
      })
       return list
    },
    carListShow(){
      if(!this.floatParams.expandBizLine){
        return []
      }
      let carGroups = this.floatParams.carGroups || []
      if(carGroups.length === 0){
        return this.carList
      }
      let list = this.carGroupList.filter(it=>carGroups.indexOf(it.id)>-1).map(item=>{
        let {groupVehicleList="[]"} =  item
        let jsonList = JSON.parse(groupVehicleList)
        let levelList = jsonList.map(v=>{
          return v.levels.map(itemm=>{
            return `${this.floatParams.expandBizLine}#${v.bizType}#${itemm.vehicleLevel}`
          })
        })
        return levelList
      })
      let filterArr = [...new Set(list.flat(2))]
      return this.carList.filter(v=> filterArr.indexOf(v.vehicleLevel)===-1)
    },
  },
  mounted() {
    this.getCarGroupList()
  },
  methods: {
    getCity(data, value) {
      const [provinceCode, cityCode] = data;
      this.cityCode = data.length > 1 ? data[1] : data[0];
      this.floatParams.city = value[1].province + value[1].province.city;
    },
    getCarGroupList(){
      vehicleGroupList({
        currPage: 1,
        pageSize: 1000,
      }).then(res=>{
        if (res) {
        const { list, totalCount } = res?.data?.data
        this.carGroupList = list.map(it=>{
          return {
            ...it,
            label:`${it.groupName}(${it.aliasName})`,
            value:it.id
          }
        })
      }
      })
    },
    async commit(temp) {
      if (typeof temp === "object" && temp.params) {
        temp = temp.params;
      }
      if (temp) {
        if(this.type === 'view'){
          this.$emit("on-confirm", false);
          return
        }
        this.$refs.formValidate.validate().then((res) => {
          if (res) {
            let data = JSON.parse(JSON.stringify(this.floatParams));
            // 重复配置校验
            let {carTypes=[],carGroups=[]} = data;
            if (carTypes.length ===0 && carGroups.length === 0) {
              this.$Message.error("至少配置一个车型或车型组");
              return;
            }
            let carTypeList = this.carList.filter(
              (it) => carTypes.indexOf(it.vehicleLevel) > -1
            );
            let bizTypeListSet = new Set(carTypeList.map((it) => it.bizType));
            let [...bizTypeList] = bizTypeListSet;
            let bizTypeListJSON = bizTypeList.map((it) => {
              let bizTypeName = carTypeList.find((item) => item.bizType === it)
                .bizTypeName;
              let levels = carTypeList
                .filter((item) => item.bizType === it)
                .map((item) => {
                  // 添加时段-前端组装逻辑太多、不合理。
                  let partTimeItem = this.floatParams.partTimeBizList.find(
                    (itt) => itt.carTypes === item.vehicleLevel
                  );
                  let partTimeList = [];
                  if (partTimeItem) {
                    for (let items of partTimeItem.partTimePickerList) {
                      partTimeList.push(`${items.value[0]}-${items.value[1]}`);
                    }
                  }
                  let params = {
                    ...item,
                    vehicleLevel: Number(item.vehicleLevel.split("#")[2]),
                  };
                  partTimeList.length ? (params.partTimeList = partTimeList) : "";
                  return params;
                });
              return {
                bizTypeName,
                bizType: it,
                levels,
              };
            });
            // console.log(this.floatParams)
            for(let item of data.partTimeBizGroupList){
              if(item.configStatus !== 1){
                // 车型组停了
                this.$Message.error('车型组非启用状态，请重新选择')
                return
              }
            }
            let groupVehicleListJSON = data.partTimeBizGroupList.map(it=>{
              return {
                groupId:it.id,
                partTimeList:it.partTimePickerList.map(it =>it.value.join("-"))
              }
            })
            let {
              levelType,
              expandBizLine,
              areaCode,
              areaCodes,
              carrierArea,
              areaNames,
              areaName,
            } = this.floatParams;
            let params = {
              levelType,
              expandBizLine,
              expandBizLineName: this.gradeInfo.find(
                (it) => it.value === data.expandBizLine
              ).label,
              cityCode: carrierArea[1],
              bizTypeList: bizTypeListJSON,
              groupVehicleList:groupVehicleListJSON
            };
            if (levelType === 2) {
              params.areaCode = areaCodes ? areaCodes.join(",") : areaCode;
              params.areaName = areaNames ? areaNames.join(",") : areaName;
            }
            updateExpandBizLine(params).then((res) => {
              if (res.data.success) {
                this.$emit("on-confirm", true);
                this.$Message.success(res.data.msg);
              } else {
                this.$Message.error(res.data.msg);
              }
            });
          }
        });
      } else {
        this.$emit("on-confirm", false);
      }
    },
    changeExpandBizLine(val) {
      if (val) {
        let tempArr = this.gradeInfo.find((it) => it.value === val).children;
        if (val !== 12) {
          // 出租车有自己的开城配置，需要过滤，但新享特惠单独放开
          tempArr = tempArr.filter((it) => it.bizType !== 1);
        }
        this.carList = [
          ...tempArr
            .map((it) => {
              let list = it.levels.map((item) => {
                return {
                  ...item,
                  bizType: it.bizType,
                  bizTypeName: it.bizTypeName,
                  vehicleLevel: `${val}#${it.bizType}#${item.vehicleLevel}`,
                };
              });
              return list;
            })
            .flat(),
        ];
        this.floatParams.carTypes = [];
      }
    },
    changevehicleLevelSingle() {
      this.floatParams.partTimeBizList = this.floatParams.carTypes.map((it) => {
        let ittem = this.carList.find((item) => item.vehicleLevel === it);
        return {
          value: it,
          partTimePickerList: [],
          label: `${ittem.bizTypeName}-${ittem.vehicleName}`,
        };
      });

    },
    changevehicleLevelGroup(val) {
      this.floatParams.partTimeBizGroupList = (this.floatParams.carGroups||[]).map((it) => {
        let ittem = this.carGroupList.find((item) => item.id === it);
        let webGroupVehicleDtoList = ((this.floatParams.webGroupVehicleDtoList||[]).find(itt=>itt.groupID===it)||{}).partTimeList ||[]

        return {
          ...ittem,
           partTimePickerList: this.type === 'add'?[]:webGroupVehicleDtoList.map(item=>{
             return {
               value:item.split("-")
             }
           })||[],
        };
      })
    },
    changeCity(p) {
      if (p && p.length > 1) {
        this.queryArea(p[1]);
      }
    },
    queryArea(val) {
      getAreaInfoByCityCode({cityCode: val}).then((res) => {
        if (res.data.success) {
          const list = res.data.data.map((it) => {
            return {
              label: it.orgName,
              value: it.orgCode,
            };
          });
          this.currentAreaList = list;
        }
      });
    },
    changeArea(value) {
      this.floatParams.areaNames = value.map((it) => it.label);
    },
    addSubTimeBiz() {
      this.floatParams.partTimeBizList
        ? this.floatParams.partTimeBizList.push({
            carTypes: "",
            partTimePickerList: [{value: null}],
          })
        : (this.floatParams.partTimeBizList = [
            {
              carTypes: "",
              partTimePickerList: [{value: null}],
            },
          ]);
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
    changeTime(index, yIndex, val) {
      this.floatParams.partTimeBizList[index].partTimePickerList[yIndex].value = val;
      this.$set(
        this.floatParams.partTimeBizList[index],
        "partTimePickerList",
        JSON.parse(
          JSON.stringify(this.floatParams.partTimeBizList[index].partTimePickerList)
        )
      );
    },
    changeGroupTime(index, yIndex, val) {
      this.floatParams.partTimeBizGroupList[index].partTimePickerList[yIndex].value = val;
      this.$set(
        this.floatParams.partTimeBizGroupList[index],
        "partTimePickerList",
        JSON.parse(
          JSON.stringify(this.floatParams.partTimeBizGroupList[index].partTimePickerList)
        )
      );
    },
    deleteTime(index, yIndex) {
      this.floatParams.partTimeBizList[index].partTimePickerList.splice(yIndex, 1);
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
    deleteGroupTime(index, yIndex) {
      this.floatParams.partTimeBizGroupList[index].partTimePickerList.splice(yIndex, 1);
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
    deleteCarTypes(index) {
      this.floatParams.partTimeBizList.splice(index, 1);
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
    addTime(index) {
      this.floatParams.partTimeBizList[index].partTimePickerList.push({value: null});
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
    addGroupTime(index) {
      this.floatParams.partTimeBizGroupList[index].partTimePickerList.push({value: null});
      this.$forceUpdate();
      this.$set(this, "floatParams", JSON.parse(JSON.stringify(this.floatParams)));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.mobile-wrap:last-child {
  margin-bottom: 0;
}

.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  text-align: center;
}

.real-number {
  width: 200px;
}

.area-number {
  width: 100px;
}

.fonttitle {
  font-size: 14px;
  // margin-bottom: 10px;
}

.fonttitle span:first-child {
  display: inline-block;
  width: 100px;
  text-align: left;
}

.iptwraper {
  display: inline-block;
}

.ivu-alert.ivu-alert-with-icon {
  margin: 10px 0 0 0;
  width: 300px;
}
.popView-content {
  overflow: auto;
  height: auto;
}
.time-con {
  padding: 10px 0;
  margin-top: 6px;
  border: 1px dashed #3399ff;
  border-radius: 2px;
  .sliderRemove {
    font-size: 14px;
    color: red;
    margin-left: 16px;
    cursor: pointer;
  }
}
</style>
