<template>
  <Form label-position="right" :label-width="180">
    <Tabs v-model="activeTab">
      <TabPane name="1" label="基础信息">
        <FormItem label="名称：" required>{{detailObj.configName}}</FormItem>
        <FormItem label="生效日期：" required>{{getDayTitle(detailObj.startDay || '') + '-' + getDayTitle(detailObj.endDay || '')}}</FormItem>
        <FormItem label="发放周期：" required>{{sendModeMap[detailObj.pushCycleType]}}</FormItem>
        <FormItem label="推送时间：" required>{{detailObj.pushCycleTime}}</FormItem>
        <FormItem label="是否使用问卷沉默设置：" required>{{detailObj.silentFlag === 1 ? '是' : '否'}}</FormItem>
      </TabPane>
      <TabPane name="2" label="条件设置">
        <FormItem label="人群分类：" required>{{personGroupMap[detailObj.userType]}}</FormItem>
        <FormItem label="人员设置：" required>
          <span v-if="detailObj.hasTerm === 2">用户群标签</span>
          <span v-if="detailObj.hasTerm === 0">导入名单</span>
        </FormItem>
        <template v-if="detailObj.hasTerm === 1">
          <FormItem v-if="detailObj.userType === 2" label="司机状态" required>{{driverStatusMap[detailObj.userState]}}</FormItem>
          <FormItem label="每日发送人数上限：" required>{{detailObj.pushUserNumber}}</FormItem>
          <FormItem label="城市：">
            <span v-for="(item, index) in detailObj.cityPercentList" :key="index" class="cityItem">
              {{item.cityName + '&nbsp;' + item.percent + '%'}}
            </span>
          </FormItem>
        </template>
        <template v-if="detailObj.hasTerm === 0">
          <FormItem label="">已导入{{detailObj.pushUserNumber}}</FormItem>
        </template>
        <template v-if="detailObj.hasTerm === 2">
          <div class="us-show-table">
            <FormItem
              label="已选择用户群"
              style="width: 900px;margin-bottom:0px"
            >
              <m2-table
                :isLoading="false"
                :parColumns="uSShowColumns"
                :isShowPage="false"
                :height="180"
                :parTableData="crowdList"
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
        <FormItem label="问卷：" required>
          <div v-for="(item, index) in detailObj.questionDistributeList" :key="index" class="questionaireItem">
            <span class="name">{{item.questionnaireName}}</span>
            <span class="num">{{item.numLimit}}</span>
          </div>
        </FormItem>
      </TabPane>
      <TabPane name="3" label="发送渠道">
        <FormItem label="">
          <RadioGroup v-model="detailObj.pushChannelList">
            <Radio
              v-for="(value, key) in pushChannelMap"
              :key="key"
              disabled
              :label="Number(key)"
            >
              {{value}}
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="detailObj.pushChannelList === 1" label="短信内容：">{{detailObj.pushContent}}</FormItem>
        <template v-if="detailObj.pushChannelList === 3">
          <FormItem label="公告标题">{{detailObj.noticeTitle}} </FormItem>
          <FormItem label="公告副标题">{{detailObj.noticeSubTitle}}</FormItem>
        </template>
        <template v-if="detailObj.pushChannelList === 4">
          <FormItem label="推送标题">{{detailObj.noticeTitle}} </FormItem>
          <FormItem label="推送副标题">{{detailObj.noticeSubTitle}}</FormItem>
        </template>
      </TabPane>
    </Tabs>
  </Form>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { sendModeMap, personGroupMap, driverStatusMap, pushChannelMap } from "../../fields";
import { getDayTitle } from "../fields";
import { totalColumns } from "../add/fields";
import { queryDetailData } from "_o/api/nps/app.js";
export default {
  name: "nps-send-detail",
  components: {
    m2Table
  },
  data() {
    let { detailsColumns } = totalColumns;
    console.log(detailsColumns(this))
    return {
      activeTab: "1",
      sendModeMap,
      personGroupMap,
      driverStatusMap,
      pushChannelMap,
      detailObj: {},
      uSShowColumns: detailsColumns(this),
      crowdList: [],
      crowdCodeAllCount: 0
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    getDayTitle,
    getCrowdCodeAllCount() {
      let tmpCount = 0
      this.crowdList.forEach(item => {
        tmpCount += Number(item.userNum)
      })
      this.crowdCodeAllCount = tmpCount
    },
    init() {
      queryDetailData({ configId: this.$route.query.configId }).then(res => {
        // console.log('详情信息', res)
        if (res.data.success) {
          this.detailObj = res.data.data || {}
          this.detailObj.pushChannelList = this.detailObj && this.detailObj.pushChannelList[0]
          this.$nextTick(() => {
            this.crowdList = this.detailObj.crowdDtoList
            this.getCrowdCodeAllCount()
          })
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.ivu-tabs-tabpane {
  padding-top: 10px;
  height: 600px;
  overflow: auto;
}
.cityItem{
  margin-right: 15px;
}
.questionaireItem{
  display: flex;
  justify-content: flex-start;
  .name{
    // width: 200px;
    margin-right: 10px;
  }
}
</style>
