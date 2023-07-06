<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="ID" width="100" type="index">
        <!--        <template slot-scope='scope'>-->
        <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
        <!--          <span style='margin-left: 1%'>{{ scope.$index + 1 }}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column label="用户名" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" width="100">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权限" width="120">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->

          <el-tag v-if="scope.row.role === 1">普通用户</el-tag>
          <el-tag v-else-if="scope.row.role === 2" type="success">管理员</el-tag>
          <el-tag v-else-if="scope.row.role === 3" type="danger">超级管理员</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="role <= 1 || role < scope.row['role']" size="mini" type="warning" @click="Resetpsd(scope.row)">重置密码</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role']" size="mini" type="warning" @click="showDialog(scope.row[&quot;id&quot;])"> 权限修改</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role']" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;bottom: 2%">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="1" :total="total" @current-change="changePageNum" />
    </div>
    <!--  权限修改弹窗-->
    <el-dialog title="权限修改" :visible.sync="statusDialogVisible">
      <el-form>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select v-model="value" placeholder="请选择" @change="change()">
            <el-option v-if="role > 2" label="超级管理员" value="3" />
            <el-option v-if="role > 1" label="管理员" value="2" />
            <el-option label="普通用户" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Resetlev(value)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { deleteUser, editUser, getUserList, resetPass } from '@/api/user'
import { mapGetters } from 'vuex'
var new_id

export default {
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getUserList()
  },
  data() {
    return {
      value: '',
      page: 1,
      total: 0,
      formLabelWidth: '10%',
      statusDialogVisible: false,
      rolelist: ['普通用户', '管理员', '超级管理员'],
      tableData: [
        {
          id: '',
          username: '',
          nickname: '',
          role: '',
          created_at: '',
          updated_at: '',
          avatar: ''
        }
      ]
    }
  },
  methods: {
    changePageNum: function(val) {
      this.page = val
      this.getUserList()
    },
    Resetpsd(row) {
      this.$prompt('请输入密码', {
        formtype: 1,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        resetPass(row['id'], { password: value }).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    change() {
      this.$forceUpdate()
    },
    showDialog(id) {
      this.statusDialogVisible = true
      new_id = id
    },
    Resetlev(value) {
      // Terminal.log('2222222222222222')
      editUser(new_id, { role: parseInt(value) }).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      this.statusDialogVisible = false
      location.reload()
    },
    handleDelete(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row['id']).then((res) => {
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
    },
    getUserList: function() {
      getUserList(this.page).then((res) => {
        this.page = res.page
        this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tableData = res.user_list
        // console.log(this.total)
      })
    }
  }
}
</script>
