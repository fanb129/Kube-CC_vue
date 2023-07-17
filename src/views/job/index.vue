<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <GroupSelector ref="GroupSelector" :default-uid="adid" style="margin-right: 50px" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelectorNoNil ref="NsSelector" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />

      <el-button style="margin-left: 100px" type="primary" @click="addJob">
        新增一次性任务
      </el-button>
    </div>
    <!--    1规格   -->
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="编号" width="80"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.$index + 1 }}</span></template></el-table-column>
      <el-table-column width="100" property="name" label="名称"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.name }}</span></template></el-table-column>
      <el-table-column width="120" property="namespace" label="命名空间"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.row.namespace }}</span></template></el-table-column>
      <el-table-column width="200" property="succeeded" label="成功"><template slot-scope="scope"><i class="el-icon-time" /><span style="margin-left: 1%">{{ scope.row.created_at }}</span></template></el-table-column>
      <el-table-column width="80" property="completions" label="完成"><template slot-scope="scope"><span>{{ scope.row.cpu }}</span></template></el-table-column>
      <el-table-column width="80" property="duration" label="持续时间"><template slot-scope="scope"><span>{{ scope.row.memory }}</span></template></el-table-column>
      <el-table-column width="200" property="image" label="映像"><template slot-scope="scope"><span>{{ scope.row.storage }}</span></template></el-table-column>
      <el-table-column width="150" property="created_at" label="创建时间"><template slot-scope="scope"><span>{{ scope.row.pvc }}</span></template></el-table-column>

      <!--   Pod_list   -->
      <el-table-column label="Pod表单" type="expand" width="150">
        <template slot-scope="scope">
          <el-table :data="scope.row.PodList">
            <el-table-column label="编号" width="80"><template slot-scope="scope"><span style="margin-left: 1%">{{ scope.$index + 1 }}</span></template></el-table-column>
            <el-table-column label="名称" width="200"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="阶段" width="200"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="重启次数" width="200"><template slot-scope="scope"><span>{{ scope.row.restarts }}</span></template></el-table-column>
            <el-table-column label="主机Ip" width="200"><template slot-scope="scope"><span>{{ scope.row.host_ip }}</span></template></el-table-column>
            <el-table-column label="节点Ip" width="200"><template slot-scope="scope"><span>{{ scope.row.pod_ip }}</span></template></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="info" style="margin-top: 2px" @click="podLog(scope.row)">打开日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            style="margin-left: 10px"
            @click="restartJob(scope.row)"
          >重新启动
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="info"-->
<!--            style="margin-top: 2px"-->
<!--            @click="openLog(scope.row)"-->
<!--          >打开日志-->
<!--          </el-button>-->

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
    <AddJob ref="AddJob" :visible.sync="addDialog" />
    <UpdateJob ref="UpdateJob" :visible.sync="updateDialog" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getJobList,deleteJob } from '@/api/app/job'
import UserSelector from '@/components/Selector/UserSelector'
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import { podLog } from '@/api/pod'
import AddJob from '@/components/AddJob/index'
import UpdateJob from '@/components/AddJob/UpdateJob'

export default {
  name: 'Job',
  // eslint-disable-next-line vue/no-unused-components
  components: { NsSelectorNoNil, UserSelector, GroupSelector, AddJob, UpdateJob },
  computed: {
    row() {
      return row
    },
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.adid = this.u_id
    // this.getJObList()
  },
  data() {
    return {
      uid: '',
      gid: '',
      adid: '',
      ns: '',
      timer: null,
      loading: false,
      applyDialog: false,
      createDialog: false,
      addDialog: false,
      page: 1,

      // total: 0,
      pagesize: 10,
      tableData: [
        {
          name: 'jobtest1',
          namespace: 'default',
          succeeded: 4,
          completions: 4,
          duration: '10s',
          image: 'busybox:1.30',
          created_at: '2023-07-11 17:47:12',
          PodList: [
            {
              name: 'jobtest1-886vn',
              namespace: '',
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.142',
              pod_ip: '100.97.125.61'
            }
          ]
        },
        {
          name: 'jobtest2',
          namespace: 'default',
          succeeded: 3,
          completions: 4,
          duration: '10s',
          image: 'busybox:1.30',
          created_at: '2023-07-16 09:09:56',
          PodList: [
            {
              name: 'jobtest2-335vn',
              namespace: '',
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.182',
              pod_ip: '100.97.26.61'
            }
          ]
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
      this.$refs.NsSelectorNoNil.u_id = this.uid
      this.$refs.NsSelectorNoNil.getNsList()
    },
    changeNs: function(ns) {
      if (ns !== '') {
        this.ns = ns
        this.getJobList()
      }
    },
    changePageNum: function(val) {
      this.page = val
    },
    getJObList: function() {
      getJobList(this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.app_job_list
        console.log(res)
      })
    },
    addJob: function() {
      this.addDialog = true
      this.$nextTick(() => {
        this.myuid = this.u_id
        this.addDialog = true
        this.$refs.AddJob.init(this.myuid)
      })
    },
    restartJob: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateJob.init(row['namespace'], row['name'])
        this.updateDialog = true
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此Job及其所含pod', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJob(row['namespace'], row['name']).then((res) => {
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
    /* 查询Job工作日志*/
    podLog: function(row) {
      podLog(row['namespace'], row['name']).then((res) => {
        console.log(res.log)
      })
    }

  }
}
</script>

<style scoped>

</style>
