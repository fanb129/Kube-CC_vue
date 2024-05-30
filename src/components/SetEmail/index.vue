<template>
  <div style="display: inline-block">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="450px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" auto-complete="on" label-position="left">
        <el-form-item prop="graphcode">
          <div style="float:left">
<!--          <span class="svg-container">-->
<!--              <svg-icon icon-class="password" />-->
<!--          </span>-->
            <el-input
              ref="graphcode"
              v-model="form.graphcode"
              placeholder="图形验证码"
              name="graphcode"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </div>
          <div style="float:right;background-color: aliceblue;width: 160px;height: 50px;">
            <img :src="imgUrl" style="width:160px;height:50px;" @click="resetImg">
          </div>
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="email">
              <div style="float:left">
<!--              <span class="svg-container">-->
<!--                <svg-icon icon-class="password" />-->
<!--              </span>-->
                <el-input
                  ref="email"
                  v-model="form.email"
                  placeholder="邮箱地址"
                  name="email"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </div>
              <div style="float:left;padding-left: 10px">
                <el-button v-show="show" type="primary" @click="getCode">获取验证码</el-button>
                <span v-show="!show" class="count" style="color:#0022ff;padding-right:20px">{{ count }}</span>
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
                v-model="form.emailcode"
                placeholder="邮箱验证码"
                name="emailcode"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click.native.prevent="handleSetEmail">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {captcha, checkcp, emailcaptchaToSetEmail, setEmail, resetPass} from "@/api/user";
import {Message} from "element-ui";

export default {
  name: 'SetEmail',
  props: ['u_id'],
  data() {
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
      if (value == '') {
        callback(new Error('邮箱未填写'))
      } else {
        callback()
      }
    }
    const validateCpatcha = (rule, value, callback) => {
      if ((this.captchaverify && value == this.lastvalue) || (this.empty && value == this.truevalue)) {
        callback()
        this.captchaverify = true
      } else {
        this.lastvalue = ''
        this.lastvalue = value
        this.verifyCaptcha(this.imgid, value)
        if (value == '') {
          callback(new Error('图片验证码未填写'))
        } else {
          callback()
        }
      }
    }
    const validateEmailCpatcha = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('邮箱验证码未填写'))
      } else {
        // this.emailverify()
        callback()
      }
    }
    return {
      loading: false,
      dialog: false,
      title: '绑定邮箱',
      count: 0,
      lastvalue: '',
      truevalue: 'jhghj',
      empty: false,
      show: true,
      timer: 0,
      emailsendcode: true,
      imgUrl: '',
      imgid: 0,
      captchaverify: false,
      form: {
        email: '',
        graphcode: '',
        emailcode: ''
      },
      rules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        graphcode: [{ required: true, trigger: 'blur', validator: validateCpatcha }],
        emailcode: [{ required: true, trigger: 'blur', validator: validateEmailCpatcha }]
      }
    }
  },
  created() {
    this.resetImg()
    console.log(this.imgUrl)
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    handleSetEmail() {
      if (this.form.emailcode === '') {
        this.$message({
          type: 'error',
          message: '邮箱验证码为空'
        })
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            setEmail({ id: this.u_id, email: this.form.email, vcode: this.form.emailcode }).then(() => {
              Message({
                message: '邮箱绑定成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.loading = false
              location.reload()
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    getCode() {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (!myreg.test(this.form.email)) {
        // callback(new Error('邮箱格式错误'))
        this.$message({
          type: 'error',
          message: '邮箱格式错误'
        })
        // this.emailsendcode=true
      } else {
        if (!this.captchaverify) {
          // callback(new Error('图片验证码错误'))
          this.$message({
            type: 'error',
            message: '图片验证码错误'
          })
          // this.emailsendcode=true
        } else {
          emailcaptchaToSetEmail(this.form.email).then((res) => {
          }).catch(() => {})
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
            // callback()
            // this.emailsendcode=false
          }
        }
        // emailcaptcha(this.form.email).then((res)=>{
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
    // emailverify() {
    //   verifyemail({ email: this.form.email, vcode: this.form.emailcode }).then((res) => {
    //     if (res.code == 1) {
    //       this.registerbutton = false
    //     } else {
    //       this.registerbutton = true
    //     }
    //   }).catch(() => {})
    // },
    resetImg() {
      captcha().then((res) => {
        this.imgUrl = res.pic_path
        this.imgid = res.captcha_id
      }).catch(() => {})
      // captcha().then((res=>{
      //   this.imgUrl = res.picPath;
      // }))
    },
    verifyCaptcha(id, val) {
      this.captchaverify = false
      checkcp({ captcha_id: id, captcha_val: val }).then((res) => {
        if (res.code == 1) {
          this.captchaverify = true
          this.truevalue = val
          this.empty = false
        } else if (res.code == 0) {
          this.captchaverify = false
          this.empty = true
        } else {
          this.captchaverify = false
          this.empty = false
        }
      }).catch(() => {
        this.resetImg()
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        email: '',
        graphcode: '',
        emailcode: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
