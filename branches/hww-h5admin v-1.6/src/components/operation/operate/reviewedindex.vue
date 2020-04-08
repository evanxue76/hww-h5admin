<template>
	<div class="reviewe" v-loading="loading">
		<crumbs v-if="hollo">
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>运营中心</el-breadcrumb-item>
					<el-breadcrumb-item>心电数据审核</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<div v-show="hollo">
			<div class="searchData">
				<div class="searchData">
					<div>
						<span>账号:</span>
						<span><el-input v-model="searchData.phone" placeholder style="width: 130px;" clearable></el-input></span>
					</div>
					<div>
						<div>
							<span>姓名:</span>
							<span><el-input v-model="searchData.name" placeholder style="width: 130px;" clearable></el-input></span>
						</div>
					</div>
					<div>
						<span>性别:</span>
						<span>
							<el-select v-model="searchData.sex" style="width: 90px;" clearable>
								<el-option v-for="item in terminalTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</span>
					</div>
					<div>
						<div>
							<span>年龄:</span>
							<span><el-input v-model="searchData.age" placeholder style="width: 80px;" clearable></el-input></span>
						</div>
					</div>
					<div>
						<span>测量模式:</span>
						<span>
							<el-select v-model="searchData.type" style="width: 130px;" clearable>
								<el-option v-for="item in terminalTypeLists" :key="item.value" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</span>
					</div>
					<div>
						<div>
							<span>SN:</span>
							<span><el-input v-model="searchData.deviceSn" placeholder style="width: 130px;" clearable></el-input></span>
						</div>
					</div>
					<div class="time">
						<span class="pxs" style="padding-left: 10px;">测量时间:</span>
						<el-date-picker
							v-model="searchData.measureDate" 
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							class="input-class"
							@change="obtainList"
						></el-date-picker>
					</div>
					<div>
						<div>
							<span>测量结果:</span>
							<span><el-input v-model="searchData.resultBrief" placeholder style="width: 90px;" clearable></el-input></span>
						</div>
					</div>
					<div>
						<span>测量时长:</span>
						<el-input v-model="searchData.length" placeholder style="width: 80px;" clearable></el-input>
						<span>------</span>
						<el-input v-model="searchData.lengthOver" placeholder style="width: 80px;" clearable></el-input>
							<el-select class='' v-model="searchData.timeType" style="width: 90px;margin-left: 10px" clearable>
							  <el-option
							    v-for="item in durationType_list"
							    :key="item.value"
							    :label="item.name"
							    :value="item.value"
							  ></el-option>
							</el-select>
					</div>
					<div>
						<span>置信度:</span>
						<el-input v-model="searchData.confidence" placeholder style="width: 80px;" clearable></el-input>
						<span>------</span>
						<el-input v-model="searchData.confidenceOver" placeholder style="width: 80px;" clearable></el-input>
					</div>
					<div>
						<span>审核状态:</span>
						<span>
							<el-select v-model="searchData.auditState" style="width: 130px;" clearable>
								<el-option v-for="item in state" :key="item.value" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</span>
					</div>
				<div  class="search-btn">
				<span type="primary" @click="query">查询</span>
				<span @click="resetData">重置查询条件</span>
			</div>
				</div>
			</div>
		
			<div >
				<el-table border :="tableData" >
					<el-table-column label="序号" >
						<template slot-scope="scope">
							<p>{{ scope.$index+ page.serialnumber }}</p>
						</template>
					</el-table-column>
					<el-table-column label="账号">
						<template slot-scope="scope">
								<p>{{ scope.row.mobile }}</p>
						</template>
					</el-table-column>
					<el-table-column label="姓名">
						<template slot-scope="scope">
								<p>{{ scope.row.name }}</p>
						</template>
					</el-table-column>
					<el-table-column label="年龄">
						<template slot-scope="scope">
							<p>{{ scope.row.age }}</p>
						</template>
					</el-table-column>
					<el-table-column label="性别">
						<template slot-scope="scope">
						<p>{{ scope.row.sex | sexFilter }}</p>
						</template>
					</el-table-column>
					<el-table-column label="测量模式">
						<template slot-scope="scope">
							<p>{{ scope.row.type | f_type}}</p>
						</template>
					</el-table-column>
					<el-table-column label="测量时间">
						<template slot-scope="scope">
							<p>{{ scope.row.take_time | formatDate}}</p>
						</template>
					</el-table-column>
					<el-table-column label="测量时长">
						<template slot-scope="scope">
							<p>{{ scope.row.length }}</p>
						</template>
					</el-table-column>
					<el-table-column label="测量结果">
						<template slot-scope="scope">
							<p>{{ scope.row.ecg_result_brief }}</p>
						</template>
					</el-table-column>
					<el-table-column label="置信度">
						<template slot-scope="scope">
								<p>{{ scope.row.confidence }}</p>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
								<p>{{ scope.row.audit_state | f_audit_state }}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<span @click="details(scope.row,scope.$index,)"  class="details" v-if=" scope.row.audit_state == 0 ">审核</span>
							<span @click="details(scope.row,scope.$index,)"  class="details" v-else-if=" scope.row.audit_state == 1">查看详情</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="list_page">
				<el-pagination
					background
					layout="prev, pager, next,total,jumper"
					:page-size="page.size"
					:current-page="page.num + 1"
					@current-change="pagechange"
					:total="page.total"
				></el-pagination>
			</div>
		</div>
		<chartdetails v-if="chartdetails"  ></chartdetails>
	</div>
</template>
<script>
import util from '@/lib/util';
import axios from 'axios';
import config from '@/lib/global';
import chartdetails from './chartdetails.vue';
import { formatDay, formatDate, formatSecond } from '@/lib/time'
import crumbs from '@/components/common/Crumbs';
import { pcaa } from "area-data";
export default {
	components: {
		chartdetails,
		crumbs
	},
	data() {
		return {
			chartdetails: false,
			loading: false,
			hollo: true,
			searchData: {
				phone:"",
				name:"",
				age:"",
				sex:"",
				type:"",
				deviceSn:"",
				resultBrief:"",
				timeType:"0",
				auditState:"",
				measureDate: "",
				takeTimeCopy:"",
				takeTimeOver: "",
				confidence:"",
				confidenceOver:"",
				length:"",
				
			},
			terminalTypeList: [
				{
					value: '',
					name: '全部'
				},
				{
					value: '0',
					name: '男'
				},
				{
					value: '1',
					name: '女'
				},
				{
					value: '2',
					name: '未指定'
				}
			],
			terminalTypeLists: [
				{
					value: '',
					name: '全部'
				},
				{
					value: '0',
					name: '快速测量'
				},
				{
					value: '1',
					name: '动态监测'
				},
				{
					value: '2',
					name: '睡眠监测'
				},
				{
					value: '3',
					name: '运动监测'
				}
			],
			durationType_list: [
				
				{
					value: '0',
					name: '分钟'
				},
				{
					value: '1',
					name: '小时'
				}
				
			],
			state: [
				{
					value: '',
					name: '全部'
				},
				{
					value: '0',
					name: '待审核'
				},
				{
					value: '1',
					name: '已审核'
				}
			],
			page: {
			    total: 0,
			    size: 15,
			    num: 0,
			    serialnumber: 0,
				nums:1
			},
			tableData:[],
			rows:"",
			paramData:{}
			
		};
	},
	created(){
		var date = new Date().getTime()
		this.searchData.measureDate = [date - 63072000000,date]
		this.activations()
		//回车事件
		document.onkeydown=e=>{
			let _key=window.event.keyCode;
			if(_key===13){
				this.query()
			}
		}
	},
	methods: {
		//分页
		pagechange(val){
               this.page.num = val - 1;
				this.query();
		},
		obtainList(){
			if(this.searchData.measureDate == null){
				this.searchData.takeTimeCopy = ''
				this.searchData.takeTimeOver = ''
				return
			}else{
				this.searchData.takeTimeCopy = formatDay(this.searchData.measureDate[0]) + ' ' + '00:00:00'
				this.searchData.takeTimeOver = formatDay(this.searchData.measureDate[1]) + ' ' + '23:59:59'
			}
		},
		details(row,index) {
			let searchData = this.searchData
			let page = this.page
			let pageNum = index + page.num*15
			this.$router.push({
				name: 'chartdetails',
				params: {row: row,searchData: searchData,page: page,pageNum: pageNum,paramData: this.paramData}
			})
		},
		//获取列表详情
		async activations() {
			let Url = ''
			let	params = {
					reqHead: {
						functionId: 'DWA001017001'
					},
					body:{
						takeTimeCopy: formatDay(this.searchData.measureDate[0]) + ' ' + '00:00:00',
						takeTimeOver: formatDay(this.searchData.measureDate[1]) + ' ' + '23:59:59',
						pageSize: this.page.size,
						pageNum: this.page.num,
					}
				};
		
			try {
					let res = await  util.ajax.post(Url, params);
					   if(res.data.respHead.respCode === "000"){
						     this.tableData =  res.data.body.data.datas
							this.page.size = res.data.body.data.pageSize;
							this.page.total = res.data.body.data.total;
							this.page.num = res.data.body.data.pageNum
						   this.page.serialnumber = 1 + this.page.size * this.page.num;
					   }else {
						  this.$message.error(`${res.data.respHead.respMsg}`);
						}			 
			}catch (e){
				
			}
		},
		
		//查询
	async	 query(){
			 if(this.searchData.lengthOver < this.searchData.length){
				 this.$message.error('测量时长最高值必须大于最低值');
				 return
			 }
			 if(this.searchData.takeTimeOver < this.searchData.takeTimeCopy){
				  this.$message.error('测量时间最高值必须大于最低值');
				  return
			 }
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001017001'
					},
					body:{
						takeTimeCopy: formatDay(this.searchData.measureDate[0]) + ' ' + '00:00:00',
						takeTimeOver: formatDay(this.searchData.measureDate[1]) + ' ' + '23:59:59',
						pageSize: 15,
						pageNum: this.page.num,
						phone: this.searchData.phone,
						name:this.searchData.name,
						age:this.searchData.age,
						sex:this.searchData.sex,
						type:this.searchData.type,
						deviceSn:this.searchData.deviceSn,
						resultBrief:this.searchData.resultBrief,
						timeType:this.searchData.timeType,
						auditState:this.searchData.auditState,
						confidence:this.searchData.confidence,
						confidenceOver:this.searchData.confidenceOver,
						length:this.searchData.length,
					}
				};
				try {
					let res = await util.ajax.post(Url, params);
				
					this.tableData = res.data.body.data.datas;
						this.page.total = res.data.body.data.total;
					this.page.size = res.data.body.data.pageSize;
				} catch (e) {}	
		},
		//重置
		resetData(){
			this.searchData = {
				phone:"",
				name:"",
				age:"",
				sex:"",
				type:"",
				deviceSn:"",
				resultBrief:"",
				auditState:"",
				confidence:"",
				confidenceOver:"",
				length:"",
				timeType:"0",
			}
			
			var date = new Date().getTime();
			this.searchData.measureDate = [date - 63072000000, date];
			this.searchData.takeTimeCopy = `${formatSecond(this.searchData.measureDate[0])}`;
			this.searchData.takeTimeOver = `${formatSecond(this.searchData.measureDate[1])}`;
			this.activations()
		},
		
	},
	filters: {
	  sexFilter(val) {
	    return val === 0 ? "男" : val === 1 ? "女" : "未指定";
	  },
	  f_type(val) {
	    switch(val){
			case 0:
			 return "快速测量"
			 break;
			 case 1:
			  return "动态监测"
			  break;
			case 2:
			 return "睡眠监测"
			 break;
			 case 3:
			  return "运动监测"
			  break;
		}
		 
	 },
	   f_ecgLevel(val){
		   if (val == 0) {
		   	return "未见异常"
		   } else if (val >= 1) {
		   	return "疑似异常"
		   } else if (val == -1) {
		   	return "导联脱落"
		   } else if (val == -11) {
		   	return "数据干扰"
		   }
	   },
	   formatDate: function(value) {
	   	let date = new Date(value);
	   	let y = date.getFullYear();
	   	let MM = date.getMonth() + 1;
	   	MM = MM < 10 ? '0' + MM : MM;
	   	let d = date.getDate();
	   	d = d < 10 ? '0' + d : d;
	   	let h = date.getHours();
	   	h = h < 10 ? '0' + h : h;
	   	let m = date.getMinutes();
	   	m = m < 10 ? '0' + m : m;
	   	let s = date.getSeconds();
	   	s = s < 10 ? '0' + s : s;
	   	return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
	   },
	    f_audit_state(val){
			switch (val){
				case 0:
				 return "待审核"
				 break;
				 case 1:
				  return "已审核"
				  break;
			}
		}
	  },
	 
};
</script>
<style>
.reviewe {
}
.reviewe .searchData {
	display: flex;
	flex-wrap: wrap;
	
}
.reviewe .searchData div {
	/* display: flex;
	flex-wrap: wrap; */
	height: 100%;
	line-height: 50px
}
.reviewe .searchData div span {
	height: 40px;
	line-height: 40px;
	padding-left: 10px;
}
.reviewe .el-date-editor--datetimerange.el-input__inner {
	width: 360px;
	height: 40px;
}

.reviewe .asdeaa {
	width: 20px;
	margin:20px 10px 0px 10px;
	border-top: 1px solid #000000;

}
.reviewe .details{
	color: #409EFF;
			cursor: pointer;
}
.reviewe .btns{
	margin-left: 20px
}
.reviewe  .search-btn{
	height: 28px;
			line-height: 28px;
}
.reviewe  .search-btn span{
	display: inline-block;
				color: #FFFFFF;
				background: #409EFF;
				padding: 0 8px;
				margin-left: 6px;
				cursor: pointer;
				font-size: 14px;
				border-radius: 10px
}
</style>
