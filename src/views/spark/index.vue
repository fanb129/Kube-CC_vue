<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addSpark">Add
        Spark
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">

      <el-table-column label="Spark ID" width="100" type="index" />
      <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
      <el-table-column width="100" property="status" label="状态"><template slot-scope="scope"><span>{{ scope.row.status }}</span></template></el-table-column>
      <el-table-column width="150" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time"><span>{{ scope.row.created_at }}</span></i></template></el-table-column>
      <el-table-column width="120" property="username" label="用户账号"><template slot-scope="scope"><span>{{ scope.row.username }}</span></template></el-table-column>
      <el-table-column width="120" property="nickname" label="用户昵称"><template slot-scope="scope"><span>{{ scope.row.nickname }}</span></template></el-table-column>
      <el-table-column width="100" property="u_id" label="UID"><template slot-scope="scope"><span>{{ scope.row.u_id }}</span></template></el-table-column>
      <el-table-column width="150" property="expired_time" label="过期时间"><template slot-scope="scope"><i class="el-icon-time"><span>{{ scope.row.expired_time }}</span></i></template></el-table-column>

      <el-table-column label="规格" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="700"
            trigger="click"
          >
            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
              <el-table-column width="120" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
              <el-table-column width="120" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
              <el-table-column width="120" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
              <el-table-column width="120" property="pvc" label="永久存储"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>
              <el-table-column width="120" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.gpu }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <el-table-column label="deploy表单" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="1000"
            trigger="click"
          >
            <el-table :data="scope.row.deploy_list">
              <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
              <el-table-column width="150" property="namespace" label="命名空间"><template slot-scope="scope"><span>{{ scope.row.namespace }}</span></template></el-table-column>
              <el-table-column width="150" property="created_at" label="创建于"><template slot-scope="scope"><i class="el-icon-time"><span>{{ scope.row.created_at }}</span></i></template></el-table-column>
              <el-table-column width="100" property="replicas" label="副本数"><template slot-scope="scope"><span>{{ scope.row.replicas }}</span></template></el-table-column>
              <el-table-column width="100" property="updated_replicas" label="更新副本"><template slot-scope="scope"><span>{{ scope.row.updated_replicas }}</span></template></el-table-column>
              <el-table-column width="100" property="ready_replicas" label="就绪副本"><template slot-scope="scope"><span>{{ scope.row.ready_replicas }}</span></template></el-table-column>
              <el-table-column width="100" property="available_replicas" label="可用副本"><template slot-scope="scope"><span>{{ scope.row.available_replicas }}</span></template></el-table-column>
              <el-table-column width="100" property="u_id" label="UID"><template slot-scope="scope"><span>{{ scope.row.u_id }}</span></template></el-table-column>
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
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            @click="updateSpark(scope.row)"
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
    <AddSpark ref="AddSpark" :visible.sync="openDialog" />
    <UpdateSpark ref="UpdateSpark" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getSparkList, deleteSpark } from '@/api/spark'
import AddSpark from '@/components/AddSpark'
import UserSelector from '@/components/Selector/UserSelector'
import UpdateSpark from '@/components/AddSpark/UpdateSpark'

export default {
  components: { AddSpark, UserSelector, UpdateSpark },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.getSparkList()
  },
  data() {
    return {
      uid: 'uid114514',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: 'spark1',
          status: '活跃',
          created_at: '2023-07-11',
          username: 'ABdoge',
          nickname: 'ABD',
          u_id: 'ABD114',
          expired_time: null,

          cpu: '1',
          memory: '2',
          storage: '3',
          pvc: '4',
          gpu: '5',

          deploy_list: [
            {
              name: 'spark_d1',
              namespace: 'test1',
              created_at: '2023-07-11',
              replicas: '2',
              updated_replicas: '2',
              ready_replicas: '2',
              available_replicas: '2',
              u_id: '222'
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
      this.getSparkList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getSparkList: function() {
      getSparkList(this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.spark_list
        console.log(res)
      })
    },
    addSpark: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddSpark.init()
      })
    },
    updateSpark: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateSpark.init(
          row['name'],
          row['u_id'],
          row['master_replicas'],
          row['worker_replicas'],
          row['expired_time'],
          row['cpu'],
          row['memory']
        )
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此spark集群', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSpark(row['name']).then((res) => {
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
              this.getSparkList()
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
