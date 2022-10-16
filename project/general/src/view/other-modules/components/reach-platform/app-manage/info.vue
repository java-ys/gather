<template>
  <div class="app-info-page" style="width: 60%;">
    <Form ref="form" :model="info" :rules="isDetail ? null : rules">
      <FormItem label="应用名称：" label-position="top" prop="appName">
        <Input
          v-model="info.appName"
          placeholder="请输入"
        />
      </FormItem>
      <FormItem label="应用编码：" label-position="top" prop="appCode">
        <Input
          v-model.trim="info.appCode"
          placeholder="请输入"
        />
      </FormItem>
      <FormItem label="应用简介：" label-position="top" prop="appDesc">
        <Input
          v-model="info.appDesc"
          placeholder="请输入"
          :maxlength="30"
        />
      </FormItem>
      <div>
        <Button type="primary" @click="onSubmit">确定</Button>
        <Button @click="onCancel">取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { postApp } from "_o/api/reach-platform";
import { formMixin } from "../mixin"
import { createRule } from "../util";
export default {
  name: "app-info",
  mixins: [formMixin],
  data: () => ({
    info: {
      appName: "",
      appCode: "",
      appDesc: "",
    },
    rules: {
      appName: createRule("请输入应用名称", "string"),
      appCode: createRule("请输入应用编码", "string"),
      appDesc: createRule("请输入应用简介", "string"),
    },
  }),
  methods: {
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (!valid) return;
        postApp(this.info).then(() => {
          this.$Message.success("提交成功");
          setTimeout(this.onCancel, 2000);
        }).catch(err => this.$Message.error(err.msg));
      })
    },
    onCancel() {
      this.$router.back();
    },
  }
};
</script>

<style lang="less" scoped>

</style>