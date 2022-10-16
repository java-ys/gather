<template>
  <div>
    <ul class="wrapper">
      <li>
        <div class="title">司机姓名：</div>
        <div>{{ detailObj.driverName }}</div>
      </li>
      <li>
        <div class="title">手机号：</div>
        <div>{{ detailObj.mobilePhone }}</div>
      </li>
      <li>
        <div class="title">申请时间：</div>
        <div>{{ detailObj.apply }}</div>
      </li>
      <li>
        <div class="title">补偿时长：</div>
        <div>{{ detailObj.duration }}</div>
      </li>
      <li>
        <div class="title">图片：</div>
        <div>
          <img src="./assets/pic.png" alt="点击展示更多图片"/>
        </div>
      </li>
      <li>
        <div class="title">视频：</div>
        <div>
          <img src="./assets/video.jpg" /> 
        </div>
      </li>
      <li>
        <div class="title">说明：</div>
        <div>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
      </li>
      <li>
        <div class="title">
          <i style="color:red;">*</i> 备注：
        </div>
        <div>
          <i-input
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            size="large"
            style="width:400px;"
          ></i-input>
        </div>
      </li>
    </ul>


  </div>
</template>

<script>
export default {
  props: ["detailObj"],
  data() {
    return {};
  },
  methods: {
      
  }
};
</script>


<style lang="less" scoped>
.wrapper {
  padding: 0 0px;

  color: #333333;

  li {
    overflow: hidden;
    margin-bottom: 15px;
    div {
      float: left;
    }
    .title {
      width: 80px;
      text-align: right;
    }

    img {
      width: 148px;
      height: 85px;
    }
  }
}
</style>