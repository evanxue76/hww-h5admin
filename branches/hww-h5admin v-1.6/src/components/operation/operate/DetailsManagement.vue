<template>
    <div class="added">
        <crumbs >
            <div class slot="crumbs">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item>运营中心</el-breadcrumb-item>
                    <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
                    <el-breadcrumb-item>资讯详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </crumbs>
        <div class="form">
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯标题*:</span>
                <span><el-input v-model="form.resourceTitle" placeholder style="width: 50%;margin-left: 60px"  clearable maxlength="50" show-word-limit></el-input></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯作者*:</span>
                <span><el-input v-model="form.author" placeholder style="width: 50%;margin-left: 60px" clearable></el-input></span>
            </div>
<!--            <div style="margin-top: 20px">-->
<!--                <span style="margin-right:20px ">资讯图片*:</span>-->
<!--                <div style="margin-left: 80px">-->
<!--                    <el-upload-->
<!--                            style="margin-left: 40px"-->
<!--                            class="avatar-uploader"-->
<!--                            action="image/*"-->
<!--                            :show-file-list="false"-->
<!--                            :on-success="handleAvatarSuccess"-->

<!--                    >-->
<!--                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">-->
<!--                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                    </el-upload>-->
<!--                </div>-->
<!--            </div>-->
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯图片*:</span>
                <div style="margin-left: 120px">
                    <el-upload
                            style="margin-left: 40px"
                            :action="upUrl"
                            list-type="picture-card"
                            v-model="form.cover"
                            :file-list="fileList"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="form.urllod">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯分类*:</span>
                <span><el-select v-model="form.categoryId" placeholder="请选择" clearable multiple filterable
                                 style="width: 50%;margin-left: 60px">
                            <el-option
                                    v-for="item in form.category"
                                    :key="item.id"
                                    :label="item.categoryName"
                                    :value="item.id"
                            >
                    </el-option>
  </el-select></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯标签*:</span>
                <span><el-select v-model="form.labelIds" placeholder="请选择" clearable multiple filterable
                                 style="width: 50%;margin-left: 60px">
                            <el-option
                                    v-for="item in form.label"
                                    :key="item.id"
                                    :label="item.labelName"
                                    :value="item.id"
                            >
                    </el-option>
  </el-select></span>
            </div>
            <div style="margin-top: 20px">
                <div class="adww">
                    <span style="margin-right:20px ">资讯类型*:</span>
                    <el-radio v-model="form.radio" label="1" style="margin-left: 60px" @change="tab()">外链</el-radio>
                    <el-radio v-model="form.radio" label="2"  @change="tab()">图文</el-radio>
                    <el-radio v-model="form.radio" label="3"  @change="tab()">视频</el-radio>
                    <div class="btns">
                        <el-button type="primary" style="margin-left: 22%;margin-bottom: 10px" @click="labels">预览
                        </el-button>
                        <div id="qrcode"
                             v-if="this.form.content != '' || this.form.outerChain !='' || this.form.appVideoUrl !='' || this.form.h5VideoUrl !='' "></div>
                    </div>
                </div>
            </div>
            <div>
                <div style="margin-top: 20px"  v-show="form.outside">
                    <span style="margin-right:20px ">外链地址*:</span>
                    <span><el-input v-model="form.outerChain" placeholder style="width: 50%;margin-left: 60px" clearable></el-input></span>
                </div>
                <div style="margin-top: 20px" v-show="form.richtext">
                    <div style="display: flex">
                        <div>
                            <section class="previewContent" v-html="form.content" style="margin-left: 160px;"></section>
                        </div>
                        <div>
                            <quill-editor
                                    style="width: 50%;margin-left: 80px; height: 300px;"
                                    v-model="form.content"
                                    :options="editorOption"
                                    ref="myQuillEditor"
                                    @change="onEditorChange($event)"
                            ></quill-editor>
                        </div>
                    </div>


                </div>
                <div style="margin-top: 20px" v-show="form.video">
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px ">H5视频地址*:</span>
                        <span><el-input v-model="form.h5VideoUrl" placeholder style="width: 50%;margin-left: 40px" clearable></el-input></span>
                    </div>
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px "  placeholder="请输入视频地址">H5视频时长*:</span>
                        <span><el-input v-model="form.h5VideoTime" placeholder="请输入视频时长(格式 : xx:xx:xx)" style="width: 50%;margin-left: 40px" clearable></el-input></span>
                    </div>
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px "  placeholder="请输入视频地址">APP视频地址*:</span>
                        <span><el-input v-model="form.appVideoUrl" placeholder="请输入视频时长(格式 : xx:xx:xx)" style="width: 50%;margin-left: 26px" clearable></el-input></span>
                    </div>
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px "  placeholder="请输入视频地址">APP视频地址*:</span>
                        <span><el-input v-model="form.appVideoTime" placeholder="请输入视频时长(格式 : xx:xx:xx)" style="width: 50%;margin-left: 26px" clearable></el-input></span>
                    </div>
                </div>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">初始浏览量*:</span>
                <span><el-input v-model="form.initCount" placeholder style="width: 50%;margin-left: 40px" clearable></el-input></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">页面浏览量:</span>
                <span><el-input v-model="form.virtualViewCount" placeholder style="width: 50%;margin-left: 40px" clearable disabled></el-input></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">实际浏览量:</span>
                <span><el-input v-model="form.realViewCount" placeholder style="width: 50%;margin-left: 40px" clearable disabled></el-input></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">收藏量:</span>
                <span><el-input v-model="form.colCount" placeholder style="width: 50%;margin-left: 70px" clearable disabled></el-input></span>
            </div>
            <div style="margin-top: 60px;text-align: center">
                <el-button type="danger" @click="open">删除</el-button>
                <el-button type="primary"  @click="Determine">确定</el-button>
                <el-button  @click="cancels">取消</el-button>
            </div>
        </div>
        <template>
            <div>
                <!-- 图片上传组件辅助-->
                <el-upload
                        v-show="uploadImg"
                        id="avatar-uploader"
                        :accept="'image/*'"
                        :action="upUrl"
                        name="file"
                        :show-file-list="false"
                        :on-success="quilluploadSuccess"
                        :before-upload="beforeUpload"
                ></el-upload>
            </div>
        </template>
    </div>
</template>

<script>
    import { toolbarOptions  } from '@/lib/dataConfig'
    import Code from './Code.vue';
    import crumbs from '@/components/common/Crumbs'
    import upUrl from '@/lib/upUrl'
    import { formatDay, formatDate, formatSecond ,formatYear,formatDates,GetYearStr} from "@/lib/time";
    import util from '@/lib/util';
    import axios from 'axios';
    import config from '@/lib/global';
    import QRCode from "qrcodejs2";
    export default {
        name: "DetailsManagement",
        components: {
            Code,crumbs,QRCode
        },
        data(){
            return {
                form:{
                    colCount:"",
                    realViewCount:"",
                    virtualViewCount:"",
                    initCount:"",
                    outerChain:"",
                    urllod:false,
                    resourceTitle:"",
                    cover:"",
                    author:"",
                    val:"",
                    imageUrl: '',
                    radio: '',
                    outside:true,
                    richtext:false,
                    video:false,
                    content:"", //富文本内容
                    articleBid:"",
                    labelIds:[],
                    label:[],
                    categoryId:[],
                    category:[],
                    appVideoUrl:"",
                    appVideoTime:"",
                    h5VideoUrl:"",
                    h5VideoTime:""
                },
                id:"",
                elId:"",
                link:"",
                idsd:"",
                fileList:[],
                dialogImageUrl:"",
                list:"",
                uploadImg: false,
                upUrl,
                editorOption: {
                    //富文本上传图片方法
                    placeholder: '',
                    theme: 'snow', // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector('#avatar-uploader input').click()
                                    } else {
                                        this.quill.format('image', false)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        created(){
            this.form.articleBid = this.$route.params.row.articleBid
            this.id = this.$route.params.row.id
            this.activations()
            this.label()
            this.category()

        },
        methods: {
            //确定修改
            async Determine(){
                this.loading=true
                if(this.form.resourceTitle == ""){
                    this.$message.error('资讯标题不可以为空');
                    return
                }
                if(this.form.radio == "1" && this.form.outerChain ==""){
                    this.$message.error('外链地址不可以为空');
                    return
                }
                if(this.form.radio == "2" && this.form.content ==""){
                    this.$message.error('图文内容不可以为空');
                    return
                }
                if(this.form.radio == "3" && this.form.h5VideoUrl =="" && this.form.appVideoUrl==""){
                    this.$message.error('视频H5地址或者App请填写一个');
                    return
                }
                if(this.form.radio == "3" && this.form.appVideoTime.length < 8 && this.form.h5VideoTime.length < 8){
                    this.$message.error('视频H5时长或者App的时长必须是8位数');
                    return
                }
                let Url = ""
                let params = {
                    reqHead: {
                        functionId: 'DWA002001002'
                    },
                    body: {
                        id:this.id,
                        resourceTitle:this.form.resourceTitle,
                        author:this.form.author,
                        cover:this.form.cover,
                        categoryIds:this.form.categoryId,
                        labelIds:this.form.labelIds,
                        resourceType: this.form.radio,
                        outerChain : this.form.outerChain,
                        initCount : this.form.initCount,
                        virtualViewCount : this.form.virtualViewCount,
                        realViewCount : this.form.realViewCount,
                        colCount : this.form.colCount,
                        content  : this.form.content,
                        appVideoUrl : this.form.appVideoUrl,
                        appVideoTime : this.form.appVideoTime,
                        h5VideoUrl : this.form.h5VideoUrl,
                        h5VideoTime : this.form.h5VideoTime
                    }
                };
                try {
                    let res = await util.ajax.post(Url, params);
                    if (res.data.respHead.respCode === "000") {
                       this.loading=false
                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            //取消
            cancels(){
                this.$router.push({name: "management"})
            },
            //二次删除
          open() {
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
                             id:this.id
                        }
                    };
                       util.ajax.post(Url, params).then( res => {
                            this.loading =false
                           this.$router.push({name: "management"})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //  生成二维码
            qrcode() {
                let that = this;
                let qrcode = new QRCode('qrcode', {
                    width: 124,
                    height: 124,        // 高度
                    text: this.link,   // 二维码内容
                    // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    // background: '#f0f',   // 背景色
                    // foreground: '#ff0'    // 前景色
                })
            },
            //获取二维码值
            async labels() {
                if(this.form.resourceTitle == ""){
                    this.$message.error('资讯标题不可以为空');
                    return
                }
                if(this.form.radio == "1" && this.form.outerChain ==""){
                    this.$message.error('外链地址不可以为空');
                    return
                }
                if(this.form.radio == "2" && this.form.content ==""){
                    this.$message.error('图文内容不可以为空');
                    return
                }
                if(this.form.radio == "3" && this.form.h5VideoUrl =="" && this.form.appVideoUrl==""){
                    this.$message.error('视频H5地址或者App请填写一个');
                    return
                }
                if(this.form.radio == "3" && this.form.appVideoTime.length < 8 && this.form.h5VideoTime.length < 8){
                    this.$message.error('视频H5时长或者App的时长必须是8位数');
                    return
                }
                console.log(2222)
                if (this.form.content == "" && this.form.outerChain == '' && this.form.appVideoUrl !='' && this.form.h5VideoUrl !='') {
                    this.link = ""
                } else {
                    this.loading = true
                    let Url = ""
                    let params = {
                        reqHead: {
                            functionId: 'DWA002001011'
                        },
                        body: {
                            articleBid: this.form.articleBid ,
                            content: this.form.content,
                            initCount: this.form.initCount,
                            resourceTitle: this.form.resourceTitle,
                            virtualViewCount: "",
                            resourceType: this.form.radio
                        }
                    };
                    try {
                        let res = await util.ajax.post(Url, params);
                        if (res.data.respHead.respCode === "000") {
                            // this.link = this.form.content
                            this.idsd = res.data.body.data.id
                            this.link = res.data.body.data.qrCodeTextUrl
                            console.log(res)
                            this.qrcode();
                        } else {
                            this.$message.error(`${res.data.respHead.respMsg}`);
                        }
                    } catch (e) {

                    }
                }

            },
            //咨询分类
            async category() {
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
                        this.form.category = res.data.body.data;
                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            //咨询标签
            async label() {
                // this.loading = true
                let Url = ""
                let params = {
                    reqHead: {
                        functionId: 'DWA002004004'
                    },
                    body: {}
                };
                try {
                    let res = await util.ajax.post(Url, params);
                    if (res.data.respHead.respCode === "000") {
                        this.form.label = res.data.body.data;

                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            handleRemove(file, fileList) {
                // form.cover

            },
            handlePictureCardPreview(file){
                this.dialogImageUrl =file.url
                this.form.urllod = true
                console.log(55665656565, file )
            },
            // 富文本图片上传前
            beforeUpload() {
                // 显示loading动画
                this.quillUpdateImg = true
            },
            // 富文本上传图片回调
            quilluploadSuccess(res, file) {
                console.log(res)
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                // console.log(res)
                // console.log(res.respHead)
                let quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if (res.respHead.respCode === '000') {
                    // 获取光标所在位置
                    let length = quill.getSelection().index
                    // 插入图片  res.url为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', res.body.obj.filePath)
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                } else {
                    this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
            },
            //富文本编辑内容
            onEditorChange({ editor, html, text }) {
                // console.log('---内容改变事件---')
                this.content = html
                console.log(html)
                // console.log(html)
                // console.log(typeof html)
            },
            tab(){
                console.log(this.form.radio)
                switch (this.form.radio) {
                    case "1":
                        this.form.outside = true
                        this.form.richtext = false
                        this.form.video =false
                        break;
                    case  "2":
                        this.form.outside = false
                        this.form.richtext = true
                        this.form.video =false
                        break;
                    case  "3":
                        this.form.outside = false
                        this.form.richtext = false
                        this.form.video =true
                        break;
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
                this.form.cover = file.name
                console.log( this.form.cover)

            },
            async activations(){
                let Url = ""
                let	params = {
                    reqHead: {
                        functionId: 'DWA002001006'
                    },
                    body:{
                        articleBid:this.form.articleBid
                    }
                };
                this.loading =true
                try {
                    let res = await  util.ajax.post(Url, params);
                    if(res.data.respHead.respCode === "000"){
                        this.list = res.data.body.data
                          console.log(this.list)
                        this.form.resourceTitle = this.list.resourceTitle
                        this.form.author = this.list.author
                        this.form.cover = this.list.cover
                        this.fileList=[{url:this.list.cover}]
                        // var ss =  this.list.categoryIds
                        let arr = this.list.categoryIds.split(",")
                        for(var i=0;i<arr.length;i++){
                             arr[i]=Number(arr[i])
                        }
                        this.form.categoryId = arr
                        let arr1 = this.list.labelIds.split(",")
                          for(var i=0;i<arr1.length;i++){
                              arr1[i]=Number(arr1[i])
                          }
                          this.form.labelIds= arr1
                          this.form.radio = this.list.resourceType.toString()
                          if(this.form.radio == "1"){
                              this.form.outside = true
                              this.form.richtext = false
                              this.form.video =false
                          }else if(this.form.radio == "2"){
                              this.form.outside = false
                              this.form.richtext = true
                              this.form.video =false
                          }else if(this.form.radio == "3"){
                              this.form.outside = false
                              this.form.richtext = false
                              this.form.video =true
                          }
                          this.form.outerChain = this.list.outerChain
                          this.form.initCount = this.list.initCount
                          this.form.virtualViewCount = this.list.virtualViewCount
                          this.form.realViewCount = this.list.realViewCount
                          this.form.colCount = this.list.colCount
                          this.form.content  = this.list.content
                          this.form.appVideoUrl= this.list.appVideoUrl
                          this.form.appVideoTime = this.list.appVideoTime
                          this.form.h5VideoUrl = this.list.h5VideoUrl
                          this.form.h5VideoTime = this.list.h5VideoTime

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
    .added .avatar-uploader .avatar-uploader-icon{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .added  .avatar-uploader .avatar-uploader-icon:hover {
        border-color: #409EFF;
    }
    .added  .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .added  .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .added  .previewContent{
        height: 400px;
        background-color: #f3f2f2;
        min-height: 400px;
        width: 500px;
       overflow: auto;
    }
    .added .adww {
        position: relative;
    }

    .added .btns {
        position: absolute;
        right: 10%;
    }
</style>