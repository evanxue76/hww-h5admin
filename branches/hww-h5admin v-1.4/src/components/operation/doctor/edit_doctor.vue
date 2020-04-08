<template>
  <div class="edit_doctor_wrap" v-loading="loading">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>医生管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{crumbs_msg}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <!-- 表单区 -->
    <div class="edit_doctor_content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="doctorName">
          <el-input v-model="ruleForm.doctorName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="ruleForm.mobile" maxlength="11" ></el-input>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalId">
          <!-- hospitaList -->
          <!-- <el-input v-model="ruleForm.hospitalName" maxlength="30"></el-input> -->
          <el-select
            v-model="ruleForm.hospitalId"
            @change="onHospitaList"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in hospitaList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="tudan-flex">
          <el-form-item label="学科" prop="departmentId">
            <el-select
              v-model="ruleForm.departmentId"
              @change="onekeshi"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in keshi_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="majorId" v-if="tow_list.length>0">
            <el-select v-model="ruleForm.majorId" @change="twokeshi" placeholder="请选择" clearable>
              <el-option
                v-for="item in tow_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="职称">
          <el-select
            v-model="ruleForm.academicTitleId"
            @change="set_academicTitle"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in title_list"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道"  prop="channelNo" class='divide-rate'>
          <el-select v-model="ruleForm.channelNo"  placeholder="请选择"  @change="channelNo">
            <el-option
              v-for="item in qudao_list"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="tips" v-if="showFlag">医生注册的渠道商已冻结或不存在</span>
        </el-form-item>
        <el-form-item label="分成比例" prop="docDivideInto" class='divide-rate'>
          <el-input v-model="ruleForm.docDivideInto" class="input" @blur="docDivideInto"></el-input>%
          <span class="rate-mark">(当前渠道商分成比例为{{ruleForm.divideInto}}%,医生分成比例不得超过渠道商分成比例)</span>
        </el-form-item>

        <div class="tudan-flex">
          <el-form-item label="级别">
            <el-select v-model="ruleForm.isAssistant" @change="c_level" placeholder="请选择" clearable>
              <el-option
                v-for="item in level_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级医生" prop="parentDoctorId" v-if="ruleForm.isAssistant===1">
            <el-select v-model="ruleForm.parentDoctorId" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in up_docto_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="账号类型">
          <el-radio v-model="ruleForm.mockFlag" :label="0">正式</el-radio>
          <el-radio v-model="ruleForm.mockFlag" :label="1">测试</el-radio>
        </el-form-item>
        <el-form-item label="已开通服务" v-if="ruleForm.isAssistant===0">
          <el-checkbox v-model="ruleForm.checked1">报告解读</el-checkbox>
          <el-checkbox v-model="ruleForm.checked2">图文咨询</el-checkbox>
          <el-checkbox v-model="ruleForm.checked3">极速解读</el-checkbox>
          <el-checkbox v-model="ruleForm.checked4">AI</el-checkbox>
          <el-checkbox v-model="ruleForm.checked5">平台医生</el-checkbox>
        </el-form-item>
        <p class="bitian">个人介绍及擅长领域</p>
        <el-form-item prop="speciality">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.speciality"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="ruleForm.idCard" maxlength="18"></el-input>
        </el-form-item>
        <div class="tudan-flex">
          <el-form-item>
            <el-upload
              ref="sfz1"
              list-type="picture-card"
              accept="image/*"
              :action="upUrl"
              :file-list="sfz1"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file, fileList)=>onremove(file, fileList,10)"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,10)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">身份证正面</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="sfz2"
              list-type="picture-card"
              accept="image/*"
              :action="upUrl"
              :file-list="sfz2"
              :on-preview="handlePictureCardPreview"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,11)"
              :on-remove="(file, fileList)=>onremove(file, fileList,11)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">身份证反面</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </div>
        <el-form-item>
          <span>执业医师资格证(专业技术资格证书)编号</span>
          <el-input v-model="ruleForm.practisingPhysicianNo" v-if="zg_active"></el-input>
          <el-input v-model="ruleForm.professionalTechnologyNo" v-else></el-input>
        </el-form-item>
        <div class="tudan-flex">
          <el-form-item>
            <el-upload
              ref="zg1"
              list-type="picture-card"
              accept="image/*"
              :file-list="zg1"
              :action="upUrl"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file, fileList)=>onremove(file, fileList,12)"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,12)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">编码页</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="zg2"
              list-type="picture-card"
              accept="image/*"
              :file-list="zg2"
              :action="upUrl"
              :on-preview="handlePictureCardPreview"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,13)"
              :on-remove="(file, fileList)=>onremove(file, fileList,13)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">个人信息页</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </div>
        <el-form-item>
          <span>医师执业证书编号</span>
          <el-input v-model="ruleForm.certificatePracticeNo" maxlength="18"></el-input>
        </el-form-item>
        <div class="tudan-flex">
          <el-form-item>
            <el-upload
              ref="zz1"
              list-type="picture-card"
              accept="image/*"
              :file-list="zz1"
              :action="upUrl"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file, fileList)=>onremove(file, fileList,14)"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,14)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">编码页</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="zz2"
              list-type="picture-card"
              accept="image/*"
              :file-list="zz2"
              :action="upUrl"
              :on-preview="handlePictureCardPreview"
              :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,15)"
              :on-remove="(file, fileList)=>onremove(file, fileList,15)"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">个人信息页</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </div>
        <el-form-item label="电子签名">
          <el-upload
            ref="dzqm"
            list-type="picture-card"
            accept="image/*"
            :file-list="signImgUrl"
            :action="upUrl"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-exceed="onexceed"
            :on-success="(response, file, fileList)=>detailsuploadSuc(response, file, fileList ,3)"
            :on-remove="(file, fileList)=>onremove(file, fileList,3)"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="submitForm('ruleForm')"
            v-if="ruleForm.assistantStutas!=2"
            :loading="sub_loading"
          >确定</el-button>
          <el-button @click="cancle">取消</el-button>
          <el-button type="danger" @click="del_item" v-if="ruleForm.source==1">删除医生/助理</el-button>
          <el-button type="danger" @click="_freeze" v-if="ruleForm.isFrozen==0">冻结医生</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import util from "@/lib/util";
import upUrl from "@/lib/upUrl";
import { objFn } from "@/lib/public";
import { formatSecond } from "@/lib/time";
import crumbs from "@/components/common/Crumbs";
export default {
  created() {
    this.get_keshi();
    this.get_qudao();
    this.get_up_doctor();
    this.getHospitalList();
    if (this.$route.params.id) {
      setTimeout(() => {
        this.get_doctor_info(this.$route.params.id);
      }, 100);
      this.crumbs_msg = "医生详情";
    }
  },
  components: {
    crumbs
  },
  data() {
    return {
    	showFlag: false,
      zg_active: true,
      dialogImageUrl: "",
      imageUrl: "",
      majorId: "",
      crumbs_msg: "新增医生",
      dialogVisible: false,
      sub_loading: false,
      loading: false,
      up_docto_list: [],
      keshi_list: [],
      tow_list: [],
      signImgUrl: [],
      professionalTitleCertificate: [],
      practiceList: [],
      zz1: [],
      zz2: [],
      zg1: [],
      zg2: [],
      sfz1: [],
      sfz2: [],
      detailDiagramList: [],
      upUrl, //图片上传地址
      qudao_list: [],
      weight_list: [],
      input:"",
      ruleForm: {
      	docDivideInto: '',
        divideInto:"",
        mockFlag: 0,
        channelNo: "",
        doctorName: "",
        zg1: "",
        zg2: "",
        zz1: "",
        zz2: "",
        sfz1: "",
        sfz2: "",
        mobile: "",
        idCard: "",
        hospitalId: "",
        hospitalName: "",
        academicTitleId: "",
        academicTitle: "",
        departmentId: "",
        majorId: "",
        department: "",
        majorName: "",
        parentDoctorId: "",
        isAssistant: "",
        isPlatformDoctor: "",
        speciality: "",
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        openingService: "",
        professionalTitleCertificate: "",
        signImgUrl: "",
        practiceList: [],
        status: 0,
        certificatePracticeNo: "",
        practisingPhysicianNo: "",
        certificatePractice: "",
        cardPicture: "",
        practisingPhysicianPicture: "",
        professionalTechnologyPicture: "",
        professionalTechnologyNo: ""
      
      },
      rules: {
        //验证规则
        doctorName: [
          {
            required: true,
            message: "请输入姓名"
          },
          {
            pattern: /^[\u4E00-\u9FA5]+$/,
            message: "姓名只能为中文"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (/^[1][0-9]{10}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        idCard: [
          {
            required: true,
            message: "请输入正确的身份证号码",
            trigger: "blur"
          },
          // { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证不正确' }
          {
            validator: (rule, value, callback) => {
              let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
              if (regIdCard.test(value)) {
                if (value.length == 18) {
                  var idCardWi = new Array(
                    7,
                    9,
                    10,
                    5,
                    8,
                    4,
                    2,
                    1,
                    6,
                    3,
                    7,
                    9,
                    10,
                    5,
                    8,
                    4,
                    2
                  ); //将前17位加权因子保存在数组里
                  var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                  var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                  for (var i = 0; i < 17; i++) {
                    idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
                  }
                  var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
                  var idCardLast = value.substring(17); //得到最后一位身份证号码
                  //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                  if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                      callback();
                    } else {
                      callback(new Error("请输入正确的身份证号码"));
                    }
                  } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                      callback();
                    } else {
                      callback(new Error("请输入正确的身份证号码"));
                    }
                  }
                }
              } else {
                callback(new Error("请输入正确的身份证号码"));
              }
            },
            trigger: "blur"
          }
        ],
         channelNo: [
          {
            required: true,
            trigger: "change",
            message: "请输入渠道"
          }
        ],
         docDivideInto: [
          {
            required: true,
            trigger: "change",
            message: "请输入分成比例"
          }
        ],
        hospitalId: [
          {
            required: true,
            trigger: "change",
            message: "请输入医院名称"
          }
        ],
        departmentId: [
          {
            required: true,
            message: "请选择学科",
            trigger: "change"
          }
        ],
        majorId: [
          {
            message: "请选择专业",
            trigger: "change"
          }
        ],
        isAssistant: [
          {
            required: true,
            message: "请选择级别",
            trigger: "change"
          }
        ],
        speciality: [
          {
            required: true,
            message: "请输入个人介绍及擅长领域",
            trigger: "blur"
          }
        ],
        parentDoctorId: [
          {
            required: true,
            message: "请选择上级医生",
            trigger: "blur"
          }
        ],
        practiceList: [
          {
            required: true,
            message: "请上传医师执业证书",
            trigger: "change"
          }
        ],
        professionalTitleCertificate: [
          {
            required: true,
            message: "请上传职称证书",
            trigger: "change"
          }
        ],
        signImgUrl: [
          {
            message: "请上传电子签名",
            trigger: "change"
          }
        ]
      },
      classification_list: [],
      title_list: [
        {
          value: 1,
          name: "住院医师"
        },
        {
          value: 2,
          name: "主治医师"
        },
        {
          value: 3,
          name: "副主任医师"
        },
        {
          value: 4,
          name: "主任医师"
        },
        {
          value: 5,
          name: "资深专家"
        },
        {
          value: 6,
          name: "技师"
        },
        {
          value: 7,
          name: "主管技师"
        },
        {
          value: 8,
          name: "副主任技师"
        },
        {
          value: 9,
          name: "主任技师"
        }
      ], //职称
      level_list: [
        {
          value: 1,
          name: "医生助理"
        },
        {
          value: 0,
          name: "医生"
        }
      ], //级别
      hospitaList: [
        // {
        //   value: 1,
        //   name: "医生助理"
        // },
        // {
        //   value: 0,
        //   name: "医生"
        // }
      ] //级别
    };
  },
  methods: {
    docDivideInto(){
      if(this.ruleForm.docDivideInto > this.ruleForm.divideInto){
        this.$message({
          showClose: true,
          message: `当前渠道商分成比例为${this.ruleForm.docDivideInto}，医生分成比例不得超过渠道商分成比例`,
           type: 'warning'
        });
        this.ruleForm.docDivideInto = ''
      }

    },
    // 选择渠道商
    channelNo(e){
      this.qudao_list.map(i => {
		  console.log(5466,i)
        if (i.value == e) {
          this.ruleForm.divideInto = i.divideInto;
//        this.input= i.divideInto;
        }
      });
      this.showFlag = false
      if(!e || this.ruleForm.docDivideInto > this.ruleForm.divideInto){
        this.ruleForm.docDivideInto = ""
      }
    },
    onHospitaList(e) {
      this.hospitaList.map(i => {
        if (i.value == e) {
          this.ruleForm.hospitalName = i.name;
        }
      });
    },
    async getHospitalList() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001009"
          },
          body: {}
        };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          if (
            Array.isArray(res.data.body.data) &&
            res.data.body.data.length > 0
          ) {
            res.data.body.data.map(i => {
              this.hospitaList.push({ value: i.id, name: i.hospitalName });
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    _freeze() {
      let _this = this;
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001005"
          },
          body: {
            id: this.ruleForm.id,
            isFrozen: 1
          }
        };
      this.$confirm("此操作将冻结医生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          util.ajax.post(Url, params).then(res => {
            if (res.data.respHead.respCode === "000") {
              _this.$message({
                type: "success",
                message: "冻结成功!"
              });
              _this.jumpRouterFun();
            } else {
              _this.$message.error(`${res.data.respHead.respMsg}`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消冻结"
          });
        });
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除
    async del_item() {
      let _this = this;
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001006"
          },
          body: {
            id: this.ruleForm.id
          }
        };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          util.ajax.post(Url, params).then(res => {
            if (res.data.respHead.respCode === "000") {
              _this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.jumpRouterFun();
            } else {
              _this.$message.error(`${res.data.respHead.respMsg}`);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查询详情
    async get_doctor_info(id) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001003"
          },
          body: {
            id
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if(res.data.respHead.respCode === "000") {
          this.loading = false;
          this.ruleForm = res.data.body.data;
		  console.log( 43857389,this.ruleForm)
          if(this.ruleForm.channelNo == '0' || this.ruleForm.channelNo == '') {
          	this.ruleForm.channelNo = ''
          	this.showFlag = true
          }
          
          if(this.ruleForm.docDivideInto > this.ruleForm.divideInto){
		        this.ruleForm.docDivideInto = ""
		      }
          // this.ruleForm.channelNo = "1234"
//        this.input =  this.ruleForm.divideInto

          // 身份证
          if (this.ruleForm.cardPicture.indexOf(",") > -1) {
            this.ruleForm.cardPicture = this.ruleForm.cardPicture.split(",");
            if (this.ruleForm.cardPicture[0]) {
              this.ruleForm.sfz1 = this.ruleForm.cardPicture[0];
              this.sfz1.push({
                filePath: this.ruleForm.cardPicture[0],
                url: this.ruleForm.cardPicture[0]
              });
              this.$refs.sfz1.$children[1].$el.style.display = "none";
            }
            if (this.ruleForm.cardPicture[1]) {
              this.ruleForm.sfz2 = this.ruleForm.cardPicture[1];
              this.sfz2.push({
                filePath: this.ruleForm.cardPicture[1],
                url: this.ruleForm.cardPicture[1]
              });
              this.$refs.sfz2.$children[1].$el.style.display = "none";
            }
          } else {
            this.ruleForm.cardPicture = [];
            this.ruleForm.sfz1 = "";
            this.ruleForm.sfz2 = "";
          }
          // 医师执业证书
          if (this.ruleForm.certificatePractice.indexOf(",") > -1) {
            this.ruleForm.certificatePractice = this.ruleForm.certificatePractice.split(
              ","
            );
            if (this.ruleForm.certificatePractice[0]) {
              this.ruleForm.zz1 = this.ruleForm.certificatePractice[0];
              this.zz1.push({
                filePath: this.ruleForm.certificatePractice[0],
                url: this.ruleForm.certificatePractice[0]
              });
              this.$refs.zz1.$children[1].$el.style.display = "none";
            }
            if (this.ruleForm.certificatePractice[1]) {
              this.ruleForm.zz2 = this.ruleForm.certificatePractice[1];
              this.zz2.push({
                filePath: this.ruleForm.certificatePractice[1],
                url: this.ruleForm.certificatePractice[1]
              });
              this.$refs.zz2.$children[1].$el.style.display = "none";
            }
          } else {
            this.ruleForm.certificatePractice = [];
            this.ruleForm.zz1 = "";
            this.ruleForm.zz2 = "";
          }

          // 执业医师资格证书 专业技术资格证书
          if (
            this.ruleForm.practisingPhysicianPicture.length > 0 &&
            this.ruleForm.practisingPhysicianNo != ""
          ) {
            // 执业医师资格证书
            if (this.ruleForm.practisingPhysicianPicture.indexOf(",") > -1) {
              this.ruleForm.practisingPhysicianPicture = this.ruleForm.practisingPhysicianPicture.split(
                ","
              );
              if (this.ruleForm.practisingPhysicianPicture[0]) {
                this.ruleForm.zg1 = this.ruleForm.practisingPhysicianPicture[0];
                this.zg1.push({
                  filePath: this.ruleForm.practisingPhysicianPicture[0],
                  url: this.ruleForm.practisingPhysicianPicture[0]
                });
                this.$refs.zg1.$children[1].$el.style.display = "none";
              }
              if (this.ruleForm.practisingPhysicianPicture[1]) {
                this.ruleForm.zg2 = this.ruleForm.practisingPhysicianPicture[1];
                this.zg2.push({
                  filePath: this.ruleForm.practisingPhysicianPicture[1],
                  url: this.ruleForm.practisingPhysicianPicture[1]
                });
                this.$refs.zg2.$children[1].$el.style.display = "none";
              }
            } else {
              this.ruleForm.practisingPhysicianPicture = [];
              this.ruleForm.zg1 = "";
              this.ruleForm.zg2 = "";
            }
          } else if (
            this.ruleForm.professionalTechnologyPicture.length > 0 &&
            this.ruleForm.professionalTechnologyNo != ""
          ) {
            // 专业技术资格证书
            if (this.ruleForm.professionalTechnologyPicture.indexOf(",") > -1) {
              this.zg_active = false;
              this.ruleForm.professionalTechnologyPicture = this.ruleForm.professionalTechnologyPicture.split(
                ","
              );
              if (this.ruleForm.professionalTechnologyPicture[0]) {
                this.ruleForm.zg1 = this.ruleForm.professionalTechnologyPicture[0];
                this.zg1.push({
                  filePath: this.ruleForm.professionalTechnologyPicture[0],
                  url: this.ruleForm.professionalTechnologyPicture[0]
                });
                this.$refs.zg1.$children[1].$el.style.display = "none";
              }
              if (this.ruleForm.professionalTechnologyPicture[1]) {
                this.ruleForm.zg2 = this.ruleForm.professionalTechnologyPicture[1];
                this.zg2.push({
                  filePath: this.ruleForm.professionalTechnologyPicture[1],
                  url: this.ruleForm.professionalTechnologyPicture[1]
                });
                this.$refs.zg2.$children[1].$el.style.display = "none";
              }
            } else {
              this.ruleForm.professionalTechnologyPicture = [];
              this.ruleForm.zg1 = "";
              this.ruleForm.zg2 = "";
            }
          }

          if (this.ruleForm.practiceList) {
            this.ruleForm.practiceList.find(i => {
              this.practiceList.push({
                filePath: i,
                url: i
              });
            });
          }

          if (this.ruleForm.professionalTitleCertificate) {
            this.professionalTitleCertificate.push({
              filePath: this.ruleForm.professionalTitleCertificate,
              url: this.ruleForm.professionalTitleCertificate
            });
          }

          if (this.ruleForm.signImgUrl) {
            this.signImgUrl.push({
              filePath: this.ruleForm.signImgUrl,
              url: this.ruleForm.signImgUrl
            });
            this.$refs.dzqm.$children[1].$el.style.display = "none";
          }

          if (this.ruleForm.openingService == 4) {
            this.ruleForm.checked1 = true;
            this.ruleForm.checked2 = true;
          } else if (this.ruleForm.openingService == 3) {
            this.ruleForm.checked1 = true;
          } else if (this.ruleForm.openingService == 1) {
            this.ruleForm.checked2 = true;
          }
          if (this.ruleForm.isAiService == 1) {
            this.ruleForm.checked4 = true;
          }
          if (this.ruleForm.isPlatformDoctor == 1) {
            this.ruleForm.checked5 = true;
          }
          if (this.ruleForm.isQuickInterpret == 1) {
            this.ruleForm.checked3 = true;
          }
          this.majorId = this.ruleForm.majorId;
          if (this.ruleForm.departmentId) {
            this.get_keshi(this.ruleForm.departmentId);
          }
          this.ruleForm = Object.assign({}, this.ruleForm, {});
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    // 设置级别
    set_academicTitle(id) {
      let index = this.title_list.findIndex((value, index, arr) => {
        return value.value == id;
      });
      this.ruleForm.academicTitle = this.title_list[index].name;
    },
    // 查询上级医生
    async get_up_doctor() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001008"
          },
          body: {}
        };
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.up_docto_list.push({
              value: i.id,
              name: i.doctorName
            });
          });
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    // 查询渠道
    async get_qudao() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001007"
          },
          body: {}
        };
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        if (res.data.respHead.respCode === "000") {
          res.data.body.data.forEach(i => {
            this.qudao_list.push({
              value: i.channelNo,
              name: i.channel,
              divideInto:i.divideInto
            });
          });
          console.log(this.qudao_list)
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    // 级别操作
    c_level(val) {
      this.ruleForm.parentDoctorId = "";
    },
    // 二级科室操作
    twokeshi(id) {
      let index = this.tow_list.findIndex((value, index, arr) => {
        return value.value == id;
      });
      this.ruleForm.majorName = this.tow_list[index].name;
    },
    // 一级科室操作
    onekeshi(id) {
      this.ruleForm.majorId = "";
      this.tow_list = [];
      this.get_keshi(id);
      let index = this.keshi_list.findIndex((value, index, arr) => {
        return value.value == id;
      });
      this.ruleForm.department = this.keshi_list[index].name;
    },
    // 查询科室专业
    async get_keshi(id) {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001004"
          },
          body: {}
        };
      params.body = id
        ? {
            medicalClassificationCode: id
          }
        : {};
      try {
        let res = await util.ajax.post(Url, params);

        if (res.data.respHead.respCode === "000") {
          if (id) {
            if (res.data.body.data.length > 0) {
              res.data.body.data.forEach(i => {
                this.tow_list.push({
                  value: i.medicalClassificationCode,
                  name: i.medicalClassificationName
                });
              });
            }
            if (this.majorId) {
              this.ruleForm.majorId = this.majorId;
              this.majorId = "";
            }
          } else {
            res.data.body.data.forEach(i => {
              this.keshi_list.push({
                value: Number(i.medicalClassificationCode),
                name: i.medicalClassificationName
              });
            });
          }
        } else {
          this.$message.error("查询学科列表出错!");
        }
      } catch (e) {
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    cancle() {
      this.jumpRouterFun();
    },
    // 返回
    jumpRouterFun() {
      this.$router.push({
        name: "Doctor"
      });
    },
    // 提交
    submitForm(formName, type) {
      if (this.ruleForm.checked1 && this.ruleForm.checked2) {
        this.ruleForm.openingService = 4;
      } else if (this.ruleForm.checked1) {
        this.ruleForm.openingService = 3;
      } else if (this.ruleForm.checked2) {
        this.ruleForm.openingService = 1;
      } else {
        this.ruleForm.openingService = 0;
      }

      if (this.ruleForm.checked3) {
        this.ruleForm.isQuickInterpret = 1;
      } else {
        this.ruleForm.isQuickInterpret = 0;
      }
      if (this.ruleForm.checked4) {
        this.ruleForm.isAiService = 1;
      } else {
        this.ruleForm.isAiService = 0;
      }
      if (this.ruleForm.checked5) {
        this.ruleForm.isPlatformDoctor = 1;
      } else {
        this.ruleForm.isPlatformDoctor = 0;
      }
      // 身份证
      this.ruleForm.cardPicture = `${this.ruleForm.sfz1},${this.ruleForm.sfz2}`;
      if (this.ruleForm.cardPicture === ",") {
        this.ruleForm.cardPicture = "";
      }
      // 执业医师资格证书 专业技术资格证书
      if (this.zg_active) {
        this.ruleForm.practisingPhysicianPicture = `${this.ruleForm.zg1},${this.ruleForm.zg2}`;
        if (this.ruleForm.practisingPhysicianPicture === ",") {
          this.ruleForm.practisingPhysicianPicture = "";
        }
      } else {
        this.ruleForm.professionalTechnologyPicture = `${this.ruleForm.zg1},${this.ruleForm.zg2}`;
        if (this.ruleForm.professionalTechnologyPicture === ",") {
          this.ruleForm.professionalTechnologyPicture = "";
        }
      }
      // 医师执业证书
      this.ruleForm.certificatePractice = `${this.ruleForm.zz1},${this.ruleForm.zz2}`;
      if (this.ruleForm.certificatePractice === ",") {
        this.ruleForm.certificatePractice = "";
      }
      let self = this,
        Url = "",
        params = {
          reqHead: {
            functionId: "DWA001001005"
          },
          body: this.ruleForm
        };
      self.$refs[formName].validate(valid => {
        if (valid) {
          if (self.tow_list.length > 0 && !self.ruleForm.majorId) {
            return self.$message.error("请选择专业");
          }
          if (
            self.ruleForm.isAssistant === 0 &&
            self.ruleForm.signImgUrl === ""
          ) {
            return self.$message.error("请上传电子签名!");
          }
          self.sub_loading = true;
          util.ajax
            .post(Url, params)
            .then(res => {
              self.sub_loading = false;
              if (
                res.data.respHead.respCode == "000" &&
                res.data.body.data == 1
              ) {
                if (self.$route.params.type === 1) {
                  self.$message.success("修改成功!");
                } else {
                  self.$message.success("添加成功!");
                }
                this.$router.push({
                  name: "Doctor"
                });
              } else {
                self.$message.error(`${res.data.respHead.respMsg}`);
              }
            })
            .catch(err => {
              self.sub_loading = false;
              self.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
            });
        } else {
          self.$message.error("请填写必填项!");
        }
      });
    },
    // 图片上传前拦截 判断文件类型
    beforeAvatarUpload(file) {
      let type = file.type;
      if (type.indexOf("image/") === -1) {
        this.$message.error("只能上传图片!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
    },
    //文件超出个数限制时的钩子
    onexceed(files, fileList) {
      this.$message.error("文件数量上限,请删除再上传！");
    },
    // 图片上传成功时的回调函数
    detailsuploadSuc(response, file, fileList, type) {
      if (response.respHead.respCode === "000") {
        switch (type) {
          case 1:
            this.practiceList.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.practiceList.push(file.response.body.obj.filePath);
            break;
          case 2:
            this.professionalTitleCertificate.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.professionalTitleCertificate =
              file.response.body.obj.filePath;
            break;
          case 3:
            this.signImgUrl.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.signImgUrl = file.response.body.obj.filePath;
            this.$refs.dzqm.$children[1].$el.style.display = "none";
            break;
          case 10:
            this.sfz1.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.sfz1 = file.response.body.obj.filePath;
            this.$refs.sfz1.$children[1].$el.style.display = "none";
            break;
          case 11:
            this.sfz2.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.sfz2 = file.response.body.obj.filePath;
            this.$refs.sfz2.$children[1].$el.style.display = "none";
            break;
          case 12:
            this.zg1.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.zg1 = file.response.body.obj.filePath;
            this.$refs.zg1.$children[1].$el.style.display = "none";
            break;
          case 13:
            this.zg2.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.zg2 = file.response.body.obj.filePath;
            this.$refs.zg2.$children[1].$el.style.display = "none";
            break;
          case 14:
            this.zz1.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.zz1 = file.response.body.obj.filePath;
            this.$refs.zz1.$children[1].$el.style.display = "none";
            break;
          case 15:
            this.zz2.push({
              filePath: file.response.body.obj.filePath,
              url: file.response.body.obj.filePath
            });
            this.ruleForm.zz2 = file.response.body.obj.filePath;
            this.$refs.zz2.$children[1].$el.style.display = "none";
            break;
          default:
            return "";
        }
      } else {
        this.$message.error(`${res.data.respHead.respMsg}`);
      }
    },
    // 	文件列表移除文件时的钩子
    onremove(file, fileList, type) {
      // this.detailDiagramList = fileList
      switch (type) {
        case 1:
          this.practiceList = fileList;
          this.ruleForm.practiceList = fileList;
          break;
        case 2:
          this.professionalTitleCertificate = fileList;
          this.ruleForm.professionalTitleCertificate = "";
          break;
        case 3:
          this.signImgUrl = fileList;
          this.ruleForm.signImgUrl = "";
          this.$refs.dzqm.$children[1].$el.style.display = "block";
          break;
        case 10:
          this.sfz1 = fileList;
          this.ruleForm.sfz1 = "";
          this.$refs.sfz1.$children[1].$el.style.display = "block";
          break;
        case 11:
          this.sfz2 = fileList;
          this.ruleForm.sfz2 = "";
          this.$refs.sfz2.$children[1].$el.style.display = "block";
          break;
        case 12:
          this.zg1 = fileList;
          this.ruleForm.zg1 = "";
          this.$refs.zg1.$children[1].$el.style.display = "block";
          break;
        case 13:
          this.zg2 = fileList;
          this.ruleForm.zg2 = "";
          this.$refs.zg2.$children[1].$el.style.display = "block";
          break;
        case 14:
          this.zz1 = fileList;
          this.ruleForm.zz1 = "";
          this.$refs.zz1.$children[1].$el.style.display = "block";
          break;
        case 15:
          this.zz2 = fileList;
          this.ruleForm.zz2 = "";
          this.$refs.zz2.$children[1].$el.style.display = "block";
          break;
        default:
          return "";
      }
    }
  }
};
</script>

<style lang="scss">
.edit_doctor_wrap {
  .demo-ruleForm {
    width: 500px;
  }

  // .up_box{
  //   display: flex;
  //   &>div{
  //     flex:1;
  //   }
  // }
  .bitian {
    &::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}

.bitian {
  margin-bottom: 10px;
}
.edit_doctor_wrap .input{
  width: 50%;
  display: inline-block;
  margin: 0;
  width: 200px;
}
.edit_doctor_wrap .rate-mark{
	display: inline-block;
	margin-left: 20px;
}
.divide-rate .el-form-item__content{
	width: 800px;
}
.divide-rate .tips{
	margin-left: 18px;
	color: #FA3939;
}
</style>
