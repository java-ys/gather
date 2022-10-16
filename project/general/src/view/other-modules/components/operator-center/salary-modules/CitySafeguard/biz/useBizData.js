import {
  inject,
  provide,
  reactive,
  ref,
} from "@vue/composition-api";
import Vue from "vue";
import moment from "moment";
import { useCityList } from "./useCityList";
import { useDriverTags } from "./useDriverTags";
import {
  BUSINESS_TYPE_LIST_ALL,
  LOCAL_DATA__VALUE_ITEM_ALL,
  OPERATION_TYPE_LIST_ALL,
  RULE_STATE_LIST,
} from "./consts";
import { useLogs } from "./useLogs";
import {
  callSubmitAudit,
  deactivateSalaryRules,
  deleteCitySafeguard,
  fetchCitySafeguardList,
  queryCitySafeguard,
} from "../api";
import {
  useTableColumns,
} from "./useTableColumns";
import {
  BTN_KEY__AUDIT,
  BTN_KEY__CANCEL_AUDIT,
  BTN_KEY__DEACTIVATE,
  BTN_KEY__DEL,
  BTN_KEY__EDIT,
  BTN_KEY__LOG,
  BTN_KEY__SUBMIT_AUDIT,
  BTN_KEY__VIEW,
} from "_o/components/operator-center/salary-modules/CitySafeguard/components/useListOperationCell";
import { getCurrSunday } from "_o/common/salaryMixin";
import {
  cancelAudit, passAudit, refusedAudit,
} from "_o/api/salary/common";
import { approval } from "_o/components/operator-center/salary-modules/components";
import {
  callAlert,
  callConfirm,
  callMessageError,
  callMessageInfo,
  callMessageSuccess,
} from "../uiUtils";
import { getUserIdFromLocalStorage } from "_o/common/common";

const BIZ_DATA__INJECT_KEY = "CitySafeguardData";
const BIZ_METHODS__INJECT_KEY = "CitySafeguardMethods";

export const loadRuleData = async ruleId => {
  try {
    const res = await queryCitySafeguard({ ruleId });
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    callMessageError(res?.data?.msg || "查询失败，请稍后再试");

    return null;
  } catch (e) {
    callMessageError("查询失败，请稍后再试");
    return null;
  }
};

const getInitialFilters = () => ({
  cityCode: null,
  businessType: null,
  ruleName: "",
  driverTag: null,
  operationType: null,
  validBeginTime: null,
  validEndTime: null,
  ruleStatus: null,
});

const deleteRule = async ruleId => {
  try {
    const res = await deleteCitySafeguard({ ruleId });
    if (res?.data?.success) {
      callMessageSuccess(res.data.msg);
      return true;
    }
    callMessageError(res?.data?.msg || "操作失败，请稍后再试");
  } catch (e) {
    callMessageError("操作失败，请稍后再试");
  }
  return false;
};

const deactivateRule = record => {
  const getConfirmText = () => {
    const { ruleName } = record;
    let text = "";
    const date = new Date();
    if (
      date.getTime() > new Date(record.validBeginTime).getTime()
      && date.getTime() < new Date(record.validEndTime).getTime()
    ) {
      const endDateStr = moment(new Date()).format("YYYY-MM-DD");
      text = `是否停用${record.ruleName}规则? 此规则将在${endDateStr}后停用`;
    } else if (date.getTime() < new Date(record.validBeginTime).getTime()) {
      text = `由于此规则未进行,数据将进行删除处理,是否停用${ruleName}?`;
    }
    return text;
  };
  const callDeactivateRule = async () => {
    try {
      const res = await deactivateSalaryRules({
        ruleId: record.id,
      });
      if (res?.data?.success) {
        callMessageSuccess(res.data.msg);
        return true;
      }
      callMessageError(res?.data?.msg || "操作失败，请稍后再试");
    } catch (e) {
      callAlert("规则停用失败");
    }
    return false;
  };
  return new Promise(resolve => {
    callConfirm(getConfirmText(), "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: "warning",
    }).then(() => {
      callDeactivateRule().then(success => {
        resolve(success);
      });
    }).catch(() => {
      callMessageInfo("操作已取消");
      resolve(false);
    });
  });
};

const cancelAuditRule = record => new Promise(resolve => {
  callConfirm("确定取消审核吗?", "取消审核", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      cancelAudit({ auditOptionsType: 1, optionId: record.id }).then(res => {
        if (res.data.success) {
          callMessageSuccess("取消成功!");
          resolve(true);
        } else {
          callMessageError(res.data.msg);
          resolve(false);
        }
      });
    })
    .catch(() => {
      callMessageInfo("已取消");
      resolve(false);
    });
});

export const useBizData = ({ modalHandler, listPageHandler }) => {
  const userId = getUserIdFromLocalStorage();
  const legacyModalRuleId = ref(null);
  const {
    openLogTable,
    ...useLogsRest
  } = useLogs();
  const { cityList, cityListWithAllOption } = useCityList();
  const { driverTags, getLabelFromValue: getDriverTagLabel } = useDriverTags();
  const { tableColumns } = useTableColumns({
    getDriverTagLabel,
  });
  const options = reactive({
    cityList,
    cityListWithAllOption,
    driverTags,
    operationTypeList: OPERATION_TYPE_LIST_ALL,
    ruleStateList: RULE_STATE_LIST,
    businessTypeList: BUSINESS_TYPE_LIST_ALL,
  });

  const filters = reactive(getInitialFilters());

  provide(BIZ_DATA__INJECT_KEY, {
    options,
    filters,
  });

  const resetFilters = () => {
    Object.assign(filters, getInitialFilters());
  };

  const getFiltersForQuery = () => {
    const _filters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== "" && filters[key] != null && filters[key] !== LOCAL_DATA__VALUE_ITEM_ALL) {
        _filters[key] = filters[key];
      }
    });
    if (filters.validBeginTime) {
      _filters.validBeginTime = moment(filters.validBeginTime).format("YYYY-MM-DD");
    }
    if (filters.validEndTime) {
      _filters.validEndTime = moment(filters.validEndTime).format("YYYY-MM-DD");
    }
    return _filters;
  };

  const getList = async ({ pageSize, currentPage }) => {
    try {
      const res = await fetchCitySafeguardList({
        userUuid: userId,
        isDesc: "true",
        sortColumnName: "create_time",
        pageSize,
        currPage: currentPage,
        ...getFiltersForQuery(),
      });
      if (res?.data?.success && res.data.data) {
        return {
          currentPage,
          total: res.data.data.totalCount,
          list: res.data.data.list || [],
        };
      }

      callAlert(res.data.msg);
      return {
        currentPage,
        total: 0,
        list: [],
      };
    } catch (e) {
      //
    }
    return {
      currentPage,
      total: 0,
      list: [],
    };
  };

  const approvalSubmit = list => {
    callSubmitAudit(list).then(res => {
      if (res.data.success) {
        approval.audit.visible = false;
        callMessageSuccess(res.data.msg);
        listPageHandler.loadList();
      } else {
        callMessageError(res.data.msg);
      }
    });
  };

  const reviewSubmit = data => {
    const params = {
      auditOptionsType: 1,
      optionId: legacyModalRuleId.value,
      remark: data.remark,
    };
    if (data.reviewStatus === "1") {
      passAudit(params).then(res => {
        approval.audit.dialogVisible = false;
        if (res.data.success) {
          callMessageSuccess("提交成功");
          listPageHandler.loadList({ currentPage: 1 });
        } else {
          callMessageError(res.data.msg);
        }
      });
    }
    if (data.reviewStatus === "2") {
      refusedAudit(params).then(res => {
        approval.audit.dialogVisible = false;
        if (res.data.success) {
          callMessageSuccess("提交成功");
          listPageHandler.loadList({ currentPage: 1 });
        } else {
          callMessageError(res.data.msg);
        }
      });
    }
  };

  const clickOpsBtnHandler = (key, record) => {
    switch (key) {
      case BTN_KEY__SUBMIT_AUDIT:
        legacyModalRuleId.value = String(record.id);
        // approval.audit.visible = true;
        callConfirm("确定提交至OA审批吗", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(() => {
          approvalSubmit({ auditOptionsType: 1, optionId: record.id });
        })        
        break;
      case BTN_KEY__CANCEL_AUDIT:
        cancelAuditRule(record).then(st => {
          if (st) listPageHandler.loadList();
        });
        break;
      case BTN_KEY__AUDIT:
        legacyModalRuleId.value = String(record.id);
        approval.audit.dialogVisible = true;
        break;
      case BTN_KEY__EDIT:
        modalHandler.openEditModal(record.id);
        break;
      case BTN_KEY__DEACTIVATE:
        deactivateRule(record).then(st => {
          if (st) listPageHandler.loadList();
        });
        break;
      case BTN_KEY__VIEW:
        modalHandler.openViewModal(record.id);
        break;
      case BTN_KEY__DEL:
        deleteRule(record.id).then(st => {
          if (st) listPageHandler.loadList();
        });
        break;
      case BTN_KEY__LOG:
        openLogTable({
          bizId: record.id,
          logName: record.ruleName,
        });
        break;
      default:
        break;
    }
  };

  provide(BIZ_METHODS__INJECT_KEY, {
    openLogTable,
    clickOpsBtnHandler,
    getDriverTagLabel,
  });

  return {
    legacyModalRuleId,
    approvalSubmit,
    reviewSubmit,

    options,
    tableColumns,
    clickOpsBtnHandler,
    filters,

    ...useLogsRest,
    resetFilters,
    getList,
    getDriverTagLabel,
  };
};

export const injectBizData = () => {
  const {
    options,
    filters,
  } = inject(BIZ_DATA__INJECT_KEY);

  const {
    openLogTable,
    clickOpsBtnHandler,
    getDriverTagLabel,
  } = inject(BIZ_METHODS__INJECT_KEY);

  return {
    options,
    filters,

    bizMethods: {
      openLogTable,
      clickOpsBtnHandler,
      getDriverTagLabel,
    },
  };
};
