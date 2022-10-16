<template>
  <div>
    <Row class="row">
      <Col>
        <p>
          <span class="title">省/市：</span>
          <span>{{pageData.provinceName}}{{pageData | markF}}{{pageData.cityName}}</span>
        </p>
      </Col>
    </Row>
    <Row class="row">
      <Col>
        <p>
          <span class="title">运营商：</span>
          <span>{{pageData.agentName}}</span>
        </p>
      </Col>
    </Row>
    <Row class="row">
      <Col>
        <p>
          <span class="title">推券二维码地址：</span>
          <span v-if="pageData.qrCodeUrl">{{pageData.qrCodeUrl}}</span>
          <!-- <img v-if="pageData.qrCodeUrl" class="pic-img" :src="pageData.qrCodeUrl" alt /> -->
          <!-- <Button
            v-if="pageData.qrCodeUrl"
            type="primary"
            @click="downLoadImg(pageData.qrCodeUrl, '二维码图片')"
          >下载</Button> -->
        </p>
      </Col>
    </Row>
    <Row class="row">
      <Col>
        <div class="pic-con">
          <span class="title">推券宣传图片：</span>
          <img v-if="pageData.pictureUrl" class="qrcode-img" :src="pageData.pictureUrl" alt />
          <Button
            class="down-but"
            v-if="pageData.pictureUrl"
            type="primary"
            @click="downLoadImg(pageData.pictureUrl, '宣传图片')"
          >下载</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { detailService } from "_o/api/coupon-manage";
import { tool } from "_o/api/baseMixin.js";
// import { downloadIamge } from "@/libs/tools";
import { downloadFile} from '@m2-micro/libs/es/download';

export default {
  filters: {
    markF(v) {
      return v.provinceName && v.cityName ? "/" : "";
    }
  },
  data() {
    return {
      pageData: {}
    };
  },
  mixins: [tool],
  created() {
    const { id } = this.getRouteParams();
    this.getDetail({ id });
  },
  methods: {
    async getDetail(p) {
      const [err, data] = await this.toResult(detailService(p));
      if (err) {
        return;
      }
      this.pageData = data;
      console.log(this.pageData)
    },
    downLoadImg(src, name) {
      if (!src) return;
      downloadFile(src, name);
    },
    getRouteParams() {
      return this.$route.query;
    }
  }
};
</script>

<style scoped lang="less">
.title {
  display: inline-block;
  min-width: 120px;
  margin-right: 20px;
  text-align: right;
}
.row {
  margin-bottom: 40px;
  & span {
    font-size: 16px;
  }
}
.qrcode-img {
  width: 100px;
  height: 100px;
  display: inline-block;
}
.pic-img {
  width: 200px;
  height: 100px;
  display: inline-block;
}
.down-but {
  vertical-align: bottom;
  margin-left: 20px;
}
.pic-con {
  min-height: 100px;
}
</style>
