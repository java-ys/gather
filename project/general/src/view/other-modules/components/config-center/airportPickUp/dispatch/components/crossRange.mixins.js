/*
 * @Author: Evil Cheng
 * @Date: 2021-11-17 18:02:50
 * @LastEditTime: 2021-11-22 10:01:51
 * @Description: 校验时间范围是否交叉
 */

export default {
  methods: {
    handleRange(list = []) {
      list.sort((a, b) => a.minHour - b.minHour); // 做一个排序
      const stack = [];
      let crossStatus = false;
      for (let item of list) {
        if (!stack.length) {
          // 第一个数值
          stack.unshift(item.minHour);
          stack.push(item.maxHour);
        } else {
          // 否则比对
          // 因为做了排序，所以只需要比较item.min 与stack[stack.length - 1]
          if (item.minHour === stack[1]) {
            stack[1] = item.maxHour;
          } else {
            crossStatus = true;
            break;
          }
        }
      }
      return crossStatus
    },
    handleRangeValidate() {
      return new Promise((resolve, reject) => {
        // 优质播单排除第一个
        const newList = [].concat([], this.formData.highDispatch);
        if (newList[0]) {
          newList[0].maxHour = Infinity;
        }
        const allList = [].concat(
          newList,
          this.formData.wholeCityDispatch,
          this.formData.directDispatch,
          this.formData.workDispatch
        )
        const crossStatus = this.handleRange(allList);
        if (crossStatus) {
          this.$Message.error("优质播单、全城播单、直接派单以及人工派单时间范围不允许重叠交叉，且数据必须连续");
          resolve(false)
          return false
        }
        resolve(true)
      })
    }
  }
};
