<template>
    <div class="classification"  v-loading="loading">
        <crumbs >
            <div class slot="crumbs">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item>运营中心</el-breadcrumb-item>
                    <el-breadcrumb-item>标签管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </crumbs>
        <div class="searchData">
            <div>
                <span>名称:</span>
                <span><el-input  placeholder style="width: 150px;"  v-model.trim="labelName"  clearable></el-input></span>
            </div>
            <div>
                <span>标签文章数:</span>
                <span><el-input  placeholder style="width: 150px;" v-model.trim="articleCount" clearable></el-input></span>
            </div>
            <div class="btn">
                <span type="primary"  @click="query">查询</span>
                <span type="primary" @click="clasif">新增</span>
            </div>
        </div>
        <div>
            <el-table border  :data="tableData">
                <el-table-column label="序号" >
                    <template slot-scope="scope">
                        <p>{{ scope.$index+page.serialnumber}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="标签名称">
                    <template  slot-scope="scope"  min-width="100%" >
                        <p>{{scope.row.labelName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="标签文章数"  min-width="100%">
                    <template slot-scope="scope">
                        <p>{{scope.row.articleCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <span type="danger" class="details"  @click="make(scope.row,scope.$index)">修改名称</span>
                        <span type="danger" class="details"  @click="dele(scope.row,scope.$index)">删除 </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                title="添加标签"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <div>
                <span>标签名称:</span>
                <span><el-input  placeholder style="width: 80%;"  v-model="categoryNames"  clearable ></el-input></span>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="Determine">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="标签详情"
                :visible.sync="dialog"
                width="30%"
                :before-close="handleClose">
            <div>
                <span>分类名称:</span>
                <span><el-input  placeholder style="width: 80%;"  v-model="labelNames" clearable></el-input></span>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialog = false">取 消</el-button>
    <el-button type="primary" @click="name">确 定</el-button>
  </span>
        </el-dialog>
        <div class="list_page">
            <el-pagination
                    background
                    layout="prev, pager, next,total,jumper"
                    :page-size="page.size"
                    :current-page="page.num + 1"
                    @current-change="pagechange"
                    :total="page.total"
            ></el-pagination>
        </div>
        <!--   删除-->
        <el-dialog
                title="分类详情"
                :visible.sync="diada"
                width="30%"
                :before-close="handleClose">
            <div>
                <p>您确定要删除标签名称为{{nameclass}} 吗?</p>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="diada = false">取 消</el-button>
    <el-button type="primary" @click="deletet">确 定</el-button>
  </span>
        </el-dialog>
    </div>

    </div>
</template>

<script>
    import Code from './Code.vue';
    import crumbs from '@/components/common/Crumbs'
    import { formatDay, formatDate, formatSecond ,formatYear,formatDates,GetYearStr} from "@/lib/time";
    import util from '@/lib/util';
    import axios from 'axios';
    import config from '@/lib/global';
    export default {
        name: "Label",
        components: {
            Code,crumbs
        },
        data(){
            return {
                loading:false,
                dialogVisible:false,
                dialogVisibleda:false,
                dialog:false,
                diada:false,
                labelName:"",
                articleCount:"",
                categoryNames:"",
                labelNames:"",
                tableData:[],
                resd:"",
                nameclass:"",
                ida:"",
                page: {
                    total: 0,
                    size: 15,
                    num: 0,
                    serialnumber: 0,
                    nums:1
                },
            }
        },
        created(){
            this.activations()
            //回车事件
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                    this.query()
                }
            }
        },
        methods:{
            //删除
            async deletet(){
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002004003'
                    },
                    body:{
                        id: this.ida,

                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.diada = false
                        this.activations()

                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }

            },
            dele(row){
                this.diada = true
                this.nameclass = row.labelName
                this.ida = row.id
            },
            //修改名称
            async   name(){

                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002004002'
                    },
                    body:{
                        id:this.resd.id,
                        labelName:this.labelNames,
                        labelCode:this.resd.labelCode
                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.dialog = false
                        this.activations()
                        this.labelNames = ""
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            make(row){
              this.dialog = true
                this.labelNames = row.labelName
                this.resd = row
            },
            clasif(){
                this.dialogVisible = true
            },
            //添加标签
            async Determine (){
                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002004001'
                    },
                    body:{

                        labelName:this.categoryNames,
                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.dialogVisible   = false
                        this.activations()
                        this.categoryNames =""
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {

                        done();
                    })
                    .catch(_ => {});
            },
            //分页
            pagechange(val){
                this.page.num = val - 1;
                this.query()
                // this.activations()
        },
            clasif(){
                this.dialogVisible = true
            },
            //获取数据
            async activations(){
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002004005'
                    },
                    body:{
                        pageSize: this.page.size,
                        pageNum: this.page.num,
                    }
                };
                this.loading =true
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.tableData =  res.data.body.data.datas;
                        this.page.size = res.data.body.data.pageSize;
                        this.page.total = res.data.body.data.total;
                        this.page.num = res.data.body.data.pageNum
                        this.page.serialnumber = 1 + this.page.size * this.page.num;
                        this.loading = false
                        console.log(66666,res)
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            //搜索
            async query(){
                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002004005'
                    },
                    body:{
                        pageSize: this.page.size,
                        pageNum: this.page.num,
                        labelName:this.labelName,
                        articleCount:this.articleCount,
                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.tableData =  res.data.body.data.datas
                        this.page.size = res.data.body.data.pageSize;
                        this.page.total = res.data.body.data.total;
                        this.page.num = res.data.body.data.pageNum

                        this.page.serialnumber = 1 + this.page.size * this.page.num;
                        this.loading = false

                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
        }
    }
</script>

<style scoped>
    .classification .searchData {
        display: flex;
        flex-wrap: wrap;
    }
    .classification .searchData div {
        /* display: flex;
        flex-wrap: wrap;
        height:50px;
        line-height: 50px; */
        height: 100%;
        line-height: 50px

    }
    .classification .searchData div span {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
    }
    .classification .el-date-editor--datetimerange.el-input__inner {
        width: 360px;
        height: 40px;
    }
    .classification  .btn{
        height: 28px;
        line-height: 28px;
    }
    .classification  .btn span{
        display: inline-block;
        color: #FFFFFF;
        background: #409EFF;
        padding: 0 8px;
        margin-left: 6px;
        cursor: pointer;
        font-size: 14px;
        border-radius: 10px
    }
    .classification .details{
        color: #409EFF;
        cursor: pointer;
        margin-left: 10px;
    }
</style>