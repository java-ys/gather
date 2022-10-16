<template>
  <div>
    <div>
      <div :class="$style.searchInputItem">
        <span :class="$style.searchInputLabel">城市：</span>
        <a-select v-model="form.cityCode" placeholder="请选择" allowClear style="width: 150px" :filterOption="selectFilterFn" showSearch @change="onCityCodeChange">
          <a-select-option v-for="v in cityList" :key="v.value" :value="v.value">{{v.label}}</a-select-option>
        </a-select>
      </div>
      <div :class="$style.searchInputItem">
        <span :class="$style.searchInputLabel">区县：</span>
        <a-select v-model="form.district" placeholder="请选择" allowClear :disabled="!hasChooseCity" style="width: 150px" :filterOption="selectFilterFn" showSearch @change="changeArea">
          <a-select-option v-for="v in currentAreaList" :key="v.value" :value="v.value">{{v.label}}</a-select-option>
        </a-select>
      </div>
      <div :class="$style.searchInputItem">
        <span :class="$style.searchInputLabel">产品线：</span>
        <a-select v-model="form.productLineCode" placeholder="请选择" allowClear :disabled="!hasChooseCity" style="width: 150px" @change="onProductLineCodeChange">
          <a-select-option v-for="v in productLineList" :key="v.value" :value="v.value">{{v.label}}</a-select-option>
        </a-select>
      </div>
      <div :class="$style.searchInputItem">
        <span :class="$style.searchInputLabel">车型等级：</span>
        <a-select v-model="form.defaultCarLevelCode" placeholder="请选择" allowClear :disabled="!hasChooseProductLine" style="width: 150px">
          <a-select-option v-for="v in carLevelList" :key="v.value" :value="v.value">{{v.label}}</a-select-option>
        </a-select>
      </div>
      <div :class="$style.searchInputItem">
        <span :class="$style.searchInputLabel">状态：</span>
        <a-select v-model="form.statusFlag" placeholder="请选择" allowClear style="width: 150px">
          <a-select-option v-for="v in statusList" :key="v.value" :value="v.value">{{v.label}}</a-select-option>
        </a-select>
      </div>
      <div :class="$style.searchInputItem">
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">清空</a-button>
      </div>
    </div>
    <a-button v-hasAuth="createBtnAuth" type="primary" @click="openCreateModal">
      新建策略
    </a-button>
    <VTable
      v-bind="tableProps"
      class="top20"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
    <component :is="StrategyModal" />
  </div>
</template>
<script>
import { usePageBiz, useSearchInput } from "./biz";
import { useStrategyModal } from "./components/useStrategyModal";
import { computed, ref } from "@vue/composition-api";
import { getNewBusinessLine, getNewCarLevelList, callAreaInfoByCityCode } from "_gc/status-map";

export default {
  name: "CrossLevelOrder",
  components: {
  },
  setup: () => {
    const {
      cityList,
      statusList,
      createBtnAuth,
      handlerSearchInputChange,
      getCarLevelText,
      getProductLineText,
    } = useSearchInput()
    const currentAreaList = ref([])
    const productLineList = ref(getNewBusinessLine().list)
    const carLevelList = ref([])
    const { tableProps, form, queryList, reloadPage } = usePageBiz({ getCarLevelText, getProductLineText })
    const hasChooseCity = computed(() => !!form.cityCode)
    const hasChooseProductLine = computed(() => !!form.productLineCode)
    const selectFilterFn = (input, option) => {
      return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
    }
    const onSearchInputChange = (value, key) => handlerSearchInputChange({ key, value })
    const onCityCodeChange = cityCode => {
      form.defaultCarLevelCode = undefined;
      if (cityCode) {
        queryArea(cityCode)
      } else {
        form.cityCode = undefined
      }
    }
    const queryArea = cityCode => {
      form.district = ""
      currentAreaList.value = []
      callAreaInfoByCityCode(cityCode, list => { currentAreaList.value = list })
    }
    const changeArea = areaCode => {
      form.district = areaCode
    }
    const onProductLineCodeChange = (productLineCode) => {
      form.defaultCarLevelCode = undefined
      if (productLineCode) {
        carLevelList.value = getNewCarLevelList(productLineCode).list;
      }
    }

    const handleReset = async () => {
      form.cityCode = undefined;
      form.productLineCode = undefined;
      form.defaultCarLevelCode = undefined;
      form.statusFlag = undefined;
      form.district = ""
      await queryList()
    }
    const handleSearch = async () => {
      await queryList()
    }
    const changePage = async (currPage) => {
      await queryList({ currPage })
    }
    const changePageSize = async (pageSize) => {
      await queryList({ pageSize })
    }
    const { Component: StrategyModal, openCreateModal } = useStrategyModal({ pageReloadFn: reloadPage })

    queryList()

    return {
      form,
      cityList,
      productLineList,
      carLevelList,
      statusList,
      hasChooseCity,
      hasChooseProductLine,
      selectFilterFn,
      onCityCodeChange,
      onProductLineCodeChange,

      handleSearch,
      handleReset,
      tableProps,
      changePage,
      changePageSize,

      createBtnAuth,
      StrategyModal,
      openCreateModal,

      onSearchInputChange,

      currentAreaList,
      queryArea,
      changeArea
    }
  }
}
</script>
<style lang="less" module>
.searchInputItem {
  display: inline-block;
  margin: 0 35px 20px 0;

  button {
    margin-right: 16px;
  }
}
.searchInputLabel {
  min-width: 70px;
}
</style>
