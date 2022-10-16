<template>
  <Modal v-if="appCode" title="编辑消息内容" :value="show" width="70" footer-hide @on-cancel="onCancel">
    <TemplateList
      v-if="type === 1"
      from-other
      :app-code="appCode"
      @use="onUse"
    />
    <!-- @create="type = 2" -->
    <!-- @edit="id => (templateId = id,type = 2)" -->
    <!-- <TemplateInfo
      v-else-if="type === 2"
      from-other
      :app-name="appName"
      :app-code="appCode"
      :template-id="templateId"
      @back="type = 1"
    /> -->
    <Message
      v-else-if="type >= 3"
      v-show="type === 3"
      :template="template"
      @confirm="onConfirm"
      @back="type = 1"
    />
  </Modal>
</template>

<script>
import TemplateList from "../template-manage/index.vue";
// import TemplateInfo from "../template-manage/info.vue";
import Message from "./Message.vue";
export default {
  name: "TemplateModal",
  components: { TemplateList, Message },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    show: Boolean,
    value: Object,
    appCode: String,
    appName: String,
  },
  data: () => ({
    type: 0, // 1-列表，2-编辑，3-使用模版
    templateId: "",
    template: null,
  }),
  watch: {
    show: {
      handler(bol) {
        this.type = bol ? 1 : 0;
      },
      immediate: true,
    }
  },
  created() {
    if (!this.appCode) return this.$Message.error("请配置appCode");
  },
  methods: {
    onUse(temp) {
      this.template = temp;
      this.type = 3;
    },
    onConfirm(temp) {
      this.$emit("change", temp);
      this.onCancel();
    },
    onCancel() {
      this.$emit("cancel");
    },
  }
};
</script>

<style lang="less" scoped>

</style>