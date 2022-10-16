<template>
 <div>
    <Modal
      v-model="isShow"
      :width="650"
      title="审核不通过"
      class="new-ue fail-modal"
      :mask-closable="false"
      @on-cancel="cancelFun"
    >
      <Form :model="formData" :rules="formValidate" ref="formData">
        <FormItem label="请选择审核不通过的原因：" prop="reasonType">
          <Select
            v-model="formData.reasonType"
            placeholder="请选择"
            class="width200"
            @on-change="formData.reason=''"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in reasonList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
          
        </FormItem>
        <FormItem v-if="formData.reasonType===7" label="请填写审核不通过的原因：" prop="reason">
          <Input
          v-model="formData.reason" 
          :maxlength="20"
          style="width:400px;"
          placeholder="请填写" />
          <span class="counter">( {{formData.reason?formData.reason.length:0}}/20 )</span>
          
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
import { certificateReject } from "_o/api/passenger.js";
import { reasonList,reasonMap } from'../fields'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {},
  },
  data() {
    return {
      isShow: this.show,
      reasonList,
      reasonMap,
      formData: {
        reasonType: null,
        reason: ""
      },
      formValidate: {
        reasonType: [{ required: true, type:'number', message: "请选择审核不通过的原因", trigger: "blur" }],
        reason: [{ required: true, message: "请输入审核不通过的原因", trigger: "blur" }]
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
          console.log(this.formData)
          let reason=this.formData.reasonType===7?this.formData.reason:this.reasonMap[this.formData.reasonType]
          let params = {
            uuid: this.info.uuid,
            reason
          }
          this.addLoading = true
          certificateReject(params).then(res => {
            this.addLoading = false
            this.$Message.success(res.data.msg);
            this.cancelFun();
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
    }
  }
};
</script>
<style lang="less" scoped>
.fail-modal{
  /deep/ .ivu-modal-body{
    min-height:240px;
  }
}
</style>
