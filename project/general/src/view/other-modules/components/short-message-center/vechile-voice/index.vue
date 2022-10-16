<template>
  <div class="three-party">
    <Tabs v-model="tabVal">
      <TabPane v-for="tab in tabsList" :label="tab.label" :name="tab.name" :key="tab.name">
        <component v-if="tabVal===tab.name" :is="tab.component"></component>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import strategyConfig from "./strategy-config/index.vue";
import timingConfig from "./timing-config/index.vue";
import { tabsList } from "./fields";
export default {
  data() {
    return {
      tabsList,
      tabVal: "1"
    };
  },
  components: {
    timingConfig,
    strategyConfig
  },
};
</script>
