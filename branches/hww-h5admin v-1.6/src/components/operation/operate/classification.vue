<template>
    <div class="classification"  v-loading="loading">
        <crumbs >
            <div class slot="crumbs">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item>运营中心</el-breadcrumb-item>
                    <el-breadcrumb-item>分类管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </crumbs>
        <div class="searchData">
            <div>
                <span>名称:</span>
                <span><el-input  placeholder style="width: 150px;" v-model="categoryName" clearable></el-input></span>
            </div>
            <div>
                <span>状态:</span>
                <span>
							<el-select  clearable style="width: 150px;" v-model="status">
								<el-option
                                        v-for="item in durationType_list"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                ></el-option>
							</el-select>
						</span>
            </div>
            <div class="btn">
                <span type="primary" @click="clasif">新增</span>
                <span type="primary"  @click="query">查询</span>
            </div>
        </div>
        <div>
            <el-table border  :data="tableData">
                <el-table-column label="序号" >
                    <template slot-scope="scope">
                        <p>{{ scope.$index+page.serialnumber}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="分类名称">
                    <template  slot-scope="scope"  min-width="100%" >
                        <p>{{scope.row.categoryName }}</p>
                    </template>
                </el-table-column>


                <el-table-column label="状态"  min-width="100%">
                    <template slot-scope="scope">
                        <p >{{scope.row.status | statud}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="分类文章数"  min-width="100%">
                    <template slot-scope="scope">
                        <p>{{scope.row.articleCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <span type="danger" class="details"  @click="make(scope.row,scope.$index) ">修改名称</span>
                        <span type="danger" class="details" @click="offline(scope.row,scope.$index)">{{scope.row.status | statud}} </span>
                        <span type="danger" class="details"  @click ="dele(scope.row,scope.$index)">删除 </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
<!--        新增-->
        <el-dialog
                title="添加分类"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <div>
                <span style="margin-right: 5px">分类名称:</span>
                <span><el-input  placeholder style="width: 80%;" clearable v-model="categoryNames"></el-input></span>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="Determine">确 定</el-button>
  </span>
        </el-dialog>
<!--        修改名称-->
        <el-dialog
                title="分类详情"
                :visible.sync="dialogVisibleda"
                width="30%"
                :before-close="handleClose">
            <div>
                <span>分类名称:</span>
                <span><el-input  placeholder style="width: 80%;" clearable v-model="categoryNameda"> </el-input></span>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleda = false">取 消</el-button>
    <el-button type="primary" @click="name">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="分类详情"
                :visible.sync="dialog"
                width="30%"
                :before-close="handleClose">
            <div>
                <el-dialog
                        width="30%"
                        :visible.sync="innerVisible"
                        title="分类详情"
                        append-to-body>
                    <p>您确定要将分类名称为{{categoryNameda}} 下线吗?</p>
                    <span slot="footer" class="dialog-footer"></span>
                    <div style="float: right ;margin-bottom: 10px">
                        <el-button @click="innerVisible = false"  >取 消</el-button>
                        <el-button type="primary" @click="verification ">确 定</el-button>
                    </div>

                </el-dialog>
                <el-radio v-model="isAudit" label="0">上线</el-radio>
                <el-radio v-model="isAudit" label="1">下线</el-radio>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialog = false">取 消</el-button>
    <el-button type="primary" @click="available ">确 定</el-button>
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
                <p>您确定要删除分类名称为{{nameclass}} 吗?</p>
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
        name: "classification",
        components: {
            Code,crumbs
        },
        data(){
            return {
                diada:false,
                categoryNameda:"",
                categoryNames:"",
                loading:false,
                dialogVisible:false,
                dialogVisibleda:false,
                dialog:false,
                innerVisible:false,
                tableData:[],
                status:"",
                categoryName:"",
                nameclass:"",
                isAudit:"",
                ids:"",
                page: {
                    total: 0,
                    size: 15,
                    num: 0,
                    serialnumber: 0,
                    nums:1
                },
                resd:"",
                ida:"",
                durationType_list: [

                    {
                        value: '0',
                        name: '上线'
                    },
                    {
                        value: '1',
                        name: '下线'
                    }

                ],
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
            dele(row){
               this.diada = true
                this.ida = row.id
                this.nameclass  = row.categoryName
            },
            //删除
            async deletet(){
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002003003'
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
            //上线下线
            async  available(){
                if(this.isAudit == "1"){
                    this.innerVisible = true
                    return
                }
                if(this.isAudit == "0"){
                    this.innerVisible = false
                    this.loading =true
                    let Url = ""
                    let	params = {
                        reqHead: {
                            functionId: 'DWA002003007'
                        },
                        body:{
                            status:this.isAudit,
                            id: this.ids,

                        }
                    };
                    try {
                        let res = await  util.ajax.post(Url, params);
                        if(res.data.respHead.respCode === "000"){
                            this.loading = false
                            this.dialog = false
                            this.activations()

                        }else {
                            this.$message.error(`${res.data.respHead.respMsg}`);
                        }
                    }catch (e){

                    }
                }
            },
            //修改上下线
            async verification (){
                console.log(this.isAudit)
                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002003007'
                    },
                    body:{
                        status:this.isAudit,
                        id: this.ids,

                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.innerVisible = false
                        this.dialog = false
                        this.activations()

                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            //上下线一级
            offline(row){
               this.dialog = true
                this.isAudit = row.status.toString()
                this.ids = row.id
                console.log( 633333,row)


            },
            //修改名称
            async   name(){

                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002003002'
                    },
                    body:{
                        categoryName:this.categoryNameda,
                        categoryCode:this.resd.categoryCode,
                        iconUrl:this.resd.iconUrl,
                        id:this.resd.id,
                        orderNo:this.resd.orderNo
                    }
                };
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.dialogVisibleda   = false
                        this.activations()
                        this.categoryNameda = ""
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            //修改名称
             make (res,index){
                this.resd = res
                this.dialogVisibleda = true
                 this.categoryNameda = res.categoryName
            },
            //新增
            async Determine (){
                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002003001'
                    },
                    body:{

                        categoryName:this.categoryNames,
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
            //查询
            async query(){
                this.loading =true
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002003005'
                    },
                    body:{
                        pageSize: this.page.size,
                        pageNum: this.page.num,
                        status:this.status,
                        categoryName:this.categoryName,
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
                        functionId: 'DWA002003005'
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
                        this.tableData =  res.data.body.data.datas
                        this.page.size = res.data.body.data.pageSize;
                        this.page.total = res.data.body.data.total;
                        this.page.num = res.data.body.data.pageNum
                        console.log(  8788,this.page.num)
                        this.page.serialnumber = 1 + this.page.size * this.page.num;
                        this.loading = false
                        console.log(66666,res)
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            }
        },
        filters:{
            statud(val){
                switch (val) {
                    case 0:
                        return "上线"
                    case 1:
                        return "下线"
                }
            }
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