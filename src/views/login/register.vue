<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Kube-CC</h3>
      </div>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="registerForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item prop="nickname">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="nickname"
              v-model="registerForm.nickname"
              placeholder="Nickname"
              name="nickname"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="registerForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="checkpass">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="checkpass"
              v-model="registerForm.checkpass"
              :type="passwordType"
              placeholder="Password"
              name="checkpass"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleRegister"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-col>
      </el-row>


      <el-form-item prop="graphcode">
        <div style="float:left">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="graphcode"
            v-model="registerForm.graphcode"
            placeholder="GraphCode"
            name="graphcode"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </div>
        <div style="float:right;background-color: aliceblue;width: 160px;height: 50px;">
          <img :src="imgUrl" @click="resetImg" style="width:160px;height:50px;"/>
        </div>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="email">
            <div style="float:left">
              <span class="svg-container" >
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="email"
                v-model="registerForm.email"
                placeholder="Email"
                name="email"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </div>
            <div style="float:right;padding-right: 10px;padding-top: 5px;">
              <el-button v-show="show" @click="getCode" type="primary" >获取验证码</el-button>
              <span v-show="!show" class="count" style="color:azure;padding-right:20px">{{ count }}</span>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="emailcode">
            <!-- <span class="svg-container">
              <svg-icon icon-class="password" />
            </span> -->
            <el-input
              ref="emailcode"
              v-model="registerForm.emailcode"
              placeholder="emailcode"
              name="emailcode"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-button :loading="loading" type="primary" style="width: 30%" @click.native.prevent="handleRegister" >注册</el-button>
      <el-button style="width: 30%; float: right" @click="back">返回</el-button>
    </el-form>
  </div>
</template>

<script>
import { register, captcha, checkcp, emailcaptcha, verifyemail } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Register',
  created(){
    this.resetImg()
    console.log(this.imgUrl)
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3 || value.length > 16) {
        callback(new Error('用户名长度必须在3~16字符之间'))
      } else {
        callback()
      }
    }
    const validateNickname = (rule, value, callback) => {
      if (value.length < 1 || value.length > 16) {
        callback(new Error('昵称长度必须在1~16字符之间'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度必须在6~16字符之间'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      // var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      // if ( !myreg.test(value) ) {
      //   callback(new Error('邮箱格式错误'))
      //   this.emailsendcode=true
      // } else {
      //   if(!this.captchaverify) {
      //     callback(new Error('图片验证码错误'))
      //     this.emailsendcode=true
      //   } else {
      //     callback()
      //     this.emailsendcode=false
      //   }
      // }
      if(value == ""){
        callback(new Error('邮箱未填写'))
      }else{
        callback()
      }
    }
    const validateCpatcha = (rule, value, callback) => {
      if((this.captchaverify && value == this.lastvalue) ||(this.empty && value == this.truevalue) ){
        callback()
        this.captchaverify = true
      }else{
        this.lastvalue = ''
        this.lastvalue = value
        this.verifyCaptcha(this.imgid,value)
        if(value == ""){
          callback(new Error('图片验证码未填写'))
        } else {
          callback()
        }
      }
    }
    const validateEmailCpatcha = (rule, value, callback) => {
      if(value == ""){
        callback(new Error('邮箱验证码未填写'))
      } else {
        //this.emailverify()
        callback()
      }
    }
    return {
      count: 0,
      lastvalue:'',
      truevalue:'jhghj',
      empty:false,
      show: true,
      timer: 0,
      emailsendcode: true,
      imgUrl: '',
      imgid: 0,
      captchaverify: false,
      //registerbutton: true,
      registerForm: {
        username: '',
        nickname: '',
        password: '',
        checkpass: '',
        email: '',
        graphcode:'',
        emailcode: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        nickname: [{ required: true, trigger: 'blur', validator: validateNickname }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkpass: [{ required: true, trigger: 'blur', validator: validatePass2 }],
        email:[{ required: true, trigger: 'blur', validator: validateEmail }],
        graphcode:[{ required: true, trigger: 'blur', validator: validateCpatcha }],
        emailcode:[{ required:true,trigger:'blur', validator: validateEmailCpatcha }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      if(this.registerForm.emailcode === ''){
        this.$message({
            type: 'error',
            message: '邮箱验证码为空'
          })
      }
      else{
        verifyemail({email: this.registerForm.email,vcode: this.registerForm.emailcode}).then((res)=>{
          if(res.code==1){
            this.$refs.registerForm.validate(valid => {
              if (valid) {
                this.loading = true
                register({ username: this.registerForm.username, password: this.registerForm.password, nickname: this.registerForm.nickname, email: this.registerForm.email }).then(() => {
                  Message({
                    message: '注册成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.$router.push({ path: '/login' })
                  this.loading = false
                }).catch(() => {
                  this.loading = false
                })
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }
        }).catch(()=>{})
      }
      
      // this.$refs.registerForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     register({ username: this.registerForm.username, password: this.registerForm.password, nickname: this.registerForm.nickname, email: this.registerForm.email }).then(() => {
      //       Message({
      //         message: '注册成功',
      //         type: 'success',
      //         duration: 3 * 1000
      //       })
      //       this.$router.push({ path: '/login' })
      //       this.loading = false
      //     }).catch(() => {
      //       this.loading = false
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    back() {
      this.$router.push({ path: '/login' })
    },
    getCode() {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if ( !myreg.test(this.registerForm.email) ) {
        //callback(new Error('邮箱格式错误'))
        this.$message({
            type: 'error',
            message: '邮箱格式错误'
          })
        //this.emailsendcode=true
      } else {
        if(!this.captchaverify) {
          //callback(new Error('图片验证码错误'))
          this.$message({
            type: 'error',
            message: '图片验证码错误'
          })
          //this.emailsendcode=true
        } else {
          emailcaptcha(this.registerForm.email).then((res)=>{
          }).catch(()=>{})
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          //callback()
          //this.emailsendcode=false
          }
        }
      // emailcaptcha(this.registerForm.email).then((res)=>{
      // }).catch(()=>{})
      // const TIME_COUNT = 60;
      // if (!this.timer) {
      //   this.count = TIME_COUNT;
      //   this.show = false;
      //   this.timer = setInterval(() => {
      //     if (this.count > 0 && this.count <= TIME_COUNT) {
      //       this.count--;
      //     } else {
      //       this.show = true;
      //       clearInterval(this.timer);
      //       this.timer = null;
      //     }
      //   }, 1000);
      }
    },
    emailverify(){
      verifyemail({email: this.registerForm.email,vcode: this.registerForm.emailcode}).then((res)=>{
        if(res.code==1){
          this.registerbutton=false
        }else{
          this.registerbutton=true
        }
      }).catch(()=>{})
    },
    resetImg() {
      captcha().then((res)=>{
        this.imgUrl = res.pic_path
        this.imgid = res.captcha_id
      }).catch(()=>{})
      // captcha().then((res=>{
      //   this.imgUrl = res.picPath;
      // }))
    },
    verifyCaptcha(id,val) {
      this.captchaverify = false
      checkcp({captcha_id: id,captcha_val: val}).then((res)=>{
        if(res.code == 1){
          this.captchaverify = true
          this.truevalue = val
          this.empty =false
        }else if(res.code ==0){
          this.captchaverify = false
          this.empty = true
        }
        else{
          this.captchaverify = false
          this.empty = false
        }
      }).catch(()=>{
        this.resetImg()
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
