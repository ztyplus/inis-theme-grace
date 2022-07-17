<template>
<teleport to="head">
  <i-tag tag="style" v-html="grace_css"></i-tag>
</teleport>
  <div class="common-layout flex-center">
    <div class="topback">
      <div class="headimg"
      :style="{'background-image': 'url('+(head_cover?head_cover:cover)+')'}"
      ></div>
      <!-- <div v-if="$route.name == 'diary'" class="headimg"
      :style="{'background-image': 'url('+(head_cover?head_cover:'static/images/note.jpg')+')'}"
      ></div> -->
    </div>
    <div class="container">
      <el-container>
      <el-header><Header /></el-header>
      <el-container>
        <el-aside :class=" ((windowWidth < 760) ? 'transform ': '') + ((isCollapse && windowWidth < 760) ? 'isCollapse': '') "><SideMenu :isCollapse="isCollapse" @CloseOverlay="methods.close"/></el-aside>
        <el-main><MainBox /></el-main>
      </el-container>
      </el-container>
      <div class="footer w-100">
        <span>Copyright © <span v-if="setYear && setYear < year">{{setYear}}-</span>{{year}} · {{title}}</span>
        <div v-if="beian" class="beian">
          <a class="flex-center" href="https://beian.miit.gov.cn/" target="_blank">
            <img src="data:image/png;base64,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">
            <span>{{beian}}</span>
          </a>
      </div>
      </div>
    </div>
  </div>
  <SideTool />
  <div v-if="!isCollapse" class="overlay" @click="methods.close"></div>
</template>
<script>
import Header from '@/components/Header'
import SideMenu from '@/components/SideMenu'
import MainBox from '@/components/MainBox'
import SideTool from '@/components/SideTool'
import { reactive, toRefs,onMounted } from 'vue'
import { GET } from '@/utils/http/request'
import { inisHelper } from '@/utils/helper'
import { mapGetters } from "vuex";
import iTag from '@/components/tool/Tag'
export default {
  components: { Header,SideMenu,MainBox,SideTool,iTag },
  computed: {
    ...mapGetters([
      'head_cover',
    ]),
  },
  setup(){
    // const grace_config = inisHelper.get.storage("grace_config")
    const grace_config = inisHelper.get.sessionStorage("grace_config")
    const state = reactive({
      isCollapse: true,
      windowWidth: document.documentElement.clientWidth,
      year:new Date().getFullYear(),
      grace_css: "",
      setYear: (grace_config && grace_config.option.setYear ? grace_config.option.setYear : ""),
      cover: (grace_config && grace_config.option.cover ? grace_config.option.cover : ""),
      title: INIS.title,
      beian: (grace_config && grace_config.option.beian ? grace_config.option.beian : null),
      themeColor: (grace_config && grace_config.style.themeColor ? grace_config.style.themeColor : "#79bbff"),
    })
    const methods = {
      initData(){
        // let grace_config = inisHelper.get.storage("grace_config")
        let grace_config = inisHelper.get.sessionStorage("grace_config")
        if (!grace_config) {
            methods.getConfig()
        }
        methods.setConfig()
        methods.welcome()
      },
      getConfig(){
        let params = {key: 'config:grace-theme', cache: false}
        GET("options",{params}).then((res)=>{
          if(res.data.code == 200){
            let config = res.data.data.opt
            config = JSON.parse(JSON.stringify(config).replaceAll('"false"','false').replaceAll('"true"','true'))
            // inisHelper.set.storage('grace_config',config)
            inisHelper.set.sessionStorage('grace_config',config)
            location.reload()
          }else {
            ElMessage({ message: '获取主题配置失败,请前往配置主题！', type: "error" });
          }
        })
      },
      close(val){
        state.isCollapse = !state.isCollapse
      },
      setConfig(){
          let grace_config = inisHelper.get.sessionStorage("grace_config")
          state.themeColor = ((grace_config.style && grace_config.style.themeColor) ? grace_config.style.themeColor : "#79bbff")
          let themeColor = state.themeColor
          let themeColor1 = inisHelper.color(themeColor,0.5,'rgba').rgba
          let themeColor2 = inisHelper.color(themeColor,0.2,'rgba').rgba
          let themeColor3 = inisHelper.color(themeColor,0.1,'rgba').rgba
          let themeColor4 = inisHelper.color(themeColor,0.05,'rgba').rgba
          state.grace_css = `:root {--theme-color: ${themeColor};--theme-color-1: ${themeColor1};--theme-color-2: ${themeColor2};--theme-color-3: ${themeColor3};--theme-color-4: ${themeColor4};}\
          :dark {--theme-color: ${themeColor};--theme-color-1:  ${themeColor1};--theme-color-2: ${themeColor2};--theme-color-3: ${themeColor3};--theme-color-4: ${themeColor4};}\
          `
          state.setYear = ((grace_config.option && grace_config.option.setYear) ? grace_config.option.setYear : "")
          state.cover= ((grace_config.option && grace_config.option.cover) ? grace_config.option.cover : INIS.api + '/file/random')
      },
      welcome(){
        if(!inisHelper.get.cookie("wellcome")){
          GET('location').then((res) => {
            if (res.data.code == 200) {
              var data = res.data.data
              let location = null
              inisHelper.set.cookie("wellcome",1,7200)
              if (data.province || data.city || data.district) {
                location = '来自' + methods.empty(data.province) + methods.empty(data.city) + methods.empty(data.district) + '的朋友.'
                ElNotification({
                    title: '欢迎你！',
                    message: location,
                    type: 'success',
                  })               
              }
            }
          })
        }
      },
      empty(item){
        if(item) return item
        else return ""
      },

      // 侧栏响应式防抖
      debounce(fn,delay){
        let timerID = null
        return function(){
          if (timerID != null) clearTimeout(timerID) 
          timerID = setTimeout(fn,delay)
        }
      },
    }
    
    onMounted(()=>{
      methods.initData()
      var func = methods.debounce(()=>{
        state.windowWidth= document.documentElement.clientWidth
      },100)
      window.onresize = func
    })
    return { ...toRefs(state), methods }
  }
}
</script>

<style lang="less">
.isCollapse {
    transform: translateX(-100%) translateY(-50%);
}
.topback {
  height: 18rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.el-header,.el-main {
  height: auto !important;
  padding: 0;
}
.el-container {
  display: flex;
  margin-top: 1.5rem;
}
.el-aside{
  margin-right: 1rem;
  width: auto;
}

.headimg {
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  height: 100%;
  z-index: 1;
}
.container {
  min-height: 100vh;
  padding-top: 12rem;
  box-sizing: border-box;
  width: 80%;
  position: relative;
  max-width: 1140px;
  padding-bottom: 4rem;
}
.footer {
  position: absolute;
  bottom: .5rem;
  left: 0;
  right: 0;
  span {
    color: var(--h2-color);
    font-size: .8rem;
  }
}
.beian {
  margin-top: .5rem;
  font-size: .8rem;
  height: 1.5rem;
  letter-spacing: .1em;
  opacity: .8;
  img {
    height: 1rem;
    padding-right: 5px;
  }
  a {color: var(--h2-color);}
}
</style>

