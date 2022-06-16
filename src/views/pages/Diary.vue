<template>
  <div v-if="diary" class="diary">
    <div class="head">
      <h2 class="text-left m-0 pt-2 pb-0 border-none">{{diary.title}}</h2>
      <div class="meta text-left pt-1">
        <span>发布{{diary.create_time.split (" ")[0]}}</span>
        <el-divider direction="vertical" />
        <span>字数{{diary.font_count}}</span>
      </div>
       <el-divider content-position="right" class="my-2">
       </el-divider>
    </div>
    <div class="diary-content text-left my-2 py-1" v-diary v-html="diary.content"></div>
  </div>
</template>

<script>
import { useRoute } from "vue-router"
import { reactive, toRefs,onMounted} from "vue"
import { GET } from '@/utils/http/request'
export default {
  setup () {
    const route = useRoute()
    const state = reactive({
      diary: null,
    })
    const methods = {
      initData(){
        methods.getDiary()
      },
      getDiary(){
        let params = {id:route.params.id}
        GET('article', {params}).then((res) => {
          if (res.data.code == 200) {
            state.diary = res.data.data
          }
        })
      },
    }
    onMounted(()=>{
      methods.initData()
    })
    return { ...toRefs(state),methods}
  }
}
</script>

<style lang="less" scoped>
h2 {
  color: var(--h1-color);
}
.meta {
  span {color: var(--h2-color);font-size: .8rem;font-weight: 500;}
}
</style>