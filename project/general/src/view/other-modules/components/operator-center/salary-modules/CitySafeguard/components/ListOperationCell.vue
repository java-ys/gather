<template>
  <div>
    <el-button
      v-for="btn in btns"
      :key="btn.key"
      v-preventReClick="3000"
      size="small"
      type="text"
      @click="clickOpsBtnHandler(btn.key, record)"
    >
      {{btn.text}}
    </el-button>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
import _debounce from "lodash.debounce";
import { operationBtns } from "./useListOperationCell";
import { hasPermission } from "_o/common/common";
// eslint-disable-next-line import/no-cycle
import { injectBizData } from "../biz/useBizData";

const universalHasPermission = v => (!v || hasPermission(v));
const btnVisibleFn = (btnConfig, record) => (btnConfig.visibleFn ? btnConfig.visibleFn(record) : true);

export default {
  name: "ListOperationCell",
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  setup: props => {
    const btns = computed(() => operationBtns.filter(btnConfig => {
      const st = universalHasPermission(btnConfig.permission) && btnVisibleFn(btnConfig, props.record);
      return st;
    }));

    const { bizMethods: { clickOpsBtnHandler }} = injectBizData();

    return {
      btns,
      clickOpsBtnHandler: _debounce(clickOpsBtnHandler, 3000, { leading: true }),
    };
  },
};
</script>
