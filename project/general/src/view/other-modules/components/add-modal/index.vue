<template>
  <Modal
    v-model="visible"
    :width="width"
    :mask-closable="false"
    :title="title"
    footer-hide
    @on-cancel="cancel"
  >
    <div ref="addTemplate">
      <slot></slot>
    </div>
    <div class="popView-footer-wrap">
      <Button
        size="large"
        type="text"
        style="margin-right: 8px;"
        @click="cancel"
      >
        取消
      </Button>
      <Button
        size="large"
        type="primary"
        @click="ok"
      >
        确定
      </Button>
    </div>
  </Modal>
</template>

<script>
export const oneOf = (value, validList) => {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
};
export default {
  name: "add-modal",
  props: {
    value: {
      // v-model
      type: Boolean,
      default: false
    },
    title: {
      // 弹窗文案
      type: String,
      default: "新增"
    },
    type: {
      // 打开弹窗的类型
      validator(value) {
        return oneOf(value, ["add", "edit", "detail"]);
      }
    },
    width: {
      // 弹窗宽度
      type: Number,
      default: 1000
    },
    errorMessage: {
      // 校验错误时的统一提示
      type: String,
      default: "表单验证不通过"
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  watch: {
    value(v) {
      this.visible = v;
    },
    visible(v) {
      this.$emit("input", v);
      this.$nextTick(() => {
        this.type === "add" && this.clear();
      });
    }
  },
  methods: {
    clear() {
      // 清除表单校验
      this.findRefs("resetFields", false);
    },
    cancel() {
      // 取消
      this.visible = false;
      this.clear();
    },
    ok() {
      // 确定
      if (this.type === "detail") {
        this.$emit("success");
        return;
      }
      let check = [];
      this.findRefs("validate", check);
      if (check.includes(false)) {
        return this.$Message.error(this.errorMessage);
      }
      this.$emit("success");
    },
    findRefs(key, arr) {
      this.$slots.default && this.$slots.default.forEach(item => {
        Object.keys(item.child.$refs).forEach(it => {
          let fn = item.child.$refs[it] && item.child.$refs[it][key];
          if (fn) {
            if (arr) {
              fn(v => {
                arr.push(v);
              });
            } else {
              fn();
            }
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
.popView-footer-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
