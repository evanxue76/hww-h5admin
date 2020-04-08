<template>
   <div> 
       <crumbs>
				<div class slot="crumbs" >
					<el-breadcrumb separator=">">
						<el-breadcrumb-item>渠道商管理</el-breadcrumb-item>
						<el-breadcrumb-item>渠道商详情</el-breadcrumb-item>
                        <el-breadcrumb-item>进货订单</el-breadcrumb-item>
						<el-breadcrumb-item>重复设备</el-breadcrumb-item>
					
					</el-breadcrumb>
				</div>
			</crumbs>
       {{ repeats}}
   </div>
</template>
<script>
import crumbs from '@/components/common/Crumbs';
export default {
    created(){
      this.repeats = this.$route.query.repeats
    },
    components: {
		crumbs
	},
    data (){
        return {
            repeats:""
        }
    },
}
</script>
<style scoped >
    
</style>