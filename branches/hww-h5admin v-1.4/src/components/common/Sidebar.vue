<template >
  <div
    class="sidebar_wrap"
    @mouseenter="enter"
    @mouseleave="leave()"
    ref="sidebar_wrap"
    :class="{enterStatus:enterStatus,leaveStatus:leaveStatus}"
  >
    <!-- :default-active="defaultIndex" -->
    <el-menu class="el-menu-vertical-demo" theme="dark" unique-opened :unique-opened="true">
      <!-- v-if="defaultAct == item.mark" -->
      <template v-for="item in items">
        <!-- 多级导航 -->
        <template v-if="item.show">
          <el-submenu v-if="item.subs" :index="item.index" :key="item.key">
            <template slot="title">
              <i :class="item.icon"></i>
              {{ item.title }}
            </template>
            <!-- 二级 -->
            <el-menu-item
              v-for="(subItem,i) in item.subs"
              @click="itemClick(subItem.index,item.mark)"
              :key="i"
              :index="subItem.index"
              v-if="subItem.show"
            >{{ subItem.title }}</el-menu-item>
          </el-submenu>
          <!-- 单级导航 -->
          <el-menu-item
            v-else
            :index="item.index"
            :key="item.key"
            @click="itemClick(item.index,item.mark)"
          >
            <i :class="item.icon"></i>
            {{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import items from "@/lib/menu_item";
export default {
  data() {
    return {
      enterStatus: false,
      leaveStatus: false,
      items
    };
  },
  created() {
    this.limit();
    // let selects = sessionStorage.getItem('page')
    // if (!selects) {
    //   //		this.$router.push({path: '/heartCheck', query: {index: 'checkCenter'}})
    //   this.$router.push({ path: '/home', query: { index: 'userCenter' } })
    // }
  },
  methods: {
    // 鼠标移入
    enter() {
      this.enterStatus = true;
      this.leaveStatus = false;
    },
    // 鼠标移出
    leave() {
      this.enterStatus = false;
      this.leaveStatus = true;
    },
    itemClick(index, center) {
      this.$router.push({ name: index, query: { index: center } });
    },
    limit() {
      let arr = JSON.parse(localStorage.getItem("hw_login_data")).moduleIds;
      let isSystem = JSON.parse(localStorage.getItem("hw_login_data")).isSystem;
      let flag = null;

      if (isSystem === 1) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].show = true;
          if (this.items[i].subs) {
            for (let index = 0; index < this.items[i].subs.length; index++) {
              this.items[i].subs[index].show = true;
            }
          }
        }
        return;
      }

      for (let i = 0; i < this.items.length; i++) {
        // 多级菜单循环
        if (this.items[i].subs) {
          let path = {
            index: "",
            url: ""
          };
            this.items[i].show = true;
          for (let index = 0; index < this.items[i].subs.length; index++) {
            if (arr.indexOf(this.items[i].subs[index].id) == -1) {
              this.items[i].subs[index].show = false;
            } else {
              this.items[i].subs[index].show = true;
              if (path.index === "") {
                path.index = index;
                path.url = this.items[i].subs[index].index;
              }
            }
            if (index === this.items[i].subs.length - 1 && path.index != "") {
              this.items[i].index = path.url;
            }
          }
        } else if (arr.indexOf(this.items[i].id) == -1) {
          this.items[i].show = false;
        } else {
          this.items[i].show = true;
           if (this.items[i].id==11) {
             if(arr.includes(36)){
               this.items[i].show = true;
             }else{
               this.items[i].show = false;
             }
            }
          // if (this.items[i].id === 7) {
          //   flag = true
          // }
        }
        // if (i === (this.items.length - 1) && flag) {
        //   this.items[5].show = true
        //   this.items = Object.assign({}, this.items)
        // }
      }
    }
  },
  computed: {
    defaultIndex() {
      let pathIndex = this.$route.path;
      if (pathIndex == "/checkOperate" || pathIndex == "/heartDetails") {
        pathIndex = "/heartCheck";
      } else if (pathIndex == "/accountCreate") {
        pathIndex = "/accountManage";
      } else if (pathIndex == "/permissionCreate") {
        pathIndex = "/permissionManage";
      } else if (pathIndex == "/adCreate") {
        pathIndex = "/adManage";
      } else if (pathIndex == "/eventEditor" || pathIndex == "/eventCreat") {
        pathIndex = "/eventManage";
      } else if (
        pathIndex == "/compre" ||
        pathIndex == "/bloodPressAssess" ||
        pathIndex == "/bloodSugarAssess" ||
        pathIndex == "/cholesterolAssess" ||
        pathIndex == "/sleepAssess" ||
        pathIndex == "/uricAcidAssess" ||
        pathIndex == "/urineSugarAssess"
      ) {
        pathIndex = "/oldManage";
      } else if (pathIndex == "/orderDetail") {
        pathIndex = "/orderManage";
      }
      return pathIndex;
    },
    defaultAct() {
      return this.$route.query.index;
    }
  }
};
</script>

<style lang="scss">
.sidebar_wrap {
  width: 200px;
  /*height: 100%;*/
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background: #57607d;
  overflow: hidden;
  & > ul {
    // overflow: scroll;
  }
  .el-menu {
    background: #57607d !important;
    box-sizing: border-box;
    border-right: 0;
    // .el-menu-item {
    /*border-left: 5px solid transparent;*/
    // }
    .is-active {
      color: #fff;
      background-color: #4c5671;
      // border-left: 5px solid #42c9cc;
    }
  }
  .el-submenu {
    .el-menu-item {
      background: #1f2d3d;
      color: #ced4e4;
      border-left: 5px solid transparent;
    }
    .el-submenu__title {
      color: #bfcbd9;
    }
  }
}
.sidebar_wrap .el-menu-item:hover {
  background: #48576a !important;
}
.sidebar_wrap .el-menu-item,
.sidebar_wrap .el-submenu__title {
  color: #bfcbd9 !important;
}
.sidebar_wrap .el-menu-item:focus {
  background: #324157 !important;
}
.sidebar_wrap::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.sidebar_wrap::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #4c5671;
}
.sidebar_wrap::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #f0f5fb;
}
.enterStatus {
  overflow-y: auto;
}
.leaveStatus {
  overflow: hidden;
}
.sidebar_wrap .el-submenu__title:hover {
  background: #48576a;
}
</style>
