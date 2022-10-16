<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-07-05
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-07-05
-->
<template>
  <div class="app-container">
    <!-- 审核类型 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="周收入应发审核" name="weekRewardReview">
        <week-reward-review v-if="weekRewardReviewVisible" />
      </el-tab-pane>
      <el-tab-pane label="周收入实发审核" name="weekPersonalReview">
        <week-personal-review v-if="weekPersonalReviewVisible" />
      </el-tab-pane>
      <el-tab-pane label="月工资应发审核" name="monthSalaryReview">
        <month-salary-review v-if="monthSalaryReviewVisible" />
      </el-tab-pane>
      <el-tab-pane label="月工资实发审核" name="monthPersonalReview">
        <month-personal-review v-if="monthPersonalReviewVisible" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import weekRewardReview from "./weekRewardReview/index";
import monthSalaryReview from "./monthSalaryReview/index";
import weekPersonalReview from "./weekPersonalReview/index";
import monthPersonalReview from "./monthPersonalReview/index";
export default {
  name: "personalExamine",
  components: {
    weekRewardReview,
    monthSalaryReview,
    weekPersonalReview,
    monthPersonalReview
  },
  data() {
    return {
      activeName: "weekRewardReview",
      weekRewardReviewVisible: true, // 周奖励审核显示/隐藏
      monthSalaryReviewVisible: false, // 月工资审核显示/隐藏
      weekPersonalReviewVisible: false, // 周个税审核显示/隐藏
      monthPersonalReviewVisible: false // 月个税/社保审核显示/隐藏
    };
  },
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case "weekRewardReview":
          this.weekRewardReviewVisible = true;
          this.monthSalaryReviewVisible = false;
          this.weekPersonalReviewVisible = false;
          this.monthPersonalReviewVisible = false;
          break;
        case "monthSalaryReview":
          this.monthSalaryReviewVisible = true;
          this.weekRewardReviewVisible = false;
          this.weekPersonalReviewVisible = false;
          this.monthPersonalReviewVisible = false;
          break;
        case "weekPersonalReview":
          this.weekPersonalReviewVisible = true;
          this.weekRewardReviewVisible = false;
          this.monthSalaryReviewVisible = false;
          this.monthPersonalReviewVisible = false;
          break;
        case "monthPersonalReview":
          this.monthPersonalReviewVisible = true;
          this.weekRewardReviewVisible = false;
          this.monthSalaryReviewVisible = false;
          this.weekPersonalReviewVisible = false;
          break;
      }
    }
  }
};
</script>

<style>
</style>
