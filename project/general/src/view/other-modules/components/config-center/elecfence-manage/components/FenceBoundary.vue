<template>
  <div>
    <div class="layerMapsearch">
      <div class="area-group">
        <Cascader
          v-model="provinceCityCode"
          :data="cityoptions"
          placeholder="请选择行政区划"
          change-on-select
          filterable
          @on-change="editCascaderChange"
        >
        </Cascader>
        <Button
          class="ml10"
          type="primary"
          :disabled="!boundaryisShow"
          @click="handleBoundary"
        >{{boundaryFlag ? "显示边界" : "隐藏边界"}}</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { getProvinceCityDistrictTree } from "_o/api/fence.js";
export default {
  name: "FenceBoundary",
  props: {
    map: null,
  },
  data() {
    return {
      cityoptions: [], // 省市区三级联动数据
      provinceCityCode: [], // 选中的三级联动数据
      boundaryFlag: true, // 显示边界/隐藏边界
      boundaryPolygons: [], // 显示隐藏边界数据实例
      provinceCityCodeLabel: "", // 选中的地区
    };
  },
  computed: {
    boundaryisShow() {
      return this.provinceCityCode.length > 1;
    },
  },
  created() {
    // 获取省市区联动数据
    getProvinceCityDistrictTree().then((res) => {
      const data = res.data;
      if (data.code === 200) {
        const list = data.data.data || [];
        this.formatTree(list);
      }
    });
  },
  methods: {
    // 换树的属性
    formatTree(list) {
      const mapTree = (org) => {
        const haveChildren = Array.isArray(org.child) && org.child.length > 0;
        return {
          value: org.orgCode,
          label: org.orgName,
          children: haveChildren
            ? org.child.map((child) => mapTree(child))
            : [],
        };
      };
      this.cityoptions = list.map((org) => mapTree(org));
    },
    // 显示绘制边界
    drawBounds() {
      let self = this;
      let district = null;
      // 加载行政区划插件
      if (!district) {
        // 实例化DistrictSearch
        let opts = {
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: "all", // 返回行政区边界坐标组等具体信息
          level: "district", // 查询行政级别为 市
        };
        district = new AMap.DistrictSearch(opts);
      }
      // 行政区查询
      district.search(this.provinceCityCodeLabel, function (status, result) {
        self.map.remove(self.boundaryPolygons); // 清除上次结果
        self.boundaryPolygons = [];
        let bounds = result.districtList[0].boundaries;
        if (bounds) {
          for (let i = 0, l = bounds.length; i < l; i++) {
            // 生成行政区划polygon
            let polygon = new AMap.Polygon({
              path: bounds[i],
              fillColor: "#3300FF",
              strokeColor: "#000",
              strokeOpacity: 1,
              strokeStyle: "dashed",
              strokeWeight: 2,
              fillOpacity: 0,
            });
            self.boundaryPolygons.push(polygon);
          }
        }
        self.map.add(self.boundaryPolygons);
        self.map.setFitView(self.boundaryPolygons); // 视口自适应
      });
    },
    // 隐藏边界
    removeBounds() {
      this.boundaryPolygons.forEach((item) => {
        item.hide();
      });
      this.boundaryPolygons = [];
    },

    // toggle 显示 or 隐藏
    handleBoundary() {
      this.boundaryFlag = !this.boundaryFlag;
      if (this.boundaryFlag) {
        this.removeBounds();
      } else {
        this.drawBounds();
      }
    },
    // 地图悬浮城市下拉框选择事件
    editCascaderChange(value, selectedData) {
      if (value && value.length) {
        this.boundaryFlag = true;
        this.provinceCityCodeLabel =
          selectedData[selectedData.length - 1]["label"];
      } else {
        this.provinceCityCode = [];
        this.removeBounds();
      }
    },
    // 处理弹窗关闭事件-清空之前选择的数据
    handleClearModle() {
      this.removeBounds();
      this.provinceCityCode = [];
    },
  },
};
</script>
<style scoped lang="less">
.layerMapsearch {
  position: absolute;
  top: 10px;
  left: 490px;
  z-index: 9;
  .area-group {
    display: inline-flex;
    .ml10 {
      margin-left: 10px;
    }
  }
}
</style>
