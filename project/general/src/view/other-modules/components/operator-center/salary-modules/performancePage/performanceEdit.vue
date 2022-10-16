<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :visible="editVisible"
    width="80%"
    @close="closeDialog"
  >
    <el-form id="baseWageItem" ref="editForm" :inline="true" :rules="rules" :model="editForm" class="demo-form-inline"
             size="small" label-width="120px"
    >
      <el-row>
        <el-row>
          <el-col v-if="isEdit" :span="12">
            <el-form-item label="规则代码">
              <el-input v-model="editForm.ruleCode" placeholder="规则代码" readonly="readonly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="editForm.ruleName" placeholder="规则名称" maxlength="16"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="城市" prop="cityUuid">
              <el-select v-model="editForm.cityUuid" placeholder="城市" filterable @change="setCityName">
                <template v-for="(cityObj, index) in cities">
                  <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isEdit" :span="12">
            <el-form-item label="业务线" prop="businessType">
              <el-select v-model="editForm.businessType" placeholder="业务线" @change="getBusinessType">
                <el-option label="出租车" :value="1"></el-option>
                <el-option label="专享" :value="2"></el-option>
                <el-option label="快享" :value="4"></el-option>
                <el-option label="包车" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="生效起始周" prop="beginTime">
              <el-date-picker
                v-model="editForm.beginTime"
                type="week"
                placeholder="选择生效起始周"
                format="yyyy 第 WW 周"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="生效结束周" prop="endTime">
              <el-date-picker
                v-model="editForm.endTime"
                type="week"
                placeholder="选择生效结束周"
                format="yyyy 第 WW 周"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="!isEdit" :span="12">
            <el-form-item label="业务线" prop="businessType">
              <el-select v-model="editForm.businessType" placeholder="业务线" @change="getBusinessType">
                <el-option label="出租车" :value="1"></el-option>
                <el-option label="专享" :value="2"></el-option>
                <el-option label="快享" :value="4"></el-option>
                <el-option label="包车" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <div v-if="editForm.businessType == 2 || editForm.businessType == 6">
        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <el-col :span="3" style="margin-top: 5px">
                  <el-checkbox v-model="ruleCheck"
                               true-label="1" false-label="0" @change="checkChange(1, ruleCheck)"
                  >阶梯绩效奖励
                  </el-checkbox>
                </el-col>
              </span>
            </div>
            <template v-if="!ruleInputVisible">
              <span class="check-text">(勾选后，阶梯绩效奖励生效)</span><br />
            </template>
            <template v-else>
              <span>计算周期：每周</span><br /><br /><span>奖励规则：</span><br /><br />
              <el-row>
                <div v-for="(item, index) in ladderItem.ruleDataList" :key="index" class="text item">
                  <el-row>
                    <el-col :span="14">
                      <span style="line-height: 1.9; font-weight: bold">规则{{index + 1}}</span>
                      <el-form-item v-if="p1Visible" label="到账流水区间" size="mini" label-width="110px">
                        <el-input v-model="item.elementValue1" placeholder="元" :class="[validateData.p1[index].success ? '' : 'border-validate-red']"
                                  style="width: 85px"
                                  @blur="ruleValidate('P1', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p1[index].msg}}
                        </div>
                      </el-form-item>
                      <el-form-item v-if="p2Visible" label=" - " size="mini" label-width="16px">
                        <el-input v-model="item.elementValue2" placeholder="元" :class="[validateData.p2[index].success ? '' : 'border-validate-red']"
                                  style="width: 85px"
                                  @blur="ruleValidate('P2', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p2[index].msg}}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item v-if="p3Visible" label="奖励到账流水(%)" size="mini" label-width="125px">
                        <el-input v-model="item.objectValue" placeholder="百分比" :class="[validateData.p3[index].success ? '' : 'border-validate-red']"
                                  style="width: 75px"
                                  @blur="ruleValidate('P3', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p3[index].msg}}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <el-button v-if="ladderItem.ruleDataList.length > 1" type="info" size="mini"
                                 @click="handleMinus(index)"
                      >-
                      </el-button>
                      <el-button v-else type="info" size="mini"
                                 @click="alertUnableToMinus"
                      >-
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <div class="button-group-mini-plus">
                <el-row>

                  <el-col :span="23">
                    &nbsp;
                  </el-col>
                  <el-col :span="1">
                    <el-button v-if="ladderItem.ruleDataList.length < 10" type="primary" size="mini" @click="handlePlus">
                      +
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-card>
        </el-row>

        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <el-col :span="3" style="margin-top: 5px">
                  <el-checkbox v-model="flowRewardruleCheck"
                               true-label="1" false-label="0" @change="checkChange(2, flowRewardruleCheck)"
                  >每单流水抽成奖励
                  </el-checkbox>
                </el-col>
              </span>
            </div>
            <template v-if="!flowRewardVisible">
              <span class="check-text">(勾选后，流水抽成奖励生效)</span><br />
            </template>
            <template v-else>
              <el-row>
                <el-col :span="20">
                  <el-form-item v-if="p4Visible" label="每单流水抽成奖励(%)" size="mini" label-width="160px">
                    <el-input v-model="FlowpumpItem.ruleDataList[0].objectValue" placeholder="请输入数值" style="width: 95px" :class="[validateData.p4[0].success ? '' : 'border-validate-red']" @blur="ruleValidate('P4', 0)">
                    </el-input>
                    <div class="el-form-item__error">
                      {{validateData.p4[0].msg}}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-card>
        </el-row>
      </div>
      <div v-else>
        <el-row>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <el-col :span="3" style="margin-top: 5px">
                  <el-checkbox v-model="ruleCheck"
                               true-label="1" false-label="0" @change="checkChange(1, ruleCheck)"
                  >阶梯绩效奖励
                  </el-checkbox>
                </el-col>
              </span>
            </div>
            <template v-if="!ruleInputVisible">
              <span class="check-text">(勾选后，阶梯绩效奖励生效)</span><br />
            </template>
            <template v-else>
              <span>计算周期：每周</span><br /><br /><span>奖励规则：</span><br /><br />
              <el-row>
                <div v-for="(item, index) in ladderItem.ruleDataList" :key="index" class="text item">
                  <el-row>
                    <el-col :span="14">
                      <span style="line-height: 1.9; font-weight: bold">规则{{index + 1}}</span>
                      <el-form-item v-if="p1Visible" label="到账流水区间" size="mini" label-width="110px">
                        <el-input v-model="item.elementValue1" placeholder="元" :class="[validateData.p1[index].success ? '' : 'border-validate-red']"
                                  style="width: 85px"
                                  @blur="ruleValidate('P1', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p1[index].msg}}
                        </div>
                      </el-form-item>
                      <el-form-item v-if="p2Visible" label=" - " size="mini" label-width="16px">
                        <el-input v-model="item.elementValue2" placeholder="元" :class="[validateData.p2[index].success ? '' : 'border-validate-red']"
                                  style="width: 85px"
                                  @blur="ruleValidate('P2', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p2[index].msg}}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item v-if="p3Visible" label="奖励到账流水(%)" size="mini" label-width="125px">
                        <el-input v-model="item.objectValue" placeholder="百分比" :class="[validateData.p3[index].success ? '' : 'border-validate-red']"
                                  style="width: 75px"
                                  @blur="ruleValidate('P3', index)"
                        ></el-input>
                        <div class="el-form-item__error">
                          {{validateData.p3[index].msg}}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <el-button v-if="ladderItem.ruleDataList.length > 1" type="info" size="mini"
                                 @click="handleMinus(index)"
                      >-
                      </el-button>
                      <el-button v-else type="info" size="mini"
                                 @click="alertUnableToMinus"
                      >-
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <div class="button-group-mini-plus">
                <el-row>

                  <el-col :span="23">
                    &nbsp;
                  </el-col>
                  <el-col :span="1">
                    <el-button v-if="ladderItem.ruleDataList.length < 10" type="primary" size="mini" @click="handlePlus">
                      +
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-card>
        </el-row>
      </div>
    </el-form>
    <div class="button-group">
      <el-button v-show="!saving" type="primary" @click="save">保存</el-button>
      <el-button v-print="'#baseWageItem'" type="primary">打印</el-button>
      <el-button type="info" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSalaryRule, editSalaryRule } from "_o/api/salary/salary";
import { addOrUpdateQrcodeInfo } from "_o/api/salary/qrCode";
import {
  validateValidTime,
  validatePercent,

  validateAmount,

  deleteEmptyProps,
  sortByProperty,
  getMonthLastDay
} from "_o/common/common";
import { cityListByAll, queryCitiesWithAgent } from "_o/api/salary/common";
import { parseTime } from "@/libs/util";

const currentPath = "/performancePage";
const validateObj = { success: true, msg: "" };
export default {
  props: {
    isEdit: { type: Boolean, required: false, default: false },
    title: { type: String, required: false },
    editVisible: { type: Boolean, required: false },
    editForm: {
      type: Object, required: false, default: {
        ruleName: "",
        cityUuid: "",
        businessType: "",
        beginTime: "",
        endTime: ""
      }
    },
    ruleDataList: {
      type: Array, required: false, default: []
    },
    afterResetCheckBox: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      pickerOptions: {
        firstDayOfWeek: 1
      },
      ruleInputVisible: false,
      flowRewardVisible: false,
      ruleCheck: "0",
      flowRewardruleCheck: "0",
      saving: false,
      hasQrCode: false,
      businessType: 1,
      agents: [],
      cities: [],
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        cityUuid: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        beginTime: [
          { validator: this.validateValidTime, trigger: "change" },
          { validator: this.validateValidTime, trigger: "blur" }
        ],
        endTime: [
          { validator: this.validateValidTime, trigger: "change" },
          { validator: this.validateValidTime, trigger: "blur" }
        ],
      },

      noNeedPropNames: ["createTime", "creator", "updateTime", "updater"],
      detailRules: [],

      validateData: {
        p1: [{ success: true, msg: "" }],
        p2: [{ success: true, msg: "" }],
        p3: [{ success: true, msg: "" }],
        p4: [{ success: true, msg: "" }]
      },
      p1Visible: true,
      p2Visible: true,
      p3Visible: true,
      p4Visible: true,

      // 等级工资
      ladderItem: {
        typeCode: "IDE_WK_REWARD",
        sortNum: 0,
        ruleDataList: [
          {
            typeCode: "IDE_WK_REWARD",
            elementCode: "IDE_WK_REWARD_FLOW",
            elementName: "到账流水区间",
            elementValue1: "",
            elementValue2: "",
            elementValue3: "",
            objectType: "奖励到账流水",
            objectValue: "",
            rowNum: "1",
            sortOrder: 0,
            creator: ""
          }
        ]
      },
      // 流水抽成
      FlowpumpItem: {
        typeCode: "IDE_WK_CUT",
        sortNum: 1,
        ruleDataList: [
          {
            typeCode: "IDE_WK_CUT",
            elementCode: "IDE_WK_CUT_FOLLOW",
            elementName: "抽成奖励",
            elementValue1: "",
            elementValue2: "",
            elementValue3: "",
            objectType: "每单抽成奖励",
            objectValue: "",
            rowNum: "1",
            sortOrder: 0,
            creator: ""
          }
        ]
      }
    }
  },

  created() {
    if (this.isEdit) {
      let ladderCount = 0;
      this.ruleDataList.forEach(each => {
        switch (each.typeCode) {
          // 阶梯绩效奖励
          case "IDE_WK_REWARD":
            if (!this.ladderItem.ruleDataList[0].elementValue1 || !this.ladderItem.ruleDataList[0].objectValue) {
              this.ladderItem.ruleDataList = [];
            }
            this.ladderItem.ruleDataList.push(this.deleteNoNeedProps(each));
            ladderCount++;
            if (ladderCount > 0) {
              this.ruleCheck = "1";
              this.ruleInputVisible = true;
            }
            break;
          case "IDE_WK_CUT":
            if (!this.FlowpumpItem.ruleDataList[0].elementValue1) {
              this.FlowpumpItem.ruleDataList = [];
            }
            this.FlowpumpItem.ruleDataList.push(this.deleteNoNeedProps(each));
            this.flowRewardruleCheck = "1";
            this.flowRewardVisible = true;
        }
      });
      let i;
      for (i = 1; i < ladderCount; i++) {
        this.validateData.p1.push(validateObj);
        this.validateData.p2.push(validateObj);
        this.validateData.p3.push(validateObj);
      }
    }
    else {
      // console.log("this.validateData", this.validateData)
    }
    this.getCities();
  },
  methods: {
    // 弹框提示不允许删除
    alertUnableToMinus() {
      this.$alert("须至少存在一条数据，不允许删除此行");
    },
    checkChange(item, value) {
      switch (item) {
        case 1:
          this.ruleInputVisible = value === "1";
          break;
        case 2:
          this.flowRewardVisible = value === "1";
          break;
        default:
      }
    },
    validateValidTime(rule, value, callback) {
      // console.info(rule);
      let desc; let
        compareDate;
      if (rule.field === "beginTime") {
        desc = "起始";
        compareDate = new Date(this.editForm.endTime);
      }
      else {
        desc = "结束";
        compareDate = new Date(this.editForm.beginTime);
      }

      let inputDate = new Date(value);
      let now = new Date();
      if (!value) {
        return callback(new Error("请选择生效" + desc + "时间"));
      }
      else if (desc === "起始" && inputDate.getTime() > compareDate.getTime()) {
        return callback(new Error("起始周不能晚于结束周"));
      }
      else if (desc === "结束" && inputDate.getTime() < compareDate.getTime()) {
        return callback(new Error("结束周不能早于起始周"));
      }
      else {
        return callback();
      }
      // else if (inputDate.getTime() - 1000*60*60*24 + 1000*60*60*24*7 >= now.getTime()) {
      //   return callback();
      // } else {
      //   return callback(new Error('生效' + desc + '周不能早于当前周'));
      // }
    },
    // 细项规则校验
    ruleValidate(propName, index) {
      switch (propName) {
        case "P1":
          this.p1Validate(index);
          break;
        case "P2":
          this.p2Validate(index);
          break;
        case "P3":
          this.p3Validate(index);
          break;
        case "P4":
          this.p4Validate(index);
          break;
        default:
      }
    },
    p1Validate(index) {
      this.p1Visible = false;
      if (this.ruleCheck == "1") {
        this.validateData.p1[index] = validateAmount(this.ladderItem.ruleDataList[index].elementValue1);
        if (this.validateData.p1[index].success) {
          let e1 = Number(this.ladderItem.ruleDataList[index].elementValue1);
          let e2 = this.ladderItem.ruleDataList[index].elementValue2 ? Number(this.ladderItem.ruleDataList[index].elementValue2) : "";
          // console.log("===e1: %o, e2: %o", e1, e2);
          if (e2 && e1 > e2) {
            this.validateData.p1[index].success = false;
            this.validateData.p1[index].msg = "流水区间最小值不能大于最大值";
          }
          else {
            for (let x in this.ladderItem.ruleDataList) {
              // console.log("-=-=this.ladderItem.ruleDataList[x].elementValue1: %o", Number(this.ladderItem.ruleDataList[x].elementValue1));
              // console.log("-=-=this.ladderItem.ruleDataList[x].elementValue2: %o", Number(this.ladderItem.ruleDataList[x].elementValue2));
              if (x != index && Number(this.ladderItem.ruleDataList[x].elementValue1) < e1 && Number(this.ladderItem.ruleDataList[x].elementValue2) > e1) {
                this.validateData.p1[index].success = false;
                this.validateData.p1[index].msg = "其他流水区间已包含当前输入值";
                break;
              }
            }
          }
        }
      }
      else {
        this.validateData.p1[index] = { success: true, msg: "" };
      }
      this.p1Visible = true;
    },
    p2Validate(index) {
      this.p2Visible = false;
      if (this.ruleCheck == "1") {
        this.validateData.p2[index] = validateAmount(this.ladderItem.ruleDataList[index].elementValue2);
        if (this.validateData.p2[index].success) {
          let e1 = this.ladderItem.ruleDataList[index].elementValue1 ? Number(this.ladderItem.ruleDataList[index].elementValue1) : "";
          let e2 = this.ladderItem.ruleDataList[index].elementValue2 ? Number(this.ladderItem.ruleDataList[index].elementValue2) : "";
          if (e1 && e1 > e2) {
            this.validateData.p2[index].success = false;
            this.validateData.p2[index].msg = "流水区间最大值不能小于最小值";
          }
          else {
            for (let x in this.ladderItem.ruleDataList) {
              if (x != index && Number(this.ladderItem.ruleDataList[x].elementValue1) < e2 && Number(this.ladderItem.ruleDataList[x].elementValue2) > e2) {
                this.validateData.p2[index].success = false;
                this.validateData.p2[index].msg = "其他流水区间已包含当前输入值";
                break;
              }
            }
          }
        }
      }
      else {
        this.validateData.p2[index] = { success: true, msg: "" };
      }
      this.p2Visible = true;
    },
    p3Validate(index) {
      this.p3Visible = false;
      if (this.ruleCheck == "1") {
        this.validateData.p3[index] = validatePercent(this.ladderItem.ruleDataList[index].objectValue);
      }
      else {
        this.validateData.p3[index] = { success: true, msg: "" };
      }
      this.p3Visible = true;
    },
    p4Validate(index) {
      this.p4Visible = false;
      if (this.flowRewardruleCheck == "1") {
        this.validateData.p4[index] = validatePercent(this.FlowpumpItem.ruleDataList[index].objectValue);
      } else {
        this.validateData.p4[index] = { success: true, msg: "" };
      }
      this.p4Visible = true;
    },
    // 处理规则增加
    handlePlus() {
      this.ladderItem.ruleDataList.push({
        typeCode: "IDE_WK_REWARD",
        elementCode: "IDE_WK_REWARD_FLOW",
        elementName: "到账流水区间",
        elementValue1: "",
        elementValue2: "",
        elementValue3: "",
        objectType: "奖励到账流水",
        objectValue: "",
        rowNum: "1",
        sortOrder: 0,
        creator: ""
      });
      this.validateData.p1.push(validateObj);
      this.validateData.p2.push(validateObj);
      this.validateData.p3.push(validateObj);
    },
    // 处理规则减少
    handleMinus(index) {
      this.ladderItem.ruleDataList.splice(index, 1);
      this.validateData.p1.splice(index, 1);
      this.validateData.p2.splice(index, 1);
      this.validateData.p3.splice(index, 1);
    },
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    setCityName(val) {
      for (let idx in this.cities) {
        if (val == this.cities[idx].orgCode) {
          this.editForm.cityName = this.cities[idx].orgName;
        }
      }
    },
    validateBeforeSave() {
      let i; let
        flag = true;
      for (i = 0; i < this.validateData.p1.length; i++) {
        this.p1Validate(i);
        this.p2Validate(i);
        this.p3Validate(i);
      }
      for (let i in this.validateData.p1) {
        if (!this.validateData.p1[i].success || !this.validateData.p2[i].success || !this.validateData.p3[i].success) {
          flag = false;
          break;
        }
      }
      this.p4Validate(0);
      for (i = 0; i < this.validateData.p4.length; i++) {
        this.p4Validate(i);
      }
      for (let i in this.validateData.p4) {
        if (!this.validateData.p4[i].success) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    // 规则保存前对传输的细项数据进行处理
    handleBeforeSave() {
      this.ladderItem.ruleDataList = sortByProperty(this.ladderItem.ruleDataList, "elementValue1");
      for (let i in this.ladderItem.ruleDataList) {
        this.ladderItem.ruleDataList[i].sortOrder = i;
      }
    },
    // 保存规则
    save() {
      let salaryRuleDetailDto = [];
      if (this.ruleCheck == "1") {
        this.handleBeforeSave();
        salaryRuleDetailDto.push(this.ladderItem);
      }
      if (this.flowRewardruleCheck == "1") {
        salaryRuleDetailDto.push(this.FlowpumpItem);
      }
      let flag = this.validateBeforeSave();
      this.$refs["editForm"].validate((valid) => {
        if (new Date(this.editForm.beginTime).getTime() > new Date(this.editForm.endTime).getTime()) {
          this.$alert("生效起始时间不能晚于生效结束时间");
        }
        else if (valid && flag) {
          if (typeof this.editForm.beginTime === "string") {
            this.editForm.beginTime = this.editForm.beginTime.substr(0, 10);
          }
          else {
            this.editForm.beginTime = parseTime(new Date(this.editForm.beginTime.getTime() - 1000 * 60 * 60 * 24), "{y}-{m}-{d}");
          }
          if (typeof this.editForm.endTime === "string") {
            this.editForm.endTime = this.editForm.endTime.substr(0, 10);
          }
          else {
            this.editForm.endTime = parseTime(new Date(this.editForm.endTime.getTime() + 1000 * 60 * 60 * 24 * 5), "{y}-{m}-{d}");
          }
          let salaryRuleDto = JSON.parse(JSON.stringify(this.editForm));
          salaryRuleDto.salaryType = 1;
          this.saving = true;
          if (this.isEdit) {
            editSalaryRule({
              salaryRuleDto: salaryRuleDto,
              salaryRuleDetailDto: {
                rulesList: salaryRuleDetailDto
              }
            })
              .then(res => {
                // console.log("====add rule res: %o", res)
                if (res.data.success) {
                  this.$emit("successHandle");
                }
                else {
                  this.saving = false;
                  this.$alert(res.data.msg);
                }
              })
              .catch(error => {
                this.saving = false;
                // console.error("====add rule error: %o", error)
                this.$alert("规则修改失败，请稍后重试");
              })
          }
          else {
            let params = {
              salaryRuleDto: salaryRuleDto,
              salaryRuleDetailDto: {
                rulesList: salaryRuleDetailDto
              }
            }
            addSalaryRule(params).then(res => {
              if (res.data.success) {
                this.$emit("successHandle");
              } else {
                this.saving = false;
                this.$alert(res.data.msg);
              }
            })
              .catch(error => {
                this.saving = false;
                this.$alert("规则新增失败，请稍后重试");
              })
          }
        }
      });
    },
    getCities() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.cities.length === 0) {
            this.$alert("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      }).catch(err => {
        this.$alert("获取数据信息失败，请刷新页面重试")
      })
    },
    // 业务线包车专享显示每单流水抽成
    getBusinessType(value) {
      this.businessType = value;
    },
    // 清除不需要的属性
    deleteNoNeedProps(form) {
      for (let propName in form) {
        if (form.hasOwnProperty(propName) && this.noNeedPropNames.indexOf(propName) > -1) {
          delete form[propName];
        }
      }
      return form;
    },
  }
}
</script>

<style scoped>
  .button-group {
    margin: 20px 15px;
  }

  .button-group button {
    margin: 0 15px;
  }

  /*  .button-group-mini-plus button {
      margin: 5px 0 5px 20px;
    }*/

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 93%;
    margin: 5px 30px;
  }

  .bold-span {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
  }

  .check-text {
    margin-left: 25px;
    font-size: 11px;
    color: gray;
  }
</style>
