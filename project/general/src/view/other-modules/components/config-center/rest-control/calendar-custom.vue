<template>
    <div class="date">
        <!-- 星期 -->
        <ul class="weekdays">
            <li v-for="list in weekList" :key="list.name" :style="{color: list.color}">{{list.name}}</li>
        </ul>
        <!-- 日期 -->
        <div class="bodyDiv">
            <ul>
                <li v-for="list in calendarData" :key="list.index">
                    <span
                        v-for="item in list"
                        class="commonDay"
                        :style="{visibility: item == 0 ? 'hidden': ''}"
                        :class="isWorking(item) ? 'working': 'rest'"
                    >
                        <span
                            class="default"
                            :class="{'choosenDay': isChoosen(item), 'disabled': isDisabled(item)}"
                            @click="addDays(item)"
                        >{{ item }}</span>
                        <span class="chinese-day" :title="changeChineseDay(item, true)" v-text="changeChineseDay(item, false)"></span>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { methods } from "./field.js"
import { GetLunarDay } from "./calender-chinese.js"
import { getRestDaysList } from '_g/api/configData'
export default {
    name: "calendar-custom",
    props: {
        cityType: {
            required: true
        },
        cityCode: {
            required: true
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        month: {
            type: Number,
            default: (new Date().getMonth() + 1)
        },
        holidayName: {
            default: '',
        },
        holidayNameList: {
            type: Array
        },
        getRemark: {
            type: Function,
            default: () => {}
        },
    },
    data() {
        return {
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth() + 1,
            currentDay: new Date().getDate(),
            weekList: [
                { name: "一", color: "black" },
                { name: "二", color: "black" },
                { name: "三", color: "black" },
                { name: "四", color: "black" },
                { name: "五", color: "black" },
                { name: "六", color: "red" },
                { name: "日", color: "red" }
            ],
            calendarData: [],
            choosenDays: [],
            totalData: [],
            workingDays: [],
        };
    },
    mounted() {
        this.initCalendar(`${this.year}-${this.month}-${this.currentDay}`);
    },
    methods: {
        ...methods,
        // 初始化日历
        initCalendar(stringDate) {
            this.calendarData = [];
            let date = stringDate ? new Date(stringDate) : new Date();

            let currentMonth = date.getMonth() + 1;

            // 时间设置为当月第一天
            date.setDate(1);

            // 当月第一天的星期数
            let firstWeek = date.getDay() == 0 ? 7 : date.getDay();
            let frontDays = [];
            for (let i = 0, length = firstWeek - 1; i < length; i++) {
                frontDays.push(0);
            }

            // 时间设置为当月最后一天
            date.setMonth(currentMonth);
            date.setDate(0)

            // 当月最后一天的星期数
            let lastWeek = date.getDay();
            lastWeek = lastWeek == 0 ? 7 : lastWeek;
            let endDays = [];
            for (let i = 0, length = 7 - lastWeek; i < length; i++) {
                endDays.push(0);
            }

            let centerDays = [];
            for (let i = 1, length = date.getDate(); i <= length; i++) {
                centerDays.push(i);
            }

            let wholeDays = [...frontDays, ...centerDays, ...endDays];
            for (let i = 0, length = wholeDays.length; i < length; i += 7) {
                this.calendarData.push(wholeDays.slice(i, i + 7));
            }

            this.getData();
        },
        // 获取当月日期对应的状态
        getData() {
			let params = {
				cityType: this.cityType,
				cityCode: this.cityCode,
				year: this.year,
				month: this.month,
            };
			getRestDaysList(params).then(res => {
                let data = res.data.data;
                this.totalData = data;
                this.getWorkingDays(data);
			})
		},
        // 获取工作日
        getWorkingDays(arr) {
            this.workingDays = [];
            for (let list of arr) {
                if(list.isWork == 1 && list.year == this.year && list.month == this.month) {
                    this.workingDays.push(list);
                }
            }
        },
        addDays(item) {
            // 小于等于当前日期
            if(this.isDisabled(item)) {
                return
            }

            let uuid = this.getUUID(item);
            if(!uuid) {
                // 获取不到当天uuid，后跳返回有误，控制体提示
                console.warn("TCL: addDays -> uuid", uuid)
                return
            }

            // 添加选中的日期
            if (this.choosenDays.indexOf(uuid) == -1) {
                this.choosenDays.push(uuid);
                // 从选中的日期内删除
            } else {
                this.choosenDays.forEach((element, index) => {
                    if (element == uuid) {
                        this.choosenDays.splice(index, 1);
                    }
                });
            }

            // 返回备注信息
            let remark = '';
            this.totalData.map(list => {
                if(list.day == item && list.year == this.year && list.month == this.month) {
                    remark = list.remark;
                }
            });
            if(this.choosenDays.length == 1) {
                this.getRemark(remark);
            }else {
                this.getRemark(null);
            }

            this.$emit('getChoosenDays', this.choosenDays);
        },
        // bool是为了区分是title还是text true -> title  false -> text
        changeChineseDay(item, bool) {
            let holidayUuid;
            let holidayName;
            // 假日名称的显示长度限定
            let _holidayNameLength = 9;
            // 获取当前日期对应的假日uuid
            this.totalData.map(list => {
                if(list.year == this.year && this.month == list.month && list.day == item && list.isWork != 1) {
                    holidayUuid = list.holidayUuid;
                }
            })
            // 获取假日uuid对应的假日名称
            if(holidayUuid) {
                this.holidayNameList.map(list => {
                    if(list.uuid == holidayUuid) {
                        holidayName =  list.holidayName;
                    }
                })
            }
            if(holidayName) {
                // title
                if(bool) {
                    return holidayName.length > _holidayNameLength ? holidayName : '';
                }else { // text
                    return holidayName.length > _holidayNameLength ? holidayName.slice(0, 3) + '...' : holidayName
                }
            }else if(bool) { // 不是假期不显示title
                return '';
            }
            return GetLunarDay(this.year, this.month, item);
        },
        // 重置选中的日期
        resetChoosenDays() {
            this.choosenDays = [];
            this.$emit('getChoosenDays', this.choosenDays);
        }
    },
    watch: {
        year: {
            handler(value) {
                this.initCalendar(`${value}-${this.month}-${this.currentDay}`);
            },
        },
        month: {
            handler(value) {
                this.initCalendar(`${this.year}-${value}-${this.currentDay}`);
            },
        },
    }
};
</script>
<style scoped lang="less">
.date {
    color: #333;
    background: #fff;

    .weekdays {
        background: rgba(100, 100, 100, 0.1);
        opacity: 0.6;
        display: flex;
        font-size: 16px;

        li {
            width: 20%;
            list-style-type: none;
            text-align: center;
            margin-top: 5px;
            line-height: 60px;
        }
    }

    .bodyDiv {
        li {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            line-height: 60px;
        }

        .commonDay {
            position: relative;
            display: inline-block;
            text-align: center;
            padding-bottom: 5px;
            width: 20%;

            .default {
                display: inline-block;
                width: 35px;
                height: 35px;
                line-height: 35px;
                vertical-align: middle;
                border-radius: 5px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
            }

            .currentDay {
                background: rgba(54, 107, 177, 0.3);
                color: #fff;
                border-radius: 50%;
            }

            .choosenDay {
                background: rgba(32, 44, 214, 0.3);
                color: #fff;
                border-radius: 5px;
            }

            .disabled {
                background: rgba(0, 0, 0, 0.3);
                color: #fff;
                cursor: auto;
            }

            .chinese-day {
                position: absolute;
                width: 100%;
                text-align: center;
                font-size: 12px;
                left: 0;
                bottom: 0;
                height: 10px;
                line-height: 10px;
            }
        }

        .commonDay::after {
            border: 1px solid black;
            position: absolute;
            top: 0;
            left: 7px;
            width: 15px;
            height: 15px;
            line-height: 15px;
            font-size: 12px;
        }

        .working {
            color: black;
        }

        .rest {
            color: red;
        }

        .working::after {
            content: "班";
            color: gray;
            border-color: gray;
        }

        .rest::after {
            content: "休";
            color: red;
            border-color: red;
        }
    }
}
</style>