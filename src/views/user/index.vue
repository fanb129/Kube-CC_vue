<template>
  <div>
    <div style="position:relative;">
      <span style="position:relative;left: 46%;" :disabled="role <= 1">当前用户管理的组 :  </span>
        <el-select style="position:relative;left: 46%;" :disabled="role <= 1" v-model="valueg" placeholder="请选择" @change="changtuser(valueg)">
          <el-option
            v-for="item in tagroup"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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

      <el-table-column label='用户名' width='150'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label='昵称' width='100'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label='权限' width='120'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->

          <el-tag v-if='scope.row.role === 1'>普通用户</el-tag>
          <el-tag type='success' v-else-if='scope.row.role === 2'>管理员</el-tag>
          <el-tag type='danger' v-else-if='scope.row.role === 3'>超级管理员</el-tag>
        </template>
      </el-table-column>

      <el-table-column label='创建时间' width='200'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label='更新时间' width='200'>
        <template slot-scope='scope'>
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label='操作'>
        <template slot-scope='scope'>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size='mini' type="warning" @click='Resetpsd(scope.row)'>重置密码</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size='mini' type="warning" @click='showDialog(scope.row["id"])'> 权限修改</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size='mini' type="warning" @click='showDialogP(scope.row["id"])'> 配额修改</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size='mini' type='danger' @click='handleDelete(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;bottom: 2%">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="1" :total="total" @current-change="changePageNum"></el-pagination>
    </div>
      <!--  权限修改弹窗-->
    <el-dialog title='权限修改' :visible.sync='statusDialogVisible'>
      <el-form>
        <el-form-item label='权限' :label-width='formLabelWidth'>
          <el-select v-model='value' placeholder='请选择' @change='change()'>
            <el-option v-if="role > 2" label='超级管理员' value="3"></el-option>
            <el-option v-if="role > 1" label='管理员' value="2"></el-option>
            <el-option label='普通用户' value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogVisible = false'>取 消</el-button>
        <el-button type='primary' @click='Resetlev(value)'>确 定</el-button>
      </div>
    </el-dialog>
      <!--  配额修改弹窗-->
    <el-dialog title='配额修改' :visible.sync='statusDialogPVisible'>
      <el-form>
        <el-form-item label='CPU' :label-width='formLabelWidth'>
          <el-input v-model="inputcpu" placeholder="示例:5"></el-input>
        </el-form-item>
        <el-form-item label='内存' :label-width='formLabelWidth'>
          <el-input v-model="inputmemory" placeholder="示例:10Gi"></el-input>
        </el-form-item>
        <el-form-item label='存储' :label-width='formLabelWidth'>
          <el-input v-model="inputstorage" placeholder="示例:20Gi"></el-input>
        </el-form-item>
        <el-form-item label='持久化存储' :label-width='formLabelWidth'>
          <el-input v-model="inputpvcstorage" placeholder="示例:20Gi"></el-input>
        </el-form-item>
        <el-form-item label='Gpu' :label-width='formLabelWidth'>
          <el-input v-model="inputgpu" placeholder="示例:5"></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='statusDialogPVisible = false'>取 消</el-button>
        <el-button type='primary' @click='Allocation()'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { viewGroupByAd, viewGroupUser } from '@/api/group'
import { allocationUser, deleteUser, editUser, getUserList, resetPass } from '@/api/user'
import { mapGetters } from 'vuex'
var new_id
var tu_id

export default {
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    //this.getUserList()
    this.viewGroupByAd()
    if(this.role == 3){
      this.valueg=0
      this.getUserList()
    }
  },
  data() {
    return {
      value: '',
      valueg: '',
      page: 1,
      total: 0,
      formLabelWidth: '10%',
      statusDialogVisible: false,
      statusDialogPVisible: false,
      inputcpu: '',
      inputmemory: '',
      inputstorage: '',
      inputpvcstorage: '',
      inputgpu: '',
      rolelist: ['普通用户', '管理员', '超级管理员'],
      tableData: [
        // {
        //   id: '',
        //   username: '',
        //   nickname: '',
        //   role: '',
        //   created_at: '',
        //   updated_at: '',
        //   avatar: ''
        // }
      ],
      tData:[],
      allocation: [
        {
          cpu: '',
          memory: '',
          storage: '',
          pvcstorage: '',
          gpu: ''
        }
      ],
      tagroup: [
      ],
      tagroupuser: [
      ],
      tt: [
      ],
      tagid: [
      ]
    }
  },
  methods: {
    changePageNum: function(val) {
      this.page = val
      this.getUserList()
    },
    Resetpsd(row) {
      this.$prompt('请输入密码', {
        formtype: 1,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        resetPass(row['id'], { password: value }).then((res) => {
          if (res.code === 1) {
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
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
        console.log(this.tagid)
    },
    change() {
      this.$forceUpdate()
    },
    showDialog(id) {
      this.statusDialogVisible = true
      new_id = id
    },
    Resetlev(value) {
      // Terminal.log('2222222222222222')
      editUser(new_id, { role: parseInt(value) }).then((res) => {
        if (res.code === 1) {
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
            type: 'info',
            message: '取消输入'
          })
        })
      this.statusDialogVisible = false
      location.reload()
    },
    showDialogP(id){
      this.allocation[0].cpu = ''
      this.allocation[0].memory = ''
      this.allocation[0].storage = ''
      this.allocation[0].pvcstorage = ''
      this.allocation[0].gpu = ''
      this.inputcpu = ''
      this.inputmemory = ''
      this.inputstorage = ''
      this.inputpvcstorage = ''
      this.inputgpu = ''
      this.statusDialogPVisible = true
      tu_id = id
    },
    Allocation() {
      this.allocation[0].cpu = this.inputcpu
      this.allocation[0].memory = this.inputmemory
      this.allocation[0].storage = this.inputstorage
      this.allocation[0].pvcstorage = this.inputpvcstorage
      this.allocation[0].gpu = this.inputgpu
      this.$confirm('确认更改此用户资源配额?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        allocationUser(tu_id,this.allocation[0]).then((res) => {
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
          message: '已取消资源分配'
        })
      })
    },
    handleDelete(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row['id']).then((res) => {
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
    changtuser(valueg) {
      this.tableData=[]
      if (valueg == 0) {
        this.getUserList()
      }
      // else if(valueg == 0){}
      else {
        //this.tableData=[]
        viewGroupUser(valueg).then((res) => {
          this.tableData = res.groupuser_list
        })
      }
    },
    getUserList: function() {
      getUserList(this.page).then((res) => {
        this.page = res.page
        this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tData = res.user_list
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==3){
            this.tableData.push(this.tData[i])
          }
        }
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==2){
            this.tableData.push(this.tData[i])
          }
        }
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==1){
            this.tableData.push(this.tData[i])
          }
        }
        //this.tableData.sort(function(a,b){return a.role > b.role})
        // console.log(this.total)
      })
    },
    viewGroupByAd: function() {
      viewGroupByAd(this.u_id).then((res) => {
        //this.tagroup = res.group_list
        this.tagroup=[]
        // this.tt=[]
        // this.tt = res.group_list
        this.tagroup.push(res.group_list.map(function(item,index){
            var tmp = {
              "value" : item.groupid,
              "label" : item.name,
            }
            return tmp
          }))
          this.tagroup = this.tagroup[0]
          // this.tagroup.push({
          //   "value" : 0,
          //   "label" : '请选择'
          // })
          if(this.role == 3){
            this.tagroup.push({
            "value" : 0,
            "label" : '所有用户'
          })
          }
      })
      // this.tagid=['0']
      // for(let i=0;i<this.tagroup.length;i++){
      //   if(!this.tagid.includes(this.tagroup[i].value)){
      //     this.tagid.push(this.tagroup[i].value)
      //   }
      // }
      //console.log(this.tagroup)
    }
  }
}
</script>
