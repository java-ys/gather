/*
 * @Author: DK 
 * @Date: 2019-08-08 10:59:47 
 * @Last Modified by: DK
 * @Last Modified time: 2019-08-08 11:07:46
 */
export const methods = {
    /**
     * @description 判断日期是否小于当天
     * @param {*} item 日期
     * @returns {boolean} boolean
     */
    isDisabled(item) {
        if(this.year > this.currentYear || this.month > this.currentMonth) {
            return false
        }
        if(this.year < this.currentYear) {
            return true
        }
        if(this.month < this.currentMonth) {
            return true
        }
        return item <= this.currentDay;

    },
    /**
     * @description 判断是否已经选中
     * @param {*} item 日期
     * @returns {boolean} boolean
     */
    isChoosen(item) {
        let uuid = this.getUUID(item);
        return this.choosenDays.indexOf(uuid) != -1
    },
    /**
     * @description 判断是否是工作日
     * @param {*} item 日期
     * @returns {boolean} boolean
     */
    isWorking(item) {
        return this.workingDays.some(list => list.day == item)
    },
    /**
     * @description 获取日期对应的uuid
     * @param {*} item 日期
     * @returns {*} uuid
     */
    getUUID(item) {
        let uuid;
        this.totalData.map(list => {
            if(list.year == this.year && list.month == this.month && list.day == item) {
                uuid = list.uuid;
            }
        })
        return uuid;
    }
}
