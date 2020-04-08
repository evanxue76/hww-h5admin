<template>
  <div class="user_details" v-loading="loading">
    <!-- 面包屑 -->
    <crumbs>
      <div class slot="crumbs">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </crumbs>
    <div class="user_info">
      <div class="info_p">
        <img :src="user_info.photo" v-if="user_info.photo" alt />
        <img v-else :src="photo" alt />
      </div>
      <div class="info_name">
        <div class>昵称：{{user_info.nickName}}</div>
        <div>
          <span>openId：</span>
          {{user_info.hwOpenId}}
        </div>
        <div class>注册时间：{{user_info.createdAt|time}}</div>
        <div class>最近一次登录时间：{{user_info.recentLoginTime|time}}</div>
      </div>
    </div>
    <ul>
      <li>
        <span>姓名：</span>
        {{user_info.name}}
      </li>
      <li>
        <span>性别：</span>
        {{user_info.sex|sex}}
      </li>
      <li>
        <span>年龄：</span>
        {{user_info.age}}
      </li>
      <!-- <li>
        <span>手机号：</span>
        {{user_info.hwMobile}}
      </li>-->
      <li>
        <span>身高：</span>
        {{user_details.height}}(m)
      </li>
      <li>
        <span>体重：</span>
        {{user_details.weight}}(kg)
      </li>
      <li>
        <span>BMI：</span>
        {{user_details.bmi}}
      </li>
      <li>
        <span>既往史：</span>
        {{user_details.pastHistory}}
      </li>
      <li>
        <span>过敏史：</span>
        {{user_details.allergyHistory}}
      </li>
      <li>
        <span>家族史：</span>
        {{user_details.familyHistory}}
      </li>
      <li>
        <span>附件:</span>
      </li>
      <li>
        <span>临床检查：</span>
        {{user_details.clinicalExamination}}
        <div class="img_list" style="cursor:pointer;" v-for="item in celist">
          <img @click="enlarge(item.path)" :src="item.path" alt />
        </div>
      </li>
      <li>
        <span>临床诊断：</span>
        {{user_details.clinicalDiagnosis}}
        <div class="img_list" style="cursor:pointer;" v-for="item in cdlist">
          <img @click="enlarge(item.path)" :src="item.path" alt />
        </div>
      </li>
      <li>
        <span>已绑定设备：</span>
        {{equipment}}
      </li>
      <li>
        <span>手机型号：{{phoneModel}}</span>

      </li>
      <li>
        <span>心知了版本：{{ecgAppVersion}}</span>

      </li>
    </ul>
    <div class>是否签约医生： {{isSingDoctor|f_isSingDoctor}}</div>
    <br />
    <ul v-if="isSingDoctor">
      <li>医生所在医院：{{hospitalName}}</li>
      <li>签约到期时间：{{endDate}}</li>
    </ul>
  
    <div class="table">
      <div class="buad">
        <div class="service-title">已开通服务</div>
        <div class="adadd">
          <el-button type="primary" @click="dialogFormVisible  = true">开通套餐</el-button>
        </div>
      </div>
      <!-- 套餐列表 -->
      <el-table border  :data="arr"  >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="服务名称"  >
          <template slot-scope="scope"  >
             <span>{{scope.row.packageName}}{{scope.row.signingName}}</span>  
            
          </template>
        </el-table-column>
        <el-table-column label="开通日期">
          <template slot-scope="scope">
            <span>{{scope.row.startDate|time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="截止日期">
          <template slot-scope="scope">
            {{scope.row.endDate|time}}
          </template>
        </el-table-column>
        <el-table-column label="剩余套餐内容">
          <template slot-scope="scope">
            <div  >
               <div v-for="(item,index) in  scope.row.serviceBalanceList" :key="item.id">
                  <p >{{item.serviceType | batch}} <span v-if="item.serviceType !=5">({{item.titleId |intern}}):</span><span v-if="item.balanceNum == -1 ?   item.balanceNum='不限次数': 'item.balanceNum' ">{{item.balanceNum}}/次</span>  </p>
               </div>
              <p v-if="scope.row.doctorName !=''">签约医生:{{scope.row.doctorName}}</p>
              <p v-if="scope.row.duration !=''">签约时长:{{scope.row.duration}}月</p>
               <div v-for="(item,index) in scope.row.hwSigningUserList" :key="item.id">

                  <p>{{item.serviceType | interns}}  <span>{{item.surplusNum}}次</span>  </p>
               </div>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <span class="operation" style="cursor:pointer" v-if="scope.row.packetId !=1 && scope.row.packetId !=2 "  @click="details(scope.row.id,scope.row);detailaa(scope.row.id,scope.row)">查看详情</span>
          </template>
        </el-table-column>         
      </el-table>
    </div>
    <!-- 开通套餐 -->
    <el-dialog title="开通服务" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form :model="form">
        <el-form-item label="服务名称" :label-width="formLabelWidth">
          <el-select v-model="form.packageId" placeholder="请选择套餐"  style=" margin-left: 60px;"  filterable  @change="breakdown()">
            <el-option v-for="item in meal" :key="item.id" :label="item.packageName" :value="item.packageId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务介绍" :label-width="formLabelWidth">
          <el-input v-model="form.packageDescribe" type="textarea" style="width: 340px; margin-left: 60px;" disabled></el-input>
       </el-form-item>
        <el-form-item label="服务价格" :label-width="formLabelWidth" >
          <div style="  display: flex">
           <el-input v-model="form.packagePrice" style=" margin-left: 60px;width:100px;" disabled></el-input> <span style=" float: right;">&nbsp;元</span>
           
          </div>
           
        </el-form-item>
        <el-form-item label="有效期" :label-width="formLabelWidth">
          <el-radio v-model="form.termValidityStatus" disabled  label="0" style="margin-left: 60px;">永久</el-radio>
          <div class="resources" style="margin-left: 60px;">
            <el-radio v-model="form.termValidityStatus" disabled  label="1">指定时间</el-radio>
            <el-date-picker
              v-model="form.times"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="input-class"
              style="width:234px"
              disabled
            ></el-date-picker>
          </div>
          <div class="resources" style="margin-top: 10px;">
            <el-radio v-model="form.termValidityStatus" label="2" style="margin-left:60px;" disabled >指定时长</el-radio>
            <el-input style="width: 234px;" v-model="form.termValidityDuration" disabled></el-input>&nbsp;天
          </div>
        </el-form-item>
        <div>
          <div>
            <b>服务内容</b>
          </div>
          <el-form-item label="AI分析服务" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.serviceNames" disabled  ></el-input>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>静态报告解读服务</b>
          </div>
          <el-form-item label="极速解读服务" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.speed" disabled></el-input>
            </div>
          </el-form-item>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.Indications" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.level" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.subject" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.specifieds" disabled></el-input>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>动态报告解读服务</b>
          </div>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.cure" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.cures" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.curel" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.cureld" disabled></el-input>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>图文咨询服务</b>
          </div>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.textbox" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.textboxs" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.textboa" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 330px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <span style="width: 80px;margin-left: 60px;">次数</span>
              <el-input v-model="form.textb" disabled></el-input>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="border-top: 1px solid  #000000;">
        <div style="margin-top: 10px;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="kaitong">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <div class v-if="isSingDoctor">
      <div class>免费次数</div>
      <div class="edit-item" v-if="is.tuwen">
        <div class="title">图文咨询次数</div>
        <el-input v-model="tuwen.num" disabled maxlength="10"></el-input>
        <i class="el-icon-edit-outline" @click="edit_show('tuwen')"></i>
      </div>
      <div class="edit-item" v-if="is.dongtai">
        <div class="title">动态心电报告解读次数</div>
        <el-input v-model="dongtai.num" disabled maxlength="10"></el-input>
        <i class="el-icon-edit-outline" @click="edit_show('dongtai')"></i>
      </div>
      <div class="edit-item" v-if="is.jingtai">
        <div class="title">静态心电报告解读次数</div>
        <el-input v-model="jingtai.num" disabled maxlength="10"></el-input>
        <i class="el-icon-edit-outline" @click="edit_show('jingtai')"></i>
      </div>
    </div> -->
    <div class="btns">
      <!-- <el-button type="danger" @click="_Untie" v-if="isSingDoctor">解绑医生</el-button> -->
      <el-button type="primary" @click="go_to">返回</el-button>
    </div>
    <tudanModal
      :title="edit_data.title"
      :mdShow="edit_data.is"
      :width="edit_data.width"
      v-if="edit_data.is"
      @closeModal="closeModal(1)"
    >
      <template slot="md-content">
        <div>
          <div class="num-box">
            <div class="num-title">{{edit_data.text}}</div>
            <el-input v-model="score" maxlength="10"></el-input>
          </div>
          <div class="btns btnssxx">
            <el-button type="success" @click="_num">确认</el-button>
            <el-button type="success" @click="closeModal(1)">取消</el-button>
          </div>
        </div>
      </template>
    </tudanModal>
    <div class="img-modal" v-if="path_active" @click="path_active=false">
      <img :src="path" alt />
    </div>
    <div class="v-modal" v-if="path_active" @click="path_active=false"></div>
    <div>
      <!-- 套餐查看-->
      <el-dialog
        :title="this.between.packageName"
        :visible.sync="packaged"
        :close-on-press-escape="true"
        :close-on-click-modal="false"
        :before-close="cancelqsa"
      >
       <el-form :model="between">
        <el-form-item label="服务名称" :label-width="formLabelWidth">
            <el-input v-model="between.packageName" style="width: 340px; margin-left: 60px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务介绍" :label-width="formLabelWidth">
          <el-input v-model="between.packageDescribe" type="textarea" style="width: 340px; margin-left: 60px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务价格" :label-width="formLabelWidth" >
          <div style="  display: flex">
           <el-input v-model="between.packagePrice" style=" margin-left: 60px;width:100px;" disabled></el-input> <span style=" float: right;">&nbsp;元</span>
           
          </div>
           
        </el-form-item>

        <el-form-item label="到期时间" :label-width="formLabelWidth">
          <el-radio v-model="between.termValidityStatus"   :disabled="timesd" label="0" style="margin-left: 60px;">永久</el-radio>
          <div class="resources" style="margin-left: 60px;">
            <el-radio v-model="between.termValidityStatus"  :disabled="timesd"  label="1">指定时间</el-radio>
              <el-date-picker
                v-model="between.times"
                type="date"
                placeholder="选择日期"
                :disabled="timesd"
                >
              </el-date-picker>
          </div>
          <!-- <div class="resources" style="margin-top: 10px;">
            <el-radio v-model="between.termValidityStatus" label="2" style="margin-left:60px;"  >指定时长</el-radio>
            <el-input style="width: 220px;" v-model="between.termValidityDuration" ></el-input>&nbsp;天
          </div> -->
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth">
             <div >
                   <el-input v-model="between.province" disabled  style="margin-left: 60px; width:100px">></el-input>
                    <el-input v-model="between.city" disabled  style="margin-left: 20px; width:100px" ></el-input>
                   <el-input v-model="between.area" disabled style="margin-left: 20px; width:100px"></el-input>
                  
             </div>
        </el-form-item>
        <el-form-item label="指定医院" :label-width="formLabelWidth">
             <div style="display:flex">
                   <el-input v-model="between.hospital" disabled  style="margin-left: 60px; width:340px">></el-input>
             </div>
        </el-form-item>
        <div>
          <div>
            <b>服务内容</b>
          </div>
          <el-form-item label="AI分析服务" style="width:460px;" :label-width="formLabelWidth">
            <div style="display: flex; ">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
               <el-radio v-model="between.totalNums"  label="0" :disabled="disabledsd" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNums" :disabled = "disabledsd" ></el-input>
               <el-radio v-model="between.totalNums"  label="-1" :disabled = "disabledsd"  style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>静态报告解读服务</b>
          </div>
          <el-form-item label="极速解读服务" style="width: 460px;" :label-width="formLabelWidth">
           
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
               <el-radio v-model="between.totalNumd"   label="0" :disabled = "disabledsa" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumd" :disabled = "disabledsa" ></el-input>
               <el-radio v-model="between.totalNumd"   label="-1" :disabled = "disabledsa"  style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
              
          </el-form-item>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
               <el-radio v-model="between.totalNuma"    :disabled = "disabledsb" label="0"  style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNuma"   :disabled = "disabledsb"></el-input>
               <el-radio v-model="between.totalNuma"     :disabled = "disabledsb"  label="-1"  style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
              <el-radio v-model="between.totalNumb " :disabled = "disabledsc"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumb" :disabled = "disabledsc"></el-input>
               <el-radio v-model="between.totalNumb"  :disabled = "disabledsc" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
              <el-radio v-model="between.totalNumc "  :disabled = "disabledsda" label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumc" :disabled = "disabledsda"></el-input>
               <el-radio v-model="between.totalNumc"  :disabled = "disabledsda" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumf " :disabled = "disabledse"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumf" :disabled = "disabledse"></el-input>
               <el-radio v-model="between.totalNumf" :disabled = "disabledse"  label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>动态报告解读服务</b>
          </div>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
              <el-radio v-model="between.totalNumj " :disabled = "disabledsf"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumj" :disabled = "disabledsf"></el-input>
               <el-radio v-model="between.totalNumj"  :disabled = "disabledsf" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumh " :disabled = "disabledsj"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumh" :disabled = "disabledsj"></el-input>
               <el-radio v-model="between.totalNumh"  :disabled = "disabledsj" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumi " :disabled = "disabledsh"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumi":disabled = "disabledsh" ></el-input>
               <el-radio v-model="between.totalNumi" :disabled = "disabledsh"  label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumk " :disabled = "disabledsi"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumk" :disabled = "disabledsi"></el-input>
               <el-radio v-model="between.totalNumk"  :disabled = "disabledsi" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
        </div>
        <div>
          <div>
            <b>图文咨询服务</b>
          </div>
          <div style="margin-left: 10px;">指定医生等级</div>
          <el-form-item label="主治级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNuml " :disabled = "disabledsk"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNuml" :disabled = "disabledsk" ></el-input>
               <el-radio v-model="between.totalNuml" :disabled = "disabledsk"  label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="副主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumm " :disabled = "disabledsl"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumm":disabled = "disabledsl" ></el-input>
               <el-radio v-model="between.totalNumm"  :disabled = "disabledsl" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="主任级别" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumn " :disabled = "disabledsm"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumn":disabled = "disabledsm" ></el-input>
               <el-radio v-model="between.totalNumn"  :disabled = "disabledsm" label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="不指定医生等级" style="width: 460px;" :label-width="formLabelWidth">
            <div style="display: flex;">
              <!-- <span style="width: 160px;margin-left: 60px;">次数</span> -->
                <el-radio v-model="between.totalNumo " :disabled = "disabledsn"  label="0" style="margin-left: 60px;line-height: 40px;">次数</el-radio>
              <el-input v-model="between.balanceNumo":disabled = "disabledsn" ></el-input>
               <el-radio v-model="between.totalNumo" :disabled = "disabledsn"  label="-1" style="margin-left: 60px;line-height: 40px;">永久</el-radio>
            </div>
          </el-form-item>
        </div>
      </el-form>
        <div slot="footer" class="dialog-footer" style="border-top: 1px solid  #000000;">
          <div style="margin-top: 10px">
            <el-button type="danger" style="float: left;" @click="jiec">解除服务</el-button>
            <el-button  @click="delsa">取 消</el-button>
            <el-button type="primary" @click="package">确 定</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 签约医生服务 -->
      <el-dialog
        :title=" this.signingName "
        :visible.sync="doctor"
        :close-on-press-escape="true"
        :close-on-click-modal="false"
      >
        <ul>
          <li>
            服务名称
            <span style="margin-left: 180px;">{{ this.signingName }}</span>
          </li>
          <li>
            签约医院
            <span style="margin-left: 180px;"> {{this.hospitalNames}}</span>
          </li>
          <li>
            签约医生
                               
            <span style="margin-left: 180px;">{{this.doctorName}}</span>
          </li>
          <li>
            签约时间
            <span style="margin-left: 180px;">{{this.startDated | time}}</span>
          </li>
          <li>
            签约时长
            <span style="margin-left: 180px;">{{this.durations}}个月</span>
          </li>
          <li>
            到期时间
            <span style="margin-left: 130px;">
                <el-date-picker
                v-model="daoqi"
                type="date"
                placeholder="选择日期"
                style=" padding-left:40px ;"
                >
              </el-date-picker>
            </span>
             
          </li>
          <li>
            签约价格
            <span style="margin-left: 180px;">{{this.commonPrice}}元</span>
          </li>
          <li>签约内容</li>
           <li>
            剩余图文咨询次数
            <el-input style="margin-left: 130px; width: 150px;" v-model="surpa" :disabled="ded" ></el-input>次
          </li>
           <li>
            剩余动态报告解读次数
            <el-input style="margin-left: 100px; width: 150px;"  v-model="surplusNumsd"  :disabled="dad" ></el-input>次
          </li>
          <li>
            剩余静态报告解读次数
            <el-input style="margin-left: 100px; width: 150px;" v-model="surplusNa" :disabled="dfd"></el-input>次
          </li>
         
         
        </ul>
        <div slot="footer" class="dialog-footer" style="border-top: 1px solid  #000000;">
          <div style="margin-top: 10px">
            <el-button type="danger" style="float: left;" @click="adasw">解除服务</el-button>
            <el-button @click="doctor = false">取 消</el-button>
            <el-button type="primary" @click="doctorsa ">确 定</el-button>
          </div>
        </div>
      </el-dialog>
   <!-- 二次确认 -->
     <el-dialog
  :title="this.between.packageName"
  :visible.sync="dialoa"
  width="30%"
  style="margin-top:10%"
  :before-close="handleClose">
  <span>确定要解除{{this.between.packageName}}的套餐?</span>
  <div style="border-top: 1px solid  #000000;margin-top:20px;text-align: right;">
       <span slot="footer" class="dialog-footer"  >
    <el-button @click="dialoa = false" style="margin-top:20px">取 消</el-button>
    <el-button type="primary" @click="dialogaa">确 定</el-button>
  </span>
  </div>
</el-dialog>

 <!-- 二次确认医生 -->
     <el-dialog
  :title=" this.signingName"
  :visible.sync="dialoatq"
  width="30%"
  style="margin-top:10%"
  :before-close="handleClose">
  <span>确定要解除{{this.doctorName}}医生的服务?</span>
  <div style="border-top: 1px solid  #000000;margin-top:20px;text-align: right;">
       <span slot="footer" class="dialog-footer"  >
    <el-button @click="dialoatq = false" style="margin-top:20px">取 消</el-button>
    <el-button type="primary" @click="dialoadwq">确 定</el-button>
  </span>
  </div>
</el-dialog>
    </div>

  </div>
</template>

<script>
import util from "@/lib/util";
import crumbs from "@/components/common/Crumbs";
import tudanModal from "@/components/operation/banner/tudan_modal";
import { formatDay, formatDate, formatSecond } from "@/lib/time";
export default {
  components: {
    crumbs,
    tudanModal
  },
  data() {
    return {
      timesd:false,
      form: { 
        termValidityBeginTime:"",
        termValidityEndTime:"",
        packageId:"",
        serviceNames:"",
        speed:"",
        Indications:"",
        level:"",
        subject:"",
        specifieds:"",
        //动态解读
        cure:"",
        cures:"",
        curel:"",
        cureld:"",
        //图文资讯
        textbox:"",
        textboxs:"",
        textboa:"",
        textb:"",

        packageDescribe:"",
        packagePrice:"",
        termValidityStatus:"",
        termValidityDuration:"",
        times: "",
      },
        
      equipment: null,
      score: "",
      edit_num_id: "",
      tuwen: {},
      dongtai: {},
      jingtai: {},
      is: {
        tuwen: false,
        dongtai: false,
        jingtai: false
      },
      doctorId: "",
      doctorName: "",
      hospitalName: "",
      endDate: "",
      duration: "",
      edit_data: {
        title: "修改免费次数",
        is: false,
        width: 50,
        text: ""
      },
      edit: {},
      isSingDoctor: false,
      loading: false,
      path_active: false,
      user_info: {
        photo: ""
      },
      user_details: {},
      cdlist: [],
      celist: [],
      path: "",
      photo: require("./../../../assets/image/pic_user.png"),
      tableData: [{}],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      packaged: false, //新手礼包
      doctor: false, //签约医生服务
      meal:[],//服务名称
      ginseng:[],//AI分析
      static:[],//静态报告解读服务
      stratified:[],//静态报告解读服务指定医生等级
      specified:[],//静态报告解读服务不指定医生等级
      explanations:[],//动态解读解读服务
      framed:[],//图文咨询服务指定医生等级
      dialoa:false,
      listst:[],
      isServicePackage:"",
      userPacketList:[],
      hwSigningUser:[],
      arr:[],
      Setmenu:[],
      dds:"",
      //套餐
      between:{
        province:"",
        city:"",
        area:"",
        hospital:"",
        packageName:"",
        createdAt:"",
        termValidityEndTime:"",
        termValidityBeginTime:"",
        termValidityDuration:"",
        termValidityEndTime:"",
        termValidityStatus:"",
        packageDescribe:"",
        packagePrice:"",
        times:"",
        balanceNum:"",
        totalNum:"",
        balanceNums:"",
        balanceNumss:"",
        totalNums:"",
        totalNumd:"",
        balanceNumd:"",
        balanceNumdd:"",
        totalNuma:"",
        balanceNuma:"",
        totalNumb :"",
        balanceNumb:"",
        totalNumc:"",
        balanceNumc:"",
        totalNumf:"",
        balanceNumf:"",
        totalNumj:"",
        balanceNumj:"",
        balanceNumf:"",
        totalNumh:"",
        balanceNumh:"",
        totalNumi:"",
        balanceNumi:"",
        totalNumk:"",
        balanceNumk:"",
        totalNuml:"",
        balanceNuml:"",
        totalNumm:"",
        balanceNumm:"",
        totalNumn:"",
        balanceNumn:"",
        totalNumo:"",
        balanceNumo:"",
        etartDate:"",
        endDate:"",
      endDated:"",
      timesd:"",
    
      },
        disabledsd:true,
        disabledsa:true,
        disabledsb:true,
        disabledsc:true,
        disabledsda:true,
        disabledse:true,
        disabledsf:true,
        disabledsj:true,
        disabledsh:true,
        disabledsi:true,
        disabledsk:true,
        disabledsl:true,
        disabledsm:true,
        disabledsn:true,
        disabledad:false,
        disabledas:false,
        signingName :"",
        doctorName:"",
        hospitalNames:"",
        adds:[],
        durations:"",
        startDated:"",
        daoqi:"",
        surpa:"",
        surplusNumsd:"",
        surplusNa:"",
        dfd:true,
        dad:true,
        ded:true,
        dialoatq:false,
        adw:'不限次数',
        idsa:"",
        idsas:"",
        idsasa:"",
        commonPrice:"",
        servicePackage:"",
      ecgAppVersion:"",
      phoneModel:""
    };
  },
  created() {
    if (this.$route.params.row) {
      localStorage.setItem("userRow", JSON.stringify(this.$route.params.row));
    }
    this.user_info =
      this.$route.params.row || JSON.parse(localStorage.getItem("userRow"));
      console.log(this.$route.params.row.ecgAppVersion)
    this.ecgAppVersion = this.$route.params.row.ecgAppVersion
    this.phoneModel =  this.$route.params.row.phoneModel
    this.get_user_details();
     this.services();
      this.packages();

     
  },
  watch: {
    score: function(val) {
      this.score = val.replace(/[^0-9]/g, "");
    },
    "between.times" :function(val){
     
      if(this.between.termValidityStatus == "0" ){
        this.between.times =""
      }
      if(this.between.termValidityStatus == "1"){
        this.between.times = formatSecond( val)
        
      }
    },
    daoqi:function(val){
      this.daoqi = formatSecond( val)
    },
    "between.totalNums":function(val){
      if(val == "-1"){
        this.between.balanceNums = ""
      }
    },
     "between.totalNumd":function(val){
      if(val == "-1"){
        this.between.balanceNumd = ""
      }
    },
     "between.totalNuma":function(val){
      if(val == "-1"){
        this.between.balanceNuma = ""
      }
    },
     "between.totalNumb":function(val){
      if(val == "-1"){
        this.between.balanceNumb = ""
      }
    },
     "between.totalNumc":function(val){
      if(val == "-1"){
        this.between.balanceNumc = ""
      }
    },
     "between.totalNumf":function(val){
      if(val == "-1"){
        this.between.balanceNumf = ""
      }
    },
     "between.totalNumj":function(val){
      if(val == "-1"){
        this.between.balanceNumj = ""
      }
    },
    "between.totalNumh":function(val){
      if(val == "-1"){
        this.between.balanceNumh = ""
      }
    },
    "between.totalNumi":function(val){
      if(val == "-1"){
        this.between.balanceNumi = ""
      }
    },
    "between.totalNumk":function(val){
      if(val == "-1"){
        this.between.balanceNumk = ""
      }
    },
    "between.totalNuml":function(val){
      if(val == "-1"){
        this.between.balanceNuml = ""
      }
    },
     "between.totalNumn":function(val){
      if(val == "-1"){
        this.between.balanceNumn = ""
      }
    },
     "between.totalNumm":function(val){
      if(val == "-1"){
        this.between.balanceNumm = ""
      }
    },
     "between.totalNumo":function(val){
      if(val == "-1"){
        this.between.balanceNumo = ""
      }
    },
  },
  methods: {
 async doctorsa(){
    console.log(111111)
    this.doctor = false;
          let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003009"
          },
          body: {
            managerNo: this.$route.params.id,
            endDate: this.daoqi,
            hwSigningUserList:[
              {
                id:this.idsasa,
                surplusNum:this.surplusNa
              },
               {
                id:this.idsas,
                surplusNum:this.surplusNumsd
              },
               {
                id:this.idsa,
                surplusNum:this.surpa
              }
            ]
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
            this.loading = false;
             this.packages()
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        
      } 
  },
    adasw(){
      this. dialoatq = true
     
     },
     async dialoadwq(){
       this.dialoatq = false
       this.doctor = false
            let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003004"
          },
          body: {
            managerNo: this.$route.params.id,
            docId:this.adds.doctorId
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
            this.loading = false;
            this.packages()
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        
      } 
      },
    //   查询用户详情
    async get_user_details() {
      let Url = "",
        obj = {
          1: "tuwen",
          3: "jingtai",
          4: "dongtai"
        },
        params = {
          reqHead: {
            functionId: "DWA001003002"
          },
          body: {
            id: this.$route.params.id
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          
          this.loading = false;
          this.user_details = res.data.body.data.hwMedicalInformation;
          this.equipment = res.data.body.data.equipment;
          this.isSingDoctor = res.data.body.data.isSingDoctor;
          if (res.data.body.data.isSingDoctor) {
            this.doctorId = res.data.body.data.hwSigningUser.doctorId;
            this.doctorName = res.data.body.data.hwSigningUser.doctorName;
            this.duration = res.data.body.data.hwSigningUser.duration;
            this.hospitalName = res.data.body.data.hwSigningUser.hospitalName;
            this.endDate = formatSecond(res.data.body.data.hwSigningUser.endDate);
            res.data.body.data.hwSigningUser.hwSigningUserList.map(i => {
              this.is[obj[i.serviceType]] = true;
              this[obj[i.serviceType]].num = i.surplusNum;
              this[obj[i.serviceType]].id = i.id;
            });
          }

          if (this.user_details.height) {
            this.user_details.height = this.user_details.height / 100;
          }
          if (this.user_details.weight && this.user_details.height) {
            this.user_details.bmi = (
              this.user_details.weight /
              (this.user_details.height * this.user_details.height)
            ).toFixed(2);
          }
          this.cdlist = res.data.body.data.cdlist;
          this.celist = res.data.body.data.celist;
        } else {
          this.loading = false;
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        this.loading = false;
        console.log(e);
        if (e.message.includes("Network")) {
          this.$message.error("网络连接错误，请检查网络连接，再重新尝试!");
        } else {
          this.$message.error(`error： ${e.message}`);
        }
      }
    },
    delsa(){
      this.packaged = false
      this.loading = false
      this.cancelq()
    },
    cancelqsa(){
      this.loading = false
      this.packaged = false
      this.cancelq()
    },
    //查看详情修改
   async package(){
      if(this.between.termValidityStatus == "1" && this.between.times == ""){
        this.$message.error("指定时间不可以为空");
        return
      }
    if( this.between.totalNums == "5" && this.between.balanceNums == ""){
        this.$message.error("AI分析服务不可以为空");
        return
    }
    if( this.between.totalNumd == "3" && this.between.balanceNumd == ""){
        this.$message.error("静态报告解读服务AI医生解读不可以为空");
        return
    }
     if( this.between.totalNuma== "3" && this.between.balanceNuma == ""){
        this.$message.error("静态报告解读服务指定医生等级主治级别不可以为空");
        return
    }
     if( this.between.totalNumb == "3" && this.between.balanceNumb == ""){
        this.$message.error("静态报告解读服务指定医生等级副主任级别不可以为空");
        return
    }
    if( this.between.totalNumc == "3" && this.between.balanceNumc == ""){
        this.$message.error("静态报告解读服务指定医生等级主任级别不可以为空");
        return
    }
 if( this.between.totalNumf == "3" && this.between.balanceNumf == ""){
        this.$message.error("静态报告解读服务指定医生等级不指定医生级别不可以为空");
        return
    }
    if( this.between.totalNumj == "4" && this.between.balanceNumj == ""){
        this.$message.error("动态报告解读服务指定医生等级主治级别不可以为空");
        return
    }
     if( this.between.totalNumh == "4" && this.between.balanceNumh == ""){
        this.$message.error("动态报告解读服务指定医生等级副主任级别不可以为空");
        return
    }
   if( this.between.totalNumi == "4" && this.between.balanceNumi == ""){
        this.$message.error("动态报告解读服务指定医生等级主任级别不可以为空");
        return
    }
 if( this.between.totalNumk == "4" && this.between.balanceNumk == ""){
        this.$message.error("动态报告解读服务指定医生等级不指定医生级别不可以为空");
        return
    }
     if( this.between.totalNuml == "1" && this.between.balanceNuml == ""){
        this.$message.error("图文咨询服务指定医生等级主治级别不可以为空");
        return
    }
   if( this.between.totalNumm == "1" && this.between.balanceNumm == ""){
        this.$message.error("图文咨询服务指定医生等级副主任级别不可以为空");
        return
    }
     if( this.between.totalNumn == "1" && this.between.totalNumn == ""){
        this.$message.error("图文咨询服务指定医生等级主任级别不可以为空");
        return
    }
     if( this.between.totalNumo == "1" && this.between.balanceNumo == ""){
        this.$message.error("图文咨询服务指定医生等级不指定医生级别不可以为空");
        return
    }
      this.packaged = false
      this.loading = false
       let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001015006"
          },
          body: {
            managerNo: this.$route.params.id,
            PackageId:this.dds,
            termValidityStatus:this.between.termValidityStatus,
            // termValidityDuration:this.between.termValidityDuration,
            endDate:  this.between.times ,
            packageDetailJson:[
              {
                serviceType:5,
                titleId:0,
                num:this.between.balanceNums,
                isPermanent:this.between.totalNums
              },
              {
                serviceType:3,
                titleId:0,
                num:this.between.balanceNumd,
                isPermanent:this.between.totalNumd
              },
              {
                serviceType:3,
                titleId:1,
                num:this.between.balanceNuma,
                isPermanent:this.between.totalNuma
              },
              {
                serviceType:3,
                titleId:2,
                num:this.between.balanceNumb,
                isPermanent:this.between.totalNumb
              },
              {
                serviceType:3,
                titleId:3,
                num:this.between.balanceNumc,
                isPermanent:this.between.totalNumc
              },
               {
                serviceType:3,
                titleId:-1,
                num:this.between.balanceNumf,
                isPermanent:this.between.totalNumf
              },
              {
                serviceType:4,
                titleId:1,
                num:this.between.balanceNumj,
                isPermanent:this.between.totalNumj
              },
              {
                serviceType:4,
                titleId:2,
                num:this.between.balanceNumh,
                isPermanent:this.between.totalNumh
              },
               {
                serviceType:4,
                titleId:3,
                num:this.between.balanceNumi,
                isPermanent:this.between.totalNumi
              },
              {
                serviceType:4,
                titleId:-1,
                num:this.between.balanceNumk,
                isPermanent:this.between.totalNumk
              },
               {
                serviceType:1,
                titleId:1,
                num:this.between.balanceNuml,
                isPermanent:this.between.totalNuml
              },
              {
                serviceType:1,
                titleId:2,
                num:this.between.balanceNumm,
                isPermanent:this.between.totalNumm
              },
               {
                serviceType:1,
                titleId:3,
                num:this.between.balanceNumn,
                isPermanent:this.between.totalNumn
              },
               {
                serviceType:1,
                titleId:-1,
                num:this.between.balanceNumo,
                isPermanent:this.between.totalNumo
              },
            ]
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
           this.details()
          this.packages()
        }
      } catch (e) {
        this.$message.error(`error： ${e.message}`);
      }
      
    },
    //清除查看详情内容
    cancelq(){
      this.between.totalNums="",
      this.between.totalNumd="",
      this.between.balanceNumd="",
      this.between.balanceNumdd="",
      this.between.totalNuma="",
      this.between.balanceNuma="",
      this.between. balanceNums ="",
      this.between.totalNumb ="",
      this.between.balanceNumb="",
      this.between.totalNumc="",
      this.between.balanceNumc="",
      this.between.totalNumf="",
      this.between.balanceNumf="",
      this.between.totalNumj="",
      this.between.balanceNumf="",
      this.between.totalNumh="",
      this.between.balanceNumh="",
      this.between.totalNumi="",
      this.between.balanceNumi="",
      this.between.totalNumk="",
      this.between.balanceNumk="",
      this.between.totalNuml="",
      this.between.balanceNuml="",
      this.between.totalNumm="",
      this.between.balanceNumm="",
      this.between.totalNumn="",
      this.between.balanceNumn="",
      this.between.totalNumo="",
      this.between.balanceNumo="",
      this.between.balanceNumj ="",
      this.disabledsd=true, 
      this.disabledsa=true,
      this.disabledsb=true,
      this.disabledsc=true,
      this.disabledsda=true,
      this.disabledse=true,
      this.disabledsf=true,
      this.disabledsj=true,
      this.disabledsh=true,
      this.disabledsi=true,
      this.disabledsk=true,
      this.disabledsl=true,
      this.disabledsm=true,
      this.disabledsn=true,
      this.between.province ="",
      this.between.city = "",
      this.between.area="",
      this.between.hospital =""
    },
      //清除
      cancel(){
        this.dialogFormVisible = false;
        this.form. termValidityBeginTime="",
        this.form. termValidityEndTime="",
        this.form. packageId="",
        this.form. serviceNames="",
        this.form.  speed="",
        this.form. Indications="",
        this.form. level="",
        this.form. subject="",
        this.form. specifieds="",
        //动态解读
        this.form. cure="",
        this.form. cures="",
        this.form. curel="",
        this.form. cureld="",
        //图文资讯
        this.form. textbox="",
        this.form. textboxs="",
        this.form. textboa="",
        this.form. textb="",

        this.form. packageDescribe="",
        this.form. packagePrice="",
        this.form. termValidityStatus="",
        this.form. termValidityDuration="",
       this.form.  times= ""
      },
     //套餐明细
     async  breakdown(){

      let Url = "",
			params = {
				reqHead :{
					functionId:"DWA001015002"
				},
				body :{
          id:this.form.packageId
				}
			};
			this.loading = true;
			try {
				let res = await util.ajax.post(Url,params);
				if(res.data.respHead.respCode === "000"){
           this.loading = false;
          this.ginseng = res.data.body.data;
          this.ginse = res.data.body.data.servicePackage;
          this.form.packageDescribe = this.ginse.packageDescribe          
          this.form.packagePrice=  this.ginse.packagePrice /100
          this.form.termValidityStatus = this.ginse.termValidityStatus.toString();
          this.form.termValidityDuration = this.ginse.termValidityDuration;
          this.form.termValidityBeginTime = formatDate( this.ginse.termValidityBeginTime) 
          this.form.termValidityEndTime =  formatDate( this.ginse.termValidityEndTime) 
          this.form.times = [this.form.termValidityBeginTime , this.form.termValidityEndTime ]
          this.form.serviceNames =this.form.serviceNames = this.ginseng.serviceConfigList[0].number;
          if(this.form.serviceNames == -1){
            console.log(this.form.serviceNames )
            this.form.serviceNames = "不限次数"
          }
           //静态解读报告
           this.static =  this.ginseng.serviceConfigList[1].hwServiceConfigList[0];

           this.form.speed = this.static.number;
           if( this.form.speed == -1){
             this.form.speed = "不限次数"
           }
           this.stratified = this.ginseng.serviceConfigList[1].hwServiceConfigList[1].hwServiceConfigList;
           console.log( 1111,this.stratified )
           this.form.Indications =  this.stratified[0].number;
           if( this.form.Indications == -1){
             this.form.Indications = "不限次数"
           }
           this.form.level= this.stratified[1].number;
           if( this.form.level == -1){
             this.form.level = "不限次数"
           }
           this.form.subject = this.stratified[2].number;
           if( this.form.subject == -1){
             this.form.subject = "不限次数"
           }
           this.specified =this.ginseng.serviceConfigList[1].hwServiceConfigList[2];
           this.form.specifieds = this.ginseng.serviceConfigList[1].hwServiceConfigList[2].number;
           if( this.form.specifieds == -1){
             this.form.specifieds = "不限次数"
           }
           //动态解读报告
           this.explanations = this.ginseng.serviceConfigList[2].hwServiceConfigList;
          this.form.cure = this.ginseng.serviceConfigList[2].hwServiceConfigList[0].hwServiceConfigList[0].number;
          if( this.form.cure == -1){
             this.form.cure = "不限次数"
           }
          this.form.cures = this.ginseng.serviceConfigList[2].hwServiceConfigList[0].hwServiceConfigList[1].number;
          if( this.form.cures == -1){
             this.form.cures = "不限次数"
           }
          this.form.curel = this.ginseng.serviceConfigList[2].hwServiceConfigList[0].hwServiceConfigList[2].number;
          if( this.form.curel == -1){
             this.form.curel = "不限次数"
           }
          this.form.cureld = this.ginseng.serviceConfigList[2].hwServiceConfigList[1].number;
          if( this.form.cureld == -1){
             this.form.cureld = "不限次数"
           }
         //图文咨询服务
          this.framed =  this.ginseng.serviceConfigList[3].hwServiceConfigList;
          this.form.textbox = this.ginseng.serviceConfigList[3].hwServiceConfigList[0].hwServiceConfigList[0].number;
          if( this.form.textbox == -1){
             this.form.textbox = "不限次数"
           }
          this.form.textboxs =  this.ginseng.serviceConfigList[3].hwServiceConfigList[0].hwServiceConfigList[1].number;
          if( this.form.textboxs == -1){
             this.form.textboxs = "不限次数"
           }
          this.form.textboa =  this.ginseng.serviceConfigList[3].hwServiceConfigList[0].hwServiceConfigList[2].number;
          if( this.form.textboa == -1){
             this.form.textboa = "不限次数"
           }
          this.form.textb =  this.ginseng.serviceConfigList[3].hwServiceConfigList[1].number
          if( this.form.textb  == -1){
             this.form.textb  = "不限次数"
           }
         
				}
			}catch (e) {
				this.$message.error(`error： ${e.message}`);
			}
     },
    //解除服务
     jiec() {
      this.dialoa = true
    },
    //二次确认
   async dialogaa (){
      this.dialoa = false
      this.packaged = false
     let Url = "",
			params = {
				reqHead :{
					functionId:"DWA001015005"
				},
				body :{
           managerNo: this.$route.params.id,
           PackageId: this.dds 
				}
			};
			this.loading = true;
			try {
				let res = await util.ajax.post(Url,params);
				if(res.data.respHead.respCode === "000"){
        this.loading = false;
          this.packages()
          this.services()
				}
			}catch (e) {
				this.$message.error(`error： ${e.message}`);
			}

   },
    //列表信息
    async packages(){
     let Url = "",
			params = {
				reqHead :{
					functionId:"DWA001003002"
				},
				body :{
           id: this.$route.params.id
				}
			};
			this.loading = true;
			try {
				let res = await util.ajax.post(Url,params);
				if(res.data.respHead.respCode === "000"){
            // this.loading =false;
          this.listst = [res.data.body.data];
          	this.loading = false;
          if(this.listst[0].isServicePackage == true){
            this.userPacketList=this.listst[0].userPacketList
             this. hwSigningUser=[this.listst[0].hwSigningUser]
             this.arr =this.userPacketList.concat( this. hwSigningUser) ;
          }else {
            this.userPacketList=[],
            this. hwSigningUser=[this.listst[0].hwSigningUser]
             this.arr =this.userPacketList.concat( this. hwSigningUser) ;
          }
          if(this.listst[0].isSingDoctor == true){
            this.userPacketList=this.listst[0].userPacketList
             this. hwSigningUser=[this.listst[0].hwSigningUser]
             this.arr =this.userPacketList.concat( this. hwSigningUser) ;
          }else {
            this.userPacketList=this.listst[0].userPacketList,
            this. hwSigningUser=[]
             this.arr =this.userPacketList.concat( this. hwSigningUser) ;
          }
				}
			}catch (e) {
				this.$message.error(`error： ${e.message}`);
			}

    },
     //开通
    async kaitong() {
      this.dialogFormVisible = false;
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001015004"
          },
          body: {
            managerNo: this.$route.params.id,
            PackageId:this.form.packageId,
            // startDate:this.form.times[0],
            // endDate:this.form.times[1]
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          // this.get_user_details()
          this.packages()
          this.cancel()
        }
      } catch (e) {
        this.$message.error(`error： ${e.message}`);
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
  },
  //服务名称
  async services(){
     let Url = "",
			params = {
				reqHead :{
					functionId:"DWA001003006"
				},
				body :{
           managerNo: this.$route.params.id
				}
			};
			this.loading = true;
			try {
        let res = await util.ajax.post(Url,params);
				if(res.data.respHead.respCode === "000"){
          //  console.log(66566, res.data.body.data)
           this.meal = res.data.body.data;
            // this.breakdown()
				}
			}catch (e) {
				this.$message.error(`error： ${e.message}`);
			}
  },
	//查看详情套餐详情
	async  details(id,row){
      this.dds = row.packetId
    if(this.listst[0].isServicePackage  == true){

        this.packaged = true;
       this.doctor = false
       let Url = "",
			params = {
				reqHead :{
					functionId:"DWA001003007"
				},
				body :{
          managerNo: this.$route.params.id,
          packetId:row.packetId
				}
			};
			this.loading = true;
			try {
        let res = await util.ajax.post(Url,params);
				if(res.data.respHead.respCode === "000"){
                // console.log( 58656666,row.packetId)

                  this.loading = false;
              this.Setmenu = res.data.body.data;
              console.log(6648444,this.Setmenu)
              this.between.packageName= res.data.body.data.servicePackage.packageName;
              this.between.createdAt = res.data.body.data.servicePackage.createdAt;
              this.between.endDated =  formatDate( this.Setmenu. endDate)
              this.servicePackage = this.Setmenu.servicePackage;
               
                console.log(8844666666,this.servicePackage)
                // if(this.servicePackage.isArea == 1){
                   this.between.province = this.servicePackage.province
                   this.between.city = this.servicePackage.city
                   this.between.area = this.servicePackage.area
                   this.between.hospital = this.servicePackage.hospital
                // }
                // if(this.servicePackage.isArea == 0){
                //    this.between.province = "全国"
                //    this.between.city =""
                //    this.between.area = ""
                //    this.between.hospital =""
                // }
               if(this.between.endDated.slice(0,4) ==  2099){
                 this.between.termValidityStatus = "0"
                 this.between.times=""
               }
               if(this.between.endDated.slice(0,4) !=  2099){
                 this.between.termValidityStatus = "1"
                 this.between.times =  this.between.endDated 
               }
              this.between.packageDescribe =  this.Setmenu.servicePackage.packageDescribe
              this.between.packagePrice = this.Setmenu.servicePackage.packagePrice /100;
                console.log(456666,this.Setmenu.serviceBalanceList)


              //服务内容
              for(var i = 0;i<this.Setmenu.serviceBalanceList.length;i++){
                //追加字段
                this.$set(this.Setmenu.serviceBalanceList[i],"disableds",false);

               if(this.Setmenu.serviceBalanceList[i].serviceType == 5 && this.Setmenu.serviceBalanceList[i].titleId == 0){
                     console.log(this.Setmenu.serviceBalanceList[i])
                    if(this.Setmenu.serviceBalanceList[i].disableds == false ){
                    this.disabledsd = false
                    }
                    if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                      this.between.totalNums = "-1"
                      this.between.balanceNums = ""
                     
                    }else if(this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                      this.between.totalNums = "0" 
                       console.log( 5466666,this.between.totalNums )
                       this.between.balanceNums = this.Setmenu.serviceBalanceList[i].balanceNum;
                    }
               
               }
               
               //静态报告解读服务AI医生解读
               if(this.Setmenu.serviceBalanceList[i].serviceType == 3 && this.Setmenu.serviceBalanceList[i].titleId == 0){
                 if(row.packetId == 1 && row.packetId == 2){
                   this. disabledsa = true
                 }else {
                   if(this.Setmenu.serviceBalanceList[i].disableds == false ){
                     this. disabledsa = false
                   }
                 }

                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumd = '-1'
                    this.between.balanceNumd = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumd = "0"
                   this.between.balanceNumd = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               
               }
               //静态报告解读服务主治级别
               if(this.Setmenu.serviceBalanceList[i].serviceType == 3 && this.Setmenu.serviceBalanceList[i].titleId == 1){
                    if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsb = false
                    }
                  if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNuma   = '-1'
                    this.between.balanceNuma = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNuma   = "0"
                   this.between.balanceNuma = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
                 
               }
                //静态报告解读服务副主任级别
                if(this.Setmenu.serviceBalanceList[i].serviceType == 3 && this.Setmenu.serviceBalanceList[i].titleId == 2){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsc = false
                   }
                  if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumb   = '-1'
                    this.between.balanceNumb = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumb   = "0"
                   this.between.balanceNumb = this.Setmenu.serviceBalanceList[i].balanceNum

                 }
                }
                //静态报告解读服务主任级别
               if(this.Setmenu.serviceBalanceList[i].serviceType == 3 && this.Setmenu.serviceBalanceList[i].titleId == 3){
                 if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsda= false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumc   = '-1'
                    this.between.balanceNumc = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumc   = "0"
                   this.between.balanceNumc = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
              //静态报告解读服务不指定医生等级
                if(this.Setmenu.serviceBalanceList[i].serviceType == 3 && this.Setmenu.serviceBalanceList[i].titleId == -1){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledse = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumf   = '-1'
                    this.between.balanceNumf = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumf   = "0"
                   this.between.balanceNumf = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
              //动态报告解读服务主治级别
               if(this.Setmenu.serviceBalanceList[i].serviceType == 4 && this.Setmenu.serviceBalanceList[i].titleId == 1){
                 if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsf = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumj   = '-1'
                    this.between.balanceNumj = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumj   = "0"
                   this.between.balanceNumj = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
                //动态报告解读服务副主任级别
               if(this.Setmenu.serviceBalanceList[i].serviceType == 4 && this.Setmenu.serviceBalanceList[i].titleId == 2){
                  if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsj = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumh   = '-1'
                    this.between.balanceNumh = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumh   = "0"
                   this.between.balanceNumh = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
                //动态报告解读服务主任级别
               if(this.Setmenu.serviceBalanceList[i].serviceType == 4 && this.Setmenu.serviceBalanceList[i].titleId == 3){
                 if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsh = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumi   = '-1'
                    this.between.balanceNumi = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumi   = "0"
                   this.between.balanceNumi = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
                //动态报告解读服务不指定医生等级
               if(this.Setmenu.serviceBalanceList[i].serviceType == 4 && this.Setmenu.serviceBalanceList[i].titleId == -1){
                 if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsi = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumk   = '-1'
                    this.between.balanceNumk = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumk   = "0"
                   this.between.balanceNumk = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
               //图文咨询服务主治级别
                 if(this.Setmenu.serviceBalanceList[i].serviceType ==1 && this.Setmenu.serviceBalanceList[i].titleId == 1){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsk = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNuml   = '-1'
                    this.between.balanceNuml = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNuml   = "0"
                   this.between.balanceNuml = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
               //图文咨询服务副主治级别
                 if(this.Setmenu.serviceBalanceList[i].serviceType ==1 && this.Setmenu.serviceBalanceList[i].titleId == 2){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsl = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumm   = '-1'
                    this.between.balanceNumm = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumm   = "0"
                   this.between.balanceNumm = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
                //图文咨询服务主任级别
                 if(this.Setmenu.serviceBalanceList[i].serviceType ==1 && this.Setmenu.serviceBalanceList[i].titleId == 3){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsm = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumn   = '-1'
                    this.between.balanceNumn = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumn   = "0"
                   this.between.balanceNumn = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
               //图文咨询服务不指定级别
                 if(this.Setmenu.serviceBalanceList[i].serviceType ==1 && this.Setmenu.serviceBalanceList[i].titleId == -1){
                   if(this.Setmenu.serviceBalanceList[i].disableds == false){
                      this. disabledsn = false
                   }
                 if(this.Setmenu.serviceBalanceList[i].totalNum == -1){
                    this.between.totalNumo   = '-1'
                    this.between.balanceNumo = ""
                 }else if (this.Setmenu.serviceBalanceList[i].totalNum !=-1 ){
                   this.between.totalNumo   = "0"
                   this.between.balanceNumo = this.Setmenu.serviceBalanceList[i].balanceNum
                 }
               }
              }
				}
			}catch (e) {
				this.$message.error(`error： ${e.message}`);
			}
    }
     
  
  },
  //签约医生服务
  async detailaa (id,row){
    console.log(row)
    this.signingName = row.signingName
      if(row.signingName == "签约医生服务"){
      this.doctor = true
         this.packaged = false;
         this.loading = false
         let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003008"
          },
          body: {
            managerNo: this.$route.params.id,
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
            
             this.adds = res.data.body.data
              console.log(this.adds )
             this.hospitalNames = this.adds.hospitalName
        
             this.doctorName = this.adds.doctorName
              this.durations = this.adds.duration
              this.startDated = this.adds.startDate
              this.daoqi = this.adds.endDate;
              this.commonPrice = this.adds.commonPrice/100;
              for(var i = 0;i<this.adds.hwSigningUserList.length;i++){
                //追加字段
                this.$set(this.adds.hwSigningUserList[i],"dawwww",false)
                 console.log(11166666,this.adds.hwSigningUserList[i])
                 if(this.adds.hwSigningUserList[i].serviceType == 1){
                   if(this.adds.hwSigningUserList[i].dawwww == false){
                       this.ded = false
                   }
                    this.surpa = this.adds.hwSigningUserList[i].surplusNum
                    // console.log(this.adds.hwSigningUserList[i].id)
                    this.idsa = this.adds.hwSigningUserList[i].id
                    }
                    if(this.adds.hwSigningUserList[i].serviceType == 4){
                       if(this.adds.hwSigningUserList[i].dawwww == false){
                       this.dad = false
                   }
                       this.surplusNumsd = this.adds.hwSigningUserList[i].surplusNum
                        this.idsas = this.adds.hwSigningUserList[i].id
                    }
                    if(this.adds.hwSigningUserList[i].serviceType == 3){
                        if(this.adds.hwSigningUserList[i].dawwww == false){
                       this.dfd = false
                   }
                      this.surplusNa = this.adds.hwSigningUserList[i].surplusNum
                       this.idsasa = this.adds.hwSigningUserList[i].id
                      }
              }
        }
           
      } catch (e) {
        this.$message.error(`error： ${e.message}`);
      }
    }
  },
    // 解绑签约医生
    async Untie() {
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003004"
          },
          body: {
            managerNo: this.$route.params.id,
            docId: this.doctorId
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(5546566,res);
        if (res.data.respHead.respCode === "000") {
          this.loading = false;
          this.$message({
            message: "解绑成功",
            type: "success"
          });
          this.get_user_details();
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.$message.error(`error： ${e.message}`);
      }
    },
    // 修改免费次数
    async _num() {
      if (this.score < 0) {
        return this.$message.error("请正确填写数值，必须大于等于0");
      }
      let Url = "",
        params = {
          reqHead: {
            functionId: "DWA001003003"
          },
          body: {
            id: this.edit_num_id,
            score: this.score
          }
        };
      this.loading = true;
      try {
        let res = await util.ajax.post(Url, params);
        console.log(res);
        this.loading = false;
        this.edit_data.is = false;
        this.score = "";
        if (res.data.respHead.respCode === "000") {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.get_user_details();
          // this.tableData = res.data.body.data;
        } else {
          this.$message.error(`${res.data.respHead.respMsg}`);
        }
      } catch (e) {
        console.log(e);
        this.loading = false;

        this.$message.error(`error： ${e.message}`);
      }
    },
    // 解绑确认
    _Untie() {
      this.$confirm("确定要解除签约医生服务吗？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.Untie();
        })
        .catch(() => {
          // 取消删除时触发
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit_show(type) {
      this.edit_data.is = true;
      this.edit_num_id = this[type].id;
      let obj = {
        tuwen: "图文咨询次数",
        dongtai: "动态心电报告解读次数",
        jingtai: "静态心电报告解读次数"
      };
      this.edit_data.text = obj[type];
    },
    closeModal() {
      this.edit_data.is = false;
    },
    go_to() {
      this.$router.push({
        name: "users"
      });
    },
    //   放大
    enlarge(path) {
      this.path = path;
      this.path_active = true;
    },
    
  },
  filters: {
    time(val) {
      return formatSecond(val);
    },
    f_isSingDoctor(val) {
      return val ? "是" : "否";
    },
    sex(val) {
      return val === 0 ? "男" : "女";
    },
    batch(val){
      switch(val){
        case 0:
          return "剩余极速解读服务";
        case 1:
          return '剩余图文咨询服务';
        case 2:
          return "剩余电话服务";
        case 3:
          return "剩余静态心电服务";
        case 4 :
          return "剩余动态心电服务";
        case 5 :
          return "剩余AI分析服务";
        case 6 :
          return "剩余心电报告服务";
      }
    },
    intern(val){
      switch(val){
        case -1:
          return "不指定医生";
        case 0:
          return "极速解读服务";
        case 1:
          return "主治医生";
        case 2 :
          return "副主任医生";
        case 3:
          return "主任医生";

      }
    },
    interns(val){
      switch(val){
        case 1 :
          return "剩余图文咨询服务";
        case 2 :
          return "剩余电话服务";
        case 3 :
          return "剩余静态心电报告服务"  ;
        case 4 :
          return "剩余动态心电服务"
      }
    },
  }
};
</script>

<style lang="scss">
.user_details .el-date-editor--datetimerange.el-input__inner {
  width: 200px;
}
.user_details {
  font-size: 14px;

  ul {
    list-style: none;
    padding-left: 0;

    li {
      margin-bottom: 10px;

      span {
        display: inline-block;
        min-width: 100px;
      }
    }
  }

  .img_list {
    display: flex;
    flex-wrap: wrap;
    margin-left: 85px;
    margin-top: 10px;

    img {
      width: 180px;
      height: 180px;
      margin-right: 10px;
    }
  }

  .user_info {
    display: flex;
  }

  .info_p {
    flex: 0 0 20%;
    max-width: 90px;
    height: 90px;

    img {
      width: 100%;
      height: 100%;
    }

    margin-right: 20px;
  }

  .info_name {
    flex: 1;
    display: flex;
    flex-direction: column;

    & > div {
      width: 500px;
      word-wrap: break-word;
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

  .edit-item {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .title {
      width: 150px;
    }

    .el-input {
      width: 150px;
      padding: 0 10px;
    }
  }

  .btns {
    margin-top: 30px;
  }

  .num-box {
    display: flex;
    align-items: center;

    .el-input {
      width: 150px;
    }
  }

  .btns {
    border-top: 1px solid #ddd;
    padding-top: 30px;
    text-align: center;
  }

  .btnss {
    text-align: right;
  }

  .num-title {
    width: 100px;
  }
  .service-title {
    font-size: 18px;
    font-weight: bold;
    margin-top: 12px;
  }
  .buad {
    .adadd {
      float: right;
    }
  }
  .list {
    margin-top: 60px;
   
  }
}
</style>
