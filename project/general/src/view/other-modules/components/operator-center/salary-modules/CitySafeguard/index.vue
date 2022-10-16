<template>
  <ListPageLayout
    :ref="listPageRefName"
    :titleList="['薪酬管理', '城市保底策略管理']"
    :tableProps="tableProps"
    :tableColumns="tableColumns"
    :listLoadMethod="listLoadMethod"
  >
    <div slot="filterZone">
      <FilterZone @search="onClickSearch" @reset="onClickReset" />
    </div>
    <div slot="additionBtnZone">
      <el-button v-if="hasPermission(createRulePermission)" type="primary" size="small" @click="openCreateModal">新建规则</el-button>
    </div>
    <component :is="Logs" v-bind="logProps" v-on="logEvents" />
    <EditModal :ref="editModalRefName" @finish="onRuleSaveFinish" />
    <ViewModal :ref="viewModalRefName" />
    <ApprovalModal :ruleUuid="legacyModalRuleId" @ruleSubmit="approvalSubmit" />
    <AuditModal :ruleUuid="legacyModalRuleId" @reviewSubmit="reviewSubmit" />
  </ListPageLayout>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
} from "@vue/composition-api";
import _debounce from "lodash.debounce";
import FilterZone from "./components/FilterZone.vue";
import { useBizData } from "./biz/useBizData";
import { useListPageLayout, ListPageLayout } from "./BaseComponents/ListPageLayout/useListPageLayout";
import {
  EditModal,
  useEditModal,
} from "./components/EditModal/useEditModal";
import {
  PERMISSION__CITY_SAFEGUARD__CREATE_RULE,
} from "./biz/consts";
import {
  useViewModal,
  ViewModal,
} from "./components/ViewModal/useViewModal";
import ApprovalModal from "_o/components/operator-center/salary-modules/components/approvalModal.vue";
import AuditModal from "_o/components/operator-center/salary-modules/components/auditModal.vue";

// eslint-disable-next-line vue/require-direct-export
export default defineComponent({
  name: "CitySafeguard",
  components: {
    ListPageLayout,
    FilterZone,
    EditModal,
    ViewModal,
    ApprovalModal,
    AuditModal,
  },
  setup: () => {
    const { listPage, refName: listPageRefName, loadList } = useListPageLayout();
    const onRuleSaveFinish = loadFirstPage => {
      if (loadFirstPage) {
        loadList({ currentPage: 1 });
      } else {
        loadList();
      }
    };
    const {
      editModal, editModalRefName, openCreateModal, openEditModal,
    } = useEditModal();
    const { viewModalRef, viewModalRefName, openViewModal } = useViewModal();
    const modalHandler = {
      openViewModal,
      openEditModal,
    };
    const listPageHandler = {
      loadList,
    };
    const {
      legacyModalRuleId,
      approvalSubmit,
      reviewSubmit,

      filters,
      resetFilters,
      Logs,
      logProps,
      logEvents,
      getList,
      tableColumns,
    } = useBizData({ modalHandler, listPageHandler });

    const tableProps = reactive({
      size: "mini",
      fit: true,
      height: "515",
    });

    const listLoadMethod = ({ pageSize, currentPage }) => getList({ pageSize, currentPage });

    const onClickSearch = () => {
      loadList({ currentPage: 1 });
    };
    const onClickReset = () => {
      resetFilters();
      loadList({ currentPage: 1 });
    };

    onMounted(() => {
      loadList();
    });
    return {
      onRuleSaveFinish,

      legacyModalRuleId,
      approvalSubmit,
      reviewSubmit,

      viewModalRef,
      viewModalRefName,
      filters,
      listPage,
      listPageRefName,

      editModal,
      editModalRefName,
      openCreateModal: _debounce(openCreateModal, 3000, { leading: true, trailing: false }),

      tableProps,
      tableColumns,
      listLoadMethod,

      onClickSearch: _debounce(onClickSearch, 3000, { leading: true }),
      onClickReset: _debounce(onClickReset, 3000, { leading: true }),

      Logs,
      logProps,
      logEvents,

      createRulePermission: PERMISSION__CITY_SAFEGUARD__CREATE_RULE,
    };
  },
});
</script>
