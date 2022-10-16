<template>
  <Card>
    <p slot="title">工单描述</p>
    <Row :gutter="16">
      <Col span="6">
        <div>工单编号：{{ basicInfo.woCode }}</div>
      </Col>
      <Col span="6">
        <div>一级工单分类：{{ basicInfo.categoryFirstDesc }}</div>
      </Col>
      <Col span="6">
        <div>
          二级工单分类：{{
            basicInfo.categorySecondDesc == "GDGD"
              ? "高德工单"
              : basicInfo.categorySecondDesc
          }}
        </div>
      </Col>
      <Col span="6">
        <div>创建时间：{{ basicInfo.createTime }}</div>
      </Col>
    </Row>
    <br />
    <Row :gutter="16">
      <Col span="6">
        <div>城市：{{ basicInfo.cityName }}</div>
      </Col>
      <Col span="6">
        <div>运营商：{{ basicInfo.agentName }}</div>
      </Col>
      <Col span="6">
        <div>司机UID：{{ basicInfo.driverId }}</div>
      </Col>
      <Col span="6">
        <div>司机Code：{{ basicInfo.driverNo }}</div>
      </Col>
    </Row>
    <br />
    <Row :gutter="16">
      <Col span="6">
        <div>司机姓名：{{ basicInfo.driverName }}</div>
      </Col>
      <Col span="6">
        <div>司机类型：{{ driverTypeMap[basicInfo.driverType] }}</div>
      </Col>
      <Col span="6">
        <div>车牌号：{{ basicInfo.carNumber }}</div>
      </Col>
      <Col span="6">
        <div>车辆VIN码：{{ basicInfo.carVin }}</div>
      </Col>
    </Row>
    <br />
    <Row :gutter="16" v-if="basicInfo.woType == 'SF'">
      <Col span="6" v-if="basicInfo.appealEndTime">
        高德申诉截止时间：{{ basicInfo.appealEndTime }}
      </Col>
      <Col span="6" v-if="basicInfo.banFlag == 1">
        高德封禁时间：{{ basicInfo.banTime }}
      </Col>
    </Row>
    <Row :gutter="16" v-if="basicInfo.bizState === 'SJ_CITY'">
      <br />
      <Col span="6">
        <div>违规描述：{{ basicInfo.illegalMsg }}</div>
      </Col>
    </Row>
    <br />
  </Card>
</template>

<script>
// SECOND_DP("WGGD", "DP", "违规工单"),
// SECOND_FK("FKGD", "FK", "风控工单"),
// SECOND_KS("KSGD", "KS", "客服判责工单"),
// SECOND_KS_TAG("KSGD", "KS_TAG", "客服判责工单");
import relatedVideo from "../components/relatedVideo";
import ViewPicture from "../components/ViewPicture";
import ViewVideo from "../components/ViewVideo";
import {
  tableColumns,
  audioTableColumns,
  audioSiChengColumns,
} from "./fields.js";
import { woSourceMap } from "../fields";
import m2Table from "_a/m2-table/v-table";
import FlvPlayer from "_c/flv-player";
import { fetchHistBySameOrder } from "_o/api/work-order/wo-detail";
export default {
  components: {
    FlvPlayer,
    relatedVideo,
    ViewPicture,
    ViewVideo,
    m2Table,
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => ({}),
    },
    // code: {
    //   type: Number,
    //   default: 0
    // },
    subListInfo: {
      type: Object,
      default: () => {
        return {
          total: 0,
          current: 1,
          pageSize: 10,
          tableData: [],
        };
      },
    },
    audioListInfo: {
      type: Object,
      default: () => {
        return {
          total: 0,
          current: 1,
          pageSize: 10,
          tableData: [],
        };
      },
    },
    audioSiChengListInfo: {
      type: Object,
      default: () => {
        return {
          total: 0,
          current: 1,
          pageSize: 10,
          tableData: [],
        };
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentDpVideoList: [],
      currentDpVideoUrl: "",
      videoModalIsShow: false,
      isFinish: false,
      imgVisible: false,
      currentHoverPicUrl: "",
      viewHoverPic: false,
      isDp: false,
      isFk: false,
      isKs: false,
      pics: [],
      largePic: "",
      tableColumns: tableColumns(this),
      audioTableColumns: audioTableColumns(this),
      audioSiChengColumns: audioSiChengColumns(this),
      driverTypeMap: {
        1: "A模式",
        2: "UP模式",
        10: "自营司机",
        20: "自营-主司机",
        30: "自营-副司机",
        40: "自营-顶班司机",
        50: "UP-司机",
        60: "UP-主司机",
        70: "UP-副司机",
        80: "UP-顶班司机",
        90: "UP-带车加盟",
      },
      // 1028新增
      typeTimeMap: {
        1: "实时",
        2: "预约",
      },
      historyList: [], // 同一订单历史工单
    };
  },

  watch: {
    basicInfo() {
      const { woType } = this.basicInfo;
      if (woType === "FK") {
        this.isFk = true;
      } else if (woType === "DP") {
        this.isDp = true;
      } else if (woType === "KS") {
        this.isKs = true;
      }
      // this.getHistoryWorkOrder()
    },
  },

  created() {},
  methods: {
    // async getHistoryWorkOrder() {
    //   let {routePlanNo, woCode,} = this.basicInfo
    //   if(!routePlanNo) return
    //   let p = {
    //     orderNo: routePlanNo,
    //     woCode
    //   }
    //   const {
    //       data: { success, data}
    //     } = await fetchHistBySameOrder(p)
    //     if(!success) {
    //       return
    //     }
    //     this.historyList = data
    // },
    toOrderDetail(woCode) {
      this.$router.replace({
        name: "illegal-order-detail",
        query: {
          woCode,
        },
      });
    },
    viewOrder() {
      const { routePlanId, expandBizLine, typeModule } = this.basicInfo;
      if (!routePlanId) {
        this.$Message.info("暂无订单信息");
        return;
      }
      if (typeModule === 1) {
        this.$Message.info("出租车订单，无法跳转");
        return;
      }
      let name = "order-detail";
      //   if(expandBizLine === 2){  // 包车
      //     name = "chartered-order-detail";
      //   }else {
      //      name = "order-detail";
      //   }
      this.$router.push({
        name: name,
        params: { id: routePlanId },
      });
    },
    // viewPic(index) {
    //   this.largePic = this.basicInfo.pictures[index].value;
    //   this.imgVisible = !this.imgVisible;
    // },
    // changePage(val) {
    //   this.$emit("changesubpage", val)
    // },
    // changePageSize(val) {
    //   this.$emit("changesubpagesize", val)
    // },
    // changeAudioPage(val) {
    //   this.$emit("changeAudioPage", val)
    // },
    // changeAudioPageSize(val) {
    //   this.$emit("changeAudioPageSize", val)
    // },
    // showHoverPic(url) {
    //   this.currentHoverPicUrl = url
    //   this.viewHoverPic = true;
    // },
    // showVideoModal(videos) {
    //   this.currentDpVideoList = videos
    //   this.currentDpVideoUrl = videos[0].value
    //   this.videoModalIsShow = true
    // },
    // selectDpVideo(video) {
    //   this.currentDpVideoUrl = video.value
    // }
  },
};
</script>

<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.doneLogo {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  border: 1px solid #2b85e4;
  position: absolute;
  top: 5%;
  right: 5%;
  span {
    position: absolute;
    top: 36%;
    left: 22%;
    color: #2b85e4;
    font-weight: 600;
    font-size: 18px;
  }
}
.pics {
  margin: 10px 0;
  .pic {
    width: 150px;
    margin: 0 15px 0 0;
    text-align: center;
    // border: 1px dashed #dcdee2;
    border-radius: 4px;
    cursor: pointer;
    vertical-align: top;
  }
}
.view {
  margin: 10px 0;
}
.cp {
}

.videoContent {
  display: flex;
  .left {
  }
  .right {
    width: 250px;
    margin-left: 20px;
    height: 560px;
    overflow: auto;
    .item {
      margin-bottom: 10px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
