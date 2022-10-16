<template>
  <Form ref="formValidate" class="channel-nps" :model="formValidate" :rules="cRuleValidate" :label-width="150">
    <FormItem label="发送方式" style="width: 350px" prop="pushChannelList">
      <RadioGroup v-model="formValidate.pushChannelList">
        <Radio
          v-for="(value, key) in pushChannelMapList"
          :key="key"
          :label="Number(key)"
        >
          {{value}}
        </Radio>
      </RadioGroup>
    </FormItem>

    <FormItem v-if="formValidate.pushChannelList === 1" label="短信模板" style="width: 650px" prop="pushContent">
      <Input v-model.trim="formValidate.pushContent" :maxlength="30" show-word-limit type="textarea" placeholder="此处输入用户收到的短信内容，字数30字以内" />
      <span class="edit_numberV">{{formValidate.pushContent.length || 0}}/30</span>
    </FormItem>
    <template v-if="formValidate.pushChannelList === 3">
      <FormItem label="公告标题" style="width: 650px" prop="noticeTitle">
        <Input v-model.trim="formValidate.noticeTitle" :maxlength="20" show-word-limit type="text" placeholder="此处输入公告标题，字数30字以内" />
      </FormItem>
      <FormItem label="公告副标题" style="width: 650px" prop="noticeSubTitle">
        <Input v-model.trim="formValidate.noticeSubTitle" :maxlength="50" show-word-limit type="textarea" placeholder="此处输入公告副标题，字数50字以内" />
        <span class="edit_numberV">{{formValidate.noticeSubTitle && formValidate.noticeSubTitle.length || 0}}/50</span>
      </FormItem>
    </template>
    <template v-if="formValidate.pushChannelList === 4">
      <FormItem label="推送标题" style="width: 650px" prop="noticeTitle">
        <Input v-model.trim="formValidate.noticeTitle" :maxlength="20" show-word-limit type="text" placeholder="此处输入推送标题，字数30字以内" />
      </FormItem>
      <FormItem label="推送副标题" style="width: 650px" prop="noticeSubTitle">
        <Input v-model.trim="formValidate.noticeSubTitle" :maxlength="50" show-word-limit type="textarea" placeholder="此处输入推送副标题，字数50字以内" />
        <span class="edit_numberV">{{formValidate.noticeSubTitle && formValidate.noticeSubTitle.length || 0}}/50</span>
      </FormItem>
    </template>
  </Form>
</template>

<script>
// import { pushChannelMap } from "../../../fields";
export default {
  name: "channel",
  props: {
    formValidate: {
      type: Object,
      default: {}
    }
  },
  data() {
    const validateChannel = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("发送渠道不能为空"));
      }
    };
    return {
      cRuleValidate: {
        pushChannelList: [
          { validator: validateChannel, required: true, message: "发送渠道不能为空", trigger: "blur" }
        ],
        noticeTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        pushContent: [
          { required: true, message: "发送内容不能为空", trigger: "blur" }
        ]
      },
      pushChannelMapList: {
        1: "短信",
        4: "乘客端push推送"
      },
      // pushChannelMap,
    }
  },
  watch: {
    "formData.userType"() {
      console.log("this.formValidate>>>>1", this.formValidate.userType)
      if (this.formValidate.userType === 1) {
        this.pushChannelMapList = {
          1: "短信",
          4: "乘客端push推送",
        }
      } else {
        if (this.formValidate.userType === 2) {
          this.pushChannelMapList = {
            1: "短信",
            3: "司机公告",
          }
        }
      }
    }
  },
  mounted() {
    console.log("this.formValidate>>>>2", this.formValidate.userType)
    if (this.formValidate.userType === 1) {
      this.pushChannelMapList = {
        1: "短信",
        4: "乘客端push推送",
      }
    } else {
      if (this.formValidate.userType === 2) {
        this.pushChannelMapList = {
          1: "短信",
          3: "司机公告",
        }
      }
    }
  },
  methods: {
    dataChange() {
      // 直接把数据发送给父组件
      let formValidate = JSON.parse(JSON.stringify(this.formValidate))
      formValidate.pushChannelList = [formValidate.pushChannelList]
      this.$emit("update", formValidate);
    }
  }
}
</script>

<style scoped lang="less">
  .channel-nps{
    .edit_numberV{
      width: 100%;
      text-align: right;
      display: inline-block;
      position: relative;
      top: -28px;
      right: 7px;
    }
    /deep/.ivu-form-item-error-tip{
      top:60px;
    }
  }

</style>
