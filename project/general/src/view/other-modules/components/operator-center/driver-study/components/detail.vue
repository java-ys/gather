<template>
  <div>
    <Modal
      v-model="show"
      width="44%"
      title="详情"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <Row>
        <Col span="12">
          <div class="con">
            <p class="t">学习任务名称</p>
            <p class="c">{{ pageData.learningTaskName }}</p>
          </div>
        </Col>
        <Col span="12">
          <div class="con">
            <p>主题图</p>
            <p class="main-img">
              <img
                class="mt-10"
                v-if="pageData.imageUrl"
                :src="pageData.imageUrl"
                alt="主题图"
              />
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <div class="con">
            <p>上线时间</p>
            <p class="c">{{ pageData.publishTime }}</p>
          </div>
        </Col>
        <Col span="8">
          <div class="con">
            <p>下线时间</p>
            <p class="c">{{ pageData.offTime }}</p>
          </div>
        </Col>
        <Col span="8">
          <div class="con">
            <p>学习分类</p>
            <p class="c">{{ pageData.cataName }}</p>
          </div>
        </Col>
      </Row>
      <div class="con">
        <p>学习对象</p>
        <div v-if="pageData.matchType - 2 === 0">
          <Row>
            <Col span="12"
              ><p class="c">
                城市/运营商:
                {{ pageData.conditionCityCode | cityF(cityList) }} /
                {{ pageData.conditionAgentId | agentF(agentList) }}
              </p></Col
            >
            <Col span="12"
              ><p class="c">司管: {{ managerName }}</p></Col
            >
          </Row>
          <Row>
            <Col span="12"
              ><p class="c">
                司机类型: {{ pageData.conditionDriverType | typeF }}
              </p></Col
            >
            <Col span="12"
              ><p class="c">
                司机模式: {{ pageData.conditionDriverOperationType | modelF }}
              </p></Col
            >
          </Row>
        </div>
        <div v-else>
          <p class="tt">{{ pageData.personDesc }}</p>
          <div class="bor">
            <p class="c">{{ pageData.person }}</p>
          </div>
        </div>
      </div>
      <div class="con">
        <p>学习内容</p>
        <div class="bor">
          <div v-if="pageData.imageFileUuid">
            <p class="c">图文类</p>
            <p class="mt-10">
              <!-- <a :href="pageData.imageFileUrl" target="_blank">{{
                pageData.imageFileName
              }}</a> -->
              <a @click="openPDF">{{ pageData.imageFileName }}</a>
            </p>
          </div>
          <div v-if="pageData.videoFileUuid">
            <p class="c">视频类</p>
            <p class="mt-10">
              <!-- <a :href="pageData.videoFileUrl" target="_blank">{{
                pageData.videoFileName
              }}</a> -->
              <a @click="openVideo">{{ pageData.videoFileName }}</a>
            </p>
          </div>
        </div>
      </div>
      <Row>
        <div class="con">
          <p v-if="pageData.imageFileUuid">
            每页阅读 {{ pageData.pageTimeLimit }} 秒可翻页
          </p>
          <p v-if="pageData.videoFileUuid">
            每隔 {{ pageData.videoTipTime }} 分钟弹拼图弹窗
          </p>
        </div>
      </Row>
      <Row>
        <div class="con">
          <p>
            是否必学:
            {{ pageData.isMust && pageData.isMust - 1 === 0 ? "是" : "否" }}
          </p>
        </div>
      </Row>
    </Modal>
  </div>
</template>

<script>
import s from "_o/api/study-exam";
import { tool, isFunc, getObjKeys } from "_o/api/baseMixin.js";
import { getImageUrl, getVideoUrl } from "../common";
import { driverModel, driverType } from "../fields.js";
import { queryDriverManagerUser } from "_o/api/m2-driver-api/common";

// todo 城市运营商 司管 code -> 名称
const allKey = {
  learningTaskName: "",
  themeFileUuid: "",
  themeFileName: "",
  imageFileUuid: "",
  imageFileName: "",
  videoFileUuid: "",
  videoFileName: "",
  publishTime: "",
  imageUrl: "",
  imageFileUrl: "",
  videoFileUrl: "",
  person: "",
  personDesc: "",

  cataName: "",
  offTime: "",
  isMust: "",
  matchType: "",
  pageTimeLimit: "",
  videoTipTime: "",
  conditionAgentId: "",
  conditionCityCode: "",
  conditionDriverManagerId: "",
  conditionDriverOperationType: "",
  conditionDriverType: "",
};

export default {
  props: ["visible", "modalData"],
  mixins: [tool],
  data() {
    return {
      pageData: {
        ...allKey,
      },
      show: this.visible,
      managerName: "", // 司管中文名
    };
  },
  created() {
    let _agentList = JSON.parse(localStorage.getItem("pcOperatorList"));
    // console.log(_agentList, "a1");
    this.provinceAndCityAndAgent = _agentList;
    let cityL = [];
    _agentList.forEach((it) => {
      if (it.children) {
        it.children.forEach((item) => {
          cityL = [
            ...cityL,
            {
              label: item.label,
              value: item.value,
              uuid: item.uuid,
              title: item.title,
              cityFather: item.cityFather,
            },
          ];
        });
      }
    });
    this.cityList = cityL;
    let arr = [];
    _agentList.forEach((it) => {
      it.children &&
        it.children.forEach((item) => {
          arr = [...arr, ...item.children];
        });
    });
    this.agentList = arr;
  },
  filters: {
    typeF(v) {
      let f = driverType.find((it) => it.value - v === 0);
      return f ? f.label : "";
    },
    modelF(v) {
      let f = driverModel.find((it) => it.value - v === 0);
      return f ? f.label : "";
    },
    cityF(v, list = []) {
      let f =
        list.find((it) => it.uuid === v) || list.find((it) => it.value === v);
      return f ? f.label || f.title : "";
    },
    agentF(v, list = []) {
      let f = list.find((it) => it.uuid === v);
      return f ? f.label || f.title : "";
    },
    managerF(v) {},
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        if (this.modalData && this.modalData.id) {
          this.getDetail();
        }
      } else {
        this.initData();
      }
    },
  },
  methods: {
    async getDetail() {
      const [err, data] = await this.toResult(
        s.studyDetail({ id: this.modalData.id })
      );
      if (err || !data) {
        return;
      }
      this.setPageData(data).setUrlData(data);
      this.getDriverManager(data.conditionAgentId);
    },
    // 根据运营商id 获取司管列表
    async getDriverManager(agentId) {
      const { data, msg } = await queryDriverManagerUser({ agentId });
      if (!data.success) return this.$Message.error(msg);
      if (data.data) {
        let f = data.data.find(
          (it) => it.uuid === this.pageData.conditionDriverManagerId
        );
        this.managerName = f ? f.realName : "";
      }
    },
    fetchImage(p, successCb, errorCb) {
      getImageUrl({ baseUrl: this._uploadUrl, ...p }, ({ data }) => {
        if (data.success) {
          isFunc(successCb) && successCb(data.data);
        } else {
          this.$Message.error(data.msg);
        }
      });
    },
    fetchVideo(p, successCb, errorCb) {
      getVideoUrl({ baseUrl: this._uploadUrl, ...p }, ({ data }) => {
        if (data.success) {
          if (!data.data || data.data == 20) {
            this.$Message.info(data.msg);
            return;
          }
          isFunc(successCb) && successCb(data.data);
        } else {
          this.$Message.error(data.msg);
        }
      });
    },
    setPageData(data) {
      getObjKeys(allKey).forEach((it) => {
        if (data[it] || data[it] !== "") {
          this.pageData[it] = data[it];
        }
      });

      const { agentNameList, driverNoList } = data;
      if (agentNameList && agentNameList.length) {
        this.pageData.person = agentNameList.join(",");
        this.pageData.personDesc = "指定运营商";
      }
      if (driverNoList && driverNoList.length) {
        this.pageData.person = driverNoList.join(",");
        this.pageData.personDesc = "指定司机";
      }
      return this;
    },
    setUrlData({ themeFileUuid, imageFileUuid, videoFileUuid }) {
      if (themeFileUuid) {
        this.fetchImage({ uuid: themeFileUuid }, (url) => {
          this.pageData.imageUrl = url;
        });
      }
      if (imageFileUuid) {
        this.fetchImage({ uuid: imageFileUuid }, (url) => {
          this.pageData.imageFileUrl = url;
        });
      }
      if (videoFileUuid) {
        this.fetchVideo({ uuid: videoFileUuid }, (url) => {
          this.pageData.videoFileUrl = url;
        });
      }
    },
    cancel() {
      this.$emit("close");
    },
    initData() {
      getObjKeys(allKey).forEach((it) => {
        this.pageData[it] = allKey[it];
      });
    },
    openPDF() {
      if (!this.pageData.imageFileUrl) {
        this.$Message.info("PDF加载中，请稍后");
        return;
      }
      window.open(this.pageData.imageFileUrl);
    },
    openVideo() {
      if (!this.pageData.videoFileUrl) {
        this.$Message.info("视频解码中，请稍后");
        return;
      }
      window.open(this.pageData.videoFileUrl);
    },
  },
};
</script>

<style scoped lang="less">
@border-color: #dcdee2;

.mt-10 {
  margin-top: 10px;
}
.con {
  font-size: 16px;
  margin-bottom: 40px;
}
.c {
  color: #999;
  font-size: 15px;
  margin-top: 8px;
}
.bor {
  margin-top: 16px;
  height: 140px;
  padding: 10px;
  border: 1px solid @border-color;
  border-radius: 4px;
}
.main-img {
  width: 262px;
  height: 122px;
  display: inline-block;
  & > img {
    width: 100%;
    height: 100%;
  }
}
.tt {
  margin-top: 10px;
  font-size: 12px;
}
</style>
