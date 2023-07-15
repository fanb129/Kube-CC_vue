<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <GroupSelector ref="GroupSelector" :default-uid="adid" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" style="margin-left: 100px" @nsList="changeUid" />
      <el-button style="margin-left: 100px" type="primary" icon="el-icon-edit" @click="addNs">
        新增工作空间
      </el-button>
    </div>
    <!--    显示页   -->
    <!--    基本信息    -->
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="ID" width="50" type="index" />
      <el-table-column width="120" property="name" label="名称"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
      <el-table-column width="80" property="status" label="状态"><template slot-scope="scope"><span>{{ scope.row.status }}</span></template></el-table-column>
      <el-table-column width="115" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.created_at }}</span></template></el-table-column>
      <!--    基本信息end-->

      <!--      规格    -->
      <el-table-column label="CPU" width="80"><template slot-scope="scope"><span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span></template></el-table-column>
      <el-table-column label="内存" width="100"><template slot-scope="scope"><span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span></template></el-table-column>
      <el-table-column label="GPU" width="100"><template slot-scope="scope"><span>{{ scope.row.used_gpu }}/{{ scope.row.gpu }}</span></template></el-table-column>
      <el-table-column label="临时存储" width="100"><template slot-scope="scope"><span>{{ scope.row.used_storage }}/{{ scope.row.storage }}</span></template></el-table-column>
      <el-table-column label="持久存储" width="100"><template slot-scope="scope"><span>{{ scope.row.used_pvc }}/{{ scope.row.pvc }}</span></template></el-table-column>
      <!--      规格end    -->

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

      <!--      操作     -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            style="margin-left: 10px"
            @click="updateNs(scope.row)"
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
      <!--      操作end     -->
    </el-table>
    <!--    显示页end    -->

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
    <AddNamespace ref="AddNamespace" :visible.sync="openDialog" />
    <UpdateNamespace ref="UpdateNamespace" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getNsList, deleteNs } from '@/api/namespace'
import AddNamespace from '@/components/AddNamespace'
import UpdateNamespace from '@/components/AddNamespace/UpdateNamespace'
import UserSelector from '@/components/Selector/UserSelector'
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import { viewGroupByAd } from '@/api/group'
import { getUserList } from '@/api/user'

export default {
  components: { AddNamespace, UserSelector, GroupSelector, UpdateNamespace },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.adid = this.u_id
    this.getNsList()
  },
  data() {
    return {
      uid: '',
      gid: '',
      adid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: '',
          status: '',
          created_at: '',
          username: '',
          nickname: '',
          u_id: '',
          cpu: '',
          used_cpu: '',
          memory: '',
          used_memory: '',
          storage: '',
          used_storage: '',
          pvc: '',
          used_pvc: '',
          gpu: '',
          used_gpu: ''
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
    beforeHandleCommand(item, row) {
      return {
        'command': item,
        'row': row
      }
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.getNsList()
    },
    changePageNum: function(val) {
      this.page = val
      // this.getUserList()
    },
    getNsList: function() {
      getNsList(this.gid, this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.ns_list
        console.log(res)
      })
    },
    addNs: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNamespace.init()
      })
    },
    updateNs: function(row) {
      console.log(row['name'])
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateNamespace.init(row['name'], row['cpu'], row['memory'], row['storage'], row['pvc'], row['gpu'])
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此工作空间及其所含包含资源', '提示', {
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
            // location.reload()
            this.loading = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.loading = false
              this.getNsList()
              // location.reload()
            }, 2000)
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
    viewGroupByAd: function() {
      viewGroupByAd(this.u_id).then((res) => {
        // this.tagroup = res.group_list
        this.tagroup = []
        // this.tt=[]
        // this.tt = res.group_list
        this.tagroup.push(res.group_list.map(function(item, index) {
          var tmp = {
            'value': item.groupid,
            'label': item.name
          }
          return tmp
        }))
        this.tagroup = this.tagroup[0]
        // this.tagroup.push({
        //   "value" : 0,
        //   "label" : '请选择'
        // })
        if (this.role === 3) {
          this.tagroup.push({
            'value': 0,
            'label': '所有用户'
          })
        }
      })
    },
    getUserList: function() {
      getUserList(this.page).then((res) => {
        // this.page = res.page
        // this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tData = res.user_list
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role === 3) {
            this.tempData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role === 2) {
            this.tempData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role === 1) {
            this.tempData.push(this.tData[i])
          }
        }
        // this.tableData.sort(function(a,b){return a.role > b.role})
        // console.log(this.total)
      })
    }
  }
}
</script>
