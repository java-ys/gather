<template>
  <div>
    <Form :model="formData" :rules="formValidate" ref="formData">
      <FormItem label="指定司机:" prop="person">
        <import-file btnText="批量导入" baseUrlName="_base4Driver" otherMsg="最多导入5000条数据" successMsg="导入成功！已将数据添加至输入框" size="small" :importFileUrl="uploadUrl" :toDownTemplateUrl="templateUrl" :data="{}" @on-success="getUpFile"></import-file>
        <Input type="textarea" v-model="formData.person" :rows="4" placeholder="可只输入司机Code, 英文逗号隔开" />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align:center">
      <Button @click="cancel">取消</Button>
      <Button type="primary" v-lazy-click="save">确定</Button>
    </div>
  </div>
</template>

<script>
import importFile from "_a/import-file/index.vue";
import { driverWhiteAdd } from "_o/api/study-category";
const uploadUrl = "/api/study/whitelist/import";
const templateUrl = "/downloadExcel/批量导入司机code.xlsx";
export default {
  name: "whitelist-management-add",
  components: { importFile },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      uploadUrl,
      templateUrl,
      formValidate: {
        person: [{ required: true, message: "请输入司机Code", trigger: "blur" }]
      }
    };
  },
  methods: {
    getUpFile({ data }) {
      if (data && data.length) {
        this.formData.person = data.join(",");
      }
    },
    cancel() {
      this.$refs["formData"].resetFields();
      this.$emit("cancel");
    },
    save() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          driverWhiteAdd({ driverCode: this.formData.person }).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              this.$emit("on-confirm");
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>