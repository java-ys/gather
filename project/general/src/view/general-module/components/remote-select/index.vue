<template>
  <div class="main">
    <Select
      v-model="result"
      clearable
      filterable
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :loading="loading"
      v-loadmore="loadmore"
      loading-text="加载中..."
      :remote="remote"
      @on-change="changeSelect"
    >
      <Option v-for="(item,i) in searchData" :key="i" :value="item.value">{{item.label}}</Option>

    </Select>
  </div>
</template>
<script>
import Vue from "vue";

Vue.directive("loadmore", {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(".ivu-select-dropdown") || el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
    if (!SELECTWRAP_DOM) {
      return
    }
    SELECTWRAP_DOM.addEventListener("scroll", function () {
      /*
       * scrollHeight 获取元素内容高度(只读)
       * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
       * clientHeight 读取元素的可见高度(只读)
       * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
       * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
       */
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;

      if (CONDITION) {
        binding.value();
      }
    });
  }
});
export default {
  name: "multiSelect",
  props: {
    dataKey: {
      // 数据键值对的key名
      type: String,
      default: "key"
    },
    dataLabel: {
      // 数据的label名称
      type: String,
      default: "label"
    },
    queryName: {
      // 数据的label名称
      type: String,
      default: "query"
    },
    placeholder: {
      type: String,
      default: ""
    },
    // 是否为远程模糊搜索下拉
    remote: {
      type: Boolean,
      default: true
    },
    axiosFun: {},
    params: {}
  },
  data() {
    return {
      result: "",
      oldTime: 0,
      timer: null,
      currPage: 1,
      pageSize: 20,
      queryVal: "",
      dataList: [],
      loading: false,
      isMore: false
    };
  },
  computed: {
    searchData: function () {
      let newData = [];
      for (let item of this.dataList) {
        let obj = {
          label: item[this.dataLabel],
          value: item[this.dataKey]
        };
        newData.push(obj);
      }
      return newData;
    }
  },
  methods: {
    axiosList(query) {
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        ...this.params
      }
      params[this.queryName] = query || this.queryVal
      this.axiosFun(params).then(res => {
        let data = res.data.data || {}
        this.isMore = data.hasMore || false
        this.loading = false

        if (query) {
          this.dataList = data.list
        } else {
          this.dataList = [
            ...this.dataList,
            ...data.list
          ]
          if (!this.isMore) {
            this.$Message.warning("已无更多数据")
          }
        }

        // this.loading=false
      })
    },
    loadmore() {
      if (!this.isMore) {
        return false
      }
      this.currPage++
      this.axiosList()
    },
    // 远程搜索输入触发的函数
    remoteMethod(query) {
      if (!this.remote) {
        return false;
      }
      if (query !== "") {
        this.loading = true
        let waitTime = 600; // 输入等待时间ms
        // 600ms之内输入的，不请求，大于这个时间再去请求
        let nowTime = new Date().getTime();

        // 执行调用的定时器
        function setTimer(that) {
          that.currPage = 1,
          that.pageSize = 20,
          that.queryVal = query
          that.timer = setTimeout(() => {
            that.axiosList(query)
          }, waitTime);
        }

        if (
          Number(nowTime) - Number(this.oldTime) < waitTime ||
          this.oldTime == 0
        ) {
          clearTimeout(this.timer);
          this.timer = null;
          setTimer(this)
        } else {
          setTimer(this)
        }
        this.oldTime = nowTime;
      } else {
        this.dataList = [];
      }
    },
    changeSelect() {
      this.$emit("on-select", this.result);
    }
  }
};
</script>
<style lang="less" scoped>
.ivu-dropdown-item {
  padding: 0;
}
</style>
