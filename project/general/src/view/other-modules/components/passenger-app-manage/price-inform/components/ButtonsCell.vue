<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-25 13:58:41
 * @Description:
-->
<template>
  <span :class="$style.wrapper">
    <Button size="small" ghost type="primary" @click="openEdit">编辑</Button>
    <Button size="small" @click="openView">详情</Button>
    <Button v-if="showStop" ghost type="error" size="small" @click="delRow">删除</Button>
  </span>
</template>
<script>
import { message, Modal } from "ant-design-vue";
import { ref, watch } from "@vue/composition-api";
import { useStrategyModalInject } from "./useStrategyModal";
import { noop, usePageBizInject } from "../biz";
import { vehicleGroupSetStatus, specialExpensesNoticeDetail, specialExpensesNoticeDelete } from "../api";
import { STATUS__ACTIVATED, STATUS__TOACTIVATED } from "../const"
export default {
  name: "ButtonCell",
  props: {
    row: Object,
  },
  setup: (props) => {
    const permissions = {
      view: "vehicle-group-manage-view",
      switch: "vehicle-group-manage-switch",
    }
    const { openViewModal,openEditModal } = useStrategyModalInject();
    const { reloadPage, toggleLoading } = usePageBizInject();
    const getListStr = (list = "[]") => {
      let groupVehicleList = JSON.parse(list);
      return [...groupVehicleList.map(it => {
        let list = it.levels.map(item => {
          return `${it.bizTypeName}-${item.vehicleName}`
        })
        return list
      }).flat()].join("、")
    }
    const openView = () => {
      const { id } = props.row;
      toggleLoading(true);
      specialExpensesNoticeDetail({ id })
        .then((res) => {
          if (res?.data?.code === 200 && res.data.success) {
            toggleLoading(false);
            const {
              groupVehicleList,
              groupStrategyList
            } = res.data.data
            const groupVehicleListStr = getListStr(groupVehicleList)
            const groupStrategyListStr = getListStr(groupStrategyList)
            openViewModal({
              title: "详情",
              data: {
                ...res.data.data,
                groupVehicleListStr,
                groupStrategyListStr
              },
            });
          }
        })
        .catch(noop)
        .finally(() => {
          toggleLoading(false);
        });
    };
    const openEdit = () => {
      const { id } = props.row;
      toggleLoading(true);
      specialExpensesNoticeDetail({ id })
        .then((res) => {
          if (res?.data?.code === 200 && res.data.success) {
            toggleLoading(false);
            const {
              groupVehicleList,
              groupStrategyList
            } = res.data.data
            const groupVehicleListStr = getListStr(groupVehicleList)
            const groupStrategyListStr = getListStr(groupStrategyList)
            openEditModal({
              title: "详情",
              data: {
                ...res.data.data,
                groupVehicleListStr,
                groupStrategyListStr
              },
            });
          }
        })
        .catch(noop)
        .finally(() => {
          toggleLoading(false);
        });
    };
    const delRow = () => {
      const { id } = props.row;
      Modal.confirm({
        title: "请确认",
        content:  (h) => {
          return <p>删除</p> } ,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          specialExpensesNoticeDelete({ id })
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
    const showStop = ref(false);
    watch(
      () => props.row,
      (_v) => {
        if (_v) {
          let v = { ..._v }
          const { cityCode } = v;
          if (cityCode !== '0') {
            showStop.value = true
          } else {
            showStop.value = false
          }
        }
      },
      { immediate: true }
    );

    return {
      permissions,
      openView,
      delRow,
      showStop,
      openEdit
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
