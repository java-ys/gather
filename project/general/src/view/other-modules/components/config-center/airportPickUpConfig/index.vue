<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:12:13
 * @LastEditTime: 2021-12-03 10:21:00
 * @Description:接送机管理
-->
<template>
  <div>
    <Tabs v-model="tabName">
      <TabPane label="接机权益文案配置" name="pickUp"><pickUp v-if="tabName === 'pickUp'" :active="tabName === 'pickUp'" /></TabPane>
      <TabPane label="送机权益文案配置" name="dropOff"><dropOff v-if="tabName === 'dropOff'" :active="tabName === 'dropOff'" /></TabPane>
      <TabPane label="常见问题配置" name="normalQuestion"><normalQuestion v-if="tabName === 'normalQuestion'" :active="tabName === 'normalQuestion'" /></TabPane>
      <TabPane label="一口价预订须知文案" name="onePrice"><onePrice v-if="tabName === 'onePrice'" :active="tabName === 'onePrice'" /></TabPane>
    </Tabs>
  </div>
</template>
<script>
import pickUp from "./pickUp/index.vue"
import dropOff from "./dropOff/index.vue"
import normalQuestion from "./normalQuestion/index.vue"
import onePrice from "./onePrice/index.vue"
export default {
  components: {
    pickUp,
    dropOff,
    normalQuestion,
    onePrice
  },
  data() {
    return {
      tabName: "pickUp",
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<style lang="less">
@import url('./editor-reset.less');
</style>