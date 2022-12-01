<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <el-form>
      <el-form-item>
        <UserSelectorNoNil ref="UserSelector" :default-uid="uid" @nsList="changeUid" />
      </el-form-item>
      <el-form-item>
        <NsSelectorNoNil ref="NsSelector" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="createYaml">Create</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { yaml2json } from '@/utils/yaml'
import { createYaml } from '@/api/yaml'
import YamlEditor from '@/components/YamlEditor/index.vue'
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'

export default {
  name: 'AddDepoy',
  components: { UserSelectorNoNil, NsSelectorNoNil },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data() {
    return {
      uid: '',
      ns: '',
      // 弹出层标题
      title: 'Add Deploy',
      // 是否显示弹出层
      open: false,
      deploy: {
        metadata: {
          name: '',
          namespace: '',
          labels: ''
        },
        spec: {
          replicas: '',
          selector: '',
          template: {
            metadata: {
              labels: ''
            },
            spec: {
              containers: [{
                name: '',
                image: '',
                command: [],
                args: [],
                ports: [],
                imagePullPolicy: '',
                resources: {
                  limits: '',
                  requests: ''
                }
              }],
              restartPolicy: ''
            }
          }
        }
      }
    }
  },
  methods: {
    changeUid: function(u_id) {
      this.uid = u_id
      this.$refs.NsSelector.u_id = this.uid
      this.$refs.NsSelector.getNsList()
    },
    changeNs: function(ns) {
      this.ns = ns
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
      this.open = false
      // this.reset()
    }
  }
}
</script>

<style scoped>

</style>
