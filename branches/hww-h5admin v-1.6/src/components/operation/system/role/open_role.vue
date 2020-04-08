<template>
  <div class="open_account_wrap">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统功能</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 表单 -->
    <template>
      <el-form
        :model="table_data"
        :rules="rules"
        ref="table_data"
        label-width="100px"
        class="demo-table_data"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="table_data.roleName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="数据权限：">
          <el-checkbox-group v-model="table_data.checkList">
            <el-checkbox label="浏览"></el-checkbox>
            <el-checkbox label="编辑"></el-checkbox>
            <el-checkbox label="审核"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item label="功能权限：" prop="tree">
          <el-tree
            @check-change="handleChange"
            :data="tableData"
            show-checkbox
            :leafOnly="true"
            :default-expanded-keys="hrefKeyFlags"
            :default-checked-keys="allKeyFlags"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('table_data')">确定</el-button>
          <el-button @click="cancle">取消</el-button>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import util from '@/lib/util'
import crumbs from '@/components/common/Crumbs'
import { formatSecond } from "@/lib/time"
export default {
  created() {
    this.get_role_list()
	if(this.$route.params.row){
		localStorage.setItem('roleRow',JSON.stringify(this.$route.params.row))
	}
    if (this.$route.params.id) {
		this.roleRow = this.$route.params.row||JSON.parse(localStorage.getItem("roleRow"))
      this.table_data.roleName = this.roleRow.roleName
      this.roleRow.hrefKeyFlags = this.roleRow.hrefKeyFlags.split(",")
      this.roleRow.allKeyFlags = this.roleRow.allKeyFlags.split(",")
      this.roleRow.hrefKeyFlags.map(i => {
        this.hrefKeyFlags.push(parseInt(i));
      });
      this.roleRow.allKeyFlags.map(i => {
        this.allKeyFlags.push(parseInt(i));
      });
    }
  },
  components: {
    crumbs
  },
  data() {
    return {
		roleRow:{},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      hrefKeyFlags: [6],
      tableData: [],
      allKeyFlags: [],
      role_list: [],
      table_data: {
        roleName: "",
        hrefKeyFlags: [],
        allKeyFlags: [],
        moduleIds:[]
      },
      rules: {
        account: [
          { required: true, message: '请输入账号' },
        ],
        roleIds: [
          { required: true, message: '请选择角色' },
        ],
      }
    }
  },
  methods: {
    cancle() {
      this.$router.push({
        name: 'role'
      })
    },
    handleChange(val, ind) {
      if (ind == true) {
        let arr = []
        arr.push(val.id)
        this.value = arr
      }
    },
    async get_role_list() {
      //DWA001007003
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001008002'
        },
        body: {}
      }
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.tableData = res.data.body.obj
          //   res.data.body.obj.forEach(i => {
          //     this.role_list.push({ value: i.id, name: i.roleName })
          //   })
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
    submitForm(formName) {
      this.table_data.allKeyFlags = this.$refs.tree.getCheckedKeys();
      this.table_data.moduleIds = this.$refs.tree.getCheckedKeys();
      this.table_data.hrefKeyFlags = this.$refs.tree.getHalfCheckedKeys();
      let self = this, Url = '', params = {
        reqHead: {
          'functionId': 'DWA001007001'
        },
        body: this.table_data
      }
      if (this.$route.params.type === 1) {
        params.body.id = this.roleRow.id
      }
      self.$refs[formName].validate((valid) => {
        if (valid) {
          util.ajax.post(Url, params).then(res => {
            console.log(res);
            if (res.data.respHead.respCode == "000") {
              if (this.$route.params.type === 1) {
                self.$message.success('修改成功!')
              } else {
                self.$message.success('添加成功!')
              }
              self.$router.push({ name: "role" })
            } else {
              self.$message.error(`${res.data.respHead.respMsg}`)
            }
          }).
            catch(err => {
              self.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
            });
        } else {
          self.$message.error('请填写必填项!')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.open_account_wrap {
  .demo-table_data {
    width: 500px;
  }
}
</style>
