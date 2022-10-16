export { default as Component } from "./Component.vue";

/** 组件展示状态——冻结账户 */
export const CONFIRM_TYPE__FREEZE = 1;
/** 组件展示状态——解冻账户 */
export const CONFIRM_TYPE__UNFREEZE = 2;

export const SETTINGS = {
  [CONFIRM_TYPE__FREEZE]: {
    hint: "确定冻结司机钱包账户吗？冻结后该司机将无法进行提现！包含网约车账户和达标计价账户",
    placeholder: "冻结原因",
  },
  [CONFIRM_TYPE__UNFREEZE]: {
    hint: "确定将司机钱包账户解冻吗？解冻后该司机可正常进行提现！",
    placeholder: "解冻原因",
  },
};
