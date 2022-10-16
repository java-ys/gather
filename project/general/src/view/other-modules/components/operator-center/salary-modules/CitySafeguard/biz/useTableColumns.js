import moment from "moment";
import $style from "../styles/index.module.scss";
import {
  BUSINESS_TYPE_MAPPINGS,
  OPERATION_TYPE_MAPPINGS,
  RULE_STATE_MAPPINGS,
} from "./consts";
import { getYearWeek } from "_o/common/common";
import ListOperationCell from "../components/ListOperationCell.vue";

export const useTableColumns = ({
  getDriverTagLabel,
}) => {
  const tableColumns = [
    {
      key: "ruleCode", label: "业务代码", minWidth: "150px", prop: "ruleCode",
    },
    {
      key: "ruleName", label: "规则名称", minWidth: "120px", prop: "ruleName",
    },
    {
      key: "city", label: "城市", minWidth: "120px", prop: "cityName",
    },
    {
      key: "agent",
      label: "运营商",
      minWidth: "140px",
      render: ({ row }) => {
        const content = (row.agentInfoList || []).map(({ agentName }) => agentName).join(" ,");
        const contentDom = <p><span>{content}</span></p>;
        return (
          <el-popover trigger="hover" placement="top">
            {contentDom}
            <div slot="reference" class={$style.operationWrapper}>
              {contentDom}
            </div>
          </el-popover>
        );
      },
    },
    {
      key: "businessType", label: "产品线", minWidth: "100px", render: ({ row }) => BUSINESS_TYPE_MAPPINGS[row.businessType],
    },
    {
      key: "driverTag",
      label: "司机工资类别",
      minWidth: "100px",
      render: ({ row }) => getDriverTagLabel(row.driverTag),
    },
    {
      key: "crowdCodeList",
      label: "司机人群包任务",
      minWidth: "120px",
      render: ({ row }) => row.crowdCodeList.length === 0 ? '否' : '是',
    },    
    {
      key: "operationType",
      label: "运营模式",
      minWidth: "140px",
      render: ({ row }) => OPERATION_TYPE_MAPPINGS[row.operationType],
    },
    {
      key: "activateTime",
      label: "生效时间",
      minWidth: "200px",
      render: ({ row }) => `${moment(row.validBeginTime).format("YYYY-MM-DD")} ~ ${moment(row.validEndTime).format("YYYY-MM-DD")}`,
    },
    {
      key: "ruleStatus",
      label: "状态",
      render: ({ row }) => RULE_STATE_MAPPINGS[row.ruleStatus],
    },
    {
      key: "auditPassedTime", label: "审批通过时间", minWidth: "150px", prop: "auditPassedTime",
    },
    {
      key: "ops",
      label: "操作",
      width: "300px",
      render: ({ row }) => <ListOperationCell record={row} />,
    },
  ];

  return {
    tableColumns,
  };
};
