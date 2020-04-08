<template>
  <div class="users_wrap" v-loading="d_loading">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 搜索 -->
    <searchBox>
      <template slot="searchBox">
        <div class="seek_line">
          <div class>
            <span class="Names">账号:</span>
            <el-input v-model.trim="searchData.mobile" clearable placeholder="输入账号"></el-input>
          </div>
          <div class>
            <span class="Names">昵称:</span>
            <el-input v-model.trim="searchData.nickName" clearable placeholder="输入昵称"></el-input>
          </div>
          <div class>
            <span class="Names">姓名:</span>
            <el-input v-model.trim="searchData.name" maxlength="11" clearable placeholder="输入姓名"></el-input>
          </div>
          <div class>
            <span class="Names">签约医生:</span>
            <el-input v-model.trim="searchData.doctorName" clearable placeholder="输入签约医生"></el-input>
          </div>
        </div>
        <div class="end-3">
          <div class>
            <span class="Names">性别:</span>
            <el-select v-model="searchData.sex" clearable>
              <el-option
                v-for="item in sex_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class>
            <span class="Names Names-large">医生所在医院:</span>
            <el-input v-model.trim="searchData.hospitalName" clearable placeholder="输入医生所在医院"></el-input>
          </div>

          <div class>
            <span class="Names">地区:</span>
            <area-cascader
              v-if="is.area"
              type="all"
              :level="1"
              v-model="searchData.area"
              @change="area_fun"
              :data="pcaa"
            ></area-cascader>
          </div>
          <div class>
            <span class="Names">渠道:</span>
            <el-select v-model="searchData.terminalType" clearable>
              <el-option
                v-for="item in terminalTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="end-3">
          <div class>
            <span class="Names">注册时间:</span>
            <el-date-picker
              v-model="searchData.time"
              @change="res=>_time(res,1)"
              :clearable="false"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class>
            <span class="Names Names-large">最近登录时间:</span>
            <el-date-picker
              v-model="searchData.times"
              @change="res=>_time(res,2)"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class>
            <span class="Names">年龄:</span>
            <el-input v-model.trim="searchData.ageMin" clearable placeholder="开始"></el-input>——
            <el-input v-model.trim="searchData.ageMax" clearable placeholder="结束"></el-input>
          </div>
          <div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置查询条件</el-button>
            <el-button type="primary" @click="exporttables" v-if="moduleIds.includes(5)">导出查询结果</el-button>
          </div>
        </div>
      </template>
    </searchBox>
    <!-- 列表 -->
    <template>
      <el-table :data="tableData" class v-loading="loading">
        <el-table-column label="序号" min-width="30">
          <template slot-scope="scope">
            <p>{{scope.$index+page.serialnumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号" min-width="60">
          <template slot-scope="scope">
            <p>{{scope.row.mobile}}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" min-width="40">
          <template slot-scope="scope">
            <p>{{scope.row.mockFlag===0?"正式用户":scope.row.mockFlag===1?"测试用户":""}}</p>
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width="50">
          <template slot-scope="scope">
            <p>{{scope.row.nickName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="姓名" min-width="50">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="年龄" min-width="25">
          <template slot-scope="scope">
            <p>{{scope.row.age}}</p>
          </template>
        </el-table-column>
        <el-table-column label="渠道" min-width="30">
          <template slot-scope="scope">
            <p>{{scope.row.terminalType|f_terminalType}}</p>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="25">
          <template slot-scope="scope">
            <p>{{scope.row.sex|sex}}</p>
          </template>
        </el-table-column>
        <el-table-column label="地区" min-width="50">
          <template slot-scope="scope">
            <p>{{scope.row.provName}}{{scope.row.cityName}}{{scope.row.areaName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="100">
          <template slot-scope="scope">
            <p>{{scope.row.createdAt|time_filter}}</p>
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" min-width="100">
          <template slot-scope="scope">
            <p>{{scope.row.recentLoginTime|time_filter}}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户签约医生" min-width="55">
          <template slot-scope="scope">
            <p>{{scope.row.doctorName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="签约时长" min-width="60">
          <template slot-scope="scope">
            <p>{{scope.row.duration|f_duration}}</p>
          </template>
        </el-table-column>
        <el-table-column label="医生所在医院" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.hospitalName}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" min-width="60">
          <template slot-scope="scope">
            <p>{{scope.row.status|status}}</p>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" min-width="85">
          <template slot-scope="scope">
            <span
              class="operation"
              style="cursor:pointer;"
              v-if="moduleIds.includes(4)"
              @click="query_details(scope.row)"
            >查看详情</span>
            <span
              class="operation"
              style="cursor:pointer;"
              @click="_edittype(scope.row,scope.$index)"
            >修改类型</span>
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
    <!-- 修改类型-->
    <tudanModal
      :title="add_data.title"
      :mdShow="add_data.is"
      :width="add_data.width"
      @closeModal="add_data.is= false"
    >
      <template slot="md-content">
        <el-form label-width="100px" class="demo-table">
          <el-form-item label="用户类型">
            <el-radio v-model="mockFlag" :label="0">正式</el-radio>
            <el-radio v-model="mockFlag" :label="1">测试</el-radio>
          </el-form-item>

          <div class="line-lwl">
            <el-form-item>
              <el-button type="success" @click="edittype">确定</el-button>
              <el-button @click="add_data.is= false">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </template>
    </tudanModal>
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
export default {
  created() {
    this.get_list();
    this.moduleIds = JSON.parse(
      localStorage.getItem("hw_login_data")
    ).moduleIds;
    var date = new Date().getTime();
    this.searchData.time = [date - 63072000000, date];
    this.searchData.createdAt = `${formatSecond(this.searchData.time[0])}`;
    this.searchData.createTime = `${formatSecond(this.searchData.time[1])}`;
  },
  components: {
    crumbs,
    searchBox,
    tudanModal
  },
  watch: {
    "searchData.ageMin": function(val) {
      this.searchData.ageMin = val.replace(/[^0-9]/g, "");
    },
    "searchData.ageMax": function(val) {
      this.searchData.ageMax = val.replace(/[^0-9]/g, "");
    }
    // "searchData.mobile": function (val) {
    //   this.searchData.mobile = val.replace(/[^0-9]/g, '')
    // }
  },
  data() {
    return {
      edittypeRow: {},
      mockFlag: null,
      table_data: {},
      add_data: {
        is: false,
        title: "修改用户类型",
        width: 50,
        type: 1
      },
      terminalTypeList: [
        {
          value: "-1",
          name: "全部"
        },
        {
          value: "0",
          name: "后台"
        },
        {
          value: "1",
          name: "IOS"
        },
        {
          value: "2",
          name: "安卓"
        },
        {
          value: "3",
          name: "公众号"
        },
        {
          value: "4",
          name: "华为手表"
        }
      ],
      is: {
        area: true
      },
      pcaa,
      d_loading: false,
      moduleIds: [],
      searchData: {
        mobile: "",
        nickName: "",
        name: "",
        doctorName: "",
        hospitalName: "",
        ageMax: "",
        ageMin: "",
        beginTime: "",
        createTime: "",
        createdAt: "",
        endTime: "",
        sex: 2,
        terminalType: "-1",
        areaId: "",
        time: [],
        times: []
      }, //搜索
      new_data: {},
      is_picker: true,
      title_list: [
        {
          id: 1,
          name: "全部"
        },
        {
          id: 2,
          name: "住院医师"
        },
        {
          id: 3,
          name: "主治医师"
        },
        {
          id: 4,
          name: "副主任医师"
        },
        {
          id: 5,
          name: "主任医师"
        }
      ],
      analysis_status_list: [],
      duration_list: [],
      tableData: [],
      loading: false,
      sex_list: [
        {
          value: 2,
          name: "全部"
        },
        {
          value: 0,
          name: "男"
        },
        {
          value: 1,
          name: "女"
        },
        {
          value: 3,
          name: "未指定"
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
    _edittype(row, index) {
      this.mockFlag = row.mockFlag;
      this.edittypeRow = row;
      this.add_data.is = true;
    },
    // 修改用户类型
    async edittype(row) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003005"
          },
          body: {
            mobile: this.edittypeRow.mobile,
            mockFlag: this.mockFlag
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.loading = false;
        if (res.data.respHead.respCode === "000") {
          this.$message.success(`修改成功`);
          this.add_data.is = false;
          this.get_list();
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.$message.error(`error： ${e.message}`);
      }
    },
    _time(val, type) {
      if (!val) {
        if (type === 1) {
          this.searchData.createdAt = "";
          this.searchData.createTime = "";
        } else {
          this.searchData.beginTime = "";
          this.searchData.endTime = "";
        }
        return;
      }
      if (type == 1) {
        this.searchData.createdAt = formatSecond(val[0]);
        this.searchData.createTime = formatSecond(val[1]);
      } else {
        this.searchData.beginTime = formatSecond(val[0]);
        this.searchData.endTime = formatSecond(val[1]);
      }
    },
    area_fun(val) {
      this.searchData.areaId = `${Object.keys(val[2])}000000`;
    },
    // 导出
    async exporttables() {
      let Url = config.developmentUrl.host1 + "file/downUsers";
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
    // 重置
    reset_search() {
      this.is.area = false;
      this.searchData = {
        mobile: "",
        nickName: "",
        name: "",
        doctorName: "",
        hospitalName: "",
        ageMax: "",
        ageMin: "",
        beginTime: "",
        createTime: "",
        createdAt: "",
        endTime: "",
        sex: 2,
        terminalType: "-1",
        areaId: "",
        time: [],
        times: []
      };
      var date = new Date().getTime();
      this.searchData.time = [date - 63072000000, date];
      this.searchData.createdAt = `${formatSecond(this.searchData.time[0])}`;
      this.searchData.createTime = `${formatSecond(this.searchData.time[1])}`;
      this.$nextTick(() => {
        this.is.area = true;
      });

      this.page.num = 0;
      this.get_list();
    },
    // 翻页
    pagechange(val) {
      this.page.num = val - 1;
      this.get_list();
    },
    // 查询列表
    async get_list(num) {
      num >= 0 ? (this.page.num = num) : "";
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003001"
          },
          body: this.searchData
        };
      params.body.pageSize = this.page.size;
      params.body.pageNum = this.page.num;

      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.tableData = res.data.body.data.datas;
          this.page.total = res.data.body.data.total;
          this.loading = false;
          this.page.serialnumber = 1 + this.page.size * this.page.num;
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    // 查看详情
    query_details(row) {
      this.$router.push({ name: "user_details", params: { id: row.id, row } });
    }
  },
  filters: {
    time_filter(val) {
      return formatSecond(val);
    },
    f_duration(val) {
      return val ? val + "个月" : "";
    },
    f_terminalType(val) {
      let obj = {
        0: "后台",
        1: "IOS",
        2: "安卓",
        3: "公众号",
        4: "华为手表"
      };
      return obj[val] || "";
    },
    sex(val) {
      let obj = {
        0: "男",
        1: "女",
        3: "男"
      };
      return obj[val] || "";
    },
    status(val) {
      let obj = {
        0: "正常"
      };
      return obj[val] || "";
    }
  }
};
</script>

<style lang="scss">
.operation {
  color: #0099ff;
  cursor: pointer;
  padding: 0 8px;
}
.users_wrap .el-date-editor--datetimerange.el-input__inner {
  width: 280px;
}
.users_wrap .tudan-modal .tudan-modal-inner {
  min-height: auto;
}
</style>
