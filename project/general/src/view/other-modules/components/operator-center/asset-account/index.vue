<template>
  <div class="driver-configure">
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <div class="button-wrap">
      <Button type="primary" v-hasAuth="'account-add'" @click="addRow">新增</Button>
    </div>
    <m2-table
      class="mt-20"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="tablePageChange"
      @changePageSize="tablePageSizeChange"
      ></m2-table>
    <!-- 操作记录弹框 -->
    <!--<Modal v-model="showRecord" width="960" title="操作记录">-->
      <!--<div class="showRecord-content">-->
        <!--<v-table :current="current" :pageSize="pageSize" :total="total" :parColumns="tableColumns" :parTableData="tableData" :isShowPage="true" @changePage="modalTablePageChange" @changePageSize="modalTablePageSizeChange">-->
        <!--</v-table>-->
      <!--</div>-->
      <!--<div slot="footer">-->
        <!--<Button type="primary" @click="showRecord = false">确定</Button>-->
      <!--</div>-->
    <!--</Modal>-->

    <!-- 新增 编辑 详情 -->
    <Modal v-model="showModal" width="660" :title="modalTitle" @on-cancel="cancel">
      <Form :model="formData" :label-width="80" :rules="ruleValidate" ref="form">
        <FormItem label="资产公司" prop="companyId">
          <Select v-model="formData.companyId" style="width: 270px" :disabled="!isEdit || Boolean(isEdit && accountDetail.supId)" filterable>
            <Option
              v-for="item in companyList"
              :key="item.companyId"
              :value="item.companyId"
            >{{item.companyName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="账户名称" prop="accountName">
          <Input v-model="formData.accountName" placeholder="请输入" :maxlength="50" style="width: 270px" :disabled="!isEdit"></Input>
        </FormItem>
        <FormItem label="银行账号" prop="account">
          <Input v-model="formData.account" placeholder="请输入" style="width: 270px" :disabled="!isEdit"></Input>
        </FormItem>
        <FormItem label="银行类型" prop="bankId">
          <Select v-model="formData.bankId" style="width: 270px" :disabled="!isEdit" filterable>
            <Option
              v-for="item in bankList"
              :key="item.bankNo"
              :value="item.bankNo"
            >{{item.bankName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="开户支行" prop="branchBank">
          <Input v-model="formData.branchBank" placeholder="请输入" :maxlength="50" style="width: 270px" :disabled="!isEdit"></Input>
        </FormItem>
        <FormItem label="开户城市" prop="address">
          <Cascader
            ref="cascader"
            v-model="formData.address"
            :data="cascaderList"
            placeholder="请选择"
            :clearable="false"
            style="width: 270px;"
            @on-change="addressChange"
            :disabled="!isEdit"
          ></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">{{ !isEdit ? '关闭' : '取消' }}</Button>
        <Button v-if="isEdit" type="primary" v-lazy-click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>


<script>
import { cpTranslate, cpLabelValue } from "@/libs/tools";
import m2Table from "_a/m2-table/v-table";
import { inputList, tableColumns, modalTableColumns } from "./conf";
import { getCityList, getRecommendList, recommendOpen, recommendClose, recommendLog } from "_o/api/operator-carrier";
import { getBankList, cityList, queryListFromCua, assetCompanyQueryList, accountSave, getAccountDetail } from "_o/api/assetSupplier.js"

export default {
  name: "asset-account",
  data() {
    return {
      formData: {},
      showModal: false,
      modalTitle: '共管账户新增',
      inputList: JSON.parse(JSON.stringify(inputList)),
      cityList: [], // 城市
      cascaderList: [],
      companyList: [], // 资产公司选项
      bankList: [], // 银行
      showRecord: false, // 操作记录
      isLoading: false,
      id: "",
      tableColumns: tableColumns(this),
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      accountDetail: { supId: 0, id: 0 },
      isEdit: true,
      ruleValidate: {
        companyId: [
          { required: true, message: '请选择资产公司', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择开户城市', trigger: 'change', type: 'array' }
        ],
        bankId: [
          { required: true, message: '请选择银行类型', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        branchBank: [
          { required: true, message: '请输入开户支行', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '请输入账户名称', trigger: 'blur' }
        ]
      }
    };
  },
  components: { m2Table },
  mounted() {
    this.getTableConfigData();
  },
  watch: {
    showModal(v) {
      if(v) {
        this.getCompany()
        this.getCityList()
        this.getBankListMap()
      }
    }
  },
  computed: {},
  methods: {
    confirm() {
      console.log('confirm');
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const { accountName, account, address, branchBank, companyId, bankId } = this.formData
        const company = this.companyList.find(item => item.companyId === companyId)
        const bank = this.bankList.find(item => item.bankNo === bankId)
        const { supId, id } = this.accountDetail
        const [ { label: provinceName }, { label: cityName }] = this.$refs.cascader.selected

        const params = {
          id, // 账户 id
          supId,//企业ID 如果没有填空或0
          companyType: 1, //企业类型 0:供应商 1:资产公司 2:运营公司'
          companyId: company.companyId, //资产公司Id(三户机构Id)
          companyName: company.companyName, //资产公司名称
          companyPid: company.companyPid, //所属机构Id
          companyPname: company.companyPname, //所属机构名称
          accountName,//开户账户名
          account,//银行账号
          accountType: 1, //账户类型 0:基本账户 1:共管账户
          provinceUuid: address[0], //开户行地址-省ID"
          provinceName,
          cityUuid: address[1],//开户行地址-市ID
          cityName,
          bankName: bank.bankName,//开户银行
          bankId: bank.bankNo, //开户行ID
          branchBank//开户支行
        };
        accountSave(params).then(res => {
          if (res.data.success) {
            this.getTableConfigData()
            this.close()
          } else {
            return this.$Message.error(res.data.msg);
          }
        })

      })
    },
    cancel() {
      this.close()
    },
    close() {
      this.showModal = false
      this.isEdit = true
      this.accountDetail = { supId: 0, id: 0 }
      this.resetFormData()
    },
    resetFormData() {
      setTimeout(() => {
        this.formData = {}
        this.$refs.form.resetFields()
      })
    },
    addRow() {
      this.modalTitle = "共管账户新增"
      this.isEdit = true
      this.showModal = true
      this.formData = {}
      this.accountDetail = { supId: 0, id: 0 }
      this.$refs.form.resetFields()
    },
    async editRow(row) {
      await this.getDetail(row)
      this.modalTitle = "共管账户编辑"
      this.isEdit = true
      this.showModal = true
    },
    async showDetail(row) {
      await this.getDetail(row)
      this.modalTitle = "共管账户详情"
      this.isEdit = false
      this.showModal = true
    },
    async getDetail(row) {
      const { supId, companyId } = row
      const res = await getAccountDetail({ supId, accountType: 1 })
      if (res.data.success && res.data.data && res.data.data.length) {
        const { bankId, account, branchBank, accountName, provinceUuid, cityUuid } = res.data.data[0]
        this.accountDetail = { ...res.data.data, supId }
        this.formData = {
          companyId,
          bankId,
          account,
          branchBank,
          accountName,
          address: [provinceUuid, cityUuid]
        }
      }
    },
    addressChange(value, selectedData) {
      // const [originProvince, originCity] = selectedData
      // this.formData.provinceName = originProvince.provinceName
      // this.formData.cityName = originCity.orgName
    },
    // 获取资产公司数据
    async getCompany() {
      if (this.companyList.length > 0) return
      const res = await queryListFromCua({ pageSize: 5000, currPage: 1, companyType: 1 })
      if (res.data.success) {
        if (res.data.data) {
          this.companyList = res.data.data.list || []
        }
      }
    },
    // 获取银行列表
    getBankListMap() {
      if (this.bankList.length > 0) return
      getBankList({ pageSize: 5000 }).then(res => {
        if (res.data.success) {
          if (res.data.data) {
            this.bankList = res.data.data.list || []
          }
        }
      })
    },
    getCityList() {
      if (this.cascaderList.length > 0) return
      cityList({}).then(res => {
        let list = res.data.data || []
        let params = {
          list: list,
          labelKey: "provinceName",
          valueKey: "provinceCode",
          children: "cityDtoList",
          sonLableKey: "orgName",
          sonValueKey: "orgCode",
          isDeep: true,
        }
        list = cpLabelValue(params)
        this.cascaderList = list
      });
    },
    translateCityList() {
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        // this.inputList[3].cascaderList = [
        //   { label: "全国所有城市", value: 1 },
        //   ...list
        // ];
        this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
      });
    },
    // 获取资产公司账户维护列表数据
    getTableConfigData(params = this.searchParams) {
      this.isLoading = true
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize,
        companyType: 1
      };
      params = Object.assign(conf, params);
      assetCompanyQueryList(params).then(res => {
        let list = res.data.data.list;
        this.tableData = list;
        this.total = res.data.data.totalCount;
        this.isLoading = false
      });
    },
    // 获取操作记录列表数据
    getModalTableData(id) {
      this.id = id;
      recommendLog({
        businessCode: 1,
        businessId: id,
        currPage: this.current,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.data.data.list;
        this.total = res.data.data.totalCount;
      });
    },
    searchData(params) {
      this.searchParams = params;
      this.current = 1;
      this.getTableConfigData();
    },
    resetData() {
      // 重置搜索条件与分页
      this.current = 1;
      this.searchParams = {};
      this.getTableConfigData();
    },
    tablePageChange(page) {
      this.current = page;
      this.getTableConfigData();
    },
    tablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableConfigData();
    },
    modalTablePageChange(page) {
      this.current = page;
      this.getModalTableData(this.id);
    },
    modalTablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getModalTableData(this.id);
    }
  }
};
</script>

<style lang="less">
.driver-configure {
  .button-wrap {
    margin-bottom: 20px;
  }
}
</style>
