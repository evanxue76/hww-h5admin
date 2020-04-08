<template>
	<div class="measure_wrap">
		<crumbs>
	      <div class slot="crumbs">
	        <el-breadcrumb separator=">">
	          <el-breadcrumb-item>报表中心</el-breadcrumb-item>
	          <el-breadcrumb-item>测量记录查询</el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </crumbs>
	    <searchBox>
	      <template slot="searchBox">
	        <div class="seek_line search_box">
	          <div class>
	            <span class="Names">账号:</span>
	            <el-input v-model.trim="searchData.phone" clearable placeholder="输入账号"></el-input>
	          </div>
	          <div class>
	            <span class="Names">姓名:</span>
	            <el-input v-model.trim="searchData.name" clearable placeholder="输入姓名"></el-input>
	          </div>
	          <div class>
	            <span class="Names">性别:</span>
	            <el-select class='' v-model="searchData.sex" clearable>
	              <el-option
	                v-for="item in sex_list"
	                :key="item.value"
	                :label="item.name"
	                :value="item.value"
	              ></el-option>
	            </el-select>
	          </div>
	          <div class>
	            <span class="Names">年龄:</span>
	            <el-input v-model.trim="searchData.age" clearable placeholder="输入年龄"></el-input>
	          </div>
	          <div class>
	            <span class="Names">测量模式:</span>
	            <el-select v-model="searchData.type" clearable>
	              <el-option
	                v-for="item in pattern_list"
	                :key="item.value"
	                :label="item.name"
	                :value="item.value"
	              ></el-option>
	            </el-select>
	          </div>
	          <div class>
	            <span class="Names">SN:</span>
	            <el-input v-model.trim="searchData.deviceSn" clearable placeholder="输入SN"></el-input>
	          </div>
	        </div>
	        <div class="end-3 search_box">
	          <div class>
	            <span class="Names">地区:</span>
	            <area-cascader
	              v-if="is.area"
	              type="all"
	              :level="1"
	              v-model="searchData.area"
	              @change="area_fun"
	              :data="pcaa"
	            ></area-cascader>
	          </div>
	          <div class='measure'>
			    <span class="Names">测量时间</span>
			    <el-date-picker
			      v-model="searchData.measureDate"
			      type="daterange"
			      :clearable=false
			      @change='dateChange'
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			  </div>
			  <div class="duration">
			  	<span class="Names">测量时长</span>
			  	<el-input v-model.trim="searchData.length" clearable placeholder="开始"></el-input> -
			  	<el-input v-model.trim="searchData.lengthOver" clearable placeholder="结束"></el-input> 
			  	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			  	<el-select class='' v-model="searchData.timeType" clearable>
	              <el-option
	                v-for="item in durationType_list"
	                :key="item.value"
	                :label="item.name"
	                :value="item.value"
	              ></el-option>
	            </el-select>
			  </div>
			  <div class='measure_result'>
	            <span class="Names">测量结果:</span>
	            <el-input v-model.trim="searchData.resultBrief" clearable placeholder="输入测量结果"></el-input>
	          </div>
	          <div></div>
	        </div>
	        <div class="measure_btn">
	        	<el-button type="primary" @click='searchList'>查询</el-button>
	        	<el-button @click='resetData'>重置查询条件</el-button>
	        	<el-button type="primary" @click='exports'>导出查询结果</el-button>
	        	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	        	<el-button type="primary" @click='selectionDownload'>下载选中的心电图</el-button>
	        	<el-button type="primary" @click='searchDownload'>下载查询的心电图</el-button>
	        </div>
	      </template>
	    </searchBox>
	    
	    <div class="form_box">
	    	<el-table :data='tableData' @selection-change="handleSelectionChange">
	    		<el-table-column
			      type="selection"
			      width="30">
			    </el-table-column>
	    		<el-table-column label="序号" min-width="50">
		          <template slot-scope="scope">
		            <p>{{scope.$index+1+page.serialnumber}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label='账号' min-width="70">
		        	<template slot-scope="scope">
			            <p>{{scope.row.mobile}}</p>
			        </template>
		        </el-table-column>
		        <el-table-column label="姓名" min-width="60">
		          <template slot-scope="scope">
		            <p>{{scope.row.name}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="年龄" min-width="40">
		          <template slot-scope="scope">
		            <p>{{scope.row.age}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="性别" min-width="30">
		          <template slot-scope="scope">
		            <p>{{scope.row.sex | sexFilter}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="所在地区" min-width="110">
		          <template slot-scope="scope">
		            <p>{{scope.row.city_name}}{{scope.row.area_name}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="SN" min-width="100">
		          <template slot-scope="scope">
		            <p>{{scope.row.device_sn}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="测量模式" min-width="80">
		          <template slot-scope="scope">
		            <p>{{scope.row.type | typeFilter}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="测量时间" min-width="105">
		          <template slot-scope="scope">
		            <p>{{scope.row.take_time | timeFilter}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="测量时长" min-width="80">
		          <template slot-scope="scope">
		            <p>{{scope.row.length | durationFilter}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="测量结果" min-width="100">
		          <template slot-scope="scope">
		            <p>{{scope.row.ecg_result_brief}}</p>
		          </template>
		        </el-table-column>
		        <el-table-column label="操作" min-width="120">
		          <template slot-scope="scope">
		            <p @click="checkHeart(scope.row,scope.$index)" class="search_heart">查看心电</p>
		            &nbsp;&nbsp;
		            <p v-if="scope.row.hly_path" @click="downHly(scope.row)" class="search_heart">
		            	<a :href="scope.row.hly_path">hly</a>
		            	
		            </p>
		          </template>
		        </el-table-column>
	    	</el-table>
	    </div>
	    <div class="list_page">
	      <el-pagination
	        background
	        layout="prev, pager, next,total,jumper"
	        :page-size="page.size"
	        @current-change="pagechange"
	        :total="page.total"
			:current-page="page.num+1"
	      ></el-pagination>
	    </div>
	    
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import crumbs from '@/components/common/Crumbs'
	import { formatDay, formatDate, formatSecond } from '@/lib/time'
	import {regAge,heigAge} from '@/lib/regular'
	import searchBox from '@/components/common/searchBox'
	import { pcaa } from "area-data";
	import config from "@/lib/global";
	export default{
		components: {
		    crumbs,searchBox
		},
		data(){
			return {
				flag: true,
				choiceFlag: true,
				exportsFlag: true,
				ids: '',
				is: {
			        area: true
			    },
				pcaa,
				tableData: [],
				searchData: {
					phone: '',
					name: '',
					sex: '',
					age: '',
					type: '',
					deviceSn: '',
					area: '',
					provinceId: "",
			        cityId: "",
			        areaId: "",
			        provinceName: "",
			        cityName: "",
			        areaName: "",
			        measureDate: [],
			        takeTimeCopy: '',
			        takeTimeOver: '',
			        length: '',
			        lengthOver: '',
			        timeType: 0,
			        resultBrief: ''
				},
				sex_list: [
			        {
			          value: '',
			          name: "全部"
			        },
			        {
			          value: 0,
			          name: "男"
			        },
			        {
			          value: 1,
			          name: "女"
			        }
			    ],
			    pattern_list: [{
			    	value: '',
			    	name: '全部'
			    },{
			    	value: 0,
			    	name: '快速测量'
			    },{
			    	value: 1,
			    	name: '动态监测'
			    },{
			    	value: 2,
			    	name: '睡眠监测'
			    },{
			    	value: 3,
			    	name: '运动监测'
			    },{
			    	value: 5,
			    	name: '24小时测量'
			    },{
			    	value: 6,
			    	name: '藏血测量'
			    }],
			    durationType_list: [{
			    	value: 0,
			    	name: '分钟'
			    },{
			    	value: 1,
			    	name: '小时'
			    }],
			    durationResult_list: [{
			    	value: 0,
			    	name: '全部'
			    },{
			    	value: 1,
			    	name: '未见异常'
			    },{
			    	value: 2,
			    	name: '疑似异常'
			    }],
				page: {
			        total: 0,
			        size: 15,
			        num: 0,
			        serialnumber: 0,
			        nums: 1
			   },
			   paramData: {}
			}
		},
		created(){
			var date = new Date().getTime()
			this.searchData.measureDate = [date - 63072000000,date]
			
			if (JSON.stringify(this.$route.params) == '{}') {
				this.obtainList(0)
				return
			}else{
				this.searchData = this.$route.params.searchData
				this.page = this.$route.params.pages
				let num = this.page.num
				this.obtainList(num)
			}
			
			
			
		},
		methods: {
			// 获取列表
			obtainList(page){
				if (this.searchData.measureDate == null) {
		    		this.searchData.takeTimeCopy = ''
		    		this.searchData.takeTimeOver = ''
		    		return
		    	}else{
		    		this.searchData.takeTimeCopy = formatDay(this.searchData.measureDate[0]) + ' ' + '00:00:00'
		    		this.searchData.takeTimeOver = formatDay(this.searchData.measureDate[1]) + ' ' + '23:59:59'
		    	}
				let age = regAge(this.searchData.age)
				if (age === false) {
					this.$message('请填写正确的年龄！')
					return
				}
				let length = heigAge(this.searchData.length)
				let lengthOver = heigAge(this.searchData.lengthOver)
				if (length === false || lengthOver === false) {
					this.$message('请填写正确的测量时长！')
					return
				}
				if (lengthOver-0 < length-0) {
					this.$message('结束时间必须大于开始时间！')
					return
				}
				let self = this
				let Url = ''
				this.paramData = {
						phone: this.searchData.phone,
						name: this.searchData.name,
						sex: this.searchData.sex,
						age: age,
						type: this.searchData.type,
						deviceSn: this.searchData.deviceSn,
						area: this.searchData.areaName,
				        city: this.searchData.cityName,
				        takeTimeCopy: this.searchData.takeTimeCopy,
				        takeTimeOver: this.searchData.takeTimeOver,
				        length: length,
				        lengthOver: lengthOver,
				        timeType: this.searchData.timeType,
				        resultBrief: this.searchData.resultBrief,
						pageNum: page,
						pageSize: 15
					}
				let params = {
					"reqHead": {
						'functionId': 'DWA001011001'
					},
					"body": this.paramData
				}
				util.ajax.post(Url,params).then(function(res){
					self.page.total = res.data.body.data.total
					self.page.num = res.data.body.data.pageNum
					self.page.nums = self.page.num + 1
					self.tableData = res.data.body.data.datas
					
				}).catch(function(err){
					console.log(err)
				})
			},
			// 地区选择
		    area_fun(val) {
		      this.searchData.provinceId = `${Object.keys(this.searchData.area[0])}000000`
		      this.searchData.cityId = `${Object.keys(this.searchData.area[1])}000000`
		      this.searchData.areaId = `${Object.keys(this.searchData.area[2])}000000`
		      this.searchData.provinceName = this.searchData.area[0][Object.keys(this.searchData.area[0])]
		      this.searchData.cityName = this.searchData.area[1][Object.keys(this.searchData.area[1])]
		      this.searchData.areaName = this.searchData.area[2][Object.keys(this.searchData.area[2])]
		    },
		    // 日期选择
		    dateChange(){
		    	if (this.searchData.measureDate == null) {
		    		this.searchData.takeTimeCopy = ''
		    		this.searchData.takeTimeOver = ''
		    		return
		    	}else{
		    		this.searchData.takeTimeCopy = formatDay(this.searchData.measureDate[0]) + ' ' + '00:00:00'
		    		this.searchData.takeTimeOver = formatDay(this.searchData.measureDate[1]) + ' ' + '23:59:59'
		    	}
		    },
		    //查询
		    searchList(){
		    	
		    	this.obtainList(0)
		    	this.page.num = 0
		    },
		    // 重置
		    resetData(){
		    	var date = new Date().getTime()
//			this.searchData.measureDate = [date - 2592000000,date]
		    	this.is.area = false
		    	this.searchData = {
					phone: '',
					name: '',
					sex: '',
					age: '',
					type: '',
					deviceSn: '',
					area: '',
					provinceId: "",
			        cityId: "",
			        areaId: "",
			        provinceName: "",
			        cityName: "",
			        areaName: "",
			        measureDate: [date - 63072000000,date],
			        takeTimeCopy: '',
			        takeTimeOver: '',
			        length: '',
			        lengthOver: '',
			        timeType: 0,
			        resultBrief: ''
				}
		    	this.$nextTick(() => {
			        this.is.area = true
			    })
		    },
		    // 导出查询结果
		   async exports(){
		    	let self = this
		    	if (this.exportsFlag == true) {
		    		this.exportsFlag = false
		    		this.$message({
		    			message: '数据开始导出，请勿重复点击！',
		    			type: 'success'
		    		})
		    		let Url = config.developmentUrl.host1 + "exportExcel";
					let params = {
							phone: this.searchData.phone,
							name: this.searchData.name,
							sex: this.searchData.sex,
							age: this.searchData.age,
							type: this.searchData.type,
							deviceSn: this.searchData.deviceSn,
							area: this.searchData.areaName,
					        city: this.searchData.cityName,
					        takeTimeCopy: this.searchData.takeTimeCopy,
					        takeTimeOver: this.searchData.takeTimeOver,
					        length: this.searchData.length,
					        lengthOver: this.searchData.lengthOver,
					        timeType: this.searchData.timeType,
					        resultBrief: this.searchData.resultBrief,
						}
					let res = await axios({
				        url: Url,
				        method: 'post',
				        data: params,
				        responseType: "blob"
				      })
					try{
						if (res.data.size > 0) {
							setTimeout(function(){
								self.exportsFlag = true
							},3000)
							let url = window.URL.createObjectURL(new Blob([res.data]));
							let link = document.createElement('a')
							link.style.display = 'none';
							link.href = url;
							link.setAttribute('download',`${formatSecond(new Date().getTime())}.xls`);
							document.body.appendChild(link);
	          				link.click();
						}else{
							this.$message.error(`${res.data.respHead.respMsg}`)
						}
					}catch(e){
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					}
		    	}else{
		    		this.$message({
		    			message: '数据正在导出，不可重复导出！',
		    			type: 'warning'
		    		})
		    	}
		    	
				
		    },
		    //  下载选择
		    handleSelectionChange(val){
		    	let id = ''
		    	val.map(item => {
		    		id += item.id + ','
		    	})
		    	id = id.substr(0,id.length - 1);
		    	this.ids = id
		    	console.log(this.ids)
		    },
		    //  下载选中
		    async selectionDownload(){
		    	let self = this
		    	if (this.ids.length == 0) {
						this.$message({
							message: '请选择要下载的心电图！',
							type: 'warning'
						})
						return
					}
		    	if (this.choiceFlag == true) {
		    		this.choiceFlag = false
		    		this.$message({
							message: '心电图开始下载，请勿重复点击！',
							type: 'success'
						})
					let Url = config.developmentUrl.host1 + "downSomeReport";
					let params = {
							'ids': this.ids
						}
					let res = await axios({
				        url: Url,
				        method: 'post',
				        data: params,
				        responseType: "blob"
				      })
					try{
						if (res.data.size > 0) {
							setTimeout(function(){
								self.choiceFlag = true
							},3000)
							let url = window.URL.createObjectURL(new Blob([res.data]));
							let link = document.createElement('a')
							link.style.display = 'none';
							link.href = url;
							link.setAttribute('download',`${formatSecond(new Date().getTime())}.zip`);
							document.body.appendChild(link);
	          				link.click();
						}else{
							this.$message.error(`${res.data.respHead.respMsg}`)
						}
					}catch(e){
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					}
		    	}else{
		    		this.$message({
							message: '心电图正在下载，不可重复下载！',
							type: 'warning'
						})
		    	}
		    },
		    // 下载查询
		    async searchDownload(){
		    	if (this.flag == true) {
		    		this.flag = false
		    		this.$message({
		    			message: '数据开始下载，请勿重复点击！',
		    			type: 'success'
		    		})
			    	let self = this
					let Url = config.developmentUrl.host1 + "downAllReportByExample";
					let params = {
							phone: this.searchData.phone,
							name: this.searchData.name,
							sex: this.searchData.sex,
							age: this.searchData.age,
							type: this.searchData.type,
							deviceSn: this.searchData.deviceSn,
							area: this.searchData.areaName,
					        city: this.searchData.cityName,
					        takeTimeCopy: this.searchData.takeTimeCopy,
					        takeTimeOver: this.searchData.takeTimeOver,
					        length: this.searchData.length,
					        lengthOver: this.searchData.lengthOver,
					        timeType: this.searchData.timeType,
					        resultBrief: this.searchData.resultBrief,
						}
					console.log(params)
					let res = await axios({
				        url: Url,
				        method: 'post',
				        data: params,
				        responseType: "blob"
				      })
					console.log(res)
					try{
						if (res.data.size > 0) {
							this.flag = true
							let url = window.URL.createObjectURL(new Blob([res.data]));
							let link = document.createElement('a')
							link.style.display = 'none';
							link.href = url;
							link.setAttribute('download',`${formatSecond(new Date().getTime())}.zip`);
							document.body.appendChild(link);
	          				link.click();
	          				this.$message({
				    			message: '下载成功',
				    			type: 'success'
				    		})
						}else{
							this.$message.error(`${res.data.respHead.respMsg}`)
						}
					}catch(e){
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
					}
		    	}else{
		    		this.$message({
		    			message: '数据正在下载，不可重复下载！',
		    			type: 'warning'
		    		})
		    	}
		    	
		    },
		    //  查看心电
		    checkHeart(row,index){
		    	let searchData = this.searchData
		    	let page = this.page
		    	let pageNum = index + page.num*15
		    	console.log(page)
		    	this.$router.push({
		    		name: 'ecgPage',
		    		params: {row: row,searchData: searchData,page: page,pageNum: pageNum,paramData: this.paramData}
		    	})
		    },
		    // 下载hly文件
		    downHly(row){
//		    	let Url = 'http://122.224.133.53:8081/pacs/one_ecg/file_download?filePath=/service/data/remote/20191126/&fileName=20191126174747187.hly'
		    	console.log(row)
//		    	window.location.href = row.hly_path
		    },
			pagechange(val){
				this.page.num = val - 1
				this.obtainList(val - 1)
			}
		},
		filters: {
			sexFilter(val) {
		      return val === 0 ? "男" : val === 1 ? "女" : "未指定"
		    },
		    timeFilter(val){
		    	return formatSecond(val)
		    },
		    typeFilter(val){
		    	switch (val){
		    		case 0:
		    			return '快速测量';
		    		case 1:
		    			return '动态监测';
		    		case 2:
		    			return '睡眠监测';
		    		case 3:
		    			return '运动监测';
		    		case 5:
		    			return '24小时holter测量';
		    		case 6:
		    			return '藏血测量';
		    		default:
		    			return '无';
		    	}
		    },
		    durationFilter(val){
		    	if (!val) {
		    		return
		    	}else{
		    		var s = val % 60;
			    	var min = Math.floor(val/60);
			    	var m = min % 60;
			    	var h = Math.floor(min/60);
			    	if (h == 0 && m == 0) {
			    		return s + '秒';
			    	}else if (h == 0 && m != 0) {
			    		return m + '分' + s + '秒'
			    	}else{
			    		return h + '小时' + m + '分' + s + '秒'
			    	}
		    	}
		    }
		}
	}
</script>

<style>
	.measure_wrap .search_box{
		font-size: 14px;
	}
	.measure_wrap .search_box .el-input{
		display: inline-block;
		/*width: 140px;*/
		height: 30px;
		line-height: 30px;
	}
	.measure_wrap .search_box .measure_result .el-input{
		width: 140px;
	}
	.measure_wrap .search_box .measure_result .el-input__inner{
		width: 140px;
	}
	.measure_wrap .search_box .el-input__inner{
		/*width: 140px;*/
		height: 30px;
		line-height: 30px;
	}
	.measure_wrap .search_box .duration .el-input__inner{
		width: 75px;
	}
	.measure_wrap .el-input__icon{
		line-height: 30px;
	}
	.measure_wrap .measure .el-input__icon{
		line-height: 22px;
	}
	.measure_wrap .area-select{
		width: 170px !important;
	}
	.measure_wrap .el-date-editor.el-input, .measure_wrap .el-date-editor.el-input__inner{
		width: 230px;
	}
	.measure_wrap .measure_btn{
		text-align: right;
	}
	.measure_wrap .measure_btn .el-button{
		padding: 6px 20px;
	}
	.measure_wrap .el-date-editor .el-range-separator{
		line-height: 22px;
	}
	.measure_wrap .search_heart{
		display: inline-block;
		color: #03A9F4;
		cursor: pointer;
	}
</style>