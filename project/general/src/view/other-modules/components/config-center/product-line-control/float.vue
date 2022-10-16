<template>
  <div
    v-show="popView"
    class="popView"
  >
    <div class="ivu-modal-mask"></div>
    <div
      class="popView-wrap"
      :style="{'top': top + 'px'}"
    >
      <div
        class="popView-content"
        :style="{'width': width + 'px'}"
      >
        <div
          class="popView-title-wrap"
          :style="{'width': width + 'px','top': top + 'px'}"
        >
          <span class="popView-title">
            {{ title }}
          </span>
          <div class="popView-icon">
            <Icon
              class="close-icon"
              type="md-close"
              @click="commit(0)"
            />
          </div>
        </div>
        <router-view></router-view>
        <div class="popView-body-wrap policemodalstyle">
          <Form
            ref="formValidate"
            :model="floatParams"
            :rules="ruleUser"
            :label-width="100"
          >
            <FormItem
              label="城市："
              prop="carrierArea"
            >
              <Cascader
                v-model="floatParams.carrierArea"
                :data="cityList"
                :clearable="false"
                :disabled="type==='edit'"
                style="width: 300px"
                placeholder="请选择城市"
                @on-change="getCity"
              >
              </Cascader>
            </FormItem>
            <FormItem
              label="产品线："
              prop="businessType"
            >
              <Select
                v-model="floatParams.businessType"
                style="width:300px"
                :disabled="type==='edit'"
                @on-change="floatParams.carTypes=[]"
              >
                <Option
                  v-for="(item, index) in optList"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="车型等级："
              prop="carTypes"
            >
              <!-- 快享车型等级 -->
              <Select
                v-if="floatParams.businessType==4"
                v-model="floatParams.carTypes"
                multiple
                style="width:300px"
                placeholder="请选择车型等级"
               
              >
                <Option
                  v-for="item in carListQuick"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
              <!-- 其他等级，不包含出租车 -->
              <Select
                v-if="floatParams.businessType!=4&floatParams.businessType!=1"
                v-model="floatParams.carTypes"
                multiple
                style="width:300px"
                placeholder="请选择车型等级"
                :disabled="!floatParams.businessType"
              >
                <Option
                  v-for="item in carListSpec"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
              <!-- 出租车车型等级 -->
              <Select
                v-if="floatParams.businessType==1"
                v-model="floatParams.carTypes"
                multiple
                style="width:300px"
                placeholder="请选择车型等级"
                :disabled="!floatParams.businessType"
              >
                <Option
                  v-for="item in carListTaxi"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
          </Form>
          <div
            v-if="!invalidEditor"
            class="popView-footer-wrap"
            style="margin:37px 0;"
          >
            <Button
              size="large"
              type="text"
              style="margin-right: 8px;"
              @click="commit(0)"
            >
              取消
            </Button>
            <Button
              v-lazy-click="{fn:commit,params:{params:1}}"
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
import { addProductLine, editProductLine } from "_o/api/configData.js";
import { carTypeMap } from "./index.js";

export default {
  props: {
    popView: Boolean,
    width: Number,
    top: {
      default: 100,
      type: Number
    },
    title: {
      default: "新建弹窗",
      type: String
    },
    type: String, // 新增or编辑
    cityUuid: {
      default: "",
      type: String
    },
    cityList: {
      default: () => {
        return [];
      },
      type: Array
    },
    optList: {
      default: () => {
        return [];
      },
      type: Array
    },
    gradeInfo:{
      default: () => {
        return [];
      },
      type: Array
    },
    invalidEditor: {
      default: false,
      type: Boolean
    },
    floatParams: {}
  },
  data() {
    let self = this;
    const carrierArea = (rule, value, callback) => {
      if (this.floatParams.carrierArea.length > 0) callback();
      else callback(new Error("城市区域不能为空"));
    };
    const businessType = (rule, value, callback) => {
      if (this.floatParams.businessType) callback();
      else callback(new Error("产品线不能为空"));
    };
    const carTypes = (rule, value, callback) => {
      if (this.floatParams.carTypes.length) { callback(); }
      else { callback(new Error("车型等级不能为空")); }
    };
    return {
      params: {
        carrierArea: [],
        businessType: "",
        carTypes: []
      },
      ruleUser: {
        businessType: [
          {
            required: true,
            trigger: "change",
            validator: businessType
          }
        ],
        carTypes: [
          {
            required: true,
            trigger: "change",
            validator: carTypes
          }
        ],
        carrierArea: [
          {
            required: true,
            trigger: "change",
            validator: carrierArea
          }
        ]
      },
      carTypeMap,
      carListQuick: [
        {
          value: 1,
          label: "快享"
        },
        {
          value: 8,
          label: "自动驾驶"
        },
        {
          value: 10,
          label: "惠享"
        }
      ],
      carListSpec: [{
        value: 2,
        label: "舒适型"
      },
      {
        value: 3,
        label: "行政型"
      },
      {
        value: 4,
        label: "商务型"
      },
      {
        value: 9,
        label: "豪华型"
      }
      ],
      // 出租车车型等级
      carListTaxi: [{
        value: 1,
        label: "经济型"
      }],
      carListZ:[]
    };
  },
  watch: {
    popView: function () {
      this.$refs.formValidate.resetFields();
      if (this.type === "add") {
        this.params = {
          carrierArea: []
        };
      }
    },
    optList(newVal){
      if(newVal&&newVal.length){
        for(let item of this.gradeInfo){
          switch(item.businessCode){
            case 1:
              this.carListTaxi = item.gradeDtoList.map(it=>{
                return {
                  value:it.gradeCode,
                  label:it.gradeDesc
                }
              })
              break;
            case 2:
              this.carListSpec = item.gradeDtoList.map(it=>{
                return {
                  value:it.gradeCode,
                  label:it.gradeDesc
                }
              })
              break;
            case 4:
              this.carListQuick = item.gradeDtoList.map(it=>{
                return {
                  value:it.gradeCode,
                  label:it.gradeDesc
                }
              })
              break;
            case 8:
              this.carListZ = item.gradeDtoList.map(it=>{
                return {
                  value:it.gradeCode,
                  label:it.gradeDesc
                }
              })
              break;
            default:
              break;
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    getCity(data, value) {
      const [provinceCode, cityCode] = data
      this.cityCode = data.length > 1 ? data[1] : data[0];
      this.floatParams.city = value[1].province + value[1].province.city;
    },
    commit(temp) {
      if (typeof temp === "object" && temp.params) {
        temp = temp.params;
      }
      if (temp) {
        this.$refs.formValidate.validate().then(res => {
          if (res) {
            let data = JSON.parse(JSON.stringify(this.floatParams));
            let newJSON = {};
            newJSON.businessType = parseInt(data.businessType);
            newJSON.carLevels = data.carTypes;
            newJSON.provinceCode = data.carrierArea[0];
            newJSON.cityCode = data.carrierArea[1];
            if (this.type === "add") {
              addProductLine(newJSON).then(res => {
                this.$emit("on-confirm", true);
                this.$Message.success(res.data.msg);
              }).catch(err => {
              });
            }
            if (this.type === "edit") {
              newJSON.cityUuid = this.cityUuid;
              editProductLine(newJSON).then(res => {
                this.$emit("on-confirm", true);
                this.$Message.success(res.data.msg);
              }).catch(err => {
              });
            }
          }
        });
      } else {
        this.$emit("on-confirm", false);
      }
    }
  }
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
</style>
