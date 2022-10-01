<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" label-width="100px ">
      <el-form-item label="HdfsMaster">
        <el-input-number v-model="form.hdfs_master_replicas" @change="change" :min="1" :max="3"></el-input-number>
      </el-form-item>
      <el-form-item label="Datanode">
        <el-input-number v-model="form.datanode_replicas" @change="change" :min="2" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="YarnMaster">
        <el-input-number v-model="form.yarn_master_replicas" @change="change" :min="1" :max="3"></el-input-number>
      </el-form-item>
      <el-form-item label="YarnNode">
        <el-input-number v-model="form.yarn_node_replicas" @change="change" :min="2" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item v-if="role >= 2" label="用户">
        <el-select v-model="form.u_id" filterable placeholder="请选择分配用户" @change="change">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.username + '\t' + item.nickname"
            :value="item.id"
            :disabled="role < item.role"
          />
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="userPage"
            :page-size="1"
            :total="userTotal"
            @current-change="changeUserPageNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getUserList } from '@/api/user'
import { updateHadoop } from '@/api/hadoop'
import {mapGetters} from "vuex";

export default {
  name: 'UpdateHadoop',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: 'Update Hadoop',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        username: '',
        nickname: '',
        role: ''
      }],
      form: {
        name: '',
        hdfs_master_replicas: '',
        datanode_replicas: '',
        yarn_master_replicas: '',
        yarn_node_replicas: '',
        u_id: ''
      }
    }
  },
  methods: {
    init(name,uid,hdfsMaster,datanode,yarnMaster,yarnNode) {
      this.form.name = name
      this.form.u_id = uid
      this.form.hdfs_master_replicas = hdfsMaster
      this.form.datanode_replicas = datanode
      this.form.yarn_master_replicas = yarnMaster
      this.form.yarn_node_replicas = yarnNode
      this.open = true
      this.$nextTick(() => {
        this.getUserList()
        this.form.name = name
        this.form.u_id = uid
        this.form.hdfs_master_replicas = hdfsMaster
        this.form.datanode_replicas = datanode
        this.form.yarn_master_replicas = yarnMaster
        this.form.yarn_node_replicas = yarnNode
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    onSubmit() {
      console.log('submit!')
      updateHadoop(
        {
          name: this.form.name,
          u_id: parseInt(this.form.u_id),
          hdfs_master_replicas: parseInt(this.form.hdfs_master_replicas),
          datanode_replicas: parseInt(this.form.datanode_replicas),
          yarn_master_replicas: parseInt(this.form.yarn_master_replicas),
          yarn_node_replicas: parseInt(this.form.yarn_node_replicas)
        }).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.open = false
          // 调用主页面的getNsList方法刷新主页面
          this.$parent.getHadoopList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    changeUserPageNum: function(val) {
      this.userPage = val
      this.getUserList()
    },
    getUserList: function() {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.user_list
        this.options.push({nickname:'',id: '0',username:'Null',role: 0})
        // console.log(res)
      })
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
