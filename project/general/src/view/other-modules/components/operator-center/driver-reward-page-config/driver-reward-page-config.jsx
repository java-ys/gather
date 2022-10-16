import Vue from 'vue'
import { Steps, Button, Form, Divider, Modal } from 'ant-design-vue'
import BasicConfigEdit from './basic-config-edit/basic-config-edit'
import ShareConfigEdit from './share-config-edit/share-config-edit'
import MobilePageEdit from './mobile-page-edit/mobile-page-edit'

import './driver-reward-page-config.less'
import { CREATE, EDIT } from "./constant";
import { mapActions } from "vuex";

const FormItem = Form.Item
const Step = Steps.Step

const steps = [
  {
    title: '基础信息配置',
    content: 'basic-config-edit',
    component: BasicConfigEdit,
    // component: () => import('./basic-config-edit/basic-config-edit'),
  },
  {
    title: '分享设置',
    content: 'share-config-edit',
    component: ShareConfigEdit,
    // component: () => import('./share-config-edit/share-config-edit'),
  },
  {
    title: 'H5分享落地页设置',
    content: 'mobile-page-edit',
    component: MobilePageEdit,
    // component: () => import('./mobile-page-edit/mobile-page-edit'),
  },
]

export default Vue.extend({
  name: 'driverRewardPageConfig',
  data() {
    return {
      showCancel: false,
      current: 0,
      form: this.$form.createForm(this, { name: 'reward-config' }),
    }
  },
  provide: {
  },
  inject: {
    type: { default: CREATE },
    id: { default: '-1' },
  },
  methods: {
    ...mapActions('operator-center/dirver-reward-page-config', ['getDriverRewardPageConfig', 'clearDriverRewardPageConfig']),
    handleOk() {
      this.showCancel = false
      this.$router.replace({ name: 'driver-configure' })
    },
    handleConfirm() {
      Modal.confirm({
        title: '确认取消活动?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.clearDriverRewardPageConfig()
          this.$router.replace({ name: 'driver-configure' })
        }
      })
    },
    submit() {
      const { handleSubmit } = this.$refs.edit
      handleSubmit && handleSubmit.call()
    },
    next() {
      const { handleSubmit } = this.$refs.edit
      handleSubmit && handleSubmit.call()
    },
    prev() {
      this.current--
    },
  },
  async mounted() {
    if (this.type === EDIT) await this.getDriverRewardPageConfig({ id: this.id })
  },
  destroyed() {
    this.clearDriverRewardPageConfig()
  },
  render(h) {
    const EditComponent = steps[this.current].component
    return (
      <div class="driver-reward-page-config">
        <div class="driver-reward-page-config__container">
          <div class="steps__content">
            <Steps current={this.current}>
              {
                steps.map(step => <Step key={step.title} title={step.title}/>)
              }
            </Steps>
          </div>
          
          <div class="edit__content">
            <EditComponent ref="edit" next={() => this.current++} />
          </div>
  
          <Divider />
          
          <div class="active__content">
            <Form label-col={{ span: 5 }} wrapper-col={{ span: 5 }}>
              <FormItem wrapper-col={{ span: 5, offset: 5 }}>
                <Button onClick={this.handleConfirm}>取消</Button>
                {this.current > 0 && <Button onClick={this.prev}>上一步</Button>}
                {this.current < steps.length - 1 && <Button type="primary" onClick={this.next}>下一步</Button>}
                {this.current === steps.length - 1 && <Button type="primary" onClick={this.submit}>提交</Button>}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
})
