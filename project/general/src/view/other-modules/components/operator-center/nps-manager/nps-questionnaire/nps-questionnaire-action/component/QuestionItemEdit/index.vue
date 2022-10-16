<template>
  <div class="edit-item">
    <Form ref="formEditItem" :model="formData">
      <Row v-if="editItem.titleType === 0">
        <FormItem label="" prop="contentJson" :rules="describeRule">
          <RichText v-model="formData.contentJson" size="large"
                 :maxlength="1000"
                 :autosize="{ minRows: 2,maxRows: 4 }"
                 show-word-limit type="textarea"
                 placeholder="输入文字描述"
                 show-max-hint
                 @on-change="handdleDesc"
          />
          <!-- <span class="edit_numberV">{{JsonStrTxtVal}}/ 10</span> -->
        </FormItem>
      </Row>
      <Row>
        <Col span="12">
        <Row v-if="editItem.titleType !== 0">
          <FormItem label="" prop="titleName" :rules="titleRule">
            <RichText v-model="formData.titleName"
                   size="large" :rows="4" :maxlength="100"
                   show-word-limit type="textarea"
                   placeholder="输入题目标题"
                    show-max-hint
                   @on-change="handdleTitleDesc"
                   @keydown.native="listen($event)"
            />
            <!-- <span class="edit_numberV">{{qnameTxtVal}}/ 100</span> -->
          </FormItem>
        </Row>
        <Row>
          <Col span="12">
          <Row>
            <Col span="10">
            <FormItem v-if="editItem.titleType !== 0" label="" prop="answerRequired">
              <Checkbox v-model="formData.answerRequired">必答</Checkbox>
            </FormItem>
            </Col>
            <Col span="10">
            <FormItem v-if="(editItem.titleType === 1 || editItem.titleType === 2)" label="" prop="subjectRandom">
              <Checkbox v-model="formData.subjectRandom">选项随机</Checkbox>
            </FormItem>
            </Col>
          </Row>
          </Col>
          <Col v-if="editItem.titleType !== 0" span="12">
          <FormItem label="" prop="titleTag">
            <Select v-model="formData.titleTag" clearable placeholder="选择标签" @on-change="changeTitleTag">
              <Option v-for="(item,index) in tagList" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="editItem.titleType === 2">
          <Col span="8">
          <FormItem label="" prop="requiredMinNum" :rules="minMaxRules">
            <Select v-model="formData.requiredMinNum" clearable placeholder="至少选几项">
              <template v-for="(item,index) in formData.contentJson">
                <Option :key="index" :value="index + 1">至少选{{index + 1}}项</Option>
              </template>
            </Select>
          </FormItem>
          </Col>
          <Col offset="1" span="8">
          <FormItem label="" prop="requiredMaxNum" :rules="minMaxRules">
            <Select v-model="formData.requiredMaxNum" clearable placeholder="至多选几项">
              <template v-for="(item,index) in formData.contentJson">
                <Option v-if="index !== 0" :key="index" :value="(index + 1)">至多选{{index + 1}}项</Option>
              </template>
            </Select>
          </FormItem>
          </Col>
          <Col v-if="formData.minMaxError" class="min-max-error" span="24">要求用户选中项不合法</Col>
        </Row>
        <Row>
          <FormItem v-if="(editItem.titleType === 1 || editItem.titleType === 4) && allValidQuesLength > editItem.titleShowIndex" label="">
            <Button type="primary" @click="setSkipQues">{{formData.hasSkip ? '编辑' : '设置'}}跳题逻辑</Button>
          </FormItem>
          <FormItem v-if="hasRelateQues" label="">
            <Button type="primary" @click="setRelationship">{{formData.hasSkip ? '编辑' : '设置'}}关联题目</Button>
          </FormItem>
        </Row>
        </Col>
        <Col v-if="editItem.titleType === 2 || editItem.titleType === 1" offset="1" span="11">
        <Row v-for="(item,index) in formData.contentJson" :key="item.id" class="option-item">
          <Col span="11">
          <FormItem label="" :prop="'contentJson.' + index + '.name'" :rules="optionRules">
            <RichText v-model="item.name" type="text" placeholder="请输入选项" />
            <div v-if="item.textLine" class="addBlank">填空</div>
          </FormItem>
          </Col>
          <Col offset="1" span="12">
          <div class="button-group">
            <div class="button-group-items">
              <Button :disabled="index === 0" size="large" type="default" @click="optionUp(index)">上移</Button>
              <Button :disabled="index === formData.contentJson.length - 1" size="large" type="default" @click="optionDown(index)">下移</Button>
              <Button size="large" type="default" @click="delOption(index)">删除</Button>
            </div>
          </div>
          </Col>
        </Row>
        <Button type="default" @click="addOption">添加选项</Button>
        <Button v-if="editItem.titleType === 2" type="default" @click="addBlankOption">添加填空选项</Button>
        </Col>
        <Col v-else-if="editItem.titleType === 4" offset="1" span="11">
        <Row v-for="(item,index) in formData.contentJson" :key="item.id">
          <Col span="11">
          <FormItem :rules="leftRule" label="" :prop="'contentJson.' + index + '.leftName'">
            <Input v-model="item.leftName" type="text" placeholder="请输入左标题" />
          </FormItem>
          </Col>
          <Col offset="1" span="11">
          <FormItem :rules="rightRule" label="" :prop="'contentJson.' + index + '.rightName'">
            <Input v-model="item.rightName" type="text" placeholder="请输入右标题" />
          </FormItem>
          </Col>
        </Row>
        </Col>
        <Col v-if="editItem.titleType === 6 || editItem.titleType === 5" offset="1" span="11">
        <Row v-for="(item,index) in formData.contentJson" :key="item.id">
          <Col span="6">
          <FormItem :rules="MatrixleftRule" label="" :prop="'contentJson.' + index + '.leftName'">
            <RichText v-model="item.leftName" type="text" placeholder="请输入左标题" />
          </FormItem>
          </Col>
          <Col span="6" offset="1">
          <FormItem :rules="MatrixrightRule" label="" :prop="'contentJson.' + index + '.rightName'">
            <RichText v-model="item.rightName" type="text" placeholder="请输入右标题" />
          </FormItem>
          </Col>
          <Col offset="1" span="9">
          <div class="button-group">
            <div class="button-group-items">
              <Button :disabled="index === 0" size="large" type="default" @click="optionUp(index)">上移</Button>
              <Button :disabled="index === formData.contentJson.length - 1" size="large" type="default" @click="optionDown(index)">下移</Button>
              <Button size="large" type="default" @click="delOption(index)">删除</Button>
            </div>
          </div>
          </Col>
        </Row>
        <Button type="default" @click="addMOption">添加选项</Button>
        </Col>
      </Row>
    </Form>
    <Modal v-model="showSkipQues" width="400" title="跳题逻辑" footer-hide :mask-closable="false">
      <SkipQuestion :showSkipQues="showSkipQues" :editItem="editItem" :questionList="questionList" @doSetSkipQues="doSetSkipQues"></SkipQuestion>
    </Modal>
    <Modal v-model="showRelationship" width="800" title="关联题目" footer-hide :mask-closable="false">
      <RelativeQues :showRelationship="showRelationship" :questionaireRela="editItem.questionaireRela" :editItem="editItem" :questionList="questionList" @doSetRelationship="doSetRelationship"></RelativeQues>
    </Modal>
    <br />
    <div slot="footer" class="button-group">
      <Button v-lazy-click="saveData" long size="large" type="primary">完成编辑</Button>
    </div>
  </div>
</template>

<script>
import { tags } from "../../fields.js"
import SkipQuestion from "../skipQuestion"
import RelativeQues from "../RelativeQues"
import RichText from '../TypeSelect/RichText'
export default {
  components: {
    SkipQuestion,
    RelativeQues,
    RichText,
  },
  props: {
    questionList: {
      type: Array
    },
    editItem: {
      type: Object
    },
    editIndex: {
      type: Number
    },
    userType: {
      type: [String, Number]
    },
  },
  data() {
    const validateOption = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入选项"));
      }
      if ((this.formData.titleType === 1 || this.formData.titleType === 2) && this.formData.contentJson.length > 1) { //
        callback()
      } else {
        callback(new Error("选项过少不能提交"))
      }
    }
    const validateMinMax = (rule, value, callback) => {
      if (!this.formData.requiredMinNum && !this.formData.requiredMaxNum) {
        callback()
      } else if (!this.formData.requiredMinNum || !this.formData.requiredMaxNum) {
        callback()
        this.formData.minMaxError = false
      }
      if (this.formData.requiredMinNum && this.formData.requiredMaxNum) {
        if (this.formData.requiredMinNum <= this.formData.requiredMaxNum) {
          callback()
          this.formData.minMaxError = false
        } else {
          callback(new Error())
          this.formData.minMaxError = true
          this.formData.requiredMinNum = null
          this.formData.requiredMaxNum = null
        }
      }
    }
    return {
      formData: {
        questionnaireName: "",
        contentJson: "",
        minMaxError: ""
      },
      tagList: [],
      showSkipQues: false,
      allValidQuesLength: 0,
      optionRules: [
        { validator: validateOption, trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      minMaxRules: { validator: validateMinMax, trigger: "change" },
      leftRule: [
        { required: true, message: "请输入左标题", trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      rightRule: [
        { required: true, message: "请输入右标题", trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      MatrixleftRule: [
        { required: true, message: "请输入左标题", trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      MatrixrightRule: [
        { validator: this.validateEmpty, trigger: "change" }
      ],
      describeRule: [
        { required: true, message: "请输入文字描述", trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      titleRule: [
        { required: true, message: "请输入标题", trigger: "change" },
        { validator: this.validateEmpty, trigger: "change" }
      ],
      allEmpty: false,
      hasRelateQues: false,
      showRelationship: false,
    };
  },
  computed: {
    qnameTxtVal() {
      let val = ""
      if (this.editItem && this.editItem.titleType !== 0) {
        if (this.editItem.titleName) {
          val = this.editItem.titleName.length;
        }
      }
      if (this.allEmpty) {
        val = 0
      }
      return val
    },
    JsonStrTxtVal() {
      let val = "0"
      if (this.editItem && this.editItem.titleType === 0) {
        if (this.editItem.contentJson) {
          val = this.editItem.contentJson.length;
        }
      }
      return val
    }
  },
  mounted() {
    this.allValidQuesLength = 0
    this.questionList.forEach(item => {
      if (item.titleType !== 0) {
        this.allValidQuesLength++
      }
    });
    this.formData = this.editItem
    console.log(tags)
    console.log("this.editItem", this.editItem)
    let userType = this.userType || this.$route.query.userType
    if (userType === "1" || userType === 1) {
      this.tagList = tags.passenger
    } else {
      this.tagList = tags.driver
    }
    // 前面没有题目不需要关联

    let preQues =  this.questionList[this.editItem.quesSort - 1]
    if (this.editItem.quesSort > 0 && preQues.titleType !== 0) {
      this.hasRelateQues = true
    }
  },
  activated() {
  },
  methods: {
    validateEmpty(rule, value, callback) {
      console.log("validateEmpty", rule)
      let regu = "^[ ]+$";
      let re = new RegExp(regu);
      if (re.test(value)) { // 有空格
        this.allEmpty = true
        callback(new Error("不能输入纯空格"))
      } else {
        this.allEmpty = false
        callback()
      }
    },
    changeTitleTag() {
      this.$emit("changeTitleTag", this.editIndex)
    },
    handdleDesc() {
      this.$emit("twoBindTextDesc", this.editIndex)
    },
    handdleTitleDesc() {
      this.$emit("handdleTitleDesc", this.editIndex)
    },
    setSkipQues() {
      this.showSkipQues = true
      console.log(this.editItem)
    },
    cancelSkip() {
      this.showSkipQues = false
    },
    doSetSkipQues(item) {
      this.$emit("finishSetSkipQues", item)
      this.formData.contentJson = item.contentJson
      // 选项
      this.cancelSkip()
    },
    setRelationship() {
      this.showRelationship = true
    },
    cancelRelationship() {
      this.showRelationship = false
    },
    doSetRelationship(questionaireRela) {
      this.cancelRelationship()
      this.formData.questionaireRela = questionaireRela
      this.$emit("finishSetRelationship", this.formData)
    },
    optionUp(index) { // 跟上一个交换一下
      // 顺序交换，且对应的值也要变化，option有
      // sort:'1',
      // name:'选项1',
      // textLine:false,
      // skipTitleId:null
      let curItem = this.formData.contentJson[index]
      let curSort = curItem.sort
      let preIndex = index - 1 // 移动后的index
      let preItem = this.formData.contentJson[preIndex]
      let preSort = preItem.sort
      curItem.sort = preSort;
      preItem.sort = curSort;
      curItem.id = curItem.id || this.getId();
      preItem.id = preItem.id || this.getId();
      preSort = preItem.sort
      this.$set(this.formData.contentJson, preIndex, curItem)
      this.$set(this.formData.contentJson, index, preItem)
      console.log("this.formData.contentJson", this.formData.contentJson)
    },
    optionDown(index) {
      let curItem = this.formData.contentJson[index]
      let curSort = curItem.sort
      let preIndex = index + 1 // 移动后的index
      let preItem = this.formData.contentJson[preIndex]
      let preSort = preItem.sort
      curItem.sort = preSort;
      preItem.sort = curSort;
      curItem.id = curItem.id || this.getId();
      preItem.id = preItem.id || this.getId();
      this.$set(this.formData.contentJson, preIndex, curItem)
      this.$set(this.formData.contentJson, index, preItem)
    },
    delOption(index) {
      let preList = this.formData.contentJson.slice(0, index)
      let nextList = this.formData.contentJson.slice(index + 1, this.formData.contentJson.length)
      let nextStartSort = index + 1
      nextList.forEach(item => {
        item.sort = nextStartSort
        nextStartSort++
      });
      this.formData.contentJson = preList.concat(nextList)
      console.log("this.formData.contentJson", this.formData.contentJson)
    },
    saveData() {
      this.$refs["formEditItem"].validate((valid) => {
        if (valid) {
          console.log("formData", this.formData)
          if ((this.formData.titleType === 1 || this.formData.titleType === 2) && this.formData.contentJson.length < 1) {
            this.$Message.error("选项过少不能提交")
          } else {
            this.$emit("finishEditData", this.formData)
          }
        }
      })
    },
    listen(event) {
      if (event.keyCode === 13) {
        event.preventDefault() // 阻止浏览器默认换行操作
        return false
      }
    },
    addMOption() {
      this.formData.contentJson.push({
        sort: this.formData.contentJson.length + 1,
        leftName: "司机专业度",
        rightName: "",
        skipTitleId: null,
        id: this.getId(),
      })
      this.$refs["formEditItem"].validate()
    },
    addOption() {
      this.formData.contentJson.push({
        sort: this.formData.contentJson.length + 1,
        name: "选项" + (this.formData.contentJson.length + 1),
        textLine: false,
        skipTitleId: null,
        id: this.getId(),
      })
      this.$refs["formEditItem"].validate()
    },
    addBlankOption() {
      this.formData.contentJson.push({
        sort: this.formData.contentJson.length + 1,
        name: "选项" + (this.formData.contentJson.length + 1),
        textLine: true,
        skipTitleId: null,
        id: this.getId(),
      })
    },
    getId() {
      return this.formData.contentJson.reduce((res, v) => Math.max(res, v.id || 0), 0) + 1
    }
  }
};
</script>
<style scoped lang="less">
  .edit_numberV{
    margin-left: -72px;
    text-align: right;
    bottom: -4px;
    width: 64px;
    z-index: 99999;
    font-size: 14px;
    font-weight: bolder;
    line-height: 36px;
    position: absolute;
    z-index: 1;
  }
  .addBlank{
    position:absolute;
    top: 0;
    right: 10px;
    color: blue;
  }
  .min-max-error{
    color: red;
    margin-top: -16px;
  }
</style>
