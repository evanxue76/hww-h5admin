<template>
  <div class="wrapper">
    <headers></headers>
    <sidebar></sidebar>
    <div class="home_content">
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import headers from "@/components/common/header"
import sidebar from "@/components/common/Sidebar"
export default {
  components: {
    headers,
    sidebar
  },
  created() {
    // var isLogen = this.$cookie.get('manageUserName')
    // // 判断是否登录
    // if (!isLogen) {
    //   this.$router.push('/')
    // }
  }
}
</script>
<style>
.home_content {
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
  background: none repeat scroll 0 0 #f0f5fb;
}
.home_content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.home_content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #cdd5de;
}

.home_content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  /* border-radius: 10px; */
  background: #f0f5fb;
}
</style>


