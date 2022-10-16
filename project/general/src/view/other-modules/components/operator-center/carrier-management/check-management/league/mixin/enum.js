/*
 * @Author: NapierPLUS
 * @Date: 2022-06-22 11:22:47
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-07-15 10:42:32
 * @Description:
 *
 */
import { productLineEnum, operateTypeEnum, tacticsEnum } from "@/config";
import { freeze } from "@/mixins/base";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: function () {
        return {}; // mold 1 考核流程 2 待办流程
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 是否是未提交状态
    isNotSubmit() {
      return this.detail.flowStatus === "HT_WTJ"
    },
    // 城市确认
    isCityConfirm() {
      return this.detail.flowStatus === "CS_QR";
    },
    // 总部确认
    isHeadConfim() {
      return this.detail.flowStatus === "ZB_SH";
    },
    // 考核待办流程
    toDone() {
      return this.detail.mold - 2 === 0;
    },
    // 考核流程管理
    doned() {
      return this.detail.mold - 1 === 0;
    },
    // 已处理申请单
    isFinish() {
      return this.detail.finish;
    },
    isChange() {
      return this.title === "变更考核标准"
    }
  },
  data() {
    return {
      productLineEnum,
      operateTypeEnum,
      tacticsEnum,
      validateRules: freeze({
        assessTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
            type: "array",
          },
        ],
      }),
    };
  },
  methods: {},
};
