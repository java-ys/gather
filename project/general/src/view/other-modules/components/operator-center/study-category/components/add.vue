<template>
  <div>
    <Form :model="editForm" :rules="formValidate" ref="editForm">
      <FormItem label="学习分类：" prop="cateName" :label-width="100">
        <Input class="item-style" :maxlength="20" v-model="editForm.cateName" placeholder="请输入学习分类" />
      </FormItem>
      <FormItem label="排序值：" prop="sortOrder" :label-width="100">
        <Input class="item-style" :maxlength="5" v-model="editForm.sortOrder" placeholder="请输入排序值" />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align:center">
      <Button @click="cancel">取消</Button>
      <Button type="primary" v-lazy-click="save">确定</Button>
    </div>
  </div>
</template>

<script>
import {
  studyCategoryAdd,
  studyCategoryEdit,
  studyCategoryDetail
} from "_o/api/study-category";
export default {
  name: "study-category-add",
  props: {
    title: {
      type: String,
      required: true
    },
    editForm: {
      type: Object,
      required: false
    },
    isEdit: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      formValidate: {
        cateName: [
          { required: true, message: "请输入学习分类", trigger: "blur" },
          { validator: this.validateCateName, trigger: "change" }
        ],
        sortOrder: [
          { required: true, message: "请输入排序值", trigger: "blur" },
          { validator: this.validateSortOrder, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    validateCateName(rule, value, callback) {
      if (!value || /^[\u4e00-\u9fa5]+$/.test(value)) {
        return callback();
      } else {
        return callback(new Error("请输入长度在 2 到 20 个汉字"));
      }
    },
    validateSortOrder(rule, value, callback) {
      if (!value || /^(?!00|0)(?:[0-9]{1,4}|10000)$/.test(value)) {
        return callback();
      } else {
        return callback(new Error("请输入 1 到 10000 的整数"));
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return;
        if (this.isEdit) {
          this.edit();
        } else {
          this.add();
        }
      });
    },
    edit() {
      let obj = {
        id: this.editForm.id,
        cateName: this.editForm.cateName,
        sortOrder: this.editForm.sortOrder
      };
      studyCategoryEdit(obj).then(res => {
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.$emit("on-confirm");
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    add() {
      let obj = {
        cateName: this.editForm.cateName,
        sortOrder: this.editForm.sortOrder
      };
      studyCategoryAdd(obj).then(res => {
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.$emit("on-confirm");
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.item-style {
  width: 280px;
}
</style>