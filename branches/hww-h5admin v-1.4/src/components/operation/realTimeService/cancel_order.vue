<template>
  <div class="post_msg_box" v-loading="loading">
    <header class="p-header">
      <cell title="取消订单原因" is-link :value="yuanyin" @click="show=true" />
    </header>
    <section class="p-content">
      <div class="textarea_box">
        <textarea v-model="content" placeholder="请输入备注说明" cols="30" rows="10" @input="_change"></textarea>
      </div>
      <div class="title">注：取消订单后自动退款，如果是剩余次数，退回剩余次数</div>
    </section>
    <footer class="f-botton" @click="cancel_order">
      <button>提交</button>
    </footer>
    <popup v-model="show" position="bottom">
      <picker v-if="show" show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm"></picker>
    </popup>
  </div>
</template>

<script>
import utils from '@/lib/utils'
import cell from 'vant/lib/cell';
import popup from 'vant/lib/popup';
import picker from 'vant/lib/picker';
import 'vant/lib/popup/style';
import 'vant/lib/picker/style';
import 'vant/lib/cell/style';
export default {
  created() {
    document.title = "实时服务管理"
    this.get_msg_list()
    if (this.$route.params.current_item) {
      this.current_item = this.$route.params.current_item
    } else {
      this.$message.error('缺少参数，请返回上级页面，重新操作!')
    }
  },
  components: {
    cell, popup, picker
  },
  watch: {

  },
  computed: {

  },
  data() {
    return {
      lunxun: 0,
      yuanyin: "请选择原因(必填)",
      cancel_order_id: "",
      columns_data: [],
      columns: [],
      show: false,
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
    onCancel() {
      this.show = false
    },
    onConfirm(value, index) {
      this.yuanyin = value
      this.show = false
      this.cancel_order_id = this.columns_data[index].id
      console.log(value);
      console.log(index);

    },
    //   查询系统模板
    async get_msg_list() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA098001001'
        },
        body: {
          type: 1
        }
      }
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.map(i => {
            this.columns.push(i.content)
          })
          this.columns_data = res.data.body.data
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    },
    _change(e) {
      // if (this.content.length > 75) {
      //   this.$message.error('超过字数限制!')
      //   this.content = this.content.substr(0, 75)
      // }
    },
    async cancel_order() {
      if (this.yuanyin == "请选择原因(必填)" || this.yuanyin == "") {
        return this.$message.error(`请选择请选择原因`)
      }
this.lunxun = 0
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001009002'
        },
        body: {
          id: this.current_item.id,
          refundReason: this.yuanyin,
          remark: this.content
        }
      }
      this.loading = true
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          if (res.data.body.data == 4) {
            this.loading = false;
            this.$message({ message: '取消成功', type: 'success' })
            setTimeout(() => {
              this.$router.push({ name: "RTS_order_list" })
            }, 2000)
          } else {
            this.get_code()
          }
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    },
    async get_code() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001009004'
        },
        body: {
          id: this.current_item.id
        }
      }
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          if (res.data.body.data == "SUCCESS") {
            this.loading = false;
            this.$message({ message: '取消成功', type: 'success' })
            setTimeout(() => {
              this.$router.push({ name: "RTS_order_list" })
            }, 2000)
          } else {
            if (this.lunxun >= 10) {
              this.$message.error('查询超时!')
              this.loading = false;
              return
            }
            setTimeout(() => {
              this.get_code()
              this.lunxun++
            }, 6000)
          }
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`)
        }

      } catch (e) {
        console.log(e);
        if (e.message.includes('Network')) {
          this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
        } else {
          this.$message.error(`error： ${e.message}`)
        }
      }
    }

  }
}
</script>

<style lang="scss">
.post_msg_box {
  height: 100%;
  .p-header {
    border-bottom: 1px solid #eee;
  }
  .textarea_box {
    position: relative;
    border-bottom: 1px solid #eee;
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
  }
  .title {
    padding: 20px 16px 8px 16px;
    font-size: 12px;
    color: #888;
  }
  .f-botton {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
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
