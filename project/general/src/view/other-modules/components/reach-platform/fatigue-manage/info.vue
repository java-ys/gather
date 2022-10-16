<template>
  <div class="fatigue-info">
    <Form
      ref="form"
      :model="info"
      :rules="rules"
    >
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="规则名称：" label-position="top" prop="ruleName">
            <Input
              v-model="info.ruleName"
              placeholder="请输入"
              :maxlength="32"
            >
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="发送对象：" label-position="top" prop="target">
            <Select
              v-model="info.target"
              placeholder="请选择"
            >
              <Option
                v-for="item in targetList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
          <FormItem label="通道类型：" label-position="top" prop="protocol">
            <Select
              v-model="info.protocol"
              placeholder="请选择"
            >
              <Option
                v-for="item in wayList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="消息类型：" label-position="top" prop="templateType">
            <Select
              v-model="info.templateType"
              placeholder="请选择"
            >
              <Option
                v-for="item in typeList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="疲劳度规则：" label-position="top" prop="fatigueRuleFront">
            <Input
              v-model="info.fatigueRuleFront"
              type="textarea"
              :maxlength="100"
              placeholder="格式如：1D<3,3H<1,7D<2"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="防打扰时段：" label-position="top" prop="disturbTimeFront">
            <Input
              v-model="info.disturbTimeFront"
              type="textarea"
              :maxlength="100"
              placeholder="格式如：00:00-01:00,00:30-03:00,05:00-09:00,23:00-00:30"
            />
          </FormItem>
        </Col>
      </Row>
      <div>
        <Button type="primary" @click="onSubmit">确定</Button>
        <Button @click="onCancel">取消</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { postFatigueRule, putFatigueRule, queryFatigueRule } from "_o/api/reach-platform";
import { formMixin } from "../mixin"
import { REACH_WAY_LIST, TEMPLATE_TYPE_LIST, TARGET_LIST } from "../field"
import { createRule } from "../util";

export default {
  name: "fatigue-info",
  mixins: [formMixin],
  data: () => ({
    info: {
      protocol: "",
      templateType: "",
      ruleStatus: "",
      fatigueRuleFront: "",
      disturbTimeFront: ""
    },
    rules: {
      ruleName: createRule("请输入规则名称", "string"),
      target: createRule("请选择发送对象"),
      protocol: createRule("请选择通道类型"),
      templateType: createRule("请选择消息类型"),
      ruleStatus: createRule("请选择状态"),
      fatigueRuleFront: [
        createRule("请输入疲劳度规则", "string", "blur"),
        { trigger: "blur", pattern: /^\d+[DH]<\d+(,\d+[DH]<\d+)*,?$/, message: "格式不正确" },
        {
          trigger: "blur",
          validator(_, value, cb) {
            const isValid = value.split(",").every(rule => {
              const [time, num] = rule.split("<");
              return Number(time.replace(/\D/, "")) && Number(num);
            });
            isValid ? cb() : cb(new Error("不能配置为0"));
          }
        }
      ],
      disturbTimeFront: {
        type: "string",
        trigger: "blur",
        pattern: (() => {
          const hmReg = "([01]\\d|2[0-3]):([0-5]\\d)";
          const rangeReg = hmReg + "-" + hmReg;
          return new RegExp(`^${rangeReg}(,${rangeReg})*,?$`);
        })(),
        message: "格式不正确"
      },
    },
    wayList: REACH_WAY_LIST,
    typeList: TEMPLATE_TYPE_LIST,
    targetList: TARGET_LIST,
  }),
  computed: {
    isEdit() {
      return this.$route.query.type === "edit";
    }
  },
  watch: {
    "$route.params.id": {
      handler(value) {
        if (value !== "create") this.updateInfo(value);
      },
      immediate: true,
    }
  },
  methods: {
    updateInfo(uuid) {
      /* eslint-disable no-return-assign */
      queryFatigueRule({ uuid }).then(res => this.info = res).catch(err => this.$Message.error(err.msg));
    },
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (!valid) return;
        this.$Modal.confirm({
          title: "确定提交？",
          onOk: () => (this.info.uuid ? putFatigueRule : postFatigueRule)(this.info).then(() => {
            this.$Message.success("提交成功");
            setTimeout(this.onCancel, 2000);
          }).catch(err => this.$Message.error(err.msg)),
        })
      })
    },
    onCancel() {
      this.$router.back();
      this.$store.commit("setChangeTab", this.$route);
    },
  }
};
</script>

<style lang="less" scoped>
.field-value {
  display: inline-block;
  width: 100%;
}
</style>