<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <span>Namespace：</span>
      <el-select v-model="ns" filterable placeholder="请选择" @change="change">
        <el-option
          v-for="item, index in options.slice((userPage - 1) * pagesize, userPage * pagesize).concat([{name: '', nickname: 'All Namespace'}])"
          :key="index"
          :label="item.name + '\t' + item.nickname"
          :value="item.name"
        />
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="userPage"
          :page-size="pagesize"
          :total="userTotal"
          @current-change="changeUserPageNum"
        />
      </el-select>
      <el-button :disabled="role < 3" style="margin-left: 30%" type="primary" icon="el-icon-edit" @click="addNs">Add
        Deploy
      </el-button>
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
          <el-button size="mini" type="primary" @click="pushTerminal(scope.row)">pod</el-button>
          <el-button :disabled="role <= 2" size="mini" type="warning" @click="Resetpsd(scope.row)">编辑</el-button>
          <el-button
            :loading="loading"
            :disabled="role <= 2
              || scope.row.namespace==='default'
              || scope.row.namespace==='kube-node-lease'
              || scope.row.namespace==='kube-public'
              || scope.row.namespace==='kube-system'
              || scope.row.namespace==='ingress-nginx'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="page"
      :page-size="pagesize"
      :total="total"
      @current-change="changePageNum"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteDeploy, getDeployList } from '@/api/deploy'
import { getNsList } from '@/api/namespace'

export default {
  name: 'Deploy',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getDeployList()
    this.getNsList()
  },
  data() {
    return {
      timer: null,
      loading: false,
      openDialog: false,
      ns: this.$route.query.ns,
      page: 1,
      total: 0,
      pagesize: 10,
      userPage: 1,
      userTotal: 0,
      options: [{
        name: '',
        nickname: ''
      }],
      tableData: [
        {
          name: '',
          namespace: '',
          created_at: '',
          replicas: '',
          updated_replicas: '',
          ready_replicas: '',
          available_replicas: ''
        }
      ]
    }
  },
  methods: {
    changePageNum: function(val) {
      this.page = val
    },
    getDeployList: function() {
      getDeployList(this.ns).then((res) => {
        this.total = res.length
        this.tableData = res.deploy_list
        console.log(res)
      })
    },
    getNsList: function() {
      getNsList('').then((res) => {
        this.userTotal = res.length
        this.options = res.ns_list
      })
    },
    changeUserPageNum: function(val) {
      this.userPage = val
    },
    change() {
      this.$forceUpdate()
      this.getDeployList()
    },
    addNs: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNamespace.init()
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
