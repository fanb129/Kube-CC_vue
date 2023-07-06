<template>
  <div>
    <div style="position:relative;">
      <el-button style="position:relative;left: 56%;" :disabled="role <= 1" size='middle' type="warning" @click='showDialogC()'>创建组</el-button>
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

      <el-table-column label='管理员ID' width='100'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.adminid }}</span>
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
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type="warning" @click='showDialogT(scope.row)'> 更改管理员</el-button>
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
      <!--  更改管理员弹窗-->
    <el-dialog title='更改管理员' :data = 'transuser' :visible.sync='statusDialogTVisible'>
      <template>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in transuser"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogTVisible = false'>取 消</el-button>
        <el-button type='primary' @click='TransAd(value)'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { editUser, getUserList, resetPass } from '@/api/user'
import { deleteGroup, remove, transAdmin, getGroupList, viewGroupUser,creatGroup } from '@/api/group'
import { mapGetters } from 'vuex'
var tg_id
var ta_id

export default {
  computed: {
    ...mapGetters([
      'role',
      'u_id'
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
      statusDialogTVisible: false,
      statusDialogCVisible: false,
      //rolelist: ['普通用户', '管理员', '超级管理员'],
      inputgn: '',
      inputgd: '',
      tableData: [
        {
          groupid: '',
          name: '',
          adminid: '',
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
      tgroup: [
      ],
      transuser: [
      ],
      adminuser: [
      ],
      alluser: [
      ],
      alladmin: [
      ]
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
    showDialogC(){
      getUserList(this.page).then((res) => {
        if (res.code == 1) {
          this.alluser = []
          this.alladmin = []
          this.alluser = res.user_list
          for (let i=0;i<this.alluser.length;i++) {
            if (this.alluser[i].role >= 2){
              this.alladmin.push(this.alluser[i])
            }
          }
          this.adminuser=[]
          this.adminuser.push(this.alladmin.map(function(item,index){
            var tmp = {
              "value" : item.id,
              "label" : item.username,
            }
            return tmp
          }))
          this.adminuser = this.adminuser[0]
          //console.log(this.transuser)
          // this.$message({
          //   type: 'success',
          //   message: res.msg
          // })
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
      })
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
          // this.$message({
          //   type: 'info',
          //   message: "取消创建组"
          // })
        })
      this.statusDialogCVisible = false
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
       .catch(() => {
        //  this.$message({
        //    type:'info',
        //    message: '退出查看'
        //  })
       })
       //this.statusDialogUVisible = false
       //location.reload()
       this.statusDialogUVisible = true
    },
    //转移管理员弹出框
    showDialogT(row) {
      this.tuser = []
      this.transuser=[]
      tg_id = row.groupid
      ta_id = row.adminid
      viewGroupUser(tg_id).then((res) => {
        if (res.code == 1) {
          //this.tuser = []
          this.tuser = res.groupuser_list
          //this.transuser=[]
          this.transuser.push(this.tuser.map(function(item,index){
            var tmp = {
              "value" : item.id,
              "label" : item.username,
            }
            return tmp
          }))
          this.transuser = this.transuser[0]
          //console.log(this.transuser)
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
      this.statusDialogTVisible = true
    },
    //转移管理员具体实现
    TransAd(value) {
      this.$confirm('确认更改组管理员为该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      transAdmin(tg_id, { oldadminid: ta_id, newadminid: value }).then((res) => {
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
            message: '取消更改管理员'
          })
        })
      this.statusDialogVisible = false
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
