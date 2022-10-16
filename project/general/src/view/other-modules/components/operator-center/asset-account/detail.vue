<template>
  <div class="driver-configure">
    <Tabs :value="tabValue" @on-click="tabschange" name="main">
      <Tab-pane tab="main" label="基本信息配置" name="tab1" key="mainTab1">
        <div class="basic-info">
          <Form :model="detailList" label-position="left">
            <FormItem label="活动名称：">{{detailList.activityName}}</FormItem>
            <FormItem label="类型：">{{statusFormatter(detailList.configType)}}</FormItem>
            <FormItem label="活动城市：">{{provinceName}}-{{cityName}}</FormItem>
          </Form>
        </div>
        <div class="btn-box" v-if="tabValue == 'tab1'">
          <Button @click="handleReset()">
            关闭
          </Button>
          <Button type="primary" style="margin-left: 10px" @click="tabValue = 'tab2';">
            下一页
          </Button>
        </div>
      </Tab-pane>
      <Tab-pane tab="main" label="分享配置" :disabled="isTab2Dis" name="tab2" key="mainTab2">
        <div class="share-info">
          <Form :model="detailList" label-position="left">
            <div style="margin-bottom:10px;border-bottom:2px solid #ccc">
              <h1 class="shareTitle">分享方式</h1>
              <div style="margin-left:50px;">
                <FormItem class="requireStar" label="分享给朋友：" prop="shareFriendType">
                  <RadioGroup v-model="detailList.shareFriendType">
                    <Radio :disabled="isDetail" :label="1">H5链接</Radio>
                    <Radio :disabled="isDetail" :label="2">小程序卡片</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem class="requireStar" label="分享到朋友圈：" prop="shareWeChatType">
                  <RadioGroup v-model="detailList.shareWeChatType">
                    <Radio :disabled="isDetail" :label="1">H5链接</Radio>
                    <Radio :disabled="isDetail" :label="2">海报图</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem class="requireStar" label="保存海报：" prop="savePosterSwitch">
                  <RadioGroup v-model="detailList.savePosterSwitch">
                    <Radio :disabled="isDetail" :label="1">开启</Radio>
                    <Radio :disabled="isDetail" :label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </div>
            <!-- 分享给朋友 -->
            <div style="margin-bottom:10px">
              <h1 class="shareTitle">分享素材</h1>
              <div v-if="detailList.shareFriendType == 1" style="display:flex;border-bottom:2px dashed #ccc;">
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">配置区域</h3>
                  <FormItem label="分享给朋友：">{{shareFormatter(detailList.shareFriendType)}}</FormItem>
                  <FormItem label="主标题：" prop="shareFriendMainTitle">
                    <Input :disabled="isDetail" v-model="detailList.shareFriendMainTitle" style="width:240px;margin-right:5px"></Input>({{detailList.shareFriendMainTitle.length}}/18)
                  </FormItem>
                  <FormItem label="副标题：" prop="shareFriendSubTitle">
                    <Input :disabled="isDetail" v-model="detailList.shareFriendSubTitle" style="width:240px;margin-right:5px"></Input>({{detailList.shareFriendSubTitle.length}}/18)
                  </FormItem>
                  <FormItem label="分享图标：" prop="shareFriendIconUrl">
                    <img v-if="detailList.shareFriendIconUrl" class="imgClass" width="80" height="80" :src="detailList.shareFriendIconUrl" alt="图片">
                  </FormItem>
                </div>
                <div class="line"></div>
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">预览区域</h3>
                  <FormItem label="分享给朋友：">{{shareFormatter(detailList.shareFriendType)}}</FormItem>
                  <div class="share-container">
                    <img class="imgClass" src="../../../assets/share-friend.png" width="375" alt="分享给朋友">
                    <div class="content-share">
                      <div class="text-inner">
                        <p class="share-title">
                          {{ detailList.shareFriendMainTitle }}
                        </p>
                        <div class="text-down">
                          <p class="sub-title">
                            {{ detailList.shareFriendSubTitle }}
                          </p>
                          <img :src="detailList.shareFriendIconUrl" />
                        </div>
                      </div>
                      <div class="out-bg" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 分享给朋友-小程序卡片 -->
              <div v-if="detailList.shareFriendType == 2" style="display:flex;border-bottom:2px dashed #ccc;">
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">配置区域</h3>
                  <FormItem label="分享给朋友：">{{shareFormatter(detailList.shareFriendType)}}</FormItem>
                  <FormItem label="标题：" prop="shareFriendMainTitle">
                    <Input :disabled="isDetail" v-model="detailList.shareFriendMainTitle" style="width:240px;margin-right:5px"></Input>({{detailList.shareFriendMainTitle.length}}/18)
                  </FormItem>
                  <FormItem label="分享图标：" prop="shareFriendIconUrl">
                    <img v-if="detailList.shareFriendIconUrl" class="imgClass" width="80" height="80" :src="detailList.shareFriendIconUrl" alt="图片">
                  </FormItem>
                </div>
                <div class="line"></div>
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">预览区域</h3>
                  <FormItem label="分享给朋友：">{{shareFormatter(detailList.shareFriendType)}}</FormItem>
                  <div class="share-container">
                    <img class="imgClass" src="../../../assets/share3.png" width="375" alt="分享给朋友">
                    <div class="share3-content">
                      <div class="share3-title">
                        {{detailList.shareFriendMainTitle}}
                      </div>
                      <div class="share3-img">
                        <img v-if="detailList.shareFriendIconUrl" :src="detailList.shareFriendIconUrl" alt="分享小程序卡片图">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 分享给朋友圈 -->
              <div v-if="detailList.shareWeChatType == 1" style="display:flex;border-bottom:2px dashed #ccc;">
                <div class="displayFlex">
                  <FormItem label="分享给朋友圈：">{{shareFriendFormatter(detailList.shareWeChatType)}}</FormItem>
                  <FormItem v-if="detailList.shareWechatTitle" label="标题：" prop="shareWechatTitle">
                    <Input :disabled="isDetail" v-model="detailList.shareWechatTitle" style="width:240px;margin-right:5px"></Input>({{detailList.shareWechatTitle.length}}/18)
                  </FormItem>
                  <FormItem label="分享图标：" prop="shareWechatIconUrl">
                    <img v-if="detailList.shareWechatIconUrl" class="imgClass" width="80" height="80" :src="detailList.shareWechatIconUrl" alt="图片">
                  </FormItem>
                </div>
                <div class="line"></div>
                <div class="displayFlex">
                  <FormItem label="分享给朋友圈：">{{shareFriendFormatter(detailList.shareWeChatType)}}</FormItem>
                  <div class="share-container">
                    <img class="imgClass" src="../../../assets/share-moments.png" width="375" alt="分享给朋友圈">
                    <div class="circle-content">
                      <img v-if="detailList.shareWechatIconUrl" :src="detailList.shareWechatIconUrl" />
                      <p class="circle-title">
                        {{ detailList.shareWechatTitle }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 海报 -->
              <div v-if="detailList.shareWeChatType == 2 || detailList.savePosterSwitch == 1" style="display:flex">
                <div class="displayFlex">
                  <FormItem label="海报图："></FormItem>
                  <FormItem label="海报类型：" prop="savePosterType">
                    <RadioGroup v-model="detailList.savePosterType">
                      <Radio :disabled="isDetail" :label="1">小程序码</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="分享图标：" prop="savePosterIconUrl">
                    <img v-if="detailList.savePosterIconUrl" class="imgClass" width="80" height="80" :src="detailList.savePosterIconUrl" alt="图片">
                  </FormItem>
                </div>
                <div class="line"></div>
                <div class="displayFlex">
                  <FormItem label="海报图："></FormItem>
                  <img class="imgClass" width="245" :src="detailList.savePosterIconUrl" alt="图片">
                </div>
              </div>
              <div class="btn-box" v-if="tabValue == 'tab2'">
                <Button @click="handleReset()">
                  关闭
                </Button>
                <Button type="primary" style="margin-left: 10px" @click="tabValue = 'tab1';">
                  上一页
                </Button>
                <Button type="primary" style="margin-left: 10px" @click="tabValue = 'tab3';">
                  下一页
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Tab-pane>
      <Tab-pane tab="main" label="H5分享落地页设置" :disabled="isTab3Dis" name="tab3" key="mainTab3">
        <div class="H5-share-info">
          <Form :model="detailList" label-position="left">
            <div style="margin-bottom:10px">
              <h1 class="shareTitle">H5分享落地页设置</h1>
              <!-- H5分享落地页 -->
              <div style="display:flex">
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">配置区域</h3>
                  <FormItem v-if="detailList.shareLandingPageTitle" label="页面标题：" prop="shareLandingPageTitle">
                    <Input :disabled="isDetail" v-model="detailList.shareLandingPageTitle" style="width:240px;margin-right:5px"></Input>({{detailList.shareLandingPageTitle.length}}/18)
                  </FormItem>
                  <FormItem label="页面主图：" prop="shareLandingPageMainIconUrl">
                    <img v-if="detailList.shareLandingPageMainIconUrl" width="80" class="imgClass" :src="detailList.shareLandingPageMainIconUrl" alt="图片">
                  </FormItem>
                </div>
                <div class="displayFlex">
                  <h3 style="margin-left:70px;font-weight:bold;font-size:14px">预览区域</h3>
                  <div class="share-container2">
                    <img class="imgClass" src="../../../assets/share5.png" width="375" alt="图片">
                    <div class="share4-content">
                      <div class="share4-title">
                        {{detailList.shareLandingPageTitle}}
                      </div>
                    </div>
                    <img v-if="detailList.shareLandingPageMainIconUrl" class="imgClass" width="375" height="994" :src="detailList.shareLandingPageMainIconUrl" alt="图片">
                  </div>

                </div>
              </div>
            </div>
          </Form>
        </div>
        <div class="btn-box" v-if="tabValue == 'tab3'">
          <Button @click="handleReset()">
            关闭
          </Button>
          <Button type="primary" style="margin-left: 10px" @click="tabValue = 'tab2';">
            上一页
          </Button>
        </div>
      </Tab-pane>

    </Tabs>
  </div>
</template>

<script>
import { cpTranslate } from "@/libs/tools";
import { recommendDetail, getCityList } from "_o/api/operator-carrier";
export default {
  name: "driver-configure-detail",
  data() {
    return {
      detailList: {},
      provinceName: "",
      cityName: "",
      tabValue: "tab1",
      isTab2Dis: true,
      isTab3Dis: true,
      isDetail: true
    };
  },
  watch: {
    tabValue(newValue) {
      switch (newValue) {
        case "tab1":
          this.isTab2Dis = true;
          this.isTab3Dis = true;
          break;
        case "tab2":
          this.isTab2Dis = false;
          this.isTab3Dis = true;
          break;
        case "tab3":
          this.isTab2Dis = false;
          this.isTab3Dis = false;
          break;
      }
    }
  },
  methods: {
    translateCityList() {
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
        this.getActiveCity();
      });
    },
    getActiveCity() {
      this.cityList.forEach(item => {
        if (this.detailList.provinceCode == item.value) {
          this.provinceName = item.label;
          item.children.forEach(item => {
            if (this.detailList.cityCode == item.value) {
              this.cityName = item.label;
            }
          });
        }
      });
    },
    //路由跳回
    handleReset(name) {
      this.$store.commit("setChangeTab", this.$route);
      if (this.$route.query.approval) {
        this.$router.pushToAnotherModule("/m2-web-general", {
          path: `/configCenter/approval_control`
        });
      } else {
        this.$router.push("/opCenter/recomd-driver-manage/driver-configure");
      }
    },
    tabschange(name) {
      this.tabValue = name;
    },
    getDetail() {
      recommendDetail({
        id: this.$route.params.id
      }).then(res => {
        this.detailList = res.data.data;
        this.translateCityList();
      });
    },
    statusFormatter(type) {
      switch (type) {
        case 1:
          return "乘推司";
        case 2:
          return "司推司";
      }
    },
    shareFormatter(type) {
      switch (type) {
        case 1:
          return "H5链接";
        case 2:
          return "小程序卡片";
      }
    },
    shareFriendFormatter(type) {
      switch (type) {
        case 1:
          return "H5链接";
        case 2:
          return "海报图";
      }
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>

<style lang="less" scoped>
.btn-box {
  text-align: center;
  margin-top: 20px;
}
.shareTitle {
  font-size: 18px;
  font-weight: bold;
  margin-left: 40px;
  position: relative;
}
.shareTitle::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 25px;
  background: #01a0e4;
  left: -15px;
  top: 0;
}
.requireStar {
  /deep/ .ivu-form-item-label:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.shareItem {
  margin-left: 400px;
}
.displayFlex {
  width: 42%;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 0;
}
.line {
  margin: 20px 5%;
  border-right: 2px solid #ccc;
}
.share-container {
  width: 377px;
  border: 1px solid #999;
  transform: scale(0.7, 0.7);
  position: relative;
  left: -44px;
  top: -38px;
  img {
    width: 375px;
  }
}
.share-container2 {
  width: 377px;
  border: 1px solid #999;
  transform: scale(0.7, 0.7);
  position: relative;
  left: -44px;
  top: -148px;
  img {
    width: 375px;
  }
}
.content-share {
  width: 234px;
  min-height: 92px;
  max-height: 105px;
  position: absolute;
  top: 113px;
  left: 75px;
  overflow: hidden;
}
.circle-content {
  width: 300px;
  height: 50px;
  position: absolute;
  top: 116px;
  left: 64px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  img {
    width: 42px;
    height: 42px;
    margin-right: 5px;
  }
}
.text-inner {
  padding: 11px 12px;
  border-radius: 4px;
  background: #fff;
}
.share-title {
  font-size: 16px;
  line-height: 18px;
  color: #000;
  margin-bottom: 3px;
  min-height: 18px;
}
.text-down {
  display: flex;
  justify-content: space-between;
  img {
    width: 43px;
    height: 43px;
  }
  .sub-title {
    font-size: 12px;
    line-height: 15px;
    color: #999;
    min-height: 12px;
    min-width: 10px;
  }
}
.out-bg {
  background: #ededed;
  min-height: 18px;
}
.circle-title {
  font-size: 16px;
  line-height: 18px;
  color: #000;
  width: 245px;
}
.share3-content {
  position: absolute;
  width: 232px;
  height: 216px;
  top: 160px;
  left: 75px;
  .share3-title {
    width: 232px;
    height: 45px;
    text-align: center;
  }
  .share3-img {
    width: 232px;
    height: 170px;
    text-align: center;
    img {
      width: 232px;
      height: 170px;
    }
  }
}
.share4-content {
  position: absolute;
  width: 375px;
  height: 500px;
  top: 0;
  .share4-title {
    height: 54px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
  }
}
</style>