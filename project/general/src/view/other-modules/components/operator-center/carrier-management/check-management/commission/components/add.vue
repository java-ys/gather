<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="900"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="formData"
        :label-width="200"
        :rules="validateRules"
      >
        <FormItem label="分佣规则名称：" prop="ruleName">
          <Input
            v-model="formData.ruleName"
            style="width: 240px"
            :maxlength="20"
            placeholder=""
            :disabled="isDetail"
          ></Input>
        </FormItem>
        <FormItem label="规则说明：" prop="">
          <Input
            v-model="formData.ruleDesc"
            style="width: 240px"
            :maxlength="40"
            placeholder=""
            :disabled="isDetail"
          ></Input>
        </FormItem>
        <FormItem label="考核城市：" prop="checkCityCode">
          <Select
            multiple
            v-model="formData.checkCityCode"
            placeholder="请选择"
            style="width: 240px"
            @on-change="onCityChange"
            :disabled="isDetail"
          >
            <Option
              v-for="(city, idx) in cityList"
              :key="idx"
              :value="city.value"
            >{{ city.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="考核开始时间：" prop="startCheckTime">
          <Date-picker v-model="formData.startCheckTime" type="month" placeholder="选择月" :disabled="isDetail" style="width: 240px"></Date-picker>
        </FormItem>
        <FormItem label="考核结束时间：" prop="endCheckTime">
          <Date-picker v-model="formData.endCheckTime" type="month" placeholder="选择月" :disabled="isDetail" style="width: 240px"></Date-picker>
        </FormItem>
        <FormItem label="管理分佣规则:（仅支持阶梯）：" prop="" :required="true">
          <Row>
            <!--<Col span="12">阶梯标准:</Col>-->
            <!--<Col span="12">系数</Col>-->
          </Row>
          <Row>
            <Col span="24">
              <RadioGroup
                v-model="formData.manageCommissionRule.radio"
                type="button"
                :disabled="isDetail"
              >
                <Radio :label="0" :disabled="isDetail">订单量</Radio>
                <Radio :label="1" :disabled="isDetail">订单流水</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br />
          <Row
            class-name="row-c"
            :key="index"
            v-for="(item, index) in formData.manageCommissionRule.ladderList"
          >
            <Col span="14">
            <Input
              v-model="item.level"
              style="width: 80px"
              :maxlength="5"
              placeholder="对应等级"
              :disabled="isDetail"
            ></Input>
            <span v-if="formData.manageCommissionRule.radio == 1">订单流水</span>
            <span v-if="formData.manageCommissionRule.radio == 0">订单量</span>
            <Select v-model="item.sign" :disabled="isDetail" style="width: 60px" placeholder="">
              <Option key="1" value=">">></Option>
              <Option key="2" value="<"><</Option>
              <Option key="3" value="=">=</Option>
              <Option key="4" value="<=">≤</Option>
              <Option key="5" value=">=">≥</Option>
            </Select>
            <InputNumber
              v-model="item.value"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="值"
              :disabled="isDetail"
            ></InputNumber>
            <InputNumber
              v-model="item.coefficient"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="佣金比例"
              :disabled="isDetail"
            ></InputNumber>
            <span>%</span>
            </Col>
            <Col span="6" v-if="!isDetail">
              <Icon
                v-if="formData.manageCommissionRule.ladderList.length > 1"
                @click="removeManagetItem(index, item)"
                class="remove-icon"
                size="24"
                type="ios-remove-circle-outline"
              />
              <Icon
                @click="addManagetItem(item)"
                class="add-icon"
                size="24"
                type="ios-add-circle-outline"
              />
            </Col>
          </Row>
          <Row>
            补充说明
            <Input v-model="formData.manageCommissionRule.desc" :maxlength="200" :disabled="isDetail" type="textarea" :rows="4" placeholder="请输入..." class="text-area"></Input>
          </Row>
        </FormItem>
        <FormItem label="关联城市系数：" prop="isRelateCity" >
          <RadioGroup v-model="formData.isRelateCity">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="奖励分佣规则:（仅支持阶梯）：" prop="standard">
          <rule-comp
            ref="_driverA"
            :readOnly="isDetail"
            :extraParams="driverActive"
           :radioList="driverActive.radioList"
           :baseData="driverActive.baseData"
          ></rule-comp>
          <rule-comp
            ref="_ensureA"
            :readOnly="isDetail"
            v-if="ensureAwardType.includes(1)"
            :extraParams="complianceCapacity"
            :radioList="complianceCapacity.radioList"
            :baseData="complianceCapacity.baseData"
          ></rule-comp>
          <rule-comp
            ref="_zeroA"
            :readOnly="isDetail"
            v-if="ensureAwardType.includes(2)"
            :extraParams="zeroComplaint"
            :baseData="zeroComplaint.baseData"
          ></rule-comp>
          <Row class="but-gap">
            <Button type="primary" @click="addAward">添加其他奖励指标</Button>
          </Row>
        </FormItem>
        <FormItem label="扣减佣金规则：" prop="">
<!--          服务扣减-->
          <rule-comp
            ref="_serviceD"
            :readOnly="isDetail"
           :extraParams="serviceDeduction"
           :radioList="serviceDeduction.radioList"
            :baseData="serviceDeduction.baseData"
          ></rule-comp>
          <div class="gap-30"></div>
<!--          合规扣减-->
          <rule-comp
            ref="_complianceD"
            :readOnly="isDetail"
            :extraParams="complianceDeduction"
            :radioList="complianceDeduction.radioList"
            :baseData="complianceDeduction.baseData"
          ></rule-comp>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button v-if="!isDetail" type="primary" :loading="false" @click="confirm">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancel">{{isDetail ? '关闭' : '取消'}}</Button>
      </div>
    </Modal>
    <Modal
      v-model="awardVisible"
      title="请选择奖励指标"
      width="300"
      :mask-closable="false"
      :closable="false"
    >
      <CheckboxGroup v-model="awardType">
        <Row>
          <Checkbox :label="1">新增合规运力</Checkbox>
        </Row>
        <Row>
          <Checkbox :label="2">零投诉、零违规司机占比</Checkbox>
        </Row>
      </CheckboxGroup>
      <div slot="footer">
        <Button type="primary" :loading="false" @click="awardConfirm">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="awardCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

import { commissionAdd, commissionUpdate, commissionGet } from "_o/api/check";
import { getProvinceCityList } from '_g/api/common.js';
import { cpTranslate } from "@/libs/tools";
import { freeze, undef } from "@/mixins/base";
import RuleComp from "./ruleComponent"
import { findInList } from "./util"

const manageCommissionRuleItem = { level: '', sign: ">", value: null, coefficient: null }
const rewardCommissionRuleItem = { sign: ">", value: null, coefficient: null }

  export default {
  name: "commission-add",
    components: {
      RuleComp
    },
  props: {
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'add'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mixins: [],
  computed: {
    isDetail() {
      return this.type === 'detail'
    }
  },
  data() {
    return {
      ensureAwardType: [],
      awardType: [],
      awardVisible: false,
      cityList: [],
      formData: {
        ruleName: "", // 规则名称
        ruleDesc: "", // 规则说明
        checkCityCode: [], // 考核城市
        startCheckTime: "",
        endCheckTime: "", // 考核时间
        manageCommissionRule : {
          ladderList: [{ ...manageCommissionRuleItem }],
          desc: "",
          radio: 1, //  0 订单量，1 订单流水
        },
        isRelateCity: ""
      },
      validateRules: freeze({
        ruleName: [
          { required: true, message: '规则名称不能为空', trigger: 'input' }
        ],
        checkCityCode: [
          { required: true, message: '考核城市不能为空', trigger: 'change', type: 'array' }
        ],
        startCheckTime : [
          { required: true, message: '考核开始时间不能为空', trigger: 'change', type: 'date' }
        ],
        endCheckTime : [
          { required: true, message: '考核结束时间不能为空', trigger: 'change', type: 'date' }
        ],
        isRelateCity: [
          { required: true, message: '请选择是否关联城市' }
        ],
      }),
      serviceDeduction: {
        title: "服务扣减",
        rowTitle: "当月订单投诉率",
        placeholder: "扣除当月整体佣金",
        radioList: [{label: "投诉率", value: "2"}],
        baseData: {type: 10}
      },
      complianceDeduction: {
        title: "合规扣减",
        rowTitle: "整体司机合规率",
        placeholder: "扣除当月整体佣金",
        radioList: [{label: "合规率", value: "3"}],
        baseData: {type: 11}
      },
      driverActive: {
        title: "司机活跃奖",
        rowTitle: "订单量",
        placeholder: "原佣金比例提升",
        radioList: [{label: "订单量", value: "0"}, {label: "订单流水", value: "1"}],
        baseData: { radio: "0", type: 0 }
      },
      complianceCapacity: {
        title: "新增合规运力",
        rowTitle: "新增合规运力",
        placeholder: "原佣金比例提升",
        radioList: [{label: "订单量", value: "0"}, {label: "订单流水", value: "1"}],
        baseData: { radio: "1", type: 1 }
      },
      zeroComplaint: {
        title: "零投诉、零违规司机",
        rowTitle: "合规司机占比",
        placeholder: "原佣金比例提升",
        baseData: { type: 2 }
      },
    };
  },
    created() {
      this.getDetail();
    },
    mounted() {
    this.getCityList()
  },
  methods: {
    async getDetail() {
      if (this.type === 'add') return
      const res = await commissionGet({ id: this.id })
      if (!res.data.success) return this.$Message.error(res.data.msg)

      let { ruleName, ruleDesc,
        checkCityCode, startCheckTime, endCheckTime,
        manageCommissionRuleDto: manageCommissionRule,
        rewardCommissionRuleDtoList,
        deductCommissionRuleDtoList
      } = res.data.data;

      this.setCoefficientValueToNumber(manageCommissionRule.ladderList);
      rewardCommissionRuleDtoList.forEach(item => {
        this.setCoefficientValueToNumber(item.ladderList)
      });
      deductCommissionRuleDtoList.forEach(item => {
        this.setCoefficientValueToNumber(item.ladderList)
      });
      this.formData = {
        ruleName,
        ruleDesc,
        checkCityCode: checkCityCode.split(','),
        startCheckTime,
        endCheckTime,
        manageCommissionRule,
        isRelateCity: manageCommissionRule.isRelateCity
      }
      this.ensureAwardType = rewardCommissionRuleDtoList.map(k => (k.type)).filter(Boolean)
      this.setRewardData(rewardCommissionRuleDtoList).setDeductionData(deductCommissionRuleDtoList)
    },
    setRewardData(rewardCommissionRuleDtoList) {
      let activeD = findInList('type',0, rewardCommissionRuleDtoList)
      let complainceD = findInList('type',1, rewardCommissionRuleDtoList)
      let zeroD = findInList('type',2, rewardCommissionRuleDtoList)
      if(activeD) {
        this.driverActive.baseData = {...this.driverActive.baseData, ...activeD}
      }
      if(complainceD) {
        this.complianceCapacity.baseData = {...this.complianceCapacity.baseData, ...complainceD}
      }
      if(zeroD) {
        this.zeroComplaint.baseData = {...this.zeroComplaint.baseData, ...zeroD}
      }
      return this
    },
    setDeductionData(deductCommissionRuleDtoList) {
      let findService = findInList('type',10, deductCommissionRuleDtoList)
      let findComplaince = findInList('type',11, deductCommissionRuleDtoList)
      if(findService) {
        this.serviceDeduction.baseData = {...this.serviceDeduction.baseData, ...findService}
      }
      if(findComplaince) {
        this.complianceDeduction.baseData = {...this.complianceDeduction.baseData, ...findComplaince}
      }
    },
    setCoefficientValueToNumber(list=[]) {
      list.forEach(item => {
        item.coefficient = item.coefficient === '' ? null : Number(item.coefficient)
        item.value = item.value === '' ? null : Number(item.value)
      });
      return this
    },
     onCityChange(e) {
      const idx = e.indexOf('100000')
      if (idx === -1) return
      if (e[e.length - 1] === '100000') {
        this.formData.checkCityCode = ['100000']
      } else {
        let arr = e.slice()
        arr.splice(idx, 1)
        this.formData.checkCityCode = arr
      }
    },
    // 获取城市列表
    getCityList() {
      getProvinceCityList({}).then(res => {
        const all = {
          city: '全国',
          cityID: '100000',
          label: '全国',
          value: '100000'
        }
        if (res.data.success) {
          this.cityList = [ all, ...cpTranslate(res.data.data).map(province => province.children).flat() ];
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    removeManagetItem(index) {
      if (this.isDetail) return
      this.formData.manageCommissionRule.ladderList.splice(index, 1)
    },
    addManagetItem() {
      if (this.isDetail) return
      this.formData.manageCommissionRule.ladderList.push({ ...manageCommissionRuleItem });
    },
    validateLadderList(list) {
      let msg = ''
      const bool = list.every(rule => {
        const { level, sign, value, coefficient } = rule
        if (!level) {
          msg = '对应等级必填'
          return false
        }
        if (!sign) {
          msg = '填写正确符号'
          return false
        }
        if (typeof value !== 'number' || value < 0) {
          msg = '值必填'
          return false
        }
        if (typeof coefficient !== 'number' || coefficient < 0) {
          msg = '系数必须为整数'
          return false
        }
        return true;
      })
      return { msg, bool }
    },
    confirm() {
      this.$refs._form.validate(async (bool) => {
        const cityList = this.cityList.filter(city => this.formData.checkCityCode.indexOf(city.value) > -1).map(item => ({ cityCode: item.value, cityName: item.label }))

        const params = {
          ...this.formData,
          cityList: cityList,
          startCheckTime: this.$moment(this.formData.startCheckTime).format('YYYY-MM'),
          endCheckTime: this.$moment(this.formData.endCheckTime).format('YYYY-MM'),
          checkCityCode: undefined,
          rewardCommissionRuleList: this.handleRewardData(),
          deductCommissionRuleList: this.handleDeductionData()
        }
        params.manageCommissionRule.isRelateCity = this.formData.isRelateCity
        delete params.isRelateCity
        this._log(params)
        // return
        if (!bool) return;
        const { manageCommissionRule: { ladderList } } = this.formData
        const { msg: ruleMsg, bool: ruleBool } = this.validateLadderList(ladderList)
        if (!ruleBool) return this.$Message.error(`管理分佣规则${ruleMsg}`)
        if(!this.validRewardData(params.rewardCommissionRuleList)) {
          return
        }
        if(!this.validDeductionData(params.deductCommissionRuleList)) {
          return
        }
        let res
        if (this.type === 'add') {
          res = await commissionAdd(params)
        } else if (this.type === 'edit') {
          res = await commissionUpdate({ ...params, id: this.id })
        }
        // console.log(res);
        if (!res.data.success) return this.$Message.error(res.data.msg)
        let msg = !!this.id ? "修改成功" : "新建成功";
        this.$Message.success(msg);
        this.$emit("confirm");
      });
    },
    cancel() {
      if (this.isDetail) return this.$emit('close')
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
    awardConfirm() {
      this.ensureAwardType = this.awardType
      this.awardCancel()
    },
    awardCancel() {
      this.awardVisible = false
    },
    addAward() {
      this.awardVisible = true
    },
    handleDeductionData() {
      return [this.$refs._serviceD.exportData(), this.$refs._complianceD.exportData()].map(it => ({
        desc: it.desc, ladderList: it.list, type: it.type
      }))
    },
    handleRewardData() {
      return [this.$refs._driverA, this.$refs._ensureA, this.$refs._zeroA].filter(Boolean).map(fu => {
        let { desc, list, radioType, type } = fu.exportData()
        return {desc, ladderList: list, radio: radioType, type}
      })
    },
    // 阶梯必须有 大于等于0 选项
    validRewardData(list) {
      return true

      // let len= list.length
      // let msg = ""
      // for(let i = 0; i < len; i++) {
      //   let r = list[i].ladderList.some(l => {
      //     let { sign, value, coefficient} = l
      //     return sign === ">=" && (!undef(value) && value !== "") && (!undef(coefficient && coefficient !== ""))
      //   })
      //   if(!r) {
      //     msg = "奖励分佣规则必须设置>=0的阶梯"
      //     break
      //   }
      // }
      // if(msg) {
      //   this.$Message.error(msg)
      //   return false
      // }
      // return true
    },
    // 阶梯必须有 大于等于0 选项
    validDeductionData(list) {
      return true
      // let len= list.length
      // let msg = ""
      // for(let i = 0; i < len; i++) {
      //   let r = list[i].ladderList.some(l => {
      //     let { sign, value, coefficient} = l
      //     return sign === ">=" && (!undef(value) && value !== "") && (!undef(coefficient && coefficient !== ""))
      //   })
      //   if(!r) {
      //     msg = "扣减佣金规则必须设置>=0的阶梯"
      //     break
      //   }
      // }
      // if(msg) {
      //   this.$Message.error(msg)
      //   return false
      // }
      // return true
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .text-area textarea {
  width: 500px;
}

.but-gap {
  margin-top: 40px;
}
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.gap-30 {
  height: 30px;
}
</style>
