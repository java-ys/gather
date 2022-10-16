<template>
  <Form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="top"
  >
    <Row>
      <FormItem
        label="策略类型"
        prop=""
      >
        <Select
          v-model="form.driverFareModel"
          @on-change="driverFareModelChange"
          placeholder="请选择"
          :style="{
            width: '180px'
          }"
        >
          <Option
            v-for="item in policyPriority"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <FormItem
        label="司机侧计费标准"
        prop=""
      >
        <p>{{chargingStandard[form.driverFareModel]}}</p>
      </FormItem>
    </Row>
    <FormItem
      prop="periodTime"
      label="策略时间段"
    >
      <TimePicker
        v-model="form.periodTime"
        type="timerange"
        placeholder="请选择策略生效日期"
        style="width: 168px"
      />
    </FormItem>
    <FormItem
      prop="week"
      label="重复机制"
    >
      <Select
        v-model="form.week"
        placeholder="请选择"
        multiple
        :max-tag-count="2"
        :style="{
          width: '200px'
        }"
      >
        <Option
          v-for="t in weekList"
          :key="t.value"
          :value="t.value"
          :label="t.label"
        />
      </Select>
    </FormItem>
    <div>
      <FormItem
        style="width: 500px;"
        prop="oldCarLevelOrdersInHexagon"
      >
        <FormItem
          label="下单车型六边形订单积占超过"
        >
          <Input
            v-model="form.oldCarLevelOrdersInHexagon"
            placeholder="请输入"
            @input="triggerValidate"
            type="number"
            :disabled="isReservations"
            class="no-arrow"
          ></Input>
        </FormItem>
        <FormItem
          label="目标车型六边形订单积占小于"
        >
          <Input
            v-model="form.newCarLevelOrdersInHexagon"
            placeholder="请输入"
            @input="triggerValidate"
            type="number"
            :disabled="isReservations"
            class="no-arrow"
          ></Input>
        </FormItem>
      </FormItem>
    </div>
    <div>
      <FormItem
        label="车型变更概率"
        prop="upCarLevelOdds"
      >
        <Input
          v-model="form.upCarLevelOdds"
          placeholder="请输入"
          type="number"
          class="no-arrow"
        >
        <span
          slot="suffix"
          class="input-suffix"
        >%</span>
        </Input>
      </FormItem>
    </div>
    <Row>
      <FormItem
        label="下单车型"
        prop="oldCarLevel"
      >
        <Select
          v-model="form.oldCarLevel"
          placeholder="请选择"
          :style="{
            width: '320px'
          }"
          multiple
          clearable
          filterable
          label-in-value
          @on-change="changeProduct"
        >
          <Option
            v-for="item in inOrderType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <div style="display: inline-block">
        <p class="sort-title">下单车型计费优先级<span class="e-x">数字越小优先级越高</span></p>
        <ul class="li-ll">
          <li :key="index" v-for="(item, index) in inOrderTypeNameList"
              draggable="true"
              @dragstart="start(item, index)"
              @dragover="over($event)"
              @drop="drop(index)"
          >
            <Icon type="ios-menu" size="16" class="sort-icon" /><span class="lev"><span class="e-i">{{index + 1}}.</span>{{ item.label }}</span></li>
        </ul>
      </div>
    </Row>

      <Row>
<!--        根据业务线获取-->
      <FormItem
        label="目标车型"
        prop="newCarLevel"
      >
        <Select
          v-model="form.newCarLevel"
          placeholder="请选择"
          :style="{
            width: '320px'
          }"
        >
          <Option
            v-for="t in newCarLevelList"
            :key="t.value"
            :value="t.value"
            :label="t.label"
          />
        </Select>
      </FormItem>
      </Row>
      <row class="relative">
        <FormItem
          label="是否弹出升舱弹窗"
          prop="need2Pop"
        >
         <RadioGroup v-model="form.need2Pop">
              <Radio :label="it.value" v-for="(it,index) in need2PopList" :key="index">{{it.label}}</Radio>
        </RadioGroup>
       </FormItem>
       <div class="tip">(开启弹窗后,当乘客匹配目标车型,乘客侧展示升舱提醒)</div>
      </row>
    <div
      v-if="form.need2Pop === 1"
      class="flex"
    >
      <div class="width450">
        <FormItem
          label="乘客端升舱弹窗提醒文案"
          prop="copies"
        >
          <Input
            v-model="form.copies[0]"
            :maxlength="13"
            placeholder="请输入乘客端升舱弹窗提醒文案"
            class="text-input"
          />
          <Input
            v-model="form.copies[1]"
            :maxlength="13"
            placeholder="请输入乘客端升舱弹窗提醒文案"
            class="text-input"
          />
          <Input
            v-model="form.copies[2]"
            :maxlength="13"
            placeholder="请输入乘客端升舱弹窗提醒文案"
          />
        </FormItem>
      </div>
      <div class="imgdivwrap">
          <el-image
            class="imgdiv"
            :src="tipimg"
            fit="cover"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
     </div>
  </Form>
</template>

<script>
import { mapState } from "vuex"
import { policyPriority, chargingStandard, getRules, need2PopList,carRule1,carRule2 } from "../fields"
import { freeze } from "@/mixins/base";
import sortMixin from "./sort"
import tipimg from "_o/assets/tips.png";

// 单配置里 下单车型 和 目标车型 互斥
// 多个配置之间 目标车型 互斥
// -选中预约单时，订单积占这两个框灰掉
// -选中端外的时候，下单车型和目标车型把出租车隐藏掉
const labelSeparator = "-";
const valueSeparator = "#";

const taxiName = "出租车";

export default {
  name: "config-item",
  mixins: [sortMixin],
  props: {
    carTypeList: {
      type: Array,
      default: () => []
    },
    weekList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: null
    },
    expandBizLine: {
      type: Number
    },
    // 订单类型
    typeTime: {
      default: -1
    },
    // 订单渠道
    channel: {
      default: -1
    }
  },
  data() {
    return {
      policyPriority: freeze(policyPriority),
      chargingStandard: freeze(chargingStandard),
      need2PopList: need2PopList,
      rules: getRules(this),
      form: {
        // 策略时间段
        periodTime: [],
        // 重复机制
        week: [],
        newCarLevelOrdersInHexagon: "",
        oldCarLevelOrdersInHexagon: "",
        upCarLevelOdds: "",
        // oldBizType: "",
        // 下单车型
        oldCarLevel: [],
        inOrderTypeNameList: [], // 下单车型的排序
        // 目标车型
        newCarLevel: "",
        copies: [], // 提醒文案
        // 司机侧计费标准
        driverFareModel: 0,
        need2Pop: 0,
      },
      newCarLevelList: [], // 目标车型
      inOrderType: [], // 下单车型列表
      inOrderTypeNameList: [], // 选中下单车型列表
      tipimg: tipimg,
      srcList: [tipimg]
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => {
        console.log(state.common.bizTypeList)
        return state.common.bizTypeList
      },
      businessGradeList: (state) => {
        return state.common.businessGradeList
      },
    }),
    // 订单类型是预约单  1 实时单 2 预约单
    isReservations({typeTime}) {
      return typeTime - 2 === 0
    },
  },
  watch: {
    // 根据业务线获取 产品线/车型等级
    // 业务线/产品线/车型等级
    expandBizLine: {
      handler(val) {
        let f = this.businessGradeList.find(it => it.value - val === 0);
        this.setInOrderType(f)
      },
      immediate: true
    },
    value: {
      handler(val) {
        if (val) {
          this.form = val
        }
      },
      immediate: true
    },
    channel(v) {
      if(v - 1 !== 0) {
        this.restoreCarList()
        // return
      }
      // this.excludeTaxi()
    }
  },
  methods: {
    driverFareModelChange(val){
      // if(val === 1){
      //   this.form.need2Pop = 1;
      // }
    },
    triggerValidate() {
      this.$refs.form.validateField("oldCarLevelOrdersInHexagon")
    },
    // 下单车型
    changeProduct(val) {
      if(!val?.length) return
      this.inOrderTypeNameList = val
      this.getTargetVehicleType(val);
    },
    getTargetVehicleType(val) {
      let r = []
      // 下单车型和目标车型互斥
      this.inOrderType.forEach(item => {
        if(!val.find(it => it.value === item.value)) {
          r.push(item)
        }
      });
      this.newCarLevelList = r;
      this._newCarLevelList = r
      // 车型等级转换：运力负载均衡+差价升舱两种类型：
      // 1. 下单车型中含有非巡网出租车型（11-快享型出租车，12-惠享型出租车）非普通出租车型；目标车型过滤出租车-普通经济型；
      // 2. 下单车型中含有出租车-普通经济型，目标车型只展示巡网出租车型（11-快享型出租车，12-惠享型出租车）。
      if(val.some(it=>it.value===carRule1.targets[0]||it.value===carRule1.targets[1])){
        this.newCarLevelList = this.newCarLevelList.filter(it=>it.value!==carRule1.notargets[0])
      }
      if(val.some(it=>it.value===carRule2.targets[0])){
        this.newCarLevelList = this.newCarLevelList.filter(it=>it.value===carRule2.showCars[0]||it.value===carRule2.showCars[1])
      }

    },
    // 订单渠道是端外, 排除出租车类车型
    excludeTaxi() {
      this.inOrderType = this._inOrderType.filter(it => !it.label.includes(taxiName));
      this.newCarLevelList = this._newCarLevelList.filter(it => !it.label.includes(taxiName));
      this.inOrderTypeNameList = this.inOrderTypeNameList.filter(it => !it.label.includes(taxiName));
      this.form.oldCarLevel = this.form.oldCarLevel.filter(it => {
        const [v] = it?.split(valueSeparator) || [];
        return v - 1 !== 0
      })
    },
    restoreCarList() {
      this.inOrderType = this._inOrderType
      this.newCarLevelList = this._newCarLevelList
    },
    setInOrderType(f) {
      let r = []
      if(f) {
        let ch = f.children;
        ch?.forEach(item => {
          item?.levels?.forEach(itm => {
            r.push({label: `${item.label}${labelSeparator}${itm.vehicleName}`, value: `${item.value}${valueSeparator}${itm.vehicleLevel}`})
            // 下单车型和目标车型屏蔽, 出租车-普通经济型
            // let isTaxi = item.bizType - 1 === 0 && itm.vehicleLevel - 1 === 0
            // if(!isTaxi) {
            //   r.push({label: `${item.label}${labelSeparator}${itm.vehicleName}`, value: `${item.value}${valueSeparator}${itm.vehicleLevel}`})
            // }
          })
        })
      }
      this.inOrderType = r
      this._inOrderType = r
      this.form.oldCarLevel = []
      this.form.newCarLevel = ""
      this.newCarLevelList = []
    },
    async validForm() {
      return await this.$refs.form.validate();
    }
  }
}
</script>

<style scoped lang="less">

/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.input-suffix {
  display: block;
  line-height: 32px;
}

.text-input {
  margin-bottom: 10px;
  width: 100%;
  display: block;
}
.li-ll {
  font-size: 12px;
  li {
    height: 20px;
    line-height: 20px;
  }
}
.lev {
  margin-left: 6px;
}
.sort-icon {
  position: relative;
  bottom: 1px;
  color: #afacac;
}
.sort-title {
  font-size: 12px;
  margin-bottom: 6px !important;
}
.e-x {
  margin-left: 40px;
  color: #999;
}
.e-i {
  margin-right: 4px;
}
.relative{
  position: relative;
  .tip{
    position: absolute;
    top: -2px;
    left: 112px;
    font-size: 12px;
    color: #ed4014;
    z-index: 10;
  }
}
.flex {
  display: flex;
  .flex1 {
    flex: 1;
  }

}
.width450{
  width: 330px;
  margin-right: 10px;
}
.imgdivwrap{
  padding-top: 23px;
  .imgdiv{
    width: 100px;
    height: 118px
  }
}
</style>
<style scoped>
/deep/ .flex .ivu-form-item{
    display: block;
}
</style>
