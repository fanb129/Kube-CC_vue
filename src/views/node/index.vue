<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 1vh; margin-right: 1vh">
      <el-tab-pane name="first" label="资源面板">
        <div>
          <node-column></node-column>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second" label="控制面板">
        <div>
          <div style="margin-left: 10%; margin-top: 1%; flex: auto">
            <el-button :disabled="role < 3" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addNode">Add
              Node
            </el-button>
          </div>
          <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
            <!-- <el-table :data='tableData' style='width: 100%'> -->
            <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

            <el-table-column label="ID" width="100" type="index">
              <!--        <template slot-scope="scope">-->
              <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
              <!--          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>-->
              <!--        </template>-->
            </el-table-column>

            <el-table-column label="主机名" width="120">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column label="ip" width="150">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Ready" width="120">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.ready }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="200">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.created_at }}</span>
              </template>
            </el-table-column>

            <el-table-column label="CPU" width="100">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.cpu }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Memory" width="200">
              <template slot-scope="scope">
                <!-- <i class='el-icon-time'></i> -->
                <span>{{ scope.row.memory }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--          <el-button :disabled="role <= 1 || role < scope.row['role']" size='mini' @click='Resetpsd(scope.row)'>Terminal</el-button>-->
                <el-button :disabled="role <= 2 " size="mini" type="success" @click="pushTerminal(scope.row)"> 终端</el-button>
                <el-button :disabled="role <= 2 || scope.row.name === 'master'" size="mini" type="danger" @click="deleteNode(scope.row.name)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <div>
            <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pagesize" :total="total" @current-change="changePageNum" />
          </div>
          <AddNode ref="AddNode" :visible.sync="openDialog" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { deleteNode, getNodeList } from '@/api/node'
import AddNode from '@/components/AddNode'
// import nodeColumn from '@/components/Echarts/node';
import nodeColumn from '@/components/Echarts/node_circle';

export default {
  components: { AddNode, nodeColumn },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getNodeList()
  },
  data() {
    return {
      activeName: 'first',
      openDialog: false,
      value: '',
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: '',
          ip: '',
          ready: '',
          create_at: '',
          os_image: '',
          kubelet_version: '',
          cpu: '',
          memory: ''
        }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'second') {
        // this.init()
      }
    },
    addNode: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNode.init()
      })
    },
    deleteNode: function(node) {
      /* 提示消息*/
      this.$confirm('确认删除此node及其所含包含资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNode(node).then((res) => {
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
              this.getNodeList()
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
    changePageNum: function(val) {
      this.page = val
      // this.getUserList()
    },
    getNodeList: function() {
      getNodeList().then((res) => {
        this.total = res.length
        this.tableData = res.node_list
        // Terminal.log(res)
      })
    },
    pushTerminal: function(row) {
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
    }
  }
}
</script>
