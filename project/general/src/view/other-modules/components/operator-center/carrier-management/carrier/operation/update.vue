<!--
 * @description: 营运管理-运营商管理-运营商-编辑&新增
 * @author: wuxuan
 * @date: 2019-07-29 10:09:42
!-->
<template>
  <div>
    <Form
      ref="formValidate"
      :model="params"
      :rules="ruleUser"
      :label-width="100"
      label-position="right"
    >
    <div class="babelTitle"><span/><em>基础信息</em></div>
    <Row>
      <Col span="12">
        <FormItem
          label="运营商："
          prop="name"
        >
          <Input
            v-model="params.name"
            clearable
            placeholder="请输入运营商名称"
          ></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          v-show="type === 'add'"
          label="所属机构："
          prop="organItem"
        >
          <Cascader
            v-model="params.organItem"
            change-on-select
            :data="organList"
            placeholder="请选择所属机构"
          >
          </Cascader>
        </FormItem>
        <FormItem
          v-show="type === 'edit'"
          label="所属机构："
        >
          <Input
            v-model="params.organName"
            readonly
          ></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="运营区域："
          prop="carrierArea"
        >
          <Cascader
            v-model="params.carrierArea"
            :data="cityList"
            :clearable="false"
            placeholder="请选择运营区域"
            @on-change="cityChange"
          >
          </Cascader>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="区县："
          prop=""
        >
          <Select
            v-model="params.areaCodeList"
            filterable
            multiple
            clearable
            placeholder="请选择区县"
            style="width:300px;"
          >
            <Option
              v-for="item in countyList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
      <Row>
        <Col span="12">
          <FormItem
            label="运营模式："
            prop="agentModeList"
          >
            <CheckboxGroup v-model="params.agentModeList">
              <!-- 编辑-不允许取消 -->
              <Checkbox
                v-for="item in agentModeDataList"
                :key="item.value"
                :label="item.value"
                :disabled="(type==='edit' && operationValueCopy.indexOf(item.value)>-1) || (type === 'add' && params.supportWithCar === '1' && item.value === '2')"
                style="margin-right:15px;"
              >
                {{ item.label }}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
      </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="联系电话："
          prop="mobileList"
        >
          <div
            v-for="(item, index) in params.mobileList"
            :key="index"
            class="mobile-wrap"
          >
            <numberInput
              v-model="item.area"
              class="area-number no-arrow"
              placeholder="区号"
              :max="4"
            ></numberInput>
            <span class="link-mobile">--</span>
            <numberInput
              v-model="item.number"
              class="real-number no-arrow"
              placeholder="请输入手机或电话号码"
              :max="13"
            ></numberInput>
          </div>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="邮箱："
          prop="email"
        >
          <Input
            v-model="params.email"
            clearable
            placeholder="请输入邮箱地址"
          ></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="地址："
          prop="address"
          style="width: 400px;"
        >
          <Input
            v-model="params.address"
            clearable
            placeholder="请输入地址"
          ></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="面试地址："
          prop="addressList"
          style="width: 400px;margin-bottom: 0;"
        >
          <div
            v-for="(item, index) in params.addressList"
            :key="index"
            class="addressList-wrap"
          >
            <Input
              v-model="item.address"
              clearable
              :maxlength="30"
              placeholder="请输入面试地址"
            ></Input>
            <span
              v-if="index"
              class="iconfont icon-delete"
              @click="deleteConfig(index)"
            ></span>
          </div>
        </FormItem>

        <div
          class="add-list-btn"
          style="margin-left: 100px;"
          @click="addConfig"
        >
          添加面试地址
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="司机咨询电话："
          prop="hotline"
          :label-width="106"
          style="width: 400px;margin-bottom: 0;"
        >
          <numberInput
            v-model="params.hotline"
            class="real-number no-arrow"
            placeholder="请输入手机或电话号码"
            :max="13"
          ></numberInput>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="平台权限："
          prop="monitorAdmitted"
          style="width: 400px;margin-bottom: 0;"
        >
          <Checkbox v-model="params.monitorAdmitted">
            允许登录监控大屏
          </Checkbox>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="是否支持带车加盟："
          prop="supportWithCar"
          :label-width="140"
          style="width: 400px;margin-bottom: 0;"
        >
          <RadioGroup
            v-model="params.supportWithCar"
            @on-change="supportWithCarChange"
          >
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem
          label="是否支持巡网出租车："
          prop="supportWithTaxi"
          :label-width="150"
          style="width: 400px;margin-bottom: 0;"
        >
          <RadioGroup
            v-model="params.supportWithTaxi"
          >
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          v-if="params.supportWithCar === '1'"
          label="是否公海运营商："
          prop="gongHaiAgentFlag"
          :label-width="140"
          style="width: 400px;margin-bottom: 0;"
        >
          <RadioGroup
            v-model="params.gongHaiAgentFlag"
          >
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
    <div class="babelTitle"><span/><em>发票信息</em></div>
    <Row>
      <Col span="12">
        <FormItem
          :label-width="140"
          label="是否提供电子发票："
          prop="needInvoice"
        >
          <RadioGroup
          v-model="params.needInvoice"
          >
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
      <Col span="12" v-if="params.needInvoice==='1'">
        <FormItem
          :label-width="120"
          label="是否平台开票："
          prop="invoiceSource"
        >
          <RadioGroup
          v-model="params.invoiceSource"
          >
            <Radio label="0">是</Radio>
            <Radio label="1">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
    <Row v-if="params.needInvoice==='1'&&params.invoiceSource==='0'">
        <span style="position: absolute;top: 10px; left: 6px; color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
      <Col span="12">
        <FormItem
          :label-width="120"
          label="A模式开票主体："
          prop="invoiceSubjectName"
        >
          <Button
          @click="selectEntity(0)"
          type="default">选择开票主体</Button>
          <div v-if="Object.keys(currentEntity).length > 0 && currentEntity.invoiceSubjectName">
            {{currentEntity.invoiceSubjectName}}</div>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          :label-width="120"
          label="税号："
          prop="taxNumber"
        >
          {{currentEntity.taxNum || ''}}
        </FormItem>
      </Col>
    </Row>
    <Row v-if="params.needInvoice==='1'&&params.invoiceSource==='0'">
      <Col span="12">
        <span style="position: absolute;top: 10px; left: -3px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
        <FormItem
          :label-width="120"
          label="UP模式开票主体："
          prop="invoiceSubjectName"
        >
          <Button
          @click="selectEntity(1)"
          type="default">选择开票主体</Button>
          <div v-if="Object.keys(upEntity).length > 0 && upEntity.invoiceSubjectName">
            {{upEntity.invoiceSubjectName}}</div>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          :label-width="120"
          label="税号："
          prop="taxNumber"
        >
          {{upEntity.taxNum || ''}}
        </FormItem>
      </Col>
    </Row>
      <div class="babelTitle"><span/><em>结算信息</em></div>
      <Row>
        <Col span="12">
          <FormItem
            label="公司账户名称："
            prop=""
            :label-width="120"
          >
            <Input
              v-model="params.bankAccountName"
              clearable
              placeholder="请输入公司账户"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            label="开户分行："
            prop=""
            :label-width="120"
          >
            <Input
              v-model="params.openingBank"
              clearable
              placeholder="请输入开户分行"
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem
            label="银行账户："
            prop=""
            :label-width="120"
          >
            <Input
              v-model="params.bankAccount"
              clearable
              placeholder="请输入银行账户"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            label="银行类型："
            prop=""
            :label-width="120"
          >
            <Input
              v-model="params.bankType"
              clearable
              placeholder="例如中国建设银行"
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem
            label="开户行所在省："
            prop=""
            :label-width="120"
          >
            <Select
              v-model="params.openingProvince"
              placeholder="请选择省"
              clearable
              filterable
              @on-change="provinceChange"
            >
              <Option
                v-for="item in provinceList"
                :key="item.value"
                :value="item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            label="开户行所在市："
            prop=""
            :label-width="120"
          >
            <Select
              v-model="params.openingCity"
              clearable
              filterable
              placeholder="请选择城市"
            >
              <Option
                v-for="item in cityToProvince"
                :key="item.value"
                :value="item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
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
          v-lazy-click="{fn:commit,params:{tempe:1}}"
          size="large"
          type="primary"
        >
          确定
        </Button>
      </div>
    </Form>
  </div>
</template>

<script>
import "@/styles/cyk-style.css"
import "@/styles/icon-font/iconfont.css"
import numberInput from "_c/number-input/number-input"
import { changeListKey, treeDataTranslate, getAllParentsId, cpTranslate } from "@/libs/tools"
import { regTest } from '@m2-micro/util'
import {freeze} from "@/mixins/base"
import { addCarrier, editCarrier, getCarrierInfo, getAllOrgan } from "_o/api/operator-carrier"
import { agentModeDataList } from "../index.js";
import { _getAreaInfoByCityCode } from "_g/api/general"
import {
  getWholeRegion
} from "_g/api/common.js";
import { localSave, localRead } from "@/libs/util"

const PROVINCE_CITY_KEY = "_provinceAndCity";

const billInfo = { // 结算信息
  bankAccountName: "",
  bankAccount: "",
  bankType: "",
  openingBank: "",
  openingCity: "",
  openingProvince: ""
}
export default {
  components: {
    numberInput
  },
  props: {
    popView: Boolean, // 是否打开弹窗
    type: String, // add：新增，edit，编辑
    uuid: {
      default: "",
      type: String
    },
    cityList: {
      default: () => {
        return []
      },
      type: Array
    },
    entity: { // 开票主体
      default: () => {
        return {}
      },
      type: Object
    },
    modeType: {
      type: Number
    }
  },
  data() {
    const hotline = (rule, value, callback) => {
      if (!regTest(value, "phone&mobile")) {
        callback(new Error("司机咨询电话不正确"))
      } else callback()
    }
    const mobileList = (rule, value, callback) => {
      let temp = false; let
        flag = true
      value.forEach(function (item, index) {
        if ((item.area !== "" || item.number !== "") && (item.area !== null || item.number !== null)) {
          if (!regTest(item.number, "phone&mobile")) flag = false
        }
        if (item.area !== "" && item.area !== null && item.number !== "") temp = true // 存在一条不为空
      })
      if (temp && flag) callback()
      else if (!temp) callback(new Error("至少填写一个联系电话"))
      else callback(new Error("输入的号码格式不正确"))
    }
    const addressList = (rule, value, callback) => {
      let temp = true
      value.forEach(function (item, index) {
        if (item.address === "") temp = false
      })
      if (temp) callback()
      else callback(new Error("请填写面试地址"))
    }
    const carrierArea = (rule, value, callback) => {
      if (this.params.carrierArea.length > 0) callback()
      else callback(new Error("运营区域不得为空"))
    }
    const email = (rule, value, callback) => {
      if (regTest(value, "email")) callback()
      else callback(new Error("请填写正确的邮箱"))
    }
    const organItem = (rule, value, callback) => {
      let data = value || []
      if (data.length > 0) callback()
      else callback(new Error("组织机构不得为空"))
    }
    const needInvoice = (rule, value, callback) => {
      if (value === "") callback(new Error("是否提供电子发票不能为空"))
      else callback()
    }
    const invoiceSource = (rule, value, callback) => {
      if (value === "") callback(new Error("是否平台开票不能为空"))
      else callback()
    }
    const supportWithCar = (rule, value, callback) => {
      if (value === "") callback(new Error("是否支持带车加盟不能为空"))
      else callback()
    }
    const gongHaiAgentFlag = (rule, value, callback) => {
      if (value === "") callback(new Error("是否公海运营商不能为空"))
      else callback()
    }
    const supportWithTaxi = (rule, value, callback) => {
      if (value === "") callback(new Error("是否支持巡网出租车不能为空"))
      else callback()
    }
    return {
      countyList: [],
      searchList: [],
      organList: [],
      currentEntity: {},
      upEntity: {},
      params: {
        organItem: [],
        carrierArea: [],
        agentModeList: [],
        addressList: [
          { address: "" }
        ],
        mobileList: [
          { area: "", number: "" },
          { area: "", number: "" },
          { area: "", number: "" }
        ],
        monitorAdmitted: false,
        needInvoice:'', // 是否开具电子发票
        invoiceSource:'', // 是否平台开票，默认平台
        supportWithCar: '',
        gongHaiAgentFlag: '',
        ...billInfo,
        areaCodeList: []
      },
      ruleUser: freeze({
        name: [{
          required: true, trigger: "change", message: "运营商名称不得为空"
        }],
        carrierArea: [{
          required: true, trigger: "change", validator: carrierArea
        }],
        agentModeList: [{
          required: true, type: "array", min: 1, message: "请选择运营模式", trigger: "change"
        }],
        email: [{
          required: true, trigger: "change", validator: email,
        }],
        address: [{
          required: true, trigger: "change", message: "地址不得为空"
        }],
        addressList: [{
          required: true, validator: addressList, trigger: "change"
        }],
        hotline: [{
          required: true, validator: hotline, trigger: 'change'
        }],
        mobileList: [{
          required: true, validator: mobileList, trigger: "change"
        }],
        organItem: [{
          required: true, validator: organItem, trigger: "change"
        }],
        needInvoice: [{
          required: true, validator: needInvoice, trigger: "change"
        }],
        invoiceSource: [{
          required: true, validator: invoiceSource, trigger: "change"
        }],
        supportWithCar: [{
          required: true, validator: supportWithCar, trigger: "change"
        }],
        gongHaiAgentFlag: [{
          required: true, validator: gongHaiAgentFlag, trigger: "change"
        }],
        supportWithTaxi: [{
          required: true, validator: supportWithTaxi, trigger: "change"
        }],
      }),
      agentModeDataList,
      operationValueCopy: [],
      provinceList: [],
      cityToProvince: [],
      provinceCityMap: {}
    }
  },
  watch: {
    "entity": function (val) {
      if(this.modeType) {
        this.upEntity = val
      } else {
        this.currentEntity = val
      }
    },
    "popView": function () {
      // 打开弹窗，如果是新增，初始化数据，否则，获取详情数据
      if (this.popView) {
        if (this.type === "add") {
          this.params = {
            organItem: [],
            carrierArea: [],
            addressList: [
              { address: "" }
            ],
            mobileList: [
              { area: "", number: "" },
              { area: "", number: "" },
              { area: "", number: "" }
            ],
            needInvoice:'',
            invoiceSource:'',
            gongHaiAgentFlag: '',
          }
        } else {
          this.getCarrierInfo()
        }
      }
      this.$refs.formValidate.resetFields()
    }
  },
  mounted() {
    this.getAllOrgan();
    this.$nextTick(() => {
      this.setProvinceAndCity()
    })
  },
  methods: {
    supportWithCarChange(e) {
      const set = new Set(this.params.agentModeList)
      if (e === '1') {
        set.add('2')
        this.params.agentModeList = [ ...set ]
      }
      if (e === '0') {
        this.params.gongHaiAgentFlag = ''
      }
    },
    selectEntity(p) {
      this.$emit('entity', p)
    },
    // 获取所有机构列表
    getAllOrgan: function () {
      getAllOrgan({}).then(res => {
        let data = res.data.data
        this.searchList = JSON.parse(JSON.stringify(data))
        changeListKey(data, "name", "label")
        changeListKey(data, "id", "value")
        this.organList = treeDataTranslate(data)
      })
    },
    // 删除一条面试地址
    deleteConfig: function (index) {
      this.params.addressList.splice(index, 1)
      this.$refs.formValidate.validateField("addressList")
    },
    // 添加一条面试地址
    addConfig: function () {
      if (this.params.addressList.length < 3) {
        this.params.addressList.push({ address: "" })
      } else {
        this.$Message.warning("最多可添加3个面试地址")
      }
    },
    // 获取详情数据
    getCarrierInfo: function () {
      getCarrierInfo({ uuid: this.uuid }).then(res => {
        let length = res.data.data.mobileList.length
        res.data.data.carrierArea = [res.data.data.provinceId, res.data.data.cityCode]
        this.queryArea(res.data.data.cityCode)
        res.data.data.addressList = res.data.data.interviewAddressList
        res.data.data.organItem = getAllParentsId(this.searchList, res.data.data.organId)
        this.params = res.data.data
        this.params.monitorAdmitted = Number(this.params.monitorAdmitted) === 1 ? true : false
        this.operationValueCopy = JSON.parse(JSON.stringify(this.params.agentModeList))
        for (let i = 0; i < (3 - length); i++) {
          this.params.mobileList.push({
            area: "",
            number: ""
          })
        }
        this.params.hotline = this.params.hotline
        this.params.needInvoice = String(this.params.needInvoice)
        this.params.invoiceSource = String(this.params.invoiceSource)
        this.params.supportWithCar = String(this.params.supportWithCar)
        this.params.gongHaiAgentFlag = String(this.params.gongHaiAgentFlag)
        this.params.supportWithTaxi = String(this.params.supportWithTaxi)
        this.params.isSupportWithCar = String(this.params.supportWithCar)
        this.currentEntity.invoiceSubjectName = res.data.data.invoiceSubjectName || ''
        this.currentEntity.invoiceSubjectCode = res.data.data.invoiceSubjectId || ''
        this.currentEntity.taxNum = res.data.data.taxNumber || ''
        this.upEntity.invoiceSubjectCode = res.data.data.invoiceSubjectIdUp || ''
        this.upEntity.invoiceSubjectName = res.data.data.invoiceSubjectNameUp || ''
        this.upEntity.taxNum = res.data.data.taxNumberUp || ''
        this.provinceChange(this.params.openingProvince)
      })
    },
    // 提交新增、编辑
    commit: function (temp) {
      if (typeof temp === "object" && temp.tempe) {
        temp = temp.tempe
      }
      if (!temp) {
        this.$emit("on-confirm", 0)
        return
      }
        this.$refs.formValidate.validate().then(res => {
          if(!res) return
            let params = JSON.parse(JSON.stringify(this.params))
            params.cityId = this.params.carrierArea[1]
            params.interviewAddressList = this.params.addressList
            params.organId = this.params.organItem[this.params.organItem.length - 1]
            params.monitorAdmitted = params.monitorAdmitted === true ? 1 : 0
            params.isSupportWithCar = params.supportWithCar
            for (let i = 0; i < params.mobileList.length; i++) {
              if (params.mobileList[i].area === "" || params.mobileList[i].area === null) {
                params.mobileList.splice(i, 1)
                i--
              }
            }
            // 不提供发票 或 不平台开票
            if (this.params.needInvoice==='0'||this.params.invoiceSource==='1') {
              params.invoiceSubjectId=''
              params.invoiceSubjectName=''
              params.taxNumber=''
              params.invoiceSubjectIdUp = ""
              params.invoiceSubjectNameUp = ""
              params.taxNumberUp = ""
            } else {
              params.invoiceSubjectId=this.currentEntity.invoiceSubjectCode
              params.invoiceSubjectName=this.currentEntity.invoiceSubjectName
              params.taxNumber = this.currentEntity.taxNum
              params.invoiceSubjectIdUp = this.upEntity.invoiceSubjectCode
              params.invoiceSubjectNameUp = this.upEntity.invoiceSubjectName
              params.taxNumberUp = this.upEntity.taxNum
              if(!params.invoiceSubjectId || !params.invoiceSubjectIdUp) {
                this.$Message.error("请选择开票主体")
                return
              }
            }
            params = {...params, ...this.getBillInfo()}
            // return
            if (this.type === "add") {
              addCarrier(params).then(res => {
                this.$Message.success("添加成功")
                // 新增运营商成功之后，刷新机构
                this.getAllOrgan()
                this.$emit("on-confirm", 1)
              })
            } else {
              params.uuid = this.uuid
              editCarrier(params).then(res => {
                this.$Message.success("修改成功")
                // 新增运营商成功之后，刷新机构
                this.getAllOrgan()
                this.$emit("on-confirm", 1)
              })
            }
        })
    },
    getBillInfo() {
      let r = {};
      Object.keys(billInfo).forEach(key => {
        r[key] = this.params[key]
      })
      return r
    },
    async getProvinceAndCity() {
      if (localRead(PROVINCE_CITY_KEY)) {
        return JSON.parse(localRead(PROVINCE_CITY_KEY))
      }
      const { data: {data, success} } = await getWholeRegion()
      if (success) {
        localSave(PROVINCE_CITY_KEY, JSON.stringify(data))
        return data
      }
      return []
    },
    async setProvinceAndCity() {
      const list = await this.getProvinceAndCity()
      this.provinceList = list.map(l => ({label: l.province, value: l.provinceID}))
      let _map = {}
      list.forEach(d => {
        let ls = d.citys
        _map[d.province] = ls.map(city => ({label: city.city,value: city.cityID}))
      })
      this.provinceCityMap = _map
    },
    provinceChange(provinceId) {
      this.cityToProvince = this.provinceCityMap[provinceId] || [];
      if(!provinceId) {
        this.params.openingCity = ""
      }
    },
    async queryArea(cityCode) {
      let { list } = await _getAreaInfoByCityCode(cityCode);
      this.countyList = list
    },
    cityChange(v) {
      if(v && v.length) {
        this.queryArea(v[1])
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.babelTitle {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.babelTitle span {
  float: left;
  width: 4px;
  height: 16px;
  background: #515a6e;
  display: block
}
.babelTitle em {
  float: left;
  font-size: 16px;
  color: #515a6e;
  font-weight: bold;
  margin-left: 12px
}
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}
.mobile-wrap:last-child {
  margin-bottom: 0;
}
.icon-delete {
  font-size: 14px;
  position: absolute;
  right: -25px;
}
.icon-delete:hover {
  cursor: pointer;
}
.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  line-height: 22px;
  text-align: center;
}
.real-number {
  width: 200px;
}
.area-number {
  width: 100px;
}
.addressList-wrap {
  margin-bottom: 15px;
}
</style>
