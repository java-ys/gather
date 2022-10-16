<template>
  <div id="home-div">
    <v-logo />
    <v-nav :changingNav="changingNav" @navChange="navChange" />
    <v-rightTop class="right-top-container" />
    <div id="home-main-container" class="main-container">
      <v-main />
    </div>
  </div>
</template>

<script>
import vNav from "_o/components/operator-center/salary-modules/components/nav"
import vMain from "_o/components/operator-center/salary-modules/components/main"
import vLogo from "_o/components/operator-center/salary-modules/components/logo"
import vRightTop from "_o/components/operator-center/salary-modules/components/rightTop"
import { refreshToken } from "_o/api/salary/auth";
import { logout } from "_o/common/account";

export default {
  name: "Home",
  components: {
    vMain, vLogo, vRightTop, vNav
  },
  data() {
    return {
      changingNav: false,
      lastTime: null,
      currentTime: null,
      // timeout: 1000 * 60 * 60 * 2 // 超时时间- 2小时（token失效时间）
      timeout: 1000 * 60 * 60 * 24
      // timeout: 1000*15
    }
  },
  created() {
    // if (!this.store.get("m2-driver-resume-web-success-get-resource")) {
    //   this.$alert("暂无菜单权限，请联系管理员！");
    // }

    this.lastTime = new Date().getTime();
    // 登录成功后，如果用户有持续的动作且未退出登录（两小时内有鼠标移动事件），则每隔一个小时刷新token
    /*      let refreshTokenByHour = setInterval(() => {
              if (!this.store.get('accessToken')) {
                clearInterval(refreshTokenByHour);
              }
              else {
                this.refreshToken();
              }
            }, 43199000) */
    // 根据token失效时间： expires_in得来
    // }, 20000)
  },
  methods: {
    // 界面长时间不移动超时处理
    // timeoutHandler() {
    //   this.currentTime = new Date().getTime();
    //   if (this.currentTime - this.lastTime > this.timeout) {
    //     this.$alert('登录超时，请重新登录');
    //     logout().then(() => this.$router.push('/login'));
    //   }
    //   else {
    //     // 刷新最后鼠标移动时间
    //     this.lastTime = new Date().getTime();
    //   }
    // },
    // 定时刷新token
    /*      refreshToken() {
              let errorMsg = '登录凭证失效，请重新登录（可能原因：1.长时间未操作，网络连接断开导致无法访问服务器，重新登录即可； 2.网络正常，刷新登录凭证的请求失败，服务器端有问题，此时需要联系开发运营人员）';
              refreshToken({"scope": "all", "grant_type": "refresh_token", "refresh_token": this.store.get('refreshToken')})
                .then(res => {
                  // console.log("===res: %o", res);
                  if (res && res.data) {
                    // 如果刷新token成功，服务器端返回access_token(用于支持后续请求头的鉴权凭证)和refresh_token(用于定时刷新token操作)将其保存在缓存中
                    if (res.data.access_token && res.data.refresh_token) {
                      // console.log("======刷新token成功，时间: %o", new Date());
                      this.store.set('accessToken', res.data.access_token);
                      this.store.set('refreshToken', res.data.refresh_token);
                    }
                    else if (res.data.msg) {
                      // console.error("======刷新token返回的错误信息: %o, 状态码: %o", res.data.msg, res.data.code);
                      // this.$alert(res.data.msg);
                      this.$alert(errorMsg);
                      localStorage.clear();
                      this.$router.push('/');
                    }
                  }
                  else {
                    this.$alert(errorMsg);
                    localStorage.clear();
                    this.$router.push('/');
                  }
                })
                .catch(err => {
                  // console.error("===refreshToken error config: %o", err.config)
                  // console.error("===refreshToken error message: %o", err.message)
                  this.$alert(errorMsg);
                  localStorage.clear();
                  this.$router.push('/');
                });
            }, */

    // 切换导航栏子菜单
    navChange(result) {
      this.changingNav = result;
      setTimeout(() => {
        this.changingNav = false;
      }, 0.1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  a {
    font-size: 14px;
  }

  .main-container {
    padding-left: 15px;
  }

  .top-container {
    top: 0;
    left: 180px;
    position: fixed;
    min-width: 80%;
    z-index: 9999;
  }

  .right-top-container {
    top: 0;
    right: 0;
    position: fixed;
    min-width: 10%;
    z-index: 9999;
  }

  .body-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .aside-container {
      height: 100%;
      background-color: #223233;
      margin: 0;
      padding: 0;
    }
  }

  .bg-purple {
    background: #FFFFFF;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-header, .el-footer {
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #545c64;
    color: #333;
    /*text-align: center;*/
    line-height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 720px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  /*全局覆盖校验表单成功时的绿色边框*/
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #dcdfe6;
  }

  .detail-prop-name {
    font-weight: bold;
  }

  .detail-row-title-text {
    font-weight: bold;
    font-size: 16px;
    margin: 15px 0 10px 8px;
  }

  img {
    cursor: pointer;
  }

  .detail-row-style {
    font-size: 15px;
    margin: 0 0 10px 30px;
    line-height: 1.6;
  }

  .border-validate-red {
    border: solid 1px #f56c6c !important;
    border-radius: 4px !important;
  }
</style>
