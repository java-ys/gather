<template>
  <div v-if="showRelationship">
    <Form ref="form" inline :model="formData" :label-width="100" class="relation-form">
      <Row class="title">
        <Col span="24">
        当前题目：{{editItem.titleShowIndex}}.{{(editItem.titleNameText || editItem.titleName)|text}}
        </Col>
      </Row>
      <div v-for="(item,index) in formData.relaIdList" :key="index" class="rela-list">
        <FormItem class="no-bottom" :label="'关联题目' + (index + 1)" style="width:400px">
          <Select v-model="item.beRelaTitleId" placeholder="请选择要关联的题目" clearable @on-change="choosedRelaQues(item)">
            <template v-for="(quesItem,key) in questionList">
              <Option
                v-if="editItem.quesSort > quesItem.quesSort && quesItem.titleType !== 0 && quesItem.titleType !== 3"
                :key="key"
                :value="quesItem.titleShowIndex"
              >
                {{quesItem.titleShowIndex}}.{{(quesItem.titleNameText || quesItem.titleName)|text}}
              </Option>
            </template>
          </Select>
        </FormItem>
        <Button v-if="index === 0 && formData.relaIdList.length < questionList.length" type="primary" @click="addData">新增</Button>
        <Button v-else type="warning" @click="deleteData(index)">删除</Button>
        <div>
          <div class="when-text">当“关联题目{{index + 1}}”选择下面的选项：</div>
          <template v-if="(item.chooseQues && item.chooseQues.titleType === 1) || (item.chooseQues && item.chooseQues.titleType === 2)">
            <div>
              <FormItem class="no-bottom" style="width:400px">
                <CheckboxGroup v-model="item.choosedList" class="line-check" @on-change="checkChangeMultiFilterList">
                  <template
                    v-for="(optItem,key) in item.chooseQues && item.chooseQues.contentJson"
                  >
                    <Checkbox :key="key" :label="optItem.sort">{{(optItem.htmlText||optItem.name)|text}}</Checkbox>
                  </template>
                </CheckboxGroup>
              </FormItem>
            </div>
            <div v-if="(item.chooseQues && item.chooseQues.titleType === 1)" class="when-text">中任意一个时，当前题目才出现</div>
            <div v-else class="multi-filter">
              <FormItem class="no-bottom" style="width:400px">
                <Select v-model="item.multiFilterOpt" style="width:90px;margin-right:4px">
                  <Option
                    v-for="(multiFilterItem,key) in item.multiFilterList"
                    :key="key"
                    :value="multiFilterItem.value"
                  >
                    {{multiFilterItem.name}}
                  </Option>
                </Select>
                时，当前题目才出现
              </FormItem>
            </div>
          </template>
          <template v-if="(item.chooseQues && item.chooseQues.titleType === 4) || (item.chooseQues && item.chooseQues.titleType === 5) || (item.chooseQues && item.chooseQues.titleType === 6)">
            <div v-for="(optListItem,key) in item.chooseQues && item.chooseQues.contentJson" :key="key" class="nps-opt">
              <div class="when-text"><b>行左标题目：{{(optListItem.leftNameText||optListItem.leftName)|text}}</b></div>
              <FormItem class="no-bottom" style="width:400px">
                <CheckboxGroup v-model="optListItem.choosedList" class="line-check">
                  <template
                    v-for="(optItem,key) in optListItem.opList"
                  >
                    <Checkbox :key="key" :label="optItem.value">{{optItem.value}}</Checkbox>
                  </template>
                </CheckboxGroup>
              </FormItem>
              <div class="when-text"><b>行右标题目：{{(optListItem.rightNameText||optListItem.rightName)|text}}</b></div>
            </div>
            <div class="when-text">中任意一个时，当前题目才出现</div>
          </template>
        </div>
      </div>
      <div>
        <div>
          <p style="margin-left:30px"><b>关联多项时：</b>多题间</p>
          <FormItem class="no-bottom" style="width:400px">
            <RadioGroup v-model="formData.logicRela">
              <Radio
                v-for="(opt,key) in logicRelaList"
                :key="key"
                class="line-check"
                :label="opt.value"
              >
                {{opt.label}}
              </Radio>
            </RadioGroup>
          </FormItem>
        </div>
      </div>
    </Form>
    <div class="button-group">
      <Button v-lazy-click="deleteRelation" type="text">删除本题关联</Button>
      <Button v-lazy-click="saveData" type="primary">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RelativeQues",
  filters: {
    text: html => {
      const el = document.createElement("div");
      el.innerHTML = html;
      return el.textContent;
    }
  },
  props: {
    showRelationship: {
      type: Boolean
    },
    editItem: {
      type: Object
    },
    questionaireRela: {
      type: Object
    },
    questionList: {
      type: Array
    },
  },
  data() {
    return {
      formData: {
        relaIdList: []
      },
      hasSelectSkip: false,
      logicRelaList: [
        {
          value: 1,
          label: '为"且"的关系'
        },
        {
          value: 2,
          label: '为"或"的关系'
        }
      ]
    };
  },
  watch: {

  },
  mounted() {
    this.initData()
  },
  activated() {
  },
  methods: {
    deleteRelation() {
      this.$emit("doSetRelationship", {})
    },
    initData() {
      console.log("this.questionaireRela", this.questionaireRela)
      let questionaireRela
      if (this.questionaireRela && this.questionaireRela.logicRela) { // 编辑状态
        questionaireRela = this.questionaireRela
        this.formData = questionaireRela
      } else {
        // 默认
        questionaireRela = {
          relaIdList: [
            {
              "beRelaTitleId": "", // 关联题目
            },
          ],
          "logicRela": 1// 1 且，2 或

        }
        this.formData = questionaireRela
      }
      this.formData.relaIdList.forEach(item => {
        if (item.beRelaTitleId) {
          this.setChoosedRelaQues(item.beRelaTitleId)
        }
      })
    },
    checkChangeMultiFilterList(item) { // check选择框变更时，至少。。选几项也变化
      console.log(item)
      // this.$set()
    },
    choosedRelaQues(e) {
      // 查重校验
      console.log("choosedRelaQues e", e)
      let isReprat = false
      let obj = {};
      let tmpRelaList = this.formData.relaIdList
      for (let i = 0; i < tmpRelaList.length; i++)
      {

        if (!obj[tmpRelaList[i].beRelaTitleId]) {
          obj[tmpRelaList[i].beRelaTitleId] = true
        } else {
          isReprat = true
        }
        console.log("obj", obj)
      }
      if (isReprat) {
        e.beRelaTitleId = -1
        this.$Message.error("该题目已关联 请重新选择");
        return
      }
      // 清楚原数据
      this.$set(e,'choosedList',[])
      if(e.multiFilterOpt){
        this.$set(e,'multiFilterOpt',1)
      }
      this.setChoosedRelaQues(e.beRelaTitleId)
    },
    setChoosedRelaQues(e) {
      console.log("setChoosedRelaQues(this.formData.relaIdList)", this.formData.relaIdList)
      this.formData.relaIdList.forEach(item => {
        if (item.beRelaTitleId === e) {
          this.questionList.forEach(ques => {
            if (ques.titleShowIndex === e) {
              if (ques.contentJsonStr) { //
                let tmpConstJ = JSON.parse(ques.contentJsonStr)
                ques.contentJson = tmpConstJ
              }
              // 选中的题目chooseQues
              let tmpQues
              if (ques.titleType === 1 || ques.titleType === 2) {
                if (item.choosedList && item.choosedList.length > 0) { // 该多选题有选择
                  this.$set(item, "choosedList", item.choosedList)// 初始化选择列表
                }
                tmpQues = ques
              } else if (ques.titleType === 4 || ques.titleType === 5 || ques.titleType === 6) { // 量表{
                tmpQues = this.constractChooseList(ques, item) // 获取关联的题目
              }
              this.$set(item, "chooseQues", tmpQues)
              // 设置选择其中一个下拉
              if (ques.titleType === 2) { // 多选 构造当选择X项时，生效
                let tmpList = []
                ques.contentJson.forEach((optItem, ind) => {
                  if (ind === 0) {
                    tmpList.push({
                      name: "全部",
                      value: ques.contentJson.length
                    })
                  }
                  if (ind !== ques.contentJson.length - 1) {
                    tmpList.push({
                      name: "其中" + (ind + 1) + "个",
                      value: (ind + 1)
                    })
                  }
                })
                this.$set(item, "multiFilterList", tmpList)
                this.$set(item, "multiFilterOpt", 1)
              }
            }
          })
        }
      })
      console.log("this.formData.relaIdList", this.formData.relaIdList)
    },
    constractChooseList(ques, ele) { // 处理NPS关联的题目
      this.$set(ques.contentJson, "choosedList", [])// 初始化选择列表
      console.log("ele", ele)
      if (ele.choosedList && ele.choosedList.length > 0) { // 该多选题有选择
        ques.contentJson = ele.choosedList
        this.$set(ques, "choosedList", ele.choosedList)
      }
      ques.contentJson.opList = [] // 生成选项列表
      ques.contentJson.forEach(item => {
        item.opList = []
        let npsCount
        if (ques.titleType === 5) {
          npsCount = 5
        } else {
          npsCount = 10
        }
        for (let i = 0; i <= npsCount; i++) {
          item.opList.push({
            key: i,
            value: i
          })
        }
      });
      console.log("ques》》》", ques)
      return ques
    },
    deleteData(index) {
      console.log("deleteData", index)
      this.formData.relaIdList.splice(index, 1)
    },
    addData() {
      //
      this.formData.relaIdList.push({
        "beRelaTitleId": -1, // 关联题目
        "titleType": "",
        "choosedList": []
      })
      console.log("this.formData.relaIdList", this.formData)
    },
    saveData() {
      // 判断
      // 校验
      let isAllHas = true
      let relationship = {}
      console.log(this.formData)
      let tmpList = []
      this.formData.relaIdList.forEach(ele => {
        let item = JSON.parse(JSON.stringify(ele))
        let obj
        if (item.chooseQues) {
          if (item.chooseQues.titleType === 1 || item.chooseQues.titleType === 2) { // 单选多选
            obj = {
              "beRelaTitleId": item.beRelaTitleId,
              "titleType": item.chooseQues.titleType,
              "choosedList": item.choosedList
            }
            if (!(item.choosedList && item.choosedList.length > 0)) {
              isAllHas = false
            }
            if (item.chooseQues.titleType === 2) { // 多选
              obj = {
                multiFilterOpt: item.multiFilterOpt,
                ...obj
              }
              console.log("多选obj>>>", obj)
            }
          } else if (item.chooseQues.titleType === 4 || item.chooseQues.titleType === 5 || item.chooseQues.titleType === 6) {
            let tmpConsList = []
            item.chooseQues.contentJson.forEach(ele => {
              tmpConsList.push({
                choosedList: ele.choosedList, // 本选项的choosedList
                leftName: ele.leftName,
                rightName: ele.rightName,
                sort: ele.sort
              })
              if (!(ele.choosedList && ele.choosedList.length > 0)) {
                isAllHas = false
              }
            })
            obj = {
              "beRelaTitleId": item.beRelaTitleId,
              "titleType": item.chooseQues.titleType,
              "choosedList": tmpConsList
            }
          }
          tmpList.push(obj)
        } else {
          isAllHas = false
        }

      });
      //
      if (!isAllHas) {
        this.$Message.error("填写完整表单")
        return
      }
      // 排序
      tmpList = tmpList.sort(this.sortData);
      tmpList.forEach(tpItem => {
        if (tpItem.titleType === 1 || tpItem.titleType === 2) { // 单选多选
          tpItem.choosedList = tpItem.choosedList.sort(this.sortList)
        } else if (tpItem.titleType === 4 || tpItem.titleType === 5 || tpItem.titleType === 6) {
          tpItem.choosedList.forEach(tpOpItem => {
            tpOpItem.choosedList = tpOpItem.choosedList.sort(this.sortList)
          })
        }
      })
      relationship = {
        relaIdList: tmpList,
        logicRela: this.formData.logicRela// 1 且，2 或
      }
      console.log(relationship)
      let questionaireRela = relationship
      this.$emit("doSetRelationship", questionaireRela)
    },
    sortList(a, b) {
      return Number(a) - Number(b)
    },
    sortData(a, b) {
      return Number(a.beRelaTitleId) - Number(b.beRelaTitleId)
    }
  }
};
</script>
<style scoped lang="less">

.relation-form{
  .no-bottom{
    margin-bottom: 10px;
  }
  .rela-list{
    margin-bottom: 20px;
  }
  .multi-filter{
    display: flex;
  }
  .when-text{
    margin-left: 100px;
  }
  .nps-opt{
    margin: 10px 0;
  }
  .line-check{
     &.ivu-radio-wrapper,
    .ivu-checkbox-group-item{
      display: block;
    }
  }
  .ivu-row{
    .ivu-col{
      padding: 4px;
      .ivu-form-item{
        margin-bottom: 0;
      }
    }
    &.title{
      line-height: 40px;
      font-weight: bolder;
      font-size: 14px;
      margin-left: 28px;
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
