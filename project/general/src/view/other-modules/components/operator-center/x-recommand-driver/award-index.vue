<template>
  <div class="page-award">
     <Tabs v-model="activeTab" :animated="false">
        <TabPane label="司机" name="1">
          <driver-award></driver-award>
        </TabPane>
        <TabPane label="乘客" name="2">
          <award-info ruleId="4861"></award-info>
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
import awardInfo from "./awardInfo.vue"
import driverAward from "./driver-award.vue"
export default {
  name: "PageAward",
  components: {
    awardInfo,
    driverAward
  },
  data() {
    return {
      activeTab: "1",
    }
  }
}
</script>