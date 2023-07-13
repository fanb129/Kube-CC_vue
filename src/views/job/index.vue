<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <GroupSelector ref="GroupSelector" :default-uid="adid" style="margin-right: 50px" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelector ref="NsSelector" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />

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
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="restartJob(scope.row)"
          >重新启动
          </el-button>
          <el-button
            size="mini"
            type="info"
            @click="openLog(scope.row)"
          >打开日志
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
    <YamlApply ref="YamlApply" :visible.sync="applyDialog" :kind="kind" :name="yamlName" :ns="yamlNs" />
    <YamlCreate ref="YamlCreate" :visible.sync="createDialog" :kind="kind" />
    <AddDeploy ref="AddDeploy" :visible.sync="addDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getJobList } from '@/api/job'
import UserSelector from '@/components/Selector/UserSelector'
import NsSelector from '@/components/Selector/NsSelector'
import YamlApply from '@/components/YamlEditor/apply'
import YamlCreate from '@/components/YamlEditor/create'
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import row from 'element-ui/packages/row'

export default {
  name: 'Job',
  // eslint-disable-next-line vue/no-unused-components
  components: { NsSelector, UserSelector, GroupSelector, YamlApply, YamlCreate },
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
    this.uid = this.$route.query.u_id || this.u_id
    this.adid = this.u_id
    this.getJObList()
  },
  data() {
    return {
      kind: 'Job',
      yamlName: '',
      yamlNs: '',
      adid: '',
      ns: this.$route.query.ns,
      timer: null,
      loading: false,
      applyDialog: false,
      createDialog: false,
      addDialog: false,
      uid: '',
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
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.142',
              pod_ip: '100.97.125.61'
            },
            {
              name: 'jobtest1-8sbx7',
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.142',
              pod_ip: '100.97.125.63'
            },
            {
              name: 'jobtest1-bm47h',
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.142',
              pod_ip: '100.97.125.60'
            },
            {
              name: 'jobtest1-h2czq',
              phase: 'Succeeded',
              restarts: 0,
              host_ip: '192.168.139.142',
              pod_ip: '100.97.125.62'
            }
          ]

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
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.getJObList()
    },
    changeNs: function(ns) {
      this.ns = ns
      this.getJObList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getJObList: function() {
      getJobList(this.uid, this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.job_list
        console.log(res)
      })
    },
    yamlCreate: function() {
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs.YamlCreate.init()
      })
    },
    restartJob: function(row) {
      this.$alert('确认重启？', '重启Job', {
        confirmButtomText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action:${'重启完成'}`
          })
        }
      })
    },
    /* 查询Job工作日志*/
    openLog: function(row) {
    }

  }
}
</script>

<style scoped>

</style>
