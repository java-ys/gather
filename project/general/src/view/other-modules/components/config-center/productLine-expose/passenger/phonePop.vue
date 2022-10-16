<template>
  <div
    class="popView"
    v-show="popView"
  >
    <div class="ivu-modal-mask"></div>
    <div
      class="popView-wrap"
      :style="{'top': top + 'px'}"
    >
      <div
        class="popView-content"
        :style="{'width': width + 'px'}"
      >
        <div
          class="popView-title-wrap"
          :style="{'width': width + 'px','top': top + 'px'}"
        >
          <span class="popView-title">{{title}}</span>
          <div class="popView-icon">
            <Icon
              class="close-icon"
              type="md-close"
              @click="cancel"
            />
          </div>
        </div>
        <div class="popView-body-wrap policemodalstyle">
          <Form
            ref="exposeForm"
            :model="formData"
            :rules="formRules"
            :label-width="100"
            class="exposeForm"
          >
            <FormItem
              label="产品线："
              prop="businessType"
              :rules="[]"
            >
              <span>{{formData.businessName}}</span>
            </FormItem>
            <FormItem
              label=""
              :label-width="0"
            >
              <Button
                type="primary"
                class="btn_addHeat"
                @click="addPhone"
                style="margin-left: 32px;margin-bottom: 16px;"
              >添加</Button>
            </FormItem>
            <div
              class="level_container"
              v-for="(item, index) in formData.phoneList"
              :key="index"
            >
              <div class="left">
                <FormItem
                  label="手机号："
                  :rules="formRules.phoneList"
                  :prop="'phoneList.'+ index + '.phone'"
                >
                  <Input
                    v-model="formData.phoneList[index].phone"
                    placeholder="请输入手机号"
                    style="width: 200px;"
                    :maxlength="11"
                  />
                </FormItem>
              </div>
              <div class="right">
                <div
                  v-if="index > 0"
                  class="delete_icon"
                  @click="removePhone(index)"
                >
                  <Icon type="ios-remove-circle-outline" />
                </div>
              </div>
            </div>
          </Form>
          <div
            class="popView-footer-wrap"
            style="margin:37px 0;margin-bottom: 0px;"
          >
            <Button
              size="large"
              type="text"
              @click="cancel"
              style="margin-right: 8px;"
            >取消</Button>
            <Button
              size="large"
              type="primary"
              @click="submit"
            >确定</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/cyk-style.css'
import { addWhitelistPhone } from '_o/api/configData.js'

export default {
  props: {
    popView: Boolean,
    width: Number,
    top: {
      default: 100,
      type: Number
    },
    title: {
      default: '编辑策略',
      type: String
    },
    type: String, // 编辑
    floatParams: Object,
    optList: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data () {
    const formData = JSON.parse(JSON.stringify(this.floatParams))

    const validPhone = (rule, value, callback) => {
      const weightVal = Number(value)
      if (Number.isNaN(weightVal)) {
        callback(new Error('必须输入数字'))
      } else if (value.length !== 11) {
        callback(new Error('请输入正确的手机号'))
      } else if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
    }

    return {
      formData: {
        ...formData,
        phoneList: [{
          phone: ''
        }]
      },
      formRules: {
        phoneList: [
          {
            required: true,
            trigger: 'change',
            validator: validPhone
          }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    // 添加等级策略表单
    addPhone () {
      this.formData.phoneList.push({
        phone: ''
      })
    },
    // 移除等级策略表单
    removePhone (index) {
      this.formData.phoneList = this.formData.phoneList.filter((item, i) => i !== index)
      console.log(this.formData.phoneList)
    },
    cancel () {
      this.formData = null
      this.formData = {}
      this.$emit('on-confirm', false)
    },
    submit () {
      this.$refs.exposeForm.validate().then((valid) => {
        if (valid) {
          let newJSON = {}
          if (this.type === 'add') {
            // businessType
            newJSON.businessType = this.formData.businessType
            newJSON.productLine = this.formData.productLine
            newJSON.phoneList = this.formData.phoneList.map(item => item.phone)
            addWhitelistPhone(newJSON).then(res => {
              this.formData = null
              this.formData = {}
              if (res && res.data && res.data.data && res.data.success) {
                const resData = res.data.data
                this.$Message.success({
                  content: `合计数据${resData.totalCount || 0}条，导入成功${resData.successCount || 0}条，失败${resData.failCount || 0}条，重复${resData.repeatCount || 0}条`,
                  duration: 4
                })
                this.$emit('on-confirm', true)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.formData = null
            this.formData = {}
            this.$emit('on-confirm', false)
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.line1 {
  border-bottom: 1px solid #efefef;
  margin-bottom: 16px;
}
.line1 {
  .file_list {
    margin-bottom: 16px;
  }
}
.line1,
.line2 {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .title {
    color: #666;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }
  .file_list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: row;
    width: 100%;
    .left,
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
    }
    .border_line {
      border: 1px dashed #efefef;
      width: 132px;
      height: 132px;
      display: flex;
      justify-content: center;
      align-content: center;
    }
    /deep/ .ivu-upload {
      cursor: pointer;
    }
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

  .iptwraper {
    display: inline-block;
  }

  .ivu-alert.ivu-alert-with-icon {
    margin: 10px 0 0 0;
    width: 300px;
  }
}
</style>
