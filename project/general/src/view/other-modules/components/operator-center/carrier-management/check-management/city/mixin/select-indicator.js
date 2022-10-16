import { removeDuplicate } from "../tool";

// 添加考核指标
export default {
  data() {
    return {
      optionList: [], // 指标列表
      currentOption: ""
    };
  },
  methods: {
    selectIndicator() {
      this.indicatorParams = {};
      this.indicatorShow = true;
    },
    setOptionTab(name) {
      this.currentOption = name;
    },
    deleteIndicator(key) {
      this.optionList.splice(key, 1);
      const firstOption = this.optionList[0];
      this.currentOption = firstOption ? firstOption.name : "";
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
