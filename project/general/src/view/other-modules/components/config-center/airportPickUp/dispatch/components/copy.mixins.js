/*
 * @Author: Evil Cheng
 * @Date: 2021-11-11 21:16:56
 * @LastEditTime: 2021-11-22 10:00:38
 * @Description:
 */
import { queryDispatchStrategyInfo } from "_o/api/airportPickUp.js";
export default {
  methods: {
    async getDetail(uuid) {
      const params = {
        uuid
      };
      const res = await queryDispatchStrategyInfo(params);
      const { success, data, msg } = res.data;
      if (success) {
        // 赋值
        this.decodeDispathList(data);
        this.formData = {
          ruleName: data.ruleName,
          cityName: data.cityName,
          cityCode: data.cityName,
          extendBizType: data.extendBizType,
          businessType: data.businessType,
          carLevelList: data.carLevelList,
          typeTime: data.typeTime,
          effectiveTime: data.effectiveTime,
          mutexFilterTags: !!data.mutexFilterTags,
          source: data.source,
          wholeCityDispatch: data.wholeCityDispatch || [], // 全城播单
          highDispatch: data.highDispatch || [], // 优质播单
          directDispatch: data.directDispatch || [], // 直接派单
          workDispatch: data.workDispatch || [], // 人工派单
          entryTime: data.entryTime
        };
        this.handleBusinessBizCarLevel(data.extendBizType, data.businessType)
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
