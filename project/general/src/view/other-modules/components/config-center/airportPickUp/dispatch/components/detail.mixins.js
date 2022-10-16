/*
 * @Author: Evil Cheng
 * @Date: 2021-11-11 21:16:56
 * @LastEditTime: 2021-11-22 11:29:32
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
      this.decodeDispathList(data);
      if (success) {
        // 赋值
        this.formData = {
          ruleName: data.ruleName,
          cityName: data.cityName,
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
      } else {
        this.$Message.error(msg);
      }
    },
    decodeDispathList(data) {
      if (!data.dispatchList) {
        return
      }
      data.highDispatch = [];
      data.wholeCityDispatch = [];
      data.directDispatch = [];
      data.workDispatch = [];
      data.dispatchList.forEach(item => {
        switch (item.type) {
          case 1:
            // 优质
            data.highDispatch.push(item);
            break;
          case 2:
            // 全城
            data.wholeCityDispatch.push(item);
            break;
          case 3:
            // 直接
            data.directDispatch.push(item);
            break;
          case 4:
            // 人工
            data.workDispatch.push(item);
            break;
          default:
            break;
        }
      })
    }
  }
};
