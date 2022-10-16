<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-03 10:42:36
 * @Description:
-->
<template>
  <span :class="$style.wrapper">
    <Button v-hasAuth="permissions.view" size="small" @click="openView">查看</Button>
    <Button v-if="showEdit " v-hasAuth="permissions.switch" size="small" @click="openEdit">编辑</Button>
    <Button v-if="showEnable" v-hasAuth="permissions.switch" size="small" @click="delRow(1)">启用</Button>
    <Button v-if="showStop" v-hasAuth="permissions.switch" size="small" @click="delRow(2)">停用</Button>
    <!-- <Button v-if="showDelete" v-hasAuth="permissions.delete" size="small" @click="delRow">删除</Button> -->
  </span>
</template>
<script>
import { message, Modal } from "ant-design-vue";
import { ref, watch } from "@vue/composition-api";
import { useStrategyModalInject } from "./useStrategyModal";
import { noop, usePageBizInject } from "../biz";
import { vehicleGroupSetStatus, vehicleGroupDetail } from "../api";
import { STATUS__ACTIVATED, STATUS__TOACTIVATED, STATUS__DEACTIVATED } from "../const"
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
    // 根据返回车型信息 获取选中的数组
    const getSelectArr = (list = []) =>{
      let newArr = [
        ...list.map((it) =>{
          let levels = it.levels.map((item) =>{
            return  `${it.bizType}#${item.vehicleLevel}`
          })
          return levels;
        })
        .flat()
      ]
      return newArr;
    }
    const getdata = (type,id) =>{

    }
    const openModal = (type,id) =>{
      vehicleGroupDetail({ id })
        .then((res) => {
          if (res?.data?.code === 200 && res.data.success) {
            toggleLoading(false);
            const {
              groupVehicleList,
              groupStrategyList
            } = res.data.data
            const groupVehicleListStr = getListStr(groupVehicleList)
            const groupStrategyListStr = getListStr(groupStrategyList)
            let upgrades = res.data.data.upgrades? JSON.parse(res.data.data.upgrades) : {
              isPopup: 0,
              popUpLevels: [],
              popUpMsg: []
            }
            const popUpLevelsStr = getListStr(JSON.stringify(upgrades.popUpLevels))
            upgrades.popUpLevels = getSelectArr(upgrades.popUpLevels)
            let newgroupVehicleList = getSelectArr(JSON.parse(groupVehicleList))
            let newgroupStrategyList = getSelectArr(JSON.parse(groupStrategyList))
            let openMethod = type === 'edit' ? openEditModal : openViewModal
            openMethod({
              title: type === 'edit' ? "编辑车型组" : "详情",
              data: {
                ...res.data.data,
                ...upgrades,
                groupVehicleList:newgroupVehicleList,
                groupStrategyList:newgroupStrategyList,
                popUpLevelsStr,
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
    }
    const openEdit = () => {
      const { id } = props.row;
      toggleLoading(true);
      openModal('edit', id)
    };
    const openView = () => {
      const { id } = props.row;
      toggleLoading(true);
      openModal('detail', id)
    };
    const delRow = (status) => {
      const { id } = props.row;
      Modal.confirm({
        title: "请确认",
        content: status === 2 ? (h) => {
          return <p>确认停用该车型组?<br/>1、停用后该车型组将不可选<br/>2、已配置该车型组的城市可正常运营，如需删除请在开城管理中删除该车型组</p> } : `确认启用该车型组?`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          vehicleGroupSetStatus({ id, configStatus: status })
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
    const showEnable = ref(false);
    const showEdit = ref(false);
    const showStop = ref(false);
    watch(
      () => props.row,
      (_v) => {
        if (_v) {
          let v = { ..._v }
          const { configStatus } = v;
          if (configStatus === STATUS__TOACTIVATED) {
            showEnable.value = true
          } else {
            showEnable.value = false
          }
          if (configStatus === STATUS__ACTIVATED) {
            showStop.value = true
          } else {
            showStop.value = false
          }
          if (configStatus !== STATUS__DEACTIVATED) {
            showEdit.value = true
          } else {
            showEdit.value = false
          }

        }
      },
      { immediate: true }
    );

    return {
      permissions,
      openView,
      openEdit,
      delRow,
      showEnable,
      showEdit,
      showStop
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
