<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <GroupSelector ref="GroupSelector" :default-uid="adid" style="margin-right: 50px" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" style="margin-right: 50px" @nsList="changeUid" />

      <div style="display: inline; margin-left: 2%">
        <span>OS镜像：</span>
        <el-select v-model="os" filterable placeholder="请选择" @change="change">
          <el-option
            v-for="item,index in options"
            :key="index"
            :label="item.osName"
            :value="item.os"
          />
        </el-select>
      </div>

      <!--      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addLinux">Add
        Linux
      </el-button>-->
    </div>

    <!--    1规格   -->
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.name }}</span></template></el-table-column>
      <el-table-column width="150" property="namespace" label="命名空间"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.namespace }}</span></template></el-table-column>
      <el-table-column width="180" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span style="margin-left: 1%">{{ scope.row.created_at }}</span></template></el-table-column>
      <el-table-column width="80" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
      <el-table-column width="80" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
      <el-table-column width="80" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
      <el-table-column width="80" property="pvc" label="永久存储"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>
      <el-table-column width="80" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.gpu }}</span></template></el-table-column>
      <el-table-column width="150" property="pvc_path" label="pvc路径"><template slot-scope="scope"><span>{{ scope.row.pvc_path }}</span></template></el-table-column>

      <!--      /* 2基本信息*/-->
      <el-table-column label="基本信息" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="725"
            trigger="click"
          >
            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
              <el-table-column width="80" property="replicas" label="拷贝数"><template slot-scope="scope"><span>{{ scope.row.replicas }}</span></template></el-table-column>
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
              <el-table-column width="150" property="targetPort" label="目的端口"><template slot-scope="scope"><span>{{ scope.row.targetPort }}</span></template></el-table-column>
              <el-table-column width="150" property="nodePort" label="网络节点端口"><template slot-scope="scope"><span>{{ scope.row.nodePort }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--       4状态   -->
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="500"
            trigger="click"
          >
            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
              <el-table-column width="120" property="updated_replicas" label="更新副本"><template slot-scope="scope"><span>{{ scope.row.updated_replicas }}</span></template></el-table-column>
              <el-table-column width="120" property="ready_replicas" label="就绪副本"><template slot-scope="scope"><span>{{ scope.row.ready_replicas }}</span></template></el-table-column>
              <el-table-column width="120" property="available_replicas" label="可用副本"><template slot-scope="scope"><span>{{ scope.row.available_replicas }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--   5deploy_list   -->
      <el-table-column label="deply表单" width="150">
        <template slot-scope="scope">
          <el-popover>
            <el-button slot="reference" size="mini" type="primary" style="margin-left: 16px;" @click="drawer = true">点我打开</el-button>
            <el-drawer
              title="deploy表单"
              :size="size"
              :visible.sync="drawer"
              :direction="direction"
            >
              <div>
                <el-table :data="scope.row.deploy_list">
                  <el-table-column label="序号" width="100" type="index" />
                  <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
                  <el-table-column width="120" property="namespace" label="命名空间"><template slot-scope="scope"><span>{{ scope.row.namespace }}</span></template></el-table-column>
                  <el-table-column width="200" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.created_at }}</span></template></el-table-column>
                  <el-table-column width="80" property="replicas" label="副本数"><template slot-scope="scope"><span>{{ scope.row.replicas }}</span></template></el-table-column>
                  <!--配置信息-->
                  <el-table-column width="200" property="image" label="映像"><template slot-scope="scope"><span>{{ scope.row.image }}</span></template></el-table-column>
                  <el-table-column width="100" property="ports" label="端口"><template slot-scope="scope"><span>{{ scope.row.ports }}</span></template></el-table-column>
                  <el-table-column width="80" property="cpu" label="处理器"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
                  <el-table-column width="80" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
                  <el-table-column width="80" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
                  <el-table-column width="80" property="pvc" label="永久存储"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>
                  <el-table-column width="80" property="gpu" label="显卡"><template slot-scope="scope"><span>{{ scope.row.gpu }}</span></template></el-table-column>
                  <el-table-column width="80" property="pvc_path" label="pvc路径"><template slot-scope="scope"><span>{{ scope.row.pvc_path }}</span></template></el-table-column>
                  <el-table-column width="200" property="volume" label="数据卷"><template slot-scope="scope"><span>{{ scope.row.volume }}</span></template></el-table-column>
                  <!--状态信息-->
                  <el-table-column width="80" property="updated_replicas" label="更新副本"><template slot-scope="scope"><span>{{ scope.row.updated_replicas }}</span></template></el-table-column>
                  <el-table-column width="80" property="ready_replicas" label="就绪副本"><template slot-scope="scope"><span>{{ scope.row.ready_replicas }}</span></template></el-table-column>
                  <el-table-column width="80" property="available_replicas" label="可用副本"><template slot-scope="scope"><span>{{ scope.row.available_replicas }}</span></template></el-table-column>

                  <!--   Pod_list   -->
                  <el-table-column label="Pod表单" type="expand" width="150">
                    <template slot-scope="scope">
                      <el-table :data="scope.row.pod_list">
                        <el-table-column label="序号" width="100" type="index" />
                        <el-table-column width="300" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
                        <el-table-column width="200" property="phase" label="阶段"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
                        <el-table-column width="200" property="host_ip" label="主机IP"><template slot-scope="scope"><span>{{ scope.row.host_ip }}</span></template></el-table-column>
                        <el-table-column width="200" property="pod_ip" label="Pod IP"><template slot-scope="scope"><span>{{ scope.row.pod_ip }}</span></template></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button :disabled="role <= 2 " size="mini" type="success" @click="pushTerminal(scope.row)"> 终端</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <!--   Pod_list_end  -->
                </el-table>
              </div>
            </el-drawer>
          </el-popover>
        </template>
      </el-table-column>

      <!--      操作    -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            style="margin-left: 10px"
            @click="updateLinux(scope.row)"
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
    <AddLinux ref="AddLinux" :visible.sync="openDialog" />
    <UpdateLinux ref="UpdateLinux" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getLinuxList, deleteLinux } from '@/api/app/linux'
import AddLinux from '@/components/AddLinux'
import UpdateLinux from '@/components/AddLinux/UpdateLinux'
import UserSelector from '@/components/Selector/UserSelector'
import GroupSelector from '@/components/Selector/GroupSelector.vue'

export default {
  components: { GroupSelector, AddLinux, UserSelector, UpdateLinux },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    // this.os = '1'
    this.uid = this.$route.query.u_id || this.u_id
    this.adid = this.u_id
    this.getLinuxList()
  },
  data() {
    return {
      /* 抽屉参数*/
      drawer: false,
      innerDrawer: false,
      direction: 'btt',
      size: '67%',

      os: '1',
      uid: '',
      gid: '',
      adid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      options: [
        { os: '1', osName: 'Centos' },
        { os: '2', osName: 'Ubuntu' }
      ],
      tableData: [
        {
          name: 'centos1',
          namespace: 'test1',
          replicas: 1,
          image: 'registry.cn-shanghai.aliyuncs.com/fanb/mycentos:7',
          ports: [
            {
              name: 'ssh',
              protocol: 'TCP',
              port: 22,
              targetPort: 22,
              nodePort: 31053
            }
          ],
          cpu: '1',
          memory: '500Mi',
          storage: '1Gi',
          pvc: '1Gi',
          gpu: '1',
          pvc_path: [
            '/data'
          ],
          volume: 'adhuhwlda-8ua8wwiajlwd-daw2r4',
          created_at: '2023-07-07 16:24:42',
          updated_replicas: 1,
          ready_replicas: 0,
          available_replicas: 0,

          deploy_list: [
            {
              name: 'l1',
              namespace: 'test1',
              created_at: '2023',
              replicas: 1,
              /* 配置*/
              image: 'kubeguide/linux:latest',
              ports: null,
              cpu: '1',
              memory: '1Gi',
              storage: '1Gi',
              pvc: '1Gi',
              gpu: '8Gi',
              pvc_path: ['/linux/index'],
              volume: '',
              /* 状态*/
              updated_replicas: '',
              ready_replicas: '',
              available_replicas: '',
              // u_id: ''
              pod_list: [
                {
                  name: 'centos1-dc5b585b9-6c4zl',
                  phase: 'Pending',
                  host_ip: '111',
                  pod_ip: '111'
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
    changeGid: function(g_id) {
      this.gid = g_id
      this.$refs.UserSelector.u_id = ''
      this.$refs.UserSelector.g_id = this.gid
      this.$refs.UserSelector.getUserList()
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.getLinuxList()
    },
    /* handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('退出到页面->')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 设置关闭时间
            setTimeout(() => {
              this.loading = false
            }, 100)
          }, 100)
        })
        .catch(_ => {})
    },*/
    handleCommand(command) {
      if (command.command === 'deploy') {
        this.push2deploy(command.row)
      } else if (command.command === 'service') {
        this.push2service(command.row)
      }
    },
    beforeHandleCommand(item, row) {
      return {
        'command': item,
        'row': row
      }
    },
    pushTerminal: function(row) {
      console.log(row['namespace'])
      console.log(row['name'])
      console.log(row['container_statuses'][0].name)
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container_statuses'][0].name
        }
      })
    },
    change: function() {
      this.$forceUpdate()
      this.getLinuxList()
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
    changePageNum: function(val) {
      this.page = val
    },
    getLinuxList: function() {
      getLinuxList(this.uid, this.os).then((res) => {
        this.total = res.length
        this.tableData = res.linux_list
        console.log(res)
      })
    },
    addLinux: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddLinux.init()
      })
    },
    updateLinux: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateLinux.init(
          row['name'],
          row['u_id'],
          row['expired_time'],
          row['cpu'],
          row['memory']
        )
      })
    },
    handleDelete: function(row) {
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
    }
  }
}
</script>
