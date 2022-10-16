<template>
  <div>
    <Tabs v-model="tabFlag" type="line" name="tab-index">
        <TabPane label="请假审批" name='1' style="padding: 0 10px;" tab="tab-index">
            <component-leave v-if="tabFlag - 1 ===0" :attedType="1"></component-leave>
        </TabPane>
        <TabPane label="销假审批" name='2' style="padding: 0 10px;" tab="tab-index">
            <component-leave v-if="tabFlag - 2 ===0" :attedType="2"></component-leave>
        </TabPane>
        <TabPane label="补假审批" name='3' style="padding: 0 10px;" tab="tab-index">
            <component-leave v-if="tabFlag - 3 ===0" :attedType="3"></component-leave>
        </TabPane>
        <TabPane label="休息审批" name='4' style="padding: 0 10px;" tab="tab-index">
            <component-leave v-if="tabFlag - 4 ===0" :attedType="4"></component-leave>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import componentLeave from "./components/index.vue"


export default {
  components: {
    componentLeave
  },
  data() {
    return {
      tabFlag: '1'
    }
  }
}
</script>

