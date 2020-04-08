<template>
  <div class="app_banner_wrap" v-loading="loading">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>APP Banner管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <div class="add_box">
      <el-button type="primary" @click="add_fun" v-if="moduleIds.includes(9)"
        >添加Banner</el-button
      >
    </div>
    <!-- 表单 -->
    <template>
      <el-table :data="tableData" class v-loading="loading">
        <el-table-column label="序号" min-width="30">
          <template slot-scope="scope">
            <p>{{ scope.$index + page.serialnumber }}</p>
          </template>
        </el-table-column>
        <el-table-column label="图片" min-width="90">
          <template slot-scope="scope">
            <p class="img_box">
              <img
                @click="enlarge(scope.row.imagPath)"
                :src="scope.row.imagPath"
                alt
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="有效期" min-width="150">
          <template slot-scope="scope">
            <p>
              {{ scope.row.beginDate | f_time }} ——
              {{ scope.row.endDate | f_time }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50">
          <template slot-scope="scope">
            <p>{{ scope.row.status | f_status }}</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="85">
          <template slot-scope="scope">
            <span
              class="operation"
              @click="sort_fun(scope.row.id, 0)"
              v-if="scope.$index != 0 && moduleIds.includes(35)"
              >上移</span
            >
            <span
              class="operation"
              @click="sort_fun(scope.row.id, 1)"
              v-if="
                scope.$index != tableData.length - 1 && moduleIds.includes(35)
              "
              >下移</span
            >
            <span
              class="operation"
              v-if="scope.row.status === 2"
              @click="_View_info(scope.row)"
              >查看</span
            >
            <!-- status==2 上线不让编辑 产品说的 -->
            <span
              class="operation"
              v-if="scope.row.status != 2 && moduleIds.includes(53)"
              @click="edit_fun(scope.row)"
              >编辑</span
            >
            <span
              class="operation"
              v-if="scope.row.status == 2 && moduleIds.includes(34)"
              @click="offline_fun(scope.row)"
              >下线</span
            >
            <span
              class="operation"
              v-if="moduleIds.includes(33)"
              @click="del_item(scope.row.id)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 添加 -->
    <tudanModal
      :title="add_data.title"
      :mdShow="add_data.is"
      :width="add_data.width"
      v-if="add_data.is"
      @closeModal="closeModal(1)"
    >
      <template slot="md-content">
        <el-form
          :model="table_data"
          :rules="rules"
          ref="table_data"
          label-width="100px"
          class="demo-table_data"
          :disabled="is.biedong"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="table_data.name"></el-input>
          </el-form-item>
          <el-form-item label="连接地址" prop="jumpPath">
            <el-input v-model="table_data.jumpPath"></el-input>
          </el-form-item>
          <el-form-item prop="imagPath">
            <el-upload
              :class="{ upNull: imagPath.length > 0 }"
              drag
              accept="image/*"
              :action="upUrl"
              list-type="picture"
              :before-upload="beforeAvatarUpload"
              :on-success="
                (response, file, fileList) =>
                  detailsuploadSuc(response, file, fileList)
              "
              :on-remove="(file, fileList) => onremove(file, fileList)"
              multiple
              :file-list="imagPath"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="有效期" prop="time">
            <el-date-picker
              v-model="table_data.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <div class="line-lwl">
            <el-form-item>
              <el-button
                type="success"
                @click="submitForm('table_data')"
                v-if="add_data.type === 1"
                >提交审核</el-button
              >
              <!-- <el-button type="success" @click="offline_fun" v-if="add_data.type===2">下线</el-button> -->
              <el-button
                type="success"
                @click="review_fun"
                v-if="add_data.type === 3"
                >审核通过</el-button
              >
              <el-button
                type="success"
                @click="edit_funs('table_data')"
                v-if="add_data.type == 9"
                >编辑-提交审核</el-button
              >
              <el-button @click="cancle" v-if="add_data.type != 8"
                >取消</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </template>
    </tudanModal>
    <div class="img-modal" v-if="path_active" @click="path_active = false">
      <img :src="path" alt />
    </div>
    <div class="v-modal" v-if="path_active" @click="path_active = false"></div>
  </div>
</template>

<script>
import util from '@/lib/util'
import upUrl from '@/lib/upUrl'
import crumbs from '@/components/common/Crumbs'
import { formatSecond } from "@/lib/time"
import tudanModal from './tudan_modal'
export default {
  created() {
    this.get_list()
    this.moduleIds = JSON.parse(localStorage.getItem("hw_login_data")).moduleIds
  },
  components: {
    crumbs, tudanModal
  },
  data() {
    return {
      path: "",
      path_active: false,
      moduleIds: [],
      row: null,
      loading: false,
      imagPath: [],
      table_data: {
        imagPath: "",
        jumpPath: "",
        name: "",
        time: [],
        type: 1,
        beginDate: '',
        endDate: ''
      },
      rules: {
        imagPath: [
          { required: true, message: '请上传图片' },
        ],
        name: [
          { required: true, message: '请输入名称' },
        ],
        jumpPath: [
          { required: true, message: '请输入连接地址' },
        ],
        time: [
          { required: true, message: '请选择时间' },
        ]
      },
      upUrl,
      is: {
        biedong: false
      },
      add_data: {
        is: false,
        title: '添加Banner',
        width: 50,
        type: 1
      },
      tableData: [],
      loading: false,
      page: {
        size: 15,
        num: 0,
        serialnumber: 0
      }
    }
  },
  methods: {
    // 查看详情
    _View_info(row) {
      this.reset_data()
      this.row = row
      this.add_data.type = 8
      this.add_data.title = "查看Banner"
      this.is.biedong = true
      this.table_data.name = row.name
      this.table_data.jumpPath = row.jumpPath
      this.table_data.imagPath = row.imagPath
      this.table_data.time = []
      this.table_data.time[0] = new Date(row.beginDate)
      this.table_data.time[1] = new Date(row.endDate)
      this.add_data.is = true
      this.imagPath.push({
        filePath: row.imagPath,
        url: row.imagPath,
      })
    },
    //   放大
    enlarge(path) {
      this.path = path
      this.path_active = true
    },
    //   审核
    async review_fun() {
      if (Array.isArray(this.table_data.time) && this.table_data.time.length > 0) {
        this.table_data.beginDate = formatSecond(this.table_data.time[0])
        this.table_data.endDate = formatSecond(this.table_data.time[1])
      }
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004002'
        },
        body: this.table_data
      }
      params.body.id = this.row.id
      params.body.status = 1
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.get_list()
          this.add_data.is = false
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
    // 下线
    async offline_fun(row) {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004005'
        },
        body: { id: row.id }
      }
      this.loading = true
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
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
    // 编辑保存
    edit_funs(formName) {
      if (Array.isArray(this.table_data.time) && this.table_data.time.length > 0) {
        this.table_data.beginDate = formatSecond(this.table_data.time[0])
        this.table_data.endDate = formatSecond(this.table_data.time[1])
      }

      let self = this, Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004002'
        },
        body: this.table_data
      }
      params.body.id = this.row.id
      params.body.status = 0
      self.$refs[formName].validate((valid) => {
        if (valid) {
          util.ajax.post(Url, params).then(res => {
            console.log(res);
            if (res.data.respHead.respCode == "000") {
              self.$message.success('修改成功!')
              self.get_list()
              self.add_data.is = false
              self.reset_data()
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
    },
    //   编辑
    async edit_fun(row) {
      this.reset_data()
      this.row = row
      this.add_data.type = row.status == 0 ? 3 : row.status != 0 ? 9 : 8
      this.add_data.title = "编辑Banner"
      this.table_data.name = row.name
      this.table_data.jumpPath = row.jumpPath
      this.table_data.imagPath = row.imagPath
      this.table_data.time = []
      this.table_data.time[0] = new Date(row.beginDate)
      this.table_data.time[1] = new Date(row.endDate)
      this.add_data.is = true
      this.imagPath.push({
        filePath: row.imagPath,
        url: row.imagPath,
      })
    },
    //   上移 下移
    async sort_fun(id, type) {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004006'
        },
        body: { id, sortType: type, type: 1 }
      }
      this.loading = true
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.loading = false
        if (res.data.respHead.respCode === "000") {
          this.get_list()
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`)
        }
      } catch (e) {
        this.loading = false
        console.log(e);
        this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      }
    },
    //   删除
    del_item(id) {
      let _this = this
      let Url = '', params = {
        reqHead: {
          functionId: 'DWA001004004'
        },
        body: { id }
      }
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
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
    },
    // 重置状态
    reset_data() {
      this.add_data = {
        is: false,
        title: '添加Banner',
        width: 50,
        type: 1
      }
      this.is.biedong = false
      this.imagPath = []
      this.table_data = {
        imagPath: "",
        jumpPath: "",
        name: "",
        time: [],
        type: 1,
        beginDate: '',
        endDate: ''
      }
    },
    cancle() {
      this.reset_data()
    },
    closeModal() {
      this.reset_data()
    },
    // 提交
    submitForm(formName) {
      if (Array.isArray(this.table_data.time) && this.table_data.time.length > 0) {
        this.table_data.beginDate = formatSecond(this.table_data.time[0])
        this.table_data.endDate = formatSecond(this.table_data.time[1])
      }

      let self = this, Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004002'
        },
        body: this.table_data
      }

      self.$refs[formName].validate((valid) => {
        if (valid) {
          util.ajax.post(Url, params).then(res => {
            console.log(res);
            if (res.data.respHead.respCode == "000") {
              self.$message.success('添加成功!')
              self.get_list()
              self.add_data.is = false
              self.reset_data()
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
    },
    //   添加
    add_fun() {
      if (this.tableData.length >= 5) {
        return this.$message.error('Banner上限数量为5,如需添加请删除!')
      }
      this.reset_data()
      this.add_data.is = true
    },
    //   列表
    async get_list() {
      let Url = '', params = {
        reqHead: {
          'functionId': 'DWA001004001'
        },
        body: { type: 1 }
      }
      this.loading = true
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.tableData = res.data.body.data;
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
    // 图片上传前拦截 判断文件类型
    beforeAvatarUpload(file) {
      let type = file.type
      if (type.indexOf('image/') === -1) {
        this.$message.error('只能上传图片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 图片上传成功时的回调函数
    detailsuploadSuc(response, file, fileList, ) {
      if (response.respHead.respCode === '000') {
        this.imagPath.push({
          filePath: file.response.body.obj.filePath,
          url: file.response.body.obj.filePath,
        })
        this.table_data.imagPath = file.response.body.obj.filePath
      } else {
        this.$message.error(`${res.data.respHead.respMsg}`)
      }
    },
    // 	文件列表移除文件时的钩子
    onremove(file, fileList, type) {
      this.detailDiagramList = fileList
      this.imagPath = fileList
    }
  },
  filters: {
    f_time(val) {
      return formatSecond(val)
    },
    f_status(val) {
      const arr = ["待审核", "待上线", "已上线", "已下线"]
      return arr[val] || ""
    }
  }
}
</script>

<style lang="scss">
.app_banner_wrap {
  .add_box {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .operation {
    color: #0099ff;
    cursor: pointer;
    padding: 0 8px;
  }
  .upNull {
    .el-upload-dragger {
      display: none;
    }
    .el-upload {
      display: none;
    }
  }
  .line-lwl {
    border-top: 1px solid #ddd;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .img_box {
    & > img {
      width: 120px;
      height: auto;
    }
  }
  .img-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    display: flex;
    width: 80%;
    height: 80%;
    font-size: 16px;
    overflow: hidden;
    transition: 0.3s;
    transform: translate3d(-50%, -50%, 0);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    img {
      width: auto;
      height: 100%;
      max-width: 100%;
    }
  }
}
</style>
