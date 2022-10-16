import { ref } from "@vue/composition-api";
import { Message } from "element-ui";
import { queryCitiesWithAgent } from "_o/api/salary/common";
import {
  LOCAL_DATA__VALUE_ITEM_ALL,
} from "../../biz/consts";

export const useOperators = () => {
  const operatorList = ref([]);
  const loadCityOperatorList = cityCode => {
    if (cityCode === LOCAL_DATA__VALUE_ITEM_ALL) {
      operatorList.value = [];
      return;
    }
    queryCitiesWithAgent({ cityCode }).then(res => {
      if (res?.data?.success) {
        operatorList.value = (res.data.data?.agentInfoVos || []).map(v => ({
          value: v.uuid,
          label: v.name,
        }));
      } else {
        throw new Error();
      }
    }).catch(() => {
      operatorList.value = [];
      Message.warning("获取城市运营商失败");
    });
  };

  return {
    operatorList,
    loadCityOperatorList,
  };
};
