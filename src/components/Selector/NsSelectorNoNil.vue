<template>
  <div style="display: inline; margin-left: 2%">
    <span>工作空间：</span>
    <el-select v-model="ns" filterable placeholder="请选择" @change="change" @blur="change">
      <el-option
        v-for="item, index in options"
        :key="index"
        :label="item.name || item.nickname"
        :value="item.name"
      />
    </el-select>
  </div>
</template>

<script>
import { getNsList } from '@/api/namespace'

export default {
  name: 'NsSelectorNoNil',
  props: ['defaultUid', 'defaultNs'],
  data() {
    return {
      g_id: '',
      u_id: this.defaultUid,
      ns: this.defaultNs,
      options: [{
        name: '',
        nickname: ''
      }]
    }
  },
  created() {
    this.getNsList()
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList', this.ns)
    },
    getNsList: function() {
      getNsList(this.g_id,this.u_id).then((res) => {
        this.userTotal = res.length
        this.options = res.ns_list
      })
    }
  }
}
</script>

<style scoped>

</style>
