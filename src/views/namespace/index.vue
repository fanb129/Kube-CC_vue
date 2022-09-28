<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid"></UserSelector>
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addNs">Add
        Namespace
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="100" type="index">
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

      <el-table-column label="created_at" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="username" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="nickname" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="push2pod(scope.row)">pod</el-button>
          <el-button size='mini' type="primary" @click='push2deploy(scope.row)'>deploy</el-button>
          <el-button size="mini" type="primary" @click="push2service(scope.row)">service</el-button>
          <el-button
            :disabled="(role <= 2
              || scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx')
              && u_id !== scope.row.u_id"
            size="mini" type="warning" @click="Resetpsd(scope.row)">编辑</el-button>
          <el-button
            :loading="loading"
            :disabled="(role <= 2
              || scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx')
              && u_id !== scope.row.u_id"
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
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {getNsList, deleteNs} from '@/api/namespace'
import AddNamespace from '@/components/AddNamespace'
import UserSelector from "@/components/Selector/UserSelector";

export default {
  components: {AddNamespace, UserSelector},
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
          u_id: ''
        }
      ]
    }
  },
  methods: {
    changeUid: function(u_id){
      this.uid = u_id
      this.getNsList()
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
            },1000)
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
