<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addHadoop">Add
        Hadoop
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="hadoop ID" width="100" type="index">
        <!--        <template slot-scope="scope">-->
        <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
        <!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column label="名称" width="250">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效于" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.expired_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理器规格" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Pod集" type="expand" width="80">
        <template slot-scope="scope">
          <el-table :data="scope.row.pod_list">
            <el-table-column label="ID" width="60" type="index" />
            <el-table-column label="名称" width="150"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="阶段" width="105"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="节点Ip" width="130"><template slot-scope="scope"><span>{{ scope.row.node_ip }}</span></template></el-table-column>
            <el-table-column label="就绪" width="105"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].ready }}</span></template></el-table-column>
            <el-table-column label="已开始" width="105"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].started }}</span></template></el-table-column>
            <el-table-column label="重启计数" width="110"><template slot-scope="scope"><span>{{ scope.row.container_statuses[0].restartCount }}</span></template></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="pushTerminal(scope.row)"
                > 终端</el-button>
              </template>
            </el-table-column>
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
            @click="updateHadoop(scope.row)"
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
    <AddHadoop ref="AddHadoop" :visible.sync="openDialog" />
    <UpdateHadoop ref="UpdateHadoop" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getHadoopList, deleteHadoop } from '@/api/hadoop'
import AddHadoop from '@/components/AddHadoop'
import UpdateHadoop from '@/components/AddHadoop/UpdateHadoop'
import UserSelector from '@/components/Selector/UserSelector'

export default {
  components: { AddHadoop, UserSelector, UpdateHadoop },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.getHadoopList()
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
          u_id: '',
          cpu: '',
          memory: '',
          used_cpu: '',
          used_memory: '',
          expired_time: '',
          pod_list: [
            {
              name: '',
              namespace: '',
              created_at: '',
              phase: '',
              node_ip: '',
              u_id: '',
              hdfs_master_replicas: '',
              datanode_replicas: '',
              yarn_master_replicas: '',
              yarn_node_replicas: '',
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
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container_statuses'][0].name
        }
      })
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
      this.getHadoopList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getHadoopList: function() {
      getHadoopList(this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.hadoop_list
        console.log(res)
      })
    },
    addHadoop: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddHadoop.init()
      })
    },
    updateHadoop: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateHadoop.init(
          row['name'],
          row['u_id'],
          row['hdfs_master_replicas'],
          row['datanode_replicas'],
          row['yarn_master_replicas'],
          row['yarn_node_replicas'],
          row['expired_time'],
          row['cpu'],
          row['memory']
        )
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此hadoop集群', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteHadoop(row['name']).then((res) => {
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
              this.getHadoopList()
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
