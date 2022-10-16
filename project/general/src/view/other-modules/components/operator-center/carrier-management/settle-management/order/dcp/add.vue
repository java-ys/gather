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
        <FormItem :label="mold | moldF" prop="sum">
          <Input
            v-model="addForm.sum"
            style="width: 240px"
            class="no-arrow"
            type="number"
            :maxlength="20"
            placeholder="请输入"
          ></Input>
        </FormItem>
        <FormItem label="说明：" prop="">
          <Input
            v-model="addForm.remark"
            type="textarea"
            :rows="4"
            :maxlength="200"
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
import { dcpAddReissueDeductionService } from "_o/api/settle";
import { tool } from "_o/api/baseMixin.js";
import { freeze } from "@/mixins/base";

const formData = {
  remark: "", // 运营模式
  sum: "" // 模板标题
};
export default {
  name: "supply-add",
  mixins: [tool],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 1 补发 2 扣减
    mold: {
      type: Number,
      default: 1
    }
  },
  filters: {
    moldF(v) {
      return v - 1 === 0 ? "补发金额：" : "扣减金额：";
    }
  },
  computed: {
    isSupply({ mold }) {
      return mold - 1 === 0;
    },
    isEdit({ editData }) {
      return !!editData.uuid;
    }
  },
  data() {
    let { deductionLea, deductionDesc, reissueLea, reissueDesc } = this.editData
    let title = this.mold - 1 === 0 ? "添加补发" : "添加扣减";
    let r = {...formData}
    if (this.mold - 2 === 0) {
      r.sum = deductionLea || ""
      r.remark = deductionDesc || ""
    } else if (this.mold - 1 === 0) {
      r.sum = reissueLea || ""
      r.remark = reissueDesc || ""
    }
    return {
      validateRules: freeze({
        remark: [{ required: true, message: "请输入说明" }],
        sum: [{ required: true, message: "请输入金额" }]
      }),
      title,
      submitLoading: false,
      addForm: r
    };
  },
  methods: {
    confirmAdd() {
      this.$refs._form.validate(async bool => {
        if (!bool) return;
        let msg = this.isEdit ? "编辑成功" : "新建成功";
        let func = dcpAddReissueDeductionService;
        let p = this.getSubmitParams();
        this.submitLoading = true;
        const [err] = await this.toResult(func(p));
        this.submitLoading = false;
        if (err) {
          return;
        }
        this.$Message.success(msg);
        this.$refs._form.resetFields();
        this.$emit("close");
        this.$emit("confirm");
      });
    },
    getSubmitParams() {
      const { sum, remark } = this.addForm;
      let r = {};
      if (this.isSupply) {
        r = { reissueLea: sum, reissueDesc: remark };
      } else if (this.mold - 2 === 0) {
        r = { deductionLea: sum, deductionDesc: remark };
      }
      if (this.isEdit) {
        r.billingUuid = this.editData.uuid;
      }
      return r;
    },
    cancel() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
