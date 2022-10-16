import Vue from 'vue'

import './trigger-config.less'
import { EDIT, DETAIL, CREATE } from "../../constant";
import { updateSfFrequency } from "_o/api/guide-config";

const defaultFormData = {
  time: [],
  totalTime: 1,
  triggerNode: [],
  // configInfoMap: {
  //   1: { manyDaySum: 1, everyDaySum: 1 },
  //   2: { manyDaySum: 1, everyDaySum: 1 },
  //   3: { manyDaySum: 1, everyDaySum: 1 },
  //   4: { manyDaySum: 1, everyDaySum: 1 },
  // }
  configInfoList: [
    { triggerNode: '1', manyDaySum: 1, everyDaySum: 1 },
    { triggerNode: '2', manyDaySum: 1, everyDaySum: 1 },
    { triggerNode: '3', manyDaySum: 1, everyDaySum: 1 },
    { triggerNode: '4', manyDaySum: 1, everyDaySum: 1 },
  ]
}

const formRules = {
  time: [
    { required: true, type: 'array', message: '有效期必选', trigger: 'change', fields: {
        0: {type: 'date', required: true, message: '请输入起止日期'},
        1: {type: 'date', required: true, message: '请输入起止日期'}
      }
    }
  ],
  totalTime: [
    { required: true, type: 'number', min: 1, message: '触发总次数必填', trigger: 'blur' }
  ],
  triggerNode: [
    { required: true, type: 'array',message: '触发节点必选', trigger: 'change' }
  ],
}

export default Vue.extend({
  name: 'triggerConfig',
  props: {
    type: {
      type: String,
      default: EDIT,
    },
    triggerData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: { ...defaultFormData }
    }
  },
  computed: {
    formDisable: function() {
      return this.type === DETAIL
    },
  },
  methods: {
    handleOk() {},
    handleConfirm() {
      this.$Modal.confirm({
        title: '确认取消活动?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // this.$router.replace({ name: 'driver-configure' })
        }
      })
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid || this.type === DETAIL) return

        const { time, totalTime, configInfoList, triggerNode } = this.formData
        const params = {
          id: this.triggerData.id,
          totalTime,
          startTime: this.$moment(time[0]).format('x'),
          endTime: this.$moment(time[1]).format('x'),
          configInfoList: configInfoList.filter(info => triggerNode.indexOf(info.triggerNode) > -1)
        }

        console.log(JSON.stringify(params, null, 2));

        const inputNumIsRequired = params.configInfoList.every(({ manyDaySum, everyDaySum }) => {
          const isNum = (typeof manyDaySum === 'number' && typeof everyDaySum === 'number')
          const limit = (manyDaySum >= 1 && everyDaySum >= 1)
          return isNum && limit
        })
        if (!inputNumIsRequired) return this.$Message.error('请填写触发频率配置')

        if (params.endTime < Date.now()) return this.$Message.error('有效期结束时间必须为未来时间。')

        const sum = params.configInfoList.reduce((pre, cur) => (pre += cur.manyDaySum), 0)

        if (sum > totalTime) return this.$Message.error('触发次数上限总和不得大于触发总次数')

        const res = await updateSfFrequency(params)
        if (!res.data.success) return this.$Message.error(res.data.msg)
        this.formData = { ...defaultFormData }
        // this.$refs.form.resetFields();
        this.$emit('confirm')
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  created() {
  },
  async mounted() {
    const { configInfoMap, totalTime, startTime, endTime } = this.triggerData

    if (!configInfoMap) { // 没还创建
      return this.formData = { ...defaultFormData }
    }

    const triggerNode = Object.keys(configInfoMap)
    const mergedMap = {
      ...{
        1: { manyDaySum: 1, everyDaySum: 1 },
        2: { manyDaySum: 1, everyDaySum: 1 },
        3: { manyDaySum: 1, everyDaySum: 1 },
        4: { manyDaySum: 1, everyDaySum: 1 },
      },
      ...configInfoMap,
    }

    this.formData = {
      time: [startTime, endTime],
      totalTime,
      triggerNode,
      configInfoList: Object.keys(mergedMap).map(triggerNode => ({
        triggerNode,
        manyDaySum: +mergedMap[triggerNode].manyDaySum,
        everyDaySum: +mergedMap[triggerNode].everyDaySum,
      }))
    }
  },
  destroyed() {
  },
  render(h) {
    return (
      <div class="trigger-config">
        <div class="trigger-config__container">
          <div class="trigger-config__form">
            <Form ref="form" props={{ model: this.formData}} rules={formRules} style="padding-left: 50px" label-position="top">

              <FormItem>
                <Row>
                  <Col span={11}>
                    <FormItem label="有效期:" prop="time">
                      <DatePicker v-model={this.formData.time} type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择有效期(时间段)" style="width: 260px" disabled={this.formDisable}></DatePicker>
                    </FormItem>
                  </Col>

                  <Col span={11}>
                    <FormItem label="触发总次数:" prop="totalTime">
                      <InputNumber v-model={this.formData.totalTime} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 100px" disabled={this.formDisable} />
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>

              <FormItem label="触发频率" prop="triggerNode">
                <CheckboxGroup v-model={this.formData.triggerNode}>
                  <Checkbox label="1" disabled={this.formDisable}>确认用车</Checkbox>
                  <Checkbox label="2" disabled={this.formDisable}>司机接单后</Checkbox>
                  <Checkbox label="3" disabled={this.formDisable}>乘客上车后</Checkbox>
                  <Checkbox label="4" disabled={this.formDisable}>收银台</Checkbox>
                </CheckboxGroup>
                <Divider />
              </FormItem>

              {
                this.formData.triggerNode.indexOf('1') > -1 &&
                <FormItem label="确认用车 配置" required={true}>

                  <Row>
                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[0].manyDaySum">
                        触发次数上限
                        <InputNumber v-model={this.formData.configInfoList[0].manyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>

                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[0].everyDaySum">
                        每天最多触发
                        <InputNumber v-model={this.formData.configInfoList[0].everyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>
                  </Row>

                  <Divider />
                </FormItem>
              }

              {
                this.formData.triggerNode.indexOf('2') > -1 &&
                <FormItem label="司机接单后 配置" required={true}>

                  <Row>
                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[1].manyDaySum">
                        触发次数上限
                        <InputNumber v-model={this.formData.configInfoList[1].manyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>

                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[1].everyDaySum">
                        每天最多触发
                        <InputNumber v-model={this.formData.configInfoList[1].everyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>
                  </Row>
                  <Divider />
                </FormItem>
              }

              {
                this.formData.triggerNode.indexOf('3') > -1 &&
                <FormItem label="乘客上车后 配置" required={true}>

                  <Row>
                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[2].manyDaySum">
                        触发次数上限
                        <InputNumber v-model={this.formData.configInfoList[2].manyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>

                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[2].everyDaySum">
                        每天最多触发
                        <InputNumber v-model={this.formData.configInfoList[2].everyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>
                  </Row>
                  <Divider />
                </FormItem>
              }

              {
                this.formData.triggerNode.indexOf('4') > -1 &&
                <FormItem label="收银台 配置" required={true}>

                  <Row>
                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[3].manyDaySum">
                        触发次数上限
                        <InputNumber v-model={this.formData.configInfoList[3].manyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>

                    <Col span={6}>
                      <FormItem label="" prop="configInfoList[3].everyDaySum">
                        每天最多触发
                        <InputNumber v-model={this.formData.configInfoList[3].everyDaySum} min={1} precision={0} step={1} placeholder="请输入正整数" style="width: 80px" disabled={this.formDisable} />
                        次
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              }

              <FormItem>
                {
                  !this.formDisable &&
                  <Button type="primary" onClick={this.submit}>确定</Button>
                }
                <Button style="margin-left: 8px" onClick={this.cancel}>{this.formDisable ? '关闭' : '取消'}</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
})
