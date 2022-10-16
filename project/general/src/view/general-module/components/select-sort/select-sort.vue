<template>
  <div>
    <Dropdown
      trigger="custom"
      transfer-class-name="floatBox"
      :style="boxStyle"
      :visible="visible"
      @on-clickoutside="clickOutside"
    >
      <div
        class="select_top"
        :class="visible ? 'border_color' : ''"
        @click="visible = !visible"
      >
        <span class="span-holder" v-show="!resultList.length">{{
          placeholder
        }}</span>
        <ul :style="style">
          <li
            v-for="(item, index) in resultList"
            :key="index"
            @click.stop="closeItem(item)"
          >
            {{ item[dataLabel]
            }}<span class="icon_span"><Icon type="md-close"/></span>
          </li>
        </ul>
        <Icon
          class="select_icon"
          type="ios-arrow-down"
          :size="14"
          :class="visible ? 'icon_active' : ''"
        />
      </div>
      <DropdownMenu slot="list">
        <div class="search-input">
          <Input
            v-model="searchText"
            placeholder="请输入搜索词"
            @on-change="changeInput"
          />
        </div>
        <Spin fix v-show="loading">
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        <CheckboxGroup v-model="checkResult" @on-change="changeCheck">
          <Scroll :distance-to-edge="-23" :on-reach-bottom="loadMore">
            <DropdownItem v-for="item in searchList" :key="item.key">
              <Checkbox
                :label="item.key"
                :value="checkResult.includes(item.key)"
                >{{ item.label }}</Checkbox
              >
            </DropdownItem>
            <p class="data-none" v-show="!searchList.length">
              暂无匹配数据
            </p>
          </Scroll>
        </CheckboxGroup>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  props: {
    // 展示框的默认值
    placeholder: {
      type: String,
      default: "请选择"
    },
    axiosFun: {
      type: Function
    },
    queryName: {
      type: String,
      default: ""
    },
    // 展示框的最大宽度
    width: {
      type: Number,
      default: 300
    },
    // 展示框的最大高度
    height: {
      type: Number,
      default: 80
    },
    // 额外的参数
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isLock: {
      type: Boolean,
      default: false
    },
    // 接口数据的key值字段
    dataKey: {
      type: String,
      default: "vin"
    },
    dataLabel: {
      // 接口数据的文本描述字段
      type: String,
      default: "vin"
    }
  },
  data() {
    return {
      visible: false,
      isMore: true,
      loading: false,
      dataList: [],
      checkResult: [],
      parentData: [],
      resultList: [],
      searchText: "",
      boxStyle: "",
      style: "",
      currPage: 1,
      pageSize: 20
    };
  },
  computed: {
    searchList() {
      let newData = [];
      this.parentData = [...this.resultList, ...this.dataList]; // 合并父级数据和已经点击过的数据
      this.removeRepeat(this.parentData, this.dataKey); // 数组去重
      this.parentData.forEach(element => {
        let obj = {
          key: element[this.dataKey],
          label: element[this.dataLabel]
        };
        newData.push(obj);
      });
      return newData;
    }
  },
  created() {
    this.style = "max-height:" + this.height + "px;overflow:auto;";
    this.boxStyle = "maxWidth:" + this.width + "px;" + "width: 100%";
  },
  methods: {
    loadMore() {
      if (this.isMore) {
        this.currPage++;
        this.getResult();
        // this.$emit('on-lazyload', {
        //     query: this.searchText,
        //     currPage: this.currPage,
        //     pageSize: this.pageSize
        // })
      } else {
        this.$Message.warning("已无更多的数据");
      }
    },
    clickOutside() {
      this.visible = !this.visible;
      this.loading = false;
    },
    clearValue() {
      this.checkResult = [];
      this.resultList = [];
      this.searchText = '';
      this.$emit("on-success", []);
    },
    getResult() {
      if (!this.searchText) return (this.dataList = []);
      this.loading = true;
      let params = {
        pageSize: this.pageSize,
        currPage: this.currPage,
        ...this.params
      };
      params[this.queryName] = this.searchText;

      if (typeof this.axiosFun !== "function") {
        this.errLog("axiosFun should be a function");
        return;
      }
      this.axiosFun(params)
        .then(res => {
          this.loading = false;
          if (res.data.success) {
            let resd = res.data.data;
            let data = resd ? resd.list : [];
            this.isMore = resd.hasMore;
            this.dataList =
              this.currPage === 1 ? data : this.dataList.concat(data);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeInput() {
      this.searchList.filter(item => {
        return item.label.includes(this.searchText); // 对输入条件的搜索框进行排序
      });
      this.currPage = 1;
      if (!this.isLock) {
        this.getResult();
      }
      this.$emit("on-change", this.searchText);
    },
    changeCheck(data) {
      let resultList = []; // 展示框数组
      let parentData = [...this.parentData]; // 拷贝合并后的数据
      let searchList = [...this.searchList]; // 拷贝下拉框数据
      searchList.forEach(item => {
        item.priority = 0; // 令下拉框内的数据所有的优先级设置为 0
        data.forEach(element => {
          if (item.key === element) item.priority = 1; // 令在下拉框点击到的数据的优先级设置为 1
        });
      });
      searchList.sort((a, b) => {
        // 对数组内进行排序， priority为 1 的在前面
        return b.priority - a.priority;
      });
      this.checkResult.forEach(item => {
        parentData.forEach((element, index) => {
          if (element[this.dataKey] === item) {
            resultList.push(element); // 如果在父级数据找到所有点击的元素，把完整的数据放在展示框的数组里
          }
        });
      });
      this.removeRepeat(resultList, this.dataKey);
      this.resultList = resultList;
      this.$emit("on-success", this.checkResult);
    },
    // 关闭展示框内的元素
    closeItem(item) {
      let checkResult = [...this.checkResult]; // 拷贝最终结果数组
      checkResult.forEach((v, k) => {
        if (v === item[this.dataKey]) checkResult.splice(k, 1); // 如果在结果数据内找到点击的元素，删除它
      });
      this.resultList.forEach((element, index) => {
        if (element[this.dataKey] === item[this.dataKey])
          this.resultList.splice(index, 1); // 如果在展示框内找到点击的元素，删除它
      });
      this.checkResult = checkResult;
      this.$emit("on-success", this.checkResult);
    },
    // 数组去重
    removeRepeat(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i][key] === arr[j][key]) {
            arr.splice(j, 1);
            j = j - 1; // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
          }
        }
      }
    },
    errLog(s) {
      if (process.env.NODE_ENV === "development") {
        console.error(s);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.select_top {
  border: 1px solid #dcdee2;
  border-radius: 5px;
  color: #515a6e;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-right: 24px;
  &:hover {
    cursor: pointer;
    border-color: #ff9d5c;
  }
  .select_icon {
    position: absolute;
    transition: all 0.2s ease-in-out;
    top: 25%;
    right: 8px;
  }
  .icon_active {
    transform: rotate(-180deg);
  }
  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 1px;
    li {
      height: 24px;
      line-height: 22px;
      padding: 0 8px;
      margin: 3px 4px 3px 0;
      border: 1px solid #e8eaec;
      margin: 2px;
      background: #f7f7f7;
      border-radius: 3px;
      white-space: nowrap;
      .icon_span {
        display: inline-block;
        height: 24px;
        margin-left: 2px;
      }
    }
  }
}
.border_color {
  border-color: #ff9d5c;
}
.ivu-dropdown-item {
  padding: 0;
}
.ivu-checkbox-group-item {
  padding: 7px 16px;
  margin: 0;
  width: 100%;
}
.ivu-dropdown {
  /deep/ .ivu-select-dropdown {
    top: auto !important;
  }
}
/deep/ .ivu-scroll-container {
  overflow-y: auto;
  height: auto !important;
  max-height: 300px;
}
/deep/ .floatBox {
  max-width: 260px;
}

.span-holder {
  line-height: 30px;
  padding-left: 10px;
  color: #c5c8ce;
}
.data-none {
  padding: 7px 16px;
  text-align: center;
}
.search-input {
  padding: 7px 16px;
}
</style>
