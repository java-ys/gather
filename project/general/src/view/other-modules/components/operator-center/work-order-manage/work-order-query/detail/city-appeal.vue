<template>
  <Card>
    <p slot="title" class="class-tit">城市申诉处理
    </p>
    <Form ref="formData" :model="formData" :rules="formRule">
      <Row>
        <Col span="6">
          <FormItem label="申诉判责结果:" prop="auditResult">
            <RadioGroup
              v-model="formData.auditResult"
            >
              <Radio :label="1">同意申诉</Radio>
              <Radio :label="2">申诉驳回</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem
            label="申诉处理判责证据："
            prop="pictureUrl"
            width="600"
          >
            <!-- <img-upload
                        :defaultImg="formData.pictureUrl"
                        :headerParams="picHeaderParams"
                        :action="actionUrl"
                        :params="{  }"
                        :maxSize="500"
                        :format="['jpg', 'png']"
                        @on-change="getImgUrl"
                        ></img-upload> -->
            <mediaUpload
              style="display:inline-block;width: 100%;"
              v-on:upload-success="handleUploadSuccess"
              v-on:delete="handleDelete"
              :defaultList="[]"
            ></mediaUpload>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="16">
          <FormItem label="申诉处理描述：" prop="judgeDesc">
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
import { cityJudgeService } from "_o/api/work-order/wo-detail";
import { mapMutations } from "vuex";
import { freeze } from "@/mixins/base";
import mediaUpload from "../components/mediaUpload.vue";

export default {
  name: "city-appeal", //  城市审核
  components: {
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
      briefSummaryDescNum: 0, // 已输入值计算
      // picHeaderParams: {},
      // actionUrl: this._baseUrl + "/common/uploadFile",
      formRule: freeze({
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
      })
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
        if (!valid) return
        const {
          basicInfo: { taskId, woCode },
          formData: { auditResult, judgeDesc, briefSummary, pictures, videos, },
        } = this;
        const params = {
          taskId,
          woCode,
          auditResult,
          judgeDesc,
          briefSummary,
          picFiles: pictures.map(item => item.fileId),
          vioFiles: videos.map(item => item.fileId),
          valKey: "SJ_CITY",
          valDesc: "城市申诉处理",
        };
        try {
          const {
            data: { success }
          } = await cityJudgeService(params);
          if (success) {
            this.$Message.success("成功");
            this.closeTag({
              route: this.$route,
              cb: () => {
                this.$router.replace({
                  name: "partner-workorder", // 城市申诉处理完跳转我的工单列表
                  query: {
                    woCode
                  }
                });
              }
            })
          }
        } catch (error) {
          console.log(error);
        }
      });
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
</style>
