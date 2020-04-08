<template>
	<div class="open_hospital_wrap" v-loading="loading">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>医院管理</el-breadcrumb-item>
					<el-breadcrumb-item>{{crumbs_msg}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!-- 表单区 -->
		<div class="edit_doctor_content">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :disabled="ruleForm.source==0">
				<el-form-item label="医院名称" prop="hospitalName">
					<el-input v-model="ruleForm.hospitalName" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="医院等级" prop="hospitalGradeCode">
					<el-select v-model="ruleForm.hospitalGradeCode" @change="data=>set_hospital_change(data,'hospital_level_list','hospitalGrade','hospitalGradeType')"
					 placeholder="请选择" clearable>
						<el-option v-for="item in hospital_level_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="行政级别" prop="administrativeLevel">
					<el-select v-model="ruleForm.administrativeLevel" placeholder="请选择" clearable>
						<el-option v-for="item in administrativeLevel_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="医院类型" prop="hospitalTypeCode">
					<el-select v-model="ruleForm.hospitalTypeCode" @change="data=>set_hospital_change(data,'hospital_type_list','hospitalType','hospitalTypeType')"
					 placeholder="请选择" clearable>
						<el-option v-for="item in hospital_type_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="经济类型" prop="hospitalEconomicCode">
					<el-select v-model="ruleForm.hospitalEconomicCode" @change="data=>set_hospital_change(data,'hEconomic_type_list','hospitalEconomic','hospitalEconomicType')"
					 placeholder="请选择" clearable>
						<el-option v-for="item in hEconomic_type_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区" prop="area">
					<area-cascader type="all" :level="1" :disabled="ruleForm.source===0" v-model="ruleForm.area" :data="pcaa"></area-cascader>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="ruleForm.address"></el-input>
				</el-form-item>
				<el-form-item label="联系人" prop="contactsName">
					<el-input v-model="ruleForm.contactsName" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="ruleForm.contactsNumber" maxlength="13"></el-input>
				</el-form-item>
				<el-form-item label="法人证书">
					<el-upload class :action="upUrl" accept="image/*" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="onexceed"
					 list-type="picture" :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,1)"
					 :on-remove="(file, fileList)=>onremove(file, fileList,2)" :file-list="corporateCertificate">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="营业执照">
					<el-upload class :action="upUrl" accept="image/*" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="onexceed"
					 list-type="picture" :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,2)"
					 :on-remove="(file, fileList)=>onremove(file, fileList,2)" :file-list="businessLicense">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="医院照片">
					<el-upload
					  :action="upUrl"
					  accept="image/*"
					  :before-upload="beforeAvatarUpload"
					  :limit="1"
					  :on-exceed="onexceed"
					  list-type="picture" 
					  :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,3)"
					  :on-remove="(file, fileList)=>onremove(file, fileList,3)"
					  :file-list="hospitalPicture">
					  <el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="医院简介">
					<el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.synopsis" maxlength="300" show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="success" @click="submitForm('ruleForm')" v-if="ruleForm.source!=0">确定</el-button>
				<el-button @click="cancle">取消</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import util from '@/lib/util'
	import upUrl from '@/lib/upUrl'
	import {
		pcaa
	} from "area-data";
	import {
		objFn
	} from '@/lib/public'
	import crumbs from '@/components/common/Crumbs'
	export default {
		created() {
			this.get_hospital_level()
			this.get_hospital_type()
			this.get_hospital_Economic_type()
			if (this.$route.params.row) {
				localStorage.setItem('hospitalRow', JSON.stringify(this.$route.params.row))
			}

			if (this.$route.params.id) {
				this.ruleForm = this.$route.params.row || JSON.parse(localStorage.getItem("hospitalRow"))
				if (this.ruleForm.corporateCertificate) {
					this.corporateCertificate.push({
						filePath: this.ruleForm.corporateCertificate,
						url: this.ruleForm.corporateCertificate
					})
				}
				if (this.ruleForm.businessLicense) {
					this.businessLicense.push({
						filePath: this.ruleForm.businessLicense,
						url: this.ruleForm.businessLicense
					})
				}
				if (this.ruleForm.hospitalPicture) {
					this.hospitalPicture.push({
						filePath: this.ruleForm.hospitalPicture,
						url: this.ruleForm.hospitalPicture
					})
				}
				this.ruleForm.area = [
					this.ruleForm.provinceId.substr(0, 6),
					this.ruleForm.cityId.substr(0, 6),
					this.ruleForm.areaId.substr(0, 6)
				]
				this.crumbs_msg = "医院详情"
			}
		},
		components: {
			crumbs
		},
		data() {
			return {
				administrativeLevel_list: [{
						value: "部",
						name: "部"
					},
					{
						value: "省",
						name: "省"
					},
					{
						value: "市",
						name: "市"
					},
					{
						value: "县",
						name: "县"
					},
				],
				pcaa,
				hEconomic_type_list: [],
				hospital_level_list: [],
				hospital_type_list: [],
				crumbs_msg: "新增医院",
				loading: false,
				up_docto_list: [],
				keshi_list: [],
				tow_list: [],
				signImgUrl: [],
				businessLicense: [],
				corporateCertificate: [],
				hospitalPicture: [],
				practiceList: [],
				detailDiagramList: [],
				upUrl, //图片上传地址
				qudao_list: [],
				weight_list: [],
				ruleForm: {
					hospitalName: "",
					hospitalGrade: "",
					hospitalGradeType: "",
					hospitalGradeCode: "",
					address: "",
					hospitalType: "",
					hospitalTypeCode: "",
					hospitalTypeType: "",
					hospitalEconomic: "",
					hospitalEconomicCode: "",
					hospitalEconomicType: "",
					contactsName: "",
					contactsNumber: "",
					synopsis: "",
					administrativeLevel: "",
					area: [],
					businessLicense: "",
					corporateCertificate: "",
					hospitalPicture: "",
					provinceId: "",
					cityId: "",
					areaId: "",
					cityName: "",
					areaName: ""
				},
				rules: {
					//验证规则
					// contactsNumber: [
					//   { required:false,message: '请输入手机号码', trigger: 'blur' },
					//   {            validator: (rule, value, callback) => {
					//       if (/^[1][0-9]{10}$/.test(value) == false) {
					//         callback(new Error("请输入正确的手机号"));
					//       } else {
					//         callback();
					//       }
					//     }, trigger: 'blur'          }
					// ],
					hospitalName: [{
							required: true,
							message: '请输入医院名称'
						},
						{
							pattern: /^[\u4E00-\u9FA5]+$/,
							message: '医院名称只能为中文'
						}

					],
					hospitalGradeCode: [{
						required: true,
						message: '请选择医院等级',
						trigger: 'change'
					}],
					administrativeLevel: [{
						required: true,
						message: '请选择行政级别',
						trigger: 'change'
					}],
					hospitalTypeCode: [{
						required: true,
						message: '请选择医院类型',
						trigger: 'change'
					}],
					area: [{
						required: true,
						message: '请选择地区',
						trigger: 'change'
					}],
					hospitalEconomicCode: [{
						required: true,
						message: '请选择经济类型',
						trigger: 'change'
					}]
				},
				classification_list: [],
				title_list: [{
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
					}
				], //职称
				level_list: [{
						value: 1,
						name: '医生助理'
					},
					{
						value: 0,
						name: '医生'
					},
				], //级别
			}
		},
		methods: {
			//   医生类型选择 赋值 医生级别选择 赋值 医院 经济类型 赋值
			set_hospital_change(id, name, v1, v2) {
				let index = this[name].findIndex((value, index, arr) => {
					return value.value == id
				})
				this.ruleForm[v1] = this[name][index].name
				this.ruleForm[v2] = this[name][index].type
			},
			//   查询医院 经济类型
			async get_hospital_Economic_type() {
				// DWA001002005
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001002007'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.hEconomic_type_list.push({
								value: i.code,
								name: i.displayName,
								type: i.type
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
			//   查询医院 等级
			async get_hospital_level() {
				// DWA001002005
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001002005'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.hospital_level_list.push({
								value: i.code,
								name: i.displayName,
								type: i.type
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
			//   查询医院 类型
			async get_hospital_type() {
				// DWA001002005
				let Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001002006'
						},
						body: {}
					}
				try {
					let res = await util.ajax.post(Url, params);
					console.log(res);
					if (res.data.respHead.respCode === "000") {
						res.data.body.data.forEach(i => {
							this.hospital_type_list.push({
								value: i.code,
								name: i.displayName,
								type: i.type
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
			cancle() {
				this.jumpRouterFun()
			},
			// 返回
			jumpRouterFun() {
				this.$router.push({
					name: 'hospital',
					query: {
						index: 'operateCenter'
					}
				})
			},
			// 提交
			submitForm(formName) {
				let self = this,
					Url = '',
					params = {
						reqHead: {
							'functionId': 'DWA001002003'
						},
						body: this.ruleForm
					}
				if (this.ruleForm.area.length > 0) {
					params.body.provinceId = `${Object.keys(this.ruleForm.area[0])}000000`
					params.body.cityId = `${Object.keys(this.ruleForm.area[1])}000000`
					params.body.areaId = `${Object.keys(this.ruleForm.area[2])}000000`
					params.body.provinceName = this.ruleForm.area[0][Object.keys(this.ruleForm.area[0])]
					params.body.cityName = this.ruleForm.area[1][Object.keys(this.ruleForm.area[1])]
					params.body.areaName = this.ruleForm.area[2][Object.keys(this.ruleForm.area[2])]
				}

				self.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(this.ruleForm);
						util.ajax.post(Url, params).then(res => {
							console.log(res);
							if (res.data.respHead.respCode == "000" && res.data.body.data == 1) {
								if (this.$route.params.type === 1) {
									self.$message.success('修改成功!')
								} else {
									self.$message.success('添加成功!')
								}
								this.$router.push({
									name: 'hospital'
								})
							} else {
								self.$message.error(`${res.data.respHead.respMsg}`)
							}
						}).
						catch(err => {
							self.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
						});
					} else {
						self.$message.error('请填写必填项!')
					}
				})

			},
			proving1() {},
			// 图片上传前拦截 判断文件类型
			beforeAvatarUpload(file) {
				let type = file.type
				if (type.indexOf('image/') === -1) {
					this.$message.error('只能上传图片!')
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 10
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!')
					return false
				}
			},
			//文件超出个数限制时的钩子
			onexceed(files, fileList) {
				this.$message.error('文件数量上限,请删除再上传！')
			},
			// 图片上传成功时的回调函数
			detailsuploadSuc(response, file, fileList, type) {
				if (response.respHead.respCode === '000') {
					if (type === 1) {
						this.corporateCertificate.push({
							filePath: file.response.body.obj.filePath,
							url: file.response.body.obj.filePath,
						})

						this.ruleForm.corporateCertificate = file.response.body.obj.filePath
					} else if (type === 2) {
						this.businessLicense.push({
							filePath: file.response.body.obj.filePath,
							url: file.response.body.obj.filePath,
						})
						this.ruleForm.businessLicense = file.response.body.obj.filePath
					}else if(type === 3){
						this.hospitalPicture.push({
							filePath: file.response.body.obj.filePath,
							url: file.response.body.obj.filePath,
						})
						this.ruleForm.hospitalPicture = file.response.body.obj.filePath
					}
				} else {
					this.$message.error(`${res.data.respHead.respMsg}`)
				}
			},
			// 	文件列表移除文件时的钩子
			onremove(file, fileList, type) {
				if (type === 1) {
					this.corporateCertificate = fileList
					this.ruleForm.corporateCertificate = ""
				} else if (type === 2) {
					this.businessLicense = fileList
					this.ruleForm.businessLicense = ''
				}else if(type === 3){
					this.hospitalPicture = fileList
					this.ruleForm.hospitalPicture = ''
				}
			},
		}
	}
</script>

<style lang="scss">
	.open_hospital_wrap {
		.demo-ruleForm {
			width: 500px;
		}

		.area-select {
			height: 40px;
		}

		.area-select .area-selected-trigger {
			padding: 0px 20px 0px 12px;
		}
	}
</style>
