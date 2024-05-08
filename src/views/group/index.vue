<template>
  <div>
    <div style="position:relative;">
      <el-button v-if="role > 2" style="position:relative;left: 50%;" :disabled="role <= 2" size="middle" type="private" @click="changeAll">
        <span v-if="all">所有的组</span>
        <span v-else>自己的组</span>
      </el-button>
      <el-button style="position:relative;left: 50%;" :disabled="role <= 1" size="middle" type="warning" @click="showDialogC()">创建组</el-button>
      <!--      <el-button style="position:relative;left: 50%;" :disabled="role <= 1" size='middle' type="warning" @click='showDialogE(u_id)'>编辑组</el-button>-->
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <!-- <el-table :data='tableData' style='width: 100%'> -->
      <!--      <el-table-column fixed type='selection' width='55'></el-table-column>-->

      <el-table-column label="序号" width="80" type="index">
        <!--        <template slot-scope='scope'>-->
        <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
        <!--          <span style='margin-left: 1%'>{{ scope.$index + 1 }}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column label="组名" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="管理员账号" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员昵称" width="150">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="725"
            trigger="click"
          >
            <div style="white-space: pre-wrap; overflow-x: auto;">
              {{ scope.row.description }}
            </div>
            <el-button slot="reference" size="mini">点击查看</el-button>
          </el-popover></template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.group_created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.group_updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size='mini' type="warning" @click='showDialogU(scope.row["groupid"])'>查看组</el-button>-->
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size="mini" type="warning" @click="showDialogA(scope.row)"> 添加用户</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size="mini" type="warning" @click="showDialogR(scope.row)"> 移出用户</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size="mini" type="warning" @click="showDialogE(scope.row)"> 编辑</el-button>
          <el-button :disabled="role != 3 && ( role <= 1 || u_id != scope.row['adminid'] )" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <div>-->
    <!--      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="1" :total="total" @current-change="changePageNum"></el-pagination>-->
    <!--    </div>-->
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pagesize"
        :total="total"
        @current-change="changePageNum"
      />
    </div>
    <!--  创建组弹窗-->
    <el-dialog title="创建组" :visible.sync="statusDialogCVisible">
      <el-form>
        <el-form-item label="组名" :label-width="formLabelWidth">
          <el-input v-model="inputgn" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="组描述" :label-width="formLabelWidth">
          <el-input v-model="inputgd" type="textarea" :rows="2" placeholder="请输入内容" maxlength="256" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogCVisible = false">取 消</el-button>
        <el-button type="primary" @click="CTGroup">确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑组弹窗-->
    <el-dialog title="编辑组" :visible.sync="statusDialogEVisible">
      <el-form>
        <el-form-item label="编辑组名" :label-width="formLabelWidth">
          <el-input v-model="inputegn" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="编辑描述" :label-width="formLabelWidth">
          <el-input v-model="inputegd" type="textarea" :rows="2" placeholder="请输入内容" maxlength="256" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogEVisible = false">取 消</el-button>
        <el-button type="primary" @click="EDGroup()">确 定</el-button>
      </div>
    </el-dialog>
    <!--向组内添加用户弹窗-->
    <el-dialog title="添加用户" :data="okuser" :visible.sync="statusDialogAVisible">
      <template>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in okuser"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogAVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--移出用户弹窗-->
    <el-dialog title="移出用户" :data="rmuser" :visible.sync="statusDialogRVisible">
      <template>
        <el-select v-model="value" filterable placeholder="请选择">
          <el-option
            v-for="item in rmuser"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogRVisible = false">取 消</el-button>
        <el-button type="primary" @click="RemoveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { editUser, getUserList, resetPass, getAllUser } from '@/api/user'
import {
  deleteGroup,
  addUser,
  removeUser,
  getGroupList,
  viewGroupUser,
  creatGroup,
  updateGroup,
  getGroupListByUid, getAllGroupList, getOkUser
} from '@/api/group'
import { mapGetters } from 'vuex'
var tg_id

export default {
  computed: {
    ...mapGetters([
      'role',
      'u_id',
      'username'
    ])
  },
  created() {
    this.getGroupList()
  },
  data() {
    return {
      all: false,
      value: '',
      page: 1,
      total: 0,
      pagesize: 10,
      formLabelWidth: '10%',
      statusDialogUVisible: false,
      statusDialogAVisible: false,
      statusDialogRVisible: false,
      statusDialogCVisible: false,
      statusDialogEVisible: false,
      // rolelist: ['普通用户', '管理员', '超级管理员'],
      inputgn: '',
      inputgd: '',
      inputegn: '',
      inputegd: '',
      tableData: [],
      tuser: [
        {
          id: '',
          username: '',
          nickname: '',
          role: '',
          created_at: '',
          updated_at: '',
          avatar: '',
          gid: ''
        }
      ],
      okuser: [],
      tgroup: [],
      rmuser: [],
    }
  },
  methods: {
    // 改变页码
    changePageNum: function(val) {
      this.page = val
    },
    change() {
      this.$forceUpdate()
    },
    // 创建组弹出框
    showDialogC() {
      this.value = ''
      this.statusDialogCVisible = true
    },
    // 创建组具体实现
    CTGroup() {
      // this.statusDialogCVisible=true
      this.$confirm('确认创建该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        creatGroup({ name: this.inputgn, description: this.inputgd }).then((res) => {
          if (res.code == 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
          .catch(() => {
          })
        this.statusDialogCVisible = false
      })
    },
    // 编辑组弹出框
    showDialogE(row) {
      this.inputegn = row['name']
      this.inputegd = row['description']
      this.value = row['groupid']
      this.statusDialogEVisible = true
    },
    // 编辑组具体实现
    EDGroup() {
      // this.statusDialogCVisible=true
      this.$confirm('确认更改该组信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateGroup(this.value, { name: this.inputegn, description: this.inputegd }).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
          .catch(() => {
          })
        this.statusDialogCVisible = false
      })
    },
    showDialogA(row) {
      this.value = ''
      this.okuser = []
      tg_id = row.groupid
      getOkUser().then((res) => {
        if (res.code == 1) {
          this.okuser = res.user_list
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.statusDialogAVisible = true
    },
    // 添加用户具体实现
    AddUser() {
      // this.statusDialogCVisible=true
      this.$confirm('确认添加该用户到组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addUser(this.value, { groupid: tg_id }).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
          .catch(() => {
          })
        this.statusDialogAVisible = false
      })
    },
    // 移出用户弹出框
    showDialogR(row) {
      this.value = ''
      this.rmuser = []
      tg_id = row.groupid
      getUserList(tg_id).then((res) => {
        if (res.code == 1) {
          this.rmuser = res.user_list
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.statusDialogRVisible = true
    },
    // 移出用户具体实现
    RemoveUser() {
      this.$confirm('确认移出该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser(this.value).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
          .catch(() => {
          })
        this.statusDialogRVisible = false
      })
    },
    // 删除组
    handleDelete(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row['groupid']).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupList()
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
    // 获取组列表
    getGroupList: function() {
      if (this.all) {
        getAllGroupList().then((res) => {
          this.tableData = res.group_list
          // console.log(this.total)
        })
      } else {
        getGroupListByUid().then((res) => {
          this.tableData = res.group_list
          // console.log(this.total)
        })
      }
    },
    changeAll: function() {
      this.all = !this.all
      this.getGroupList()
    }

  }
}
</script>

