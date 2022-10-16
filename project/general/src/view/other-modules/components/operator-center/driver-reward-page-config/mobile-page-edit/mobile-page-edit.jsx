import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from "vuex"
import { Input, Form, Card, Col, Row, Divider, Upload, Icon } from 'ant-design-vue'
import { getToken } from "@/libs/util.js"
// import config from "@/config/config"
import { getUploadToken } from "_o/api/operator-carrier"

import './mobile-page-edit.less'
import { uploadMixin } from "../uploadMixin";

const FormItem = Form.Item

export default Vue.extend({
  name: 'mobile-page-edit',
  mixins: [uploadMixin],
  inject: {
    type: { default: 'create' },
    id: { default: '-1' },
  },
  data() {
    return {
      imageUrlMap: {
        shareLandingPageMainIconUrl: '',
      },
      imageUuidMap: {
        shareLandingPageMainIcon: '',
      },
      form: this.$form.createForm(this, { name: 'mobile-page-edit' }),
    }
  },
  computed: {
    ...mapGetters('operator-center/dirver-reward-page-config', ['mobilePageEditParams'])
  },
  methods: {
    ...mapActions('operator-center/dirver-reward-page-config', ['submitDriverRewardPageConfig']),
    ...mapMutations({
      setMobilePageEditParams: 'operator-center/dirver-reward-page-config/SET_MOBILE_PAGE_EDIT_PARAMS',
    }),
    initializeFormData() {
      const {
        shareLandingPageMainIcon = '',
        shareLandingPageMainIconUrl = '',
      } = this.mobilePageEditParams
  
      this.imageUrlMap = {
        shareLandingPageMainIconUrl,
      }
  
      this.imageUuidMap = {
        shareLandingPageMainIcon,
      }
      
    },
    handleSubmit(e) {
      e && e.preventDefault();
    
      this.form.validateFields((err, values) => {
        if (!err) {
        
          const hasImages = Object.keys(this.imageUuidMap).every(imgKey => {
            return !!this.imageUuidMap[imgKey]
          })
          if (!hasImages) return this.$Message.error("分享上传图标/图片，请确认上传完整");
          const params = {
            ...values,
            ...this.imageUuidMap,
            ...this.imageUrlMap,
          }
        
          // console.log('mobile-page-edit params: ', params)
          this.setMobilePageEditParams(params)
          this.submitDriverRewardPageConfig({ type: this.type, id: this.id })
        }
      });
    },
  },
  async mounted() {
    await this.initializeFormData()
  },
  render() {
    const { shareLandingPageTitle } = this.mobilePageEditParams
    const {
      shareLandingPageMainIconUrl,
    } = this.imageUrlMap
    const { getFieldValue } = this.form
    
    return (
      <div class="mobile-page-edit">
        <div class="mobile-page-edit__container">
          
          <Divider/>
          
          <div class="h5-configure">
            <h1>H5分享落地页设置</h1>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Form form={this.form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                    <FormItem label={'页面标题'}>
                      <Input maxLength={8} vDecorator={['shareLandingPageTitle', { initialValue: shareLandingPageTitle, rules: [{ required: true, message: '必填' }] }]}/>
                    </FormItem>
                    
                    <FormItem label={'页面主图'} required>
                      <Upload
                        name="file"
                        showUploadList={false}
                        action={this.actionUrl}
                        onChange={(info) => this.handleChange(info, 'shareLandingPageMainIcon')}
                        headers={this.publicFileUploadHeader}
                        beforeUpload={this.beforeUpload}
                      >
                        <Button> <Icon type="upload"/>上传图片</Button>
                      </Upload>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;尺寸: 1125x2790</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <h2>分享给朋友: H5链接</h2>
                  <div class={`preview-container preview__mobile-page`}>
                    <h2>{getFieldValue('shareLandingPageTitle')}</h2>
                    <img src={require('../../../../assets/h5-title.png')} alt="h5-title"/>
                    {shareLandingPageMainIconUrl && <img class="share-landing-page-main-icon" src={shareLandingPageMainIconUrl} alt="shareLandingPageMainIcon"/>}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
})
