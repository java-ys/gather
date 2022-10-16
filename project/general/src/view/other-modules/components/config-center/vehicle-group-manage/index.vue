<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:22
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-02-25 11:12:31
 * @Description:
-->
<template>
  <div>
    <SearchList
      v-bind="inputListProp"
      @on-search="handleSearch"
      @on-reset="handleReset"
      @on-change="selectOrInput"
    ></SearchList>
    <Button
      v-hasAuth="'vehicle-group-manage-add'"
      type="primary"
      @click="openCreateModal"
    >
      新增车型组
    </Button>
    <m2-table
      class="top15"
      v-bind="tableProps"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
    <component :is="StrategyModal" />
  </div>
</template>
<script>
import { usePageBiz, useSearchInput } from "./biz";
import { useStrategyModal } from "./components/useStrategyModal";
import { computed, reactive } from "@vue/composition-api";
import m2Table from "_a/m2-table/v-table";
export default {
  name: "VehicleGroup",
  components: {
    m2Table
  },
  setup: (props, { root }) => {
    // store
    const state = root.$store.state
    const states = reactive({
      // 获取 store 中的值
      bizTypeList: computed(() => state.common.bizTypeList),
      businessGradeList: computed(() => state.common.businessGradeList),
      carLevelList: computed(() => state.common.carLevelList),
    })
    const { tableProps, form, queryList, reloadPage } = usePageBiz({ ...states });
    const { inputListProp } = useSearchInput();

    // 查询函数
    const handleReset = async () => {
      Object.keys(form).forEach(keys => {
        form[keys] = undefined
      })
      await queryList();
    };
    const handleSearch = async (data) => {
      Object.keys(form).forEach(keys => {
        if (data[keys] !== "-1") { form[keys] = data[keys] }
        else {
          form[keys] = undefined
          delete data[keys]
        }
      })
      await queryList(data);
    };
    const changePage = async (currPage) => {
      await queryList({ currPage, ...form });
    };
    const changePageSize = async (pageSize) => {
      await queryList({ pageSize, ...form });
    };
    const { Component: StrategyModal, openCreateModal } = useStrategyModal({
      pageReloadFn: reloadPage,
    });
    const selectOrInput = (a, b, c) => {
      console.log(a, b, c)
    }
    queryList();
    return {
      tableProps,
      inputListProp,
      changePage,
      changePageSize,
      handleSearch,
      handleReset,
      openCreateModal,
      StrategyModal,
      selectOrInput
    };
  },
};
</script>
<style lang="less"></style>
