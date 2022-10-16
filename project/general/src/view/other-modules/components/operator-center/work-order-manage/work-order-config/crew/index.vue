<template>
  <div>
    <searchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="handleReset"
      ref="searchList"
    >
    </searchList>
    <div class="action">
      <Button
        type="primary"
        @click="onCreate"
        v-hasAuth="'work-order-config-crew-create'"
        >新建</Button
      >
    </div>
    <VTable
      :total="table.total"
      :current="table.pageNum"
      :pageSize="table.pageSize"
      :parColumns="tableColumn"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
    >
    </VTable>
    <Modal
      ref="modal"
      v-model="showModal"
      :title="type === 0 ? '新建' : '编辑'"
      :width="700"
      :mask-closable="false"
      @on-ok="onOk"
    >
      <Form ref="form" :model="form" :rules="formRule" :label-width="120">
        <FormItem label="所属类别：" prop="category">
          <Select
            v-model="form.category"
            clearable
            class="item-width"
            @on-change="onChangeCategory"
          >
            <Option
              v-for="(item, index) in categoryMap"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="角色组：" prop="group">
          <Select
            v-model="form.group"
            clearable
            class="item-width"
            @on-change="onChangeGroup"
          >
            <Option
              v-for="(item, index) in groupMap"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="城市：" prop="cityCode" v-if="isNeedCity">
          <Select
            v-model="form.cityCode"
            multiple
            filterable
            class="item-width"
            @on-change="cityChange"
          >
            <Option
              v-for="(yItem, yIndex) in cityList"
              :value="yItem.cityCode"
              :key="yIndex"
            >{{ yItem.cityName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="手机号：" prop="phone">
          <Input
            v-model="form.phone"
            clearable
            @on-change="onChangePhone"
            :disabled="!!type"
            placeholder="请输入"
            class="item-width"
          ></Input>
        </FormItem>
        <FormItem label="姓名：" prop="userName">
          <Input
            v-model="user.userName"
            readonly
            :disabled="!!type"
            class="item-width"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { inputList, tableColumn, formRule, PATTERN_PHONE } from "./fields";
import {
  fetchGroupList,
  fetchGroupCategoryList,
  fetchStaffInfoByPhone,
  pullUsersJoin,
  pullRemoveUser,
  pullUpdateUser,
  fetchCategoryList,
  fetchCityList
} from "_o/api/work-order/work-order-config";

const nation_code = "100000"; // 全国的code

export default {
  name: "crew",
  data() {
    return {
      type: 0,
      inputList: inputList(this),
      tableColumn: tableColumn(this),
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableSelectRow: [],
      showModal: false,
      form: {
        group: "",
        groupName: "",
      },
      formRule: formRule(this),
      categoryMap: [],
      groupMap: [],
      user: {},
      cityList: []
    };
  },

  created() {
    this.init();
  },

  watch: {
    showModal(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  },
  computed: {
    // 角色组为xx城市组,城市编号必填
    isNeedCity({form}) {
      if(!form.groupName) return false
      return form.groupName.includes("城市组")
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.queryCityList()
    })
  },
  methods: {
    init() {
      this.queryList();
      this.queryCategoryList();
    },

    async queryList() {
      this.$store.commit("changeLoadingFlag", true);
      const {
        search,
        table: { pageNum, pageSize }
      } = this;
      const params = {
        currPage: pageNum,
        pageSize,
        ...search
      };
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await fetchGroupList(params);
        if (success) {
          this.tableData = list;
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("changeLoadingFlag", false);
    },
    async queryCityList() {
      try {
        let param = {
          bizTypes:[1, 2, 4, 6, 7],
          showAllCity: 1
        }
        const {
          data: { success, data }
        } = await fetchCityList(param);
        if (success) {
          this.cityList = data.map(it => {
            return {
              cityName:it.cityName,
              cityCode:it.cityCode,
              provinceCode:it.provinceCode,
              provinceName:it.provinceName,
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 全国和城市互斥
    cityChange(v) {
      let len = v.length
      if(len) {
        let last = v[len-1]
        if(last === nation_code) {
          this.form.cityCode = [nation_code]
        } else {
          let index = v.findIndex(it => it === nation_code)
          if(index > -1) {
            this.form.cityCode.splice(index, 1)
          }
        }
      }
    },

    async queryCategoryList() {
      const {
        data: { success, data }
      } = await fetchCategoryList();
      if (success) {
        this.inputList.find(
          item => item.bind_key === "categoryCode"
        ).dropList = this.categoryMap = data.map(item => ({
          label: item.categoryName,
          value: item.categoryCode
        }));
      }
    },

    handleSearch(val) {
      this.search = val;
      this.table.pageNum = 1;
      this.queryList();
    },

    handleReset() {
      this.search = {};
      this.table.pageNum = 1;
      this.queryList();
    },

    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    },

    async onChangeCategory(val) {
      this.form.group = "";
      this.groupMap = [];
      if (!val) {
        return;
      }
      try {
        const {
          data: { success, data }
        } = await fetchGroupCategoryList({ categoryCode: val });
        if (success) {
          this.groupMap = data.map(item => {
            const { groupName, groupCode } = item;
            return {
              label: groupName,
              value: groupCode
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    onChangeGroup(val) {
      if (val) {
        this.form.groupName = this.groupMap.find(
          item => item.value === val
        ).label;
      }
    },

    onChangePhone(ev) {
      const { value } = ev.target;
      if (!value || !PATTERN_PHONE.test(value)) {
        this.user.userName = "";
      } else {
        this.onBlurPhone();
      }
    },

    async onBlurPhone() {
      const {
        form: { phone }
      } = this;
      try {
        const {
          data: { success, data }
        } = await fetchStaffInfoByPhone({ telephone: phone });
        if (success) {
          if (data) {
            const { accountId, phone, name } = data;
            this.user = {
              userId: accountId,
              userName: name,
              userPhone: phone
            };
          } else {
            this.user = {};
            this.$Message.warning("请先在权限中心维护账号");
          }
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    },

    changeShowModal() {
      this.showModal = !this.showModal;
    },

    onCreate() {
      this.type = 0;
      this.user = {};
      this.changeShowModal();
    },

    updateData(row) {
      const {
        id,
        groupName,
        categoryCode,
        groupCode,
        userPhone,
        userId,
        userName,
        cityCode
      } = row;
      this.type = 1;
      this.onChangeCategory(categoryCode);
      this.form = {
        id,
        groupName,
        group: groupCode,
        category: categoryCode,
        phone: userPhone,
        cityCode: cityCode
      };
      this.user = {
        userId: userId,
        userName: userName,
        userPhone: userPhone
      };
      this.changeShowModal();
    },

    delData(row) {
      this.$Modal.confirm({
        title: "确定删除数据吗，删除后将无法恢复？",
        onOk: async () => {
          try {
            const { groupCode, userId } = row;
            const params = { groupCode, users: [{ userId }] };
            const {
              data: { success }
            } = await pullRemoveUser(params);
            if (success) {
              this.$Message.success("成功");
              this.queryList();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    async onOk() {
      this.showModal = true;
      this.$refs.modal.visible = true;
      try {
        const res = await this.$refs["form"].validate();
        if (res) {
          const {
            type,
            form: { id, groupName, group },
            user
          } = this;
          let cityParams = {}
          if(this.isNeedCity) {
            cityParams.citys = this.form.cityCode.map(it => {
              return this.cityList.find(item => item.cityCode === it)
            })
          }
          const {
            data: { success }
          } = !type
            ? await pullUsersJoin({
                groupCode: group,
                users: [user],
              ...cityParams
              })
            : await pullUpdateUser({
                groupCode: group,
                groupName,
                id,
              ...cityParams,
              ...user
              });
          if (success) {
            this.$Message.success("成功");
            this.showModal = false;
            this.queryList();
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
.item-width {
  width: 300px;
}
</style>
