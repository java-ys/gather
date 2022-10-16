<template>
  <div>
    <Form
      ref="loginForm"
      :model="formEmail"
      :rules="rulesEmail"
      @keydown.enter.native="handleSubmit"
    >
      <FormItem>
        <div class="email-name">
          {{ formEmail.userName }}
        </div>
      </FormItem>
      <FormItem prop="imgCode">
        <Input
          v-model="formEmail.imgCode"
          type="text"
          placeholder="图形校验"
          size="large"
          class="tt4_input"
        />
        <span
          class="check-img-box"
          @click="getRandomImage"
        >
          <img :src="imgCodeUrl">
        </span>
      </FormItem>
      <FormItem prop="password">
        <Input
          v-model="formEmail.password"
          :type="psdType"
          placeholder="设置新密码"
          size="large"
          class="tt4_input"
        >
        <span
          v-if="psdType === 'text'"
          slot="suffix"
          style="line-height: 33px;cursor:pointer"
          @click="changePsdType('password')"
        >
          <img
            src="./images/open@2x.png"
            alt
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
            src="./images/shut-down@2x.png"
            alt
            width="17px"
            height="12px"
          >
        </span>
        </Input>
      </FormItem>
      <FormItem prop="smsCode">
        <Input
          v-model="formEmail.smsCode"
          type="text"
          placeholder="验证码"
          :maxlength="11"
          size="large"
          class="tt4_input"
        />
        <Button
          v-show="isHasValidCode"
          class="check-code-box"
          @click="getValidCode"
        >
          <span class="text">获取验证码</span>
        </Button>
        <countDown
          v-show="!isHasValidCode"
          ref="countDown"
          class="count-down-box"
          :count-down="countNum"
          @send-again="getValidCode"
        />
      </FormItem>
      <FormItem>
        <div
          type="primary"
          long
          size="large"
          :class="loginClass"
          @click="handleSubmit"
        >
          提交
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>

import countDown from "_a/iphone-pwd/count-down.vue"

export default {
  name: "LoginForm",
  components: {
    countDown,
  },
  data() {
    return {
      formEmail: {
        userName: "t3chuxing1234@.com",
        password: "",
        imgCode: "",
        smsCode: ""
      },
      psdType: "password",
      loginClass: "orangeBtn",
      countNum: 59,
      isHasValidCode: true,
      imgCodeUrl: "",
      rulesEmail: {
        imgCode: [
          {
            required: true,
            message: "请输入图形校验",
            pattern: /^[0-9A-Za-z]{1,}$/,
            trigger: "blur"
          }
        ],
        smsCode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请设置新密码",
            pattern: /^[0-9A-Za-z]{8,16}$/,
            trigger: "blur"
          }
        ],
      }
    }
  },
  created() {
    this.getRandomImage();
  },
  methods: {
    getRandomImage() {
      this.randomCode = Math.random() + "_" + Math.random();
      // getImageCode(this.randomCode).then(res => {
      //   //获取图片base64
      //   if (res.data.success) {
      //     this.imgCodeUrl = `data:image/png;base64,${res.data.data.image}`;
      //   }
      // });
    },
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        console.log("valid==", valid)
        if (valid) {
          console.log(this.formEmail)

          // this.$emit('on-success-valid', {
          //   username: this.form.userName,
          //   password: MD5(MD5(this.form.password).toUpperCase()).toUpperCase()
          // })
        }
      })
    },
    forgetPwd() {
      console.log(333)
      this.$emit("forget-pwd", true)
    },
    changePsdType(type) {
      this.psdType = type;
    },
    getValidCode() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.getMessageCode();
        }
      });
    },
    getMessageCode() {
      // 获取短信验证码
      let pramas = {
        mobile: this.formEmail.mobile,
        imageCode: this.formEmail.imgCode,
        random: this.randomCode,
        type: "login"
      };
      console.log(pramas)

      this.isHasValidCode = false;
      this.$refs.countDown.startCount();

      // messageCode(pramas).then(res => {
      //   if (res.data.success) {
      //     this.isHasValidCode = false;
      //     this.$refs.countDown.startCount();
      //   }
      // });
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
  /deep/.check-img-box {
    width: 123px;
    height: 38px;
    margin-left: 8px;
    line-height: 40px;
    background: #FFFFFF;
    margin-top:-2px;
  img {
    width: 100%;
    height: 100%;
  }
  }
  /deep/.check-code-box {
    width: 100px;
    height: 40px;
    margin-left: 8px;
    line-height: 40px;
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
  }
  /deep/.ivu-form-item-content {
    display: flex;
  }
  /deep/.ivu-btn:hover {
    color: #ff9d5c;
    background-color: #fff;
    border-color: #ff9d5c;
  }
  /deep/.count-down-btn{
    width: 100px;
    height: 40px;
    margin-left: 8px;
    line-height: 40px;
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
  }
  /deep/.email-name {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #000000;
    letter-spacing: 0;
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
