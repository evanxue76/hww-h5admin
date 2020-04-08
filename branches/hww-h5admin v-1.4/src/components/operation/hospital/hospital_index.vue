<template>
  <div class="hospital_index_wrap">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>医院管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 搜索 -->
    <searchBox>
      <template slot="searchBox">
        <div class="seek_line">
          <div class>
            <span class="Names">医院名称:</span>
            <el-input v-model.trim="searchData.hospitalName" clearable placeholder="输入名称"></el-input>
          </div>
          <div class>
            <span class="Names">医院等级:</span>
            <el-select v-model="searchData.hospitalGradeCode" clearable>
              <el-option
                v-for="item in hospital_level_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class>
            <span class="Names">医院类型:</span>
            <el-select v-model="searchData.hospitalTypeCode" clearable>
              <el-option
                v-for="item in hospital_type_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class>
            <span class="Names">经济类型:</span>
            <el-select v-model="searchData.hospitalEconomicCode" clearable>
              <el-option
                v-for="item in hEconomic_type_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class>
            <span class="Names">状态:</span>
            <el-select v-model="searchData.status" clearable style="padding-right:10px;">
              <el-option
                v-for="item in d_status_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="end-3">
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
            <span class="Names">联系人:</span>
            <el-input
              v-model.trim="searchData.contactsName"
              maxlength="11"
              clearable
              placeholder="输入联系人"
            ></el-input>
          </div>
          <div class>
            <span class="Names">联系电话:</span>
            <el-input
              v-model.trim="searchData.contactsNumber"
              type="tel"
              maxlength="11"
              clearable
              placeholder="输入联系电话"
            ></el-input>
          </div>
          <div></div>
          <div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置</el-button>
            <el-button type="primary" v-if="moduleIds.includes(27)" @click="add">添加医院</el-button>
          </div>
        </div>
      </template>
    </searchBox>
    <!-- 列表 -->
    <template>
      <el-table :data="tableData" class v-loading="loading">
        <el-table-column label="序号" min-width="50">
          <template slot-scope="scope">
            <p>{{scope.$index+page.serialnumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="医院名称" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.hospitalName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="医院等级" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.hospitalGrade}}</p>
          </template>
        </el-table-column>
        <el-table-column label="行政级别" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.administrativeLevel}}</p>
          </template>
        </el-table-column>
        <el-table-column label="医院类型" min-width="60">
          <template slot-scope="scope">
            <p>{{scope.row.hospitalType}}</p>
          </template>
        </el-table-column>
        <el-table-column label="经济类型" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.hospitalEconomic}}</p>
          </template>
        </el-table-column>
        <el-table-column label="地区" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.areaName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系人" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.contactsName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" min-width="80">
          <template slot-scope="scope">
            <p>{{scope.row.contactsNumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70">
          <template slot-scope="scope">
            <p>{{scope.row.status|f_status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="85">
          <template slot-scope="scope">
            <span
              class="operation"
              v-if="scope.row.status==1&&moduleIds.includes(27)"
              @click="thaw_fun(scope.row.id)"
            >解冻</span>
            <span
              class="operation"
              v-if="moduleIds.includes(26)"
              @click="query_details(scope.row.id,scope.row)"
            >查看详情</span>
            <span
              class="operation"
              v-if="scope.row.source==1&&moduleIds.includes(28)"
              @click="del_item(scope.row.id)"
            >删除</span>
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
import util from '@/lib/util'
import { pcaa } from "area-data";
import crumbs from '@/components/common/Crumbs'
import searchBox from '@/components/common/searchBox'
export default {
  created() {
    this.get_list()
    this.get_hospital_level()
    this.get_hospital_type()
    this.get_hospital_Economic_type()
    this.moduleIds = JSON.parse(localStorage.getItem("hw_login_data")).moduleIds
  },
  components: {
    crumbs, searchBox
  },
  watch: {
    "searchData.contactsNumber": function (val) {
      this.searchData.contactsNumber = val.replace(/[^0-9]/g, '')
    }
  },
  data() {
    return {
      moduleIds: [],
      is: {
        area: true
      },
      pcaa,
      searchData: {
        hospitalName: "",
        hospitalGradeCode: "",
        hospitalTypeCode: "",
        hospitalEconomicCode: "",
        area: "",
        provinceId: "",
        cityId: "",
        areaId: "",
        provinceName: "",
        cityName: "",
        areaName: "",
        status: ""
      },
      tableData: [],
      hEconomic_type_list: [],
      hospital_level_list: [],
      hospital_type_list: [],
      o_status_list: [],
      s_status_list: [],
      d_status_list: [
        {
          value: "",
          name: "全部"
        },
        {
          value: 0,
          name: "正常"
        }
        // ,
        // {
        //   value: 1,
        //   name: "冻结"
        // }
      ],
      title_list: [],
      level_list: [],
      keshi_list: [],
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      }
    }
  },
  methods: {
    // 分页操作
    pagechange(num) {
      this.page.num = num - 1
      this.get_list()
    },
    // 
    query_details(id, row) {
      this.$router.push({        name: 'open_hospital', params: {
          type: 1, id, row //type:1查看详情、2：编辑
        }      })
    },
    // 解冻
    async thaw_fun(id) {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001002003'
        },
        body: { id, status: 0 }
      }
      this.loading = true
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.get_list()
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
    // 地区选择
    area_fun(val) {
      this.searchData.provinceId = `${Object.keys(this.searchData.area[0])}000000`
      this.searchData.cityId = `${Object.keys(this.searchData.area[1])}000000`
      this.searchData.areaId = `${Object.keys(this.searchData.area[2])}000000`
      this.searchData.provinceName = this.searchData.area[0][Object.keys(this.searchData.area[0])]
      this.searchData.cityName = this.searchData.area[1][Object.keys(this.searchData.area[1])]
      this.searchData.areaName = this.searchData.area[2][Object.keys(this.searchData.area[2])]
    },
    // 
    del_item(id) {
      let _this = this
      let Url = '', params = {
        reqHead: {
          functionId: 'DWA001002004'
        },
        body: { id }
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        util.ajax.post(Url, params).then(res => {
          console.log(res)
          if (res.data.respHead.respCode === "000") {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.page.num = 0
            this.get_list()
          } else {
            _this.$message.error(`${res.data.respHead.respMsg}`)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 查询列表
    async get_list(num) {
      num >= 0 ? this.page.num = num : ""
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001002001'
        },
        body: this.searchData
      }
      params.body.pageSize = this.page.size
      params.body.pageNum = this.page.num
      this.loading = true
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
    reset_search() {
      this.is.area = false
      this.searchData = {
        hospitalName: "",
        hospitalGradeCode: "",
        hospitalTypeCode: "",
        hospitalEconomicCode: "",
        area: [],
        provinceId: "",
        cityId: "",
        areaId: "",
        provinceName: "",
        cityName: "",
        areaName: "",
        status: ""
      }
      this.$nextTick(() => {
        this.is.area = true
      })
      this.get_list(0)
    },
    // 新增
    add() {
      this.$router.push({
        name: "open_hospital"
      })
    },
    //   查询医院 经济类型
    async get_hospital_Economic_type() {
      // DWA001002005
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001002007'
        },
        body: {}
      }
      this.hEconomic_type_list.push({value:"",name:"全部"})
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.hEconomic_type_list.push({ value: i.code, name: i.displayName, type: i.type })
          })
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
    //   查询医院 等级
    async get_hospital_level() {
      // DWA001002005
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001002005'
        },
        body: {}
      }
      this.hospital_level_list.push({value:"",name:"全部"})
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.hospital_level_list.push({ value: i.code, name: i.displayName, type: i.type })
          })
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
    //   查询医院 类型
    async get_hospital_type() {
      // DWA001002005
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001002006'
        },
        body: {}
      }
      this.hospital_type_list.push({value:"",name:"全部"})
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.hospital_type_list.push({ value: i.code, name: i.displayName, type: i.type })
          })
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
  },
  filters: {
    f_status(val) {
      return val === 0 ? "正常" : "冻结"
    }
  }
}
</script>

<style lang="scss">
.hospital_index_wrap {
  .operation {
    color: #0099ff;
    cursor: pointer;
    padding: 0 8px;
  }
  .area-select {
    height: 40px;
    line-height: 40px;
  }
  .area-select .area-selected-trigger {
    padding: 0px 20px 0px 12px;
    // color: #c0c4cc;
  }
}
</style>
