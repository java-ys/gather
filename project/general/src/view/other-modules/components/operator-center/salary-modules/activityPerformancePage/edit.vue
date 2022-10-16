<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-23 15:32:34
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-15 15:37:36
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :visible="editVisible"
    width="75%"
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
      label-width="120px"
    >
      <el-row>
        <el-col v-if="isEdit && submitType == 2" :span="12">
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
          <el-form-item label="业务线" prop="businessType">
            <el-select
              v-model="editForm.businessType"
              :disabled="isEdit && submitType == 2"
              placeholder="业务线"
              class="win-300"
            >
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机类型" prop="operationType">
            <el-select v-model="editForm.operationType" placeholder="司机类型" :disabled="isEdit">
              <el-option label="自营司机" :value="1"></el-option>
              <el-option label="UP司机" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="12">
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
        <el-col :span="24">
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
          <el-tabs
            v-model="activeName"
            type="card"
            :before-leave="handleSwitch"
          >
            <!--<el-tab-pane label="活动绩效限制" name="performanceLimit">-->
            <!--<performance-Limit-->
            <!--:performanceLimitData="performanceLimitData"-->
            <!--:submitType="submitType"-->
            <!--:isEdit="isEdit"-->
            <!--:beginTime="editForm.validBeginTime"-->
            <!--:endTime="editForm.validEndTime"-->
            <!--ref="performanceLimit"-->
            <!--&gt;</performance-Limit>-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="日订单量达标奖励" name="orderQuantityAward">
              <orderQuantity-Award
                ref="orderQuantityAward"
                :orderAwardData="orderAwardData"
                :submitType="submitType"
                :beginTime="editForm.validBeginTime"
                :endTime="editForm.validEndTime"
                :isEdit="isEdit"
              ></orderQuantity-Award>
            </el-tab-pane>
            <el-tab-pane label="日流水达标固定奖励" name="floatWaterAward">
              <float-Water-Award
                ref="floatWaterAward"
                :floatWaterAwardData="floatWaterAwardData"
                :submitType="submitType"
                :beginTime="editForm.validBeginTime"
                :isEdit="isEdit"
                @handleChoose="handleChoose"
              ></float-Water-Award>
            </el-tab-pane>
            <el-tab-pane label="日流水达标抽成奖励" name="floatWaterDrawBonus">
              <float-Water-Draw-Bonus
                ref="floatWaterDrawBonus"
                :floatWaterDrawBonusData="floatWaterDrawBonusData"
                :submitType="submitType"
                :beginTime="editForm.validBeginTime"
                :isEdit="isEdit"
                @handleChoose="handleChoose"
              >
              </float-Water-Draw-Bonus>
            </el-tab-pane>
            <el-tab-pane label="高峰时段流水额外抽成奖励" name="royaltyAward">
              <royalty-Award
                ref="royaltyAward"
                :royaltyAwardData="royaltyAwardData"
                :submitType="submitType"
                :beginTime="editForm.validBeginTime"
                :isEdit="isEdit"
                @handleChoose="handleChoose"
              ></royalty-Award>
            </el-tab-pane>
            <!--<el-tab-pane label="流水时段固定奖励" name="fixedAward">-->
            <!--<fixed-Award-->
            <!--:fixedAwardData="fixedAwardData"-->
            <!--:submitType="submitType"-->
            <!--@handleChoose="handleChoose"-->
            <!--:beginTime="editForm.validBeginTime"-->
            <!--:isEdit="isEdit"-->
            <!--ref="fixedAward"-->
            <!--&gt;</fixed-Award>-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </template>
      </el-row>
    </el-form>
    <div
      class="footer"
      style="width:93%;margin:5px 30px;display:flex;display:inline-block"
    >
      <div class="button-group" style="float:right;">
        <el-button v-show="!saving" type="primary" @click="handleSave">保存</el-button>
        <!-- <el-button type="primary" v-print="'#baseWageItem'">打印</el-button> -->
        <el-button type="info" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { queryElectronicFenceInfo } from "_o/api/salary/salary";
import { rootData, objAssignment, deletePropId, isArray } from "./fields";
import {
  addActivityPerformance,
  updateActivityPerformance
} from "_o/api/salary/salaryRule";
import {
  queryCitiesWithJurisdiction,
  agentList,
  queryCitiesWithAgent,
  getDicItemByDicCode
} from "_o/api/salary/common";
import { parseTime } from "@/libs/util";
import performanceLimit from "./ruleEditTab/performanceLimit";
import orderQuantityAward from "./ruleEditTab/orderQuantityAward";
import floatWaterAward from "./ruleEditTab/floatWaterAward";
import royaltyAward from "./ruleEditTab/royaltyAward";
import fixedAward from "./ruleEditTab/fixedAward";
import floatWaterDrawBonus from "./ruleEditTab/floatWaterDrawBonus";
export default {
  name: "activityPerformancePageEdit",
  components: {
    performanceLimit,
    orderQuantityAward,
    floatWaterAward,
    royaltyAward,
    fixedAward,
    floatWaterDrawBonus
  },
  props: [
    "title",
    "isEdit",
    "submitType",
    "editVisible",
    "editForm",
    "performanceLimitData",
    "orderAwardData",
    "floatWaterAwardData",
    "royaltyAwardData",
    "fixedAwardData",
    "floatWaterDrawBonusData"
  ],
  data() {
    const validateValidTime = (rule, value, callback) => {
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
      }
      callback();
    };
    return {
      tempData: JSON.parse(JSON.stringify(rootData)),
      saving: false,
      saveFlag: true,
      activeName: "orderQuantityAward",
      beginTimeDesc: "",
      endTimeDesc: "",
      cities: [],
      operatorList: [],
      indeterminate: false,
      checkAll: false,
      driverTypeList: [],
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
          { required: true, message: "请选择司机类型", trigger: "change" }
        ],
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        driverTag: [
          { required: true, message: "请选择司机类别", trigger: "change" }
        ],
        validBeginTime: [{ validator: validateValidTime, trigger: "blur" }],
        validEndTime: [{ validator: validateValidTime, trigger: "blur" }]
      }
    };
  },
  watch: {
    "editForm.validBeginTime": {
      handler(newVal, oldVal) {
        if (newVal) {
          let D; let begin; let
            end;
          D = new Date(newVal);
          if (Object.prototype.toString.call(newVal) == "[object String]") {
            begin = parseTime(newVal, "{y}-{m}-{d}");
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
        this.$nextTick(() => {
          const arr = [
            { label: "日订单量达标奖励", value: "orderQuantityAward" },
            { label: "日流水达标固定奖励", value: "floatWaterAward" },
            { label: "日流水达标抽成奖励", value: "floatWaterDrawBonus" },
            { label: "高峰时段流水额外抽成奖励", value: "royaltyAward" },
            // { label: "流水时段固定奖励", value: "fixedAward" }
          ];
          let list = arr.filter(item => {
            return (
              item.value !== this.activeName &&
              this.$refs[item.value].limitCheck == "1"
            );
          });
          if (
            newVal !== oldVal &&
            list.length > 0 &&
            this.submitType !== 2 &&
            Object.prototype.toString.call(newVal) == "[object Date]"
          ) {
            let msg = "";
            list.forEach(item => {
              this.$refs[item.value].limitCheck = "0";
              msg += "," + item.label;
            });
            this.$alert(`由于生效起始周改变${msg}的生效日期需重新设置！`);
          }
        });
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
            end = parseTime(val, "{y}-{m}-{d}");
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
    disabledDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24 * day;
      return times < Date.now();
    },
    salaryDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24 * day;
      return times > Date.now();
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
        if (!(time <= 6)) {
          this.$message({
            message: "结束周只可与开始周一致",
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
        if (!(time <= 6)) {
          this.$message({
            message: "结束周只可与开始周一致",
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
      // this.getElectronicFenceInfo();
      this.editForm.agentList = []
      this.operatorList = []
      this.checkAll = false
      this.indeterminate = false
      queryCitiesWithAgent({ cityCode: val }).then(res => {
        if (!res.data.success) { this.$message.warning("获取城市运营商失败"); }
        else
        // this.operatorList =  [ { name: '全部', uuid: '0' }, ...res.data.data.agentInfoVos ]
        { this.operatorList = [...res.data.data.agentInfoVos] }
      })
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
      if (this.editForm.cityUuid && this.editForm.businessType) {
        queryElectronicFenceInfo({
          cityCode: this.editForm.cityUuid,
          serviceType: this.editForm.businessType,
          status: "1"
        })
          .then(res => {
            if (res.data.success && res.data.data) {
              if (res.data.data.length === 0) {
                this.$alert("当前所选城市业务线不存在电子围栏数据，如需添加流水抽成奖励规则，请重新选择城市和业务线，或者联系运营商添加相关数据");
                this.flowDrawEachItem.forEach((each, i) => {
                  this.flowDrawEachItem[i].areaArr = [];
                });
                this.electronicFences = [];

                this.noFlowDrawEachItem.forEach((each, i) => {
                  this.noFlowDrawEachItem[i].areaArr = [];
                });
                this.noElectronicFences = [];
              } else {
                this.electronicFences = res.data.data;
                this.noElectronicFences = res.data.data;
                this.flowDrawEachItem.forEach((each, i) => {
                  let __arr;
                  try {
                    __arr = each.areaStr
                      .replace(/undefined/g, "")
                      .split(",")
                      .filter(item => item);
                  } catch (error) {
                    __arr = [];
                  }
                  this.flowDrawEachItem[i].areaArr = [];
                  this.electronicFences.forEach(fence => {
                    if (__arr.includes(fence.uuid)) {
                      this.flowDrawEachItem[i].areaArr.push({
                        check: true,
                        data: fence.name,
                        uuid: fence.uuid
                      });
                    } else {
                      this.flowDrawEachItem[i].areaArr.push({
                        check: false,
                        data: fence.name,
                        uuid: fence.uuid
                      });
                    }
                  });
                });

                this.noElectronicFences = res.data.data;
                this.noFlowDrawEachItem.forEach((each, i) => {
                  let __arr;
                  try {
                    __arr = each.areaStr
                      .replace(/undefined/g, "")
                      .split(",")
                      .filter(item => item);
                  } catch (error) {
                    __arr = [];
                  }
                  this.noFlowDrawEachItem[i].areaArr = [];
                  this.noElectronicFences.forEach(fence => {
                    if (__arr.includes(fence.uuid)) {
                      this.noFlowDrawEachItem[i].areaArr.push({
                        check: true,
                        data: fence.name,
                        uuid: fence.uuid
                      });
                    } else {
                      this.noFlowDrawEachItem[i].areaArr.push({
                        check: false,
                        data: fence.name,
                        uuid: fence.uuid
                      });
                    }
                  });
                });
              }
            } else {
              this.$alert(res.data.msg);
            }
          })
          .catch(error => {});
      }
    },
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    handleSave() {
      this.$refs.editForm.validate(async valid => {
        await this.handleBeforeSave();
        if (valid && this.saveFlag) {
          let queryForm;
          queryForm = objAssignment(this.editForm, this.tempData);
          if (!this.isEdit || this.submitType == 3) {
            for (let i in queryForm) {
              if (isArray(queryForm[i])) {
                queryForm[i] = deletePropId(queryForm[i]);
              }
            }
            if (this.submitType == 3) {
              delete queryForm.incentiveLimitCfgVo.ruleId;
              delete queryForm.incentiveLimitCfgVo.id;
            }
            delete queryForm.baseRulesReqVo.ruleId;
            addActivityPerformance(queryForm).then(res => {
              if (res.data.success) {
                this.$emit("successHandle");
              } else {
                this.$alert(res.data.msg);
              }
            });
          } else {
            updateActivityPerformance(queryForm).then(res => {
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
    async handleBeforeSave() {
      this.editForm.baseRulesReqVo = {};
      this.editForm.baseRulesReqVo.businessType = this.editForm.businessType;
      this.editForm.baseRulesReqVo.cityCode = this.editForm.cityCode;
      this.editForm.baseRulesReqVo.cityName = this.editForm.cityName;
      this.editForm.baseRulesReqVo.driverTag = this.editForm.driverTag;
      this.editForm.baseRulesReqVo.ruleName = this.editForm.ruleName;
      this.editForm.baseRulesReqVo.operationType = this.editForm.operationType;
      this.editForm.baseRulesReqVo.agentList = this.editForm.agentList;
      if (
        Object.prototype.toString.call(this.editForm.validBeginTime) ==
        "[object Date]"
      ) {
        this.editForm.baseRulesReqVo.validBeginTime = parseTime(
          new Date(this.editForm.validBeginTime.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        this.editForm.baseRulesReqVo.validEndTime = parseTime(
          new Date(this.editForm.validEndTime.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
      } else {
        this.editForm.baseRulesReqVo.validBeginTime = parseTime(
          this.editForm.validBeginTime,
          "{y}-{m}-{d}"
        );
        this.editForm.baseRulesReqVo.validEndTime = parseTime(
          this.editForm.validEndTime,
          "{y}-{m}-{d}"
        );
      }
      this.editForm.baseRulesReqVo.ruleId = this.editForm.id;
      this.editForm.baseRulesReqVo.statisticCycle = "2";
      this.editForm.baseRulesReqVo.ruleType = "3";
      if (this.$refs[this.activeName].showForm) {
        this.saveFlag = this.$refs[this.activeName].ruleValidate();
      } else {
        this.saveFlag = true;
      }
      // if (this.$refs.performanceLimit.showForm) {
      //   this.$refs.performanceLimit.ruleValidate();
      //   this.editForm.incentiveLimitCfgVo = JSON.parse(
      //     JSON.stringify(this.store.get("performanceLimitRule"))
      //   );
      // } else {
      //   this.editForm.incentiveLimitCfgVo = {};
      // }
      if (this.$refs.orderQuantityAward.showForm) {
        this.$refs.orderQuantityAward.ruleValidate();
        this.editForm.performanceTargetList = (JSON.parse(localStorage.getItem("orderQuantityData")) || {}).ruleList;
      } else {
        this.editForm.performanceTargetList = [];
      }
      if (this.$refs.floatWaterAward.showForm) {
        this.$refs.floatWaterAward.ruleValidate();
        this.editForm.orderWaterList = JSON.parse(localStorage.getItem("floatWaterData") || {}).ruleList;
      } else {
        this.editForm.orderWaterList = [];
      }
      if (this.$refs.floatWaterDrawBonus.showForm) {
        this.$refs.floatWaterDrawBonus.ruleValidate();
        this.editForm.rewardForDailyTurnoverList = (JSON.parse(localStorage.getItem("floatWaterDrawData")) || {}).ruleList;
      } else {
        this.editForm.rewardForDailyTurnoverList = [];
      }
      if (this.$refs.royaltyAward.showForm) {
        this.$refs.royaltyAward.ruleValidate();
        this.editForm.specialPeriodRuleCommissionList = (JSON.parse(localStorage.getItem("royaltyAwardData")) || {}).ruleList;
      } else {
        this.editForm.specialPeriodRuleCommissionList = [];
      }
      // if (this.$refs.fixedAward.showForm) {
      //   this.$refs.fixedAward.ruleValidate();
      //   this.editForm.specialPeriodRuleFixedList = JSON.parse(
      //     JSON.stringify(this.store.get("fixedAwardData").ruleList)
      //   );
      // } else {
      //   this.editForm.specialPeriodRuleFixedList = [];
      // }
    },
    handleSwitch(newVal, oldVal) {
      // if (newVal == "floatWaterDrawBonus" && oldVal == "floatWaterAward" || newVal == "floatWaterAward" && oldVal == "floatWaterDrawBonus") {
      //   this.$message.warning("日流水达标固定奖励与日流水达标抽成奖励同一奖励周期内仅能二选一");
      //   return false;
      // }
      return this.$refs[oldVal].ruleValidate();
    },
    handleChoose(val) {
      if (val == "floatWaterAward") {
        this.$refs.floatWaterAward.limitCheck = "1";
        this.$refs.floatWaterAward.showForm = true;
        if (this.$refs.floatWaterDrawBonus.showForm) {
          this.$confirm(
            "日流水达标固定奖励与日流水达标抽成奖励同一奖励周期内仅能二选一",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: "warning"
            }
          )
            .then(() => {
              this.$refs.floatWaterAward.limitCheck = "1";
              this.$refs.floatWaterAward.showForm = true;
              this.$refs.floatWaterDrawBonus.limitCheck = "0";
              this.$refs.floatWaterDrawBonus.showForm = false;
            })
            .catch(() => {
              this.$refs.floatWaterAward.limitCheck = "0";
            });
        } else {
          this.$refs.floatWaterAward.limitCheck = "1";
          this.$refs.floatWaterAward.showForm = true;
        }
      }
      if (val == "floatWaterDrawBonus") {
        this.$refs.floatWaterDrawBonus.limitCheck = "1";
        this.$refs.floatWaterDrawBonus.showForm = true;
        if (this.$refs.floatWaterAward.showForm) {
          this.$confirm(
            "日流水达标固定奖励与日流水达标抽成奖励同一奖励周期内仅能二选一",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: "warning"
            }
          )
            .then(() => {
              this.$refs.floatWaterDrawBonus.limitCheck = "1";
              this.$refs.floatWaterDrawBonus.showForm = true;
              this.$refs.floatWaterAward.limitCheck = "0";
              this.$refs.floatWaterAward.showForm = false;
            })
            .catch(() => {
              this.$refs.floatWaterDrawBonus.limitCheck = "0";
            });
        } else {
          this.$refs.floatWaterDrawBonus.limitCheck = "1";
          this.$refs.floatWaterDrawBonus.showForm = true;
        }
      }
      // if (val == "royaltyAward") { // 抽成奖励
      // this.$refs.royaltyAward.limitCheck = "1";
      // this.$refs.royaltyAward.showForm = true;
      // if (this.$refs.fixedAward.showForm) {
      //   this.$confirm(
      //     "流水时段抽成奖励和阶梯绩效固定奖励只能设置一个，确定要设置抽成奖励吗？",
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
      //       this.$refs.royaltyAward.limitCheck = "1";
      //       this.$refs.royaltyAward.showForm = true;
      //       this.$refs.fixedAward.limitCheck = "0";
      //       this.$refs.fixedAward.showForm = false;
      //     })
      //     .catch(() => {
      //       this.$refs.royaltyAward.limitCheck = "0";
      //     });
      // } else {
      //   this.$refs.royaltyAward.limitCheck = "1";
      //   this.$refs.royaltyAward.showForm = true;
      // }
      // }
      // if (val == "fixedAward") { // 固定奖励
      //   if (this.$refs.royaltyAward.showForm) {
      //     this.$confirm(
      //       "流水时段抽成奖励和阶梯绩效固定奖励只能设置一个，确定要设置固定奖励吗？",
      //       "提示",
      //       {
      //         confirmButtonText: "确定",
      //         cancelButtonText: "取消",
      //         closeOnClickModal: false,
      //         closeOnPressEscape: false,
      //         type: "warning"
      //       }
      //     )
      //       .then(() => {
      //         this.$refs.fixedAward.limitCheck = "1";
      //         this.$refs.fixedAward.showForm = true;
      //         this.$refs.royaltyAward.limitCheck = "0";
      //         this.$refs.royaltyAward.showForm = false;
      //       })
      //       .catch(() => {
      //         this.$refs.fixedAward.limitCheck = "0";
      //       });
      //   } else {
      //     this.$refs.fixedAward.limitCheck = "1";
      //     this.$refs.fixedAward.showForm = true;
      //   }
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.win-300 {
  width: 300px;
}
</style>
