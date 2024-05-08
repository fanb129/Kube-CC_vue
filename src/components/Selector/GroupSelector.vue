<template>
  <div style="display: inline" v-if="role > 1">
    <span>所属组：</span>
    <el-select v-model="g_id" filterable placeholder="请选择" :disabled="role < 2" >
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.label"
        :value="item.value"
        @click.native="change(item.value)"
      />
      <!-- <el-pagination background layout="prev, pager, next" :current-page="userPage" :page-size="1" :total="userTotal"
                       @current-change="changeUserPageNum"></el-pagination> -->
    </el-select>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getUserList } from '@/api/user'
import {getGroupListByUid, viewGroupByAd} from '@/api/group'
import { mapGetters } from 'vuex'

export default {
  name: 'GroupSelector',
  props: ['defaultUid'],
  computed: {
    ...mapGetters([
      'role'
      // 'u_id'
    ])
  },
  created() {
    this.viewGroupByAd()
    // this.u_id = this.defaultUid
    // this.g_id = ''
    //this.change()
  },
  data() {
    return {
      u_id: this.defaultUid,
      g_id: '',
      userPage: 1,
      userTotal: 0,
      options: [

      ]
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList', this.g_id)
    },
    //   changeUserPageNum: function (val) {
    //     this.userPage = val
    //     this.getUserList()
    //   },
    //   getUserList: function () {
    //     getUserList(this.userPage).then((res) => {
    //       this.userPage = res.page
    //       this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
    //       this.options = res.user_list
    //       // Terminal.log(res)
    //       this.options.push({id:'',nickname:'All User',role: 3})
    //     })
    //   },
    viewGroupByAd: function() {
      getGroupListByUid().then((res) => {
        //this.tagroup = res.group_list
        this.options=[]
        //this.tt=[]
        //this.tt = res.group_list
        this.options.push(res.group_list.map(function(item,index){
            var tmp = {
              "value" : item.groupid,
              "label" : item.name,
            }
            return tmp
          }))
          this.options = this.options[0]
          // this.tagroup.push({
          //   "value" : 0,
          //   "label" : '请选择'
          // })
          if(this.role == 3){
            this.options.push({
            "value" : 0,
            "label" : '所有用户'
          })
          //this.options.push({id:'999999',nickname:'请选择', role: 1})
        }
      })
    }
  }
}
</script>

  <style scoped>

  </style>
