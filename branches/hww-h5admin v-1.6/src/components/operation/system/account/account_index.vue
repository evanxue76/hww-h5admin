<template>
  <div class="account_index_wrap">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统功能</el-breadcrumb-item>
          <el-breadcrumb-item>账号管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 搜索 -->
    <searchBox>
      <template slot="searchBox">
        <div class="seek_line">
          <div class>
            <span class="Names">账号:</span>
            <el-input v-model.trim="searchData.account" clearable placeholder="输入账号"></el-input>
          </div>
          <div class>
            <span class="Names">姓名:</span>
            <el-input v-model.trim="searchData.userName" clearable placeholder="输入姓名"></el-input>
          </div>
          <div class>
            <span class="Names">手机号:</span>
            <el-input
              v-model.trim="searchData.phoneNumber"
              maxlength="11"
              clearable
              placeholder="输入手机号"
            ></el-input>
          </div>
          <div class>
            <span class="Names">部门:</span>
            <el-input v-model.trim="searchData.department" clearable placeholder="输入部门名称"></el-input>
          </div>
          <div class>
            <span class="Names">角色:</span>
            <el-input v-model.trim="searchData.roleName" clearable placeholder="角色名称"></el-input>
          </div>
          <div style="justify-content: flex-end;">
            <el-button type="primary" @click="get_list(0)">查询</el-button>
            <el-button type="primary" @click="reset_search">重置</el-button>
            <el-button type="primary" @click="add_fun">添加账号</el-button>
          </div>
        </div>
      </template>
    </searchBox>
    <!-- 表单 -->
    <template>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="账号">
          <template slot-scope="scope">
            <p>{{scope.row.account}}</p>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <p>{{scope.row.userName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <p>{{scope.row.phoneNumber}}</p>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <p>{{scope.row.department}}</p>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <p>{{scope.row.roleName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <span class="operation" @click="editAccount(scope.row)">编辑</span>
            <span class="operation" @click="reset_pwd(scope.row.id)">重置密码</span>
            <span class="operation" @click="del_item(scope.row.id)">删除</span>
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
      searchData: {
        account: "",
        userName: "",
        phoneNumber: "",
        department: "",
        roleName: ""
      },
      tableData: [],
      loading: false,
      page: {
        total: 0,
        size: 15,
        num: 0,
        serialnumber: 0
      }
    }
  },
  methods: {
    // 编辑
    editAccount(row) {
      this.$router.push({ name: "open_account", params: { row, id: row.id, type: 1 } })
    },
    //   重置密码
    async reset_pwd(id) {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001006005'
        },
        body: { id }
      }
      this.loading = true
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.$message({ message: "重置成功,新密码：123456", type: "success" });
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
    // 分页操作
    pagechange(num) {
      this.page.num = num - 1
      this.get_list()
    },
    add_fun() {
      this.$router.push({ name: 'open_account' })
    },
    reset_search() {
      this.searchData = {
        account: "",
        userName: "",
        phoneNumber: "",
        department: "",
        roleName: ""
      }
      this.get_list()
    },
    search_fun() {

    },
    // 列表
    async get_list(num) {
      num >= 0 ? this.page.num = num : ""
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001006003'
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
    // 删除
    del_item(id) {
      let _this = this
      let Url = '', params = {
        reqHead: {
          functionId: 'DWA001006006'
        },
        body: { id }
      }
      this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
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
            _this.get_list()
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
    }
  }
}
</script>

<style lang="scss">
.account_index_wrap {
   .operation {
    color: #0099ff;
    cursor: pointer;
    padding: 0 8px;
  }
}
</style>
