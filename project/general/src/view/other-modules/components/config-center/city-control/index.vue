<!--
 * @Descritption: 包车
 * @Author: lvzhiyang
 * @Date: 2019/11/1
 * @LastEditors: lvzhiyang
 * @LastEditTime: 2019/11/1
 -->
<!--开通城市主体-->
<template>
  <div class="city-control">
    <Content>
      <Tabs v-model="tabFlag" type="line" name="tab-index">
        <TabPane label="快享" name='4' style="padding: 0 10px;" tab="tab-index" v-if="$checkHasBtn('express-car-tab')">
          <Express v-if="tabFlag== '4'" :tabName='tabFlag'></Express>
        </TabPane>
        <TabPane label="专享" name='2' style="padding: 0 10px;" tab="tab-index" v-if="$checkHasBtn('special-car-tab')">
          <Express v-if="tabFlag== '2'" :tabName='tabFlag'></Express>
        </TabPane>
        <TabPane label="出租车" name='1' style="padding: 0 10px;" tab="tab-index" v-if="$checkHasBtn('taxi-tab')">
          <Express v-if="tabFlag== '1'" :tabName='tabFlag'></Express>
        </TabPane>
        <!-- <TabPane label="顺风车" name='5' style="padding: 0 10px;" tab="tab-index">
          <hitch-city-entry v-if="tabFlag === '5'"></hitch-city-entry>
        </TabPane> -->
        <!--<TabPane label="包车" name='3' style="padding: 0 10px;" tab="tab-index">-->
        <!--  <Express v-if="tabFlag== '3'" :tabName='tabFlag'></Express>-->
        <!--</TabPane>-->
        <TabPane label="包车" name='3' style="padding: 0 10px;" tab="tab-index" v-if="$checkHasBtn('chartered-car-tab')">
          <Express v-if="tabFlag== '3'" :tabName='tabFlag'></Express>
        </TabPane>
      </Tabs>
    </Content>
  </div>
</template>

<script>
  import Express from './express.vue'
  // import hitchCityEntry from "_h/components/city-entry/index.vue"

  export default {
    name: 'city-control',
    components: {
      Express,
      // hitchCityEntry
    },
    data () {
      return {
        tabFlag: '4'
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

