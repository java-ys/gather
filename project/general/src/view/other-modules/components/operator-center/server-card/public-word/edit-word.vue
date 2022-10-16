<template>
 <div>
    <Modal
      v-model="isShow"
      :width="600"
      title="文案编辑"
      class="new-ue whitelist-add-modal"
      :mask-closable="false"
      @on-cancel="cancelFun"
    >
      <Form :model="formData" :rules="formValidate" ref="formData">
        <FormItem prop="word" class="inline-label bottom0">
          <span>提醒：线上前端展示数据，慎重修改</span>
          <div>
            <Input
            type="textarea" 
            v-model="formData.word" 
            :rows="4"
            :maxlength="1000"
            placeholder="请输入宣传文案" />
            <div class="counter text-right">( {{formData.word?formData.word.length:0}}/1000 )</div>
          </div>
          
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
import { axiosRecordTextEdit } from "_o/api/operator-center/server-card";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editInfo: {},
  },
  data() {
    return {
      isShow: this.show,
      formData: {
        word: ""
      },
      formValidate: {
        word: [{ required: true, message: "请输入宣传文案", trigger: "blur" }]
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
    save() {
      this.$refs.formData.validate(valid => {
        if (valid) {

          let params = {
            reportUuid: this.editInfo.reportUuid,
            qualificationType: this.editInfo.qualificationType,
            publicityDesc: this.formData.word,
          }
          this.addLoading = true
          axiosRecordTextEdit(params).then(res => {
            this.addLoading = false
            this.$Message.success(res.data.msg);
            this.$emit('close')
            this.$emit('getList')
          }).catch(err=>{
            this.addLoading = false
          });
        }
      })
    }
  },
  watch: {
    show(newVal) {
      this.isShow = this.show;
      this.isShow && ( this.formData.word = this.editInfo.publicityDesc )
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
.bottom0{
  margin-bottom: 0px;
}
</style>
