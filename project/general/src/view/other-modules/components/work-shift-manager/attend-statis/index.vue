<!-- 
 * @description: 考勤管理-考勤统计
 * @author: wangpeng 
 * @date: 2020-03-8 16:24:26
!-->
<template>
  <div class="record-query">
    <Tabs v-model="currentTab">
      <TabPane label="日报" name="1">
        <daily-record></daily-record>
      </TabPane>
      <TabPane label="月报" name="2">
        <monthly-record></monthly-record>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import dailyRecord from './daily/index';
import monthlyRecord from './monthly/index';
export default {
  name: 'attend-statis',
  components: { dailyRecord, monthlyRecord },
  data() {
    return {
      currentTab: '1'
    };
  },
};
</script>

<style lang="less">
</style>