<template>
  <Form
    ref="form"
    inline
    :model="form"
    :rules="rules"
  >
    <div>
      <FormItem
        prop="periodTime"
        label="策略时间段"
      >
        <TimePicker
          v-model="form.periodTime"
          type="timerange"
          placeholder="请选择策略生效日期"
          style="width: 200px"
        />
      </FormItem>
      <FormItem
        prop="weekDays"
        label="重复机制"
      >
        <Select
          v-model="form.weekDays"
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
    </div>
    <div>
      <FormItem
        label="推荐车型"
        prop="recommendationVehicleLevel"
      >
        <Select
          v-model="form.recommendationVehicleLevel"
          placeholder="请选择"
          :style="{
            width: '200px'
          }"
        >
          <Option
            v-for="item in carTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <FormItem
        label="触发推荐策略车型"
        prop="triggerVehicleLevels"
      >
        <Select
          v-model="form.triggerVehicleLevels"
          multiple
          placeholder="请选择"
          :style="{
            width: '200px'
          }"
          @input="handleChangeSelect"
        >
          <Option
            v-for="item in carTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
    </div>
    <div>
      <FormItem
        class="nowrap"
        label="触发推荐策略车型接起率"
        prop="triggerCondition"
      >
        <Input
          v-model="form.triggerCondition.startAcceptRate"
          placeholder="请输入"
          style="width: 85px"
        >
          <span
            slot="suffix"
            class="suffix-icon"
          >%</span>
        </Input>
        ~
        <Input
          v-model="form.triggerCondition.endAcceptRate"
          placeholder="请输入"
          style="width: 85px"
        >
          <span
            slot="suffix"
            class="suffix-icon"
          >%</span>
        </Input>
      </FormItem>
    </div>
    <div>
      <FormItem
        class="nowrap"
        label="触发推荐车型/推荐车型价差率 小于等于"
        prop="triggerCondition.agioRate"
      >
        <Input
          v-model="form.triggerCondition.agioRate"
          placeholder="请输入"
          style="width: 85px"
        >
          <span
            slot="suffix"
            class="suffix-icon"
          >%</span>
        </Input>

        <span class="suffix-tip">计算公式：推荐车型的价格/触发推荐车型的价格*100%-1</span>
      </FormItem>
    </div>
    <div
      v-if="form.triggerVehicleLevels.length > 1"
    >
      <FormItem
        class="nowrap"
        label="触发推荐车型有多个，请选择以哪个车型计算价差率"
        prop="triggerCondition.vehicleLevelForAgioRate"
        :rules="{
          required: true,
          message: '请选择以哪个车型计算价差率',
        }"
      >
        <Select
          v-model="form.triggerCondition.vehicleLevelForAgioRate"
          placeholder="请选择"
          :style="{
            width: '200px'
          }"
        >
          <Option
            v-for="item in carTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
    </div>
    <div>
      <FormItem
        class="nowrap"
        label="乘客端推荐展示时间 呼叫后"
        prop="lazyTime"
      >
        <Input
          v-model="form.lazyTime"
          placeholder="请输入"
        >
          <span
            slot="suffix"
            class="suffix-icon"
          >秒</span>
        </Input>
      </FormItem>
    </div>
    <div>
      <FormItem
        class="nowrap"
        label="推荐时是否发放优惠券"
        prop="useRecommendationCoupon"
      >
        <RadioGroup
          v-model="form.useRecommendationCoupon"
        >
          <Radio
            :label="1"
            :disabled="isEdit && !form.isNew"
          >
            是
          </Radio>
          <Radio
            :label="0"
            :disabled="isEdit && !form.isNew"
          >
            否
          </Radio>
        </RadioGroup>
      </FormItem>
    </div>
    <div
      v-if="form.useRecommendationCoupon === 1"
    >
      <FormItem
        prop="recommendationCouponId"
        :rules="{
          required: true,
          message: '请选择关联奖励'
        }"
        label="奖励编码"
        style="display: flex;"
      >
        <Button
          :disabled="isEdit && !form.isNew"
          @click="openRewardModal"
        >{{form.showRecommendationCouponId ? form.showRecommendationCouponId : "关联奖励"}}</Button>
        <Input v-model="form.recommendationCouponId" style="display: none" />
      </FormItem>
    </div>
    <div>
      <FormItem
        label="乘客端配图"
        prop="iconUrl"
      >
        <div class="flex-content">
          <img-upload
            v-model="form.iconUrl"
            :width="1029"
            :height="360"
            :format="['jpg', 'jpeg', 'png', 'gif']"
          />
          <div class="flex-text">
            <span>格式：jpg、png、gif</span>
            <span>图片分辨率：1029*360</span>
          </div>
        </div>
      </FormItem>
    </div>

    <Modal
      v-model="rewardVisible"
      width="760"
      title="选择奖励"
    >
      <select-reward
        v-if="rewardVisible"
        :limitType="limitType"
        :selected="rewardSelected"
        grantEventId="10"
        @close="selectDown"
      />
    </Modal>
  </Form>
</template>

<script>
import { weekList } from "../const"
import imgUpload from "_g/components/img-upload/img-upload"
import SelectReward from "_o/components/urge-collect/list/components/selectReward"
export default {
  components: {
    imgUpload,
    SelectReward
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    expandBizLine: {
      type: [String, Number],
      default: ""
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    carTypeList: {
      type: Array,
      default: () => []
    },
    carMap: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      rewardVisible: false,
      weekList,
      form: {
        recommendationVehicleLevel: "",
        triggerVehicleLevels: [],
        weekDays: "",
        periodTime: [],
        lazyTime: "",
        recommendationCouponId: "",
        subRecommendationCouponId: "",
        showRecommendationCouponId: "",
        useRecommendationCoupon: 0,
        iconUrl: [],
        triggerCondition: {
          startAcceptRate: "",
          endAcceptRate: "",
          agioRate: "",
          vehicleLevelForAgioRate: ""
        }
      },
      limitType: [],
      rewardSelected: {},
      rules: {
        periodTime: [
          {
            required: true,
            message: "请选择策略时间段"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length !== 2 || value.some(item => !item)) {
                callback(new Error("请选择策略时间段"))
              } else {
                callback()
              }
            }
          }
        ],
        weekDays: [
          {
            required: true,
            message: "请选择重复机制"
          }
        ],
        recommendationVehicleLevel: [
          {
            required: true,
            message: "请选择推荐车型",
            trigger: "change"
          }
        ],
        triggerVehicleLevels: [
          {
            required: true,
            message: "请选择触发推荐策略车型",
          }
        ],
        triggerCondition: [
          {
            required: true,
            type: "array",
            validator: (rule, value, callback) => {
              const isInteger = /^\d+$/
              if (isInteger.test(value.startAcceptRate)) {
                if (value.startAcceptRate < 0) {
                  callback(new Error("接起率范围为0-100%"))
                }
              } else {
                callback(new Error("车型接起率范围需为整数"))
              }
              if (isInteger.test(value.endAcceptRate)) {
                if (value.endAcceptRate <= 0 || value.endAcceptRate > 100) {
                  callback(new Error("接起率范围为0-100%"))
                }
              } else {
                callback(new Error("车型接起率范围需为整数"))
              }
              console.log("value", value)
              if (Number(value.endAcceptRate) < Number(value.startAcceptRate)) {
                callback(new Error("触发推荐接起率范围不正确"))
              }
              callback()
            },
            trigger: "blur",
          },
        ],
        "triggerCondition.agioRate": [
          {
            required: true,
            message: "请输入推荐车型/推荐车型价差率"
          }
        ],
        lazyTime: [
          {
            required: true,
            message: "请输入推荐展示时间"
          }
        ],
        useRecommendationCoupon: [
          {
            required: true
          }
        ],
        iconUrl: [
          {
            required: true,
            type: "array",
            message: "请上传乘客端配图"
          }
        ]
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const { startTime, endTime, recommendationVehicleLevel, triggerVehicleLevels, triggerCondition, ...others } = val

          this.$nextTick(() => {
            this.form = {
              periodTime: [startTime, endTime],
              recommendationVehicleLevel: recommendationVehicleLevel,
              triggerVehicleLevels,
              triggerCondition: {
                ...triggerCondition,
                vehicleLevelForAgioRate: triggerCondition.vehicleLevelForAgioRate
              },
              ...others
            }
          })
        }
      },
      immediate: true
    },
    expandBizLine(val, oldVal) {
      if (val !== oldVal) {
        if (this.form.recommendationVehicleLevel) {
          this.form.recommendationVehicleLevel = ""
        }
        if (this.form.triggerVehicleLevels.length) {
          this.form.triggerVehicleLevels = []
        }
        if (this.form.triggerCondition.vehicleLevelForAgioRate) {
          this.form.triggerCondition.vehicleLevelForAgioRate = ""
        }
      }
    }
  },
  methods: {
    selectDown(row) {
      this.closeRewardModal()
      this.form.recommendationCouponId = row.grantRewardPackageUuid
      this.form.subRecommendationCouponId = row.uuid
      this.form.showRecommendationCouponId = row.subRewardCode
    },
    openRewardModal() {
      if (this.isEdit && !this.form.isNew) return
      this.rewardVisible = true
    },
    closeRewardModal() {
      this.rewardVisible = false
    },
    handleChangeSelect(value) {
      if (value.length > 3) {
        this.form.triggerVehicleLevels.splice(3, 1)
      } else {
        this.form.triggerVehicleLevels = value
      }
    }
  }
}
</script>

<style scoped lang="less">
.suffix-icon {
  line-height: 32px;
  height: 32px;
}

.suffix-tip {
  color: #999999;
  margin-left: 20px;
}

.nowrap {
  white-space: nowrap;
}

.flex-content {
  display: flex;
  width: 200px;

  .flex-text {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
}
</style>
