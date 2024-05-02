<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <GroupSelector ref="GroupSelector" :default-uid="adid" style="margin-right: 50px" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" style="margin-right: 50px" @nsList="changeUid" />
      <NsSelectorNoNil ref="NsSelectorNoNil" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />

      <el-button style="margin-left: 100px" type="primary" @click="addDeploy">
        新增无状态应用
      </el-button>

    </div>
    <!--    1规格   -->
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="编号" width="80"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.$index + 1 }}</span></template></el-table-column>
      <el-table-column width="100" property="name" label="应用名称"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.name }}</span></template></el-table-column>
      <!--      <el-table-column width="120" property="namespace" label="命名空间"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.namespace }}</span></template></el-table-column>-->
      <el-table-column width="200" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span style="margin-left: 1%">{{ scope.row.created_at }}</span></template></el-table-column>
      <el-table-column width="80" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
      <el-table-column width="80" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
      <el-table-column width="80" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
      <el-table-column width="80" property="pvc" label="永久存储"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>
      <el-table-column width="80" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.gpu }}</span></template></el-table-column>
      <el-table-column width="90" property="pvc_path" label="开发环境数"><template slot-scope="scope"><span>{{ scope.row.replicas }}</span></template></el-table-column>

      <!--      /* 2基本信息*/-->
      <el-table-column label="基本信息" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="725"
            trigger="click"
          >
            <el-table :data="scope.row" style="width: 100%">
              <el-table-column width="200" property="replicas" label="挂载路径"><template slot-scope="scope"><span>{{ scope.row.pvc_path }}</span></template></el-table-column>
              <el-table-column width="200" property="image" label="映像文件"><template slot-scope="scope"><span>{{ scope.row.image }}</span></template></el-table-column>
              <el-table-column width="400" property="volume" label="数据卷"><template slot-scope="scope"><span>{{ scope.row.volume }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--   3Ports   -->
      <el-table-column label="端口" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="700"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
              <el-table-column width="100" property="protocol" label="协议"><template slot-scope="scope"><span>{{ scope.row.protocol }}</span></template></el-table-column>
              <el-table-column width="150" property="port" label="本地端口"><template slot-scope="scope"><span>{{ scope.row.port }}</span></template></el-table-column>
<!--              <el-table-column width="150" property="targetPort" label="目的端口"><template slot-scope="scope"><span>{{ scope.row.targetPort }}</span></template></el-table-column>-->
              <el-table-column width="150" property="nodePort" label="映射端口"><template slot-scope="scope"><span>{{ scope.row.nodePort }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--       4状态   -->
<!--      <el-table-column label="状态" width="120">不能为空-->
<!--        Port-->
<!--        22-->

<!--        <template slot-scope="scope">-->
<!--          <el-popover-->
<!--            placement="right"-->
<!--            width="500"-->
<!--            trigger="click"-->
<!--          >-->
<!--            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">-->
<!--              <el-table-column width="120" property="updated_replicas" label="更新副本"><template slot-scope="scope"><span>{{ scope.row.updated_replicas }}</span></template></el-table-column>-->
<!--              <el-table-column width="120" property="ready_replicas" label="就绪副本"><template slot-scope="scope"><span>{{ scope.row.ready_replicas }}</span></template></el-table-column>-->
<!--              <el-table-column width="120" property="available_replicas" label="可用副本"><template slot-scope="scope"><span>{{ scope.row.available_replicas }}</span></template></el-table-column>-->
<!--            </el-table>-->
<!--            <el-button slot="reference" size="mini">点击查看</el-button>-->
<!--          </el-popover></template>-->
<!--      </el-table-column>-->

      <!--   5Pod_list   -->
      <el-table-column label="Pod表单" type="expand" width="150">
        <template slot-scope="scope">
          <el-table :data="scope.row.pod_list">
            <el-table-column label="序号" width="100" type="index" />
            <el-table-column label="开发环境名称" width="200"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="状态" width="200"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="所在主机Ip" width="200"><template slot-scope="scope"><span>{{ scope.row.host_ip }}</span></template></el-table-column>
            <el-table-column label="自己Ip" width="200"><template slot-scope="scope"><span>{{ scope.row.pod_ip }}</span></template></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="pushTerminal(scope.row)"> 终端</el-button>
                <el-button size="mini" type="success" @click="podLog(scope.row)"> 日志</el-button>
                <el-button
                  :loading="loading"
                  size="mini"
                  type="danger"
                  style="margin-top: 2px"
                  @click="handlePodDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            style="margin-left: 10px"
            @click="editDeploy(scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loading"
            size="mini"
            type="danger"
            style="margin-top: 2px"
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
    <AddDeploy ref="AddDeploy" :visible.sync="addDialog" />
    <UpdateDeploy ref="UpdateDeploy" :visible.sync="updateDialog" />
    <PodLog ref="PodLog" :visible.sync="podLogDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteDeploy, getDeployList } from '@/api/app/deploy'
import {deletePod} from "@/api/pod";
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import UserSelector from '@/components/Selector/UserSelector'
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
import AddDeploy from '@/components/AddDeploy/index'
import UpdateDeploy from '@/components/AddDeploy/UpdateDeploy'
import PodLog from '@/components/PodLog/index'

export default {
  name: 'Deploy',
  components: { UpdateDeploy, NsSelectorNoNil, UserSelector, GroupSelector, AddDeploy, PodLog },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.adid = this.u_id
    // this.getDeployList()
  },
  data() {
    return {
      myuid: this.u_id,
      uid: '',
      gid: '',
      adid: '',
      ns: '',
      timer: null,
      loading: false,
      applyDialog: false,
      createDialog: false,
      addDialog: false,
      updateDialog: false,
      podLogDialog: false,
      page: 1,
      // total: 0,
      pagesize: 10,
      tableData: [
        {
          /* 1规格*/
          name: '',
          namespace: '',
          created_at: '',
          cpu: '',
          memory: '',
          storage: '',
          pvc: '',
          gpu: '',
          replicas: 0,

          /* 2基本信息*/
          pvc_path: [
            '/data'
          ],
          image: '',
          volume: '',

          /* 3端口*/
          ports: [
            {
              name: '',
              protocol: '',
              port: '',
              targetPort: '',
              nodePort: ''
            }
          ],

          /* 4状态*/
          updated_replicas: 0,
          ready_replicas: 0,
          available_replicas: 0,

          /* 5pod*/
          pod_list: [
            {
              name: '',
              namespace: '',
              phase: '',
              host_ip: '',
              pod_ip: '',
              container: ''
            }
          ]

        },
      ]
    }
  },
  methods: {
    changeGid: function(g_id) {
      this.gid = g_id
      this.$refs.UserSelector.uid = ''
      this.$refs.UserSelector.g_id = this.gid
      this.$refs.UserSelector.getAllUser()
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelectorNoNil.u_id = this.uid
      this.$refs.NsSelectorNoNil.getNsList()
      // this.getDeployList()
    },
    changeNs: function(ns) {
      if (ns !== '') {
        this.ns = ns
        this.getDeployList()
      }
    },
    changePageNum: function(val) {
      this.page = val
    },
    getDeployList: function() {
      getDeployList(this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.deploy_list
        console.log(res)
      })
    },
    addDeploy: function() {
      this.addDialog = true
      this.$nextTick(() => {
        this.myuid = this.u_id
        this.addDialog = true
        this.$refs.AddDeploy.init(this.myuid)
      })
    },
    editDeploy: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateDeploy.init(row['namespace'], row['name'])
        this.updateDialog = true
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此deploy及其所含pod', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeploy(row['namespace'], row['name']).then((res) => {
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
              this.getDeployList()
              // location.reload()
            }, 1000)
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
    handlePodDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认删除此pod', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePod(row['namespace'], row['name']).then((res) => {
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
              this.getDeployList()
              // location.reload()
            }, 1000)
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
    pushTerminal: function(row) {
      console.log(row['namespace'])
      console.log(row['name'])
      console.log(row['container'])
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container']
        }
      })
    },
    podLog: function(row) {
      this.podLogDialog = true
      this.$nextTick(() => {
        this.$refs.PodLog.init(row['namespace'], row['name'])
        this.podLogDialog = true
      })
    }
    /*    pushTerminal: function(row) {
      this.$router.push({
        name: 'Terminal',
        query: {
          // r: 'node/ssh',
          // user: 'root',
          // pwd: '1234567890',
          ip: row['ip'],
          port: '22'
        },
        params: {
          user: 'root',
          pwd: '1234567890'
          // ip: row['ip'],
          // port: '22'
        }
      })
    }*/
  }
}
</script>

<style scoped>

</style>
