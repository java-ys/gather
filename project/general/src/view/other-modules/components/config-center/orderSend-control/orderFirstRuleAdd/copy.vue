<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 11:01:34
 * @LastEditTime: 2021-11-07 13:59:08
 * @Description:
-->
<template>
  <div>
    <div class="main-form">
      <div class="page_title">
        订单优先级策略
      </div>
      <basicForm
        ref="basicForm"
        class="pdtb20"
        :infoData="basicFormData"
        @update="updatePriority"
      />
      <valuePriority
        v-if="showValuePriority"
        ref="valuePriority"
        :infoData="valuePriorityData"
      />
      <sourcePriority
        v-if="showSourcePriority"
        ref="sourcePriority"
        :infoData="sourcePriorityData"
      />
      <relativePriority
        v-if="showRelativePriority"
        ref="relativePriority"
        :infoData="relativePriorityData"
      />
      <div class="footer">
        <Button v-lazy-click="saveData" type="primary">
          确认
        </Button>
        <Button @click="goBack">
          取消
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import basicForm from "./components/basicForm.vue";
import valuePriority from "./components/valuePriority.vue";
import sourcePriority from "./components/sourcePriority.vue";
import relativePriority from "./components/relativePriority.vue";

import { addStrategySave, getInfoStrategy } from "_o/api/configData.js";
export default {
  components: {
    basicForm,
    valuePriority,
    sourcePriority,
    relativePriority
  },
  data() {
    return {
      prioritys: [],
      basicFormData: {},
      valuePriorityData: {
        orderPricePriorityStrategySaveReq: {}
      },
      sourcePriorityData: {
        tripartitePlatformVoList: []
      },
      relativePriorityData: {
        dispatchGroupDtos: []
      }
    };
  },
  computed: {
    showValuePriority() {
      // 数据参考 ./components/basicForm.vue PRIORITY_LIST 变量
      const item = this.prioritys.find(i => i === 11);
      return !!item;
    },
    showSourcePriority() {
      // 数据参考 ./components/basicForm.vue PRIORITY_LIST 变量
      const item = this.prioritys.find(i => i === 33);
      return !!item;
    },
    showRelativePriority() {
      // 数据参考 ./components/basicForm.vue PRIORITY_LIST 变量
      const item = this.prioritys.find(i => i === 35);
      return !!item;
    }
  },
  mounted() {
    this.getInfo(this.$route.query.uuid);
  },
  methods: {
    async getInfo(uuid) {
      // 获取详情
      const params = { uuid };
      const res = await getInfoStrategy(params);
      if (res.data.success) {
        const {
          ruleName,
          areaCode,
          carlevel,
          provinceCode,
          cityCode,
          expandBizLine,
          productLine,
          ruleTypeList,
          orderPriceStrategyStrategyVo,
          tripartitePlatformDto,
          dispatchGroupDtoList
        } = res.data.data;
        this.basicFormData = {
          ruleName,
          provinceCityCode: [provinceCode, cityCode],
          areaCodeList: [areaCode],
          expandBizLine,
          productLine,
          carLevels: [carlevel],
          ruleTypeList
        };
        this.prioritys = ruleTypeList;
        // 价值
        this.valuePriorityData = {
          orderPricePriorityStrategySaveReq: {
            uuid: orderPriceStrategyStrategyVo?.uuid,
            priceLevelStrategyReqs: orderPriceStrategyStrategyVo
              ? orderPriceStrategyStrategyVo.priceLevelStrategyVos
              : []
          }
        };
        // 来源
        this.sourcePriorityData = {
          tripartitePlatformVoList: tripartitePlatformDto
            ? tripartitePlatformDto
            : []
        };
        // 相对
        this.relativePriorityData = {
          dispatchGroupDtos: dispatchGroupDtoList
        };
      }
    },
    // 更新优先级，对应展示优先级条件
    updatePriority(params) {
      this.prioritys = params;
    },
    // type 1：保存时同步到BI，2：提交时线上生效
    async saveData() {
      let valueData = {};
      let sourceData = {};
      let relativeData = {};
      const formData = await this.$refs.basicForm.getFormData();
      if (this.showValuePriority) {
        valueData = await this.$refs.valuePriority.getFormData();
        console.log(valueData, "valueData");
      }
      if (this.showSourcePriority) {
        sourceData = await this.$refs.sourcePriority.getFormData();
        console.log(sourceData, "sourceData");
      }
      if (this.showRelativePriority) {
        relativeData = await this.$refs.relativePriority.getFormData();
        console.log(relativeData, "relativeData");
      }
      if (!formData || !valueData || !sourceData || !relativeData) {
        // 为空表示表单未填完整
        return false;
      }

      const params = {
        ...formData,
        ...valueData,
        ...sourceData,
        GroupOrderSaveOrUpdateReq: relativeData
      };
      const res = await addStrategySave(params);
      if (res.data.success) {
        this.$Message.success(res.data.msg);
        this.$router.push({
          path: "/configCenter/orderSend_control"
        });
      }
    },
    goBack() {
      this.$router.push({
        path: "/configCenter/orderSend_control"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
