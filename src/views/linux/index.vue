<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid"></UserSelector>
      <div style="display: inline; margin-left: 2%">
        <span>OS镜像：</span>
        <el-select v-model="os" filterable placeholder="请选择" @change="change">
          <el-option
            v-for="item,index in options"
            :key="index"
            :label="item.osName"
            :value="item.os">
          </el-option>
        </el-select>
      </div>
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addLinux">Add
        Linux
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="80" type="index">
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
      <el-table-column label="created_at" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Pod" type="expand" width="60">
        <template slot-scope="scope">
          <el-table :data="scope.row.pod_list">
            <el-table-column label="ID" width="60" type="index"></el-table-column>
            <el-table-column label="Name" width="150"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="Phase" width="105"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="NodeIp" width="130"><template slot-scope="scope"><span>{{ scope.row.node_ip }}</span></template></el-table-column>
            <el-table-column label="Ready" width="105"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].ready }}</span></template></el-table-column>
            <el-table-column label="Started" width="105"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].started }}</span></template></el-table-column>
            <el-table-column label="RestartCount" width="110"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].restartCount }}</span></template></el-table-column>
            <el-table-column label="操作">
              <el-button
                :disabled="(role <= 2
                  || scope.row.namespace==='default'
                  || scope.row.namespace==='kube-node-lease'
                  || scope.row.namespace==='kube-public'
                  || scope.row.namespace==='kube-system'
                  || scope.row.namespace==='ingress-nginx')
                  && u_id !== scope.row.u_id"
                size="mini" type="success" @click="pushTerminal(scope.row)"> 终端</el-button>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size='mini' type="primary" @click='push2deploy(scope.row)'>deploy</el-button>
          <el-button size="mini" type="primary" @click="push2service(scope.row)">service</el-button>
          <el-button
            :disabled="(role < 2
              || scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx')
              && u_id !== scope.row.u_id"
            size="mini" type="warning" @click="Resetpsd(scope.row)">编辑</el-button>
          <el-button
            :loading="loading"
            :disabled="(role < 2
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
    <AddLinux :visible.sync="openDialog" ref="AddLinux"/>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {getLinuxList, deleteLinux} from '@/api/linux'
import AddLinux from '@/components/AddLinux'
import UserSelector from "@/components/Selector/UserSelector";

export default {
  components: {AddLinux, UserSelector},
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    // this.os = '1'
    this.uid = this.u_id
    this.getLinuxList()
  },
  data() {
    return {
      os: '1',
      uid: '',
      timer: null,
      loading: false,
      openDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      options: [
        { os: '1', osName: 'Centos' },
        { os: '2', osName: 'Ubuntu' }
      ],
      tableData: [
        {
          name: '',
          status: '',
          created_at: '',
          username: '',
          nickname: '',
          image: '',
          u_id: '',
          pod_list: [
            {
              name: '',
              namespace: '',
              created_at: '',
              phase: '',
              node_ip: '',
              u_id: '',
              container_statuses: [
                {
                  name: '',
                  // state: '',
                  ready: '',
                  restartCount: '',
                  image: '',
                  started: ''
                }
              ]
            }
          ],
          deploy_list: [
            {
              name: '',
              namespace: '',
              created_at: '',
              replicas: '',
              updated_replicas: '',
              ready_replicas: '',
              available_replicas: '',
              u_id: ''
            }
          ],
          service_list: [
            {
              name: '',
              namespace: '',
              created_at: '',
              type: '',
              cluster_ip: '',
              u_id: '',
              ports: [
                {
                  name: '',
                  protocol: '',
                  port: '',
                  nodePort: '',
                  targetPort: ''
                }
              ]
            }
          ],
          ingress_list: []
        }
      ]
    }
  },
  methods: {
    change: function (){
      this.$forceUpdate()
      this.getLinuxList()
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
    changeUid: function(u_id){
      this.uid = u_id
      this.getLinuxList()
    },
    changePageNum: function (val) {
      this.page = val
    },
    getLinuxList: function () {
      getLinuxList(this.uid, this.os).then((res) => {
        this.total = res.length
        this.tableData = res.linux_list
        console.log(res)
      })
    },
    addLinux: function () {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddLinux.init();
      });
    },
    handleDelete: function (row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此linux', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLinux(row['name']).then((res) => {
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
              this.getLinuxList()
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
