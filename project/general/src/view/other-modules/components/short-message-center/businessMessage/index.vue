<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="1" label="push" style="padding-top: 10px;">
        <push v-if="activeTab === '1'"></push>
      </TabPane>
      <TabPane name="2" label="提示文案" style="padding-top: 10px;">
        <prompt v-if="activeTab === '2'"></prompt>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import push from "./push/index";
import prompt from "./prompt/index";
export default {
  name: "business-message",
  components: {
    push,
    prompt
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
