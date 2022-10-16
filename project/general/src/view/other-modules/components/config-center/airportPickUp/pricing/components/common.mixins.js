/*
 * @Author: Evil Cheng
 * @Date: 2021-11-30 10:21:21
 * @LastEditTime: 2021-11-30 10:26:48
 * @Description:
 */
import { mapState } from "vuex";
import { REMOTE_SEGMENT } from "../../nums";
export default {
  data() {
    return {
      tripValidate: (rule, value, callback) => {
        const [start, end] = value;
        if (!start && !end) {
          callback(new Error("时段不能为空"));
        }
        if (start === end) {
          callback(new Error("开始时段不能小于等于结束时段"));
        }
        // 判断是否有交叉
        const crossItem = this.formData.tripFare.find(v => {
          const firstValue = v.time[0] < value[0] && value[0] < v.time[1];
          const secondValue = v.time[0] < value[1] && value[1] < v.time[1];
          const cross = v.time[0] > value[0] && value[1] > v.time[0];
          return firstValue || secondValue || cross;
        }); // 字符串对比判断
        if (crossItem) {
          callback(new Error("时段不能交叉"));
        }
        callback();
      },
      timeValidate: (rule, value, callback) => {
        const [start, end] = value;
        if (!start && !end) {
          callback(new Error("时段不能为空"));
        }
        if (start === end) {
          callback(new Error("开始时段不能小于等于结束时段"));
        }
        // 判断是否有交叉
        const crossItem = this.formData.timeFare.find(v => {
          const firstValue = v.time[0] < value[0] && value[0] < v.time[1];
          const secondValue = v.time[0] < value[1] && value[1] < v.time[1];
          const cross = v.time[0] > value[0] && value[1] > v.time[0];
          return firstValue || secondValue || cross;
        }); // 字符串对比判断
        if (crossItem) {
          callback(new Error("时段不能交叉"));
        }
        callback();
      },
      distanceValide: item => (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error("分段结束不能为空"));
        }
        if (item.startCapacity === value) {
          callback(new Error("分段起始与结束不能一致"));
        }
        callback();
      },

      DatePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    }
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel,
      businessGradeList: state => state.common.businessGradeList
    }),
    businessList() {
      // 业务线： 过滤接送机业务线
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9);
      return list;
    },
    startPriods() {
      const list = REMOTE_SEGMENT();
      return list;
    },
    endPriods() {
      const list = REMOTE_SEGMENT();
      return [
        ...list,
        {
          value: 10000,
          label: `100公里以上`
        }
      ];
    }
  },
}