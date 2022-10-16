<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
        :rules="validateRules"
      >
        <FormItem label="补发扣减：" prop="type">
          <Select
            v-model="addForm.type"
            placeholder="请选择"
            class="item-width"
          >
            <Option
              v-for="(item, index) in typesList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="类目名称：" prop="category">
          <Select
            v-model="addForm.category"
            placeholder="请选择"
            class="item-width"
          >
            <Option
              v-for="(item, index) in catList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="金额：" prop="amount">
          <Input
            v-model="addForm.amount"
            style="width: 240px"
            class="no-arrow"
            type="number"
            :maxlength="20"
            placeholder="请输入"
          ></Input>
        </FormItem>
        <FormItem label="说明：" prop="remark">
          <Input
            v-model="addForm.remark"
            type="textarea"
            :rows="4"
            :maxlength="100"
            placeholder="请输入..."
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="confirmAdd">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { reissueDeductService } from "_o/api/settle";
import { tool } from "_o/api/baseMixin.js";
import { freeze } from "@/mixins/base";
import  { reissueList, deductList } from '@/config/index'

const formData = {
  remark: "", // 运营模式
  sum: "", // 模板标题
};
export default {
  name: "reissue-deduct",
  mixins: [tool],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {
    catList({ addForm }) {
      if (addForm.type - 1 === 0) {
        return reissueList;
      } else if (1) {
        return deductList;
      }
      return [];
    },
  },
  data() {
    return {
      validateRules: freeze({
        type: [{ required: true, message: "请选择类型" }],
        category: [{ required: true, message: "请选择类目" }],
        amount: [{ required: true, message: "请输入金额" }],
      }),
      title: "添加补发/补扣",
      submitLoading: false,
      addForm: {
        type: "",
        category: "",
        amount: "",
        remark: "",
      },
      typesList: freeze([
        { label: "补发", value: 1 },
        { label: "补扣", value: 2 },
      ]),
    };
  },
  methods: {
    async confirmAdd() {
      const bool = await this.$refs._form.validate;
      if (!bool) return;
      let p = this.getSubmitParams();
      this.submitLoading = true;
      const [err] = await this.toResult(reissueDeductService(p));
      this.submitLoading = false;
      if (err) return;
      this.$Message.success("新建成功");
      this.$refs._form.resetFields();
      this.$emit("confirm");
    },
    getSubmitParams() {
      const { type, category, amount, remark } = this.addForm;
      const { operateType, businessType, agentUuid, uuid } = this.editData;
      return {
        type,
        category,
        amount,
        remark,
        billingUuid: uuid,
        operateType,
        businessType,
        agentUuid,
      };
    },
    cancel() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
