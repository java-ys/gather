<template>
  <div>
    <Tabs v-model="activeTab">
      <TabPane name="1" label="开通管理" class="pt-10">
        <OpenManage v-if="activeTab - 1 === 0"></OpenManage>
      </TabPane>
      <TabPane name="2" label="推券酬金" class="pt-10">
        <TicketValue v-if="activeTab - 2 === 0" :activeTab="activeTab"></TicketValue>
      </TabPane>
      <TabPane name="3" label="提现数据" class="pt-10">
        <WithdrawData v-if="activeTab - 3 === 0" :activeTab="activeTab"></WithdrawData>
      </TabPane>
      <TabPane name="4" label="酬金发放" class="pt-10" v-hasAuth="'ticket-provide-tab'">
        <TicketProvide v-if="activeTab - 4 === 0"></TicketProvide>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import OpenManage from "./open-manage/index";
import TicketValue from "./ticket-value/index";
import WithdrawData from "./withdraw-data/index";
import TicketProvide from "./ticket-provide/index";

export default {
  name: "promote-ticket-manage",
  components: { OpenManage, TicketValue, WithdrawData, TicketProvide },
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