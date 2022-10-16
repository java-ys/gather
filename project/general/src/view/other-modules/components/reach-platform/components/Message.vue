<template>
  <div class="message">
    <Form>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="模版名称：" prop="templateName">
            <span class="field-value">{{info.templateName}}</span>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="业务场景：" prop="templateSecne">
            <span class="field-value">{{info.secneName}}</span>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="模版类型：" prop="templateType">
            <span class="field-value">{{info.templateType|typeName}}</span>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="模版状态：" prop="tempStatus">
            <span class="field-value">{{["有效", "无效", "待审批", "审批不通过", "删除"][info.tempStatus - 1]}}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="模版说明：" prop="remark">
            <span class="field-value">{{info.remark}}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="模版内容：" prop="remark">
            <div class="field-value">
              <template v-for="(v,i) of info.params">
                <span v-if="v.type === 'text'" :key="i">{{v.value}}</span>
                <Input v-else :key="i" v-model="v.value" :placeholder="v.key" style="width: 100px;margin: 0 4px;" @on-change="onInputChange" />
              </template>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem prop="remark">
            <span slot="label">消息预览：<span style="color: #57a3f3;">{{content.length}}/{{content.length <= 70 ? 1 : content.length < 129 ? 2 : content.length < 196 ? 3 : 4}}条</span></span>
            <span class="field-value">{{content}}</span>
          </FormItem>
        </Col>
      </Row>
      <div>
        <Button type="primary" @click="onConfirm">确定</Button>
        <Button @click="$emit('back')">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { TEMPLATE_TYPE_LIST } from "../field"

export default {
  name: "Message",
  filters: {
    typeName: t => TEMPLATE_TYPE_LIST.find(v => v.value === t)?.label || "",
  },
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    info: { params: [] }
  }),
  computed: {
    content() {
      return this.info.params.map(v => v.value).join("")
    }
  },
  created() {
    this.info = {
      ...this.template,
      ...this.info,
      params: ((str) => {
        const result = [{ type: "text", value: "【ab】" }];
        const reg = /\$\{(\w+)\}/g;
        let res;
        let index = 0;
        while ((res = reg.exec(str))) {
          result.push({ type: "text", value: str.slice(index, res.index) }, { type: "param", key: res[1], value: "" });
          index = res.index + res[0].length;
        }
        index < str.length && result.push({ type: "text", value: str.slice(index) });
        if (this.template.templateType === 2) result.push({ type: "text", value: "退订TD" })
        return result;
      })(this.template.content),
    };
  },
  methods: {
    onConfirm() {
      if (this.info.params.some(v => v.type === "param" && !v.value)) return this.$Message.warning("请填写参数内容");
      this.$emit("confirm", {
        ...this.info,
        content: this.content,
      })
    },
    onInputChange(e) {
      e.target.parentElement.style.width = "100px";
      e.target.parentElement.style.width = Math.min(Math.max(e.target.scrollWidth, 100), 590) + "px";
    }
  }
};
</script>

<style lang="less" scoped>
.field-value {
  display: inline-block;
  width: 100%;
}
</style>