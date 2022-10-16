<template>
  <div>
    <el-header class="top-container">
      <el-menu
        :default-active="activeIndexX"
        mode="horizontal"
        background-color="#1F0d00"
        text-color="#B6B3AE"
        active-text-color="#FF8532"
        @select="handleSelect"
      >
        <el-menu-item v-for="(menuName, idx) in mainMenuList" :key="idx" :index="(idx + 1) + ''">{{menuName}}</el-menu-item>
      </el-menu>
    </el-header>

    <el-aside v-if="!changingNav" class="sidebar-container">
      <el-menu
        v-if="!changingNav"
        style="height: 7200px"
        :default-active="activeIndexY"
        background-color="#FFFFFF"
        text-color="#999999"
        active-text-color="#FE8E38"
      >
        <router-link v-for="(subMenuObj, idx) in subMenuList" :key="idx" :to="subMenuObj.path">
          <el-menu-item :id="'nav-y-menu-' + idx" :index="(idx + 1) + ''">
            <img width="20" height="20" :src="subMenuObj.iconImg" style="margin-left:5px;" />
            <span slot="title" style="margin-left:15px;">{{subMenuObj.name}}</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { sortByProperty } from "_o/common/common";
export default {
  props: {
    changingNav: { type: Boolean, required: true }
  },
  data() {
    return {
      routerData: [],
      activeIndexX: "1",
      activeIndexY: "1",
      mainMenuList: [],
      menuList: [],
      subMenuList: []
    };
  },
  watch: {
    "$route": function (to) {
      this.menuHandler(to.path);
    }
  },
  created() {
    // 从vuex缓存加载路由相关数据（菜单名、路由、图标、menu.json文件中对应的菜单的初始坐标（没过滤前）、菜单高亮坐标（过滤后实际位置））
    this.routerData = this.$store.state.routeData;
    // 从vuex缓存读取menu.json菜单数据（权限过滤后，加上able参数的，有able就有权限没able就没有）
    this.menuList = this.$store.state.menu;
    // 如果menuList存在则进行后续操作
    if (this.menuList.length) {
      // 遍历menuList，有able则在主菜单中显示
      this.menuList.forEach(each => {
        if (each.able) {
          this.mainMenuList.push(each.name);
        }
      });
      // 调用菜单处理方法
      this.menuHandler(this.$route.path);
    }
  },
  methods: {
    // 顶部菜单选择触发
    handleSelect(key) {
      // 切换顶部菜单，侧边子菜单高亮初始为第一个
      this.activeIndexY = "1";
      // 跳转路由
      let goto;
      // 用于跳过没权限显示的菜单
      let plusIndex = 0;
      for (let each in this.menuList) {
        if (!this.menuList[each].able) {
          plusIndex++;
        }
        // 如果初始菜单位置 = 当前选择的菜单key + 跳过的没权限显示菜单数目，则获取子菜单数据
        else if (this.menuList[each].index === Number(key) + plusIndex) {
          this.subMenuList = [];
          this.menuList[each].subMenu.forEach((eachMenu, i) => {
            // 判断子菜单是否有权限
            if (eachMenu.able) {
              this.subMenuList.push(eachMenu);
              this.subMenuList[this.subMenuList.length - 1].iconImg = require("@/icons/menu/" + eachMenu.icon)
            }
          });
          // 设置子菜单路由为跳转路径
          goto = this.menuList[each].path + this.subMenuList[0].path;
          break;
        }
      }
      this.$router.push(goto);
      this.$emit("navChange", true);
    },
    // 菜单处理
    menuHandler(path) {
      let menuIndexX;
      this.subMenuList = [];
      for (let idx in this.routerData) {
        if (this.routerData[idx].route === path) {
          // 设置主菜单高亮位置
          this.activeIndexX = String(this.routerData[idx].indexX);
          // 从routerData获取初始坐标x，用于后续流程对比
          menuIndexX = this.routerData[idx].x;
          break;
        }
      }
      for (let idx in this.routerData) {
        // 比对，如果路由所在初始坐标和前边的坐标比对一致，获取侧边子菜单的数据并进行显示
        if (this.routerData[idx].x === menuIndexX) {
          this.subMenuList.push({
            iconImg: require("@/icons/menu/" + this.routerData[idx].icon),
            name: this.routerData[idx].name,
            path: this.routerData[idx].route,
            i: this.routerData[idx].indexY,
            jsonI: this.routerData[idx].y // 用于高亮子菜单位置以及后续排序操作
          });
        }
      }
      // 根据menu.json定义的index值，进行子菜单排序
      this.subMenuList = sortByProperty(this.subMenuList, "jsonI");
      // 确定子菜单高亮位置
      for (let idx in this.subMenuList) {
        // 根据子菜单路由名称和当前跳转路由比对，一致则高亮
        if (this.subMenuList[idx].path === path) {
          this.activeIndexY = String(this.subMenuList[idx].jsonI);
          break;
        }
      }
      // 刷新菜单显示
      this.$emit("navChange", true);
    },
  }
}
</script>

<style scoped>
  .top-container {
    top: 0;
    left: 160px;
    position: fixed;
    min-width: 100%;
    z-index: 9999;
  }

  .sidebar-container {
    box-shadow: 3px 3px 15px -3px #e2d6ce;
    z-index: 9999;
  }

  /*  .el-aside {
      background-color: #545c64;
      color: #333;
      text-align: left;
      line-height: 100%;
    }*/

  .el-header, .el-footer {
    background-color: rgb(31, 13, 0);
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .menu-item-class {
    padding-left: 35px;
  }
</style>
