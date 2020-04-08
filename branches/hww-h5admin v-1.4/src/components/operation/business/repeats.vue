<template>
   <div>
    {{this.$route.query.cf}}
	 
   </div>
</template>
<script>
export default {
    created(){
	// var afterUrl =  window.location.search.substring(1);
	// // var afterEqual = afterUrl.substring(afterUrl.indexof('=')+1).toUpperCase();
	// console.log(afterUrl)
    },
    data (){
        return {
            
        }
    }
}
</script>
<style scoped >
    
</style>