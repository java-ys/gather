<template>
  <div class="supplier-detail">
    <Form :model="supplierForm" :rules="supplierFormValidate" ref="supplierForm">
      <div class="detail-section">
        <h2>基本信息</h2>
        <Row :gutter="24">
          <Col :span="6">
            <div>
              <FormItem label="供应商名称" prop="name">
                <Input v-model="supplierForm.name" placeholder="请输入" :maxlength="40"></Input>
              </FormItem>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <FormItem label="供应商编码" prop="code">
                <Input v-model="supplierForm.code" placeholder="请输入" :maxlength="40"></Input>
              </FormItem>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <FormItem label="城市" prop="registeredCity">
                <Cascader
                  v-model="supplierForm.registeredCity"
                  :data="cascaderList"
                  placeholder="请选择"
                  :clearable="false"
                  style="width: 270px;"
                ></Cascader>
              </FormItem>
            </div>
          </Col>
          <Col :span="6">
            <div>
              <Form :model="contactForm" :rules="contactFormValidate" ref="contactForm">
              <FormItem label="供应商联系人" prop="name">
                <Input v-model="contactForm.name" placeholder="请输入" :maxlength="40"></Input>
              </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="6">
            <div>
              <Form :model="contactForm1" :rules="contactForm1Validate" ref="contactForm1">
              <FormItem label="联系人电话" prop="telephone">
                <Input v-model="contactForm1.telephone" placeholder="请输入" :maxlength="11"></Input>
              </FormItem>
              </Form>
            </div>
          </Col>
          <Col :span="6" style="padding-right: 0; width: 200px">
            <FormItem label="供应商地址" prop="cityUuid">
              <Cascader
                v-model="supplierForm.cityUuid"
                :data="cascaderList"
                placeholder="请选择"
                :clearable="false"
              ></Cascader>
            </FormItem>
          </Col>
          <Col :span="6" style="padding-left: 0; width: 375px">
            <FormItem prop="address">
              <div>&nbsp;</div>
              <Input v-model="supplierForm.address" placeholder="请输入" :maxlength="80"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <div>
              <FormItem label="备注" prop="remark">
                <Input v-model="supplierForm.remark" placeholder="请输入" :maxlength="400"></Input>
              </FormItem>
            </div>
          </Col>
        </Row>
      </div>
      <div class="detail-section">
        <h2>营业执照</h2>
        <Form :model="businessForm" :rules="businessFormValidate" ref="businessForm">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="编号" prop="licenseNo">
                  <Input v-model="businessForm.licenseNo" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="社会信用代码证" prop="socialCreditCode">
                  <Input v-model="businessForm.socialCreditCode" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="名称" prop="name">
                  <Input v-model="businessForm.name" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="类型" prop="copType">
                  <Input v-model="businessForm.copType" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="法定代表人" prop="legalPerson">
                  <Input v-model="businessForm.legalPerson" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="注册资本（万元）" prop="registeredCapital">
                  <Input v-model="businessForm.registeredCapital" placeholder="请输入" :maxlength="10"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="成立日期" prop="foundDate">
                  <DatePicker
                    v-model="businessForm.foundDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeFoundDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="发证日期" prop="issueDate">
                  <DatePicker
                    v-model="businessForm.issueDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeIssueDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="营业期限" prop="bizStartDate">
                  <DatePicker
                    v-model="businessForm.bizStartDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeBizStartDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem prop="bizEndDate">
                  <div>&nbsp;</div>
                  <DatePicker
                    v-model="businessForm.bizEndDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeBizEndDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
            <Col :span="12">
              <div>
                <FormItem label="住所" prop="residence">
                  <Input v-model="businessForm.residence" placeholder="请输入" :maxlength="100"></Input>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="12">
              <div>
                <FormItem label="经营范围" prop="bizScope">
                  <Input type="textarea" :rows="3" v-model="businessForm.bizScope" placeholder="请输入" :maxlength="1000"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="12">
              <div>
                <FormItem label="营业执照照片" prop="bussImgList">
                  <div>&nbsp;</div>
                  <UploadImg
                    :defaultList="businessForm.bussImgList"
                    :action="actionUrl"
                    :maxUpLoadCount = "10"
                    :fileRange="['jpg', 'jpeg', 'bmp']"
                    @on-upsuccess="getImgObj">
                  </UploadImg>
                </FormItem>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="detail-section">
        <h2>签约信息</h2>
        <Form :model="contractForm" :rules="contractFormValidate" ref="contractForm">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="合同编号" prop="contractNo">
                  <Input v-model="contractForm.contractNo" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="合同起期" prop="startDate">
                  <DatePicker
                    v-model="contractForm.startDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeStartDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="合同止期" prop="endDate">
                  <DatePicker
                    v-model="contractForm.endDate"
                    placeholder="请选择"
                    type="date"
                    style="width: 270px"
                    @on-change="changeEndDate"
                  >
                  </DatePicker>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="24">
              <div>
                <FormItem label="合同文本 pdf" prop="contractImgList">
                  <div>&nbsp;</div>
                  <UploadImg
                    fileType="pdf"
                    :defaultList="contractForm.contractImgList"
                    :action="actionUrl"
                    :maxSize="100 * 1024"
                    :maxUpLoadCount = "5"
                    :sizeType="2"
                    :fileRange="['pdf']"
                    @on-upsuccess="getImgContractObj">
                  </UploadImg>
                </FormItem>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="detail-section">
        <h2>财务账号</h2>
        <Form :model="accountForm" :rules="accountFormValidate" ref="accountForm">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="开户凭证核准号" prop="approvalNo">
                  <Input v-model="accountForm.approvalNo" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="开户凭证编号" prop="certificateNo">
                  <Input v-model="accountForm.certificateNo" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="银行账号" prop="account">
                  <Input v-model="accountForm.account" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="开户行" prop="bankName">
                  <Select
                    v-model="accountForm.bankName"
                    placeholder="请选择"
                    @on-change="changeBank"
                  >
                    <Option
                      v-for="item in bankList"
                      :key="item.bankNo"
                      :value="item.bankNo"
                    >{{item.bankName}}</Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="银行户名" prop="accountName">
                  <Input v-model="accountForm.accountName" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="18">
              <div>
                <FormItem label="开户凭证照片" prop="accountImgList">
                  <div>&nbsp;</div>
                  <UploadImg
                    :defaultList="accountForm.accountImgList"
                    :action="actionUrl"
                    :maxUpLoadCount = "10"
                    :fileRange="['jpg', 'jpeg', 'bmp']"
                    @on-upsuccess="getImgAccountObj">
                  </UploadImg>
                </FormItem>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="detail-section">
        <h2>结算信息</h2>
        <Form :model="srmSettlementMethodForm" :rules="srmSettlementMethodFormValidate" ref="srmSettlementMethodForm">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="结算周期日" prop="period">
                  <Select
                    v-model="srmSettlementMethodForm.period"
                    placeholder="请选择"
                    @on-change="changePeriod"
                  >
                    <Option
                      v-for="item in periodList"
                      :key="item.value"
                      :value="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="24">
              <div>
                <label class="detail-label">&nbsp;</label>
                <div class="text" style="font-weight: lighter">目前，仅支持月度结算方式；举例，选择28日，则结算周期为上月的28日到本月的27日。</div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="detail-section" style="border-bottom: 0">
        <h2>供应信息</h2>
        <Form :model="supplyTypeForm" :rules="supplyTypeFormValidate" ref="supplyTypeForm">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="供应商类型" prop="supplierType">
                  <Select
                    v-model="supplyTypeForm.supplierType"
                    placeholder="请选择"
                    @on-change="changeSupplierType"
                  >
                    <Option
                      v-for="item in supplierTypeList"
                      :key="item.value"
                      :value="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="供应方式" prop="supplierMethod">
                  <Select
                    v-model="supplyTypeForm.supplierMethod"
                    placeholder="请选择"
                    multiple
                    @on-change="changeSupplierMethod"
                  >
                    <Option
                      v-for="item in supplierMethodList"
                      :key="item.label"
                      :value="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
                    <!--@on-change="changeSupplierMethod"-->
              <div>
                <FormItem label="运营区域" prop="opAreaCodeList">
                  <Select
                    v-model="supplyTypeForm.opAreaCodeList"
                    placeholder="请选择"
                    multiple
                    filterable
                    @on-change="changeOpAreaCodeMethod"
                  >
                    <Option
                      v-for="item in cityArray"
                      :key="item.label"
                      :value="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="detail-section" style="border-bottom: 0" v-if="mode !== 'edit' && supplyTypeForm.supplierType === '4'">
        <h2>账号信息</h2>
        <Form :model="supplierForm2" :rules="supplyTypeFormValidate" ref="supplyTypeForm2">
          <Row :gutter="24">
            <Col :span="6">
              <div>
                <FormItem label="是否登录||运营中心" prop="isLogin">
                  <RadioGroup v-model="supplierForm2.isLogin">
                    <Radio :label="1" :value="1">是</Radio>
                    <Radio :label="0" :value="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row :gutter="24" v-if="supplierForm2.isLogin == 1">
            <Col :span="6">
              <div>
                <FormItem label="管理员姓名" prop="managerName">
                  <Input v-model="supplierForm2.managerName" placeholder="请输入" :maxlength="20"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="管理员身份证号" prop="managerCardId">
                  <Input v-model="supplierForm2.managerCardId" placeholder="请输入" :maxlength="18"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="管理员手机号码" prop="managerTel">
                  <Input v-model="supplierForm2.managerTel" placeholder="请输入" :maxlength="11"></Input>
                </FormItem>
              </div>
            </Col>
            <Col :span="6">
              <div>
                <FormItem label="邮箱" prop="managerEmail">
                  <Input v-model="supplierForm2.managerEmail" placeholder="请输入" :maxlength="40"></Input>
                </FormItem>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Form>
  </div>
</template>

<script>
  import UploadImg from '../v-upload/v-upload.vue'
  import importFailModal from "../../../short-message-center/components/import-fail-modal";
  import {
    getBankList,
    cityList
  } from "_o/api/assetSupplier.js"
  import { regTest } from '@m2-micro/util'
  import { cpLabelValue } from "@/libs/tools";
  import config from "@/config/config"
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
  export default {
    name: "add",
    props: {
      theInfo: Object,
      mode: String
    },
    components: {
      importFailModal,
      UploadImg,
    },
    data() {
      const validateChose = (rule, value, callback) => {
        if (!value) {
          callback(new Error("必选"))
        } else {
          callback()
        }
      }
      const validateMultiple = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error("请选择不少于1项"));
        } else {
          callback();
        }
      };
      const validateOpMultiple = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error("请选择不少于1项"));
        } else {
          callback();
        }
      };
      return {
        supplierForm: { // 表格检索条件
          name: "",
          code: "",
          address: "",
          registeredCity: [],
          cityUuid: [],
        },
        contactForm: {
          name: "",
        },
        contactForm1: {
          telephone: ""
        },
        contactFormValidate: {
          name: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }]
        },
        contactForm1Validate: {
          telephone: [{
            required: true,
            message: "请输入11位",
            trigger: "blur"
          }],
        },
        supplierFormValidate: { // 表头 form
          name: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          code: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          registeredCity: [{
            type: 'array',
            required: true,
            message: "请选择",
            trigger: "change"
          }],
          cityUuid: [{
            type: 'array',
            required: true,
            message: "请选择",
            trigger: "change"
          }],
          address: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }]
        },
        businessForm: {
          bussImgList: []
        },
        businessFormValidate: {
          bussImgList: [{
            type: 'array',
            required: true,
            message: "必传",
            trigger: "change"
          }],
          registeredCapital: [{
            message: "请输入数字",
            pattern: /^[0-9]{0,10}$/,
            trigger: "blur"
          }]
        },
        contractForm: {
          contractImgList: []
        },
        contractFormValidate: {
          contractImgList: [{
            type: 'array',
            required: true,
            message: "必传",
            trigger: "change"
          }]
        },
        accountForm: {
          accountImgList: []
        },
        accountFormValidate: {},
        srmSettlementMethodForm: {
          period: ""
        },
        srmSettlementMethodFormValidate: {
          period: [{
            required: true,
            message: "请选择",
            trigger: "change",
            validator: validateChose
          }]
        },
        supplyTypeForm: {
          supplierType: "",
          supplierMethod: [],
          opAreaCodeList: [], // 运营区域 List<code>
        },
        supplierForm2: {
          isLogin: 1,
          managerName: '',
          managerCardId: '',
          managerTel: '',
          managerEmail: '',
        },
        supplyTypeFormValidate: {
          isLogin: [{
            required: true,
            message: "请选择",
          }],
          managerName: [{
            required: true,
            message: "请输入",
            trigger: "blur"
          }],
          managerCardId: [{
            required: false,
            validator: (rule, value, callback) => {
              return callback()
              let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              if (value === "") {
                callback(new Error("请输入身份证号"));
              } else if (reg.test(value) === false) {
                callback(new Error("请输入正确的身份证号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }],
          managerTel: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if(regTest(value, 'relexMobile')) callback()
              else callback(new Error('请输入正确的手机号'))
            }
          }],
          managerEmail: [{
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (regTest(value, 'email')) callback()
              else callback(new Error('请输入正确的邮箱'))
            }
          }],
          supplierType: [{
            required: true,
            message: "请选择",
            trigger: "change",
            validator: validateChose
          }],
          supplierMethod: [{
            type:'array',
            required: true,
            message: "请选择",
            trigger: "change",
            validator: validateMultiple
          }],
          opAreaCodeList: [{
            type:'array',
            required: true,
            message: "请选择",
            trigger: "change",
            validator: validateOpMultiple
          }]
        },
        cascaderList: [],
        bankList: [],
        periodList: [
          {
            value: '1',
            label: '1'
          },
          {
            value: '2',
            label: '2'
          },
          {
            value: '3',
            label: '3'
          },
          {
            value: '4',
            label: '4'
          },
          {
            value: '5',
            label: '5'
          },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          },
          {
            value: '8',
            label: '8'
          },
          {
            value: '9',
            label: '9'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          },
          {
            value: '13',
            label: '13'
          },
          {
            value: '14',
            label: '14'
          },
          {
            value: '15',
            label: '15'
          },
          {
            value: '16',
            label: '16'
          },
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          },
          {
            value: '20',
            label: '20'
          },
          {
            value: '21',
            label: '21'
          },
          {
            value: '22',
            label: '22'
          },
          {
            value: '23',
            label: '23'
          },
          {
            value: '24',
            label: '24'
          },
          {
            value: '25',
            label: '25'
          },
          {
            value: '26',
            label: '26'
          },
          {
            value: '27',
            label: '27'
          },
          {
            value: '28',
            label: '28'
          },
        ],
        supplierTypeList: [
          {
            value: "0",
            label: "车辆供应商"
          },
          {
            value: "2",
            label: "能源供应商"
          },
          {
            value: "3",
            label: "配件供应商"
          },
          {
            value: "4",
            label: '地推供应商'
          },
          {
            value: "5",
            label: "自动驾驶车辆供应商"
          }
        ],
        supplierMethodList: [],
        actionUrl: baseUrl + "/asset-supplier-api/api/asset/file/v1/uploadImg", // 公共文件上传服务
      };
    },
    computed: {
      cityArray() {
        if (this.cascaderList.length === 0) {
          return [];
        }
        const arr = this.cascaderList.reduce((pre, cur) => {
          const list = cur.children.map(item => ({ label: item.label, value: item.orgCode }))
          pre = [...pre, ...list]
          return pre
        }, [])
        return [{label: '全部', value: '1'}, ...arr]
      }
    },
    watch: {
      theInfo() {
        if(JSON.stringify(this.theInfo) === {}) return
        if (this.mode === 'add') return;
        if (this.mode === '') return;
        this.writeData()
      }
    },
    mounted() {
      this.getCityList()
      this.getBankListMap()
    },
    methods: {
      writeData() {
        this.supplierForm = this.theInfo.supplier
        let provinceCode = this.supplierForm.registeredCity.substring(0,2) + "0000"
        this.supplierForm.registeredCity = [provinceCode, this.supplierForm.registeredCity]
        if (this.theInfo.contact.length) {
          this.contactForm.name = this.theInfo.contact[0].name
          this.contactForm1.telephone = this.theInfo.contact[0].telephone
        }
        let provinceCode1 = this.supplierForm.cityUuid.substring(0,2) + "0000"
        this.supplierForm.cityUuid = [provinceCode1, this.supplierForm.cityUuid]
        this.supplierForm.id = this.theInfo.supplier.id

        this.businessForm = this.theInfo.businessLicense
        if (this.businessForm.bussImgList.length) {
          let bussList = []
          this.businessForm.bussImgList.forEach(item => {
            let bussImgObj = {}
            bussImgObj.uuid = item.attachment
            bussImgObj.url = item.attachmentUuid
            bussList.push(bussImgObj)
          })
          this.businessForm.bussImgList = bussList
        }

        if (this.theInfo.contract.length) {
          this.contractForm = this.theInfo.contract[0]
          if (this.contractForm.contractImgList) {
            if (this.contractForm.contractImgList.length) {
              let contractList = []
              this.contractForm.contractImgList.forEach(item => {
                let contractObj = {}
                contractObj.uuid = item.attachment
                contractObj.url = item.attachmentUuid
                contractList.push(contractObj)
              })
              this.contractForm.contractImgList = contractList
            }
          } else {
            this.contractForm.contractImgList = []
          }
        } else {
          this.contractForm = {
            contractImgList: [],
          }
        }

        if (this.theInfo.account.length) {
          this.accountForm = this.theInfo.account[0]
          if (this.accountForm.accountImgList.length) {
            let accountList = []
            this.accountForm.accountImgList.forEach(item => {
              let accountObj = {}
              accountObj.uuid = item.attachment
              accountObj.url = item.attachmentUuid
              accountList.push(accountObj)
            })
            this.accountForm.accountImgList = accountList
          }
        }

        if (this.theInfo.srmSettlementMethod.length) {
          this.srmSettlementMethodForm.period = this.theInfo.srmSettlementMethod[0].period + ""
        } else {
          this.srmSettlementMethodForm = {
            period: ""
          }
        }


        this.supplyTypeForm.supplierType = this.theInfo.supplyType[0].supplierType + ""
        if (this.theInfo.supplyType[0].supplierType === 0 || this.theInfo.supplyType[0].supplierType === 5) {
          this.supplierMethodList = [
            {
              value: "0",
              label: "自购"
            },
            {
              value: "1",
              label: "加盟"
            },
            {
              value: "3",
              label: "裸车租赁"
            },
            {
              value: "4",
              label: "大包租赁"
            }
          ]
        } else if (this.theInfo.supplyType[0].supplierType === 2) {
          this.supplierMethodList = [
            {
              value: "1",
              label: "桩企直连"
            },
            {
              value: "2",
              label: "聚合平台"
            }
          ]
        } else if (this.theInfo.supplyType[0].supplierType === 3) {
          this.supplierMethodList = [
            {
              value: "1",
              label: "普通采购"
            },
            {
              value: "2",
              label: "寄售采购"
            },
            {
              value: "3",
              label: "客户寄存"
            }
          ]
        } else if (this.theInfo.supplyType[0].supplierType === 4) {
          this.supplierMethodList = [
            {
              value: "0",
              label: "线下推广"
            },
          ]
        }

        this.theInfo.supplyType[0].supplyMethod.forEach(item => {
          this.supplyTypeForm.supplierMethod.push(item.supplierMethod + "")
        })
        const { opAreaCode } = this.theInfo.supplyType[0]
        this.supplyTypeForm.opAreaCodeList = opAreaCode.split(',')
        this.supplyTypeForm.oldSupplierType = this.theInfo.supplyType[0].oldSupplierType
        this.supplyTypeForm.refOrganId = this.theInfo.supplyType[0].refOrganId
      },
      getCityList() {
        cityList({}).then(res => {
          let list = res.data.data || []
          let params = {
            list: list,
            labelKey: "provinceName",
            valueKey: "provinceCode",
            children: "cityDtoList",
            sonLableKey: "orgName",
            sonValueKey: "orgCode",
            isDeep: true,
          }
          list = cpLabelValue(params)
          this.cascaderList = list
        });
      },
      changeFoundDate(val) {
        this.businessForm.foundDate = String(val)
      },
      changeIssueDate(val) {
        this.businessForm.issueDate = String(val)
      },
      changeBizStartDate(val) {
        this.businessForm.bizStartDate = String(val)
      },
      changeBizEndDate(val) {
        this.businessForm.bizEndDate = String(val)
      },
      changeStartDate(val) {
        this.contractForm.startDate = String(val)
      },
      changeEndDate(val) {
        this.contractForm.endDate = String(val)
      },
      setTimeClear() {
        this.supplierForm.startTime = null
        this.supplierForm.endTime = null
      },
      getBankListMap() {
        getBankList({pageSize: 5000}).then(res => {
          if (res.data.success) {
            if (res.data.data) {
              this.bankList = res.data.data.list || []
            }
          }
        })
      },
      changeBank(val) {
        this.accountForm.bankName = val
      },
      changePeriod(val) {
        this.srmSettlementMethodForm.period = val
      },
      changeSupplierType(val) {
        this.supplierMethodList = []
        this.supplyTypeForm.supplierMethod = []
        this.supplierForm2 = {
          isLogin: 1,
          managerName: '',
          managerCardId: '',
          managerTel: '',
          managerEmail: '',
        }
        if (val === "0" || val === "5") {
          this.supplierMethodList = [
            {
              value: "0",
              label: "自购"
            },
            {
              value: "1",
              label: "加盟"
            },
            {
              value: "3",
              label: "裸车租赁"
            },
            {
              value: "4",
              label: "大包租赁"
            }
          ]
        } else if (val === "2") {
          this.supplierMethodList = [
            {
              value: "1",
              label: "桩企直连"
            },
            {
              value: "2",
              label: "聚合平台"
            }
          ]
        } else if (val === '3') {
          this.supplierMethodList = [
            {
              value: "1",
              label: "普通采购"
            },
            {
              value: "2",
              label: "寄售采购"
            },
            {
              value: "3",
              label: "客户寄存"
            }
          ]
        } else if (val === '4') {
          this.supplierMethodList = [
            {
              value: "0",
              label: "线下推广"
            },
          ]
        }
        this.supplyTypeForm.supplierType = val || ""
      },
      changeSupplierMethod(val) {
        this.supplyTypeForm.supplierMethod = val || []
      },
      changeOpAreaCodeMethod(val) {
        const last = val[val.length - 1]
        if (last === '1') {
          return this.supplyTypeForm.opAreaCodeList = ['1']
        }
        this.supplyTypeForm.opAreaCodeList = val.filter(v => v !== '1') || []
      },
      getImgObj(res) {
        let fileUrl = {
          uuid: res.data.uuid,
          url: res.data.picUrl
        }
        this.businessForm.bussImgList.push(fileUrl)
      },
      getImgContractObj(res) {
        let fileUrl = {
          uuid: res.data.uuid,
          url: res.data.picUrl
        }
        this.contractForm.contractImgList.push(fileUrl)
      },
      getImgAccountObj(res) {
        let fileUrl = {
          uuid: res.data.uuid,
          url: res.data.picUrl
        }
        this.accountForm.accountImgList.push(fileUrl)
      },
      clearForm() {

      },
      clear() {

      }
    }
  };
</script>

<style lang="less" scoped>
  .supplier-detail {
    position: relative;
    padding: 10px 10px 0;
  }

  .labelRequired:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .link {
    text-decoration: underline;
    margin-top: 17px;
  }

  .detail-section {
    margin-bottom: 24px;
    line-height: 2;
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 12px;

    h2 {
      border-left: 4px solid rgba(121, 121, 121, 1);
      font-size: 16px;
      color: #333;
      padding: 2px 12px;
      font-weight: 100;
      line-height: 1;

      span {
        margin-left: 24px;
      }
    }

    .detail-label {
      font-size: 16px;
      color: #777;
    }

    .text {
      color: #040404;
      font-size: 13px;
    }

    .detail-text {
      color: #000;
    }

    & > .ivu-row {
      margin: 10px 0;
    }
  }
</style>
