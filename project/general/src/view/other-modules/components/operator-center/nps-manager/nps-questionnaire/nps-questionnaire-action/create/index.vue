
<template>
  <div class="create-content">
    <TypeSelect
      :actionType="actionType"
      :questionnaireInfo="questionnaireInfo"
      @cancel="cancel"
      @doQuestionnaire="doQuestionnaire"
      @switchToEdit="switchToEdit"
    ></TypeSelect>
  </div>
</template>

<script>
import TypeSelect from "../component/TypeSelect"
import { addQuestionnaire } from "_o/api/nps/app.js";
export default {
  name: "start-create",
  components: {
    TypeSelect
  },
  data() {
    return {
      questionnaireInfo: {},
      actionType: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    to.meta.closeAlert = true
    next();
  },
  mounted() {
    this.actionType = this.$route.query.actionType
    this.questionnaireInfo = this.$route.query
  },
  methods: {
    cancel() {
      this.$route.meta.closeAlert = false;
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "nps-questionnaire" });
    },
    switchToEdit() {

    },
    doQuestionnaire(formData) {
      addQuestionnaire(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success((this.actionType === "add" ? "新增" : "复制") + "问卷成功");
          this.$emit("addsuccess")
          this.$route.meta.closeAlert = false;
          this.$store.commit("setChangeTab", this.$route);
          this.$router.push({ name: "nps-questionnaire" });
        }
      })
    },
  }
};
</script>

<style scoped  lang='less'>
.create-content{
  padding: 30px 0
}
</style>

