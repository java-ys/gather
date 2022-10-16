/*
 * @Descritption:
 * @Author: wucf
 * @Date: 2020-05-08 11:09:56
 * @LastEditors: wucf
 * @LastEditTime: 2020-05-08 16:49:16
 */

import { Tooltip } from "iview";

function renderTel(tel) {
  if (!tel || typeof tel !== "string") return "-";
  let pat = /(\d{3})\d*(\d{4})/;
  return tel.replace(pat, "$1****$2");
}

// table配置
export const returnFields = that => {
  return {
    index: {
      title: "序号",
      type: "index",
      width: 70,
      align: "center"
    },
    evaluateTime: {
      title: "评价时间",
      key: "evaluateTime",
      ellipsis: true,
      tooltip: true,
      width: 200
    },
    appVersion: {
      title: "应用版本",
      key: "appVersion",
      ellipsis: true,
      tooltip: true,
      width: 90
    },
    evaluateUser: {
      title: "评价用户",
      key: "evaluateUser",
      width: 160,
      render(h, params) {
        return (
          <Tooltip content={params.row.evaluateUser}>
            {renderTel(params.row.evaluateUser)}
          </Tooltip>
        );
      }
    },
    type: {
      title: "评价类型",
      key: "type",
      ellipsis: true,
      tooltip: true,
      width: 100,
      render(h, params) {
        return <span> {params.row.type === 1 ? "好评" : "差评"}</span>;
      }
    },
    description: {
      title: "评价内容",
      key: "description",
      minWidth: 200,
      tooltip: true,
      ellipsis: true,
      render(h, params) {
        return (
          <span title={params.row.description}>
            {params.row.description || "-"}
          </span>
        );
      }
    }
  };
};
export const searchData = {};
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
};
export const cacheData = {
  searchData,
  pageObj
};
