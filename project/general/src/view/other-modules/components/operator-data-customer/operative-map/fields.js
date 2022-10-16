/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
	return {
		passengerName: {
			title: '下单人姓名',
			key: 'passengerName',
			ellipsis: true,
			tooltip: true,
			align: 'center',
			// width: 180,
			render: (h, params) => {
				let titles = params.row.passengerName || '暂无'
				return h('div', titles)
			}
		},
		passengerMobile: {
			title: '下单人手机',
			key: 'passengerMobile',
			ellipsis: true,
			tooltip: true,
			align: 'center',
			// width: 180,
			render: (h, params) => {
				let titles = params.row.passengerMobile || '暂无'
				return h('div', titles)
			}
		},
		originAddress: {
			title: '出发地',
			key: 'originAddress',
			ellipsis: true,
			tooltip: true,
			align: 'center',
			// width: 200
		},
		destAddress: {
			title: '目的地',
			key: 'destAddress',
			ellipsis: true,
			tooltip: true,
			align: 'center',
			// width: 200
		},
		action: {
			title: '订单编号',
			key: 'action',
			align: 'center',
			width: 200,
			render: (h, params) => {
				return h('div', [
					h('span', {
						style: {
							color: '#1890FF',
							cursor: 'pointer',
							marginLeft: '10px'
						},
						on: {
							click: () => {
								that.carslists = false;
								that.$router.push({ name: 'order-detail', params: { id: params.row.uuid } })
							}
						}
					}, params.row.routeNo)
				])
			}
		}
	}
}
//4： 快享(white)， 2：专享(black)，  1： 出租车(yellow)
// 0: 下线(gray), 1:  巡游中(red), 2: 接乘中(blue), 3:  服务中(green)

export const pointStyle = []
export const nameList = ['40','41','42','43','60', '61', '62', '63', '20','21','22','23','10','11','12','13']
let styleList = nameList.map(item=>{
	return {
		url: 'images/'+item+'.png',
		name: item
	}
})

styleList.forEach(obj=>{
	for(let i=0;i<360;i++){
		let item = {...obj}
		item.rotation = i
		item.anchor = new AMap.Pixel(18, 23)
		item.size = new AMap.Size(35, 46)
		pointStyle.push(item)
	}
})
