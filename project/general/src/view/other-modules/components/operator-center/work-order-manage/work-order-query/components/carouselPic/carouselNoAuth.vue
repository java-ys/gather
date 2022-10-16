<template>
  <div class="out_container">
    <Row>
      <img :src="picUrl" />
    </Row>
    <Row :style="{ marginTop: '10px' }" v-if="len > 1">
      <Button type="primary" @click="handleChange('privious')">上一张</Button>
      <Button
        type="primary"
        @click="handleChange('next')"
        style="marginLeft:10px"
        >下一张</Button
      >
    </Row>
    <Row :style="{ marginTop: '10px' }">
      <Col span="6" offset="17">
        <div v-if="!len == 0">共 {{ len }} 张 ，当前第 {{ Index + 1 }} 张</div>
        <div v-if="len == 0">共 0 张 ，当前第 0 张</div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    imgList: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  mounted () {},
  computed: {
    picUrl () {
      let arr = this.imgList.split(',')
      if (arr.length == 0) {
        return 0
      } else {
        return arr[this.Index]
      }
    },
    len () {
      let arr = this.imgList.split(',')
      if (arr[0] == '') {
        return 0
      } else {
        return arr.length
      }
    }
  },
  data () {
    return {
      Index: 0
      // picUrl:''
    }
  },
  methods: {
    handleChange (act) {
      const arr = this.imgList.split(',')
      let len = arr.length
      switch (act) {
        case 'privious':
          this.Index--
          if (this.Index < 0) {
            this.Index = 0
          }
          break
        case 'next':
          this.Index++
          if (this.Index >= len) {
            this.Index = 0
          }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.out_container {
  // width: 880px;
  img {
    width: 100%;
    height: auto;
    // transform: rotate(90deg)
  }
}
</style>
