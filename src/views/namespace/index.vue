<template>
  <div>
    <div style="margin-left: 100px">
      <span>所属用户：</span>
      <el-select v-model="value" filterable placeholder="请选择" @change="change">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.username + '\t' + item.nickname"
          :value="item.id">
        </el-option>
        <el-pagination background layout="prev, pager, next" :current-page="userPage" :page-size="1" :total="userTotal" @current-change="changeUserPageNum"></el-pagination>
      </el-select>
      <el-button :disabled="role < 3" style="margin-left: 580px" type="primary" icon="el-icon-edit" @click="">Add Namespace</el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name" width="250">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="created_at" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="username" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="nickname" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="pushTerminal(scope.row)">pod</el-button>
          <el-button size='mini' type="primary" @click='Resetpsd(scope.row)'>deploy</el-button>
          <el-button size="mini" type="primary" @click="pushTerminal(scope.row)">service</el-button>
          <el-button
            :disabled="role <= 2
              || scope.row.name==='default'
              || scope.row.name==='kube-node-lease'
              || scope.row.name==='kube-public'
              || scope.row.name==='kube-system'
              || scope.row.name==='ingress-nginx'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pagesize" :total="total" @current-change="changePageNum" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getNsList, deleteNs } from '@/api/namespace'
import {getUserList} from '@/api/user'

export default {
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getNsList()
    this.getUserList()
  },
  data() {
    return {
      value: '',
      page: 1,
      total: 0,
      pagesize: 10,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        username: '',
        nickname: ''
      }],
      tableData: [
        {
          name: '',
          status: '',
          created_at: '',
          username: '',
          nickname: ''
        }
      ]
    }
  },
  methods: {
    changePageNum: function(val) {
      this.page = val
      // this.getUserList()
    },
    getNsList: function() {
      getNsList(this.value).then((res) => {
        this.total = res.length
        this.tableData = res.ns_list
        console.log(res)
      })
    },
    getUserList: function() {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = res.total
        this.options = res.user_list
        // Terminal.log(res)
      })
    },
    changeUserPageNum: function(val) {
      this.userPage = val
      this.getUserList()
    },
    change() {
      this.$forceUpdate()
      this.getNsList()
    },
    addNs: function(){

    },
    handleAdd: function(){

    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此namespace及其所含包含资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNs(row['name']).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            location.reload()
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
