<template>
  <Card>
    <p slot="title" class="class-tit">
      终审判责处理<Button
        type="primary"
        class="one-key-btn"
        @click="syncJudgement"
        >一键同步初审信息</Button
      >
    </p>
    <Form ref="formData" :model="formData" :rules="formRule">
      <Row>
        <Col span="4">
          <FormItem label="终审判责结果:" prop="auditResult">
            <RadioGroup
              v-model="formData.auditResult"
              on-change="endBlameResultChange"
            >
              <Radio :label="1">通过初审判责结果</Radio>
              <Radio :label="2">回退初审判责结果</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="终审判责证据：" prop="pictureUrl" width="600">
            <!-- <img-upload
              :defaultImg="formData.pictureUrl"
              :headerParams="picHeaderParams"
              :action="actionUrl"
              :params="{  }"
              :maxSize="500"
              :format="['jpg', 'png']"
              @on-change="getImgUrl"
            ></img-upload> -->
            <br />
            <mediaUpload
              v-on:upload-success="handleUploadSuccess"
              v-on:delete="handleDelete"
              :defaultList="defaultList"
            ></mediaUpload>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="16">
          <FormItem label="终审判责描述:" prop="judgeDesc">
            <!-- <span v-if="handleType == 3">{{detailInfo.judgeDesc}}</span> -->
            <!-- <Input v-else v-model="formData.judgeDesc" :rows="8" :autosize="{maxRows:8,minRows: 8}" :maxlength="100" show-word-limit type="textarea" placeholder="请输入" style="width: 800px" /> -->
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
import { orderJudgeZ } from "_o/api/work-order/wo-detail";
import mediaUpload from "../components/mediaUpload.vue";
import { mapMutations } from "vuex";

export default {
  name: "end-blame",
  components: {
    imgUpload,
    mediaUpload
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
      formData: {
        pictures: [],
        videos: []
      },
      descNum: 0,
      briefSummaryDescNum: 0,
      picHeaderParams: {},
      actionUrl: this._baseUrl + "/common/uploadFile",
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
      },
      defaultList: []
    };
  },
  watch: {
    "formData.judgeDesc"() {
      this.descNum = this.formData.judgeDesc.length;
    },

    "formData.briefSummary"() {
      this.briefSummaryDescNum = this.formData.briefSummary.length;
    }
  },
  methods: {
    ...mapMutations(["closeTag"]),

    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            basicInfo: { taskId, woCode },
            formData: { auditResult, judgeDesc, pictures, videos, briefSummary }
          } = this;
          const params = {
            taskId,
            woCode,
            judgeDesc,
            picFiles: pictures.map(item => item.fileId),
            vioFiles: videos.map(item => item.fileId),
            auditResult,
            valKey: "ZS",
            valDesc: "终审判责处理",
            briefSummary
          };
          try {
            const {
              data: { success }
            } = await orderJudgeZ(params);
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
    syncJudgement() {
      const recordInfo = this.recordInfo.filter(it => it.valKey === "CS")
      console.log(recordInfo[recordInfo.length-1])
      const { judgeDesc, briefSummary, pictures=[], videos=[] } = recordInfo[recordInfo.length-1];
      this.$set(this.formData,'auditResult',1)
      this.$set(this.formData,'judgeDesc',judgeDesc)
      this.$set(this.formData,'briefSummary',briefSummary)
      const imgList = pictures.map(it => {
        return { ...it, type: 1,fileId: it.key, fileUrl: it.value };
      });
      const videoList = videos.map(it => {
        return { ...it, type: 2,fileId: it.key, fileUrl: it.value, };
      });

      this.formData.pictures=imgList
      this.formData.videos=videoList
      this.defaultList = [...imgList, ...videoList];
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
