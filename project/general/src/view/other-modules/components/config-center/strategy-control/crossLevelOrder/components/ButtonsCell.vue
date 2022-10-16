<template>
  <span :class="$style.wrapper">
    <Button v-if="isActivated" v-hasAuth="permissions.deactivate" type="primary" @click="deactivateStrategy">停用</Button>
    <Button v-else v-hasAuth="permissions.activate" @click="activateStrategy">启用</Button>
    <Button v-hasAuth="permissions.modify" @click="openModify">编辑</Button>
  </span>
</template>
<script>
import { message } from "ant-design-vue"
import {
  PERMISSION__ACTIVATE_STRATEGY,
  PERMISSION__DEACTIVATE_STRATEGY,
  PERMISSION__MODIFY_STRATEGY
} from "../const";
import { useStrategyModalInject } from "./useStrategyModal";
import { noop, toggleStrategy, usePageBizInject } from "../biz";
import { computed } from "@vue/composition-api";
import { STATUS__ACTIVATED } from "../fields";
import { getCrossLevelRule } from "../api";

export default {
  name: "ButtonCell",
  props: {
    row: Object
  },
  setup: (props) => {
    const permissions = {
      activate: PERMISSION__ACTIVATE_STRATEGY,
      deactivate: PERMISSION__DEACTIVATE_STRATEGY,
      modify: PERMISSION__MODIFY_STRATEGY
    }

    const isActivated = computed(() => props.row.statusFlag === STATUS__ACTIVATED)

    const { openModifyModal } = useStrategyModalInject()
    const { reloadPage, toggleLoading } = usePageBizInject()
    const openModify = () => {
      toggleLoading(true)
      getCrossLevelRule(props.row.id).then(res => {
        if (res?.data?.code === 200 && res.data.success) {
          res.data.data.orderTypes.forEach(item => { item.itemCode = String(item.itemCode) })
          console.log(res.data.data)
          openModifyModal({
            title: "修改",
            data: res.data.data
          })
        }
      }).catch(noop).finally(() => {
        toggleLoading(false)
      })
    }
    const activateStrategy = () => {
      toggleLoading(true)
      toggleStrategy(props.row, true).finally(() => {
        message.success("操作成功")
        toggleLoading(false);
        reloadPage();
      })
    }
    const deactivateStrategy = () => {
      toggleLoading(true)
      toggleStrategy(props.row, false).finally(() => {
        message.success("操作成功")
        toggleLoading(false);
        reloadPage();
      })
    }

    return {
      permissions,
      isActivated,
      openModify,
      activateStrategy,
      deactivateStrategy
    }
  }
}
</script>
<style lang="less" module>
.wrapper {
  button:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
