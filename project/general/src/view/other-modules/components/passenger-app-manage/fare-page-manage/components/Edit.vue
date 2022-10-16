<template>
  <Form
    v-if="form"
    ref="form"
    :model="form"
    :rules="rules"
  >
    <FormItem
      label="策略名称"
      prop="strategyName"
      :label-width="140"
    >
      <Input v-model="form.strategyName" :disabled="readonly" :maxlength="20" placeholder="请输入策略名称" />
    </FormItem>
    <FormItem
      prop="expandBizLine"
      :label-width="140"
      label="业务线"
    >
      <Select v-model="form.expandBizLine" :disabled="readonly">
        <Option v-for="item in businessGradeList" :key="item.value" :label="item.label" :value="item.value"></Option>
      </Select>
    </FormItem>
    <FormItem
      prop="estimateDesc"
      :label-width="140"
      label="预估价说明"
    >
      <u-editor
        v-show="visible && !readonly"
        ref="uEditor"
        v-model="form.estimateDesc"
        :inputMax="1000"
        class="step-editor"
        :maximumWords="2000"
      ></u-editor>
      <div v-show="readonly" v-html="form.estimateDesc">
      </div>
      <Button type="primary" style="margin-top: 10px" @click="viewDemo">查看示例</Button>
    </FormItem>
    <FormItem
      prop="commonProblemIds"
      :label-width="140"
      label="常见问题"
    >
      <Button v-if="!readonly" type="primary" @click="addQuestion">添加问题</Button>
      <div
        v-for="(item, index) in commonProblemList"
        :key="index"
        class="drag-list"
        :draggable="!readonly"
        @dragstart="handleDragStart(index)"
        @dragover="handleDragOver"
        @drop="handleDrop(index)"
      >
        <div class="block">
          <h3 class="title">{{item.title}}</h3>
          <p class="answer">{{item.questionContent}}</p>
        </div>
        <Icon
          v-if="!readonly"
          type="ios-menu"
        />
        <span
          v-if="!readonly" @click="removeQuestion(index)"
        >删除</span>
      </div>
    </FormItem>
    <FormItem
      prop="contactCustomer"
      :label-width="140"
      label="行程结束后是否需要【联系客服】按钮"
    >
      <RadioGroup v-model="form.contactCustomer" :disabled="readonly">
        <Radio :label="1" :disabled="readonly">露出</Radio>
        <Radio :label="2" :disabled="readonly">不露出</Radio>
      </RadioGroup>
      <p class="red">*仅对行程结束后的费用详情页面生效</p>
    </FormItem>
    <FormItem
      prop="effectiveImmediately"
      :label-width="140"
      label="配置生效时间"
      :disabled="readonly"
    >
      <RadioGroup v-model="form.effectiveImmediately">
        <Radio :label="1" :disabled="readonly">立即生效</Radio>
        <Radio :label="2" :disabled="readonly">自定义生效时间</Radio>
      </RadioGroup>
      <DatePicker
        v-if="form.effectiveImmediately === 2"
        v-model="form.entryTime"
        :disabled="readonly"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        placement="bottom-end"
        placeholder="请选择生效时间"
        :options="{
          disabledDate(date){
            let nowDate = new Date()
            nowDate.setHours(0, 0, 0,0)
            return date < nowDate
          }
        }"
        style="width: 260px"
      />
    </FormItem>

    <FormItem
      v-if="!readonly"
      :label-width="140"
    >
      <Button
        :loading="submitLoading"
        type="primary"
        @click="handleSubmit"
      >
        保存
      </Button>
      <Button
        type="default"
        @click="close"
      >
        取消
      </Button>
    </FormItem>
    <QuestionModal :question-show="showQuestion"
                   :strategy-type="1"
                   @close="showQuestion = false"
                   @confirm="addQuestionToStrategy"
    ></QuestionModal>
  </Form>
</template>

<script>
// import Carousel from "./Carousel"
// import SingleCarType from "./SingleCarType"
// import MultipleCarType from "./MultipleCarType"
// import TextCombination from "./TextCombination"
import uEditor from "_a/u-editor/index.vue";
import QuestionModal from "../../question-manager/components/QuestionModal";

export default {
  components: {
    QuestionModal,
    uEditor
    // Carousel,
    // SingleCarType,
    // MultipleCarType,
    // TextCombination
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    },
    businessGradeList: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    submitLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {

    return {
      showQuestion: false,
      rules: {
        strategyName: [{ required: true, message: "请输入策略名称", }],
        expandBizLine: [{ required: true, message: "请选择业务线", }],
        estimateDesc: [{ required: true, message: "请选择业务线", }],
        commonProblemIds: [{
          required: true, message: "请选择问题", validator: (rule, value, callback) => {
            if (!value || !value.length) {
              return callback("请选择问题")
            }
            callback()
          },
        }],
        effectiveImmediately: [{ required: true, message: "请选择生效方式", }],
        contactCustomer: [{ required: true, message: "请选择", }],
      },
      form: {
        effectiveImmediately: 1,
        commonProblemIds: [],
        contactCustomer: 1,
        entryTime: "",
        estimateDesc: "预估价格是根据实时交通状况、预估行驶里程、时间等因素预估计算得出，存在波动，仅供参考。高速费以司机实际支付为准。",
        expandBizLine: "",
        strategyName: "",
      },
      commonProblemList: []
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.close()
      }
    },
    value: {
      handler(val) {
        if (val && Object.keys(val).length) {
          Object.keys(this.form).forEach(key => {
            if (key === "commonProblemIds" && val[key] && val[key].length) {
              this.form.commonProblemIds.splice(0, this.form.commonProblemIds.length, ...val[key])
              return;
            }
            this.form[key] = val[key] || ""
          })
          if (val["commonProblemList"] && val["commonProblemList"].length) {
            this.commonProblemList.splice(0, this.commonProblemList.length, ...val["commonProblemList"])
          }
          this.$refs.uEditor && this.$refs.uEditor.editorInstance && this.$refs.uEditor.editorInstance.setContent && this.$refs.uEditor.editorInstance.setContent(this.form.estimateDesc)
        }
      },
      immediate: true
    },
  },
  methods: {
    handleDragStart(index) {
      this.dragStartIdx = index
    },
    handleDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    },
    handleDrop(index) {
      const dragItem = this.commonProblemList.splice(this.dragStartIdx, 1)[0]
      this.commonProblemList.splice(index, 0, dragItem)
      this.commonProblemList.forEach((item, idx) => {
        item.sort = idx
      })
      this.form.commonProblemIds = this.commonProblemList.map(item => item.id)
    },
    viewDemo() {
      this.$emit("viewDemo")
    },
    addQuestionToStrategy(arr) {
      this.showQuestion = false
      if (!arr || !arr.length) {
        return
      }
      Array.prototype.push.apply(this.commonProblemList, arr.filter(item => {
        return !this.commonProblemList.some(ori => {
          return ori.id === item.id
        })
      }))
      this.form.commonProblemIds = this.commonProblemList.map(item => item.id)
    },
    addQuestion() {
      this.showQuestion = true
    },
    removeQuestion(index) {
      this.commonProblemList.splice(index, 1)
      this.form.commonProblemIds = this.commonProblemList.map(item => item.id)
    },
    handleSubmit() {
      if (this.submitLoading) return
      if (this.form.effectiveImmediately === 2 && !this.form.entryTime) {
        return this.$message.error("请选择自定义生效时间")
      }
      if (this.form.effectiveImmediately === 2 && this.form.entryTime && new Date(this.form.entryTime) < Date.now()) {
        return this.$message.error("生效时间必须大于当前时间")
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          // 富文本编辑器校验
          if (this.$refs["uEditor"] && !this.$refs["uEditor"].editorInstance.hasContents()) {
            this.$Message.error("请输入预估价说明")
            return false
          }
          const params = {
            ...this.form,
            commonProblemList: this.commonProblemList
          }
          if (this.value && this.value.id) {
            params.id = this.value.id
          }
          this.$emit("submit", params)
        } else {
          this.$message.error("请检查必填项")
        }
      })
    },
    close() {
      this.form.effectiveImmediately = 1;
      this.form.commonProblemIds.splice(0);
      this.form.contactCustomer = 1;
      this.form.entryTime = "";
      this.form.estimateDesc = "预估价格是根据实时交通状况、预估行驶里程、时间等因素预估计算得出，存在波动，仅供参考。高速费以司机实际支付为准。";
      this.$refs.uEditor && this.$refs.uEditor.editorInstance && this.$refs.uEditor.editorInstance.setContent && this.$refs.uEditor.editorInstance.setContent(this.form.estimateDesc)
      this.form.expandBizLine = "";
      this.form.strategyName = "";
      this.commonProblemList.splice(0)
      this.$emit("close")
    }
  },
}
</script>

<style scoped lang="less">
  .drag-list {
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    .block {
      flex: 18;
      border: 1px solid #dadada;
      padding: 10px 8px;
    }

    > i {
      flex: 1;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    > span {
      flex: 1;
      text-align: center;
      color: #00a0e9;
    }
  }

  .red {
    color: red;
    font-size: 12px;
  }

  .step-editor {
    ::v-deep .edui-editor.edui-default {
      width: inherit !important;
    }
    ::v-deep .edui-editor-iframeholder.edui-default {
      width: inherit !important;
    }
  }

  .ivu-select {
    ::v-deep .ivu-select-dropdown {
      z-index: 2001
    }
  }
</style>
