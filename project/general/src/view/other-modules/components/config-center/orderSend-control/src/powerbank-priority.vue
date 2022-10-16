<!-- 
 * @description: 
 * @author: Tom Dai 
 * @date: 2020-06-30 22:32:42
 * @后台人员:  
!-->
<template>
  <div>
    <page-table ref="pageTable" :input-list="inputList" :fn="queryList" :par-columns="columns">
      <Button type="primary" @click="add">新建</Button>
    </page-table>
    <Modal v-model="showForm" :title="modalTitle">
      <div v-if="showForm">
        <Form
          ref="addTemplate"
          :model="addParams"
          label-position="left"
          :label-width="150"
          :rules="rules"
        >
          <FormItem v-if="type === 'add'" label="所属城市：" prop="cityUuids">
            <TreeInput
              v-model="addParams.cityUuids"
              :data="addCityList"
              placeholder="请选择城市"
              @on-change="change"
            ></TreeInput>
          </FormItem>
          <FormItem v-if="type === 'edit'" label="所属城市：">
            <span>{{addParams.cityName}}</span>
          </FormItem>
          <FormItem label="产品线：" prop="businessTypeList" v-if="type === 'add'">
            <Select
              v-model="addParams.businessTypeList"
              style="width: 210px"
              :disabled="type === 'edit'"
              placeholder="请选择"
              multiple
            >
              <Option
                v-for="item in productMap"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="产品线：" v-if="type === 'edit'">
            <span>{{productLineMap[addParams.businessType]}}</span>
          </FormItem>
          <FormItem label="低电量阈值：" prop="lowSocThreshold">
            <Input v-model="addParams.lowSocThreshold" style="width: 210px" placeholder="请输入"></Input>
            <span>%</span>
            <div>限制输入0-100的整数，用以定义电量还剩多少时为低电状态</div>
          </FormItem>
          <FormItem label="优先级系数：" prop="coefficient">
            <span>{{addParams.coefficient}}</span>
            <input type="hidden" v-model="addParams.coefficient" />
            <div style="display: flex;width: 100%;justify-content: space-between;">
              <div>高</div>
              <div style="width: 280px;">
                <Slider v-model="addParams.coefficient" :min="0.1" :max="2.0" :step="0.1"></Slider>
              </div>
              <div>低</div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="showForm =false">取消</Button>
        <Button type="primary" v-if="type === 'add'"  @click.stop= "submitForm" :loading="loading">完成</Button>
        <Button type="primary" v-if="type === 'edit'"  @click.stop= "eidtForm" >完成</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import pageTable from "_o/components/page-table";
import TreeInput from "_a/tree-input/tree-input.vue";
import {
  getPowerTableColumns,
  powerInputList,
  transportMap,
  dropList,
  productLine
} from "_o/components/config-center/orderSend-control/src/powerFileds";
import {
  lowPowerPriorityEdit,
  lowPowerPriorityPage,
  lowPowerPrioritySave,
  turnOnLowPowerPriority,
  turnOffLowPowerPriority
} from "_o/api/lowPowerPriority";
import { getProvinceCityList } from "_g/api/common";
import { cpTranslate } from "@/libs/tools";

export default {
  name: "dispatch-priority",
  components: {
    pageTable,
    TreeInput
  },
  data() {
    return {
      inputList: powerInputList,
      columns: getPowerTableColumns(this),
      queryList: lowPowerPriorityPage,
      modalStatus: false,
      modalTitle: "新建",
      type: "add",
      loading:false,
      addCityList: [],
      addParams: {
        cityUuids: [],
        businessTypes: [],
        lowSocThreshold: "",
        coefficient: 0.1
      },
      uuid: "",
      showForm: false,
      productMap: dropList(productLine),
      productLineMap: productLine,
      rules: {
        cityUuids: [
          {
            type: "array",
            required: true,
            message: "请选择城市",
            trigger: "change"
          }
        ],
        businessTypeList: [{ required: true, message: "请选择产品线" }],
        lowSocThreshold: [
          {
            required: true,
            message: "限制输入0-100的整数",
            pattern: "^([1-9]|[1-9]\\d|99)$"
          }
        ],
        coefficient: [{ required: true, message: "优先级系数" }]
      }
    };
  },
  computed: {
    formatAddParams() {
      return {
        ...this.addParams,
        state: 0,
        transportName: transportMap[this.addParams.transportId]
      };
    },
    formatEditParams() {
      return {
        uuid: this.uuid,
        priorityFactor: this.addParams.priorityFactor
      };
    }
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    add() {
      this.modalTitle = "新建";
      this.type = "add";
      this.addParams = {
        cityUuids: [],
        businessTypes: [],
        lowSocThreshold: "",
        coefficient: 0.1
      };
      this.showForm = true;
    },
    edit(v) {
      this.showForm = true;
      this.modalTitle = "编辑";
      this.addParams =  JSON.parse(JSON.stringify(v));
      this.type = "edit";
      this.addParams.coefficient = Number(v.coefficient);
    },
    change(item) {
      let cityList = [];
      let cityNameList =[]
      this.addCityList.forEach(i => {
        i.children.forEach(y => {
            cityList.push(y)
        });
      });
      cityList.forEach(city =>{
          item.forEach(sel=>{
              if(sel == city.cityUuid){
                console.log(city)
                let obj = {cityUuid:city.cityUuid,cityName:city.city}
                  cityNameList.push(obj)
              }
          })
          return
      })
      this.addParams.cityList = cityNameList;
 
    },
    close(item, key) {
      let requestFn =
        key === 0 ? turnOnLowPowerPriority : turnOffLowPowerPriority;
      let params = { uuid: item.uuid };
      requestFn(params).then(res => {
        if (res.data.success) {
          this.$Message.success("操作成功");
          this.$refs.pageTable.onShow();
        }
      });
    },
    getCityList() {
      getProvinceCityList().then(res => {
        this.addCityList = this.formatCityList(res.data.data);
        this.inputList[0].cascaderList = cpTranslate(res.data.data,'provinceID','cityUuid');
      });
    },
    formatCityList(v) {
      if (!v) return [];
      let arr = JSON.parse(JSON.stringify(v));
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
      return arr;
    },

    successCallBack(msg) {
      this.$Message.info({
           content: `${msg}`,
           duration: 5
      });
      this.$nextTick(() => {
        this.$refs.pageTable.onShow();
      });
    },
    submitForm(name) {
      this.loading = true
      this.$refs.addTemplate.validate(valid => {

        if (valid) {
          let params = { ...this.addParams };
          lowPowerPrioritySave(params).then(res => {
            if (res.data.success) {
                this.showForm = false;
                this.successCallBack(res.data.msg)
            }
          });
        } else {
          this.$Message.error("请完成表单后添加");
        }
      });
      // setInterval( this.loading = false , 5000)
      setTimeout( ()=>{this.loading = false }, 1000)
    },
    eidtForm(name) {
      this.$refs.addTemplate.validate(valid => {
        if (valid) {
          let params = { ...this.addParams };
          lowPowerPriorityEdit(params).then(res => {
            if (res.data.success) {
              this.$Message.info(res.data.msg)
              this.showForm = false;
              return
            }
          });
        } else {
          this.$Message.error("请完成表单后添加");
        }
      });
    }
  }
};
</script>

<style scoped></style>