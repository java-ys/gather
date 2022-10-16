const commonOpt = {
  tooltip: true,
  align: "center",
  minWidth: 120
};

const tableKeyList = [
  { title: "司机ID", key: "driverId", opts: { ...commonOpt } },
  { title: "司机编号", key: "driverNo", opts: { ...commonOpt } },
  { title: "司机姓名", key: "driverName", opts: { ...commonOpt } },
  { title: "司机手机号", key: "driverMobile", opts: { ...commonOpt } },
  { title: "计佣月份", key: "brokerageMonth", opts: { ...commonOpt } },
  { title: "城市ID", key: "cityCode", opts: { ...commonOpt } },
  { title: "城市名", key: "cityName", opts: { ...commonOpt } },
  { title: "运营商名称", key: "agentName", opts: { ...commonOpt } },
  { title: "加盟日期", key: "brokerageDate", opts: { ...commonOpt } },
  { title: "出勤天数", key: "actualDutyDays", opts: { ...commonOpt } },
  { title: "完单数", key: "finishRouteCnt", opts: { ...commonOpt } },
  { title: "完单流水", key: "routeCashFlow", opts: { ...commonOpt } },
  { title: "风控单数", key: "riskControlCnt", opts: { ...commonOpt } },
  { title: "风控流水", key: "riskControlFlow", opts: { ...commonOpt } },
  { title: "投诉单数", key: "complainCnt", opts: { ...commonOpt } },
  { title: "投诉单流水", key: "complainFlow", opts: { ...commonOpt } },
  { title: "城市系数", key: "cityRatio", opts: { ...commonOpt } },
  { title: "对应级别", key: "cityLevel", opts: { ...commonOpt } },
  {
    title: "计佣完单数（完单-风控）",
    key: "leagueRouteCnt",
    opts: { ...commonOpt, width: 190 }
  },
  {
    title: "计佣完单流水（完单-风控）",
    key: "leagueRouteCashFlow",
    opts: { ...commonOpt, width: 190 }
  },
  { title: "对应佣金比例", key: "manageRatio", opts: { ...commonOpt } },
  {
    title: "基础佣金（计佣流水*比例）",
    key: "manageLeagueBonus",
    opts: { ...commonOpt, width: 190 }
  },
  { title: "奖励佣金比例提升", key: "awardRatio", opts: { ...commonOpt, width: 140 } },
  { title: "当月奖励佣金", key: "awardLeagueBonus", opts: { ...commonOpt } },
  { title: "实际含税佣金", key: "sumLeagueBonus", opts: { ...commonOpt } }
];

export const detailColumn = () => {
  return tableKeyList.map(ks => {
    return {
      title: ks.title,
      key: ks.key,
      ...ks.opts,
      ...(ks.render && { render: ks.render })
    };
  });
};
