<template>
	<div class="business_manage">
		<!-- 面包屑 -->
	    <crumbs>
	      <div class slot="crumbs">
	        <el-breadcrumb separator=">">
	          <el-breadcrumb-item>运营管理</el-breadcrumb-item>
	          <el-breadcrumb-item>渠道商管理</el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </crumbs>
		<div class="search_wrap">
			<div class="search-box">
				<div class='search-in'>
		            <span class="Names">名称:</span>
		            <el-input v-model.trim="searchData.channel" clearable placeholder="输入名称"></el-input>
		        </div>
		        <div class='search-in'>
		            <span class="Names">联系人:</span>
		            <el-input v-model.trim="searchData.contacts" clearable placeholder="输入联系人"></el-input>
		        </div>
		        <div class='search-in'>
		            <span class="Names">联系电话:</span>
		            <el-input v-model.trim="searchData.contactsNumber" maxlength="11" clearable placeholder="输入联系电话"></el-input>
		        </div>
		        <div class='search-in'>
		            <span class="Names">好络维对接人:</span>
		            <el-input v-model.trim="searchData.hlwPeople" clearable placeholder="输入好络维对接人"></el-input>
		        </div>
			</div>
			<div class="search-box">
				<div class='search-in'>
		            <span class="Names">公司名称:</span>
		            <el-input v-model.trim="searchData.corporateName" clearable placeholder="输入公司名称"></el-input>
		        </div>
		        <div class='search-in time'>
		            <span class="Names">入驻时间:</span>
		            <el-date-picker
		              placeholder="输入入驻时间"
				      v-model="searchData.date"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
		        </div>
		        <div class='search-in'>
		        	<span class="Names">状态:</span>
		        	<el-select v-model="searchData.isFrozen" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
		        </div>
		        <div class=''>
		            <el-button type="primary" @click='search'>查询</el-button>
		            <el-button @click='reset'>重置查询条件</el-button>
		            <el-button type="primary" @click='add'>添加</el-button>
		        </div>
		        
			</div>
	          
        </div>
	    <div class="">
	    	<el-table :data='tableData'>
	    		<el-table-column label='序号' type="index" min-width='30'>
	    			
	    		</el-table-column>
	    		<el-table-column label='名称' min-width=''>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.channel}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='联系人' min-width=''>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.contacts}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='公司名称' min-width='180'>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.corporateName}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='好络维对接人' min-width=''>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.hlwPeople}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='入驻时间' min-width='180'>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.createdAt | createdFilter}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='状态' min-width=''>
	    			<template slot-scope='scope'>
	    				<p>{{scope.row.isFrozen | isFrozenFilter}}</p>
	    			</template>
	    		</el-table-column>
	    		<el-table-column label='操作' min-width=''>
	    			<template slot-scope='scope'>
	    				<span class="detail" @click="searchDetail(scope.row)">查看详情</span>
	    				<span class="delete" v-if="scope.row.isMock != 1 "   @click="deleteBusiness(scope.row)">冻结</span>
	    			</template>
	    		</el-table-column>
	    	</el-table>
	    </div>
	    <!-- 分页 -->
	    <div class="list_page">
	      <el-pagination
	        background
	        layout="prev, pager, next,total,jumper"
	        :page-size="15"
	        @current-change="pagechange"
	        :total="total"
	      ></el-pagination>
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
		formatSecond,formatDay
	} from '@/lib/time'
	
	export default{
		components: {
			crumbs,
			searchBox
		},
		data(){
			return {
				
				total: 0,
				searchData: {
					channel: '',
					contacts: '',
					contactsNumber: '',
					corporateName: '',
					hlwPeople: '',
					date: '',
					isFrozen: ''
				},
				beginTime: '',
				endTime: '',
				options: [{
					value: '',
          			label: '全部'
				},{
					value: 0,
          			label: '正常'
				},{
					value: 1,
          			label: '冻结'
				}],
				tableData: [],
				page: 0
			}
		},
		created(){
			this.obtainData(0)
		},
		methods: {
			// 获取渠道商列表
			obtainData(page){
				let self = this
			    
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001013001'
					},
					"body": {
						'channel': this.searchData.channel,
						'contacts':this.searchData.contacts,
						'contactsNumber':this.searchData.contactsNumber,
						'corporateName':this.searchData.corporateName,
						'hlwPeople':this.searchData.hlwPeople,
						'isFrozen':this.searchData.isFrozen,
						'beginTime':this.beginTime,
						'endTime':this.endTime,
						'pageNum':page,
						'pageSize':15,
					}
				}
				util.ajax.post(Url,params).then(function(res){
					if(res.data.respHead.respCode == '000'){
						self.tableData = res.data.body.data.datas
						self.total = res.data.body.data.total
					}
					
				}).catch(function(err){
					console.log(err)
				})
			},
			// 点击查询条件
			search(){
				console.log(this.searchData)
				if (this.searchData.date == null || this.searchData.date == '') {
					this.beginTime = ''
					this.endTime = ''
				}else{
					this.beginTime = formatDay(this.searchData.date[0]) + ' 00:00:00'
					this.endTime = formatDay(this.searchData.date[1]) + ' 23:59:59'
				}
				this.obtainData(0)
			},
			// 重置查询条件
			reset(){
				let obj = this.searchData
				for (var item in obj) {
					this.searchData[item] = ''
				}
			},
			// 添加
			add(){
				this.$router.push({
					name: 'businessCreate'
				})
			},
			// 选择页码
			pagechange(val){
				this.page = val - 1
				this.obtainData(this.page)
			},
			// 查看详情
			searchDetail(row){
				this.$router.push({
					params: {row: row},
					name: 'businessDetails'
				})
			},
			// 删除渠道商
			deleteBusiness(row){
				if (row.isFrozen == 1) {
					this.$message({
			            type: 'warning',
			            message: '该渠道商已冻结!'
				    });
				    return
				}
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001013003'
					},
					"body": {
						'id': row.id,
						'isFrozen': 1,
						'channelNo': row.channelNo
					}
				}
				this.$confirm('此操作将冻结该渠道商, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          util.ajax.post(Url,params).then(function(res){
					console.log(res)
					if(res.data.respHead.respCode == '000'){
						self.$message({
				            type: 'success',
				            message: '冻结成功!'
				        });
						self.obtainData(self.page)
					}
				  }).catch(function(err){
					console.log(err)
				  })	
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消冻结'
		          });          
		        });
			}
			
		},
		filters: {
			isFrozenFilter(val){
				if (val == 0) {
					return '正常'
				}else if (val == 1) {
					return '冻结'
				}
			},
			createdFilter(val){
				return formatSecond(val)
			}
		}
		
	}
</script>

<style >
.home_content{
	min-width: 1092px;
	overflow-x: auto;
}
.business_manage{
	/*min-width: 1092px;
	overflow-x: auto;*/
}
	.business_manage .search_wrap{
		font-size: 14px;
	}
	.business_manage .search-box{
		display: flex;
		margin-bottom: 20px;
	}
	.business_manage .el-input{
		width: 66%;
	}
	.business_manage .search-in{
		min-width: 210px;
	}
	.business_manage .el-input__inner{
		height: 30px;
		line-height: 30px;
	}
	.business_manage .time .el-input__inner{
		width: 230px;
	}
	.business_manage .el-date-editor .el-range-separator{
		line-height: 24px;
	}
	.business_manage .el-date-editor .el-range__icon{
		line-height: 24px;
	}
	.business_manage .el-date-editor .el-range__close-icon{
		line-height: 24px;
	}
	.business_manage .el-input__icon{
		line-height: 30px;
	}
	.business_manage .el-button{
		padding: 6.5px 20px;
	}
	.business_manage .detail{
		color: #3399FF;
		cursor: pointer;
	}
	.business_manage .delete{
		display: inline-block;
		color: #3399FF;
		cursor: pointer;
		margin-left: 8px;
	}
</style>