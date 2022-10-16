<template>
  <div>
    <Form
      ref="form"
      inline
      :model="form"
      :rules="rules"
    >
      <FormItem
        label="策略名称"
        prop="ruleName"
      >
        <Input
          v-model="form.ruleName"
          :maxlength="20"
          placeholder="请输入"
        />
      </FormItem>
      <FormItem
        label="策略命中城市"
        prop="cityCodes"
      >
        <Select
          v-model="form.cityCodes"
          placeholder="请选择策略命中城市"
          filterable
          multiple
          :disabled="!!detail"
          style="width: 140px"
          @on-change="handleCityChange"
        >
          <Option
            :value="-1"
            label="全部"
          />
          <Option
            v-for="item in cityList"
            :key="item.label + '_edit'"
            :value="item.value"
            :label="item.label"
          />
        </Select>
      </FormItem>
      <FormItem
        label="策略生效日期"
        prop="effectiveTime"
      >
        <DatePicker
          v-model="form.effectiveTime"
          :disabled="!!detail"
          type="daterange"
          split-panels
          placeholder="请选择策略生效日期"
          style="width: 200px"
        />
      </FormItem>
      <FormItem
        label="策略生效业务线"
        prop="expandBizLine"
      >
        <Select
          v-model="form.expandBizLine"
          placeholder="请选择"
          style="width: 140px"
          @on-change="handleSelectBusiness"
        >
          <Option
            v-for="item in businessGradeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </Select>
      </FormItem>

      <Card
        v-for="(item, index) in form.ruleDetails"
        :key="index"
        class="card-content"
      >
        <div
          slot="title"
          class="card-title"
        >
          <span>配置{{index + 1}}</span>
          <span>
            <Icon
              v-if="form.ruleDetails.length - 1 === index"
              class="icon-handle"
              type="ios-add"
              :size="30"
              @click="addConfigList"
            />
            <Icon
              v-if="form.ruleDetails.length > 1"
              class="icon-handle"
              type="ios-close"
              :size="30"
              @click="deleteConfigList(index)"
            />
          </span>
        </div>
        <config-item
          :ref="`ref_${index}`"
          :key="index"
          :value="item"
          :expand-biz-line="form.expandBizLine"
          :is-edit="!!detail"
          :car-type-list="carTypeList"
          :car-map="carMap"
        />
      </Card>
    </Form>

    <Spin
      v-if="loading"
      size="large"
      fix
    />
  </div>
</template>

<script>
import configItem from "./config-item"
import intersection from "lodash/intersection"
import moment from "moment"
import { carTypeList, defaultRuleDetails } from "_o/components/operator-center/level-change-recommend/const"

export default {
  components: {
    configItem
  },
  props: {
    cityList: {
      type: Array,
      default: () => []
    },
    businessGradeList: {
      type: Array,
      default: () => []
    },
    detail: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      carTypeList: [],
      carMap: {},
      form: {
        ruleName: "",
        cityCodes: [],
        effectiveTime: [],
        expandBizLine: "",
        ruleDetails: [
          defaultRuleDetails
        ]
      },
      rules: {
        ruleName: [
          {
            required: true,
            message: "请输入策略名称"
          }
        ],
        cityCodes: [
          {
            required: true,
            type: "array",
            message: "请选择城市"
          }
        ],
        effectiveTime: [
          {
            required: true,
            type: "array",
            message: "请选择策略生效日期",
            fields: {
              0: {
                type: "date",
                required: true,
                message: "请选择策略生效日期",
              },
              1: {
                type: "date",
                required: true,
                message: "请选择策略生效日期",
              },
            }
          }
        ],
        expandBizLine: [
          {
            required: true,
            message: "请选择策略生效业务线"
          }
        ],
      }
    }
  },
  watch: {
    detail(val) {
      if (val) {
        const { ruleDetails, effectiveTime, failureTime, cityCode, expandBizLine, ...oth } = this.detail
        const [list, map] = carTypeList(expandBizLine)
        this.carTypeList = list
        this.carMap = map
        this.form = {
          ...oth,
          cityCodes: [cityCode],
          effectiveTime: [effectiveTime, failureTime],
          expandBizLine,
          ruleDetails: ruleDetails.map(item => {
            const { startTime, endTime, iconUrl, weekDays, triggerVehicleLevels, ...others } = item
            return {
              periodTime: [startTime, endTime],
              iconUrl: [iconUrl],
              weekDays: JSON.parse(weekDays),
              triggerVehicleLevels: JSON.parse(triggerVehicleLevels),
              ...others
            }
          })
        }
      }
    }
  },
  methods: {
    handleSelectBusiness(value) {
      const [list, map] = carTypeList(value)
      this.carTypeList = list
      this.carMap = map
    },
    handleCityChange(value) {
      if (value[value.length - 1] === -1) {
        this.form.cityCodes = [-1]
      } else {
        const idx = value.indexOf(-1)
        if (idx > -1) {
          value.splice(idx, 1)
        }
        this.form.cityCodes = value
      }
    },
    addConfigList() {
      this.form.ruleDetails.push(defaultRuleDetails)
    },
    deleteConfigList(idx) {
      this.$Modal.confirm({
        title: "确认删除该配置？",
        onOk: () => {
          this.form.ruleDetails.splice(idx, 1)
          this.$Message.success("已删除该配置")
        }
      })
    },
    handleSubmit() {
      const { ruleDetails, effectiveTime, cityCodes, ...others } = this.form
      for (let i = 0; i < ruleDetails.length; i++) {
        ruleDetails[i] = this.$refs[`ref_${i}`][0].form
      }
      let isValid = true
      const isTimeIntersection = (startList, endList) => {
        for (let i = 1; i < startList.length; i++) {
          if (startList[i] <= endList[i - 1]) {
            this.$Message.error("策略时间段有重复")
            isValid = false
            return false
          }
        }
      }
      const isTwoCarConflict = (car1, car2) => {
        const startList = [moment(`2000-01-01 ${car1.periodTime[0]}`).valueOf(), moment(`2000-01-01 ${car2.periodTime[0]}`).valueOf()].sort()
        const endList = [moment(`2000-01-01 ${car1.periodTime[1]}`).valueOf(), moment(`2000-01-01 ${car2.periodTime[1]}`).valueOf()].sort()
        if (intersection(car1.weekDays, car2.weekDays).length !== 0) {
          isTimeIntersection(startList, endList)
        }
      }

      for (let i = 0; i < ruleDetails.length; i++) {
        if (ruleDetails[i] && ruleDetails[i + 1]) {
          isTwoCarConflict(ruleDetails[i], ruleDetails[i + 1])
        }
        if (!isValid) return
      }

      const validList = []
      this.$refs.form.validate(valid => {
        validList.push(valid)
      })
      for (let i = 0; i < ruleDetails.length; i++) {
        this.$refs[`ref_${i}`][0].$refs.form.validate(flag => {
          validList.push(flag)
        })
      }
      if (validList.every(Boolean)) {
        const params = {
          ruleDetails: ruleDetails.map(item => {
            const { periodTime, iconUrl, recommendationVehicleLevel, triggerVehicleLevels, triggerCondition, isNew, ...oth } = item
            return {
              ...oth,
              recommendationVehicleLevel: recommendationVehicleLevel,
              triggerVehicleLevels: triggerVehicleLevels,
              triggerCondition: {
                ...triggerCondition,
                vehicleLevelForAgioRate: triggerVehicleLevels.length === 1 ? triggerVehicleLevels[0] : triggerCondition.vehicleLevelForAgioRate
              },
              iconUrl: iconUrl[0],
              startTime: periodTime[0],
              endTime: periodTime[1]
            }
          }),
          ...others,
          effectiveTime: effectiveTime[0],
          failureTime: effectiveTime[1],
          cityCodes: cityCodes.indexOf(-1) > -1 ? this.cityList.map(item => item.value) : cityCodes
        }
        return params
      }
    }
  }
}
</script>

<style scoped lang="less">
.card-content {
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-handle {
  cursor: pointer;
}
</style>
