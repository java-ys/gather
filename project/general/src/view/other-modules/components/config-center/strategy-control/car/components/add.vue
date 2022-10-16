<template>
  <Modal
    v-model="show"
    width="800"
    :title="title"
    :mask-closable="false"
    class="modal-s"
    @on-cancel="cancel"
  >
    <div class="pr">
      <div class="_mask" v-if="isDetail"></div>
      <Form v-if="show" ref="_form" :model="addForm" :label-width="150" :rules="rules">
        <FormItem label="策略名称：" prop="ruleName">
          <Input
            v-model="addForm.ruleName"
            placeholder="请输入策略名称"
            :maxlength="50"
            class="item-width"
          />
        </FormItem>
        <FormItem label="城市：" prop="cityCode">
          <Select
            v-model="addForm.cityCode"
            placeholder="请选择"
            class="item-width"
            filterable
            clearable
            @on-change="cityChange"
          >
            <Option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="区县：" prop="areaCodeList">
          <Select
            v-model="addForm.areaCodeList"
            class="item-width"
            multiple
            filterable
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in areaList"
              :key="index"
              :value="item.value"
              >{{ item.label }}</Option
            > </Select
          ><span class="ml-6 gray">选填，为空则策略针对城市生效</span>
        </FormItem>
        <FormItem label="业务线：" prop="expandBizLine">
          <Select
            v-model="addForm.expandBizLine"
            class="item-width"
            placeholder="请选择"
            @on-change="expandBizLineChange"
          >
            <Option v-for="item in expandBizLineList" :key="item.value" :value="item.value">{{
              item.label
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单类型：" prop="typeTime"
          ><span>实时订单</span></FormItem
        >
        <FormItem label="有效时间：" prop="timeRange">
          <DatePicker
            v-model="addForm.timeRange"
            type="datetimerange"
            placeholder="请选择时间范围"
            format="yyyy-MM-dd HH:mm:ss"
            class="item-width"
            :options="dateOptions"
            clearable
          ></DatePicker>
        </FormItem>
      </Form>
      <item-com v-if="show" ref="_itemCom" :cData="isCopy || isDetail  ? cData : undefined"></item-com>
    </div>
    <div slot="footer">
      <Button type="default" @click="(e) => cancel()">{{isDetail ? '关闭' :'取消' }}</Button>
      <Button v-if="!isDetail" type="primary" :loading="submitLoading" @click="(e) => save()">
        <span>确定</span>
      </Button>
    </div>
  </Modal>
</template>

<script>
import { deepCopy } from "@/libs/tools";
import { addRules as rules, add_params } from "./fields";
import ItemCom from "./item.vue";
import { freeze } from "@/mixins/base";
import { addService, minFeeService } from "_o/api/lookForCar";
import AreaMixin from "../mixin/area.js";

const DAY_TIMESTAMP = 24 * 60 * 60 * 1000;
const FIVE_MINUTE = 5 * 60 * 1000;

export default {
  name: "car-edit",
  components: {
    ItemCom,
  },
  mixins: [AreaMixin],
  inject: ["getCityList"],
  provide() {
    return {
      getMinFee: () => this.freeCancelMinute
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    cData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    cityList({ getCityList }) {
      return getCityList();
    },
    isCopy({cData}) {
      return !!cData._copy
    },
    isDetail({cData}) {
      return !!cData._detail
    },
    title({isDetail, isCopy}) {
      if(isDetail) return '策略详情'
      if(isCopy) return '复制策略'
      return '新增策略'
    }
  },
  data() {
    return {
      submitLoading: false,
      addForm: {...deepCopy(add_params)},
      rules,
      show: false,
      // title: "",
      itemList: [],
      freeCancelMinute: '',
      dateOptions: freeze({
        // 开始时间不得早于当前时间+5min，结束时间不得早于开始时间
        disabledDate(date) {
          return (
            date && date.valueOf() < Date.now() - DAY_TIMESTAMP - FIVE_MINUTE
          );
        },
      }),
    };
  },
  watch: {
    value(v) {
      this.show = v;
      if(v) {
        this.init()
      } else {
        this.restore()
      }
    },
    show(v) {
      this.$emit("input", v);
    },
  },
  methods: {
    init() {
      if(this.isCopy || this.isDetail) {
        Object.keys(deepCopy(add_params)).forEach(key => {
          this.addForm[key] = this.cData[key]
        })
        const { areaCode, cityCode, effectiveTime, failureTime, freeCancelMinute } = this.cData
        this.addForm.areaCodeList = [areaCode];
        this.freeCancelMinute = freeCancelMinute
        this.addForm.timeRange = []
        if(this.isCopy) {
          this.addForm.ruleName = ''
        }
        if(this.isDetail) {
          if(effectiveTime && failureTime) {
            this.addForm.timeRange = [effectiveTime, failureTime]
          }
        }
        if(cityCode) {
          this.getArea(cityCode)
        }
      }
    },
    cancel() {
      this.show = false;
    },
    async save() {
      const valid = await this.$refs._form.validate();
      const [bool, param=[]] = await this.$refs._itemCom.getData();
      if(!valid || !bool) return
      let [ruleBool, ruleMsg] = this.checkRules(param)
      if(!ruleBool) {
        this.$Message.error(ruleMsg)
        return
      }
      let p = {...this.getBaseParams(), rules: param}
      const [err, data] = await addService(p);
      if(err) return
      this.cancel();
      this.$emit('refresh')
    },
    async cityChange(v) {
      this.addForm.areaCodeList = []
      if (v) {
        await this.getArea(v);
        if(this.addForm.expandBizLine) {
          this.getMinFee({cityCode: v, expandBizLine: this.addForm.expandBizLine})
        }
      }
    },
    expandBizLineChange(v) {
      if(v && this.addForm.cityCode) {
        this.getMinFee({
          cityCode: this.addForm.cityCode,
          expandBizLine: v
        })
      }
    },
    async getMinFee(p) {
      const [err, res] = await minFeeService(p);
      if(err) return
      this.freeCancelMinute = res?.data
    },
    getBaseParams() {
      let p = {
        ...this.addForm,
        freeCancelMinute: this.freeCancelMinute
      };
      if (p.timeRange?.length > 1) {
        p.effectiveTime = this.$moment(p.timeRange[0]).format("YYYY-MM-DD HH:mm:ss")
        p.failureTime = this.$moment(p.timeRange[1]).format("YYYY-MM-DD HH:mm:ss")
        delete p.timeRange
      }
      return p
    },
    restore() {
      Object.assign(this.$data.addForm, this.$options.data().addForm)
      this.$nextTick(() => {
        this.$refs?._form?.resetFields();
        this.$refs?._itemCom?.reset()
      })
      this.areaList = []
      this.freeCancelMinute = ''
    },
    // 时段不能重叠
    checkRules(list = []) {
      if(list.length < 2) return [true]
      let _periodTime = []; // 策略时间段
      list.forEach(item => {
        _periodTime.push([item.startTime.split(':').join(""), item.endTime.split(':').join("")]);
      })
      let len = list.length
      for(let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if(this.timeIntersection(_periodTime[i], _periodTime[j])) {
            return [false, '时段有重复']
          }
        }
      }
      return [true]
    },
    // 00:00:00 - 23:59:59 校验时段  [] 左闭右闭
    timeIntersection(date1, date2) {
      if(date1.filter(Boolean).length < 2 || date2.filter(Boolean).length < 2) {
        return false
      }
      return !(date2[1] < date1[0] || date2[0] > date1[1])
    },
  },
};
</script>
<style>
.item-width {
  width: 320px;
}
.ml-6 {
  margin-left: 6px;
}
.gray {
  font-size: 12px;
  color: #999;
}
</style>
