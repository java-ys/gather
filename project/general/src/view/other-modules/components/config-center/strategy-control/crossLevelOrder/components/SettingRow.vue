<script>
import { defineComponent } from "@vue/composition-api";
import UserGroupArea from "./UserGroupArea"

export default defineComponent({
  name: "SettingRow",
  components: { UserGroupArea },
  props: {
    item: Object,
    /** 当前渲染记录的索引值 */
    index: Number,
    /** 判断当前记录是否禁用 */
    itemDisabled: Boolean,
    /** 可选类型数组 */
    optionList: Array,
    /** 可选类型的禁用状态函数 */
    optionDisableFn: Function,
    /** 当前渲染的归属母数组 */
    parentList: Array,
  },
  setup: (props, { emit }) => {
    const methods = {
      onChange: v => {
        emit("change", v)
      },
      onClickDelete: () => {
        emit("del")
      },
      showModal: () => {
        emit("show-modal")
      }
    }
    return {
      ...methods,
      isUndefined: v => v === undefined,
    }
  }
})
</script>
<template>
  <div>
    <div v-if="item">
      接受指派
      <a-select
        :disabled="itemDisabled"
        style="width: 200px"
        :value="item.itemCode"
        @change="onChange"
      >
        <a-select-option v-for="v in optionList" :key="v.value" :value="v.value" :disabled="optionDisableFn(v.value)">
          {{v.label}}
        </a-select-option>
      </a-select>
      订单
      <a-icon v-if="index < parentList.length" type="minus-circle" @click="onClickDelete" />
      <UserGroupArea v-if="item.itemCode" :list="item.crowdInfos" @show-modal="showModal" @del-group="idx => item.crowdInfos.splice(idx, 1)" />
      <div v-if="item.itemCode" style="margin-left:60px;margin-bottom:12px;">
        <a-row>
          <font style="color:red">*</font> 开关可见：
          <a-radio-group v-model="item.isShow" name="radioGroup">
            <a-radio :value="1" :disabled="!item.itemCode">是</a-radio>
            <a-radio :value="0" :disabled="!item.itemCode">否</a-radio>
          </a-radio-group>
        </a-row>
        <a-row v-if="item.isShow === 1">
          关闭挽留提示：
          <a-input v-model="item.closeHint" style="width: 340px" placeholder="话术以“确认关闭吗”结尾" prop="text" :maxLength="25" :disabled="!item.itemCode" allow-clear />
          <span class="count">( {{item.closeHint ? item.closeHint.length : 0}}/25 )</span>
        </a-row>
      </div>
    </div>
  </div>
</template>
