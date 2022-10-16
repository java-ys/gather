<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-12-02 10:25:58
 * @Description: 新增表单弹窗
-->
<template>
  <Form ref="priceForm" :model="formData" :label-width="120" :rules="formRules">
    <div class="form-item flex">
      <FormItem label="策略名称" prop="fareTypeNote">
        <div>{{formData.fareTypeNote}}</div>
      </FormItem>
      <FormItem label="所选城市">
        <div>{{formData.cityName || '--'}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="业务线" prop="expandBizLine">
        <div>{{filterBusinessName(formData.expandBizLine)}}</div>
      </FormItem>
      <FormItem label="产品线" prop="businessType">
        <div>{{filterBizName(formData.businessType)}}</div>
      </FormItem>
      <FormItem label="车型等级" prop="carLevels">
        <div>{{filterCarLevelName(formData.carLevels, formData.businessType)}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="渠道" prop="source">
        <Select v-model="formData.source" disabled>
          <Option
            v-for="(item, index) in channelList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>

      <FormItem label="订单类型" prop="typeTime">
        <Select v-model="formData.typeTime" disabled>
          <Option
            v-for="(item, index) in orderTypes"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="生效时间" prop="effectiveTime">
        <DatePicker
          v-model="formData.effectiveTime"
          :options="DatePickerOption"
          disabled
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder=""
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="起步费">
        <Checkbox v-model="formData.startFareStatus" disabled>
          起步费
        </Checkbox>
      </FormItem>
    </div>
    <!-- 最低消费 -->
    <div v-if="formData.startFareStatus" class="form-item flex">
      <FormItem label="起步费(元)">
        <InputNumber v-model="formData.startFare" :min="0" disabled></InputNumber>
      </FormItem>
      <FormItem label="起步里程(公里)">
        <InputNumber v-model="formData.startTrip" :min="0" disabled></InputNumber>
      </FormItem>
      <FormItem label="起步时长(分钟)">
        <InputNumber v-model="formData.startDuration" :min="0" disabled></InputNumber>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="最低消费">
        <Checkbox v-model="formData.lowestFareStatus" disabled>
          最低消费
        </Checkbox>
      </FormItem>
    </div>
    <!-- 最低消费 -->
    <div v-if="formData.lowestFareStatus" class="form-item flex">
      <FormItem label="最低消费(元)">
        <InputNumber v-model="formData.lowestFare" disabled :min="0"></InputNumber>
      </FormItem>
      <FormItem label="最低消费计算节点" :label-width="120">
        <Select v-model="formData.model" disabled>
          <Option
            v-for="(item, index) in calculateNodes"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <!-- 新增里程时段费 -->
    <div>
      <div v-for="(item, index) in formData.tripFare" :key="index" class="form-item flex">
        <FormItem label="里程时段"
                  :prop="'tripFare.' + index + '.time'"
                  :rules="{ required: true,validator: timeValidate, trigger: 'change' }"
        >
          <TimePicker
            v-model="item.time"
            disabled
            type="timerange"
            placement="bottom-end"
            placeholder="里程时段"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <FormItem label="里程费（元/公里）" :label-width="150" :prop="'tripFare.' + index + '.fare'"
                  :rules="{ type: 'number',required: true, message: '里程费不能为空', trigger: 'blur' }"
        >
          <InputNumber v-model="item.fare" disabled :min="0"></InputNumber>
        </FormItem>
      </div>
    </div>
    <!-- 新增时长时段费用 -->
    <div>
      <div v-for="(item, index) in formData.timeFare" :key="index" class="form-item flex">
        <FormItem label="时长时段" :prop="'timeFare.' + index + '.time'"
                  :rules="{ required: true,validator: timeValidate, trigger: 'change', trigger: 'change' }"
        >
          <TimePicker
            v-model="item.time"
            disabled
            type="timerange"
            placement="bottom-end"
            placeholder="时长时段"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <FormItem label="时长费（元/分）" :label-width="150" :prop="'timeFare.' + index + '.fare'"
                  :rules="{ type: 'number',required: true, message: '时长费不能为空', trigger: 'blur' }"
        >
          <InputNumber v-model="item.fare" disabled :min="0"></InputNumber>
        </FormItem>
      </div>
    </div>
    <!-- 最低消费end -->
    <!-- 远途分段 -->
    <div>
      <div v-for="(item, index) in formData.longTripFareRuleDto.capacityRuleDetails" :key="index" class="form-item flex">
        <FormItem label="分段起始" :prop="'longTripFareRuleDto.capacityRuleDetails.' + index + '.startCapacity'"
                  :rules="{ type: 'number',required: true, message: '分段起始不能为空', trigger: 'change' }"
        >
          <Select v-model="item.startCapacity" disabled>
            <Option
              v-for="(item, index) in startPriods"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="分段结束" :label-width="80" :prop="'longTripFareRuleDto.capacityRuleDetails.' + index + '.endCapacity'"
                  :rules="{ type: 'number',required: true, message: '分段结束不能为空', trigger: 'change' }"
        >
          <Select v-model="item.endCapacity" disabled>
            <Option
              v-for="(item, index) in endPriods"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="远途里程费（元/公里）" :label-width="150" :prop="'longTripFareRuleDto.capacityRuleDetails.' + index + '.unitPrice'"
                  :rules="{ type: 'number',required: true, message: '远途里程费不能为空', trigger: 'blur' }"
        >
          <InputNumber
            v-model="item.unitPrice"
            disabled
            :min="0"
            style="width: 120px"
            placeholder="远途里程费"
          ></InputNumber>
        </FormItem>
      </div>
    </div>
    <!-- 远途分段end -->
    <div class="form-item flex">
      <FormItem label="夜间费（元/公里）">
        <InputNumber
          v-model="formData.nightTripFare"
          disabled
          :min="0"
          placeholder="夜间费"
        ></InputNumber>
      </FormItem>
      <FormItem label="附加费系数" :label-width="120" prop="thirdAdditionalRate">
        <InputNumber
          v-model="formData.thirdAdditionalRate"
          disabled
          :min="0"
          placeholder="附加费系数"
        ></InputNumber>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="免费等待时长（分钟）" :label-width="150" prop="freeWaitTime">
        <InputNumber
          v-model="formData.freeWaitTime"
          disabled
          :min="0"
          placeholder="免费等待时长"
          style="width: 120px"
        ></InputNumber>
      </FormItem>
      <FormItem label="超时等待费（元/分钟）" :label-width="150" prop="beyondWaitFare">
        <InputNumber
          v-model="formData.beyondWaitFare"
          disabled
          :min="0"
          placeholder="超时等待费"
          style="width: 120px"
        ></InputNumber>
      </FormItem>
    </div>

    <div class="form-item flex form-button">
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
  </Form>
</template>

<script>
import { mapState } from "vuex";
import { ORDER_TYPES, CALCULATE_NODE, REMOTE_SEGMENT } from "../../nums";
import detailMixin from "./detail.mixins"
import commontMixin from "../../common.mixins"
export default {
  mixins: [detailMixin, commontMixin],
  props: {
    cityList: {
      type: Array,
      default: () => []
    },
    uuid: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      timeValidate: (rule, value, callback) => {
        console.log(value, 111111)
        const [start, end] = value
        if (!start && !end) {
          callback(new Error("时段不能为空"))
        }
        if (start === end) {
          callback(new Error("开始时段不可等于结束时段"))
        }
        callback()
      },
      DatePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formRules: {
      },
      formData: {
        fareTypeNote: "",
        provinceCityCode: [],
        expandBizLine: "",
        businessType: "",
        carLevels: [],
        source: "",
        typeTime: "",
        effectiveTime: "",
        startFareStatus: false, // 是否选择起步费
        startFare: null, // 起步费(元)
        startTrip: null, // 起步里程（公里）
        startDuration: null, // 起步时长（分钟）
        lowestFareStatus: false,
        lowestFare: null,
        model: null,
        nightTripFare: null,
        thirdAdditionalRate: null,
        freeWaitTime: null,
        beyondWaitFare: null,
        tripFare: [
          {
            // 里程时段费
            fare: null,
            time: []
          }
        ],
        timeFare: [
          {
            // 时长时段费
            fare: null,
            time: []
          }
        ],
        longTripFareRuleDto: {
          capacityRuleDetails: [
            {
              startCapacity: null,
              endCapacity: null,
              unitPrice: null
            }
          ]
        }
      },
      calculateNodes: CALCULATE_NODE,
      orderTypes: ORDER_TYPES,
      productList: [], // 产品线
      carLevelList: [] // 车型等级
    };
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel
    }),
    startPriods() {
      const list = REMOTE_SEGMENT()
      return list
    },
    endPriods() {
      const list = REMOTE_SEGMENT()
      return [...list, {
        value: 10000,
        label: `100公里以上`
      }]
    },
  },
  watch: {
    uuid: {
      handler: function(val) {
        if (val) {
          this.getDetail(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleCancel() {
      this.$refs.priceForm.resetFields();
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.form-button {
  justify-content: flex-end;
  text-align: right;
}
.form-item {
  width: 100%;
  .ivu-form-item {
    flex: 1;
  }
  .delete-icon {
    width: 24px;
    height: 24px;
    margin-left: 16px;
    margin-bottom: 24px;
  }
  .add-button {
    margin-bottom: 24px;
  }
}
</style>
