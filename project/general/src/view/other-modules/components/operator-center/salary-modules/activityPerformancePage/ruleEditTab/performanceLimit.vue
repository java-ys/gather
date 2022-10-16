<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-23 17:04:43
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-11 16:07:32
-->
<template>
  <div>
    <el-form
      ref="editForm"
      :inline="true"
      :model="formData"
      class="demo-form-inline"
      size="small"
      :rules="rules"
      label-width="120px"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-checkbox
            v-model="limitCheck"
            true-label="1"
            false-label="0"
            @change="handleChange('limitCheck')"
          >
            活动绩效限制（注：以下选项中可任选一个或多个并满足条件，即可获得相应订单达标奖励、浮动流水奖励、流水时段抽成奖励、流水时段固定奖励）
          </el-checkbox>
        </div>
        <template v-if="!showForm">
          <span class="check-text">(勾选后，活动绩效限制生效)</span><br />
        </template>
        <template v-else>
          <el-row style="margin-bottom: 15px">
            <el-col :span="3" style="margin-top: 5px">
              <el-checkbox
                v-model="orderLimitCheck"
                true-label="1"
                false-label="0"
                @change="handleChange('order')"
              >成单率限制
              </el-checkbox>
            </el-col>
            <el-col v-if="orderLimitVisible" :span="20">
              <el-form-item
                label="周时段累计成单率 >= "
                size="mini"
                label-width="160px"
                prop="weekSuccessRate"
              >
                <el-input
                  v-model="formData.weekSuccessRate"
                  placeholder="百分比"
                  style="width: 135px"
                ></el-input>
                <span>&nbsp;%</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 15px">
            <el-col :span="3" style="margin-top: 5px">
              <el-checkbox
                v-model="starLimitCheck"
                true-label="1"
                false-label="0"
                @change="handleChange('star')"
              >星级限制
              </el-checkbox>
            </el-col>
            <el-col v-if="starLimitVisible == '1'" :span="20">
              <el-form-item
                label="周时段星级 >= "
                size="mini"
                prop="starLimit"
                label-width="160px"
              >
                <el-input
                  v-model="formData.starLimit"
                  placeholder="星级"
                  style="width: 135px"
                ></el-input>
                <span>&nbsp;星</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 日在线时长 -->
            <el-col :span="3" style="margin-top: 5px">
              <el-checkbox
                v-model="timeLimitCheck"
                true-label="1"
                false-label="0"
                @change="handleChange('time')"
              >在线时长限制
              </el-checkbox>
            </el-col>
            <el-col v-if="timeLimitVisible == '1'" :span="16">
              <el-form-item
                label="日在线时长 >= "
                size="mini"
                prop="dayMinOnlineDuration"
                label-width="160px"
              >
                <el-input
                  v-model="formData.dayMinOnlineDuration"
                  placeholder="小时"
                  style="width: 135px"
                ></el-input>
                <span>&nbsp;小时</span>
              </el-form-item>
              <el-form-item
                label="日高峰时长 >= "
                size="mini"
                label-width="160px"
                prop="dayMinPeakDuration"
              >
                <el-input
                  v-model="formData.dayMinPeakDuration"
                  placeholder="小时"
                  style="width: 135px"
                ></el-input>
                <span>&nbsp;小时</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import {
  isEmptyObject,
  validateStar,
  validatePercent,
  validateHour,
  validatePercentDigit,
  validatePeakHour
} from "_o/common/salaryMixin";
export default {
  props: ["performanceLimitData", "submitType", "isEdit", "beginTime"],
  data() {
    return {
      isEmptyObject,
      limitCheck: "",
      formData: {
        weekSuccessRate: "",
        starLimit: "",
        dayMinOnlineDuration: "",
        dayMinPeakDuration: ""
      },
      showForm: false,
      orderLimitCheck: "0",
      starLimitCheck: "0",
      timeLimitCheck: "0",
      orderLimitVisible: false,
      starLimitVisible: false,
      timeLimitVisible: false,
      rules: {
        weekSuccessRate: [{ validator: validatePercentDigit, trigger: "blur" }],
        starLimit: [{ validator: validateStar, trigger: "blur" }],
        dayMinOnlineDuration: [{ validator: validateHour, trigger: "blur" }],
        dayMinPeakDuration: [{ validator: validatePeakHour, trigger: "blur" }]
      }
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
    orderLimitCheck: {
      handler(val) {
        if (val == "1") {
          this.orderLimitVisible = true;
        } else {
          this.orderLimitVisible = false;
        }
      },
      immediate: true
    },
    starLimitCheck: {
      handler(val) {
        if (val == "1") {
          this.starLimitVisible = true;
        } else {
          this.starLimitVisible = false;
        }
      },
      immediate: true
    },
    timeLimitCheck: {
      handler(val) {
        if (val == "1") {
          this.timeLimitVisible = true;
        } else {
          this.timeLimitVisible = false;
        }
      },
      immediate: true
    },
    performanceLimitData: {
      handler(val) {
        if (this.isEmptyObject(val)) this.formData = JSON.parse(JSON.stringify(val));
      }
    },
    immediate: true,
    deep: true
  },
  created() {
    this.setData();
  },
  methods: {
    ruleValidate() {
      if (this.showForm) {
        let flag = false;
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let data;
            data = JSON.parse(JSON.stringify(this.formData));
            if (this.orderLimitCheck == "0") data.weekSuccessRate = "-1";
            if (this.starLimitCheck == "0") data.starLimit = "-1";
            if (this.timeLimitCheck == "0") {
              console.log("666");
              data.dayMinOnlineDuration = "-1";
              data.dayMinPeakDuration = "-1";
            }
            localStorage.setItem("performanceLimitRule", JSON.stringify(data));
            flag = true;
          }
        });
        return flag;
      }
    },
    setData() {
      if (
        this.isEdit &&
        !this.isEmptyObject(this.performanceLimitData) &&
        this.performanceLimitData.id
      ) {
        this.limitCheck = "1";
        this.formData = JSON.parse(JSON.stringify(this.performanceLimitData));
      }
      if (this.formData.weekSuccessRate) this.orderLimitCheck = "1";
      if (this.formData.starLimit) this.starLimitCheck = "1";
      if (this.formData.dayMinOnlineDuration) this.timeLimitCheck = "1";
    },
    handleChange(val) {
      switch (val) {
        case "limitCheck":
          this.showForm = !this.showForm;
          break;
        case "order":
          this.orderLimitVisible = !this.orderLimitVisible;
          break;
        case "star":
          this.starLimitVisible = !this.starLimitVisible;
          break;
        case "time":
          this.timeLimitVisible = !this.timeLimitVisible;
          break;
      }
    }
  }
};
</script>
