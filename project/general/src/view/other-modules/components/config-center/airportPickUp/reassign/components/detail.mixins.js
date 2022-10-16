/*
 * @Author: Evil Cheng
 * @Date: 2021-11-11 21:16:56
 * @LastEditTime: 2021-11-12 18:04:17
 * @Description:
 */
import { queryReassignStrategyDetail } from "_o/api/airportPickUp.js";
export default {
  methods: {
    async getDetail(uuid) {
      const params = {
        uuid
      };
      const res = await queryReassignStrategyDetail(params);
      const { success, data, msg } = res.data;
      if (success) {
        const {
          reassignTimeRestriction,
          responsibleReassignTime,
          responsibleReassignFee,
          airportOrderReassignPeriods,
          irresponsibleReassignTime,
          reassignTimes,
          carLevels
        } = data.airportOrderReassignRestriction;
        // 赋值
        this.formData = {
          ruleName: data.ruleName,
          cityName: data.cityName,
          expandBizLine: data.expandBizLine,
          bizType: data.bizType,
          carLevels: carLevels,
          source: data.source,
          effectiveTime: data.effectiveTime,
          reassignTimeRestriction, // airportOrderReassignRestriction
          responsibleReassignTime, // airportOrderReassignRestriction
          responsibleReassignFee, // airportOrderReassignRestriction
          airportOrderReassignPeriods, // airportOrderReassignRestriction
          irresponsibleReassignTime, // airportOrderReassignRestriction
          reassignTimes // airportOrderReassignRestriction
        };
      } else {
        this.$Message.error(msg);
      }
    }
  }
};
