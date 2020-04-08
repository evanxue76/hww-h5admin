const items = [
    // 系统中心
    {
        index: 'users',
        title: '用户管理',
        id: 1,
        mark: 'userCenter',
        show: false,
        key: '1'
    },
	  
	{
        index: 'hospital',
        title: '医院管理',
        id: 10,
        mark: 'operateCenter',
        show: false,
        key: '10'
    }, {
        index: 'Doctor',
        title: '医生管理',
        id: 2,
        mark: 'operateCenter',
        show: false,
        key: '2'
    }, 
	{
	    index: 'business',
	    title: '渠道商管理',
	    id: 3,
	    mark: 'userCenter',
	    show: false,
	    key: '3'
	},
	// {
	//     index: 'code',
	//     title: '激活码管理',
	//     id:97 ,
	//     mark: 'userCenter',
	//     show: false,
	//     key: '97'
	// },
	{
        index: 'order',
        title: '订单管理',
        id: 11,
        cId:36,
        mark: 'operateCenter',
        show: false,
        key: '11'
    },
    //  {
    //     index: 'h5_banner',
    //     title: 'H5 Banner配置',
    //     id: 71,
    //     mark: 'operateCenter',
    //     show: false,
    //     key: '71'
    // }, 
    {
        index: 'app_banner',
        title: 'APP Banner配置',
        id: 7,
        mark: 'operateCenter',
        show: false,
        key: '7'
    }, 
    {
    	index: '2',
    	title: '运营中心',
    	id: 97,
    	mark: '',
    	subs: [
      		 {
      		 	index: 'serviceManage',
      		 	title: '服务套餐管理',
      		 	id: 99,
      		 	mark: 'opearteCenter',
      		 	show: false,
      		 	key: '98'
      		 },
			{
				index: 'codehomepage',
				title: '激活码管理',
				id: 98,
				mark: 'codehomepage',
				show: false,
				key: '98'
			},
			{
				index: 'reviewedindex',
				title: '心电数据审核',
				id: 103,
				mark: 'reviewedindex',
				show: false,
				key: '103'
			}
    	]
    },
    {
        index: '1',
        title: '报表中心',
        id: 67,
        mark: 'userCenter',
        show: false,
        subs: [
            {
                index: 'serviceRecords',
                title: '服务记录',
                id: 72,
                mark: 'userCenter',
                show: false,
                key: '72'
            },
            {
                index: 'measure',
                title: '测量记录',
                id: 73,
                mark: 'userCenter',
                show: false,
                key: '73'
            }
        ]
    }, {
        index: '',
        title: '系统功能',
        id: 52,
        mark: 'userCenter',
        show: false,
        subs: [{
            index: 'account',
            title: '账号管理',
            id: 12,
            mark: 'userCenter',
            show: false,
            key: '12'
        }, {
            index: 'role',
            title: '角色管理',
            id: 13,
            mark: 'userCenter',
            show: false,
            key: '13'
        },
		{
            index: 'setups',
            title: '系统设置',
            id: 104,
            mark: 'userCenter',
            show: false,
            key: '104'
        }
		]
    }
    
]


export default items