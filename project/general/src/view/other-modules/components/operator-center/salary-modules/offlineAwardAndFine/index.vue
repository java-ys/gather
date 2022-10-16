<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-18 13:57:01
 * @LastEditors: wangp
 * @LastEditTime: 2020-06-19 11:00:16
-->
<template>
  <div class="app-container">


    <div class="tab-container">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="周奖励/扣款列表" name="week">
          <week-reward v-if="activeName == 'week'"></week-reward>
        </el-tab-pane>
        <el-tab-pane label="月奖励/扣款列表" name="month">
          <month-reward v-if="activeName == 'month'"></month-reward>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import weekReward from "./weekReward";
import monthReward from "./monthReward";
export default {
  components: {
    weekReward,
    monthReward
  },
  data() {
    return {
      activeName: "week"
    };
  }
};
</script>

<style></style>
