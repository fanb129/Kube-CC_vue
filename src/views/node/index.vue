<template>
  <div>
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
          <!--          <el-button :disabled="role <= 1 || role < scope.row['role']" size='mini' type='danger' @click='handleDelete(scope.row)'>删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="position: absolute;bottom: 2%">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pagesize" :total="total" @current-change="changePageNum" />
    </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getNodeList } from '@/api/node'

export default {
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
          pwd: '1234567890',
          // ip: row['ip'],
          // port: '22'
        }
      })
    }
  }
}
</script>
