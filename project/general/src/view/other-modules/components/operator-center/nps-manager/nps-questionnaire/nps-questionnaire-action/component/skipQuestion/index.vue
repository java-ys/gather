<template>
  <div v-if="showSkipQues">
    <Form ref="form" :model="formData" class="skip-form">
      <Row class="title">
        <Col span="5" class="ta-center">-
        </Col>
        <Col span="7" class="ta-center">选项</Col>
        <Col span="12">跳转到</Col>
      </Row>
      <template v-if="editItem.titleType === 1">
        <Row v-for="(item,index) in formData.contentJson" :key="index">
          <Col span="5" class="ta-center">选择</Col>
          <Col span="7" class="ta-center">{{(item.htmlText||item.name)|text}}</Col>
          <Col span="12">
          <FormItem :prop="'contentJson.' + index + '.skipTitleId'">
            <Select v-model="item.skipTitleId" placeholder="请选择要跳转的题目" clearable>
              <template v-for="(quesItem,key) in questionList">
                <Option v-if="formData.quesSort < quesItem.quesSort && quesItem.titleType !== 0" :key="key" :value="quesItem.titleShowIndex">{{quesItem.titleShowIndex}}.{{(quesItem.tileNameText||quesItem.titleName)|text}}</Option>
              </template>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </template>
      <template v-if="editItem.titleType === 4">
        <Row v-for="(item,index) in formData.contentJson[0].skipTitleList" :key="index">
          <Col span="5" class="ta-center">选择</Col>
          <Col span="7" class="ta-center">
            <template v-if="item.score === 0">
              {{(formData.contentJson[0].leftNameText||formData.contentJson[0].leftName)|text}}
            </template>
            <template v-else-if="item.score === 10">
              {{(formData.contentJson[0].rightNameText||formData.contentJson[0].rightName)|text}}
            </template>
            <template v-else>{{item.score}}</template>
          </Col>
          <Col span="12">
          <FormItem :prop="'contentJson.' + index + '.skipTitleId'">
            <Select v-model="item.skipTitleId" placeholder="请选择要跳转的题目" clearable>
              <template v-for="(quesItem,key) in questionList">
                <Option v-if="formData.quesSort < quesItem.quesSort && quesItem.titleType !== 0" :key="key" :value="quesItem.titleShowIndex">{{quesItem.titleShowIndex}}.{{(quesItem.tileNameText||quesItem.titleName)|text}}</Option>
              </template>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </template>
    </Form>
    <div class="button-group">
      <Button v-lazy-click="saveData" type="primary">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkipQuestion",
  filters: {
    text: html => {
      const el = document.createElement("div");
      el.innerHTML = html;
      return el.textContent;
    }
  },
  props: {
    showSkipQues: {
      type: Boolean
    },
    editItem: {
      type: Object
    },
    setSkipIndex: {
      type: String
    },
    questionList: {
      type: Array
    },
  },
  data() {
    return {
      formData: {},
      hasSelectSkip: false
    };
  },
  mounted() {
    console.log("editItem111", this.editItem)
    this.formData = this.editItem
  },
  activated() {
  },
  methods: {
    saveData() {
      // 判断
      console.log(this.formData)
      this.$emit("doSetSkipQues", this.formData)
    }
  }
};
</script>
<style scoped lang="less">
.skip-form{
  .ivu-row{
    line-height: 32px;
    border-bottom:1px solid #ccc ;
    border-left:1px solid #ccc ;
    border-right:1px solid #ccc ;
    padding: 6px 0;
    .ivu-col{
      padding: 4px;
      &.ta-center{
        text-align: center;
      }
      .ivu-form-item{
        margin-bottom: 0;
      }
    }
    &.title{
      line-height: 18px;
      border-top:1px solid #ccc ;
      background: #efefef;
      font-weight: bolder;
    }
  }
}
.button-group{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  .ivu-btn-default{
    margin-right: 10px;
  }
}

</style>
