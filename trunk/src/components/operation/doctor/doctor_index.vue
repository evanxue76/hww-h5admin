<template>
	<div class="doctor_index_wrap" v-loading="d_loading">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>医生管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!-- 搜索 -->
		<searchBox>
			<template slot="searchBox">
				<div class="seek_line">
					<div class>
						<span class="Names">姓名:</span>
						<el-input v-model.trim="searchData.doctorName" clearable placeholder="输入姓名"></el-input>
					</div>
					<div class>
						<span class="Names">手机号:</span>
						<el-input v-model.trim="searchData.mobile" type="tel" maxlength="11" clearable placeholder="输入手机号"></el-input>
					</div>
					<div class>
						<span class="Names">职称:</span>
						<el-select v-model="searchData.academicTitleId" clearable>
							<el-option v-for="item in title_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">级别:</span>
						<el-select v-model="searchData.isAssistant" clearable>
							<el-option v-for="item in level_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">学科:</span>
						<el-select v-model="searchData.departmentId" clearable>
							<el-option v-for="item in keshi_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">医院:</span>
						<el-input v-model.trim="searchData.hospitalName" clearable placeholder="输入医院名称"></el-input>
					</div>
					<div class>
						<span class="Names">渠道:</span>
						<el-select v-model="searchData.channelNo" clearable>
							<el-option v-for="item in qudao_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<div class="end-3">
					<div class>
						<span class="Names">已开通服务:</span>
						<el-select v-model="searchData.openingService" clearable style="padding-right:10px;">
							<el-option v-for="item in fuwu_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">审核状态:</span>
						<el-select v-model="searchData.assistantStutas" clearable style="padding-right:10px;">
							<el-option v-for="item in s_status_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">在线状态:</span>
						<el-select v-model="searchData.status" clearable style="padding-right:10px;">
							<el-option v-for="item in o_status_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div style="justify-content: flex-end;">
						<el-button type="primary" @click="get_list(0)">查询</el-button>
						<el-button type="primary" @click="reset_search">重置</el-button>
						<el-button type="primary" v-if="moduleIds.includes(48)" @click="exporttables">导出查询结果</el-button>
						<el-button type="primary" v-if="moduleIds.includes(19)" @click="add">添加医生</el-button>
					</div>
				</div>
			</template>
		</searchBox>
		<!-- 列表 -->
		<template>
			<el-table :data="tableData" class v-loading="loading">
				<el-table-column label="序号" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.$index + page.serialnumber }}</p>
					</template>
				</el-table-column>
				<el-table-column label="姓名" min-width="90">
					<template slot-scope="scope">
						<p>{{ scope.row.doctorName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="手机号" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.mobile }}</p>
					</template>
				</el-table-column>
				<el-table-column label="职称" min-width="60">
					<template slot-scope="scope">
						<p>{{ scope.row.academicTitle }}</p>
					</template>
				</el-table-column>
				<el-table-column label="级别" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.isAssistant | f_isDoctor }}</p>
					</template>
				</el-table-column>
				<el-table-column label="学科" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.department }}</p>
					</template>
				</el-table-column>
				<el-table-column label="医院" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.hospitalName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="渠道" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.channel }}</p>
					</template>
				</el-table-column>
				<el-table-column label="医生类型" min-width="50">
					<template slot-scope="scope">
					<p>{{scope.row.mockFlag===0?"正式医生":scope.row.mockFlag===1?"测试医生":""}}</p>
					</template>
				</el-table-column>
				<el-table-column label="审核状态" min-width="70">
					<template slot-scope="scope">
						<p v-if="scope.row.isFrozen === 1">冻结中</p>
						<p v-else-if="scope.row.isFrozen != 1">
							{{ scope.row.assistantStutas | f_assistantStutas }}
						</p>
					</template>
				</el-table-column>
				<el-table-column label="在线状态" min-width="70">
					<template slot-scope="scope">
						<p>{{ scope.row.status | f_status }}</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="85">
					<template slot-scope="scope">
						<span class="operation" v-if="
                scope.row.assistantStutas == 0 &&
                  scope.row.isFrozen != 1 &&
                  moduleIds.includes(19)
              "
						 @click="examine_fun(scope.row.id, scope.row)">审核</span>
						<span class="operation" v-if="scope.row.isFrozen === 1 && moduleIds.includes(19)" @click="thaw_fun(scope.row.id)">解冻</span>
						<span class="operation" v-if="
                scope.row.assistantStutas == 1 ||
                  (scope.row.assistantStutas == 2 && moduleIds.includes(19))
              "
						 @click="query_ecg_details(scope.row.id, scope.row)">查看详情</span>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<!-- 分页 -->
		<div class="list_page">
			<el-pagination background layout="prev, pager, next,total,jumper" :page-size="page.size" :current-page="page.num+1"
			 @current-change="pagechange" :total="page.total"></el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import config from "@/lib/global";

	import crumbs from '@/components/common/Crumbs'
	import searchBox from '@/components/common/searchBox'
	import {
		formatSecond
	} from '@/lib/time'
	export default {
		created() {
			this.get_keshi()
			this.get_list()
			this.get_qudao()
			this.moduleIds = JSON.parse(localStorage.getItem("hw_login_data")).moduleIds
		},
		components: {
			crumbs,
			searchBox
		},
		watch: {
			"searchData.mobile": function(val) {
				this.searchData.mobile = val.replace(/[^0-9]/g, '')
			}
		},
		data() {
			return {
				d_loading: false,
				moduleIds: [],
				fuwu_list: [{
						value: 4,
						name: '全部'
					},
					{
						value: 1,
						name: '图文咨询'
					},
					{
						value: 3,
						name: '报告解读'
					},
					{
						value: 5,
						name: 'AI'
					},
					{
						value: 6,
						name: '极速解读'
					},
					{
						value: 7,
						name: '平台医生'
					}
				],
				searchData: {
					academicTitleId: "",
					assistantStutas: "",
					departmentId: "",
					doctorName: "",
					hospitalName: "",
					isAssistant: "",
					isFrozen: "",
					mobile: "",
					status: "",
					isAiService:"",
					isQuickInterpret:"",
					isPlatformDoctor:"",
					openingService: "",
					channelNo: ""
				}, //搜索
				qudao_list: [],
				new_data: {},
				is_picker: true,
				level_list: [{
						value: '',
						name: '全部'
					},
					{
						value: 1,
						name: '医生助理'
					},
					{
						value: 0,
						name: '医生'
					},
				], //级别
				title_list: [{
						value: '',
						name: '全部'
					},
					{
						value: 1,
						name: '住院医师'
					},
					{
						value: 2,
						name: '主治医师'
					},
					{
						value: 3,
						name: '副主任医师'
					},
					{
						value: 4,
						name: '主任医师'
					},
					{
						value: 5,
						name: '资深专家'
					},
					{
						value: 6,
						name: '技师'
					},
					{
						value: 7,
						name: '主管技师'
					},
					{
						value: 8,
						name: '副主任技师'
					},
					{
						value: 9,
						name: '主任技师'
					}
				], //职称
				d_status_list: [{
						value: '',
						name: '全部'
					},
					{
						value: 0,
						name: '正常'
					},
					{
						value: 1,
						name: '冻结中'
					}
				], // 冻结状态
				s_status_list: [{
						value: '',
						name: '全部'
					},
					{
						value: 5,
						name: '正常'
					},
					{
						value: 0,
						name: '审核中'
					},
					{
						value: 2,
						name: '审核未通过'
					},
					{
						value: 4,
						name: '冻结中'
					}
				], //审核状态
				o_status_list: [{
						value: '',
						name: '全部'
					},
					{
						value: 1,
						name: '在线'
					},
					{
						value: 0,
						name: '离线'
					},

				], //在线状态
				keshi_list: [{
					value: '',
					name: '全部'
				}],
				duration_list: [],
				tableData: [],
				loading: false,
				page: {
					total: 0,
					size: 15,
					num: 0,
					serialnumber: 0
				}
			}
		},
		methods: {
			// 解冻
			async thaw_fun(id) {
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001001005'
						},
						body: {
							id,
							isFrozen: 0
						}
					}
				this.loading = true
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						this.loading = false;
						this.get_list()
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
			// 审核跳转
			examine_fun(id) {
				this.$router.push({
					name: 'review_doctor',
					params: {
						type: 1,
						id //type:1查看详情、2：编辑
					}
				})
			},
			// 导出查询结果
			async exporttables() {
				let Url = config.developmentUrl.host1 + "file/downDoctor";
				this.d_loading = true
				let assistantStutas,openingService
				if (this.searchData.assistantStutas == 4) {
					this.searchData.assistantStutas = ""
					this.searchData.isFrozen = 1
					assistantStutas = 4
				}
				
				if(this.searchData.openingService==5){
					this.searchData.isAiService = 1
					this.searchData.isQuickInterpret = ""
					this.searchData.isPlatformDoctor = ""
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}else if(this.searchData.openingService==6){
					this.searchData.isAiService = ""
					this.searchData.isQuickInterpret = 1
					this.searchData.isPlatformDoctor = ""
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}else if(this.searchData.openingService==7){
					this.searchData.isAiService = ""
					this.searchData.isQuickInterpret = ""
					this.searchData.isPlatformDoctor = 1
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}
				
				let res = await axios({
					url: Url,
					method: 'post',
					data: this.searchData,
					responseType: "blob"
				})
				try {
					
					if (res.data.size > 0) {
						this.d_loading = false
						let url = window.URL.createObjectURL(new Blob([res.data]));
						let link = document.createElement("a");
						link.style.display = "none";
						link.href = url;
						link.setAttribute("download", `${formatSecond(new Date().getTime())}.xlsx`);
						document.body.appendChild(link);
						link.click();
					} else {
						this.d_loading = false
						this.$message.error(`${res.data.respHead.respMsg}`)
					}
				} catch (e) {
					this.d_loading = false
					this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
				}
				if (assistantStutas == 4) {
					this.searchData.assistantStutas = 4
					this.searchData.isFrozen = ""
				}
				if(openingService){
					this.searchData.openingService = openingService
				}
			},
			// 查看详情
			query_ecg_details(id, row) {
				let obj = {
					0: "review_doctor",
					1: "edit_doctor"
				}
				// console.log(obj[row.source]);

				this.$router.push({
					name: obj[row.source],
					params: {
						type: 1,//type:1查看详情、2：编辑
						id 
					}
				})
				// if (row.source === 0) { //数据来源(0 国家平台 1好络维)
				//   this.$router.push({
				//     name: 'review_doctor', params: {
				//       type: 1, id //type:1查看详情、2：编辑
				//     }        })
				// }else{
				//   this.$router.push({
				//   name: 'edit_doctor', params: {
				//     type: 1, id //type:1查看详情、2：编辑
				//   }      })
				// }

			},
			// 查询渠道
			async get_qudao() {
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001001007'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.qudao_list.push({
								value: i.channelNo,
								name: i.channel
							})
						});
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
			// 添加跳转
			add() {
				this.$router.push({
					name: "edit_doctor"
				})
			},
			// 查询科室专业
			async get_keshi() {
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001001004'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.keshi_list.push({
								value: i.medicalClassificationCode,
								name: i.medicalClassificationName
							})
						});
					} else {
						this.$message.error('查询学科列表出错!')
					}
				} catch (e) {
					if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					} else {
						this.$message.error(`error： ${e.message}`)
					}
				}
			},
			// 查询列表
			async get_list(num) {
				num >= 0 ? this.page.num = num : ""
				let assistantStutas,openingService
				if (this.searchData.assistantStutas == 4) {
					this.searchData.assistantStutas = ""
					this.searchData.isFrozen = 1
					assistantStutas = 4
				}
				if(this.searchData.openingService==5){
					this.searchData.isAiService = 1
					this.searchData.isQuickInterpret = ""
					this.searchData.isPlatformDoctor = ""
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}else if(this.searchData.openingService==6){
					this.searchData.isAiService = ""
					this.searchData.isQuickInterpret = 1
					this.searchData.isPlatformDoctor = ""
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}else if(this.searchData.openingService==7){
					this.searchData.isAiService = ""
					this.searchData.isQuickInterpret = ""
					this.searchData.isPlatformDoctor = 1
					openingService = this.searchData.openingService
					this.searchData.openingService = ""
				}
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001001002'
						},
						body: this.searchData
					}
				params.body.pageSize = this.page.size
				params.body.pageNum = this.page.num
				this.loading = true
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					this.loading = false;
					if (res.data.respHead.respCode === "000") {
						this.tableData = res.data.body.data.datas;
						this.page.total = res.data.body.data.total
						this.page.serialnumber = 1 + this.page.size * this.page.num
						
					} else {
						this.$message.error(`${res.data.respHead.respMsg}`)
					}
				} catch (e) {
					this.loading = false;
					console.log(e);
					this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
				}
				if (assistantStutas == 4) {
					this.searchData.assistantStutas = 4
					this.searchData.isFrozen = ""
				}
				if(openingService){
					this.searchData.openingService = openingService
				}
			},
			reset_search() {
				this.searchData = {
					academicTitleId: "",
					assistantStutas: "",
					departmentId: "",
					doctorName: "",
					hospitalName: "",
					isAssistant: "",
					isAiService:"",
					isQuickInterpret:"",
					isPlatformDoctor:"",
					isFrozen: "",
					mobile: "",
					status: "",
					openingService: "",
					channelNo: ""
				} //搜索
				this.page.num = 0
				this.get_list()

			},
			// 分页操作
			pagechange(num) {
				this.page.num = num - 1
				this.get_list()
			}
		},
		filters: {
			f_isDoctor(val) {
				return val === 1 ? "助理" : val === 0 ? '医生' : ""
			},
			f_isAssistant(val) {
				let obj = {
					1: "普通",
					2: "专家"
				}
				return obj[val] || ""
			},
			f_status(val) {
				let obj = {
					0: "离线",
					1: "在线"
				}
				return obj[val] || ""
			},
			f_assistantStutas(val) {
				let obj = {
					0: "审核中",
					1: "正常",
					2: "审核未通过"
				}
				return obj[val] || ""
			}
		}
	}
</script>

<style lang="scss">
	.doctor_index_wrap {
		.searchBox .Names {
			min-width: 85px;
		}

		.operation {
			color: #0099ff;
			cursor: pointer;
			padding: 0 8px;
		}
	}
</style>
