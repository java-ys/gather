<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-23 14:14:14
 * @LastEditTime: 2021-12-03 10:20:00
 * @Description:
-->
<template>
  <Form ref="editForm" :model="formData" :label-width="80" :rules="formRules">
    <FormItem label="标题" prop="title">
      <Input v-model="formData.title" placeholder="请输入标题"></Input>
    </FormItem>
    <FormItem label="描述" prop="description">
      <div class="editor-content">
        <editor ref="editor" :value="editorContent" @on-change="handleChange" />
      </div>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit">保存</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </FormItem>
  </Form>
</template>
<script>
import Editor from "_c/editor";
import { updateEquityText } from "_o/api/airportConfig.js";
import editMixin from "./edit.mixins"

export default {
  components: {
    Editor
  },
  mixins: [editMixin],
  data() {
    return {
      formRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        description: [{ required: true, message: "描述不能为空", trigger: "blur" }]
      },
      editorContent: "", // 富文本单独绑定
      formData: {
        title: "",
        description: ""
      }
    }
  },
  methods: {
    handleChange(html, text) {
      this.formData.description = html // 将数据赋值给formData
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.handleCreate(this.formData);
        }
      });
    },
    // 创建保存
    async handleCreate(params) {
      this.$Spin.show();
      try {
        const res = await updateEquityText({ ...params, uuid: this.uuid });
        const { success, msg } = res.data;
        this.$Spin.hide();
        if (success) {
          this.$Message.success("保存成功");
          this.$refs.editForm.resetFields();
          this.editorContent = ""
          this.$emit("update")
        } else {
          this.$Message.error(msg);
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    handleCancel() {
      this.$refs.editForm.resetFields();
      this.editorContent = ""
      this.$emit("close");
    },
  },
}
</script>

<style lang="less">
@import url('../editor-reset.less');
</style>