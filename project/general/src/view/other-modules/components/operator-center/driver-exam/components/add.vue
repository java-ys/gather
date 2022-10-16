<template>
  <div>
    <Modal v-model="show" width="80%" :title="title" :mask-closable="false" @on-cancel="cancel">
      <Form :model="formData" :rules="formValidate" ref="_form" label-position="top">
        <FormItem label="考试任务名称：" prop="examTaskName">
          <Input
            class="item-style"
            v-model="formData.examTaskName"
            :maxlength="50"
            :disabled="isDetail"
            placeholder="请输入考试任务名称"
          />
        </FormItem>
        <FormItem label="主题图：" prop="pictureUrl">
          <img-upload
            :is-detail="isDetail"
            :defaultImg="formData.pictureUrl"
            :headerParams="qrcodeHeaderParams"
            :action="actionUrl"
            :params="{  }"
            :width="110"
            :height="120"
            :format="['jpg', 'png']"
            @on-change="getImgUrl"
          ></img-upload>
        </FormItem>

        <section class="form-inline-group">
          <FormItem label="上线时间：" prop="publishTime">
            <DatePicker
              v-model="formData.publishTime"
              type="datetime"
              :editable="false"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择上线时间"
              class="item-style"
              :disabled="isDetail"
              :options="options"
              :time-picker-options="timePickerOptions"
              @on-change="(v) => getTimeForKey(v, 'publishTime')"
              @on-ok="() => handleOk('publishTime')"
            ></DatePicker>
          </FormItem>
          <FormItem label="下线时间：" prop="offTime">
            <DatePicker
              v-model="formData.offTime"
              type="datetime"
              :editable="false"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择下线时间"
              class="item-style"
              :disabled="isDetail"
              :options="options"
              :time-picker-options="timePickerOptions"
              @on-change="(v) => getTimeForKey(v, 'offTime')"
              @on-ok="() => handleOk('offTime')"
            ></DatePicker>
          </FormItem>
        </section>
        <!--</Form>-->
        <FormItem label="及格题数：" prop="passNumber">
          <Input
            v-model="formData.passNumber"
            class="item-style"
            :disabled="isDetail"
            :maxlength="200"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="不及格是否影响上线：" prop="onlineStatus">
          <div class="mb-20">
            <RadioGroup v-model="formData.onlineStatus">
              <Radio label="1" :disabled="isDetail">是</Radio>
              <Radio label="2" :disabled="isDetail">否</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="考试对象：" required>
          <div>
            <RadioGroup v-model="formData.examObject">
              <Radio label="0" :disabled="isDetail">指定司机</Radio>
              <Radio label="2" :disabled="isDetail">按条件选取</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem prop="person" v-if="isDriver">
          <Input type="textarea" v-model="formData.person" :disabled="isDetail" placeholder="可只输入司机code, 英文逗号隔开"/>
          <div v-if="!isDetail">
            <import-file
              btnText="批量导入司机code"
              baseUrlName="_base4Driver"
              otherMsg="最多导入5000条数据"
              successMsg="导入成功！已将数据添加至输入框"
              size="small"
              :importFileUrl="uploadUrl"
              :toDownTemplateUrl="templateUrl"
              :data="{}"
              @on-success="getUpFile"
            ></import-file>
          </div>
        </FormItem>

        <section v-if="!isDriver" class="form-group">
          <div style="width: 100%">
            <Row>
              <Col span="8">
                <FormItem label="选择城市">
                  <Select
                    v-model="formData.conditionCityCode"
                    :disabled="isDetail"
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
                    :disabled="isDetail"
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
                    :disabled="isDetail"
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
                    :disabled="isDetail"
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
                    :disabled="isDetail"
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

        <br />

        <section class="form-inline-group">
          <FormItem
            label="考试时间:"
            style="width: 50%"
            prop="timeLimit"
            class="tit"
          >
            <p>
              <InputNumber
                v-model="formData.timeLimit"
                :precision="0"
                :min="1"
                style="width: 140px"
                :disabled="isDetail"
                placeholder="请输入正整数分钟数"
              >
              </InputNumber>
              分钟
              <span style="color: red;">默认30分钟时间,可修改</span>
            </p>
          </FormItem>

          <FormItem
            label="关联学习任务:"
            style="width: 50%"
            prop="studyTaskId"
            class="tit"
          >
            <p>
              <Select
                v-model="formData.studyTaskId"
                :disabled="isDetail"
                placeholder="请选择"
              >
                <Option
                  v-for="(item, index) in studyTaskList"
                  :value="item.id"
                  :key="index"
                >{{ item.learningTaskName }}</Option>
              </Select>
            </p>
          </FormItem>
        </section>

        <br />

        <FormItem label="试题：" required>
          <div class="add-but" v-if="!isDetail">
            <Button type="primary" @click="addTopic">添加试题</Button>
            <Button type="primary" @click="deleteTopic" class="ml-20">删除试题</Button>
          </div>
          <div class="area-style mt-20">
            <m2-table
              ref="selection"
              class="mt-20"
              :total="total"
              :current="current"
              :pageSize="pageSize"
              :isLoading="isLoading"
              :parColumns="!isDetail ? tableColumns : tableColumns.slice(1)"
              :parTableData="selectedQuestions.list"
              :isShowPage="false"
              @on-select="onSelect"
              @select-cancel="selectCancel"
              @select-all="selectAll"
              @select-all-cancel="selectAllCancel"
            ></m2-table>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <template v-if="!isDetail">
          <Button @click="cancel">取消</Button>
          <Button type="primary" v-lazy-click="save">确定</Button>
        </template>
        <Button v-if="isDetail" @click="cancel">确定</Button>
      </div>
    </Modal>
    <!-- 选择题目 -->
    <select-topic :visible="topicSelect" @close="closeTopic" :selectedQuestions="selectedQuestions"></select-topic>
  </div>
</template>

<script>
  import imgUpload from "../common-img-upload";
  import { timeFormat } from "@/libs/util";
  import { tool, isFunc, pick, getObjKeys } from "_o/api/baseMixin.js";
  import { getAgentByCity } from "_g/api/configData";
  import s from "_o/api/study-exam";
  import { queryDriverManagerUser } from "_o/api/m2-driver-api/common"
  import selectTopic from "./select-topic";
  import m2Table from "_a/m2-table/v-table";
  import common, { getImageUrl, numToArray } from "../common";
  import importFile from "_a/import-file/index.vue";
  import { selectTitle, driverType, driverModel } from "../fields";
  import { SelectedQuestions } from "./store";

  const titleList = ["新建考试任务", "编辑考试任务", "详情"];
  const templateUrl = "/downloadExcel/批量导入司机code.xlsx";
  const uploadUrl = "/api/exam/task/importDriverNo";

  const formParams = {
    examTaskName: "", // 考试任务名
    pictureUrl: "", // 主题图url
    pictureUuid: "", // 主题图uuid
    pictureName: "", // 主题图名称
    passNumber: "", // 及格题数
    onlineStatus: "2", // 1 是 2 否  是否影响司机上线
    examObject: "2",
    person: "", // 司机code
    agentUuid: [], // 运营商列表
    conditionDriverManagerId: "",
    conditionDriverOperationType: "", // 司机模式
    conditionDriverType: "", // 司机类型
    timeLimit: 30,
    studyTaskId: 0,
  };

  const formValidate = (that) => {
    return {
      studyTaskId: [{ required: false, message: "关联学习任务不能为空" }],
      timeLimit: [{ required: true, message: "请输入大于0的整数" }],
      conditionDriverType: [{ required: false, message: "司机类型不能为空" }],
      conditionDriverManagerId: [{ required: false, message: "司管不能为空" }],
      conditionDriverOperationType: [{ required: false, message: "司机模式不能为空" }],
      examTaskName: [{ required: true, message: "考试任务名称不能为空" }],
      publishTime: [{ required: true, message: "请选择上线时间" }],
      offTime: [{ required: true, message: "请选择下线时间" }],
      person: [{ required: true, message: "请选择考试对象", trigger: "blur" }],
      agentUuid: [
        {
          required: true,
          // message: "请选择运营商",
          trigger: "change",
          validator: (rule, value, callback) => {
            if (that.formData.agentUuid.length) {
              callback();
            } else {
              callback(new Error("请选择运营商"));
            }
          },
        },
      ],
      passNumber: [{ required: true, message: "请输入及格题数" }],
      onlineStatus: [{ required: true, message: "请选择" }],
      pictureUrl: [
        {
          required: true,
          message: "请上传主题图片",
          trigger: "change",
        },
      ],
    };
  };

  export default {
    props: {
      visible: Boolean,
      modalData: Object,
      isDetail: {
        type: Boolean,
        default: false
      },
    },
    components: {
      imgUpload,
      selectTopic,
      m2Table,
      importFile,
    },
    mixins: [tool, common],
    data() {
      return {
        options: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          },
        },
        selectedQuestions: new SelectedQuestions([]),
        // disabledHours: [1, 2]
        timePickerOptions: {},
        templateUrl,
        uploadUrl,
        topicSelect: false,
        agentList: [], // 运营商列表
        cityAgentList: [], // 市二级联动运营商选项
        selection: [],
        tableColumns: selectTitle(this),
        title: titleList[0],
        actionUrl: this._uploadUrl + "/file/upload/public", // 公共文件上传服务
        formValidate: formValidate(this),
        formData: this.deepCopy({}, formParams),
        show: this.visible,
        qrcodeHeaderParams: {},
        picHeaderParams: {},
        selectedDeleteIds: new Set(),
        idsList: [],
        dataList: [],
        cityList: [],
        studyTaskList: [],
        driverManagerList: [],
        driverType,
        driverModel,
      };
    },
    watch: {
      async visible() {
        this.show = this.visible;
        if (this.show) {
          // 编辑前获取开通详情
          if (this.isEdit) {
            this.title = !this.isDetail ? titleList[1] : titleList[2];
            this.getDetail();
            this.getTaskTopicList();
          }
          await this.getAgentList();
          await this.getStudyTaskList()
        } else {
          this.initData();
        }
      },
      // 切换考试对象, 清空校验
      "formData.examObject": {
        handler(v) {
          this.resetFieldByProp(v - 0 === 0 ? "agentUuid" : "person");
        },
      },
    },
    computed: {
      isDriver() {
        return Number(this.formData.examObject) === 0
      },
      isEdit() {
        return this.modalData && this.modalData.id;
      },
    },
    methods: {
      // 编辑时回填数据
      getDetail: async function () {
        const { id } = this.modalData;
        if (!id) return;
        const [err, data] = await this.toResult(s.taskDetail({ id }));
        if (err) {
          return;
        }
        if (data) {
          const {
            examTaskName,
            onlineStatus,
            passNumber,
            publishTime,
            themeFileName,
            themeFileUuid,
            driverNoList,
            agentIdList,
            conditionCityCode, // 城市
            conditionAgentId, // 运营商
            conditionDriverManagerId,
            conditionDriverOperationType,
            conditionDriverType,
            offTime,
            studyTaskId,
            timeLimit,
            matchType,
          } = data;
          // 根据城市code 获取对应运营商
          if(conditionCityCode) {
            this.cityChange(conditionCityCode);
            if(conditionAgentId) { // 运营商uuid获取司管列表
              this._getDriverManagerUser(conditionAgentId)
            }
          }

          this.formData.examObject = String(matchType);
          this.formData.studyTaskId = studyTaskId;
          this.formData.conditionCityCode = conditionCityCode;
          this.formData.conditionAgentId = conditionAgentId;
          this.formData.timeLimit = timeLimit;
          this.formData.conditionDriverManagerId = conditionDriverManagerId;
          this.formData.conditionDriverOperationType = conditionDriverOperationType;
          this.formData.conditionDriverType = conditionDriverType;
          this.formData.examTaskName = examTaskName;
          this.formData.pictureName = themeFileName;
          this.formData.pictureUuid = themeFileUuid;
          this.formData.publishTime = new Date(publishTime);
          this.formData.offTime = new Date(offTime);
          this.formData.passNumber = passNumber;
          this.formData.onlineStatus = onlineStatus + "";
          if (driverNoList && driverNoList.length) {
            this.formData.person = driverNoList.join(",");
            // this.formData.examObject = "1";
          }
          // if (agentIdList && agentIdList.length) {
          //   this.formData.agentUuid = agentIdList;
            // this.formData.examObject = "2";
          // }
          this.fetchImage({ uuid: themeFileUuid });
        }
      },
      fetchImage(p) {
        getImageUrl({ baseUrl: this._uploadUrl, ...p }, ({ data }) => {
          if (data.success) {
            this.formData.pictureUrl = data.data;
          } else {
            this.$Message.error(data.msg);
          }
        });
      },
      async getStudyTaskList() {
        const { id } = this.modalData || {};
        const [err, data] = await this.toResult(s.studyQueryStudyTaskList({ id }));
        if (err) { return }
        this.studyTaskList = [ { learningTaskName: '不关联', id: 0 }, ...data ]
      },
      getTaskTopicList() {
        this.func = s.taskQueryExamQuestions;
        this.extraParams.id = this.modalData.id;
        this.extraParams.pageSize = 200; // 全量取题目
        this.getList(); // 执行 listSuccess
      },
      listSuccess(data) {
        this.selectedQuestions = new SelectedQuestions(data) // 生成已选择的列表
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

        // 市二级联动运营商
        // const cityAgentList = _agentList.reduce((pre, cur) => [
        //   ...pre,
        //   ...cur.children.map(child => {
        //     child.children = [ { value: "", label: "全部" }, ...child.children ]
        //     return child
        //   })
        // ], [])
        // this.cityAgentList = cityAgentList

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
      /*
        agentIdList (Array[string], optional): 运营商id集合 ,
        driverNoList (Array[string], optional): 司机id集合 ,
        examIdList (Array[integer], optional): 考试题目id集合 ,
        examTaskName (string, optional): 考试任务名称 ,
        id (integer, optional): 主键 ,
        onlineStatus (integer, optional): 不及格是否影响上线：1 是 2 否 ,
        passNumber (integer, optional): 及格题数 ,
        publishTime (string, optional): 发布时间 ,
        themeFileName (string, optional): 主题图名称 ,
        themeFileUuid (string, optional): 主题图uuid
      */
      getSaveParams() {
        const {
          examTaskName,
          publishTime,
          passNumber,
          onlineStatus,
          pictureUuid,
          pictureName,
          examObject,
          conditionDriverManagerId,
          conditionDriverOperationType,
          conditionDriverType,
          offTime,
          conditionCityCode,
          conditionAgentId,
          studyTaskId, // 关联学习任务
          timeLimit, // 考试时间
        } = this.formData;
        let examObjectParams =
          Number(examObject) === 0
            ? {
                driverNoList: this.formData.person.split(","),
                matchType: 0,
              }
            : {
              conditionCityCode: conditionCityCode || "", // 城市 id
              conditionAgentId: conditionAgentId || "", // 运营商 id
              conditionDriverManagerId, // 司管 id
              conditionDriverOperationType,
              conditionDriverType,
              matchType: 2,
            }
            // : { agentIdList: agentUuid };
        let commonParams = {
          examTaskName,
          themeFileUuid: pictureUuid,
          themeFileName: pictureName,
          publishTime: timeFormat(new Date(publishTime).getTime(), "yyyy-mm-dd"),
          offTime: timeFormat(new Date(offTime).getTime(), "yyyy-mm-dd"),
          studyTaskId,
          timeLimit,
          passNumber,
          onlineStatus,
          ...examObjectParams,
          // examIdList: topicList.map((it) => it.id),
          examIdList: this.selectedQuestions.ids(),
        };
        let params = this.isEdit
          ? {
            id: this.modalData.id,
            ...commonParams,
          }
          : commonParams;
        return params;
      },
      save() {
        this.$refs._form.validate(async (valid) => {
          if (!valid) return;
          console.log(this.getSaveParams(), "提交保存参数");
          if (!this.selectedQuestions.ids().length) return this.$Message.error('请选择试题')
          const func = this.isEdit ? s.taskEdit : s.taskAdd;
          const [err, data] = await this.toResult(func(this.getSaveParams()));
          if (err) {
            return;
          }
          this.cancel(true);
        });
      },
      getImgUrl(url, { publicUrl, fileName, uuid }) {
        this.resetFieldByProp("pictureUrl");
        this.formData.pictureUrl = publicUrl;
        this.formData.pictureUuid = uuid;
        this.formData.pictureName = fileName;
      },
      cancel(refresh = false) {
        this.$emit("close", { refresh });
      },
      initData() {
        this.selectedQuestions = new SelectedQuestions([])
        this.title = titleList[0];
        this.agentList = [];
        this.dataList = [];
        this.cityAgentList = [];
        this.timePickerOptions = {};
        this.$refs._form.resetFields();
        this.formData = this.deepCopy({}, formParams);
      },
      handleOk(key) {
        const { offTime, publishTime } = this.formData
        if (!offTime || !publishTime) return

        if (new Date(offTime) <= new Date(publishTime)) {
          this.$Message.error('下线时间必须大于上线时间')
          this.formData[key] = ''
        }

      },
      getTimeForKey(v, key) {
        let nw = +new Date();
        let nowTime = timeFormat(nw, "yyyy-mm-dd");
        const [nowYear, nowMonth, nowDay] = nowTime.split(" ")[0].split("-");
        const [nowHour, nowMinute, nowSecond] = nowTime.split(" ")[1].split(":");
        if (v && v.split(" ").length > 1) {
          // if (new Date(v) < nw) {
          //   v = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMinute}:${nowSecond}`;
          // }
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

        this.formData[key] = v;
      },
      addTopic() {
        this.truy("topicSelect");
      },
      deleteTopic() {
        let needDelItemIds = this.setToArray(this.selectedDeleteIds);
        if (!needDelItemIds.length) return this.$Message.error("请选择试题");
        needDelItemIds.forEach(id => this.selectedQuestions.delItem(id))
      },
      closeTopic(list) {
        this.selectedQuestions = new SelectedQuestions(list)
        this.falsy("topicSelect");
      },
      getUpFile({ data }) {
        if (data && data.length) {
          this.formData.person = data.join(",");
        }
      },
      setToArray(v) {
        return Array.from(v);
      },
      // 选择行
      onSelect(selection, row) {
        // console.log(selection, row, 'on-select')
        this.selectedDeleteIds.add(row.id);
      },
      //取消行
      selectCancel(selection, row) {
        // console.log(selection, row, 'on-select-cancel')
        this.selectedDeleteIds.delete(row.id);
      },
      // 全选
      selectAll(selection) {
        // console.log(selection, "on-select-all");
        if (selection && selection.length) {
          selection.forEach((item) => {
            this.selectedDeleteIds.add(item.id);
          });
        }
      },
      // 全不选
      selectAllCancel(selection) {
        // console.log(selection, "on-select-all-cancel");
        if (selection && !selection.length) {
          this.selectedDeleteIds.clear();
        }
      },
      resetFieldByProp(propName) {
        let fi = this.$refs._form.fields;
        if (!fi) return;
        let ff = fi.find((it) => it.prop === propName);
        if (ff && isFunc(ff.resetField)) {
          ff.resetField();
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  @border-color: #dcdee2;

  /deep/ .ivu-modal-body {
    padding-left: 40px;
  }

  /deep/ textarea {
    height: 120px;
    resize: none;
  }

  .form-group {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .ivu-form-item {
      width: 200px;
      margin-right: 12px;
    }
  }

  .form-inline-group {
    display: flex;
    .ivu-form-item {
      margin-right: 12px;
    }
  }

  .ml-20 {
    margin-left: 20px;
  }

  .item-style {
    width: 280px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .area-style {
    // width: 620px;
    width: 100%;
    // height: 120px;
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

  .add-but {
    position: absolute;
    right: 10px;
    top: -52px;
  }

  .export-id {
    margin-top: 10px;
  }

  .agent-select /deep/ .ivu-select-selection {
    /*height: 120px;*/
  }
</style>
