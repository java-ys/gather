<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-03 10:44:56
 * @Description:
-->
<template>
  <span :class="$style.wrapper">
    <Button v-if="showDelete" v-hasAuth="permissions.delete" size="small" @click="delRow">删除</Button>
    <Button v-hasAuth="permissions.modify" size="small" @click="openView">详情</Button>
    <Button v-hasAuth="permissions.copy" size="small" @click="openCopy">复制</Button>
  </span>
</template>
<script>
import { message, Modal } from "ant-design-vue";
import { ref } from "@vue/composition-api";
import { useStrategyModalInject } from "./useStrategyModal";
import { noop, usePageBizInject } from "../biz";
import { viewPremiumStrategy, deletePremiumStrategy } from "_o/api/priceCenter";

export default {
  name: "ButtonCell",
  props: {
    row: Object,
  },
  setup: (props) => {
    const permissions = {
      delete: "dynamic-premium-delete",
      modify: "dynamic-premium-detail",
      copy: "dynamic-premium-copy"
    }
    const { openViewModal, openCopyModal } = useStrategyModalInject();
    const { reloadPage, toggleLoading } = usePageBizInject();
    const openView = () => {

      const { uuid, floatUuid } = props.row;
      // if(floatUuid === "" ||!floatUuid){
      //   message.info('此数据不支持查看详情')
      //   return
      // }
      toggleLoading(true);
      viewPremiumStrategy({ uuid, floatUuid })
        .then((res) => {
          if (res?.data?.code === 200 && res.data.success) {
            toggleLoading(false);
            openViewModal({
              title: "详情",
              data: res.data.data,
            });
          }
        })
        .catch(noop)
        .finally(() => {
          toggleLoading(false);
        });
    };
    const delRow = () => {
      const { uuid, floatUuid } = props.row;
      Modal.confirm({
        title: "请确认",
        content: "删除策略",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          deletePremiumStrategy({ uuid, floatUuid })
            .then((res) => {
              if (res?.data?.code === 200 && res.data.success) {
                message.success("操作成功")
                reloadPage()
              }
            })
            .catch(noop)
            .finally(() => {
              toggleLoading(false);
            });
        },
      });
    };
    const openCopy = () => {
      const { uuid, floatUuid } = props.row;
      // if(floatUuid === "" ||!floatUuid){
      //   message.info('此数据不支持查看详情')
      //   return
      // }
      toggleLoading(true);
      viewPremiumStrategy({ uuid, floatUuid })
        .then((res) => {
          if (res?.data?.code === 200 && res.data.success) {
            toggleLoading(false);
            let data = res.data.data
            openCopyModal({
              title: "复制动态溢价策略",
              data,
            });
          }
        })
        .catch(noop)
        .finally(() => {
          toggleLoading(false);
        });
    }
    const showDelete = ref(false);
    const { status } = props.row;
    if (status !== 1) {
      showDelete.value = true
    }
    return {
      permissions,
      openView,
      delRow,
      showDelete,
      openCopy
    };
  },
};
</script>
<style lang="less" module>
.wrapper {
  button:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
