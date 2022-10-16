import { ref } from "@vue/composition-api";
import { Message } from "element-ui";
import { getDicItemByDicCode } from "_o/api/salary/common";

export const useDriverTags = () => {
  const driverTags = ref([]);
  const loadDriverTags = () => {
    getDicItemByDicCode().then(res => {
      if (res.data.success) {
        driverTags.value = (res.data.data || []).map(v => ({
          value: v.itemcode,
          label: v.itemvalue,
        }));
      } else {
        Message({
          message: res.data.msg,
          type: "success",
        });
      }
    });
  };

  const getLabelFromValue = val => {
    const tag = driverTags.value.find(v => v.value === val);
    return tag?.label;
  };

  loadDriverTags();

  return {
    driverTags,
    getLabelFromValue,
  };
};
