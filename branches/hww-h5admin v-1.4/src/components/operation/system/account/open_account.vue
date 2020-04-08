<template>
	<div class="open_account_wrap" v-loading="loading">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>系统功能</el-breadcrumb-item>
					<el-breadcrumb-item>账号管理</el-breadcrumb-item>
					<el-breadcrumb-item>{{title}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!-- 表单 -->
		<template>
			<el-form :model="table_data" :rules="rules" ref="table_data" label-width="100px" class="demo-table_data">
				<el-form-item label="账号" prop="account">
					<el-input v-model="table_data.account" :disabled="is.account"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="roleIds">
					<el-select v-model="table_data.roleIds" multiple default-first-option placeholder="请选择角色">
						<el-option v-for="item in role_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="table_data.userName"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="table_data.phoneNumber" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="部门">
					<el-input v-model="table_data.department"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="submitForm('table_data')">确定</el-button>
					<el-button @click="cancle">取消</el-button>
				</el-form-item>
			</el-form>
		</template>
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
			this.get_role_list()
			if (this.$route.params.row) {
				localStorage.setItem('accountRow', JSON.stringify(this.$route.params.row))
			}
			if (this.$route.params.id) {
				this.title = "编辑账号"
				this.is.account = true
				this.table_data = this.$route.params.row || JSON.parse(localStorage.getItem("accountRow"))
			}
		},
		components: {
			crumbs
		},
		watch: {
			"table_data.account": function(val) {
				this.table_data.account = val.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "")
			}
		},
		data() {
			return {
				loading: false,
				is: {
					account: false
				},
				role_list: [],
				title: '新增账号',
				table_data: {
					account: "",
					roleIds: [],
					userName: "",
					phoneNumber: "",
					department: ""
				},
				rules: {
					account: [{
						required: true,
						message: '请输入账号'
					}, ],
					roleIds: [{
						required: true,
						message: '请选择角色'
					}, ],
				}
			}
		},
		methods: {
			cancle() {
				this.$router.push({
					name: 'account'
				})
			},
			async get_role_list() {
				//DWA001007003
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001007003'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.role_list.push({
								value: i.id,
								name: i.roleName
							})
						})
					} else {
						this.$message.error(`${res.data.respHead.respMsg}`)
					}
				} catch (e) {
					console.log(e);
					if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					} else {
						this.$message.error(`error： ${e.message}`)
					}
				}
			},
			submitForm(formName) {
				let self = this,
					Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001006001'
						},
						body: this.table_data
					}
				if (this.$route.params.type === 1) {
					params.body.id = this.$route.params.row.id
				}
				self.$refs[formName].validate((valid) => {
					if (valid) {
						self.loading = true
						util.ajax.post(Url, params).then(res => {
							console.log(res);
							if (res.data.respHead.respCode == "000") {
								self.loading = false
								if (this.$route.params.type === 1) {
									self.$message.success('修改成功!')
								} else {
									self.$message.success('添加成功!')
								}
								self.$router.push({
									name: "account"
								})
							} else {
								self.loading = false
								self.$message.error(`${res.data.respHead.respMsg}`)
							}
						}).
						catch(err => {
							self.loading = false
							self.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
						});
					} else {
						self.$message.error('请填写必填项!')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.open_account_wrap {}
</style>
