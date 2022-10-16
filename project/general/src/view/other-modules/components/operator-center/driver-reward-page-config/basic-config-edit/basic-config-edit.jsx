import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from "vuex"
import { Input, Form, Select, Cascader } from 'ant-design-vue'
import { getCityList } from "_o/api/operator-carrier"
import { cpTranslate } from "@/libs/tools"
// import arrayTreeFilter from 'array-tree-filter'

const FormItem = Form.Item
const Option = Select.Option

export default Vue.extend({
  name: 'basic-config-edit',
  props: {
    next: {
      type: Function,
      default: () => void 0,
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'basic-config-edit' }),
      formLayout: 'horizontal',
      cityList: [],
    }
  },
  computed: {
    ...mapGetters('operator-center/dirver-reward-page-config', ['basicConfigEditParams'])
  },
  async created() {
    await this.translateCityList()
  },
  methods: {
    ...mapActions('operator-center/dirver-reward-page-config', ['']),
    ...mapMutations({
      setBasicConfigEditParams: 'operator-center/dirver-reward-page-config/SET_BASIC_CONFIG_EDIT_PARAMS',
    }),
    handleSubmit(e) {
      e && e.preventDefault();
      // const cityFields = arrayTreeFilter(this.cityList, (item, level) => item.value === ['520000', '520300'][level])

      this.form.validateFields((err, values) => {
        if (!err) {
          // const activityRulesDescription = this.$refs.richEditor.content
          // if (!activityRulesDescription) return this.$Message.error("活动规则说明不可为空!");
          const { activityName, configType, city: [provinceCode, cityCode] } = values

          const params = {
            activityName,
            // activityRulesDescription,
            configType,
            provinceCode,
            cityCode,
          }

          // console.log('basic-config-edit params: ', params)
          this.setBasicConfigEditParams(params)
          this.next()
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
    },
    async translateCityList() {
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        // this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
        this.cityList = [...list];
      });
    },
  },
  render() {
    const {
      activityName,
      // activityRulesDescription,
      configType,
      provinceCode,
      cityCode,
    } = this.basicConfigEditParams

    return (
      <div class="basic-config-edit">
        <div className="basic-config-edit__container">
          <Form form={this.form} label-col={{ span: 5 }} wrapper-col={{ span: 5 }} onSubmit={this.handleSubmit}>
            <FormItem label={'活动名称'}>
              <Input maxLength={20} vDecorator={['activityName', { initialValue: activityName, rules: [{ required: true, message: '活动名称必填' }] }]}/>
            </FormItem>

            <FormItem label={'类型'}>
              <Select
                vDecorator={[
                  'configType',
                  { initialValue: String(configType ? configType : '1'), rules: [{ required: true, message: '类型必选' }] },
                ]}
                placeholder="请选择"
                onChange={this.handleSelectChange}
              >
                <Option value='1'>乘推司</Option>
                <Option value='2'>司推司</Option>
              </Select>
            </FormItem>

            <FormItem label={'活动城市'}>
              <Cascader
                ref="cityCascader"
                vDecorator={[
                  'city',
                  {
                    initialValue: (!provinceCode || !cityCode) ? [] : [provinceCode, cityCode],
                    rules: [
                      { type: 'array', required: true, message: '活动城市必选' }
                    ]
                  },
                ]}
                options={this.cityList}
                placeholder="请选择"
              />
            </FormItem>

            {/*<FormItem label={'活动规则说明'} wrapper-col={{ span: 12 }} required>*/}
              {/* activityRulesDescription */}
              {/*<VEditor ref="richEditor" value={activityRulesDescription} />*/}
            {/*</FormItem>*/}

          </Form>
        </div>
      </div>
    )
  }
})
