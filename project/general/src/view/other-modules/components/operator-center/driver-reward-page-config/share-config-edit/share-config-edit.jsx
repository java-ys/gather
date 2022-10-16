import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from "vuex"
import { Input, Form, Card, Col, Row, Divider, Radio, Upload, Icon } from 'ant-design-vue'
import { getToken, EventBus } from "@/libs/util.js"
// import config from "@/config/config"
import { getUploadToken } from "_o/api/operator-carrier"

import './share-config-edit.less'
import { uploadMixin } from "../uploadMixin";

const FormItem = Form.Item
const RadioGroup = Radio.Group

export default Vue.extend({
  name: 'share-config-edit',
  mixins: [uploadMixin],
  props: {
    next: {
      type: Function,
      default: () => void 0,
    }
  },
  data() {
    return {
      imageUrlMap: {
        shareFriendIconUrl: '',
        shareWechatIconUrl: '',
        savePosterIconUrl: '',
      },
      imageUuidMap: {
        shareFriendIcon: '',
        shareWechatIcon: '',
        savePosterIcon: '',
      },
      form: this.$form.createForm(this, { name: 'share-config-edit' }),
    }
  },
  computed: {
    ...mapGetters('operator-center/dirver-reward-page-config', ['shareConfigEditParams'])
  },
  methods: {
    ...mapActions('operator-center/dirver-reward-page-config', ['']),
    ...mapMutations({
      setShareConfigEditParams: 'operator-center/dirver-reward-page-config/SET_SHARE_CONFIG_EDIT_PARAMS',
    }),
    toggleSavePoster(e) {
      const { getFieldValue } = this.form
      const isShareFriendCirleWithLink = getFieldValue('shareWeChatType') === '1'
      if (e.target.value === '2' && isShareFriendCirleWithLink) { // 保存海报: 开启 -> 关闭 且 分享朋友圈 h5 链接, 清空海报图
        this.imageUrlMap.savePosterIconUrl = ''
        this.imageUuidMap.savePosterIcon = ''
      }
    },
    toggleShareWeChatType(e) {
      const { getFieldValue } = this.form
      const needSavePoster = getFieldValue('savePosterSwitch') === '1'
      if (!needSavePoster && e.target.value === '1') { // 分享朋友圈: 海报图 -> h5链接 且 保存海报关闭, 清空海报图
        this.imageUrlMap.savePosterIconUrl = ''
        this.imageUuidMap.savePosterIcon = ''
      }
      if (e.target.value === '2') { // 分享朋友圈: h5链接 -> 海报图, 清空分享朋友圈 h5 链接图标
        this.imageUrlMap.shareWechatIconUrl = ''
        this.imageUuidMap.shareWechatIcon = ''
      }
    },
    toggleShareFriendType(e) {
      // 分享到朋友消息: h5 链接 <-> 小程序卡片 清空 h5 链接图标或小程序卡片预览图
      this.imageUrlMap.shareFriendIconUrl = ''
      this.imageUuidMap.shareFriendIcon = ''
    },
    handleSubmit(e) {
      e && e.preventDefault();
      const { getFieldValue } = this.form
      // const isShareFriendWithLink = getFieldValue('shareFriendType') === '1'
      const isShareFriendCirleWithLink = getFieldValue('shareWeChatType') === '1'
      const needSavePoster = getFieldValue('savePosterSwitch') === '1'
      
      this.form.validateFields((err, values) => {
        console.log('Received values of form: ', values);
        if (!err) { // 下一步
  
          const hasImages = Object.keys(this.imageUuidMap).every(imgKey => {
            // 分享朋友圈: 海报图分享不校验上传(h5链接图标)
            if (!isShareFriendCirleWithLink && imgKey === 'shareWechatIcon')
              return true
            
            // (分享朋友圈: h5 链接分享) && (保存海报: 否), 不校验海报图上传
            if (!needSavePoster && isShareFriendCirleWithLink && imgKey === 'savePosterIcon')
              return true
            
            return !!this.imageUuidMap[imgKey]
          })
          if (!hasImages) return this.$Message.error("分享上传图标/图片，请确认上传完整");
          const params = {
            ...values,
            ...this.imageUuidMap,
            ...this.imageUrlMap,
          }
          
          // console.log('share-config-edit params: ', params)
          this.setShareConfigEditParams(params)
          this.next()
        }
      });
    },
    async initializeFormData() {
      const {
        shareFriendIconUrl = '',
        shareWechatIconUrl = '',
        savePosterIconUrl = '',
        shareFriendIcon = '',
        shareWechatIcon = '',
        savePosterIcon = '',
      } = this.shareConfigEditParams
      
      
      this.imageUrlMap = {
        shareFriendIconUrl,
        shareWechatIconUrl,
        savePosterIconUrl,
      }
      
      this.imageUuidMap = {
        shareFriendIcon,
        shareWechatIcon,
        savePosterIcon,
      }
      
    }
  },
  watch: {},
  async mounted() {
    await this.initializeFormData()
  },
  render() {
    const {
      shareFriendType,
      shareWeChatType,
      savePosterSwitch,
      // savePosterType,
      shareFriendMainTitle,
      shareFriendSubTitle,
      shareWechatTitle,
    } = this.shareConfigEditParams
    const {
      shareFriendIconUrl,
      shareWechatIconUrl,
      savePosterIconUrl,
    } = this.imageUrlMap
    
    const { getFieldValue } = this.form
    const isShareFriendWithLink = getFieldValue('shareFriendType') === '1'
    const isShareFriendCirleWithLink = getFieldValue('shareWeChatType') === '1'
    const needSavePoster = getFieldValue('savePosterSwitch') === '1'
    
    return (
      <div class="share-config-edit">
        <div class="share-config-edit__container">
          
          <Divider/>
          {/* 分享方式-start */}
          <div class="sharing-method">
            <h1>分享方式</h1>
            <Card>
              <Form form={this.form} labelCol={{ span: 5 }} wrapperCol={{ span: 5 }}>
                <FormItem label={'分享给朋友'} required>
                  <RadioGroup
                    onChange={this.toggleShareFriendType}
                    vDecorator={['shareFriendType', { initialValue: String(shareFriendType ? shareFriendType : '1') }]}>
                    <Radio value='1'>
                      H5链接
                    </Radio>
                    <Radio value='2'>
                      小程序卡片
                    </Radio>
                  </RadioGroup>
                </FormItem>
                
                <FormItem label={'分享到朋友圈'} required>
                  <RadioGroup
                    onChange={this.toggleShareWeChatType}
                    vDecorator={['shareWeChatType', { initialValue: String(shareWeChatType ? shareWeChatType : '1') }]}>
                    <Radio value='1'>
                      H5链接
                    </Radio>
                    <Radio value='2'>
                      海报图
                    </Radio>
                  </RadioGroup>
                </FormItem>
                
                <FormItem label={'保存海报'} required>
                  <RadioGroup
                    onChange={this.toggleSavePoster}
                    vDecorator={['savePosterSwitch', { initialValue: String(savePosterSwitch ? savePosterSwitch : '1') }]}>
                    <Radio value='1'>
                      开启
                    </Radio>
                    <Radio value='2'>
                      关闭
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
            </Card>
          </div>
          {/* 分享方式-end */}
          <Divider/>
          
          <div class="sharing-material">
            <h1>分享素材</h1>
            {/* 分享给朋友配置 */}
            <Row gutter={16}>
              <Col span={12}>
                <Card title="配置区域">
                  <h2>分享给朋友: {isShareFriendWithLink ? 'H5链接' : '小程序卡片'}</h2>
                  <Form form={this.form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                    <FormItem label={'主标题'}>
                      <Input maxLength={18} vDecorator={['shareFriendMainTitle', {
                        initialValue: shareFriendMainTitle,
                        rules: [{ required: true, message: '必填' }]
                      }]}/>
                    </FormItem>
                    
                    {
                      isShareFriendWithLink &&
                      (
                        <FormItem label={'副标题'}>
                          <Input maxLength={18} vDecorator={['shareFriendSubTitle', {
                            initialValue: shareFriendSubTitle,
                            rules: [{ required: true, message: '必填' }]
                          }]}/>
                        </FormItem>
                      )
                    }
                    
                    <FormItem label="分享图标" required>
                      <Upload
                        name="file"
                        showUploadList={false}
                        action={this.actionUrl}
                        onChange={(info) => this.handleChange(info, 'shareFriendIcon')}
                        headers={this.publicFileUploadHeader}
                        beforeUpload={this.beforeUpload}
                      >
                        <Button> <Icon type="upload"/>上传图片</Button>
                      </Upload>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;尺寸: {isShareFriendWithLink ? '156x156' : '630x504'}</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="预览区域">
                  <h2>分享给朋友: {isShareFriendWithLink ? 'H5链接' : '小程序卡片'}</h2>
                  <div class={`preview-container preview__friends ${isShareFriendWithLink ? 'link' : 'card'}`}>
                    {
                      isShareFriendWithLink
                        ? <img src={require("../../../../assets/share-friend.png")} alt=""/>
                        : <img src={require("../../../../assets/share-friend-card.png")} alt=""/>
                    }
                    <h2>{getFieldValue('shareFriendMainTitle')}</h2>
                    {isShareFriendWithLink && <h3>{getFieldValue('shareFriendSubTitle') || shareFriendSubTitle}</h3>}
                    {shareFriendIconUrl &&
                    <img class="share-friend-icon" src={shareFriendIconUrl} alt="shareFriendIconUrl"/>}
                  </div>
                </Card>
              </Col>
            </Row>
            {/* 分享给朋友配置-end */}
            
            <Divider dashed/>
            
            {/* 分享到朋友圈 */}
            {
              isShareFriendCirleWithLink &&
              (<Row gutter={16}>
                <Col span={12}>
                  <Card title="配置区域">
                    <h2>分享给朋友圈: {isShareFriendCirleWithLink ? 'H5链接' : '海报图'}</h2>
                    <Form form={this.form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                      <FormItem label={'标题'}>
                        <Input maxLength={18} vDecorator={['shareWechatTitle', {
                          initialValue: shareWechatTitle,
                          rules: [{ required: true, message: '必填' }]
                        }]}/>
                      </FormItem>
                      
                      <FormItem label="分享图标" required>
                        <Upload
                          name="file"
                          showUploadList={false}
                          action={this.actionUrl}
                          onChange={(info) => this.handleChange(info, 'shareWechatIcon')}
                          headers={this.publicFileUploadHeader}
                          beforeUpload={this.beforeUpload}
                        >
                          <Button> <Icon type="upload"/>上传图片</Button>
                        </Upload>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;尺寸: {'156x156'}</span>
                      </FormItem>
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="预览区域">
                    <h2>分享给朋友圈: {isShareFriendCirleWithLink ? 'H5链接' : '海报图'}</h2>
                    <div class="preview-container preview__friends-circle">
                      <img src={require("../../../../assets/share-moments.png")} alt=""/>
                      <h2>{getFieldValue('shareWechatTitle') || shareWechatTitle}</h2>
                      {shareWechatIconUrl &&
                      <img class="share-friend-icon" src={shareWechatIconUrl} alt="shareWechatIconUrl"/>}
                    </div>
                  </Card>
                </Col>
              </Row>)
            }
            {/* 分享到朋友圈-end */}
            
            {
              (!needSavePoster && isShareFriendCirleWithLink)
                ? null
                : (<fragment>
                  <Divider dashed/>
                  {/* 海报图 */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="配置区域">
                        <h2>海报图</h2>
                        <Form form={this.form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                          <FormItem label={'海报图类型'} required>
                            <RadioGroup
                              vDecorator={['savePosterType', { initialValue: '1' }]}>
                              <Radio value='1'>
                                小程序码
                              </Radio>
                            </RadioGroup>
                          </FormItem>
                          
                          <FormItem label="分享图" required>
                            <Upload
                              name="file"
                              showUploadList={false}
                              action={this.actionUrl}
                              onChange={(info) => this.handleChange(info, 'savePosterIcon')}
                              headers={this.publicFileUploadHeader}
                              beforeUpload={this.beforeUpload}
                            >
                              <Button> <Icon type="upload"/>上传图片</Button>
                            </Upload>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;尺寸: 840x1119</span>
                          </FormItem>
                        </Form>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="预览区域">
                        <h2>海报图</h2>
                        <div class="preview-container preview__poster">
                          {savePosterIconUrl &&
                          <img class="share-friend-icon" src={savePosterIconUrl} alt="savePosterIconUrl"/>}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                  {/* 海报图-end */}
                </fragment>)
            }
            
          </div>
        </div>
      </div>
    )
  }
})
