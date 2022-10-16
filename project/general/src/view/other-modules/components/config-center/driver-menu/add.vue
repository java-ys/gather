<template>
  <Modal v-model="showModal" :title="title" width="800px" :z-index="1">
    <Form
      ref="form"
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
    >
      <FormItem
        label="菜单名称"
        prop="menuName"
      >
        <Input
          v-model="formData.menuName"
          clearable="clearable"
          style="width:300px"
          :maxlength="40"
          placeholder="请输入菜单名称"
        />
      </FormItem>
      <br />
      <FormItem label="展示顺序" prop="displayOrder">
        <InputNumber
          v-model="formData.displayOrder"
          :precision="0"
          placeholder="请输入整数"
          style="width:130px;"
        ></InputNumber>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button v-lazy-click="saveData" type="primary">确定</Button>
      <Button @click="showModal = false">取消</Button>
    </div>
  </Modal>
</template>

<script>

import {
  driverMenuAdd,
  driverMenuUpdate
} from "_o/api/configData";

export default {
  name: "add",
  components: {},
  data() {
    return {
      showModal: false,
      title: "新增菜单",
      formData: {
        menuName: "",
        displayOrder: null
      },
      formValidate: {
        menuName: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: "[^ \x22]+",
            message: "不能输入全空格",
            trigger: "change"
          }
        ],
        displayOrder: [
          {
            type: "number",
            required: true,
            message: "必填",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    formatUrl(value, key) {
      this.formData[key] = value.replace(/(^\s*)|(\s*$)/g, "");
    },
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();

      if (!val || !val.id) {
        this.title = "新增菜单";
        this.formData = {
          menuName: "",
          displayOrder: 0
        };
      } else {
        this.title = "编辑菜单";
        this.formData = {
          id: val.id,
          // 是否菜单名称不可更改
          menuName: val.menuName,
          displayOrder: val.displayOrder
        };
      }
    },
    saveData() {
      console.log(this.$refs);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
      let params = {
        menuName: this.formData.menuName,
        displayOrder: this.formData.displayOrder
      };
      if (this.formData.id) {
        params.id = this.formData.id;
        driverMenuUpdate(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      } else {
        driverMenuAdd(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.text-description {
  margin-left: 100px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
