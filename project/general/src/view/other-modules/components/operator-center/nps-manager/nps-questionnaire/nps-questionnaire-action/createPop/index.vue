<template>
  <div>
    <Form ref="form" :model="formData" :rules="rules">
      <FormItem label="" prop="userType">
        <RadioGroup v-model="formData.userType" size="large" style="width: 366px" placeholder="">
          <Radio :label="1">乘客</Radio>
          <Radio :label="2">司机</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="" prop="questionnaireName">
        <Input v-model="formData.questionnaireName" size="large" :maxlength="20" show-word-limit type="text" placeholder="请输入问卷标题" style="width: 366px" />
        <span class="edit_numberV">{{txtVal}}/20</span>
      </FormItem>
    </Form>
    <div slot="footer" class="button-group">
      <Button @click="cancel">取消</Button>
      <Button v-lazy-click="saveData" type="primary">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "start-create",
  components: {

  },
  props: {
    actionType: {
      type: String
    }
  },
  data() {
    return {
      formData: {
        questionnaireName: "",
        userType: 1
      },
      rules: {
        questionnaireName: [
          { required: true, message: "请输入问卷标题", trigger: "change" },
          { validator: this.validateEmpty, trigger: "change" }
        ]
      },
      allEmpty: false
    };
  },
  computed: {
    txtVal() {
      let val = this.formData.questionnaireName.length;
      if (this.allEmpty) {
        val = 0
      }
      return val;
    }
  },
  mounted() {
  },
  methods: {
    validateEmpty(rule, value, callback) {
      console.log("validateEmpty", value)
      let regu = "^[ ]+$";
      let re = new RegExp(regu);
      if (re.test(value)) { // 有空格
        this.allEmpty = true
        callback(new Error("请输入问卷标题,不能输入空格"))
      } else {
        this.allEmpty = false
        callback()
      }
    },
    cancel() {
      this.$emit("cancel")
    },
    saveData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 跳转到新增
          this.$route.meta.closeAlert = true;
          this.$router.push({ name: "nps-questionnaire-add", query: { actionType: this.actionType, questionnaireName: this.formData.questionnaireName, userType: this.formData.userType, }});
        }
      })
    }
  }
};
</script>

<style scoped  lang='less'>
  .edit_numberV{
    margin-left: -50px;
    text-align: right;
    width: 42px;
    z-index: 99999;
    font-size: 14px;
    font-weight: bolder;
    line-height: 36px;
    position: absolute;
    z-index: 1;
  }
  .ivu-form-item-content{
    text-align: center;
  }
  .button-group{
    display: flex;
    justify-content: flex-end;
    .ivu-btn-default{
      margin-right: 10px;
    }
  }
</style>

