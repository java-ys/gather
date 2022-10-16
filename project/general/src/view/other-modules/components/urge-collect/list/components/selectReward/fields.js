let pageObj = {
  total: 0,
  current: 1,
  pageSize: 10,
};
let rewardTypeList = {
  coupon: '优惠券',
  cash: '现金',
  score: 'T币',
  giftCard: '礼品卡',
  giveCoin: '运营金',
  charSub: '充电补贴',
  opeCharge: '运营商充值',
  othEleComp: '其他电补',
  noReward: '无奖励',
  externalReward: '第三方API发券',
};
export const cacheData = {
  pageObj,
  parColumns: [],
  childParColumns: [],
  tableData: [],
  childTableData: [],
  rewardTypeList,
};
let rewardPatternList = {
  1: '指定奖励',
  2: '随机奖励',
};

let rewardTypeObj = {
  coupon: 'rewardCouponDto',
  cash: 'rewardCashDto',
  score: 'rewardScoreDto',
  giftCard: 'rewardGiftCardDto',
};
export const returnFields = that => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 70,
      align: 'center',
    },
    rewardName: {
      title: '奖励名称',
      key: 'rewardName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    eventTargetType: {
      title: '奖励对象',
      key: 'eventTargetType',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h ('span', params.row.eventTargetType === 0 ? '乘客' : '司机');
      },
    },
    rewardCode: {
      title: '奖励编码',
      key: 'rewardCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    beginTime: {
      title: '有效期',
      key: 'beginTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        let time = '';
        if (params.row.changeTimeFlag === 1) {
          time = '跟随活动有效期';
        } else {
          time = params.row.beginTime + '-' + params.row.endTime;
        }
        return h (
          'span',
          {
            style: {
              'white-space': 'nowrap',
              overflow: 'hidden',
              'text-overflow': 'ellipsis',
              'min-width': '120px',
            },
          },
          time
        );
      },
    },
    action: {
      title: '操作',
      key: 'action',
      tooltip: true,
      minWidth: 50,
      slot: 'action',
      fixed: 'right',
    },
  };
};
export const returnChildFields = that => {
  return {
    rewardName: {
      title: '子奖励名称',
      key: 'subRewardName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    rewardCode: {
      title: '子奖励编码',
      key: 'subRewardCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
    },
    rewardPattern: {
      title: '奖励方式',
      key: 'rewardPattern',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h ('span', rewardPatternList[params.row.rewardPattern]) || '-';
      },
    },
    rewardTypeCode: {
      title: '奖励类型',
      key: 'rewardTypeCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        let row = params.row;
        let rewardName = ''; //奖励类型
        if (row.rewardPattern === 1 || row.rewardPattern === 3) {
          rewardName = rewardTypeList[params.row.rewardTypeCode] || '-';
        } else if (row.rewardPattern === 2) {
          let randomGrantRewardSubDetailDtoList = row.randomGrantRewardSubDetailDtoList || [];
          let arr = [];
          let arrHash = {};
          randomGrantRewardSubDetailDtoList.forEach (item => {
            if (!arrHash[item.rewardTypeCode]) {
              arr.push (rewardTypeList[item.rewardTypeCode]);
              arrHash[item.rewardTypeCode] = true;
            }
          });
          rewardName = arr.join ();
        }
        return h ('span', rewardName);
      },
    },
    totalAmount: {
      title: '子奖励总金额',
      key: 'totalAmount',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h (
          'span',
          params.row[rewardTypeObj[params.row.rewardTypeCode]]
            ? params.row[rewardTypeObj[params.row.rewardTypeCode]][
                'totalAmount'
              ]
            : '-'
        );
      },
    },
    perAmount: {
      title: '每人每次奖励',
      key: 'perAmount',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      render: (h, params) => {
        return h (
          'span',
          params.row[rewardTypeObj[params.row.rewardTypeCode]]
            ? params.row.rewardTypeCode === 'giftCard'
                ? params.row[rewardTypeObj[params.row.rewardTypeCode]][
                    'provideNum'
                  ]
                : params.row[rewardTypeObj[params.row.rewardTypeCode]][
                    'perAmount'
                  ]
            : '-'
        );
      },
    },
    action: {
      title: '操作',
      key: 'action',
      tooltip: true,
      minWidth: 150,
      slot: 'action',
      fixed: 'right',
    },
  };
};
