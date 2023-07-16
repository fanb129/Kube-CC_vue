<template>
  <div>
    <div style="position:relative;">
      <el-button style="position:relative;left: 56%;" :disabled="role <= 1" size='middle' type="warning" @click='showDialogC(role,u_id,username)'>创建组</el-button>
      <el-button style="position:relative;left: 56%;" :disabled="role <= 1" size='middle' type="warning" @click='showDialogE(u_id)'>编辑组</el-button>
    </div>
    <el-table :data='tableData' style='width: 100%' >
      <!-- <el-table :data='tableData' style='width: 100%'> -->
<!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label='序号' width='100' type="index">
<!--        <template slot-scope='scope'>-->
<!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
<!--          <span style='margin-left: 1%'>{{ scope.$index + 1 }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column label='组名' width='150'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label='管理员' width='100'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.adminname }}</span>
        </template>
      </el-table-column>

      <el-table-column label='描述' width='120'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label='创建时间' width='200'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.group_created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label='更新时间' width='200'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.group_updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label='操作'>
        <template slot-scope='scope'>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type="warning" @click='showDialogU(scope.row["groupid"])'>查看组</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type="warning" @click='showDialogA(scope.row)'> 添加用户</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type="warning" @click='showDialogR(scope.row)'> 移出用户</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type='danger' @click='handleDelete(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;bottom: 2%">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="1" :total="total" @current-change="changePageNum"></el-pagination>
    </div>
    <!--  创建组弹窗-->
    <el-dialog title='创建组' :data="adminuser" :visible.sync='statusDialogCVisible'>
      <el-form>
        <el-form-item label='管理员' :label-width='formLabelWidth'>
          <template>
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                v-for="item in adminuser"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label='组名' :label-width='formLabelWidth'>
          <el-input v-model="inputgn" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label='组描述' :label-width='formLabelWidth'>
          <el-input v-model="inputgd" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogCVisible = false'>取 消</el-button>
        <el-button type='primary' @click='CTGroup(value)'>确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑组弹窗-->
    <el-dialog title='编辑组' :data="admgroup" :visible.sync='statusDialogEVisible'>
      <el-form>
        <el-form-item label='组名' :label-width='formLabelWidth'>
          <template>
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                v-for="item in admgroup"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label='编辑组名' :label-width='formLabelWidth'>
          <el-input v-model="inputegn" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label='编辑描述' :label-width='formLabelWidth'>
          <el-input v-model="inputegd" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogEVisible = false'>取 消</el-button>
        <el-button type='primary' @click='EDGroup(value)'>确 定</el-button>
      </div>
    </el-dialog>
      <!--  查看组弹窗-->
    <el-dialog :data = 'tuser' title='查看组' :visible.sync='statusDialogUVisible'>
      <el-table :data = 'tuser' style='width: 100%' >
      <!-- <el-table :data='tableData' style='width: 100%'> -->
<!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label='ID' width='100' type="index">
<!--        <template slot-scope='scope'>-->
<!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
<!--          <span style='margin-left: 1%'>{{ scope.$index + 1 }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column label='用户名' width='150'>
        <template slot-scope='scoped'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scoped.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label='昵称' width='100'>
        <template slot-scope='scoped'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scoped.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label='权限' width='120'>
        <template slot-scope='scoped'>
          <!-- <i class='el-icon-time'></i> -->

          <el-tag v-if='scoped.row.role === 1'>普通用户</el-tag>
          <el-tag type='success' v-else-if='scoped.row.role === 2'>管理员</el-tag>
          <el-tag type='danger' v-else-if='scoped.row.role === 3'>超级管理员</el-tag>
        </template>
      </el-table-column>

      <el-table-column label='创建时间' width='200'>
        <template slot-scope='scoped'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scoped.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label='更新时间' width='200'>
        <template slot-scope='scoped'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scoped.row.updated_at }}</span>
        </template>
      </el-table-column>
    </el-table>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogUVisible = false'>返回</el-button>
      </div>
    </el-dialog>
      <!--向组内添加用户弹窗-->
      <el-dialog title='添加用户' :data = 'adduser' :visible.sync='statusDialogAVisible'>
      <template>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in adduser"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogAVisible = false'>取 消</el-button>
        <el-button type='primary' @click='AddUser(value)'>确 定</el-button>
      </div>
    </el-dialog>
      <!--移出用户弹窗-->
    <el-dialog title='移出用户' :data = 'rmuser' :visible.sync='statusDialogRVisible'>
      <template>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in rmuser"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogRVisible = false'>取 消</el-button>
        <el-button type='primary' @click='RemoveUser(value)'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { editUser, getUserList, resetPass, getAllUser } from '@/api/user'
import { deleteGroup, addUser, removeUser, getGroupList, viewGroupUser, creatGroup, updateGroup } from '@/api/group'
import { mapGetters } from 'vuex'
var tg_id

export default {
  computed: {
    ...mapGetters([
      'role',
      'u_id',
      'username'
    ])
  },
  created() {
    this.getGroupList()
  },
  data() {
    return {
      value: '',
      page: 1,
      total: 0,
      formLabelWidth: '10%',
      statusDialogUVisible: false,
      statusDialogAVisible: false,
      statusDialogRVisible: false,
      statusDialogCVisible: false,
      statusDialogEVisible: false,
      //rolelist: ['普通用户', '管理员', '超级管理员'],
      inputgn: '',
      inputgd: '',
      inputegn: '',
      inputegd: '',
      tableData: [
        {
          groupid: '',
          name: '',
          adminid: '',
          adminname: '',
          description: '',
          group_created_at: '',
          group_updated_at: '',
        }
      ],
      tuser: [
        {
          id: '',
          username: '',
          nickname: '',
          role: '',
          created_at: '',
          updated_at: '',
          avatar: '',
          gid: ''
        }
      ],
      tgroup: [],
      rmuser: [],
      adminuser: [],
      alluser: [],
      alladmin: [],
      adduser: [],
      oduser: [],
      allgroup:[],
      adgroup:[],
      admgroup:[],
      // creatgroup: [
      //   {
      //     name: '',
      //     adminid: '',
      //     description: ''
      //   }
      // ],
    }
  },
  methods: {
    //改变页码
    changePageNum: function(val) {
      this.page = val
      this.getGroupList()
    },
    change() {
      this.$forceUpdate()
    },
    //创建组弹出框
    showDialogC(role,u_id,username){
      this.value = ''
      this.alluser = []
      this.alladmin = []
      this.adminuser = []
      if(role == 3){
        getAllUser().then((res) => {
        if (res.code == 1) {
          // this.alluser = []
          // this.alladmin = []
          this.alluser = res.all_user_list
          for (let i=0;i<this.alluser.length;i++) {
            if (this.alluser[i].role >= 2){
              this.alladmin.push(this.alluser[i])
            }
          }
          // this.adminuser=[]
          this.adminuser.push(this.alladmin.map(function(item,index){
            var tmp = {
              "value" : item.id,
              "label" : item.username,
            }
            return tmp
          }))
          this.adminuser = this.adminuser[0]
          //console.log(this.rmuser)
          // this.$message({
          //   type: 'success',
          //   message: res.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
       })
      }else if (role == 2){
        this.adminuser = [{
          "value" : u_id,
          "label" : username
        }]
      }
      this.statusDialogCVisible=true
    },
    //创建组具体实现
    CTGroup(value){
      //this.statusDialogCVisible=true
      this.$confirm('确认创建该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      creatGroup(value, {name: this.inputgn,description: this.inputgd}).then((res) => {
        if (res.code == 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          location.reload()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      .catch(() => {
          this.$message({
            type: 'info',
            message: "取消创建组"
          })
        })
      this.statusDialogCVisible = false
      })
    },
    //编辑组弹出框
    showDialogE(u_id){
      this.value = ''
      this.allgroup = []
      this.adgroup = []
      this.admgroup = []
      getGroupList(this.page).then((res) => {
        if (res.code == 1) {
          // this.allgroup = []
          this.allgroup = res.group_list
          for (let i=0;i<this.allgroup.length;i++) {
            if (this.allgroup[i].adminid == u_id){
              this.adgroup.push(this.allgroup[i])
            }
          }
          this.admgroup.push(this.adgroup.map(function(item,index){
            var tmp = {
              "value" : item.groupid,
              "label" : item.name,
            }
            return tmp
          }))
          this.admgroup = this.admgroup[0]
          //console.log(this.rmuser)
          // this.$message({
          //   type: 'success',
          //   message: res.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.statusDialogEVisible=true
    },
    //编辑组具体实现
    EDGroup(value){
      //this.statusDialogCVisible=true
      this.$confirm('确认更改该组信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      updateGroup(value, {name: this.inputegn,description: this.inputegd}).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          location.reload()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      .catch(() => {
          this.$message({
            type: 'info',
            message: "取消创建组"
          })
        })
      this.statusDialogEVisible = false
      })
    },
    //查看组用户弹出框
    showDialogU(id) {
      //this.statusDialogUVisible = true
      this.tuser = []
      tg_id = id
      viewGroupUser(tg_id).then((res) => {
        if (res.code == 1) {
          //this.tuser = []
          this.tuser = res.groupuser_list
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
       .catch(() => {
         this.$message({
           type:'info',
           message: '退出查看'
         })
       })
       //this.statusDialogUVisible = false
       //location.reload()
       this.statusDialogUVisible = true
    },
    //添加用户弹出框
    showDialogA(row) {
      this.value = ''
      this.alluser = []
      this.oduser = []
      this.adduser = []
      tg_id = row.groupid
      getAllUser().then((res) => {
        if (res.code == 1) {
          // this.alluser = []
          // this.oduser = []
          this.alluser = res.all_user_list
          for (let i=0;i<this.alluser.length;i++) {
            if (this.alluser[i].role == 1 && this.alluser[i].gid == 0){
              this.oduser.push(this.alluser[i])
            }
          }
          // this.adduser=[]
          this.adduser.push(this.oduser.map(function(item,index){
            var tmp = {
              "value" : item.id,
              "label" : item.username,
            }
            return tmp
          }))
          this.adduser = this.adduser[0]
          //console.log(this.rmuser)
          // this.$message({
          //   type: 'success',
          //   message: res.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.statusDialogAVisible=true
    },
    //添加用户具体实现
    AddUser(value){
      //this.statusDialogCVisible=true
      this.$confirm('确认添加该用户到组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      addUser( value, {groupid: tg_id}).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          location.reload()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      .catch(() => {
          this.$message({
            type: 'info',
            message: "取消创建组"
          })
        })
      this.statusDialogAVisible = false
      })
    },
    //移出用户弹出框
    showDialogR(row) {
      this.value = ''
      this.tuser = []
      this.rmuser=[]
      tg_id = row.groupid
      viewGroupUser(tg_id).then((res) => {
        if (res.code == 1) {
          //this.tuser = []
          this.tuser = res.groupuser_list
          //this.rmuser=[]
          this.rmuser.push(this.tuser.map(function(item,index){
            var tmp = {
              "value" : item.id,
              "label" : item.username,
            }
            return tmp
          }))
          this.rmuser = this.rmuser[0]
          //console.log(this.rmuser)
          // this.$message({
          //   type: 'success',
          //   message: res.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.statusDialogRVisible = true
    },
    //移出用户具体实现
    RemoveUser(value) {
      this.$confirm('确认移出该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      removeUser( value ).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          location.reload()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消移出用户'
          })
        })
      this.statusDialogRVisible = false
      })
    },
    //删除组
    handleDelete(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row['groupid']).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            location.reload()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //查看组用户
    viewGroupUser: function() {
      viewGroupUser(tg_id).then((res) => {
        // this.page = res.page
        // this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tuser = res.groupuser_list
        // console.log(this.total)
      })
    },
    //获取组列表
    getGroupList: function() {
      getGroupList(this.page).then((res) => {
        this.page = res.page
        this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tableData = []
        this.tableData = res.group_list
        // console.log(this.total)
      })
    },
    //获取用户列表
    getUserList: function() {
      getUserList(this.page).then((res) => {
        this.alluser = res.user_list
        // console.log(this.total)
      })
    }
  }
}
</script>
