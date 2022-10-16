<template>
  <Form v-if="form">
    <FormItem
      label=" "
      required
    >
      <slot name="top"></slot>
    </FormItem>
    <FormItem
      v-if="isRealtime"
      label="随时间变更"
      class="form-item-child"
      required
    >
      <i-switch
        v-model="form.changeOverTimeDto.changeFlag"
        :disabled="readonly"
        @on-change="handleChange"
      >
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
    </FormItem>

    <template
      v-if="isRealtime && form.changeOverTimeDto.changeFlag"
    >
      <FormItem
        class="form-item-child"
        label=" "
        required
      >
        <Select
          v-model="form.changeOverTimeDto.secondCount"
          style="width: 80px"
          :disabled="readonly"
          @change="handleChange"
        >
          <Option
            v-for="item in secondCountList"
            :key="item"
            :value="item"
            :label="item"
          />
        </Select>
        <span>秒未呼叫到车辆时变更为：</span>
      </FormItem>
      <FormItem
        class="form-item-child"
        label=" "
        required
      >
        <slot name="bottom"></slot>
      </FormItem>
    </template>
  </Form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    secondCountList: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isRealtime: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.form = val
      },
      immediate: true
    }
  },
  methods: {
    handleChange() {
      this.$emit("input", this.form)
    }
  }
}
</script>

<style scoped lang="less">
.form-item-child {
  margin-bottom: 10px;
}
</style>
