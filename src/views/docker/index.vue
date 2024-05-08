<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <GroupSelector ref="GroupSelector" :default-uid="adid" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" style="margin-left: 100px" @nsList="changeUid" />
      <el-button style="margin-left: 100px" type="primary" icon="el-icon-edit" @click="pullImage">
        拉取镜像
      </el-button>
    </div>
    <!--    显示页   -->
    <!--    基本信息    -->
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="ID" width="50" type="index" />
      <el-table-column width="180" property="name" label="镜像名"><template slot-scope="scope"><span>{{ scope.row.image_name }}</span></template></el-table-column>
      <el-table-column width="80" property="status" label="标签"><template slot-scope="scope"><span>{{ scope.row.tag }}</span></template></el-table-column>
      <el-table-column width="80" property="status" label="类型" sortable><template slot-scope="scope">
        <el-tag v-if="scope.row.kind === 1" type="danger">公共</el-tag>
        <el-tag v-else-if="scope.row.kind === 2" type="success">私有</el-tag>
      </template></el-table-column>
      <el-table-column width="80" property="status" label="状态" sortable><template slot-scope="scope">
        <el-tag v-if="scope.row.status === 1" type="success">就绪</el-tag>
        <el-tag v-else-if="scope.row.status === 2">长传中</el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="danger">上传失败</el-tag>
      </template></el-table-column>
      <el-table-column width="80" property="status" label="空间"><template slot-scope="scope"><span>{{ scope.row.size }}</span></template></el-table-column>
      <el-table-column width="120" property="status" label="镜像ID"><template slot-scope="scope"><span>{{ scope.row.image_id }}</span></template></el-table-column>
      <el-table-column width="115" property="created_at" label="创建时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.created_at }}</span></template></el-table-column>
      <el-table-column width="115" property="created_at" label="更新时间"><template slot-scope="scope"><i class="el-icon-time" /><span>{{ scope.row.updated_at }}</span></template></el-table-column>
      <!--    基本信息end-->

      <!--      用户信息    -->
      <el-table-column label="用户信息" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="350"
            trigger="click"
          >
            <div>
              <div>用户名：{{ scope.row.username }}</div>
              <div>昵称：{{ scope.row.nickname }}</div>
            </div>
            <el-button slot="reference" size="mini">{{ scope.row.nickname }}</el-button>
          </el-popover>
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

      <!--      操作     -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            style="margin-left: 10px"
            :disabled="u_id != scope.row.u_id"
            @click="updateImage(scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loading"
            size="mini"
            type="danger"
            style="margin-top: 2px"
            :disabled="u_id != scope.row.u_id"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <!--      操作end     -->
    </el-table>
    <!--    显示页end    -->

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
    <PullImage ref="PullImage" :visible.sync="openDialog" />
    <UpdateImage ref="UpdateImage" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import UserSelector from '@/components/Selector/UserSelector'
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import PullImage from '@/components/DockerImage/PullImage'
import UpdateImage from '@/components/DockerImage/UpdateImage'
import { getUserList } from '@/api/user'
import { deleteImageById, getImageList } from '@/api/docker'

export default {
  components: { UserSelector, GroupSelector, PullImage, UpdateImage },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.gid = ''
    this.adid = this.u_id
    // this.GroupSelector.change()
    // this.changeGid(GroupSelector.g_id)
    // this.uid = '1'
    // this.$refs.UserSelector.g_id = ''
    // this.$refs.UserSelector.u_id = this.adid
    // this.$refs.UserSelector.getAllUser()
    this.getImageList()
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
      tableData: []
    }
  },
  methods: {
    changeUid: function(u_id) {
      this.uid = u_id
      this.getImageList()
    },
    changeGid: function(g_id) {
      this.gid = g_id
      this.$refs.UserSelector.uid = ''
      this.$refs.UserSelector.g_id = this.gid
      this.$refs.UserSelector.getAllUser()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getImageList: function() {
      getImageList(this.uid, this.gid).then((res) => {
        this.total = res.length
        this.tableData = res.image_list
        console.log(res)
      })
    },
    pullImage: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.PullImage.init()
      })
    },
    updateImage: function(row) {
      this.updateDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateImage.init(row['id'],row['kind'],row['description'],row['image_name'],row['tag'])
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认删除此镜像', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteImageById(row['id']).then((res) => {
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
              this.getImageList()
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
