<template>
  <Form
    ref="form"
    :rules="rules"
    :model="inputValue"
  >
    <div class="content">
      <Row
        class="row-flex"
      >
        <Col
          v-if="showLeftText"
          class="flex"
        >
          <FormItem
            prop="startTip"
          >
            <Input
              v-model="inputValue.startTip"
              class="input-width"
              :placeholder="leftPlaceholder"
              :maxlength="leftMaxLen"
              :readonly="readonly"
              @change="handleChange"
            />
          </FormItem>
          <Button
            v-if="!readonly"
            class="delete-btn"
            shape="circle"
            icon="ios-close"
            size="small"
            @click="deleteLeftText"
          />
        </Col>
        <Col
          v-if="inputValue.carLevelFlag"
          class="flex"
        >
          <span
            v-if="showLeftText"
            class="add-icon"
          >+</span>
          <span
            style="font-weight: bold;"
          >当前选择车型等级</span>
          <Button
            v-if="!readonly"
            class="delete-btn"
            shape="circle"
            icon="ios-close"
            size="small"
            @click="deleteCar"
          />
        </Col>
        <Col
          v-if="showRightText"
          class="flex"
        >
          <span
            class="add-icon"
          >+</span>
          <FormItem
            prop="endTip"
          >
            <Input
              v-model="inputValue.endTip"
              class="input-width"
              :placeholder="rightPlaceholder"
              :maxlength="rightMaxLen"
              :readonly="readonly"
            />
          </FormItem>
          <Button
            v-if="!readonly"
            class="delete-btn"
            shape="circle"
            icon="ios-close"
            size="small"
            @click="deleteRightText"
          />
        </Col>
      </Row>
      <Row
        v-if="!readonly"
      >
        <Button
          v-if="!inputValue.carLevelFlag"
          type="primary"
          @click="addCar"
        >
          新增车型等级
        </Button>
        <Button
          v-if="!showLeftText || !showRightText"
          type="primary"
          @click="addText"
        >
          新增文本
        </Button>
      </Row>
    </div>
  </Form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        startTip: "",
        carLevelFlag: false,
        endTip: ""
      })
    },
    readonly: {
      type: Boolean,
      default: false
    },
    leftPlaceholder: {
      type: String,
      default: ""
    },
    rightPlaceholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      placeholder: "正在全力为您呼叫",
      showLeftText: false,
      showRightText: false,
      leftText: "",
      showCarLevel: false,
      carLevel: "",
      inputValue: {
        startTip: "",
        carLevelFlag: false,
        endTip: ""
      },
      rules: {
        startTip: [
          {
            validator: (rule, value, callback) => {
              if (value?.length > 9 - (this.inputValue.endTip?.length || 0)) {
                callback(new Error("最大字数限制超过12个字节"))
              } else {
                callback()
              }
            }
          }
        ],
        endTip: [
          {
            validator: (rule, value, callback) => {
              this.$refs.form.validateField("startTip")
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    leftMaxLen() {
      const len = 9 - (this.inputValue?.endTip?.length || 0)
      return len >= 0 ? len : 0
    },
    rightMaxLen() {
      const len = 9 - (this.inputValue?.startTip?.length || 0)
      return len >= 0 ? len : 0
    }
  },
  watch: {
    value: {
      handler(val) {
        this.showLeftText = !!val.startTip
        this.showRightText = !!val.endTip
        this.inputValue = val
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.validate()
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    addText() {
      if (this.showLeftText) {
        this.showRightText = true
      } else {
        this.showLeftText = true
      }
    },
    deleteLeftText() {
      this.showLeftText = false
      this.inputValue.startTip = ""
      this.handleChange()
    },
    deleteRightText() {
      this.showRightText = false
      this.inputValue.endTip = ""
      this.handleChange()
    },
    // 增加车型等级
    addCar() {
      this.inputValue.carLevelFlag = true
      this.handleChange()
    },
    // 增加车型等级
    deleteCar() {
      this.inputValue.carLevelFlag = false
      this.handleChange()
    },
    handleChange() {
      this.$emit("input", this.inputValue)
    }
  }
}
</script>

<style scoped lang="less">
.content {
  margin-bottom: 10px;
}

.row-flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.flex {
  display: flex;
  align-items: center;
}

.delete-btn {
  flex-shrink: 0;
  margin-left: 10px;
}

.add-icon {
  margin: 0 8px;
}

.input-width {
  width: 200px;
}
</style>
