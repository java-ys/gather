<template>
  <div>
     <Modal v-model="popView" title="卫星城关系" :mask-closable="false" @on-cancel="cancel">
          <Form
            ref="formValidate"
            :model="params"
            :label-width="100"
            :rules="ruleUser"
          >
            <FormItem label="归属城市：" prop="parentDto">
              <Cascader
                :data="cityList"
                :clearable="false"
                v-model="params.parentDto"
                :filterable="true"
                style="width: 300px"
                placeholder="请选择城市"
              >
              </Cascader>
            </FormItem>
            <FormItem label="卫星城市：" prop="cityDto">
              <Cascader
                :data="cityList"
                :clearable="false"
                v-model="params.cityDto"
                :filterable="true"
                style="width: 300px"
                placeholder="请选择城市"
              >
              </Cascader>
            </FormItem>
            
          </Form>
         <div slot="footer">
           <Button
              size="large"
              type="text"
              style="margin-right: 8px;"
              @click="cancel"
            >
              取消
            </Button>
            <Button
              v-lazy-click="commit"
              size="large"
              type="primary"
            >
              确定
            </Button>
        </div>
      </Modal>
  </div>
</template>
<script>
import { modifySatellite, addSatellite } from "_o/api/satelliteCity";
export default {
  props: {
    popView: Boolean,
    title: {
      default: ()=>{
        return "开通城市"
      },
      type: String
    },
    uuid: {
      default:()=>{
        return ""
      },
      type: String
    },
    isEdit: {
      default: ()=>{
        return false
      },
      type: Boolean
    },
    cityList: {
      default: () => {
        return [];
      },
      type: Array
    },
    floatParams: {
      default: () => {
        return {
         cityDto:[], 
         parentDto:[], 
        };
      },
      type: Object
    }
  },
  data() {
     const validateCity = (rule, value, callback = () => {}) => {
      if (value.length>0) {
        callback();
      } else {
        callback(new Error("城市不能为空"));
      }
    };
    return {
      params:{
        cityDto:[], 
        parentDto:[], 
      },
      ruleUser: {
        cityDto: [
          {
            required: true,
            message: "请选择城市",
            trigger: "change",
            validator: validateCity
          }
        ],
        parentDto: [
          {
            required: true,
            message: "请选择城市",
            trigger: "change",
            validator: validateCity
          }
        ],
      },
    };
  },
  watch: {
    floatParams:{
      handler: function (val) {
        if (val&&val.provinceCityCode) {
          this.$nextTick(() => {
              this.params = {
                cityDto:[val.provinceCityCode,val.cityCode],
                parentDto:[val.provinceParentCode,val.parentCode]
              }
          });
        }
      },
      deep: true,
    }
  },
  mounted() {
    if(this.floatParams.provinceCityCode){
      this.params = {
        cityDto:[this.floatParams.provinceCityCode,this.floatParams.cityCode],
        parentDto:[this.floatParams.provinceParentCode,this.floatParams.parentCode]
      }
    }

  },
  methods: {
    getCityListData() {
      // 获取分页List
      this.$store.commit("changeLoadingFlag", true);
      let data = { currPage: this.current, pageSize: this.pageSize };
      getOpencityListData(data).then(res => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    cancel(){
      this.$refs.formValidate.resetFields();
      this.$emit("on-confirm", false);
    },
    commit() {
      console.log('params',this.params)
      let params={}
      this.cityList.forEach(province=>{
        province.children.forEach(item=>{
          if(item.value=== this.params.cityDto[1]){
            params.cityCode = item.value
            params.cityName = item.label
          }
          if(item.value=== this.params.parentDto[1]){
            params.parentCode = item.value
            params.parentName = item.label
          }
        })
      })
      console.log('params',params)
      if (!this.isEdit) {
        addSatellite(params)
          .then(res => {
            this.$emit("on-confirm", true);
            this.$Message.success(res.data.msg);
            this.$refs.formValidate.resetFields();
          })
          .catch(err => {});
      } else {
        params.uuid = this.uuid
        modifySatellite(params)
          .then(res => {
            this.$emit("on-confirm", true);
            this.$refs.formValidate.resetFields();
            this.$Message.success(res.data.msg);
          })
          .catch(err => {});
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.item-field {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: center;
  width: 200px;
  padding: 0 12px;
  text-align: right;
}

.center {
  text-align: center;
}
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.mobile-wrap:last-child {
  margin-bottom: 0;
}

.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  text-align: center;
}

.real-number {
  width: 200px;
}

.area-number {
  width: 100px;
}

.fonttitle {
  font-size: 14px;
  // margin-bottom: 10px;
}

.fonttitle span:first-child {
  display: inline-block;
  width: 100px;
  text-align: left;
}

.mapchoice {
  color: royalblue;
  text-decoration: underline;
  cursor: pointer;
}

.iptwraper {
  display: inline-block;
}

.elecfencechoice {
  position: relative;
  width: 100%;
  height: 500px;

  .someOptBtn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .deleteaclear {
      opacity: 0.8;
    }
  }
}

.btndislance {
  margin: 0 15px;
}

.latandlng {
  margin-top: 10px;
  max-width: 300px;
  position: relative;

  .upfonts {
    max-height: 60px;
    overflow-y: scroll;
  }

  .hidethisipt {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -1;
  }
}

.shadowFloat {
  position: fixed;
  top: 10%;
  left: 25%;
  padding: 20px;
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  background: #fff;

  .cancenlbtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}

.navCoordList {
  margin-top: 24px;
  margin-left: -130px;

  .navCoordItem {
    position: relative;

    .ivu-btn {
      position: absolute;
      right: 130px;
      top: 7px;
    }
  }

  .navCoordItem:not(:last-child) .ivu-form-item {
    margin-bottom: 24px;
  }

  .navCoordItem .ivu-form-item + .ivu-form-item {
    margin-top: 24px;
  }

  /deep/ .ivu-form-item-error-tip {
    margin-left: 130px;
  }
}

.ivu-alert.ivu-alert-with-icon {
  margin: 10px 0 0 0;
  width: 300px;
}

// .policemodalstyle{
//     .ivu-form-item{
//         margin-bottom: 10px;
//     }
// }
.popView-body-wrap {
  &::-webkit-scrollbar {
    background-color: transparent;
  }
}
/deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
  margin-left: 0 !important;
}
</style>
