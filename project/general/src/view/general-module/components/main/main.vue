<template>
  <Layout style="height: 100%" class="main">
    <Sider
      v-model="collapsed"
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      class="left-sider"
      :style="{ overflow: 'hidden' }"
    >
      <side-menu
        ref="sideMenu"
        accordion
        :active-name="$route.name"
        :collapsed="collapsed"
        :menu-list="menuList"
        @on-select="turnToPage"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" key="max-logo" :src="maxLogo" />
          <img v-show="collapsed" key="min-logo" :src="minLogo" />
        </div>
      </side-menu>
    </Sider>
    <Layout style="min-width: 750px;">
      <Header class="header-con">
        <header-bar
          :collapsed="collapsed"
          @on-coll-change="handleCollapsedChange"
        >
          <user :user-avator="userAvator" />
          <language
            v-if="$config.useI18n"
            style="margin-right: 10px;"
            :lang="local"
            @on-lang-change="setLocal"
          />
          <error-store
            v-if="
              $config.plugin['error-store'] &&
                $config.plugin['error-store'].showInHeader
            "
            :has-read="hasReadErrorPage"
            :count="errorCount"
          />
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              :list="tagNavList"
              @input="handleClick"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper" :style="{ background: '#fff' }" :data-app="Number(notMicroApp)">
            <waterMark
              :inputText="$store.state.user.userName"
              :width="'400'"
              :height="'200'"
              :rotate="15"
            ></waterMark>
            <keep-alive :include="cacheList">
              <router-view v-if="notMicroApp" />
            </keep-alive>
            <!--<div id="frame" v-show="$route.meta.isMicroApp"></div>-->
            <div id="frame"></div>

          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import ErrorStore from "./components/error-store";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, getNextRoute, routeEqual } from "@/libs/util";
import minLogo from "./images/logo-min.png";
import maxLogo from "../../assets/logo/logo.png";
import "./main.less";
export default {
  name: "Main",
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    };
  },
  computed: {
    ...mapGetters(["errorCount"]),
    notMicroApp() {
      return !this.$route.meta.isMicroApp
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    },
    cacheList() {
      const list = [
        "ParentView",
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ];
      return list;
    },
    menuList() {
      const menuList = this.$store.getters.menuList;
      let sortedMenuList = [];
      let notSortedMenuList = [];
      for (const menu of menuList) {
        if (menu.meta.sort) {
          // console.log(menu.meta.sort);
          sortedMenuList.push(menu);
        } else {
          notSortedMenuList.push(menu);
        }
      }
      const retMenuList = sortedMenuList.sort((a, b) => a.meta.sort - b.meta.sort).concat(notSortedMenuList)
      // console.log(retMenuList)
      
      return retMenuList
    },
    local() {
      return this.$store.state.app.local;
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    }
  },
  mounted() {
    console.log('general-main-component-mounted', document.getElementById('frame'));
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.addTag({
      route: this.$store.state.app.homeRoute
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // 注释掉，方便其他模块跳转
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   });
    // }
    this.catchCross()
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    ...mapActions(["handleLogin"]),
    catchCross() {
      const { isCross } = this.$route.query
      if (isCross) {
        const { name, query, params, meta } = this.$route;
        this.addTag({
          route: { name, query, params, meta },
          type: "push"
        });
        this.setTagNavList(getNewTagList(this.tagNavList, this.$route));
      }
    },
    turnToPage(route) {
      if (this.$route.matched.find(it => it.name === route)) return;
      let { name, params, query } = {};
      if (typeof route === "string") {
        name = route;
      } else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      let closeAlert = (route && route.meta && route.meta.closeAlert) || false;
      if (type === "all") {
        this.turnToPage(this.$config.homeName);
        this.setTagNavList(res);
      } else if (routeEqual(this.$route, route)) {
        // 在该页面关闭该页面
        if (type !== "others") {
          // 点击单个关闭按钮
          const nextRoute = getNextRoute(this.tagNavList, route);
          if (closeAlert) {
            this.$Modal.confirm({
              title: "提示",
              content: "切换页面数据将丢失，您确定要离开吗？",
              onOk: () => {
                this.$router.push(nextRoute);
                this.setTagNavList(res);
              }
            });
          } else {
            this.$router.push(nextRoute);
            this.setTagNavList(res);
          }
        } else {
          // 关闭其他
          this.setTagNavList(res);
        }
      } else if (!routeEqual(this.$route, route)) {
        this.setTagNavList(res);
      }
    },
    handleClick(item) {
      let closeAlert =
        (this.$route && this.$route.meta && this.$route.meta.closeAlert) ||
        false;
      if (closeAlert && item.name !== this.$route.name) {
        this.$Modal.confirm({
          title: "提示",
          content: "切换页面数据将丢失，您确定要离开吗？",
          onOk: () => {
            this.turnToPage(item);
          }
        });
      } else {
        this.turnToPage(item);
      }
    }
  }
};
</script>
