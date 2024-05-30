<template>
  <div style="display: inline;width: auto">
    <span>可用镜像：</span>
    <el-select v-model="image_name" filterable placeholder="请选择" >
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.image_name+':'+item.tag"
        :value="item.image_name+':'+item.tag"
        @click.native="change(item.value)"
      />
    </el-select>
  </div>
</template>

<script>

import { getOkImageList } from '@/api/docker'
import {mapGetters} from "vuex";

export default {
  name: 'ImageSelector',
  computed: {
    ...mapGetters([
      'u_id'
    ])
  },
  created() {
    this.getOkImageList()
  },
  data() {
    return {
      image_name: '',
      options: []
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList', this.image_name)
    },
    getOkImageList: function() {
      getOkImageList().then((res) => {
        this.options = res.image_list
      })
    }
  }
}
</script>

<style scoped>

</style>
