<!--
 * @Descritption: 包车
 * @Author: lvzhiyang
 * @Date: 2019/11/1
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-10-20 17:40:14
 -->
<!--开通城市主体-->
<template>
  <div class="city-control">
    <Content>
      <Tabs v-model="tabFlag" type="line" name="tab-index">
        <TabPane label="T3业务线与车型等级关系管理" name="1" style="padding: 0 10px;" tab="tab-index">
          <Tabpage v-if="tabFlag === '1'" :tabName="tabFlag"></Tabpage>
        </TabPane>
        <!-- <TabPane label="三方开城管理" name="2" style="padding: 0 10px;" tab="tab-index">
          <Tabpage v-if="tabFlag == '2'" :tabName="tabFlag"></Tabpage>
        </TabPane> -->
      </Tabs>
    </Content>
  </div>
</template>

<script>
import Tabpage from "./tabpage.vue"
// import hitchCityEntry from "_h/components/city-entry/index.vue"

export default {
  name: "product-line-vehicle-control",
  components: {
    Tabpage,
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

