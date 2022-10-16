<template>
  <Card>
    <p slot="title" class="class-tit">更改判责</p>
    <div>
      <Form ref="formData" :model="formData" class="formData">
        <Row>
          <Col span="4">
            <FormItem
              label="修改后判责结果:"
              prop="judgeResult"
              :rules="formDataRules.judgeResult"
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
        <div v-if="formData.judgeResult == 1">
          <div
            v-for="(item, index) in formData.illegalList"
            :key="index"
          >
          <Row
            type="flex"
            align="middle"
          >
            <Col span="4">
              <FormItem
                :label="`判责类型${index + 1}`"
                :rules="formDataRules.violationItem"
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
        <FormItem label="申诉附件：" prop="imageList">
          <br />
          <mediaUpload
            v-on:upload-success="handleUploadSuccess"
            v-on:delete="handleDelete"
            :defaultList="defaultList"
          ></mediaUpload>
        </FormItem>
        <br />
        <Row>
          <Col span="16">
            <FormItem
              label="判责表述："
              prop="judgeDesc"
              :rules="formDataRules.judgeDesc"
            >
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
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem
              label="判责小结描述："
              prop="briefSummary"
              :rules="formDataRules.briefSummary"
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
            <Button
              type="primary"
              size="large"
              @click="handleSubmit('formData')"
              >提交</Button
            >
          </div>
        </Row>
      </Form>
    </div>
  </Card>
</template>

<script>
import ExportPic from "../components/exportPic.vue";
import UploadVideo from "../components/uploadVideo.vue";
import { fetchViolationTpyes, orderJudgeAgain } from "_o/api/work-order/wo-detail";
import mediaUpload from "../components/mediaUpload.vue";
import { mapMutations, mapGetters } from "vuex";
import { violationLevelMap } from "./fields.js";
import { queryAllJudgeType } from "_o/api/work-order/work-order-config";
import ViolationDetail from "./violationDetail";
import BasePunish from "_o/components/operator-center/work-order-manage/work-order-config/condemn/components/basePunish.vue"

export default {
  name: "again-appeal",
  components: {
    ExportPic,
    UploadVideo,
    mediaUpload,
    BasePunish
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [ViolationDetail],
  data() {
    const validateCheckType = (rule, value, callback) => {
      if (value.length) {
        callback();
      } else {
        callback(new Error("请选择"));
      }
    };
    return {
      descNum: 0, // 已输入值计算
      briefSummaryDescNum: 0, // 已输入值计算
      videoList: [],
      categoryThirdList: [],
      formData: {
        pictures: [],
        videos: [],
        imageList: [],
        illegalList: [
          {
            violationItem: [],
            forfeit: "",
            judgeType: "",
            illegalLevel: ""
          }
        ],
        items: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ],
        judgeResult: "",
        judgeDesc: "",
        briefSummary: "",
        showSystemFile: false,
      },
      formDataRules: {
        judgeResult: [
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
      },
      defaultList: []
    };
  },
  computed: {
    ...mapGetters(["getRiskList"])
  },
  created() {},
  mounted() {},

  activated() {},

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
    async getViolationTpyes(params) {
      try {
        const {
          data: { success, data:{list} }
        } = await queryAllJudgeType(params);
        if (success) {
          this.categoryThirdList = this.handleTreeData(list);;
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
            levelShow:violationLevelMap[item.violationLevel],
            forfeit: item.forfeit,
          };
          if (item.children.length && item.judgeLevel < 5) {
            //根据后台字段返回数值判断是否有子节点
            obj.children = this.handleTreeData(item.children)
            obj.loading = false;
          }
          arr.push(obj);
        });
      }
      return arr;
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            basicInfo: { woCode },
            formData: {
              judgeResult,
              judgeDesc,
              illegalList,
              pictures,
              videos,
              briefSummary
            },
          } = this;
          const has = illegalList.find(item => item.forfeit || item.forfeit === 0);
          const params = {
            woCode,
            judgeDesc,
            illegalList: has ? illegalList.map(it=>{
                return {
                    ...it,
                    judgeTypeId:it.id
                }
            }) : [],
            picFiles: pictures.map(item => item.fileId),
            vioFiles: videos.map(item => item.fileId),
            judgeResult,
            valKey: "APPEAL_ONCE_MORE",
            valDesc: "更改判责",
            briefSummary,
          };
          let isRisk = this.basicInfo.newDataFlag - 1 === 0;
          if(isRisk) {
            params.orderList= this.getRiskList.filter(v => v._checked).map(v => v.routeNo);
            if(judgeResult -1 === 0) {
              let l = this.getRiskList
              if(!l.some(it => it._checked)) {
                this.$Message.error("风控订单明细中必须有订单有责");
                return
              }
            } else {
              params.orderList = []
            }
          }
        //     console.log(params);
        //   return;
          try {
            const {
              data: { success }
            } = await orderJudgeAgain(params);
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
    //上传图片
    callbackPic1(res) {
      const { data, success } = res;
      if (success && this.formData.imageList.length < 9) {
        const { uuid, picUrl } = data;
        let picObj = { fileId: uuid, fileUrl: picUrl };
        this.formData.imageList.push(picObj);
        this.$forceUpdate();
      } else {
        return;
      }
    },
    //上传视频
    callbackPic2(res) {
      const { data, success } = res;
      if (success && data) {
        let videoObj = { fileId: res.data.uuid, fileUrl: res.data.publicUrl };
        this.videoList.push(videoObj);
        this.$forceUpdate();
      }
    },
    deletePic1(item) {
      const list = this.formData.imageList;
      this.formData.imageList.splice(list.indexOf(item), 1);
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
        this.formData.illegalList[index].illegalLevel = "";
        this.formData.illegalList[index].forfeit = "";
        this.$set(this.formData.illegalList[index], '_punish', null)
        return
      }
      const { forfeit, levelShow,id } = selectedData[selectedData.length - 1];
      this.formData.illegalList[index].judgeType = selectedData.map(it=>it.label).join("/");
      this.formData.illegalList[index].id = id
      this.formData.illegalList[index].forfeit = forfeit;
      this.formData.illegalList[index].illegalLevel = levelShow;
      let detail = await this.getViolationDetail({woCode: this.basicInfo.woCode, judgeTypeId: id})
      this.$set(this.formData.illegalList[index], '_punish', detail);
      this.formData.illegalList[index].isLadder = detail.openLadder;
    },

    handleUploadSuccess(file, type) {
      if (type === 1) {
        if (file.type) {
          this.formData.pictures.unshift(file);
          return;
        }
        this.formData.pictures.push(file);
      } else if (type === 2) {
        if (file.type) {
          this.formData.videos.unshift(file);
          return;
        }
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

    onChangeResult(val) {
      if (val !==1) {
        this.formData.illegalList = [
          {
            violationItem: [],
            forfeit: "",
            judgeType: "",
            illegalLevel: ""
          }
        ];
      }
    },
    async getFileToken(params) {
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        return data;
      }
      return null;
    },

    async getFileLink(ids, params) {
      let arr = [];
      try {
        const token = await this.getFileToken(params);
        if (token) {
          const params = { uuids: ids };
          const {
            data: { data, success }
          } = await fetchFilesUrl(params, token);
          if (success && data) {
            for (let key in data) {
              const value = data[key];
              if (value) {
                arr.push({
                  key,
                  value
                });
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      return arr;
    },

    showSystemFile(val) {
      if (val) {
        const { pictures = [], videos = [] } = this.basicInfo;
        const defaultList = pictures
          .map(item => {
            const { key, value } = item;
            return {
              fileId: key,
              fileUrl: value,
              type: 1
            };
          })
          .concat(
            videos.map(item => {
              const { key, value } = item;
              return {
                fileId: key,
                fileUrl: value,
                type: 2
              };
            })
          );
        this.defaultList = defaultList;
        defaultList.forEach(item => {
          this.handleUploadSuccess(item, item.type);
        });
      } else {
        this.defaultList = this.defaultList.filter(item => !item.type);
        this.formData.pictures = this.formData.pictures.filter(
          item => !item.type
        );
        this.formData.videos = this.formData.videos.filter(item => !item.type);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.formData {
  /deep/ .ivu-form-item-content {
    margin-left: 0px !important;
  }
}
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
.numberV {
  position: absolute;
  bottom: -7%;
  right: 2%;
}
</style>
