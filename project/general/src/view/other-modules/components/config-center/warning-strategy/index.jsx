import Vue from 'vue'
import './index.less'
import { warnStrategyDetail, warnStrategyUpdate } from '_o/api/warning-strategy'

const formRules = {
  flightDelayNoticeTime: [
    { required: true, message: "请输入航班延迟通知时间", trigger: 'change', type: 'number', min: 0 }
  ],
  noticeDriverDepartTime: [
    { required: true, message: "请输入通知司机前往出发地时间", trigger: 'change', type: 'number', min: 0 }
  ],
  flightDelayNoticeWord: [
    { required: true, message: "请输入航班延迟通知司机文案", trigger: 'change' }
  ],
  noticeDriverDepartWord: [
    { required: true, message: "请输入通知司机前往出发地文案", trigger: 'change' }
  ]
}

export default Vue.extend({
  name: "warning-strategy",
  data() {
    return {
      formData: {
        flightDelayNoticeTime: 0,
        flightDelayNoticeWord: "",
        noticeDriverDepartTime: 0,
        noticeDriverDepartWord: ""
      },
      formDisable: true
    }
  },
  computed: {

  },
  async mounted() {
    await this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await warnStrategyDetail()
      if (!res.data.success) return this.$Message.error(res.data.msg)
      const { data = null } = res.data
      if (data === null || !data) return
      this.formData = data
    },
    async updateStrategy(params) {
      const res = await warnStrategyUpdate(params)
      if (!res.data.success) return this.$Message.error(res.data.msg)
      this.$Message.success(res.data.msg || '更新成功')
      this.endEdit()
    },
    startEdit() {
      this.formDisable = false
    },
    endEdit() {
      this.formDisable = true
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const params = { ...this.formData }
        await this.updateStrategy(params)
      })
    },
    async cancel() {
      this.$refs.form.resetFields()
      await this.getDetail()
      this.endEdit()
    },

  },
  render() {
    return (
      <div class="warning-strategy">
        <div class="warning-strategy__container">
          <div class="warning-strategy__form">
            <Form ref="form" props={{
              model: this.formData,
              rules: formRules
            }} label-position={'top'} style="padding-left: 50px">
              <Row>
                <Col>
                  <FormItem label="航班延迟通知时间（分钟）: 仅能输入0-999之间的整数" prop={"flightDelayNoticeTime"}>
                    <InputNumber v-model={this.formData.flightDelayNoticeTime} min={0} max={999} precision={0} step={1} placeholder="请输入" style="width: 200px" disabled={this.formDisable} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label={`航班延迟通知司机文案:`} prop={"flightDelayNoticeWord"}>
                    <Input v-model={this.formData.flightDelayNoticeWord} maxlength={100} type="textarea" rows={4} placeholder="请输入..." style="width: 300px" disabled={this.formDisable} />
                  <span>{this.formData.flightDelayNoticeWord.length}/100</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label="通知司机前往出发地时间（分钟）: 仅能输入0-999之间的整数" prop={"noticeDriverDepartTime"}>
                    <InputNumber v-model={this.formData.noticeDriverDepartTime} min={0} max={999} precision={0} step={1} placeholder="请输入" style="width: 200px" disabled={this.formDisable} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label={`通知司机前往出发地文案:`} prop={"noticeDriverDepartWord"}>
                    <Input v-model={this.formData.noticeDriverDepartWord} maxlength={100} type="textarea" rows={4} placeholder="请输入..." style="width: 300px" disabled={this.formDisable} />
                    <span>{this.formData.noticeDriverDepartWord.length}/100</span>
                  </FormItem>

                </Col>
              </Row>
              <FormItem>
                {
                  this.formDisable && <Button type="primary" onClick={this.startEdit}>编辑</Button>
                }
                {
                  !this.formDisable && <Button style="margin-left: 0px" onClick={this.cancel}>取消</Button>
                }
                {
                  !this.formDisable && <Button style="margin-left: 8px" type="primary" onClick={this.submit}>保存</Button>
                }
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
})
