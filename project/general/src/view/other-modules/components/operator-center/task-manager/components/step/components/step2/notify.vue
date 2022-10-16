<template>
  <div class="notify_wrap">
    <div class="header">公告配置：</div>
    <div class="content">
      <div class="line">
        <div class="left">
          <FormItem label="公告位置："> 司机公告 </FormItem>
        </div>
        <div class="middle">
          <FormItem
            label="公告标题："
            prop="notifyTitle"
            class="ivu-form-item-required"
          >
            <Input
              v-model="addData.notify.title"
              placeholder="请输入"
              type="text"
              class="title_input"
              @on-change="titleChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="跳转链接："
            :label-width="80"
          >
            <Input
              v-model="addData.notify.url"
              placeholder=""
              type="text"
              class="url_input"
              @on-change="urlChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";

export default {
  name: 'notify',
  props: {
    addData: {
      type: Object,
      default () {
        return {}
      }
    },
    isDetail: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  created () {
    console.log('this.addData', this.addData)
  },
  methods: {
    titleChange () { },
    urlChange () { },
  },
}
</script>

<style lang="less" scoped>
.notify_wrap {
  border: 1px solid #ddd;
  padding: 12px;
  width: 1200px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 120px;
  margin-top: 12px;
  .header {
    font-size: 15px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 8px;
    .line {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .left {
      .notifyContent_wrap {
        /deep/ .ivu-form-item-content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-end;
        }
      }
    }
    .left,
    .middle,
    .right {
      flex: 0.3333;
      width: 33.33%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: no-wrap;
      white-space: nowrap;
    }
    .middle {
      /deep/ .ivu-form-item-label {
        // width: 80px !important;
      }
      /deep/ .ivu-form-item-content {
        margin-left: 80px !important;
      }
    }
    .right {
      /deep/ .ivu-form-item-label {
        // width: 120px !important;
      }
      /deep/ .ivu-form-item-content {
        margin-left: 150px !important;
      }
      /deep/ .ivu-input-wrapper {
        input {
          width: 220px !important;
        }
        textarea {
          width: 400px !important;
          height: 100px;
        }
      }
    }
  }
  /deep/ .ivu-form-item-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  /deep/ .ivu-input-wrapper {
    input {
      width: 220px !important;
    }
    textarea {
      width: 400px !important;
      height: 100px;
    }
  }
}
</style>
