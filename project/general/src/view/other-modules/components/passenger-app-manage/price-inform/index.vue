<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:22
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-28 10:44:09
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
    <h4>本页面用于配置乘客端（APP/小程序）确认用车页面的费用告知。</h4>
    <h4>兜底为全国的默认配置，各城市有独立配置时取各城市的配置费用告知。</h4>
    <br>
    <Button
      v-hasAuth="'vehicle-group-manage-add'"
      type="primary"
      @click="openCreateModal"
    >
      新建策略
    </Button>
    <div class="table-content">
      <m2-table
      class="top15"
      style="width: 70%"
      v-bind="tableProps"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
      <img
        class="right"
        src="../../../assets/images/inform_1.png"
        alt=""
      >
      <img
        class="right"
        src="../../../assets/images/inform_2.png"
        alt=""
      >
    </div>
    <component :is="StrategyModal" />
  </div>
</template>
<script>
import { usePageBiz, useSearchInput } from "./biz";
import { useStrategyModal } from "./components/useStrategyModal";
import { computed, reactive, watch } from "@vue/composition-api";
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
      cityList: computed(() => [{label:"全国",value:"0"},...state.common.authCityList]),
    })
    const { tableProps, form, queryList, reloadPage } = usePageBiz({ ...states });
    const { inputListProp,setInputDropList } = useSearchInput();
    root.$store.dispatch("getAuthCityList");
    setInputDropList("cityCode", states.cityList)
    watch(
      () => states.cityList,
      (count) => {
        setInputDropList("cityCode", count)
      }
    )
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
<style lang="less">
.table-content {
  display: flex;
  width: 100%;
  align-items: flex-start;
  .right {
    display:block;
    width: 15%;
    height: auto;
  }
}
</style>
