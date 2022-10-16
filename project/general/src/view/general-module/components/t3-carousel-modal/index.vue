<template>
  <div>
    <Modal
      v-model="isShow"
      :width="760"
      :title="title"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="$emit('close')"
    >
      <div class="icon-load" @click="downloadImg">
        <Icon type="ios-download-outline"/>
      </div>
      <div class="carousel-box">
        <div class="left-box">
          <div v-for="(item,i) in imgList" :key="i">
            <div class="img-box small-box">
              <img :src="item" alt="图片" @click="bigImg=item">
            </div>
            <p class="img-tit">{{item.name || imgName+(i+1)}}</p>
          </div>
        </div>
        <div class="right-box">
          <div class="img-box big-box">
            <img :src="bigImg" alt="图片">
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import { getToken } from '@/libs/util'
import fileDownload from 'js-file-download'
export default {
  name: "m2-carousel-modal",
  props: {
    title: {
      type: String,
      default: "查看图片"
    },
    imgList: {
      type: Array,
      default: []
    },
    show: {
      type: Boolean
    },
    imgName: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      isShow: false,
      bigImg: ""
    };
  },
  methods: {
    init() {
      this.bigImg = this.imgList[0];
    },
    getURLBase64(url) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
          if (this.status === 200) {
            var blob = this.response;
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
              var result = e.target.result;
              resolve(result);
            };
            fileReader.readAsDataURL(blob);
          }
        };
        xhr.onerror = function() {
          reject();
        };
        xhr.send();
      });
    },
    downloadImg() {
      let fileName = `${this.imgName}.zip`
      let params = {
        fileName: `fileName`,
        files: this.imgList.map((item,i)=>{
          let lastArr = item.split('.')
          let last = lastArr[lastArr.length-1]
          let obj = {
            fileName: `${this.imgName}${i+1}.${last}`,
            fileUrl: item
          }
          return obj
        })
      }
      axios({
        method: 'post',
        url: this._baseUrl + '/common/downloadZip',
        responseType: 'blob',
        headers: { 'Authorization': getToken() },
        data: params
      }).then(function (res) {
        if(res.data) fileDownload(res.data,fileName)
      })
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      this.isShow && this.init();
    }
  }
};
</script>
<style scoped lang="less">
.icon-load {
  font-size: 28px;
  position: absolute;
  top: 0px;
  right: 45px;
  cursor: pointer;
}
.carousel-box {
  display: flex;
  justify-content: space-between;
}
.left-box {
  width: 220px;
  max-height: 500px;
  overflow-y: auto;
}
.right-box {
  width: 500px;
}
.small-box {
  width: 200px;
  height: 120px;
}
.big-box {
  width: 500px;
  height: 500px;
}
.img-box {
  background: #000;
  display: flex;
  justify-content: space-around;
  align-items: center;
  img {
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
}
.img-tit {
  line-height: 30px;
  text-align: center;
}
</style>