<template>
  <div>
    <Form
      ref="iphonePwd"
      :model="formIphone"
      :rules="rulesIphone"
      @keydown.enter.native="handleSubmit"
    >
      <FormItem prop="iphone">
        <Input
          v-if="telephone === ''"
          v-model="formIphone.iphone"
          placeholder="请输入手机号"
          size="large"
          class="tt4_input"
          :readonly="true"
        />
        <div
          v-else
          class="telephone"
        >
          {{ formIphone.iphone }}
        </div>
      </FormItem>
      <FormItem prop="imgCode">
        <Input
          v-model="formIphone.imgCode"
          type="text"
          placeholder="图形校验"
          size="large"
          class="tt4_input"
          :readonly="true"
        />
        <span
          class="check-img-box"
          @click="getRandomImage"
        >
          <img
            v-if="imgCodeUrl"
            :src="imgCodeUrl"
          >
        </span>
      </FormItem>
      <FormItem prop="password">
        <Input
          v-model="formIphone.password"
          :type="psdType"
          placeholder="设置新密码"
          size="large"
          class="tt4_input"
          :readonly="true"
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
          v-model="formIphone.smsCode"
          type="text"
          placeholder="验证码"
          :maxlength="11"
          size="large"
          class="tt4_input"
          :readonly="true"
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
import countDown from "./count-down.vue"
import { getImageInfo, getSmsInfo, updatePasswordByPhone } from "_g/api/power.js"
import { getToken } from "@/libs/util"

export default {
  name: "IphonePwd",
  components: {
    countDown,
  },
  props: {
    operateType: {
      type: Number,
      default: 1  // 1：修改密码；2：忘记密码；3：登录；4：微信绑定
    },
    telephone: {
      type: String,
      default: ""
    },
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    return {
      formIphone: {
        iphone: "",
        password: "",
        imgCode: "",
        smsCode: "",
      },
      psdType: "password",
      countNum: 59,
      isHasValidCode: true,
      imgCodeUrl: "",
      imgCodeNum: null,
      rulesIphone: {
        iphone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        imgCode: [
          {
            required: true,
            message: "请输入图形校验",
            pattern: /^[0-9A-Za-z]{1,}$/,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "长度8至16位，必须包含大小写及数字",
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            trigger: "blur"
          }
        ],
      },

    }
  },
  created() {
    this.formIphone.iphone = this.telephone;
    this.getRandomImage();
  },
  mounted() {
    setTimeout(function () {
      let input = document.querySelectorAll(".ivu-input");
      for (let i = 0; i < input.length; i++) {
        document.querySelectorAll(".ivu-input")[i].readOnly = false;
      }
    }, 500)
  },
  methods: {
    getRandomImage() {
      this.randomCode = Math.random() + "_" + Math.random();
      let data = {
        random: this.randomCode,
        operateType: this.operateType,
      }
      getImageInfo(data).then(res => {
        // 获取图片base64
        if (res.data.success) {
          this.imgCodeUrl = `data:image/png;base64,${res.data.data.image}`;
        }
      });
    },
    handleSubmit() {
      this.$refs.iphonePwd.validate((valid) => {
        if (valid) {
          if (this.imgCodeNum && this.imgCodeNum !== this.formIphone.imgCode) {
            this.$Message.error("图形验证码不正确 !");
            return false
          } else if (this.imgCodeNum == null) {
            this.$Message.error("请获取验证码 !");
            return false
          }
          let obj = {
            systemId: 1005,
            phone: this.formIphone.iphone,
            password: MD5(MD5(this.formIphone.password).toUpperCase()).toUpperCase(),
            smsCode: this.formIphone.smsCode,
            operateType: this.operateType,
            imageCode: this.formIphone.imgCode,
            random: this.randomCode,
          }
          updatePasswordByPhone(obj).then(res => {
            if (res.data.success) {
              let info = getToken() ? "修改成功,请重新登入！" : "修改成功,请登入！";
              this.$Message.success(info);
              this.$emit("on-success-valid");
            }
          });

        }
      })
    },
    changePsdType(type) {
      this.psdType = type;
    },
    getValidCode() {
      this.$refs.iphonePwd.validate(valid => {
        if (valid) {
          this.getMessageCode();
        }
      });
    },
    getMessageCode() {
      // 获取短信验证码
      let pramas = {
        mobile: this.formIphone.iphone,
        operateType: this.operateType,
        flag: true,
        imageCode: this.formIphone.imgCode,
        random: this.randomCode,
      };

      getSmsInfo(pramas).then(res => {
        if (res.data.success) {
          this.imgCodeNum = this.formIphone.imgCode;
          this.isHasValidCode = false;
          this.$refs.countDown.startCount();
        }
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.getRandomImage();
      });
    },
  }
}
</script>

<style lang="less" scoped>
  /deep/.telephone{
    font-size: 24px;
    color: #000000;
    letter-spacing: 0;
  }
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
    margin-top: 0;
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
