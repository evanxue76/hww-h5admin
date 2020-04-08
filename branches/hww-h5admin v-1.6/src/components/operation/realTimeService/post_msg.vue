<template>
  <div class="post_msg_box" v-loading="loading">
    <header class="p-header">
      <div class>
        发送对象：{{u_object.name}}
        <span>{{u_object.type_name}}</span>
      </div>
      <div class>手机号码：{{u_object.phone}}</div>
    </header>
    <section class="p-content">
      <div class="textarea_box">
        <textarea v-model="content" placeholder="请输入需要发送的短信内容" cols="30" rows="10" @input="_change"></textarea>
        <span>{{content.length}}/75</span>
      </div>
      <div class="title">常用短信模板</div>
      <div class="msg-list">
        <div class="item" v-for="(i,index) in msg_list" :key="index" @click="_add(i)">
          <div class="text">{{i.content}}</div>
          <div class="icon_box">
            <div class="i-icon">
              <img src="./icon_add.png" alt />
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="f-botton" @click="_post_msg">
      <button>发送</button>
    </footer>
  </div>
</template>

<script>
import utils from '@/lib/utils'
export default {
  created() {
    document.title = "实时服务管理"
    this.get_msg_list()
    if (this.$route.params.current_item) {
      this.current_item = this.$route.params.current_item
      this.value = this.$route.params.value
      if (this.$route.params.value == 1) {
        this.u_object.name = this.current_item.userName
        this.u_object.phone = this.current_item.userPhone
        this.u_object.type_name = "患者"
      } else if (this.$route.params.value == 2) {
        this.u_object.name = this.current_item.doctorName
        this.u_object.phone = this.current_item.doctorPhone
        this.u_object.type_name = "医生"
      }
    } else {
      this.$message.error('缺少参数，请返回上级页面，重新操作!')
    }
  },
  components: {

  },
  watch: {

  },
  computed: {

  },
  data() {
    return {
      u_object: {
        name: "",
        phone: "",
        type_name: ""
      },
      value: null,
      current_item: {},
      loading: false,
      content: "",
      msg_list: []
    }
  },
  methods: {
    //   查询系统模板
    async get_msg_list() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA098001001'
        },
        body: {
          type: 0
        }
      }
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.msg_list = res.data.body.data
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    },
    _add(i) {
      this.content = i.content
    },
    _change(e) {
      if (this.content.length > 75) {
        this.$message.error('超过字数限制!')
        this.content = this.content.substr(0, 75)
      }
    },
    async _post_msg() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001010001'
        },
        body: {
          content: this.content,
          mobile: this.u_object.phone
        }
      }
      this.loading = true
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.content = ""
          this.$message({ message: '发送成功', type: 'success' })
          setTimeout(() => {
            this.$router.push({ name: "RTS_order_list" })
          }, 2000)
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    }
  }
}
</script>

<style lang="scss">
.post_msg_box {
  .p-header {
    padding: 16px;
    padding-bottom: 0;
    & > div {
      margin-bottom: 16px;
    }
    border-bottom: 1px solid #eee;
  }
  .textarea_box {
    position: relative;
    textarea {
      width: 100%;
      box-sizing: border-box;
      border: 0;
      resize: none;
      outline: none;
      padding: 16px;
      padding-bottom: 0;
      font-size: 14px;
      color: #333;
    }
    span {
      position: absolute;
      bottom: 15px;
      right: 16px;
      font-size: 14px;
      color: #888;
    }
  }
  .title {
    background-color: #eee;
    padding: 20px 16px 8px 16px;
    color: #888;
    font-size: 14px;
  }
  .item {
    border-bottom: 1px solid #eee;
    padding: 10px 16px;
    display: flex;
    .text {
      flex: 1;
    }
    .icon_box {
      margin-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .i-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-color: #eee;
      }
      img {
        width: 33px;
        height: 33px;
      }
    }
  }
  .f-botton {
    background-color: #fb6522;
    height: 48px;
    line-height: 48px;
    text-align: center;
    button {
      font-size: 16px;
      color: #fff;
      border: 0;
      background-color: transparent;
    }
  }
}
</style>
