<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-24 14:32:34
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-15 18:00:33
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :visible="editVisible"
    width="70%"
    @close="closeDialog"
  >
    <el-form
      id="baseWageItem"
      ref="editForm"
      :inline="true"
      :model="editForm"
      :rules="rules"
      class="demo-form-inline"
      size="small"
      label-width="140px"
    >
      <el-row>
        <el-col :span="24">
          <span style="color:red;margin-left:50px">备注：(司乘定价解耦的城市生效时间须与司机定价策略生效时间保持一致；其他城市正常配置)</span>
        </el-col>
        <el-col v-if="submitType == 2" :span="12">
          <el-form-item label="规则代码">
            <el-input
              v-model="editForm.ruleCode"
              placeholder="规则代码"
              readonly="readonly"
              class="win-300"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input
              v-model="editForm.ruleName"
              placeholder="规则名称"
              maxlength="16"
              class="win-300"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效起始周" prop="validBeginTime">
            <el-date-picker
              v-model="editForm.validBeginTime"
              style="width: 300px;"
              :disabled="isEdit && submitType == 2"
              type="week"
              :clearable="false"
              placeholder="选择生效起始周"
              :format="'yyyy年第WW周(' + beginTimeDesc + ')'"
              :picker-options="pickerOptions"
              @blur="beginTimeBlurchange"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束周" prop="validEndTime">
            <el-date-picker
              v-model="editForm.validEndTime"
              style="width: 300px;"
              :disabled="isEdit && submitType == 2"
              :clearable="false"
              type="week"
              placeholder="选择生效结束周"
              :format="'yyyy年第WW周(' + endTimeDesc + ')'"
              :picker-options="pickerOptions"
              @blur="endTimeBlurchange"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营模式" prop="operationType">
            <el-select v-model="editForm.operationType" placeholder="运营模式" style="width: 300px;" :disabled="isEdit">
              <el-option label="自营司机" :value="1"></el-option>
              <el-option label="UP司机" :value="2"></el-option>
              <!-- <el-option label="巡网出租车" :value="3"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品线" prop="businessType">
            <el-select
              v-model="editForm.businessType"
              :disabled="isEdit && submitType == 2"
              placeholder="产品线"
              class="win-300"
            >
              <el-option label="出租车" :value="1"></el-option>
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
              <el-option label="惠享" :value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="editForm.operationType === 2" :span="12">
          <el-form-item label="业务线" prop="businessLines">
            <el-select
              v-model="editForm.businessLines"
              :disabled="isEdit && submitType === 2"
              multiple
              placeholder="业务线"
              class="win-300"
              @change="v => { mutexValid(v,'businessLines') }"
            >
              <el-option label="全部" :value="allValue"></el-option>
              <el-option v-for="business in businessLineOptions" :key="business.value" :label="business.label" :value="business.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit && submitType === 1" :span="12">
          <el-form-item label="司机工资类别" prop="driverTagList">
            <el-select
              v-model="editForm.driverTagList"
              placeholder="司机工资类别"
              multiple
              class="win-300"
            >
              <el-option
                v-for="(item, index) in driverTypeList"
                :key="index"
                :label="item.itemvalue"
                :value="item.itemcode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="司机工资类别" prop="driverTag">
            <el-select
              v-model="editForm.driverTag"
              placeholder="司机工资类别"
              :disabled="isEdit && submitType == 2"
              class="win-300"
            >
              <el-option
                v-for="(item, index) in driverTypeList"
                :key="index"
                :label="item.itemvalue"
                :value="item.itemcode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="cityCode">
            <el-select
              v-model="editForm.cityCode"
              :disabled="isEdit && submitType == 2"
              placeholder="城市"
              filterable
              class="win-300"
              @change="setCityName"
            >
              <template v-for="(cityObj, index) in cities">
                <el-option
                  :label="cityObj.orgName"
                  :value="cityObj.orgCode"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="司机档案所属区县">
            <el-select v-model="editForm.countryCode" @change="setCountryName" multiple placeholder="司机档案所属区县" style="width: 300px" filterable :disabled="isEdit">
              <template v-for="(areaObj, index) in areaList">
                <el-option :key="index" :label="areaObj.orgName" :value="areaObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col>
          <el-form-item label="订单类型" prop="orderTypes">
            <el-checkbox-group v-model="editForm.orderTypes">
              <el-checkbox v-for="order in orderList" :key="order.value" :label="order.value" :disabled="order.disabled">{{order.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit" :span="12">
          <el-form-item label="是否区分运营商" prop="appointAgent">
            <el-radio-group v-model="editForm.appointAgent">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1" :disabled="isEdit">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="editForm.appointAgent === 1 && !isEdit || isEdit" :span="12">
          <el-form-item label="运营商" prop="agentList">
            <template v-if="!isEdit">
              <el-select v-model="editForm.agentList" placeholder="运营商" multiple :disabled="isEdit || !editForm.cityCode" style="width: 300px" @change="handleOperator">
                <el-option v-for="(operator, index) in operatorList" :key="operator.uuid" :label="operator.name" :value="operator.uuid"></el-option>
              </el-select>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="indeterminate"
                :disabled="isEdit || !editForm.cityCode"
                @change="toggleAllOperator"
              >全选</el-checkbox>
            </template>
            <template v-else>
              <span v-for="(agent, index) in editForm.agentInfoList" :key="agent.agentUuid">{{agent.agentName}} {{(index === editForm.agentInfoList.length - 1) ? '' : ','}} </span>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col v-if="editForm.operationType === 2" :span="12">-->
      <!--          <el-form-item label="展示预估流水分成" prop="predictRevenue">-->
      <!--            <el-radio-group v-model="editForm.predictRevenue">-->
      <!--              <el-radio :label="0">否</el-radio>-->
      <!--              <el-radio :label="1">是</el-radio>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row style="width: 93%;margin: 5px 30px;">
        <template>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="基本流水抽成奖励" name="royaltyAward"></el-tab-pane>
            <el-tab-pane label="基本流水固定奖励" name="fixedAward"></el-tab-pane>
            <!--<el-tab-pane label="阶梯绩效固定奖励" name="fixedAward">-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </template>
      </el-row>
      <!-- 基本流水抽成 -->
      <el-row v-show="activeName == 'royaltyAward'" style="width: 93%;margin: 5px 30px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <el-col :span="3" style="margin-top: 5px">
                <el-checkbox
                  v-if="activeName == 'royaltyAward'"
                  v-model="royaltyCheck"
                  true-label="1"
                  false-label="0"
                  @change="handleChange"
                >基本流水抽成
                  <span style="color:red;margin-left:50px">说明：司乘定价解耦的城市抽成比例100%，其他城市按照实际情况设置</span>
                </el-checkbox>
              </el-col>
            </span>
          </div>
          <template v-if="!showForm">
            <span class="check-text">(勾选后，基本流水抽成奖励生效)</span><br />
          </template>
          <template v-else>
            <el-row>
              <el-col :span="14">
                <el-form-item
                  label="订单流水周期："
                  size="mini"
                  prop="statPeriod"
                >
                  <template>
                    <el-radio-group v-model="editForm.statPeriod">
                      <el-radio :label="3" disabled>日流水</el-radio>
                      <el-radio :label="2">周流水</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName == 'royaltyAward'" :span="8">
                <el-form-item
                  label="奖励上限"
                  size="mini"
                  label-width="100px"
                  prop="upperThreshold"
                >
                  <el-input
                    v-model="editForm.upperThreshold"
                    placeholder="元"
                    style="width: 80px"
                  ></el-input><span>&nbsp;元</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <span style="margin-left: 2px;color: #606266;font-weight: bold">奖励规则：</span>
              </el-col>
            </el-row>
            <el-row v-if="isShow">
              <div
                v-for="(item, index) in editForm.rulesList"
                :key="index"
                class="text item"
              >
                <el-row style="margin-top:10px">
                  <el-col :span="10" :offset="1">
                    <span
                      style="line-height: 1.9; font-weight: bold;margin-right:10px"
                    >规则{{index + 1}}</span>
                    <el-form-item
                      label="订单流水区间"
                      size="mini"
                      label-width="110px"
                      :prop="'rulesList.' + index + '.orderIntervalStart'"
                      :rules="{
                        validator: validateZeroAmount,
                        trigger: 'blur'
                      }"
                    >
                      <el-input
                        v-model="item.orderIntervalStart"
                        placeholder="元"
                        style="width: 80px"
                        @blur="
                          handleStart(
                            item.orderIntervalStart,
                            item.orderIntervalEnd,
                            index
                          )
                        "
                      ></el-input><span>&nbsp;元</span>
                    </el-form-item>
                    <el-form-item
                      label=" - "
                      size="mini"
                      label-width="16px"
                      :prop="'rulesList.' + index + '.orderIntervalEnd'"
                      :rules="{
                        validator: validateZeroAmount,
                        trigger: 'blur'
                      }"
                    >
                      <el-input
                        v-model="item.orderIntervalEnd"
                        placeholder="元"
                        style="width: 80px"
                        @blur="
                          handleEnd(
                            item.orderIntervalEnd,
                            item.orderIntervalStart,
                            index
                          )
                        "
                      ></el-input><span>&nbsp;元</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      label="奖励订单流水"
                      size="mini"
                      :prop="'rulesList.' + index + '.rewardValue'"
                      :rules="{ validator: validatePercent, trigger: 'blur' }"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        placeholder="百分比"
                        style="width: 80px"
                      ></el-input><span>&nbsp;%</span>
                    </el-form-item>
                    <!-- <el-form-item
                      v-else
                      label="奖励金额"
                      size="mini"
                      :prop="'rulesList.' + index + '.rewardValue'"
                      :rules="{ validator: validateIntAmount, trigger: 'blur' }"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        style="width: 80px"
                      ></el-input
                      ><span>&nbsp;元</span>
                    </el-form-item> -->
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="info"
                      size="mini"
                      @click="handleMinus(editForm.rulesList, index)"
                    >-
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-row>

            <div class="button-group-mini-plus">
              <el-row>
                <el-col :span="20"> &nbsp; </el-col>
                <el-col :span="2">
                  <el-button type="primary" size="mini" @click="handlePlus(editForm.rulesList)">
                    +
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-card>
      </el-row>

      <!-- 基本流水固定奖励 -->
      <el-row v-show="activeName == 'fixedAward'" style="width: 93%;margin: 5px 30px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <el-col :span="3" style="margin-top: 5px">
                <el-checkbox
                  v-if="activeName == 'fixedAward'"
                  v-model="fixedCheck"
                  true-label="1"
                  false-label="0"
                  @change="handleChange"
                >基本流水固定奖励
                </el-checkbox>
              </el-col>
            </span>
          </div>
          <template v-if="!showFixForm">
            <span class="check-text">(勾选后，基本流水固定奖励生效)</span><br />
          </template>
          <template v-else>
            <el-row>
              <el-col :span="14">
                <el-form-item
                  label="订单流水周期："
                  size="mini"
                  prop="statPeriod"
                >
                  <template>
                    <el-radio-group v-model="editForm.statPeriod">
                      <el-radio :label="3" disabled>日流水</el-radio>
                      <el-radio :label="2">周流水</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <span style="margin-left: 2px;color: #606266;font-weight: bold">奖励规则：</span>
              </el-col>
            </el-row>
            <el-row v-if="isShow">
              <div
                v-for="(item, index) in editForm.fixedRewardRulesList"
                :key="index"
                class="text item"
              >
                <el-row style="margin-top:10px">
                  <el-col :span="10" :offset="1">
                    <span
                      style="line-height: 1.9; font-weight: bold;margin-right:10px"
                    >规则{{index + 1}}:</span>
                    <el-form-item
                      label="周流水>="
                      size="mini"
                      label-width="110px"
                    >
                    </el-form-item>
                    <el-form-item
                      label=""
                      size="mini"
                      label-width="16px"
                      :prop="'fixedRewardRulesList.' + index + '.orderIntervalStart'"
                      :rules="{
                        validator: validateIntAmount,
                        trigger: 'blur'
                      }"
                    >
                      <el-input
                        v-model="item.orderIntervalStart"
                        placeholder="元"
                        style="width: 80px"
                      ></el-input><span>&nbsp;元</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      label="奖励金额"
                      size="mini"
                      :prop="'fixedRewardRulesList.' + index + '.rewardValue'"
                      :rules="{ validator: validateIntAmount, trigger: 'blur' }"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        placeholder="元"
                        style="width: 80px"
                      ></el-input><span>&nbsp;元</span>
                    </el-form-item>
                    <!-- <el-form-item
                      v-else
                      label="奖励金额"
                      size="mini"
                      :prop="'fixedRewardRulesList.' + index + '.rewardValue'"
                      :rules="{ validator: validateIntAmount, trigger: 'blur' }"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        style="width: 80px"
                      ></el-input
                      ><span>&nbsp;元</span>
                    </el-form-item> -->
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="info"
                      size="mini"
                      @click="handleMinus(editForm.fixedRewardRulesList, index)"
                    >-
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-row>
            <div class="button-group-mini-plus">
              <el-row>
                <el-col :span="20"> &nbsp; </el-col>
                <el-col :span="2">
                  <el-button type="primary" size="mini" @click="handlePlus(editForm.fixedRewardRulesList)">
                    +
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-card>
      </el-row>
    </el-form>
    <div
      class="footer"
      style="width:93%;margin:5px 30px;display:flex;display:inline-block"
    >
      <div class="button-group" style="float:right;">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <!-- <el-button type="primary" v-print="'#baseWageItem'">打印</el-button> -->
        <el-button type="info" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  validatePercent,
  validateIntAmount,
  validateZeroAmount,
} from "_o/common/salaryMixin";
import { deleteEmptyProps } from "_o/common/common";
import { queryElectronicFenceInfo } from "_o/api/salary/salary";
import { addStepPerformance, updateStepPerformance } from "_o/api/salary/salaryRule";
import {
  queryCitiesWithAgent,
  getDicItemByDicCode,
  getAreaInfoByCode
} from "_o/api/salary/common";
import { parseTime } from "@/libs/util";
import { rootData, objAssignment, orderList, businessLineOptions } from "./fields";
export default {
  name: "StepPerformancePageEdit",
  props: [
    "isEdit",
    "submitType",
    "title",
    "editVisible",
    "editFormData",
    "rulesList",
    "fixedRewardRulesList"
  ],
  data() {
    return {
      tempData: JSON.parse(JSON.stringify(rootData)),
      validateIntAmount,
      validateZeroAmount,
      validatePercent,
      orderList,
      businessLineOptions,
      allValue: 0,
      editForm: {
        businessLines: [],
        businessType: "",
        cityCode: "",
        cityName: "",
        countryCode: [],
        countryName: [],
        appointAgent: 0,
        // predictRevenue: 1,
        commissionMode: "",
        driverTagList: [],
        driverTag: "",
        ruleName: "",
        ruleType: "",
        operationType: "",
        agentList: [],
        orderTypes: [0],
        rulesList: [
          {
            orderIntervalEnd: "",
            orderIntervalStart: "",
            rewardValue: ""
          }
        ],
        fixedRewardRulesList: [
          {
            orderIntervalEnd: "",
            orderIntervalStart: "",
            rewardValue: ""
          }
        ],
        statPeriod: 2,
        upperThreshold: "",
        validBeginTime: "",
        validEndTime: ""
      },
      // activeName: "",
      royaltyCheck: "0",
      fixedCheck: "0",
      isShow: true,
      showForm: false,
      showFixForm: false,
      activeName: "royaltyAward",
      beginTimeDesc: "",
      endTimeDesc: "",
      cities: [],
      operatorList: [],
      agentList: [],
      indeterminate: false,
      checkAll: false,
      driverTypeList: [],
      areaList: [],
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return this.disabledDateFn(time);
        }
      },
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        agentList: [
          { required: !this.isEdit, message: "选择城市后请选择运营商", trigger: "change" }
        ],
        operationType: [
          { required: true, message: "请选择运营模式", trigger: "change" }
        ],
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        appointAgent: [
          { required: true, message: "请选择是否区分运营商", trigger: "change" }
        ],
        // predictRevenue: [
        //   { required: true, message: "请选择展示预估流水分成", trigger: "change" }
        // ],
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        businessLines: [
          { required: true, message: "请选择业务线", trigger: "change" }
        ],
        driverTagList: [
          { required: true, message: "请选择司机类别", trigger: "change" }
        ],
        orderTypes: [
          { required: true, message: "请选择订单类型", trigger: "change" }
        ],
        driverTag: [
          { required: true, message: "请选择司机类别", trigger: "change" }
        ],
        upperThreshold: [{ validator: validateIntAmount, trigger: "blur" }],
        validBeginTime: [
          { validator: this.validateValidTime, trigger: "blur" }
        ],
        statPeriod: [
          { required: true, message: "请选择订单流水周期", trigger: "blur" }
        ],
        validEndTime: [{ validator: this.validateValidTime, trigger: "blur" }]
      }
    };
  },
  watch: {
    activeName: {
      handler(val) {
        if (val == "royaltyAward") {
          if (this.royaltyCheck == "0") this.showForm = false;
          if (this.royaltyCheck == "1") this.showForm = true;
        }
        if (val == "fixedAward") {
          if (this.fixedCheck == "0") this.showFixForm = false;
          if (this.fixedCheck == "1") this.showFixForm = true;
        }
      },
      immediate: true
    },
    "editForm.validBeginTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            // begin = parseTime(val, "{y}-{m}-{d}");
            begin = parseTime(
              new Date(D.getTime()),
              "{y}-{m}-{d}",
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.beginTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    },
    "editForm.validEndTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            // end = parseTime(val, "{y}-{m}-{d}");
            end = parseTime(
              new Date(D.getTime()),
              "{y}-{m}-{d}",
            );
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.endTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    }
  },
  created() {
    this.getDicItem();
    this.getCities();
    this.setRuleType();
  },
  mounted() {
    if (this.isEdit) {
      this.getAreaInfoByCode(this.editForm.cityCode);
    }
  },
  methods: {
    // 城市切换时触发，全国所有城市和其他互斥
    mutexValid(val, key) {
      const length = val.length;
      if (val[length - 1] === this.allValue) {
        this.$set(this.editForm, key, [this.allValue]);
      } else {
        val.forEach((v, k) => {
          if (v === this.allValue) val.splice(k, 1);
        });
        this.$set(this.editForm, key, val);
      }
    },
    setCountryName(val) {
      this.editForm.countryName = [];
      val.forEach(it => {
        this.areaList.forEach(ie => {
          if (it === ie.orgCode) {
            this.editForm.countryName.push(ie.orgName)
          }
        })
      })
    },
    toggleAllOperator() {
      this.indeterminate = false;
      if (this.editForm.agentList.length === this.operatorList.length) {
        this.editForm.agentList = []
        this.checkAll = false
      } else {
        this.editForm.agentList = this.operatorList.map(item => item.uuid)
        this.checkAll = true
      }
    },
    handleOperator(val) {
      if (val.length === this.operatorList.length) {
        this.checkAll = true
        this.indeterminate = false
      } else if (0 < val.length && val.length < this.operatorList.length) {
        this.checkAll = false
        this.indeterminate = true
      } else if (val.length === 0) {
        this.checkAll = false
        this.indeterminate = false
      }
    },
    setRuleType() {
      if (this.isEdit || this.submitType !== 1) {
        this.editForm = JSON.parse(JSON.stringify(this.editFormData));
        // this.editForm.driverTagList = [this.editForm.driverTag];
        this.editForm.rulesList = this.rulesList;
        this.editForm.fixedRewardRulesList = this.fixedRewardRulesList;
      }
      if (this.editForm.commissionMode && this.editForm.commissionMode == 1) {
        this.activeName = "royaltyAward";
        this.royaltyCheck = "1";
        this.showForm = true;
      } else if (
        this.editForm.commissionMode &&
        this.editForm.commissionMode == 2
      ) {
        this.activeName = "fixedAward";
        this.fixedCheck = "1";
        this.showFixForm = true;
      } else if (this.editForm.commissionMode && this.editForm.commissionMode == 3) {
        this.activeName = "fixedAward";
        this.fixedCheck = "1";
        this.activeName = "royaltyAward";
        this.royaltyCheck = "1";
        this.showForm = true;
        this.showFixForm = true;
      }
    },
    disabledDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24 * day;
      return times < Date.now();
    },
    beginTimeBlurchange() {
      this.isSubmitStart = true;
      if (this.editForm.validEndTime) {
        let end =
          (new Date(this.editForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间
        let begin =
          (new Date(this.editForm.validBeginTime).getTime() -
            1000 * 60 * 60 * 24) /
          1000; // 开始时间
        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 139)) {
          this.$message({
            message: "最多选择20周跨度",
            type: "warning"
          });
          this.beginTimeDesc = "";
          this.editForm.validBeginTime = "";
        }
      }
    },
    endTimeBlurchange() {
      this.isSubmitEnd = true;
      if (this.editForm.validBeginTime) {
        let begin;
        if (this.isEdit) {
          begin = new Date(this.editForm.validBeginTime).getTime() / 1000; // 开始时间
        } else {
          begin =
            (new Date(this.editForm.validBeginTime).getTime() -
              1000 * 60 * 60 * 24) /
            1000; // 开始时间
        }
        let end =
          (new Date(this.editForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间

        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 139)) {
          this.$message({
            message: "最多选择20周跨度",
            type: "warning"
          });
          this.endTimeDesc = "";
          this.editForm.validEndTime = "";
        }
      }
    },
    setCityName(val) {
      for (let idx in this.cities) {
        if (val == this.cities[idx].orgCode) {
          this.editForm.cityName = this.cities[idx].orgName;
        }
      }
      this.getAreaInfoByCode(val);
      // this.getElectronicFenceInfo();
      this.editForm.agentList = []
      this.operatorList = []
      this.editForm.countryCode = [];
      this.areaList = [];
      this.checkAll = false
      this.indeterminate = false
      queryCitiesWithAgent({ cityCode: val }).then(res => {
        if (!res.data.success) { this.$message.warning("获取城市运营商失败"); }
        else
        // this.operatorList =  [ { name: '全部', uuid: '0' }, ...res.data.data.agentInfoVos ]
        { this.operatorList = [...res.data.data.agentInfoVos] }
      })
    },
    getAreaInfoByCode(val) {
      getAreaInfoByCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          this.areaList = res.data.data;
        }
      });
    },
    getCities() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.$alert("获取开通城市数据信息失败，请刷新页面重试");
            } else {
              this.cities = res.data.data.cities;
              this.trailCities = res.data.data.cities;
              this.ladderFormList = res.data.data.cities;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    },
    getDicItem() {
      getDicItemByDicCode().then(res => {
        this.driverTypeList = res.data.data;
      });
    },
    getElectronicFenceInfo() {
      if (this.editForm.cityCode && this.editForm.businessType) {
        queryElectronicFenceInfo({
          cityCode: this.editForm.cityCode,
          serviceType: this.editForm.businessType,
          status: "1"
        }).then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.$alert("当前所选城市业务线不存在电子围栏数据，如需添加流水抽成奖励规则，请重新选择城市和业务线，或者联系运营商添加相关数据");
            }
          } else {
            this.$alert(res.data.msg);
          }
        });
      }
    },
    validateValidTime(rule, value, callback) {
      let desc; let
        compareDate;
      if (rule.field === "validBeginTime") {
        desc = "起始";
        compareDate = new Date(this.editForm.validEndTime);
      } else {
        desc = "结束";
        compareDate = new Date(this.editForm.validBeginTime);
      }

      let inputDate = new Date(value);
      let now = new Date();
      if (!value) {
        return callback(new Error("请选择生效" + desc + "时间"));
      } else if (
        desc === "起始" &&
        inputDate.getTime() > compareDate.getTime()
      ) {
        return callback(new Error("起始周不能晚于结束周"));
      } else if (
        desc === "结束" &&
        inputDate.getTime() < compareDate.getTime()
      ) {
        return callback(new Error("结束周不能早于起始周"));
      } else {
        return callback();
      }
    },
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    handleSave() {
      let queryForm = {};
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.royaltyCheck == "1") this.editForm.commissionMode = 1;
          if (this.fixedCheck == "1") this.editForm.commissionMode = 2;
          // if (this.fixedCheck == "1") {
          //   this.editForm.commissionMode = 2;
          //   this.editForm.upperThreshold = "";
          // }
          this.editForm.ruleType = 2;
          if (
            Object.prototype.toString.call(this.editForm.validBeginTime) ==
            "[object Date]"
          ) {
            this.editForm.validBeginTime = parseTime(
              new Date(this.editForm.validBeginTime.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            this.editForm.validEndTime = parseTime(
              new Date(this.editForm.validEndTime.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          } else {
            this.editForm.validBeginTime = parseTime(
              new Date(this.editForm.validBeginTime).getTime(),
              "{y}-{m}-{d}"
            );
            this.editForm.validEndTime = parseTime(
              new Date(this.editForm.validEndTime).getTime(),
              "{y}-{m}-{d}"
            );
          }
          if (this.editForm.appointAgent === 0) {
            this.editForm.agentList = []
          }
          if (this.isEdit) {
            this.editForm.ruleId = this.editForm.id;
          }
          queryForm = objAssignment(this.editForm, this.tempData);
          queryForm = deleteEmptyProps(queryForm, ["appointAgent"]);
          // queryForm.predictRevenue = queryForm.operationType === 1 ? 0 : queryForm.predictRevenue;
          queryForm.countryCode = queryForm.countryCode.join(",");
          queryForm.countryName = queryForm.countryName.join(",");
          if (!this.showForm) {
            queryForm.rulesList = [];
          }
          if (!this.showFixForm) {
            queryForm.fixedRewardRulesList = [];
          }
          if (this.isEdit) {
            updateStepPerformance(queryForm).then(res => {
              if (res.data.success) {
                this.$emit("successHandle");
              } else {
                this.$alert(res.data.msg);
              }
            });
          } else {
            addStepPerformance(queryForm).then(res => {
              if (res.data.success) {
                this.$emit("successHandle");
              } else {
                this.$alert(res.data.msg);
              }
            });
          }
        }
      });
    },
    handleChange(val) {
      switch (this.activeName) {
        case "royaltyAward":
          if (val == "1") {
            this.showForm = true;
          } else {
            this.showForm = false;
          }
          // if (this.fixedCheck == "1" && this.royaltyCheck == "1") {
          //   this.$confirm(
          //     "阶梯绩效抽成奖励和阶梯绩效固定奖励只能设置一个，确定要设置抽成奖励吗？",
          //     "提示",
          //     {
          //       confirmButtonText: "确定",
          //       cancelButtonText: "取消",
          //       closeOnClickModal: false,
          //       closeOnPressEscape: false,
          //       type: "warning"
          //     }
          //   )
          //     .then(() => {
          //       this.showForm = true;
          //       this.fixedCheck = "0";
          //     })
          //     .catch(() => {
          //       this.royaltyCheck = "0";
          //     });
          // } else {
          //   if (val == "1") {
          //     this.showForm = true;
          //   } else {
          //     this.showForm = false;
          //   }
          // }
          break;
        case "fixedAward":
          if (val == "1") {
            this.showFixForm = true;
          } else {
            this.showFixForm = false;
          }
          // if (this.royaltyCheck == "1" && this.fixedCheck == "1") {
          //   this.showForm = false;
          //   this.$confirm(
          //     "阶梯绩效抽成奖励和阶梯绩效固定奖励只能设置一个，确定要设置固定奖励吗？",
          //     "提示",
          //     {
          //       confirmButtonText: "确定",
          //       cancelButtonText: "取消",
          //       closeOnClickModal: false,
          //       closeOnPressEscape: false,
          //       type: "warning"
          //     }
          //   )
          //     .then(() => {
          //       this.showForm = true;
          //       this.royaltyCheck = "0";
          //     })
          //     .catch(() => {
          //       this.fixedCheck = "0";
          //     });
          // } else {
          //   if (val == "1") {
          //     this.showForm = true;
          //   } else {
          //     this.showForm = false;
          //   }
          // }
          break;
      }
    },
    handlePlus(list) {
      if (list.length < 10) {
        this.isShow = false;
        list.push({
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        });
        this.$nextTick(() => {
          this.isShow = true;
        });
      } else {
        this.$alert("无法新增，最多创建10条规则！");
      }
    },
    handleMinus(list, index) {
      if (list.length > 1) {
        this.isShow = false;
        list.splice(index, 1);
        this.$nextTick(() => {
          this.isShow = true;
        });
      } else {
        this.$alert("须至少存在一条数据，不允许删除此行");
      }
    },
    handleStart(val, endVal, index) {
      let list;
      if (endVal && Number(val) >= endVal) {
        this.$alert("流水区间开始值需小于结束值");
        this.editForm.rulesList[index].orderIntervalStart = "";
      }
      if (this.editForm.rulesList.length > 1) {
        list = this.editForm.rulesList.filter((item, idx) => idx !== index);
        list.forEach(item => {
          if (
            (Number(val) !== 0 &&
              (Number(val) > item.orderIntervalStart &&
                Number(val) < item.orderIntervalEnd)) ||
            (endVal &&
              Number(val) !== 0 &&
              Number(endVal) > item.orderIntervalStart &&
              Number(val) <= item.orderIntervalStart)
          ) {
            this.$alert("流水区间不能重叠");
            this.editForm.rulesList[index].orderIntervalStart = "";
          }
        });
      }
    },
    handleEnd(val, startVal, index) {
      let list;
      if (startVal && val && Number(val) <= startVal) {
        this.$alert("流水区间结束值需大于结束值");
        this.editForm.rulesList[index].orderIntervalEnd = "";
      }
      if (this.editForm.rulesList.length > 1) {
        list = this.editForm.rulesList.filter((item, idx) => idx !== index);
        list.forEach(item => {
          if (
            (Number(val) !== 0 &&
              (Number(val) > item.orderIntervalStart &&
                Number(val) < item.orderIntervalEnd)) ||
            (startVal &&
              Number(val) > item.orderIntervalStart &&
              Number(startVal) < item.orderIntervalStart)
          ) {
            this.$alert("流水区间不能重叠");
            this.editForm.rulesList[index].orderIntervalEnd = "";
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.win-300 {
  width: 300px;
}
</style>
