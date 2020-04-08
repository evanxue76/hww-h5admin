<template>
	<div class="business_create">
		<!-- 面包屑 -->
	    <crumbs>
	      <div class slot="crumbs">
	        <el-breadcrumb separator=">">
	          <el-breadcrumb-item>渠道商管理</el-breadcrumb-item>
	          <el-breadcrumb-item>新增渠道商</el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </crumbs>
	    <DetailBox :source='source'></DetailBox>
	    
	</div>
</template>

<script>
	import axios from "axios";
	import util from '@/lib/util'
	import config from "@/lib/global";
	import DetailBox from "@/components/operation/business/detailBox";

	import crumbs from '@/components/common/Crumbs'
	import {
		formatSecond
	} from '@/lib/time'
	export default{
		components: {
			crumbs,
			DetailBox
		},
		data(){
			return {
				source: 1
			}
			
		},
		created(){
			
		},
		methods: {
			// 提交表单
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	console.log(this.ruleForm)
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		},
		filters: {
			
		}
	}
</script>

<style >
	
</style>