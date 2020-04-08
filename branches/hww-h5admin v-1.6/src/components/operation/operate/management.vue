<template>
    <div class="management" v-loading="loading">
        <crumbs >
            <div class slot="crumbs">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item>运营中心</el-breadcrumb-item>
                    <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </crumbs>
        <div class="searchData">
            <div>
                <span>标题:</span>
                <span><el-input v-model="searchData.resourceTitle" placeholder style="width: 160px;" clearable></el-input></span>
            </div>
            <div>
                <span>作者:</span>
                <span><el-input v-model="searchData.author" placeholder style="width: 160px;" clearable></el-input></span>
            </div>
            <div>
                <div>
                    <span>分类:</span>
                    <span>
							<el-select v-model="searchData.categoryId" clearable style="width: 150px;">
								<el-option
                                        v-for="item in category"
                                        :key="item.id"
                                        :label="item.categoryName"
                                        :value="item.id"
                                ></el-option>
							</el-select>
						</span>
                </div>
            </div>
            <div>
                <div>
                    <span>类型:</span>
                    <span>
							<el-select v-model="searchData.resourceType" clearable style="width: 150px;">
								<el-option
                                        v-for="item in type"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                ></el-option>
							</el-select>
						</span>
                </div>
            </div>
            <div class="time">
                <span class="pxs" >录入时间:</span>
                <el-date-picker
                        v-model="searchData.time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="input-class"
                        @change="codes"
                ></el-date-picker>
            </div>

            <div>
                <span>浏览量:</span>
                <el-input v-model="searchData.leftViewCount" placeholder style="width: 80px;" clearable></el-input>
                <span >------</span>
                <el-input v-model="searchData.rightViewCount" placeholder style="width: 80px;" clearable></el-input>
                <span>个</span>
            </div>
            <div>
                <span>收藏量:</span>
                <el-input v-model="searchData.leftColCount" placeholder style="width: 80px;" clearable></el-input>
                <span>------</span>
                <el-input v-model="searchData.rightColCount" placeholder style="width: 80px;" clearable></el-input>
                <span>个</span>
            </div>
            <div class="btn">
                <span type="primary" @click="adde">新增</span>
                <span type="primary"  @click="query">查询</span>
                <span  @click="Reset">重置查询条件</span>
            </div>
        </div>
        <div>
            <el-table border :data="tableData"  >
                <el-table-column label="序号" >
                    <template slot-scope="scope">
                        <p>{{ scope.$index+page.serialnumber}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="标题">
                    <template  slot-scope="scope"  min-width="100%" >
                        <p>{{scope.row.resourceTitle }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="作者"  min-width="100%" >
                    <template slot-scope="scope">
                        <p>{{scope.row.author }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="分类"  min-width="100%" >
                    <template slot-scope="scope">
                        <p>{{ scope.row.categoryName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="类型"  min-width="100%">
                    <template slot-scope="scope">
                        <p >{{scope.row.resourceType  | type }}</p>

                    </template>
                </el-table-column>
                <el-table-column label="录入时间"  min-width="100%">
                    <template slot-scope="scope">
                        <p v-if="scope.row.createdAt !=''">{{scope.row.createdAt  | formatDateFilter}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="浏览量"  min-width="100%">
                    <template slot-scope="scope">
                        <p>{{scope.row.realViewCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="收藏量"  min-width="100%">
                    <template slot-scope="scope">
                        <p>{{scope.row.colCount }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <span type="danger" class="details" style="margin-right: 10px" @click="details(scope.row)">查看详情</span>
                        <span type="danger" class="details"  @click="deletes(scope.row)">删除 </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
    </div>
</template>

<script>
    import Code from './Code.vue';
    import crumbs from '@/components/common/Crumbs'
    import {  formatDate, formatSecond ,formatYear,formatDates,GetYearStr} from "@/lib/time";
    import util from '@/lib/util';
    import axios from 'axios';
    import config from '@/lib/global';
    export default {
        name: "management",
        components: {
            Code,crumbs
        },
        created(){
            //回车事件
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                    this.primary()
                }
            }
        },
        data(){
            return{
                loading: false,
                searchData: {
                    author:"",
                    categoryId:"",
                    leftColCount:"",
                    rightColCount:"",
                    leftViewCount:"",
                    rightViewCount:"",
                    resourceTitle:"",
                    resourceType:"",
                    beginTime:"",
                    endTime:"",
                    time:""
                },
                type: [

                    {
                        value: '1',
                        name: '外链'
                    },
                    {
                        value: '2',
                        name: '图文'
                    },
                    {
                        value: '3',
                        name: '视频'
                    }

                ],
                category:[],
                tableData:[],
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
            this.categorys()

            //回车事件
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                    this.query()
                }
            }
        },
        methods:{
            //重置
            Reset(){
                this.searchData.author="",
                this.searchData.categoryId="",
                this.searchData.leftColCount="",
                this.searchData.rightColCount="",
                this.searchData.leftViewCount="",
                this.searchData.rightViewCount="",
                this.searchData.resourceTitle="",
                this.searchData.resourceType="",
                this.searchData.beginTime="",
                this.searchData.endTime=""
                this.activations()
            },
            //咨询分类
            async categorys() {
                let Url = ""
                let params = {
                    reqHead: {
                        functionId: 'DWA002003004'
                    },
                    body: {}
                };
                try {
                    let res = await util.ajax.post(Url, params);
                    if (res.data.respHead.respCode === "000") {
                        this.category = res.data.body.data;
                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            //查询
            async query (){
                if(this.searchData.rightViewCount < this.searchData.leftViewCount){
                    this.$message.error('浏览量的值不能小于初始值');
                    return
                }
                if(this.searchData.rightColCount < this.searchData.rightColCount){
                    this.$message.error('收藏量的值不能小于初始值');
                    return
                }
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002001005'
                    },
                    body:{
                        pageSize: this.page.size,
                        pageNum: this.page.num,
                        author:this.searchData.author,
                        categoryId:this.searchData.categoryId,
                        leftColCount:this.searchData.leftColCount,
                        rightColCount:this.searchData.rightColCount,
                        leftViewCount:this.searchData.leftViewCount,
                        rightViewCount:this.searchData.rightViewCount,
                        resourceTitle:this.searchData.resourceTitle,
                        resourceType:this.searchData.resourceType,
                        beginTime:this.searchData.beginTime,
                        endTime:this.searchData.endTime,
                    }
                };
                this.loading =true
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.loading = false
                        this.tableData =  res.data.body.data.datas;

                        this.page.size = res.data.body.data.pageSize;
                        this.page.total = res.data.body.data.total;
                        this.page.num = res.data.body.data.pageNum
                        this.page.serialnumber = 1 + this.page.size * this.page.num;
                        console.log(66666,res)
                    }else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                }catch (e){

                }
            },
            //删除
            async  deletes(row){
                this.loading =true
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let Url = ""
                    let params = {
                        reqHead: {
                            functionId: 'DWA002001003'
                        },
                        body: {
                            id:row.id
                        }
                    };
                    util.ajax.post(Url, params).then( res => {
                        this.loading = false
                        this.activations()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            codes(){
              this.searchData.beginTime = formatDate(this.searchData.time[0])
                this.searchData.endTime = formatDate(this.searchData.time[1])

            },

            adde(){
                this.$router.push({name:"added"})
            },
            pagechange(val){
                this.page.num = val - 1;
                this.query()
                // this.activations()
            },
            //获取数据
            async activations(){
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002001005'
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
             details(row){
                 this.$router.push({name:"DetailsManagement",params:{
                         row: row
                     }})
            },
        },
        filters:{
            formatDateFilter(val){
                return formatDate(val)
            },
            type(val){
                switch (val) {
                    case 1:
                        return "外链"
                    case 2:
                        return "图文"
                    case 3:
                        return "视频"
                }
            }
        }
    }
</script>

<style scoped>
    .management .searchData {
        display: flex;
        flex-wrap: wrap;
    }
    .management .searchData div {
        /* display: flex;
        flex-wrap: wrap;
        height:50px;
        line-height: 50px; */
        height: 100%;
        line-height: 50px

    }
    .management .searchData div span {
        height: 40px;
        line-height: 40px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .management .el-date-editor--datetimerange.el-input__inner {
        width: 360px;
        height: 40px;
    }
    .management  .btn{
        height: 28px;
        line-height: 28px;
    }
    .management  .btn span{
        display: inline-block;
        color: #FFFFFF;
        background: #409EFF;
        padding: 0 8px;
        margin-left: 6px;
        cursor: pointer;
        font-size: 14px;
        border-radius: 10px;
    }
    .management .details{
        color: #409EFF;
        cursor: pointer;
    }
</style>