<template>
  <Card>
    <p slot="title" class="class-tit">总部申诉处理</p>
    <Form ref="formData" :model="formData" :rules="formRule">
      <Row>
        <Col span="6">
          <FormItem label="申诉判责结果:" prop="auditResult">
            <RadioGroup
              v-model="formData.auditResult"
              @on-change="judgeResultChange"
            >
              <Radio :label="1">同意申诉</Radio>
              <Radio :label="2">申诉驳回</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <div v-if="formData.auditResult === 1">
        <Row>
          <Col span="4">
            <FormItem
              label="修改后判责结果:"
              prop="judgeResult"
              :rules="formRule.judgeResult"
            >
              <RadioGroup
                v-model="formData.judgeResult"
                @on-change="onChangeResult"
              >
                <Radio :label="1">司机有责</Radio>
                <Radio :label="2">司机无责</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div v-if="formData.judgeResult - 1 === 0">
          <div
            v-for="(item, index) in formData.illegalList"
            :key="index">
            <Row
              type="flex"
              align="middle"
            >
              <Col span="4">
                <FormItem
                  :label="`判责类型${index + 1}`"
                  :rules="formRule.violationItem"
                  :prop="`illegalList.${index}.violationItem`"
                >
                  <cascader
                    style="width: 200px;"
                    :data="categoryThirdList"
                    v-model="item.violationItem"
                    @on-change="
                    (value, selectedData) =>
                      selectCascader(value, selectedData, index)
                  "
                  ></cascader>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem label="违规级别" v-if="!item.isLadder">
                  <Input
                    v-model="item.illegalLevel"
                    style="width:100px"
                    readonly
                  ></Input>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem label="罚款金额" v-if="!item.isLadder">
                  <Input
                    v-model="item.forfeit"
                    style="width:100px"
                    readonly
                  ></Input>
                </FormItem>
              </Col>
              <Col span="1">
                <Icon
                  type="md-add-circle"
                  v-if="index === 0"
                  style="fontSize:23px;marginLeft:10px;cursor:pointer"
                  @click="handleAddVioItem"
                />
                <Icon
                  type="md-remove"
                  v-if="index !== 0"
                  style="fontSize:23px;marginLeft:10px;cursor:pointer"
                  @click="handleRemoveVioItem(index)"
                />
              </Col>
            </Row>
            <Row v-if="item._punish" type="flex" style="font-size: 12px;">
              <Col span="2">处罚内容：</Col>
              <Col span="12">
                <base-punish :data="item._punish"></base-punish>
              </Col>
            </Row>
            <div style="height: 20px"></div>
          </div>
        </div>
      </div>

      <Row>
        <Col span="8">
          <FormItem
            label="申诉处理申诉证据："
            prop="pictureUrl"
            width="600"
          >
            <!-- <img-upload
              :defaultImg="formData.pictureUrl"
              :headerParams="picHeaderParams"
              :action="actionUrl"
              :params="{}"
              :maxSize="500"
              :format="['jpg', 'png']"
              @on-change="getImgUrl"
            ></img-upload> -->
            <!-- <ExportPic
              v-on:up-success="callbackPic1"
              :maxLength="9"
              v-on:deleteItem="deletePic1"
              :imgType="1"
              :showRemove="true"
            ></ExportPic> -->
            <br />
            <mediaUpload
              v-on:upload-success="handleUploadSuccess"
              v-on:delete="handleDelete"
            ></mediaUpload>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="16">
          <FormItem label="申诉处理描述：" prop="judgeDesc">
            <!-- <span v-if="handleType == 3">{{detailInfo.desc}}</span> -->
            <!-- <Input v-else v-model="formData.desc" :rows="8" :autosize="{maxRows:8,minRows: 8}" :maxlength="100" show-word-limit type="textarea" placeholder="请输入" style="width: 800px" /> -->
            <Input
              v-model="formData.judgeDesc"
              :rows="2"
              :autosize="{ maxRows: 5, minRows: 2 }"
              :maxlength="500"
              show-word-limit
              type="textarea"
              placeholder="请输入"
            />
            <span class="numberV">{{ descNum }}/500</span>
            <!-- <span v-if="handleType != 3" class="numberV">{{judgeDesc}}/100</span> -->
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem
            label="判责小结描述："
            prop="briefSummary"
            :rules="formRule.briefSummary"
          >
            <Input
              v-model="formData.briefSummary"
              :rows="2"
              :autosize="{ maxRows: 5, minRows: 2 }"
              :maxlength="1000"
              show-word-limit
              type="textarea"
              placeholder="请输入"
            />
            <span class="numberV">{{ briefSummaryDescNum }}/1000</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <div style="text-align: right;">
          <Button type="default" size="large">取消</Button>
          <Button type="primary" size="large" @click="handleSubmit('formData')"
          >提交</Button
          >
        </div>
      </Row>
    </Form>
  </Card>
</template>

<script>
import imgUpload from "../components/img-upload";
import ExportPic from "../components/exportPic.vue";
import mediaUpload from "../components/mediaUpload.vue";
import { t3JudgeService } from "_o/api/work-order/wo-detail";
import { mapMutations, mapGetters } from "vuex";
import { queryAllJudgeType } from "_o/api/work-order/work-order-config";
import { violationLevelMap } from "./fields.js";
import ViolationDetail from "./violationDetail";
import BasePunish from "_o/components/operator-center/work-order-manage/work-order-config/condemn/components/basePunish.vue"
import { freeze } from "@/mixins/base";

export default {
  name: "m2-appeal",
  components: {
    imgUpload,
    ExportPic,
    mediaUpload,
    BasePunish
  },
  mixins: [ViolationDetail],
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const validateCheckType = (rule, value, callback) => {
      if (value.length) {
        callback();
      } else {
        callback(new Error("请选择"));
      }
    };
    return {
      formData: {
        pictures: [],
        videos: [],
        illegalList: [
          {
            violationItem: [],
            forfeit: "",
            judgeType: "",
            illegalLevel: ""
          }
        ],
        briefSummary: "",
        judgeDesc: "",
      },
      descNum: 0,
      briefSummaryDescNum: 0, // 已输入值计算
      // picHeaderParams: {},
      // actionUrl: this._baseUrl + "/common/uploadFile",
      showStartBlameTypeEdit: false,
      categoryThirdList: [],
      formRule: freeze({
        judgeResult: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        auditResult: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        violationItem: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            validator: validateCheckType
          }
        ],
        judgeDesc: [{ required: true, message: "请输入", trigger: "change" }],
        briefSummary: [{ required: true, message: "请输入", trigger: "change" }]
      }),
      violationLevelMap: freeze(violationLevelMap)
    };
  },
  computed: {
    ...mapGetters(["getRiskList"]),
  },
  watch: {
    "formData.judgeDesc"() {
      this.descNum = this.formData.judgeDesc.length;
    },
    "formData.briefSummary"() {
      this.briefSummaryDescNum = this.formData.briefSummary.length;
    },
    basicInfo: {
      handler() {
        let { woType } = this.basicInfo;
        if(woType === 'SF') {
          woType = 'SFGD'
        }
        if (woType) {
          const params = {
            woType,
            woWay: 1,
            currPage: 1,
            pageSize: 50,
          };
          this.getViolationTpyes(params);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations(["closeTag"]),

    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            basicInfo: { taskId, woCode },
            formData: {
              judgeResult,
              judgeDesc,
              pictures,
              videos,
              briefSummary,
              illegalList,
              auditResult
            }
          } = this;
          const has = illegalList.find(item => item.forfeit || item.forfeit === 0);
          const params = {
            taskId,
            woCode,
            judgeDesc,
            picFiles: pictures.map(item => item.fileId),
            vioFiles: videos.map(item => item.fileId),
            auditResult,
            valKey: "SJ_HEAD",
            valDesc: "总部申诉处理",
            briefSummary,
            illegalList: has
              ? illegalList.map(it => {
                return {
                  ...it,
                  judgeTypeId: it.id
                };
              })
              : [],
          };
          if(auditResult === 1) {
            params. judgeResult = judgeResult
          } else if (auditResult - 2 === 0) { // 申诉驳回 传选中有责的list
            params.orderList = this.getRiskList.filter(v => v._checked).map(v => v.routeNo);
          }
          let isRisk = this.basicInfo.newDataFlag - 1 === 0;
          if(isRisk) {
            if(judgeResult -1 === 0) { // 同意申诉-司机有责
              params.orderList = this.getRiskList.filter(v => v._checked).map(v => v.routeNo);
              let l = this.getRiskList
              if(!l.some(it => it._checked)) {
                this.$Message.error("风控订单明细中必须有订单有责");
                return
              }
            } else if (judgeResult - 2 === 0) { // 同意申诉-司机无责,  申诉 需要传不可编辑且有责
              params.orderList = this.getRiskList.filter(v => !v.editFlag && v._checked).map(v => v.routeNo)
            }
          }
          const {
            data: { success }
          } = await t3JudgeService(params);
          try {
            if (success) {
              this.$Message.success("成功");
              this.closeTag({
                route: this.$route,
                cb: () => {
                  this.$router.replace({
                    name: "work-order-detail",
                    query: {
                      woCode
                    }
                  });
                  this.$parent.init();
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    // handleAdd() {
    //   this.index++;
    //   this.formDynamic.items.push({
    //     value: "",
    //     index: this.index,
    //     status: 1
    //   });
    // },
    // handleRemove(index) {
    //   this.formDynamic.items[index].status = 0;
    // },
    // startBlameResultChange(p) {
    //   if (p === 1) {
    //     this.showStartBlameTypeEdit = true;
    //   }
    // },
    // // TODO /common/uploadFile改造 未使用
    // getImgUrl(url, { publicUrl, uuid }) {
    //   this.formData.pictureUrl = publicUrl;
    //   this.formData.pictureUuid = uuid;
    // },
    //
    // //上传图片
    // callbackPic1(res) {
    //   // let pic = res.data.uuid;
    //   const { data, success } = res;
    //   if (success && this.formDynamic.imageList.length < 9) {
    //     const { uuid, picUrl } = data;
    //     let picObj = { fileId: uuid, fileUrl: picUrl };
    //     this.formDynamic.imageList.push(picObj);
    //     this.$forceUpdate();
    //     // this.imageList.splice(0, 1);
    //   } else {
    //     return;
    //   }
    // },
    // deletePic1(item) {
    //   const list = this.formDynamic.imageList;
    //   this.formDynamic.imageList.splice(list.indexOf(item), 1);
    // },

    handleUploadSuccess(file, type) {
      if (type === 1) {
        this.formData.pictures.push(file);
      } else if (type === 2) {
        this.formData.videos.push(file);
      }
    },
    handleDelete(file, type) {
      const { pictures, videos } = this.formData;
      if (type === 1) {
        const index = pictures.findIndex(item => item.fileId === file.fileId);
        pictures.splice(index, 1);
      } else if (type === 2) {
        const index = videos.findIndex(item => item.fileId === file.fileId);
        videos.splice(index, 1);
      }
    },
    judgeResultChange(val) {
      if (val === 1) {
        this.formData.judgeDesc = "申诉通过";
        this.formData.briefSummary = "申诉通过";
      } else {
        this.formData.illegalList = [{
          violationItem: [],
          forfeit: "",
          judgeType: "",
          illegalLevel: ""
        }]
      }
    },
    //添加违规项
    handleAddVioItem() {
      let newObj = {
        violationItem: [],
        forfeit: ""
      };
      if (this.formData.illegalList.length < 10) {
        this.formData.illegalList.push(newObj);
      } else {
        this.$Message.error("违规项最多为10条!");
      }
    },
    //删除违规项
    handleRemoveVioItem(index) {
      let arr = this.formData.illegalList;
      this.formData.illegalList = arr.filter((item, i) => i !== index);
      this.computedFuc();
    },
    //计算金额
    computedFuc() {
      let arr = this.formData.illegalList;
      arr = arr.filter(item => item.violationLevel !== null);
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index]["violationLevel"];
        if (element === "1") {
          arr[index].forfeit = 50;
        }
        if (element === "2") {
          arr[index].forfeit = 100;
        }
        if (element === "3") {
          arr[index].forfeit = 200;
        }
        if (element === "4") {
          arr[index].forfeit = 500;
        }
      }
    },
    async selectCascader(value, selectedData, index) {
      if(!selectedData.length) {
        this.formData.illegalList[index].isLadder = false
        this.formData.illegalList[index].forfeit = "";
        this.formData.illegalList[index].illegalLevel = "";
        this.$set(this.formData.illegalList[index], '_punish', null);
        return
      }
      const { forfeit, levelShow, id } = selectedData[selectedData.length - 1];
      this.formData.illegalList[index].judgeType = selectedData
        .map(it => it.label)
        .join("/");
      this.formData.illegalList[index].id = id;
      this.formData.illegalList[index].forfeit = forfeit;
      this.formData.illegalList[index].illegalLevel = levelShow;
      let detail = await this.getViolationDetail({woCode: this.basicInfo.woCode, judgeTypeId: id})
      this.$set(this.formData.illegalList[index], '_punish', detail);
      this.formData.illegalList[index].isLadder = detail.openLadder;
    },
    async getViolationTpyes(params) {
      try {
        const {
          data: {
            success,
            data: { list }
          }
        } = await queryAllJudgeType(params);
        if (success) {
          this.categoryThirdList = this.handleTreeData(list);
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleTreeData(list) {
      let arr = [];
      if (list && list.length !== 0) {
        list.map(item => {
          let obj = {
            ...item,
            value: item.id,
            label: item.judgeName,
            level: item.judgeLevel,
            levelShow: violationLevelMap[item.violationLevel],
            forfeit: item.forfeit
          };
          if (item.children.length && item.judgeLevel < 5) {
            //根据后台字段返回数值判断是否有子节点
            obj.children = this.handleTreeData(item.children);
            obj.loading = false;
          }
          arr.push(obj);
        });
      }
      return arr;
    },
    onChangeResult(val) {
      if (val !== 1) {
        this.formData.illegalList = [
          {
            violationItem: [],
            forfeit: "",
            judgeType: "",
            illegalLevel: ""
          }
        ];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.class-tit {
  font-size: 17px;
  &::before {
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: none;
    border: 2px solid #98ce62;
    margin-right: 6px;
    position: relative;
  }
}
</style>
