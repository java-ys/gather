<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#1F0d00"
      text-color="#E5E1DE"
      active-text-color="#FF8532"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <img class="user-avatar" src="@/icons/logo/logo_alter_144x144.png" />
      </el-menu-item>
      <el-menu-item index="2">注销</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { logout } from "_o/common/account";

export default {
  data() {
    return {
      activeIndex: "2"
    };
  },
  methods: {
    handleSelect(key) {
      if (key == "2") {
        this.$confirm("确定退出登录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        }).then(() => {
          logout().then(() => {
            this.$router.push("/login");
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
      }
    }
  }
}
</script>

<style scoped>
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 100px;
  }
</style>
