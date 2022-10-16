<template>
  <div>
    <Tabs v-model="tab">
      <TabPane v-for="(v,i) of tabs" :key="v" :label="['流转配置','分类管理','部门标签','关联分类','部门管理'][v.slice(-1) - 1]" :name="'tab' + i">
        <Component :is="['Circulation','Classification','Labels','Links','Departments'][v.slice(-1) - 1]" v-if="tab === ('tab' + i)" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
/* eslint-disable quotes,space-infix-ops */
import { checkHasBtn } from "@/libs/util.js";
import Circulation from "./Circulation.vue";
import Labels from "./Labels.vue";
import Classification from "./Classification.vue";
import Departments from "./Departments.vue";
import Links from "./Links.vue";
export default {
  name: "CirculationOrder",
  components: { Circulation, Classification, Labels, Departments, Links },
  data: () => ({
    tab: 'tab0',
    tabs: Array.from({ length: 5 }, (_,i) => "circulation-tab-" + (i + 1)).filter(checkHasBtn),
  }),
};
</script>

<style scoped>

</style>