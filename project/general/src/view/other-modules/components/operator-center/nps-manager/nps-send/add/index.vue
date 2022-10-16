<template>
  <div>
    <Tabs
      v-model="activeTab"
      class="deletePadding"
      @on-click="handleTabClick"
    >
      <TabPane
        name="1"
        :label="label1"
      >
        <basic
          v-if="activeTab === '1'"
          ref="basic"
          :formValidate="basicModel"
        ></basic>
      </TabPane>
      <TabPane
        name="2"
        :label="label2"
      >
        <condition
          v-if="activeTab === '2'"
          ref="condition"
          :formValidate="conditionModel"
          :uploadModel="uploadModel"
          @updateCrowdCodeList="updateCrowdCodeList"
          @initConditionModel="initConditionModel"
        ></condition>
      </TabPane>
      <TabPane
        name="3"
        :label="label3"
      >
        <channel
          v-if="activeTab === '3'"
          ref="channel"
          :formValidate="channelModel"
        ></channel>
      </TabPane>
    </Tabs>
    <div class="btnBar">
      <Button
        type="text"
        size="large"
        @click="handleCancel"
      >
        取消
      </Button>
      <Button
        v-hasAuth="`nps_send-${isAdd ? 'add' : 'modify'}`"
        type="primary"
        size="large"
        @click="handleNext"
      >
        {{activeTab !== '3' ? '下一步' : '确定'}}
      </Button>
    </div>
  </div>
</template>

<script>

import basic from "./basic/index";
import condition from "./condition/index";
import channel from "./channel/index";

import { queryDetailData, addSend, modifySend } from "_o/api/nps/app.js";

export default {
  name: "nps-send-add",
  components: {
    basic,
    condition,
    channel
  },
  data() {
    return {
      activeTab: "1",
      basicModel: {
        configName: "",
        etime: ["", ""],
        pushCycleType: "",
        pushCycleTime: "",
        silentFlag: 0
      },
      conditionModel: {
        userType: 1,
        hasTerm: 2,
        pushUserNumber: "",
        city: "",
        questionnaire: "",
        cityPercentList: [],
        crowdDtoList: [],
        questionDistributeList: [],
        userState: 1
      },
      channelModel: {
        pushContent: "",
        pushChannelList: 1
      },
      uploadModel: {
        uploadUuids: [], // 保存上传文件的uuids数组
        uploadResult: {}, // 保存单次上传的返回结果
        allRecord: {} // 保存历史上传的返回结果
      },
      isAdd: true,
      label1: "",
      label2: "",
      label3: ""
    };
  },
  created() {
    this.label1 = this.getLabel("基础信息");
    this.label2 = this.getLabel("条件设置");
    this.label3 = this.getLabel("发送渠道");
  },
  mounted() {
    if (this.$route.query.configId) {
      this.isAdd = false
      this.init()
    }
  },
  methods: {
    updateCrowdCodeList(list) {
      this.conditionModel.crowdDtoList = list
      let tmpList = []
      list.forEach(item => {
        tmpList.push(item.crowdCode)
      })
      this.conditionModel.crowdCodeList = tmpList
    },
    initConditionModel() {
      this.conditionModel.crowdDtoList = []
      this.conditionModel.crowdCodeList = []
    },
    init() {
      queryDetailData({ configId: this.$route.query.configId }).then(res => {
        // console.log('详情信息', res)
        if (res.data.success) {
          let detailData = res.data.data || {}
          let city = []
          let questionnaire = []
          let startDay = this.$moment(detailData.startDay).format("YYYY-MM-DD")
          let endDay = this.$moment(detailData.endDay).format("YYYY-MM-DD")
          let { configName, pushCycleType, pushCycleTime, silentFlag } = detailData
          let { userType, hasTerm, pushUserNumber, cityPercentList, questionDistributeList, userState, crowdDtoList } = detailData
          let { pushContent, pushChannelList, noticeTitle, noticeSubTitle } = detailData
          questionDistributeList.forEach((item) => {
            questionnaire.push(item.questionnaireId)
          })
          cityPercentList.forEach((item) => {
            city.push(item.cityCode)
          })
          this.basicModel = {
            configName,
            etime: [startDay, endDay],
            pushCycleType: pushCycleType,
            pushCycleTime,
            silentFlag
          }
          this.conditionModel = {
            userType,
            hasTerm,
            crowdDtoList,
            pushUserNumber,
            city,
            questionnaire,
            cityPercentList,
            questionDistributeList,
            userState
          }
          this.updateCrowdCodeList(crowdDtoList)
          this.channelModel = {
            userType,
            pushContent,
            pushChannelList: pushChannelList[0],
            noticeSubTitle: noticeSubTitle,
            noticeTitle: noticeTitle,
          }
          if (hasTerm === 0) {
            // this.uploadModel.uploadResult.successCount = pushUserNumber
            this.uploadModel.allRecord.allFilterSuccessCount = pushUserNumber
          }
          if (this.$route.query.copyFlag) {
            this.uploadModel.allRecord.allFilterSuccessCount = 0
          }
        }
      });
    },
    tabClick() {
      let canChange = false
      let tabName = ["basic", "condition", "channel"][Number(this.activeTab) - 1]
      this.$refs[tabName].$refs["formValidate"].validate((valid) => {
        console.log("tabName", tabName)
        let valid_ = valid
        if (tabName === "condition") {
          if (this.conditionModel.hasTerm === 2 && this.conditionModel.crowdCodeList.length === 0) { //
            this.$Modal.info({
              title: "提示",
              content: `请选择用户群`,
            })
            valid_ = false
            return
          }
        }
        this.channelModel.userType = this.conditionModel.userType
        canChange = valid_
      })
      return canChange
    },
    // 自定义标签页的内容以及它的事件
    getLabel(label) {
      let that = this;
      return h => {
        return h(
          "div",
          {
            style: {
              padding: "16px 16px",
              textAlign: "center"
            },
            on: {
              click: e => {
                let tip = that.tabClick(); // 判断条件是否满足
                if (!tip) {
                  e.stopPropagation(); // 不满足条件则阻止事件冒泡 本质是不让触发tab的on-click事件
                } else {
                  // console.log("离开");
                }
              }
            }
          },
          label
        );
      };
    },
    handleNext(tabChangeFlag) {
      switch (this.activeTab) {
        case "1":
          this.$refs.basic.$refs["formValidate"].validate((valid) => {
            if (valid) {
              this.activeTab = "2"
              if (tabChangeFlag) return true
            }
          })
          break;
        case "2":
          this.$refs.condition.$refs["formValidate"].validate((valid) => {
            if (valid) {
              this.channelModel.userType = this.conditionModel.userType
              this.activeTab = "3"
              this.channelModel.pushChannelList = this.conditionModel.userType === 1 ? 1 : 3
              if (tabChangeFlag) return true
            }
          })
          break;
        case "3":
          this.$refs.channel.$refs["formValidate"].validate((valid) => {
            if (valid) {
              // 校验crowdDtoList
              // this.activeTab = '3'
              // 保存信息
              if (this.conditionModel.hasTerm === 2 && (this.conditionModel.crowdCodeList || []).length === 0) { //
                this.$Modal.info({
                  title: "提示",
                  content: `请选择用户群`,
                })
                return
              }
              console.log("this.conditionModel>>>>", this.conditionModel)
              let params = { ...this.basicModel, ...this.conditionModel, ...this.channelModel, uploadUuids: this.uploadModel.uploadUuids }
              params.startDay = this.$moment(this.basicModel.etime[0]).format("YYYYMMDD")
              params.endDay = this.$moment(this.basicModel.etime[1]).format("YYYYMMDD")
              params.pushUserNumber = Number(params.pushUserNumber)
              if (this.conditionModel.hasTerm === 0 && this.uploadModel.allRecord.allFilterSuccessCount) {
                params.pushUserNumber = Number(this.uploadModel.allRecord.allFilterSuccessCount) || 0
                params.cityPercentList = []
              }
              delete params.questionnaire
              delete params.city
              delete params.etime
              if (this.$route.query.configId) {
                params.configId = Number(this.$route.query.configId)
              }

              let funName = this.$route.query.configId ? modifySend : addSend
              if (this.$route.query.copyFlag) {
                funName = addSend
                delete params.configId
              }
              let pushChannel = params.pushChannelList
              params.pushChannelList = [params.pushChannelList]
              if (pushChannel === 1) {
                params.noticeTitle = ""
                params.noticeSubTitle = ""
              }
              if (pushChannel === 3) {
                params.pushContent = ""
              }
              console.log("params", params)
              console.log("this.conditionModel》》》", this.conditionModel)
              funName(params).then(res => {
                // console.log('新增/编辑发送设置', res)
                if (res.data.success) {
                  this.$router.go(-1)
                }
              })
            }
          })
          break;
      }
    },
    handleTabClick(val) {
      // console.log(6666, val)
    },
    handleCancel() {
      // let refName = ['basic', 'condition', 'channel']
      this.$Modal.confirm({
        title: "取消设置",
        content: `是否确认取消？`,
        onOk: () => {
          // this.$refs[refName[Number(this.activeTab) - 1]].$refs['formValidate'].resetFields();
          this.$router.go(-1)
        },
      })
    }
  },
};
</script>

<style lang="less" scoped>
.content-container {
  margin: 10px 0 0 0;

  .operate-wrap {
    margin: 0 0 10px 0;
    text-align: right;
  }
}
.ivu-tabs-tabpane {
  padding-top: 10px;
  height: 650px;
  overflow: auto;
}
.btnBar{
  margin-top: 15px;
  text-align: right;
  & > button:first-child {
    margin-right: 8px;
  }
}
</style>
