<template>
	<div class="user_details" v-loading="loading">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item>用户详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<div class="user_info">
			<div class="info_p">
				<img :src="user_info.photo" v-if="user_info.photo" alt />
				<img v-else :src="photo" alt />
			</div>
			<div class="info_name">
				<div class>昵称：{{user_info.nickName}}</div>
				<div>
					<span>openId：</span>
					{{user_info.hwOpenId}}
				</div>
				<div class>注册时间：{{user_info.createdAt|time}}</div>
				<div class>最近一次登录时间：{{user_info.recentLoginTime|time}}</div>
			</div>
		</div>
		<ul>
			<li>
				<span>姓名：</span>
				{{user_info.name}}
			</li>
			<li>
				<span>性别：</span>
				{{user_info.sex|sex}}
			</li>
			<li>
				<span>年龄：</span>
				{{user_info.age}}
			</li>
			<!-- <li>
        <span>手机号：</span>
        {{user_info.hwMobile}}
      </li> -->
			<li>
				<span>身高：</span>
				{{user_details.height}}(m)
			</li>
			<li>
				<span>体重：</span>
				{{user_details.weight}}(kg)
			</li>
			<li>
				<span>BMI：</span>
				{{user_details.bmi}}
			</li>
			<li>
				<span>已绑定设备：</span>
				{{equipment}}
			</li>
			<li>
				<span>既往史：</span>
				{{user_details.pastHistory}}
			</li>
			<li>
				<span>过敏史：</span>
				{{user_details.allergyHistory}}
			</li>
			<li>
				<span>家族史：</span>
				{{user_details.familyHistory}}
			</li>
			<li>
				<span>临床检查：</span>
				{{user_details.clinicalExamination}}
				<div class="img_list" style="cursor:pointer;" v-for="item in celist">
					<img @click="enlarge(item.path)" :src="item.path" alt />
				</div>
			</li>
			<li>
				<span>临床诊断：</span>
				{{user_details.clinicalDiagnosis}}
				<div class="img_list" style="cursor:pointer;" v-for="item in cdlist">
					<img @click="enlarge(item.path)" :src="item.path" alt />
				</div>
			</li>
		</ul>
		<div class>是否签约医生： {{isSingDoctor|f_isSingDoctor}}</div>
		<br />
		<ul v-if="isSingDoctor">
			<li>签约医生：{{doctorName}}</li>
			<li>医生所在医院：{{hospitalName}}</li>
			<li>签约时长：{{duration}}个月</li>
			<li>签约到期时间：{{endDate}}</li>
		</ul>
		<div class v-if="isSingDoctor">
			<div class>免费次数</div>
			<div class="edit-item" v-if="is.tuwen">
				<div class="title">图文咨询次数</div>
				<el-input v-model="tuwen.num" disabled maxlength="10"></el-input>
				<i class="el-icon-edit-outline" @click="edit_show('tuwen')"></i>
			</div>
			<div class="edit-item" v-if="is.dongtai">
				<div class="title">动态心电报告解读次数</div>
				<el-input v-model="dongtai.num" disabled maxlength="10"></el-input>
				<i class="el-icon-edit-outline" @click="edit_show('dongtai')"></i>
			</div>
			<div class="edit-item" v-if="is.jingtai">
				<div class="title">静态心电报告解读次数</div>
				<el-input v-model="jingtai.num" disabled maxlength="10"></el-input>
				<i class="el-icon-edit-outline" @click="edit_show('jingtai')"></i>
			</div>
		</div>
		<div class="btns">
			<el-button type="danger" @click="_Untie" v-if="isSingDoctor">解绑医生</el-button>
			<el-button type="primary" @click="go_to">返回</el-button>
		</div>
		<tudanModal :title="edit_data.title" :mdShow="edit_data.is" :width="edit_data.width" v-if="edit_data.is" @closeModal="closeModal(1)">
			<template slot="md-content">
				<div>
					<div class="num-box">
						<div class="num-title">{{edit_data.text}}</div>
						<el-input v-model="score" maxlength="10"></el-input>
					</div>
					<div class="btns btnssxx">
						<el-button type="success" @click="_num">确认</el-button>
						<el-button type="success" @click="closeModal(1)">取消</el-button>
					</div>
				</div>
			</template>
		</tudanModal>
		<div class="img-modal" v-if="path_active" @click="path_active=false">
			<img :src="path" alt />
		</div>
		<div class="v-modal" v-if="path_active" @click="path_active=false"></div>
	</div>
</template>

<script>
	import util from "@/lib/util";
	import crumbs from "@/components/common/Crumbs";
	import tudanModal from "@/components/operation/banner/tudan_modal";
	import {
		formatDay,
		formatDate,
		formatSecond
	} from "@/lib/time";
	export default {
		created() {
			if (this.$route.params.row) {
				localStorage.setItem('userRow', JSON.stringify(this.$route.params.row))
			}
			this.user_info = this.$route.params.row || JSON.parse(localStorage.getItem("userRow"))

			this.get_user_details();
		},
		watch: {
			score: function(val) {
				this.score = val.replace(/[^0-9]/g, "");
			}
		},
		components: {
			crumbs,
			tudanModal
		},
		data() {
			return {
				equipment:null,
				score: "",
				edit_num_id: "",
				tuwen: {},
				dongtai: {},
				jingtai: {},
				is: {
					tuwen: false,
					dongtai: false,
					jingtai: false
				},
				doctorId: "",
				doctorName: "",
				hospitalName: "",
				endDate: "",
				duration: "",
				edit_data: {
					title: "修改免费次数",
					is: false,
					width: 50,
					text: ""
				},
				edit: {},
				isSingDoctor: false,
				loading: false,
				path_active: false,
				user_info: {
					photo: ""
				},
				user_details: {},
				cdlist: [],
				celist: [],
				path: "",
				photo: require("./../../../assets/image/pic_user.png")
			};
		},
		methods: {
			// 解绑签约医生
			async Untie() {
				let Url = "",
					params = {
						reqHead: {
							functionId: "DWA001003004"
						},
						body: {
							managerNo: this.$route.params.id,
							docId: this.doctorId
						}
					};
				this.loading = true;
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						this.loading = false;
						this.$message({
							message: "解绑成功",
							type: "success"
						});
						this.get_user_details();
					} else {
						this.$message.error(`${res.data.respHead.respMsg}`);
					}
				} catch (e) {
					console.log(e);
					this.$message.error(`error： ${e.message}`);
				}
			},
			// 修改免费次数
			async _num() {
				if (this.score < 0) {
					return this.$message.error("请正确填写数值，必须大于等于0");
				}
				let Url = "",
					params = {
						reqHead: {
							functionId: "DWA001003003"
						},
						body: {
							id: this.edit_num_id,
							score: this.score
						}
					};
				this.loading = true;
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					this.loading = false;
					this.edit_data.is = false;
					this.score = "";
					if (res.data.respHead.respCode === "000") {
						this.$message({
							message: "修改成功",
							type: "success"
						});
						this.get_user_details();
						// this.tableData = res.data.body.data;
					} else {
						this.$message.error(`${res.data.respHead.respMsg}`);
					}
				} catch (e) {
					console.log(e);
					this.loading = false;

					this.$message.error(`error： ${e.message}`);
				}
			},
			// 解绑确认
			_Untie() {
				this.$confirm("确定要解除签约医生服务吗？, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						this.Untie();
					})
					.catch(() => {
						// 取消删除时触发
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			edit_show(type) {
				this.edit_data.is = true;
				this.edit_num_id = this[type].id;
				let obj = {
					tuwen: "图文咨询次数",
					dongtai: "动态心电报告解读次数",
					jingtai: "静态心电报告解读次数"
				};
				this.edit_data.text = obj[type];
			},
			closeModal() {
				this.edit_data.is = false;
			},
			go_to() {
				this.$router.push({
					name: "users"
				});
			},
			//   放大
			enlarge(path) {
				this.path = path;
				this.path_active = true;
			},
			//   查询用户详情
			async get_user_details() {
				let Url = "",
					obj = {
						1: "tuwen",
						3: "jingtai",
						4: "dongtai"
					},
					params = {
						reqHead: {
							functionId: "DWA001003002"
						},
						body: {
							id: this.$route.params.id
						}
					};
				this.loading = true;
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						this.loading = false;
						this.user_details = res.data.body.data.hwMedicalInformation;
						this.equipment = res.data.body.data.equipment;
						this.isSingDoctor = res.data.body.data.isSingDoctor;
						if (res.data.body.data.isSingDoctor) {
							this.doctorId = res.data.body.data.doctorId;
							this.doctorName = res.data.body.data.doctorName;
							this.duration = res.data.body.data.duration;
							this.hospitalName = res.data.body.data.hospitalName;
							this.endDate = formatSecond(res.data.body.data.endDate);
							res.data.body.data.hwSigningUserList.map(i => {
								this.is[obj[i.serviceType]] = true;
								this[obj[i.serviceType]].num = i.surplusNum;
								this[obj[i.serviceType]].id = i.id;
							});
						}

						if (this.user_details.height) {
							this.user_details.height = this.user_details.height / 100;
						}
						if (this.user_details.weight && this.user_details.height) {
							this.user_details.bmi = (
								this.user_details.weight /
								(this.user_details.height * this.user_details.height)
							).toFixed(2);
						}
						this.cdlist = res.data.body.data.cdlist;
						this.celist = res.data.body.data.celist;
					} else {
						this.loading = false;
						this.$message.error(`${res.data.respHead.respMsg}`);
					}
				} catch (e) {
					this.loading = false;
					console.log(e);
					if (e.message.includes("Network")) {
						this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
					} else {
						this.$message.error(`error： ${e.message}`);
					}
				}
			}
		},
		filters: {
			time(val) {
				return formatSecond(val);
			},
			f_isSingDoctor(val) {
				return val ? "是" : "否";
			},
			sex(val) {
				return val === 0 ? "男" : "女";
			}
		}
	};
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

		.img-modal {
			position: fixed;
			top: 50%;
			left: 50%;
			display: flex;
			width: 80%;
			height: 80%;
			font-size: 16px;
			overflow: hidden;
			transition: 0.3s;
			transform: translate3d(-50%, -50%, 0);
			flex-direction: column;
			justify-content: center;
			align-items: center;
			z-index: 9999;

			img {
				width: auto;
				height: 100%;
				max-width: 100%;
			}
		}

		.edit-item {
			display: flex;
			align-items: center;
			margin-top: 10px;

			.title {
				width: 150px;
			}

			.el-input {
				width: 150px;
				padding: 0 10px;
			}
		}

		.btns {
			margin-top: 30px;
		}

		.num-box {
			display: flex;
			align-items: center;

			.el-input {
				width: 150px;
			}
		}

		.btns {
			border-top: 1px solid #ddd;
			padding-top: 30px;
			text-align: center;
		}

		.btnss {
			text-align: right;
		}

		.num-title {
			width: 100px;
		}
	}
</style>
