<!--
  群组管理-详细信息
  backEnd: 华付-李志桐
-->
<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane
        name="1"
        label="群组设置"
        style="padding-top: 10px;"
      >
        <headSet @changeid="groupChange"></headSet>
      </TabPane>
      <TabPane
        name="2"
        label="群组成员"
        style="padding-top: 10px;"
      >
        <headMember></headMember>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import headSet from "./headSet/index.vue";
import headMember from "./headMember/index.vue";

export default {
  components: {
    headSet,
    headMember
  },
  data() {
    return {
      activeTab: "1",
    };
  },
  methods: {
    groupChange(id) {
      this.activeTab = id
    }
  }
};
</script>
<style lang="less" scoped>
.content-container {
    margin: 10px 0 0 0;
    .operate-wrap {
        margin: 0 0 10px 0;
        text-align: right;
    }
}
</style>
