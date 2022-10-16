import {
  inject,
  provide,
  reactive,
  ref,
} from "@vue/composition-api";
import moment from "moment";
import {
  useOperators,
} from "./useOperators";
import {
  addCitySafeguard,
  updateCitySafeguard,
} from "_o/components/operator-center/salary-modules/CitySafeguard/api";
import {
  getLabelFromValueLabelList,
} from "_o/components/operator-center/salary-modules/CitySafeguard/utils";
import { injectBizData } from "_o/components/operator-center/salary-modules/CitySafeguard/biz/useBizData";
import {
  RULE_TYPE__SALARY_SAFEGUARD,
} from "_o/components/operator-center/salary-modules/CitySafeguard/biz/consts";
import { callAlert } from "_o/components/operator-center/salary-modules/CitySafeguard/uiUtils";
export const INJECT_KEY__SAFEGUARD_EDIT_MODAL = "SafeguardEditModal";
/** 日完单数 */
export const STRATEGY_INDEX__DAILY_ORDER_COUNT = "1";
/** 日在线时长 */
export const STRATEGY_INDEX__DAILY_ONLINE_TIME = "2";
/** 日高峰时长 */
export const STRATEGY_INDEX__DAILY_PEAK_TIME = "3";

/** 保底策略默认时间段日期（后台保存用） */
export const DEFAULT_RANGE_DATE = "2022/01/01"
/** 保底策略默认时间段起始时间 */
export const DEFAULT_RANGE_DATE__START_TIME = "00:00:00";
/** 保底策略默认时间段结束时间 */
export const DEFAULT_RANGE_DATE__END_TIME = "23:59:59";

/** 正整数和0判断方法 */
export const positiveIntegerValidate = ({ min, max, defaultMessage }, val) => {
  if (!/^(0|([1-9][0-9]*))$/.test(val)) {
    return defaultMessage;
  }
  if (min != null && Number(val) < min) {
    return defaultMessage;
  }
  if (max != null && Number(val) > max) {
    return defaultMessage;
  }
  return null;
};

/** 正整数和保留一位小数 */
export const positiveValidate = ({ min, max, defaultMessage }, val) => {
  if (!/^(0|([1-9][0-9]*))(\.[0-9])?$/.test(val)) {
    return defaultMessage;
  }
  if (min != null && Number(val) < min) {
    return defaultMessage;
  }
  if (max != null && Number(val) > max) {
    return defaultMessage;
  }
  return null;
};

const config = {
  startTime: new Date(`${DEFAULT_RANGE_DATE} ${DEFAULT_RANGE_DATE__START_TIME}`),
  endTime: new Date(`${DEFAULT_RANGE_DATE} ${DEFAULT_RANGE_DATE__END_TIME}`),
  onlineDuration: "",
  durationOrderCount: "",
}

export const getDefaultDurationConfig = () => ({ ...config });

// export const getDefaultPeakDurationConfig = () => ({ ...config });

const getGuaranteedModeFromStrategyIndex = indexList => {
  const indexListStr = indexList.sort().join(",");
  return {
    [STRATEGY_INDEX__DAILY_ORDER_COUNT]: 1,
    [STRATEGY_INDEX__DAILY_ONLINE_TIME]: 2,
    [`${STRATEGY_INDEX__DAILY_ORDER_COUNT},${STRATEGY_INDEX__DAILY_ONLINE_TIME}`]: 3,
    [STRATEGY_INDEX__DAILY_PEAK_TIME]: 4,
    [`${STRATEGY_INDEX__DAILY_ORDER_COUNT},${STRATEGY_INDEX__DAILY_PEAK_TIME}`]: 5,
    [`${STRATEGY_INDEX__DAILY_ONLINE_TIME},${STRATEGY_INDEX__DAILY_PEAK_TIME}`]: 6,
    [`${STRATEGY_INDEX__DAILY_ORDER_COUNT},${STRATEGY_INDEX__DAILY_ONLINE_TIME},${STRATEGY_INDEX__DAILY_PEAK_TIME}`]: 7,
  }[indexListStr];
};

export const getStrategyIndexFromGuaranteedMode = mode => ({
  1: [STRATEGY_INDEX__DAILY_ORDER_COUNT],
  2: [STRATEGY_INDEX__DAILY_ONLINE_TIME],
  3: [STRATEGY_INDEX__DAILY_ORDER_COUNT, STRATEGY_INDEX__DAILY_ONLINE_TIME],
  4: [STRATEGY_INDEX__DAILY_PEAK_TIME],
  5: [STRATEGY_INDEX__DAILY_ORDER_COUNT, STRATEGY_INDEX__DAILY_PEAK_TIME],
  6: [STRATEGY_INDEX__DAILY_ONLINE_TIME, STRATEGY_INDEX__DAILY_PEAK_TIME],
  7: [STRATEGY_INDEX__DAILY_ORDER_COUNT, STRATEGY_INDEX__DAILY_ONLINE_TIME, STRATEGY_INDEX__DAILY_PEAK_TIME]
}[mode] || []);

export const getDefaultFormData = () => ({
  ruleId: null,
  ruleName: "",
  operationType: null,
  validBeginTime: "",
  validEndTime: "",
  businessType: null,
  appointAgent: 0,
  cityCode: null,
  agentList: [],
  agentInfoList: [],
  chooseAllOperators: false,
  showDriverGroup: false,
  /** 司机人群包 */
  crowdCodeList: [],
  /** 是否在任务中心展示 */
  toTask: 0,
  /** 规则描述 */
  richContent: "",
  driverTagList: [],
  /** 任务指标 */
  strategyIndex: [],
  /** 时间段设置 */
  strategyRuleList: [
    {
      /** 日在线时长配置列表 */
      durationConfigList: [getDefaultDurationConfig()],
      /** 日完单数 */
      dayOrderCount: "",
      /** 日保底金额 */
      guaranteedAmt: "",
      /** 日高峰总时长 */
      peakDuration: "",
      /** 日高峰总完单 */
      peakOrderCount: "",
      /** 日高峰在线时长配置列表 */
      durationPeakConfigList: [getDefaultDurationConfig()],      
    }    
  ],
});

export const useBiz = () => {
  const isEdit = ref(false);
  const { options } = injectBizData();
  const form = reactive(getDefaultFormData());
  const resetForm = () => {
    Object.assign(form, getDefaultFormData());
  };
  const formRules = {
    ruleName: {
      required: true,
      message: "请输入规则名称",
      trigger: "change",
    },
    strategyIndex: {
      required: true,
      message: "请选择保底门槛设置",
      trigger: "change",
    },
    dayOrderCount: [{
      required: true,
      message: "请输入日完单数",
      trigger: "change",
    }, {
      validator: (rule, value, callback) => {
        if (value === "") return callback();
        const errMsg = positiveIntegerValidate({
          defaultMessage: "请输入0-100的整数",
          min: 0,
          max: 100,
        }, value);
        if (errMsg) return callback(new Error(errMsg));
        return callback();
      },
      trigger: "change",
    }],
    peakDuration: [{
      required: true,
      message: "请输入日高峰总时长",
      trigger: "change",
    }, {
      validator: (rule, value, callback) => {
        if (value === "") return callback();
        const errMsg = positiveIntegerValidate({
          defaultMessage: "请输入整数",
          min: 0,
        }, value);
        if (errMsg) return callback(new Error(errMsg));
        return callback();
      }
    }],
    peakOrderCount: [{
      required: true,
      message: "请输入日高峰总完单",
      trigger: "change",
    }, {
      validator: (rule, value, callback) => {
        if (value === "") return callback();
        const errMsg = positiveIntegerValidate({
          defaultMessage: "请输入0-100的整数",
          min: 0,
          max: 100,
        }, value);
        if (errMsg) return callback(new Error(errMsg));
        return callback();
      },
      trigger: "change",
    }],
    guaranteedAmt: [{
      required: true,
      message: "请输入保底金额",
      trigger: "change",
    }, {
      validator: (rule, value, callback) => {
        if (value === "") return callback();
        const errMsg = positiveIntegerValidate({
          defaultMessage: "请输入整数",
          min: 0,
        }, value);
        if (errMsg) return callback(new Error(errMsg));
        return callback();
      },
      trigger: "change",
    }],
    validBeginTime: [{
      required: true,
      message: "请选择生效起始时间",
      trigger: "change",
    }, {
      validator: (rule, value, callback) => {
        if (!form.validBeginTime || !form.validEndTime) {
          callback();
        } else if (new Date(form.validBeginTime).getTime() > new Date(form.validEndTime).getTime()) {
          callback(new Error("结束时间不能早于起始时间"));
        } else {
          callback();
        }
      },
      trigger: "change",
    }],
    validEndTime: [
      {
        required: true,
        message: "请选择生效结束时间",
        trigger: "change",
      },
      {
        validator: (rule, value, callback) => {
          if (!form.validBeginTime || !form.validEndTime) {
            callback();
          } else if (new Date(form.validBeginTime).getTime() > new Date(form.validEndTime).getTime()) {
            callback(new Error("结束时间不能早于起始时间"));
          } else {
            callback();
          }
        },
        trigger: "change",
      },
    ],
    operationType: {
      required: true,
      message: "请选择运营模式",
      trigger: "change",
    },
    driverTagList: {
      required: true,
      message: "请选择司机类别",
      trigger: "change",
    },
    businessType: {
      required: true,
      message: "请选择业务类型",
      trigger: "change",
    },
    appointAgent: {
      required: true,
    },
    cityCode: {
      required: true,
      message: "请选择城市",
      trigger: "change",
    },
    agentList: {
      required: true,
      message: "选择城市后请选择运营商",
      trigger: "change",
    },
  };
  const { operatorList, loadCityOperatorList } = useOperators();

  const resetAgentList = () => {
    form.agentList = [];
    form.chooseAllOperators = false;
  };

  const configSet = (v) => ({
    startTime: moment(v.startTime).format("YYYY-MM-DD HH:mm:ss"),
    endTime: moment(v.endTime).format("YYYY-MM-DD HH:mm:ss"),
    onlineDuration: v.onlineDuration,
    durationOrderCount: v.durationOrderCount || 0,
  })

  const submitForm = async () => {
    const hasDurationConfigList = form.strategyIndex.includes(STRATEGY_INDEX__DAILY_ONLINE_TIME);
    const hasDayOrderCount = form.strategyIndex.includes(STRATEGY_INDEX__DAILY_ORDER_COUNT);
    const hasPeakDurationConfigList = form.strategyIndex.includes(STRATEGY_INDEX__DAILY_PEAK_TIME);
    let configList = [];
    // 勾选在线时长
    if (!hasDurationConfigList) {
      form.strategyRuleList.forEach((it, ix) =>{
        delete form.strategyRuleList[ix].durationConfigList;
      })      
    }
    if (!hasDayOrderCount) {
      form.strategyRuleList.forEach((it, ix) =>{
        delete form.strategyRuleList[ix].dayOrderCount;
      })
    }
    if (!hasPeakDurationConfigList) {
      form.strategyRuleList.forEach((it, ix) =>{
        delete form.strategyRuleList[ix].peakOrderCount;
        delete form.strategyRuleList[ix].peakDuration;
        delete form.strategyRuleList[ix].durationPeakConfigList;
      })     
    }
    const data = {
      ruleName: form.ruleName,
      operationType: form.operationType,
      businessType: form.businessType,
      appointAgent: form.appointAgent,
      cityCode: form.cityCode,
      cityName: getLabelFromValueLabelList(form.cityCode, options.cityList),
      agentList: form.agentList,
      richContent: form.richContent,
      toTask: form.toTask,
      crowdCodeList: form.crowdCodeList,
      ...(isEdit.value ? {
        ruleId: form.ruleId,
        driverTag: form.driverTag,
        ruleType: RULE_TYPE__SALARY_SAFEGUARD,
        validBeginTime: moment(form.validBeginTime).format("YYYY-MM-DD 00:00:00"),
        validEndTime: moment(form.validEndTime).format("YYYY-MM-DD 23:59:59"),
      } : {
        driverTagList: form.driverTagList,
        validBeginTime: moment(form.validBeginTime).format("YYYY-MM-DD 00:00:00"),
        validEndTime: moment(form.validEndTime).format("YYYY-MM-DD 23:59:59"),
      }),
      guaranteedMode: getGuaranteedModeFromStrategyIndex(form.strategyIndex),
      strategyRuleList: form.strategyRuleList
    };
    try {
      const api = isEdit.value ? updateCitySafeguard : addCitySafeguard;
      const res = await api(data);
      if (res?.data?.success) {
        return true;
      }
      callAlert(res?.data?.msg);
      return false;
    } catch (e) {
      callAlert("提交失败，请稍后再试");
      return false;
    }
  };

  provide(INJECT_KEY__SAFEGUARD_EDIT_MODAL, {
    isEdit,
    form,
    operatorList,

    loadCityOperatorList,
    resetAgentList,
  });

  return {
    isEdit,
    form,
    resetForm,
    formRules,

    submitForm,
  };
};

export const injectBiz = () => {
  const {
    isEdit, form, operatorList, loadCityOperatorList, resetAgentList,
  } = inject(INJECT_KEY__SAFEGUARD_EDIT_MODAL);

  return {
    isEdit,
    form,
    operatorList,

    loadCityOperatorList,
    resetAgentList,
  };
};

export const weekPickerOptions = {
  disabledDate: time => {
    const times = new Date(time).getTime();
    const today = moment(moment().add(1,'days').format("YYYY-MM-DD")).toDate();
    return times < Number(today);
  },
};

/** 检查日期时间区间列表有效性 */
export const checkTimeDurationList = dateList => {
  // 起始时间升序排列
  const list = dateList.sort(([startA], [startB]) => (Number(startA) > Number(startB) ? 1 : -1));
  return list.flat(1).every((v, index, l) => {
    if (index === 0) return true;
    return Number(v) > Number(l[index - 1]);
  });
};
