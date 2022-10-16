<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="0" label="消息中心公告配置" style="padding-top: 10px;">
        <notice v-if="activeTab === '0'"></notice>
      </TabPane>
      <TabPane name="1" label="发布类目管理" style="padding-top: 10px;">
        <category v-if="activeTab === '1'"></category>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Notice from "./notice/index.vue";
import Category from "./category/index.vue";
export default {
  components: { Category, Notice },
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
