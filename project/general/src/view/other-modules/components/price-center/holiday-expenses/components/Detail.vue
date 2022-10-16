<template>
  <Modal
    :value="visible"
    title="查看详情"
    :width="700"
    @on-cancel="handleCancel"
    @close="handleCancel"
  >
    <template
      v-if="detailData"
    >
      <Divider orientation="left">基本信息</Divider>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>策略名称：</span>
          <em>{{detailData.ruleName}}</em>
        </div>
        <div class="paragraph-item">
          <span>城市：</span>
          <em>{{city}}</em>
        </div>
      </div>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>业务线：</span>
          <em>{{getBusinessName()}}</em>
        </div>
        <div class="paragraph-item">
          <span>产品线：</span>
          <em>{{getProductName(detailData.businessType)}}</em>
        </div>
        <div class="paragraph-item">
          <span>车型等级：</span>
          <em>{{getCarLevelName(detailData.holidaySurchargeExtend.carLevelList, detailData.businessType)}}</em>
        </div>
      </div>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>订单类型：</span>
          <em>{{orderType}}</em>
        </div>
        <div class="paragraph-item">
          <span>生效时间：</span>
          <em>{{detailData.effectiveTime}} ~ {{detailData.failureTime}}</em>
        </div>
      </div>

      <Divider orientation="left">策略信息</Divider>

      <div
        v-for="(item, index) in detailData.holidaySurchargeRules"
        :key="index"
        class="paragraph"
      >
        <div class="paragraph-item">
          <span>时间段{{index + 1}}：</span>
          <em>{{item.periodBegin}} ~ {{item.periodEnd}}</em>
        </div>
        <div class="paragraph-item">
          <span>节日服务费：</span>
          <em>{{item.holidaySurcharge}}元/单</em>
        </div>
      </div>
    </template>

    <Spin
      v-if="modalLoading"
      fix
    />
  </Modal>
</template>

<script>
import { mapGetters } from "vuex"
import { businessTypeMap, carLevelMap, orderTypeMap } from "_o/components/price-center/holiday-expenses/fields"

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: null
    },
    modalLoading: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    city() {
      if (this.detailData) {
        let result = []
        const { cityCode } = this.detailData
        cityCode.split(",").forEach(code => {
          for (let i = 0; i < this.cityList.length; i++) {
            const item = this.cityList[i]
            if (String(item.value) === String(code)) {
              result.push(item.label)
            }
          }
        })

        return result.join(",")
      }

      return ""
    },
    orderType() {
      if (this.detailData) {
        let result = []
        this.detailData.holidaySurchargeExtend.typeTimeList.forEach(item => {
          result.push(orderTypeMap[item])
        })

        return result.join(",")
      }
      return ""
    }
  },
  methods: {
    handleCancel() {
      this.$emit("close")
    },
    getCarLevelName(vals = [], bizType) {
      const { productCarKeyValue } = this.businessGradeName
      const names = vals.map(v => productCarKeyValue[`${bizType}#${v}`])
      return names.join(",") || ""
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    getBusinessName() {
      const expandBizLine = this.detailData.expandBizLine
      const { businessKeyValue } = this.businessGradeName;
      return businessKeyValue[expandBizLine] || "";
    },
  }
}
</script>

<style scoped lang="less">
.paragraph {
  display: flex;
}

.paragraph-item {
  width: 250px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  em {
    font-style: normal;
    font-size: 12px;
  }
}
</style>
