<template>
  <div class="regBox" :style="style">
    <header class="titles">
      <div class="img_box">
        <img src="./logo_helowin.png" alt />
      </div>运营管理系统
    </header>
    <div class="regFrom">
      <div class="phoneBox">
        <p class="title">账号</p>
        <!-- @keyup="proving1('account')" -->
        <input type="text" v-model="login.account" placeholder="请输入账号" />
      </div>
      <div class="phoneBox">
        <p class="title">密码</p>
        <input type="password" v-model="login.password" placeholder="请输入密码" />
      </div>
    </div>
    <div class="regBtn">
      <button
        class="regBotton"
        type="button"
        @click="submitForm"
        :class="{hide_code:hide_codes}"
        :disabled="hide_codes"
      >{{regMsg}}</button>
    </div>
  </div>
</template>

<script>
import baseUrl from '@/lib/global'
import toast from 'vant/lib/toast';
import 'vant/lib/toast/style';
import axios from 'axios'
export default {
  created() {
    document.title = "实时服务管理"
    if (localStorage.getItem("RTS_token")) {
      this.$router.push({ name: "RTS_order_list" })
    }
  },
  components: {},
  watch: {
  },
  data() {
    return {
      regMsg: '登陆',
      phone: '', //手机号
      phoneCode: false, //手机号
      login: {
        account: "",
        password: ""
      },
      height: 0,
      hide_codes: false //按钮不可点击
    }
  },
  mounted() {
    this.setHeight()

  },
  computed: {
    style() {
      return {
        height: this.height + 'px'
      }
    }
  },
  methods: {
    //输入校验
    proving1(name) {
      this.login[name] = this.login[name].replace(/[^\.\d]/g, '');
      this.login[name] = this.login[name].replace('.', '');
    },
    // 注册提交
    async submitForm(name) {
      const url = `${baseUrl.developmentUrl.host2}/dwa/login`

      if (this.login.account === "") {
        return toast('请填写账号');
      }

      if (this.login.password === "") {
        return toast('请填写密码');
      }
      this.hide_codes = true
      this.regMsg = "登陆中···"
      toast.loading({
        mask: true,
        message: '登陆中...'
      });
      try {
        let res = await axios.post(url, this.login)
        toast.clear();
        this.regMsg = "登陆"
        this.hide_codes = false
        console.log(res);
        if (res.data.code === '000') {
          // 清空缓存数据
          localStorage.setItem('RTS_token', res.data.token)
          this.$router.push({ name: "RTS_order_list" })
        } else {
          toast(`${res.data.msg}`);
        }
      } catch (err) {
        toast.clear();
        this.hide_codes = false
        this.regMsg = "登陆"
        if (err.message.includes('Network')) {
          this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
        } else {
          this.$message.error(`${err.msg}`)
        }
      }
    },
    setHeight() {
      this.height = window.innerHeight
    }
  }
}
</script>

<style lang="scss">
.regBox {
  padding: 0 44px;
  background-color: #fff;
  padding-top: 20px;
  box-sizing: border-box;
  .titles {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 20px;
    margin-bottom: 44px;
    .img_box {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
  }
  .regFrom {
    margin-bottom: 56px;
    .phoneBox {
      display: flex;
      flex-direction: column;
      position: relative;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      .title {
        color: #333;
        font-size: 16px;
      }
      & input {
        width: 100%;
        border: 0;
        font-size: 18px;
        margin-top: 10px;
        height: 48px;
        line-height: 48px;
        color: #333;
        padding-left: 5px;
        outline: medium;
      }
      .sendVerification {
        box-sizing: border-box;
        display: inline-block;
        position: absolute;
        right: 0px;
        bottom: 8px;
        color: #fff;
        border-radius: 25px;
        background-color: #4ac995;
        height: 30px;
        line-height: 30px;
        padding: 0 8px;
        min-width: 100px;
        font-size: 12px;
        text-align: center;
        z-index: 999;
      }
      .hide_code {
        background-color: #bbb;
        border: 1px solid #bbb;
      }
    }
  }
  .van-cell {
    margin-bottom: 10px;
  }
  .regBtn {
    // position: fixed;
    // right: 0;
    // left: 0;
    // bottom: 35px;
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
    text-align: center;
    font-size: 12px;
    box-sizing: border-box;
    color: #888;
    .regBotton {
      display: inline-block;
      width: 100%;
      height: 48px;
      border: 0;
      font-size: 16px;
      border-radius: 25px;
      margin-bottom: 15px;
      color: #fff;
      background-color: #fb6522;
    }
    .hide_code {
      background-color: #bbb;
      border: 1px solid #bbb;
    }
    .prompt {
      display: inline-block;
      color: #4ac995;
      padding: 0 5px;
      position: relative;
      box-sizing: border-box;
    }
    .prompt:after {
      content: "";
      display: inline-block;
      position: absolute;
      width: 95%;
      left: 0;
      bottom: -2px;
      background-color: #4ac995;
      height: 1px;
    }
  }
}
</style>
