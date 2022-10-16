<template>
  <div class="template-info">
    <Form
      ref="form"
      :model="info"
      :rules="isDetail ? null : rules"
    >
      <Row :gutter="16">
        <Col span="6">
          <FormItem label="应用：" prop="appCode">
            <span v-if="isDetail || fromOther" class="field-value">{{fromOther ? appName : info.appName}}</span>
            <Select
              v-else
              ref="app"
              v-model="info.appCode"
              :placeholder="isEdit ? info.appName : '请选择'"
              :disabled="isEdit"
            >
              <Option
                v-for="item in appList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="触达方式：" prop="protocol">
            <span v-if="isDetail" class="field-value">{{info.protocol|wayName}}</span>
            <Select
              v-else
              v-model="info.protocol"
              placeholder="请选择"
              :disabled="isEdit"
            >
              <Option
                v-for="item in wayList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
          <FormItem label="模板类型：" prop="templateType">
            <span v-if="isDetail" class="field-value">{{info.templateType|typeName}}</span>
            <Select
              v-else
              v-model="info.templateType"
              placeholder="请选择"
              :disabled="isEdit"
            >
              <Option
                v-for="item in typeList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="业务场景：" prop="templateSecne">
            <span v-if="isDetail" class="field-value">{{info.secneName}}</span>
            <Select
              v-else
              ref="scenes"
              v-model="info.templateSecne"
              :placeholder="isEdit ? info.secneName : info.protocol !== '' ? '请选择' : '请先选择触达方式'"
              :disabled="isEdit || info.protocol === ''"
              :loading="loading"
              filterable
              :remote-method="onRemoteQuery"
              @on-query-change="onQueryChange"
            >
              <Option
                v-for="item in scenesList"
                ref="scenesOptions"
                :key="item.value"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="模板名称：" prop="templateName">
            <span v-if="isDetail" class="field-value">{{info.templateName}}</span>
            <Input
              v-else
              v-model="info.templateName"
              :maxlength="50"
              placeholder="请输入"
            />
          </FormItem>
        </Col>
      </Row>
      <Row v-if="isDetail" :gutter="16">
        <Col span="6">
          <FormItem label="模板状态：" prop="tempStatus">
            <span class="field-value">{{["有效", "无效", "待审批", "审批不通过", "删除"][info.tempStatus - 1]}}</span>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="模板编码：" prop="templateCode">
            <span class="field-value">{{info.templateCode}}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem prop="content">
            <span slot="label">
              模板内容：(模板已使用长度：{{info.content.length}})
              <span v-if="!isDetail && info.content.length > 40" style="color:red;font-weigh:bold;">请注意短信长度，避免拆分2条发送！！！</span>
            </span>
            <span v-if="isDetail" class="field-value">{{info.content}}</span>
            <Input
              v-else
              v-model="info.content"
              type="textarea"
              :maxlength="1000"
              placeholder="格式如：尊敬的${name}${sex}"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="申请说明：" prop="remark">
            <span v-if="isDetail" class="field-value">{{info.remark}}</span>
            <Input
              v-else
              v-model="info.remark"
              :maxlength="50"
              placeholder="请输入"
            />
          </FormItem>
        </Col>
      </Row>
      <Row v-if="isDetail && info.updateTime && info.updaterName" :gutter="16">
        <Col span="6">
          <FormItem label="更新时间：" prop="updateTime">
            <span class="field-value">{{info.updateTime}}</span>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="更新人：" prop="updaterName">
            <span class="field-value">{{info.updaterName}}</span>
          </FormItem>
        </Col>
      </Row>
      <div v-if="!isDetail">
        <Button type="primary" @click="onSubmit">确定</Button>
        <Button @click="onCancel">{{fromOther ? '返回' : '取消'}}</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { queryTemplate, postTemplate, putTemplate, queryScenesList, queryAppList } from "_o/api/reach-platform";
import { REACH_WAY_LIST, TEMPLATE_TYPE_LIST } from "../field"
import { throttle, createRule } from "../util";

export default {
  name: "template-info",
  filters: {
    wayName: t => REACH_WAY_LIST.find(v => v.value === t)?.label || "",
    typeName: t => TEMPLATE_TYPE_LIST.find(v => v.value === t)?.label || "",
  },
  props: {
    fromOther: Boolean,
    templateId: String,
    appCode: String,
    appName: String,
  },
  data() {
    return {
      info: {
        appCode: "",
        templateName: "",
        content: "",
        protocol: "",
        templateType: "",
        templateSecne: "",
        remark: ""
      },
      rules: {
        appCode: createRule("请选择应用", "string"),
        protocol: createRule("请选择触达方式"),
        templateType: createRule("请选择模板类型"),
        templateSecne: createRule("请选择业务场景", "string"),
        templateName: createRule("请输入模板名称", "string", "blur"),
        content: [
          createRule("请输入模板内容", "string", "blur"),
          {
            trigger: "blur",
            validator: (_, value, cb) => {
              if (/【ab】/.test(value)) cb(new Error("不得包含“【ab】”字样"));
              else if (this.info.templateType === 2 && !/\$\{marketingUrl\}/.test(value)) cb(new Error("缺少短链变量${marketingUrl}"));
              else cb()
            }
          }
        ],
        remark: createRule("请输入申请说明", "string", "blur")
      },
      appList: [],
      wayList: REACH_WAY_LIST,
      typeList: TEMPLATE_TYPE_LIST,
      scenesList: [],
      loading: false,
    }
  },
  computed: {
    isEdit() {
      return Boolean(this.fromOther && this.templateId) || this.$route.query.type === "edit";
    },
    isDetail() {
      return !this.fromOther && !(this.$route.params.id === "create" || this.$route.query.type === "edit");
    }
  },
  watch: {
    "$route.params.id": {
      handler(value) {
        if (!this.fromOther && value !== "create") this.updateInfo(value);
      },
      immediate: true,
    },
    "info.protocol": {
      handler(value) {
        if (value !== "") this.updateScenesList(value, true);
        else this.info.templateSecne = "";
      },
      immediate: true
    }
  },
  created() {
    if (!this.isDetail) {
      if (this.fromOther) this.info.appCode = this.appCode;
      else this.updateAppList();
      if (this.templateId) this.updateInfo(this.templateId);
    }
  },
  mounted() {
    if (this.isDetail) return;
    !this.fromOther && addReachBottomEvent(this.$refs.app.$refs.dropdown.$el, this.updateAppList);
    addReachBottomEvent(this.$refs.scenes.$refs.dropdown.$el, this.updateScenesList);

    /**
     * 添加滚动到底部事件
     * @param {HTMLElement} container
     * @param {Function} callback
     */
    function addReachBottomEvent(container, callback) {
      container && container.addEventListener("scroll", container._handler = e => {
        const scroller = e.target;
        const el = scroller.querySelector(".ivu-select-item:last-child");
        if (el && scroller.scrollTop + scroller.offsetHeight >= el.offsetTop) callback();
      })
    }
  },
  beforeDestroy() {
    !this.fromOther && removeReachBottomEvent(this.$refs.app.$refs.dropdown.$el);
    removeReachBottomEvent(this.$refs.scenes.$refs.dropdown.$el);

    /**
     * @param {HTMLElement} container
     */
    function removeReachBottomEvent(container) {
      container && container._handler && container.removeEventListener("scroll", container._handler);
    }
  },
  methods: {
    updateInfo(uuid) {
      /* eslint-disable no-return-assign */
      queryTemplate({ uuid }).then(res => this.info = res).catch(err => this.$Message.error(err.msg));
    },
    onSubmit() {
      this.$refs.form.validate().then(valid => {
        if (!valid) return;
        this.$Modal.confirm({
          title: "确定提交？",
          onOk: () => (this.info.uuid ? putTemplate : postTemplate)(this.info).then(() => {
            this.$Message.success("提交成功");
            setTimeout(this.onCancel, 2000);
          }).catch(err => this.$Message.error(err.msg)),
        })
      })
    },
    onCancel() {
      this.fromOther ? this.$emit("back") : this.$router.back();
    },
    updateScenesList: throttle(function(protocol, reset = false) {
      const scenesList = reset ? [] : this.scenesList;
      if (scenesList.length % 100) return;
      // this.loading = true;
      queryScenesList({ protocol: protocol || this.info.protocol, currPage: 1 + (scenesList.length / 100 | 0), pageSize: 100, secneName: this.updateScenesList.secneName }).then(res => {
        this.scenesList = scenesList.concat(res.list.map(v => ({ label: v.secneName, value: v.secneCode })));
        // this.loading = false;
      })
    }, 500),
    updateAppList: throttle(function() {
      const { appList } = this;
      if (appList.length % 20) return;
      queryAppList({ currPage: 1 + (appList.length / 20 | 0), pageSize: 20 }).then(res => {
        this.appList = appList.concat(res.list.map(v => ({ label: v.appName, value: v.appCode })));
      })
    }),
    onRemoteQuery: debounce(function(query) {
      this.updateScenesList.secneName = query;
      this.updateScenesList(this.info.protocol, true);
    }),
    onQueryChange(query) {
      const value = query.trim();
      if (value) return;
      this.onRemoteQuery("");
    }
  }
};

function debounce(fn,delay = 300) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
}
</script>

<style lang="less" scoped>
.field-value {
  display: inline-block;
  width: 100%;
}
</style>