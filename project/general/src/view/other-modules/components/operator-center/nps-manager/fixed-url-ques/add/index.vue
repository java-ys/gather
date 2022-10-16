<template>
  <div>
    <basic
      ref="basic"
      :formValidate="basicModel"
    ></basic>
    <div class="btnBar">
      <Button
        type="text"
        size="large"
        @click="handleCancel"
      >
        取消
      </Button>
      <Button
        type="primary"
        size="large"
        @click="save"
      >
        保存
      </Button>
    </div>
  </div>
</template>

<script>

import basic from "./basic/index";
import { queryDetailData, addSend, modifySend } from "_o/api/nps/app.js";

export default {
  name: "nps-send-add",
  components: {
    basic,
  },
  data() {
    return {
      activeTab: "1",
      basicModel: {
        configName: "",
        etime: ["", ""],
        questionDistributeList: "",
        userType: undefined,
        questionnaire: [],
        pushChannelList: [5],
        silentFlag:0,
        hasterm:3
      },
      isAdd: true,
    };
  },
  created() {
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
          let questionnaire = []
          let startDay = this.$moment(detailData.startDay).format("YYYY-MM-DD")
          let endDay = this.$moment(detailData.endDay).format("YYYY-MM-DD")
          let { configName, userType, questionDistributeList } = detailData
          questionDistributeList.forEach((item) => {
            questionnaire.push(item.questionnaireId)
          })
          this.basicModel = {
            configName,
            etime: [startDay, endDay],
            userType,
            questionnaire,
            hasterm:3,
            pushChannelList: [5],
            silentFlag:0,
            questionDistributeList,
          }
          console.log("this.basicModel>>>>", this.basicModel)
        }
      });
    },

    save(tabChangeFlag) {
      this.$refs.basic.$refs["formValidate"].validate((valid) => {
        if (valid) {
          let params = this.basicModel
          params.startDay = this.$moment(this.basicModel.etime[0]).format("YYYYMMDD")
          params.endDay = this.$moment(this.basicModel.etime[1]).format("YYYYMMDD")
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

    },
    handleCancel() {
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
