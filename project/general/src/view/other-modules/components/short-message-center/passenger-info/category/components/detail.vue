<template>
  <div>
    <Modal
      v-model="show"
      width="40%"
      title="发布类目详情"
      footer-hide
      :mask-closable="false"
      @on-cancel="e => cancel()"
    >
      <Form ref="_form" :model="formData" :label-width="120">
        <FormItem label="类目名称：">
          <span>{{ formData.pubMenuName }}</span>
        </FormItem>
        <FormItem label="类目头像：">
          <img :src="formData.pubMenuPicUrl" class="img" @click="viewImg" />
        </FormItem>
        <FormItem label="创建人：">
          <span>{{ formData.creator }}</span>
        </FormItem>
        <FormItem label="创建时间：">
          <span>{{ formData.createTime }}</span>
        </FormItem>
        <FormItem label="最近操作人：">
          <span>{{ formData.updater }}</span>
        </FormItem>
        <FormItem label="最近操作时间：">
          <span>{{ formData.updateTime }}</span>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="查看" v-model="imgVisible">
      <img :src="formData.pubMenuPicUrl" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      formData: {},
      imgVisible: false
    };
  },
  methods: {
    init(p = {}) {
      this.formData = p;
      this.show = true;
    },
    viewImg() {
      this.imgVisible = true;
    },
    cancel() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.img {
  width: 100px;
  height: 100px;
  display: inline-block;
}
</style>
