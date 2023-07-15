<template>
  <div style="display: inline; margin-left: 2%">
    <span>Namespace：</span>
    <el-select v-model="ns" filterable placeholder="请选择" @change="change" @blur="change">
      <el-option
        v-for="item, index in options.slice((userPage - 1) * pagesize, userPage * pagesize)"
        :key="index"
        :label="item.name || item.nickname"
        :value="item.name"
      />
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="userPage"
        :page-size="pagesize"
        :total="userTotal"
        @current-change="changeUserPageNum"
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
      u_id: this.defaultUid,
      ns: this.defaultNs,
      userPage: 1,
      userTotal: 0,
      pagesize: 10,
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
    changeUserPageNum: function(val) {
      this.userPage = val
    },
    getNsList: function() {
      getNsList(this.u_id).then((res) => {
        this.userTotal = res.length
        this.options = res.ns_list
      })
    }
  }
}
</script>

<style scoped>

</style>
