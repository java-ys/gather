<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="1" label="底部菜单" style="padding-top: 10px;">
        <passenger v-if="activeTab === '1'"></passenger>
      </TabPane>
      <TabPane name="2" label="侧边栏菜单" style="padding-top: 10px;">
        <left-menu v-if="activeTab === '2'"></left-menu>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import passenger from "./passenger/index";
import leftMenu from "./left-menu/index";
export default {
  components: {
    passenger,
    leftMenu
  },
  data() {
    return {
      activeTab: "1"
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
