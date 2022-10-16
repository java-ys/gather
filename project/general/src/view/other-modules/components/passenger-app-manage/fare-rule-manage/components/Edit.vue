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
      prop="pageHeaderImage"
      :label-width="140"
      label="页头图片"
    >
      <CommonImgUpload
        :defaultImg="form.pageHeaderImage"
        :action="actionUrl"
        :isDetail="readonly"
        :defaultList="uploadImage"
        :multiFile="false"
        :params="{
          path: '/fare-config-manager'
        }"
        @on-change="changePageHeaderImage"
      ></CommonImgUpload>
      <Button type="primary" style="margin-top: 10px" @click="viewDemo">查看示例</Button>
    </FormItem>

    <FormItem
      prop="pricingDescList"
      :label-width="140"
      label="计价说明"
    >
      <p class="">实时计价</p>
      <Input v-model="form.pricingDescList[0].content" placeholder="请输入实时计价说明" type="textarea" :disabled="readonly"
             :maxlength="500"
      />
      <p class="">预约计价</p>
      <Input v-model="form.pricingDescList[1].content" placeholder="请输入实时计价说明" type="textarea" :maxlength="500"
             :disabled="readonly"
      />
    </FormItem>
    <FormItem
      prop="commonProblemIds"
      :label-width="140"
      label="费用说明"
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
                   :strategy-type="2"
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
import config from "@/config/config";
import QuestionModal from "../../question-manager/components/QuestionModal";
import { isDev } from "@/micro/registerApp/appEntry";
import CommonImgUpload from "_o/components/operator-center/driver-exam/common-img-upload";

const uploadUrl = isDev ? config.uploadUrl.dev : config.uploadUrl.pro;

export default {
  components: {
    CommonImgUpload,
    QuestionModal
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
      // 上传到公有桶
      actionUrl: uploadUrl + "/file/upload/public",
      showQuestion: false,
      uploadImage: [],
      rules: {
        strategyName: [{ required: true, message: "请输入策略名称" }],
        expandBizLine: [{ required: true, message: "请选择业务线" }],
        pageHeaderImage: [{ required: true, message: "请选择页头图片" }],
        commonProblemIds: [{
          required: true, message: "请选择说明", validator: (rule, value, callback) => {
            if (!value || !value.length) {
              return callback("请选择说明")
            }
            callback()
          }
        }],
        effectiveImmediately: [{ required: true, message: "请选择生效方式" }],
        pricingDescList: [{ required: true, message: "请输入计价说明" }],
      },
      form: {
        effectiveImmediately: 1,
        commonProblemIds: [],
        pricingDescList: [{
          typeTime: 1,
          content: "实时计价按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
        }, {
          typeTime: 2,
          content: "预约单按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
        }],
        entryTime: "",
        expandBizLine: "",
        pageHeaderImage: "",
        strategyName: ""
      },
      commonProblemList: []
    }
  },
  watch: {
    uploadImage: {
      deep: true,
      handler(value) {
        this.form.pageHeaderImage = value.map(item => item.url).join(",")
      }
    },
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
            if (key === "pricingDescList") {
              if (val[key] && val[key].length) {

                this.form.pricingDescList.splice(0, this.form.pricingDescList.length, ...val[key])
              } else {
                this.form.pricingDescList = [{
                  typeTime: 1,
                  content: "实时计价按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
                }, {
                  typeTime: 2,
                  content: "预约单按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
                }]
              }
              return
            }
            this.form[key] = val[key] || ""
          })
          if (val["commonProblemList"] && val["commonProblemList"].length) {
            this.commonProblemList.splice(0, this.commonProblemList.length, ...val["commonProblemList"])
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    viewDemo() {
      this.$emit("viewDemo")
    },
    changePageHeaderImage(url, res) {
      // console.log(url, res)
      this.form.pageHeaderImage = url
    },
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
      this.form.pricingDescList.splice(0, 2, ...[{
        typeTime: 1,
        content: "实时计价按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
      }, {
        typeTime: 2,
        content: "预约单按以下各费用项定价标准及服务里程（里程、时长、时段等），计算订单价格的计价方式"
      }]);
      this.form.entryTime = "";
      this.form.expandBizLine = "";
      this.form.pageHeaderImage = "";
      this.form.strategyName = "";
      this.commonProblemList.splice(0)
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
    cursor: move;
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
