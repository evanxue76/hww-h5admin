<template>
  <div class="business_details">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>渠道商管理</el-breadcrumb-item>
          <el-breadcrumb-item>渠道商详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <div class="business_box">
      <div class="business_tab">
        <span
          v-for="(item,index) in tabData"
          :key="index"
          :class="{'btn_active' : index == activeIndex}"
          class="tab_btn"
          @click="chioceTab(item,index)"
        >{{item.label}}</span>
      </div>
      <businessorder v-if="is.businessorder"></businessorder>
      <!-- <businesspage v-if="is.businesspage" @xiangqiangkan="xiangqiangkan"></businesspage> -->
	  <businessactivation v-if="is.businessactivation"></businessactivation>
      <DetailBox :source="source" v-if="is.businessInformation" :id="row.id"></DetailBox>
	  <codehomepage v-if="is.codehomepage"></codehomepage>	
	   <businessadditions v-if="is.businessadditions"></businessadditions>
	 
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
import DetailBox from "@/components/operation/business/detailBox";
import { formatDay, formatDate, formatSecond } from "@/lib/time";
import businessInformation from "./businessInformation";
import businessorder from "./businessorder";
import businessadditions from "./businessadditions";
import businesspage from "./businesspage";
import businessactivation from "./businessactivation";

import businessDetails from "./businessDetails"
export default {
  components: {
    crumbs,
    searchBox,
    tudanModal,
    businessInformation,
    businessorder,
    businessadditions,
    DetailBox,
    businesspage,
	businessactivation,
  },
  data() {
    return {
      is: {
        businessInformation: true,
        businessorder: false,
        businessadditions: false,
        businessxiangqiang:false,
        businesspage:false,
		businessactivation:false,
		
		
      },
      source: 2,
      tabData: [
        {
          id: 0,
          label: "渠道商信息",
          code: true
        },
        {
          id: 1,
          label: "进货订单",
          code: false
        },
        {
          id: 2,
          label: "医生分成订单",
          code: false
        },
        {
          id: 3,
          label: "医生列表",
          code: false
        },
        {
          id: 4,
          label: "结算管理",
          code: false
        },
		{
		  id: 5,
		  label: "激活码管理",
		  code: false
		},
      ],
      activeIndex: 0,
      row: {
        id: null
      },
    };
  },
  created() {
    if (this.$route.params.row) {
      this.row = this.$route.params.row
       localStorage.setItem("quanbu",JSON.stringify(this.$route.params.row))
      console.log(111,this.row);
     
      this.row = this.$route.params.row;
      localStorage.setItem('businessId',this.row.id)
    }
  },
  methods: {
    // xiangqiangkan(){
    //     console.log(125)
    //     this.is.businesspage = true   
    // },
    // 选择tab页
    chioceTab(item, index) {
      console.log(index);
      this.activeIndex = index;
      switch (index) {
        case 0:
          this.is.businessInformation = true;
          this.is.businessorder = false;
          this.is.businessadditions = false;
		    this.is.businessactivation = false;
          break
        case 1:
          this.is.businessInformation = false;
          this.is.businessorder = true;
		   this.is.businessadditions = false;
		    this.is.businessactivation = false;
          break
		  case 5:
		  this.is.businessInformation = false;
		  this.is.businessorder = false;
		  this.is.businessadditions = false;
		  this.is.businessactivation = true;
		  break
		
	
      }
    },
  },
  filters: {}
};
</script>

<style >
.business_details .tab_btn {
  box-sizing: border-box;
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #797979;
  margin-left: -1px;
}
.business_details .btn_active {
  box-sizing: border-box;
  background: #169bd5;
  border: 1px solid #169bd5;
  color: #ffffff;
}
</style>