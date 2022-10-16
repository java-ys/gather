import { ref } from "@vue/composition-api";

export { default as ViewModal } from "./index.vue";

export const useViewModal = () => {
  const viewModalRefName = "viewModalRef";
  const viewModalRef = ref(null);
  const openViewModal = ruleId => {
    if (!viewModalRef.value) return;
    viewModalRef.value.open(ruleId);
  };

  return {
    viewModalRefName,
    viewModalRef,
    openViewModal,
  };
};
