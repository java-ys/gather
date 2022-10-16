import { removeDuplicate } from "../tool";
// 添加扣减指标
export default {
  data() {
    return {
      deductionList: [],
    };
  },
  methods: {
    selectDeductIndicator() {
      this.indicatorParams = {
        classify: 6, // 扣减项
      };
      this.indicatorShow = true;
    },
    deleteDeductIndicator(key) {
      this.deductionList.splice(key, 1);
    },
    setDeductionList(selected) {
      if (this.deductionList.length) {
        this.deductionList = removeDuplicate(
          this.deductionList.concat(selected),
          "indexUuid"
        );
      } else {
        this.deductionList = selected;
      }
    },
  },
};
