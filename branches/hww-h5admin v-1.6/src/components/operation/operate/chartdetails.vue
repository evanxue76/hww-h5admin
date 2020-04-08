<template>
	<div class="chartdetail"  >
		<div v-if="hollos">
			<!-- 面包屑 -->
			<div  class="btn-box">
				<span  @click="callBack" class="back"  >返回</span>
						<span  v-if="detailData.audit_state == 0 ? true : false"  @click="next" class="back"  >审核通过并下一条</span>
			</div>
			<crumbs>
				<div class slot="crumbs" >
					<el-breadcrumb separator=">">
						<el-breadcrumb-item>运营中心</el-breadcrumb-item>
						<el-breadcrumb-item>心电数据审核</el-breadcrumb-item>
						<el-breadcrumb-item>审核心电图</el-breadcrumb-item>
						
					</el-breadcrumb>
				</div>
			</crumbs>
			<div class="Song">
				<div style="width: 400px;margin-left: 20px;">
					<div>简短结论：</div>
					<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="detailData.ecg_result_brief"
					  style="width: 400px"
					  >
					</el-input>
				</div>
				<div style="width: 400px;margin-left: 20px;">
					<div>中等长度结论：</div>
					<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="detailData.ecg_result"
					  style="width: 400px; "
					  >
					</el-input>
				</div>
				<div style="width: 400px;margin-left: 20px;">
					<div>医生端详细结论：</div>
					<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="detailData.ecg_result_detail"
					  style="width: 400px; "
					  >
					</el-input>
				</div>
				<div style="width: 400px;margin-left: 20px;">
					<div>心电分析印象：</div>
					<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="detailData.ecg_result_tz"
					  style="width: 400px; "
					  >
					</el-input>
				</div>
			</div>
		     <div style="margin-top: 20px;">
				 <iframe width="100%"  :src="Url" height="970px">
					 
				 </iframe>
			 </div>
		</div>
	</div>
</template>

<script>
import crumbs from '@/components/common/Crumbs';
import config from '@/lib/global';
import { pcaa } from "area-data";
import util from '@/lib/util';
import { formatDay, formatDate, formatSecond } from '@/lib/time'
export default {
	created(){
		this.detailData = this.$route.params.row
		this.searchData = this.$route.params.searchData
		this.pages = this.$route.params.page
		this.pageNum = this.$route.params.pageNum
		this.paramData = this.$route.params.paramData
		this.ecg()
	},
	components: {
		crumbs
	},
	data() {
		return {
			detailData:{},
			searchData:{},
			pages:{},
			pageNum:{},
			paramData:{},
			hollos: true,
			ecg_result_tz:"",
			ecg_result_brief:"",
			ecg_result:"",
			ecg_result_detail:"",
			Url:"",
			ips: {
				"http://192.168.1.65:2170/dwa/":"http://192.168.9.197:8081/",
				"http://api-test.995120.cn/dwa/":"http://122.224.133.53:8081/",
				"http://api.995120.cn/dwa/":"http://api.995120.cn/",
				"https://api.995120.cn/dwa/":"https://api.995120.cn/"
			},
		};
	},
	methods:{
		ecg(){
	      this.Url = `${this.ips[config.developmentUrl.host1]}pacs/one_ecg/view/?file_id=${this.detailData.anaecg_file_id}`
		},
		//下一条
		next(){
			let self = this
			let Url = ''
			let pageNum = this.pageNum
			pageNum++
			if (pageNum > this.pages.total) {
				this.$message({
					message: '消息已至最后一条，暂无下一条！',
					type: 'warning'
				})
				return
			}
			let params = {
				"reqHead": {
					'functionId': 'DWA001017002'
				},
				body:{
					// pageSize: 1,
					ecgResult:this.detailData.ecg_result,
					ecgResultBrief:this.detailData.ecg_result_brief,
					ecgResultDetail:this.detailData.ecg_result_detail,
					ecgResultTz:this.detailData.ecg_result_tz,
					id:this.detailData.id,
					auditState:1,
					successState:1,
					// pageNum:pageNum,
					takeTime:formatSecond(this.detailData.take_time)

				}
			}
			util.ajax.post(Url,params).then(function(res){
			
				self.pageNum = res.data.body.data.pageNum
				self.detailData = res.data.body.data
				console.log(5555555,self.detailData)
				self.ecg()
			}).catch(function(err){
				console.log(err)
			})
		},
		callBack(){
			let pages = this.pages
			this.$router.push({
				name: 'reviewedindex',
				params: {pages: pages ,searchData: this.searchData}
			})
		}
	},
	filters:{
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
	}
};
</script>

<style>
.chartdetail{
	position: relative;
}
	.chartdetail .Song{
		display: flex;
		
	}
	.chartdetail .btn-box{
		position: absolute;
		left: 280px;
	}
	.chartdetail .back{
		color: #ffffff;
		background: #169BD5;
		padding: 6px 24px;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer;
		margin-left: 14px;
	}
</style>
