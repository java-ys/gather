import { ref } from "@vue/composition-api";

export { default as ListPageLayout } from "./index.vue";

export const useListPageLayout = () => {
  const listPage = ref(null);
  const refName = "listPage";

  const loadList = ({ currentPage, pageSize } = {}) => {
    if (listPage.value) {
      listPage.value.loadList({ currentPage, pageSize });
    }
  };

  return {
    listPage,
    refName,

    loadList,
  };
};
