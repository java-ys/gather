import { freeze } from "@/mixins/base";

export const rules = freeze({
  strategyName: [
    {
      required: true,
      message: "请输入任务名称",
    },
  ],
  cityCodes: [
    {
      type: "array",
      required: true,
      message: "请选择城市",
    },
  ],
  effectiveTime: [
    {
      required: true,
      message: "请选择日期",
    },
  ],
  allUnSelectedVehicleTypes: [
    {
      type: "array",
      required: true,
      message: "请选择车型",
    },
  ],
});
