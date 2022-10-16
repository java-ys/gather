<template>
  <div>
    <Form
      ref="topFormValidate"
      :model="topParams"
      :rules="topRules"
      :label-width="110"
      class="top-form"
    >
      <div class="flex-box">
        <FormItem label="所选城市 :">
          {{ parentParams.cityName }}
        </FormItem>
        <FormItem label="业务线 :">
          {{ typeModuleMap[parentParams.businessType] }}
        </FormItem>
      </div>
      <FormItem
        label="策略名称 :"
        prop="name"
      >
        <Input
          v-if="addViewStatus || popDownwindPriceViewAction === 'edit'"
          v-model="topParams.name"
          :maxlength="15"
          placeholder="请输入策略名称"
          style="width: 200px"
        >
        </Input>
        <span v-else>{{ topParams.name }}</span>
      </FormItem>
      <FormItem
        label="生效时间 :"
        prop="effectiveTime"
      >
        <DatePicker
          v-if="addViewStatus || popDownwindPriceViewAction === 'edit'"
          v-model="topParams.effectiveTime"
          type="datetime"
          placeholder="请选择生效时间"
          style="width: 200px"
        >
        </DatePicker>
        <span v-else>{{ topParams.effectiveTime }}</span>
      </FormItem>
      <FormItem
        label="行程类型 :"
        prop="effectiveType"
      >
        <Select
          v-if="addViewStatus || popDownwindPriceViewAction === 'edit'"
          v-model="topParams.effectiveType"
          placeholder="请选择行程类型"
          style="width:200px"
        >
          <Option value="1">
            市内行程
          </Option>
          <Option value="2">
            城际行程
          </Option>
        </Select>
        <span v-else>{{ topParams.effectiveType | routeTypeFilter }}</span>
      </FormItem>
      <FormItem
        label="人数 :"
        prop="number"
      >
        <div
          v-if="addViewStatus || popDownwindPriceViewAction === 'edit'"
          style="border: 1px solid #eee; padding: 20px;"
        >
          <type
            v-for="(item, key, index) in straInfo"
            :key="key"
            :index="key"
            :formDynamic="PriceOfShuttle[key].formDynamic"
            :serviceFormDynamic="ServiceOfShuttle[key].formDynamic"
            :timeFormDynamix="TimeOfShuttle[key]"
            :sliderRange="item"
          >
            <template v-slot="{ index }">
              <Button
                v-if="!!index"
                size="small"
                type="error"
                @click="delType(index)"
              >
                删除
              </Button>
              <Button
                v-else
                size="small"
                :disabled="disabled"
                @click="addType"
              >
                添加
              </Button>
            </template>
          </type>
        </div>
        <div
          v-else
          style="border: 1px solid #eee; padding: 20px;"
        >
          <typedetail
            v-for="(item, key) in detailData"
            :key="key"
            :data="item"
          >
          </typedetail>
        </div>
      </FormItem>
    </Form>
    <!-- 费用试算 -->
    <div>
      <Row>
        <Col
          :span="3"
          style="margin-top: 20px;padding-left: 20px;"
        >费用试算:</Col>
        <Col :span="20">
        <Form
          ref="stragetyCondition"
          inline
          :model="stragetyCondition"
          :rules="computedRules"
        >
          <FormItem
            prop="perNum"
            label="人数："
            style="margin-right: 20px;"
          >
            <Input
              v-model.number="stragetyCondition.perNum"
              placeholder="输入人数"
              style="width: 120px"
            ></Input>
          </FormItem>
          <FormItem
            prop="transferMileage"
            label="接送里程："
            style="margin-right: 20px;"
          >
            <Input
              v-model.number="stragetyCondition.transferMileage"
              placeholder="输入接送里程"
              style="width: 120px"
            ></Input>
          </FormItem>
          <FormItem
            prop="serviceMileage"
            label="服务里程："
            style="margin-right: 20px;"
          >
            <Input
              v-model.number="stragetyCondition.serviceMileage"
              placeholder="输入服务里程"
              style="width: 120px"
            ></Input>
          </FormItem>
          <FormItem
            prop="priceTime"
            label="时长："
            style="margin-right: 50px;"
          >
            <Input
              v-model.number="stragetyCondition.priceTime"
              placeholder="时长"
              style="width: 120px"
            ></Input>
          </FormItem>
          <FormItem label="">
            <div style="height: 30px"></div>
            <Button
              size="large"
              type="primary"
              @click="computedAction"
            >
              计算
            </Button>
          </FormItem>
        </Form>
        </Col>
      </Row>
      <Row>
        <Col
          :span="5"
          :gutter="3"
        >行程总费用（元）: {{ computed.totalFare }}</Col>
        <Col
          :span="5"
          :gutter="3"
        >接送费用（元）：{{ computed.transferFare }}</Col>
        <Col
          :span="5"
          :gutter="3"
        >服务费用（元）：{{ computed.serviceFare }}</Col>
        <Col
          :span="5"
          :gutter="3"
        >时长费用（元）: {{ computed.priceTimeFare }}</Col>
      </Row>
    </div>
    <div class="popView-footer-wrap">
      <Button
        size="large"
        type="text"
        style="margin-right: 8px;"
        @click="commit(0)"
      >
        取消
      </Button>
      <Button
        size="large"
        type="primary"
        @click="commit(1)"
      >
        确定
      </Button>
    </div>
  </div>
</template>

<script>
import type from './type'
import typedetail from './type-detail'
import { typeModuleMap, hitchRouteTypeMap } from '_g/config/status-map'
import { errorCaptured, findComponentsDownward, eventEmitter } from '../utils'
import moment from 'moment'
import {
  addPricePolicy,
  pricePolicyCalculate,
  pricePolicySelectDetails,
  toResult, updatePricePolicy
} from '_o/api/cityOpen'

const InfinityNum = '100000000000000' // 无穷大
const validators = {
  validator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('正数且最多两位小数'))
    } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
      callback(new Error('正数且最多两位小数'))
    } else {
      callback()
    }
  }
}
export default {
  components: {
    type, typedetail
  },
  filters: {
    routeTypeFilter (v) {
      return hitchRouteTypeMap[v] || ''
    }
  },
  props: {
    parentParams: {
      type: Object,
      default: null
    },
    value: Boolean,
    popDownwindPriceViewAction: String
  },
  data () {
    return {
      topRules: {
        name: [{ required: true, validator: this.validatorName, trigger: 'change' }],
        effectiveTime: [{ required: true, trigger: 'change', validator: this.validatorEffectiveTime }],
        number: [{ required: true, validator: this.effectiveNum }],
        effectiveType: [
          { required: true, type: 'string', validator: this.validatorEffectiveType, trigger: 'change' }
        ]
      },
      topParams: {
        name: '',
        effectiveType: '',
        effectiveTime: ''
      },
      typeModuleMap,
      addViewStatus: true, // true：新增  false：详情
      straInfo: [],
      // 接送里程单价数据
      PriceOfShuttle: [],
      // 服务里程单价数据
      ServiceOfShuttle: [],
      // 时长单价
      TimeOfShuttle: [],
      eventEmitterInstance: null,
      detailData: null, // 详情需要组装的数据
      computed: {
        totalFare: null,
        transferFare: null,
        serviceFare: null,
        priceTimeFare: null
      },
      stragetyCondition: {
        perNum: null,
        transferMileage: null,
        serviceMileage: null,
        priceTime: null
      },
      computedRules: {
        perNum: [{ required: true, pattern: /^[1-4]{1}$/, message: '请输入[1-4]之间的整数', trigger: 'change' }],
        transferMileage: [{ required: true, validator: validators.validator, trigger: 'change' }],
        serviceMileage: [{ required: true, validator: validators.validator, trigger: 'change' }],
        priceTime: [{ required: true, validator: validators.validator, trigger: 'change' }]
      },
      uuid: ''
    }
  },
  computed: {
    disabled () {
      return this.straInfo[this.straInfo.length - 1].checked === 4
    },
    addParams () {
      return {
        cityUuid: this.parentParams.cityUuid,
        cityName: this.parentParams.cityName,
        // cityId: this.parentParams.cityId,
        // province: this.parentParams.provinceName,
        // provinceId: this.parentParams.provinceId,
        bizCode: Number(this.parentParams.businessType),
        strategyName: this.topParams.name,
        effectiveTime: moment(this.topParams.effectiveTime).format('YYYY-MM-DD HH:mm:ss'),
        routeType: Number(this.topParams.effectiveType),
        strategyContentReqList: this.strategyContentReqList
      }
    },
    strategyContentReqList () {
      let params = []
      for (let i = 0; i < this.PriceOfShuttle.length; i++) {
        let transferMileages = [] // 接送里程单价数据
        let serviceMileages = [] // 服务里程单价数据
        this.PriceOfShuttle[i].formDynamic.column.forEach(item => {
          if (Number(item.status) === 1) {
            transferMileages.push({
              'keyX': item.min.toString(),
              'keyY': InfinityNum,
              'value': item.value.toString()
            })
          } else {
            transferMileages.push({
              'keyX': item.min.toString(),
              'keyY': item.max.toString(),
              'value': item.value
            })
          }
        })
        this.ServiceOfShuttle[i].formDynamic.column.forEach(item => {
          if (Number(item.status === 1)) {
            serviceMileages.push({
              'keyX': item.min.toString(),
              'keyY': InfinityNum,
              'value': item.value.toString()
            })
          } else {
            serviceMileages.push({
              'keyX': item.min.toString(),
              'keyY': item.max.toString(),
              'value': item.value.toString()
            })
          }
        })
        params[i] = {
          personNumber: this.straInfo[i].max,
          priceTime: this.TimeOfShuttle[i].fare.toString(),
          transferMileages: transferMileages,
          serviceMileages: serviceMileages
        }
      }
      return params
    },
    calculateParams () {
      return {
        cityUuid: this.parentParams.cityUuid,
        typeModule: Number(this.parentParams.businessType),
        routeType: this.topParams.effectiveType,
        personNumber: this.stragetyCondition.perNum,
        transferMileages: this.stragetyCondition.transferMileage,
        serviceMileages: this.stragetyCondition.serviceMileage,
        serviceTime: this.stragetyCondition.priceTime
      }
    }
  },
  watch: {
    async value () {
      if (this.value) { // 开启弹层
        this.handleReset()
        if (this.popDownwindPriceViewAction === 'add') { // 新建
          this.addViewStatus = true
          this.topParams = {}
          this.PriceOfShuttle = []
          this.PriceOfShuttle.push({
            formDynamic: {
              column: [
                {
                  key: '',
                  title: '',
                  min: 0,
                  max: '',
                  status: 0,
                  value: ''
                }
              ]
            }
          })
          this.ServiceOfShuttle = [
            {
              formDynamic: {
                column: [
                  {
                    key: '',
                    title: '',
                    min: 0,
                    max: '',
                    status: 0,
                    value: ''
                  }
                ]
              }
            }
          ]
          this.TimeOfShuttle = [{ fare: '' }]
          this.straInfo = [
            {
              min: 1,
              checked: 4,
              max: 4
            }
          ]
          this.clearList()
          this.limitSlider()
        } else {
          this.clearList()
          this.addViewStatus = false
        }
      }
    }
  },
  provide: function () {
    return {
      strategy: this
    }
  },
  mounted () {
    this.eventEmitterInstance = new eventEmitter()
    let self = this

    this.eventEmitterInstance.on('del', function (i, k, flag) {
      if (flag == 'normal' && self.PriceOfShuttle[k].formDynamic.column[i + 1]) {
        self.PriceOfShuttle[k].formDynamic.column[i + 1].min = self.PriceOfShuttle[k].formDynamic.column[i].min
      } else if (flag !== 'normal' && self.ServiceOfShuttle[k].formDynamic.column[i + 1]) {
        self.ServiceOfShuttle[k].formDynamic.column[i + 1].min = self.ServiceOfShuttle[k].formDynamic.column[i].min
      }
    })

    this.eventEmitterInstance.on('update', function (i, k, flag, val) {
      if (flag == 'normal' && self.PriceOfShuttle[k].formDynamic.column[i + 1]) {
        self.PriceOfShuttle[k].formDynamic.column[i + 1].min = val
      } else if (flag !== 'normal' && self.ServiceOfShuttle[k].formDynamic.column[i + 1]) {
        self.ServiceOfShuttle[k].formDynamic.column[i + 1].min = val
      }
    })
    this.$once('hook:beforeDestory', function () {
      this.eventEmitterInstance.off()
      this.eventEmitterInstance = null
    })
  },
  methods: {
    validatorName (rule, value, callback) {
      if (!this.topParams.name) {
        callback(new Error('请输入策略名称'))
      } else {
        callback()
      }
    },
    validatorEffectiveType (rule, value, callback) {
      if (!this.topParams.effectiveType) {
        callback(new Error('请选择行程类型'))
      } else {
        callback()
      }
    },
    validatorEffectiveTime (rule, value, callback) {
      let date = this.topParams.effectiveTime
      if (!date) { callback(new Error('请选择生效时间')) } else {
        let timestamp = new Date(date).getTime()
        if (timestamp < Date.now()) {
          callback(new Error('生效时间不得小于当前时间'))
        } else { callback() }
      }
    },
    effectiveNum (rule, value, callback) {
      if (this.straInfo.length === 0) return // 人数
      if (this.straInfo[this.straInfo.length - 1].checked !== 4) {
        callback(new Error('请将1-4人策略配置配置完整'))
      }
      if (this.PriceOfShuttle.length === 0) return // 接送
      this.PriceOfShuttle.forEach(item => {
        if (item.formDynamic.column[item.formDynamic.column.length - 1].status !== 1) {
          callback(new Error('请将阶梯价格填写完整'))
        }
      })
      if (this.ServiceOfShuttle.length === 0) return // 服务
      this.ServiceOfShuttle.forEach(item => {
        if (item.formDynamic.column[item.formDynamic.column.length - 1].status !== 1) {
          callback(new Error('请将阶梯价格填写完整'))
        }
      })
      callback()
    },
    initDetailDataList(data) {
      let params = [];
      for (let i = 0; i< data.length; i++) {
        let transferMileages = [] // 接送里程单价数据
        let serviceMileages = [] // 服务里程单价数据
        if (data[i].serviceMileages.length !== 0) {
          data[i].serviceMileages.forEach(it => {
            if (it.keyY === InfinityNum) {
              serviceMileages.push({
                min: it.keyX,
                status: 1,
                value: it.value
              })
            } else {
              serviceMileages.push({
                min: it.keyX,
                max: it.keyY,
                status: 0,
                value: it.value
              })
            }
          })
        }
        if (data[i].transferMileages.length !== 0) {
          data[i].transferMileages.forEach(it => {
            if (it.keyY === InfinityNum) {
              transferMileages.push({
                min: it.keyX,
                status: 1,
                value: it.value
              })
            } else {
              transferMileages.push({
                min: it.keyX,
                max: it.keyY,
                status: 0,
                value: it.value
              })
            }
          })
        }
        params[i] = {
          minNum: i === 0 ? 1 : data[i - 1].personNumber + 1,
          maxNum: data[i].personNumber,
          priceTime: data[i].priceTime,
          transferMileages: transferMileages,
          serviceMileages: serviceMileages
        }
      }
      return params
    },
    async goDetail (params) {
      this.uuid = params
      // 详情
      let [err, data] = await toResult(pricePolicySelectDetails({ uuid: params }))
      if (!data) return
      let strategyContentVOList = JSON.parse(data.strategyContent);
      this.detailData = this.initDetailDataList(strategyContentVOList);
      this.handleReset()
      this.topParams.name = data.strategyName
      this.topParams.effectiveTime = data.effectiveTime
      this.topParams.effectiveType = data.routeType.toString()
      if (this.popDownwindPriceViewAction === 'detail') return
      // 编辑
      this.PriceOfShuttle = []
      this.ServiceOfShuttle = []
      this.TimeOfShuttle = []
      this.straInfo = []
      for (let [key, value] of this.detailData.entries()) {
        this.PriceOfShuttle.push({
          formDynamic: {
            column: value.transferMileages
          }
        })
        this.ServiceOfShuttle.push({
          formDynamic: {
            column: value.serviceMileages
          }
        })
        this.TimeOfShuttle.push({ fare: value.priceTime })
        this.straInfo.push({
          min: value.minNum,
          checked: value.maxNum,
          max: value.maxNum
        })
      }
      this.limitSlider()
    },
    async addType () {
      for (let val of this.straInfo) {
        val.max = val.checked
      };
      this.straInfo.push({
        min: this.straInfo[this.straInfo.length - 1].checked + 1,
        checked: 4,
        max: 4
      })
      this.ServiceOfShuttle.push({
        formDynamic: {
          column: [
            {
              key: '',
              title: '',
              min: 0,
              max: '',
              status: 0,
              value: ''
            }
          ]
        }
      })
      this.PriceOfShuttle.push({
        formDynamic: {
          column: [
            {
              key: '',
              title: '',
              min: 0,
              max: '',
              status: 0,
              value: ''
            }
          ]
        }
      })
      this.TimeOfShuttle.push({ fare: '' })
      this.limitSlider()
    },

    async delType (i) {
      let delArr = this.straInfo.splice(i, 1)
      this.straInfo[i - 1].max = delArr[0].max
      this.PriceOfShuttle.splice(i, 1)
      this.ServiceOfShuttle.splice(i, 1)
      this.TimeOfShuttle.splice(i, 1)
      this.limitSlider()
    },
    limitSlider () {
      this.$nextTick(() => {
        let refsArr = findComponentsDownward(this, 'type')
        refsArr.forEach(item => {
          item.limitDisabled = true
        })
        refsArr[refsArr.length - 1].limitDisabled = false
      })
    },
    clearList () {
      this.$nextTick(() => {
        let refsArr = findComponentsDownward(this, 'list')
        refsArr.map((item) => {
          item.$refs.myRef && item.$refs.myRef.resetFields()
        })
      })
    },
    async sliderChange (o, i) {
      this.straInfo[i].checked = o
    },

    async addTypeItem (i, flag) {
      if (flag == 'normal') {
        await this.PriceOfShuttle[i].formDynamic.column.push({
          key: '',
          title: '',
          min: this.PriceOfShuttle[i].formDynamic.column[this.PriceOfShuttle[i].formDynamic.column.length - 1].max,
          max: '',
          status: this.PriceOfShuttle[i].formDynamic.column.length == 4 ? 1 : 0,
          value: ''
        })
      } else {
        await this.ServiceOfShuttle[i].formDynamic.column.push({
          key: '',
          title: '',
          min: this.ServiceOfShuttle[i].formDynamic.column[this.ServiceOfShuttle[i].formDynamic.column.length - 1].max,
          max: '',
          status: this.ServiceOfShuttle[i].formDynamic.column.length == 4 ? 1 : 0,
          value: ''
        })
      }
    },

    async delTypeItem (i, k, flag) {
      await this.eventEmitterInstance.trigger('del', i, k, flag)
      if (flag == 'normal') {
        await this.PriceOfShuttle[k].formDynamic.column.splice(i, 1)
      } else {
        await this.ServiceOfShuttle[k].formDynamic.column.splice(i, 1)
      }
    },
    async commit (o) {
      let context = this
      if (o) {
        if (this.popDownwindPriceViewAction === 'detail') {
          context.$emit('input', false)
          return
        }
        await context.$refs.topFormValidate.validate(async (valid) => {
          if (valid) {
            let refsArr = await findComponentsDownward(context, 'list')
            let validateArr = []
            refsArr.map((item) => {
              validateArr.push(new Promise((resolve, reject) => {
                item.$refs.myRef.validate(async (valid) => {
                  if (valid) {
                    resolve(true)
                  } else {
                    reject(false)
                  }
                })
              }))
            })

            let [err, res] = await errorCaptured(() => Promise.all(validateArr))
            console.log(2)
            if (err !== null) return this.$Message.error('表单验证不通过')

            // handle Data
            // let perNum = [];
            // for (let [key, value] of this.PriceOfShuttle.entries()) {
            //   let data = {
            //     pickUpMileage: this.PriceOfShuttle[key].formDynamic.column,
            //     seiviceMileage: this.ServiceOfShuttle[key].formDynamic.column,
            //     fare: this.TimeOfShuttle[key].fare
            //   }
            //   perNum.push(data)
            // }
            // let params = { ...this.topParams, perNum }
            if (context.popDownwindPriceViewAction === 'add') { // 新增
              await context.toAddPricePolicy(this.addParams)
            } else { // 编辑
              await context.toUpdatePricePolicy({ uuid: context.uuid, ...this.addParams })
            }
            // context.$emit("input", false)
          } else {
            console.log(1)
            this.$Message.error('表单验证不通过')
          }
        })
      } else { // 清除校验错误的信息
        context.$emit('input', false)
      }
    },
    async toAddPricePolicy (params) {
      const [err, data] = await toResult(addPricePolicy(params))
      if (err) {
        this.$Message.error(err.msg)
        return
      }
      this.$Message.success('新建成功')
      this.$emit('input', false)
      this.$emit('on-confirm')
    },
    async toUpdatePricePolicy (params) {
      const [err, data] = await toResult(updatePricePolicy(params))
      if (err) {
        this.$Message.error(err.msg)
        return
      }
      this.$Message.success('编辑成功')
      this.$emit('input', false)
      this.$emit('on-confirm')
    },
    async handleReset () {
      this.clearFeeNum()
      this.$refs.topFormValidate && this.$refs.topFormValidate.resetFields && this.$refs.topFormValidate.resetFields()
      this.$refs.stragetyCondition && this.$refs.stragetyCondition.resetFields && this.$refs.stragetyCondition.resetFields()
    },
    clearFeeNum () {
      this.computed = {
        totalFare: null,
        transferFare: null,
        serviceFare: null,
        priceTimeFare: null
      }
    },
    async computedAction () {
      let context = this
      if (this.topParams.effectiveType === '' || this.topParams.effectiveType === undefined) {
        this.$Message.error('请选择行程类型');
        return;
      }
      await this.$refs.stragetyCondition.validate(async (valid) => {
        if (valid) {
          await context.getPricePolicyCalculate(context.calculateParams)
        }
      })
    },
    async getPricePolicyCalculate (params) {
      const [err, data] = await toResult(pricePolicyCalculate(params))
      if (!data) {
        this.computed = {
          totalFare: null,
          transferFare: null,
          serviceFare: null,
          priceTimeFare: null
        }
        return;
      }
      this.computed.totalFare = data.totalPrice;
      this.computed.transferFare = data.transferMileagesPrice;
      this.computed.serviceFare = data.serviceMileagePrice;
      this.computed.priceTimeFare = data.servicePrice
    }
  }
}
</script>
