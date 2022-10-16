<template>
  <div class="announcement-detail">
    <Form :label-width="120">
      <FormItem label="公告状态：">
        <span>{{announceStatusMap[detailInfo.status]}}</span>
      </FormItem>
      <FormItem label="公告位置：">
        <span>{{announcePositionMap[detailInfo.localtion]}}</span>
      </FormItem>
      <FormItem v-if="detailInfo.localtion === 3" label="发送范围：">
        <div>{{targetTypeName ? "工资类别" : "运营商"}}</div>
        <div v-if="targetTypeName">
          {{targetTypeName}}
        </div>
        <div v-else>
          <TreeInput
            v-model="detailInfo.target"
            inputHeight="auto"
            :displayMode="true"
            :isTreeData="true"
            :TreeData="opGroup"
            IndexId="uuid"
            title="title"
          >
          </TreeInput>
        </div>
      </FormItem>
      <FormItem v-else label="发送范围：">
        <Spin v-if="loading" style="margin-top: 6px;"></Spin>
        <TreeInput
          v-else
          v-model="detailInfo.target"
          inputHeight="auto"
          :displayMode="true"
          :TreeData="cityList"
          IndexId="cityID"
          title="city"
        >
        </TreeInput>
      </FormItem>
      <FormItem
        v-if="detailInfo.localtion === 3 && !targetTypeName"
        label="司机类型："
      >
        <span>{{driverTypeValue}}</span>
      </FormItem>
      <FormItem v-if="detailInfo.localtion === 3" label="公告类型：">
        <span>{{announceTypeMap[detailInfo.noticeType]}}</span>
      </FormItem>
      <FormItem label="公告标题：">
        <span>{{detailInfo.noticeTitle}}</span>
      </FormItem>
      <FormItem
        v-if="
          detailInfo.noticeSubTitle !== '' && detailInfo.noticeSubTitle !== null
        "
        label="公告副标题："
      >
        <span>{{detailInfo.noticeSubTitle}}</span>
      </FormItem>
      <FormItem
        v-if="detailInfo.noticeLink !== '' && detailInfo.noticeLink !== null"
        label="跳转链接："
      >
        <span>{{detailInfo.noticeLink}}</span>
      </FormItem>
      <FormItem label="时间段：">
        <span>{{detailInfo.upTime}} - {{detailInfo.downTime}}</span>
      </FormItem>
      <FormItem label="创建人：">
        <span>{{detailInfo.creator}}</span>
      </FormItem>
      <FormItem label="创建时间：">
        <span>{{detailInfo.createTime}}</span>
      </FormItem>
      <FormItem
        v-if="detailInfo.updater !== '' && detailInfo.updater !== null"
        label="撤销人："
      >
        <span>{{detailInfo.updater}}</span>
      </FormItem>
      <FormItem
        v-if="detailInfo.updater !== '' && detailInfo.updater !== null"
        label="撤销时间："
      >
        <span>{{detailInfo.updateTime}}</span>
      </FormItem>
      <!-- <FormItem label="发送人数：">
                <span>111111</span>   <a>发送详情</a>
            </FormItem>
            <FormItem label="已送达人数：">
                <span>111111</span>   <span>未送达人数： </span>
            </FormItem>
            <FormItem label="已读人数：">
                <span>111111</span>   <span>未读人数： </span>
            </FormItem> -->
      <FormItem label="已读人数：">
        <span>{{detailInfo.haveRead}}</span>
      </FormItem>
      <FormItem v-if="detailInfo.noticeBanner !== ''" label="公告banner图：">
        <Button shape="circle" icon="ios-search" @click="checkImg">查看图片</Button>
        <Modal v-model="showImg" title="View Image" width="700">
          <img :src="detailInfo.noticeBanner" style="width: 100%" />
        </Modal>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {
  announceStatusMap,
  announcePositionMap,
  announceTypeMap
} from "./fields.js";
import { getCitys } from "_g/api/common.js";
import TreeInput from "_a/treeInput/treeInput.vue";
import { salaryTypeList } from "_o/api/announcement.js";
import { driverTypeMap, driverTypeList } from "_g/config/status-map";

export default {
  components: {
    TreeInput
  },
  props: ["detailInfo", "popView"],
  data() {
    return {
      driverTypeMap,
      loading: true,
      opGroup: [],
      cityList: [],
      showImg: false,
      announceStatusMap: {},
      announcePositionMap: {},
      announceTypeMap: {},
      targetTypeName: ""
    };
  },
  computed: {
    driverTypeValue() {
      // 历史数据默认全部
      let res = driverTypeList.map(item => item.label).join(",");
      let typeList = this.detailInfo.driverTypeList;
      if (typeList && typeList.length > 0) {
        res = typeList.map(item => driverTypeMap[item]).join(",");
      }
      return res;
    }
  },
  watch: {
    popView: function() {
      if (this.popView) {
        this.getCitys();
        this.getsalaryTypeList();
        this.opGroup = JSON.parse(localStorage.getItem("pcOperatorList"));
        this.announceStatusMap = announceStatusMap;
        this.announcePositionMap = announcePositionMap;
        this.announceTypeMap = announceTypeMap;
      }
    }
  },
  methods: {
    checkImg() {
      this.showImg = true;
    },
    backOneStep() {
      this.$router.push({
        name: "announcement-center"
      });
    },
    getCitys() {
      getCitys().then(res => {
        this.cityList = res.data.data;
        this.loading = false;
      });
    },
    getsalaryTypeList() {
      this.targetTypeName = "";
      salaryTypeList({}).then(res => {
        let resData = res.data.data || {};
        let salaryTypeArr = this.detailInfo.salaryType.split(",")
        let targetTypeNameArr = []
        resData.forEach(item => {
          if (salaryTypeArr.indexOf(item.itemcode) > -1) {
            targetTypeNameArr.push(item.itemvalue);
          }
        });
        this.targetTypeName = targetTypeNameArr.join(",") || ""
      });
    }
  }
};
</script>
