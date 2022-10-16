import Vue from 'vue'
import { Button, Form, Divider, Modal, Card, Select, InputNumber, Upload, Icon, Cascader } from 'ant-design-vue'
import { htmlToElement, isNil } from '@/libs/util'
import { getCityList } from "_o/api/operator-carrier"
import { cpTranslate } from "@/libs/tools"
import arrayTreeFilter from 'array-tree-filter';

import './driver-recruit-landing-config.less'
import { CREATE, EDIT, DETAIL } from "./constant";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { uploadMixin } from "./uploadMixin";
import VEditor from "_a/v-editor/v-editor.vue"
import { operationTypeOptions } from "./conf"

const FormItem = Form.Item
const Option = Select.Option
const RichEditor = 'richEditor'

const toolbarConfig = [
  ["bold"],
  [{ header: [1, 2, false] }],
  [{ color: [] }, { background: [] }],
  [{ list: "bullet" }],
  ["clean"],
];

export default Vue.extend({
  name: 'driverRecruitLandingConfig',
  mixins: [uploadMixin],
  data() {
    return {
      currentPreViewIndex: 0,
      imageUrlList: [],
      imageUuidList: [],
      basicForm: this.$form.createForm(this, { name: 'recruit-landing-config' }),
      homePageForms: [
        // this.$form.createForm(this, { name: 'config0' }),
        // this.$form.createForm(this, { name: 'config1' }),
      ],
      cityList: [],
      configList: []
    }
  },
  computed: {
    ...mapGetters('operator-center/driver-recruit-landing-page', ['recruitParams']),
    isCreate() {
      return this.type === CREATE
    },
    isEdit() {
      return this.type === EDIT
    },
    isDetail() {
      return this.type === DETAIL
    }
  },
  provide: {},
  inject: {
    type: { default: CREATE },
    id: { default: '-1' },
  },
  async created() {
    await this.translateCityList()
  },
  // async activated() {
  //   await this.translateCityList()
  // },
  // async beforeRouteLeave(to, from, next) {
  //   await this.clearRecruitConfig()
  //   next()
  // },
  methods: {
    ...mapActions('operator-center/driver-recruit-landing-page', ['getRecruitConfig', 'clearRecruitConfig', 'submitRecruitConfig']),
    ...mapMutations({
      setRecruitParams: 'operator-center/driver-recruit-landing-page/SET_RECRUIT_PARAMS',
    }),
    getCityName(values) {
      const result = arrayTreeFilter(this.cityList, (item, level) => item.value === values[level])
      return result.length > 0 ? result[result.length - 1].label : ''
    },
    async translateCityList() {
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        // this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
        this.cityList = [...list];
      });
    },
    handleOk() {
      this.clearRecruitConfig()
      this.$router.replace({ name: 'driver-recruit-landing-page' })
    },
    handleCancel() {
      Modal.confirm({
        title: this.isCreate ? '确认取消创建活动配置?' : '确认取消页面编辑?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.clearRecruitConfig()
          this.$router.replace({ name: 'driver-recruit-landing-page' })
        }
      })
    },
    togglePreView(index) {
      this.currentPreViewIndex = index
    },
    addNewConfig() {
      const { pageConfList, cityConf } = this.recruitParams
      const index = this.homePageForms.length
      if (index >= 2) return this.$Message.info("当前只支持2项配置");
      const form = this.$form.createForm(this, { name: `config${index}` })
      this.homePageForms.push(form)
      this.setRecruitParams({
        cityConf,
        pageConfList: [...pageConfList, {}]
      })
    },
    deleteConfig(index) {
      const { pageConfList, cityConf } = this.recruitParams
      let contents = Object.keys(this.$refs)
        .filter(refKey => !!~refKey.indexOf(RichEditor))
        .map(key => this.$refs[key].content)
      contents.splice(index, 1)
      contents.forEach((content, idx) => this.$refs[`${RichEditor}${idx}`].content = content)
      this.$delete(this.homePageForms, index)
      this.$delete(this.imageUrlList, index)
      this.$delete(this.imageUuidList, index)
      this.setRecruitParams({
        cityConf,
        pageConfList: pageConfList.filter((item, idx) => idx !== index)
      })
    },
    createConfigForm(ctx, index, form) {
      const { pageConfList } = ctx.recruitParams
      const formData = pageConfList[index] || {}
      const editorRef = `${RichEditor}${index}`
      return (
        <Form form={form} labelCol={{ span: 2 }} wrapperCol={{ span: 16 }}>
          <FormItem label={'运营模式'} required wrapperCol={{ span: 8 }}>
            <Select
              disabled={this.isDetail}
              vDecorator={[
                'operationType',
                {
                  initialValue: String(!isNil(formData.operationType) ? formData.operationType : '1'),
                  rules: [{ required: true, message: '类型必选' }]
                },
              ]}
              placeholder="请选择"
              onChange={this.handleSelectChange}
            >
              {
                operationTypeOptions.map(option => <Option value={option.value}>{option.text}</Option>)
              }
            </Select>
          </FormItem>
          
          <Form form={form} layout={'inline'}>
            <FormItem label={'年龄限制'} required class='just-label'></FormItem>
            <FormItem>
              男:&nbsp;&nbsp;
              <InputNumber
                disabled={this.isDetail}
                vDecorator={[
                  'maleAgeMin',
                  {
                    initialValue: formData.maleAgeMin ? formData.maleAgeMin : null,
                    rules: [{ required: true, message: '年龄必填' }]
                  },
                ]}
                min={22}
                max={70}
                precision={0}
              />
              &nbsp;&nbsp;~
            </FormItem>
            <FormItem>
              <InputNumber
                disabled={this.isDetail}
                vDecorator={[
                  'maleAgeMax',
                  {
                    initialValue: formData.maleAgeMax ? formData.maleAgeMax : null,
                    rules: [{ required: true, message: '年龄必填' }]
                  }
                ]}
                min={22}
                max={70}
                precision={0}
              />
              &nbsp;&nbsp;周岁,
            </FormItem>
            <FormItem>
              女:&nbsp;&nbsp;
              <InputNumber
                disabled={this.isDetail}
                vDecorator={[
                  'femaleAgeMin',
                  {
                    initialValue: formData.femaleAgeMin ? formData.femaleAgeMin : null,
                    rules: [{ required: true, message: '年龄必填' }]
                  }
                ]}
                min={22}
                max={70}
                precision={0}
              />
              &nbsp;&nbsp;~
            </FormItem>
            <FormItem>
              <InputNumber
                disabled={this.isDetail}
                vDecorator={[
                  'femaleAgeMax',
                  {
                    initialValue: formData.femaleAgeMax ? formData.femaleAgeMax : null,
                    rules: [{ required: true, message: '年龄必填' }]
                  }
                ]}
                min={22}
                max={70}
                precision={0}
              />
              &nbsp;&nbsp;周岁
            </FormItem>
          </Form>
          
          {
            !this.isDetail &&
            <FormItem label="页面主图" required>
              <Upload
                name="file"
                showUploadList={false}
                action={ctx.actionUrl}
                onChange={(info) => ctx.handleChange(info, index)}
                headers={ctx.publicFileUploadHeader}
                beforeUpload={ctx.beforeUpload}
              >
                <Button> <Icon type="upload"/>上传图片</Button>
              </Upload>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;尺寸: {'1125x1464'}</span>
            </FormItem>
          }
          
          
          <FormItem label=" " colon={false}>
            {
              !!this.imageUrlList[index] &&
              <figure>
                <img src={this.imageUrlList[index]} alt="" width="75"/>
                {/*<figcaption>The HTML Reference logo</figcaption>*/}
              </figure>
            }
          </FormItem>
          
          {
            !this.isDetail &&
            <FormItem label={'报名条件'} wrapper-col={{ span: 20 }} required>
              <VEditor ref={editorRef} value={formData.recruitDesc ? formData.recruitDesc : ''} id={index}
                       toolbarConfig={toolbarConfig}
                       onInput={() => this.$forceUpdate()}/>
            </FormItem>
          }
          
          {
            this.isDetail &&
            <FormItem label={'报名条件'}>
              <div class="rich" domPropsInnerHTML={
                pageConfList[index].recruitDesc
              }>
                {/*富文本*/}
              </div>
            </FormItem>
          }
        
        </Form>
      )
    },
    submit() {
      console.log('------submit------')
      let cityConf = !this.isEdit ? { /* cityCode: '', terminalType: '' */ } : { cityConfId: this.id }
      let pageConfList = [/* { femaleAgeMax, femaleAgeMin, maleAgeMax, maleAgeMin, operationType, recruitDesc, imgFileUrl, imgFileUuid } */]
      let textContentLimitExceeded = false
      let allowSubmit = true
      this.basicForm.validateFields((err, value) => {
        if (err) allowSubmit = false
        const { city, terminalType } = value
        cityConf = { ...cityConf, cityCode: city[1], terminalType }
      })
      this.homePageForms.forEach((form, index) => form.validateFields((err, value) => {
        if (err) allowSubmit = false
        const { femaleAgeMax, femaleAgeMin, maleAgeMax, maleAgeMin, operationType } = value
        const recruitDesc = this.$refs[`${RichEditor}${index}`].content
        const dom = htmlToElement(`<div>${recruitDesc}</div>`)
        if (dom.textContent.length > 2000) textContentLimitExceeded = true
        pageConfList = [
          ...pageConfList,
          {
            femaleAgeMax,
            femaleAgeMin,
            maleAgeMax,
            maleAgeMin,
            operationType,
            recruitDesc,
            imgFileUrl: this.imageUrlList[index],
            imgFileUuid: this.imageUuidList[index]
          }
        ]
      }))
      const params = { cityConf, pageConfList }
      console.log('@params: ', params)
      if (!allowSubmit) return console.warn('validateFields has errors!')
      if (!!textContentLimitExceeded) return this.$Message.error("报名条件长度不得大于两千字");
      this.setRecruitParams(params)
      this.submitRecruitConfig({ type: this.type })
    },
    initializeFormData() {
      const { pageConfList } = this.recruitParams
      this.imageUrlList = pageConfList.map(item => item.imgFileUrl ? item.imgFileUrl : '')
      this.imageUuidList = pageConfList.map(item => item.imgFileUuid ? item.imgFileUuid : '')
    },
  },
  async mounted() {
    if (this.type !== CREATE) await this.getRecruitConfig({ cityConfId: this.id })
    const { pageConfList } = this.recruitParams
    this.homePageForms = pageConfList.map((val, idx) => this.$form.createForm(this, { name: `config${idx}` }))
    await this.initializeFormData()
  },
  destroyed() {
    this.clearRecruitConfig()
  },
  render(h) {
    const edit = this.$refs[`${RichEditor}${this.currentPreViewIndex}`] // 富文本 ref
    const bgImg = this.imageUrlList[this.currentPreViewIndex] // 预览用
    const { pageConfList, cityConf = {} } = this.recruitParams
    
    return (
      <div class="driver-recruit-landing-config">
        <div class="driver-recruit-landing-config__container">
          
          <div class="basic-information-settings">
            <h1>基础信息设置</h1>
            <Card>
              <Form form={this.basicForm} labelCol={{ span: 5 }} wrapperCol={{ span: 5 }}>
                <FormItem label={'终端类型'} required>
                  <Select
                    disabled={this.isDetail}
                    vDecorator={[
                      'terminalType',
                      {
                        initialValue: String(!isNil(cityConf.terminalType) ? cityConf.terminalType : '0'),
                        rules: [{ required: true, message: '类型必选' }]
                      },
                    ]}
                    placeholder="请选择"
                    onChange={this.handleSelectChange}
                  >
                    <Option value='0'>司机招募小程序</Option>
                    {/*<Option value='1'>招募H5链接</Option>*/}
                  </Select>
                </FormItem>
                
                <FormItem label={'城市'} required>
                  <Cascader
                    disabled={this.isDetail}
                    ref="cityCascader"
                    vDecorator={[
                      'city',
                      {
                        initialValue: (!cityConf.provCode || !cityConf.cityCode) ? [] : [cityConf.provCode, cityConf.cityCode],
                        rules: [
                          { type: 'array', required: true, message: '活动城市必选' }
                        ]
                      },
                    ]}
                    options={this.cityList}
                    placeholder="请选择"
                  />
                </FormItem>
              </Form>
            </Card>
          </div>
          
          <Divider/>
          
          <div class="recruitment-homepage-configuration">
            <Row gutter={16}>
              <Col span={17}>
                <h1>招募首页配置</h1>
                {
                  this.homePageForms.map((form, index) => {
                    
                    return (
                      <fragment>
                        <Card title={'配置项'}>
                          {
                            !this.isDetail ?
                              index !== 0
                                ? <a onClick={() => this.deleteConfig(index)} slot='extra' href="#">删除</a>
                                : <a onClick={this.addNewConfig} slot='extra' href="#">新增营运模式</a>
                              : null
                          }
                          {this.createConfigForm(this, index, form)}
                        </Card>
                        {index !== this.homePageForms.length - 1 && <Divider dashed/>}
                      </fragment>
                    )
                  })
                }
              </Col>
              
              <Col span={7}>
                <h1>招募首页预览</h1>
                <div class="preview-container">
                  <div class="tab-content">
                    {/*tab 内容*/}
                    {
                      this.homePageForms.map((form, index) => {
                        const operationType = form.getFieldValue('operationType') || String(pageConfList[index].operationType || 1)
                        return (
                          <section class={this.currentPreViewIndex === index ? 'active' : ''}
                                   onClick={() => this.togglePreView(index)}>
                            {operationTypeOptions.find(options => options.value === operationType).viewText}
                          </section>
                        )
                      })
                    }
                  </div>
                  
                  <div class="post">
                    {bgImg ? <img src={bgImg} alt="postImg"/> : null}
                    <section>
                      <span>{this.getCityName(this.basicForm.getFieldValue('city')) || '请选择城市'}</span>
                      <Icon type="down"/>
                    </section>
                  </div>
                  
                  <div class="title">
                    <h2>报名条件</h2>
                    <Divider/>
                  </div>
                  
                  <div class="rich" domPropsInnerHTML={
                    edit
                      ? edit.content
                      ? edit.content
                      : ''
                      : pageConfList[this.currentPreViewIndex].recruitDesc
                      ? pageConfList[this.currentPreViewIndex].recruitDesc
                      : ''
                  }>
                    {/*富文本*/}
                  </div>
                  
                  <div class="button-content">
                    {/*按钮 我要加入*/}
                    <a href="javascript:void(0)">我要加入</a>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          
          <Divider/>
          
          <div class="active__content">
            <Form label-col={{ span: 5 }} wrapper-col={{ span: 5 }}>
              <FormItem wrapper-col={{ span: 5, offset: 5 }}>
                {
                  !this.isDetail
                    ? <fragment>
                      <Button onClick={this.handleCancel}>取消</Button>
                      <Button type="primary" onClick={this.submit}>提交</Button>
                    </fragment>
                    : <Button type="primary" onClick={this.handleOk}>确定</Button>
                }
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
})
