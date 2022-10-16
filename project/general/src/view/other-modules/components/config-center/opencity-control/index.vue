<!--
 * @Descritption: 包车
 * @Author: lvzhiyang
 * @Date: 2019/11/1
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-10-20 16:23:51
 -->
<!--开通城市主体-->
<template>
  <div class="city-control">
    <Content>
      <Tabs v-model="tabFlag" type="line" name="tab-index">
        <TabPane label="T3开城管理" name="1" style="padding: 0 10px;" tab="tab-index">
          <Express v-if="tabFlag == '1'" :tabName="tabFlag"></Express>
        </TabPane>
        <!-- <TabPane label="三方开城管理" name="2" style="padding: 0 10px;" tab="tab-index">
          <Express v-if="tabFlag == '2'" :tabName="tabFlag"></Express>
        </TabPane> -->
      </Tabs>
    </Content>
  </div>
</template>

<script>
import Express from "./express.vue"

export default {
  name: "city-control",
  components: {
    Express,
    // hitchCityEntry
  },
  data() {
    return {
      tabFlag: "1"
    }
  }
}
</script>
<style lang="less">
  .city-control {
    .ivu-tabs {
      overflow: inherit;
    }
  }
</style>

