
<template>
  <div>
    <div class="copy-content">
      <p>确定复制问卷“{{questionnaireInfo.questionnaireName}}”？</p>
    </div>
    <div slot="footer" class="button-group">
      <Button @click="cancel">取消</Button>
      <Button v-lazy-click="ensureCopy" type="primary">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "start-create",
  components: {

  },
  props: {
    questionnaireInfo: {
      type: Object
    },
    actionType: {
      type: String
    }
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    ensureCopy() {
      this.$router.push({
        name: "nps-questionnaire-edit",
        query: { actionType: this.actionType, questionnaireId: this.questionnaireInfo.questionnaireId }
      })

    }
  }
};
</script>

<style scoped  lang='less'>
  .copy-content{
    font-size: 16px;
    font-weight: bolder;
    margin: 10px 0 40px 0;
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

