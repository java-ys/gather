import { ref } from "@vue/composition-api";
import { loadRuleData } from "_o/components/operator-center/salary-modules/CitySafeguard/biz/useBizData";

export { default as EditModal } from "./index.vue";

export const useEditModal = () => {
  const editModal = ref(null);
  const editModalRefName = "editModal";
  const openCreateModal = () => {
    if (!editModal.value) return;
    editModal.value.open();
  };

  const openEditModal = async ruleId => {
    if (!editModal.value) return;
    const data = await loadRuleData(ruleId);
    if (data) {
      editModal.value.openWithData(data, true);
    }
  };

  return {
    editModal,
    editModalRefName,

    openCreateModal,
    openEditModal,
  };
};
