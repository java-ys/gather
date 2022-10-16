import { freeze } from "@/mixins/base";

export const commissionRule = freeze({
  commissionCycle: [
    {
      required: true,
      message: "请选择分佣周期",
    },
  ],
  commissionDimension: [
    {
      required: true,
      message: "请选择分佣维度",
    },
  ],
  statisticsDimension: [
    {
      required: true,
      message: "请选择统计维度",
    },
  ],
  calMode: [
    {
      required: true,
      message: "请选择分佣比例",
    },
  ],
})

export const isStr = v => typeof v === "string";
