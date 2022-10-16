<template>
  <div class="project-block">
    <Form
      ref="searchForm"
      :model="projectData"
      :label-width="110"
      inline
      class="search-form"
    >
      <Row>
        <Col span="12">
        <FormItem label="资产公司：">
          {{ projectData.companyName }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="方案状态：">
          {{ StateMap[projectData.schemaState] }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="方案名称：">
          {{ projectData.schemaName }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="品牌车系车型：">
          {{ projectData.carBrand }} - {{ projectData.carLevel }} - {{ projectData.carSeries }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="车型代码：">
          {{ projectData.carCode }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="租赁城市：">
          {{ projectData.cityName }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="车龄（年）：">
          {{ CarAgeMap[projectData.carAge] }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="里程：">
          {{ MileageMap[projectData.mileage] }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="租期（月）：">
          {{ projectData.stage }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="月租（元）：">
          {{ projectData.monthlyRent }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="押金（元）：">
          {{ projectData.deposit }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="失效日期：">
          {{ projectData.invalidDate }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="租赁减免期数：">
          {{ projectData.freeStage }}
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="租赁减免政策：">
          {{ projectData.freePolicy }}
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
        <FormItem label="租赁包含内容：">
          <div v-html="projectData.content"></div>
          <!--          {{ projectData.content }}-->
        </FormItem>
        </Col>
      </Row>
      <FormItem
        :label-width="40"
        class="buttons"
      >
        <Button @click="reset">
          取消
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
/**
 * @Desc: m2-web-asset
 * @Author: zhangke
 * @CreateTime: 2020/12/21 15:49
 */
import { CarAgeMap, MileageMap, StateMap } from "./config";
import { querySchemaDetail } from "_o/api/lease";

export default {
  name: "detailModal",
  props: {
    modalTitle: {
      default: "方案详情"
    },
    schemaId: {
      default: ""
    }
  },
  data() {
    return {
      defaultText: "",
      projectData: {
        carBrandId: "",
        carSeriesId: "",
        carLevelId: "",
        carCode: "",
        levelCode: "",
        schemaName: "",
        stage: null,
        carAge: "",
        cityUuid: "",
        cityName: "",
        mileage: "",
        monthlyRent: null,
        deposit: null,
        content: null,
        freePolicy: null,
        freeStage: null,
        invalidDate: null
      },
      StateMap,
      CarAgeMap,
      MileageMap,
      schemaNoLoading: false
    };
  },
  mounted() {
    this.getSchemaDetail();
  },
  methods: {
    getSchemaDetail() {
      if (!this.schemaId) {
        return;
      }
      querySchemaDetail({
        schemaId: this.schemaId
      }).then(res => {
        if (res && res.data && res.data.success) {
          this.projectData = res.data.data;
        } else {
          this.$Message.error(res.data.msg || "获取详情失败");
        }
      });
    },
    reset() {
      this.$emit("on-Close");
    }
  }
};
</script>

<style scoped lang="less">
.project-block {
  .company {
    width: 270px;
  }
}

.search-form {
  .project-name {
    width: 100%;

    /deep/ .ivu-input-wrapper {
      width: 640px;
    }
  }

  /deep/ .ivu-select-dropdown {
    z-index: 100000;
  }

  /deep/ .ivu-input-number,
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-select {
    width: 260px;
  }

  /deep/ textarea {
    height: 100px;
  }

  .editor-preview-div {
    max-width: 640px;
  }

  .buttons {
    width: 100%;
    text-align: right;

    .ivu-form-item-content {
      text-align: right;

      > button {
        margin-left: 10px;
      }
    }
  }
}
</style>
