<template>
  <el-dialog :visible.sync="visible" appendToBody title="提示" :closeOnClickModal="false" :class="$style.confirmDialog">
    <div :class="$style.confirmHint">{{ settings.hint }}</div>
    <el-input type="textarea" :placeholder="settings.placeholder" :rows="4" v-model="reason" maxlength="120" />
    <span slot="footer" style="text-align: center;">
      <el-button @click="visible = false" size="medium">取消</el-button>
      <el-button type="primary" @click="onSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { reactive, ref } from '@vue/composition-api';
import { SETTINGS } from '.';

export default {
  name: 'AccountManageConfirm',
  setup: () => {
    const visible = ref(false);
    const reason = ref('');
    const settings = reactive({
      hint: '',
      placeholder: '',
      confirmCb: null, // 确定的回调
    });

    const open = (type, confirmCb) => {
      visible.value = true;
      reason.value = '';
      Object.assign(settings, SETTINGS[type]);
      Object.assign(settings, { confirmCb });
    };

    const onSubmit = async () => {
      const st = await settings.confirmCb(reason.value.trim());
      if (st) visible.value = false;
    };

    return {
      visible,
      reason,
      settings,

      open,
      onSubmit,
    };
  },
};
</script>
<style lang="scss" module>
.confirmDialog {
  :global {
    .el-dialog__body {
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }
}

.confirmHint {
  margin-bottom: 8px;
}
</style>
