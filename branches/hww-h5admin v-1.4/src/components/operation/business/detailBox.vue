<template>
	<div class="business_create">
	    <div class="">
	    	<p>基本信息：</p>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="138px" class="demo-ruleForm">
				<el-form-item label="名称" prop="channel">
				    <el-input v-model.trim="ruleForm.channel"></el-input>
				</el-form-item>
				<el-form-item label="联系人" prop="contacts">
				    <el-input v-model.trim="ruleForm.contacts"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="contactsNumber">
				    <el-input v-model="ruleForm.contactsNumber"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="corporateName">
				    <el-input v-model.trim="ruleForm.corporateName"></el-input>
				</el-form-item>
				<el-form-item label="好络维对接人" prop="hlwPeople">
				    <el-input v-model.trim="ruleForm.hlwPeople"></el-input>
				</el-form-item>
				<el-form-item label="开户行" prop="openingBank">
				    <el-input v-model.trim="ruleForm.openingBank" maxlength='40'></el-input>
				</el-form-item>
				<el-form-item label="银行账号" prop="bankAccount">
				    <el-input v-model.trim="ruleForm.bankAccount" maxlength='20'></el-input>
				</el-form-item>
				<el-form-item label="渠道商唯一编码" prop="channelNo">
				    <el-input v-model="ruleForm.channelNo" disabled></el-input>
				</el-form-item>
				<el-form-item class='' label="分成比例" prop="divideInto">
				    <el-input v-model.trim="ruleForm.divideInto"></el-input>%
				</el-form-item>
				<el-form-item label="支付信息：">
				    <!--<el-input type="textarea" v-model="ruleForm.payMessage"></el-input>-->
				</el-form-item>
				<el-form-item label="微信公众号APPID" prop="appId">
				    <el-input v-model.trim="ruleForm.appId"></el-input>
				</el-form-item>
				<el-form-item label="微信公众号AppSecret" prop="appSecret">
				    <el-input v-model.trim="ruleForm.appSecret"></el-input>
				</el-form-item>
				<el-form-item label="商户号" prop="mchId">
				    <el-input v-model.trim="ruleForm.mchId"></el-input>
				</el-form-item>
				<el-form-item label="商户密钥" prop="appKey">
				    <el-input v-model.trim="ruleForm.appKey"></el-input>
				</el-form-item>
				<el-form-item label="商户证书" prop="certPath">
				    <!--action="http://192.168.1.76:2170/dwa/file/uploadFile"--> <!--baseUrl.developmentUrl.host1    action="http://api-test.995120.cn/dwa/file/uploadFile"-->
				    <el-upload
					  class="upload-demo"
					  :action="Url"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :beforeRemove-remove="beforeRemove"
					  :on-success="handleSucess"
					  multiple
					  v-model="ruleForm.certPath" 
					  :limit="1"
					  :on-exceed="handleExceed"
					  :file-list="fileList">
					  <el-button size="small" type="primary">上传文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="备注" prop="remarks" class="texta">
				    <el-input 
				    	type="textarea" 
				    	v-model.trim="ruleForm.remarks" 
				    	maxlength="200"
				    	show-word-limit
				    	></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button @click='cancleForm'>取消</el-button>
				    <el-button :disabled='mock' type="primary" @click="submitForm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import config from "@/lib/global";
	import {regAge} from "@/lib/regular"
	import baseUrl from "@/lib/global"
	import {
		formatSecond
	} from '@/lib/time'
	export default{
		props: ['source','id'],
		data(){
			return {
				Url: '',
				ruleForm: {
					channel: '',
					contacts: '',
					contactsNumber: '',
					corporateName: '',
					hlwPeople: '',
					openingBank: '',
					bankAccount: '',
					channelNo: '',
					divideInto: '',
					appId: '',
					appSecret: '',
					mchId: '',
					appKey: '',
					certPath: '',
					certName: '',
					remarks: ''
				},
				rules: {
					channel: [
			            { required: true, message: '请输入名称', trigger: 'blur' },
			            { max:20, message: '最大输入20个字符'}
			          ],
			        contacts: [
			            { required: true, message: '请输入联系人', trigger: 'blur' },
			            { max:20, message: '最大输入20个字符'}
			          ],
			        contactsNumber: [
			            { required: true, message: '请输入联系电话', trigger: 'blur' },
			          ],
			        corporateName: [
			            { required: true, message: '请输入公司名称', trigger: 'blur' },
			            { max:40, message: '最大输入40个字符'}
			          ],
			        hlwPeople: [
			            { required: true, message: '请输入好络维对接人', trigger: 'blur' },
			            { max:20, message: '最大输入20个字符'}
			          ],
			        channelNo: [
			            { required: true, message: '请输入渠道商编码', trigger: 'blur' },
			          ],
			        divideInto: [
			            { required: true, message: '请输入分成比例', trigger: 'blur' },
			            { validator: (rule,value,callback) => {
			            		if (/^([0-9]|[0-9]{2}|100)$/.test(value) == false) {
			            			callback(new Error("请输入0-100以内的整数"));
			            		}else{
			            			callback();
			            		}
			            	},
			            	trigger: "blur"
			            }
			          ],
			        appId: [
			            { required: true, message: '请输入微信公众号APPID', trigger: 'blur' },
			          ],
			        appSecret: [
			            { required: true, message: '请输入微信公众号AppSecret', trigger: 'blur' },
			          ],
			        mchId: [
			            { required: true, message: '请输入商户号', trigger: 'blur' },
			          ],
			        appKey: [
			            { required: true, message: '请输入商户秘钥', trigger: 'blur' },
			          ],
			        certPath: [
			            { required: true, message: '请输入商户证书', trigger: 'blur' },
			          ],
				},
				fileList: [],
				mock: false
			}
			
		},
		created(){
			this.Url = `${baseUrl.developmentUrl.host1}file/uploadFile`
			if (this.source == 1) {
				this.obtainchannelNo()
			}else if (this.source == 2) {
				this.obtationDetails()
			}
		},
		methods: {
			// 获取渠道商编码
			obtainchannelNo(){
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001013006'
					},
					"body": {
						
					}
				}
				util.ajax.post(Url,params).then(function(res){
					//console.log(res)
					self.ruleForm.channelNo = res.data.body.data
				}).catch(function(err){
					console.log(err)
				})
			},
			// 获取详情
			async obtationDetails(){
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001013002'
					},
					"body": {
						'id': localStorage.getItem('businessId')
					}
				}
				try{
					let res = await util.ajax.post(Url,params);
					if (res.data.body.data.isMock == 1) {
						this.mock = true
					}else{
						this.mock = false
					}
					this.ruleForm = res.data.body.data;
					this.fileList = [{name:res.data.body.data.certName,url:res.data.body.data.certPath}]
				}catch(e){
					console.log(e)
				}
			},
			
			
			handleRemove(file, fileList) {
//				console.log(file)
				this.ruleForm.certPath = ''
		    	this.ruleForm.certName = ''
		        //console.log(file, fileList);
		    },
		    handlePreview(file) {
		        //console.log(file);
		    },
		    handleExceed(files, fileList) {
		        this.$message.warning(`只可上传1个文件`);
		    },
		    // 移除文件
		    beforeRemove(file, fileList) {
//		    	console.log(file)
		        return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.ruleForm.cert = ''
		          this.$message({
		            type: 'success',
		            message: '移除成功!'
		          });
		        })
		    },
		    // 文件上传成功
		    handleSucess(response, file, fileList){
		    	if (response.respHead.respCode == '000') {
//		    		file.name = response.body.obj.fileName
		    		this.ruleForm.certPath = response.body.obj.filePath
		    		this.ruleForm.certName = response.body.obj.fileName
		    	}
		    },
			
			
			// 提交表单
			submitForm(formName) {
				let self = this
				let Url = ''
				let params = {
					"reqHead": {
						'functionId': 'DWA001013004'
					},
					"body": this.ruleForm
				}
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	util.ajax.post(Url,params).then(function(res){
		          		//console.log(res)
		          		if(res.data.respHead.respCode == '000'){
		          			self.$message({
					            type: 'success',
					            message: '添加成功!'
					        });
					        self.$router.push({
					        	name: 'business'
					        })
		          		}else{
		          			self.$message({
					            type: 'waring',
					            message: res.data.respHead.respMsg
					        });
		          		}
		          	}).catch(function(err){
		          		console.log(err)
		          	})
		          	
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		    // 取消保存
		    cancleForm(){
		    	this.$router.push({
		        	name: 'business'
		        })
		    }
		},
		filters: {
			
		}
	}
</script>

<style>
	.business_create .el-input{
		width: 400px;
	}
	.business_create .el-input{
		
	}
	.business_create .el-textarea__inner{
		width: 400px;
	}
	.business_create .el-form-item__label{
		text-align: left;
		font-size: 12px;
	}
	.business_create .el-input__inner{
		height: 34px;
		line-height: 34px;
	}
	.business_create .el-button{
		padding: 10px 50px;
	}
	.business_create .el-button+.el-button{
		margin-left: 138px;
	}
	.business_create .el-upload-list__item-status-label{
		left: 390px;
	}
	.business_create .el-upload-list__item .el-icon-close{
		left: 390px;
	}
	.texta .el-textarea{
		width: 400px;
	}
</style>