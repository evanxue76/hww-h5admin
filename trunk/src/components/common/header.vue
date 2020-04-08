<template>
  <header class="adminHeader">
    <div class="adminHeaderLogo">
      <div class="logoBox">
        <img class="user-logo" src="./../../assets/image/logo.png">
      </div>
      <div class="logo">心知了运营管理平台</div>
    </div>
    <!-- <div class="adminHeaderNav">
      <div v-for="(item,index) in show_list" class="adminHeaderNavListBox" :key="index">
        <span
          v-if="item.mark"
          class="adminHeaderNavList"
          :class="{bg:changeBg == index}"
          @click="choiceState(index),onRoutes(item.index,item.center)"
        >{{item.title}}</span>
      </div>
    </div>-->
    <div class="adminHeaderUser">
      <div class="user-info">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <img class="user-logo" src="./../../assets/image/logo.png">
            {{name}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="user_info">个人信息</el-dropdown-item>
            <el-dropdown-item command="loginout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  created() {
    this.selects();
    this.hw_login_data = JSON.parse(localStorage.getItem("hw_login_data"))
    this.name = this.hw_login_data.account
    // this.getRouterVal();
    // this.get_userName()
  },
  mounted() {
    this.limit();
  },
  data() {
    return {
      name: "",
      activeIndex: "6",
      changeBg: -1,
      show_list: [],
      items: [
        {
          index: "/home",
          center: "userCenter",
          title: "系统中心",
          id: 1,
          mark: false,
          disable: false
        },
        {
          index: "/eventManage",
          center: "operateCenter",
          title: "运营中心",
          id: 2,
          mark: false,
          disable: false
        },
        {
          index: "/reportCenter",
          center: "statisticsCenter",
          title: "报表中心",
          id: 3,
          mark: false,
          disable: false
        },
        {
          index: "/heartCheck",
          center: "checkCenter",
          title: "审核中心",
          id: 95,
          mark: false,
          disable: false
        },
        {
          index: "/orderManage",
          center: "orderCenter",
          title: "订单中心",
          id: 97,
          mark: false,
          disable: false
        }
      ]
    };
  },
  methods: {
    get_userName() {
      this.name = this.$cookie.get("manageUserName") || ''
    },
    getRouterVal() {
      console.log(this.$route);
      if (!this.$route.query.changeBg) {
        return;
      }
      this.changeBg = this.$route.query.changeBg;
    },
    handleCommand(command) {
      if (command === "loginout") {
        localStorage.removeItem('hw_login_data')
        this.$router.push("/");
      }else{
        this.$router.push({name:"user_info"});
      }
    },
    onRoutes(index, center) {
      this.$router.push({ path: index, query: { index: center } });
    },
    choiceState(index) {
      this.changeBg = index;
      let num = index;
      sessionStorage.setItem("page", num);
    },
    selects() {
      let selects = sessionStorage.getItem("page");
      if (selects) {
        this.changeBg = selects;
      } else {
        //				this.changeBg = this.items.length - 1;
        this.changeBg = 0;
      }
    },
    // 设置一级导航
    limit() {
      let arr = localStorage.getItem("manageLimit");
      if (arr == null) {
        arr = "[]";
      }
      let isSystem = localStorage.getItem("manageSystem");
      arr = JSON.parse(arr);
      if (isSystem == "1") {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].mark = true;
          this.show_list.push(this.items[i])
        }
      } else {
        for (var i = 0; i < this.items.length; i++) {
          let id = this.items[i].id;
          if (arr.indexOf(id) == -1) {
            //console.log(this.items.splice(i,1))
          } else {
            this.items[i].mark = true;
            this.show_list.push(this.items[i])
          }
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.adminHeader {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #000000;
  background-color: #fff;
  .adminHeaderLogo {
    flex: 1;
    display: flex;
    min-width: 410px;
    color: #fff;
    .logoBox {
      flex: 0 0 10%;
      max-width: 120px;
    }
  }
  .adminHeaderNav {
    flex: 1;

    .adminHeaderNavListBox {
      flex: 1;
      text-align: center;
      border-left: 1px solid #ddd;
      .adminHeaderNavList {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        color: #59607d;
        font-size: 16px;
        position: relative;
        cursor: pointer;
        &.bg {
          color: #55d0d2;
          font-weight: bold;
          border-bottom: 3px solid #55d0d2;
        }
        &:hover {
          color: #55d0d2;
          border-bottom: 3px solid #55d0d2;
        }
        &:focus {
          color: #55d0d2;
          border-bottom: 3px solid #55d0d2;
        }
      }
    }
  }
  .adminHeaderUser {
    flex: 0 0 20%;
  }
}

.adminHeader .logo {
  /*float: left;
  width: 280px;
  text-align: center;*/
  color: #000;
}

.user-logo {
  position: absolute;
  left: 30px;
  top: 10px;
  width: 40px;
  height: 40px;
  /*border-radius: 50%;*/
}

.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #fff;
  color: #55d0d2;
}

.user-info .el-dropdown-link {
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #000000;
  cursor: pointer;
  vertical-align: middle;
}

.user-info .user-logo {
  position: absolute;
  left: 0;
  top: 10px;
  width: 40px;
  height: 40px;
  /*border-radius: 50%;*/
}

.el-dropdown-menu__item {
  text-align: center;
}
.adminHeaderNav {
  display: flex;
}

.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  /*background: #f37327;*/
}
.adminHeader .el-button:hover {
  /*background-color: #f37327;*/
}
.adminHeader .el-button:focus {
  /*background: rgba(0, 0, 0, 0.3);*/
  color: #55d0d2;
  font-weight: bold;
}
</style>