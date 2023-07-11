<template>
  <div>
    <div style="margin-left: 10%; margin-top: 1%; flex: auto">
      <UserSelector :default-uid="uid" @nsList="changeUid" />
      <el-button :disabled="role < 2" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="AddImageByTag">Add
        Docker
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
      <el-table-column label="nickname" width="100">
        <template v-slot="scope">
          <!-- <i class='el-icon-time'></i> -->
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Details" type="expand" width="60">
        <template v-slot="scope">
          <el-table :data="scope.row.ImageDetail">
            <el-table-column label="Name" width="200"><template><span>{{ scope.row.imagename }}</span></template></el-table-column>
            <el-table-column label="ImageId" width="150"><template><span>{{ scope.row.imageid }}</span></template></el-table-column>
            <el-table-column label="CPU" width="105"><template><span>{{ scope.row.imagecpu }}</span></template></el-table-column>
            <el-table-column label="MemUsage/Limit" width="130"><template><span>{{ scope.row.memusagelimit }}</span></template></el-table-column>
            <el-table-column label="NET I/O" width="105"><template><span>{{ scope.row.netio }}</span></template></el-table-column>
            <el-table-column label="Block I/O" width="105"><template><span>{{ scope.row.blockio }}</span></template></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button
                  size="mini"
                  type="success"
                  @click="pushTerminal(scope.row)"
                > 终端</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            :disabled="role < 2"
            size="mini"
            type="warning"
            @click="updateHadoop(scope.row)"
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
        :page-size="pagesize"
        :total="total"
        @current-change="changePageNum"
      />
    </div>
    <CreateImage ref="CreateImage" :visible.sync="openDialog" />
    <UpdateImage ref="UpdateSpark" :visible.sync="updateDialog" />
  </div>
</template>

<script>

import UserSelector from '@/components/Selector/UserSelector.vue'
import { mapGetters } from 'vuex'
import UpdateImage from '@/components/AddDockerImage/UpdateImage.vue'
import { getImageList, RemoveImageById, PullPublic, CreateImageByTag, PullPrivate, CreateImageById } from '@/api/docker'
import AddImageByTag from '@/components/AddDockerImage/CreateImageById.vue'

export default {
  components: { AddImageByTag, UpdateImage, UserSelector },
  computed: {
    ...mapGetters([
      'role',
      'uid'
    ])
  },
  created() {
    this.uid = this.u_id
    this.getSparkList()
  },
  data() {
    return {
      uid: '',
      timer: null,
      loading: false,
      openDialog: false,
      updateDialog: false,
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          Name: '',
          ContainerId: '',
          imageId: '',
          username: '',
          nickname: '',
          u_id: '',
          Tag: '',
          master_replicas: '',
          worker_replicas: '',
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
      ]
    }
  },
  methods: {
    handleCommand(command) {
      if (command.command === 'deploy') {
        this.push2deploy(command.row)
      } else if (command.command === 'service') {
        this.push2service(command.row)
      }
    },
    beforeHandleCommand(item, row) {
      return {
        'command': item,
        'row': row
      }
    },
    pushTerminal: function(row) {
      console.log(row['namespace'])
      console.log(row['name'])
      console.log(row['container_statuses'][0].name)
      this.$router.push({
        name: 'PodTerminal',
        query: {
          r: 'pod/ssh?podNs=' + row['namespace'] + '&podName=' + row['name'] + '&containerName=' + row['container_statuses'][0].name
        }
      })
    },
    push2deploy: function(row) {
      this.$router.push({
        name: 'Deploy',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    push2service: function(row) {
      this.$router.push({
        name: 'Service',
        query: {
          ns: row['name'],
          u_id: row['u_id']
        }
      })
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.getSparkList()
    },
    changePageNum: function(val) {
      this.page = val
    },
    getImageList: function() {
      getImageList(this.uid).then((res) => {
        this.total = res.length
        this.tableData = res.ImageDetail
        console.log(res)
      })
    },
    CreateImage: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.CreateImage.
      })
    },
    PullPublic: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs

      })
    },
    PullPrivate: function() {

    },
    CreateImageById: function() {

    },
    CreateImageByTag: function() {

    },
    handleDelete: function(row) {
      /* 提示消息*/
      this.$confirm('确认永久删除此spark集群', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RemoveImageById(row['name']).then((res) => {
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
              this.getSparkList()
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
