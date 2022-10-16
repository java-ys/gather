<template>
 <div>
    <Modal
      v-model="isShow"
      :width="600"
      title="添加司机"
      class="new-ue whitelist-add-modal"
      :mask-closable="false"
      @on-cancel="cancelFun"
    >
      <Form :model="formData" :rules="formValidate" ref="formData">
        <FormItem label="指定司机:" prop="person" class="inline-label bottom15">
          <import-file
            style="margin-left:90px;"
            btnText="批量导入"
            otherMsg="最多导入5000条数据" 
            successMsg="导入成功！已将数据添加至输入框" 
            :importFileUrl="uploadUrl" 
            :toDownTemplateUrl="templateUrl" 
            :data="{}"
            :isGet="true"
            size="small"
            @on-success="getUpFile">
          </import-file>
          <Input 
            class="top15"
            type="textarea" 
            v-model="formData.person" 
            :rows="4"
            placeholder="输入司机ID，英文逗号隔开" />
        </FormItem>
      </Form>
      
      <div slot="footer">
        <Button @click="cancelFun">取消</Button>
        <Button
          type="primary"
          :loading="addLoading"
          @click="save()"
        >
          <span v-if="!addLoading">确定</span>
          <span v-else>提交中</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import importFile from "_a/import-file/index.vue";
import { axiosRecordWhiteAdd } from "_o/api/operator-center/server-card";
const uploadUrl = "/api/servicecard/white/importExcel";
const templateUrl = "/download/white_driver_import_tmpl.xlsx";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  components: { importFile },
  data() {
    return {
      isShow: this.show,
      uploadUrl,
      templateUrl,
      formData: {
        person: ""
      },
      formValidate: {
        person: [{ required: true, message: "请输入司机ID", trigger: "blur" }]
      },
      addLoading: false
    };
  },
  mounted() {
  },
  methods: {
    cancelFun(){
      this.$refs["formData"].resetFields();
      this.$emit('close')
    },
    getUpFile({ data }) {
      if (data && data.length) {
        this.formData.person = data
      }
    },
    save() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.addLoading = true
          axiosRecordWhiteAdd({ driverIds: this.formData.person }).then(res => {
            this.addLoading = false
            this.$Message.success(res.data.msg);
            this.cancelFun()
            this.$emit('getList')
          }).catch(err=>{
            this.addLoading = false
          });
        }
      });
    }
  },
  watch: {
    show(newVal) {
      this.isShow = this.show;
      
    }
  }
};
</script>
<style lang="less" scoped>
.modal-foot {
  min-height: 45px;
  padding-top: 15px;
  border-top: 1px solid #e8eaec;
}
.bottom15{
  margin-bottom: 15px;
}
</style>
