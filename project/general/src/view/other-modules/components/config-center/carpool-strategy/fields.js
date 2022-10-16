import { mapToList } from "@/libs/util.js";

export const statusMap = {
  0: "未生效",
  1: "生效中",
  "-2": "已失效",
};

export const statusList = [
  {value: 0, label: "未生效"},
  {value: 1, label: "生效中"},
  {value: -2, label: "已失效"},
];

export const carpoolSceneMap = {
  1: "特快拼车"
}

export const carpoolScenes = [
  {
    value: 1,
    label: "特快拼车",
  },
];

export const parColumns = (that) => [
  {
    title: "序号",
    // type: "index",
    align: "center",
    // tooltip: true,
    width: 80,
    render: (h, params) => {
      return h("span", (that.current - 1) * that.pageSize + params.index + 1 )
    }
  },
  {
    title: "名称",
    key: "ruleName",
    tooltip: true,
    ellipsis: true,
    minWidth: 100,
  },
  {
    title: "城市",
    minWidth: 60,
    render: (h, params) => {
      return h("div", `${params.row.provinceName || ""}/${params.row.cityName || ""}` )
    }
  },
  {
    title: "拼车场景",
    key: "scene",
    tooltip: true,
    ellipsis: true,
    minWidth: 60,
    render: (h, params) => {
      return h("div", carpoolSceneMap[params.row.scene]);
    }
  },
  {
    title: "生效日期",
    minWidth: 120,
    render: (h, params) => {
      return h("div", `${params.row.effectiveTime || ""}～${params.row.failureTime || ""}` )
    }
  },
  {
    title: "状态",
    key: "status",
    tooltip: true,
    ellipsis: true,
    width: 100,
    render: (h, params) => {
      return h("div", statusMap[params.row.status]);
    }
  },
  {
    title: "操作",
    key: "action",
    tooltip: true,
    fixed: "right",
    width: 300,
    slot: "action"
  },
];
