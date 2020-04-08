<template>
    <div class="added" v-loading="form.loading">
        <crumbs>
            <div class slot="crumbs">
                <el-breadcrumb separator=">">
                    <el-breadcrumb-item>运营中心</el-breadcrumb-item>
                    <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
                    <el-breadcrumb-item>新增资讯</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </crumbs>
        <div class="form">
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯标题*:</span>
                <span><el-input v-model="form.resourceTitle" placeholder style="width: 50%;margin-left: 30px" clearable
                                maxlength="50" show-word-limit></el-input></span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯作者*:</span>
                <span><el-input v-model="form.author" placeholder style="width: 50%;margin-left: 30px" clearable
                                maxlength="10" show-word-limit></el-input></span>
            </div>
            <!--            <div style="margin-top: 20px">-->
            <!--                <span style="margin-right:20px ">资讯图片*:</span>-->
            <!--                <div style="margin-left: 80px">-->
            <!--                    <el-upload-->
            <!--                            style="margin-left: 40px"-->
            <!--                            class="avatar-uploader"-->
            <!--                            :action="upUrl"-->
            <!--                            multiple-->
            <!--                            :show-file-list="false"-->
            <!--                            :on-success="handleAvatarSuccess"-->
            <!--                            v-model="form.cover"-->
            <!--                            :before-remove="beforeRemove"-->
            <!--                           >-->
            <!--                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">-->
            <!--                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--                    </el-upload>-->
            <!--                </div>-->
            <!--            </div>-->
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯图片*:</span>
                <div style="margin-left: 80px">
                    <el-upload
                            style="margin-left: 40px"
                            :action="upUrl"
                            list-type="picture-card"
                            v-model="form.cover"
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
                <span>
                    <el-select v-model="form.categoryId" placeholder="请选择" style="width: 50%;margin-left: 30px"
                               clearable multiple filterable   @change="pickRoleName" >
    <el-option
            v-for="item in form.category"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"

    >
    </el-option>
  </el-select>
                </span>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">资讯标签*:</span>
                <span> <el-select v-model="form.labelIds" placeholder="请选择" clearable multiple filterable
                                  style="width: 50%;margin-left: 30px">
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
                    <el-radio v-model="form.radio" label="1" style="margin-left: 32px" @change="tab()">外链</el-radio>
                    <el-radio v-model="form.radio" label="2" @change="tab()">图文</el-radio>
                    <el-radio v-model="form.radio" label="3" @change="tab()">视频</el-radio>
                    <div class="btns">
                        <el-button type="primary" style="margin-left: 22%;margin-bottom: 10px" @click="labels">预览
                        </el-button>
                        <div id="qrcode"
                             v-if="this.form.content != '' || this.form.outerChain !='' || this.form.appVideoUrl !='' || this.form.h5VideoUrl !='' "></div>
                    </div>

                </div>

            </div>
            <div>
                <div style="margin-top: 20px" v-show="form.outside">
                    <span style="margin-right:20px ">外链地址*:</span>
                    <span><el-input v-model="form.outerChain" placeholder style="width: 50%;margin-left: 30px"
                                    clearable></el-input></span>

                </div>
                <div style="margin-top: 20px" v-show="form.richtext">
                    <div style="display: flex">
                        <div>
                            <section class="previewContent" v-html="form.content" style="margin-left: 90px;"></section>
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
                        <span style="margin-right:20px ">视频地址*:</span>
                        <span><el-input v-model="form.h5VideoUrl" placeholder style="width: 35%;margin-left: 36px"
                                        clearable></el-input></span>
                    </div>
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px " >转码地址*:</span>
                        <span><el-input v-model="form.h5VideoTime" placeholder="请输入转码地址(格式 : xx:xx:xx)"
                                        style="width: 35%;margin-left: 36px" clearable></el-input></span>
                    </div>
                    <div style="margin-top: 20px">
                        <span style="margin-right:20px " placeholder="请输入视频地址">视频时长*:</span>
                        <span><el-input v-model="form.appVideoTime" placeholder="请输入视频时长(格式 : xx:xx:xx)"
                                        style="width: 35%;margin-left: 30px" clearable></el-input></span>
                    </div>
                </div>
            </div>
            <div style="margin-top: 20px">
                <span style="margin-right:20px ">初始浏览量*:</span>
                <span><el-input v-model="form.initCount" placeholder style="width: 50%;margin-left: 13px"
                                clearable></el-input></span>
            </div>
            <div style="margin-top: 60px;text-align: center">
                <el-button type="primary" :id="elId" @click="submit">确定</el-button>
                <el-button @click="cancel">取消</el-button>
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
    import {toolbarOptions} from '@/lib/dataConfig'
    import Code from './Code.vue';
    import crumbs from '@/components/common/Crumbs'
    import upUrl from '@/lib/upUrl'
    import uuidv1 from 'uuid/v1'
    import {formatDay, formatDate, formatSecond, formatYear, formatDates, GetYearStr} from "@/lib/time";
    import util from '@/lib/util';
    import axios from 'axios';
    import config from '@/lib/global';
    import QRCode from "qrcodejs2"

    export default {
        name: "added",
        components: {
            Code, crumbs, QRCode
        },
        data() {
            return {
                form: {
                    elId: "",
                    urllod: false,
                    loading: false,
                    resourceTitle: "",
                    author: "",
                    cover: "",
                    imageUrl: '',
                    radio: '1',
                    outside: true,
                    richtext: false,
                    video: false,
                    content: "", //富文本内容
                    category: [],
                    categoryId: "",
                    labelIds: "",
                    label: [],
                    resourceType: "",
                    outerChain: "",
                    initCount: "",
                    appVideoUrl:"",
                    appVideoTime:"",
                    h5VideoUrl:"",
                    h5VideoTime:"",
                    categoryNameList:[]
                },
                dialogImageUrl: "",
                idsd: "",
                link: '',
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
        created() {
            this.category();
            this.label()
           this.elId = uuidv1()

        },
        methods: {
            pickRoleName(Vid){
                let obj = {}
                obj = this.form.category.find(function (res) {
                      return  res.id===Vid
                })
                console.log(obj)
            },
            handleRemove(file, fileList) {
                // form.cover

            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.form.urllod = true
                console.log(55665656565, file)
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
            onEditorChange({editor, html, text}) {
                // console.log('---内容改变事件---')
                this.content = html
                console.log(html)
                // console.log(html)
                // console.log(typeof html)
            },
            tab() {
                console.log(this.form.radio)
                switch (this.form.radio) {
                    case "1":
                        this.form.outside = true
                        this.form.richtext = false
                        this.form.video = false
                        break;
                    case  "2":
                        this.form.outside = false
                        this.form.richtext = true
                        this.form.video = false
                        break;
                    case  "3":
                        this.form.outside = false
                        this.form.richtext = false
                        this.form.video = true
                        break;
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
                this.form.cover = file.response.body.obj.filePath
                console.log(this.form.cover)
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
                        console.log(6666666, this.form.label)

                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            //新建提交
            async submit() {
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
                var articleBid =  this.elId.split("-").join("");
                console.log(articleBid)
                this.form.loading = true
                let Url = ""
                let params = {
                    reqHead: {
                        functionId: 'DWA002001001'
                    },
                    body: {
                        articleBid:articleBid,
                        resourceTitle: this.form.resourceTitle,
                        author: this.form.author,
                        cover: this.form.cover,
                        categoryIds: this.form.categoryId,
                        labelIds: this.form.labelIds,
                        resourceType: this.form.radio,
                        outerChain: this.form.outerChain,
                        content: this.form.content,
                        initCount: this.form.initCount,
                        id: this.idsd,
                        appVideoUrl:this.form.appVideoUrl,
                        appVideoTime:this.form.appVideoTime,
                        h5VideoUrl:this.form.h5VideoUrl,
                        h5VideoTime:this.form.h5VideoTime
                    }
                };
                try {
                    let res = await util.ajax.post(Url, params);
                    if (res.data.respHead.respCode === "000") {
                        this.form.loading = false
                        this.$router.push({name: "management"})
                        this.cancel()
                    } else {
                        this.$message.error(`${res.data.respHead.respMsg}`);
                    }
                } catch (e) {

                }
            },
            //取消
            cancel() {
                this.form.resourceTitle = ""
                this.form.author = ""
                this.form.cover = ""
                this.form.categoryId = ""
                this.form.labelIds = ""
                this.form.radio = "1"
                this.form.outerChain = ""
                this.form.content = ""
                this.form.initCount = ""
                this.form.imageUrl = ""
                this.form.appVideoUrl=""
                this.form.appVideoTime=""
                this.form.h5VideoUrl=""
                this.form.h5VideoTime=""
                this.$router.push({name: "management"})
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
                var articleBid =  this.elId.split("-").join("");
                console.log(articleBid)
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
                            articleBid:articleBid,
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
            }
        },


    }
</script>

<style scoped>
    .added .avatar-uploader .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .added .avatar-uploader .avatar-uploader-icon:hover {
        border-color: #409EFF;
    }

    .added .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .added .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .added .previewContent {
        height: 400px;
        background-color: #f3f2f2;
        min-height: 400px;
        width: 500px;
        overflow: auto;
    }
    .added .previewContent img{
        width: 50%;
        height: 50%;
    }
    .added .adww {
        position: relative;
    }

    .added .btns {
        position: absolute;
        right: 10%;
    }

</style>