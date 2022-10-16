<template>
  <Card>
    <p slot="title" class="class-tit">初审判责处理</p>
    <div>
      <Form ref="formData" :model="formData" class="formData">
        <Row>
          <Col span="4">
            <FormItem
              label="初审判责结果:"
              prop="judgeResult"
              :rules="formDataRules.judgeResult"
            >
              <RadioGroup
                v-model="formData.judgeResult"
                @on-change="onChangeResult"
              >
                <template v-if="basicInfo.orderSource === 'GD'">
                  <Radio :label="1">{{basicInfo.canAppeal ? '司机有责' : '高德判罚司机有责（该类目不可申诉）'}}</Radio>
                  <Radio :label="2" :disabled="!basicInfo.canAppeal">司机无责<template v-if="basicInfo.canAppeal">（驳回给高德）</template></Radio>
                </template>
                <template v-else>
                  <Radio :label="1">司机有责</Radio>
                  <Radio :label="2">司机无责</Radio>
                </template>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <template v-if="basicInfo.orderSource !== 'GD'">
          <Row>
            <Col>
              <FormItem
                v-if="formData.judgeResult === 2"
                label="类型："
                prop="judgeLabel"
                :rules="formDataRules.judgeLabel"
              >
                <Radio-group
                class="subtype-container"
                  v-model="formData.judgeLabel"
                  @on-change="onChangeJudgeLabel"
                >
                  <div v-for="(item, idx) in judgeLabelMap" :key="'A' + idx">
                    <Card
                      class="box-card"
                      :class="item.checked ? 'checked' : 'uncheck'"
                    >
                      <Radio :label="item.illegalCode">
                        {{ item.illegalType }}</Radio
                      >
                    </Card>
                  </div>
                </Radio-group>
              </FormItem>
            </Col>
          </Row>
          <div v-if="formData.judgeResult == 1">
            <div
              :key="index"
              v-for="(item, index) in formData.illegalList"
            >
            <Row
              type="flex"
              align="middle"
            >
              <Col span="4">
                <FormItem
                  :label="`初审判责类型${index + 1}`"
                  :rules="formDataRules.violationItem"
                  :prop="`illegalList.${index}.violationItem`"
                >
                  <cascader
                    style="width: 200px;"
                    :data="categoryThirdList"
                    v-model="item.violationItem"
                    @on-change="
                      (value, selectedData) =>
                        selectCascader(value, selectedData, index, item)
                    "
                  ></cascader>
                </FormItem>
              </Col>
              <Col span="2">
                <FormItem label="初审违规级别" v-if="!item.isLadder">
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
                  style="font-size:23px;margin-left:10px;cursor:pointer"
                  @click="handleAddVioItem"
                />
                <Icon
                  type="md-remove"
                  v-if="index !== 0"
                  style="font-size:23px;margin-left:10px;cursor:pointer"
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
        </template>
        <FormItem label="初审判责证据：" prop="imageList">
          <Checkbox @on-change="showSystemFile">带入系统图片或视频</Checkbox>
          <Checkbox v-model="formData.showDriver">视频展示给司机</Checkbox>
          <!-- <ExportPic
            v-on:up-success="callbackPic1"
            :maxLength="9"
            v-on:deleteItem="deletePic1"
            :imgType="1"
            :showRemove="true"
          ></ExportPic>
          <UploadVideo v-on:up-success="callbackPic2"></UploadVideo> -->
          <br />
          <mediaUpload

            v-on:upload-success="handleUploadSuccess"
            v-on:delete="handleDelete"
            :source="basicInfo.orderSource"
            :defaultList="defaultList"
          ></mediaUpload>
        </FormItem>
        <br />
        <Row>
          <Col span="16">
            <FormItem
              label="初审判责表述："
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
import { fetchViolationTpyes, orderJudgeF,postWorkOrderJudgeForGD } from "_o/api/work-order/wo-detail";
import { queryAllJudgeType } from "_o/api/work-order/work-order-config";
import mediaUpload from "../components/mediaUpload.vue";
import { mapMutations, mapGetters } from "vuex";
import { judgeLabelMap,violationLevelMap } from "./fields.js";
import BasePunish from "_o/components/operator-center/work-order-manage/work-order-config/condemn/components/basePunish.vue"
import ViolationDetail from "./violationDetail";

export default {
  name: "start-blame",
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
            violationItemShow: [],
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
        showDriver: false,
        judgeLabel: null
      },
      formDataRules: {
        // imageList:[{ type: "array",required: true, message: "请上传凭证图片", trigger: "change" }],
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
        // violationLevel: [{ required: true, message: '不能为空', trigger: 'change' }],
        judgeDesc: [{ required: true, message: "请输入", trigger: "change" }],
        briefSummary: [{ required: true, message: "请输入", trigger: "change" }],
        judgeLabel:[{ required: true, message: "请选择" }],
      },
      defaultList: [],
      judgeLabelMap
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
          // function generateCascaderData(data) {
          //   data.forEach(item => {
          //     const { label, children } = item;
          //     item.label = name;
          //     item.value = name;
          //     if (children.length) {
          //       generateCascaderData(children);
          //     }
          //   });
          // }
          // generateCascaderData(data);
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
      if (this.basicInfo.orderSource === "GD") return this.onSubmitGD();
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            basicInfo: { taskId, woCode },
            formData: {
              judgeResult,
              judgeDesc,
              showDriver,
              illegalList,
              imageList,
              pictures,
              videos,
              briefSummary,
              judgeLabel
            },
            videoList
          } = this;
          const has = illegalList.find(item => item.forfeit || item.forfeit === 0);
          const params = {
            taskId,
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
            showDriver: showDriver ? 1 : 0,
            valKey: "CS",
            valDesc: "初审判责处理",
            briefSummary,
            judgeTags:judgeResult === 1 ? [] : [judgeLabel]
          };
          let isRisk = this.basicInfo.newDataFlag - 1 === 0;
          if(isRisk) { // 司机有责 风控列表必须有行数据选择有责
            params.orderList = this.getRiskList.filter(v => v._checked).map(v => v.routeNo)
            if(judgeResult - 1 === 0) {
              let l = this.getRiskList
              if(!l.some(it => it._checked)) {
                this.$Message.error("风控订单明细中必须有订单有责");
                return
              }
            } else { // 无责 传 空list
              params.orderList = []
            }
          }
          // console.log(params);
          // return;
          try {
            // params.orderList = judgeResult == 1 ? params.orderList.filter(v => v._checked).map(v => v.routeNo) : []
            const {
              data: { success }
            } = await orderJudgeF(params);
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
    onSubmitGD() {
      this.$refs.formData.validate(valid => {
        if (!valid) return;
        const info = this.basicInfo;
        const form = this.formData;
        postWorkOrderJudgeForGD({
          woCode: info.woCode,
          taskId: info.taskId,
          woType: info.woType,
          judgeResult: form.judgeResult,
          picFiles: form.pictures.map(item => item.fileId),
          vioFiles: form.videos.map(item => item.fileId),
          briefSummary: form.briefSummary,
          judgeDesc: form.judgeDesc,
          valKey: "CS",
          valDesc: "高德初审"
        }).then(res => {
          if (!res.data.success) return this.$Message.error(res.data.msg);
          this.$Message.success("成功");
          this.closeTag({
            route: this.$route,
            cb: () => {
              this.$router.replace({
                name: "work-order-detail",
                query: { woCode: info.woCode }
              });
              this.$parent.init();
            }
          });
        })
      })
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
      // let pic = res.data.uuid;
      const { data, success } = res;
      if (success && this.formData.imageList.length < 9) {
        const { uuid, picUrl } = data;
        let picObj = { fileId: uuid, fileUrl: picUrl };
        this.formData.imageList.push(picObj);
        this.$forceUpdate();
        // this.imageList.splice(0, 1);
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
      let total = 0;
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

    async selectCascader(value, selectedData, index, item) {
      if(!selectedData.length) {
        this.formData.illegalList[index].isLadder = false
        this.formData.illegalList[index].illegalLevel = "";
        this.formData.illegalList[index].forfeit = "";
        this.$set(this.formData.illegalList[index], '_punish', null)
        return
      }
      const { forfeit, levelShow, id } = selectedData[selectedData.length - 1];
      this.formData.illegalList[index].judgeType = selectedData.map(it=>it.label).join("/");
      this.formData.illegalList[index].violationItem = selectedData.map(it=>it.label);
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
        const defaultList = [
          ...pictures.map(item => {
            const { key, value } = item;
            return {
              fileId: key,
              fileUrl: value,
              type: 1
            };
          }),
          ...videos.map(item => {
            const { key, value } = item;
            return {
              fileId: key,
              fileUrl: value,
              type: 2
            };
          })
        ];
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
    },
    onChangeJudgeLabel(val) {

      for (let item of this.judgeLabelMap) {
        if(val === item.illegalCode) {
            item.checked = true
        } else{
            item.checked = false
        }
      }
      this.formData.judgeDesc = this.judgeLabelMap.filter(it => val === it.illegalCode).map(it=>it.illegalType).join(',')
      this.formData.briefSummary =  this.judgeLabelMap.filter(it => val === it.illegalCode).map(it=>it.illegalType).join(',')
    },
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
  //   font-size: 17px;
  //   &::before{
  //     content:'';
  //     display: inline-block;
  //     width:4px;
  //     height:14px;
  //     background: #2d8cf0;
  //     margin-right: 6px;
  //     position: relative;
  //   }
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
.subtype-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  /deep/.Card__body {
    padding: 10px !important;
  }
  .box-card {
    width: 150px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    line-height: 32px;
    text-align: center;
    white-space: nowrap;
  }
  .box-card:hover {
    cursor: pointer;
  }
  .checked {
    background-color: #4eaff5;
    color: #fff;
  }
  .unCheak {
    background-color: #fff;
    color: #000;
  }
}
</style>
