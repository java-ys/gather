<template>
  <div class="error-page">
    <!--<div class="error-code">出错啦~</div>-->
    <div class="error-desc">暂无菜单权限，请联系管理员！</div>
<!--    <div class="error-handle">
      &lt;!&ndash;<el-button type="primary" size="large" @click="toHome">返回首页</el-button>&ndash;&gt;
      <el-button id="404-back" class="error-btn" type="primary" @click="goBack">双击返回上一页</el-button>
    </div>-->
  </div>
</template>

<script>
  export default {
    name: 'NoResource',
    methods: {
      toHome() {
        this.$router.push('/');
      },
      goBack() {
        // console.log(111);
        this.$router.go(-1);
        // console.log(222);
      }
    }
  }
</script>


<style scoped>
  .error-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
  }

  .error-code {
    line-height: 1;
    font-size: 250px;
    font-weight: bolder;
    color: #2d8cf0;
  }

  .error-code span {
    color: #00a854;
  }

  .error-desc {
    font-size: 30px;
    color: #777;
  }

  .error-handle {
    margin-top: 30px;
    padding-bottom: 200px;
  }

/*  .error-btn {
    margin-left: 100px;
  }*/
</style>
