const titleWidth = 80;

export const inputList = [
	{
		name: 'text-input',
		title: '活动名称：',
		titleWidth,
		bind_key: 'activityName',
		value: ''
	},
	// {
	// 	name: 'drop-input',
	// 	title: '券类型：',
	// 	titleWidth,
	// 	dropList: [
	// 		{ value: '1', label: '折扣券' },
	// 		{ value: '2', label: '抵扣券' }
	// 	],
	// 	bind_key: 'templateType',
	// 	value: ''
	// },
	// {
	// 	name: 'text-input',
	// 	title: '创建人：',
	// 	titleWidth,
	// 	bind_key: '',
	// 	value: ''
	// }
];

export const columns = _this => {
	return [
		{
			title: '选择',
			type: 'selection',
			width: 50
		},
		{
			title: '活动名称',
			key: 'activityName',
      minWidth: 100,
		},
		{
			title: '活动编码',
			key: 'activityCode',
			minWidth: 100
		},
		{
			title: '状态',
			key: '',
			minWidth: 70,
			render: (h, params) => {
				let obj = {
					1: '未开始',
					2: '启用中',
					3: '已解决',
					4: '已终止',
					5: '已失效'
				}
				return h('span', obj[params.row.activityStatus]);
			}
		},
		{
			title: '生效日期',
			key: 'effectiveTime',
			minWidth: 200
		},
		{
			title: '创建人',
			key: 'creator',
			minWidth: 70
		},
		{
			title: '操作',
			render(h, params) {
				return h('a', {
					on: {
						click() {
							_this.skip();
							_this.$router.push({
								path: '/other-part/activity-detail/' + params.row.activityUuid,
								query: {
									auditStatus: 1
								}
							})
						}
					}
				}, '详情');
			}
		}
	];
};
