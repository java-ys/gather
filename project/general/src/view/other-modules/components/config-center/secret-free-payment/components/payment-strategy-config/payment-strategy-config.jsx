import Vue from 'vue'

import './payment-strategy-config.less'
import { CREATE, EDIT, DETAIL } from "../../constant";
import NewUserGroupModal from "../new-user-group-modal/index.vue";
import UserGroupScenceModal from "../user-group-scence-modal/index.vue";
import TaskModal from '../task-modal/index.vue'
import { userGroupColumns, taskColumns } from "../user-group-scence-modal/fields";
import { productLineList } from '../../conf'
import { getProvinceCityList } from '_g/api/common'
import { cpTranslate } from '@/libs/tools';
import { getToken } from "@/libs/util.js";
import { secretFreeGuidanceUpdate, secretFreeGuidanceAdd, secretFreeGuidanceDetail } from "_o/api/guide-config";
import { mapState } from "vuex";
const formBaseRules = {
  sfConfigName: [
    { required: true, message: '策略名称必填', trigger: 'blur' }
  ],
  citys: [
    { required: true, type: 'array', message: '生效城市必选', trigger: 'change' }
  ],
  time: [
    { required: true, type: 'array', message: '有效期必选', trigger: 'change', fields: {
        0: {type: 'date', required: true, message: '请输入起止日期'},
        1: {type: 'date', required: true, message: '请输入起止日期'}
      }
    }
  ],
  productLine: [
    { required: true, type: 'array', message: '业务线必选', trigger: 'change' }
  ],
  triggerNode: [
    { required: true, message: '触发节点必选', trigger: 'change' }
  ],
}

const defaultTriggerFormData = {
  userGroupType: '0',
  taskFlag: '0',
  guidePageContent: '',
  guidePageEntranceContent: '',
  guidePageImage: ''
}

const defaultFormData = {
  sfConfigName: '',
  time: [],
  citys: [],
  productLine: [],
  triggerNode: '0',
  ...defaultTriggerFormData
}

export default Vue.extend({
  name: 'paymentStrategyConfig',
  data() {
    return {
      citys: [],
      formData: { ...defaultFormData },
      showNewUserGroupModal: false,
      showUserGroupModal: false,
      showTaskModal: false,
      userGroupList: [],
      taskList: [],
      formRules: {
        ...formBaseRules,
        userGroupType: [
          { required: true, message: '用户群必选', trigger: 'change' }
        ],
        taskFlag: [
          { required: true, message: '关联任务必选', trigger: 'change' }
        ],
        guidePageImage: [
          { required: false, message: '引导图片必传', trigger: 'change' }
        ],
        guidePageContent: [
          { required: false, message: '引导页文案', trigger: 'blur' }
        ],
        guidePageEntranceContent: [
          { required: false, message: '引导入口文案必填', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList
    }),
    formDisable: function() {
      return this.type === DETAIL
    },
    isRegisterGuide: function() {
      return this.formData.triggerNode === '0'
    }, // 仅需设置“引导页图片”“引导页文案”
    isConfirmUseCar: function() {
      return this.formData.triggerNode === '1'
    }, // 需设置“引导页图片”“引导页文案”，可关联任务、可设置用户群
    isDriverTakesOrder: function() {
      return this.formData.triggerNode === '2'
    }, // 需设置“引导页图片”“引导页文案”“入口文案”，可关联任务、可设置用户群、
    isPassengerBoarding: function() {
      return this.formData.triggerNode === '3'
    }, // 需设置“引导页图片”“引导页文案”“入口文案”，可关联任务、可设置用户群、
    isCheckoutCounter: function() {
      return this.formData.triggerNode === '4'
    }, // 可设置用户群。
  },
  inject: {
    type: { default: CREATE },
    id: { default: undefined },
  },
  methods: {
    openTaskModal() {
      if (this.formData.time.length === 0 || this.formData.time.some(t => !t)){
        return this.$Message.error('请先选择生效时间段')
      }
      this.showTaskModal = true
    },
    handleTriggerChange(e) {
      switch (e) {
        case '0': { // 注册引导
          this.formData = { ...this.formData, ...defaultTriggerFormData }
          this.taskList = []
          this.userGroupList = []
          this.$refs.form.resetFields();
        }
        case '1': { // 确认用车
          this.formData = { ...this.formData, ...defaultTriggerFormData }
          this.taskList = []
          this.userGroupList = []
          this.$refs.form.resetFields();
        }
        case '2': { // 司机接单后
          this.formData = { ...this.formData, ...defaultTriggerFormData }
          this.taskList = []
          this.userGroupList = []
          this.$refs.form.resetFields();
        }
        case '3': { // 乘客上车后
          this.formData = { ...this.formData, ...defaultTriggerFormData }
          this.taskList = []
          this.userGroupList = []
          this.$refs.form.resetFields();
        }
        case '4': { // 收银台
          this.formData = { ...this.formData, ...defaultTriggerFormData }
          this.taskList = []
          this.userGroupList = []
          this.$refs.form.resetFields();
        }
        default: {
          this.formData = { ...this.formData }
          this.taskList = [ ...this.taskList ]
          this.userGroupList = [ ...this.userGroupList ]
          this.$refs.form.resetFields();
        }
      }
    },
    handleTaskChange(e) {
      if (e === '0') { // 不关联任务选项
        this.taskList = []
        this.userGroupList = []
        this.formData.userGroupType = '0'
      } else { // 关联任务选项
        this.taskList = []
        this.userGroupList = []
        this.formData.userGroupType = '0'
      }
    },
    handleUserGroupChange(e) {
      if (e === '0') { // 选择全部用户
        this.userGroupList = []
      } else { // 选择新用户群
        this.userGroupList = []
      }
    },
    handleTimeChange(e) {
      this.taskList = []
    },
    showGuideContent() { // 引导页图片，引导页文案
      return this.isRegisterGuide || this.isConfirmUseCar || this.isDriverTakesOrder || this.isPassengerBoarding
    },
    showEntryText() { // 入口文案
      return this.isDriverTakesOrder || this.isPassengerBoarding
    },
    showUserGroup() {
      return ((this.isConfirmUseCar || this.isDriverTakesOrder || this.isPassengerBoarding) && this.formData.taskFlag === '0') || this.isCheckoutCounter
    },
    showTask() {
      return (this.isConfirmUseCar || this.isDriverTakesOrder || this.isPassengerBoarding) && this.formData.taskFlag === '1'
    },
    showTaskFlag() {
      return this.isConfirmUseCar || this.isDriverTakesOrder || this.isPassengerBoarding
    },
    handleUploadFormatError() {
      this.$Message.error('文件格式错误')
    },
    handleUploadSizeError() {
      this.$Message.error('文件大小不可超过5M')
    },
    beforeUpload(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((reslove, reject) => {
        reader.onload = (e) => {
          let data = e.target.result;
          let image = new Image();
          image.src = data;
          image.onload = () => {
            const { width = 0, height = 0 } = image
            const size = [1284, 2778]
            if (width !== size[0] || height !== size[1]) {
              this.$Message.error({ content: `上传图片尺寸应为${size[0]} * ${size[1]}`, onClose: () => reject() });
            } else {
              reslove();
            }
          };
        };
      });
    },
    // 上传成功回调
    // TODO /common/uploadFile 改造
    handleUploadSuccess(res) {
      if (res.success) {
        this.formData.guidePageImage = res.data.fileUrl
        this.$Message.success('上传成功')
      } else {
        this.$Message.error('上传失败')
      }
    },
    handleOk() {
      // this.$router.replace({ name: 'driver-configure' })
    },
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
        if (!valid || this.type === DETAIL) return this.$Message.error('请填入必填项')

        const { citys, userGroupList, taskList } = this
        const { userGroupType, taskFlag, time, productLine: productLineList, citys: cityCodes, triggerNode, guidePageContent, guidePageEntranceContent, guidePageImage, sfConfigName, ...extData } = this.formData

        if (userGroupType === '1' && userGroupList.length === 0)
          return this.$Message.error('请选择用户群')
        if (taskFlag === '1' && taskList.length === 0)
          return this.$Message.error('请选择任务')
        if (triggerNode !== '4' && !guidePageImage)
          return this.$Message.error('请上传引导图片')
        if ((triggerNode === '2' || triggerNode === '3') && !guidePageEntranceContent)
          return this.$Message.error('请输入引导入口文案')

        const cityList = citys.filter(city => cityCodes.indexOf(city.cityID) > -1).map(item => ({ cityCode: item.cityID, cityName: item.city }))

        const params = {
          ...extData,
          cityList,
          taskFlag,
          triggerNode,
          sfConfigName,
          userGroupType,
          guidePageImage,
          productLineList,
          guidePageContent,
          guidePageEntranceContent,
          id: this.type === EDIT ? this.id : undefined,
          startTime: this.$moment(time[0]).format('x'),
          endTime: this.$moment(time[1]).format('x'),
          userGroupList: userGroupList.map(({ _checked, _disabled, ...vo }) => vo),
          taskInfo: taskList[0]
        };

        if (params.endTime < Date.now()) return this.$Message.error('有效期结束时间必须为未来时间。')

        console.log(JSON.stringify(params, null, 2));

        const res = (this.type === CREATE)
          ? await secretFreeGuidanceAdd(params)
          : await secretFreeGuidanceUpdate(params)
        if (!res.data.success) return this.$Message.error(res.data.msg)
        this.formData = { ...defaultFormData }
        // this.$refs.form.resetFields();
        this.$router.replace({ name: 'secret-free-payment' })
      })
    },
    cancel() {
      this.formData = { ...defaultFormData }
      // this.$refs.form.resetFields();
      this.$router.replace({ name: 'secret-free-payment' })
    },
    selectTaskDown(list) {
      this.taskList = list
    },
    selectUserGroupDown(list) {
      this.userGroupList = list
    },
    deleteTableUserGroup(index) {
      this.userGroupList.splice(index, 1)
    },
  },
  created() {
    this.userGroupColumnsTable = userGroupColumns(this, this.formDisable);
    this.taskColumnsTable = taskColumns(this);
  },
  async mounted() {
    const res = await getProvinceCityList()
    this.citys = cpTranslate(res.data.data).map(province => province.children).flat();

    if (this.type === CREATE) {
    }
    if ((this.type === EDIT) || (this.type === DETAIL)) {
      const res = await secretFreeGuidanceDetail({ id: this.id })
      if (!res.data.success) return this.$Message.error(res.data.msg)
      const data = { ...res.data.data }
      const { startTime, endTime, cityList, guidePageEntranceContent, sfConfigName, productLineList: productLine, triggerNode, userGroupType, taskFlag, guidePageImage, guidePageContent, userGroupList, taskInfo, ...extData } = data
      this.formData = {
        time: [startTime, endTime],
        citys: cityList.map(city => city.cityCode),
        guidePageEntranceContent,
        sfConfigName,
        productLine:productLine.map(it=>Number(it)),
        triggerNode,
        userGroupType: `${userGroupType}`,
        taskFlag: `${taskFlag}`,
        guidePageContent,
        guidePageImage,
      }
      this.userGroupList = userGroupList
      this.taskList = taskInfo ? [taskInfo] : []
    }
  },
  destroyed() {
  },
  render(h) {

    return (
      <div class="payment-strategy-config">
        <div class="payment-strategy-config__container">
          <div class="payment-strategy-config__form">
            <Form ref="form" props={{
              model: this.formData,
              rules: this.formRules
            }} style="padding-left: 50px" label-position={'top'}>
            <Row>
              <Col span={6}>
              <FormItem label="策略名称:" prop={"sfConfigName"}>
                <Input type="text" maxlength={50} placeholder="请输入" style="width: 200px" v-model={this.formData.sfConfigName} disabled={this.formDisable} />
              </FormItem>
              </Col>
              <Col span={6}>
              <FormItem label="有效期:" prop="time">
                <DatePicker v-model={this.formData.time} type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择有效期(时间段)" style="width: 300px" disabled={this.formDisable} onOn-change={this.handleTimeChange}></DatePicker>
              </FormItem>
              </Col>
              </Row>
              <Row>
              <Col span={6}>
              <FormItem label="生效城市:" prop="citys">
                <Select v-model={this.formData.citys} style="width: 200px" multiple disabled={this.formDisable}>
                {
                  this.citys.map(item => <Option value={item.value}>{item.label}</Option>)
                }
                </Select>
              </FormItem>
              </Col>
              <Col span={6}>
              <FormItem label="生效业务线:" prop="productLine">
                <Select v-model={this.formData.productLine} style="width: 200px" multiple disabled={this.formDisable}>
                  {
                    this.businessGradeList.map(item => <Option value={item.value}>{item.label}</Option>)
                  }
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label="触发节点:" prop='triggerNode'>
                <RadioGroup  v-model={this.formData.triggerNode} onOn-change={this.handleTriggerChange}>
                  <Radio label="0" disabled={this.formDisable}>注册引导</Radio>
                  <Radio label="1" disabled={this.formDisable}>确认用车</Radio>
                  <Radio label="2" disabled={this.formDisable}>司机接单后</Radio>
                  <Radio label="3" disabled={this.formDisable}>乘客上车后</Radio>
                  <Radio label="4" disabled={this.formDisable}>收银台</Radio>
                </RadioGroup>
              </FormItem>

              {
                this.showTaskFlag() &&
                <FormItem label="是否关联任务:" prop='taskFlag' required={true}>
                  <RadioGroup v-model={this.formData.taskFlag} onOn-change={this.handleTaskChange}>
                    <Radio label="0" disabled={this.formDisable}>
                      <span>否</span>
                    </Radio>
                    <Radio label="1" disabled={this.formDisable}>
                      <span>是</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              }
              {
                this.showTask() &&
                <FormItem>
                  <Button type="primary" onClick={this.openTaskModal} disabled={this.formDisable}>选择任务</Button>
                </FormItem>
              }

              {
                this.showTask() &&
                <FormItem class="table-item" >
                  <Table
                    width="850"
                    size="small"
                    columns={this.taskColumnsTable}
                    data={this.taskList}
                  />
                </FormItem>
              }

              {
                this.showUserGroup() &&
                <FormItem label="用户群:" prop='userGroupType' required={true}>
                  <RadioGroup v-model={this.formData.userGroupType} onOn-change={this.handleUserGroupChange}>
                    <Radio label="0" disabled={this.formDisable}>
                      <span>全部用户</span>
                    </Radio>
                    <Radio label="1" disabled={this.formDisable}>
                      <span>选择新用户群</span>
                    </Radio>
                    {
                      this.formData.userGroupType === '1' &&
                      <Button type="primary" size="small" onClick={() => this.showNewUserGroupModal = true} disabled={this.formDisable}> 查看新用户群 </Button>
                    }
                  </RadioGroup>
                </FormItem>
              }

              {/*新用户群表格*/}
                {
                  this.showUserGroup() && this.formData.userGroupType === '1' &&
                  <FormItem class="table-item" >
                  <Table
                    width="700"
                    size="small"
                    columns={this.userGroupColumnsTable}
                    data={this.userGroupList}
                  />
                  </FormItem>
                }


              {/*action={this._baseUrl4CommonWeb + "/api/common/v1/questionnaire/pushConfig/uploadUserData"}*/}
              {
                this.showGuideContent() &&
                <FormItem label="引导页全屏图片 1284*2778:" prop="guidePageImage" required={true}>
                  <Upload
                    ref="UploadFile"
                    action={this._baseUrl + '/common/uploadFile'}
                    format={['jpg', 'jpeg', 'png']}
                    headers={{ Authorization: getToken() }}
                    props={{
                      'on-success': this.handleUploadSuccess,
                      'on-format-error': this.handleUploadFormatError,
                      'show-upload-list': false,
                      'on-exceeded-size': this.handleUploadSizeError,
                      'max-size': 5 * 1024,
                      'before-upload': this.beforeUpload
                    }}
                  >
                    <Button icon="ios-cloud-upload-outline" disabled={this.formDisable}>上传图片</Button>
                  </Upload>
                  <figure v-show={this.formData.guidePageImage}>
                    <img src={this.formData.guidePageImage} width={321} height={695} alt="引导页全屏图片" />
                    <figcaption></figcaption>
                  </figure>
                </FormItem>
              }

              {/*{*/}
                {/*this.showGuideContent() &&*/}
                {/*<FormItem label="引导页全屏图片 1284*2778:" prop="guidePageImage" v-show={false}>*/}

                {/*</FormItem>*/}
              {/*}*/}

              {
                this.showGuideContent() &&
                <FormItem label="引导页文案:" prop="guidePageContent" required={false}>
                  <Input type="text" v-model={this.formData.guidePageContent} maxlength={100} placeholder="请输入" style="width: 400px" disabled={this.formDisable} />
                </FormItem>
              }

              {/*{*/}
                {/*this.showEntryText() &&*/}
                {/*<FormItem label="引导入口文案:" prop="guidePageEntranceContent" v-show={false}>*/}
                {/*</FormItem>*/}
              {/*}*/}

              {
                this.showEntryText() &&
                <FormItem label="引导入口文案:" prop="guidePageEntranceContent" required={true}>
                  <Input type="text" v-model={this.formData.guidePageEntranceContent} maxlength={15} placeholder="请输入" style="width: 400px" disabled={this.formDisable} />
                </FormItem>
              }

              <FormItem>
                {
                  !this.formDisable &&
                  <Button type="primary" onClick={this.submit}>确定</Button>
                }
                <Button style="margin-left: 8px" onClick={this.cancel}>{this.formDisable ? '关闭' : '取消'}</Button>
              </FormItem>
            </Row>
            </Form>

            {/*选择新用户群分组*/}
            <Modal
              value={this.showNewUserGroupModal}
              width="80%"
              title="查看新用户群"
              footer-hide
              onOn-cancel={() => this.showNewUserGroupModal = false}
            >
              <NewUserGroupModal
                isShow={this.showNewUserGroupModal}
                list={this.userGroupList}
                onClose={() => this.showNewUserGroupModal = false}
                onSelectDown={this.selectUserGroupDown}
              />
          </Modal>

          {/*选择用户群分组*/}
            <Modal
              value={this.showUserGroupModal}
              width="80%"
              title="选择用户群分组"
              footer-hide
              onOn-cancel={() => this.showUserGroupModal = false}
            >
              <UserGroupScenceModal
                isShow={this.showUserGroupModal}
                list={[]}
                onClose={() => this.showUserGroupModal = false}
                onSelectDown={this.selectUserGroupDown}
              />
            </Modal>

            {/*选择任务*/}
            <Modal
              value={this.showTaskModal}
              width="80%"
              title="选择任务"
              footer-hide
              onOn-cancel={() => this.showTaskModal = false}
            >
              <TaskModal
                isShow={this.showTaskModal}
                timeRange={this.formData.time}
                onClose={() => this.showTaskModal = false}
                onSelectDown={this.selectTaskDown}
              />
            </Modal>
          </div>
        </div>
      </div>
    )
  }
})
