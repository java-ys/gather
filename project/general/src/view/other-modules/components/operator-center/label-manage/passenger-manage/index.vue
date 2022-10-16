<!--
 * @Description:
 * @LastEditors: DK
 * @LastEditTime: 2019-08-09 16:01:33
 -->
<template>
  <div class="label-manage">
    <Tabs :value="tabVal" @on-click="tabChange">
      <TabPane label="标签池" name="tab1">
        <labelPoolSpecial v-if="isSpecial" :tabVal="tabVal"></labelPoolSpecial>
        <label-pool v-else :tabVal="tabVal"></label-pool>
      </TabPane>
      <TabPane label="标签设置" name="tab2">
        <label-config :tabVal="tabVal" :isSpecial="isSpecial"></label-config>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import labelPool from './components/label-pool/index.vue'
import labelPoolSpecial from './components/label-pool-special/index.vue'
import labelConfig from './components/label-config/index.vue'
export default {
  data(){
    return {
      tabVal: 'tab1'
    }
  },
  components: {
    labelPool,
    labelConfig,
    labelPoolSpecial
  },
  computed: {
    isSpecial(){
      return this.$route.name==='special-passenger-manage'
    }
  },
  methods: {
    tabChange(name){
      this.tabVal=name
    }
  }
}
</script>
<style lang="less">
  .label-manage {
    .ivu-tabs {
      overflow: inherit;
    }
  }
</style>
