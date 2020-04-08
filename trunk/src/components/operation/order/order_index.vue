<template>
  <div class="order_index_wrap">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 搜索 -->
    <searchBox>
      <template slot="searchBox">
        <div class="seek_line">
          <div class>
            <span class="Names">订单号:</span>
            <el-input
              v-model.trim="searchData.orderNo"
              type="tel"
              clearable
              placeholder="输入订单号"
            ></el-input>
          </div>
          <div class>
            <span class="Names">商品名称:</span>
            <el-input
              v-model.trim="searchData.commName"
              clearable
              placeholder="输入商品名称"
            ></el-input>
          </div>
          <div class>
            <span class="Names">订单类型:</span>
            <el-select
              v-model="searchData.type"
              clearable
              style="padding-right:10px;"
            >
              <el-option
                v-for="item in d_status_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class>
            <span class="Names">下单时间:</span>
            <el-date-picker
              v-model="searchData.time1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="picker_fun(1)"
            ></el-date-picker>
          </div>
          <!--<div class>
            <span class="Names">支付时间:</span>
            <el-date-picker
              v-model="searchData.time2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="picker_fun(2)"
            ></el-date-picker>
          </div>-->
        </div>
        <div class="end-3">
          <div class>
            <span class="Names">订单金额:</span>
            <el-input
              v-model.trim="searchData.moneyMins"
              clearable
              placeholder="订单金额"
            ></el-input
            >—
            <el-input
              v-model.trim="searchData.moneyMaxs"
              clearable
              placeholder="订单金额"
            ></el-input>
          </div>
          <div class>
            <span class="Names">折扣金额:</span>
            <el-input
              v-model.number.trim="searchData.discountMin"
              clearable
              placeholder="折扣金额"
            ></el-input
            >—
            <el-input
              v-model.number.trim="searchData.discountMax"
              clearable
              placeholder="折扣金额"
            ></el-input>
          </div>
          <div class>
            <span class="Names">实付金额:</span>
            <el-input
              v-model.trim="searchData.actualPaymentMins"
              clearable
              placeholder="实付金额"
            ></el-input
            >—
            <el-input
              v-model.trim="searchData.actualPaymentMaxs"
              clearable
              placeholder="实付金额"
            ></el-input>
          </div>
          <div class>
            <span class="Names">状态:</span>
            <el-select
              v-model="searchData.status"
              clearable
              style="padding-right:10px;"
            >
              <el-option
                v-for="item in status_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <!--<div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置</el-button>
            <el-button
              type="primary"
              v-if="moduleIds.includes(49)"
              @click="exporttables"
              >导出</el-button
            >
          </div>-->
        </div>
        <div class="end-4">
        	<div class>
            <span class="Names">支付时间:</span>
            <el-date-picker
              v-model="searchData.time2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="picker_fun(2)"
            ></el-date-picker>
          </div>
          <div class>
            <span class="Names">用户号码:</span>
            <el-input
              v-model.trim="searchData.mobile"
              type="tel"
              clearable
              placeholder="输入电话号码"
            ></el-input>
          </div>
          
          <div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置</el-button>
            <el-button
              type="primary"
              v-if="moduleIds.includes(49)"
              @click="exporttables"
              >导出</el-button
            >
          </div>
        </div>
      </template>
    </searchBox>
    <!-- 列表 -->
    <template>
      <el-table :data="tableData" class v-loading="loading">
        <el-table-column label="序号" min-width="30">
          <template slot-scope="scope">
            <p>{{ scope.$index + page.serialnumber }}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单号" min-width="90">
          <template slot-scope="scope">
            <p>{{ scope.row.orderNo }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.commName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.type | f_type }}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户号码" min-width="80">
          <template slot-scope="scope">
            <p>{{ scope.row.mobile }}</p>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" min-width="80">
          <template slot-scope="scope">
            <p>{{ scope.row.createdAt | f_time }}</p>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" min-width="80">
          <template slot-scope="scope">
            <p>{{ scope.row.timeEnd | f_time }}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.price | f_price }}</p>
          </template>
        </el-table-column>
        <el-table-column label="折扣" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.discount }}</p>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.value | f_price }}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="70">
          <template slot-scope="scope">
            <p>{{ scope.row.status | f_status }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="85">
          <template slot-scope="scope">
            <span
              class="operation"
              v-if="moduleIds.includes(37)"
              @click="query_ecg_details(scope.row)"
              >查看详情</span
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <div class="list_page">
      <el-pagination
        background
        layout="prev, pager, next,total,jumper"
        :page-size="page.size"
        :current-page="page.num+1"
        @current-change="pagechange"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import util from '@/lib/util'
import config from "@/lib/global";
import crumbs from '@/components/common/Crumbs'
import { formatDay, formatDate, formatSecond } from '@/lib/time'
import searchBox from '@/components/common/searchBox'
export default {
	watch:{
		"searchData.moneyMins": function(val) {
		  this.searchData.moneyMins = val.replace(/[^\d\.]/g, "");
		},
		"searchData.moneyMaxs": function(val) {
		  this.searchData.moneyMaxs = val.replace(/[^\d\.]/g, "");
		},
		"searchData.discountMin": function(val) {
		  this.searchData.discountMin = val.replace(/[^\d\.]/g, "");
		},
		"searchData.discountMax": function(val) {
		  this.searchData.discountMax   = val.replace(/[^\d\.]/g, "");
		},
		"searchData.actualPaymentMins": function(val) {
		  this.searchData.actualPaymentMins  = val.replace(/[^\d\.]/g, "");
		},
		"searchData.actualPaymentMaxs": function(val) {
		  this.searchData.actualPaymentMaxs  = val.replace(/[^\d\.]/g, "");
		},
	},
  created() {
  	var date = new Date().getTime()
		this.searchData.time1 = [date - 63072000000,date]
		
    this.get_list()
    this.moduleIds = JSON.parse(localStorage.getItem("hw_login_data")).moduleIds
  },
  components: {
    crumbs, searchBox
  },
  
  data() {
    return {
      moduleIds: [],
      open_loading: null,
      tableData: [],
      status_list: [
        {
          value: "",
          name: '全部'
        },
        {
          value: 0,
          name: '支付中'
        },
        {
          value: 1,
          name: '支付成功'
        },
        {
          value: 2,
          name: '支付失败'
        },
        {
          value: 3,
          name: '已发货'
        },
        {
          value: 4,
          name: '订单过期关闭'
        },
        {
          value: 5,
          name: '取消'
        },
        {
          value: 6,
          name: '退款'
        },
        {
          value: "7",
          name: '已升级续费'
        },
        {
          value: "8",
          name: '运营中心关闭'
        },
      ],
      is: {},
      searchData: {
        moneyMin: "",
        moneyMax: "",
        discountMin: "",
        discountMax: "",
        actualPaymentMin: "",
        actualPaymentMax: "",
        moneyMins: "",
        moneyMaxs: "",
        discountMins: "",
        discountMaxs: "",
        actualPaymentMins: "",
        actualPaymentMaxs: "",
        paymentBegin: "",
        paymentEnd: "",
        placeAnOrderBegin: "",
        placeAnOrderEnd: "",
        type: "",
        orderNo: "",
        commName: "",
        mobile:"",
        time1:[]
      },
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      },
      d_status_list: [
        {
          value: "",
          name: "全部"
        },
        {
          value: 4,
          name: "图文咨询"
        },
        {
          value: 6,
          name: "人工解读"
        }
      ]//全部/图文咨询/人工解读/详细报告
    }
  },
  methods: {
    // 翻页
    pagechange(val) {
      this.page.num = val - 1
      this.get_list()
    },
    query_ecg_details(row) {
      //open_order
      console.log(row)
      this.$router.push({ name: "open_order", params: { row,id:row.id } })
    },
    //   查询列表
    async get_list(num) {
    	if (this.searchData.time1 == null) {
		    		this.searchData.placeAnOrderBegin = ''
		    		this.searchData.placeAnOrderEnd = ''
		    		return
		    	}else{
		    		this.searchData.placeAnOrderBegin = formatDay(this.searchData.time1[0]) + ' ' + '00:00:00'
		    		this.searchData.placeAnOrderEnd = formatDay(this.searchData.time1[1]) + ' ' + '23:59:59'
		    	}
      num >= 0 ? this.page.num = num : ""
      if (this.searchData.moneyMins && this.searchData.moneyMaxs) {
        this.searchData.moneyMin = Number(this.searchData.moneyMins) * 100
        this.searchData.moneyMax = Number(this.searchData.moneyMaxs) * 100
      }else{
      	this.searchData.moneyMin = ''
        this.searchData.moneyMax = ''
      }
      if (this.searchData.actualPaymentMaxs && this.searchData.actualPaymentMins) {
        this.searchData.actualPaymentMax = Number(this.searchData.actualPaymentMaxs) * 100
        this.searchData.actualPaymentMin = Number(this.searchData.actualPaymentMins) * 100
      }else{
      	this.searchData.actualPaymentMax = ''
        this.searchData.actualPaymentMin = ''
      }
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001005001'
        },
        body: this.searchData
      }
      params.body.pageSize = this.page.size
      params.body.pageNum = this.page.num
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.tableData = res.data.body.data.datas;
          this.page.total = res.data.body.data.total
          this.page.serialnumber = 1 + this.page.size * this.page.num;
        } else {
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
    },
    // 重置
    reset_search() {
    	var date = new Date().getTime()
      this.searchData = {
        moneyMin: "",
        moneyMax: "",
        discountMin: "",
        discountMax: "",
        actualPaymentMin: "",
        paymentBegin: "",
        paymentEnd: "",
        placeAnOrderBegin: "",
        placeAnOrderEnd: "",
        type: "",
        orderNo: "",
        commName: "",
        mobile: "",
        time1: [date - 63072000000,date],
      }
      this.get_list(0)
    },
    openFullScreen() {
      this.open_loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
      }, 2000);
    },
    // 导出
    async exporttables() {
      let Url = config.developmentUrl.host1 + "file/downOrder";
      this.openFullScreen()
      let res = await axios({
        url: Url,
        method: 'post',
        data: this.searchData,
        responseType: "blob"
      })
      console.log(res)
      try {
        this.open_loading.close();
        if (res.data.size > 0) {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `${formatSecond(new Date().getTime())}.xlsx`);
          document.body.appendChild(link);
          link.click();
        } else {
          this.open_loading.close();
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        this.open_loading.close();
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    },
    // 时间操作
    picker_fun(type) {
      if (type === 1) {
        if (this.searchData.time1.length > 0) {
          this.searchData.placeAnOrderBegin = formatSecond(this.searchData.time1[0])
          this.searchData.placeAnOrderEnd = formatSecond(this.searchData.time1[1])
        } else {
          this.searchData.placeAnOrderBegin = ""
          this.searchData.placeAnOrderEnd = ""
        }
      } else {
        if (this.searchData.time2.length > 0) {
          this.searchData.paymentBegin = formatSecond(this.searchData.time2[0])
          this.searchData.paymentEnd = formatSecond(this.searchData.time2[1])
        } else {
          this.searchData.paymentBegin = ""
          this.searchData.paymentEnd = ""
        }
      }
    }
  },
  filters: {
    f_status(val) {
      let status_list = ['支付中', '支付成功', '支付失败', '已发货', '订单过期关闭', '取消', '退款', '已升级续费', '运营中心关闭']
      return status_list[val] || ""
    },
    f_type(val) {
      return val === 4 ? "图文咨询" : val === 6 ? "人工解读" : ''
    },
    f_time(val) {
      return formatSecond(val)
    },
    f_price(val) {
      return `${val / 100}元`
    }
  }
}
</script>

<style lang="scss">
.order_index_wrap {
  .operation {
    color: #0099ff;
    cursor: pointer;
    padding: 0 8px;
  }
}
.order_index_wrap .end-4{
	 display: flex;
	 flex-wrap: wrap;
	 width: 100%;
	 margin-bottom: 10px;
	 justify-content: space-between;
	 align-items: center;
}
.end-4>div{
	display: flex;
	flex: 1;
	align-items: center;
}
</style>
