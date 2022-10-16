<template>
  <div>
<!--    <Tabs v-model="activeTab">-->
<!--      <TabPane name="0" label="DP结算账单" style="padding-top: 10px;">-->
<!--        <dp-comp v-if="activeTab === '0'"></dp-comp>-->
<!--      </TabPane>-->
<!--      <TabPane name="1" label="DCP结算账单" style="padding-top: 10px;">-->
<!--        <dcp-comp v-if="activeTab === '1'"></dcp-comp>-->
<!--      </TabPane>-->
<!--    </Tabs>-->
    <dp-comp></dp-comp>
  </div>
</template>

<script>
import DcpComp from "./processDcp.vue";
import DpComp from "./processDp.vue";
export default {
  components: { DcpComp, DpComp },
  data() {
    return {
      activeTab: "0"
    };
  }
};
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
