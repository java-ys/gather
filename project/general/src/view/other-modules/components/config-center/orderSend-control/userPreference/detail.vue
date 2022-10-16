<template>
  <Modal v-model="showModal" :title="title" width="800px" :z-index="1">
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="城市" prop="cityInfos">
        {{ cityName }}
      </FormItem>
      <br />
      <!-- <FormItem label="业务线" prop="productLines">
        {{ productLineName }}
      </FormItem> -->
      <br />
      <FormItem label="用户群" prop="dispatchGroupDtos">
        <v-table
          v-if="dispatchGroupDtos && dispatchGroupDtos.length > 0"
          :current="current"
          :total="total"
          :pageSize="pageSize"
          :parColumns="columns"
          :isShowPage="false"
          :height="300"
          :parTableData="dispatchGroupDtos"
        ></v-table>
      </FormItem>
      <br />
    </Form>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { userDetailColumns, getServiceTypeName } from "./fields";
import { uuidGroupSearch } from "_o/api/configData.js";
export default {
  name: "detail",
  data() {
    let { columns } = userDetailColumns;
    return {
      showModal: false,
      title: "详情",
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 1000,
      cityName: "",
      productLineName: "",
      dispatchGroupDtos: [],
      formData: {},
      formValidate: {
        cityInfos: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        productLines: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        dispatchGroupDtos: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.dispatchGroupDtos = [];
      this.cityName = val.cityName;
      this.productLineName = getServiceTypeName(val.productLine);
      uuidGroupSearch({
        uuid: val.uuid,
        currPage: 1,
        pageSize: 10000
      }).then(res => {
        this.isLoading = false;
        let data = res.data.data || {};
        this.dispatchGroupDtos = data.list;
      });
    }
  }
};
</script>
