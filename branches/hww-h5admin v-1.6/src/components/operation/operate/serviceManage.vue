<template>
	<div class="service-manage">
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>服务套餐管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<!--搜索-->
		<div class="search-wrap">
			<div class="search-box">
				<div class="search">
					<span class="Names">套餐名称:</span>
					<el-input v-model.trim="searchData.packageName" clearable placeholder="输入套餐名称"></el-input>
				</div>
				<div class="search">
					<span class="Names">创建时间:</span>
					<el-date-picker
				      v-model="searchData.createdAt"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</div>
				<div class="search price">
					<span class="Names">套餐价格:</span>
					<el-input v-model.number="searchData.packagePriceMin" clearable placeholder=""></el-input>
					--
					<el-input v-model.number="searchData.packagePriceMax" clearable placeholder=""></el-input>
				</div>
			</div>
			<div class="search-box">
				<div class="search">
					<span class="Names">有效期:</span>
					<el-date-picker
				      v-model="searchData.termValidity"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</div>
				<div class="search-btn">
					<span @click="searchConfirm">查询</span>
					<span @click="added">新增</span>
					<span @click="reset">重置查询条件</span>
				</div>
			</div>
		</div>
		<!--列表-->
		<div class="">
			<el-table :data='tableDada'>
				<el-table-column label="序号" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.$index + 1 }}</p>
					</template>
				</el-table-column>
				<el-table-column label="套餐名称" min-width="90">
					<template slot-scope="scope">
						<p>{{ scope.row.packageName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" min-width="120">
					<template slot-scope="scope">
						<p>{{ scope.row.createdAt | formatDateFilter}}</p>
					</template>
				</el-table-column>
				<el-table-column label="套餐价格" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.packagePrice | priceFilter}}</p>
					</template>
				</el-table-column>
				<el-table-column label="有效期" min-width="180">
					<template slot-scope="scope">
						<p v-if="scope.row.termValidityStatus==0">永久</p>
						<p v-else-if="scope.row.termValidityStatus==1">
							{{scope.row.termValidityBeginTime | formatDateFilter}}-
							{{scope.row.termValidityEndTime | formatDateFilter}}
						</p>
						<p v-else>{{scope.row.termValidityDuration}}天</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="80">
					<template slot-scope="scope">
						<span class="operation" @click="searchDetails(scope.row)">查看详情</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div class="list_page">
			<el-pagination background layout="prev, pager, next,total,jumper" :page-size="15" :current-page="num+1"
			 @current-change="pagechange" :total="total"></el-pagination>
		</div>
		
		<!--新增套餐-->
		<div class="add-service" v-if="addServiceFlag">
			<div class="add-title">
				<p>新增套餐</p>
				<p class="add-cancle" @click="cancleForm">×</p>
			</div>
			<div class="add-section">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
					<el-form-item prop="packageName">
						<div class="label">
							<span class="must">*</span>
							<span>套餐名称</span>
						</div>
					    <el-input v-model="ruleForm.packageName"></el-input>
					</el-form-item>
					<el-form-item prop="packageDescribe">
						<div class="label">
							<span class="must">*</span>
							<span>套餐介绍</span>
						</div>
					    <el-input type="textarea" v-model="ruleForm.packageDescribe"></el-input>
					</el-form-item>
					<el-form-item prop="packagePrice">
						<div class="label">
							<span class="must">*</span>
							<span>套餐价格</span>
						</div>
					    <el-input @blur='onBlur' v-model="ruleForm.packagePrice"></el-input>
					    元
					</el-form-item>
					<el-form-item prop="termValidityStatus">
						<div class="label">
							<span class="must">*</span>
							<span>有效期</span>
						</div>
						<div class="duration-choice">
							<div class="">
						    	<el-radio @change='choiceData(0)' v-model="ruleForm.termValidityStatus" :label="num0">永久</el-radio>
						    </div>
						    <div class="">
						    	<el-radio @change='choiceData(1)' v-model="ruleForm.termValidityStatus" :label="num1">指定时间</el-radio>
						    	<el-date-picker
						    	  :disabled='dateFlag'
							      v-model="ruleForm.timeList"
							      type="daterange"
							      range-separator="至"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期">
							    </el-date-picker>
						    </div>
	  						<div class="">
	  							<el-radio @change='choiceData(2)' v-model="ruleForm.termValidityStatus" :label="num2">指定时长</el-radio>
	  							<el-input :disabled='dayFlag' v-model.number="ruleForm.termValidityDuration" clearable placeholder=""></el-input>
	  							天
	  						</div>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="label">
							<el-checkbox v-model='ruleForm.isArea' @change='appointArea'>指定地区</el-checkbox>
						</div>
						<area-select 
							@change='changeArea'
							:disabled='areaFlag'
							v-if="cityshow"
							type='all'
							v-model="ruleForm.areaList" 
							:level='2' 
							disableLinkage='' 
							:data="pcaa"
						></area-select>
						<div class="label">
							<el-checkbox v-model='ruleForm.isHospital' @change='appointHospital'>指定医院</el-checkbox>
						</div>
						<el-select class='hospital-box' :disabled='hospitalFlag' v-model="ruleForm.hospitalId" @change='choiceHospital' clearable placeholder="请选择">
						    <el-option
						      v-for="item in hospitalList"
						      :key="item.id"
						      :label="item.hospitalName"
						      :value="item.id">
						    </el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="content">
						<div class="label">
							<span>服务内容</span>
						</div>
					    <div class="service-content" v-for="(item,index) in serviceList" style="margin-top: 20px;">
					    	<div class="item-box">
					    		<div class="box-left">
					    			<el-checkbox v-model="item.isChoose" @change='changeChoose' :class='{statusActive : item.status == 0,pidActive : item.pid == 0}'>{{item.serviceName}}</el-checkbox>
					    		</div>
					    		<div class="box-right">
					    			<el-radio :disabled='item.disabledState' @change='changeRadio(item)' v-if='item.status==1' v-model="item.serviceNumberState" label="1">次数</el-radio>
							    	<el-input :disabled='item.disabledState' @change='changeRadio(item)' v-if='item.status==1' v-model="item.number"></el-input>
							    	<el-radio :disabled='item.disabledState' @change='changeRadio(item)' v-if='item.status==1' v-model="item.serviceNumberState" label="2">不限次数</el-radio>
					    		</div>
					    	</div>
					    	
					    	<div class="second-level" v-for="(secondItem,secondIndex) in item.hwServiceConfigList">
					    		<div class="item-box">
					    			<div class="">
					    				<span>{{secondItem.serviceName}}</span>
					    			</div>
					    			<div class="box-right">
					    				<el-radio :disabled='item.disabledState' @change='changeRadio(secondItem)' v-if='secondItem.status==1' v-model="secondItem.serviceNumberState" label="1">次数</el-radio>
								    	<el-input :disabled='item.disabledState' @change='changeRadio(secondItem)' v-if='secondItem.status==1' v-model="secondItem.number"></el-input>
								    	<el-radio :disabled='item.disabledState' @change='changeRadio(secondItem)' v-if='secondItem.status==1' v-model="secondItem.serviceNumberState" label="2">不限次数</el-radio>
					    			</div>
					    		</div>
						    	<div class="third-level" v-for="(thirdItem,thirdIndex) in secondItem.hwServiceConfigList">
						    		<div class="item-box">
						    			<div class="">
						    				<span>{{thirdItem.serviceName}}</span>
						    			</div>
						    			<div class="box-right">
						    				<el-radio :disabled='item.disabledState' @change='changeRadio(thirdItem)' v-model="thirdItem.serviceNumberState" label="1">次数</el-radio>
									    	<el-input :disabled='item.disabledState' @change='changeRadio(thirdItem)' v-model="thirdItem.number"></el-input>
									    	<el-radio :disabled='item.disabledState' @change='changeRadio(thirdItem)' v-model="thirdItem.serviceNumberState" label="2">不限次数</el-radio>
						    			</div>
						    		</div>
						    	</div>
					    	</div>
					    </div>
					</el-form-item>
					
					<el-form-item class='btn'>
					    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
					    <el-button @click="cancleForm">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import config from "@/lib/global";
	import { pcaa } from "area-data";
	import crumbs from '@/components/common/Crumbs'
	import searchBox from '@/components/common/searchBox'
	import {
		formatSecond, formatDate, formatDay
	} from '@/lib/time'
	
	export default {
		components: {
			crumbs,
			searchBox
		},
		data(){
			return {
				num0: 0,
				num1: 1,
				num2: 2,
				addServiceFlag: false,
				cityshow: true,
				areaFlag: true,
				hospitalFlag: true,
				hospitalList: [],
				value: '',
				linkFlag: false,
				pcaa,
				selected: [],
				checked: false,
				radio: '',
				total: 0,
				num: 0,
				searchData: {
					packageName: '',
					createdAt: [],
					packagePriceMax: '',
					packagePriceMin: '',
					termValidity: []
				},
				tableDada: [],
				ruleForm: {
					packageName: '',
					packageDescribe: '',
					packagePrice: '',
					termValidityStatus: '',
					timeList: [],
					termValidityBeginTime: '',
					termValidityEndTime: '',
					termValidityDuration: '',
					hospital: '',
					hospitalId: '',
					number: 0,
					content: '',
					servicePackageDetailsMessageList: [],
					areaList: [],
					isArea: false,
					isHospital: false,
					province: '',
					provinceId: '',
					city: '',
					cityId: '',
					area: '',
					areaId: ''
				},
				dateFlag: true,
				dayFlag: true,
				rules: {
					packageName: [
			            { required: true, message: '请输入套餐名称', trigger: 'blur' },
			            { max: 20, message: '最大不能超过20个字符', trigger: 'blur' }
			        ],
			        packageDescribe: [
			            { required: true, message: '请输入套餐介绍', trigger: 'blur' },
			            { max: 500, message: '最大不能超过500个字符', trigger: 'blur' }
			        ],
			        packagePrice: [
			            { required: true, message: '请输入套餐价格', trigger: 'blur' }
			        ],
			        termValidityStatus: [
			            { required: true, message: '请选择有效期', trigger: 'blur' }
			        ],
				},
				serviceList: []
			}
		},
		created(){
			this.obtainData(0)
			this.obtainService()
			//回车事件
			document.onkeydown=e=>{
				let _key=window.event.keyCode;
				if(_key===13){
					this.searchConfirm()
				}
			}
		},
		methods: {
			onBlur(){
				let packagePrice = Number(this.ruleForm.packagePrice)
				this.ruleForm.packagePrice = packagePrice.toFixed(2)
				
			},
			// 获取数据列表
			obtainData(page){
				let self = this
				let Url = ''
				
				let packagePriceMax = ''
				let packagePriceMin = ''
				if (this.searchData.packagePriceMax == '' && this.searchData.packagePriceMin != '') {
					packagePriceMax = ''
					packagePriceMin = this.searchData.packagePriceMin * 100
				}else if (this.searchData.packagePriceMax != '' && this.searchData.packagePriceMin == '') {
					packagePriceMax = this.searchData.packagePriceMax * 100
					packagePriceMin = ''
				}else if (this.searchData.packagePriceMax != '' && this.searchData.packagePriceMin != '') {
					packagePriceMax = Number(this.searchData.packagePriceMax) *100
					packagePriceMin = Number(this.searchData.packagePriceMin) *100
					if (this.searchData.packagePriceMin > this.searchData.packagePriceMax) {
						this.$message({
							type: 'error',
							message: '最小套餐价格不可大于最大套餐价格！'
						})
						return
					}
				}else{
					packagePriceMax = ''
					packagePriceMin = ''
				}
				
				let beginTime = formatSecond(this.searchData.createdAt[0])
				let endTime = formatSecond(this.searchData.createdAt[1])
				let termValidityMin = formatSecond(this.searchData.termValidity[0])
				let termValidityMax = formatSecond(this.searchData.termValidity[1])
				let params = {
					"reqHead": {
						'functionId': 'DWA001015001'
					},
					"body": {
						'packageName': this.searchData.packageName,
						'beginTime': beginTime,
						'endTime': endTime,
						'packagePriceMax': packagePriceMax,
						'packagePriceMin': packagePriceMin,
						'termValidityMin': termValidityMin,
						'termValidityMax': termValidityMax,
						'pageNum': page,
						'pageSize': 15
					}
				}
				util.ajax.post(Url,params).then(function(res){
					//console.log(res)
					self.tableDada = res.data.body.data.datas
					self.total = res.data.body.data.total
				}).catch(function(err){
					console.log(err)
				})
			},
			//查看详情
			searchDetails(row){
				this.$router.push({
					name: 'serviceDetails',
					params: {row: row}
				})
			},
			// 点击查询按钮
			searchConfirm(){
				this.obtainData(0)
			},
			// 分页操作
			pagechange(num) {
				this.num = num -1
				this.obtainData(num -1)
			},
			// 重置查询条件
			reset(){
				this.searchData.packageName = ''
				this.searchData.createdAt = []
				this.searchData.packagePriceMax = ''
				this.searchData.packagePriceMin = ''
				this.searchData.termValidity = []
			},
			// 新增初始化
			addInit(){
					this.ruleForm.packageName = ''
					this.ruleForm.packageDescribe = ''
					this.ruleForm.packagePrice = ''
					this.ruleForm.termValidityStatus = ''
					this.ruleForm.timeList = []
					this.ruleForm.termValidityBeginTime = ''
					this.ruleForm.termValidityEndTime = ''
					this.ruleForm.termValidityDuration = ''
					this.ruleForm.hospital = ''
					this.ruleForm.hospitalId = ''
					this.ruleForm.number = 0
					this.ruleForm.content = ''
					this.ruleForm.servicePackageDetailsMessageList = []
					this.ruleForm.areaList = []
					this.ruleForm.isArea = false
					this.ruleForm.isHospital = false
					this.ruleForm.province = ''
					this.ruleForm.provinceId = ''
					this.ruleForm.city = ''
					this.ruleForm.cityId = ''
					this.ruleForm.area = ''
					this.ruleForm.areaId = ''
					this.hospitalList = [],
					this.hospitalFlag = true,
					this.areaFlag = true
					this.dateFlag = true
					this.dayFlag = true
			},
			// 新增
			added(){
				this.addServiceFlag = true
			},
			// 取消
			cancleForm(){
				this.addServiceFlag = false
				this.addInit()
			},
			// 获取添加服务数据
			obtainService(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001015002'
					},
					"body": {
						'id': ''
					}
				}
				util.ajax.post(Url,params).then(function(res){
					//console.log(res)
					self.serviceList = res.data.body.data.serviceConfigList
					self.serviceList.map(function(item){
						if(item.isChoose==0 || item.isChoose==false){
							item.disabledState = true
//							item.isInfiniteNumber = false
							item.number = 0
						}else{
							item.disabledState = false
						}
					})
					
				}).catch(function(err){
					console.log(err)
				})
			},
			// 修改选择
			changeChoose(){
				this.serviceList.map(function(item){
					if(item.isChoose==0 || item.isChoose==false){
							item.disabledState = true
//							item.isInfiniteNumber = false
							item.number = 0
							item.hwServiceConfigList.map(function(items){
//								items.isInfiniteNumber = false
								items.number = 0
								items.hwServiceConfigList.map(itemss =>{
//									itemss.isInfiniteNumber = false
									itemss.number = 0
								})
							})
						}else{
							item.disabledState = false
						}
				})
			},
			// 修改选项
			changeRadio(item){
				let obj = {}
				if (item.serviceNumberState == '1') {
					obj.serviceConfigId = item.id
					obj.number = item.number
					if (item.number == '') {
						item.number = 0
					}
					let ids = ''
					this.ruleForm.servicePackageDetailsMessageList.map((items,index) => {
						ids = items.serviceConfigId
						if (ids == item.id) {
							this.ruleForm.servicePackageDetailsMessageList.splice(index,1)
						}
					}) 
					if (obj.number != 0) {
						this.ruleForm.servicePackageDetailsMessageList.push(obj)
					}
				}else if (item.serviceNumberState == '2') {
					obj.serviceConfigId = item.id
					obj.number = -1
					item.number = ''
					let ids = ''
					this.ruleForm.servicePackageDetailsMessageList.map((items,index) => {
						ids = items.serviceConfigId
						if (ids == item.id) {
							this.ruleForm.servicePackageDetailsMessageList.splice(index,1)
						}
					}) 
					this.ruleForm.servicePackageDetailsMessageList.push(obj)
				}else{
					return
				}
			},
			// 选择有效期
			choiceData(type){
				if (type == 1) {
					this.dateFlag = false
					this.dayFlag = true
					this.ruleForm.termValidityDuration = 0
				}else if (type == 2) {
					this.dateFlag = true
					this.dayFlag = false
					this.ruleForm.timeList = []
				}else{
					this.dateFlag = true
					this.dayFlag = true
					this.ruleForm.timeList = []
					this.ruleForm.termValidityDuration = 0
				}
			},
			// 指定地区
			appointArea(){
				if (this.ruleForm.isArea == false) {
					let self = this
					this.cityshow = false
					this.ruleForm.areaList = []
					this.ruleForm.provinceId = ''
					this.ruleForm.province = ''
					this.ruleForm.cityId = ''
					this.ruleForm.city = ''
					this.ruleForm.areaId = ''
					this.ruleForm.area = ''
					setTimeout(function(){
						self.cityshow = true
					})
					this.areaFlag = true
				}else{
					this.areaFlag = false
				}
				
				
				
				
			},
			changeArea(){
				this.appointHospital()
				this.hospitalList = []
				this.ruleForm.hospitalId = ''
				this.ruleForm.hospital = ''
			},
			// 选择是否指定医院
			appointHospital(){
				if (this.ruleForm.isHospital == false) {
					this.hospitalFlag = true
					this.hospitalList = []
					this.ruleForm.hospitalId = ''
					this.ruleForm.hospital = ''
				}else{
					this.hospitalFlag = false
				}
				
				
				if (this.ruleForm.isArea == true) {
					if (this.ruleForm.areaList.length == 0) {
						alert('请选择指定地区！')
						return
					}else{
						this.ruleForm.provinceId = `${Object.keys(this.ruleForm.areaList[0])}000000`
						if(Object.keys(this.ruleForm.areaList[1]) != ''){
							this.ruleForm.cityId = `${Object.keys(this.ruleForm.areaList[1])}000000`
						}else{
							this.ruleForm.cityId = ''
						}
				        if(Object.keys(this.ruleForm.areaList[2]) != ''){
				        	this.ruleForm.areaId = `${Object.keys(this.ruleForm.areaList[2])}000000`
				        }else{
				        	this.ruleForm.areaId = ''
				        }
				        this.ruleForm.province = this.ruleForm.areaList[0][Object.keys(this.ruleForm.areaList[0])]
				        this.ruleForm.city = this.ruleForm.areaList[1][Object.keys(this.ruleForm.areaList[1])]
				        this.ruleForm.area = this.ruleForm.areaList[2][Object.keys(this.ruleForm.areaList[2])]
					}
				}
				
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001002001'
					},
					"body": {
						'pageSize': 10000,
						'pageNum': 0,
						'provinceName': this.ruleForm.province,
						'provinceId': this.ruleForm.provinceId,
						'cityName': this.ruleForm.city,
						'cityId': this.ruleForm.cityId,
						'areaName': this.ruleForm.area,
						'areaId': this.ruleForm.areaId
					}
				}
				util.ajax.post(Url,params).then(function(res){
					//console.log(res)
					self.hospitalList = res.data.body.data.datas
				}).catch(function(err){
					console.log(err)
				})
		        
			},
			// 改变选择医院
			choiceHospital(val){
				let obj = {};
			  	obj = this.hospitalList.find((item)=>{
			     	return item.id === val;
			  	});
			  	this.ruleForm.hospital = obj.hospitalName;
			},
			
			// 添加确定
			submitForm(formName){
				let isArea = ''
				let isHospital = ''
				if (this.ruleForm.isArea == true) {
					isArea = 1
					if (this.ruleForm.provinceId == '') {
						alert('请选择地区！')
						return
					}
				}else{
					isArea = 0
				}
				if (this.ruleForm.isHospital == true) {
					isHospital = 1
					if (this.ruleForm.hospitalId == '') {
						alert('请选择指定医院！')
						return
					}
				}else{
					isHospital = 0
				}
				if (this.ruleForm.termValidityStatus == 1 && this.ruleForm.timeList.length == 0) {
					alert('请选择指定时间！')
					return
				}
				if (this.ruleForm.termValidityStatus == 2 && this.ruleForm.termValidityDuration == 0) {
					alert('请填写指定时长！')
					return
				}
				let termValidityBeginTime = ''
				let termValidityEndTime = ''
				if (this.ruleForm.timeList.length != 0) {
					termValidityBeginTime = formatSecond(this.ruleForm.timeList[0])
					termValidityEndTime = formatDay(this.ruleForm.timeList[1]) + ' ' + '23:59:59'
				}
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001015003'
					},
					"body": {
						'packageName': this.ruleForm.packageName,
						'packageDescribe': this.ruleForm.packageDescribe,
						'packagePrice': this.ruleForm.packagePrice * 100,
						'servicePackageDetailsMessageList': this.ruleForm.servicePackageDetailsMessageList,
						'termValidityBeginTime': termValidityBeginTime,
						'termValidityDuration': this.ruleForm.termValidityDuration,
						'termValidityEndTime': termValidityEndTime,
						'termValidityStatus': this.ruleForm.termValidityStatus,
						'province': this.ruleForm.province,
						'provinceId': this.ruleForm.provinceId,
						'city': this.ruleForm.city,
						'cityId': this.ruleForm.cityId,
						'area': this.ruleForm.area,
						'areaId': this.ruleForm.areaId,
						'hospital': this.ruleForm.hospital,
						'hospitalId': this.ruleForm.hospitalId,
						'isArea': isArea,
						'isHospital': isHospital,
					}
				}
				
				self.$refs[formName].validate((valid) => {
					if (valid) {
						util.ajax.post(Url, params).then(res => {
							//console.log(res);
							if (res.data.respHead.respCode == "000") {
									self.$message.success('添加成功!')
									self.addInit()
									self.addServiceFlag = false
									self.obtainData(0)
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
		},
		filters: {
			formatDateFilter(val){
				return formatDate(val)
			},
			priceFilter(val){
				return val/100
			}
		}
	}
</script>

<style lang="scss">
	.service-manage {
		/*position: absolute;*/
		.search-box{
			display: flex;
			font-size: 14px;
			margin-bottom: 16px;
			.el-date-editor .el-range__icon{
				line-height: 22px;
			}
			.el-date-editor .el-range-separator{
				line-height: 22px;
			}
			.el-date-editor .el-range__close-icon{
				line-height: 22px;
			}
			.price{
				.el-input{
					width: 80px;
				}
			}
		}
		.el-input{
			width: 140px;
		}
		.el-input__inner{
			height: 30px !important;
			line-height: 30px;
		}
		.search{
			min-width: 200px;
			margin-right: 20px;
		}
		.search-btn{
			height: 28px;
			line-height: 28px;
			span{
				display: inline-block;
				color: #FFFFFF;
				background: #409EFF;
				padding: 0 8px;
				margin-left: 6px;
				cursor: pointer;
			}
		}

		.operation {
			color: #409EFF;
			cursor: pointer;
		}
		.el-pagination__editor.el-input .el-input__inner{
			width: 60px;
		}
		
		
		.add-service{
			width: 600px;
			/*height: 1680px;*/
			position: absolute;
			top: 200px;
			left: 0;
			right: 0;
			margin: auto;
			background: #FFFFFF;
			border: 2px solid #CCCCCC;
			
			.must{
				color: red;
			}
			.label{
				display: inline-block;
				width: 90px;
				margin-left: 12px;
				vertical-align: top;
			}
			.el-textarea{
				width: 450px;
			}
			.duration-choice{
				display: inline-block;
			}
			.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
				width: 260px;
			}
			.el-date-editor .el-range__icon{
				line-height: 23px;
			}
			.el-date-editor .el-range-separator{
				line-height: 23px;
			}
			.el-date-editor .el-range__close-icon{
				line-height: 23px;
			}
			.service-content{
				.el-radio{
					margin-right: 10px;
				}
				.el-input{
					width: 80px;
					margin-right: 30px;
				}
			}
			.statusActive{
				
			}
			.pidActive{
				font-weight: bold;
			}
			.second-level{
				margin-left: 40px;
			}
			.third-level{
				margin-left: 40px;
			}
			.item-box{
				display: flex;
				justify-content: space-between;
			}
			.box-left{
				margin-left: 20px;
			}
			.box-right{
				margin-right: 50px;
			}
			.medium{
				width: 120px;
				height: 28px;
				line-height: 28px;
			}
			.area-select .area-selected-trigger{
				padding: 0 10px;
			}
			.area-selected-trigger{
				height: 28px;
				line-height: 28px;
			}
			.area-select-wrap{
				line-height: 40px;
				display: inline-block;
			}
			.el-select{
				margin-left: 10px;
			}
			.hospital-box{
				.el-input{
					width: 394px;
				}
			}
			.btn{
				text-align: right;
				border-top: 1px solid lightgray;
				padding-top: 14px;
				padding-right: 20px;
			}
			
		}
		.add-title{
			display: flex;
			justify-content: space-between;
			color: #FFFFFF;
			background: #999999;
			margin: 4px;
			p{
				padding: 4px 8px;
				vertical-align: middle;
				line-height: 32px;
			}
			.add-cancle{
				font-size: 28px;
				cursor: pointer;
			}
			
		}
	}
</style>