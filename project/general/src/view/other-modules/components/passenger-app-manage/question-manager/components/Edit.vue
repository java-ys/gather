<template>
  <Form
    v-if="form"
    ref="form"
    :model="form"
    :rules="rules"
  >
    <FormItem
      label="类型"
      prop="qaType"
      :label-width="140"
    >
      <Select v-model="form.qaType" :disabled="readonly || !!(value && value.id)">
        <Option v-for="item in qaTypeMap" :key="item.value" :label="item.label" :value="item.value"></Option>
      </Select>
    </FormItem>
    <FormItem
      prop="title"
      :label-width="140"
      label="标题"
    >
      <Input v-model="form.title" :disabled="readonly" placeholder="请输入标题" :maxlength="20" />
    </FormItem>
    <FormItem
      prop="questionContent"
      :label-width="140"
      label="注释"
    >
      <Input v-model="form.questionContent" :disabled="readonly" type="textarea" placeholder="请输入标题" :maxlength="500" />
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
  </Form>
</template>

<script>
import { qaTypeMap } from "_o/components/passenger-app-manage/question-manager/fields";

export default {
  components: {
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
      qaTypeMap,
      rules: {
        qaType: [{ required: true, message: "请选择类型", }],
        title: [{ required: true, message: "请输入标题", }],
        questionContent: [{ required: true, message: "请输入注释", }]
      },
      form: {
        qaType: "",
        title: "",
        questionContent: ""
      },
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
            this.form[key] = val[key] || ""
          })
        }
      },
      immediate: true
    },
  },
  methods: {
    handleSubmit() {
      if (this.submitLoading) return
      this.$refs.form.validate(valid => {
        if (valid) {
          // 富文本编辑器校验
          // if (this.$refs['uEditor'] && !this.$refs['uEditor'].editorInstance.hasContents()) {
          //   this.$Message.error('请输入任务描述')
          //   return false
          // }
          const params = {
            ...this.form
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
      this.form.qaType = ""
      this.form.title = ""
      this.form.questionContent = ""
      this.$emit("close")
    }
  },
}
</script>

<style scoped lang="less">
  .drag-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
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

  .ivu-select {
    ::v-deep .ivu-select-dropdown {
      z-index: 2001
    }
  }
</style>
