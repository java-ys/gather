/*
 * @Author: Evil Cheng
 * @Date: 2021-11-11 21:16:56
 * @LastEditTime: 2021-11-12 17:32:48
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
        // 赋值
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
          provinceCityCode: [data.provinceCode, data.cityCode],
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
        this.handleBusinessBizCarLevel(data.expandBizLine, data.bizType)
      } else {
        this.$Message.error(msg);
      }
    },
    handleBusinessBizCarLevel(expandBizLine, bizType) {
      // 根据返回的数据，预先处理业务线-产品线-车型等级
      const business = this.businessList.find(v => v.value === expandBizLine);
      this.productList = business.children;
      const product = this.productList.find(v => v.bizType === bizType);
      this.carLevelList = product.levels;
    }
  }
};
