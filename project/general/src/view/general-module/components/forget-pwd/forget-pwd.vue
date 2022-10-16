<template>
  <div class="forgetpwd">
    <div class="formcontent">
      <div class="title">
        找回密码
      </div>
      <Card class="card" icon="log-in" title :bordered="true">
        <Tabs :value="tabName" @on-click="tabsClick">
          <TabPane label="手机找回" name="iphone" :disabled="isIphone" />
          <TabPane label="邮箱找回" name="email" :disabled="isEmail" />
        </Tabs>
        <template v-if="isShow === 'iphone'">
          <forget-iphone
            :operate-type="operateType"
            @on-success-valid="handleSubmit"
          />
        </template>
        <template v-else>
          <forget-email @on-success-valid="handleSubmit" />
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import forgetIphone from "_a/iphone-pwd/index.vue";
import forgetEmail from "./forget-email.vue";
import { redirectToHome } from "@/libs/util";
import { mapActions } from "vuex";

export default {
  components: {
    forgetIphone,
    forgetEmail
  },
  data() {
    return {
      isIphone: false, // 是否拥有手机号
      isEmail: true, // 暂时不支持邮件
      isShow: "iphone",
      tabName: "iphone",
      operateType: 2
    };
  },
  mounted() {
    this.tabName = this.isIphone ? "email" : "iphone";
    if (this.isIphone) this.isShow = "email";
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    tabsClick(name) {
      this.isShow = name;
    },
    handleSubmit() {
      this.handleLogOut().then(() => {
        // this.$router.push({ name: "login" });
        redirectToHome()
      });
    }
  }
};
</script>
<style lang="less">
@import "./forget-pwd.less";
</style>
