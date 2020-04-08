<template>
  <div v-loading="loading">
       <!-- 进货订单新建 -->
    <div class="top">
      <div class="text">
        <div class="qerr"> <span class="aeae">渠道商名称</span> :{{searchData.channelBusiness}}</div>
        <div class="qerr">  <span  class="aeae">订单日期</span> :{{searchData.orderDate | formatDate}}</div>
        <div class="je qerr">
          <span  class="aeae">  订单金额(元):</span>
          <span>
            <el-input v-model="searchData.price" placeholder></el-input>
          </span>
        </div>
        <div class="je qerr">
         <span class="aeae">  好络维对接人: </span> 
          <span>
            <el-input v-model="searchData.helowinPeople" maxlength="20" placeholder></el-input>
          </span>
        </div>
        <div class="wenjian">
          附件:
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="upURls"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="success"
            v-model="searchData.enclosureName"
          >
            <span slot="trigger" class="color">选取文件</span>
          </el-upload>
        </div>
        <div class="wenjian qerr">
         <span class="aeae"> 备注:</span>  
          <span>
            <el-input v-model="searchData.remark" maxlength="100" placeholder></el-input>
          </span>
        </div>
        <div class="qada">
          <span>商品信息</span>
          <div>
            已录入HM503B1
            <span class="color">{{count}}</span> 台，HM505B1
            <span class="color">{{counts}}</span>台，HM505B2
            <span class="color">{{countd}}</span>台
			<el-button size="small" type="primary" @click.stop="downLoad" class="btnst">下载模板</el-button>
            <el-upload
              class="ensureButt"
              :action="upUrlaa"
              :onSuccess="uploadSuccess"
              :onError="uploadError"
              :beforeUpload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">导入</el-button>
             <!-- <a href="http://192.168.9.135/file/2019-11-27/5557520191127.xls" download="sss">下载模板</a> -->
            </el-upload>
			 
          </div>
          <el-table :data="tableData" border class="adaeee">
            <el-table-column fixed label="序号" prop="index">
              <template slot-scope="scope" >{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column label="SN" prop="text">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.text"
                  maxlength="15"
                  clearable
				 style="width: 180px;"
                  @blur="types(scope.row)"
                  @focus = "typesd(scope.row)"
                  @input="typesdd(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="设备类型" prop="type" >
              <template slot-scope="scope" >
                <el-input    style="width: 180px;" v-model="scope.row.type" clearable disabled ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="设备型号" prop="xh"  >
              <template slot-scope="scope" >
                <el-input    style="width: 180px;"   v-model="scope.row.xh" clearable disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope" >
                <el-button type="danger"  class="bunss" @click="branchAdd(scope.row)">保存</el-button>
                <el-button type="danger"  class="bunss" @click="btn(scope.row,scope.$index )">删除</el-button>
              </template>
            </el-table-column>
           </el-table>
        </div>
        <div class="btn">
          <el-button type="danger" @click="Slice()">删除</el-button>
          <el-button type="primary" @click="hold">保存</el-button>
          <el-button @click="reset">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { log } from "util";
import util from "@/lib/util";
import upURls from "@/lib/upURls.js";
import upUrlaa from "@/lib/upUrlaa.js";
import businessorder from "./businessorder";
import repeats from "./repeats";
import axios from "axios";
import config from "@/lib/global";
export default {
	directives: {
	    focus: {
	        inserted: function (el) {
	        el.querySelector('input').focus()
	        }
	    }
	},
	
	
  created() {
    this.qunbus = JSON.parse(localStorage.getItem("quanbu"));
    this.searchData.channelBusiness = this.qunbus.channel;
    this.searchData.channelPeople = this.qunbus.contacts;
    this.searchData.helowinPeople= this.qunbus.hlwPeople
    this.xiabuao = JSON.parse(localStorage.getItem("cuncun"));
  },
  components: {
    businessorder,
    repeats
  },
  data() {
    return {
      lun: true,
      tableData: [
        {
          text: "",
          type: "",
          xh: "",
          index: "1",
          mark: "1"
        }
      ],
      upUrlaa,
      xiabuao: "",
      ids: "",
      qunbus: null,
      loading: false,
      count: 0,
      counts: 0,
      countd: 0,
      channelId: "",
      searchData: {
        channelBusiness: "",
        orderDate: Date.parse(new Date()),
        price: "",
        enclosureUrl: "",
        helowinPeople: "",
        remark: "",
        channelPeople: "",
        enclosureName:""
      },
      upURls,
      fileList: [],
      input: "",
      sn: [],
      chakan: []
    };
  },

  methods: {
    typesdd(es){
     if(es.text == ""){
       es.type = ""
       es.xh = ""
     }
      if(es.text.length  == 15){
        if (/^(T1).*/.test(es.text)) {
          this.count =this.count;
        }
      }
      if(es.text.length  == 15){
        if (/^(T3).*/.test(es.text)) {
          this.counts=this.counts;
        }
      }
      if(es.text.length  == 15){
        if (/^(T4).*/.test(es.text)) {
          this.countd=this.countd
        }
      }
    },
    typesd(es){
      if (/^(T1).*/.test(es.text)) {
        es.type = "动态心电记录仪";
        (es.xh = "HM503B1");
      }
      if (/^(T3).*/.test(es.text)) {
        es.type = "心电记录仪";
        (es.xh = "HM505B1"), (es.mark = "2");

      }
      if (/^(T4).*/.test(es.text)) {
        es.type = "心电记录仪";
        (es.xh = "HM505B2")  ;
      }
      if(es.text.length  == 15){
        if (/^(T1).*/.test(es.text)) {
          this.count =this.count;
        }
      }
      if(es.text.length  == 15){
        if (/^(T3).*/.test(es.text)) {
          this.counts=this.counts;
        }
      }
      if(es.text.length  == 15){
        if (/^(T4).*/.test(es.text)) {
          this.countd=this.countd
        }
      }
    },
	  //监听sn
      types(es){
        if(es.text.length  < 15){
          this.$message.error('SN不能小于15位');
          return
        }
          if(es.text == ""){
              return
          }

          if (/^(T1).*/.test(es.text)) {
              es.type = "动态心电记录仪";
              (es.xh = "HM503A1");
          }
          if (/^(T3).*/.test(es.text)) {
              es.type = "心电记录仪";
              (es.xh = "HM505B1"), (es.mark = "2");

          }
          if (/^(T4).*/.test(es.text)) {
              es.type = "心电记录仪";
              (es.xh = "HM505B2")  ;
          }
          // if(es.text.length  == 15){
          //   if (/^(T1).*/.test(es.text)) {
          //     this.count++;
          //   }
          // }
          // if(es.text.length  == 15){
          //   if (/^(T3).*/.test(es.text)) {
          //     this.counts++;
          //   }
          // }
          // if(es.text.length  == 15){
          //   if (/^(T4).*/.test(es.text)) {
          //     this.countd++
          //   }
          // }
          // this.tableData.push({
          //     text: "",
          //     type: "",
          //     xh: "",
          //     index: "",
          //     mark: ""
          // });
          this.sn.push(es.text)
      },
    //下载
  async downLoad() {

//    window.location.href = "http://192.168.9.135/file/2019-11-27/5557520191127.xls";
      window.location.href = 'http://119.3.54.100/file/5557520191127.xls';
      // let Url =  config.developmentUrl.host1 + "file/upload";
      //   let res = await axios({
      //   url: Url,
      //   method: 'post',
      // responseType: 'blob'
      // })
      // console.log(64555,res)
      // try{
      //   let url = window.URL.createObjectURL(new Blob([res.data]));
      //     let link = document.createElement("a");
      //      link.style.display = 'none'
      //        link.href = url;
      //     link.setAttribute("download", `${formatSecond(new Date().getTime())}.xlsx`);
      //      document.body.appendChild(link);
      //        link.click();
      // }catch(e){
      //      this.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
      // }
    },
    //上传成功
    async uploadSuccess(response, file, fileList) {
      let filePath = response.body.obj.filePath;
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001014006"
          },
          body: {
            excelUrl: filePath
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(87888,res)
        if (res.data.respHead.respCode === "000") {
          var obj = res.data.body.data;
          for (var i = 0; i < obj.length; i++) {
            var on = {
              text: obj[i],
              type: "",
              xh: "",
              index: "1",
              mark: "1"
            };
            this.tableData.push(on)
              if (/^(T1).*/.test( on.text)) {
        on.type = "动态心电记录仪";
        (on.xh = "HM503A1");
          this.count++;
      }
      if (/^(T3).*/.test(on.text)) {
        on.type = "心电记录仪";
        (on.xh = "HM505B1"), ( on.mark = "2");
       this.counts ++
       
      }
      if (/^(T4).*/.test( on.text)) {
       on.type = "心电记录仪";
        (on.xh = "HM505B2")  ;
         this.countd ++
      }
       
     this.sn.push(on.text);
          }
           this.tableData.shift();
        }
      } catch (e) {}
    },
    //  文件上传失败
    uploadError(response, file, fileList) {
      console.log("上传失败，请重试！");
    },
    //上传前处理
    beforeAvatarUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2) {
        alert("上传模板只能是 xls、xlsx格式!");
      }
      if (!isLt2M) {
        alert("上传模板大小不能超过 10MB!");
      }
      return extension || (extension2 && isLt2M);
    },
    daoru() {
    },
    //删除
    Slice() {
      this.loading = true
      this.$confirm("确认删除订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        (this.searchData.price = ""),
          (this.searchData.enclosureUrl = ""),
          (this.searchData.helowinPeople = ""),
          (this.searchData.remark = ""),
          (this.searchData.channelPeople = "")
           this.loading = false 
      });
    },
    reset() {
      this.$emit("quxiao");
    },
    success(response, file, fileList) {
     this.searchData.enclosureName = file.name
      this.searchData.enclosureUrl = response.body.obj.filePath;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  //创建sn
    branchAdd(es) {
      
        if(es.text == ""){
         return
      }
        if (/^(T1).*/.test(es.text)) {
        es.type = "动态心电记录仪";
        (es.xh = "HM503A1");
      }
      if (/^(T3).*/.test(es.text)) {
        es.type = "心电记录仪";
        (es.xh = "HM505B1"), (es.mark = "2");

      }
      if (/^(T4).*/.test(es.text)) {
        es.type = "心电记录仪";
        (es.xh = "HM505B2")  ;
      }
         if (/^(T1).*/.test(es.text)) {
           this.count++;
      }
        if (/^(T3).*/.test(es.text)) {
          this.counts++;
      }
        if (/^(T4).*/.test(es.text)) {
          this.countd++
      }
      this.tableData.push({
        text: "",
        type: "",
        xh: "",
        index: "",
        mark: ""
      });
      this.sn.push(es.text)
    },
    //删除sn
    btn(str, index) {
            if (this.tableData[index].mark == 1) {
        if (this.count > 0) {
          this.count--;
        }
      } else if (this.tableData[index].mark == 2) {
        if (this.counts > 0) {
          this.counts--;
        }
      } else if (this.tableData[index].mark == 3) {
        if (this.countd > 0) {
          this.countd--;
        }
      }
      this.tableData.splice(index, 1)
      if (this.tableData.length == 0) {
         this.tableData.push({
        text: "",
        type: "",
        xh: "",
        index: "",
        mark: ""
      });
      }
      this.sn.splice(index, 1);
      //  this.counts--,
      //   this.countd--
    },
    delt() {},
    // 保存
    async hold() {
		console.log(11111,this.searchData)
    if( this.searchData.price == ""){
       this.loading = false;
       this.$message.error('订单金额不可以为空');
       return
    }
	if(!/^[0-9]*$/.test(this.searchData.price) ){
	   this.loading = false;
	   this.$message.error('订单金额只能是数字');
	   return
	}
     if( this.searchData.helowinPeople == ""){
       this.loading = false;
       this.$message.error(' 好络维联系人不可以为空');
        return
    }
        if( this.searchData.remark.length  >= "100"){
       this.loading = false;
       this.$message.error('备注信息不超过100字符');
        return
    }
    //    if( this.searchData.enclosureUrl == ""){
    //    this.loading = false;
    //    this.$message.error('附件不可以为空');
    //     return
    // }
    if(this.sn == ""){
       this.loading = false;
       this.$message.error('SN不可以为空');
        return
    }
if(this.searchData.price !="" ||this.searchData.helowinPeople != "" || this.searchData.remark != ""  || this.sn != ""){
  this.loading = true
  let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001014001"
          },
          body: {
            channelBusiness: this.searchData.channelBusiness,
            channelId: this.qunbus.id,
            channelPeople: this.searchData.channelPeople,
            deviceSnArray: this.sn,
            enclosureUrl: this.searchData.enclosureUrl,
            helowinPeople: this.searchData.helowinPeople,
            price: this.searchData.price,
            remark: this.searchData.remark,
            orderDate: this.searchData.orderDate,
            enclosureName:this.searchData.enclosureName
          }
        };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000" && res.data.respHead.respMsg === "002") {
             let routeData =  this.$router.resolve({
			      name: "repeats",
			      query: {
			        repeats: res.data.body.data
            },
         })
            window.open(routeData.href);
        }
         if (res.data.respHead.respCode === "000" && res.data.respHead.respMsg != "请求成功") {
             this.id= res.data.respHead.respMsg -0;
              
            this.$router.push({name:"Unsuccessful",params:{
                cd :   res.data.body.data
            }})
        }
        
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.$emit("yinchang");
        }
      } catch (e) {
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    }
      
    }
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  }
};
</script>
<style  >
.top .wenjian {
  display: flex;
}
.top .color {
  color: blue;
}
.top .dar {
  margin-left: 80px;
  color: blue;
  cursor: pointer;
}
.top  .dars {
  float: right;
  color: blue;
  cursor: pointer;
}
.top  .je {
  display: flex;
}
.top  .ensureButt {
  float: right;
}
.top  .qerr{
	height: 50px;
	line-height: 50px;
}
/* .qada{
	width: 60%;
} */
.top  .aeae{
  width: 180px;
}
.top  .bunss{
	float: left;
}

.top  .adaeee{
	width:100%;
}
.top .btnst {
	float: right;
	margin-left: 20px;
}

</style>