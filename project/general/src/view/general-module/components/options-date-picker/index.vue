<!--
 * @description: 带有不可选日期的日期时间选择器组件
 * @author: wuxuan
 * @date: 2019-08-05 14:15:01
 * @后台人员:
!-->
<template>
  <div />
</template>
<script>
export default {
  name: "OptionsDatePicker",
  // 此处props定义、用法、默认值和iview完全相同(optionsType除外)
  /**
   * optionsType：禁用时间类型。可以是以下类型之一
   * choose1:
   */
  props: {
    optionsType: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "date"
    },
    placeholder: {
      type: String,
      default: "请选择时间"
    },
    format: {
      type: String,
      default: "yyyy-MM-dd"
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    splitPanels: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    transfer: {
      type: Boolean,
      default: false
    },
    timePickerOptions: {
      type: Object,
      default: () => {}
    },
    separator: {
      type: String,
      default: "-"
    },
    size: {
      type: String
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less"></style>
