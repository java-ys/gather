// 状态列表
export const statusList = [
  { label: "生效中", value: 1 },
  { label: "已失效", value: -2 },
  { label: "未生效", value: 0},
];

export const statusMap = {
  '1' : '生效中',
  '-2' : '已失效',
  '0' : '未生效',
}

export const defaultParams = {
  strategyName: "",
  cityCodes: [],
  allUnSelectedVehicleTypes: [],
  effectiveTime: "",
}
