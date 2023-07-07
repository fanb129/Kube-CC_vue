<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <div>
      <UserSelectorNoNil ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      <NsSelectorNoNil ref="NsSelector" v-model="form.metadata.namespace" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
    </div>

    <dynamic-form
      ref="dynamic-form"
      v-model="form"
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
import { createYaml } from '@/api/yaml'

export default {
  name: 'AddStatefulSet',
  components: { UserSelectorNoNil, NsSelectorNoNil },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data: function() {
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
            replicas: { type: 'integer', required: true, min: 1 },
            selector: {
              type: 'object',
              defaultField: { type: 'string', required: true }
            },
            template: {
              type: 'object',
              fields: {
                metadata: {
                  type: 'object',
                  fields: {
                    // name: { type: 'string', required: true },
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
                    containers: {
                      type: 'array',
                      required: true,
                      defaultField: {
                        type: 'object',
                        fields: {
                          name: { type: 'string', required: true },
                          image: { type: 'string', required: true },
                          command: { type: 'array', defaultField: { type: 'string', required: true }},
                          args: { type: 'array', defaultField: { type: 'string', required: true }},
                          ports: { type: 'array', defaultField: {
                            type: 'object',
                            fields: {
                              name: { type: 'string', required: true },
                              containerPort: { type: 'integer', required: true },
                              protocol: {
                                type: 'enum',
                                required: true,
                                enum: ['TCP', 'UDP', 'SCTP'],
                                options: [
                                  { label: 'TCP', value: 'TCP' },
                                  { label: 'UDP', value: 'UDP' },
                                  { label: 'SCTP', value: 'SCTP' }
                                ]
                              }
                            }
                          }},
                          imagePullPolicy: {
                            type: 'enum',
                            required: true,
                            enum: ['Always', 'Never', 'IfNotPresent'],
                            options: [
                              { label: 'Always', value: 'Always' },
                              { label: 'Never', value: 'Never' },
                              { label: 'IfNotPresent', value: 'IfNotPresent' }
                            ]
                          }
                        }
                      }
                    },
                    restartPolicy: {
                      type: 'enum',
                      required: true,
                      enum: ['Always', 'OnFailure', 'Never'],
                      options: [
                        { label: 'Always', value: 'Always' },
                        { label: 'OnFailure', value: 'OnFailure' },
                        { label: 'Never', value: 'Never' }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      uid: '',
      ns: '',
      // 弹出层标题
      title: 'Add StatefulSet Form',
      // 是否显示弹出层
      open: false,
      form: {
        kind: 'statefulSet',
        metadata: {
          name: '',
          namespace: '',
          labels: {} // map
        },
        spec: {
          replicas: 0,
          selector: {},
          template: {
            metadata: {
              labels: {} // map
            },
            spec: {
              containers: [{
                name: '',
                image: '',
                command: [],
                args: [],
                ports: [{
                  name: '',
                  hostPort: 0,
                  containerPort: 0,
                  protocol: ''
                }],
                imagePullPolicy: ''
              }],
              restartPolicy: ''
            }
          }
        }
      }
    }
  },
  methods: {
    resetFields() {
      this.$refs['dynamic-form'].resetFields()
    },
    async validate() {
      const valid = await this.$refs['dynamic-form'].validate()
      if (this.form.metadata.namespace !== '' && valid) {
        createYaml({ yaml: this.form, kind: 'pod', ns: this.ns }).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.open = false
            // 调用主页面的方法刷新主页面
            // this.$parent.get()
            this.$parent.getPodList()
          }
        })
      } else {
        this.$message.error('请完整填写表单')
      }
    },
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
      this.ns = ''
      this.form.metadata.namespace = ''
    },
    changeNs: function(ns) {
      this.ns = ns
      this.form.metadata.namespace = ns
    },
    init() {
      this.uid = this.u_id
      this.open = true
    },
    // 取消按钮
    cancel() {
      this.resetFields()
      this.open = false
    }
  }
}
</script>

<style scoped>

</style>
