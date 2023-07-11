<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
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
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addLinux">Add
        Linux
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">

      <el-table-column label="序号" width="100" type="index" />
      <el-table-column width="100" property="name" label="名称">
        <template slot-scope="scope">
          <span style="margin-left: 1%">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" property="namespace" label="命名空间">
        <template slot-scope="scope">
          <span style="margin-left: 1%">{{ scope.row.namespace }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" property="created_at" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 1%">{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <!--      /* 1基本信息*/-->
      <el-table-column label="基本信息" width="150">
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

      <!--   2Ports   -->
      <el-table-column label="端口" width="150">
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

      <!--    3规格   -->

      <el-table-column label="规格" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="850"
            trigger="click"
          >
            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
              <el-table-column width="120" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
              <el-table-column width="120" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
              <el-table-column width="120" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
              <el-table-column width="120" property="pvc" label="永久存储"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>
              <el-table-column width="120" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.gpu }}</span></template></el-table-column>
              <el-table-column width="200" property="pvc_path" label="pvc路径"><template slot-scope="scope"><span>{{ scope.row.pvc_path }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--       4状态   -->
      <el-table-column label="状态" width="150">
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

      <!--   5Pod_list   -->
      <el-table-column label="Pod表单" type="expand" width="150">
        <template slot-scope="scope">
          <el-table :data="scope.row.pod_list">
            <el-table-column label="名称" width="150"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="阶段" width="150"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="主机Ip" width="150"><template slot-scope="scope"><span>{{ scope.row.host_ip }}</span></template></el-table-column>
            <el-table-column label="节点Ip" width="150"><template slot-scope="scope"><span>{{ scope.row.node_ip }}</span></template></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button trigger="click" type="primary" style="padding: 15px" @command="handleCommand">
            更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeHandleCommand('deploy',scope.row)">deploy</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand('service',scope.row)">service</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--          <el-button size='mini' type="primary" @click='push2deploy(scope.row)'>deploy</el-button>-->
          <!--          <el-button size="mini" type="primary" @click="push2service(scope.row)">service</el-button>-->
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            @click="updateLinux(scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loading"
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
    <AddLinux ref="AddLinux" :visible.sync="openDialog" />
    <UpdateLinux ref="UpdateLinux" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getLinuxList, deleteLinux } from '@/api/linux'
import AddLinux from '@/components/AddLinux'
import UpdateLinux from '@/components/AddLinux/UpdateLinux'
import UserSelector from '@/components/Selector/UserSelector'

export default {
  components: { AddLinux, UserSelector, UpdateLinux },
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
          pod_list: [
            {
              name: 'centos1-dc5b585b9-6c4zl',
              phase: 'Pending',
              host_ip: '111',
              pod_ip: '111'
            }
          ],

          ingress_list: []
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
    changeUid: function(u_id) {
      this.uid = u_id
      this.getLinuxList()
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
