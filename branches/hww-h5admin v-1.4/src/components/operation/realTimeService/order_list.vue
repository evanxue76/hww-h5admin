<template>
  <div class="order_list">
    <header>
      <DropdownMenu active-color="#fb6522">
        <DropdownItem
          v-model="search.serviceType"
          title="服务类型"
          @change="res=>onMenuChange(1,res)"
          :options="option.a1"
        />
        <DropdownItem
          v-model="search.isReply"
          title="服务状态"
          @change="res=>onMenuChange(2,res)"
          :options="option.a2"
        />
      </DropdownMenu>
    </header>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <vant-list
        v-model="list_loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
      >
        <section class="order_list_box">
          <div class="item" v-for="(i,index) in applyList" :key="index">
            <header class="i-header">
              <div class="i-h-brand">
                <span :class="{'type-active':i.serviceType==1}">{{i.serviceType|f_serviceType}}</span>
              </div>
              <div class="i-time">
                <span v-if="i.serviceType==1">响应剩余</span>
                <span v-else>服务剩余</span>
                {{i.SSS}}
              </div>
            </header>
            <section class="i-content">
              <div class="i-info">
                <div class="u-info">
                  <span class="u-name">患者：{{i.userName}}</span>
                  <span class="i-brand" v-if="i.isSigning==0">签约用户</span>
                </div>
                <div class>
                  <span class="u-name">医生：{{i.doctorName}}</span>
                  <span class="i-brand i-brand-active">{{i.doctorAcademicTitle|f_kong}}</span>
                </div>
              </div>
              <div class="icon-box">
                <div class @click="_activation(1,i)">
                  <img src="./icon_call.png" alt />
                </div>
                <div class @click="_activation(2,i)">
                  <img src="./icon_msg.png" alt />
                </div>
                <div class @click="_activation(3,i)">
                  <img src="./icon_more.png" alt />
                </div>
              </div>
            </section>
          </div>
        </section>
      </vant-list>
    </van-pull-refresh>
    <action-sheet
      v-model="is.phone"
      :actions="actions.a1"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel(1)"
    ></action-sheet>
    <action-sheet
      v-model="is.msg"
      :actions="actions.a2"
      cancel-text="取消"
      @select="onSelects"
      @cancel="onCancel(2)"
    ></action-sheet>
    <action-sheet
      v-model="is.ai"
      :actions="actions.a3"
      cancel-text="取消"
      @select="onSelects"
      @cancel="onCancel(3)"
    ></action-sheet>
    <action-sheet
      v-model="is.cancel"
      :actions="actions.a4"
      cancel-text="取消"
      @select="onSelects"
      @cancel="onCancel(4)"
    ></action-sheet>
  </div>
</template>

<script>
import DropdownMenu from 'vant/lib/dropdown-menu';
import DropdownItem from 'vant/lib/dropdown-item';
import popup from 'vant/lib/popup';
import actionSheet from 'vant/lib/action-sheet';
import vanPullRefresh from 'vant/lib/pull-refresh';
import Dialog from 'vant/lib/dialog';
import vantList from 'vant/lib/list';
import toast from 'vant/lib/toast';
import 'vant/lib/toast/style';
import 'vant/lib/dropdown-menu/style';
import 'vant/lib/dropdown-item/style';
import 'vant/lib/popup/style';
import 'vant/lib/action-sheet/style';
import 'vant/lib/pull-refresh/style';
import 'vant/lib/dialog/style';
import 'vant/lib/list/style';
import utils from '@/lib/utils'
import { second_todo_dates } from '@/lib/time'
export default {
  created() {
    document.title = "实时服务管理"
    this.get_list()
  },
  components: {
    DropdownMenu, DropdownItem, popup, Dialog, actionSheet, vanPullRefresh, vantList
  },
  mounted() {
   this.openTiming()
  },
  data() {
    return {
      isLoading: false,
      finished: false,
      list_loading: false,
      actions: {
        a1: [
          { name: '致电用户', value: 1 },
          { name: '致电医生', value: 2 }
        ],
        a2: [
          { name: '给患者发短信', value: 1 },
          { name: '给医生发短信', value: 2 }
        ],
        a3: [
          { name: '转AI解读', value: 8 },
          { name: '取消订单', value: 6 }
        ],
        a4: [
          { name: '取消订单', value: 6 }
        ]
      },
      current_item: {},
      value1: "",
      is: {
        phone: false,
        msg: false,
        ai: false,
        cancel: false
      },
      search: {
        isReply: "",
        pageNum: 0,
        pageSize: 10,
        serviceType: "",
      },
      applyList: [],
      option: {
        a1: [],
        a2: []
      },
      real_time: null,
      real_times: null
    }
  },
  methods: {
    openTiming(){
         this.real_times = setInterval(() => {
      this.onRefresh()
      // clearInterval(this.real_time)
      // this.real_time = null
      // clearInterval(this.real_times)
      // this.real_times = null
      }, 60000)
    },
    onMenuChange(type, val) {
      if (type === 1) {
        this.search.serviceType = val
      } else {
        this.search.isReply = val
      }
      this.search.pageNum = 0
      this.get_list(3)

    },
    // 分页
    onLoad() {
      ++this.search.pageNum
      this.get_list()
    },
    // 下拉刷新
    onRefresh() {
      this.applyList = []
      this.search.pageNum = 0
      this.get_list()
      this.isLoading = true
    },
    // 查询服务记录列表
    async get_list(type) {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001009001'
        },
        body: this.search
      }
      toast.loading({
        mask: true,
        message: '加载中...'
      });
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        this.option.a1 = []
        this.option.a2 = []
        toast.clear()
        this.isLoading = false
        this.list_loading = false
        if (res.data.respHead.respCode === "000") {
          if (type === 3) {
            this.applyList = res.data.body.data.applyList;
          } else {
            this.applyList = this.applyList.concat(res.data.body.data.applyList);
          }
          if (res.data.body.data.applyList.length == 0) {
            this.finished = true
          } else {
            this.finished = false
          }
          this.option.a1.push({ text: `全部(${res.data.body.data.consultationService + res.data.body.data.reportService})`, value: "" })
          this.option.a1.push({ text: `图文咨询(${res.data.body.data.consultationService})`, value: 1 })
          this.option.a1.push({ text: `报告解读(${res.data.body.data.reportService})`, value: 3 })
          this.option.a2.push({ text: `全部(${res.data.body.data.inServiceStatus + res.data.body.data.notStartedStatus})`, value: "" })
          this.option.a2.push({ text: `待服务(${res.data.body.data.notStartedStatus})`, value: 0 })
          this.option.a2.push({ text: `服务中(${res.data.body.data.inServiceStatus})`, value: 1 })

          this._real_time()
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        console.log(e);
        toast.clear()
        this.isLoading = false
        if (e.message.includes('Network')) {
          this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
        } else {
          this.$message.error(`error： ${e.message}`)
        }
      }
    },
    _real_time() {
      clearInterval(this.real_time)
      this.real_time = null
      this.real_time = setInterval(() => {
        this.applyList.forEach((i, index) => {
          i.timeStamp = i.timeStamp - 1000
          // console.log(i.timeStamp);
          i['SSS'] = second_todo_dates(i.timeStamp)
        })
        this.applyList = Object.assign([], this.applyList)
      }, 1000)
    },
    _activation(index, i) {
      console.log(i.serviceType)
      this.current_item = i
      switch (index) {
        case 1:
          this.is.phone = true
          break
        case 2:
          this.is.msg = true
          break
        case 3:
          if (i.serviceType === 1||i.serviceType === 4) {
            this.is.cancel = true
          } else {
            this.is.ai = true
          }
          break
        default:
          return ""
      }
    },
    onSelect(e) {
      let obj = {
        1: `tel:${this.current_item.userPhone}`,
        2: `tel:${this.current_item.doctorPhone}`,
      }
      if (e.value == 1 && !this.current_item.userPhone) {
        this.is.phone = false
        return this.$message("没有该患者的电话号码")
      }
      if (e.value == 2 && !this.current_item.doctorPhone) {
        this.is.phone = false
        return this.$message("没有该医生的电话号码")
      }
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = obj[e.value]
      document.body.appendChild(link);
      link.click();
      this.is.phone = false
    },
    onSelects(e) {
      switch (e.value) {
        case 1:
          if (this.current_item.userPhone) {
            this.$router.push({ name: "RTS_post_msg", params: { current_item: this.current_item, value: e.value } })
          } else {
            this.is.msg = false
            return this.$message("没有该患者的电话号码")
          }
          break;
        case 2:
          if (this.current_item.doctorPhone) {
            this.$router.push({ name: "RTS_post_msg", params: { current_item: this.current_item, value: e.value } })
          } else {
            this.is.msg = false
            return this.$message("没有该医生的电话号码")
          }
          break;
        case 6:
          this.$router.push({ name: "RTS_cancel_order", params: { current_item: this.current_item } })
          break;
        case 8:
          this.is.ai = false
          this._ai_confirm()
          break;
        case 4:
          this.is.cancel = false
          break;
        default:
          return ""
      }
    },
    _ai_confirm() {
      Dialog.confirm({
        message: '确定转AI解读？'
      }).then(() => {
        // on confirm
        this.go_ai()
      }).catch(() => {
        // on cancel
      });
    },
    //报告解读服务转AI
    async go_ai() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001009003'
        },
        body: {
          id: this.current_item.id
        }
      }
      toast.loading({
        mask: true,
        message: '加载中...'
      });
      try {
        let res = await utils.ajax.post(Url, params);
        console.log(res);
        toast.clear()
        if (res.data.respHead.respCode === "000") {
          this.$message({ message: '转AI解读成功', type: 'success' })
          this.search.pageNum = 0
          this.onRefresh()
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        toast.clear()
        console.log(e);
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')

      }
    },
    onCancel(type) {
      switch (type) {
        case 1:
          this.is.phone = false
          break;
        case 2:
          this.is.msg = false
          break;
        case 3:
          this.is.ai = false
          break;
        case 4:
          this.is.cancel = false
          break;
        default:
          return ""
      }
    },
    times_go(mss) {
      let hours = parseInt((mss / (1000 * 60 * 60)));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((mss % (1000 * 60)) / 1000);
      return `${hours}:${minutes}:${seconds}`
    }
  },
  beforeDestroy() {
    clearInterval(this.real_time)
    this.real_time = null
    clearInterval(this.real_times)
    this.real_times = null
  },
  filters: {
    f_kong(val){
      return val?val:"暂未分配医生"
    },
    f_serviceType(val) {
      let obj = {
        1: "图文咨询",
        3: "报告解读(静态)",
        4: "报告解读(动态)"
      }
      return obj[val] || ""
    }
  }
}
</script>

<style lang="scss">
.order_list {
  background-color: #eee;
  height: 100%;
  overflow: auto;
  .order_list_box {
    padding: 8px;
    .item {
      margin-bottom: 8px;
      background-color: #fff;
    }
    .i-time {
      font-size: 14px;
    }
    .i-header {
      display: flex;
      justify-content: space-between;
      height: 30px;
      align-items: center;
      margin-right: 8px;
      margin-bottom: 17px;
      .i-h-brand span {
        display: inline-block;
        font-size: 14px;
        width: 110px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #2f9ddc;
        color: #fff;
      }
      .i-h-brand .type-active {
        background-color: #fb6522;
      }
    }
    .i-content {
      padding: 0 10px;
      font-size: 14px;
      color: #333;
      display: flex;
      padding-bottom: 20px;
      .icon-box {
        flex: 0 0 40%;
        display: flex;
        align-items: center;
        & > div {
          flex: 30%;
          background-color: #f5f5f5;
          border-radius: 50%;
          height: 40px;
          display: flex;
          width: 40px;
          justify-content: center;
          margin-right: 3%;
          align-items: center;
        }
      }
      .i-info {
        flex: 0 0 60%;
      }
    }
    .u-info {
      margin-bottom: 14px;
    }
    .u-name {
      display: inline-block;
      width: 110px;
    }
    .i-brand {
      display: inline-block;
      border: 1px solid #2f9ddc;
      color: #2f9ddc;
      padding: 2px;
      margin-left: 2px;
    }
    .i-brand-active {
      border: 1px solid #fb6522;
      color: #fb6522;
    }
    .icon-box {
      display: flex;
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
  .van-cell--clickable {
    color: #333;
    font-size: 16px;
  }
  .downItem {
    width: 100%;
    text-align: center;
    background-color: #fff;
    .item {
      border-bottom: 1px solid #eee;
      height: 50px;
      line-height: 50px;
    }
    .cancel {
      border-top: 5px solid #eee;
    }
  }
}
</style>
