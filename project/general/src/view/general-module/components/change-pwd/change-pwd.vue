<template>
  <div class="forgetpwd">
    <div class="formcontent">
      <Card class="card" icon="log-in" title :bordered="true">
        <Tabs :value="tabName" @on-click="tabsClick">
          <TabPane label="原密码修改" name="pwd" />
          <TabPane label="手机号修改" name="iphone" :disabled="isIphone" />
        </Tabs>
        <template v-if="isShow === 'pwd'">
          <primitive-pwd :login-info="loginInfo" />
        </template>
        <template v-else>
          <change-iphone
            :telephone="telephone"
            @on-success-valid="handleSubmit"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import changeIphone from "_a/iphone-pwd/index.vue";
import primitivePwd from "./primitive-pwd.vue";
import { userInfoMsg } from "_g/api/power.js";
import { mapActions } from "vuex";
import { deleteCookie } from "@/libs/util";

export default {
  components: {
    changeIphone,
    primitivePwd
  },
  data() {
    return {
      isIphone: true, // 是否拥有手机号
      isShow: "pwd",
      tabName: "pwd",
      telephone: "",
      loginInfo: JSON.parse(localStorage.getItem("loginInfo"))
    };
  },
  created() {},
  mounted() {
    this.getUserInfoMsg();
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleSubmit() {
      this.handleLogOut()
        .then(res => {
          deleteCookie();
          this.$router.push({
            name: "login"
          });
        })
        .catch(err => {
          console.log(err);
          deleteCookie();
          this.$router.push({
            name: "login"
          });
        });
    },
    tabsClick(name) {
      this.isShow = name;
    },
    getUserInfoMsg() {
      let data = {
        userId: this.loginInfo.userId
      };
      userInfoMsg(data).then(res => {
        if (res.data.success) {
          this.isIphone = false;
          this.telephone = res.data.data.mobile;
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "./change-pwd.less";
</style>
