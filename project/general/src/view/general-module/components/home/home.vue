<template>
  <div>
    <div class="versionfont">
      {{ENVMSG}}
    </div>
    <Row :gutter="20">
      <i-col
        v-for="(infor, i) in inforCardData"
        :key="i"
        :xs="12"
        :md="8"
        :lg="4"
        :bind_key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card
          shadow
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
        >
          <count-to
            :end="infor.count"
            count-class="count-style"
          />
          <p>{{infor.title}}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row
      :gutter="20"
      style="margin-top: 10px;"
    >
      <i-col
        :md="24"
        :lg="8"
        style="margin-bottom: 20px;"
      >
        <Card shadow>
          <chart-pie
            style="height: 300px;"
            :value="pieData"
            text="用户访问来源"
          />
        </Card>
      </i-col>
      <i-col
        :md="24"
        :lg="16"
        style="margin-bottom: 20px;"
      >
        <Card shadow>
          <chart-bar
            style="height: 300px;"
            :value="barData"
            text="每周用户活跃量"
          />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
import config from "@/config/config";
export default {
  name: "Home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data() {
    return {
      inforCardData: [
        {
          title: "新增用户",
          icon: "md-person-add",
          count: 803,
          color: "#2d8cf0"
        },
        { title: "累计点击", icon: "md-locate", count: 232, color: "#19be6b" },
        {
          title: "新增问答",
          icon: "md-help-circle",
          count: 142,
          color: "#ff9900"
        },
        { title: "分享统计", icon: "md-share", count: 657, color: "#ed3f14" },
        {
          title: "新增互动",
          icon: "md-chatbubbles",
          count: 12,
          color: "#E46CBB"
        },
        { title: "新增页面", icon: "md-map", count: 14, color: "#9A66E4" }
      ],
      pieData: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      ENVMSG: ""
    };
  },
  beforeCreate() {
    if (sessionStorage.getItem("HOME-RELOAD-ONCE")) {
      sessionStorage.removeItem("HOME-RELOAD-ONCE")
      // 强制刷新一把
      window.location.reload(true);
    }
  },
  mounted() {
    this.getEnvMsg();
  },
  methods: {
    getEnvMsg() {
      if (window.location.host === "172.16.19.201:8080") {
        // local环境
        this.ENVMSG = "local环境：" + config.version.pro;
      } else if (window.location.host === "172.16.1.33") {
        // 开发环境
        this.ENVMSG = "开发环境：" + config.version.pro;
      } else if (window.location.host === "10.3.97.243") {
        // 测试环境
        this.ENVMSG = "测试环境：" + config.version.pro;
      } else if (window.location.host === "172.16.2.209") {
        // 热修复环境
        this.ENVMSG = "热修复环境：" + config.version.pro;
      } else if (window.location.host === "47.111.63.123") {
        // uat环境
        this.ENVMSG = "uat环境：" + config.version.pro;
      } else if (window.location.host === "172.16.50.130") {
        // 压测环境
        this.ENVMSG = "压测环境：" + config.version.pro;
      } else if (window.location.host === "172.16.19.201:8080") {
        // 等保环境
        this.ENVMSG = "等保环境：" + config.version.pro;
      } else if (window.location.host === "10.0.2.149") {
        // 生产环境
        this.ENVMSG = "生产环境：" + config.version.pro;
      } else {
        this.ENVMSG = "未知环境：" + config.version.pro;
      }
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
.versionfont {
  font-size: 20px;
  color: #000;
  letter-spacing: 2px;
  padding-bottom: 20px;
}
</style>
