<template>
  <el-dialog id="baseWageItem" :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="editVisible" width="80%" @close="closeDialog">
    <!-- 基本 -->
    <el-form v-if="editForm" ref="editForm" :inline="true" :rules="rules" :model="editForm" size="small" label-width="130px" label-position="left">
      <el-row style="margin: 5px 30px;">
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
          <el-form-item label="生效起始月份" prop="validBeginTime">
            <el-date-picker v-model="editForm.validBeginTime" type="month" placeholder="起始月份" :picker-options="pickerOptions" value-format="yyyy-MM-dd" :clearable="true" style="width: 200px" :disabled="isEdit" @change="getDriverExamineList"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束月份" prop="validEndTime">
            <el-date-picker v-model="editForm.validEndTime" type="month" placeholder="结束月份" :picker-options="pickerOptions" value-format="yyyy-MM-dd" :clearable="true" style="width: 200px" :disabled="isEdit" @change="getDriverExamineList(1)"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营模式" prop="operationType">
            <el-select v-model="editForm.operationType" placeholder="运营模式" :disabled="isEdit">
              <el-option label="自营司机" :value="1"></el-option>
              <el-option label="UP司机" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品线" prop="businessType">
            <el-select v-model="editForm.businessType" placeholder="产品线" :disabled="isEdit">
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
              <el-option label="惠享" :value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机工资类别" prop="driverTag">
            <el-select v-model="editForm.driverTag" placeholder="司机工资类别" class="win-300" :disabled="isEdit" @change="queryAttendanceRules">
              <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.itemvalue" :value="item.itemcode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="cityCode">
            <el-select v-model="editForm.cityCode" placeholder="城市" filterable :disabled="isEdit" @change="setCityName">
              <el-option v-for="(cityObj, index) in cities" :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="司机档案所属区县">
          <el-select v-model="editForm.countryCode" @change="setCountryName" placeholder="司机档案所属区县" style="width: 200px" filterable :disabled="isEdit">
            <template v-for="(areaObj, index) in areaList">
              <el-option :key="index" :label="areaObj.orgName" :value="areaObj.orgCode"></el-option>
            </template>
          </el-select>
        </el-form-item> -->
        <!-- <el-col :span="12">
          <el-form-item label="是否区分运营商" prop="appointAgent">
            <el-radio-group v-model="editForm.appointAgent">
              <el-radio :label="0" :disabled="isEdit">否</el-radio>
              <el-radio :label="1" :disabled="isEdit">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
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
      <el-row style="width: 93%;margin: 5px 30px;">
        <template>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="考勤工资" name="attendanceSalary"></el-tab-pane>
            <el-tab-pane label="工龄工资" name="workSalary"></el-tab-pane>
            <el-tab-pane label="等级工资" name="levelSalary"></el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
    </el-form>
    <!-- 考勤工资 -->
    <el-form v-if="attendanceForm" ref="attendanceForm" :inline="true" :rules="attendanceRules" :model="attendanceForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'attendanceSalary'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-checkbox v-model="attendanceCheck" true-label="1" false-label="0" @change="checkChange(1, attendanceCheck)">考勤工资(考勤数据根据考勤系统设置规则)</el-checkbox>
          </div>
          <div v-show="!attendanceVisible">
            <div class="check-text">(勾选后,考勤工资生效)</div>
          </div>
          <div v-show="attendanceVisible">
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">工资规则:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="月考勤工资" label-width="100px" size="mini" prop="dutySalary">
                      <el-input v-model="attendanceForm.dutySalary" placeholder="金额" class="text-width"></el-input>&nbsp;元
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="日薪标准" label-width="100px" size="mini" prop="dailyWageStandard">
                      <el-input v-model="attendanceForm.dailyWageStandard" placeholder="金额" class="text-width"></el-input>&nbsp;元
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="每天缺勤扣减标准" label-width="140px" size="mini" prop="absenceDeductStandard">
                      <el-input v-model="attendanceForm.absenceDeductStandard" placeholder="金额" class="text-width"></el-input>&nbsp;元
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">扣款场景:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="旷工扣款" label-width="100px" size="mini" prop="absentDeduct">
                      <el-input v-model="attendanceForm.absentDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="事假扣款" label-width="100px" size="mini" prop="casualLeaveDeduct">
                      <el-input v-model="attendanceForm.casualLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时长未达标扣款" label-width="140px" size="mini" prop="dutyAbnormalDeduct">
                      <el-input v-model="attendanceForm.dutyAbnormalDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="病假扣款" label-width="100px" size="mini" prop="sickLeaveDeduct">
                      <el-input v-model="attendanceForm.sickLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="婚假扣款" label-width="100px" size="mini" prop="marriageLeaveDeduct">
                      <el-input v-model="attendanceForm.marriageLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="丧假扣款" label-width="140px" size="mini" prop="funeralLeaveDeduct">
                      <el-input v-model="attendanceForm.funeralLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="陪产假扣款" label-width="100px" size="mini" prop="parentalLeaveDeduct">
                      <el-input v-model="attendanceForm.parentalLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="产假扣款" label-width="100px" size="mini" prop="maternityLeaveDeduct">
                      <el-input v-model="attendanceForm.maternityLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工伤扣款" label-width="140px" size="mini" prop="injuryLeaveDeduct">
                      <el-input v-model="attendanceForm.injuryLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="年假扣款" label-width="100px" size="mini" prop="annualLeaveDeduct">
                      <el-input v-model="attendanceForm.annualLeaveDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="事故假扣款" label-width="100px" size="mini" prop="accidentDeduct">
                      <el-input v-model="attendanceForm.accidentDeduct" placeholder="百分比" class="text-width"></el-input>&nbsp;%
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-form>
    <!-- 工龄工资 -->
    <el-form v-if="workForm" ref="workForm" :inline="true" :rules="workRules" :model="workForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'workSalary'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-checkbox v-model="workCheck" true-label="1" false-label="0" @change="checkChange(2, workCheck)">工龄工资(根据司机档案中的入职年限)</el-checkbox>
          </div>
          <div v-show="!workVisible">
            <div class="check-text">(勾选后,工龄工资生效)</div>
            <br />
          </div>
          <div v-show="workVisible">
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">奖励规则:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="基础工龄工资" label-width="110px" size="mini" prop="basicSenioritySalary">
                      <el-input v-model="workForm.basicSenioritySalary" placeholder="金额" class="text-width"></el-input>&nbsp;元
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="每年递增标准" label-width="110px" size="mini" prop="seniorityGradSalary">
                      <el-input v-model="workForm.seniorityGradSalary" placeholder="金额" class="text-width"></el-input>&nbsp;元
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-form>
    <!-- 等级工资 -->
    <el-form v-if="levelForm" ref="levelForm" :inline="true" :model="levelForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'levelSalary'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-checkbox v-model="levelCheck" true-label="1" false-label="0" @change="checkChange(3, levelCheck)">等级工资(提取司机档案中的等级)</el-checkbox>
          </div>
          <div v-show="!levelVisible">
            <div class="check-text">(勾选后,等级工资生效)</div>
            <br />
          </div>
          <div v-show="levelVisible">
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">工资规则:</el-col>
              <el-col :span="22">
                <div v-for="(item, index) in levelForm.levelRuleDataList" :key="index">
                  <el-row class="box-text">
                    <el-col :span="8">
                      <el-form-item label="司机等级" size="mini" label-width="100px" :prop="'levelRuleDataList.' + index + '.driverLevel'" :rules="[
                        { required: true, message: '请输入司机等级' }
                      ]"
                      >
                        <el-select v-model="item.driverLevel" placeholder="司机等级" class="text-width">
                          <el-option label="初级" value="0"></el-option>
                          <el-option label="中级" value="1"></el-option>
                          <el-option label="高级" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="等级标准" size="mini" label-width="100px" :prop="'levelRuleDataList.' + index + '.levelValue'" :rules="[
                        { required: true, message: '请输入等级标准' },{ validator: validNumber, trigger: 'blur' }
                      ]"
                      >
                        <el-input v-model="item.levelValue" placeholder="金额" class="text-width"></el-input>&nbsp;元
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-button v-if="levelForm.levelRuleDataList.length > 1" type="info" size="mini" @click="handleMinus(1, index)">-</el-button>
                      <el-button v-else type="info" size="mini" @click="alertUnableToMinus">-</el-button>
                    </el-col>
                  </el-row>
                </div>
                <div class="button-group-mini-plus">
                  <el-row>
                    <el-col :offset="16">
                      <el-button v-if="levelForm.levelRuleDataList.length < 3" type="primary" size="mini" @click="handlePlus(1)">+</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          </div>
        </el-card>
      </el-row>
    </el-form>
    <div class="footer" style="width:93%;margin:5px 30px;display:flex;align-items:center;justify-content:space-between;">
      <div class="button-group" style="float:right">
        <el-button v-show="!saving" v-preventReClick="3000" type="primary" @click="save">保存</el-button>
        <!-- <el-button type="primary" v-print="'#baseWageItem'">打印</el-button> -->
        <el-button type="info" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryAttendanceRules,
  addSalaryRule,
  editSalaryRule
} from "_o/api/salary/salary";
import {
  validateValidTime,
  validatePercent,
  validateAmount,
  validateEmpty,
  deleteEmptyProps
} from "_o/common/common";
import { parseTime } from "@/libs/util";
import {
  queryCitiesWithJurisdiction,
  queryCitiesWithAgent,
  getDicItemByDicCode,
  getAreaInfoByCode
} from "_o/api/salary/common";
export default {
  name: "BaseWageEdit",
  props: {
    isEdit: { type: Boolean, required: false, default: false },
    title: { type: String, required: false },
    editVisible: { type: Boolean, required: false },
    editForm: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    attendanceForm: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    workForm: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    levelForm: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      driverTypeList: [], // 司机工资类别
      activeName: "attendanceSalary", // 初始化显示考勤工资
      cities: [],
      areaList: [],
      operatorList: [],
      indeterminate: false,
      checkAll: false,
      attendanceCheck: "0",
      workCheck: "0",
      levelCheck: "0",
      ruleCityUuid: "",
      attendanceVisible: false, // 是否显示考勤工资内容
      workVisible: false, // 是否显示工龄工资内容
      levelVisible: false, // 是否显示等级工资内容
      saving: false,
      pickerOptions: {
        disabledDate: time => {
          return this.disabledDateFn(time);
        }
      },
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        agentList: [
          { required: !this.isEdit, message: "选择城市后请选择运营商", trigger: "change" }
        ],
        // appointAgent: [
        //   { required: true, message: "请选择是否区分运营商", trigger: "change" }
        // ],
        businessType: [
          { required: true, message: "请选择产品类型", trigger: "change" }
        ],
        driverTag: [
          { required: true, message: "请选择司机类别", trigger: "change" }
        ],
        validBeginTime: [
          { required: true, message: "请选择生效起始月份", trigger: "change" }
        ],
        validEndTime: [
          { required: true, message: "请选择生效结束月份", trigger: "change" }
        ],
        operationType: [
          { required: true, message: "请选择运营模式", trigger: "change" }
        ]
      },
      attendanceRules: {
        dutySalary: [
          { required: true, message: "请输入月考勤工资", trigger: "blur" },
          { validator: this.validNumber, trigger: "blur" }
        ],
        dailyWageStandard: [
          { required: true, message: "请输入日薪标准", trigger: "blur" },
          { validator: this.validKeepTwo, trigger: "blur" }
        ],
        absenceDeductStandard: [
          {
            required: true,
            message: "请输入每天缺勤扣减标准",
            trigger: "blur"
          },
          { validator: this.validKeepTwo, trigger: "blur" }
        ],
        absentDeduct: [
          { required: true, message: "请输入旷工扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        casualLeaveDeduct: [
          { required: true, message: "请输入事假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        dutyAbnormalDeduct: [
          { required: true, message: "请输入时长未达标扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        sickLeaveDeduct: [
          { required: true, message: "请输入病假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        marriageLeaveDeduct: [
          { required: true, message: "请输入婚假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        funeralLeaveDeduct: [
          { required: true, message: "请输入丧假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        parentalLeaveDeduct: [
          { required: true, message: "请输入陪产假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        maternityLeaveDeduct: [
          { required: true, message: "请输入产假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        injuryLeaveDeduct: [
          { required: true, message: "请输入工伤扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        annualLeaveDeduct: [
          { required: true, message: "请输入年假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ],
        accidentDeduct: [
          { required: true, message: "请输入事故假扣款", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ]
      },
      workRules: {
        basicSenioritySalary: [
          { required: true, message: "请输入基础工龄工资", trigger: "blur" },
          { validator: this.validNumber, trigger: "blur" }
        ],
        seniorityGradSalary: [
          { required: true, message: "请输入每年递增标准", trigger: "blur" },
          { validator: this.validNumber, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getCities();
    this.getDicItemByDicCode();
    this.initSararyData();
    if (this.isEdit) {
      this.getAreaInfoByCode(this.editForm.cityCode);
    }
  },
  methods: {
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
    // 通过hash判别数组是否有重复元素
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },
    // 大于0的任意整数
    validNumber(rule, val, callback) {
      let reg = /(^[1-9]{1}[0-9]*$)/;
      if (!reg.test(val)) {
        callback(new Error("请输入大于0的数,最大5位整数"));
      } else if (!val || val > 99999) {
        callback(new Error("请输入大于0的数,最大5位整数"));
      } else {
        callback();
      }
    },
    // 大于0得任意整数且保留两位小数
    validKeepTwo(rule, val, callback) {
      let reg = /^(0\.\d{0,1}[1-9]|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/;
      if (!reg.test(val)) {
        callback(new Error("请输入大于0的数,最大5位整数,可保留2位小数"));
      } else if (!val || val > 99999.99) {
        callback(new Error("请输入大于0的数,最大5位整数,可保留2位小数"));
      } else {
        callback();
      }
    },
    // 大于等于0的任意整数
    validPercent(rule, val, callback) {
      let reg = /(^[0-9]{1}[0-9]*$)/;
      if (!reg.test(val)) {
        callback(new Error("限制输入最大3位整数"));
      } else if (!val || val > 999) {
        callback(new Error("限制输入最大3位整数"));
      } else {
        callback();
      }
    },
    disabledDateFn(time) {
      let date = new Date();
      // Thu Dec 26 2019 17:14:41 GMT+0800 (中国标准时间)
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24;
      return times < Date.now();
    },
    // 司机工资类别
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        this.driverTypeList = res.data.data;
      });
    },
    queryAttendanceRules() {
      if (this.editForm.cityCode && this.editForm.driverTag) {
        queryAttendanceRules({ cityCode: this.editForm.cityCode, driverTag: this.editForm.driverTag }).then(res => {
          if (res.data.success) {
            if (res.data.data == null) {
              this.$alert("运营后台-营运管理-考勤管理,月考勤规则-未配置该月份的考勤规则,需进行配置后再添加基本工资规则");
            }
          }
        });
      }
    },
    getDriverExamineList(type) {
      if (type == 1) {
        this.getCurrentMonthLast(this.editForm.validEndTime);
      }
      let params = {};
      if (
        this.editForm.cityCode &&
        this.editForm.validBeginTime &&
        this.editForm.validEndTime
      ) {
        params = this.timeSpan(
          this.editForm.validBeginTime,
          this.editForm.validEndTime
        );
        if (params.timeFlag) {
          this.$message.warning("生效起始月份与生效结束月份最大跨度为10年");
          return;
        }
      }
    },
    // 判断时间跨度不允许超过10年
    timeSpan(validBeginTime = "", validEndTime = "") {
      let timeFlag = false;
      let startMonth = "";
      let endMonth = "";
      if (validBeginTime && validEndTime) {
        // 获取月份差值
        let yearVal =
          Number(validEndTime.substr(0, 4)) -
          Number(validBeginTime.substr(0, 4));
        let monthVal =
          Number(validEndTime.substr(5, 2)) -
          Number(validBeginTime.substr(5, 2));
        startMonth = validBeginTime.substr(0, 4) + validBeginTime.substr(5, 2);
        endMonth = validEndTime.substr(0, 4) + validEndTime.substr(5, 2);
        if (yearVal * 12 + monthVal > 120) {
          timeFlag = true;
        }
      }
      return { timeFlag: timeFlag, startMonth: startMonth, endMonth: endMonth };
    },
    // 获取当月最后一天
    getCurrentMonthLast(value) {
      let date = new Date(value);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = new Date(year, month, 0);
      this.editForm.validEndTime = year + "-" + month + "-" + day.getDate();
    },
    checkChange(item, value) {
      switch (item) {
        case 1:
          this.attendanceVisible = value === "1";
          break;
        case 2:
          this.workVisible = value === "1";
          break;
        case 3:
          this.levelVisible = value === "1";
          break;
        default:
      }
    },
    closeDialog() {
      this.$emit("closeDialogHandle", "edit");
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
    // 根据城市从运营后台查询考勤规则数据
    setCityName(val) {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            this.$message.warning("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
            for (let idx in this.cities) {
              if (val == this.cities[idx].orgCode) {
                this.editForm.cityCode = this.cities[idx].orgCode;
                this.editForm.cityName = this.cities[idx].orgName;
                this.ruleCityUuid = this.cities[idx].uuid;
              }
            }
            this.queryAttendanceRules();
            this.getAreaInfoByCode(val);
          }
        }
      });
      this.editForm.agentList = []
      this.operatorList = [];
      this.editForm.countryCode = "";
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
    setCountryName(val) {
      for (let idx in this.areaList) {
        if (val == this.areaList[idx].orgCode) {
          this.editForm.countryCode = this.areaList[idx].orgCode;
          this.editForm.countryName = this.areaList[idx].orgName;
        }
      }
    },
    // 保存规则
    save() {
      let params = {};
      let timeParams = this.timeSpan(
        this.editForm.validBeginTime,
        this.editForm.validEndTime
      );
      let saveFlag = true;
      // 基本表单校验
      if (this.editVisible) {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.editForm));
            delete this.editForm.id;
            this.editForm.ruleId = data.id ? data.id : data.ruleId;
            this.editForm.ruleType = 1;
            params = this.editForm;
          } else {
            saveFlag = false;
          }
        });
        // 考勤工资-月考勤工资需大于每天缺勤扣减标准
        if (
          this.attendanceForm.dutySalary &&
          this.attendanceForm.absenceDeductStandard &&
          Number(this.attendanceForm.dutySalary) <
          Number(this.attendanceForm.absenceDeductStandard)
        ) {
          this.$message.warning("月考勤工资需大于每天缺勤扣减标准");
          saveFlag = false;
        }
      }

      if (this.attendanceVisible) {
        // 考勤工资校验
        this.$refs["attendanceForm"].validate(valid => {
          if (valid) {
            params = { ...this.attendanceForm, ...params };
          } else {
            saveFlag = false;
          }
        });
      }
      // 工龄工资校验
      if (this.workVisible) {
        this.$refs["workForm"].validate(valid => {
          if (valid) {
            params = { ...this.workForm, ...params };
          } else {
            saveFlag = false;
          }
        });
      }
      // 等级工资校验
      if (this.levelVisible) {
        this.$refs["levelForm"].validate(valid => {
          if (valid) {
            let levelData = {};
            this.levelForm.levelRuleDataList.forEach((item, index) => {
              if (item.driverLevel == "0") {
                levelData.junior_salary = item.levelValue;
              } else if (item.driverLevel == "1") {
                levelData.intermediate_salary = item.levelValue;
              } else if (item.driverLevel == "2") {
                levelData.senior_salary = item.levelValue;
              }
            });
            params = { ...levelData, ...params };
          } else {
            saveFlag = false;
          }
        });
        // 司机等级是否重复
        if (
          this.levelForm.levelRuleDataList.length &&
          this.isRepeat(this.getObjectKeys(this.levelForm.levelRuleDataList))
        ) {
          this.$message.warning("司机等级不能重复");
          saveFlag = false;
        }
      }
      // 生效时间跨度最大10年
      if (timeParams.timeFlag) {
        this.$message.warning("生效起始月份与生效结束月份最大跨度为10年");
        return;
      }
      if (
        new Date(this.editForm.validBeginTime).getTime() >
        new Date(this.editForm.validEndTime).getTime()
      ) {
        this.$message.warning("生效起始月份不能大于生效结束月份");
        return;
      }
      // if(this.editForm.appointAgent=== 0){
      //    this.editForm.agentList=[]
      // }
      if (this.isEdit) {
        const { agentInfoList, ...editParams } = params
        params = editParams
        this.editSalaryRule(deleteEmptyProps(params, ["appointAgent"]), saveFlag);
      } else {
        this.addSalaryRule(deleteEmptyProps(params, ["appointAgent"]), saveFlag);
      }
    },
    // 编辑
    editSalaryRule(params, saveFlag) {
      if (saveFlag) {
        editSalaryRule(params).then(res => {
          if (res.data.success) {
            this.$emit("successHandle");
          } else {
            this.saving = false;
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 新增
    addSalaryRule(params, saveFlag) {
      if (saveFlag) {
        addSalaryRule(params).then(res => {
          if (res.data.success) {
            this.$emit("successHandle");
          } else {
            this.saving = false;
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    getCities() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            this.$message.warning("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      });
    },
    // 获取key
    getObjectKeys(arr = []) {
      let keys = [];
      arr.forEach(item => {
        keys.push(item.driverLevel);
      });
      return keys;
    },
    // 删除一条
    handleMinus(itemValue, index = 0) {
      this.levelForm.levelRuleDataList.splice(index, 1);
    },
    // 新增一条
    handlePlus() {
      this.levelForm.levelRuleDataList.push({
        driverLevel: "",
        levelValue: ""
      });
    },
    // 弹框提示不允许删除
    alertUnableToMinus() {
      this.$message.warning("须至少存在一条数据，不允许删除此行");
    },
    initSararyData() {
      // 考勤工资是否有值
      if (this.attendanceForm.dutySalary) {
        this.attendanceCheck = "1";
        this.attendanceVisible = true;
      }
      // 工龄工资是否有值
      if (this.workForm.basicSenioritySalary) {
        this.workCheck = "1";
        this.workVisible = true;
      }
      // 等级工资是否有值
      if (
        this.levelForm.levelRuleDataList[0].driverLevel != "" &&
        this.levelForm.levelRuleDataList[0].levelValue != ""
      ) {
        this.levelCheck = "1";
        this.levelVisible = true;
      }
    }
  }
};
</script>

<style scoped>
.button-group {
  margin: 20px 0;
}
.button-group button {
  margin: 0 15px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 93%;
  margin: 5px 30px;
}
.check-text {
  margin-left: 25px;
  font-size: 11px;
  color: gray;
}
.box-text {
  margin: 0 0 5px 10px;
  color: #666666;
  line-height: 26px;
}
.mt-2 {
  margin-top: 2px;
}
.mb-10 {
  margin-bottom: 10px;
}
.text-width {
  width: 140px;
}
</style>
