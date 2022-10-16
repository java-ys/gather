<template>
  <div>
    <Form
      ref="loginForm"
      :model="formDate"
      :rules="rulesPwd"
      @keydown.enter.native="handleSubmit"
    >
      <FormItem prop="oldPwd">
        <Input
          v-model="formDate.oldPwd"
          :readonly="true"
          placeholder="输入旧密码"
          size="large"
          class="tt4_input"
        />
      </FormItem>
      <FormItem prop="newPwd">
        <Input
          v-model="formDate.newPwd"
          :readonly="true"
          type="password"
          placeholder="设置新密码"
          size="large"
          class="tt4_input"
        />
      </FormItem>
      <FormItem prop="surePwd">
        <Input
          v-model="formDate.surePwd"
          :readonly="true"
          type="password"
          placeholder="确认新密码"
          size="large"
          class="tt4_input"
        />
      </FormItem>

      <FormItem>
        <div
          type="primary"
          long
          size="large"
          class="orangeBtn"
          @click="handleSubmit"
        >
          提交
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>

import MD5 from "js-md5"
import { updateNewPassword } from "_g/api/power.js"
import { redirectToHome } from "@/libs/util";
import { mapActions } from "vuex"

export default {
  name: "PrimitivePwd",
  props: {
    loginInfo: {
      type: Object
    },
  },
  data() {
    let pwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请设置新密码"));
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
        callback("长度8至16位，必须包含大小写及数字");
      } else {
        callback();
      }
    };
    let confirmPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入密码"));
      } else if (this.formDate.newPwd !== value) {
        callback("2次密码不一致");
      } else {
        callback();
      }
    };
    return {
      formDate: {
        oldPwd: "",
        newPwd: "",
        surePwd: ""
      },
      rulesPwd: {
        oldPwd: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            required: true,
            validator: pwd,
            // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            trigger: "blur"
          }
        ],
        surePwd: [
          {
            required: true,
            validator: confirmPwd,
            trigger: "blur"
          }
        ],
      },
    }
  },
  created() {
    // this.formDate.oldPwd = this.loginInfo.password;
  },
  mounted() {
    setTimeout(() => {
      let inputs = document.querySelectorAll(".ivu-input");
      for (let i = 0, length = inputs.length; i < length; i++) {
        inputs[i].readOnly = false;
      }
    }, 500)
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let data = {
            systemId: "1005",
            id: this.loginInfo.userId,
            oldPassword: MD5(MD5(this.formDate.oldPwd).toUpperCase()).toUpperCase(),
            password: MD5(MD5(this.formDate.newPwd).toUpperCase()).toUpperCase(),
            operatorId: this.loginInfo.userId,
          }
          updateNewPassword(data).then(res => {
            if (res.data.success) {
              this.$Message.success("修改成功,请重新登入！")
              this.handleLogOut().then(() => {
                // this.$router.push({ name: "login" })
                redirectToHome()
              })
            }
          });
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
  /deep/.orangeBtn {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    background: #ff8533;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  /deep/.tt4_input input{
    color:#000;
    /* background: #F3F3F7 */
  }
  /deep/.tt4_input input:hover{
    border-color: #ffcead;
  }
  /deep/.tt4_input input:focus{
    border-color: #ffcead;
    box-shadow:none
  }
  /deep/.ivu-form-item-error-tip{
    padding-top: 8px !important;
    font-size: 8px;
    color: #FF1A1A !important;
  }

</style>
