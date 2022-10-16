<template>
  <div class="settingUp">
    <div>群组名称：{{ data.name }}</div>
    <div>
      <span>群组头像</span>
      <img
        :src="data.headPortrait"
        @click="imgs"
      />
    </div>
    <div>
      <Button
        type="error"
        style="margin-right: 50px;"
        @click="closeHea"
      >
        关闭
      </Button>
      <Button
        type="info"
        @click="nextPage"
      >
        下一页
      </Button>
    </div>
    <Modal
      v-model="isModal"
      :width="300"
      :mask-closable="true"
      :closable="false"
      footer-hide
    >
      <img
        :src="data.headPortrait"
        class="imges"
      />
    </Modal>
  </div>
</template>
<script>
import { headPortraitStartDetails } from "_o/api/driver.js";

export default {
  data() {
    return {
      data: {
        uuid: "",
        name: "",
        headPortrait: ""
      },
      uuid: this.$route.query.uuid,
      isModal: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let obj = { uuid: this.uuid }
      headPortraitStartDetails(obj).then(res => {
        this.data = res.data.data
      });
    },
    imgs() {
      this.isModal = true;
    },
    closeHea() {
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ path: "headPortrait-manage" });

    },
    nextPage() {
      this.$emit("changeid", "2");
    }
  }
};
</script>
<style lang="less" scoped>
.settingUp {
  div {
    margin-bottom: 20px;
    span {
      margin-right: 20px;
    }
  }
}
.imges {
  width: 100%;
  height: auto;
  display: block;
}
</style>
