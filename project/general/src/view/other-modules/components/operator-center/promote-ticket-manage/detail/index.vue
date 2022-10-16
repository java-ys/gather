<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="1" label="配置详情" class="pt-10">
        <Info ref="_info" v-if="activeTab - 1 === 0"></Info>
      </TabPane>
      <TabPane name="2" label="申请司机" class="pt-10">
        <List ref="_list" v-if="activeTab - 2 === 0"></List>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import List from "./list";
import Info from "./info";

export default {
  name: "promote-ticket-detail",
  components: { List, Info },
  beforeRouteUpdate(to, from, next) {
    const { id: tid, agentUuid: tAgentUuid, name: tName } = to.query;
    const { id: fid, agentUuid: fAgentUuid, name: fName } = from.query;
    if (tName === fName && (tid !== fid || tAgentUuid !== fAgentUuid)) {
      if (this.activeTab - 1 === 0) {
        this.$refs._info.getDetail({ id: fid });
      } else if (this.activeTab - 2 === 0) {
        this.$refs._list.extraParams.agentUuid = tAgentUuid;
        this.$refs._list.getList();
      }
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    const { id: tid, agentUuid: tAgentUuid } = to.query;
    next(vm => {
      if (tAgentUuid && tid) {
        if (vm.activeTab - 1 === 0) {
          vm.$refs._info.getDetail({ id: tid });
        } else if (vm.activeTab - 2 === 0) {
          vm.$refs._list.extraParams.agentUuid = tAgentUuid;
          vm.$refs._list.getList();
        }
      }
    });
  },
  data() {
    return {
      activeTab: "1"
    };
  }
};
</script>

<style lang="less" scoped>
.pt-10 {
  padding-top: 10px;
}
</style>