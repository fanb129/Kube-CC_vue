<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <GroupSelector :default-uid="adid" @nsList="changeGid" ref="GroupSelector"></GroupSelector>
      <UserSelector :default-gid="gid" :default-uid="uid" @nsList="changeUid" ref="UserSelector"></UserSelector>
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addNs">Add
        Namespace
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="50" type="index">
<!--        <template slot-scope="scope">-->
<!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
<!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column label="Name" width="250">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="created_at" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="expired_at" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.expired_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="cpu" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>

      <el-table-column label="memory" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span>
        </template>
      </el-table-column>

      <el-table-column label="username" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="nickname" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button trigger="click" @command="handleCommand" type="primary" style="padding: 15px">
            更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeHandleCommand('pod',scope.row)">pod</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand('deploy',scope.row)">deploy</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand('service',scope.row)">service</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
<!--          <el-button size="mini" type="primary" @click="push2pod(scope.row)">pod</el-button>-->
<!--          <el-button size='mini' type="primary" @click='push2deploy(scope.row)'>deploy</el-button>-->
<!--          <el-button size="mini" type="primary" @click="push2service(scope.row)">service</el-button>-->
          <el-button
            :disabled="scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx'
              || role < 2"
            size="mini" type="warning" @click="updateNs(scope.row)">编辑</el-button>
          <el-button
            :loading="loading"
            :disabled="scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;bottom: 2%">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pagesize" :total="total"
                     @current-change="changePageNum"/>
    </div>
    <AddNamespace :visible.sync="openDialog" ref="AddNamespace"/>
    <UpdateNamespace :visible.sync="updateDialog" ref="UpdateNamespace"/>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {getNsList, deleteNs} from '@/api/namespace'
import { viewGroupByAd } from '@/api/group'
import { getUserList } from '@/api/user'
import AddNamespace from '@/components/AddNamespace'
import UpdateNamespace from '@/components/AddNamespace/UpdateNamespace'
import UserSelector from "@/components/Selector/UserSelector";
import GroupSelector from "@/components/Selector/GroupSelector"

export default {
  components: {AddNamespace, UserSelector, UpdateNamespace, GroupSelector},
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.adid = this.u_id
    this.getNsList()
  },
  data() {
    return {
      uid: '',
      adid: '',
      gid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: '',
          status: '',
          created_at: '',
          username: '',
          nickname: '',
          u_id: '',
          cpu: '',
          memory: '',
          used_cpu: '',
          used_memory: '',
          expired_time: ''
        }
      ],
      tempData:[

      ],
      tData:[

      ],
      tagroup:[

      ]
    }
  },
  methods: {
    handleCommand(command) {
      if (command.command === 'deploy') {
        this.push2deploy(command.row)
      } else if (command.command === 'service') {
        this.push2service(command.row)
      } else if(command.command === 'pod'){
        this.push2pod(command.row)
      }
    },
    beforeHandleCommand(item,row){
      return {
        'command': item,
        'row': row
      }
    },
    changeUid: function(u_id){
      this.uid = u_id
      this.getNsList()
    },
    changeGid: function(g_id){
      this.gid = g_id
      this.$refs.UserSelector.g_id = this.gid
      this.$refs.UserSelector.getUserList()
    },
    push2deploy: function (row){
      this.$router.push({
        name: 'Deploy',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    push2service: function (row){
      this.$router.push({
        name: 'Service',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    push2pod: function (row){
      this.$router.push({
        name: 'Pod',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    changePageNum: function (val) {
      this.page = val
      // this.getUserList()
    },
    getNsList: function () {
      getNsList(this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.ns_list
        console.log(res)
      })
    },
    addNs: function () {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNamespace.init();
      });
    },
    updateNs: function (row){
      console.log(row['name'])
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateNamespace.init(row['name'],row['u_id'],row['expired_time'],row['cpu'],row['memory'])
      })
    },
    handleDelete: function (row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此namespace及其所含包含资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNs(row['name']).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            // location.reload()
            this.loading = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.loading = false
              this.getNsList()
              // location.reload()
            },2000)
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
    viewGroupByAd: function() {
      viewGroupByAd(this.u_id).then((res) => {
        //this.tagroup = res.group_list
        this.tagroup=[]
        //this.tt=[]
        //this.tt = res.group_list
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
    },
    getUserList: function() {
      getUserList(this.page).then((res) => {
        //this.page = res.page
        //this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tData = res.user_list
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==3){
            this.tempData.push(this.tData[i])
          }
        }
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==2){
            this.tempData.push(this.tData[i])
          }
        }
        for(let i=0;i<this.tData.length;i++){
          if(this.tData[i].role==1){
            this.tempData.push(this.tData[i])
          }
        }
        //this.tableData.sort(function(a,b){return a.role > b.role})
        // console.log(this.total)
      })
    }
  }
}
</script>
