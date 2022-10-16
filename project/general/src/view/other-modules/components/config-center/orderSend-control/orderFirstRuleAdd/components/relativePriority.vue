<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 21:00:52
 * @LastEditTime: 2022-04-22 09:38:29
 * @Description: 用户群相对优先派单策略
-->
<template>
  <div>
    <div class="sub-title">
      用户群相对优先派单策略
    </div>
    <div class="button_btn20">
      <Button type="primary" @click="addUserGroup">
        添加用户群策略
      </Button>
    </div>
    <m2-table
      v-if="tableData && tableData.length > 0"
      :isLoading="isLoading"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :isShowPage="false"
      :height="300"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></m2-table>
    <userGroup ref="addFlock" @backData="getAddGroupData"></userGroup>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import userGroup from "./userGroup";
import {
  userColumns
} from "../fields";
import { deepClone } from "@/libs/util"
export default {
  components: {
    m2Table,
    userGroup
  },
  props: {
    infoData: {
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      current: 1,
      total: 0,
      pageSize: 10,
      columns: userColumns.columns(this),
      // 用户群相对优先策略
      GroupOrderSaveOrUpdateReq: {
        dispatchGroupDtos: []
      },
    }
  },
  computed: {
    tableData() {
      if (
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos &&
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.length > 0
      ) {
        let arr = JSON.parse(JSON.stringify(this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos));
        let data = arr.filter(item => {
          if (item.onlineStatus != 2) {
            return item;
          }
        });
        return data;
      } else {
        return [];
      }
    }
  },
  watch: {
    infoData: {
      handler: function(obj) {
        // 用详情更新表单数据
        this.$nextTick(() => {
          this.GroupOrderSaveOrUpdateReq = Object.assign(this.GroupOrderSaveOrUpdateReq, deepClone({}, obj))
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    addUserGroup() {
      this.$refs.addFlock.init({
        isAdd: true,
        tableData: this.tableData
      });
    },
    changePage(page) {},
    changePageSize(pageSize) {},
    getAddGroupData(val) {
      // this.$refs.form.validate();
      if (val.flag === "add") {
        delete val.flag;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.push(val);
      } else {
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].groupId =
          val.groupId;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].groupName =
          val.groupName;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[
          this.currentIndex
        ].dispatchWeight = val.dispatchWeight;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].onlineStatus =
          val.onlineStatus;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].nearbyDispatch =
          val.nearbyDispatch;
      }
    },
    // 编辑
    goEdit(val) {
      this.currentIndex = val._index;
      val.isHomeEdit = !this.isAdd;
      val.tableData = this.tableData;
      this.$refs.addFlock.init(val);
    },
    // 删除
    deleteItem(val) {
      this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos = this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.map(item => {
        if (
          item.groupId === val.groupId &&
          item.groupName === val.groupName
        ) {
          item.onlineStatus = 2;
        }
        return item;
      });
    },
    getFormData() {
      return new Promise((resolve, reject) => {
        if (this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos && !this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.length) {
          this.$Message.warning("用户群相对优先级策略不能为空")
          resolve(null)
        }
        resolve(this.GroupOrderSaveOrUpdateReq)
      })
    }
  },
}
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>