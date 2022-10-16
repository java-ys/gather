<template>
    <div class="set-rest">
        <Modal v-model="showModal" title="设置休息日" @on-cancel="cancleData" @on-ok="confirmData" :mask-closable=false>
            <Form ref="form" :model="formItem" :label-width=100 :rules="validateForm" label-position="right">
                <FormItem label="设置为" prop="setName">
                    <Select v-model="formItem.setName">
                        <Option v-for="list in setNameList" :key="list.value" :value="list.value">
                            {{ list.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="节假日名称" prop="holidayName" v-show="formItem.setName == '2'">
                    <Select v-model="formItem.holidayName" style="width: 150px;">
                        <Option v-for="list in holidayNameList" :key="list.value" :value="list.value">
                            {{ list.label }}
                        </Option>
                    </Select>
                    <Input style="width: 150px;float: right" v-model="formItem.newHolidayName" placeholder="请输入节假日名称" v-if="formItem.holidayName == 'add'"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="formItem.remark" :maxlength=20 placeholder="请输入备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancleData">取消</Button>
                <Button type="primary" @click="confirmData">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getHolidayList, setRestDay } from '_o/api/configData.js'
export default {
    name: 'set-rest',
    props: {
        cityType: {
            required: true
        },
        cityCode: {
            required: true
        },
        year: {
            required: true,
        },
        month: {
            required: true
        },
        choosenDays: {
            required: true,
            type: Array,
        }
    },
    data() {
        return {
            showModal: false,
            formItem: {
                setName: '',
                holidayName: '',
                newHolidayName: '',
                remark: ''
            },
            setNameList: [
                {label: '工作日', value: '1'},
                {label: '休息日', value: '2'},
            ],
            holidayNameList: [],
            validateForm: {
                setName: [
                    {required: true, message: '不能设置为空'},
                ],
                holidayName: [
                    {validator: (rule, value, callback) => {
                        if(this.formItem.setName == 2 ) {
                            if(!value) {
                                callback(new Error('节假日名称不能为空'));
                            }else if(value == 'add' && !this.formItem.newHolidayName) {
                                callback(new Error('节假日名称不能为空'))
                            }
                        }
                        callback();
                    }}
                ]
            }
        }
    },
    methods: {
        getHolidayList() {
            let params = {
                cityType: this.cityType,
                cityCode: this.cityCode,
                holidayYear: this.year
            }
            getHolidayList(params).then(res => {
                let data = res.data.data;
                data.map(item => {
                    item.value = item.uuid;
                    item.label = item.holidayName
                })
                this.holidayNameList = [
                    {value: 'add', label: '新建节假日'},
                    ...data
                ];
            })
        },
        changeModalStatus(bool) {
            this.showModal = bool
        },
        cancleData() {
            this.showModal = false;
            this.$refs.form.resetFields();
        },
        confirmData() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.formItem.holidayName == 'add' && (this.formItem.holidayName = null);
                    let params = {
                        cityType: this.cityType,
                        cityCode: this.cityCode,
                        dayUuids: this.choosenDays,
                        remark: this.formItem.remark,
                        isWork: this.formItem.setName,
                        holidayUuid: this.formItem.holidayName,
                        holidayName: this.formItem.newHolidayName,
                        holidayYear: this.year,
                        holidayMonth: this.month
                    }
                    setRestDay(params).then(res => {
                        this.$Message.success(res.data.msg);
                        this.$emit('on-success');
                        this.cancleData();
                    })
                }
            })
        }
    },
    watch: {
        year() {
            this.getHolidayList();
        }
    }
}
</script>

<style>

</style>
