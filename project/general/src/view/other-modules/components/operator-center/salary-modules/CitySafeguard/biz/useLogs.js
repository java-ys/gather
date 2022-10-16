import { reactive } from "@vue/composition-api";
import Logs from "_o/components/operator-center/salary-modules/common/operateLogs.vue";
import { operationLogInfo } from "_o/api/salary/common";

export const useLogs = () => {
  const logProps = reactive({
    logVisible: false,
    logTableData: [],
    logTotalCount: 0,
    currentLog: "",
    currentId: "",
  });
  const prepareLogData = ({
    currPage,
    pageSize,
  } = {}) => {
    operationLogInfo({
      currPage: currPage || 1,
      pageSize: pageSize || 10,
      businessId: logProps.currentId,
    }).then(res => {
      if (res.data?.success && res.data.data?.list) {
        logProps.logTableData = res.data.data.list;
        logProps.totalCount = res.data.data.totalCount;
      } else {
        throw new Error();
      }
    }).catch(() => {
      logProps.logTableData = [];
      logProps.logTotalCount = 0;
    });
  };

  const logEvents = {
    closeDialogHandle: () => {
      logProps.logVisible = false;
    },
    handleLogsPage: params => {
      prepareLogData(params);
    },
  };

  const openLogTable = async ({ bizId, logName }) => {
    logProps.currentLog = logName;
    logProps.currentId = bizId;
    await prepareLogData();
    logProps.logVisible = true;
  };

  return {
    Logs,

    logProps,
    logEvents,

    openLogTable,
  };
};
