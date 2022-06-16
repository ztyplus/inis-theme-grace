<template>
  <div class="demo-image__preview">
    <el-image-viewer
    v-if="imgVisible"
	    :url-list="srcList"
      :hideOnClickModal="true"
      @close="methods.closeImg"
      @switch="methods.switchViewer"
    />
    <!-- <el-image
      style="width: 100px; height: 100px"
      src="https://p2.qhimg.com/bdm/1024_768_85/t018160b069da5cac0d.jpg"
      :preview-src-list="srcList"
      :initial-index="4"
      fit="cover"
    /> -->
  </div>
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
    <div class="article-content text-left my-2 py-1" v-code-highlight v-html="article.content" @click="methods.imagePreview"></div>
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
      imgVisible: false,
      srcList : [
  'https://p2.qhimg.com/bdm/1024_768_85/t018160b069da5cac0d.jpg',
  'https://p2.qhimg.com/bdm/1024_768_85/t018160b069da5cac0d.jpg',
  'https://p2.qhimg.com/bdm/1024_768_85/t018160b069da5cac0d.jpg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
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
      imagePreview(e){
        state.imgVisible = true
        console.log(e.target.src)
          	if (e.target.nodeName == 'IMG') {//判断点击富文本内容为img图片
   		// ImagePreview({
   		// 	images:[e.target.currentSrc],  //获取当前图片src
   		// 	showIndex:false,
   		// 	loop:false,
   		// })
        } else {
          console.log("点击内容不为img")
        }
      },
      closeImg(){
        state.imgVisible = false
      },
      switchViewer(){
        console.log(1)
      }
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