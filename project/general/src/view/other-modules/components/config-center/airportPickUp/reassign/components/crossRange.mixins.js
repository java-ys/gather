/*
 * @Author: Evil Cheng
 * @Date: 2021-11-17 18:02:50
 * @LastEditTime: 2021-11-24 17:07:51
 * @Description: 校验改派时间段是否交叉且不连续
 */

export default {
  methods: {
    handleRange(list = []) {
      list.sort((a, b) => a.periodBegin - b.periodBegin); // 做一个排序
      const stack = [];
      let crossStatus = false;
      for (let item of list) {
        if (!stack.length) {
          // 第一个数值
          stack.unshift(item.periodBegin);
          stack.push(item.periodEnd);
        } else {
          // 否则比对
          // 因为做了排序，所以只需要比较item.min 与stack[stack.length - 1]
          if (item.periodBegin === stack[1]) {
            stack[1] = item.periodEnd;
          } else {
            crossStatus = true;
            break;
          }
        }
      }
      return { crossStatus, stack }
    },
    handleRangeValidate() {
      return new Promise((resolve, reject) => {
        const allList = [].concat(
          [],
          this.formData.airportOrderReassignPeriods
        )
        const { crossStatus, stack } = this.handleRange(allList);
        if (crossStatus) {
          this.$Message.error("改派时间段不允许重叠交叉，且数据必须连续");
          resolve(false)
          return false
        } else {
          if (stack[0] === 0 && stack[1] === (this.formData.responsibleReassignTime - this.formData.reassignTimeRestriction)) {
            resolve(true)
          } else {
            this.$Message.error("改派时间段必须从0开始，且必须覆盖整个有责改派时间范围");
            resolve(false)
          }
        }
      })
    }
  }
};
