<template>
<div class="flex">
  <el-input v-model="link" placeholder="请输入视频地址" />
  <el-button class="ml-2" type="primary" @click="methods.parse(link)">解析</el-button>
</div>
<div v-if="parse" class="mt-2 w-100 text-left">
<video class="w-100 dv" controls>
    <source :src="video_data.video.play_url" type="video/mp4">
    您的浏览器不支持 video 标签。
</video>
<el-button class="mt-2" type="primary" @click="methods.play(video_data.video.play_url)">点击下载</el-button>
</div>
</template>

<script>
import { GET } from '@/utils/http/request'
import { reactive, toRefs } from 'vue'
import SvgIcon from '../tool/SvgIcon.vue'
export default {
  components: { SvgIcon },
  setup(){
    const state = reactive({
      link:'',
      // link:'3.56 PXm:/ 看司藤小姐走路，明明就是正统的民国大家闺秀的样子！婀娜多姿，纤纤玉步，太美了%%司藤 %%景甜  %%须尽欢 %%我们别再一拍两散   https://v.douyin.com/YPsa5cT/ 复制此链接，打开Dou音搜索，直接观看视频！',
      parse: false,
      video_data: {},
    })
    const methods = {
      parse(p_url){
        if(p_url){
          methods.getInfo(p_url)
        }else{
          ElMessage({message: '请输入抖音分享地址！',type: 'warning',})
        }
      },
      getInfo(url){
        state.parse = false
        let params = {
          p_url: "https://inis.ztyang.com/api/douyin-ztyang-api",
          mode: 'douyin',
          url: url
        }
        GET("proxy/get",{params}).then((res)=>{
          if(res.data.data.code == 200){
            ElMessage({message: '解析成功！',type: 'success',})
            state.parse = true
            state.video_data = res.data.data.data
          }else {
            ElMessage({message: '解析失败！',type: 'error',})
          }
        })
      },
      play(url){
        window.open(url, '_blank');
      }
    }
    return { ...toRefs(state),methods }
  }
}
</script>

<style lang="less" scoped>

.dv {
  max-height: 600px;
  background-color: black;
}
</style>
