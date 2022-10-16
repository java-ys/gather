<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="left_bac_img">
      <img
        src="./images/loginBac.png"
        :height="Scheight"
        :style="{ marginLeft: '-150px' }"
      />
    </div>
    <div class="login-con">
      <Card icon="log-in" bordered style="height:460px ;right: 15%;">
        <div class="title_header">
          <img src="./images/t3_logo.png" alt />
          <p class="title_style">
            {{ appTitle }}
          </p>
        </div>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" />
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
    <Modal
      v-model="popChangePwdStatus"
      :width="600"
      :mask-closable="false"
      footer-hide
      title="修改初始密码"
    >
      <ChangePwd
        v-model="popChangePwdStatus"
        :old-pwd="oldPwd"
        :token="token"
      />
    </Modal>
  </div>
</template>

<script>
import LoginForm from "./components/login-form";
import ChangePwd from "../change_pwd/change_pwd";
import { mapActions } from "vuex";
const { appTitle } = require("@/config/setting.js");

export default {
  components: {
    LoginForm,
    ChangePwd
  },
  data() {
    return {
      Scheight: window.outerHeight,
      popChangePwdStatus: false,
      oldPwd: "",
      token: "",
      appTitle
    };
  },
  methods: {
    ...mapActions(["handleLogin", "getNavList", "getCommonData", "getDataDict", "getMallDict", "getMicroMenuRouteList", "handleAesAuth"]),
    handleSubmit({ userName, password }) {
      this.handleAesAuth().then(res => {
        let encryptedKey = res.data.data.encryptedKey;
        let random = res.data.data.random;
        this.handleLogin({ userName, password, encryptedKey, random }).then(res => {
          sessionStorage.setItem(this.$config.usernameStorageKey, userName);
          let loginInfo = res.data.data;
          loginInfo.password = password;
          localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
          if (res.data.code === 4105) {
            // 未修改密码首次登录
            this.$Message.info("首次登录请修改密码！");
            this.$router.push({ name: "change-pwd" });
          } else {
            this.$router.push({ name: this.$config.homeName });
            this.getNavList(); // 获取菜单列表
            this.getMicroMenuRouteList();
            this.getCommonData(); // 获取公用信息
            // 获取数据字典
            this.getDataDict()
            this.getMallDict() // 获取商城数据字典
          }
        });
      })
    }
  }
};
</script>
