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

      <el-table-column label="序号" width="100" type="index">
        <!--        <template slot-scope="scope">-->
        <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
        <!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column width="100" property="name" label="名称" />
      <el-table-column width="80" property="status" label="状态" />
      <el-table-column width="120" property="created_at" label="创建时间" />
      <el-table-column width="100" property="username" label="用户账号" />
      <el-table-column width="100" property="nickname" label="用户昵称" />
      <el-table-column width="80" property="u_id" label="UID" />
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

      <el-table-column label="deploy表单" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="750"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="80" property="name" label="名称" />
              <el-table-column width="100" property="namespace" label="命名空间" />
              <el-table-column width="120" property="created_at" label="创建于" />
              <el-table-column width="80" property="replicas" label="副本数" />
              <el-table-column width="80" property="updated_replicas" label="更新副本" />
              <el-table-column width="80" property="ready_replicas" label="就绪副本" />
              <el-table-column width="80" property="available_replicas" label="可用副本" />
              <el-table-column width="80" property="u_id" label="UID" />
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
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
          storage: '',
          pvc: '',
          gpu: '',

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
