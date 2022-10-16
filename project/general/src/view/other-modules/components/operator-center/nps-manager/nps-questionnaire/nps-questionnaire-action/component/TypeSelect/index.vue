<template>
  <div>
    <div class="title">
      <div v-if="showTitle">
        <h2 @click="editTitle">{{formData.questionnaireName}}</h2>
        <p
          v-if="actionType !== 'detail'"
          class="sub-info"
        >
          点击标题可进行修改标题
        </p>
      </div>
      <Form
        v-else
        ref="form"
        :model="formData"
        inline
        :rules="rules"
      >
        <FormItem
          label=""
          class="numberVInput"
          prop="questionnaireName"
        >
          <Input
            v-model="formData.questionnaireName"
            size="large"
            :maxlength="20"
            show-word-limit
            type="text"
            placeholder="请输入"
            style="width: 328px"
          />
          <div
            class="edit_numberV"
            style="width:36px;text-algin:center;line-height:36px"
          >
            {{txtVal}}/20
          </div>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="saveTitle"
          >
            确定
          </Button>
        </FormItem>
      </Form>
    </div>
    <div v-if="showBackground">
      <Divider class="all-type-list">
        <div class="type-list">
          <Button type="primary" :disabled="!!cacheTop" @click="showBgModal('cacheTop')">添加顶部背景图</Button>
          <Button type="primary" :disabled="!!cacheBottom" @click="showBgModal('cacheBottom')">添加底部背景图</Button>
        </div>
      </Divider>
      <div class="bg-list">
        <div class="bg-list-item">
          <template v-if="cacheTop">
            <img :src="cacheTop.url" alt="图片">
            <Button @click="cacheTop=null">删除图片</Button>
          </template>
        </div>
        <div class="bg-list-item">
          <template v-if="cacheBottom">
            <img :src="cacheBottom.url" alt="图片">
            <Button @click="cacheBottom=null">删除图片</Button>
          </template>
        </div>
      </div>
    </div>
    <template v-else>
      <div
        :class="actionType === 'detail' ? 'list-items unhover' : 'list-items'"
      >
        <Row>
          <Col
            offset="1"
            span="22"
          >
          <Form
            ref="sampleForm"
            label-position="top"
            :model="sampleData"
            :rules="sampleFormRules"
          >
            <div v-if="topImg" style="text-align:center">
              <img :src="topImg.url" :style="{width: topImg.width+'%'}" alt="图片">
            </div>
            <div
              v-for="(item, index) in questionList"
              :key="index"
              class="question-item"
            >
              <div :class="{ 'active': item.active }">
                <div
                  v-if="item.answerRequired && item.titleType !== 0"
                  class="required-text"
                >
                  *
                </div>
                <FormItem>
                  <div slot="label" v-html="item.titleType === 0 ? '' : item.titleShowIndex + '. ' + item.titleNameDesc" class="nowrap"></div>
                  <RadioGroup v-if="item.titleType === 1">
                    <div
                      v-for="(option,singleKey) in item.contentJson"
                      :key="singleKey"
                    >
                      <Radio :label="singleKey"><span v-html="option.name" class="nowrap"></span></Radio>
                      <span
                        v-if="option.skipTitleId"
                        class="skip-text"
                      >
                        （此选项跳转到第{{option.skipTitleId}}题）
                      </span>
                    </div>
                  </RadioGroup>
                  <Input v-if="item.titleType === 3"></Input>
                  <CheckboxGroup v-if="item.titleType === 2">
                    <div
                      v-for="(option,multipleKey) in item.contentJson"
                      :key="multipleKey"
                    >
                      <Checkbox :label="multipleKey"><span v-html="option.name" class="nowrap"></span></Checkbox>
                      <span v-if="option.textLine">
                        _________
                      </span>
                    </div>
                  </CheckboxGroup>
                  <div v-if="item.titleType === 4">
                    <span v-html="item.contentJson[0].leftName" class="nowrap" />
                    <RadioGroup>
                      <Radio
                        v-for="(opt,key) in item.contentJson[0].skipTitleList"
                        :key="key"
                        :label="opt.score"
                      ></Radio>
                    </RadioGroup>
                    <span v-html="item.contentJson[0].rightName" class="nowrap" />
                  </div>
                  <div v-if="item.titleType === 6">
                    <div
                      v-for="(rowItem,npsKey) in item.contentJson"
                      :key="npsKey"
                    >
                      <span v-html="rowItem.leftName" class="nowrap" />
                      <RadioGroup>
                        <Radio label="0"></Radio>
                        <Radio label="1"></Radio>
                        <Radio label="2"></Radio>
                        <Radio label="3"></Radio>
                        <Radio label="4"></Radio>
                        <Radio label="5"></Radio>
                        <Radio label="6"></Radio>
                        <Radio label="7"></Radio>
                        <Radio label="8"></Radio>
                        <Radio label="9"></Radio>
                        <Radio label="10"></Radio>
                      </RadioGroup>
                      <span v-html="rowItem.rightName" class="nowrap" />
                    </div>
                  </div>
                  <div
                    v-if="item.titleType === 0"
                    class="text-css"
                  >
                    <div v-html="item.contentJsonDesc" class="nowrap"></div>
                  </div>
                  <div v-if="item.titleType === 5">
                    <div
                      v-for="(rowItem,fiveKey) in item.contentJson"
                      :key="fiveKey"
                    >
                      <span v-html="rowItem.leftName" class="nowrap" />
                      <RadioGroup>
                        <Radio label="0"></Radio>
                        <Radio label="1"></Radio>
                        <Radio label="2"></Radio>
                        <Radio label="3"></Radio>
                        <Radio label="4"></Radio>
                        <Radio label="5"></Radio>
                      </RadioGroup>
                      <span v-html="rowItem.rightName" class="nowrap" />
                    </div>
                  </div>
                  <div v-if="item.hasSkip">
                    *此题设置了跳题逻辑
                  </div>
                  <div v-if="item.questionaireRela && item.questionaireRela.relaIdList && item.questionaireRela.relaIdList.length > 0" class="rela-ques-text">
                    * 此题关联
                    <span v-for="(rItem,rInd) in item.questionaireRela.relaIdList" :key="rInd">第{{rItem.beRelaTitleId}}题
                      <template v-if="rItem.titleType === 1 || rItem.titleType === 2">第
                        <template v-for="(optItem,optInd) in rItem.choosedList">
                          <span :key="optInd">{{optItem}}<template v-if="optInd !== (rItem.choosedList.length - 1)">、</template></span>
                        </template>选项
                      </template>
                      <template v-if="rItem.titleType === 4 || rItem.titleType === 5 || rItem.titleType === 6">
                        <template v-for="(optItem,optInd) in rItem.choosedList">
                          <span :key="optInd">
                            <template v-html="rItem.titleType !== 4">第{{optItem.sort}}个行标题中</template>第
                            <template v-for="(subOptItem,subOptInd) in optItem.choosedList">
                              <span :key="subOptInd">{{subOptItem}}</span>
                              <template v-if="subOptInd !== (optItem.choosedList && optItem.choosedList.length - 1)">、</template>
                            </template>
                          </span>
                        </template>选项
                      </template>
                      <template v-if="rInd !== (item.questionaireRela && item.questionaireRela.relaIdList.length - 1)">，</template>
                      <template v-else>。</template>
                    </span>
                  </div>
                  <div v-if="(item.titleTag && item.titleTag !== -1) || item.titleTag === 0">
                    *此题设置了标签：{{item.titleTagText}}
                  </div>
                  <div
                    v-if="item.doType !== 'add' && !item.active"
                    class="button-group"
                  >
                    <div class="button-group-items">
                      <Button
                        type="default"
                        @click="editQuesItem(item)"
                      >
                        编辑
                      </Button>
                      <Button
                        type="default"
                        @click="delQuesItem(index)"
                      >
                        删除
                      </Button>
                      <Button
                        type="default"
                        :disabled="index === 0"
                        @click="upQuesItem(index)"
                      >
                        上移
                      </Button>
                      <Button
                        type="default"
                        :disabled="index === questionList.length - 1"
                        @click="downQuesItem(index)"
                      >
                        下移
                      </Button>
                    </div>
                  </div>
                </FormItem>
              </div>
              <div
                v-if="item.active && showQuesEdit"
                class="edit-ques"
              >
                <QuestionItemEdit
                  ref="editItem"
                  :questionList="questionList"
                  :userType="questionnaireInfo.userType"
                  :editItem="item"
                  :editIndex="index"
                  @twoBindTextDesc="twoBindTextDesc"
                  @handdleTitleDesc="handdleTitleDesc"
                  @finishSetSkipQues="finishSetSkipQues"
                  @finishSetRelationship="finishSetRelationship"
                  @changeTitleTag="changeTitleTag"
                  @finishEditData="finishEditData"
                ></QuestionItemEdit>
              </div>
            </div>
            <div v-if="bottomImg" style="text-align:center">
              <img :src="bottomImg.url" :style="{width: bottomImg.width+'%'}" alt="图片">
            </div>
          </Form>
          </Col>
        </Row>
      </div>
      <Divider
        v-if="!showQuesEdit && actionType !== 'detail'"
        class="all-type-list"
      >
        <div class="type-list">
          <Button
            v-for="(item, typeKey) in questionTypeList"
            :key="typeKey"
            type="primary"
            @click="editQuestion(item)"
          >
            {{item.titleType==10 && (topImg||bottomImg) ? '编辑': '添加'}}{{item.name}}
          </Button>
        </div>
      </Divider>
    </template>
    <div
      slot="footer"
      class="button-group"
    >
      <template v-if="actionType === 'detail'">
        <Button v-lazy-click="copyPreviwLink">
          复制预览链接
        </Button>
        <Button
          type="primary"
          @click="editData"
        >
          编辑
        </Button>
      </template>
      <template v-else>
        <Button @click="cancel">
          取消
        </Button>
        <Button
          v-lazy-click="saveData"
          type="primary"
        >
          {{showBackground ? '确定' : '保存'}}
        </Button>
      </template>
    </div>
    <ImageModal
      :show="showImageModal"
      title="插入背景图片"
      @cancel="showImageModal=false"
      @confirm="onImageConfirm"
    />
  </div>
</template>

<script>
import { tags } from "../../fields.js"
import QuestionItemEdit from "../QuestionItemEdit"
import ImageModal from './ImageModal.vue'
import RichText from './RichText'
export default {
  components: {
    QuestionItemEdit,
    ImageModal,
    RichText,
  },
  props: {
    questionnaireInfo: {
      type: Object
    },
    actionType: {
      type: String
    }
  },
  data() {
    return {
      cacheTop: null,
      cacheBottom: null,
      showBackground: false,
      showImageModal: false,
      that: this,
      rules: {
        questionnaireName: [{ required: true, message: "请输入问卷标题", trigger: "change" }]
      },
      questionTypeList: [
        {
          type: "backgroundImage",
          titleType: 10,
          name: "背景图"
        },
        {
          type: "text",
          titleType: 0,
          name: "文本说明"
        },
        {
          type: "singleChoice",
          titleType: 1,
          name: "单选题"
        },
        {
          type: "multipleChoice",
          titleType: 2,
          name: "多选题"
        },
        {
          type: "fillIn",
          titleType: 3,
          name: "填空题"
        },
        {
          type: "npsScale",
          titleType: 4,
          name: "NPS量表题"
        },
        {
          type: "fiveScaleMatrix",
          titleType: 5,
          name: "5级量表矩阵"
        },
        {
          type: "npsScaleMatrix",
          titleType: 6,
          name: "NPS量表矩阵"
        },
      ],
      showQuesEdit: false,
      showTitle: true,
      formData: {},
      questionList: [],
      sampleData: {},
      sampleFormRules: {},
      showEditItem: false,
      quesIndex: 0,
      topImg: null,
      bottomImg: null
    };
  },
  computed: {
    txtVal() {
      const val = this.formData.questionnaireName.length;
      return val;
    }
  },
  watch: {
    actionType(val) {
      this.initData()
    },
    questionnaireInfo: {
      handler(info) {
        if(!info) return;
        if(info.topImgUrl) this.topImg = info.topImgUrl[0] === "{" ? JSON.parse(info.topImgUrl) : {uuid: "", url: info.topImgUrl}
        if(info.bottomImgUrl) this.bottomImg = info.bottomImgUrl[0] === "{" ? JSON.parse(info.bottomImgUrl) : {uuid: "", url: info.bottomImgUrl}
      },
      immediate: true,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    copyPreviwLink() {
      // 问卷id
      this.$emit("copyPreviwLink", this.questionnaireInfo)
    },
    editData() {
      this.$emit("switchToEdit")
    },
    handdleTag(tag) {
      let res
      let userType = this.questionnaireInfo.userType
      if (userType === "1" || userType === 1) {
        this.tagList = tags.passenger
      } else {
        this.tagList = tags.driver
      }
      this.tagList.forEach(item => {
        if (item.value === tag) {
          res = item.label
        }
      })
      return res
    },
    changeTitleTag(index) {
      let item = this.questionList[index]
      if ((item.titleTag && item.titleTag !== -1) || item.titleTag === 0) {
        this.$set(item, "titleTagText", this.handdleTag(item.titleTag))
      }
    },
    initData() {
      if (JSON.stringify(this.questionnaireInfo) === "{}") {
        return
      }
      this.formData = this.questionnaireInfo
      if (this.actionType !== "add") { // 详情
        let index = 0
        let titleShowIndex
        this.questionnaireInfo.questionList.forEach((item, listIndex) => {
          if ((item.titleTag && item.titleTag !== -1) || item.titleTag === 0) {
            this.$set(item, "titleTagText", this.handdleTag(item.titleTag))
          }
          if (item.titleType !== 0) {
            index = index + 1
            titleShowIndex = index
          } else {
            titleShowIndex = ""
          }
          let contentJson
          let contentJsonDesc = ""
          let titleNameDesc = ""
          let hasSkip = false
          if (item.titleType !== 0) {
            item.titleName = titleNameDesc = item.titleNameText || item.titleName
            if (item.contentJsonStr) {
              contentJson = JSON.parse(item.contentJsonStr)
              Array.isArray(contentJson) && contentJson.forEach(v => {
                v.name = v.htmlText || v.name || "";
                v.leftName = v.leftNameText || v.leftName || "";
                v.rightName = v.rightNameText || v.rightName || "";
              })
              if (item.titleType === 1) {
                // hasSkip
                contentJson.forEach(conItem => {
                  if (conItem.skipTitleId) {
                    hasSkip = true
                  }
                })
              } else if (item.titleType === 4) {
                // hasSkip
                if (!contentJson[0].skipTitleList) {
                  contentJson[0].skipTitleList = [
                    {
                      score: 0,
                      skipTitleId: null
                    },
                    {
                      score: 1,
                      skipTitleId: null
                    },
                    {
                      score: 2,
                      skipTitleId: null
                    },
                    {
                      score: 3,
                      skipTitleId: null
                    },
                    {
                      score: 4,
                      skipTitleId: null
                    },
                    {
                      score: 5,
                      skipTitleId: null
                    },
                    {
                      score: 6,
                      skipTitleId: null
                    },
                    {
                      score: 7,
                      skipTitleId: null
                    },
                    {
                      score: 8,
                      skipTitleId: null
                    },
                    {
                      score: 9,
                      skipTitleId: null
                    },
                    {
                      score: 10,
                      skipTitleId: null
                    },
                  ]
                }
                contentJson[0].skipTitleList.forEach(conItem => {
                  if (conItem.skipTitleId) {
                    hasSkip = true
                  }
                })
              }
            }
          } else {
            contentJson = item.contentTextStr || item.contentJsonStr
            item.contentJson = item.contentTextStr || item.contentJsonStr
            this.hanndleBr(item)
            contentJsonDesc = item.contentJsonDesc
          }
          // panduan
          let questionaireRela = {}
          if (item && item.questionaireRela !== "" && JSON.stringify(item.questionaireRela) !== "{}") {
            questionaireRela = JSON.parse(item.questionaireRela)
          }
          this.questionList.push({
            titleId: item.titleId,
            titleName: item.titleName,
            titleNameDesc: titleNameDesc,
            titleType: item.titleType,
            contentJsonStr: item.contentJsonStr,
            requiredMinNum: item.requiredMinNum,
            requiredMaxNum: item.requiredMaxNum,
            answerRequired: item.answerRequired === 1 ? true : false,
            contentJson: contentJson,
            contentJsonDesc: contentJsonDesc,
            questionaireRela: questionaireRela,
            titleShowIndex: titleShowIndex,
            subjectRandom: item.subjectRandom === 1 ? true : false,
            titleTag: item.titleTag,
            titleTagText: item.titleTagText ? item.titleTagText : "",
            hasSkip,
            doType: "",
            quesSort: listIndex,
            active: false,
          })
        })
        this.quesIndex = index
      }
    },
    editQuesItem(item) {
      // 处理最后一个
      let undoneLast  = false
      this.questionList.forEach(item => {
        if (item.active) {
          undoneLast = true
        }
      })
      if (undoneLast) {
        this.$Message.error("请先完成当前题目编辑");
      } else {
        this.questionList[item.quesSort].active = true
        this.questionList[item.quesSort].doType = "edit"
        this.showQuesEdit = true
      }
    },
    delQuesItem(index) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除题目？",
        onOk: () => {
          this.doDelItem(index)
        }
      });
    },
    doDelItem(index) {
      // 删除后 重新调整顺序，重新整合跳题逻辑
      if (this.questionList.length === 1) {
        this.questionList = []
      }
      let skipIndex = this.questionList[index].titleShowIndex // 获取当前题目
      // 获取跳题项
      this.questionList.forEach(item => {
        if ((item.titleType === 1 || item.titleType === 4) && item.hasSkip) {
          //
          let SkipDataList = item.titleType === 1 ? item.contentJson : item.contentJson[0].skipTitleList
          let skipCount = 0
          SkipDataList.forEach(option => {
            if (option.skipTitleId) {
              if (option.skipTitleId === skipIndex) { // 清除
                option.skipTitleId = null
              } else if (option.skipTitleId > skipIndex) { //
                option.skipTitleId = option.skipTitleId - 1
                skipCount++
              } else {
                skipCount++
              }
            }
          })
          if (skipCount > 0) {
            item.hasSkip = true
          } else {
            item.hasSkip = false
          }
        }
      })
      let preList = this.questionList.slice(0, index)
      let nextList = this.questionList.slice(index + 1, this.questionList.length)
      // 遍历preList找到顺序
      let nextTitleShowIndex = 0
      preList.forEach(item => {
        if (item.titleShowIndex) { nextTitleShowIndex = item.titleShowIndex }
      });
      nextTitleShowIndex = Number(nextTitleShowIndex)
      let nextQuesSort = Number(preList.length)
      nextList.forEach(item => {
        if (item.titleType !== 0) { // 非文本信息
          nextTitleShowIndex++
          item.titleShowIndex = nextTitleShowIndex
        }
        item.quesSort = nextQuesSort
        nextQuesSort++
      });
      this.quesIndex = nextTitleShowIndex
      this.questionList = preList.concat(nextList)
      this.$Message.info({
        content: "本题被删除，跳转到本题的选项跳题逻辑已被清除。",
        top: 100,
        duration: 5
      });
    },
    // 清除关联关系
    clearAllRela() {
      this.questionList.forEach(item => {
        item.questionaireRela = "{}"
      })
      this.$Message.info({
        top: 100,
        content: "交换顺序后，关联关系逻辑已被清除。",
        duration: 5
      });
    },
    upQuesItem(index) {
      let curItem = this.questionList[index]
      let curSort = Number(curItem.quesSort)
      // 移动项移动后
      let preSort = curSort - 1 // 移动后的index
      curItem.quesSort = preSort
      // 被移动项
      let preItem = this.questionList[index - 1]
      preItem.quesSort = curSort
      if (preItem.titleType !== 0 && curItem.titleType !== 0) { // 非文本类型 顺序也要交换
        let preItemTitleShowIndex = preItem.titleShowIndex
        let curItemTitleShowIndex = curItem.titleShowIndex
        curItem.titleShowIndex = preItemTitleShowIndex
        preItem.titleShowIndex = curItemTitleShowIndex
      }
      this.$set(this.questionList, index, preItem)
      this.$set(this.questionList, index - 1, curItem)
      this.skipLogicHanddle(index, "up")
      // 清楚所有关联题目
      this.clearAllRela()
    },
    downQuesItem(index) {
      //
      let curItem = this.questionList[index]
      let curSort = Number(curItem.quesSort)
      let nextSort = curSort + 1 // 移动后的index
      curItem.quesSort = nextSort
      let nextItem = this.questionList[index + 1]
      nextItem.quesSort = curSort
      //
      if (nextItem.titleType !== 0 && curItem.titleType !== 0) { // 非文本类型 顺序也要交换
        let nextItemTitleShowIndex = nextItem.titleShowIndex
        let curItemTitleShowIndex = curItem.titleShowIndex
        curItem.titleShowIndex = nextItemTitleShowIndex
        nextItem.titleShowIndex = curItemTitleShowIndex
      }
      this.$set(this.questionList, index, nextItem)
      this.$set(this.questionList, index + 1, curItem)
      this.skipLogicHanddle(index, "down")
      this.clearAllRela()
    },
    // 交换顺序跳题处理
    skipLogicHanddle(index, type) {
      // 上移后 如 5 6 => 6 5
      // 6设置的跳题 必须是7及7以后，不会有变化；
      // 若5原本设置了跳题6，但56交换，那么5的跳题需要清除
      // 若5原本设置了跳题7及以后，无需变化
      // 若5，6之前的题目设置了跳题到5，6，则，跳题需要变化为新的标号
      // 先看5之前 查找到prelist里面 跳题到当前前后的
      // 均为非文本
      let pre
      let next
      let sliceIndex
      if (type === "up") {
        sliceIndex = index - 1
        pre = this.questionList[index - 1]
        next = this.questionList[index]
      } else if (type === "down") {
        sliceIndex = index
        pre = this.questionList[index]
        next = this.questionList[index + 1]
      }
      if (next.titleType !== 0 && pre.titleType !== 0) {
        let preTitleShowIndex = pre.titleShowIndex // 交换后前一个
        let nextTitleShowIndex = next.titleShowIndex // 交换后后一个
        let preList = this.questionList.slice(0, sliceIndex)
        preList.forEach(item => {
          if ((item.titleType === 1 || item.titleType === 4) && item.hasSkip) {
            //
            let SkipDataList = item.titleType === 1 ? item.contentJson : item.contentJson[0].skipTitleList
            SkipDataList.forEach(option => {
              if (option.skipTitleId) {
                // 跳到交换顺序的两个
                if (option.skipTitleId === preTitleShowIndex) { // 跳转到前一个的
                  option.skipTitleId = nextTitleShowIndex
                } else if (option.skipTitleId === nextTitleShowIndex) { // 跳转到后一个的
                  option.skipTitleId = preTitleShowIndex
                }
              }
            })
          }
        })
        // 交换后后一个（之前的前一个）
        if ((next.titleType === 1 || next.titleType === 4) && next.hasSkip) {
          let changedNextSkipDataList = next.titleType === 1 ? next.contentJson : next.contentJson[0].skipTitleList
          let skipCount = 0
          changedNextSkipDataList.forEach(option => {
            if (option.skipTitleId) {
              if (option.skipTitleId === next.titleShowIndex) { // 跳转到前一个的 清除跳题
                option.skipTitleId = null
                this.$Message.info({
                  top: 100,
                  content: "跳题逻辑必须设置为跳到本题目后面的题目，不符合条件的选项跳题逻辑已被清除。",
                  duration: 5
                });
              } else {
                skipCount++
              }
            }
          })
          if (skipCount > 0) {
            next.hasSkip = true
          } else {
            next.hasSkip = false
          }
        }
      }
    },
    cancel() {
      if(this.showBackground) {
        this.showBackground = false;
        this.cacheTop = this.cacheBottom = null;
        return;
      }
      this.$emit("cancel")
    },
    editTitle() {
      if (this.actionType === "detail") return
      this.showTitle = false
    },
    saveTitle() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.showTitle = true
        }
      })
    },
    editQuestion(item) {

      this.showQuesEdit = true
      let addItem = {}
      let newIndex = this.quesIndex + 1
      let newSort = this.questionList.length
      let titleName
      let titleShowIndex
      if (item.titleType === 0) {
        titleName = ""
        titleShowIndex = ""
      } else {
        titleName = ""
        titleShowIndex = newIndex
      }
      let questionaireRela = {}
      if (item && item.questionaireRela) {
        questionaireRela = JSON.parse(item && item.questionaireRela)
      }
      let tmpItem = {
        hasSkip: false,
        doType: "add",
        quesSort: newSort,
        active: true,
        titleShowIndex: titleShowIndex,
        titleType: item.titleType,
        titleName: titleName,
        titleNameDesc: "输入题目标题",
        answerRequired: true,
        questionaireRela: questionaireRela,
        // requiredMinNum: 1,
        // requiredMaxNum: 2,
        // subjectRandom: 0,
        // titleTag: 1,
      }
      switch (item.titleType) {
        case 0:
          addItem = {
            ...tmpItem,
            contentJsonDesc: "<p>输入文字描述</p>",
            contentJson: "",
          }
          this.questionList.push(addItem)
          break;
        case 1:
          // 单选题
          addItem = {
            ...tmpItem,
            contentJson: [
              {
                sort: "1",
                name: "选项1",
                textLine: false,
                skipTitleId: null
              },
              {
                sort: "2",
                name: "选项2",
                textLine: false,
                skipTitleId: null
              }
            ],
          }
          this.questionList.push(addItem)
          break;
        case 2:
          addItem = {
            ...tmpItem,
            contentJson: [
              {
                sort: "1",
                name: "选项1",
                textLine: false,
                skipTitleId: null
              },
              {
                sort: "2",
                name: "选项2",
                textLine: false,
                skipTitleId: null
              }
            ],
          }
          this.questionList.push(addItem)
          break;
        case 3:
          addItem = {
            ...tmpItem,
            contentJsonDesc: "<p>填空题内容</p>",
            contentJson: "填空题内容",
          }
          this.questionList.push(addItem)
          break;
        case 4:
          addItem = {
            ...tmpItem,
            contentJson: [
              {
                sort: "1",
                leftName: "非常不满意",
                rightName: "非常满意",
                skipTitleList: [
                  {
                    score: 0,
                    skipTitleId: null
                  },
                  {
                    score: 1,
                    skipTitleId: null
                  },
                  {
                    score: 2,
                    skipTitleId: null
                  },
                  {
                    score: 3,
                    skipTitleId: null
                  },
                  {
                    score: 4,
                    skipTitleId: null
                  },
                  {
                    score: 5,
                    skipTitleId: null
                  },
                  {
                    score: 6,
                    skipTitleId: null
                  },
                  {
                    score: 7,
                    skipTitleId: null
                  },
                  {
                    score: 8,
                    skipTitleId: null
                  },
                  {
                    score: 9,
                    skipTitleId: null
                  },
                  {
                    score: 10,
                    skipTitleId: null
                  },
                ]
              }
            ],
          }
          this.questionList.push(addItem)
          break;
        case 6:
          addItem = {
            ...tmpItem,
            contentJson: [
              {
                sort: "1",
                leftName: "司机专业度",
                rightName: "",
                skipTitleId: null
              },
              {
                sort: "2",
                leftName: "司机专业度",
                rightName: "",
                skipTitleId: null
              }
            ],
          };
          this.questionList.push(addItem)
          break;
        case 5:
          addItem = {
            ...tmpItem,
            contentJson: [
              {
                sort: "1",
                leftName: "司机专业度",
                rightName: "",
                skipTitleId: null
              },
              {
                sort: "2",
                leftName: "司机专业度",
                rightName: "",
                skipTitleId: null
              }
            ],
          };
          this.questionList.push(addItem)
          break;
        case 10:
          this.showBackground = true;
          this.cacheTop = this.topImg;
          this.cacheBottom = this.bottomImg;
          // this.showImageModal = true;
          this._tempItem = tmpItem;
          this.showQuesEdit = false;
          return;
      }
      if(this.questionList.length && item.titleType != 10 && Array.isArray(this.questionList[this.questionList.length-1].contentJson)) {
        const lastItem = this.questionList.pop();
        lastItem.contentJson.forEach((v,i) => v.id = i);
        this.questionList.push(lastItem)
      }
      if (this.questionList[addItem.quesSort].titleType !== 0 && this.questionList[addItem.quesSort].doType === "add") {
        this.quesIndex++
      }
    },
    showBgModal(key) {
      this._bgKey = key;
      this.showImageModal = true;
    },
    onImageConfirm(data) {
      this[this._bgKey] = data;
    },
    twoBindTextDesc(index) {
      let item = this.questionList[index]
      if (item.titleType === 0) {
        this.hanndleBr(item)
      }
    },
    handdleTitleDesc(index) {
      let item = this.questionList[index]
      if (item.titleType !== 0) {
        this.$set(item, "titleNameDesc", item.titleName)
      }
    },
    hanndleBr(item) {
      // 处理换行
      let cons_list = item.contentJson.split("\n")
      let cons_html = ""
      cons_list.forEach(item => {
        cons_html = cons_html + "<p>" + item + "</p>"
      })
      this.$set(item, "contentJsonDesc", cons_html)
    },
    finishSetRelationship(item) {
      //
    },
    finishSetSkipQues(item) {
      // 判断是否设置了跳题
      let hasSkip = false
      if (item.titleType === 1) { // 选择题
        item.contentJson.forEach(option => {
          if (option.skipTitleId) {
            hasSkip = true
          }
        })
      } else if (item.titleType === 4) { // nps
        item.contentJson[0].skipTitleList.forEach(option => {
          if (option.skipTitleId) {
            hasSkip = true
          }
        })
      }
      item.hasSkip = hasSkip
    },
    finishEditData(item) {
      if (item.titleType === 0) {
        this.hanndleBr(item)
      }
      this.questionList[item.quesSort] = item
      this.questionList[item.quesSort].active = false
      this.questionList[item.quesSort].doType = ""
      this.showQuesEdit = false
    },
    saveData() {
      if(this.showBackground) {
        this.topImg = this.cacheTop;
        this.bottomImg = this.cacheBottom;
        return this.cancel();
      }
      let subQuesList = []
      if (this.questionList.length === 0) {
        this.$Message.error("请先添加问卷题目");
        return
      }
      const getTextFromHTML = html => {
        const div = document.createElement("div")
        div.innerHTML = html;
        return div.textContent;
      }
      this.questionList.forEach(item => {
        let contentJsonStr = ""
        item.titleName = getTextFromHTML(item.titleNameText = item.titleName);
        if (item.titleType !== 0) {
          Array.isArray(item.contentJson) && item.contentJson.forEach(v => {
            if (v.name) v.name = getTextFromHTML(v.htmlText = v.name)
            else if (v.leftName) v.leftName = getTextFromHTML(v.leftNameText = v.leftName);
            else if (v.rightName) v.rightName = getTextFromHTML(v.rightNameText = v.rightName);
          });
          contentJsonStr = JSON.stringify(item.contentJson)
        } else {
          contentJsonStr = getTextFromHTML(item.contentTextStr = item.contentJson)
        }
        subQuesList.push({
          titleType: item.titleType,
          titleName: item.titleName.trim(),
          titleNameText: item.titleNameText,
          answerRequired: item.answerRequired ? 1 : 0,
          requiredMinNum: item.requiredMinNum,
          requiredMaxNum: item.requiredMaxNum,
          subjectRandom: item.subjectRandom ? 1 : 0,
          titleId: item.titleId ? item.titleId : null,
          titleTag: item.titleTag,
          contentJsonStr: contentJsonStr,
          contentTextStr: item.contentTextStr || '',
          questionaireRela: JSON.stringify(item.questionaireRela)
        })
      });
      const html = this.formData.questionnaireName;
      let data_ = {
        questionnaireId: this.formData.questionnaireId ? this.formData.questionnaireId : null,
        questionList: subQuesList,
        questionnaireName: getTextFromHTML(html),
        userType: this.formData.userType,
        topImgUrl: this.topImg ? JSON.stringify(this.topImg) : '',
        bottomImgUrl: this.bottomImg ? JSON.stringify(this.bottomImg) : '',
        questionnaireNameHTML: html,
      }
      this.$emit("doQuestionnaire", data_)
    }
  }
};
</script>
<style lang="less">
  .numberVInput{
    .ivu-form-item-content{
      display: flex;
    }
  }
</style>
<style scoped lang="less">
  .rela-ques-text{
      color: #f5aa00;
  }
  .required-text{
    color: red;
    position: absolute;
    /* top: 10px; */
    margin-top: 18px;
    margin-left: 10px;
  }
  .skip-text{
    color: rgb(209, 143, 0);
  }
  .question-item{
    margin: 10px 0;
    label.ivu-radio-wrapper{
      white-space: unset;
    }
    .ivu-form-item{
        /deep/.ivu-form-item-label{
        font-weight: bolder;
        font-size: 16px;
        line-height: 32px;
        text-align: left;
      }
    }
    .active{
      .ivu-form-item{
        box-sizing: border-box;
        border: 1px dashed #ccc;
      }
    }

  }
  .title{
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 10px;
    h2{
      font-size: 16px;
      font-weight: bolder;
    }
  }
  .button-group{
    margin-top: 100px;
    display: flex;
    justify-content: flex-end;
    .ivu-btn-default{
      margin-right: 10px;
    }
  }
  .sub-info{
    font-size: 12px;
    color: #ccc;
  }
  .all-type-list{
    margin: 32px 0;
  }
  .type-list{
    button{
      margin-right: 10px;
    }
  }
  .edit-ques{
    margin: 20px 0;
  }
  .list-items{
    .text-css{
       min-height: '60px';
       font-size: '16px';
       font-weight: 'bolder' ;
       color: '#666'
    }
    .ivu-form-item{
      box-sizing: border-box;
      border: 1px dashed #fff;
      margin-bottom: 0;
      padding:10px  20px;
      label.ivu-form-item-label{
        font-weight: bolder;
      }
      .button-group{
        .button-group-items{
          display: none;
        }
        margin-top: 0;
        min-height: 33px;
      }
      &:hover,&.active{
        border: 1px dashed #aaa;
        background: #efefef;
        .button-group{
          .button-group-items{
            display: block;
          }
        }

      }
    }
    &.unhover{
      .ivu-form-item{
      .button-group{
        display: none;
      }
      &:hover,&.active{
        border: 1px dashed #fff;
        background:none;
        .button-group{
          display: none;
          .button-group-items{
            display: none;
          }
        }

      }
    }
    }
  }

.bg-list {
  display: flex;
  justify-content: space-between;
}
.bg-list-item {
  width: 300px;
  text-align: center;
  img {
    display: block;
    margin-bottom: 10px;
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    object-position: center;
  }
}
.nowrap {
  font-weight: normal !important;
}
</style>
<style>
.nowrap>p:first-child {
  display: inline;
  vertical-align: middle;
}
</style>