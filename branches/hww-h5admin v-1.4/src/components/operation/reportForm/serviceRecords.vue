<template>
	<div class="measure_wrap" v-loading="d_loading">
		<crumbs>
			<div class slot="crumbs">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item>报表中心</el-breadcrumb-item>
					<el-breadcrumb-item>服务记录查询</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</crumbs>
		<searchBox>
			<template slot="searchBox">
				<div class="seek_line search_box">
					<div class>
						<span class="Names">账号:</span>
						<el-input v-model.trim="searchData.mobile" clearable placeholder="输入账号"></el-input>
					</div>
					<div class>
						<span class="Names">姓名:</span>
						<el-input v-model.trim="searchData.nickName" clearable placeholder="输入姓名"></el-input>
					</div>
					<div class>
						<span class="Names">性别:</span>
						<el-select class v-model="searchData.sex" clearable>
							<el-option v-for="item in sex_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">年龄:</span>
						<el-input v-model.trim="searchData.age" clearable placeholder="输入年龄"></el-input>
					</div>
					<div class>
						<span class="Names">地区:</span>
						<area-cascader v-if="is.area" type="all" :level="1" v-model="searchData.area" @change="area_fun" :data="pcaa"></area-cascader>
					</div>
					<div class>
						<span class="Names Names-large">紧急联系电话:</span>
						<el-input v-model.trim="searchData.emergencyTelephone" maxlength="11" clearable placeholder="输入手机号"></el-input>
					</div>
				</div>
				<div class="end-3 search_box braceUp">
					<div class="measure">
						<span class="Names">服务时间</span>
						<el-date-picker v-model="searchData.fuwutime" type="datetimerange" @change="_fuwutime" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</div>
					<div class="duration">
						<span class="Names">服务时长</span>
						<el-input v-model.trim="searchData.serviceDurationMin" clearable placeholder="开始"></el-input>-
						<el-input v-model.trim="searchData.serviceDurationMax" clearable placeholder="结束"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<el-select class v-model="searchData.serviceDurationType" clearable>
							<el-option v-for="item in durationType_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="measure">
						<span class="Names">测量时间</span>
						<el-date-picker v-model="searchData.testtime" :clearable="false" type="datetimerange" @change="_fuwutimes"
						 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</div>
					<div class="duration">
						<span class="Names">测量时长</span>
						<el-input v-model.trim="searchData.lengthMin" clearable placeholder="开始"></el-input>-
						<el-input v-model.trim="searchData.lengthMax" clearable placeholder="结束"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<el-select class v-model="searchData.lengthType" clearable>
							<el-option v-for="item in durationType_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<div class="end-3 search_box">
					<div class>
						<span class="Names">服务医生:</span>
						<el-input v-model.trim="searchData.doctorName" clearable placeholder="服务医生"></el-input>
					</div>
					<div class>
						<span class="Names Names-large">医生所在医院:</span>
						<el-input v-model.trim="searchData.hospitalName" maxlength="11" clearable placeholder="医生所在医院"></el-input>
					</div>
					<div class>
						<span class="Names">服务类型:</span>
						<el-select class v-model="searchData.type" clearable>
							<el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">服务模式:</span>
						<el-select class v-model="searchData.payType" clearable>
							<el-option v-for="item in payTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class>
						<span class="Names">测量结果:</span>
						<el-select v-model="searchData.ecgLevel" clearable>
							<el-option v-for="item in durationResult_list" :key="item.value" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</div>
					<div style="justify-content: flex-end;">
						<el-button type="primary" @click="searchList">查询</el-button>
						<el-button @click="resetData">重置查询条件</el-button>
						<el-button type="primary" @click="exporttables">导出查询结果</el-button>
					</div>
				</div>
			</template>
		</searchBox>

		<div class="form_box" v-loading="loading">
			<el-table :data="tableData">
				<el-table-column label="序号" min-width="30">
					<template slot-scope="scope">
						<p>{{ scope.$index + page.serialnumber }}</p>
					</template>
				</el-table-column>
				<el-table-column label="账号" min-width="70">
					<template slot-scope="scope">
						<p>{{ scope.row.mobile }}</p>
					</template>
				</el-table-column>
				<el-table-column label="姓名" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.nickName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="性别" min-width="30">
					<template slot-scope="scope">
						<p>{{ scope.row.sex | sexFilter }}</p>
					</template>
				</el-table-column>
				<el-table-column label="年龄" min-width="30">
					<template slot-scope="scope">
						<p>{{ scope.row.age }}</p>
					</template>
				</el-table-column>
				<el-table-column label="紧急联系电话" min-width="70">
					<template slot-scope="scope">
						<p>{{ scope.row.emergencyTelephone }}</p>
					</template>
				</el-table-column>
				<el-table-column label="地区" min-width="80">
					<template slot-scope="scope">
						<p>
							{{ scope.row.provName }}{{ scope.row.cityName
              }}{{ scope.row.areaName }}
						</p>
					</template>
				</el-table-column>
				<el-table-column label="服务类型" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.type | f_type }}</p>
					</template>
				</el-table-column>
				<el-table-column label="服务模式" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.payType | f_payType }}</p>
					</template>
				</el-table-column>
				<el-table-column label="服务时间" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.createdAt | f_createdAt }}</p>
					</template>
				</el-table-column>
				<el-table-column label="服务时长" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.serviceDuration | durationFilter }}</p>
					</template>
				</el-table-column>
				<el-table-column label="测量时间" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.takeTime | timeFilter }}</p>
					</template>
				</el-table-column>
				<el-table-column label="测量时长" min-width="60">
					<template slot-scope="scope">
						<p>{{ scope.row.length | durationFilter }}</p>
					</template>
				</el-table-column>
				<el-table-column label="测量结果" min-width="60">
					<template slot-scope="scope">
						<p>{{ scope.row.ecgLevel | f_ecgLevel }}</p>
					</template>
				</el-table-column>
				<el-table-column label="服务医生" min-width="50">
					<template slot-scope="scope">
						<p>{{ scope.row.doctorName }}</p>
					</template>
				</el-table-column>
				<el-table-column label="医生所在医院" min-width="80">
					<template slot-scope="scope">
						<p>{{ scope.row.hospitalName }}</p>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="list_page">
			<el-pagination background layout="prev, pager, next,total,jumper" :page-size="page.size" :current-page="page.num + 1"
			 @current-change="pagechange" :total="page.total"></el-pagination>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import util from "@/lib/util";
import config from "@/lib/global";
import crumbs from "@/components/common/Crumbs";
import {
  formatDay,
  formatDate,
  formatSecond,
  second_todo_date
} from "@/lib/time";
import searchBox from "@/components/common/searchBox";
import { pcaa } from "area-data";
export default {
  components: {
    crumbs,
    searchBox
  },
  created() {
    this.getList();
    var date = new Date().getTime();
    this.searchData.fuwutime = [date - 63072000000, date];
    this.searchData.takeBeginTime = `${formatSecond(this.searchData.testtime[0])}`;
    this.searchData.takeEndTime = `${formatSecond(this.searchData.testtime[1])}`;
  },
  data() {
    return {
      loading: false,
      d_loading: false,
      payTypeList: [
        {
          value: 1,
          name: "单次"
        },
        {
          value: 4,
          name: "套餐"
        }
      ],
      typeList: [
        {
          value: 4,
          name: "图文咨询"
        },
        {
          value: 6,
          name: "心电解读"
        },
        {
          value: 7,
          name: "动态解读"
        }
      ],
      is: {
        area: true
      },
      pcaa,
      tableData: [],
      searchData: {
        mobile: "",
        nickName: "",
        sex: "",
        age: "",
        emergencyTelephone: "",
        type: "",
        payType: "",
        fuwutime: "",
        timeBegin: "",
        timeEnd: "",
        serviceDurationMax: "",
        serviceDurationMin: "",
        serviceDurationType: 1,
        ecgLevel: "",
        testtime: "",
        takeBeginTime: "",
        takeEndTime: "",
        lengthMax: "",
        lengthMin: "",
        lengthType: 1,
        doctorName: "",
        hospitalName: ""
      },
      sex_list: [
        {
          value: "",
          name: "全部"
        },
        {
          value: 0,
          name: "男"
        },
        {
          value: 1,
          name: "女"
        }
      ],
      pattern_list: [
        {
          value: 0,
          name: "全部"
        },
        {
          value: 1,
          name: "快速测量"
        },
        {
          value: 2,
          name: "动态测量"
        },
        {
          value: 3,
          name: "睡眠测量"
        },
        {
          value: 4,
          name: "运动测量"
        }
      ],
      durationType_list: [
        {
          value: 1,
          name: "分钟"
        },
        {
          value: 2,
          name: "小时"
        }
      ],
      durationResult_list: [
        {
          value: "",
          name: "全部"
        },
        {
          value: 0,
          name: "未见异常"
        },
        {
          value: 1,
          name: "疑似异常"
        },
        {
          value: -1,
          name: "导联脱落"
        },
        {
          value: -11,
          name: "数据干扰"
        }
      ],
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      }
    };
  },

		methods: {
			//服务时间
			_fuwutime(val) {
				console.log(val);

				if (val == null) {
					this.searchData.timeBegin = "";
					this.searchData.timeEnd = "";
					return;
				}
				this.searchData.timeBegin = `${formatSecond(val[0])}`;
				this.searchData.timeEnd = `${formatSecond(val[1])}`;
			},

    _fuwutimes(val) {
      console.log(val);
      if (val == null) {
        this.searchData.takeBeginTime = "";
        this.searchData.takeEndTime = "";
        return;
      }
      this.searchData.takeBeginTime = `${formatDay(val[0])} 00:00:00`;
      this.searchData.takeEndTime = `${formatDay(val[1])} 23:59:59`;
    },
    // 搜索查询
    searchList() {
      this.page.num = 0;
      this.getList();
    },
    // 导出查询结果
    async exporttables() {
      let Url = config.developmentUrl.host1 + "file/downService";
      this.d_loading = true;
      let res = await axios({
        url: Url,
        method: "post",
        data: this.searchData,
        responseType: "blob"
      });
      try {
        if (res.data.size > 0) {
          this.d_loading = false;
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute(
            "download",
            `${formatSecond(new Date().getTime())}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        } else {
          this.d_loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.d_loading = false;
        this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
      }
    },
    // 地区选择
    area_fun(val) {
      // this.searchData.provinceId = `${Object.keys(this.searchData.area[0])}000000`
      // this.searchData.cityId = `${Object.keys(this.searchData.area[1])}000000`
      this.searchData.areaId = `${Object.keys(this.searchData.area[2])}000000`;
      // this.searchData.provinceName = this.searchData.area[0][Object.keys(this.searchData.area[0])]
      // this.searchData.cityName = this.searchData.area[1][Object.keys(this.searchData.area[1])]
      // this.searchData.areaName = this.searchData.area[2][Object.keys(this.searchData.area[2])]
    },
    // 重置
    resetData() {
      this.is.area = false;
      this.searchData = {
        mobile: "",
        nickName: "",
        sex: "",
        age: "",
        emergencyTelephone: "",
        type: "",
        payType: "",
        fuwutime: "",
        timeBegin: "",
        timeEnd: "",
        serviceDurationMax: "",
        serviceDurationMin: "",
        serviceDurationType: 1,
        testtime: "",
        takeBeginTime: "",
        takeEndTime: "",
        lengthMax: "",
        lengthMin: "",
        lengthType: 1,
        doctorName: "",
        hospitalName: ""
      };
      var date = new Date().getTime();
      this.searchData.fuwutime = [date - 63072000000, date];
      this.searchData.takeBeginTime = `${formatSecond(this.searchData.testtime[0])}`;
      this.searchData.takeEndTime = `${formatSecond(this.searchData.testtime[1])}`;
      this.page.num = 0;
      this.$nextTick(() => {
        this.is.area = true;
      });
      this.getList();
    },
    //  查看心电
    checkHeart(row) {
      console.log(row);
    },
    pagechange(val) {
      this.page.num = val - 1;
      this.getList();
    },
    async getList() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001009005"
          },
          body: this.searchData
        };
      params.body.pageSize = this.page.size;
      params.body.pageNum = this.page.num;
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.loading = false;
        if (res.data.respHead.respCode === "000") {
          this.tableData = res.data.body.data.datas;
          this.page.total = res.data.body.data.total;
          this.page.serialnumber = 1 + this.page.size * this.page.num;
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.loading = false;
        console.log(e);
        this.$message.error(`error： ${e.message}`);
      }
    }
  },
  filters: {
    sexFilter(val) {
      return val === 0 ? "男" : val === 1 ? "女" : "未指定";
    },
    timeFilter(val) {
      return formatSecond(val);
    },
    durationFilter(val) {
      return second_todo_date(val);
    },
    f_payType(val) {
      let obj = {
        1: "单次",
        4: "套餐"
      };
      return obj[val] || "";
    },
    f_createdAt(val) {
      return formatSecond(val);
    },
    f_type(val) {
      let obj = {
        4: "图文咨询",
        6: "心电解读",
        7: "动态解读"
      };
      return obj[val] || "";
    },
	f_ecgLevel(val) {

		if (val == 0) {
			return "未见异常"
		} else if (val >= 1) {
			return "疑似异常"
		} else if (val == -1) {
			return "导联脱落"
		} else if (val == -11) {
			return "数据干扰"
		}
	}
  }
};
</script>

<style>
	
	.measure_wrap .search_box {
		font-size: 14px;
	}

	.measure_wrap .search_box .el-input {
		display: inline-block;
		/*width: 140px;*/
		height: 30px;
		line-height: 30px;
	}

	.measure_wrap .search_box .el-input__inner {
		/*width: 140px;*/
		height: 30px;
		line-height: 30px;
	}

	.measure_wrap .search_box .duration .el-input__inner {
		width: 75px;
	}

	.measure_wrap .el-input__icon {
		line-height: 30px;
	}

	.measure_wrap .measure .el-input__icon {
		line-height: 22px;
	}

	.measure_wrap .area-select {
		width: 170px !important;
	}

	.measure_wrap .el-date-editor.el-input,
	.measure_wrap .el-date-editor.el-input__inner {
		width: 230px;
	}

	.measure_wrap .measure_btn {
		text-align: right;
	}

	.measure_wrap .measure_btn .el-button {
		padding: 6px 20px;
	}

	.measure_wrap .el-date-editor .el-range-separator {
		line-height: 22px;
	}

	.measure_wrap .search_heart {
		color: #03a9f4;
		cursor: pointer;
	}
	.measure_wrap .braceUp .el-input .el-input__inner{
    width: 100%;
	}
</style>
