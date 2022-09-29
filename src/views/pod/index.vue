<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <UserSelector :default-uid="uid" @nsList="changeUid" ref="UserSelector"></UserSelector>
      <NsSelector :default-uid="uid" :default-ns="ns" @nsList="changeNs" ref="NsSelector"></NsSelector>
      <el-button style="margin-left: 30%" type="primary" icon="el-icon-edit" @click="addPod">Add
        Pod
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="40" type="index"></el-table-column>

      <el-table-column label="Name" width="115">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Namespace" width="115">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.namespace }}</span>
        </template>
      </el-table-column>

      <el-table-column label="created_at" width="95">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Phase" width="80">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.phase }}</span>
        </template>
      </el-table-column>

      <el-table-column label="NodeIp" width="130">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.node_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ContainerStatuses">
        <el-table-column label="Name" width="105">
          <template slot-scope="scope">
            <el-table :data="scope.row.container_statuses" :show-header="false">
              <el-table-column><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Ready" width="105">
          <template slot-scope="scope">
            <el-table :data="scope.row.container_statuses" :show-header="false">
              <el-table-column><template slot-scope="scope"><span>{{ scope.row.ready }}</span></template></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Started" width="105">
          <template slot-scope="scope">
            <el-table :data="scope.row.container_statuses" :show-header="false">
              <el-table-column><template slot-scope="scope"><span>{{ scope.row.started }}</span></template></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="RestartCount" width="110">
          <template slot-scope="scope">
            <el-table :data="scope.row.container_statuses" :show-header="false">
              <el-table-column><template slot-scope="scope"><span>{{ scope.row.restartCount }}</span></template></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Image" width="65" type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.container_statuses" :show-header="false">
              <el-table-column><template slot-scope="scope"><span>{{ scope.row.image }}</span></template></el-table-column>
            </el-table>
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini" type="success" @click="pushTerminal(scope.row)"> 终端</el-button>
          <el-button
            size="mini" type="warning" @click="editPod(scope.row)">编辑</el-button>
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
    <YamlApply :visible.sync="applyDialog" ref="YamlApply" :kind="kind" :name="yamlName" :ns="yamlNs"/>
    <YamlCreate :visible.sync="createDialog" ref="YamlCreate" :kind="kind"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deletePod, getPodList } from '@/api/pod'
import { getNsList } from '@/api/namespace'
import UserSelector from "@/components/Selector/UserSelector";
import NsSelector from "@/components/Selector/NsSelector";
import YamlApply from '@/components/YamlEditor/apply'
import YamlCreate from '@/components/YamlEditor/create'

export default {
  name: 'Pod',
  components: { NsSelector, UserSelector, YamlApply, YamlCreate},
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.$route.query.u_id || this.u_id
    this.getPodList()
  },
  data() {
    return {
      kind: 'Pod',
      yamlName: '',
      yamlNs: '',
      timer: null,
      loading: false,
      applyDialog: false,
      createDialog: false,
      ns: this.$route.query.ns,
      uid: '',
      page: 1,
      total: 0,
      pagesize: 5,
      tableData: [
        {
          name: '',
          namespace: '',
          created_at: '',
          phase: '',
          node_ip: '',
          u_id: '',
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
      ]
    }
  },
  methods: {
    changeUid: function (u_id){
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.getPodList()
    },
    changeNs: function (ns){
      this.ns = ns
      this.getPodList()
    },
    pushTerminal: function(row) {
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container_statuses'][0].name
        }
      })
    },
    changePageNum: function(val) {
      this.page = val
    },
    getPodList: function() {
      getPodList(this.uid,this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.pod_list
        console.log(res)
      })
    },
    addPod: function() {
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs.YamlCreate.init()
      })
    },
    editPod: function(row){
      this.yamlName = row['name']
      this.yamlNs = row['namespace']
      this.applyDialog = true
      this.$nextTick(() => {
        this.$refs.YamlApply.init()
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此pod', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePod(row['namespace'], row['name']).then((res) => {
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
              this.getPodList()
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
