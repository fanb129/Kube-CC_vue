<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
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

      <el-table-column width="100" property="name" label="名称" />
      <el-table-column width="100" property="status" label="状态" />
      <el-table-column width="150" property="created_at" label="创建时间" />
      <el-table-column width="100" property="username" label="用户账号" />
      <el-table-column width="100" property="nickname" label="用户昵称" />
      <el-table-column width="100" property="u_id" label="UID" />
      <el-table-column width="150" property="expired_time" label="过期时间" />

      <el-table-column label="规格" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="700"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="120" property="cpu" label="cpu" />
              <el-table-column width="120" property="memory" label="内存" />
              <el-table-column width="120" property="storage" label="临时存储" />
              <el-table-column width="120" property="pvc" label="永久存储" />
              <el-table-column width="120" property="gpu" label="gpu" />
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button trigger="click" type="primary" style="padding: 15px" @command="handleCommand">
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
            size="mini"
            type="warning"
            @click="updateNs(scope.row)"
          >编辑</el-button>
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
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pagesize"
        :total="total"
        @current-change="changePageNum"
      />
    </div>
    <AddNamespace ref="AddNamespace" :visible.sync="openDialog" />
    <UpdateNamespace ref="UpdateNamespace" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getNsList, deleteNs } from '@/api/namespace'
import AddNamespace from '@/components/AddNamespace'
import UpdateNamespace from '@/components/AddNamespace/UpdateNamespace'
import UserSelector from '@/components/Selector/UserSelector'

export default {
  components: { AddNamespace, UserSelector, UpdateNamespace },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.getNsList()
  },
  data() {
    return {
      uid: '',
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
          u_id: 1,
          expired_time: '',

          cpu: '',
          memory: '',
          storage: '',
          pvc: '',
          gpu: ''

          /*      "used_cpu": "1",
          "used_memory": "500Mi",
          "used_storage": "1Gi",
          "used_pvc": "1Gi",
          "used_gpu": "0"*/
        }
      ]
    }
  },
  methods: {
    handleCommand(command) {
      if (command.command === 'deploy') {
        this.push2deploy(command.row)
      } else if (command.command === 'service') {
        this.push2service(command.row)
      } else if (command.command === 'pod') {
        this.push2pod(command.row)
      }
    },
    beforeHandleCommand(item, row) {
      return {
        'command': item,
        'row': row
      }
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.getNsList()
    },
    push2deploy: function(row) {
      this.$router.push({
        name: 'Deploy',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    push2service: function(row) {
      this.$router.push({
        name: 'Service',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    push2pod: function(row) {
      this.$router.push({
        name: 'Pod',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    changePageNum: function(val) {
      this.page = val
      // this.getUserList()
    },
    getNsList: function() {
      getNsList(this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.ns_list
        console.log(res)
      })
    },
    addNs: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNamespace.init()
      })
    },
    updateNs: function(row) {
      console.log(row['name'])
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateNamespace.init(row['name'], row['u_id'], row['expired_time'], row['cpu'], row['memory'])
      })
    },
    handleDelete: function(row) {
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
            }, 2000)
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
    }
  }
}
</script>
