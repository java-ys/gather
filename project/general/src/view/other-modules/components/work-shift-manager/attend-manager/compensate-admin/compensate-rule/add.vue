<!--
 * @description: 营运管理-考勤管理-停运补偿规则-编辑&新增
 * @author: huanglin
 * @date: 2020-03-27
!-->
<template>
  <div>
    <Modal
      v-model="showModal"
      :title="ruleTitle"
      width="50%"
      :closable="false"
      :mask-closable="false"
      footer-hide
    >
      <Form ref="form" :model="formData" :label-width="100">
        <FormItem label="适用城市" prop="applyCity" :rules="ruleUser.applyCity">
          <Select v-model="formData.applyCity" style="width: 200px;">
            <Option
              v-for="(item, index) in cityList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <div v-for="(item, index) in formData.faultList" :key="index">
            <div style="display: flex; margin-bottom: 20px;" v-if="!item.deleteMark">
              <!-- 一级分类 -->
              <FormItem
                style="margin-rigth: 10px;"
                :prop="'faultList.' + index + '.outageCategoryParentId'"
                :rules="ruleUser.outageCategoryParentId"
              >
                <Select
                  v-model="item.outageCategoryParentId"
                  size="small"
                  style="width: 100px;"
                  @on-change="getChildList(item.outageCategoryParentId, index)"
                >
                  <Option
                    v-for="(item, index) in typeList"
                    :value="item.value + ''"
                    :key="index"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>

              <!-- 二级分类 -->
              <FormItem
                :prop="'faultList.' + index + '.outageCategoryChildId'"
                :rules="ruleUser.outageCategoryChildId"
              >
                <Select v-model="item.outageCategoryChildId" size="small" style="width: 150px;">
                  <Option
                    v-for="(it, ix) in childTypeList[index]"
                    :value="it.value + ''"
                    :key="ix"
                  >{{ it.label }}</Option>
                </Select>
              </FormItem>
              <!-- 补偿时长 -->
              <FormItem
                :prop="'faultList.' + index + '.recoupDuration'"
                :rules="[{ required: true, message: '不能为空'},{validator: validLast, trigger: 'blur'}]"
              >
                <Input
                  v-model="item.recoupDuration"
                  size="small"
                  style="width: 200px;"
                  placeholder="最大可补偿时长，单位（小时）"
                />
              </FormItem>
              <Button
                type="primary"
                size="small"
                icon="md-add"
                style="margin-left: 15px; height: 30px; margin-top: 3px;"
                v-if="!dotFilter()||index == formData.faultList.length-1"
                @click="handleAdd"
              ></Button>
              <Button
                type="primary"
                size="small"
                icon="md-remove"
                style="margin-left: 15px; height: 30px; margin-top: 3px;"
                v-if="dotFilter()"
                @click="handleDelete(index, item)"
              ></Button>
            </div>
          </div>
        </FormItem>
      </Form>
      <div class="footer-wrap">
        <Button type="primary" @click="commitData(formData)">提交</Button>
        <Button @click="cancelData" style="margin-left: 8px;">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  regTest,
  changeListKey,
  treeDataTranslate,
  getAllParentsId
} from "@/libs/tools";
import {
  addCompensateRule, //新增补偿列表
  editCompensateRule, //编辑补偿列表
  getRuleDetail, //补偿列表详情
  queryConfigType
} from "_o/api/compensate.js";
import { getConfigCityList } from "_g/api/common.js";

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    ruleTitle: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 一级类型
      typeList: [],
      // 二级类型
      childTypeList: [],
      showModal: false,
      cityList: [],
      formData: {
        //表单绑定数据
        applyCity: "", // 适用城市
        faultList: [
          {
            outageCategoryParentId: "", // 一级
            outageCategoryChildId: "", // 二级
            recoupDuration: "" // 补偿时长
          }
        ]
      },
      ruleUser: {
        // 表单验证数据
        applyCity: [
          { required: true, message: "适用城市不能为空", trigger: "blur" }
        ],
        // recoupDuration: [
        //   {
        //     required: true,
        //     message: "时长不能为空",
        //     transform(value) {
        //       return String(value);
        //     }
        //   },
        //   {
        //     pattern: /^(0|[1-9]\d{0,1}(\.\d{1,2})?|100(\.0{1,2})?)$/,
        //     message: "0-100之间的数字,最多2位小数"
        //   }
        // ],
        outageCategoryParentId: [{ required: true, message: "类型不能为空" }],
        outageCategoryChildId: [{ required: true, message: "请选择类型" }]
      }
    };
  },
  watch: {
    value: {
      handler(value) {
        this.showModal = value;
        if (this.showModal) {
          this.getConfigType();
        } else {
          this.formData.applyCity = "";
          this.formData.faultList = [
            {
              outageCategoryParentId: "", // 一级
              outageCategoryChildId: "", // 二级
              recoupDuration: "" // 补偿时长
            }
          ];
        }
      },
      immediate: true
    },
    showModal(value) {
      this.$emit("input", value);
    }
  },
  mounted() {
    this.getAllcity();
  },
  methods: {
    // 补偿规则详情
    getDetail(cityCode) {
      getRuleDetail({ cityCode }).then(res => {
        if (res.data.success) {
          const { data } = res.data;
          this.formData.faultList = data.map(it => {
            it.recoupDuration = `${it.recoupDuration}`;
            return { ...it };
          });

          data.map((it, ii) => {
            const fd = this.typeList.find(
              ix => ix.value - it.outageCategoryParentId === 0
            );
            if (fd) {
              this.childTypeList[this.childTypeList.length] = fd.childList.map(mm => {
                return {
                  label: mm.categoryName,
                  value: +mm.id
                };
              });
            }
          });
        }
      });
    },
    // 更新二级分类
    getChildList(val, index) {
      const fd = this.typeList.find(item => item.value == val);
      if (!fd) return;
      this.childTypeList[index] = fd.childList.map(item => {
        return {
          label: item.categoryName,
          value: +item.id
        };
      })
    },
    // 一级 二级分类
    getConfigType() {
      queryConfigType({}).then(res => {
        if (res.data.success) {
          console.log(res.data.data)
          this.typeList = res.data.data.map(it => {
            return {
              label: it.categoryName,
              value: +it.id,
              childList: JSON.parse(JSON.stringify(it.childList))
            };
          });
          if (this.isEdit) {
            const { cityCode } = this.params;
            this.formData.applyCity = cityCode;
            this.getDetail(cityCode);
          }
        }
      });
    },
    cancelData() {
      this.$Modal.confirm({
        title: "是否确认取消",
        onOk: () => {
          this.showModal = false;
          this.$refs.form.resetFields();
        }
      });
    },
    commitData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { applyCity: cityCode, faultList } = this.formData;
          if (!this.isEdit) {
            let data = faultList.map(it => {
              return {
                ...it,
                cityCode
              };
            });
            addCompensateRule({ addNewRules: data }).then(res => {
              if (res.data.success) {
                this.$Message.success("添加成功");
                this.$emit("on-confirm", 1);
              }
            });
          } else {
            let data = faultList.filter(it => {
              // if(it.id) {
              //   it.deleteMark = it.deleteMark ? 1 : 0 // 1 是删除
              // }
              if (!it.deleteMark) {
                return { ...it, cityCode };
              }
            });
            editCompensateRule({ editRules: data }).then(res => {
              this.$Message.success("修改成功");
              this.$emit("on-confirm", 1);
            });
          }
        }
      });
    },
    validLast(rule, val, callback) {
      // let reg = /^(?:0|[1-9][0-9]?|100)$/;
      let reg = /^(0|[1-9][0-9]{0,1})(\.\d{1})?$/;
      if (val && !reg.test(val)) {
        callback(new Error("请输入0-100之间正数,最多一位小数"));
      } else {
        callback();
      }
    },
    // 获取所有城市信息
    getAllcity() {
      getConfigCityList({}).then(res => {
        let data = res.data.data;
        let _cityList = [];
        data.map(item => {
          _cityList.push({
            label: item.city,
            value: item.cityId
          });
          return item;
        });
        this.cityList = _cityList;
      });
    },
    // 类型添加
    handleAdd() {
      let newDataTime = this.formData.faultList;
      for (let i = 0; i < newDataTime.length; i++) {
        if (
          newDataTime[i].outageCategoryParentId &&
          newDataTime[i].outageCategoryChildId &&
          newDataTime[i].recoupDuration
        ) {
        } else {
          this.$Message.warning("请选择类型");
          return false;
        }
      }
      newDataTime.push({
        outageCategoryParentId: "",
        outageCategoryChildId: "",
        recoupDuration: ""
      });
    },
    // 类型删除
    handleDelete(index, item) {
      if (item.id) {
        const tmp = this.formData.faultList[index];
        tmp.deleteMark = true;
        this.formData.faultList.splice(index, 1, tmp);
      } else {
        this.formData.faultList.splice(index, 1);
        this.childTypeList.splice(index, 1)
      }
    },
    dotFilter() {
      const l = this.formData.faultList.filter(it => !it.deleteMark);
      return l.length > 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.footer-wrap {
  margin-top: 50px;
  margin-left: 40%;
}

/deep/.ivu-form-item-required {
  margin-right: 10px;
}
</style>
