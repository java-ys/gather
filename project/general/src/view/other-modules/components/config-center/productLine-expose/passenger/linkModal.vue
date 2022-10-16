<template>
  <Modal v-model="showModal" :title="title" width="500px" :z-index="1">
    <Form inline="inline" :label-width="85">
      <FormItem label="链接地址">
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="linkUrl"
          :maxlength="255"
          disabled
        />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" v-lazy-click="copyData">复制</Button>
      <Button @click="showModal = false">关闭</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "add",

  data() {
    return {
      showModal: false,
      title: "查看链接",
      linkUrl: ""
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.linkUrl = val.linkUrl;
    },
    copyData() {
      this.showModal = false;
      this.clickCopy(this.linkUrl);
    },
    // 点击复制到剪切板
    clickCopy(content) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", content);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$Message.success("复制成功！");
      }
      document.body.removeChild(input);
    }
  }
};
</script>

