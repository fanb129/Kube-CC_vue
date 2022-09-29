<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <UserSelector :default-uid="uid" @nsList="changeUid" ref="UserSelector"></UserSelector>
      <NsSelector :default-uid="uid" :default-ns="ns" @nsList="changeNs" ref="NsSelector"></NsSelector>
      <el-button style="margin-left: 30%" type="primary" icon="el-icon-edit" @click="addService">Add
        Service
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="40" type="index">
<!--        <template slot-scope="scope">-->
<!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
<!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column label="Name" width="115">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Namespace" width="250">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.namespace }}</span>
        </template>
      </el-table-column>

      <el-table-column label="created_at" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ClusterIp" width="120">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.cluster_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Type" width="85">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Ports" type="expand" width="60">
        <template slot-scope="scope">
          <el-table :data="scope.row.ports">
            <el-table-column label="Name" width="105"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
            <el-table-column label="Protocol" width="105"><template slot-scope="scope"><span>{{ scope.row.protocol }}</span></template></el-table-column>
            <el-table-column label="Port" width="105"><template slot-scope="scope"><span>{{ scope.row.port }}</span></template></el-table-column>
            <el-table-column label="NodePort" width="105"><template slot-scope="scope"><span>{{ scope.row.nodePort }}</span></template></el-table-column>
            <el-table-column label="TargetPort" width="105"><template slot-scope="scope"><span>{{ scope.row.targetPort }}</span></template></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini" type="warning" @click="editService(scope.row)">编辑</el-button>
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
import { deleteService, getServiceList } from '@/api/service'
import { getNsList } from '@/api/namespace'
import UserSelector from "@/components/Selector/UserSelector";
import NsSelector from "@/components/Selector/NsSelector";
import YamlApply from '@/components/YamlEditor/apply'
import YamlCreate from '@/components/YamlEditor/create'

export default {
  name: 'Service',
  components: { NsSelector, UserSelector, YamlApply, YamlCreate},
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.$route.query.u_id || this.u_id
    this.getServiceList()
  },
  data() {
    return {
      kind: 'Service',
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
      pagesize: 10,
      tableData: [
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
      ]
    }
  },
  methods: {
    changeUid: function (u_id){
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.getServiceList()
    },
    changeNs: function (ns){
      this.ns = ns
      this.getServiceList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getServiceList: function() {
      getServiceList(this.uid,this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.service_list
        console.log(res)
      })
    },
    addService: function() {
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs.YamlCreate.init()
      })
    },
    editService: function(row){
      this.yamlName = row['name']
      this.yamlNs = row['namespace']
      this.applyDialog = true
      this.$nextTick(() => {
        this.$refs.YamlApply.init()
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此service', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteService(row['namespace'], row['name']).then((res) => {
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
              this.getServiceList()
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
