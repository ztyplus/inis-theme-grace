<template>
  <div class="talks w-100" v-if="talkList.length != 0">
    <div class="talk-box main-card mb-2" v-for="(talk,index) in talkList" :key="index">
      <div class="talk-head text-left flex">
        <img :src="talk.expand.user.head_img" class="br-50">
        <div class="info pl-1">
          <div class="talk-name">{{talk.nickname}}</div>
          <span class="talk-time">{{methods.natureTime(talk.create_time)}}</span>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <div class="talk-content text-left" v-html="talk.content"></div>
    </div>
    <svg-icon file-name="sun"></svg-icon>
  </div>
</template>

<script>
import { reactive, toRefs,onMounted } from 'vue'
import { GET } from '@/utils/http/request'
import { inisHelper } from '@/utils/helper'
export default {
  setup () {
    const state = reactive({
      talkList: [],
      page: 1,
      allpage: 0
    })
    const methods = {
      initData(){
        methods.getLinks()
      },
      getLinks(){
        state.ArticleList = []
        let params = {type:'moving',limit:2,page:state.page}
        GET('comments', {params}).then((res) => {
          if (res.data.code == 200) {
            state.allpage = res.data.data.page
            state.talkList = state.talkList.concat(res.data.data.data)
            console.log(state.talkList[0])
          }
        })
      },
      natureTime(date = null){
          const time = inisHelper.date.to.time(date)
          return inisHelper.time.nature(time,5)
      },
    }
    onMounted(()=>{
        methods.initData()
    })
    return {...toRefs(state),methods}
  }
}
</script>

<style lang="less" scoped>
.talk-box {
  background-color: var(--card-bg-color);
  .talk-head {
    img {
      height: 2.5rem;
      width: 2.5rem;
    }
    .talk-name {
      color: var(--h2-color);
      font-size: 0.875rem;
      font-weight: 600;
    }
    .talk-time {
      color: var(--h2-color);
      font-size: 0.8rem;
      font-weight: 300;      
    }
  }
}
</style>

