<!--
 * @Author: xuanleilei
 * @Date: 2022-04-18 17:21:30
 * @LastEditors: xuanleilei
 * @LastEditTime: 2022-08-03 18:21:25
 * @Description:
-->
<template>
  <div>
    <div>
      <RadioGroup v-model="type" type="button" size="large" @on-change="onTabChange">
        <Radio :label="0">成功</Radio>
        <Radio :label="1">失败</Radio>
      </RadioGroup>
    </div>
    <m2-table
      class="top15"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      :isShowPage="false"
      :height="300"
    >
    </m2-table>
  </div>
</template>
total
<script>
import m2Table from "_a/m2-table/v-table";
import {importColumn} from "../fields"

export default {
  name: 'import-result',
  components: {
    m2Table
  },
  props: {
    pData: {
      type: Object,
      default: function() {
        return {
          failList: [],
          successList: []
        }
      }
    },
    columns: {
      type: Array,
      default: function(){
        return importColumn
      }
    }
  },
  computed: {
    tableData({ type, pData }) {
      return type - 1 === 0 ? pData.failList: pData.successList;
    },
    // tableColumns({columns}) {
    //   return JSON.parse(JSON.stringify(columns))
    // }
  },
  data() {
    return {
      type: 0,
      isLoading: false,
      tableColumns: JSON.parse(JSON.stringify(this.columns))
    }
  },
  methods: {
    onTabChange(val) {
      if (val === 1) {
        // 失败列表 添加列失败原因
        this.tableColumns.push({
          title: "失败原因",
          key: "importRemark",
          tooltip: true,
          minWidth: 200
        })
      } else {
        this.tableColumns.pop()
      }
    }
  }
}
</script>
