<template>
	<div class="user_details" v-loading="loading">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>个人信息</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!-- 表单 -->
		<template>
			<el-form :model="user_info" ref="table_data" label-width="100px" class="demo-table_data">
				<el-form-item label="用户名：">
					<el-input v-model="user_info.account" :disabled="is.ds"></el-input>
				</el-form-item>
				<el-form-item label="密码：">
					<el-input v-model="pwd" :disabled="is.ds"></el-input>
					<u @click="path_active=true">修改密码</u>
				</el-form-item>
				<el-form-item label="角色：">
					<el-input v-model="user_info.roleName" :disabled="is.ds"></el-input>
				</el-form-item>
				<el-form-item label="部门：">
					<el-input v-model="user_info.department" :disabled="is.ds"></el-input>
				</el-form-item>
				<el-form-item label="姓名：">
					<el-input v-model="user_info.userName"></el-input>
				</el-form-item>
				<el-form-item label="手机号：">
					<el-input v-model="user_info.phoneNumber" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="save_u_info">保存</el-button>
					<el-button @click="go_to">取消</el-button>
				</el-form-item>
			</el-form>
		</template>

		<div class="img-modal" v-if="path_active">
			<el-form :model="edit_pwd_data" status-icon :rules="rules" ref="edit_pwd_data" label-width="90px" class="demo-ruleForm modify_box">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input type="password" v-model="edit_pwd_data.oldPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="edit_pwd_data.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input type="password" v-model="edit_pwd_data.confirmPassword"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('edit_pwd_data')">确定</el-button>
					<el-button class="cancle" @click="cancle">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="v-modal" v-if="path_active" @click="path_active=false"></div>
	</div>
</template>

<script>
	import util from '@/lib/util'
	import dd from"./../../../../vue.config"
	import crumbs from '@/components/common/Crumbs'
	import {
		formatSecond
	} from '@/lib/time'
	export default {
		created() {
			this.get_user_details()
		},
		components: {
			crumbs
		},
		data() {
			let validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.edit_pwd_data.password !== '' && this.edit_pwd_data.password.length >= 6) {
						this.$refs.edit_pwd_data.validateField('checkPass');
					} else {
						callback(new Error('密码长度小于6位'));
					}
					callback();
				}
			};
			let validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value != this.edit_pwd_data.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				loading: false,
				is: {
					ds: true
				},
				rules: {
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					confirmPassword: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					oldPassword: [{
						required: true,
						message: '请填写旧密码',
						trigger: 'blur'
					}]
				},
				edit_pwd_data: {
					confirmPassword: "",
					password: "",
					oldPassword: ""
				},
				pwd: "********",
				loading: false,
				path_active: false,
				user_info: {},
				user_details: {},
				cdlist: [],
				celist: [],
				path: "",
				photo: require('./../../../assets/image/pic_user.png')
			}
		},
		methods: {
			// 修改密码
			submitForm(formName) {
				let Url = '',
					self = this,
					params = {
						reqHead: {
							'functionId': 'DWA001006007'
						},
						body: this.edit_pwd_data
					}
				params.body.id = JSON.parse(localStorage.getItem("hw_login_data")).accountId
				self.$refs[formName].validate((valid) => {
					if (valid) {
						util.ajax.post('', params).then(res => {
							console.log(res);
							if (res.status == "200" && res.data.respHead.respCode == "000") {
								self.$message({
									message: '修改成功!',
									type: 'success'
								})
								self.path_active = false
								window.location.href = `${dd.publicPath}`
								localStorage.removeItem("hw_token")
								localStorage.removeItem("hw_login_data")
							} else {
								self.$message.error(`${res.data.respHead.respMsg}`)
							}
						}).
						catch(err => {
							console.log(err);
							if (e.message.includes('Network')) {
								self.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
							} else {
								self.$message.error(`error： ${e.message}`)
							}
						});
					}
				})
			},
			async save_u_info() {
				if(this.user_info.phoneNumber!=""&&!/^1\d{10}$/.test(this.user_info.phoneNumber)){
					this.$message.error("手机号码有误，请重填");
					return;
				}
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001006001'
						},
						body: this.user_info
					}
				this.loading = true
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						this.loading = false;
						this.$message.success('保存成功!')
					} else {
						this.loading = false;
						this.$message.error(`${res.data.respHead.respMsg}`)
					}
				} catch (e) {
					console.log(e);
					this.loading = false;
					if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					} else {
						this.$message.error(`error： ${e.message}`)
					}
				}
			},
			cancle() {
				this.path_active = false
			},
			go_to() {
				this.$router.push({
					name: 'users'
				})
			},
			//   放大
			enlarge(path) {
				this.path = path
				this.path_active = true
			},
			//   查询用户详情
			async get_user_details() {
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001006004'
						},
						body: {
							id: JSON.parse(localStorage.getItem("hw_login_data")).accountId
						}
					}
				this.loading = true
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						this.loading = false;
						this.user_info = res.data.body.data
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
			}
		},
		filters: {
			time(val) {
				return formatSecond(val)
			},
			sex(val) {
				return val === 0 ? "男" : "女"
			}
		}
	}
</script>

<style lang="scss">
	.user_details {
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

		.img_list {
			display: flex;
			flex-wrap: wrap;
			margin-left: 85px;
			margin-top: 10px;

			img {
				width: 180px;
				height: 180px;
				margin-right: 10px;
			}
		}

		.user_info {
			display: flex;
		}

		.info_p {
			flex: 0 0 20%;
			max-width: 90px;
			height: 90px;

			img {
				width: 100%;
				height: 100%;
			}

			margin-right: 20px;
		}

		.info_name {
			flex: 1;
			display: flex;
			flex-direction: column;

			&>div {
				width: 500px;
				word-wrap: break-word;
			}
		}

		.modify_box {
			width: 400px;
			padding: 20px;
			// height: 300px;
			background: #ffffff;
			border-radius: 10px;

			.confirm div {
				display: inline-block;
				width: 50%;
			}
		}

		.img-modal {
			position: fixed;
			top: 50%;
			left: 50%;
			display: flex;
			// width: 80%;
			// height: 100%;
			font-size: 16px;
			overflow: hidden;
			transition: 0.3s;
			transform: translate3d(-50%, -50%, 0);
			flex-direction: column;
			justify-content: center;
			align-items: center;
			z-index: 9999;
		}
	}
</style>
