<template>
  <div class="card" v-if="TopList.length != 0">
  <el-alert v-if="location" title="欢迎你！" type="success" :description="location" />
    <h2 class="item-title">置顶文章</h2>
    <div class="layout-169 text-center">
      <el-carousel :interval="5000" indicator-position="none">
        <el-carousel-item v-for="(item,index) in TopList" :key="index">
            <div class="banner">
              <div class="wh-100 cover" :style="{'background-image':'url('+item.img_src+')'}" ></div>
              <span class="banner-title">{{ item.title }}</span>
            </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <div class="card">
    <h2 class="item-title">我的技能</h2>
    <div class="kills mt-2">
      <el-row :gutter="20" class="w-100">
        <el-col :span="6" :xs="12" class="flex-center" v-for="(item,index) in skills" :key="index">
          <el-progress type="dashboard" :status="item.status" :percentage="item.progress">
            <template #default="{}">
              <span class="percentage-value">{{ item.progress }}%</span>
              <span class="percentage-label">{{item.skill}}</span>
            </template>
          </el-progress>
        </el-col>
      </el-row>  
    </div>
  </div>

  <div class="card" v-if="TopList.length != 0">
    <h2 class="item-title">站长信息</h2>
    <div class="about article-content" v-html="About"></div>
  </div>

</template>

<script>
import { inisHelper } from '@/utils/helper'
import { reactive,toRefs,onMounted } from 'vue'
import { GET } from '@/utils/http/request'
export default {
  name: "Index",
  setup(){
    const state = reactive({
      TopList: [],
      About: "",
      location:null,
      skills: [
        {'skill':'摄影','progress': 70,'status':'exception'},
        {'skill':'吉他','progress': 60,'status':'success'},
        {'skill':'电路','progress': 80,'status':'warning'},
        {'skill':'编程','progress': 85,'status':''}
      ]
    })
    const methods = {
      initData(){
          methods.localStorage()
          methods.getArticle()
          methods.getAbout()
          methods.welcome()
      },
      getArticle(){
        if(state.TopList.length == 0) {
        let params = {where:'is_top=1;is_show=1;',limit:10}
          GET('article/sql', {params}).then((res) => {
            if (res.data.code == 200) {
              state.TopList = res.data.data.data
              res.data.data.time = 3600
              inisHelper.set.storage('TopList',res.data.data)
            }
          })
        }
      },
      welcome(){
        GET('location').then((res) => {
          if (res.data.code == 200) {
            var data = res.data.data
            if(data.district) state.location = '来自'+data.province + data.city + data.district+'的朋友.'
            else state.location = '来自'+data.province + data.city + '的朋友.'
          }
        })
      },
      getAbout(){
        if(state.About == ""){
        let params = {alias:'about'}
          GET('page', {params}).then((res) => {
            if (res.data.code == 200) {
              state.About = res.data.data.content
              res.data.time = 3600
              inisHelper.set.storage('About',res.data)
            }
          })
        }
      },
      localStorage(){
        let TopList = inisHelper.get.storage("TopList")
        let About = inisHelper.get.storage("About")
        if (TopList != "expire" && TopList != false) {
            state.TopList = TopList.data
        }else{inisHelper.clear.storage("TopList")}
        if (About != "expire" && About != false) {
            state.About = About.data.content
        }else{inisHelper.clear.storage("About")}
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
.card {
  margin-bottom: 1.5rem;
  text-align: left;
}
.item-title {
  color: var(--h1-color);
}
.layout-169:after {
  padding-top: 56.25%;
  content: '';
  display: block;
}
.layout-169 {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  max-height: 280px;
}
.el-carousel,.banner {
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 0;
}
:deep(.el-carousel__container) {
  height:100%;
}
.cover {
      border-radius: inherit;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    display: block;
    background-size: cover;
    background-color: rgba(120, 120, 120, 0.1);
}
.banner-title {
      position: absolute;
    bottom: 1rem;
    left: 1rem;
    font-weight: 600;
    color: #fff;
    z-index: 99;
    font-size: 1.2rem;
}
</style>