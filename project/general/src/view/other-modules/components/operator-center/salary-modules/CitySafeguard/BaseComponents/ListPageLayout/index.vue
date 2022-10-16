<template>
  <div class="app-container">


    <div :class="$style.filterZone">
      <slot name="filterZone" />
    </div>

    <div v-if="hasAdditionBtnZone" :class="$style.additionBtnZone">
      <slot name="additionBtnZone" />
    </div>
    <div :class="$style.tableZone">
      <ElPaginationTable
        :loading="loading"
        :headerCellStyle="{ background: '#F5F4F2' }"
        v-bind="tableProps"
        :data="data"
        :pagination="pagination"
        :columns="tableColumns"
      />
    </div>
    <slot />
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  reactive,
  ref,
} from "@vue/composition-api";
import ElPaginationTable from "../pagination-table";
import { isFn, isPromise } from "../../utils";

export default defineComponent({
  name: "ListPageLayout",
  props: {
    titleList: {
      type: Array,
      default: () => [],
    },
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    tableColumns: {
      type: Array,
      default: () => [],
    },
    /** 列表加载方法 */
    listLoadMethod: {
      type: Function,
      required: true,
    },
    /** 列表加载前check方法 */
    listLoadPreCheck: Function,
  },
  components: {
    ElPaginationTable,
  },
  setup: (props, { slots }) => {
    const hasAdditionBtnZone = computed(() => !!slots.additionBtnZone);
    const loading = ref(false);
    const data = ref([]);
    const pageSize = ref(20);
    const currentPage = ref(1);
    const total = ref(0);

    const _loadList = async ({ currentPage: _currentPage, pageSize: _pageSize }) => {
      const { listLoadMethod } = props;
      loading.value = true;
      try {
        const { currentPage: _currPage, total: _total, list } = await listLoadMethod({ currentPage: _currentPage, pageSize: _pageSize });
        data.value = list;
        currentPage.value = _currPage;
        total.value = _total;
      } catch (e) {
        //
      }
      loading.value = false;
    };
    const loadList = async ({ currentPage: _currentPage, pageSize: _pageSize } = {}) => {
      const { listLoadPreCheck } = props;
      let preCheckResult = true;
      if (isFn(listLoadPreCheck)) preCheckResult = listLoadPreCheck();
      if (isPromise(preCheckResult)) {
        try {
          preCheckResult = await preCheckResult;
        } catch (e) {
          preCheckResult = false;
        }
      }
      if (!preCheckResult) return;
      await _loadList({
        currentPage: _currentPage || currentPage.value,
        pageSize: _pageSize || pageSize.value,
      });
    };
    const onPaginationChange = (_pagination = {}) => {
      loadList(_pagination);
    };

    const pagination = reactive({
      pageSize,
      currentPage,
      total,
      onChange: onPaginationChange,
    });

    return {
      hasAdditionBtnZone,

      loading,
      data,
      pagination,

      onPaginationChange,

      loadList,
    };
  },
});
</script>
<style lang="scss" module>
.filterZone {
  margin: 10px;
}

.additionBtnZone {
  margin-top: 10px;
}

.tableZone {
  margin-top: 10px;
}
</style>
