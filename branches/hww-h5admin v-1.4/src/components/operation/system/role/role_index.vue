<template>
  <div class="role_index_wrap">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统功能</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 搜索 -->
    <searchBox>
      <template slot="searchBox">
        <div class="seek_line">
          <div>
            <span class="Names">角色名称:</span>
            <el-input v-model.trim="searchData.roleName" clearable placeholder="角色名称"></el-input>
          </div>
          <div class></div>
          <div class></div>
          <div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置</el-button>
            <el-button type="primary" @click="add_fun">添加角色</el-button>
          </div>
        </div>
      </template>
    </searchBox>
    <!-- 表单 -->
    <template>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <p>{{scope.$index+page.serialnumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            <p>{{scope.row.roleName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号数">
          <template slot-scope="scope">
            <p>{{scope.row.accountNum}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="数据权限">
          <template slot-scope="scope">
            <p>{{scope.row.permission}}</p>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <span class="operation" @click="look_details(scope.row)">查看详情</span>
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
        @current-change="pagechange"
        :total="page.total"
        :current-page="page.num+1"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import util from '@/lib/util'
import crumbs from '@/components/common/Crumbs'
import { formatSecond } from "@/lib/time"
import searchBox from '@/components/common/searchBox'
export default {
  created() {
    this.get_list()
  },
  components: {
    crumbs, searchBox
  },
  data() {
    return {
      loading: false,
      tableData: [],
      searchData: {
        roleName: ""
      },
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      }
    }
  },
  methods: {
    async get_list(num) {
      num >= 0 ? this.page.num = num : ""
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001007002'
        },
        body: this.searchData
      }
      params.body.pageSize = this.page.size
      params.body.pageNum = num || this.page.num
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
      this.searchData = {
        roleName: ""
      }
      this.get_list(0)
    },
    // 查看详情
    look_details(row) {
      this.$router.push({ name: 'open_role', params: { row, type: 1 ,id:row.id} })
    },
    // 分页操作
    pagechange(num) {
      this.page.num = num - 1
      this.get_list()
    },
    add_fun() {
      this.$router.push({ name: 'open_role' })
    },
  },
  filters: {

  }
}
</script>

<style lang="scss">
.role_index_wrap {
  .operation {
    color: #0099ff;
    cursor: pointer;
    padding: 0 8px;
  }
}
</style>
