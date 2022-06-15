<template>
  <div v-if="article" class="article">
    <div class="head">
      <h2 class="text-left m-0 pt-2 pb-0 border-none">{{article.title}}</h2>
      <div class="meta text-left pt-1">
        <span>发布{{article.create_time.split (" ")[0]}}</span>
        <el-divider direction="vertical" />
        <span>浏览{{article.views}}</span>
        <el-divider direction="vertical" />
        <span>字数{{article.font_count}}</span>
      </div>
       <el-divider content-position="right" class="my-2">
        <span>★ 更新于{{methods.natureTime(article.create_time)}}</span>
       </el-divider>
    </div>
    <div class="article-content text-left my-2 py-1" v-code-highlight v-html="article.content"></div>
  </div>
</template>

<script>
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import { reactive, toRefs,onMounted} from "vue"
import { GET } from '@/utils/http/request'
import { inisHelper } from "@/utils/helper"
import iLink from '@/components/tool/Link'
export default {
  components: {iLink},
  setup () {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      article: null,
    })
    const methods = {
      initData(){
        methods.getArticle()
      },
      getArticle(){
        let params = {id:route.params.id}
        GET('article', {params}).then((res) => {
          if (res.data.code == 200) {
            state.article = res.data.data
            store.dispatch("headCover", res.data.data.img_src) 
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
    return { ...toRefs(state),methods}
  }
}
</script>

<style lang="less" scoped>
@import url(@/assets/css/markdown.css);
@import url(@/assets/css/code.css);
h2 {
  color: var(--h1-color);
}
.meta {
  span {color: var(--h2-color);font-size: .8rem;font-weight: 500;}
}
</style>