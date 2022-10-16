<!--
 * @Description:
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-29 17:05:37
 -->
<!--场地管理-->
<template>
  <div class="site-control">
    <Content>
      <Tabs v-model="tabFlag">
        <TabPane label="加油站" name="0">
          <SiteTap v-if="tabFlag == 0" :tabName="tabFlag" :lData="listData" :cityList="cityList"></SiteTap>
        </TabPane>
        <!--<TabPane label="充电站" name="1">
                <SiteTap v-if="tabFlag==1" :tabName='tabFlag' ></SiteTap>
            </TabPane>-->
        <TabPane label="加气站" name="2">
          <SiteTap v-if="tabFlag == 2" :tabName="tabFlag" :cityList="cityList"></SiteTap>
        </TabPane>
        <TabPane label="维修站" name="3">
          <SiteTap v-if="tabFlag == 3" :tabName="tabFlag" :cityList="cityList"></SiteTap>
        </TabPane>
        <TabPane label="司机之家" name="4">
          <SiteTap v-if="tabFlag == 4" :tabName="tabFlag" :cityList="cityList"></SiteTap>
        </TabPane>
        <TabPane label="服务站" name="5">
          <SiteTap v-if="tabFlag == 5" :tabName="tabFlag" :cityList="cityList"></SiteTap>
        </TabPane>
      </Tabs>
    </Content>
  </div>
</template>

<script>
import SiteTap from "./siteTab";
import { getSiteList } from "_o/api/configData.js";
import { getAppointedProvinceCityInAuth } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";

export default {
  components: { SiteTap },
  data() {
    return {
      tabFlag: "0",
      listData: {},
      cityList: []
    };
  },
  mounted() {
    this.getCityListData()
  },
  methods: {
    // 获取权限内省市级联
    getCityListData() {
      let params = {
        areaType: 2, // 已开启城市
        businessLineList: [1, 2, 4, 6, 7]// 快车、专车，包车，顺风车,企业用车
      }
      getAppointedProvinceCityInAuth(params).then(res => {
        let list = cpTranslate(res.data.data || [])
        this.cityList = list
      });
    }
  }
};
</script>
<style lang="less">
    .site-control {
        .ivu-tabs {
            overflow: inherit;
        }
    }
</style>

