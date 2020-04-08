<template>
  <div class="users_wrap" v-loading="d_loading">
    <div v-if="businessorders">
      <!-- 搜索 -->
      <div class="top">
        <div class="time">
          <span class="pxs">订单日期:</span>
          <el-date-picker
            v-model="searchData.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="input-class"
            @change="shijian"
          ></el-date-picker>
        </div>
        <div class="input ">
          <span class="Names pxs">订单金额:</span>
          <el-select v-model="searchData.terminalType" @change="qudao" clearable>
            <el-option
              v-for="item in terminalTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="yuan">
            <input maxlength="11" v-model="searchData.yuan" class="yuans" @blur="qudaos" />
            <span class=" pxs">元</span>
          </div>
        </div>
        <div class="inputss">
          <span class="Names pxs">渠道商名称:</span>
          <el-input v-model.trim="searchData.channelBusiness" clearable class="inputas"></el-input>
        </div>
        <div class="inputss ">
          <span class="Names pxs">渠道商联系人:</span>
          <el-input v-model.trim="searchData.channelPeople" clearable class="inputas"></el-input>
        </div>
        <div class="inputss">
          <span class="Names pxs">好络维对接人:</span>
          <el-input v-model.trim="searchData.helowinPeople" clearable class="inputas"></el-input>
        </div>
        <div style="btn">
          <el-button type="primary" @click=" search(0)">查询</el-button>
          <el-button type="primary" @click="show">新增</el-button>
          <el-button type="primary" @click="reset">重置查询条件</el-button>
        </div>
      </div>
      <template>
        <el-table :data="tableData" class="ad">
          <el-table-column label="序号"  type='index'>
            <!--<template slot-scope="scope">
              <p>{{ scope.$index + page.serialnumber }}</p>
            </template>-->
          </el-table-column>
          <el-table-column label="渠道商名称" >
            <template slot-scope="scope">
              <p>{{scope.row.channelBusiness }}</p>
            </template>
          </el-table-column>
          <el-table-column label="渠道商联系人">
            <template slot-scope="scope">
              <p>{{scope.row.channelPeople }}</p>
            </template>
          </el-table-column>
          <el-table-column label="好络维对接人">
            <template slot-scope="scope">
              <p>{{scope.row.helowinPeople }}</p>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="scope">
              <p>{{scope.row.price }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <span
                class="operation"
                style="cursor:pointer;"
                @click="quer(scope.row.id,scope.row)"
              >查看详情</span>
              <span class="operation detail-operation" style="cursor:pointer;" @click="del_item(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      	<div class="list_page">
			<el-pagination background layout="prev, pager, next,total,jumper" :page-size="page.size" :current-page="page.num+1"
			 @current-change="pagechange" :total="page.total"></el-pagination>
		</div>
    </div>
    <div>
      <businessadditions v-if="is.businessadditions" @quxiao="quxiao" @yinchang="yinchang"></businessadditions>
      <businesspage v-if="is.businesspage" :chuan="this.rows" @quxialem="quxialem" @xiugai="xiugai" @kukua="kukua"></businesspage>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import axios from "axios";
import config from "@/lib/global";
import { pcaa } from "area-data";
import crumbs from "@/components/common/Crumbs";
import searchBox from "@/components/common/searchBox";
import tudanModal from "@/components/operation/banner/tudan_modal";
import { formatDay, formatDate, formatSecond } from "@/lib/time";
import businessadditions from "./businessadditions";
import businesspage from "./businesspage";

import Bus from "./Bus";
import { parse } from 'path';
export default {
  created() {
    this.qunbus = JSON.parse(localStorage.getItem("quanbu"));
    this.channelid = this.qunbus.id;
    this.qingqiu()
  },
  components: {
    crumbs,
    searchBox,
    tudanModal,
    businessadditions,
    businesspage
  },

  data() {
    return {
      is: {
        repeats:false,
        businessInformation: true,
        businessorders: true,
        businessadditions: false,
        businessxiangqiang: false,
        businesspage: false
      },
      businessorders: true,
      tableData: [],
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      },
      channelid: "",
      searchData: {
        time: "",
        placeAnOrderBegin: "",
        placeAnOrderEnd: "",
        terminalType: "",
        moneyMax: "",
        moneyMin: "",
        yuan: "",
        channelBusiness: "",
        channelPeople: "",
        helowinPeople: ""
      },
      qunbus: null,
      terminalTypeList: [
        {
          value: "-1",
          name: "全部"
        },
        {
          value: "0",
          name: "大于等于"
        },
        {
          value: "1",
          name: "小于等于"
        }
      ],
      is: {
        area: true
      },
      d_loading: false,
      rows: "",
      id: null
    };
  },
  methods: {
    kukua(){
      this.is.businesspage=false,
      this.businessorders = true,
      this.qingqiu()
    },
    async qingqiu(){
      let Url = "",
        params={
          reqHead:{
            functionId: "DWA001014002"
          },
          body:{
            channelid: this.channelid,
            pageSize:this.page.size,
            pageNum :this.page.num
          }
        }
        try{
          let res = await util.ajax.post(Url,params);
              this.tableData = res.data.body.data.datas;
              this.page.total = res.data.body.data.total;
              this.page.pageSize = res.data.body.data.pageSize;
        }catch(e){}
    },
    xiugai() {
      (this.is.businesspage = false), (this.businessorders = true);
      this.qingqiu()
    },
    yinchang() {
      (this.is.businessadditions = false), (this.businessorders = true);
      this.qingqiu()
    },
    quxialem() {
      (this.is.businesspage = false), (this.businessorders = true);
    },
    quxiao() {
      (this.is.businessadditions = false), (this.businessorders = true);
    },
    del_item(id) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001014004"
          },
          body: { id }
        };
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        util.ajax.post(Url, params).then(res => {
          if (res.data.respHead.respCode === "000") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.qingqiu();
          } else {
            this.$message.error(`${res.data.respHead.respMsg}`);
          }
        });
      });
    },
    reset() {
      let obj = this.searchData;
      for (var item in obj) {
        this.searchData[item] = "";
      }
      this.qingqiu();
    },
    async search(num) {
      num >= 0 ? (this.page.num = num) : "";
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001014002"
          },
           body: {
             channelBusiness: this.searchData.channelBusiness,
             channelPeople:this.searchData.channelPeople,
             helowinPeople:this.searchData.helowinPeople,
             moneyMax:this.searchData.moneyMax,
             moneyMin:this.searchData.moneyMin,
             placeAnOrderBegin:this.searchData.placeAnOrderBegin,
             placeAnOrderEnd:this.searchData.placeAnOrderEnd
          }
        };
      params.body.pageSize = this.page.size;
      params.body.pageNum = this.page.num;
      params.body.channelid = this.channelid;
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          
          this.loading = false;
          this.tableData = res.data.body.data.datas;
          this.page.total = res.data.body.data.total;
          // this.page.serialnumber = 1 + this.page.size * this.page.num;
            this.page.pageSize = res.data.body.data.pageSize;
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    pagechange(val) {
      this.page.num = val - 1;
      this.search();
    },
    qudaos() {
      if (this.searchData.terminalType == "0") {
        this.searchData.moneyMax = this.searchData.yuan;
      }
      if (this.searchData.terminalType == "1") {
        this.searchData.moneyMin = this.searchData.yuan;
      }
    },
    qudao() {
      if (this.searchData.terminalType == "0") {
        this.searchData.moneyMax = this.searchData.terminalType;
        this.searchData.moneyMin = "";
        this.searchData.yuan = "";
      }
      if (this.searchData.terminalType == "1") {
        this.searchData.moneyMin = this.searchData.terminalType;
        this.searchData.moneyMax = "";
        this.searchData.yuan = "";
      }
      if (this.searchData.terminalType == "-1") {
        (this.searchData.moneyMax = ""),
          (this.searchData.moneyMin = ""),
          (this.searchData.yuan = "");
      }
    },
    shijian() {

      this.searchData.placeAnOrderBegin = formatSecond(this.searchData.time[0]) ;
      this.searchData.placeAnOrderEnd = formatSecond(this.searchData.time[1]) ;
    },
    show() {
      this.$emit("sendValueToParent");
      this.businessorders = false;
      this.is.businessadditions = true;
    },
    quer(id, row) {
      this.rows = row;
      this.businessorders = false;
      this.is.businesspage = true;
    },
  }
};
</script>

<style scoped>
.top {
	margin-top: 20px;
  display: flex;
   flex-wrap: wrap;
}
.users_wrap .el-date-editor--datetimerange.el-input__inner {
  width: 200px;
}
.input {
  display: flex;
  margin: 0 20px;
}
.yuan {
  display: flex;
  width: 90px;
  margin-left: 20px;
}
.yuans {
  width: 100%;
  height: 34px;
}
.inputss {
  display: flex;
  margin: 0 10px;
}
.inputas {
  width: 120px;
}
.operation{
	color: #409EFF;
}
.detail-operation{
	display: inline-block;
	margin-left: 8px;
}

.pxs{
	height:50px;
	line-height: 50px;
}
</style>
