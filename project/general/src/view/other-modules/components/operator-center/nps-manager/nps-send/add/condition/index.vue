<template>
  <Form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="150"
  >
    <FormItem
      label=""
      prop="userType"
      style="width: 350px"
    >
      <RadioGroup
        v-model="formValidate.userType"
        @on-change="handleRadioChange"
      >
        <Radio
          v-for="(value, key) in personGroupMap"
          :key="key"
          :label="Number(key)"
        >
          {{value}}
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label="人员设置"
      prop="hasTerm"
      style="width: 350px"
    >
      <RadioGroup v-model="formValidate.hasTerm">
        <Radio :label="2">
          用户群标签    <Button type="primary" size="small" :disabled="formValidate.hasTerm !== 2" @click="chooseUserGroup">选择用户群</Button>
        </Radio>
        <!-- <Radio :label="1" disabled>
          按条件
        </Radio> -->
        <Radio :label="0">
          导入名单
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="formValidate.hasTerm === 1">
      <FormItem
        v-if="formValidate.userType === 2"
        label="司机状态"
        prop="userState"
        style="width: 350px"
        :rules="{ type: 'number', required: formValidate.hasTerm === 1 && formValidate.userType === 2, message: '司机状态不能为空', trigger: 'blur' }"
      >
        <Select
          v-model="formValidate.userState"
          clearable
          style="width:150px"
        >
          <Option
            v-for="(value, key) in driverStatusMap"
            :key="key"
            :value="Number(key)"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="每日发送人数上限"
        prop="pushUserNumber"
        style="width: 350px"
        :rules="[{ required: formValidate.hasTerm === 1, validator: validatePushUserNumber, trigger: 'blur' }]"
      >
        <Input
          v-model="formValidate.pushUserNumber"
          number
          placeholder="请输入"
          style="width: 150px"
        ></Input>
      </FormItem>

      <Row
        type="flex"
        justify="start"
        class="code-row-bg"
      >
        <Col flex="none">
        <FormItem
          label="城市"
          style="width: 350px"
          prop="city"
        >
          <Select
            v-model="formValidate.city"
            multiple
            clearable
            filterable
            style="width:150px"
            @on-change="handleCitySelectChange"
          >
            <Option
              v-for="(item, index) in cityList"
              :key="index"
              :value="item.cityID"
            >
              {{item.city}}
            </Option>
          </Select>
        </FormItem>
        </Col>
        <Col flex="auto">
        <div
          v-for="(item, index) in formValidate.cityPercentList"
          :key="index"
          style="margin-bottom:10px; margin-left: 25px;"
        >
          <Button
            class="btn-dynamic"
          >
            {{item.cityName}}<Icon
              type="ios-close"
              size="20"
              style="float: right;"
              @click="clickTestCity(item)"
            />
          </Button>
          <Input
            v-model="item.percent"
            type="number"
            placeholder=""
            style="width: 100px"
          ></Input>
          % 请设置人数百分比
        </div>
        </Col>
      </Row>
    </template>
    <template v-if="formValidate.hasTerm === 2 ">
      <div v-if="crowdCodeList.length > 0" class="us-show-table">
        <FormItem
          label="已选择用户群"
          style="width: 900px;margin-bottom:0px"
        >
          <m2-table
            :isLoading="false"
            :parColumns="uSShowColumns"
            :isShowPage="false"
            :height="180"
            :parTableData="crowdCodeList"
          >
          </m2-table>
        </FormItem>
        <FormItem
          label=""
          style="width: 850px"
        >
          共计{{crowdCodeAllCount}}人
        </FormItem>
      </div>
    </template>
    <FormItem
      v-else
      label=""
      style="width: 350px"
    >
      <Button
        type="primary"
        style="width: 150px"
        @click="isShowUploadModal = true"
      >
        导入名单
      </Button>
      <div v-show="uploadModel.allRecord.allFilterSuccessCount">
        已导入{{uploadModel.allRecord.allFilterSuccessCount}}
      </div>
    </FormItem>

    <Row
      type="flex"
      justify="start"
      class="code-row-bg"
    >
      <Col flex="none">
      <FormItem
        label="问卷"
        style="width: 350px"
        prop="questionnaire"
      >
        <Select
          v-model="formValidate.questionnaire"
          multiple
          clearable
          style="width:150px"
          @on-change="handleNpsSelectChange"
        >
          <Option
            v-for="(item, index) in npsList"
            :key="index"
            :value="item.questionnaireId"
          >
            {{item.questionnaireName}}
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col flex="auto">
      <div
        v-for="(item, index) in formValidate.questionDistributeList"
        :key="index"
        style="margin-bottom:10px; margin-left: 25px;"
      >
        <Button
          class="btn-dynamic"
        >
          {{item.questionnaireName}}<Icon
            type="ios-close"
            size="20"
            style="float: right;"
            @click="clickTestNps(item)"
          />
        </Button>
        <Input
          v-model="item.numLimit"
          number
          placeholder=""
          style="width: 100px"
        ></Input>
        请设置推送人数
      </div>
      </Col>
    </Row>
    <!--选择人群弹窗-->
    <Modal
      v-model="isShowUSModal"
      width="900"
      title="选择人员"
      @on-ok="confirmUS"
      @on-cancel="isShowUSModal = false"
    >
      <m2-table
        ref="selectionTable"
        :current="uSModalCurrent"
        :total="uSModalTotal"
        :pageSize="uSModalPageSize"
        :parColumns="uSModalColumns"
        :parTableData="uSModalTableData"
        :isLoading="false"
        @changePage="changeUSPage"
        @changePageSize="changeUSPageSize"
        @selectHandle="changeUSHandle"
      >
      </m2-table>
    </Modal>
    <!-- 导入数据弹框 -->
    <Modal
      v-model="isShowUploadModal"
      title="导入数据"
      @on-ok="confirmUpload"
      @on-cancel="isShowUploadModal = false"
    >
      <Alert
        v-if="isShowWarningMessage"
        type="warning"
        v-html="uploadMessage"
      ></Alert>
      <p v-else>
        导入成功{{uploadModel.uploadResult.successCount}}条，失败{{uploadModel.uploadResult.failedCount}}条
        <!-- <span class="failXsl" @click="handleDownloadError" v-hasAuth="'nps_send-downloadFailedData'">下载导入失败名单</span> -->
        <ExportFile
          v-hasAuth="'nps_send-downloadFailedData'"
          exportUrl="/api/common/v1/questionnaire/pushConfig/downloadFailedData"
          exportFileName="失败名单.xlsx"
          :queryData="{ uuid: uploadModel.uploadResult.uuid }"
          baseUrlKey="_baseUrl4CommonWeb"
          btnText="下载导入失败名单"
          ajaxMethod="post"
          class="failXsl"
        >
        </ExportFile>
      </p>
      <div class="loadBar">
        <!-- <Button type="primary" icon="ios-cloud-download-outline" @click="handleDownloadTemp" v-hasAuth="'nps_send-downloadTemplate'">下载模板</Button> -->
        <ExportFile
          v-hasAuth="'nps_send-downloadTemplate'"
          exportUrl="/api/common/v1/questionnaire/pushConfig/downloadTemplate"
          exportFileName="发送设置导入名单模板.xlsx"
          :queryData="{}"
          baseUrlKey="_baseUrl4CommonWeb"
          btnText="下载模板"
          ajaxMethod="post"
          icon="ios-cloud-download-outline"
        >
        </ExportFile>
        <Upload
          ref="UploadFile"
          class="uploadWrapper"
          type="drag"
          :disabled="uploadModel.allRecord.allFilterSuccessCount > 100000"
          :format="['xls','xlsx']"
          action="/"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-error="handleUploadError"
          :on-format-error="handleUploadFormatError"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>点击（拖拽）上传文件</p>
          </div>
        </Upload>
      </div>
      <Row>
        <div
          v-for="(item,index) in uploadList"
          :key="index"
          class="upload-status-dev"
        >
          <template v-if="item && item.status === 'finished'">
            <div class="upload-item">
              <div>
                {{item.name}}
              </div>
            </div>
          </template>
          <template v-else>
            <Progress
              class="upload-item-progress"
              :percent="item.percentage"
              :status="item.progressStatus"
            ></Progress>
          </template>
        </div>
      </Row>
    </Modal>
  </Form>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { personGroupMap, driverStatusMap } from "../../../fields";
import { getProvinceCityList } from "_g/api/common";
import { cpTranslate } from "@/libs/tools";
import ExportFile from "_a/export-file/exportFile";
import { getToken } from "@/libs/util.js";
import { queryNPSNoPage, uploadUserCount, uploadUserData, queryUploadUserData, queryPassengerGroupCrowd } from "_o/api/nps/app.js";
import { totalColumns } from "../fields";
export default {
  name: "condition",
  components: {
    ExportFile,
    m2Table
  },
  props: {
    formValidate: {
      type: Object,
      default: {}
    },
    uploadModel: {
      type: Object,
      default: {}
    }
  },
  data() {
    const validateQuestionnaire = (rule, value, callback) => {
      if (value && value.length) {
        let sum = 0
        this.formValidate.questionDistributeList.forEach(item => {
          let numLimit = Number(item.numLimit)
          if (item.numLimit !== 0 && !item.numLimit) {
            callback(new Error("请填写推送人数"));
          } else if (!Number.isInteger(numLimit)) {
            callback(new Error("推送人数只可以填写整数"));
          } else if (numLimit < 0) {
            callback(new Error("推送人数不可以为负值"));
          } else {
            sum += numLimit
          }
        });
        if (this.formValidate.hasTerm === 1 && sum !== this.formValidate.pushUserNumber) {
          callback(new Error("问卷推送人数设置不正确"));
        } else if (this.formValidate.hasTerm === 0 && sum !== this.uploadModel.allRecord.allFilterSuccessCount) {
          callback(new Error("问卷推送人数设置不正确"));
        } else {
          callback();
        }
      } else {
        callback(new Error("问卷列表不能为空"));
      }
    };
    const validatePushUserNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("每日发送人数上限不能为空"));
      } else if (!Number.isInteger(Number(value))) {
        callback(new Error("请输入整数"));
      } else if (Number(value) < 0) {
        callback(new Error("推送人数不可以为负值"));
      } else {
        callback();
      }
    };
    const validateCity = (rule, value, callback) => {
      if (value && value.length) {
        let sum = 0
        this.formValidate.cityPercentList.forEach(item => {
          let percent = Number(item.percent)
          if (item.percent !== 0 && !item.percent) {
            callback(new Error("请填写城市百分比"));
          } else if (!Number.isInteger(percent)) {
            callback(new Error("百分比只可以填写整数"));
          } else if (percent < 0) {
            callback(new Error("百分比不可以为负值"));
          } else {
            sum += percent
          }
        });
        if (sum !== 100) {
          callback(new Error("人数百分比设置不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let { columnsTotal, showColumns } = totalColumns;
    return {
      cityList: [],
      personGroupMap: personGroupMap,
      driverStatusMap,
      ruleValidate: {
        questionnaire: [
          { validator: validateQuestionnaire, required: true, trigger: "blur" }
        ],
        hasTerm: [
          { type: "number", required: true, message: "是否按条件设置不能为空", trigger: "blur" }
        ],
        city: [
          { validator: validateCity, trigger: "blur" }
        ],
      },
      npsList: [],
      isShowUploadModal: false,
      // uploadFiles: {},
      header: {
        Authorization: getToken()
      },
      uploadMessage: "请先下载导入模版，根据规则填写模版，然后再导入填好的模板数据！",
      isShowWarningMessage: true,
      validatePushUserNumber,
      uploadList: [],
      uploadIndex: 0,
      uSShowColumns: showColumns(this),
      crowdCodeList: [],
      isShowUSModal: false,
      uSModalCurrent: 1,
      uSModalTotal: 0,
      uSModalPageSize: 10,
      uSModalColumns: columnsTotal(this),
      uSModalTableData: [],
      uSDoSelectedData: [],
      crowdCodeAllCount: 0
    }
  },
  computed: {
    isLoading: function () {
      return this.$store.getters.getLoadingFlag
    },
  },
  mounted() {
    this.getCityList();
    this.queryNPSNoPage()
    console.log("this.formValidate.crowdDtoList!!!", this.formValidate)
    this.crowdCodeList = this.formValidate.crowdDtoList
    this.getCrowdCodeAllCount()
    console.log("this.formValidate.", this.formValidate)
  },
  methods: {
    getCrowdCodeAllCount() {
      let tmpCount = 0
      this.crowdCodeList.forEach(item => {
        tmpCount += Number(item.userNum)
      })
      this.crowdCodeAllCount = tmpCount
    },
    deleteUSSelected(info) {
      let tmpList = []
      this.crowdCodeList.forEach(item => {
        if (info.crowdCode !== item.crowdCode) {
          tmpList.push(item)
        }
      })
      this.crowdCodeList = tmpList
      this.getCrowdCodeAllCount()
      this.$emit("updateCrowdCodeList", this.crowdCodeList)
    },
    changeUSHandle(sl) {
      console.log("changeUSHandle>>>>", sl)
      let curPageData = this.$refs.selectionTable.$refs.vtable.$refs.tbody.objData
      let tmpSelections = []
      for (let i = 0; i < this.uSDoSelectedData.length; i++) {
        let hasSame = false
        for (let key in curPageData) {
          if (key) {
            if (this.uSDoSelectedData[i].crowdCode === curPageData[key].crowdCode) {
              //
              hasSame = true
            }
          }
        }
        if (!hasSame) {
          tmpSelections.push(this.uSDoSelectedData[i])
        }
      }
      console.log("tmpSelections1>>>>", tmpSelections)

      for (let key in curPageData) {
        if (key) {
          if (curPageData[key]._isChecked) { // 选中
            //
            tmpSelections.push(curPageData[key])
          }
        }
      }
      console.log("tmpSelections2>>>>", tmpSelections)
      this.uSDoSelectedData = tmpSelections
      this.crowdCodeList = this.uSDoSelectedData
      this.getCrowdCodeAllCount()
    },
    confirmUS(e) {
      this.$emit("updateCrowdCodeList", this.crowdCodeList)
    },
    changeUSPageSize(pageSize) {
      this.uSModalPageSize = pageSize;
      this.getPassengerGroupCrowd()
    },
    changeUSPage(page) {
      this.uSModalCurrent = page;
      this.getPassengerGroupCrowd()
    },
    chooseUserGroup() {
      this.isShowUSModal = true
      this.getPassengerGroupCrowd()
    },
    getPassengerGroupCrowd() {
      let params = {
        crowdType: this.formValidate.userType,
        currPage: this.uSModalCurrent,
        pageSize: this.uSModalPageSize
      }
      queryPassengerGroupCrowd(params).then(res => {
        let resData = res.data
        this.uSModalTableData = resData.data.list
        this.uSModalTotal = resData.data.totalCount
        // 处理选中
        this.updateChecked()
      })
    },
    updateChecked() {
      this.$nextTick(() => {
        let objData = this.$refs.selectionTable.$refs.vtable.$refs.tbody.objData;
        for (let key in objData) {
          if (key) {
            objData[key]._isChecked = false;
            for (let j = 0; j < this.crowdCodeList.length; j++) {
              if (this.crowdCodeList[j].crowdCode === objData[key].crowdCode) {
                objData[key]._isChecked = true;
              }
            }
          }
        }
      });
    },
    init() {

    },
    // 获取城市
    getCityList() {
      // let params = {
      //   areaType: 2,//已开启城市
      //   businessLineList: [1,2,4]//快车、专车、出租车
      // }
      getProvinceCityList().then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data || [])
          let tmpList = this.listAllCitys(list)
          this.cityList = tmpList
        }
      })
    },
    listAllCitys(list) {
      let tmpList = []
      list.forEach(item => {
        item.children.forEach(cItem => {
          tmpList.push(cItem)
        })
      })
      return tmpList
    },
    handleCitySelectChange(value) {
      let tempSelected = []
      for (let item of value) {
        let itemFilter = this.cityList.find(ele => {
          return ele.cityID === item;
        });
        let cityPercent = this.formValidate.cityPercentList.filter(ele => {
          return ele.cityCode === item;
        })
        tempSelected.push({
          cityCode: itemFilter.cityID,
          cityName: itemFilter.city,
          cityUuid: itemFilter.cityUuid,
          percent: cityPercent.length ? cityPercent[0].percent : 0
        })
      }
      this.formValidate.cityPercentList = tempSelected
    },
    // 获取所有问卷
    queryNPSNoPage() {
      let params = {
        userType: this.formValidate.userType
      }
      queryNPSNoPage(params).then(res => {
        if (res.data.success) {
          this.npsList = res.data.data || []
        }
      })
    },
    handleRadioChange() {
      this.formValidate.crowdDtoList = []
      this.crowdCodeList = []
      this.$emit("initConditionModel", "")
      this.formValidate.questionDistributeList = []
      this.formValidate.questionnaire = []
      this.formValidate.pushUserNumber = 0
      this.$refs.UploadFile.clearFiles()
      this.uploadMessage = "请先下载导入模版，根据规则填写模版，然后再导入填好的模板数据！"
      this.isShowWarningMessage = true
      this.uploadModel.uploadUuids = []
      this.uploadModel.uploadResult = {}
      this.uploadModel.allRecord = {}
      this.queryNPSNoPage()
    },
    handleNpsSelectChange(value) {
      let tempSelected = []
      for (let item of value) {
        let itemFilter = this.npsList.find(ele => {
          return ele.questionnaireId === item;
        });
        let questionCur = this.formValidate.questionDistributeList.filter(ele => {
          return ele.questionnaireId === item;
        })
        tempSelected.push({
          questionnaireId: itemFilter.questionnaireId,
          questionnaireName: itemFilter.questionnaireName,
          numLimit: questionCur.length ? questionCur[0].numLimit : 0
        })
      }
      this.formValidate.questionDistributeList = tempSelected
    },

    // 数据改变
    dataChange() {
      // 直接把数据发送给父组件
      this.$emit("update", this.formValidate);
    },
    clickTestCity(item) {
      this.formValidate.cityPercentList = this.formValidate.cityPercentList.filter((selectItem) => selectItem.cityCode !== item.cityCode)
      this.formValidate.city = this.formValidate.city.filter((selectItem) => selectItem !== item.cityCode)
    },
    clickTestNps(item) {
      this.formValidate.questionDistributeList = this.formValidate.questionDistributeList.filter((selectItem) => selectItem.questionnaireId !== item.questionnaireId)
      this.formValidate.questionnaire = this.formValidate.questionnaire.filter((selectItem) => selectItem !== item.questionnaireId)
    },
    handleProgress(progress, item) {
      let percentage = Number(Number((progress.loaded / progress.total) * 100).toFixed())
      // 当99的时候卡住一下
      if (percentage === 100) percentage = 70
      item.percentage = percentage
    },
    // 上传失败回调
    handleUploadError() {
      this.isShowWarningMessage = false
    },
    beforeUpload(file) {
      this.uploadList.push({
        status: "",
        progressStatus: "",
        percentage: 0,
        name: file.name,
        file: file
      });
      this.upload(this.uploadList[this.uploadIndex], this.uploadIndex)
      console.log(this.uploadList)
      this.uploadIndex++
      return false
    },
    upload(item, index) {
      let fileFormData = new FormData()
      fileFormData.append("file", item.file)
      fileFormData.append("uuidList", this.uploadModel.uploadUuids)
      fileFormData.append("userType", this.formValidate.userType)
      let header = this.header
      let onUploadProgress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          this.handleProgress(progressEvent, item)
        }
      }
      uploadUserData(fileFormData, header, onUploadProgress).then(res => {
        let resData = res.data;
        if (resData.code === 200) {
          this.resendUploadData(item, resData.data.uuid)

        } else {
          // this.handleUploadSuccess(resData)
        }
      }).catch(e => {
        this.uploadList.splice(index, 1);
        this.uploadIndex--
      });
    },
    resendUploadData(item, uuid) {
      let myInterval
      queryUploadUserData({
        "uuid": uuid
      }).then(res => {
        let resData = res.data;
        if (resData.data.process && resData.data.process === 2) {
          clearInterval(myInterval)
          item.percentage = 100
          item.status = "finished"
          this.handleUploadSuccess(resData)
        } else {
          let count = 0
          myInterval = setInterval(() => {
            if (count === 60) {
              console.log("清除不再请求")
              clearInterval(myInterval)
              item.progressStatus = "wrong"
              this.isShowWarningMessage = true
              this.uploadMessage = '<p style="color: red;">请求处理超时</p>'
            } else {
              count++
              queryUploadUserData({
                uuid: uuid
              }).then(resp => {
                let respData = resp.data;
                if (respData.data.process && respData.data.process === 2) {
                  console.log("resData.data.process", respData.data.process)
                  item.percentage = 100
                  item.status = "finished"
                  clearInterval(myInterval)
                  this.handleUploadSuccess(respData)
                }
              })
            }
          }, 5000)
        }
      })
    },
    handleUploadFormatError() {
      this.isShowWarningMessage = true
      this.uploadMessage = '<p style="color: red;">请填写正确的导入方式</p>'
    },
    // 上传成功回调
    handleUploadSuccess(res) {

      if (res.data.failedCount === 0) {
        this.isShowWarningMessage = true
      } else {
        this.isShowWarningMessage = false
      }
      this.uploadMessage = "导入成功！"
      this.uploadModel.uploadUuids.push(res.data.uuid)
      this.uploadModel.uploadResult = res.data
      this.formValidate.pushUserNumber = res.data.successCount
      this.uploadUserCount()
    },
    // 导入成功失败条数汇总
    uploadUserCount() {
      let params = {
        uuidList: this.uploadModel.uploadUuids
      }
      uploadUserCount(params).then(res => {
        if (res.data.success) {
          this.uploadModel.allRecord = res.data.data || {}
        }
      })
    },
    confirmUpload() {

    }
  },
}
</script>

<style lang="less" scoped>
  .btn-dynamic{
    width: 180px;
    overflow: hidden;
  }
  .failXsl{
    color: #1890ff;
    cursor: pointer;
    background: transparent;
    border-width: 0;
  }
  .loadBar{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    & > button{
      margin: 0 20px;
    }
    .uploadWrapper{
      width: 100%;
      text-align: center;
    }
  }
  .upload-status-dev{
    .upload-item>div{
      margin-left: 148px;
      margin-top: 10px;
    }
  }
  .us-show-table{
  }
</style>
