<template>
  <Modal
    v-model="showModal"
    :title="title"
    :mask-closable="false"
    width="800px"
    :z-index="1"
    @on-visible-change="modalChange"
  >
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <Row>
        <FormItem label="城市" prop="cityInfos">
          <Cascader
            filterable
            :data="provinceCityList"
            v-model="formData.cityInfos"
            style="width: 180px"
            :disabled="!isAdd"
          ></Cascader>
          <!-- <TreeInputs
          :data="provinceCityList"
          :showCheckbox="false"
          :multiple="false"
          v-model="formData.cityInfos"
          @on-change="changeCity"
          v-if="isAdd"
        >
        </TreeInputs>
        <Select
          v-if="!isAdd"
          style="width:300px"
          v-model="formData.cityInfos"
          disabled
        >
          <Option :value="cityCode">{{ cityName }}</Option>
        </Select> -->
        </FormItem>
      </Row>
      <!-- <FormItem label="业务线" prop="productLines">
        <Select
          v-model="formData.productLines"
          clearable
          style="width:300px"
          multiple
          :disabled="!isAdd"
        >
          <Option :value="4">快享</Option>
          <Option :value="2">专享</Option>
          <Option :value="1">出租车</Option>
        </Select>
      </FormItem>
      <br /> -->
      <Row>
        <FormItem label="用户群" prop="userGroupList">
          <Button type="primary" style="margin-bottom: 10px" @click="addData"
            >添加用户群</Button
          >
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
        </FormItem>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">完成</Button>
    </div>
    <addFlock ref="addFlock" @backData="getAddGroupData" />
  </Modal>
</template>

<script>
import {
  userAbsPreferenceListAdd,
  uuidGroupSearch,
  updateGroupAbs,
} from "_o/api/configData.js";
import {
  userColumns,
  getProvinceIdByCityUuid,
  getProvinceNameByCityUuid,
} from "./fields";
import addFlock from "./addFlock";
import TreeInputs from "_a/tree-input/tree-input.vue";
import m2Table from "_a/m2-table/v-table";

export default {
  name: "add",
  components: {
    addFlock,
    TreeInputs,
    m2Table,
  },
  data() {
    let { columns } = userColumns;

    return {
      showModal: false,
      title: "新增策略",
      columns: columns(this),
      isLoading: false,
      current: 1,
      total: 0,
      pageSize: 10,
      formData: {
        cityInfos: [],
        // productLines: [],
        dispatchGroupDtos: [],
        nearbyDispatch: "",
        absolutelyDispatch: "",
      },
      formValidate: {
        cityInfos: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change",
          },
        ],
        // productLines: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "必选",
        //     trigger: "change"
        //   }
        // ],
        userGroupList: [
          {
            required: true,
            message: "必选",
            trigger: "change",
          },
        ],
      },
      provinceCityList: [],
      currentIndex: "",
      isAdd: true,
      cityName: "",
      cityCode: "",
      strategyUuid: "",
    };
  },
  computed: {
    tableData() {
      if (
        this.formData.dispatchGroupDtos &&
        this.formData.dispatchGroupDtos.length > 0
      ) {
        let arr = JSON.parse(JSON.stringify(this.formData.dispatchGroupDtos));
        let data = arr.filter((item) => {
          if (item.onlineStatus != 2) {
            return item;
          }
        });
        data.map((item) => {
          item.absolutelyDispatch = item.absolutelyDispatch ? true : false;
          item.nearbyDispatch = item.nearbyDispatch ? true : false;
        });
        return data;
      } else {
        return [];
      }
    },
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.formData = {
        cityInfos: [],
        // productLines: [],
        dispatchGroupDtos: [],
      };
      let arr = JSON.parse(JSON.stringify(val));
      this.provinceCityList = val.provinceCityList;
      // this.provinceCityList = arr.provinceCityList.map(item => {
      //   item.children = item.children.map(yItem => {
      //     return {
      //       title: yItem.city,
      //       value: yItem.value
      //     };
      //   });
      //   return {
      //     title: item.province,
      //     value: item.value,
      //     children: item.children
      //   };
      // });
      // 新增
      if (val.flag === "add") {
        this.title = "新增策略";
        this.isAdd = true;

        this.formData = {
          cityInfos: [],
          // productLines: [],
          dispatchGroupDtos: [],
          userGroupList: "1",
        };
      }
      // 编辑
      else {
        this.$refs.form.resetFields();
        this.title = "编辑策略";
        this.isAdd = false;
        this.cityName = val.cityName;
        this.cityCode = val.cityCode;
        (this.cityCode = val.cityID), (this.strategyUuid = val.uuid);
        this.formData = {
          // productLines: [val.productLine],
          dispatchGroupDtos: [],
          userGroupList: "1",
        };
        const provinceId = getProvinceIdByCityUuid(
          val.cityCode,
          this.provinceCityList
        );
        this.formData = {
          // productLines: [val.productLine],
          cityInfos: [provinceId, val.cityCode],
          dispatchGroupDtos: [],
          userGroupList: "1",
        };
        this.isLoading = true;
        uuidGroupSearch({
          uuid: val.uuid,
          currPage: 1,
          pageSize: 10000,
        }).then((res) => {
          this.isLoading = false;
          let data = res.data.data || {};
          this.formData.dispatchGroupDtos = data.list;
        });
      }
    },
    changePage(page) {},
    changePageSize(pageSize) {},
    addData() {
      this.$refs.addFlock.init({
        isAdd: true,
        tableData: this.tableData,
      });
    },
    goEdit(val) {
      this.currentIndex = val._index;
      val.isHomeEdit = !this.isAdd;
      val.tableData = this.tableData;
      this.$refs.addFlock.init(val);
    },
    deleteItem(val) {
      this.formData.dispatchGroupDtos = this.formData.dispatchGroupDtos.map(
        (item) => {
          if (
            item.groupId === val.groupId &&
            item.groupName === val.groupName
          ) {
            item.onlineStatus = 2;
          }
          return item;
        }
      );
    },
    getAddGroupData(val) {
      this.$refs.form.validate();
      if (val.flag === "add") {
        delete val.flag;
        this.formData.dispatchGroupDtos.push(val);
      } else {
        const index = this.formData.dispatchGroupDtos.findIndex(item =>item.groupId===val.groupId);
        this.formData.dispatchGroupDtos[index].groupId =
          val.groupId;
        this.formData.dispatchGroupDtos[index].groupName =
          val.groupName;
        this.formData.dispatchGroupDtos[index].onlineStatus =
          val.onlineStatus;
        this.formData.dispatchGroupDtos[index].absolutelyDispatch =
          val.absolutelyDispatch;
        this.formData.dispatchGroupDtos[index].nearbyDispatch =
          val.nearbyDispatch;
      }
    },
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
      if (this.tableData.length === 0) {
        this.$Message.warning("请添加用户群");
        return;
      }
      const proviennce = this.provinceCityList.find(
          (p) => p.value === this.formData.cityInfos[0]
        );
        const cityInfo = proviennce.children.find(
          (p) => p.cityID === this.formData.cityInfos[1]
        );
      if (this.isAdd) {
        const params = JSON.parse(JSON.stringify(this.formData));
        params.cityUuid = cityInfo.cityUuid;
        (params.cityName = cityInfo.city),
          (params.cityCode = cityInfo.cityID),
          params.dispatchGroupDtos.map((item) => {
            item.absolutelyDispatch = item.absolutelyDispatch ? 1 : 0;
            item.nearbyDispatch = item.nearbyDispatch ? 1 : 0;
          });
        delete params.cityInfos;

        userAbsPreferenceListAdd(params).then((res) => {
          this.showModal = false;
          this.$emit("reload");
        });
      } else {
        this.formData.dispatchGroupDtos = this.formData.dispatchGroupDtos.map(
          (item) => {
            item.cityCode = this.formData.cityInfos[0];
            item.cityUuid = cityInfo.cityUuid;
            // item.productLine = this.formData.productLines[0];
            item.strategyUuid = this.strategyUuid;
            return item;
          }
        );
        updateGroupAbs({
          dispatchGroupDtos: this.formData.dispatchGroupDtos,
        }).then((res) => {
          this.showModal = false;
          this.$emit("reload");
        });
      }
    },
    modalChange(val) {
      this.$refs.form.resetFields();
    },
    changeCity(val) {
      this.$refs.form.validate();
    },
  },
};
</script>
