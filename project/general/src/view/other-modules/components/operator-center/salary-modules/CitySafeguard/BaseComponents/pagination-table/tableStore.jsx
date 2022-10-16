import { reactive } from '@vue/composition-api';

export default function createTableStore({ pagination: sPagination, loading: sLoading }) {
  const pagination = reactive(sPagination);
  const loading = reactive(sLoading);

  return {
    pagination,
    loading
  };
}
