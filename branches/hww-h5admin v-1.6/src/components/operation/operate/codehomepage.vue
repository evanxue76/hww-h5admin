<template>
	<div class="yaoqing" v-loading="d_loading">
		<crumbs  v-if="guanbi">
		  <div class slot="crumbs">
		    <el-breadcrumb separator=">">
		      <el-breadcrumb-item>运营中心</el-breadcrumb-item>
		      <el-breadcrumb-item>激活码管理</el-breadcrumb-item>
		    </el-breadcrumb>
		  </div>
		</crumbs>
		<div v-if="guanbi">
			<div class="searchData">
				<div>
					<span>激活码批次名称:</span>
					<span><el-input v-model="searchData.activationName" placeholder style="width: 80px;" clearable></el-input></span>
				</div>
				<div>
					<div>
						<span>激活码类型:</span>
						<span>
							<el-select v-model="searchData.packageId" clearable style="width: 150px;">
								<el-option v-for="item in terminalTypeList" :key="item.id" :label="item.packageName" :value="item.id"></el-option>
							</el-select>
						</span>
					</div>
				</div>
				<div class="time">
					<span class="pxs" >激活码有效期:</span>
					<el-date-picker
						v-model="searchData.time"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="input-class"
						  @change="codes"
					></el-date-picker>
				</div>
				<div class="time">
					<span class="pxs">创建时间:</span>
					<el-date-picker
						v-model="searchData.establish"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="input-class"
						 @change ="establishs"
					></el-date-picker>
				</div>
				<div>
					<span>激活码数量:</span>
					<el-input v-model="searchData.activationMinNum" placeholder style="width: 80px;" clearable></el-input>
					<span >------</span>
					<el-input v-model="searchData.activationMaxNum" placeholder style="width: 80px;" clearable></el-input>
					<span>个</span>
				</div>
				<div>
					<span>已激活数量:</span>
					<el-input v-model="searchData.useActivationMinNum" placeholder style="width: 80px;" clearable></el-input>
					<span>------</span>
					<el-input v-model="searchData.useActivationMaxNum" placeholder style="width: 80px;" clearable></el-input>
					<span>个</span>
				</div>
				<div class="btn">
					<span type="primary" @click="xinzeng">新增</span>
					<span type="primary" @click="query">查询</span>
					<span @click="chongzhia">重置查询条件</span>
				</div>
			</div>
			<div class="search-btn">
				
		<div>
			<el-table border :data="tableData" >
				<el-table-column label="序号" type="index"></el-table-column>
				<el-table-column label="激活码批次名称">
					<template  slot-scope="scope"  min-width="100%" >
						 <p>{{scope.row.activationName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="激活码类型"  min-width="100%" >
					<template slot-scope="scope">
						<p>{{scope.row.packageName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="创建时间"  min-width="100%" >
					<template slot-scope="scope">
						<p>{{ scope.row.createdAt |  formatDate }}</p>
					</template>
				</el-table-column>
				<el-table-column label="激活码有效期"  min-width="100%">
					<template slot-scope="scope">
						<p v-if="scope.row.activationValidityTime">{{scope.row.activationValidityTime  | formatDate }}</p>
						
					</template>
				</el-table-column>
				<el-table-column label="激活码数量"  min-width="100%">
					<template slot-scope="scope">
						<p>{{scope.row.activationNum }}</p>
					</template>
				</el-table-column>
				<el-table-column label="已激活数量"  min-width="100%">
					<template slot-scope="scope">
						<p>{{scope.row.useActivationNum }}</p>
					</template>
				</el-table-column>
				<el-table-column label="渠道商"  min-width="100%">
					<template slot-scope="scope">
						<p>{{scope.row.channel }}</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<span type="danger" class="details"  @click="details( scope.row.id,scope.row)">查看详情</span>
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
		
		</div>
		<!-- 新增 -->
		<el-dialog title="新增激活码" :visible.sync="package" :close-on-press-escape="true" :close-on-click-modal="false">
			<el-form :model="form">
				<el-form-item label="激活码批次名称" :label-width="formLabelWidth">
					<el-input autocomplete="off" maxlength="10" v-model="form.activationName" show-word-limit style="width: 150px;"></el-input>
				</el-form-item>
				<el-form-item label="激活码类型" :label-width="formLabelWidth">
					<el-select v-model="form.packageId" clearable style="width: 150px;">
						<el-option v-for="item in terminalTypeList" :key="item.id" :label="item.packageName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="激活码有效期" :label-width="formLabelWidth">
					<el-date-picker
						v-model="form.added"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="input-class"
						 @change ="added"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="生成激活码数量" :label-width="formLabelWidth">
					<el-input autocomplete="off" v-model="form.activationNum" style="width: 150px;" :disabled="this.disabled"></el-input>
				</el-form-item>
				<el-form-item label="渠道商" :label-width="formLabelWidth">
					<el-select v-model="form.channelId"   clearable style="width: 150px;">
						<el-option v-for="item in terminalTypeLists" :key="item.id" :label="item.channel" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="border-top: 1px solid  #000000;">
				<div style="margin-top: 10px">
					<el-button @click="package = false">取 消</el-button>
					<el-button type="primary" @click="shengcheng">生成</el-button>
				</div>
			</div>
		</el-dialog>
		
		<Code v-if="is.dae" :See="this.rows"></Code>
		
	</div>
</template>

<script>
import util from '@/lib/util';
import axios from 'axios';
import config from '@/lib/global';
import Code from './Code.vue';
import { formatDay, formatDate, formatSecond ,formatYear,formatDates,GetYearStr} from "@/lib/time";
import crumbs from '@/components/common/Crumbs'
export default {
	created(){
		this.activation()
		this.packages()
		this.list()
		//回车事件
		document.onkeydown=e=>{
			let _key=window.event.keyCode;
			if(_key===13){
				this.query()
			}
		}
	},
	components: {
		Code,crumbs
	},
	
	data() {
		return {
			is: {
				dae: false
			},
			disabled:false,
			d_loading: false,
			guanbi: true,
			searchData: {
				activationName: '',
				activationValidityBeginTime: '',
				activationValidityEndTime: '',
				beginTime:"",
				 endTime:"",
				activationMinNum: '',
				activationMaxNum: '',
				time: '',
				establish: '',
				 useActivationMinNum:"",
				 useActivationMaxNum:"",
				 packageId:""
			},
			form: {
				activationName: '',
				activationNum: '',
				channelId: '',
				packageId: '',
				activationValidityBeginTime:"",
				 activationValidityTime:"",
				 added:"",
				 packageName:"",
				 channel:""
			},
			terminalTypeList: [],
			terminalTypeLists: [],
			package: false,
			formLabelWidth: '120px',
			page: {
				total: 0,
				size: 15,
				num: 0,
				serialnumber: 0
			},
			tableData: [],
			rows:"",
		};
	},
	watch:{
		"form.shulang":function(val){
			this.form.shulang=val.replace(/\D|^0/g,'')
		},
		"form.activationNum":function(val){
			this.form.activationNum = val.replace(/\D|^0/g,'')
		}
	},
	methods: {	
		establishs(){
			this.searchData.beginTime = ''
			this.searchData.beginTime = formatSecond(this.searchData. establish[0])
			this.searchData.endTime = ''
			this.searchData.endTime = formatSecond(this.searchData. establish[1])
		},
		//获取列表
		async activation() {
			let Url = '',
				params = {
					"reqHead":{
						functionId: 'DWA001016001'
					},
				
			body: {
				beginTime:new Date().getFullYear()+''+'-'+''+'01'+ '-'+''+'01' +''+' '+'00:00:00',
				endTime:new Date().getFullYear()+''+'-'+''+'12'+ '-'+''+'31' +'' + '' +' '+ '23:59:59',
				pageSize: this.page.size,
				pageNum: this.page.num
			}
			}

			try {
				let res = await util.ajax.post(Url, params);
				this.tableData = res.data.body.data.datas;
				this.page.pageSize = res.data.body.data.pageSize;
				this.page.total = res.data.body.data.total;
			} catch (e) {}
		},
		//查询服务套餐列表
		async packages() {
			let Url = '',
				params = {
					"reqHead":{
						functionId: 'DWA001015001'
					},
				
			body: {
				pageNum:0,
				pageSize: 10000,
			}
			}
		
			try {
				let res = await util.ajax.post(Url, params);	
				
				 this.terminalTypeList= res.data.body.data.datas
				
			} catch (e) {}
		},

      //获取渠道商
      async list() {
      	let Url = '',
      		params = {
      			"reqHead":{
      				functionId: 'DWA001001007'
      			},
      		
      	body: {
      	}
      	}
      
      	try {
      		let res = await util.ajax.post(Url, params);	
      		
			 this.terminalTypeLists = res.data.body.data
				//    this.form.channelId = this.terminalTypeLists.id
//				     console.log( 66667777, this.terminalTypeLists )
			   
			 
      	} catch (e) {}
      },
      
		//查询
		async query(){
			if(this.searchData.activationMaxNum < this.searchData.activationMinNum){
				this.$message.error('激活码数量必须大于之前所输入的');
				return
			}
			
			if(this.searchData.useActivationMaxNum < this.searchData.useActivationMinNum){
				this.$message.error('已激活数量必须大于之前所输入的');
				return
			}
			let Url = '',
				params = {
					"reqHead":{
						functionId: 'DWA001016001'
					},
				
			body: {
				beginTime:this.searchData.beginTime,
				endTime:this.searchData.endTime,
				pageSize: this.page.size,
				pageNum: this.page.num,
				activationMaxNum:this.searchData.activationMaxNum,
				activationMinNum:this.searchData.activationMinNum,
				activationName:this.searchData.activationName,
				activationValidityBeginTime:this.searchData.activationValidityBeginTime,
				activationValidityEndTime:this.searchData.activationValidityEndTime,
				packageId:this.searchData.packageId,
				useActivationMaxNum:this.searchData.useActivationMaxNum,
				useActivationMinNum:this.searchData.useActivationMinNum
			}
			}
			
			try {
				let res = await util.ajax.post(Url, params);
				this.tableData = res.data.body.data.datas;
				this.page.pageSize = res.data.body.data.pageSize;
				this.page.total = res.data.body.data.total;
			} catch (e) {}
			
		},
		//分页
		pagechange(val) {
			this.page.num = val - 1;
			this.activation();
		},
		//重置查询
		chongzhia() {
			// this.searchData = ""
			this.searchData.useActivationMinNum = ""
			this.searchData.useActivationMaxNum =""
			this.searchData.packageId = ""
			this.searchData.activationValidityEndTime = ""
			this.searchData.activationValidityBeginTime = ""
			this.searchData.activationName = ""
			this.searchData.activationMaxNum =""
			this.searchData.activationMinNum = ""
			this.searchData.beginTime = new Date().getFullYear()+''+'-'+''+'01'+ '-'+''+'01' +''+' '+'00:00:00'
			 this. searchData. endTime =new Date().getFullYear()+''+'-'+''+'12'+ '-'+''+'31' +'' + '' +' '+ '23:59:59'
			 this.activation()
		},
		//新增
		xinzeng() {
			this.package = true;
		},
		//生成激活码
		shengcheng() {
			if (this.form.activationName == '') {
				this.$message.error('请输入激活码批次名称');
				return;
			}
			if (this.form.packageId == '') {
				this.$message.error('请选择激活码类型');
				return;
			}
			if (this.form.activationNum == '') {
				this.$message.error('请输入激活码数量');
				return;
			}
			if (this.form.activationNum < 0) {
				this.$message.error('生成激活码数量必须大于0');
				this.form.shulang = 0;
				return;
			}
			if (this.form.channelId == '') {
				this.$message.error('请选取渠道商');
				return;
			}
			if(this.form.added == ""){
				this.$message.error('激活码有效期不可以为空');
				return;
			}
			if (this.form.activationName != '' || this.form.packageName != '' || this.form.activationNum != '' || this.form.activationNum < 0 || this.form.channel != '' || this.form.added != "" ) {
				let Url = '',
					params = {
						"reqHead":{
							functionId: 'DWA001016002'
						},
					
				body: {
					activationName:this.form.activationName,
					activationNum:this.form.activationNum,
				activationValidityBeginTime:this.form.activationValidityBeginTime,
				 activationValidityTime: this.form.activationValidityTime,
				 packageId:this.form.packageId,
				  channelId:this.form.channelId
				}
				}
				
				try {
					let res =  util.ajax.post(Url, params);
					this.$message({
						message: '正在生成中....',
						type: 'success'
					});
					this.package = false;
					 this.activation();
					this.form.activationName = ''
					this.form.activationNum = ""
					this.form.activationValidityBeginTime = ''
					 this.form.activationValidityTime=""
					 // this.form.packageId=''
					 // this.form.channelId=''
					 this.form.added = ""
					 this.form.packageId=""
					 this.form.channelId =""
				} catch (e) {}
				
			}
			
		},
		//查看详情
		details(id, row){
			 this.$router.push({
				 name: 'Code',
				 params:{
					 row: row
				 }
			 })
			// this.rows = row,
			// this.guanbi =false,
			// this.is.dae=true
		},
		codes(){
			
			this.searchData.activationValidityBeginTime = formatSecond(this.searchData.time[0]) ;
			this.searchData. activationValidityEndTime = formatSecond(this.searchData.time[1]) ;
			 //console.log(this.searchData. activationValidityEndTime)
			// console.log(this.searchData.activationBeginTime)
		},
		added(){
		this.form.activationValidityBeginTime=formatSecond(this.form.added[0]);
			 this.form.activationValidityTime=formatSecond(this.form.added[1]);
		},
	
	},
	filters: {
	  formatDate: function(value) {
	    let date = new Date(value);
	    let y = date.getFullYear();
	    let MM = date.getMonth() + 1;
	    MM = MM < 10 ? "0" + MM : MM;
	    let d = date.getDate();
	    d = d < 10 ? "0" + d : d;
	    let h = date.getHours();
	    h = h < 10 ? "0" + h : h;
	    let m = date.getMinutes();
	    m = m < 10 ? "0" + m : m;
	    let s = date.getSeconds();
	    s = s < 10 ? "0" + s : s;
	    return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
	  }
	  }
};
</script>

<style>
.yaoqing {

}
.yaoqing .searchData {
	display: flex;
	flex-wrap: wrap;
}
.yaoqing .searchData div {
	/* display: flex;
	flex-wrap: wrap;
	height:50px;
	line-height: 50px; */
	height: 100%;
	line-height: 50px

}
.yaoqing .searchData div span {
	height: 40px;
	line-height: 40px;
	padding-left: 10px;
}
.yaoqing .el-date-editor--datetimerange.el-input__inner {
	width: 360px;
		height: 40px;
}
.yaoqing .btnss .anniu {
	float: right;
	margin-top: 10px;
}
.yaoqing .btnss .tihsi span {
	float: left;
	height: 60px;
	line-height: 60px;
}
.yaoqing .asdeaa {
	width: 20px;
	margin-top: 20px;
	margin-left: 10px;
	border-top: 1px solid #000000;
}
.yaoqing .details{
		color: #409EFF;
		cursor: pointer;
}
.yaoqing  .btn{
	height: 28px;
			line-height: 28px;
}
.yaoqing  .btn span{
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
