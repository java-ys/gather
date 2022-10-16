
<template>
  <div class="create-content">
    <TypeSelect
      :actionType="actionType"
      :questionnaireInfo="questionnaireInfo"
      @cancel="cancel"
      @doQuestionnaire="doQuestionnaire"
    ></TypeSelect>
  </div>
</template>

<script>
import TypeSelect from "../component/TypeSelect"
import { questionnaireDetails, addQuestionnaire, editQuestionnaire } from "_o/api/nps/app.js";
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
    if (to.query.actionType === "edit") {
      to.meta.title = "编辑问卷"
    } else {
      to.meta.title = "复制问卷"
    }
    to.meta.closeAlert = true
    next();
  },
  mounted() {
    // 获取问卷信息
    // 获取详情
    questionnaireDetails({
      questionnaireId: this.$route.query.questionnaireId
    }).then(res => {
      this.actionType = this.$route.query.actionType
      this.questionnaireInfo = {
        questionnaireId: this.$route.query.questionnaireId,
        ...res.data.data
      }
      console.log(res.data.data)
    })
  },
  methods: {
    cancel() {
      this.$route.meta.closeAlert = false;
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "nps-questionnaire" });
    },
    doQuestionnaire(formData) {
      if (this.actionType === "copy") {
        addQuestionnaire(formData).then(res => {
          if (res.data.code === 200) {
            this.$Message.success((this.actionType === "add" ? "新增" : "复制") + "问卷成功");
            this.$route.meta.closeAlert = false;
            this.$store.commit("setChangeTab", this.$route);
            this.$router.push({ name: "nps-questionnaire" });
          }
        })
      } else if (this.actionType === "edit") {
        editQuestionnaire(formData).then(res => {
          if (res.data.code === 200) {
            this.$Message.success("编辑问卷成功");
            this.$route.meta.closeAlert = false;
            this.$store.commit("setChangeTab", this.$route);
            if (this.$route.query.isDetailSwitch) {
              this.actionType = "detail"
              this.$router.push({
                name: "nps-questionnaire-detail",
                query: { actionType: this.actionType, questionnaireId: this.$route.query.questionnaireId }
              });
            } else {
              this.$router.push({ name: "nps-questionnaire" });
            }

          }
        })
      }
    },
  }
};
</script>

<style scoped  lang='less'>
.create-content{
  padding: 30px 0
}
</style>