<template>
  <div>
    <Button
      v-show="sameCountNum > 0"
      class="count-down-btn check-img-box"
      :disabled="sameCountNum > 0"
      @click="startCount"
    >
      <span class="text">{{ sameCountNum }}s</span>
    </Button>
    <Button
      v-show="sameCountNum === 0"
      class="count-down-btn check-img-box"
      @click="sendAgain"
    >
      <span class="text">重新发送</span>
    </Button>
  </div>
</template>
<script>
export default {
  name: "CountDown",
  props: {
    countDown: {
      type: Number,
      default: 59
    }
  },
  data() {
    return {
      sameCountNum: 59
    };
  },
  methods: {
    startCount() {
      let self = this;
      this.sameCountNum = 59;
      let duration = 1000;
      // eslint-disable-next-line no-unused-vars
      let debounceTimer = null;
      let wait = 0;
      debounceTimer = setTimeout(function() {
        let timer = setTimeout(function countTimer() {
          if (Number.isNaN(self.sameCountNum) || self.sameCountNum === 0) {
            self.$emit("countDownOver");
            return clearTimeout(timer);
          }
          self.sameCountNum--;
          setTimeout(countTimer, duration);
        }, duration);
      }, wait);
    },
    sendAgain() {
      this.$emit("send-again");
    }
  }
};
</script>
