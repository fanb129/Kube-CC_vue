
<template>
  <div>
    
    <el-table :data="tableData" style='width: 100%'>
      <el-table-column 
        type="selection" 
        width="55" 
        align="center" 
      />

      <el-table-column label='ID'  align="center" width='100' type="index">

      </el-table-column>
      
      <el-table-column label='用户名'  align="center" width='150'>
        <template slot-scope='scope'>
          <span>{{ scope.row.username }}</span> 
        </template>
      </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          prop="status"
          :formatter="statusFormat"
          width="100"
        >
          <template slot-scope="scope">
            {{ statusFormat(scope.row) }}
          </template>
          在线
        </el-table-column>
 <el-table-column
          label="登录时间"
          align="center"
          prop="loginTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="ip地址"
          align="center"
          prop="ipaddr"
          >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>IP: {{ scope.row.ipaddr }}</p>
              <p>归属地: {{ scope.row.loginLocation }}</p>
              <p>浏览器: {{ scope.row.browser }}</p>
              <p>系统: {{ scope.row.os }}</p>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.ipaddr }}
              </div>
            </el-popover>
          </template>
        </el-table-column>

       

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-permisaction="['admin:sysLoginLog:remove']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
   </div>
</template>

<script>
import { delSysLoginlog, getSysLoginlog, listSysLoginlog } from '@/api/sys-login-log'


export default {
  name: 'SysLoginLogManage',
  components: {
  },
  created() {
    this.getList()
    this.getDicts('sys_common_status').then(response => {
      this.statusOptions = response.data
    })
  },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      title: '',
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      typeOptions: [],

      sysloginlogList: [
        {
          id: '',
          username: '',
          nickname: '',
          
        }
      ],
      tableData: [
        // {
        //   id: '',
        //   username: '',
        //   nickname: '',
        //   role: '',
        //   created_at: '',
        //   updated_at: '',
        //   avatar: ''
        // }
      ],
      statusOptions: [],
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        status: undefined,
        ipaddr: undefined,
        loginLocation: undefined,
        createdAtOrder: 'desc'
      },
      form: {
      },
      rules: {
      }
    }
  },
  
  
  
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listSysLoginlog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.sysloginlogList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        ID: undefined,
        username: undefined,
        status: undefined,
        ipaddr: undefined,
        loginLocation: undefined,
        browser: undefined,
        os: undefined,
        platform: undefined,
        loginTime: undefined,
        remark: undefined,
        msg: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统登录日志'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const ID =
                row.id || this.ids
      getSysLoginlog(ID).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改系统登录日志'
        this.isEdit = true
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysLoginlog({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {})
    }
  }
}
</script>
