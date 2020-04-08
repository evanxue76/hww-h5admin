import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/common/Home'
import Doctor from '@/components/operation/doctor/doctor_index.vue'
Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/home',
		component: Home,
		name: 'Home',
		children: [
			// 医生管理
			{
				path: 'doctor',
				component: resolve => require(['./components/operation/doctor/doctor_index.vue'], resolve),
				name: 'Doctor'
			},
			// 医生管理
			{
				path: 'doctor/edit_doctor',
				component: resolve => require(['./components/operation/doctor/edit_doctor.vue'], resolve),
				name: 'edit_doctor'
			},
			{
				path: 'doctor/review_doctor/:id',
				component: resolve => require(['./components/operation/doctor/review_doctor.vue'], resolve),
				name: 'review_doctor'
			},
			// 用户管理
			{
				path: 'users',
				component: resolve => require(['./components/operation/users/users.vue'], resolve),
				name: 'users'
			},
			// 用户管理
			{
				path: 'users/user_info/:id',
				component: resolve => require(['./components/operation/users/user_details.vue'], resolve),
				name: 'user_details'
			},
			{
				path: 'users/user_info',
				component: resolve => require(['./components/operation/users/user_info.vue'], resolve),
				name: 'user_info'
			},
			// 医院管理
			{
				path: 'hospital',
				component: resolve => require(['./components/operation/hospital/hospital_index.vue'], resolve),
				name: 'hospital'
			},
			// 医院管理
			{
				path: 'hospital/open_hospital/:id',
				component: resolve => require(['./components/operation/hospital/open_hospital.vue'], resolve),
				name: 'open_hospital'
			},
			// 订单管理
			{
				path: 'order',
				component: resolve => require(['./components/operation/order/order_index.vue'], resolve),
				name: 'order'
			},
			{
				path: 'order/open_order/:id',
				component: resolve => require(['./components/operation/order/open_order.vue'], resolve),
				name: 'open_order'
			},
			// app_banner
			{
				path: 'h5_banner',
				component: resolve => require(['./components/operation/banner/h5_banner.vue'], resolve),
				name: 'h5_banner'
			},
			{
				path: 'app_banner',
				component: resolve => require(['./components/operation/banner/app_banner.vue'], resolve),
				name: 'app_banner'
			},
			//报表中心
			// 测量记录
			{
				path: 'measure',
				component: resolve => require(['./components/operation/reportForm/measure.vue'], resolve),
				name: 'measure'
			},
			//报表中心
			// 服务记录
			{
				path: 'serviceRecords',
				component: resolve => require(['./components/operation/reportForm/serviceRecords.vue'], resolve),
				name: 'serviceRecords'
			},
			{
				path: 'ecgPage',
				component: resolve => require(['./components/operation/reportForm/ecgPage.vue'], resolve),
				name: 'ecgPage'
			},
			// 系统功能 账号管理
			{
				path: 'account',
				component: resolve => require(['./components/operation/system/account/account_index.vue'], resolve),
				name: 'account'
			},
			{
				path: 'account/open_account/:id',
				component: resolve => require(['./components/operation/system/account/open_account.vue'], resolve),
				name: 'open_account'
			},
			{
				path: 'role',
				component: resolve => require(['./components/operation/system/role/role_index.vue'], resolve),
				name: 'role'
			},
			{
				path: 'role/open_roles/:id',
				component: resolve => require(['./components/operation/system/role/open_role.vue'], resolve),
				name: 'open_role'
			},
			// 渠道商管理
			{
				path: 'business',
				component: resolve => require(['./components/operation/business/businessManage.vue'], resolve),
				name: 'business'
			},
			// 新增渠道商
			{
				path: 'businessCreate',
				component: resolve => require(['./components/operation/business/businessCreate.vue'], resolve),
				name: 'businessCreate'
			},
			// 渠道商详情
			{
				path: 'businessDetails',
				component: resolve => require(['./components/operation/business/businessDetails.vue'], resolve),
				name: 'businessDetails'
			},
			// 重复页面
			{
				path: 'repeats',
				component: resolve => require(['./components/operation/business/repeats.vue'], resolve),
				name: 'repeats'
			},
			// 不请求成功
			{
				path: 'Unsuccessful',
				component: resolve => require(['./components/operation/business/Unsuccessful.vue'], resolve),
				name: 'Unsuccessful'
			},
		]
	},
	{
		path: '/RTS_login',
		name: 'RTS_login',
		component: resolve => require(['./components/operation/realTimeService/login.vue'], resolve),
	},
	{
		path: '/RTS_order_list',
		name: 'RTS_order_list',
		component: resolve => require(['./components/operation/realTimeService/order_list.vue'], resolve),
	},
	{
		path: '/RTS_post_msg',
		name: 'RTS_post_msg',
		component: resolve => require(['./components/operation/realTimeService/post_msg.vue'], resolve),
	},
	{
		path: '/RTS_cancel_order',
		name: 'RTS_cancel_order',
		component: resolve => require(['./components/operation/realTimeService/cancel_order.vue'], resolve),
	},
	{
		path: "*",
		redirect: "/"
	}
	]
})