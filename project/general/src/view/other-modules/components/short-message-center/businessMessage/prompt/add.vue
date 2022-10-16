<template>
  <Modal v-model="showModal" :title="title" width="800px" :z-index="1">
    <Form
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="提示场景:" prop="promptName">
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="formData.promptName"
          :maxlength="50"
          disabled
        />
      </FormItem>
      <br />
      <FormItem label="产品线" prop="productLine">
        <Select
          v-model="formData.productLine"
          clearable
          style="width:300px"
          disabled
        >
          <Option
            v-for="item in bizTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <br />
      <FormItem label="标题文案:" prop="promptTitle">
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="formData.promptTitle"
          :maxlength="20"
        />
      </FormItem>
      <!-- 动态template START -->
      <FormItem
        label="内容文案"
        class="ivu-form-item-required"
      >
        <div
          v-for="(item,index) in formData.promptList"
          :key="index" :label="index===0?'内容文案:':''"
        >
          <Input
            v-if="item.promptType===1"
            type="textarea"
            :autosize="true"
            v-model="item.promptDesc"
            clearable="clearable"
            style="width:300px"
            :maxlength="50"
          />
          <div class="text-description" v-if="item.promptType===2">
            {{item.promptDesc}}
          </div>
        </div>
      </FormItem>
      <!-- 动态template END-->
      <br />
      <FormItem label="状态:" prop="promptStatus">
        <RadioGroup v-model="formData.promptStatus">
          <Radio :label="1">
            <span>启用</span>
          </Radio>
          <Radio :label="0">
            <span>停用</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { validatorTime,promNameList } from "./fields";
import { promptUpdate,promptQueryById } from "_o/api/push-message.js";
import { mapState } from "vuex";
export default {
  name: "add",
  data() {
    let self = this;
    return {
      promNameList,
      showModal: false,
      queryId:null,
      title: "新增策略",
      formData: {},
      formValidate: {
        promptName: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: "[^ \x22]+",
            message: "不能输入全空格",
            trigger: "change"
          }
        ],
        productLine: [
          {
            type: "number",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        promptTitle: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: "[^ \x22]+",
            message: "不能输入全空格",
            trigger: "change"
          }
        ],
        promptStatus: [
          {
            type: "number",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed:{
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.queryId = val.id
      promptQueryById({id:this.queryId}).then(res=>{
        if(res.data.success){
          this.formData = res.data.data
        }
      })
      // this.formData = {
      //   promptList: val.promptList,
      //   promptName: val.promptName, // 提示场景
      //   productLine: val.productLine, // 产品线
      //   promptTitle: val.promptTitle, // 标题文案
      //   promptStatus: val.promptStatus, // 状态
      //   id: val.id // 状态
      // };
    },
    saveData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
      let params = {
        id: this.formData.id,
        promptTitle: this.formData.promptTitle,
        promptList: this.formData.promptList,
        promptStatus: this.formData.promptStatus
      };
      promptUpdate(params).then(res => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.text-description {
  //margin-left: 100px;
  //margin-top: 0px;
  //margin-bottom: 10px;
}
</style>
