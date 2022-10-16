<template>
  <Modal
    :value="visible"
    :title="modalTitle"
    :width="850"
    @on-cancel="handleCancel"
    @close="handleCancel"
  >
    <div slot="footer">
      <Button
        type="primary"
        @click="submit"
      >
        提交
      </Button>
    </div>
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="80"
      inline
    >
      <Divider orientation="left">基本信息</Divider>
      <div>
        <FormItem
          prop="ruleName"
          label="策略名称"
        >
          <Input
            v-model="form.ruleName"
            placeholder="请输入"
            :maxlength="32"
            style="width: 300px;"
          />
        </FormItem>
        <FormItem
          prop="cityCodes"
          label="城市"
        >
          <Select
            v-model="form.cityCodes"
            :disabled="!!detailData"
            multiple
            filterable
            style="width: 300px"
            @on-change="handleCityChange"
          >
            <Option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
      </div>
      <div>
        <FormItem
          prop="expandBizLine"
          label="业务线"
        >
          <Select
            v-model="form.expandBizLine"
            style="width: 300px"
            @on-change="changeBusiness"
          >
            <Option
              v-for="(m, index) in businessGradeList"
              :key="index"
              :value="m.value"
            >
              {{m.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          prop="businessType"
          label="产品线"
        >
          <Select
            v-model="form.businessType"
            style="width: 300px"
            @on-change="changeProduct"
          >
            <Option
              v-for="(m, index) in prodoctLines"
              :key="index"
              :value="m.bizType"
            >
              {{m.bizTypeName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          prop="carLevelList"
          label="车型等级"
        >
          <Select
            v-model="form.carLevelList"
            :disabled="!form.businessType"
            multiple
            style="width: 300px"
          >
            <Option
              v-for="(item, index) in carLevelList"
              :key="index"
              :value="item.vehicleLevel"
            >
              {{item.vehicleName}}
            </Option>
          </Select>
        </FormItem>
      </div>
      <div>
        <FormItem
          prop="typeTimeList"
          label="订单类型"
        >
          <CheckboxGroup
            v-model="form.typeTimeList"
          >
            <Checkbox
              v-for="item in orderTypeList"
              :key="item.value"
              :label="item.value"
            >
              {{item.label}}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>
      <div>
        <FormItem
          prop="effectTime"
          label="生效时间"
        >
          <DatePicker
            v-model="form.effectTime"
            type="datetimerange"
            placeholder="选择生效时间"
            :options="datePickerOption"
            style="width: 300px"
            @on-change="rangeChange"
          />
        </FormItem>
      </div>

      <Divider orientation="left">策略信息</Divider>
      <div>
        <div
          v-for="(item, index) in form.holidaySurchargeRules"
          :key="index"
          class="time-item"
        >
          <FormItem
            :label-width="100"
            :label="'时间段' + (index + 1)"
            :prop="'holidaySurchargeRules.' + index + '.period'"
            :rules="{
              required: true,
              message: '请选择时间段' + (index + 1),
              trigger: 'change',
              type: 'array'
            }"
          >
            <TimePicker
              v-model="item.period"
              type="timerange"
              placeholder="选择时间段"
              style="width: 200px"
            />
          </FormItem>
          <FormItem
            :label-width="100"
            :rules="{
              required: true,
              message: '请输入节日服务费',
              trigger: 'blur',
            }"
            :prop="'holidaySurchargeRules.' + index + '.holidaySurcharge'"
            label="节日服务费"
          >
            <Input
              ref="input"
              v-model="item.holidaySurcharge"
            >
            <span slot="append">元/单</span>
            </Input>
          </FormItem>

          <FormItem>
            <Button
              v-if="index !== 0 && index === form.holidaySurchargeRules.length - 1"
              type="primary"
              @click="deleteTimeline(index)"
            >
              删除该时间段
            </Button>
          </FormItem>
        </div>
      </div>
      <div>
        <Button
          style="margin-top: 20px;"
          type="primary"
          @click="addTimeline"
        >
          添加时间段
        </Button>
      </div>
    </Form>
    <Spin
      v-if="modalLoading"
      fix
    />
  </Modal>
</template>

<script>
import moment from "moment"
import { carGroupMap } from "_o/components/price-center/holiday-expenses/fields"
import { mapState } from "vuex"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: () => []
    },
    businessTypeList: {
      type: Array,
      default: () => []
    },
    orderTypeList: {
      type: Array,
      default: () => []
    },
    detailData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      carGroupMap,
      datePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      form: {
        ruleName: "",
        cityCodes: [],
        businessType: "",
        carLevelList: [],
        typeTimeList: [],
        effectTime: [],
        holidaySurchargeRules: [
          {
            period: ["00:00:00", "23:59:59"],
            holidaySurcharge: ""
          }
        ],
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
            message: "请选择城市"
          }
        ],
        businessType: [
          {
            required: true,
            message: "请选择产品线"
          }
        ],
        carLevelList: [
          {
            required: true,
            message: "请选择车型等级"
          }
        ],
        typeTimeList: [
          {
            required: true,
            message: "请选择车型等级"
          }
        ],
        effectTime: [
          {
            required: true,
            message: "请选择生效时间",
          },
          {
            validator: (rule, value, callback) => {
              console.log("value", value)
              if (!value) {
                callback(new Error("请选择生效时间"))
              } else if (moment(value[0]).valueOf() < new Date().getTime()) {
                callback(new Error("生效时间不能小于当前时间"))
              } else {
                callback()
              }
            }
          }
        ],
      },
      prodoctLines: [], // 产品线
      carLevelList: [] // 车型等级
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    }),
    modalTitle() {
      return this.detailData ? "编辑策略" : "新建策略"
    }
  },
  watch: {
    visible(val, oldVal) {
      if (!val && oldVal) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    },
    detailData: {
      handler(val) {
        if (val) {
          const { holidaySurchargeExtend, effectiveTime, failureTime, holidaySurchargeRules, cityCode, businessType, expandBizLine, ...others  } = val
          this.form = {
            ...others,
            carLevelList: holidaySurchargeExtend.carLevelList,
            typeTimeList: holidaySurchargeExtend.typeTimeList.map(item => String(item)),
            effectTime: [effectiveTime, failureTime],
            cityCodes: cityCode.split(","),
            businessType: String(businessType),
            expandBizLine,
            holidaySurchargeRules: holidaySurchargeRules.map(item => ({
              period: [item.periodBegin, item.periodEnd],
              holidaySurcharge: String(item.holidaySurcharge)
            }))
          }
          this.changeBusiness(expandBizLine)
          console.log("this.$refs.input", this.$refs.input)
          console.log("form", this.form, holidaySurchargeExtend.carLevelList.map(item => String(item)))
        } else {
          this.form = {
            ruleName: "",
            cityCodes: [],
            businessType: "",
            carLevelList: [],
            typeTimeList: [],
            effectTime: [],
            holidaySurchargeRules: [
              {
                period: ["00:00:00", "23:59:59"],
                holidaySurcharge: ""
              }
            ]
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    rangeChange(time) {
      if (time[1].slice(-8) === "00:00:00") {
        time[1] = time[1].slice(0, -8) + "23:59:59"
        // 由于this.time是标准日期，因此必须使用这样的语句
        this.form.effectTime = time
      }
    },
    addTimeline() {
      this.form.holidaySurchargeRules.push({
        period: [],
        holidaySurcharge: ""
      })
    },
    deleteTimeline(idx) {
      this.form.holidaySurchargeRules.splice(idx, 1)
    },
    // handleBusinessChange() {
    //   this.form.carLevelList = []
    // },
    handleCancel() {
      this.$emit("close")
    },
    handleCityChange(value) {
      console.log(value)
      if (value.indexOf(1) > -1) {
        this.form.cityCodes = [1]
      } else {
        this.form.cityCodes = value
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { carLevelList, typeTimeList, effectTime, holidaySurchargeRules, cityCodes, ...others } = this.form
          // 检测是否有重复时间段
          let startTime = []
          let endTime = []

          holidaySurchargeRules.forEach(item => {
            startTime.push(moment(`2000-01-01 ${item.period[0]}`).valueOf())
            endTime.push(moment(`2000-01-01 ${item.period[1]}`).valueOf())
          })

          startTime.sort()
          endTime.sort()

          for (let i = 1; i < startTime.length; i++) {
            if (startTime[i] <= endTime[i - 1]) {
              this.$Message.error("时间段有重复")
              return
            }
          }

          const params = {
            ...others,
            holidaySurchargeExtend: {
              carLevelList,
              typeTimeList
            },
            effectiveTime: moment(effectTime[0]).format("YYYY-MM-DD HH:mm:ss"),
            failureTime: moment(effectTime[1]).format("YYYY-MM-DD HH:mm:ss"),
            holidaySurchargeRules: holidaySurchargeRules.map(item => {
              return {
                periodBegin: item.period[0],
                periodEnd: item.period[1],
                holidaySurcharge: item.holidaySurcharge
              }
            })
          }

          if (this.detailData) {
            params.cityCode = cityCodes[0]
          } else {
            params.cityCodes = cityCodes
          }

          console.log(params)

          this.$emit("submit", params)
        }
      })
    },
    // 变更业务线下拉
    changeBusiness(value) {
      const business = this.businessGradeList.find(v => v.value === value)
      this.$nextTick(() => {
        this.form.businessType = "" // 清空下级
        this.carLevelList = []
        this.form.carLevelList = []
        this.prodoctLines = business.children || [] // 赋值产品线
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.prodoctLines.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.form.carLevelList = [] // 清空下级
        this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
      })
    }
  }
}
</script>

<style scoped lang="less">
.time-item {
  margin-top: 20px;
  border-bottom: 1px solid #e3e3e3;
}
</style>
