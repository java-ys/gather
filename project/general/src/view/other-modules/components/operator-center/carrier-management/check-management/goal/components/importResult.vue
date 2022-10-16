<template>
  <div>
    <div>
      <RadioGroup v-model="type" type="button" size="large">
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
    tableColumns({columns}) {
      return JSON.parse(JSON.stringify(columns))
    }
  },
  data() {
    return {
      type: 0,
      isLoading: false,
    }
  },
  methods: {

  }
}
</script>
