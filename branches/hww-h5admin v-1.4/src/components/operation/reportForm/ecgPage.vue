<template>
	<div class="ecg_page">
		<div class="btn-box">
			<span class="back" @click="callBack">返回</span>
			<span class="back pre" @click="pre">上一条</span>
			<span class="back next" @click="next">下一条</span>
			<span class="back" @click="downLoad">下载</span>
		</div>
		<crumbs>
	      <div class slot="crumbs">
	        <el-breadcrumb separator=">">
	          <el-breadcrumb-item>报表中心</el-breadcrumb-item>
	          <el-breadcrumb-item>测量记录</el-breadcrumb-item>
	          <el-breadcrumb-item>查看心电图</el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </crumbs>
	    <div class="ecg_resulr">
	    	<div class="">
	    		<p>简短结论：</p>
	    		<el-input
				  type="textarea"
				  :rows="3"
				  v-model="detailData.ecg_result_brief">
				</el-input>
	    	</div>
	    	<div class="">
	    		<p>中等长度结论：</p>
	    		<el-input
				  type="textarea"
				  :rows="3"
				  v-model="detailData.ecg_result">
				</el-input>
	    	</div>
	    	<div class="">
	    		<p>医生端详细结论：</p>
	    		<el-input
				  type="textarea"
				  :rows="3"
				  v-model="detailData.ecg_result_detail">
				</el-input>
	    	</div>
	    	<div class="">
	    		<p>心电分析印象：</p>
	    		<el-input
				  type="textarea"
				  :rows="3"
				  v-model="detailData.ecg_result_tz">
				</el-input>
	    	</div>
	    </div>
	    <iframe v-if="Url" :src='Url' width="100%" height="970px" class="heartPic"></iframe>
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import crumbs from '@/components/common/Crumbs'
	import { formatDay, formatDate, formatSecond } from '@/lib/time'
	import searchBox from '@/components/common/searchBox'
	import { pcaa } from "area-data";
	import config from '@/lib/global'
	export default{
		components: {
		    crumbs,searchBox
		},
		data(){
			return {
				searchData: {},
				pages: {},
				detailData: {},
				ecg_result_brief: '',
				ecg_result: '',
				ecg_result_detail: '',
				ecg_result_tz: '',
				Url: '',
				ips: {
					"http://192.168.1.65:2170/dwa/":"http://192.168.9.197:8081/",
					"http://api-test.995120.cn/dwa/":"http://122.224.133.53:8081/",
					"http://api.995120.cn/dwa/":"http://api.995120.cn/",
					"https://api.995120.cn/dwa/":"https://api.995120.cn/"
				},
				choiceFlag: true
			}
		},
		created(){
			this.detailData = this.$route.params.row
			this.searchData = this.$route.params.searchData
			this.pages = this.$route.params.page
			this.pageNum = this.$route.params.pageNum
			this.paramData = this.$route.params.paramData
			this.ecg()
		},
		methods: {
			callBack(){
				let pages = this.pages
				this.$router.push({
					name: 'measure',
					params: {pages: pages ,searchData: this.searchData}
				})
			},
			// 获取上一条
			pre(){
				let self = this
				let Url = ''
				let paramData = this.paramData
				let pageNum = this.pageNum
				pageNum--
				if (pageNum < 0) {
					this.$message({
						message: '消息已至顶部，暂无上一条！',
						type: 'warning'
					})
					return
				}
				paramData.pageSize = 1
				paramData.pageNum = pageNum
				let params = {
					"reqHead": {
						'functionId': 'DWA001011001'
					},
					"body": this.paramData
				}
				util.ajax.post(Url,params).then(function(res){
					self.pageNum = pageNum
//					self.page.total = res.data.body.data.total
//					self.page.num = res.data.body.data.pageNum
//					self.page.nums = self.page.num + 1
					self.detailData = res.data.body.data.datas[0]
					self.ecg()
				}).catch(function(err){
					console.log(err)
				})
			},
			// 获取下一条
			next(){
				let self = this
				let Url = ''
				let paramData = this.paramData
				let pageNum = this.pageNum
				pageNum++
				if (pageNum > this.pages.total) {
					this.$message({
						message: '消息已至最后一条，暂无下一条！',
						type: 'warning'
					})
					return
				}
				paramData.pageSize = 1
				paramData.pageNum = pageNum
				let params = {
					"reqHead": {
						'functionId': 'DWA001011001'
					},
					"body": this.paramData
				}
				util.ajax.post(Url,params).then(function(res){
					self.pageNum = pageNum
					self.detailData = res.data.body.data.datas[0]
					self.ecg()
				}).catch(function(err){
					console.log(err)
				})
			},
			// 下载心电
			async downLoad(){
				let self = this
		    	if (this.choiceFlag == true) {
		    		this.choiceFlag = false
		    		this.$message({
							message: '心电图开始下载，请勿重复点击！',
							type: 'success'
						})
					let Url = config.developmentUrl.host1 + "downSomeReport";
					let arr = []
					let ids = this.detailData.id
					let params = {
							'ids': ids.toString()
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
							link.setAttribute('download',`${formatSecond(new Date().getTime())}.ecg`);
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
			ecg(){
//				this.Url = 'http://122.224.133.53:8080/pacs/one_ecg/view/?file_id=' + this.detailData.anaecg_file_id
				this.Url = `${this.ips[config.developmentUrl.host1]}pacs/one_ecg/view/?file_id=${this.detailData.anaecg_file_id}`
			}
		}
	}
</script>

<style>
	.ecg_page{
		position: relative;
	}
	.ecg_page .btn-box{
		position: absolute;
		left: 280px;
	}
	.ecg_page .back{
		color: #ffffff;
		background: #169BD5;
		padding: 6px 24px;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer;
		margin-left: 14px;
	}
	.ecg_page .ecg_resulr{
		font-size: 14px;
		display: flex;
		
	}
	.ecg_page .ecg_resulr div{
		width: 80%;
	}
	.ecg_page .ecg_resulr p{
		margin-bottom: 8px;
	}
	.ecg_page .heartPic{
		margin-top: 16px;
	}
</style>