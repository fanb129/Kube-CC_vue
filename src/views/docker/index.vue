<template>
  <div>
    <div style="position:relative;">
      <span style="position:relative;left: 46%;" :disabled="role <= 1">当前用户管理的组 :  </span>
      <el-select v-model="valueg" style="position:relative;left: 46%;" :disabled="role <= 1" placeholder="请选择" @change="changtuser(valueg)">
        <el-option
          v-for="item in tagroup"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="CreateImageById">Add
        Docker
      </el-button>
      <el-button :disabled="role < 2" style="margin-left: 55%" type="primary" icon="el-icon-edit" @click="PullPublic">Pull
        PublicImage
      </el-button>
      <el-button :disabled="role < 2" style="margin-left: 60%" type="primary" icon="el-icon-edit" @click="PullPrivate">Pull
        PrivateImage
      </el-button>
    </div>
    <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">
      <el-table-column label="ID" width="50" type="index">
      <!--        <template slot-scope="scope">-->
      <!--          &lt;!&ndash; <i class='el-icon-time'></i> &ndash;&gt;-->
      <!--          <span style="margin-left: 1%">{{ scope.$index + 1 }}</span>-->
      <!--        </template>-->
      </el-table-column>

      <el-table-column label="Name" width="250">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.imagename }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ContainerID" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.containerid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ImageID" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.imageid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created_at" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Founder" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.founder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="backup" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Details" type="expand" width="80">
        <template v-slot="scope">
          <el-table :data="scope.row.ImageDetail">
            <el-table-column label="Name" width="200"><template><span>{{ scope.row.imagename }}</span></template></el-table-column>
            <el-table-column label="ImageId" width="150"><template><span>{{ scope.row.imageid }}</span></template></el-table-column>
            <el-table-column label="CPU" width="105"><template><span>{{ scope.row.imagecpu }}</span></template></el-table-column>
            <el-table-column label="MemUsage/Limit" width="130"><template><span>{{ scope.row.memusagelimit }}</span></template></el-table-column>
            <el-table-column label="NET I/O" width="105"><template><span>{{ scope.row.netio }}</span></template></el-table-column>
            <el-table-column label="Block I/O" width="105"><template><span>{{ scope.row.blockio }}</span></template></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
<!--          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            @click="C(scope.row)"
          >编辑</el-button>-->
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
        :page-size="pagesize"
        :total="total"
        @current-change="changePageNum"
      />
    </div>
    <CreateImage ref="CreateImage" :visible.sync="openDialog" />
    <UpdateImage ref="UpdateImage" :visible.sync="updateDialog" />
    <PullPrivate ref="PullPrivate" :visible.sync="openDialog" />
    <PullPublic ref="PullPublic" :visible.sync="openDialog" />
    <CreateImageByTag ref="CreateImageByTag" :visible.sync="openDialog" />
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
import CreateImageByTag from '@/components/AddDockerImage/CreateImageByTag'
import PullPublic from '@/components/AddDockerImage/PullPublic'
import { viewGroupByAd, viewGroupUser } from '@/api/group'
import { getUserList } from '@/api/user'

export default {
  components: { PullPublic, CreateImageByTag, PullPrivate, CreateImage, UpdateImage, UserSelector },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.getImageList()
    this.viewGroupByAd()
    if (this.role == 3) {
      this.valueg = 0
      this.getUserList()
    }
  },
  data() {
    return {
      value: '',
      valueg: '',
      uid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      rolelist: ['普通用户', '管理员', '超级管理员'],
      pagesize: 10,
      tData: [],
      tableData: [
        {
          Name: '',
          ContainerId: '',
          imageId: '',
          Created_at: '',
          Founder: '',
          Status: '',
          Backup: '',
          ImageDetail: [
            {
              Name: '',
              ImageId: '',
              ImageCPU: '',
              MemUsageAndLimit: '',
              NETAndIO: '',
              BLOCKAndIO: '',
              container_statuses: [
                {
                  name: '',
                  // state: '',
                  ready: '',
                  restartCount: '',
                  image: '',
                  started: ''
                }
              ]
            }
          ]
        }
      ],
      tagroup: [
      ]
    }
  },
  methods: {
    handleCommand(command) {
    },
    beforeHandleCommand(item, row) {
      return {
        'command': item,
        'row': row
      }
    },
    changeUid: function(uid) {
      this.uid = uid
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
        this.tData = res.image_list_all
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 3) {
            this.tableData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 2) {
            this.tableData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 1) {
            this.tableData.push(this.tData[i])
          }
        }
        console.log(res)
      })
    },
    CreateImageByTag: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.UpdateImage.init()
      })
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
    CreateImageById: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.CreateImage.init()
      })
    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此镜像', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RemoveImageById(row['imageId']).then((res) => {
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
    changtuser(valueg) {
      this.tableData = []
      if (valueg == 0) {
        this.getUserList()
      }
      // else if(valueg == 0){}
      else {
        // this.tableData=[]
        viewGroupUser(valueg).then((res) => {
          this.tableData = res.groupuser_list
        })
      }
    },
    getUserList: function() {
      getUserList(this.page).then((res) => {
        this.page = res.page
        this.total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.tData = res.user_list
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 3) {
            this.tableData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 2) {
            this.tableData.push(this.tData[i])
          }
        }
        for (let i = 0; i < this.tData.length; i++) {
          if (this.tData[i].role == 1) {
            this.tableData.push(this.tData[i])
          }
        }
        // this.tableData.sort(function(a,b){return a.role > b.role})
        // console.log(this.total)
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
        if (this.role == 3) {
          this.tagroup.push({
            'value': 0,
            'label': '所有用户'
          })
        }
      })
      // this.tagid=['0']
      // for(let i=0;i<this.tagroup.length;i++){
      //   if(!this.tagid.includes(this.tagroup[i].value)){
      //     this.tagid.push(this.tagroup[i].value)
      //   }
      // }
      // console.log(this.tagroup)
    }
  }
}
</script>
