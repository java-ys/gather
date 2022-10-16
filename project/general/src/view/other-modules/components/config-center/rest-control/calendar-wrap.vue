<template>
	<div class="calendar-wrap">
		<div class="tools">
			<!-- 年 -->
			<DatePicker v-model="now" type="year" placeholder="请选择" class="search-input" size="small" :clearable="false"
									@on-change="changeYear"></DatePicker>
			<!-- 月 -->
			<Select v-model="month" class="search-input" size="small" @on-change="changeMonth">
				<Option v-for="list in monthList" :value="list.value" :key="list.value">{{ list.label }}</Option>
			</Select>
			<!-- 假期 -->
			<Select v-model="holidayName" class="search-input" size="small" @on-change="changeHoliday" clearable>
				<Option v-for="list in holidayNameList" :value="list.value" :key="list.value">{{ list.label }}</Option>
			</Select>
			<Button size="small" @click="returnToday">返回今天</Button>
			<Button size="small" :disabled="choosenDays.length <= 0" v-lazy-click="{fn: setRestDays}"
							v-hasAuth="'rest_control_set'">设置作息日
			</Button>
		</div>
		<div class="calendar-wrap-content">
			<calendar-custom ref="customCalendar1" :cityType="cityType" :cityCode="cityCode" :year="year" :month="month"
											 :holidayName="holidayName" :holidayNameList="holidayNameList" :getRemark="getRemark"
											 @getChoosenDays="getChoosenDays"></calendar-custom>
			<calendar-custom ref="customCalendar2" :cityType="cityType" :cityCode="cityCode" :year="year"
											 :month="month + 1" :holidayName="holidayName" :holidayNameList="holidayNameList"
											 :getRemark="getRemark"
											 @getChoosenDays="getChoosenDays"></calendar-custom>
		</div>
		<setRest ref="setRest" :cityType="cityType" :cityCode="cityCode" :year="year" :month="month"
						 :choosenDays="choosenDays" @on-success="clickSuccess"></setRest>
	</div>
</template>

<script>
    import calendarCustom from "./calendar-custom.vue";
    import setRest from "./setRest.vue";
    import {getHolidayList, getRestDaysList} from "_o/api/configData.js";

    export default {
        name: "calendar-wrap",
        components: {calendarCustom, setRest},
        props: {
            cityType: {
                required: true
            },
            cityCode: {
                required: true
            },
            getRemark: {
                type: Function
            }
        },
        data() {
            return {
                now: new Date(),
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                monthList: [
                    {value: 1, label: 1},
                    {value: 2, label: 2},
                    {value: 3, label: 3},
                    {value: 4, label: 4},
                    {value: 5, label: 5},
                    {value: 6, label: 6},
                    {value: 7, label: 7},
                    {value: 8, label: 8},
                    {value: 9, label: 9},
                    {value: 10, label: 10},
                    {value: 11, label: 11},
                    {value: 12, label: 12}
                ],
                holidayName: "",
                holidayNameList: [],
                choosenDays: []
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取假期列表
            getHolidayList() {
                let params = {
                    cityType: this.cityType,
                    cityCode: this.cityCode,
                    holidayYear: this.year
                };
                getHolidayList(params).then(res => {
                    let data = res.data.data;
                    data.map(item => {
                        item.value = item.uuid;
                        item.label = item.holidayName;
                    });
                    this.holidayNameList = data;
                });
            },
            changeYear(value) {
                this.year = Number(value);
                this.$emit("getYear", this.year);
            },
            changeMonth() {
                this.holidayName = "";
            },
            changeHoliday(value) {
                if (!value) {
                    return;
                }
                let list;
                this.holidayNameList.map(item => {
                    if (item.uuid == value) {
                        list = item;
                    }
                });
                getRestDaysList({
                    cityType: this.cityType,
                    cityCode: this.cityCode,
                    year: list.holidayYear,
                    month: list.holidayMonth,
                    holidayUuid: list.uuid
                }).then(res => {
                    let data = res.data.data;
                    // 选择的节假日下有对应的日期
                    if (data.length > 0) {
                        this.year = list.holidayYear;
                        this.month = list.holidayMonth;
                        this.now = new Date(this.year + "-01-01");

                        // 重置选中的日期
                        this.$refs.customCalendar1.resetChoosenDays();
                        this.$refs.customCalendar2.resetChoosenDays();
                    }
                });
            },
            returnToday() {
                //重置数据
                this.holidayName = '';

                this.now = new Date();
                this.year = new Date().getFullYear();
                this.month = new Date().getMonth() + 1;
            },
            // 加载数据
            getData() {
                // 用于调取子组件方法
                this.$nextTick(() => {
                    this.getHolidayList();
                    this.$refs.customCalendar1.getData();
                    this.$refs.customCalendar2.getData();
                    this.$refs.setRest.getHolidayList();
                });
            },
            setRestDays() {
                this.$refs.setRest.changeModalStatus(true);
            },
            getChoosenDays(arr) {
                this.choosenDays = [...arr];
            },
            // 设置休息日成功后回调
            clickSuccess() {
                this.getData();
                this.getHolidayList();
                this.holidayName = "";
                // 重置选中的日期
                this.$refs.customCalendar1.resetChoosenDays();
                this.$refs.customCalendar2.resetChoosenDays();
            }
        }
    };
</script>

<style lang="less">
	.calendar-wrap {
		width: 100%;
		
		.tools {
			display: flex;
			justify-content: flex-start;
			margin: 5px 0;
			
			.search-input {
				width: 100px;
			}
			
			.search-input:not(:first-child),
			button {
				margin-left: 20px;
			}
		}
		
		&-content {
			display: flex;
			justify-content: space-between;
			
			.date {
				width: 50%;
			}
			
			.date:first-child {
				padding-right: 5px;
			}
			
			.date:nth-child(2) {
				padding-left: 5px;
			}
		}
	}
</style>
