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
        <div>三级工单分类：{{ basicInfo.categoryThirdDesc }}</div>
      </Col>
    </Row>
    <br />
    <Row :gutter="16">
      <Col span="6">
        <div>四级工单分类：{{ basicInfo.categoryFourthDesc }}</div>
      </Col>
      <Col span="6">
        <div>
          工单来源：{{
            basicInfo.orderSourceName ? basicInfo.orderSourceName : "/"
          }}
        </div>
      </Col>
      <Col v-if="basicInfo.punishDesc" span="6"
        >自动处理状态：{{ basicInfo.punishDesc }}</Col
      >
      <Col v-if="basicInfo.woType == 'SF' && basicInfo.banFlag == 1" span="6"
        >高德封禁时间：{{ basicInfo.banTime }}</Col
      >
    </Row>
    <br />
    <Row :gutter="16">
      <Col v-if="isDp" span="6"></Col>
      <Col v-else span="6">
        关联订单编号：{{ basicInfo.routePlanNo || basicInfo.orderNum }}
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
    </Row>
    <br />
    <Row :gutter="16">
      <!-- 监控大屏才显示的    -->
      <Col v-if="isDp" span="6">
        <div>司机模式： {{ driverTypeMap[basicInfo.driverType] }}</div>
      </Col>
      <Col span="6">
        <div>车牌号：{{ basicInfo.carNumber }}</div>
      </Col>
      <Col span="6">
        <div>车辆VIN码：{{ basicInfo.carVin }}</div>
      </Col>
      <!-- 客诉才显示的 -->
      <Col v-if="isKs">
        <div>违规时间：{{ basicInfo.illegalTime }}</div>
      </Col>
      <!-- 风控才显示的 -->
      <Col v-if="isLZOrder || (isFk && !isRisk)" span="6">
        <div>乘客姓名：{{ basicInfo.passengerName }}</div>
      </Col>
      <!-- 风控才显示 -->
      <Col v-if="isFk && !isRisk" span="6">
        司乘相同订单数：{{ basicInfo.passengerOrders }}个
      </Col>
    </Row>
    <br />
    <Row :gutter="16" v-if="!isRisk && !isLZOrder">
      <Col span="6">
        订单详情：<Button type="primary" @click="viewOrder">点击跳转</Button>
      </Col>
      <Col span="6">
        <Tooltip placement="right" v-if="historyList.length">
          <Button type="primary">已判责: {{ historyList.length }}</Button>
          <div slot="content">
            <p
              class="cp"
              @click="toOrderDetail(item)"
              :key="index"
              v-for="(item, index) in historyList"
            >
              {{ item }}
            </p>
          </div>
        </Tooltip>
      </Col>
      <Col span="6"> 订单类型：{{ typeTimeMap[basicInfo.typeTime] }} </Col>
      <Col span="6"> 订单来源：{{ basicInfo.sourceDesc }} </Col>
    </Row>
    <br />
    <Row v-if="basicInfo.woType == 'SF' && basicInfo.appealEndTime">
      <Col span="6"> 高德申诉截止时间：{{ basicInfo.appealEndTime }} </Col>
    </Row>
    <br />
    <Row>
      <Col v-if="isKs">
        <div>投诉内容：{{ basicInfo.illegalMsg }}</div>
      </Col>
      <Col v-else>
        <div>问题描述：{{ basicInfo.illegalMsg }}</div>
      </Col>
    </Row>
    <div v-if="driverReports.length">
      <br />
      <div style="margin-bottom: 1em">报备信息</div>
      <template v-for="(v, i) of driverReports">
        <Row :key="'head' + i" :gutter="16">
          <template v-if="!i">
            <Col span="6">关联订单号：{{ v.routePlanNo }}</Col>
            <Col span="6">报备类型：{{ v.reportTypeDesc }}</Col>
          </template>
          <Col span="6">{{ i ? "补报" : "报备" }}时间：{{ v.reportTime }}</Col>
        </Row>
        <Row :key="'detail' + i" style="margin: 1em 0">
          <Col>{{ i ? "补报" : "报备" }}详情：{{ v.reportDesc }}</Col>
        </Row>
        <Row v-if="v.radioId" :key="'audio' + i" style="margin-bottom: 1em">
          <Col>
            报备语音：
            <Icon
              v-if="audios[i]"
              type="md-pause"
              size="24"
              @click="onStopAudio(i)"
            />
            <Icon
              v-else
              type="md-arrow-dropright-circle"
              size="24"
              @click="onPlayAudio(v.radioId, i)"
            />
          </Col>
        </Row>
        <div v-if="v.enclosures && v.enclosures.length" :key="'media' + i">
          <div style="margin-bottom: 1em">{{ i ? "补报" : "报备" }}照片</div>
          <div @click="onPreview">
            <img
              v-for="o of v.enclosures"
              :key="o.fileId"
              :src="o.fileUrl"
              alt="图片"
              style="
                margin: 0 10px 10px 0;
                width: 100px;
                height: 100px;
                cursor: zoom-in;
              "
            />
          </div>
        </div>
      </template>
    </div>
    <br />
    <template v-if="isLZOrder">
      <Row v-if="basicInfo.pictures || basicInfo.videos">
        <span>相关图片和视频：</span>
        <Col>
          <ViewPicture
            :type="'carousel'"
            :data="basicInfo.pictures"
            class="view"
          ></ViewPicture>
          <ViewVideo :data="basicInfo.videos"></ViewVideo>
        </Col>
      </Row>
    </template>
    <template v-else>
      <div v-if="isRisk">
        <risk-list :basicInfo="basicInfo"></risk-list>
      </div>
      <div v-else>
        <!-- 监控大屏才显示的    -->
        <Row v-if="isDp">
          <div>报警明细：</div>
          <m2-table
            :total="subListInfo.total"
            :current="subListInfo.current"
            :pageSize="subListInfo.pageSize"
            :isLoading="isLoading"
            :parColumns="tableColumns"
            :parTableData="subListInfo.tableData"
            :height="260"
            style="margin-top: 12px"
            @changePage="changePage"
            @changePageSize="changePageSize"
          ></m2-table>
        </Row>
        <div
          v-if="basicInfo.runState === 'FINISH'"
          :class="basicInfo.runState === 'FINISH' ? 'doneLogo' : ''"
        >
          <span>已办结</span>
        </div>
        <Row v-if="audioListInfo.total > 0">
          <div>相关录音：</div>
          <m2-table
            :total="audioListInfo.total"
            :current="audioListInfo.current"
            :pageSize="audioListInfo.pageSize"
            :isLoading="isLoading"
            :parColumns="audioTableColumns"
            :parTableData="audioListInfo.tableData"
            style="margin-top: 12px"
            :height="260"
            @changePage="changeAudioPage"
            @changePageSize="changeAudioPageSize"
          ></m2-table>
        </Row>
        <Row>
          <div>司乘通话录音：</div>
          <m2-table
            :total="audioSiChengListInfo.total"
            :current="audioSiChengListInfo.current"
            :pageSize="audioSiChengListInfo.pageSize"
            :isLoading="isLoading"
            :parColumns="audioSiChengColumns"
            :parTableData="audioSiChengListInfo.tableData"
            style="margin-top: 12px"
            :height="260"
          ></m2-table>
        </Row>
        <Row>
          <br />
          <span>相关图片和视频：</span>
          <Col>
            <ViewPicture
              :type="'carousel'"
              :data="basicInfo.pictures"
              class="view"
            ></ViewPicture>
            <ViewVideo :data="basicInfo.videos"></ViewVideo>
          </Col>
        </Row>
        <!-- 其他视频 -->
        <relatedVideo :basicInfo="basicInfo"></relatedVideo>
      </div>
    </template>
    <!-- <Modal title="查看大图" v-model="imgVisible">
      <img :src="largePic" style="width: 100%" />
    </Modal> -->
    <Modal v-model="viewHoverPic" title="查看大图" :width="800">
      <img :src="currentHoverPicUrl" style="width: 90%; margin: 0 auoto" />
    </Modal>

    <Modal v-model="videoModalIsShow" title="视频" :width="1200">
      <div class="videoContent">
        <div class="left">
          <flv-player
            id="online"
            ref="online"
            videoText
            :src="currentDpVideoUrl"
            :onLine="false"
            :width="850"
            :height="500"
            :isAlarm="true"
          ></flv-player>
        </div>
        <div class="right">
          <div
            v-for="(item, index) in currentDpVideoList"
            :key="item.key"
            class="item"
          >
            <div @click="selectDpVideo(item)">
              <img src="./assets/smallPic.png" alt />
            </div>
            <p class="time-range">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </Modal>

    <!--<Modal v-model="viewVideo" title="视频">-->
    <!---->
    <!--</Modal>-->
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
import {
  fetchHistBySameOrder,
  queryFilesMeta,
  queryFileURLById,
} from "_o/api/work-order/wo-detail";
import riskList from "./order/index.vue";

export default {
  name: "describe",
  components: {
    FlvPlayer,
    relatedVideo,
    ViewPicture,
    ViewVideo,
    m2Table,
    riskList,
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => ({}),
    },
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
    driverReports: {
      type: Array,
      default: () => [],
    },
    isLZOrder: Boolean,
  },
  data() {
    return {
      audios: [],
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
      isRisk: false, // 是否展示风控明细
      historyList: [], // 同一订单历史工单
    };
  },

  watch: {
    basicInfo() {
      const { woType, newDataFlag } = this.basicInfo;
      this.isRisk = !!newDataFlag;
      // console.log(this.basicInfo)
      if (woType === "FK") {
        this.isFk = true;
      } else if (woType === "DP") {
        this.isDp = true;
      } else if (woType === "KS") {
        this.isKs = true;
      }
      this.getHistoryWorkOrder();
    },
    driverReports(arr) {
      this.audios = Array.from({ length: arr.length }, () => false);
    },
  },

  created() {},
  methods: {
    async getHistoryWorkOrder() {
      let { routePlanNo, woCode } = this.basicInfo;
      if (!routePlanNo) return;
      let p = {
        orderNo: routePlanNo,
        woCode,
      };
      const {
        data: { success, data },
      } = await fetchHistBySameOrder(p);
      if (!success) {
        return;
      }
      this.historyList = data;
    },
    toOrderDetail(woCode) {
      this.$router.replace({
        name: "work-order-detail",
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
    viewPic(index) {
      this.largePic = this.basicInfo.pictures[index].value;
      this.imgVisible = !this.imgVisible;
    },
    changePage(val) {
      this.$emit("changesubpage", val);
    },
    changePageSize(val) {
      this.$emit("changesubpagesize", val);
    },
    changeAudioPage(val) {
      this.$emit("changeAudioPage", val);
    },
    changeAudioPageSize(val) {
      this.$emit("changeAudioPageSize", val);
    },
    showHoverPic(url) {
      this.currentHoverPicUrl = url;
      this.viewHoverPic = true;
    },
    showVideoModal(videos) {
      queryFileURLById(videos[0].key).then(
        (res) => (this.currentDpVideoUrl = res.data.data)
      );
      queryFilesMeta({ uuids: videos.map((v) => v.key) }).then((res) => {
        this.currentDpVideoList = videos.map((v) => ({
          ...v,
          name: res.data.data[v.key].fileName,
        }));
        this.videoModalIsShow = true;
      });
    },
    selectDpVideo(video) {
      queryFileURLById(video.key).then(
        (res) => (this.currentDpVideoUrl = res.data.data)
      );
    },
    onPreview({ target: { src } }) {
      if (src) this.showHoverPic(src);
    },
    onPlayAudio(id, index) {
      const el = document.getElementById("work_order_report_audio_" + index);
      queryFileURLById(id).then((res) => {
        const audio = el || document.createElement("audio");
        if (!el) {
          audio.addEventListener("ended", () => {
            audio.currentTime = 0;
            this.onStopAudio(index);
          });
          audio.id = "work_order_report_audio_" + index;
          audio.style.display = "none";
          document.body.appendChild(audio);
        }
        if (audio.src !== res.data.data) audio.src = res.data.data;
        audio.play();
        this.audios = this.audios.map((_, i) => i === index);
        this.$forceUpdate();
      });
    },
    onStopAudio(index) {
      const el = document.getElementById("work_order_report_audio_" + index);
      this.audios[index] = false;
      el.pause();
      this.$forceUpdate();
    },
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
