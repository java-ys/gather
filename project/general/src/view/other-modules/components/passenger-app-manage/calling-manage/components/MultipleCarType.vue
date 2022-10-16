<template>
  <Form>
    <FormItem
      prop="multipleModelVo"
      :label-width="80"
    >
      <FormItem
        class="form-item-child"
        label=" "
        required
      >
        <Input
          v-model="form.webModel.startTip"
          :maxlength="12"
          :readonly="readonly"
          class="input-width"
        />
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
          <Input
            v-model="form.changeOverTimeDto.webModel.startTip"
            :maxlength="12"
            :readonly="readonly"
            class="input-width"
          />
        </FormItem>
      </template>
    </FormItem>
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
  computed: {
    form() {
      return this.value
    }
  }
}
</script>

<style scoped lang="less">
.form-item-child {
  margin-bottom: 10px;
}

.input-width {
  width: 300px;
}
</style>
