<template>
	<div>
		<!-- 面包屑 -->
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>系统功能</el-breadcrumb-item>
					<el-breadcrumb-item>系统设置</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<div class="xitong">
			<div class="boder">
				<h4>心电审核设置</h4>
				<div class="radio"><el-radio v-model="isAudit" label="1">全部自动审核</el-radio></div>
				<div class="radis">
					<el-radio v-model="isAudit" label="0">根据置信度人工审核</el-radio>
					<el-input v-model.trim="confidenceStart" placeholder style="width: 60px;" :disabled="disabled" ></el-input>
					<span class="asdeaa">------</span>
					<el-input v-model.trim="confidenceEnd" placeholder style="width: 60px;" :disabled="disabled"></el-input>
				</div>
			</div>
		</div>

		<el-button type="primary" class="adse" @click="btn">保存</el-button>
	</div>
</template>
<script>
import util from '@/lib/util';
import crumbs from '@/components/common/Crumbs';
import { formatSecond } from '@/lib/time';

export default {
	created(){
		this.auditor()
	},
	components: {
		crumbs
	},
	data() {
		return {
			isAudit:"",
			confidenceStart: '',
			confidenceEnd: '',
			disabled:false,
			
		};
	},
	watch: {
		confidenceStart: function(val) {
			console.log(val)
			this.confidenceStart = val.replace(/[^0-9]/g, '');
		},
		confidenceEnd: function(val) {
			this.confidenceEnd = val.replace(/[^0-9]/g, '');
		},
		isAudit:function(val){
			console.log(val)
			if(val == "1"){
				this.disabled = true
			}
			if(val == '0'){
				this.disabled = false
			}
		}
	},
	methods: {
		//获取初始的心电审核设置
		async auditor (){
			let Url = "",
				params = {
					reqHead:{
						functionId:"DWA001018002"
					},
					body :{
						id:1
					}
				};
			try{
				let res =await  util.ajax.post(Url, params);
				if(res.data.respHead.respCode ==="000"){
					 let isAudi= res.data.body.data.isAudit;
					this.isAudit =isAudi.toString()
					let confidenceStar  =  res.data.body.data.confidenceStart
					this.confidenceStart = confidenceStar.toString()
					let confidenceEn = res.data.body.data.confidenceEnd
					this.confidenceEnd = confidenceEn.toString()
					
				}
			}catch(e){
				if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!');
					} else {
						this.$message.error(`error： ${e.message}`);
					}
			}
		},
		async btn() {
			
			if (this.isAudit == '1') {
				this.confidenceStart = ""
				this.confidenceEnd = ""
				let Url = '',
					params = {
						reqHead: {
							functionId: 'DWA001018001'
						},
						body: {
							id: 1,
							isAudit: this.isAudit
						}
					};
				try {
					let res = await util.ajax.post(Url, params);
					if (res.data.respHead.respCode === '000') {
						this.$message({
							message: `${res.data.body.data}`,
							type: 'success'
						});
					}
				} catch (e) {
					if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!');
					} else {
						this.$message.error(`error： ${e.message}`);
					}
				}
			}
			if (this.isAudit == 0) {
				
				if (this.confidenceStart == '') {
					this.$message.error('置信度开始值不可以为空');
					return;
				}
				if (this.confidenceEnd == '') {
					this.$message.error('置信度结束值不可以为空');
					return;
				}
				if (this.confidenceEnd < this.confidenceStart) {
					this.$message.error('置信度结束值必须大于开始值');
					return;
				}
				let Url = '',
					params = {
						reqHead: {
							functionId: 'DWA001018001'
						},
						body: {
							id: 1,
							isAudit: this.isAudit,
							confidenceStart: this.confidenceStart,
							confidenceEnd: this.confidenceEnd
						}
					};
				try {
					let res = await util.ajax.post(Url, params);
					if (res.data.respHead.respCode === '000') {
						this.$message({
							message: `${res.data.body.data}`,
							type: 'success'
						});
					}
				} catch (e) {
					if (e.message.includes('Network')) {
						this.$message.error('网络连接错误，请检查网络连接，再重新尝试!');
					} else {
						this.$message.error(`error： ${e.message}`);
					}
				}
			}
		},
		
     }
};
</script>
<style>
.xitong {
	position: relative;
}
.xitong .adse {
	position: fixed;
	bottom: 30px;
}
.xitong .boder {
	border: 1px solid #000000;
	height: 80px;
	width: 500px;
}
.xitong .boder h4 {
	position: absolute;
	top: -8px;
	width: 120px;
	height: 30px;
	text-align: center;
	background-color: rgb(240, 245, 251);
	left: 10px;
}
.xitong .radio {
	margin-top: 16px;
}
.xitong .asdeaa {
	width: 20px;

	height: 20px;
}
.xitong .radios {
	display: flex;
}
</style>
