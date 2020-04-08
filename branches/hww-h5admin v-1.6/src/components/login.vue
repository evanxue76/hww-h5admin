<template>
  <div class="login-wrap">
    <div class="login-content">
      <div class="login_title">心知了运营管理平台</div>
      <div class="login_info">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="manageUserName">
            <el-input
              v-model="ruleForm.manageUserName"
              placeholder="用户名"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              type="passWord"
              placeholder="密码"
              v-model="ruleForm.passWord"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button
              type="primary"
              @keyup.enter.native="submitForm('ruleForm')"
              @click="submitForm('ruleForm')"
              :loading="loading"
            >登录</el-button>
          </div>
          <div class="cookies">
            记住密码
            <el-checkbox v-model="checked"></el-checkbox>
          </div>
          <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户和密码必填。</p>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import baseUrl from '@/lib/global'
import axios from 'axios'
import items from '@/lib/menu_item'
export default {
  data() {
    return {
      items,
      loading: false,
      checked: false,
      ruleForm: {
        manageUserName: '',
        passWord: ''
      },
      rules: {
        manageUserName: [
          { required: true, message: '请输入用户名', trigger: 'submit' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'submit' }
        ]
      }
    }
  },
  created() {
    if (localStorage.getItem('hw_checked')) {
      this.checked = true
      this.ruleForm = JSON.parse(localStorage.getItem("hw_ruleForm"))
    }
  },
  watch: {
    "ruleForm.manageUserName": function (val) {
      this.ruleForm.manageUserName = val.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "")
    }
  },
  methods: {
    screen_menu(moduleIds) {
      let arrs = [], arr = moduleIds
      this.items.forEach(i => {
        if (moduleIds.includes(i.id)) {
          arrs.push(i)
          return
        }
      })
      if (arrs[0].subs) {
        for (let i = 0; i < arrs.length; i++) {
          // 多级菜单循环
          if (arrs[i].subs) {
            let path = {
              index: '',
              url: ''
            }
            if (arr.indexOf(arrs[i].id) == -1) {
              arrs[i].show = false
            } else {
              arrs[i].show = true
            }
            for (let index = 0; index < arrs[i].subs.length; index++) {
              if (arr.indexOf(arrs[i].subs[index].id) == -1) {
                arrs[i].subs[index].show = false
              } else {
                arrs[i].subs[index].show = true
                if (path.index === "") {
                  path.index = index
                  path.url = arrs[i].subs[index].index
                }
              }

              if (index === (arrs[i].subs.length - 1) && path.index >= 0) {
                arrs[i].index = path.url
              }
            }
          }
        }
      }
      this.$message({
        type: 'success',
        message: '登录成功!',
        duration: 2000
      })

      this.$router.push({
        name: `${arrs[0].index}`,
        query: { index: 'userCenter' }
      })
    },       
    submitForm(name) {
      const self = this, url = `${baseUrl.developmentUrl.host2}/dwa/login`
      self.$refs[name].validate(valid => {
        if (valid) {
          self.loading = true
          let data = {
            account: self.ruleForm.manageUserName,
            password: self.ruleForm.passWord
          }
          axios
            .post(url, data)
            .then((res) => {
              console.log(res)
              self.loading = false
              if (res.data.code === '000') {
                // 清空缓存数据
                localStorage.removeItem("hw_login_data")
                localStorage.setItem('hw_login_data', JSON.stringify(res.data))
                localStorage.setItem('hw_token', res.data.token)
                if (self.checked) {
                  localStorage.setItem('hw_checked', self.checked)
                  localStorage.setItem('hw_ruleForm', JSON.stringify(self.ruleForm))
                } else {
                  localStorage.removeItem('hw_checked')
                  localStorage.removeItem('hw_ruleForm')
                }
                self.screen_menu(res.data.moduleIds)
              }else if(res.data.code === '005'){
				  self.$message.error(`账号或者密码不正确`)
			  } else {
                self.$message.error(`${res.data.msg}`)
              }
            })
            .catch((err) => {
              self.loading = false
              if (err.message.includes('Network')) {
                self.$message.error('网络连接错误，请检查网络连接，再重新尝试!')
              } else {
                self.$message.error(`${err.msg}`)
              }
            })
        } else {
          self.$message.error({ message: '请完整填写信息。' })
        }
      })
    },

    //    submitForm (name) {
    //  	let self = this
    //  	self.$refs[name].validate((valid) => {
    //  		if (valid) {
    //  			localStorage.setItem('isSystem','1')
    //  			self.$cookie.set('manageUserName', self.ruleForm.manageUserName, 60*60*24*30)
    //  			if (this.checked == true) {
    //  				self.$cookie.set('passWord', self.ruleForm.passWord, 60*60*24*30)
    //  				self.$cookie.set('checked', self.checked, 60*60*24*30)
    //  			}else{
    //  				self.$cookie.set('passWord', self.ruleForm.passWord, -1)
    //  				self.$cookie.set('checked', self.checked, -1)
    //  			}
    //  			self.$message({
    //                  type:'success',
    //                  message:'登录成功！',
    //                  duration:1000
    //              })
    //  			self.$router.push({
    //                  path: '/home',
    //                  query: { index: 'userCenter' }
    //              })
    //  		} else {
    //  			self.$message.error({message: '请完整填写信息。'})
    //  		}
    //  	})
    //  },

  }
}
</script>
<style scoped lang="scss">
// .login-wrap {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   background: #242f42;
//   position: relative;
//   .login-content {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     display: flex;
//     width: 100%;
//     font-size: 16px;
//     overflow: hidden;
//     transition: 0.3s;
//     transform: translate3d(-50%, -50%, 0);
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//   }
//   .login_title {
//     width: 100%;
//     height: 60px;
//     box-sizing: border-box;
//     padding-bottom: 50px;
//     font-size: 30px;
//     line-height: 30px;
//     text-align: center;
//     color: #ffffff;
//   }
//   .login_info {
//     width: 420px;
//     height: 250px;
//     box-sizing: border-box;
//     padding: 28px 40px;
//     background: #ffffff;
//     border-radius: 5px;
//   }
//   .login-btn {
//     text-align: center;
//   }
//   .login-btn button {
//     width: 100%;
//     height: 36px;
//   }
//   .cookies {
//     font-size: 12px;
//     margin-top: 6px;
//   }
//   .el-form-item {
//     margin-top: 0;
//   }
// }
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #242f42;
  position: relative;
}
.login-content {
  position: absolute;
  width: 420px;
  height: 300px;
  top: 50%;
  left: 50%;
  margin-top: -186px;
  margin-left: -190px;
}
.login_title {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding-bottom: 50px;
  font-size: 30px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
}
.login_info {
  width: 420px;
  height: 250px;
  box-sizing: border-box;
  padding: 28px 40px;
  background: #ffffff;
  border-radius: 5px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.login-wrap .cookies {
  font-size: 12px;
  margin-top: 6px;
}
.login-wrap .el-form-item {
  margin-top: 0;
}
</style>
