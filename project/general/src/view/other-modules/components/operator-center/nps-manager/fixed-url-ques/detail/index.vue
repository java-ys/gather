<template>
  <Form label-position="right" :label-width="180">
    <FormItem label="名称：" required>{{detailObj.configName}}</FormItem>
    <FormItem label="生效日期：" required>{{getDayTitle(detailObj.startDay || '') + '-' + getDayTitle(detailObj.endDay || '')}}</FormItem>
    <FormItem label="人群分类：" required>{{personGroupMap[detailObj.userType]}}</FormItem>
    <FormItem label="问卷：" required>
      <div v-for="(item, index) in detailObj.questionDistributeList" :key="index" class="questionaireItem">
        <span class="name">{{item.questionnaireName}}</span>
        <!-- <span class="num">{{item.numLimit}}</span> -->
      </div>
    </FormItem>
    <FormItem label=" 访问地址：">
      <div class="short-url"><b>{{detailObj.npsLinkUrl}}</b></div>
    </FormItem>
  </Form>
</template>

<script>
import { personGroupMap } from "../../fields";
import { getDayTitle } from "../fields";
import { totalColumns } from "../add/fields";
import { queryDetailData } from "_o/api/nps/app.js";
export default {
  name: "fixed-url-ques-detail",
  components: {
  },
  data() {
    let { detailsColumns } = totalColumns;
    console.log(detailsColumns(this))
    return {
      activeTab: "1",
      personGroupMap,
      detailObj: {},
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    getDayTitle,
    init() {
      queryDetailData({ configId: this.$route.query.configId }).then(res => {
        // console.log('详情信息', res)
        if (res.data.success) {
          this.detailObj = res.data.data || {}
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
.short-url{
  border:1px solid #dcdcdc;
  width: 280px;
  background: #f1f1f1;
  height: 32px;
  border-radius: 4px;
  text-indent: 8px;
}
</style>
