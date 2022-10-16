<template>
  <div>
    <Modal
      v-model="show"
      width="60%"
      :title="title"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <Form
        :model="formData"
        :rules="formValidate"
        ref="_form"
        label-position="top"
      >
        <Row>
          <Col span="8">
            <FormItem
              label="学习任务名称："
              prop="learningTaskName"
              class="tit"
            >
              <Input
                class="item-style"
                v-model="formData.learningTaskName"
                :maxlength="50"
                placeholder="请输入学习任务名称"
                style="width: 200px"
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="主题图：" prop="imageUrl" class="tit">
              <img-upload
                :defaultImg="formData.imageUrl"
                :headerParams="{}"
                :action="actionUrl"
                :params="{}"
                :width="110"
                :height="120"
                :format="['jpg', 'png']"
                @on-change="getMainUrl"
              ></img-upload>
            </FormItem>
          </Col>
        </Row>
        <br />

        <Row>
          <Col span="8">
            <FormItem label="上线时间：" prop="publishTime" class="tit">
              <DatePicker
                v-model="formData.publishTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择上线时间"
                style="width: 200px"
                :options="options"
                :time-picker-options="timePickerOptions"
                @on-change="(v) => setPublishTime(v, 0)"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem label="下线时间：" prop="offTime" class="tit">
              <DatePicker
                v-model="formData.offTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择下线时间"
                style="width: 200px"
                :options="options"
                :time-picker-options="timePickerOptions"
                @on-change="(v) => setPublishTime(v, 1)"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem label="学习分类：" prop="cataId" class="tit">
              <Select
                v-model="formData.cataId"
                placeholder="请选择"
                style="width: 200px"
              >
                <Option
                  :key="item.value"
                  :value="item.value"
                  v-for="item in modalData._cate"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <br />
        <!-- </Form> -->

        <FormItem label="学习对象：" prop="types" class="tit">
          <div>
            <RadioGroup v-model="formData.types">
              <!--<Radio label="2">指定运营商</Radio>-->
              <Radio label="1">按条件筛选</Radio>
              <Radio label="2">指定司机</Radio>
              <!-- <Radio label="3">批量导入</Radio> -->
            </RadioGroup>
          </div>
        </FormItem>
        <!-- 城市/运营商/司管联动 -->
        <section v-if="isOpt" class="form-group">
          <div style="width: 100%">
            <Row>
              <Col span="8">
                <FormItem label="选择城市">
                  <Select
                    v-model="formData.conditionCityCode"
                    placeholder="请选择"
                    style="width: 200px"
                    @on-change="cityChange"
                    filterable
                    clearable
                  >
                    <Option
                      v-for="(item, index) in cityList"
                      :value="item.uuid"
                      :key="index"
                      >{{ item.label || item.title }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="运营商">
                  <Select
                    v-model="formData.conditionAgentId"
                    placeholder="请选择"
                    style="width: 200px"
                    filterable
                    clearable
                    @on-change="agentChange"
                  >
                    <Option
                      v-for="(item, index) in agentList"
                      :value="item.uuid"
                      :key="index"
                      >{{ item.label || item.title }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>

              <Col span="8">
                <FormItem label="司管">
                  <Select
                    v-model="formData.conditionDriverManagerId"
                    class="agent-select"
                    filterable
                    clearable
                    style="width: 200px"
                  >
                    <Option
                      v-for="(item, index) in driverManagerList"
                      :value="item.uuid"
                      :key="index"
                      >{{ item.realName }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </div>
          <br />

          <div style="width: 100%">
            <Row>
              <Col span="8">
                <FormItem label="司机类型">
                  <Select
                    v-model="formData.conditionDriverType"
                    placeholder="请选择司机类型"
                    style="width: 200px"
                  >
                    <Option
                      :key="it.value"
                      :value="it.value"
                      v-for="it in driverType"
                      >{{ it.label }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="司机模式">
                  <Select
                    v-model="formData.conditionDriverOperationType"
                    placeholder="请选择司机模式"
                    style="width: 200px"
                  >
                    <Option
                      :key="it.value"
                      :value="it.value"
                      v-for="it in driverModel"
                      >{{ it.label }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </div>
        </section>

        <FormItem v-if="isDriver" prop="person">
          <Input
            type="textarea"
            v-model="formData.person"
            placeholder="可只输入司机code, 英文逗号隔开"
          />
          <import-file
            btnText="批量导入司机code"
            baseUrlName="_base4Driver"
            otherMsg="最多导入5000条数据"
            successMsg="导入成功！已将数据添加至输入框"
            size="small"
            importFileUrl="/api/exam/task/importDriverNo"
            toDownTemplateUrl="/downloadExcel/批量导入司机code.xlsx"
            :data="{}"
            @on-success="getUpFile"
          ></import-file>
        </FormItem>

        <br />

        <FormItem label="学习内容：" prop="contentType" class="tit">
          <div>
            <RadioGroup v-model="formData.contentType">
              <Radio label="1">图文类(pdf)</Radio>
              <Radio label="2">视频类(600m以内)</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <div class="bor">
          <!-- 图文 -->
          <FormItem prop="fileUrl" v-if="isFile">
            <img-upload
              :defaultFile="formData.fileUrl"
              :defaultFileName="formData.fileName"
              :headerParams="{}"
              :action="actionUrl"
              :params="{}"
              accept="application/pdf"
              :format="['pdf']"
              @on-change="getFileUrl"
            ></img-upload>
          </FormItem>
          <!-- 视频 -->
          <div>
            <FormItem prop="videoUrl" v-if="!isFile">
              <img-upload
                :defaultFile="formData.videoUrl"
                :defaultFileName="formData.videoName"
                :headerParams="{}"
                :action="videoActionUrl"
                :maxFileSize="600"
                :params="{ videoPayloadType: 'h265' }"
                accept="audio/mp4, video/mp4, audio/3gpp, video/3gpp, audio/mpeg, video/mpeg"
                :format="['mp4']"
                @on-change="getVideoUrl"
                @on-progress="videoOnProgess"
              ></img-upload>
            </FormItem>
            <span v-if="!isFile && uploadVideoStatus" class="loading"
              >视频上传中</span
            >
          </div>
        </div>
        <br />

        <!--<section style="display: flex; align-items: center;">-->
        <section class="form-inline-group">
          <FormItem
            v-if="isFile"
            label="其他设置:"
            style="width: 50%"
            class="tit"
            prop="pageTimeLimit"
          >
            <p>
              <span class="tt"> 每页阅读 </span>
              <!-- <InputNumber
                v-model="formData.pageTimeLimit"
                :min="1"
                style="width: 140px"
                placeholder="请输入正整秒数"
              >
              </InputNumber> -->
              <Input
                v-model="formData.pageTimeLimit"
                type="text"
                placeholder="请输入正整数"
                style="width: 100px"
              />
              <span> 秒才可翻页 (针对pdf类学习) </span>
            </p>
          </FormItem>

          <FormItem
            v-if="!isFile"
            label="其他设置:"
            style="width: 50%"
            class="tit"
            prop="videoTipTime"
          >
            <p>
              <span class="tt">每隔</span>
              <!-- <InputNumber
                v-model="formData.videoTipTime"
                :min="1"
                style="width: 120px"
                placeholder="请输入正整数分钟数"
              ></InputNumber> -->
              <Input
                v-model="formData.videoTipTime"
                type="text"
                placeholder="请输入正整数"
                style="width: 100px"
              />
              <span> 分钟弹拼图弹窗 (针对视频类学习) </span>
            </p>
          </FormItem>
        </section>
        <br />

        <FormItem label="是否必学:" prop="isMust" class="tit">
          <Select
            v-model="formData.isMust"
            style="width: 100px"
            placeholder="请选择"
          >
            <Option :value="1">是</Option>
            <Option :value="0">否</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool, getObjKeys, isFunc } from "_o/api/baseMixin.js";
import s from "_o/api/study-exam";
import { timeFormat } from "@/libs/util";
import importFile from "_a/import-file/index.vue";
import { getImageUrl, splitStrInDot, numToArray } from "../common";
import imgUpload from "../common-img-upload";
import { addValidate, driverType, driverModel } from "../fields";
import { queryDriverManagerUser } from "_o/api/m2-driver-api/common";

const titleList = ["新建学习任务", "编辑学习任务"];
const formParams = {
  learningTaskName: "", // 学习任务名称
  imageUrl: "", // 主题图url
  imageUuid: "", //  主题图uuid
  imageName: "", // 主题图名称
  publishTime: "", // 发布时间  (Date 对象)
  offTime: "", // 下线时间  (Date 对象)
  cataId: "", // 学习分类id
  person: "", // 司机code集合
  // importPerson: "", // 批量导入的司机
  cityAndAgent: [],
  // matchType (integer, optional): 匹配方式：0 指定司机, 1 运营商, 2 按给定条件筛选 ,
  conditionCityCode: "", // 城市 (条件筛选)
  conditionAgentId: "", // 运营商 (条件筛选)
  conditionDriverManagerId: "", // 司管 (条件筛选)
  conditionDriverType: "", // 司机类型(条件筛选) 1-普通司机；2-备用司机 ,
  conditionDriverOperationType: "", // 司机模式(条件筛选) 1:自营司机；2:UP司机,3:P司机
  // agentUuid: [], // 运营商集合
  pageTimeLimit: "0", // 每页阅读时间显示
  videoTipTime: "0", // 视频每个几分钟弹窗
  isMust: "", // 0 非必学 ，1 必学
  fileUrl: "", // 图文文件url
  fileUuid: "", // 图文uuid
  fileName: "", // 文件名称
  videoUrl: "", // 视频文件url
  videoUuid: "", // 视频uuid
  videoName: "", // 视频文件名,
  contentType: "1", // 1 图文 2 视频
  types: "1", //1 条件筛选 2 司机和批量导入 3 批量导入
};

export default {
  name: "study-add",
  props: ["visible", "modalData"],
  components: {
    imgUpload,
    importFile,
  },
  mixins: [tool],
  data() {
    return {
      show: this.visible,
      uploadVideoStatus: false,
      title: titleList[0],
      timePickerOptions: {}, // 设置可选择时间范围
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      formValidate: addValidate,
      formData: this.deepCopy({}, formParams),
      actionUrl: this._uploadUrl + "/file/upload/public", // 公共文件上传服务
      videoActionUrl: this._uploadUrl + "/file/media/upload/private", // 视频文件上传服务
      cityList: [], // 城市列表
      agentList: [], // 运营商列表
      driverManagerList: [], // 司管列表
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        // 编辑前获取开通详情
        if (this.isEdit) {
          this.title = titleList[1];
          this.getDetail();
        }
      } else {
        this.initData();
      }
    },
  },
  created() {
    this.driverType = driverType;
    this.driverModel = driverModel;
    this.getAgentList();
  },
  computed: {
    // 条件筛选
    isOpt() {
      return this.formData.types - 1 === 0;
    },
    // 指定司机
    isDriver() {
      return this.formData.types - 2 === 0;
    },
    // 批量导入司机
    // isImport() {
    //   return this.formData.types - 3 === 0;
    // },
    // 学习内容是否是图文类
    isFile() {
      return this.formData.contentType - 1 === 0;
    },
    // 是否是编辑
    isEdit() {
      return this.modalData && this.modalData.id;
    },
  },
  methods: {
    async getDetail() {
      let id = this.modalData.id;
      if (!id) return;
      const [err, data] = await this.toResult(s.studyDetail({ id }));
      if (err) {
        return;
      }
      if (data) {
        this.fillParams(data).fillStudyParams(data).fillFileParams(data);
      }
    },
    fillParams({
      learningTaskName,
      publishTime,
      offTime,
      cataId,
      pageTimeLimit,
      videoTipTime,
      isMust,
    }) {
      this.formData.learningTaskName = learningTaskName;
      this.formData.publishTime = new Date(publishTime);
      this.formData.offTime = new Date(offTime);
      this.formData.cataId = cataId;
      this.formData.pageTimeLimit = pageTimeLimit;
      this.formData.videoTipTime = videoTipTime;
      this.formData.isMust = +isMust;
      return this;
    },
    fillStudyParams({
      matchType,
      driverNoList,
      conditionCityCode,
      conditionAgentId,
      conditionDriverManagerId,
      conditionDriverType,
      conditionDriverOperationType,
    }) {
      // 根据城市code 获取对应运营商
      if (conditionCityCode) {
        this.cityChange(conditionCityCode);
        if (conditionAgentId) {
          // 运营商uuid获取司管列表
          this._getDriverManagerUser(conditionAgentId);
        }
      }
      if (matchType - 2 === 0) {
        this.formData.types = "1";
        this.formData.conditionCityCode = conditionCityCode;
        this.formData.conditionAgentId = conditionAgentId;
        this.formData.conditionDriverManagerId = conditionDriverManagerId;
        this.formData.conditionDriverType = conditionDriverType;
        this.formData.conditionDriverOperationType = conditionDriverOperationType;
      } else if (matchType - 0 === 0) {
        this.formData.types = "2";
        this.formData.person = driverNoList.join(",");
      }
      return this;
    },
    fillFileParams({
      themeFileName,
      themeFileUuid,
      imageFileName,
      imageFileUuid,
      videoFileUuid,
      videoFileName,
    }) {
      this.formData.imageUuid = themeFileUuid;
      this.formData.imageName = themeFileName;
      this.formData.fileUuid = imageFileUuid;
      this.formData.fileName = imageFileName;
      this.formData.videoUuid = videoFileUuid;
      this.formData.videoName = videoFileName;
      if (themeFileUuid) {
        this.fetchImage({ uuid: themeFileUuid }, (url) => {
          this.formData.imageUrl = url;
        });
      }
      if (videoFileUuid) {
        this.formData.contentType = "2";
        this.fetchImage({ uuid: videoFileUuid }, (url) => {
          this.formData.videoUrl = url;
        });
      }
      if (imageFileUuid) {
        this.formData.contentType = "1";
        this.fetchImage({ uuid: imageFileUuid }, (url) => {
          this.formData.fileUrl = url;
        });
      }
      return this;
    },
    fetchImage(p, successCb, errorCb) {
      getImageUrl({ baseUrl: this._uploadUrl, ...p }, ({ data }) => {
        if (data.success) {
          isFunc(successCb) && successCb(data.data);
        } else {
          this.$Message.error(data.msg);
        }
      });
    },
    // 从本地存储中获取所有运营商
    getAgentList() {
      let _agentList = JSON.parse(localStorage.getItem("pcOperatorList"));
      let arr = [];
      _agentList.forEach((it) => {
        arr = [
          ...arr,
          ...(it.children && Array.isArray(it.children) ? it.children : []),
        ];
      });
      this.cityList = arr;
    },
    agentChange(v) {
      this.clearDriverManager();
      v && this._getDriverManagerUser(v);
    },
    cityChange(v) {
      this.clearAgent().clearDriverManager();
      if (v) {
        let f = this.cityList.find((it) => it.uuid === v || it.value === v);
        f && (this.agentList = f.children);
      }
    },
    // 清空司管列表和值
    clearDriverManager() {
      this.formData.conditionDriverManagerId = "";
      this.driverManagerList = [];
      return this;
    },
    // 清空运营商列表和值
    clearAgent() {
      this.agentList = [];
      this.formData.conditionAgentId = "";
      return this;
    },
    async _getDriverManagerUser(agentId) {
      const res = await queryDriverManagerUser({ agentId });
      if (!res.data.success) return this.$Message.error(res.msg);
      if (!agentId) {
        this.driverManagerList = [];
        return;
      }
      this.driverManagerList = res.data.data;
    },
    // 学习任务/主题图/上线时间/下线/学习分类参数
    getPart1Params() {
      const {
        learningTaskName,
        imageUuid,
        imageName,
        publishTime,
        offTime,
        cataId,
      } = this.formData;
      console.log({
        learningTaskName,
        themeFileUuid: imageUuid,
        themeFileName: imageName,
        publishTime: timeFormat(new Date(publishTime).getTime(), "yyyy-mm-dd"),
        offTime: timeFormat(new Date(offTime).getTime(), "yyyy-mm-dd"),
        cataId,
      })
      return {
        learningTaskName,
        themeFileUuid: imageUuid,
        themeFileName: imageName,
        publishTime: timeFormat(new Date(publishTime).getTime(), "yyyy-mm-dd"),
        offTime: timeFormat(new Date(offTime).getTime(), "yyyy-mm-dd"),
        cataId,
      };
    },
    // 学习对象参数
    getPart2Params() {
      const { person, importPerson } = this.formData;
      let p = {};
      if (this.isOpt) {
        [
          "conditionCityCode",
          "conditionAgentId",
          "conditionDriverManagerId",
          "conditionDriverType",
          "conditionDriverOperationType",
        ].forEach((it) => (p[it] = this.formData[it]));
      } else if (this.isDriver) {
        p.driverNoList = splitStrInDot(person);
      }
      // else if (this.isImport) {
      //   p.driverNoList = splitStrInDot(importPerson);
      // }
      return p;
    },
    // 其他设置/是否必学
    getPart3Params() {
      const { pageTimeLimit, videoTipTime, isMust } = this.formData;

      // 其他设置(阅读文件几分钟翻页/视频几分钟弹窗)
      let p = this.isFile
        ? { pageTimeLimit: pageTimeLimit || 0 }
        : { videoTipTime: videoTipTime || 0 };
      p.isMust = isMust;
      return p;
    },
    // 学习内容参数
    getPart4Params() {
      const { fileUuid, fileName, videoUuid, videoName } = this.formData;
      const p = this.isFile
        ? {
            imageFileUuid: fileUuid,
            imageFileName: fileName,
          }
        : {
            videoFileUuid: videoUuid,
            videoFileName: videoName,
          };
      return p;
    },
    getSavePrams() {
      // matchType (integer, optional): 匹配方式：0 指定司机, 1 运营商, 2 按给定条件筛选 ,
      let p = {
        ...this.getPart1Params(),
        ...this.getPart2Params(),
        ...this.getPart3Params(),
        ...this.getPart4Params(),
        ...(this.isOpt ? { matchType: 2 } : { matchType: 0 }),
        ...(this.isEdit ? { id: this.modalData.id } : {}),
      };
      return p;
    },
    validSave() {
      const {
        conditionCityCode,
        conditionAgentId,
        conditionDriverManagerId,
        conditionDriverType,
        conditionDriverOperationType,
        publishTime,
        offTime,
      } = this.formData;

      if (publishTime && offTime) {
        if (+new Date(publishTime) >= +new Date(offTime)) {
          this.$Message.error("上线时间不能大于上线时间");
          return;
        }
      }

      if (this.isOpt) {
        if (
          [
            conditionCityCode,
            conditionAgentId,
            conditionDriverManagerId,
            conditionDriverType,
            conditionDriverOperationType,
          ].every((it) => !it)
        ) {
          this.$Message.error("请完善内容后再提交");
          return;
        }
      }
      if (!this.isFile && this.uploadVideoStatus) {
        this.$Message.error("视频文件正在上传中");
        return;
      }
      return true;
    },
    save() {
      if (!this.validSave()) return;
      // console.log(this.getSavePrams(), "this.getSavePrams()");
      // return;
      this.$refs._form.validate(async (valid) => {
        if (!valid) return;
        const func = this.isEdit ? s.studyEdit : s.studyAdd;
        const [err, data] = await this.toResult(func(this.getSavePrams()));
        if (err) {
          return;
        }
        this.cancel(true);
      });
    },
    getMainUrl(url, { publicUrl, uuid, fileName }) {
      this.resetFieldByProp("imageUrl");
      this.formData.imageUrl = publicUrl;
      this.formData.imageUuid = uuid;
      this.formData.imageName = fileName;
    },
    getFileUrl(url, { publicUrl, uuid, fileName }) {
      this.formData.fileUrl = publicUrl;
      this.formData.fileUuid = uuid;
      this.formData.fileName = fileName;
    },
    getVideoUrl(url, { path, uuid, fileName }) {
      this.formData.videoUrl = path;
      this.formData.videoUuid = uuid;
      this.formData.videoName = fileName;
    },
    initData() {
      // this.agentList = [];
      this.formData = this.deepCopy({}, formParams);
      this.title = titleList[0];
      this.formData.types = "1";
      // this.formData.contentType = "1";
      this.timePickerOptions = {};
      this.uploadVideoStatus = false;
      this.$refs._form.resetFields();
    },
    setPublishTime(v, type) {
      // console.log(v, "v");
      let nw = +new Date();
      let nowTime = timeFormat(nw, "yyyy-mm-dd");
      const [nowYear, nowMonth, nowDay] = nowTime.split(" ")[0].split("-");
      const [nowHour, nowMinute, nowSecond] = nowTime.split(" ")[1].split(":");
      if (v && `${v}`.split(" ").length > 1) {
        if (new Date(v) < nw) {
          v = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMinute}:${nowSecond}`;
        }
        const [year, month, day] = v.split(" ")[0].split("-");
        const [hour, minute, second] = v.split(" ")[1].split(":");
        const ymdEqual =
          nowYear - year === 0 && nowMonth - month === 0 && nowDay - day === 0;
        let hourEqual = hour - nowHour === 0;
        let minuteEqual = minute - nowMinute === 0;
        this.timePickerOptions.disabledHours = ymdEqual
          ? numToArray(nowHour)
          : [];
        this.timePickerOptions.disabledMinutes =
          ymdEqual && hourEqual ? numToArray(nowMinute) : [];
        this.timePickerOptions.disabledSeconds =
          ymdEqual && hourEqual && minuteEqual ? numToArray(nowSecond) : [];
      }
      if (type && type - 1 === 0) {
        this.formData.offTime = v;
        if (this.formData.publishTime) {
          if (
            +new Date(this.formData.publishTime) >=
            +new Date(this.formData.offTime)
          ) {
            this.$Message.error("上线时间不能大于上线时间");
          }
        }
      } else {
        this.formData.publishTime = v;
      }
    },
    getUpFile({ data }) {
      if (data && data.length) {
        this.formData.person = data.join(",");
      }
    },
    videoOnProgess({ event, file, fileList }) {
      this.uploadVideoStatus = event.percent - 100 !== 0;
    },
    resetFieldByProp(propName) {
      let fi = this.$refs._form.fields;
      if (!fi) return;
      let ff = fi.find((it) => it.prop === propName);
      if (ff && isFunc(ff.resetField)) {
        ff.resetField();
      }
    },
    cancel(refresh = false) {
      this.$emit("close", { refresh });
    },
  },
};
</script>

<style lang="less" scoped>
@border-color: #dcdee2;

/deep/ textarea {
  height: 120px;
  resize: none;
}

/deep/ .tit label {
  font-weight: bold;
}

.form-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-inline-group {
  display: flex;
  .ivu-form-item {
    margin-right: 12px;
  }
}

.item-style {
  width: 280px;
}
.area-style {
  width: 100%;
  height: 120px;
  resize: none;
  border: 1px solid @border-color;
  border-radius: 4px;
  padding-left: 10px;
}
.mb-20 {
  margin-bottom: 20px;
}
.bor {
  padding: 20px;
  border: 1px solid @border-color;
  border-radius: 4px;
}
.agent-select /deep/ .ivu-select-selection {
  /*height: 120px;*/
}
.loading:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis 2s infinite;
  -moz-animation: ellipsis 2s infinite;
  animation: ellipsis 2s infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
}

@-webkit-keyframes ellipsis {
  from {
    width: 2px;
  }
  to {
    width: 15px;
  }
}
.tt {
  margin-right: 6px;
}
</style>
