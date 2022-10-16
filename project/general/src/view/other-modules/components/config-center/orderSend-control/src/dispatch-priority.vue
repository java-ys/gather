<template>
  <div>
    <page-table
      ref="pageTable"
      :input-list="inputList"
      :fn="queryList"
      :par-columns="columns"
    >
      <Button
        v-hasAuth="'dispatch-priority-add'"
        type="primary"
        @click="add"
      >
        新建
      </Button>
    </page-table>
    <add-model
      ref="addModal"
      v-model="modalStatus"
      :width="500"
      :title="modalTitle"
      :type="type"
      @success="success"
    >
      <add-data
        ref="addData"
        :add-params="addParams"
        :all-cities="addCityList"
        :type="type"
      ></add-data>
    </add-model>
  </div>
</template>

<script>
import pageTable from "_o/components/page-table";
import addModel from "_o/components/add-modal";
import addData from "_o/components/config-center/orderSend-control/src/add-data";
import {
  getTableColumns,
  inputList,
  transportMap
} from "_o/components/config-center/orderSend-control/src/filed";
import { priorityEdit, priorityPage, prioritySave } from "_o/api/callTogether/index.js";
import { getProvinceCityList } from "_g/api/common";
import { cpTranslate } from "@/libs/tools";

export default {
  name: "dispatch-priority",
  components: {
    addModel,
    pageTable,
    addData
  },
  data() {
    return {
      inputList: inputList,
      columns: getTableColumns(this),
      queryList: priorityPage,
      modalStatus: false,
      modalTitle: "新建",
      type: "add",
      addCityList: [],
      addParams: {
        transportId: "",
        cityUuids: [],
        businessTypes: "",
        priorityFactor: ""
      },
      uuid: ""
    };
  },
  computed: {
    formatAddParams() {
      return {
        ...this.addParams,
        state: 0,
        transportName: transportMap[this.addParams.transportId]
      }
    },
    formatEditParams() {
      return {
        uuid: this.uuid,
        priorityFactor: this.addParams.priorityFactor,
      }
    }
  },
  mounted() {
    this.getCityList()
  },
  methods: {
    add() {
      this.modalStatus = true;
      this.modalTitle = "新建";
      this.type = "add";
    },
    async success() {
      if (this.type === "add") {
        let ok = await this.promiseFn(prioritySave(this.formatAddParams));
        if (ok) {
          this.$Message.success("新建成功");
        } else {
          return;
        }
      }
      if (this.type === "edit") {
        let ok = await this.promiseFn(priorityEdit(this.formatEditParams));
        if (ok) {
          this.$Message.success("编辑成功");
        } else {
          return;
        }
      }
      this.$refs["addModal"].clear();
      this.modalStatus = false;
      this.$nextTick(() => {
        this.$refs.pageTable.onShow();
      });
    },
    edit(v) {
      this.addParams.priorityFactor = v.priorityFactor;
      this.addParams.cityName = v.cityName;
      this.addParams.transportId = v.transportId;
      this.addParams.businessTypes = v.businessType;
      this.uuid = v.uuid;
      this.modalStatus = true;
      this.modalTitle = "编辑";
      this.type = "edit";
    },
    promiseFn(fn) {
      return new Promise(resolve => {
        fn.then(res => {
          if (res.data.code === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(reason => {
          resolve(false);
        });
      });
    },
    getCityList() {
      getProvinceCityList().then(res => {
        this.addCityList = this.formatCityList(res.data.data);
        this.inputList[1].cascaderList = cpTranslate(res.data.data);
      });
    },
    formatCityList(v) {
      if (!v) return [];
      let arr = JSON.parse(JSON.stringify(v))
      arr.forEach(item => {
        item.value = item.provinceID
        item.label = item.province
        item.title = item.province
        item.uuid = item.provinceID
        item.children = item.nodes
        item.children.forEach(it => {
          it.cityFather = item.provinceID
          it.value = it.cityUuid
          it.label = it.city
          it.title = it.city
          it.uuid = it.cityUuid
        })
      })
      return arr
    },
    async close(v, s) {
      const message = {
        0: "启用",
        1: "停用"
      }
      const params = {
        uuid: v.uuid,
        state: s
      }
      const ok = await this.confirm(message[s], priorityEdit, params);
      if (ok) this.successCallBack(message[s]);
    },
    successCallBack(msg) {
      this.$Message.success(`${msg}成功`);
      this.$nextTick(() => {
        this.$refs.pageTable.onShow();
      })
    },
    confirm(content, fn, params, type = false) {
      return new Promise(resolve => {
        this.$Modal.confirm({
          title: "提示",
          content: `确认${content}此策略？`,
          onOk: () => {
            fn(params)
              .then(res => {
                if (type) {
                  resolve(res.data.data);
                } else {
                  resolve(true);
                }
              })
              .catch(reason => {
                resolve(false);
              });
          }
        });
      });
    },
  }
};
</script>

<style scoped></style>
