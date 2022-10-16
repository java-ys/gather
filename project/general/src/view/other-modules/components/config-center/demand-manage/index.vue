<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="1" label="订单价值管理" style="padding-top: 10px;">
        <orderValue v-if="activeTab === '1'"></orderValue>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import orderValue from "./orderValue/index.vue";

export default {
  components: { orderValue },
  data() {
    return {
      activeTab: "1",
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
