/*
-- 农历相关假日
-- 1 春节(正月初一 至 正月初七)
-- 2 端午节(五月五日)
-- 4 中秋节(八月十五)

--阳历相关节日
-- 8 元旦(1月1日)
-- 16 清明节(4月5日/闰年 4月6日)
-- 32 劳动节(5月1日)
--   国庆节 10月1日

20180216 // 春节
20180618  // 端午
20180924  // 中秋

20190205
20190607
20190913

20200125
20200625
20201001

20210212
20210614
20210921

20220201
20220603
20220910

*/
export const  zeroFill = (v) => {
  return +v >= 10 ? v : `0${+v}`
}
function chingMingDate(fullYear) {
  //清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
  if (isLeapYear(fullYear) || isLeapYear(fullYear - 1)) {
    return "0404";
  }
  return "0405";
}

//判断是否是闰年
export const  isLeapYear = (Year) => {
  if ((Year % 4 === 0 && Year % 100 !== 0) || Year % 400 == 0) {
    return true;
  }
  return false;
}

// 阳历节日列表
export const fetivalDate = [
  { date: "0101", name: "元旦" },
  { date: "0501", name: "劳动节" },
  { date: "1001", name: "国庆节" }
];

// 阴历节日列表
export const lunarCalendar = [
  {
    year: "2018",
    dateList: [
      { date: "0216", name: "春节" },
      { date: "0618", name: "端午节" },
      { date: "0924", name: "中秋节" }
    ]
  },
  {
    year: "2019",
    dateList: [
      { date: "0205", name: "春节" },
      { date: "0607", name: "端午节" },
      { date: "0913", name: "中秋节" }
    ]
  },
  {
    year: "2020",
    dateList: [
      { date: "0125", name: "春节" },
      { date: "0625", name: "端午节" },
      { date: "1001", name: "中秋节" }
    ]
  },
  {
    year: "2021",
    dateList: [
      { date: "0212", name: "春节" },
      { date: "0614", name: "端午节" },
      { date: "0921", name: "中秋节" }
    ]
  },
  {
    year: "2022",
    dateList: [
      { date: "0201", name: "春节" },
      { date: "0603", name: "端午节" },
      { date: "0910", name: "中秋节" }
    ]
  }
];

// 获取法定节日名称
export const getFestivalName = ( year, month, day ) => {
  month = zeroFill(month)
  day = zeroFill(day)
  const festivalDate = `${month}${day}`;

  // 阳历节日
  const ff = fetivalDate.find(it => it.date === festivalDate);
  if (ff) {
    return ff.name;
  }
  if (chingMingDate(year) === festivalDate) {
    return "清明节";
  }
  // 阴历节日
  const f2 = lunarCalendar.find(it => it.year - year === 0);
  if (f2) {
    const f3 = f2.dateList.find(im => im.date === festivalDate);
    if (f3) {
      return f3.name;
    }
  }
  return "";
};


 // 获取年/月的 总天数
 export const getTotalDays = (year = 0, month = 0) => {
  (year = +year), (month = +month);
  if (!(year > 0 && month > 0)) return;
  if (month - 2 === 0) {
    if (isLeapYear(year)) return 29;
    return 28;
  } else {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
    return 30;
  }
}

// 获取年/月从星期几开始
export const getDayOfWeekFromYearAndMonth = (year = 0, month = 0) => {
  (year = +year), (month = +month);
  if (!(year > 0 && month > 0)) return;
  let day = new Date(year, month - 1),
    dayCount = day.getDay();
  return dayCount === 0 ? 7 : dayCount;
}


export const getLastMonthDays = (year = 0, month = 0) => {
  if(month > 1) {
    return getTotalDays(year, month-1)
  }
  return getTotalDays(year-1, 12)
}

export const getNextMonthDays = (year = 0, month = 0) => {
  if(month < 12) {
    return getTotalDays(year, month+1)
  }
  return getTotalDays(year+1, 1)
}