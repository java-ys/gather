<template>
  <div class="announcement-detail">
    <Modal
      v-model="show"
      :width="570"
      footer-hide
      title="乘客消息中心详情"
      :mask-closable="false"
    >
      <Form :label-width="120">
        <FormItem label="公告状态：">
          <span>{{ detailInfo.status | statusF }}</span>
        </FormItem>
        <FormItem label="公告编码：">
          <span>{{ detailInfo.noticeCode }}</span>
        </FormItem>

        <FormItem label="发送范围：">
          <span
            class="range-c"
            :key="index"
            v-for="(item, index) in cityRange"
            >{{ item }}</span
          >
        </FormItem>
        <FormItem label="公告类型：">
          <span>{{ detailInfo.noticeType | noticeTypeF }}</span>
        </FormItem>
        <FormItem v-if="isNews" label="发布类目：">
          <span>{{ detailInfo.publishMenuName }}</span>
        </FormItem>
        <FormItem label="公告标题：">
          <span>{{ detailInfo.noticeTitle }}</span>
        </FormItem>
        <FormItem label="公告副标题：">
          <span>{{ detailInfo.noticeSubTitle }}</span>
        </FormItem>
        <FormItem label="公告banner图：">
          <Button
            shape="circle"
            v-if="detailInfo.noticeBanner"
            icon="ios-search"
            @click="checkImg"
            >查看图片</Button
          >
          <Modal v-model="showImg" title="View Image" width="700">
            <img :src="detailInfo.noticeBanner" alt="" style="width: 100%" />
          </Modal>
        </FormItem>
        <FormItem label="跳转链接：">
          <span>{{ detailInfo.noticeLink }}</span>
        </FormItem>
        <FormItem label="时间段：">
          <span>{{ detailInfo.upTime }} - {{ detailInfo.downTime }}</span>
        </FormItem>
        <FormItem label="创建人：">
          <span>{{ detailInfo.creator }}</span>
        </FormItem>
        <FormItem label="创建时间：">
          <span>{{ detailInfo.createTime }}</span>
        </FormItem>
        <FormItem
          v-if="detailInfo.updater !== '' && detailInfo.updater !== null"
          label="撤销人："
        >
          <span>{{ detailInfo.updater }}</span>
        </FormItem>
        <FormItem
          v-if="detailInfo.updater !== '' && detailInfo.updater !== null"
          label="撤销时间："
        >
          <span>{{ detailInfo.updateTime }}</span>
        </FormItem>
        <FormItem label="已读人数：">
          <span>{{ detailInfo.haveRead }}</span>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getCitys } from "_g/api/common.js";
import { announceStatusMap, noticeTypeList } from "../fields";

const NEWS_VALUE = 11; // 订阅消息类型
export default {
  name: "notice-detail",
  filters: {
    statusF(v) {
      return announceStatusMap[v];
    },
    noticeTypeF(v) {
      let f = noticeTypeList.find(it => it.value - v === 0);
      return f ? f.label : "";
    }
  },
  computed: {
    isNews({detailInfo}) {
      return detailInfo.noticeType - NEWS_VALUE === 0
    }
  },
  data() {
    return {
      showImg: false,
      show: false,
      detailInfo: {},
      targetTypeName: "",
      cityRange: []
    };
  },
  methods: {
    init(p = {}) {
      this.detailInfo = p;
      this.getCityList();
      this.show = true;
    },
    async getCityList() {
      const { data } = await getCitys();
      this.cityRange = this.detailInfo.target
        .map(t => {
          let f = data.data.find(c => c.cityID === t);
          return f ? f.city : "";
        })
        .filter(Boolean);
    },
    checkImg() {
      this.showImg = true;
    }
  }
};
</script>

<style scoped lang="less">
.range-c {
  display: inline-block;
  height: 24px;
  line-height: 22px;
  margin: 3px 4px 3px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
}
</style>
