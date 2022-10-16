/*
 * @Author: Evil Cheng
 * @Date: 2021-11-11 21:16:56
 * @LastEditTime: 2021-11-22 10:15:20
 * @Description:
 */
import { queryPricingStrategyDetail } from "_o/api/airportPickUp.js";
export default {
  methods: {
    async getDetail(uuid) {
      const params = {
        uuid
      }
      const res = await queryPricingStrategyDetail(params)
      const { success, data, msg } = res.data
      if (success) {
        // 赋值
        this.formData = {
          fareTypeNote: data.fareTypeNote,
          cityName: data.city, // 额外加的，因为城市下拉需要provinceCityCode
          provinceCityCode: [data.provinceCode, data.cityCode],
          expandBizLine: data.expandBizLine,
          businessType: data.businessType,
          carLevels: [data.carLevel],
          source: data.source,
          typeTime: data.typeTime,
          startFareStatus: data.startFareStatus, // 是否选择起步费
          startFare: data.startFare, // 起步费(元)
          startTrip: data.startTrip, // 起步里程（公里）
          startDuration: data.startDuration, // 起步时长（分钟）
          effectiveTime: data.effectiveTime,
          lowestFareStatus: data.lowestFareStatus,
          lowestFare: data.lowestFare,
          model: data.model,
          nightTripFare: data.nightTripFare,
          thirdAdditionalRate: data.thirdAdditionalRate,
          freeWaitTime: data.freeWaitTime,
          beyondWaitFare: data.beyondWaitFare,
          tripFare: data.tripFare,
          timeFare: data.timeFare,
          longTripFareRuleDto: {
            capacityRuleDetails: data.longTripFareRuleDto.capacityRuleDetails || []
          }
        }
      } else {
        this.$Message.error(msg)
      }
    }
  },
}