<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <UserSelector ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelector ref="NsSelector" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />

      <el-dropdown split-button trigger="click" style="margin-left: 30%" type="primary" @command="handleCommand" @click="addDeploy">
        Add Deploy
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">Form</el-dropdown-item>
          <el-dropdown-item command="b">Yaml</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="编号" width="80">
        <template slot-scope="scope">
          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="ID" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="名称" width="250">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.name }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="命名空间" width="250">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.namespace }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="创建时间" width="200">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.created_at }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="拷贝" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.replicas }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="更新" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.updated_replicas }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="就绪" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.ready_replicas }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="可用" width="85">-->
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span>{{ scope.row.available_replicas }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column width="100" property="name" label="名称" />
      <el-table-column width="150" property="namespace" label="命名空间" />
      <el-table-column width="150" property="created_at" label="创建时间" />

      <!--      /* 1基本信息*/-->
      <el-table-column label="基本信息" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="650"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="80" property="replicas" label="拷贝数" />
              <el-table-column width="200" property="image" label="映像文件" />
              <el-table-column width="300" property="volume" label="数据卷" />
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
              <el-table-column width="100" property="date" label="名称" />
              <el-table-column width="100" property="name" label="协议" />
              <el-table-column width="150" property="name" label="本地端口" />
              <el-table-column width="150" property="name" label="目标端口" />
              <el-table-column width="150" property="address" label="网络节点端口" />
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>
      <!--      </el-popover>-->

      <el-table-column label="规格" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="850"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="120" property="cpu" label="cpu" />
              <el-table-column width="120" property="memory" label="内存" />
              <el-table-column width="120" property="storage" label="临时存储" />
              <el-table-column width="120" property="pvc" label="永久存储" />
              <el-table-column width="120" property="gpu" label="gpu" />
              <el-table-column width="200" property="pvc_path" label="pvc路径" />
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--      /* 4状态*/-->
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="500"
            trigger="click"
          >
            <el-table :data="scope.row.ports">
              <el-table-column width="120" property="updated_replicas" label="更新副本" />
              <el-table-column width="120" property="ready_replicas" label="就绪副本" />
              <el-table-column width="120" property="available_replicas" label="可用副本" />
            </el-table>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <!--   5Pod_list   -->
      <el-table-column label="Pod表单" type="expand" width="150">
        <template slot-scope="scope">
          <el-table :data="scope.row.pod_list">
            <el-table-column label="名称" width="100"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="阶段" width="100"><template slot-scope="scope"><span>{{ scope.row.phase }}</span></template></el-table-column>
            <el-table-column label="主机Ip" width="130"><template slot-scope="scope"><span>{{ scope.row.host_ip }}</span></template></el-table-column>
            <el-table-column label="节点Ip" width="130"><template slot-scope="scope"><span>{{ scope.row.node_ip }}</span></template></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="editDeploy(scope.row)"
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
    <YamlApply ref="YamlApply" :visible.sync="applyDialog" :kind="kind" :name="yamlName" :ns="yamlNs" />
    <YamlCreate ref="YamlCreate" :visible.sync="createDialog" :kind="kind" />
    <AddDeploy ref="AddDeploy" :visible.sync="addDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteDeploy, getDeployList } from '@/api/deploy'
import UserSelector from '@/components/Selector/UserSelector'
import NsSelector from '@/components/Selector/NsSelector'
import YamlApply from '@/components/YamlEditor/apply'
import YamlCreate from '@/components/YamlEditor/create'
import AddDeploy from '@/components/AddDeploy'

export default {
  name: 'Deploy',
  components: { NsSelector, UserSelector, YamlApply, YamlCreate, AddDeploy },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.$route.query.u_id || this.u_id
    this.getDeployList()
  },
  data() {
    return {
      kind: 'Deploy',
      yamlName: '',
      yamlNs: '',
      timer: null,
      loading: false,
      applyDialog: false,
      createDialog: false,
      addDialog: false,
      ns: this.$route.query.ns,
      uid: '',
      page: 1,
      // total: 0,
      pagesize: 10,
      tableData: [
        {
          /*          updated_replicas: '',
          ready_replicas: '',
          available_replicas: '',
          u_id: ''*/

          /* 1基本信息*/
          name: '',
          namespace: '',
          replicas: 0,
          image: '',
          created_at: '2023-07-06 13:37:29',
          volume: 'pvc-a4a5fe70-7c94-44c4-aa7d-85673837322f',
          /* 2端口*/
          ports: [
            {
              name: '',
              protocol: '',
              port: '',
              targetPort: '',
              nodePort: ''
            }
          ],

          /* 3规格*/
          cpu: '1',
          memory: '',
          storage: '',
          pvc: '',
          gpu: '',
          /* used_cpu: '',*/
          /* used_memory: '',*/
          /* used_storage: '',*/
          /* used_pvc: '',*/
          /* used_gpu: '',*/

          pvc_path: [
            '/data'
          ],

          /* 4状态*/
          updated_replicas: 0,
          ready_replicas: 1,
          available_replicas: 1,

          /* 5pod*/
          pod_list: [
            {
              name: '',
              phase: '',
              host_ip: '',
              pod_ip: ''
            }
          ]

        }
      ]
    }
  },
  methods: {
    showDeplotPorts: function(row) {

    },
    handleCommand(command) {
      if (command === 'a') {
        this.addDeploy()
      } else {
        this.yamlCreate()
      }
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.getDeployList()
    },
    changeNs: function(ns) {
      this.ns = ns
      this.getDeployList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getDeployList: function() {
      getDeployList(this.uid, this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.deploy_list
        console.log(res)
      })
    },
    addDeploy: function() {
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs.AddDeploy.init()
      })
    },
    yamlCreate: function() {
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs.YamlCreate.init()
      })
    },
    editDeploy: function(row) {
      this.yamlName = row['name']
      this.yamlNs = row['namespace']
      this.applyDialog = true
      this.$nextTick(() => {
        this.$refs.YamlApply.init()
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
    }
  }
}
</script>

<style scoped>

</style>
