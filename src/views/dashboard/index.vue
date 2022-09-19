<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <!--                <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif">-->
                <img :src="avatar+'?imageView2/1/w/80/h/80'" title="点击上传头像" class="avatar">
                <!--                <myUpload-->
                <!--                  v-model="show"-->
                <!--                  :headers="headers"-->
                <!--                  :url="updateAvatarApi"-->
                <!--                  @crop-upload-success="cropUploadSuccess"-->
                <!--                />-->
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ name }}</div></li>
              <li><svg-icon icon-class="dept" /> 权限 <div class="user-right">
                <el-tag v-if="role === 1" size="mini">普通用户</el-tag>
                <el-tag v-else-if="role === 2" size="mini" type="success">管理员</el-tag>
                <el-tag v-else-if="role === 3" size="mini" type="danger">超级管理员</el-tag>
              </div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    资源面板    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="控制台" name="second">
              <!--              <el-table v-loading="loading" :data="dashboardData" style="width: 100%;">-->
              <!--              </el-table>-->
              <div class="record">
                <el-card
                  v-for="item,index in dashboardData"
                  :key="item.name"
                  shadow="hover"
                  :body-style="{ display: 'flex', padding: 0}"
                >
                  <i
                    class="icon"
                    :class="item.icon"
                    :style="{ background: item.color }"
                    @click="push2(index)"
                  />
                  <div class="detail" @click="push2(index)">
                    <p class="num">{{ item.value }}</p>
                    <p class="text">{{ item.name }}</p>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="editRules" style="margin-top: 10px;" size="small" label-width="65px">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.nickname" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <EditPwd ref="pass" :u_id="this.u_id" :username="this.username" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditPwd from '@/components/EditPwd'
import { updateUser, getUserList } from '@/api/user'
import { getNodeList } from "@/api/node";
import { getNsList } from "@/api/namespace";
import { getDeployList } from "@/api/deploy";
import { getServiceList } from "@/api/service";
import { getPodList } from "@/api/pod";
import { getSparkList } from "@/api/spark";
import { getHadoopList } from "@/api/hadoop";
import { getLinuxList } from "@/api/linux";
import { Message } from 'element-ui'

export default {
  name: 'Dashboard',
  components: { EditPwd },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'role',
      'username',
      'u_id'
    ])
  },
  data() {
    const validateNickname = (rule, value, callback) => {
      if (value.length < 1 || value.length > 16) {
        callback(new Error('昵称长度必须在1~16字符之间'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      saveLoading: false,
      dashboardData: [
        { name: '系统User总数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '系统Node总数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Namespace数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Deploy数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Service数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Pod数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Spark数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Hadoop数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '拥有Linux数量', value: 0, icon: 'el-icon-success', color: '#2ec7c9' }
      ],
      editRules: {
        nickname: [{ required: true, trigger: 'blur', validator: validateNickname }]
      },
      activeName: 'second',
      form: { nickname: '' }
    }
  },
  created() {
    this.form = { nickname: this.name }
    getUserList(1).then(res => {
      this.dashboardData[0].value = res.total
    })
    getNodeList().then(res => {
      this.dashboardData[1].value = res.length
    })
    getNsList(this.u_id).then(res => {
      this.dashboardData[2].value = res.length
    })
    getDeployList(this.u_id, '').then(res => {
      this.dashboardData[3].value = res.length
    })
    getServiceList(this.u_id, '').then(res => {
      this.dashboardData[4].value = res.length
    })
    getPodList(this.u_id, '').then(res => {
      this.dashboardData[5].value = res.length
    })
    getSparkList(this.u_id).then(res => {
      this.dashboardData[6].value = res.length
    })
    getHadoopList(this.u_id).then(res => {
      this.dashboardData[7].value = res.length
    })
    getLinuxList(this.u_id, 1).then(res => {
      this.dashboardData[8].value = res.length
    })
    getLinuxList(this.u_id, 2).then(res => {
      this.dashboardData[8].value += res.length
    })
  },
  methods: {
    push2(index) {
      switch (index){
        case 0:
          this.$router.push({ name: 'User' });
          break;
        case 1:
          this.$router.push({ name: 'Node' });
          break
        case 2:
          this.$router.push({ name: 'Namespace' });
          break
        case 3:
          this.$router.push({ name: 'Deploy' });
          break
        case 4:
          this.$router.push({ name: 'Service' });
          break
        case 5:
          this.$router.push({ name: 'Pod' });
          break
        case 6:
          this.$router.push({ name: 'Spark' });
          break
        case 7:
          this.$router.push({ name: 'Hadoop' });
          break
        case 8:
          this.$router.push({ name: 'Linux' });
          break
      }
    },
    handleClick(tab, event) {
      if (tab.name === 'first') {
        // this.init()
      }
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            updateUser(this.u_id, this.form).then(() => {
              Message({
                message: '修改成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.$store.dispatch('user/getInfo').then(() => {})
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li{
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a{
      color: #317EF3;
    }
  }
}
.record{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card{
    width: 32%;
    margin-bottom: 20px;
  }
  .icon{
    font-size: 30px;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }
  .detail{
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .num{
      font-size: 30px;
      margin-bottom: 10px;
    }
    .txt{
      font-size: 14px;
      text-align: center;
      color: #999999;
    }
  }
}
</style>
