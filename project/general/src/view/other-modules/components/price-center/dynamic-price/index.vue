<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="0" label="乘客一口价" class="tab-c">
        <passenger v-if="activeTab === '0'"></passenger>
      </TabPane>
      <TabPane name="1" label="司机一口价" class="tab-c">
        <driver v-if="activeTab === '1'"></driver>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Driver from "./driver/index.vue";
import Passenger from "./passenger/index.vue";
export default {
  components: { Passenger, Driver },
  data() {
    let { tab } = this.$route.query;
    return {
      activeTab: tab >= 0 ? `${tab}` : "0",
    };
  },
};
</script>

<style lang="less">
.content-container {
  margin: 10px 0 0 0;

  .operate-wrap {
    margin: 0 0 10px 0;
    text-align: right;
  }
  .tab-c {
    padding-top: 10px
  }
}
</style>
