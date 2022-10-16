 <!-- backEnd: 车厘子-赵根飞 -->
 <!--
  * @description: 营运管理-司机管理-考勤管理
  * @author: wuxuan
  * @date: 2019-07-27 15:38:28
 !-->
<template>
  <div>
    <Tabs v-model="activeTab">
        <TabPane name="1" label="日考核" style="padding-top: 10px;">
            <DayAttendance></DayAttendance>
        </TabPane>
        <TabPane name="2" label="月考核" style="padding-top: 10px;">
            <MonthAttendance></MonthAttendance>
        </TabPane>
        <TabPane name="4" label="请假审批" style="padding-top: 10px;">
            <ApprovalManagement></ApprovalManagement>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import MonthAttendance from './month-attendance/index';
import DayAttendance from './day-attendance/index';
import ApprovalManagement from './approval-management/index';

export default {
    name: 'attendance-manage',
    components: {
        MonthAttendance,
        DayAttendance,
        ApprovalManagement
    },
    data(){
        return {
            activeTab: '1'
        }
    }
}
</script>

<style lang="less">
.content-container {
    margin: 10px 0 0 0;
    .operate-wrap {
        margin: 0 0 10px 0;
        text-align: right;
    }
}
</style>
