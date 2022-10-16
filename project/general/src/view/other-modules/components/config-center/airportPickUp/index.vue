<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 11:12:13
 * @LastEditTime: 2021-11-16 20:12:04
 * @Description:接送机管理
-->
<template>
  <div>
    <Tabs v-model="tabName">
      <TabPane label="定价策略" name="pricing"><Pricing v-if="tabName === 'pricing'" :active="tabName === 'pricing'" :cityList="provinceCityList" /></TabPane>
      <TabPane label="派单策略" name="dispatch"><Dispatch v-if="tabName === 'dispatch'" :active="tabName === 'dispatch'" :cityList="provinceCityList" /></TabPane>
      <TabPane label="改派策略" name="reassign"><Reassign v-if="tabName === 'reassign'" :active="tabName === 'reassign'" :cityList="provinceCityList" /></TabPane>
    </Tabs>
  </div>
</template>
<script>
import { mapMutations } from "vuex"
import Dispatch from "./dispatch/index.vue"
import Pricing from "./pricing/index.vue"
import Reassign from "./reassign/index.vue"
import { getWholeRegion, queryChannel } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
export default {
  components: {
    Dispatch,
    Pricing,
    Reassign
  },
  data() {
    return {
      tabName: "pricing",
      provinceCityList: []
    }
  },
  created() {
    this.getChannel()
    this.getCityList()
  },
  methods: {
    ...mapMutations(["setChannel"]),
    // 获取渠道
    async getChannel() {
      const res = await queryChannel()
      const { data, success } = res.data
      if (success) {
        const list = data ? data.map(v => {
          return {
            label: v.sourseName,
            value: v.sourseValue
          }
        }) : []
        this.setChannel(list)
      }
    },
    // 获取城市列表
    async getCityList() {
      const res = await getWholeRegion()
      const { data, success } = res.data
      if (success) {
        let list = cpTranslate(data, "", "", "citys");
        this.provinceCityList = list;
      }
    },
  },
}
</script>