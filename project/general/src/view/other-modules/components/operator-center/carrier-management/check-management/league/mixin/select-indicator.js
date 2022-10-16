import { removeDuplicate } from "../tool";

// 添加考核指标
export default {
  data() {
    return {
      optionList: [], // 指标列表
    };
  },
  methods: {
    selectIndicator() {
      this.indicatorParams = {};
      this.indicatorShow = true;
    },
    deleteIndicator(key) {
      this.optionList.splice(key, 1);
      this.proportionChange()
    },
    setOptionList(selected) {
      if (this.optionList.length) {
        this.optionList = removeDuplicate(
          this.optionList.concat(selected),
          "indexUuid"
        );
      } else {
        this.optionList = selected;
      }
    },
  },
};
