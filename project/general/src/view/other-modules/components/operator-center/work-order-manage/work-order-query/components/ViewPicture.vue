<!--
 * @Author: NapierPLUS
 * @Date: 2021-08-18 15:18:40
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-09-26 10:54:47
 * @Description: 新增轮播
-->
<template>
  <div>
    <ul class="picture">
      <li
        v-for="(item, index) in data"
        :key="index"
        @click="view(item,index)"
        class="item"
      >
        <img :src="item.value" />
      </li>
    </ul>
    <Modal title="图片" v-model="showModal" :width="1000">
      <Carousel class="ctx" v-if="type === 'carousel' && showModal" v-model="value1">
        <Carousel-item v-for="(item, index) in data" :key="'carousel' + index">
        <div class="ctx">
          <img class="large" :src="item.value" />
        </div>
        </Carousel-item>
      </Carousel>
      <div v-else class="ctx">
        <img class="large" :src="currentFileUrl" />
      </div>
      <p  v-if="type === 'carousel' && showModal" style="margin-top:10px;fong-fize:16px">第{{value1+1}}张，共{{data.length}}张</p>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: "single"
    },
  },

  data() {
    return {
      showModal: false,
      currentFileUrl: "",
      value1:0,
    };
  },

  created() {},

  methods: {
    view(item,index=0) {
      if(this.type !== 'carousel'){
          this.currentFileUrl = item.value;
      } else {
           this.value1 = index
      }
        this.showModal = !this.showModal;
    }
  }
};
</script>

<style lang="less" scoped>
.picture {
  display: flex;
  .item {
    flex: 0 0 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 10px 0 0;
    text-align: center;
    border: 1px dashed #dcdee2;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
.ctx{
    display:block;
}
.large {
  width: 100%;
}

/deep/ .ivu-modal-body {
  text-align: center;
}
</style>
