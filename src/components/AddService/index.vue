<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <!--    <el-form ref="service" :model="service" label-width="100px">-->
    <!--      <span>Metadata</span>-->
    <!--      <el-form-item label="Name">-->
    <!--        <el-input v-model="service.metadata.name"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="Namespace">-->
    <div>
      <UserSelectorNoNil ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelectorNoNil ref="NsSelector" v-model="service.metadata.namespace" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
    </div>
    <!--      </el-form-item>-->
    <!--      <el-form-item label="Labels">-->
    <!--        <el-input v-model="service.metadata.labels"></el-input>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <!--    <div>-->
    <!--      <el-button type="primary" @click="createYaml">Create</el-button>-->
    <!--      <el-button @click="cancel">Cancel</el-button>-->
    <!--    </div>-->

    <dynamic-form
      ref="dynamic-form"
      v-model="service"
      :descriptors="descriptors"
    >
      <template slot="operations">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="resetFields">重置</el-button>
        <el-button type="primary" @click="validate">提交</el-button>
      </template>
    </dynamic-form>
  </el-dialog>
</template>

<script>
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'

export default {
  name: 'AddService',
  components: { UserSelectorNoNil, NsSelectorNoNil },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data() {
    return {
      descriptors: {
        metadata: {
          type: 'object',
          fields: {
            name: { type: 'string', required: true },
            // namespace: { type: 'string', required: true },
            labels: {
              type: 'object',
              defaultField: { type: 'string', required: true }
            }
          }
        },
        spec: {
          type: 'object',
          fields: {
            selector: {
              type: 'object',
              defaultField: { type: 'string', required: true }
            },
            type: {
              type: 'enum',
              required: true,
              enum: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'],
              options: [
                { label: 'ClusterIP', value: 'ClusterIP' },
                { label: 'NodePort', value: 'NodePort' },
                { label: 'LoadBalancer', value: 'LoadBalancer' },
                { label: 'ExternalName', value: 'ExternalName' }
              ]
            },
            ports: {
              type: 'array',
              defaultField: {
                type: 'object',
                fields: {
                  name: { type: 'string' },
                  protocol: {
                    type: 'enum',
                    required: true,
                    enum: ['TCP', 'UDP', 'SCTP'],
                    options: [
                      { label: 'TCP', value: 'TCP' },
                      { label: 'UDP', value: 'UDP' },
                      { label: 'SCTP', value: 'SCTP' }
                    ]
                  },
                  port: { type: 'integer' },
                  targetPort: { type: 'integer' },
                  nodePort: { type: 'integer' }
                }
              }
            }
          }
        }
      },
      uid: '',
      ns: '',
      // 弹出层标题
      title: 'Add Service Form',
      // 是否显示弹出层
      open: false,
      service: {
        kind: 'service',
        metadata: {
          name: '',
          namespace: '',
          labels: {} // map
        },
        spec: {
          selector: {},
          type: '',
          ports: [{
            name: '',
            protocol: '',
            port: '',
            targetPort: '',
            nodePort: ''
          }]
        }
      }
    }
  },
  methods: {
    resetFields() {
      this.$refs['dynamic-form'].resetFields()
    },
    // async validate() {
    //   const valid = await this.$refs['dynamic-form'].validate()
    //   if (this.service.metadata.namespace !== '' && valid) {
    //     createYaml({ yaml: this.service, kind: 'service', ns: this.ns }).then(res => {
    //       if (res.code === 1) {
    //         this.$message({
    //           type: 'success',
    //           message: res.msg
    //         })
    //         this.open = false
    //         // 调用主页面的方法刷新主页面
    //         // this.$parent.get()
    //         this.$parent.getServiceList()
    //       }
    //     })
    //   } else {
    //     this.$message.error('请完整填写表单')
    //   }
    // },
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.ns = ''
      this.service.metadata.namespace = ''
    },
    changeNs: function(ns) {
      this.ns = ns
      this.service.metadata.namespace = ns
    },
    init() {
      this.uid = this.u_id
      this.open = true
      // this.$nextTick(() => {
      //   this.open = true
      // })
    },
    // 取消按钮
    cancel() {
      this.resetFields()
      this.open = false
      // this.reset()
    }
  }
}
</script>

<style scoped>

</style>
