import { computed, ref } from "@vue/composition-api";
import { queryCitiesWithAgent } from "_o/api/salary/common";
import { LOCAL_DATA__VALUE_ITEM_ALL, LOCAL_DATA__LABEL_ITEM_ALL } from "./consts";
import { callAlert } from "_o/components/operator-center/salary-modules/CitySafeguard/uiUtils";

export const useCityList = () => {
  const cityList = ref([]);
  const cityListWithAllOption = computed(() => [
    {
      value: LOCAL_DATA__VALUE_ITEM_ALL,
      label: LOCAL_DATA__LABEL_ITEM_ALL,
    },
    ...cityList.value,
  ]);
  const loadCityList = () => {
    queryCitiesWithAgent({})
      .then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            callAlert("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            cityList.value = (res.data.data.cities || []).map(v => ({
              value: v.orgCode,
              label: v.orgName,
            }));
          }
        }
      })
      .catch(() => {
        callAlert("获取数据信息失败，请刷新页面重试");
      });
  };

  loadCityList();

  return {
    cityList,
    cityListWithAllOption,
  };
};
