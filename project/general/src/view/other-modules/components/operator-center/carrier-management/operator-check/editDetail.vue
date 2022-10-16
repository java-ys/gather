<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="800px"
    :z-index="1"
    :mask-closable="false"
  >
    <Form
      ref="form"
      inline="inline"
      :model="formData"
      :label-width="140"
      :rules="formValidate"
    >
      <FormItem label="任务类型:" prop="taskType">
        <Select
          v-model="formData.taskType"
          clearable
          style="width:300px"
          :disabled="flag !== 1"
          @on-change="changeTaskType"
        >
          <Option v-for="(task,key) in taskList" :key="key" :value="key">{{task}}</Option>
        </Select>
      </FormItem>
      <FormItem label="任务分类:" prop="taskClassify">
        <Select
          v-model="formData.taskClassify"
          clearable
          style="width:300px"
          :disabled="flag !== 1"
        >
          <Option v-for="(task,key) in TASK_CLASSIFY_MAP" :key="key" :value="key">{{task}}</Option>
        </Select>
      </FormItem>

      <FormItem label="任务名称:" prop="taskName">
        <Input
          v-model="formData.taskName"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入"
          :maxlength="24"
          :disabled="flag !== 1"
        />
      </FormItem>
      <br />
      <FormItem label="任务执行范围" prop="targetType">
        <Select
          v-model="formData.targetType"
          clearable
          style="width:300px"
          :disabled="flag !== 1"
          @on-change="changeTarget"
        >
          <!--          <Option :value="3">全部</Option>-->
          <Option :value="3">指定城市</Option>
          <Option :value="2">指定司机</Option>
          <Option :value="1">指定运营商</Option>
        </Select>
      </FormItem>
      <br />
      <FormItem v-if="formData.targetType === 3" label="城市：" prop="cityList">
        <Select
          v-model="formData.cityList"
          multiple
          labelInValue
          filterable
          clearable
          style="width:300px"
          :disabled="flag !== 1"
          @on-change="getCityChange"
        >
          <Option label="全部" :value="'all'">全部</Option>
          <Option
            v-for="value in cityList"
            :key="value.cityID"
            :value="value.cityID"
            :disabled="selectedAll"
            :label="value.city"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem v-if="formData.targetType === 1" label="运营商" prop="opGroup">
        <TreeInput
          v-if="flag === 1"
          ref="treeInput"
          :TreeData="opGroup"
          :isTreeData="true"
          @on-change="changeTree"
        ></TreeInput>
        <div
          v-if="flag !== 1"
          class="dropShower display-mode"
          style="width: 300px; height: 67px"
        >
          <ul>
            <li v-for="(item, index) in agentsNameArr" :key="index">
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div>
      </FormItem>
      <FormItem v-if="formData.targetType === 1 || formData.targetType === 3" label="司机类型:" prop="driverTypes">
        <Select
          v-model="formData.driverTypes"
          multiple
          clearable
          :disabled="flag !== 1"
          style="width:300px"
        >
          <Option v-for="(item,index) in driverTypeList" :key="index" :value="item.value">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="formData.targetType === 1 || formData.targetType === 3" label="司机ID尾号:" prop="tailNumbers">
        <Input
          v-model="formData.tailNumbers"
          clearable="clearable"
          style="width:300px"
          :disabled="flag !== 1"
          placeholder="输入司机ID尾号，多个以“,”号分隔"
        />
      </FormItem>
      <FormItem v-if="formData.targetType === 2" label="" prop="opGroup">
        <ImportFile
          v-if="flag === 1"
          :toDownTemplateUrl="downloadUrl"
          :importFileUrl="importUrl"
          :btnText="formData.importFileUrl ? '重新上传' : '导入数据'"
          @on-sure="uploadSuc"
          @on-error="uploadFail"
        ></ImportFile>
        <ExportFile
          v-if="formData.importFileName"
          :exportUrl="formData.importFileUrl"
          :exportFileName="formData.importFileName"
          :btnText="formData.importFileName"
          ajaxMethod="get"
          style="color: #2d8cf0;background-color: #fff;border: none;font-size:13px;margin-left:-10px"
        ></ExportFile>
      </FormItem>
      <FormItem label="检核部位" prop="enclosureNameList">
        <CheckboxGroup
          v-model="formData.enclosureNameList"
          :disabled="flag === 3"
          @on-change="changeCheckEnclosure"
        >
          <Checkbox
            v-for="(item, index) in formData.checkType2Arr"
            :key="index"
            :disabled="flag === 3"
            :label="index"
          >
            {{item.localtion}}
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <br />
      <div
        v-for="(item, index) in formData.checkType2Arr"
        :key="'checkType2Arr' + index"
      >
        <FormItem
          v-if="item.isChecked && index < 6"
          :label="item.localtion"
          prop="picUrl"
        >
          <img-upload
            :isDetail="flag === 3"
            :defaultImg="item.fileUrl"
            :action="actionUrl"
            :params="{ imgType: 1 }"
            :format="['jpg', 'png', 'gif']"
            :maxSize="5120"
            :maxM="5"
            @on-change="getImgUrl($event, index)"
          ></img-upload>
        </FormItem>
      </div>
      <div
        v-for="(item, index) in formData.checkType4Arr"
        v-if="formData.checkType2Arr[6].isChecked"
        :key="'checkType4Arr' + index"
      >
        <FormItem :label="'自定义检核部位' + (index + 1)" prop="picUrl">
          <div style="display:flex">
            <Input
              v-model="item.localtion"
              :disabled="flag === 3"
              clearable="clearable"
              style="width:200px"
              :maxlength="12"
            />
            <uploadImgVideo
              :uploadtitle="
                item.uploadImgVideoTitle ? item.uploadImgVideoTitle : '上传示例'
              "
              :format="['jpg', 'png', 'gif', 'mp4', 'avi', 'rmvb', 'mpeg']"
              :defaultUrl="item.fileUrl"
              :maxImgSize="5120"
              :maxVideoSize="20480"
              :isShowUpload="flag != 3"
              style="margin-left:10px"
              @uploadSuccess="uploadImgVideoSuccess($event, index)"
            >
            </uploadImgVideo>
            <Icon
              v-if="formData.checkType4Arr.length > 1 && flag != 3"
              type="ios-remove-circle-outline"
              size="30"
              style="cursor: pointer"
              color="red"
              @click="deleteMine(index)"
            />
            <Icon
              v-if="index === formData.checkType4Arr.length - 1 && flag != 3"
              type="ios-add-circle-outline"
              size="30"
              style="cursor: pointer;margin-left:15px"
              color="blue"
              @click="addMine"
            />
          </div>
        </FormItem>
      </div>
      <br />
      <FormItem label="任务日期范围:" prop="checkDate">
        <DatePicker
          v-model="formData.checkDate"
          type="daterange"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择"
          style="width: 300px"
          :disabled="flag === 3"
          :options="options"
        ></DatePicker>
      </FormItem>
      <br />
      <FormItem label="司机端接收时间:" prop="receiveDate">
        <TimePicker
          v-model="formData.receiveDate"
          confirm
          type="time"
          placement="bottom-end"
          :disabled-hours="[0,1]"
          placeholder="请选择"
          style="width: 200px"
          :disabled="flag === 3"
        ></TimePicker>
      </FormItem>
      <br />
      <FormItem label="任务排重期:" prop="repeatDur">
        <Input
          v-model="formData.repeatDur"
          clearable="clearable"
          style="width:200px"
          placeholder="此天数内相同任务不重复下发"
          :maxlength="24"
          :disabled="flag !== 1"
        />
        <span>天</span>
      </FormItem>
      <br />
      <FormItem v-if="formData.taskType === '0'" label="任务频率:" prop="taskFrequency" :required="formData.taskType === '0'">
        <RadioGroup v-model="formData.taskFrequency">
          <Radio label="0" :disabled="flag === 3">
            <span>每天</span>
          </Radio>
          <Radio label="1" :disabled="flag === 3">
            <span>日期范围内一次</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />
      <FormItem label="关联上线:" prop="onlineRelation">
        <RadioGroup v-model="formData.onlineRelation">
          <Radio :label="1" :disabled="flag === 3">
            <span>是</span>
          </Radio>
          <Radio :label="0" :disabled="flag === 3">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />

      <FormItem v-if="formData.taskType === '0'" label="是否转工单:" prop="workOrderType">
        <RadioGroup v-model="formData.workOrderType">
          <Radio :label="1" :disabled="flag === 3">
            <span>是</span>
          </Radio>
          <Radio :label="0" :disabled="flag === 3">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />

      <FormItem label="是否需要运营商审核:" prop="needAgentAduit">
        <RadioGroup v-model="formData.needAgentAduit">
          <Radio :label="1" :disabled="flag === 3">
            <span>是</span>
          </Radio>
          <Radio :label="0" :disabled="flag === 3">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />
      <FormItem v-if="formData.taskType === '0'" label="违规级别设置" prop="violationLevel" :required="formData.taskType === '0'">
        <CheckboxGroup v-model="formData.violationLevel">
          <Checkbox :label="1" :disabled="flag !== 1">轻微</Checkbox>
          <Checkbox :label="2" :disabled="flag !== 1">一般</Checkbox>
          <Checkbox :label="3" :disabled="flag !== 1">严重</Checkbox>
          <Checkbox :label="4" :disabled="flag !== 1">特大</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <br />
      <FormItem v-if="formData.taskType === '0'" label="上传检核标准:" prop="uploadCheckStandard" :required="false">
        <RadioGroup v-model="formData.uploadCheckStandard">
          <Radio :label="1" :disabled="flag !== 1">
            <span>是</span>
          </Radio>
          <Radio :label="2" :disabled="flag !== 1">
            <span>否</span>
          </Radio>
        </RadioGroup>
        <uploadfile
          v-if="formData.uploadCheckStandard === 1 && flag === 1"
          type="primary"
          :showUpload="false"
          :uploadtitle="formData.standardFileUrl ? '重新上传' : '导入数据'"
          @uploadSuccess="standardSuc"
        ></uploadfile>
        <br />
        <ExportFile
          v-if="formData.standardFileName"
          :exportUrl="formData.standardFileUrl"
          :exportFileName="formData.standardFileName"
          :btnText="formData.standardFileName"
          ajaxMethod="get"
          style="color: #2d8cf0;background-color: #fff;border: none;font-size:13px;margin-left:-10px"
        ></ExportFile>
      </FormItem>
    </Form>
    <div v-if="flag === 3" slot="footer">
      <Button type="primary" @click="showModal = false">关闭</Button>
    </div>
    <div v-else slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button v-lazy-click="saveData" type="primary" :loading="loading">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { addCheckTask, editCheckTask } from "_o/api/operator-check";
import TreeInput from "_a/treeInput/treeInput.vue";
import { getCityOperatorTree } from "_g/api/common.js";
import uploadfile from "./components/uploadfile.vue";
import { formValidate, TASK_TYPE_ADD_MAP, TASK_TYPE_MAP, TASK_CLASSIFY_MAP, driverTypeList } from "./fields";
import uploadImgVideo from "./components/upload-img-video/index.vue";
import imgUpload from "./components/uploadImage.vue";
import ExportFile from "./components/exportFile.vue";
import ImportFile from "./components/importFile.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "operator-check-add",
  components: {
    imgUpload,
    TreeInput,
    ImportFile,
    uploadfile,
    ExportFile,
    uploadImgVideo
  },
  data() {
    // let self = this;
    return {
      showModal: false,
      // isOrder: 0,
      title: "",
      opGroup: [],
      targetGroup: [],
      targetGroup2: [],
      actionUrl: this._baseUrl + "/common/uploadFile",
      downloadUrl: "/download/driver_check_task.xlsx",
      importUrl: "/admin/sysAgent/checkTaskManager/batchUploadDriverExcel",
      uploadImgVideoTitle: "",
      flag: "",
      uuid: "",
      formData: {

      },
      agentsNameArr: [],
      loading: false,
      options: {
        disabledDate(date) {
          return (
            (date && date.valueOf() < Date.now() - 86400000) || (date && date.valueOf() < Date.now()) ||
            (date && date.valueOf() > Date.now() + 2678400000)
          );
        }
      },
      formValidate,
      driverTypeList,
      TASK_CLASSIFY_MAP,
    };
  },
  computed: {
    selectedAll() {
      if (this.formData.cityList && this.formData.cityList.length > 0) { return this.formData.cityList.some(item => item === "all") }
    },
    ...mapState({
      cityList: (state) => state.common.cityList || [],
    }),
    taskList() {
      if (this.flag === 3) {
        return TASK_TYPE_MAP
      }
      return TASK_TYPE_ADD_MAP
    }
  },

  mounted() {
    if (!this.cityList || !this.cityList.length) {
      this.getCityList();
    }

    this.getOperatorsList();
  },
  methods: {
    ...mapActions(["getCityList"]),

    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.flag = val.flag;
      let checkType2Arr = [
        {
          localtion: "半身照(含工服)",
          isChecked: false,
          flagIndex: 0,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "车辆右前45°",
          isChecked: false,
          flagIndex: 1,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "车辆左前45°",
          isChecked: false,
          flagIndex: 2,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "后备箱(打开状态)",
          isChecked: false,
          flagIndex: 3,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "前排副驾驶座位(车门打开)",
          isChecked: false,
          flagIndex: 4,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "后排座位(车门打开)",
          isChecked: false,
          flagIndex: 5,
          checkType: 2,
          fileType: 1
        },
        {
          localtion: "自定义",
          isChecked: false,
          flagIndex: 6,
          checkType: 2,
          fileType: 1
        }
      ];
      let checkType4Arr = [
        {
          localtion: "",
          fileType: 1,
          checkType: 4
        }
      ];
      // 新增
      if (this.flag === 1) {
        this.title = "新建检核任务";
        this.formData = {
          taskType: "",
          taskName: "",
          targetType: "",
          taskFrequency: "",
          target: [],
          checkType2Arr: checkType2Arr,
          checkType4Arr: checkType4Arr,
          enclosureNameList: [],
          checkDate: "",
          receiveDate: "",
          onlineRelation: "",
          workOrderType: 0,
          violationLevel: [1, 2, 3, 4],
          uploadCheckStandard: null, // 是否上传检核标准
          standardFileUrl: "", // 是否有检核标准附件
          cityList: [],
          cityCodes: [], // 城市uuid提交数据
          taskClassify: "",
          repeatDur: "",
          needAgentAduit: "",
          tailNumbers: "",
          driverTypes: [],
          agents: "",
        }
      }
      // 编辑
      else {
        if (this.flag === 2) {
          this.title = "编辑检核任务";
        }
        if (this.flag === 3) {
          this.title = "详情";
        }
        let valData = JSON.parse(JSON.stringify(val));
        this.formData.cityList = []
        if (valData.cityCodes && valData.cityCodes.length > 0) {
          this.formData.cityList = valData.cityCodes
        } else {
          this.formData.cityList.push("all");
        }

        this.uuid = valData.taskUuid;

        this.formData = {
          taskType: String(valData.taskType),
          taskName: valData.taskName,
          targetType: valData.targetType,
          taskFrequency: String(valData.taskFrequency),
          agents: valData.agents,
          checkType2Arr: checkType2Arr,
          checkType4Arr: checkType4Arr,
          checkDate: [valData.checkDateStart, valData.checkDateEnd],
          receiveDate: valData.receiveDate,
          onlineRelation: valData.onlineRelation,
          workOrderType: valData.workOrderType,
          violationLevel: String(valData.violationLevel).split(","),
          uploadCheckStandard: valData.uploadCheckStandard,
          enclosureNameList: [],
          cityCodes: valData.cityCodes,
          driverTypes: valData.driverTypes.map(item => { return Number(item) }),
          taskClassify: String(valData.taskClassify),
          repeatDur: String(valData.repeatDur),
          needAgentAduit: valData.needAgentAduit,
          tailNumbers: valData.tailNumbers,
          cityList: this.formData.cityList,
        };
        console.log(this.formData)
        // 处理运营商列表显示
        if (valData.targetType === 1) {
          let agentsArr = JSON.parse(JSON.stringify(valData.agents));
          agentsArr = agentsArr.split(",");
          let agentsNameArr = [];
          agentsArr.forEach(item => {
            this.opGroup.forEach(yItem => {
              yItem.children.forEach(zItem => {
                // eslint-disable-next-line max-nested-callbacks
                zItem.children.forEach(hItem => {
                  if (item === hItem.uuid) {
                    agentsNameArr.push(hItem);
                  }
                });
              });
            });
          });
          this.agentsNameArr = agentsNameArr;
        }
        // 处理司机附件
        if (valData.targetType === 2) {
          this.formData.importFileName = valData.importFileName;
          this.formData.importFileUrl = valData.importFileUrl;
        }
        // 处理违规级别设置
        this.formData.violationLevel = this.formData.violationLevel.map(item => {
          return Number(item);
        });
        // 处理上传检核标准附件
        if (valData.uploadCheckStandard === 1) {
          valData.enclosureVoList.forEach(item => {
            if (item.checkType === 3) {
              this.formData.standardFileUrl = item.fileUrl;
              this.formData.standardFileName = item.fileName;
            }
          });
        }
        // 处理检核部位
        // 自定义数据获取
        let enclosureVoList4Arr = valData.enclosureVoList.filter(item => {
          item.uploadImgVideoTitle = "重新上传";
          return item.checkType === 4;
        });

        // 固定部分数据获取
        let enclosureVoList2Arr = valData.enclosureVoList.filter(item => {
          return item.checkType === 2;
        });
        // 设置选中状态
        this.formData.checkType2Arr = this.formData.checkType2Arr.map(item => {
          // let backItem = item;
          enclosureVoList2Arr.forEach(yItem => {
            if (item.localtion === yItem.localtion) {
              this.formData.enclosureNameList.push(item.flagIndex);
              item.fileUrl = yItem.fileUrl;
              item.isChecked = true;
            }
          });
          return item;
        });
        // 当自定义有数据时
        if (enclosureVoList4Arr.length > 0) {
          this.formData.checkType4Arr = enclosureVoList4Arr;
          this.formData.checkType2Arr[6].isChecked = true;
          this.formData.enclosureNameList.push(6);
        }

        // debugger
        console.log(this.formData.taskType)

        // if (this.formData.taskType === "1") {
        //   this.isOrder = 1

        // } else if (this.formData.taskType === "0") {
        //   this.isOrder = 0

        // }
      }
    },
    getCityChange(cityItem, init) {
      this.formData.cityList = [];
      let hasAll = cityItem.some(item => item.value === "all")
      if (hasAll) {
        this.formData.cityList = [];
        this.formData.cityList.push("all");
        this.formData.cityCodes = []
      } else {
        Array.prototype.push.apply(this.formData.cityList, cityItem.map(item => item.value));
        this.formData.cityCodes = this.formData.cityList;
      }

    },
    getImgUrl(val, index) {
      if (!val) {
        this.formData.checkType2Arr[index].fileUrl = "";
      } else {
        this.formData.checkType2Arr[index].fileUrl = val.data.fileUrl;
      }
      this.formData.checkType2Arr = JSON.parse(JSON.stringify(this.formData.checkType2Arr));
    },
    // 文件/视频上传成功
    uploadImgVideoSuccess(val, index) {
      if (!val) {
        this.formData.checkType4Arr[index].fileUrl = "";
      } else {
        this.formData.checkType4Arr[index].uploadImgVideoTitle = "重新上传";
        this.formData.checkType4Arr[index].fileUrl = val.fileUrl;
        this.formData.checkType4Arr[index].fileType = val.fileType;
      }
      this.formData.checkType4Arr = JSON.parse(JSON.stringify(this.formData.checkType4Arr));
    },
    addMine() {
      this.formData.checkType4Arr.push({
        localtion: "",
        checkType: 4,
        fileType: 1
      });
      this.formData.checkType4Arr = JSON.parse(JSON.stringify(this.formData.checkType4Arr));
    },
    deleteMine(val) {
      this.formData.checkType4Arr.splice(val, 1);
    },
    saveData() {
      // return;
      if (this.flag === 3) {
        this.showModal = false;
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },

    submit() {
      if (this.formData.targetType === 1 && !this.formData.agents) {
        this.$Message.warning("请选择运营商!");
        return;
      }
      if (this.formData.targetType === 2 && !this.formData.agents) {
        this.$Message.warning("请上传司机信息!");
        return;
      }
      if (
        this.formData.taskType === "0" &&
        this.formData.uploadCheckStandard === 1 &&
        !this.formData.standardFileUrl
      ) {
        this.$Message.warning("请上传检核标准附件!");
        return;
      }
      let flagOhter = false;
      this.formData.checkType4Arr.forEach(item => {
        if (!item.localtion && this.formData.checkType2Arr[6].isChecked) {
          flagOhter = true;
        }
      });
      if (flagOhter) {
        this.$Message.warning("自定义检核名称不能为空!");
        return;
      }
      if (this.formData.tailNumbers && this.isRepeat(this.formData.tailNumbers)) {
        this.$Message.warning("司机ID尾号不能重复!");
        return;
      }
      let params = {
        targetType: this.formData.targetType,
        agents: this.formData.agents,
        checkDateStart: this.formData.checkDate[0],
        checkDateEnd: this.formData.checkDate[1],
        enclosureList: [],
        onlineRelation: this.formData.onlineRelation,
        workOrderType: this.formData.workOrderType,
        receiveDate: this.formData.receiveDate,
        taskType: this.formData.taskType,
        taskName: this.formData.taskName,
        // uploadCheckStandard: this.formData.uploadCheckStandard,
        // violationLevel: this.formData.violationLevel.join(),
        cityCodes: this.formData.cityCodes,
        taskClassify: this.formData.taskClassify,
        repeatDur: this.formData.repeatDur,
        needAgentAduit: this.formData.needAgentAduit,
        tailNumbers: this.formData.tailNumbers,
        driverTypes: this.formData.driverTypes,
      };
      if (params.taskType === "0") {
        params.uploadCheckStandard = this.formData.uploadCheckStandard;
        params.violationLevel = this.formData.violationLevel.join();
        params.taskFrequency = this.formData.taskFrequency;
      }
      // if (params.taskType === "1") {
      //   params.taskFrequency = this.formData.taskFrequency;
      // }
      // 检核部位
      this.formData.checkType2Arr.forEach(item => {
        if (item.isChecked && item.localtion !== "自定义") {
          params.enclosureList.push(item);
        }
      });
      this.formData.checkType4Arr.forEach(item => {
        if (item.localtion && this.formData.checkType2Arr[6].isChecked) {
          params.enclosureList.push(item);
        }
      });
      // 检核标准
      if (this.formData.uploadCheckStandard === 1) {
        params.enclosureList.push({
          checkType: 3,
          fileType: 3,
          fileUrl: this.formData.standardFileUrl,
          fileName: this.formData.standardFileName
        });
      }
      this.loading = true
      if (this.flag === 1) {
        if (this.formData.targetType === 2) {
          params.excelDriverInfoList = this.formData.excelDriverInfoList; // 指定司机附件
          params.importFileUrl = this.formData.importFileUrl; // 指定司机附件
          params.importFileName = this.formData.importFileName; // 指定司机附件
        }
        addCheckTask(params).then(res => {
          this.loading = false
          this.showModal = false;
          this.$emit("reload");
        }).catch(error => {
          this.loading = false
        });
      }
      if (this.flag === 2) {
        params.taskUuid = this.uuid;
        editCheckTask(params).then(res => {
          this.loading = false
          this.showModal = false;
          this.$emit("reload");
        }).catch(error => {
          this.loading = false
        });
      }
    },
    // 获取运营商列表
    getOperatorsList() {
      getCityOperatorTree().then(res => {
        let oriData = res.data.data;
        // changeKeyMethod(oriData);
        // changeKeyMethod(oriData, "uuid", "value");
        this.opGroup = oriData;
      });
    },
    changeTree(val) {
      if (!val) return;
      this.$refs.treeInput.selectItems = this.$refs.treeInput.selectItems.filter(item => {
        return !item.children;
      });
      this.formData.agents = val.filter(item => {
        return item.length > 10;
      });
      this.formData.agents = this.formData.agents.join();
    },
    changeTaskType(val) {
      console.log(val)
      // if (val === "1") {
      //   this.isOrder = 1
      // } else {
      //   this.isOrder = 0
      // }
    },
    changeTarget(val) {
      if (!val) return;
      this.formData.agents = "";
      this.formData.excelDriverInfoList = [];
    },
    changeCheckEnclosure(val) {
      this.formData.checkType2Arr = this.formData.checkType2Arr.map(item => {
        item.isChecked = false;
        val.forEach(yItem => {
          if (item.flagIndex === yItem) {
            item.isChecked = true;
          }
        });
        return item;
      });
    },
    // 图片上传成功
    uploadSuc(res) {
      this.formData.importFileUrl = res.data.importFileUrl;
      this.formData.importFileName = res.data.importFileName;
      this.formData.excelDriverInfoList = res.data.excelDriverInfoVoList;
      this.formData.agents = res.data.agents;
      this.$forceUpdate();
    },

    uploadFail(res) {
      this.formData.importFileUrl = "";
      this.$forceUpdate();
    },
    standardSuc(res) {
      this.formData.standardFileUrl = res.fileUrl;
      this.formData.standardFileName = res.fileName.substring(8);
    },
    getFileUrl(val, index) {
      if (!val) {
        this.formData.enclosureList[index].fileUrl = "";
      } else {
        this.formData.enclosureList[index].fileUrl = val.fileUrl;
      }
      this.formData = JSON.parse(JSON.stringify(this.formData));
      // this.formData.standardFileUrl = res.fileUrl;
    },
    isRepeat(tailNumbers) {
      let arr = tailNumbers.split(",")
      let nary = arr.sort();
      for (let i = 0; i < arr.length; i++) {
        if (nary[i] === nary[i + 1]) {
          return true
        }
      }
      return false
    }
  }
};
</script>
<style lang="less" scoped>
.dropShower {
  cursor: pointer;
  min-height: 32px;
  max-height: 67px;
  display: inline-block;
  overflow: scroll;
  line-height: 1.5;
  padding: 3px 4px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
  box-shadow 0.2s ease-in-out;

  ul li {
    height: 24px;
    line-height: 22px;
    margin: 3px 4px 3px 0;
    display: inline-block;
    padding: 0 8px;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    cursor: pointer;

    span {
      color: #515a6e;
    }

    i {
      font-size: 16px;
    }
  }
}

.display-mode {
  border: none;
  overflow: unset;
  cursor: text;
  padding: 0;
}
</style>
