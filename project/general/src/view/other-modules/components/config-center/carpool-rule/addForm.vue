<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-23 14:14:14
 * @LastEditTime: 2022-03-17 16:56:26
 * @Description:
-->
<template>
  <Form ref="addForm" :model="formData" :label-width="80" :rules="formRules">
    <FormItem label="标题" prop="title">
      <Input v-model="formData.title" placeholder="请输入标题"></Input>
    </FormItem>

    <FormItem label="排序：" prop="sort">
      <Select
        v-model="formData.sort"
        filterable
        placeholder="请选择排序"
        style="width: 150px"
        transifer
      >
        <Option v-for="item in sortList" :key="item" :value="item">{{item}}</Option>
      </Select>
    </FormItem>
    <FormItem label="描述" prop="rule">
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
import { createRule } from "_o/api/vehicleRule.js";
const TYPE = 3;
export default {
  components: {
    Editor,
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      formRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        sort: [
          {
            required: true,
            type: "number",
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
        rule: [{ required: true, message: "描述不能为空", trigger: "blur" }],
      },
      editorContent: "", // 富文本单独绑定
      formData: {
        title: "",
        sort: "",
        rule: "",
      },
      sortList: 0,
    };
  },
  mounted() {
    this.sortList = this.count + 1;
  },
  methods: {
    handleChange(html, text) {
      this.formData.rule = html; // 将数据赋值给formData
    },
    handleSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.handleCreate(this.formData);
        }
      });
    },
    // 创建保存
    async handleCreate(params) {
      this.$Spin.show();
      try {
        const res = await createRule({ ...params, qaType: TYPE });
        const { success, msg } = res.data;
        this.$Spin.hide();
        if (success) {
          this.$Message.success("保存成功");
          this.$refs.addForm.resetFields();
          this.editorContent = "";
          this.$emit("update");
        } else {
          this.$Message.error(msg);
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    handleCancel() {
      this.$refs.addForm.resetFields();
      this.editorContent = "";
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
@import url("./editor-reset.less");
</style>
