<template>
  <Modal
    v-model="showModal"
    :title="title"
    :width="isDetail ? '50%' : '85%'"
    height="60%"
    :loading="loading"
    @on-ok="onSelect"
  >
    <div class="ivu-modal-body-div">
      <div
        v-if="!isDetail"
        class="from-good-list"
      >
        <p class="title">
          备选商品
        </p>
        <Form inline>
          <FormItem>
            <Input
              v-model="searchParams.skuCode"
              clearable
              placeholder="请输入商品ID"
            ></Input>
          </FormItem>
          <FormItem>
            <Input
              v-model="searchParams.spuName"
              clearable
              placeholder="请输入商品名称"
            ></Input>
          </FormItem>
          <FormItem>
            <Select
              v-model="searchParams.spuType"
              placeholder="请选择商品类型"
              @on-change="getTableData({})"
            >
              <!-- eslint-disable -->
              <Option :value="1" :disabled="typeArray.indexOf(1) === -1">优惠券</Option>
              <Option :value="2" :disabled="typeArray.indexOf(2) === -1">礼品卡</Option>
              <Option :value="3" :disabled="typeArray.indexOf(3) === -1">实物</Option>
              <Option :value="4" :disabled="typeArray.indexOf(4) === -1">兑换码</Option>
              <!-- eslint-enable -->
            </Select>
          </FormItem>
          <FormItem>
            <Button
              style="margin-right: 15px;"
              type="primary"
              @click="searchGood"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div class="select-div">
          共{{ total || 0 }}项
          <a
            class="select-other"
            @click="selectOther"
          >反选</a>
        </div>
        <div class="list">
          <div class="good-types"></div>
          <div class="good-list">
            <v-table
              :current="current"
              :total="total"
              :isShowPage="false"
              :pageSize="pageSize"
              :parColumns="columns"
              :parTableData="tableData"
              @changePage="changePage"
              @changePageSize="changePageSize"
              @selectHandle="selectGood"
            >
            </v-table>
          </div>
        </div>
      </div>
      <div
        v-if="!isDetail"
        class="transfer"
      >
        <Icon
          type="ios-arrow-dropright-circle"
          @click="addGood"
        />
        <Icon
          type="ios-arrow-dropleft-circle"
          @click="delGood"
        />
      </div>
      <div
        v-if="isDetail"
        style="width:100%"
      >
        <Table
          style="width:100%"
          :isShowPage="false"
          border
          stripe
          height="550"
          highlight-row
          :columns="rightColumns"
          :data="selectTableData"
        >
        </Table>
      </div>
      <div
        v-else
        class="to-good-list"
      >
        <p
          v-if="!isDetail"
          class="title"
        >
          栏目展示商品
        </p>
        <div class="list">
          <div class="good-list">
            <div class="select-div">
              共{{ selectTableData.length || 0 }}项
              <a
                class="select-other"
                @click="selectRightOther"
              >反选</a>
            </div>
            <Table
              :isShowPage="false"
              border
              stripe
              height="550"
              highlight-row
              :columns="rightColumns"
              :data="selectTableData"
              draggable
              @on-selection-change="selectRightGood"
              @on-drag-drop="dragDrop"
            >
            </Table>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isDetail"
      slot="footer"
    >
      <Button
        type="primary"
        @click="showModal=false"
      >
        关闭
      </Button>
    </div>
  </Modal>
</template>

<script>
import VTable from "_a/v-table/v-table";
import { goodColumns } from "./fields";
import { getCommodityManageList } from "_g/api/mall";

export default {
  name: "selectGoodModal",
  components: { VTable },
  data() {
    return {
      current: 1,
      total: 0,
      pageSize: 100,
      loading: true,
      columns: goodColumns(this),
      tableData: [],
      showModal: false,
      goodList: [],
      selectTableData: [],
      searchParams: { skuCode: "", spuName: "", spuType: "" },
      typeArray: [],
      isDetail: false,
      rightColumns: [],
      title: "",
    };
  },
  methods: {
    init(val) {
      this.getTableData();
      this.showModal = true;
      if (val.typeArray[0] === 0) {
        this.typeArray = [1, 2, 3, 4];
        this.searchParams.spuType = 1;
      } else {
        this.typeArray = JSON.parse(JSON.stringify(val.typeArray));
        if (this.typeArray.indexOf(4) !== -1) {
          this.searchParams.spuType = 4;
        }
        if (this.typeArray.indexOf(3) !== -1) {
          this.searchParams.spuType = 3;
        }
        if (this.typeArray.indexOf(2) !== -1) {
          this.searchParams.spuType = 2;
        }
        if (this.typeArray.indexOf(1) !== -1) {
          this.searchParams.spuType = 1;
        }
      }
      if (val.data.length != 0) {
        this.selectTableData = JSON.parse(JSON.stringify(val.data || "[]"));
      }
      if (val.isDetail) {
        this.isDetail = true;
        this.title = "查看商品";
        this.rightColumns = [
          {
            title: "商品名称",
            key: "spuName",
            align: "center",
            minWidth: 100,
          },
        ];
      } else {
        this.isDetail = false;
        this.title = "选择商品";
        this.rightColumns = [
          {
            type: "selection",
            align: "center",
            width: 50,
          },
          {
            title: "商品名称",
            key: "spuName",
            align: "center",
            minWidth: 100,
          },
        ];
      }
    },
    // 右边拖动排序
    dragDrop(index1, index2) {
      let index2Data = this.selectTableData.splice(
        index1,
        1,
        this.selectTableData[index2]
      );
      this.selectTableData.splice(index2, 1, index2Data[0]);
    },
    addGood() {
      // 需要判断多种情况
      // 1. 增加后的总数量是否大于num（商品展示数量）。 ---- 废弃这条检验
      // 2. 增加的时候，是不是已经被添加到已选择的商品里面了。
      // 3. 增加的时候，需要把选中的状态_checked全部置为false。
      // 4. 是否应该左边列表的数据（暂时不做）。
      let checkedData = [];
      // 先去重右边已经存在的数据，
      this.tableData
        .filter((item) => item._checked)
        .forEach((item) => {
          if (
            !this.selectTableData.some((selectItem) => selectItem.skuCode === item.skuCode)
          ) {
            let oneData = JSON.parse(JSON.stringify(item));
            // 去掉选中状态
            oneData._checked = false;
            checkedData.push(oneData);
          }
        });
      // 去重以后如果为空的时候直接返回
      if (!checkedData.length) {
        return this.$Message.error("没有选中商品，或者选中的商品已经添加了。");
      }
      // 判断数量是否超出 --- 不需要这条校验
      // if (this.num !== -1 && checkedData.length + this.selectTableData.length > this.num) {
      //   return this.$Message.error("选择的商品已经超过了商品展示数量：" + this.num + "个");
      // }
      // 所有的校验通过，把选中的数据加入到右边的选择框里面
      this.selectTableData.push(...checkedData);
    },
    delGood() {
      // 只是删除选中的数据，
      this.selectTableData = this.selectTableData.filter((item) => !item._checked);
    },
    // 右边列表反选
    selectRightOther() {
      this.selectTableData.forEach((item) => {
        item._checked = !item._checked;
      });
    },
    // 选中右边的商品
    selectRightGood(data) {
      let selectCode = data.map((item) => item.skuCode);
      this.selectTableData.forEach((tableData) => {
        tableData._checked = selectCode.indexOf(tableData.skuCode) !== -1;
      });
    },
    // 左边列表反选
    selectOther() {
      this.tableData.forEach((item) => {
        item._checked = !item._checked;
      });
    },
    // 选中左边的商品
    selectGood(data) {
      console.log(111, data);
      let selectCode = data.map((item) => item.skuCode);
      this.tableData.forEach((tableData) => {
        tableData._checked = selectCode.indexOf(tableData.skuCode) !== -1;
      });
    },
    searchGood() {
      this.getTableData();
    },
    getTableData(params) {
      let conf = {
        pageNum: this.current,
        pageSize: this.pageSize,
      };
      // 默认只查已上架的商品，（已上架和待上架的不能同时查，等后台支持）
      // conf.skuStatus = 1;
      conf.skuStatusList = [0, 1, 2];
      getCommodityManageList(Object.assign(
        params && Object.keys(params).length ? params : this.searchParams,
        conf
      )).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list.map((item) => {
          item._checked = false;
          return item;
        });
        this.total = data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },

    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    onSelect() {
      if (this.selectTableData.length === 0) {
        this.$Message.error("请选择商品！");
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        return false;
      }
      if (this.selectTableData.length > 50) {
        this.$Message.error("最多选择50个商品！");
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        return false;
      }
      this.showModal = false;
      this.$emit("select-good", this.selectTableData);
    },
  },
};
</script>

<style scoped>
.ivu-modal-body-div {
  display: flex;
}

.ivu-modal-body-div .ivu-form-item {
  width: 120px;
  margin: 10px 0;
}

.ivu-modal-body-div .ivu-form-item:last-child {
  float: right;
  width: 60px;
}

.from-good-list {
  width: 45%;
}

.transfer {
  width: 10%;
  height: inherit;
  display: flex;
  flex-direction: column;
  padding: 25% 0;
}

.transfer > i {
  font-size: 40px;
  text-align: center;
  cursor: pointer;
}

.to-good-list {
  width: 45%;
}
.w-90 {
  width: 90%;
}

/deep/ .ivu-modal {
  top: 6%;
}

/deep/ .ivu-modal-body {
  max-height: 700px;
  overflow: auto;
}

.to-good-list .good-list {
  margin-top: 54px;
}

.ivu-modal-body .title {
  margin: 10px 0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.select-div {
  text-align: left;
  font-size: 16px;
}

.select-div .select-other {
  float: right;
  margin-right: 25px;
}
</style>
