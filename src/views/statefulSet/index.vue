<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <UserSelector ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelector ref="NsSelector" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
      <!--      <el-button style="margin-left: 30%" type="primary" icon="el-icon-edit" @click="addDeploy">Add-->
      <!--        Deploy-->
      <!--      </el-button>-->

      <el-dropdown split-button trigger="click" style="margin-left: 30%" type="primary" @command="handleCommand" @click="addStatefulSet">
        Add StatefulSet
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">Form</el-dropdown-item>
          <el-dropdown-item command="b">Yaml</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name" width="250">
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

      <el-table-column label="created_at" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Replicas" width="80">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.replicas }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Updated" width="80">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.updated_replicas }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Ready" width="80">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.ready_replicas }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Available" width="85">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.available_replicas }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="primary" @click="pushTerminal(scope.row)">pod</el-button>-->
          <el-button
            size="mini"
            type="warning"
            @click="editStatefulSet(scope.row)"
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
    <AddDeploy ref="AddStatefulSet" :visible.sync="addDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteStatefulSet, getStatefulSetList } from '@/api/statefulSet'
import UserSelector from '@/components/Selector/UserSelector'
import NsSelector from '@/components/Selector/NsSelector'
import YamlApply from '@/components/YamlEditor/apply'
import YamlCreate from '@/components/YamlEditor/create'
import AddDeploy from '@/components/AddDeploy'
import addStatefulSet from '@/components/AddStatefulSet/index.vue'

export default {
  name: 'Deploy',
  components: { NsSelector, UserSelector, YamlApply, YamlCreate, AddDeploy },
  computed: {
    addStatefulSet() {
      return addStatefulSet
    },
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
      total: 0,
      pagesize: 10,
      tableData: [
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
      ]
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.addStatefulSet()
      } else {
        this.yamlCreate()
      }
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.getStatefulSetList()
    },
    changeNs: function(ns) {
      this.ns = ns
      this.getStatefulSetList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getStatefulSetList: function() {
      getStatefulSetList(this.uid, this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.deploy_list
        console.log(res)
      })
    },
    // eslint-disable-next-line vue/no-dupe-keys
    addStatefulSet: function() {
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs.AddStatefulSet.init()
      })
    },
    yamlCreate: function() {
      this.createDialog = true
      this.$nextTick(() => {
        this.$refs.YamlCreate.init()
      })
    },
    editStatefulSet: function(row) {
      this.yamlName = row['name']
      this.yamlNs = row['namespace']
      this.applyDialog = true
      this.$nextTick(() => {
        this.$refs.YamlApply.init()
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此statefulSet及其所含pod', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStatefulSet(row['namespace'], row['name']).then((res) => {
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
              this.getStatefulSetList()
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
