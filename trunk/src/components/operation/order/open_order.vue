<template>
	<div class="open_order_wrap">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>订单管理</el-breadcrumb-item>
					<el-breadcrumb-item>订单详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!-- 内容 -->
		<ul>
			<li>
				<span>订单号：</span>
				{{data.orderNo}}
			</li>
			<li>
				<span>微信订单号：</span>
				{{data.wxOrderNo}}
			</li>
			<li>
				<span>商品名称：</span>
				{{data.commName}}
			</li>
			<li>
				<span>用户号码：</span>
				{{data.mobile}}
			</li>
			<li>
				<span>订单类型：</span>
				{{data.type|f_type}}
			</li>
			<li>
				<span>下单时间：</span>
				{{data.createdAt|f_time}}
			</li>
			<li>
				<span>支付时间：</span>
				{{data.timeEnd|f_time}}
			</li>
			<li>
				<span>订单金额：</span>
				{{data.price | profitFilter}}
			</li>
			<li>
				<span>折扣：</span>
				{{data.discount | profitFilter}}
			</li>
			<li>
				<span>折扣说明：</span>
				{{data.disReason}}
			</li>
			<li>
				<span>实付金额：</span>
				{{data.value | profitFilter}}
			</li>
			<li>
				<span>订单状态：</span>
				{{data.status|f_status}}
			</li>
			<li>
				<span>好络维分成：</span>
				{{data.hlwProfit | profitFilter}}
			</li>
			<li>
				<span>渠道商分成：</span>
				{{data.channelProfit | profitFilter}}
			</li>
			<li>
				<span>医生分成：</span>
				{{data.doctorProfit | profitFilter}}
			</li>
		</ul>
		<div>
			<el-button type="primary" v-if="data.status===0" @click="cancel_order">取消订单</el-button>
			<el-button type="primary" @click="go_to">返回</el-button>
		</div>
	</div>
</template>

<script>
	import util from '@/lib/util'
	import crumbs from '@/components/common/Crumbs'
	import {
		formatSecond
	} from "@/lib/time"
	export default {
		created() {
			if (this.$route.params.row) {
				localStorage.setItem('orderRow', JSON.stringify(this.$route.params.row))
			}
			if (this.$route.params.id) {
				this.data = this.$route.params.row || JSON.parse(localStorage.getItem("orderRow"))
				this.mobile = this.data.mobile
			}
          this.order()
		},
		components: {
			crumbs
		},
		data() {
			return {
				data: {},
				mobile: ''
			}
		},
		methods: {
			go_to() {
				this.$router.push({
					name: 'order'
				})
			},
			order() {
				let _this = this
				let Url = '',
						params = {
							reqHead: {
								functionId: 'DWA001005002'
							},
							body: {
								id: this.data.id
							}
						}
					util.ajax.post(Url, params).then(res => {
						console.log(res)
						if(res.data.respHead.respCode === "000"){
							_this.data =res.data.body.data
							_this.data.mobile = _this.mobile
						}

					})

			},
			cancel_order() {
				let _this = this
				let Url = '',
					params = {
						reqHead: {
							functionId: 'DWA001005003'
						},
						body: {
							id: this.data.id
						}
					}
				this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					util.ajax.post(Url, params).then(res => {
						console.log(res)
						if (res.data.respHead.respCode === "000") {
							_this.$message({
								type: 'success',
								message: '取消成功!'
							})
							this.go_to()
						} else {
							_this.$message.error(`${res.data.respHead.respMsg}`)
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		filters: {
			f_status(val) {
				let status_list = ['支付中', '支付成功', '支付失败', '已发货', '订单过期关闭', '取消', '退款', '已升级续费', '运营中心关闭']
				return status_list[val] || ""
			},
			f_type(val) {
				return val === 4 ? "图文咨询" : val === 6 ? "人工解读" : ''
			},
			f_time(val) {
				return formatSecond(val)
			},
			profitFilter(val){
				return val/100
			}
		}
	}
</script>

<style lang="scss">
	.open_order_wrap {
		font-size: 14px;

		ul {
			list-style: none;
			padding-left: 0;

			li {
				margin-bottom: 10px;

				span {
					display: inline-block;
					min-width: 100px;
				}
			}
		}
	}
</style>
