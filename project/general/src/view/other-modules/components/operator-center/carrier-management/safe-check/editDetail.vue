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
      :label-width="120"
    >



      <!-- 修改1022安全员 -->
      <FormItem label="姓名:">
        {{formData.name}}
      </FormItem>
      <br>
      <FormItem label="手机号:">
        {{formData.phone}}
      </FormItem>
      <br>
      <FormItem label="身份证号:">
        {{formData.idCard}}

      </FormItem>



      <br />
      <FormItem label="安全职业资格类型：">
        <Select
          v-model="formData.qualificationType"
          clearable
          style="width:300px"
        >
          <Option :value="'1'">注册安全工程师</Option>
          <Option :value="'2'">生产经营单位从业人员培训合格证书</Option>
          <Option :value="'3'">道路运输企业主要负责人和安全生产管理人员安全考核合格证明</Option>
          <Option :value="'99'">其他</Option>
        </Select>
      </FormItem>
      <FormItem label="证书专业类别：">
        <Select
          v-model="formData.certificationType"
          clearable
          style="width:300px"
        >
          <Option :value="'1'">企业主要负责人</Option>
          <Option :value="'2'">安全管理人员</Option>
        </Select>
      </FormItem>

      <FormItem label="证书编号:">
        <Input
          v-model="formData.certificationNum"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>
      <FormItem label="发起单位:">
        <Input
          v-model="formData.certificationUnit"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入"
          :maxlength="24"
        />
      </FormItem>


      <!--   v-model="formData.checkDate" -->
      <FormItem label="有效期起:">
        <DatePicker
          v-model="formData.validityStartTime"
          type="date"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择"
          style="width: 300px"
          @on-change="changeDateType"
        ></DatePicker>
      </FormItem>
      <FormItem label="有效期起止:">
        <DatePicker
          v-model="formData.validityEndTime"
          type="date"
          format="yyyy-MM-dd"
          placement="bottom-end"
          placeholder="请选择"
          style="width: 300px"
          @on-change="changeDateType1"
        ></DatePicker>
      </FormItem>
      <br />
      <FormItem
        label="证书图片："
        prop="picUrl"
      >
        <img-upload
          :defaultImg="picUrl"
          :action="actionUrl"
          :params="{ imgType: 2 ,path: 'safer' }"
          :format="['jpg', 'png', 'gif']"
          :maxSize="5120"
          :maxM="10"
          @on-change="getImgUrl($event)"
        ></img-upload>
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
import { addCheckTask, editCheckTask, queryCheckTaskDetail1 } from "_o/api/operator-check";
import TreeInput from "_a/treeInput/treeInput.vue";
import { getCityOperatorTree } from "_g/api/common.js";
import uploadfile from "./components/uploadfile.vue";
import { validatorTime } from "./fields";
import uploadImgVideo from "./components/upload-img-video/index.vue";
import imgUpload from "./components/uploadImage.vue";
import ExportFile from "./components/exportFile.vue";
import ImportFile from "./components/importFile.vue";
import { TASK_TYPE_MAP } from "_o/components/operator-center/carrier-management/operator-check/fields";
import moment from "moment";
import oss from "@/mixins/oss";

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
  mixins: [oss],
  data() {
    // let self = this;
    return {
      showModal: false,
      isOrder: 0,
      title: "",
      opGroup: [],
      targetGroup: [],
      targetGroup2: [],
      actionUrl: this._baseUrl + "/common/uploadImg",
      downloadUrl: "/download/driver_check_task.xlsx",
      importUrl: "/admin/sysAgent/checkTaskManager/batchUploadDriverExcel",
      uploadImgVideoTitle: "",
      flag: "",
      uuid: "",
      // 1022
      formData: {},
      temDate: "",
      temDateEnd: "",
      addPersonData: {},
      certificationImages: "",
      picUrl: "",
      picData: {},

      agentsNameArr: [],
      loading: false,
      isDate: 1,
      options: {
        disabledDate(date) {
          return (
            (date && date.valueOf() < Date.now() - 86400000) || (date && date.valueOf() < Date.now()) ||
            (date && date.valueOf() > Date.now() + 2678400000)
          );
        }
      },
      TASK_TYPE_MAP,
      formValidate: {
        taskName: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: /^[^\s]{1,50}$/,
            message: "不能输入空格且最多24位",
            trigger: "change"
          }
        ],
        taskType: [
          {
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        targetType: [
          {
            type: "number",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        // checkDate: [
        //   {
        //     required: true,
        //     validator: validatorTime
        //   }
        // ],
        // receiveDate: [
        //   {
        //     required: true,
        //     validator: validatorTime
        //   }
        // ],
        onlineRelation: [
          {
            type: "number",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        taskFrequency: [{
          validator: (rule, value, callback) => {
            if (this.formData.taskType === "0") {
              return callback();
            }
            if (!value || !value.length) {
              return callback("频率必须选择")
            }
            callback();
          }
        }],
        violationLevel: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.taskType === "1") {
                return callback();
              }
              if (!value || !value.length) {
                return callback("违规级别必须选择")
              }
              callback();
            }
            // type: "array",
            // required: true,
            // message: "必选",
            // trigger: "change"
          }
        ],
        uploadCheckStandard: [],
        enclosureNameList: [
          {
            type: "array",
            required: true,
            message: "必填",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getOperatorsList();

  },
  methods: {
    init(val) {
      this.temDate = val.temDate
      this.temDateEnd = val.temDateEnd
      this.addPersonData = val.val
      this.picUrl = val.val.picData.privateUrl
      this.picData = val.val.picData
      this.showModal = true;
      this.$refs.form.resetFields();
      this.flag = val.flag;
      let checkType2Arr = [
        {
          localtion: "证书图片",
          isChecked: false,
          flagIndex: 0,
          checkType: 2,
          fileType: 1
        },
        // {
        //   localtion: "车辆右前45°",
        //   isChecked: false,
        //   flagIndex: 1,
        //   checkType: 2,
        //   fileType: 1
        // },
        // {
        //   localtion: "车辆左前45°",
        //   isChecked: false,
        //   flagIndex: 2,
        //   checkType: 2,
        //   fileType: 1
        // },
        // {
        //   localtion: "后备箱(打开状态)",
        //   isChecked: false,
        //   flagIndex: 3,
        //   checkType: 2,
        //   fileType: 1
        // },
        // {
        //   localtion: "前排副驾驶座位(车门打开)",
        //   isChecked: false,
        //   flagIndex: 4,
        //   checkType: 2,
        //   fileType: 1
        // },
        // {
        //   localtion: "后排座位(车门打开)",
        //   isChecked: false,
        //   flagIndex: 5,
        //   checkType: 2,
        //   fileType: 1
        // },
        // {
        //   localtion: "自定义",
        //   isChecked: false,
        //   flagIndex: 6,
        //   checkType: 2,
        //   fileType: 1
        // }
      ];
      let checkType4Arr = [
        {
          localtion: "",
          fileType: 1,
          checkType: 4
        }
      ];
      // 新增
      // if (this.flag === 1) {
      //   this.title = "新建检核任务";

      //   this.formData = {
      //     taskType: "",
      //     taskName: "",
      //     targetType: "",
      //     taskFrequency: "",
      //     target: [],
      //     checkType2Arr: checkType2Arr,
      //     checkType4Arr: checkType4Arr,
      //     enclosureNameList: [],
      //     checkDate: "",
      //     receiveDate: "",
      //     onlineRelation: "",
      //     workOrderType:0,
      //     violationLevel: [1, 2, 3, 4],
      //     uploadCheckStandard: null, // 是否上传检核标准
      //     standardFileUrl: "" // 是否有检核标准附件
      //   };


      // }
      // 编辑

      if (this.flag === 2) {
        this.title = "编辑页面";
      }
      // if (this.flag === 3) {
      //   this.title = "详情";
      // }
      let valData = JSON.parse(JSON.stringify(val));
      this.uuid = valData.taskUuid;
      // this.formData = {
      //   taskType: String(valData.taskType),
      //   taskName: valData.taskName,
      //   targetType: valData.targetType,
      //   taskFrequency: String(valData.taskFrequency),
      //   agents: valData.agents,
      //   checkType2Arr: checkType2Arr,
      //   checkType4Arr: checkType4Arr,
      //   checkDate: [valData.checkDateStart, valData.checkDateEnd],
      //   receiveDate: valData.receiveDate,
      //   onlineRelation: valData.onlineRelation,
      //   workOrderType:valData.workOrderType,
      //   violationLevel: String(valData.violationLevel).split(","),
      //   uploadCheckStandard: valData.uploadCheckStandard,
      //   enclosureNameList: []
      // };
      this.formData = this.addPersonData
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
      // if (valData.targetType === 2) {
      //   this.formData.importFileName = valData.importFileName;
      //   this.formData.importFileUrl = valData.importFileUrl;
      // }
      // 处理违规级别设置
      // this.formData.violationLevel = this.formData.violationLevel.map(item => {
      //   return Number(item);
      // });
      // // 处理上传检核标准附件
      // if (valData.uploadCheckStandard === 1) {
      //   valData.enclosureVoList.forEach(item => {
      //     if (item.checkType === 3) {
      //       this.formData.standardFileUrl = item.fileUrl;
      //       this.formData.standardFileName = item.fileName;
      //     }
      //   });
      // }
      // 处理检核部位
      // 自定义数据获取
      // let enclosureVoList4Arr = valData.enclosureVoList.filter(item => {
      //   item.uploadImgVideoTitle = "重新上传";
      //   return item.checkType === 4;
      // });

      // 固定部分数据获取
      // let enclosureVoList2Arr = valData.enclosureVoList.filter(item => {
      //   return item.checkType === 2;
      // });
      // // 设置选中状态
      // this.formData.checkType2Arr = this.formData.checkType2Arr.map(item => {
      //   // let backItem = item;
      //   enclosureVoList2Arr.forEach(yItem => {
      //     if (item.localtion === yItem.localtion) {
      //       this.formData.enclosureNameList.push(item.flagIndex);
      //       item.fileUrl = yItem.fileUrl;
      //       item.isChecked = true;
      //     }
      //   });
      //   return item;
      // });
      // 当自定义有数据时
      // if (enclosureVoList4Arr.length > 0) {
      //   this.formData.checkType4Arr = enclosureVoList4Arr;
      //   this.formData.checkType2Arr[6].isChecked = true;
      //   this.formData.enclosureNameList.push(6);
      // }

      // debugger
      // console.log(this.formData.taskType)

      if (this.formData.taskType === "1") {
        this.isOrder = 1

      } else if (this.formData.taskType === "0") {
        this.isOrder = 0

      }

    },
    getImgUrl(val) {
      this.picData = val.data;

      if (!val) {
        this.formData.picUrl = "";
        this.picUrl = ""
        this.certificationImages = ""
        this.formData.certificationImages = ""
      } else {
        this.formData.picUrl = val.data.picUrl;
        this.certificationImages = val.data.uuid
        this.picUrl = val.data.picUrl;
        // console.log(this.formData.picUrl)
      }
    },
    saveData() {
      // return;
      if (this.flag === 3) {
        this.showModal = false;
        return;
      }
      this.formData.certificationImages = this.certificationImages
      if (this.isDate === 1 && this.temDate === "1970-01-01 08:00:01") {
        this.formData.validityStartTime = this.temDate
        this.formData.validityEndTime = this.temDateEnd

      }
      // debugger
      // console.log(this.formData)
      // debugger
      // this.formData.qualificationType = this.formData.qualificationType
      // 			this.addPersonData.qualificationType = this.addPersonData.qualificationType?this.addPersonData.qualificationType:""
      // this.addPersonData.certificationType = this.addPersonData.certificationType?this.addPersonData.certificationType:""
      queryCheckTaskDetail1(this.formData).then(res => {

        this.$Message.success(res.data.msg);
        this.showModal = false;
        this.$parent.getTableList()

      });
      // location.reload()
    },
    changeDateType() {
      this.isDate = 2
      this.formData.validityStartTime = moment(this.formData.validityStartTime).format("YYYY-MM-DD HH:mm:ss")
    },
    changeDateType1() {
      this.isDate = 2
      this.formData.validityEndTime = moment(this.formData.validityEndTime).format("YYYY-MM-DD HH:mm:ss")

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
    async getUrlByUuid(uuid) {
      const [, v] = await this.getOssFile({ uuid });
      this.toOpen(v)
    }



    // 图片上传成功
    // uploadSuc(res) {
    //   this.formData.importFileUrl = res.data.importFileUrl;
    //   this.formData.importFileName = res.data.importFileName;
    //   this.formData.excelDriverInfoList = res.data.excelDriverInfoVoList;
    //   this.formData.agents = res.data.agents;
    //   this.$forceUpdate();
    // },

    // uploadFail(res) {
    //   this.formData.importFileUrl = "";
    //   this.$forceUpdate();
    // },

    // getFileUrl(val, index) {
    //   if (!val) {
    //     this.formData.enclosureList[index].fileUrl = "";
    //   } else {
    //     this.formData.enclosureList[index].fileUrl = val.fileUrl;
    //   }
    //   this.formData = JSON.parse(JSON.stringify(this.formData));
    //   // this.formData.standardFileUrl = res.fileUrl;
    // }


    //   standardSuc(res) {
    //   // this.formData.standardFileUrl = res.fileUrl;
    //   // this.formData.standardFileName = res.fileName.substring(8);
    //   debugger
    //   console.log(res)
    // },
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
