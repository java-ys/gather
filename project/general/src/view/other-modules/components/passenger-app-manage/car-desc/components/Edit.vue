<template>
  <Modal
    v-model="visible"
    :title="title"
    :width="600"
    :mask-closable="false"
    :loading="modalLoading"
    footer-hide
    @on-cancel="(e) => close()"
    @on-visible-change="visibleChange"
  >
    <Form ref="form" :model="form" :rules="rules" :label-width="160">
      <FormItem label="城市：" prop="area">
        <Cascader
          v-model="form.area"
          :data="cityList"
          class="input-width"
          :disabled="isEdit || isDetail"
          filterable
          @on-change="areaChange"
        />
      </FormItem>
      <Tabs v-model="tabType" type="line">
        <TabPane
          :label="item.label"
          :key="item.value"
          :name="item.value"
          v-for="item in tabList"
        >
          <div :key="ke" v-for="(itm, ke) in tabItem[tabType]">
            <template v-if="itm.levels && itm.levels.length">
              <FormItem
                v-for="(item, index) in itm.levels"
                :key="index"
                :label="itm.bizTypeName + '·' + item.vehicleName + '：'"
              >
                <Input
                  v-model="item.tipMsg"
                  :maxlength="maxLength"
                  :placeholder="placeholder"
                  :readonly="isDetail"
                  class="input-width"
                ></Input>
              </FormItem>
            </template>
            <template v-else>
              <FormItem :label="itm.aliasName + '：'">
                <Input
                  v-model="itm.tipMsg"
                  :maxlength="maxLength"
                  :placeholder="placeholder"
                  :readonly="isDetail"
                  class="input-width"
                ></Input>
              </FormItem>
            </template>
          </div>
        </TabPane>
      </Tabs>

      <p class="t-r" v-if="isEdit || isAdd">
        <Button
          :loading="submitLoading"
          type="primary"
          @click="handleSubmit"
        >
          保存
        </Button>
        <Button type="default" @click="(e) => close()"> 取消 </Button>
      </p>
    </Form>
  </Modal>
</template>

<script>
import { updateService, addService } from "_o/api/car-desc";
import { freeze, getObjKeys } from "@/mixins/base";
import { rules } from "../fields";
import mIndex from "../mixins/index";

const Input_Max_Length = 8;
const Placeholder = "请输入车型文案";

export default {
  name: "car-desc-edit",
  mixins: [mIndex],
  props: {
    cityList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: "新增文案",
      modalLoading: false,
      visible: false,
      submitLoading: false,
      rules: freeze(rules),
      form: {
        area: [],
      },
    };
  },
  created() {
    this.maxLength = Input_Max_Length;
    this.placeholder = Placeholder;
  },
  watch: {
    visible(b) {
      b && this.init();
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    async init() {
      if (this.mold - 1 === 0) {
        this.form.area = [];
        this.title = "新增文案";
        return;
      }
      this.title = this.mold - 2 === 0 ? "编辑文案" : "车型文案详情";
      let { provinceCode, provinceName, cityCode, cityName } = this.modalData;
      this.form.area = [provinceCode, cityCode];
      this.provinceName = provinceName;
      this.cityName = cityName;
      await this.queryCarLine({ cityCode });
    },
    async areaChange(list, lists) {
      const [provinceCode, cityCode] = list;
      const [provinceInfo, cityInfo] = lists;
      if (provinceCode && cityCode) {
        await this.queryCarLine({ cityCode });
      }
      this.provinceName = provinceInfo?.label;
      this.cityName = cityInfo?.label;
    },
    async handleSubmit() {
      this.submitLoading = true;
      let valid = await this.$refs.form.validate();
      this.submitLoading = false;
      if (!valid) return;
      let p = this.getSubmitParams();
      // if (!p?.list?.length) return;
      let msg = this.isEdit ? "编辑成功!" : "新增成功!";
      let func = this.isEdit ? updateService : addService;
      const [err] = await func(p);
      if (err) {
        return;
      }
      this.$Message.success(msg);
      this.close(true);
    },
    getSubmitParams() {
      let {
        area: [provinceCode, cityCode],
      } = this.form;
      let cP = {
        provinceCode,
        cityCode,
        provinceName: this.provinceName,
        cityName: this.cityName,
        levelType: 1,
      };
      return getObjKeys(this.tabItem).map((key) => {
        let list = this.tabItem[key];
        return {
          ...cP,
          advertisingDtoList: list.filter((it) => !it.groupID),
          vehicleProductGroupDtos: list.filter((it) => it.groupID),
          expandBizLine: key,
          // ...(this.isEdit ? { id: this.modalData.id } : {}),
        };
      })
    },
    close(refresh) {
      this.$emit("close", refresh);
      this.visible = false;
    },
    visibleChange(b) {
      if (!b) {
        this.form.area = [];
        this.tabType = "";
        this.tabList = [];
        this.tabItem = {};
      }
    },
  },
};
</script>

<style scoped lang="less">
.input-width {
  width: 260px;
}
.t-r {
  text-align: right;
}
</style>
