
<template>
  <div class="create-content">
    <TypeSelect
      :actionType="actionType"
      :questionnaireInfo="questionnaireInfo"
      @cancel="cancel"
      @switchToEdit="switchToEdit"
      @copyPreviwLink="copyPreviwLink"
    ></TypeSelect>
  </div>
</template>

<script>
import TypeSelect from "../component/TypeSelect"
import { questionnaireDetails } from "_o/api/nps/app.js";
import config from "@/config/config";
const priviewUrl =
  process.env.NODE_ENV === "development"
    ? config.previewUrl.dev
    : config.previewUrl.pro;
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
    to.meta.closeAlert = false
    next();
  },
  mounted() {
    // 获取问卷信息
    // 获取详情
    if (!this.$route.query.questionnaireId) return
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
    copyPreviwLink(item) {
      // 环境匹配
      let linkAddress = priviewUrl + "/m2-passenger/nps.html#/questionnaire?type=preview&questionnaireId=" + item.questionnaireId
      console.log(linkAddress)
      this.clickCopy(linkAddress)
    },
    clickCopy(content) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", content);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$Message.success("复制链接成功！请在新的标签页打开");
      }
      document.body.removeChild(input);
    },
    cancel() {
      this.$route.meta.closeAlert = false;
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "nps-questionnaire" });
    },
    switchToEdit() {
      this.actionType = "edit"
      this.$router.push({
        name: "nps-questionnaire-edit",
        query: { actionType: this.actionType, isDetailSwitch: true, questionnaireId: this.$route.query.questionnaireId }
      });
      // this.$route.meta.closeAlert = false;
      // this.$store.commit("setChangeTab", this.$route);
      // setTimeout(() => {
      //   this.$router.push({
      //     name: "nps-questionnaire-edit",
      //     query: { actionType: this.actionType, questionnaireId: this.$route.query.questionnaireId }
      //   });
      // }, 1000);
    }
  }
};
</script>

<style scoped  lang='less'>
.create-content{
  padding: 30px 0
}
</style>