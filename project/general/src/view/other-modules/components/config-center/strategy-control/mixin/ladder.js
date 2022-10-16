import { ruleInTime, ruleOutTime } from "../components/fields";
export default {
  computed: {
    // 订单类型为预约时，且用车取到为T3时, 可设置阶梯
    canSetLadder({ cancelModelData }) {
      return (
        `${cancelModelData.source}` === "0" &&
        cancelModelData.typeTime - 2 === 0
      );
    },
    showLadder({cancelModelData}) {
      return cancelModelData.useStepRule - 1 === 0
    },
    hideLadder({cancelModelData}) {
      return `${cancelModelData.useStepRule}` === '0'
    },
    ladderData({ canSetLadder, cancelModelData }) {
      if (canSetLadder) {
        if (!cancelModelData?.stepRulesInTime?.length) {
          cancelModelData.stepRulesInTime = [{ ...ruleInTime }];
        }
        if (!cancelModelData?.stepRulesAfterTime?.length) {
          cancelModelData.stepRulesAfterTime = [{ ...ruleOutTime }];
        }
        return cancelModelData;
      }
      return undefined;
    },
  },
  methods: {},
};
