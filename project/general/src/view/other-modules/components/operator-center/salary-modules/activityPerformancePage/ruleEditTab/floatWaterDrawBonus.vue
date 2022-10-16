<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-11-6 17:05:01
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-11-6 20:35:57
-->
<template>
  <div>
    <el-form ref="editForm" :model="formData" class="new-demo-ruleForm">
      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>
            <el-col :span="3" style="margin-top: 5px">
              <el-checkbox
                v-model="limitCheck"
                true-label="1"
                false-label="0"
                @change="handleChange"
              >日流水达标抽成奖励
              </el-checkbox>
            </el-col>
          </span>
        </div>
        <template v-if="!showForm">
          <span class="check-text">(勾选后，日流水达标抽成奖励生效)</span><br />
        </template>
        <template v-else>
          <el-card
            v-for="(item, index) in formData.ruleList"
            :key="index"
            style="margin-top: 10px"
          >
            <el-row>
              <el-col :span="22">
                <el-form-item label="生效日期：" size="mini" label-width="85px">
                  <el-select
                    v-model="item.dataTimeList"
                    multiple
                    :prop="'ruleList.' + index + '.dataTimeList'"
                    :rules="[{ required: true, message: '请选择生效日期' }]"
                    placeholder="请选择"
                    style="width:200px"
                  >
                    <el-option
                      v-for="it in dateList"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value"
                      :disabled="it.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="9">
                    <span
                      style="margin-left: 2px;color: #606266;font-weight: bold"
                    >奖励限制：自然日</span>
                  </el-col>
                </el-row>
                <el-row style="margin-top:15px">
                  <el-col :span="9">
                    <el-form-item
                      label="奖励规则：自然日订单流水达 "
                      label-width="200px"
                      size="mini"
                      :prop="'ruleList.' + index + '.lowerThreshold'"
                      :rules="[
                        { validator: validateIntAmount, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="item.lowerThreshold"
                        placeholder="元"
                        style="width: 100px"
                      ></el-input>
                      <span>&nbsp;元</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      label="奖励流水"
                      size="mini"
                      label-width="110px"
                      :prop="'ruleList.' + index + '.rewardValue'"
                      :rules="[
                        { validator: validatePercent, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        placeholder="百分比"
                        style="width: 100px"
                      ></el-input>
                      <span>&nbsp;%</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button
                  type="info"
                  size="mini"
                  style="margin-top:50%"
                  @click="handleMinus(index)"
                >移除
                </el-button>
              </el-col>
            </el-row>
          </el-card>
          <div
            class="button-group-mini-plus"
            style="margin-top:15px;text-align: right;"
          >
            <el-row>
              <el-button type="primary" size="mini" @click="handlePlus('copy')">
                &nbsp;复制上一条&nbsp;
              </el-button>
              <el-button type="primary" size="mini" @click="handlePlus('add')">
                &nbsp;新增&nbsp;
              </el-button>
            </el-row>
          </div>
        </template>
      </el-card>
    </el-form>
    <!-- </el-row> -->
  </div>
</template>
<script>
const listData = [
  {
    dataTimeList: [],
    incentiveType: "3",
    lowerThreshold: "",
    bonusAmount: ""
  }
];
import { parseTime } from "@/libs/util";
import {
  validateAmount,
  isEmptyObject,
  isEmptyArray,
  validatePercent,
  validateIntAmount
} from "_o/common/salaryMixin";
import { fullData } from "./fields";
export default {
  props: ["floatWaterDrawBonusData", "isEdit", "beginTime"],
  data() {
    return {
      validatePercent,
      validateIntAmount,
      limitCheck: "",
      validateAmount,
      showForm: false,
      formData: {
        ruleList: JSON.parse(JSON.stringify(listData))
      },
      dateList: [],
      pickList: []
    };
  },
  watch: {
    limitCheck: {
      handler(val) {
        if (val == "1") {
          this.showForm = true;
        } else {
          this.showForm = false;
        }
      },
      immediate: true
    },
    "formData.ruleList": {
      handler(val) {
        let list;
        list = [];
        this.pickList = [];
        val.forEach(item => {
          list = list.concat(item.dataTimeList);
        });
        this.pickList = [...new Set(list)];
      },
      immediate: true,
      deep: true
    },
    pickList: {
      handler(val) {
        this.dateList.forEach(item => {
          item.disabled = false;
        });
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.dateList.length; j++) {
            val[i] == this.dateList[j].value || val[i] == this.dateList[j].label
              ? (this.dateList[j].disabled = true)
              : "";
          }
        }
      },
      immediate: true,
      deep: true
    },
    beginTime: {
      handler(val) {
        val && this.setDates(val, this.isEdit);
      },
      immediate: true
    }
  },
  created() {
    this.checkStatus();
    this.setDataTimeList();
  },
  methods: {
    ruleValidate() {
      if (this.showForm) {
        let flag = false;
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let num = 0;
            this.formData.ruleList.forEach(item => {
              if (!item.dataTimeList.length) {
                num++;
              }
            });
            if (!num) {
              localStorage.setItem("floatWaterDrawData", JSON.stringify(this.formData));
              flag = true;
            } else {
              this.$alert("生效日期不能为空");
            }
          }
        });
        return flag;
      }
    },
    setDataTimeList() {
      if (this.isEdit && this.floatWaterDrawBonusData.length) {
        this.formData.ruleList.forEach(item => {
          let Y; let M; let D; let MD; let
            YMD;
          Y = new Date(item.dataTimeList[0]).getFullYear();
          M = new Date(item.dataTimeList[0]).getMonth() + 1;
          D = new Date(item.dataTimeList[0]).getDate();
          M < 10 ? (M = "0" + M) : "";
          D < 10 ? (D = "0" + D) : "";
          MD = M + "月" + D + "日";
          YMD = Y + "-" + M + "-" + D;
          item.dataTimeList[0] = YMD;
        });
      }
    },
    checkStatus() {
      if (this.isEdit && this.floatWaterDrawBonusData.length) {
        this.limitCheck = "1";
        this.formData.ruleList = JSON.parse(JSON.stringify(this.floatWaterDrawBonusData));
      }
    },
    setDates(val, isEdit) {
      this.formData.ruleList.forEach(item => {
        item.dataTimeList = [];
      });
      let dateArr; let firstDate; let Y; let M; let D; let MD; let
        YMD;
      dateArr = [];
      for (let i = 0; i < 7; i++) {
        if (Object.prototype.toString.call(val) == "[object String]") {
          firstDate = new Date(new Date(val).getTime());
        } else {
          firstDate = new Date(val.getTime() - 1000 * 60 * 60 * 24);
        }
        firstDate.setDate(firstDate.getDate() + i);
        Y = firstDate.getFullYear();
        M = firstDate.getMonth() + 1;
        M < 10 ? (M = "0" + M) : "";
        D = firstDate.getDate();
        D < 10 ? (D = "0" + D) : "";
        MD = M + "月" + D + "日";
        YMD = Y + "-" + M + "-" + D;
        dateArr.push({
          label: YMD,
          value: YMD,
          disabled: false
        });
      }
      this.dateList = dateArr;
    },
    validLast(rule, val, callback) {
      let reg = /^[0-9]+$/;
      if (!reg.test(val)) {
        callback(new Error("请输入正确的整数"));
      } else if (!val || val >= 1000000) {
        callback(new Error("只能输入100万以内的金额数"));
      } else {
        callback();
      }
    },
    validNumber(rule, val, callback) {
      let reg = /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
      if (!reg.test(val)) {
        callback(new Error("请输入正确得数字,并最多保留两位小数"));
      } else if (!val || val >= 1000000) {
        callback(new Error("只能输入100万以内的金额数"));
      } else {
        callback();
      }
    },
    minSort(arr) {
      let min;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
          if (arr[i] < arr[j]) {
            min = arr[j];
            arr[j] = arr[i];
            arr[i] = min;
          }
        }
      }
      return arr;
    },
    handlePlus(val) {
      if (val == "add") {
        this.formData.ruleList.push({
          dataTimeList: [],
          incentiveType: "3",
          lowerThreshold: "",
          rewardValue: ""
        });
      } else {
        let i; let
          m;
        m = this.formData.ruleList.length;
        i = this.formData.ruleList[m - 1];
        this.formData.ruleList.push({
          dataTimeList: [],
          incentiveType: "3",
          lowerThreshold: i.lowerThreshold,
          rewardValue: i.rewardValue
        });
      }
    },
    handleMinus(index) {
      if (this.formData.ruleList.length > 1) {
        this.formData.ruleList.splice(index, 1);
      } else {
        this.$message({
          message: "至少存在一条数据，不允许删除此行",
          type: "warning"
        });
      }
    },
    handleChange(val) {
      if (this.beginTime) {
        if (val == "1") {
          this.$emit("handleChoose", "floatWaterDrawBonus");
        } else {
          this.showForm = false;
        }
      } else {
        this.$message({
          message: "请先选择起始周",
          type: "warning"
        });
        this.limitCheck = "0";
      }


      // if (this.beginTime) {
      //   this.showForm = !this.showForm;
      // } else {
      //   this.$message({
      //     message: "请先选择起始周",
      //     type: "warning"
      //   });
      //   this.limitCheck = "0";
      // }
    }
  }
};
</script>
<style lang="">
.new-demo-ruleForm .el-form-item__content {
  margin-left: 0 !important;
}
/* .new-demo-ruleForm .el-form-item__label {
  width: 195px !important;
} */
.new-demo-ruleForm .el-form-item__error {
  width: 220px !important;
}
.new-demo-ruleForm .item {
  padding-top: 40px;
}
.new-demo-ruleForm .item:first-child {
  padding-top: 0;
}
.new-demo-ruleForm
  .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label:before {
  content: "";
  margin-right: 0;
}
</style>
