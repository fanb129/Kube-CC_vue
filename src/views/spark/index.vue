<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <GroupSelector ref="GroupSelector" :default-uid="adid" style="margin-right: 100px" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" style="margin-right: 100px" @nsList="changeUid" />
      <el-button :disabled="role < 2" style="margin-left: 100px" type="primary" icon="el-icon-edit" @click="addSpark">
        新建 Spark
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">

      <el-table-column label="序号" width="100" type="index" />
      <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
      <el-table-column width="120" property="status" label="状态"><template slot-scope="scope"><span>{{ scope.row.status }}</span></template></el-table-column>
      <el-table-column width="180" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.created_at }}</span></template></el-table-column>
      <el-table-column width="80" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span></template></el-table-column>
      <el-table-column width="80" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span></template></el-table-column>
      <el-table-column width="80" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.used_storage }}/{{ scope.row.storage }}</span></template></el-table-column>
      <el-table-column width="80" property="pvc" label="持久存储"><template slot-scope="scope"><span>{{ scope.row.used_pvc }}/{{ scope.row.pvc }}</span></template></el-table-column>
      <!--      <el-table-column width="80" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.used_gpu }}/{{ scope.row.gpu }}</span></template></el-table-column>-->

      <!--      用户信息    -->
      <el-table-column label="用户信息" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="350"
            trigger="click"
          >
            <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
              <el-table-column width="150" property="username" label="用户账号"><template slot-scope="scope"><span>{{ scope.row.username }}</span></template></el-table-column>
              <el-table-column width="150" property="nickname" label="用户昵称"><template slot-scope="scope"><span>{{ scope.row.nickname }}</span></template></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <!--   deploy_list   -->
      <el-table-column label="deploy表单" width="150">
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
                  <el-table-column width="150" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.created_at }}</span></template></el-table-column>
                  <el-table-column width="80" property="replicas" label="副本数"><template slot-scope="scope"><span>{{ scope.row.replicas }}</span></template></el-table-column>
                  <!--配置信息-->
                  <el-table-column width="200" property="image" label="映像"><template slot-scope="scope"><span>{{ scope.row.image }}</span></template></el-table-column>
                  <el-table-column width="100" property="ports" label="端口"><template slot-scope="scope"><span>{{ scope.row.ports }}</span></template></el-table-column>
                  <el-table-column width="80" property="cpu" label="cpu"><template slot-scope="scope"><span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span></template></el-table-column>
                  <el-table-column width="80" property="memory" label="内存"><template slot-scope="scope"><span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span></template></el-table-column>
                  <el-table-column width="80" property="storage" label="临时存储"><template slot-scope="scope"><span>{{ scope.row.used_storage }}/{{ scope.row.storage }}</span></template></el-table-column>
                  <el-table-column width="80" property="pvc" label="持久存储"><template slot-scope="scope"><span>{{ scope.row.used_pvc }}/{{ scope.row.pvc }}</span></template></el-table-column>
                  <el-table-column width="80" property="gpu" label="gpu"><template slot-scope="scope"><span>{{ scope.row.used_gpu }}/{{ scope.row.gpu }}</span></template></el-table-column>
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
                </el-table></div></el-drawer>
          </el-popover></template>
      </el-table-column>
      <!--   deploy_list_end   -->

      <!--      操作   -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            style="margin-left: 10px"
            @click="updateSpark(scope.row)"
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
    <AddSpark ref="AddSpark" :visible.sync="openDialog" />
    <UpdateSpark ref="UpdateSpark" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getSparkList, deleteSpark } from '@/api/app/spark'
import AddSpark from '@/components/AddSpark'
import UserSelector from '@/components/Selector/UserSelector'
import UpdateSpark from '@/components/AddSpark/UpdateSpark'
import GroupSelector from '@/components/Selector/GroupSelector.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { AddSpark, UserSelector, GroupSelector, UpdateSpark },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.adid = this.u_id
    this.getSparkList()
  },
  data() {
    return {

      /* 抽屉参数*/
      drawer: false,
      innerDrawer: false,
      direction: 'btt',
      size: '67%',

      uid: 'uid114514',
      gid: '',
      adid: '',
      ns: this.$route.query.ns,
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: 'apache.spark.sql.SparkSession',
          status: 'Active',
          created_at: '2020-07-10 12:35:06',
          username: 'zhangsan',
          nickname: '张三',
          u_id: '',
          /* expired_time: null,*/

          cpu: '2',
          used_cpu: '0',
          memory: '2Gi',
          used_memory: '0',
          storage: '2Gi',
          used_storage: '0',
          pvc: '2Gi',
          used_pvc: '0',
          gpu: '0',
          used_gpu: '0',

          deploy_list: [
            {
              name: 'spark_d1',
              namespace: 'test1',
              created_at: '2023-07-11',
              replicas: '2',
              /* 配置*/
              image: 'kubeguide/spark:latest',
              ports: null,
              cpu: '',
              used_cpu: '',
              memory: '',
              used_memory: '',
              storage: '',
              used_storage: '',
              pvc: '',
              used_pvc: '',
              gpu: '',
              used_gpu: '',
              pvc_path: [],
              volume: '',
              /* 状态*/
              updated_replicas: '2',
              ready_replicas: '2',
              available_replicas: '2',
              // u_id: '222'

              pod_list: [
                {
                  name: 'spark.sparkContext.setLogLevel',
                  namespace: '',
                  container: '',
                  phase: 'Running',
                  host_ip: '192.168.139.143',
                  pod_ip: '100.125.152.30'
                }
              ]
            }
          ],
          ingress_list: []
        },
        {
          name: 'spark.sparkContext.textFile',
          status: 'Active',
          created_at: '2020-07-13 09:12:31',
          username: 'zhangsan',
          nickname: '张三',
          u_id: '',
          /* expired_time: null,*/

          cpu: '2',
          used_cpu: '0',
          memory: '1Gi',
          used_memory: '0',
          storage: '1Gi',
          used_storage: '0',
          pvc: '1Gi',
          used_pvc: '0',
          gpu: '0',
          used_gpu: '0',

          deploy_list: []
        },
        {
          name: 'spark.sparkContext.setLogLevel',
          status: 'Active',
          created_at: '2020-07-13 14:55:52',
          username: 'zhangsan',
          nickname: '张三',
          u_id: '',
          /* expired_time: null,*/

          cpu: '2',
          used_cpu: '0',
          memory: '2Gi',
          used_memory: '0',
          storage: '2Gi',
          used_storage: '0',
          pvc: '1Gi',
          used_pvc: '0',
          gpu: '0',
          used_gpu: '0',

          deploy_list: []
        }
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
      this.getSparkList()
    },
    handleClose(done) {
      this.$confirm('退出到页面->')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
    /*    pushTerminal: function(row) {
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container_statuses'][0].name
        }
      })
    },*/
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
