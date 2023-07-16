<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%">
      <GroupSelector ref="GroupSelector" :default-uid="adid" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" @nsList="changeUid" />
      <ImageSelector ref="ImageSelector" :default-uid="uid" :default-image="tableDataImage.image_id" @ImageList="changeImages" />
    </div>

    <div style="margin-left: 66%; margin-top: 1%">
      <el-button :disabled="role < 2" style="display: inline-block" type="primary" icon="el-icon-edit" @click="PullPublic">Pull
        PublicImage
      </el-button>
      <el-button :disabled="role < 2" style="display: inline-block" type="primary" icon="el-icon-edit" @click="PullPrivate">Pull
        PrivateImage
      </el-button>
    </div>

    <el-table :data="tableDataImage" style="width: 100%">
      <el-table-column label="ID" width="80">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name" width="370">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.image_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Size" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ImageID" width="150" property="image_id">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.image_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created_at" width="245">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Founder" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tag" width="175">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Kind" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.kind }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column label="Details" type="expand" width="80">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-table :data="scope.row.ImageDetail">-->
      <!--            <el-table-column label="CPU" width="105"><template><span>{{ scope.row.dt_ImageCPU }}</span></template></el-table-column>-->
      <!--            <el-table-column label="MemUsage/Limit" width="130"><template><span>{{ scope.row.dt_MemUsageAndLimit }}</span></template></el-table-column>-->
      <!--            <el-table-column label="NET I/O" width="105"><template><span>{{ scope.row.dt_NETAndIO }}</span></template></el-table-column>-->
      <!--            <el-table-column label="Block I/O" width="105"><template><span>{{ scope.row.dt_BLOCKAndIO }}</span></template></el-table-column>-->
      <!--          </el-table>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            @click="CreateImageByTag"
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
        :page-size="1"
        :total="total"
        :disabled="changepagebutton"
        @current-change="changePageNum"
      />
    </div>
    <CreateImage ref="CreateImage" :visible.sync="openDialog" />
    <UpdateImage ref="UpdateImage" :visible.sync="updateDialog" />
    <PullPrivate ref="PullPrivate" :visible.sync="openDialog" />
    <PullPublic ref="PullPublic" :visible.sync="openDialog" />
    <UpdateImage ref="UpdateImage" :visible.sync="openDialog" />

  </div>
</template>

<script>

import UserSelector from '@/components/Selector/UserSelector'
import { mapGetters } from 'vuex'
import UpdateImage from '@/components/AddDockerImage/UpdateImage'
import { getImageList, RemoveImageById } from '@/api/docker'
import CreateImage from '@/components/AddDockerImage/CreateImageById'
import PullPrivate from '@/components/AddDockerImage/PullPrivate'
import PullPublic from '@/components/AddDockerImage/PullPublic'
import GroupSelector from '@/components/Selector/GroupSelector.vue'
import ImageSelector from '@/components/Selector/ImageSelector.vue'

export default {
  name: 'Image',
  components: { ImageSelector, GroupSelector, PullPublic, PullPrivate, CreateImage, UpdateImage, UserSelector },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.$route.query.u_id || this.u_id
    this.adid = this.u_id
    this.getImageList()
  },
  data() {
    return {
      Kind: 'Image',
      image_id: '',
      image_name: '',
      adid: '',
      gid: '',
      uid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      image: this.$route.query.image,
      page: 1,
      total: 0,
      pagesize: 1,
      changepagebutton: false,
      tableDataImage: [
        {
          created_at: '',
          id: '',
          image_id: '',
          image_name: '',
          kind: '',
          size: '',
          tag: '',
          updated_at: '',
          user_id: ''
          // ImageDetail: [
          //   {
          //     dt_ImageCPU: '',
          //     dt_MemUsageAndLimit: '',
          //     dt_NETAndIO: '',
          //     dt_BLOCKAndIO: ''
          //   }
          // ]
        }
      ],
      tData: [],
      tableData: [],
      tagroup: [
      ]
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
    },
    PullPublic: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.PullPublic.init()
      })
    },
    PullPrivate: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.PullPrivate.init()
      })
    },
    CreateImageByTag: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateImage.init()
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此镜像', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RemoveImageById(row['image_id']).then((res) => {
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
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.getImageList()
    },
    changeGid: function(g_id) {
      this.gid = g_id
      this.$refs.UserSelector.u_id = ''
      this.$refs.UserSelector.g_id = this.gid
      this.$refs.UserSelector.getUserList()
    },
    changeImages: function(image_id) {
      this.image_id = image_id
      this.getImageList()
    },
    changePageNum: function(val) {
      this.page = val
      this.getImageList()
    },
    getImageList: function() {
      getImageList(this.page).then((res) => {
        this.page = res.page
        this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tableDataImage = res.image_list_all
      })
    }
  }
}
</script>
