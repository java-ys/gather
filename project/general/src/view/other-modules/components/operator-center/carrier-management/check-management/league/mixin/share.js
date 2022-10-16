// 共享指标操作
export default {
  data() {
    return {
      indicatorSingleShow: false,
      indicatorSingleParams: {},
      shareKey: null, // 添加共享指标的考核指标索引
    };
  },
  methods: {
    addShareIndicator(key) {
      this.shareKey = key;
      this.indicatorSingleShow = true;
    },
    indicatorSingleClose(selected) {
      // console.log(JSON.stringify(selected, null, 2))
      this.indicatorSingleShow = false;
      if (!selected) return;
      let { uuid } = selected;
      // 共享指标是否在已选择的指标中
      let isExist = this.optionList.some((it) =>
        [it.indexUuid, it.uuid].includes(uuid)
      );
      if (isExist) {
        this.$Message.error("共享考核指标和已选择的指标重复");
        return;
      }
      let nowIndicator = this.optionList[this.shareKey];
      // 选中的指标添加 groupIndexUuid
      selected.groupIndexUuid = nowIndicator?.indexUuid || nowIndicator?.uuid
      // 当前指标是否有共享指标
      let hasSelectShare = !!this.optionList[this.shareKey + 1]?.groupIndexUuid;
      this.optionList.splice(
        this.shareKey + 1,
        +hasSelectShare,
        this.adjustIndicator(selected)
      );
    },
  },
};
