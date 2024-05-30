<template>
  <div>
    <div style="position:relative; margin-top: 10px">
      <span style="position:relative;left: 10%;" :disabled="role <= 1">当前用户管理的组:  </span>
      <el-select v-model="gid" style="position:relative;left: 10%;" :disabled="role <= 1" placeholder="请选择" @change="getUserList">
        <el-option
          v-for="item in groupList"
          :key="item.groupid"
          :label="item.name"
          :value="item.groupid"
        />
      </el-select>

      <el-button style="position:relative;left: 56%;" :disabled="role <= 1" size="middle" type="warning" @click="addUserVisible = true">添加用户</el-button>
      <el-button style="position:relative;left: 56%;" :disabled="role <= 1" size="middle" type="warning" @click="addUserByFileVisible = true">批量导入</el-button>
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

      <el-table-column label="用户名" width="120">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="昵称" width="120">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权限" width="100" sortable>
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->

          <el-tag v-if="scope.row.role === 1">普通用户</el-tag>
          <el-tag v-else-if="scope.row.role === 2" type="success">管理员</el-tag>
          <el-tag v-else-if="scope.row.role === 3" type="danger">超级管理员 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="所属组" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.group }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="过期时间" width="200">
        <template slot-scope="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.expired_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size="mini" type="warning" @click="Resetpsd(scope.row)">重置密码</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size="mini" type="warning" @click="showDialog(scope.row[&quot;id&quot;])"> 权限修改</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id'])" size="mini" type="warning" @click="showDialogP(scope.row)"> 配额修改</el-button>
          <el-button :disabled="role <= 1 || role < scope.row['role'] || (role == scope.row['role'] && u_id != scope.row['id']) || u_id == scope.row['id']" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <div>-->
    <!--      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="1" :total="total" :disabled="changepagebutton" @current-change="changePageNum" />-->
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
    <!--  配额修改弹窗-->
    <el-dialog title="配额修改" :visible.sync="statusDialogPVisible">
      <el-form>
        <el-form-item label="CPU" :label-width="formLabelWidth">
          <el-input v-model="inputcpu" placeholder="示例:5" />
        </el-form-item>
        <el-form-item label="内存" :label-width="formLabelWidth">
          <el-input v-model="inputmemory" placeholder="示例:10Gi" />
        </el-form-item>
        <el-form-item label="存储" :label-width="formLabelWidth">
          <el-input v-model="inputstorage" placeholder="示例:20Gi" />
        </el-form-item>
        <el-form-item label="持久化存储" :label-width="formLabelWidth">
          <el-input v-model="inputpvcstorage" placeholder="示例:20Gi" />
        </el-form-item>
        <el-form-item label="Gpu" :label-width="formLabelWidth">
          <el-input v-model="inputgpu" placeholder="示例:5" />
        </el-form-item>
        <el-form-item label="过期时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="inputexptime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialogPVisible = false">取 消</el-button>
        <el-button type="primary" @click="Allocation()">确 定</el-button>
      </div>
    </el-dialog>
    <!--  添加用户弹窗-->
    <el-dialog title="添加用户" :visible.sync="addUserVisible">
      <el-form ref="addUserForm" :model="addUserForm" :rules="addUserFormRules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.nickname" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password" />
        </el-form-item>
        <el-form-item label="分组" :label-width="formLabelWidth">
          <el-select v-model="addUserForm.gid" :disabled="role <= 1" placeholder="请选择">
            <el-option
              v-for="item in groupListOption"
              :key="item.groupid"
              :label="item.name"
              :value="item.groupid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!--  批量添加用户弹窗-->
    <el-dialog title="批量添加用户" :visible.sync="addUserByFileVisible">
      <el-form ref="addUserByFileForm" :model="addUserByFileForm" :rules="addUserByFileFormRules">
        <el-form-item label="分组" :label-width="formLabelWidth">
          <el-select v-model="addUserByFileForm.gid" :disabled="role <= 1" placeholder="请选择">
            <el-option
              v-for="item in groupListOption"
              :key="item.groupid"
              :label="item.name"
              :value="item.groupid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文件" prop="file" :label-width="formLabelWidth">
          <el-upload
            accept=".csv"
            class="upload-demo"
            ref="upload"
            action=""
            :on-change="handleFileChange"
            :file-list="fileList"
            :limit="fileLimit"
            :on-exceed="handleExceed"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp（只能上传一个csv文件）</span>
            <a
              slot="tip"
              class="el-upload__tip"
              style="color: red; text-decoration: underline; cursor: pointer;"
              @click="downloadTemplate"
            >下载模板</a>
<!--            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserByFileVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUserByFile()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {getGroupListByUid} from '@/api/group'
import {
  addRegisterUser,
  addRegisterUserByFile,
  allocationUser,
  deleteUser,
  editUser,
  getUserList,
  resetPass
} from '@/api/user'
import { mapGetters } from 'vuex'
var new_id
var tu_id

export default {
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.getGroupList()
  },
  data() {
    return {
      gid: '',
      addUserForm: {
        username: '',
        nickname: '',
        password: '',
        gid: ''
      },
      addUserByFileForm: {
        file: null,
        gid: ''
      },
      file: null,
      fileLimit: 1, // 限制文件上传数量为1
      fileList: [],
      addUserFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      addUserByFileFormRules: {
        file: [{ required: true, message: '请选择文件', trigger: 'blur' }]
      },
      groupList: [],
      groupListOption: [],
      page: 1,
      total: 0,
      pagesize: 10,
      formLabelWidth: '10%',
      statusDialogVisible: false,
      statusDialogPVisible: false,
      addUserVisible: false,
      addUserByFileVisible: false,
      inputcpu: '',
      inputmemory: '',
      inputstorage: '',
      inputpvcstorage: '',
      inputgpu: '',
      inputexptime: '',
      rolelist: ['普通用户', '管理员', '超级管理员'],
      tableData: [],
      allocation: [
        {
          cpu: '',
          memory: '',
          storage: '',
          pvcstorage: '',
          gpu: '',
          expired_time: ''
        }
      ]
    }
  },
  methods: {
    downloadTemplate() {
      const a = document.createElement('a');
      a.href = '/add_user.csv'; // 根据文件实际位置使用相对路径
      a.download = 'add_user.csv';
      a.click();
      a.remove();
    },
    handleFileChange(file, fileList) {
      // 超过限制的文件数量,只保留最后一个文件
      if (fileList.length > this.fileLimit) {
        this.$set(this, 'fileList', [fileList[fileList.length - 1]])
        this.$set(this, 'file', fileList[fileList.length - 1].raw)
      } else {
        this.$set(this, 'fileList', fileList)
        this.$set(this, 'file', file.raw)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.fileLimit} 个文件`);
    },
    handleAddUserByFile: function() {
      if(this.addUserByFileForm.gid == ''){
        this.addUserByFileForm.gid = 0
      }
      // 在这里使用 this.file 发送文件
      this.addUserByFileForm.file = this.file
      this.$refs.addUserByFileForm.validate(valid => {
        if (valid) {
          let form = new FormData();
          form.append('file',this.file)
          form.append('gid',this.addUserByFileForm.gid)
          addRegisterUserByFile(form).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.addUserByFileVisible = false
              location.reload()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleAddUser: function() {
      if(this.addUserForm.gid == ''){
        this.addUserForm.gid = 0
      }
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          addRegisterUser(this.addUserForm).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.addUserVisible = false
              location.reload()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    changePageNum: function(val) {
      this.page = val
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
    showDialogP(row) {
      this.allocation[0].cpu = ''
      this.allocation[0].memory = ''
      this.allocation[0].storage = ''
      this.allocation[0].pvcstorage = ''
      this.allocation[0].gpu = ''
      this.allocation[0].exptime = ''
      this.inputcpu = row['cpu']
      this.inputmemory = row['memory']
      this.inputstorage = row['storage']
      this.inputpvcstorage = row['pvcstorage']
      this.inputgpu = row['gpu']

      const t = new Date(row['expired_time'])
      // console.log(typeof(t))

      // 年
      var year = t.getFullYear()
      // 月
      var month = t.getMonth() + 1
      // 日
      var strDate = t.getDate()
      // 时
      var hour = t.getHours()
      // 分
      var minute = t.getMinutes()
      // 秒
      var second = t.getSeconds()

      month = month > 9 ? month : '0' + month

      strDate = strDate > 9 ? strDate : '0' + strDate

      hour = hour > 9 ? hour : '0' + hour

      minute = minute > 9 ? minute : '0' + minute

      second = second > 9 ? second : '0' + second
      this.inputexptime = year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
      console.log(this.inputexptime)
      this.statusDialogPVisible = true
      tu_id = row['id']
    },
    Allocation() {
      this.allocation[0].cpu = this.inputcpu
      this.allocation[0].memory = this.inputmemory
      this.allocation[0].storage = this.inputstorage
      this.allocation[0].pvcstorage = this.inputpvcstorage
      this.allocation[0].gpu = this.inputgpu

      const t = new Date(this.inputexptime)
      // console.log(typeof(t))

      // 年
      var year = t.getFullYear()
      // 月
      var month = t.getMonth() + 1
      // 日
      var strDate = t.getDate()
      // 时
      var hour = t.getHours()
      // 分
      var minute = t.getMinutes()
      // 秒
      var second = t.getSeconds()

      month = month > 9 ? month : '0' + month

      strDate = strDate > 9 ? strDate : '0' + strDate

      hour = hour > 9 ? hour : '0' + hour

      minute = minute > 9 ? minute : '0' + minute

      second = second > 9 ? second : '0' + second
      this.inputexptime = year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
      // console.log(this.inputexptime)

      this.allocation[0].expired_time = this.inputexptime
      console.log(this.allocation[0].expired_time)
      this.$confirm('确认更改此用户资源配额?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        allocationUser(tu_id, this.allocation[0]).then((res) => {
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
          message: '已取消资源分配'
        })
      })
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
      getUserList(parseInt(this.gid)).then((res) => {
        this.total = res.length
        this.tableData = res.user_list
      })
    },
    getGroupList: function() {
      getGroupListByUid().then((res) => {
        for (const i in res.group_list) {
          this.groupListOption.push(res.group_list[i])
        }
        this.total = res.length
        this.groupList = res.group_list
        if (this.role == 3) {
          // this.groupList.push({ groupid: 0, name: '所有用户' })
          this.groupList.splice(0, 0, { groupid: 0, name: '所有用户' })
        }
      })
    }
  }
}
</script>
