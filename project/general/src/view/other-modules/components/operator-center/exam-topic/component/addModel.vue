<template>
  <div>
    <Form ref="refForm" :model="formItem" :label-width="100" :rules="topRules">
      <Row>
        <Col span="12">
          <FormItem label="题目类别：" prop="categoryId">
            <Select
              v-model="formItem.categoryId"
              clearable
              :disabled="categoryDisabled"
              class="item-style"
              :label-in-value="true"
              @on-change="getGroupId"
            >
              <Option
                v-for="item in optionList"
                :value="`${item.value}`"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem :label-width="0" prop="categoryName">
            <Input v-model="formItem.categoryName" class="item-style" placeholder="可输入新类别名称" />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="题目标题：" prop="questions">
        <Input v-model="formItem.questions" type="textarea" :maxlength="200" placeholder="请输入标题，200字符以内" />
      </FormItem>
      <Row>
        <Col span="4">
          <FormItem label="题目答案：" prop="optCheck">
            <CheckboxGroup v-model="formItem.optCheck">
              <Checkbox
                v-for="(item, key) in formItem.answerData"
                :key="key"
                border
                style="margin-bottom: 25px"
                :label="key + 1"
              >{{ placeholder }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
        <Col span="18">
          <FormItem
            v-for="(item, key) in formItem.answerData"
            :key="key"
            :label-width="10"
            :prop="'answerData.' + key + '.value'"
            :rules="{
            required: true,
            message: '请输入答案',
            trigger: 'blur'
          }"
          >
            <Input v-model="item.value" placeholder="请输入答案，200字符以内" :maxlength="200" />
          </FormItem>
        </Col>
        <Col span="2">
          <div
            v-for="(item, key) in formItem.answerData"
            :key="key"
            style="margin-bottom: 35px;margin-top: 5px; margin-left: 5px"
          >
            <!-- 新增icon -->
            <Icon
              v-if="key === formItem.answerData.length - 1"
              type="md-add-circle"
              size="24"
              @click.native="addAnsItem"
            />
            <!-- 删除icon -->
            <Icon type="ios-remove-circle" size="24" color="#f00" @click.native="delAnsItem(key)" />
          </div>
        </Col>
      </Row>
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" style="margin-right: 8px;" @click="e=>cancel()">取消</Button>
      <Button size="large" type="primary" @click.native="confirm">确定</Button>
    </div>
  </div>
</template>

<script>
import s from "_o/api/study-exam";
import { tool, isFunc } from "_o/api/baseMixin.js";

const validateTitle = (rule, value, callback) => {
  if (!value) {
    callback("请输入标题");
  } else if (value.length > 200) {
    callback("请输入200字符以内");
  } else {
    callback();
  }
};
const validateCondition = (rule, value, callback) => {
  if (!value || !value.length) {
    callback("请选择正确答案");
  } else {
    callback();
  }
};
const validateGroupId = (rule, value, callback) => {
  if (value) {
    callback();
  } else {
    callback("请选择题目类别");
  }
};
const idRule = [{ validator: validateGroupId, trigger: "change" }]
const Max_Num = 5; // 最大可设置5个答案选项
const Min_Num = 2; // 最少需设置2个答案选项

export default {
  name: "AddModel",
  mixins: [tool],
  props: {
    formItem: {
      type: Object,
      default: () => {}
    },
    action: {
      type: String,
      default: "add"
    },
    optionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      topRules: {
        categoryId: idRule,
        questions: [{ validator: validateTitle, trigger: "blur" }],
        optCheck: [{ validator: validateCondition, trigger: "change" }],
        categoryName: [{ message: "请输入新类别名称", trigger: "change" }]
      },
      placeholder: "",
      categoryDisabled: false
    };
  },
  watch: {
    "formItem.categoryName": {
      handler(newV) {
        if (newV) {
          let fi = this.$refs.refForm.fields;
          let ff = fi.find(it => it.prop === "categoryId");
          if (ff && isFunc(ff.resetField)) {
            ff.resetField();
          }
          // this.topRules.categoryId.shift()
          this.topRules.categoryId = []
        } else {
          // this.topRules.categoryId.unshift(idRule)
          this.topRules.categoryId = idRule

        }
        this.categoryDisabled = !!newV;
      },
      deep: true
    }
  },
  methods: {
    async confirm() {
      this.$refs.refForm.validate(async valid => {
        if (!valid) {
          // this.$Message.error("表单验证不通过");
          return;
        }
        this.formatConfirmData();
      });
    },
    formatParams() {
      let {
        answerData,
        categoryId,
        categoryName,
        questions,
        optCheck
      } = this.formItem;
      let questionAnswerDtoList = [];
      for (let i = 0; i < answerData.length; i++) {
        questionAnswerDtoList.push({
          optionStatus: optCheck.includes(i + 1) ? 1 : 2,
          optionDescription: answerData[i].value
        });
      }
      let param = {
        categoryId,
        categoryName,
        questions,
        questionAnswerDtoList
      };
      // console.log(param);
      return param;
    },
    async formatConfirmData() {
      let param = this.formatParams();
      const isAdd = this.action === "add";
      const isEdit = this.action === "edit";
      let content = isAdd ? "添加成功" : isEdit ? "编辑成功" : "";
      let func = isAdd ? s.questionAdd : isEdit ? s.questionEdit : "";
      if (!func) return;
      let p = isAdd ? param : { id: this.formItem.id, ...param };
      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.cancel(true);
      content &&
        this.$Message.success({
          content
        });
    },
    clear() {
      // this.formItem.categoryId = ""
      // this.formItem.categoryName = ""
      this.$refs.refForm.resetFields();
    },
    cancel(refresh = false) {
      this.clear();
      this.$emit("cancel", refresh);
    },
    addAnsItem() {
      let { answerData } = this.formItem;
      if (answerData.length < Max_Num) {
        answerData.push({ status: 0, value: "" });
      } else {
        this.$Message.error(`最多可设置${Max_Num}个答案选项`);
      }
    },
    delAnsItem(i) {
      let { answerData } = this.formItem;
      if (answerData.length > Min_Num) {
        answerData.splice(i, 1);
      } else {
        this.$Message.error(`最少需设置${Min_Num}个答案选项`);
      }
    },
    getGroupId(v) {
      if (v) {
        this.formItem.groupName = v.label;
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-form-item-error-tip {
  min-width: 120px;
}
.popView-footer-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
.item-style {
  width: 250px;
}
</style>
