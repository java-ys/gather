<template>
  <div class="car-level-code">
    <Dropdown trigger="custom"
              :visible="visible"
              placement="bottom-start"
              transfer
              stop-propagation
              @on-visible-change="visibleChange"
              @on-clickoutside="closeDrop">
      <Input v-model="inputValue"
             class="main-input"
             :style="{
               width: inputWidth + 'px'
             }"
             :placeholder="placeholder"
             @on-focus="focusInput"
      >
      </Input>
      <Icon :type="visible ? 'ios-arrow-up' : 'ios-arrow-down'" class="ivu-select-arrow"></Icon>
      <div v-if="visible" slot="list" ref="dropDiv" class="car-level-drop-div">
        <div v-if="!inputValue || inputValue === selectedLevelText" ref="carSelectDiv" class="car-select">
          <div class="car-brand-div">
            <div class="select-title">请选择品牌</div>
            <div class="select-block">
              <div class="car-char-index">
                <ul>
                  <li v-for="letter in indexList"
                      :key="letter.firstLetter"
                      :class="`letter-li ${letter.firstLetter === selectedLetter ? 'active' : ''}`"
                      @click="scrollToLetter(letter.firstLetter)">{{letter.firstLetter}}</li>
                </ul>
              </div>
              <div class="car-brand-list">
                <ul ref="brandList" @scroll.passive="scrollBrand">
                  <li v-for="brand in brandList"
                      :key="brand.isLetter ? brand.firstLetter : brand.id"
                      :class="`brand-li ${brand.isLetter ? `letter-header letter-${brand.firstLetter}` : ''} ${brand.id === selectedBrandId ? 'active' : ''}`"
                      :data-letter="brand.firstLetter"
                      :title="brand.isLetter ? brand.firstLetter : brand.name"
                      @click="selectBrand(brand)"
                  >{{brand.isLetter ? brand.firstLetter : brand.name}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="selectedBrandId" class="car-series-list">
            <div class="select-title">请选择车系</div>
            <Spin v-if="seriesLoading" size="large" fix></Spin>
            <div v-else-if="seriesList.length" class="series-list">
              <ul>
                <li v-for="series in seriesList"
                    :key="series.isGroup ? series.groupName : series.id"
                    :class="`series-li ${series.isGroup ? 'group-header' : ''} ${series.id === selectedSeriesId ? 'active' : ''}`"
                    :title="series.isGroup ? series.groupName : series.seriesName"
                    @click="selectSeries(series)"
                >{{series.isGroup ? series.groupName : series.seriesName}}</li>
              </ul>
            </div>
            <div v-else>
              暂无数据
            </div>
          </div>
          <div v-if="selectedSeriesId" class="car-level-list">
            <div class="select-title">请选择车型</div>
            <Spin v-if="levelLoading" size="large" fix></Spin>
            <div v-else-if="levelList.length" class="level-list">
              <ul>
                <li v-for="level in levelList"
                    :key="level.isGroup ? level.groupName : level.id"
                    :class="`level-li ${level.isGroup ? 'group-header' : ''}`"
                    :title="level.isGroup ? level.groupName : level.levelName"
                    @click="selectLevel(level)"
                >{{level.isGroup ? level.groupName : level.levelName}}</li>
              </ul>
            </div>
            <div v-else>
              暂无数据
            </div>
          </div>
        </div>
        <div v-else class="car-search">
          <Spin v-if="searchLoading" size="large" fix></Spin>
          <div v-else-if="searchLevelList.length" class="car-list" :style="{
            width: inputWidth + 'px'
          }">
            <ul>
              <li v-for="level in searchLevelList"
                  :key="level.id"
                  class="search-level-li"
                  @click="selectLevel(level)"
              >{{combinedName(level)}}</li>
            </ul>
          </div>
          <div v-else class="empty-li" :style="{
            width: inputWidth + 'px'
          }">
            暂无数据
          </div>
        </div>
      </div>
    </Dropdown>
  </div>
</template>

<script>/**
 * @Desc: m2-web-asset
 * @Author: zhangke
 * @CreateTime: 2020/12/7 13:56
 */
import {
  queryBrandList, queryLevelByLikeName, queryLevelBySeriesId,
  querySeriesListByBrandId
} from "./api";

export default {
  name: "CarLevelCode",
  props: {
    inputWidth: {
      type: Number,
      default: 800
    },
    placeholder: {
      type: String,
      default: "请选择车型"
    },
    defaultText: {
      type: String,
      default: ""
    },
    // 选中以后展示的keys，默认展示{品牌名}{车系}{车型}
    showKeys: {
      type: Array,
      default() {
        return ["brandName", "seriesName", "levelName"];
      }
    },
    // 展示的分隔符，默认为-
    showSplitChar: {
      type: String,
      default() {
        return "-";
      }
    },
    // 是否点击以后立马回调
    changeImmediate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      inputValue: this.defaultText || "",
      searchLoading: false,
      searchLevelList: [],
      selectedLetter: "",
      brandList: [],
      selectedBrandId: "",
      selectedBrandName: "",
      seriesLoading: false,
      seriesList: [],
      selectedSeriesId: "",
      levelLoading: false,
      levelList: [],
      selectedLevelText: this.defaultText || ""
    }
  },
  computed: {
    indexList() {
      return this.brandList.filter(item => item.isLetter);
    }
  },
  watch: {
    inputValue(value) {
      if (this.selectedLevelText === value) {
        return;
      }
      this.selectedLevelText = "";
      this.getSearchLevelData(value);
    },
    defaultText(value) {
      if (!this.selectedLevelText && !this.inputValue && value) {
        this.selectedLevelText = value;
        this.inputValue = value;
      }
    }
  },
  mounted() {
    this.getBrandList();
  },
  methods: {
    getBrandList() {
      // 获取品牌的时候，清空之前的数据
      this.brandList = [];
      this.selectedLetter = "";
      this.selectedBrandId = "";
      this.selectedBrandName = "";
      this.seriesList = [];
      this.selectedSeriesId = "";
      this.levelList = [];
      queryBrandList().then(res => {
        if (res && res.data && res.data.success) {
          const brandList = res.data.data || [];
          let letter = "#";
          brandList.sort((x, y) => ((x.firstLetter || "#").toUpperCase() > (y.firstLetter || "#").toUpperCase() ? 1 : -1)).forEach(item => {
            if (!item.firstLetter) {
              this.brandList.push({
                isLetter: true,
                firstLetter: "#"
              });
            } else if (item.firstLetter !== letter) {
              letter = item.firstLetter;
              this.brandList.push({
                isLetter: true,
                firstLetter: item.firstLetter
              });
            }
            this.brandList.push(item);
          });
          this.selectedLetter = this.brandList.length ? this.brandList[0].firstLetter : "";
        }
      });
    },
    getSeriesList(brand) {
      // 获取车系的时候，需要重置一下数据
      this.seriesList = [];
      this.selectedSeriesId = "";
      this.levelList = [];
      this.seriesLoading = true;
      querySeriesListByBrandId({
        brandId: brand.id
      }).then(res => {
        if (res && res.data && res.data.success) {
          let seriesList = (res.data.data || []).sort((x, y) => ((x.factoryOwner || "") > (y.factoryOwner || "") ? 1 : -1));
          let groupName = seriesList[0].factoryOwner;
          this.seriesList.push({
            isGroup: true,
            groupName
          });
          seriesList.forEach(item => {
            if (!item.factoryOwner) {
              this.seriesList.push({
                isGroup: true,
                groupName: "#"
              });
            } else if (item.factoryOwner !== groupName) {
              groupName = item.factoryOwner;
              this.seriesList.push({
                isGroup: true,
                groupName: item.factoryOwner
              });
            }
            this.seriesList.push(item);
          });
        }
      }).finally(() => {
        this.seriesLoading = false;
      });
    },
    getLevelList(series) {
      this.levelLoading = true;
      this.levelList = [];
      queryLevelBySeriesId({
        seriesId: series.id
      }).then(res => {
        if (res && res.data && res.data.success) {
          let levelList = (res.data.data || []).sort((x, y) => ((x.levelYear || "") > (y.levelYear || "") ? 1 : -1));
          let groupName = levelList[0].levelYear;
          this.levelList = [];
          this.levelList.push({
            isGroup: true,
            groupName
          });
          levelList.forEach(item => {
            if (!item.levelYear) {
              this.levelList.push({
                isGroup: true,
                groupName: "#"
              });
            } else if (item.levelYear !== groupName) {
              groupName = item.levelYear;
              this.levelList.push({
                isGroup: true,
                groupName: item.levelYear
              });
            }
            this.levelList.push(item);
          });
        }
      }).finally(() => {
        this.levelLoading = false;
      });
    },
    getSearchLevelData(likeLevelName) {
      this.searchLoading = true;
      this.searchLevelList = [];
      if (likeLevelName) {
        // 改变展示方式以后，高度会变化，这个时候触发一下resize事件来改变下拉框的位置
        this.$nextTick(() => {
          if (document.createEvent) {
            // 大部分浏览器
            let event = document.createEvent("HTMLEvents");
            event.initEvent("resize", true, true);
            window.dispatchEvent(event);
          } else if (document.createEventObject) {
            // IE
            window.fireEvent("onresize");
          }
        })
      } else {
        return;
      }
      queryLevelByLikeName({
        likeLevelName
      }).then(res => {
        if (res && res.data && res.data.success) {
          this.searchLevelList = res.data.data || [];
        }
      }).finally(() => {
        this.searchLoading = false;
      })
    },
    selectBrand(brand) {
      // 分类项点击直接不处理
      if (brand.isLetter) {
        return;
      }
      this.selectedBrandId = brand.id;
      this.selectedBrandName = brand.name;
      if (this.changeImmediate) {
        this.setValue({
          brandId: brand.id,
          brandName: brand.name
        });
      }
      this.getSeriesList(brand);
    },
    selectSeries(series) {
      // 分类项点击直接不处理
      if (series.isGroup) {
        return;
      }
      this.selectedSeriesId = series.id;
      if (this.changeImmediate) {
        this.setValue({
          brandId: this.selectedBrandId,
          brandName: this.selectedBrandName,
          seriesId: series.id,
          seriesName: series.seriesName
        });
      }
      this.getLevelList(series);
    },
    selectLevel(level) {
      this.visible = false;
      this.setValue(level);
    },
    setValue(level) {
      this.inputValue = this.combinedName(level);
      this.selectedLevelText = this.inputValue;
      this.$emit("on-change", level);
    },
    combinedName(level) {
      return this.showKeys.map(item => level[item]).filter(item => !!item).join(this.showSplitChar)
    },
    scrollToLetter(letter, scroll) {
      this.selectedLetter = letter;
      // 如果是滚动的，则只重置选中的letter，不滚动品牌list
      if (scroll) {
        return;
      }
      let scrollContainer = this.$refs.brandList;
      let scrollToEle = scrollContainer.querySelector(".letter-" + letter);
      // 5是margin的高度，
      scrollContainer.scrollTop = scrollToEle.offsetTop - scrollContainer.offsetTop - 5;
    },
    scrollBrand() {
      if (this.scrolling) {
        return;
      }
      // 做一个节流
      this.scrolling = true;
      this.scrollLetter();
      setTimeout(() => {
        this.scrolling = false;
        this.scrollLetter();
      }, 200)
    },
    scrollLetter() {
      let scrollContainer = this.$refs.brandList;
      let letterHeader = [...scrollContainer.querySelectorAll(".letter-header")];
      if (!letterHeader.length) {
        return;
      }
      let letter = letterHeader[0].getAttribute("data-letter");
      letterHeader.forEach(item => {
        if (item.offsetTop < scrollContainer.scrollTop + scrollContainer.offsetTop + 15) {
          letter = item.getAttribute("data-letter");
        }
      });
      this.scrollToLetter(letter, true);
    },
    visibleChange(visible) {
      if (visible) {
        this.getBrandList();
      }
    },
    focusInput() {
      // 事件冒泡会触发closeDrop，延时一下。
      setTimeout(() => {
        this.visible = true;
      }, 200)
    },
    closeDrop(e) {
      // 点击的时候，不包含的时候，关闭选择框
      // tansfer模式下，点击内部元素，也会触发clickoutside方法，这里做兼容
      if (e && !this.contains(this.$refs.dropDiv, e.target) && this.visible) {
        this.visible = false;
      }
    },
    contains(parent, node) {
      if (document.documentElement.contains) {
        return parent !== node && parent.contains(node)
      }
      let currentNode = node;
      while (currentNode) {
        if (currentNode === parent) return true;
        currentNode = currentNode.parentNode;
      }
      return false
    },
    clearValue() {
      this.inputValue = "";
      this.selectedLevelText = "";
      this.searchLevelList = [];
      this.selectedLetter = "";
      // this.brandList = [];
      this.selectedBrandId = "";
      this.selectedBrandName = "";
      this.seriesLoading = false;
      this.seriesList = [];
      this.selectedSeriesId = "";
      this.levelLoading = false;
      this.levelList = [];
      this.$emit("on-change");
    }
  }
}
</script>
<style>
  .ivu-select-dropdown.ivu-dropdown-transfer {
    max-height: inherit !important;
  }
</style>
<style scoped lang="less">

  .car-level-drop-div {
    line-height: 32px;
    font-size: 12px;

    /deep/ .ivu-select-dropdown {
      padding: 0;
      top: 34px !important;
    }

    .car-search {
      max-height: 554px;
      overflow-y: auto;

      .empty-li {
        /*margin: 10px;*/
        text-align: center;
      }

      .search-level-li {
        margin: 5px 10px;
        text-align: left;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }
      }
    }

    .car-select {
      display: flex;

      .group-header, .letter-header, .letter-li {
        text-align: center;
        color: #000;
        background: #ededed;
        cursor: default;

        &:hover {
          background: #ededed;
        }
      }

      .select-title {
        text-align: center;
        font-size: 18px;
        padding: 10px;
      }

      ul > li {
        margin: 5px 0;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }

        &.active {
          /*border: 1px solid #2d8cf0;*/
          color: #2d8cf0;
          background: #fff;

          &:hover {
            background: #fff;
          }
        }
      }

      .car-brand-div {
        border: 1px solid #ccc;

        .select-block {
          display: flex;
          padding: 10px;

          .car-char-index {
            width: 24px;
            text-align: center;
            margin-right: 10px;

            .letter-li {
              cursor: pointer;
            }
          }

          .car-brand-list {
            width: 180px;
            text-align: left;
            margin-right: 10px;

            ul {
              height: 480px;
              overflow-y: auto;
            }

            .brand-li {
              width: 160px;
              white-space: nowrap;
              overflow-x: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .car-series-list {
        padding: 10px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        width: 200px;
        text-align: left;
        position: relative;

        .series-li {
          width: 180px;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
        }
      }

      .car-level-list {
        border: 1px solid #ccc;
        width: 360px;
        padding: 10px;
        text-align: left;
        position: relative;

        .level-li {
          width: 340px;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
