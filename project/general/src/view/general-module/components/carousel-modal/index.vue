<template>
  <div>
    <Modal
      v-model="isShow"
      :width="832"
      :title="title"
      :mask-closable="false"
      class="big-img-modal-preview new-ue"
      @on-cancel="closeModal()">
      <Carousel 
        class="big-carousel" 
        v-if="isShow" 
        v-model="carouselVal"
        radius-dot>
          <CarouselItem v-for="(imgs,i) in imgList" :key="i">
            <div class="img-out" :ref="'imgBox'+i">
              <img :src="imgs" :alt="title">
            </div>
          </CarouselItem>
      </Carousel>
      <div slot="footer">
        <img class="roate-icon" src="../../assets/images/icon/left.png" alt="左旋转" @click="roateImage(-90)">
        <img class="roate-icon right-icon" src="../../assets/images/icon/right.png" alt="右旋转" @click="roateImage(90)">
        <Button @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "carousel-modal",
  props: {
    show: {
      type: Boolean
    },
    title:{
      default:'查看图片'
    },
    indexVal:{
      default:0
    },
    imgList:{
      default:[]
    },
  },
  data() {
    return {
      isShow:this.show,
      carouselVal:this.indexVal
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    roateImage(value=90){
      let key = 'imgBox'+this.carouselVal
      let roateInfo = this.$refs[key][0].style.transform
      let roateVal = value
      if(roateInfo){
        roateInfo = roateInfo.replace('rotate(','')
        roateInfo = roateInfo.replace('deg)','')
        roateVal = Number(roateInfo)+roateVal
      }
      this.$refs[key][0].style.transform = `rotate(${roateVal}deg)`
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      this.carouselVal = this.indexVal;
    }
  }
};
</script>
<style lang="less">
.big-img-modal-preview{
  .ivu-carousel-item{
    text-align: center;
  }
  .img-out{
    width:800px;
    height:800px;
    background: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  img{
    max-width:100%;
    max-height:100%;
  }
  .roate-icon{
    width:24px;
    height:24px;
    opacity: .7;
    margin-right: 30px;
  }
  .right-icon{
    margin-right: 254px;
  }
}
</style>
