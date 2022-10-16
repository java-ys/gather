<template>
  <div>
    <m2-table
      class="top15"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      :isShowPage="false"
    >
      <template
        slot-scope="params"
        slot="action"
      >
        <Button
          v-hasAuth="'servercard-word-edit'"
          ghost
          type="success"
          size="small"
          @click="editItem(params.data.row)"
        >编辑</Button>
      </template>
    </m2-table>
    <edit-word
      :show="isEditWord"
      :editInfo="editInfo"
      @close="isEditWord=false"
      @getList="getTableList"
    ></edit-word>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import editWord from './edit-word.vue'
import { parColumns } from "./fields";
import {
  axiosRecordTextList
} from "_o/api/operator-center/server-card";

export default {
  name: "",
  data () {
    return {
      parColumns: parColumns(this),
      tableData: [],
      isLoading: true,
      selectList: [],
      isEditWord: false,
      editInfo: {}
    };
  },
  components: {
    m2Table,
    editWord
  },
  mounted () {
    this.getTableList();
  },
  methods: {
    getTableList () {
      this.isLoading = true
      axiosRecordTextList({}).then(res => {
        this.isLoading = false
        this.tableData = res.data.data || [];
      }).catch(err => {
        this.isLoading = false
        this.tableData = []
      });
    },
    // 编辑
    editItem (item) {
      this.editInfo = item
      this.isEditWord = true
    }
  }
};
</script>
<style lang='less'>
</style>