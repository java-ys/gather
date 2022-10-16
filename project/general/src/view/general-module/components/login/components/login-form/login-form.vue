<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="userName">
      <Input
        v-model="form.userName"
        placeholder="请输入用户名"
        size="large"
        class="tt4_input"
        @on-change="watchForm"
      >
        <span
          slot="prefix"
          style="line-height: 33px"
        >
          <img
            src="./images/icon_Account@2x.png"
            width="16px"
            height="16px"
          >
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input
        v-if="reload"
        ref="password"
        v-model="password"
        :type="psdType"
        placeholder="请输入密码"
        size="large"
        class="tt4_input"
        @on-change="watchForm"
      >
        <span
          slot="prefix"
          style="line-height: 33px"
        >
          <img
            src="./images/icon_password@2x.png"
            width="16px"
            height="16px"
          >
        </span>
        <span
          v-if="psdType === 'text'"
          slot="suffix"
          style="line-height: 33px;cursor:pointer"
          @click="changePsdType('password')"
        >
          <img
            src="./images/icon_Open@2x.png"
            width="17px"
            height="11px"
          >
        </span>
        <span
          v-if="psdType === 'password'"
          slot="suffix"
          style="line-height: 33px;cursor:pointer"
          @click="changePsdType('text')"
        >
          <img
            src="./images/icon_shut down@2x.png"
            width="17px"
            height="12px"
          >
        </span>
      </Input>
    </FormItem>
    <div class="right_item">
      <router-link :to="{ name: 'forget-pwd' }">
        <span>忘记密码</span>
      </router-link>
    </div>
    <FormItem>
      <div
        type="primary"
        long
        size="large"
        :class="loginClass"
        @click="handleSubmit"
      >
        登录
      </div>
    </FormItem>
  </Form>
</template>
<script>
import config from "@/config/config";
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ];
      }
    }
  },
  data() {
    return {
      bool: true,
      replacePsd: "",
      form: {
        userName: config.userName || "",
        password: config.password || ""
      },
      password: "",
      psdType: "password",
      loginClass: "orangeBtnNot",
      reload: true
    };
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      };
    },
  },
  watch: {
    psdType(value) {
      if (value === "text") {
        this.password = this.form.password;
      } else {
        this.password = this.form.password.split("").map(item => "●").join("");
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            password: this.form.password
          });
        }
      }, 500);
    },
    watchForm() {
      // if (this.psdType === "text") {
      this.form.password = this.password;
      // } else {
      //   let realy = this.password.replace(/●/g, "");
      //   if (realy) {
      //     if (this.password.length > this.form.password.length) {
      //       this.form.password += realy;
      //     }
      //   }
      //   this.form.password = this.form.password.slice(0, this.password.length);
      //   let newValue = this.password;
      //   let str = newValue.split("").map(item => "●").join("");
      //   this.password = str;
      // }
      this.$refs.loginForm.validate(res => {
        if (res) {
          this.loginClass = "orangeBtn";
        } else {
          this.loginClass = "orangeBtnNot";
        }
      });


    },
    changePsdType(type) {
      this.psdType = type;
    },
  }
};
</script>
<style lang="less" scoped>
.right_item {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 25px;
    span {
        font-family: PingFangSC-Regular;
        cursor: pointer;
        font-size: 14px;
        color: #ff8533;
    }
}
.orangeBtnNot {
    width: 368px;
    height: 40px;
    opacity: 0.4;
    background: #ff8533;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    cursor: Default;
}
.orangeBtn {
    background: #ff8533;
    width: 368px;
    height: 40px;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
}
/deep/.tt4_input input {
    color: #000;
}
/deep/.tt4_input input:hover {
    border-color: #ffcead;
}
/deep/.tt4_input input:focus {
    border-color: #ffcead;
    box-shadow: none;
}
/deep/.ivu-form-item-error-tip {
    padding-top: 8px;
    font-size: 8px;
    color: #ff1a1a;
}
</style>
