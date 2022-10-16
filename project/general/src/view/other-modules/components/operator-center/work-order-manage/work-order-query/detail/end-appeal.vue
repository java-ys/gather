<template>
  <Card>
    <p slot="title" class="class-tit">终审申诉处理<Button
        type="primary"
        class="one-key-btn"
        @click="syncJudgement"
        >一键同步初审信息</Button>
    </p>
    <Form ref="formData" :model="formData" :rules="formRule">
      <Row>
        <Col span="6">
          <FormItem label="终审申诉判责结果:" prop="auditResult">
            <RadioGroup
              v-model="formData.auditResult"
              on-change="judgeResultChange"
            >
              <Radio :label="1">通过初审判责结果</Radio>
              <Radio :label="2">回退初审判责结果</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <!-- <Row>
        <Col span="8">
          <FormItem
            label="终审申诉处理判责证据："
            prop="pictureUrl"
            width="600"
          >
             <img-upload
                        :defaultImg="formData.pictureUrl"
                        :headerParams="picHeaderParams"
                        :action="actionUrl"
                        :params="{  }"
                        :maxSize="500"
                        :format="['jpg', 'png']"
                        @on-change="getImgUrl"
                        ></img-upload>
          </FormItem>
        </Col>
      </Row> -->
      <Row>
        <Col span="16">
          <FormItem label="终审申诉处理描述：" prop="judgeDesc">
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
import { orderJudgeSsZ } from "_o/api/work-order/wo-detail";
import { mapMutations } from "vuex";

export default {
  name: "end-appeal",
  components: {
    imgUpload
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    },
    recordInfo: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      formData: {},
      descNum: 0,
      briefSummaryDescNum: 0, // 已输入值计算
      picHeaderParams: {},
      // actionUrl: this._baseUrl + "/common/uploadFile",
      formRule: {
        auditResult: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ],
        judgeDesc: [{ required: true, message: "请输入", trigger: "change" }],
        briefSummary: [{ required: true, message: "请输入", trigger: "change" }]
      }
    };
  },
  watch: {
    "formData.judgeDesc"() {
      this.descNum = this.formData.judgeDesc.length;
    },

    "formData.briefSummary"() {
      this.briefSummaryDescNum = this.formData.briefSummary.length;
    },
  },
  methods: {
    ...mapMutations(["closeTag"]),

    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            basicInfo: { taskId, woCode },
            formData: { auditResult, judgeDesc, briefSummary },
          } = this;
          const params = {
            taskId,
            woCode,
            judgeDesc,
            picFiles: [],
            vioFiles: [],
            auditResult,
            valKey: "SJ_ZS_SS",
            valDesc: "终审申诉处理",
            briefSummary
          };
          try {
            const {
              data: { success }
            } = await orderJudgeSsZ(params);
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
              })
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    handleAdd() {
      this.index++;
      this.formDynamic.items.push({
        value: "",
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      this.formDynamic.items[index].status = 0;
    },
    startBlameResultChange(p) {
      if (p === 1) {
        this.showStartBlameTypeEdit = true;
      }
    },
    // TODO /common/uploadFile改造 未使用
    getImgUrl(url, { publicUrl, uuid }) {
      this.formData.pictureUrl = publicUrl;
      this.formData.pictureUuid = uuid;
    },
    syncJudgement() {
    //   const { judgeDesc, briefSummary, pictures=[], videos=[] } = this.recordInfo.find(it => it.valKey === "SJ_CS_SS");
    //   const { judgeDesc, briefSummary } = this.recordInfo.find(it => it.valKey === "SJ_CS_SS");
      const recordInfo = this.recordInfo.filter(it => it.valKey === "SJ_CS_SS")
      const { judgeDesc, briefSummary } = recordInfo[recordInfo.length-1];
      this.$set(this.formData,'auditResult',1)
      this.$set(this.formData,'judgeDesc',judgeDesc)
      this.$set(this.formData,'briefSummary',briefSummary)
    //   判责证据先不同步 ----待定
    //   const imgList = pictures.map(it => {
    //     return { ...it, type: 1 };
    //   });
    //   const videoList = videos.map(it => {
    //     return { ...it, type: 2 };
    //   });
    //   this.defaultList = [...imgList, ...videoList];
    }
  }
};
</script>

<style lang="less" scoped>
.class-tit {
  font-size: 17px;
  height: 32px;
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
.one-key-btn {
  margin-left: 24px;
}
</style>
