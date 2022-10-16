import {defaultRuleList} from "../fields"
import { freeze } from "@/mixins/base";

const MAX_RULE_NUMBER = 5;
let RULE_ROW = {
  continuedCancelMinute: 10,
  continuedCancelNum: null,
  continuedCancelNoMinute: null
}
export default {
  data() {
    return {
      defaultRuleList: freeze(defaultRuleList),
    }
  },
  computed: {
    // 产品线是快享
    isEnjoyFast({cancelModelData}) {
      return cancelModelData.businessType - 4 === 0
    },
    // 不收取取消费
    noCancelFee({cancelModelData}) {
      return `${cancelModelData.useChannelRuleFee}` !== '1'
    },
    // 实时单
    isSyncOrder({cancelModelData}) {
      return cancelModelData.typeTime - 1 === 0
    },
    // 预约单
    isAsyncOrder({cancelModelData}) {
      return cancelModelData.typeTime - 2 === 0
    },
    // 业务线是自动驾驶
    isAutoDriveLine({cancelModelData}) {
      return cancelModelData.expandBizLine - 16 === 0
    },
    // 产品线是自动驾驶
    isAutoDriveProduceLine({cancelModelData}) {
      return cancelModelData.businessType - 7 === 0
    },
    // 产品线是旗妙
    isWonder({cancelModelData}) {
      return cancelModelData.businessType - 8 === 0
    }
  },
  methods: {
    deleteRuleRow(index) {
      this.cancelModelData.continuousCancelRules.splice(index, 1);
    },
    addRuleRow(index) {
      if(this.cancelModelData.continuousCancelRules.length - MAX_RULE_NUMBER === 0) {
        this.$Message.error(`最多添加${MAX_RULE_NUMBER}条规则`)
        return
      }
      this.cancelModelData.continuousCancelRules.splice(index + 1, 0, {...RULE_ROW})
    },
    checkContinuousCancelRules(list) {
      let len = list.length;
      let timesList = list.map(it => it.continuedCancelNum)
      let timesLen = [...new Set(timesList)].length
      if(timesLen < len) {
        this.$Message.error('取消次数不能设置相同')
        return
      }
      return true
    }
  }
}
