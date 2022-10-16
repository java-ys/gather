<template>
  <div>
    <div class="paragraph">
      <div class="paragraph-item">
        <span>策略名称：</span>
        <em>{{detail.ruleName}}</em>
      </div>
      <div class="paragraph-item">
        <span>策略命中城市：</span>
        <em>{{cityName}}</em>
      </div>
      <div class="paragraph-item">
        <span>策略生效时间：</span>
        <em>{{detail.effectiveTime}} ~ {{detail.failureTime}}</em>
      </div>
      <div class="paragraph-item">
        <span>策略生效业务线：</span>
        <em>{{getBusinessName(detail.expandBizLine)}}</em>
      </div>
    </div>

    <Card
      v-for="(item, index) in detail.ruleDetails"
      :key="index"
      class="card-content"
    >
      <div
        slot="title"
        class="card-title"
      >
        <span>配置{{index + 1}}</span>
      </div>
      <div class="paragraph">
        <div class="paragraph-item">
          <span>策略时间段：</span>
          <em>{{item.startTime}}-{{item.endTime}}</em>
        </div>
        <div class="paragraph-item">
          <span>重复机制：</span>
          <em>{{getWeekName(item.weekDays)}}</em>
        </div>
      </div>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>推荐车型：</span>
          <em>{{getCarName(item.recommendationVehicleLevel, detail.expandBizLine)}}</em>
        </div>
        <div class="paragraph-item">
          <span>触发推荐策略车型：</span>
          <em>{{getCarListName(item.triggerVehicleLevels, detail.expandBizLine)}}</em>
        </div>
      </div>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>触发推荐条件：</span>
          <em>触发推荐策略车型接起率: {{item.triggerCondition.startAcceptRate}}%~{{item.triggerCondition.endAcceptRate}}%</em>
          <em>触发推荐车型/推荐车型价差率 小于等于: {{item.triggerCondition.agioRate}}%</em>
          <em>触发推荐车型有多个，请选择以哪个车型计算价差率: {{getCarName(item.triggerCondition.vehicleLevelForAgioRate, detail.expandBizLine)}}</em>
        </div>
      </div>

      <div class="paragraph">
        <div class="paragraph-item">
          <span>乘客端推荐展示时间：</span>
          <em>呼叫后 {{item.lazyTime}} 秒</em>
        </div>
      </div>
      <div class="paragraph">
        <div class="paragraph-item">
          <span>推荐时是否发放优惠券：</span>
          <em>{{item.useRecommendationCoupon === 1 ? "是" : "否"}}  {{item.showRecommendationCouponId ? "奖券编码:" + item.showRecommendationCouponId : ""}}</em>
        </div>
      </div>
      <div class="paragraph">
        <div class="paragraph-item">
          <span>乘客端配图：</span>
          <img
            :src="item.iconUrl"
            style="width: 343px;height: 120px;"
            alt=""
          >
        </div>
      </div>
    </Card>

    <Spin
      v-if="loading"
      size="large"
      fix
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getCarName, weekList } from "_o/components/operator-center/level-change-recommend/const"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: null
    },
    cityList: {
      type: Array,
      default: () => []
    },
    cityMap: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    cityName() {
      if (this.detail?.cityCode) {
        return this.cityMap[this.detail.cityCode]
      }
      return ""
    },
  },
  methods: {
    getWeekName(arr) {
      let week = arr
      try {
        week = JSON.parse(arr)
      } catch (e) {}
      return week.map(code => {
        let name = ""
        weekList.some(item => {
          if (item.value === code) {
            name = item.label
            return true
          }
          return false
        })

        return name
      }).join(",")
    },
    getBusinessName(id) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[id]
    },
    getCarName(code, id) {
      return code && id ? getCarName(code, id) : ""
    },
    getCarListName(codeList, id) {
      console.log("codeList", codeList)
      return codeList ? JSON.parse(codeList).map(item => this.getCarName(item, id)).join("、") : ""
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
  margin: 0 10px 10px;
  flex: 1;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  em {
    font-style: normal;
    font-size: 12px;
  }
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  margin-bottom: 20px;
}
</style>
