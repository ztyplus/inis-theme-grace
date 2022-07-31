<template>
<div class="article-box p-2">
  <div>
    <div class="demo-image__preview">
      <el-image-viewer
        v-if="imgVisible"
        :url-list="imgList"
        :hideOnClickModal="true"
        :initial-index="initialIndex"
        @close="methods.closeImg"
        @switch="methods.switchViewer"
      />
    </div>
    <div class="article" v-if="loading">
      <el-skeleton class="text-left m-0 pt-2 pb-0 border-none h2s" :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 60% " class="h2s"/>
        </template>
      </el-skeleton>
      <el-skeleton class="meta text-left pt-1" :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 5rem; height: 1rem" class="mr-1"/>
          <el-skeleton-item variant="text" style="width: 4rem; height: 1rem" class="mr-1"/>
          <el-skeleton-item variant="text" style="width: 4rem; height: 1rem" class="mr-1"/>
        </template>
      </el-skeleton>
      <el-skeleton class="article-content text-left my-2 pt-2" :rows="22" :loading="loading" animated/>
    </div>
    <div v-if="!loading" class="article">
      <div class="head">
        <h2 class="text-left m-0 pt-2 pb-0 border-none">{{ article.title }}</h2>
        <div class="meta text-left pt-1">
          <span>发布{{ article.create_time.split(" ")[0] }}</span>
          <el-divider direction="vertical" />
          <span>浏览{{ article.views }}</span>
          <el-divider direction="vertical" />
          <span>字数{{ article.font_count }}</span>
        </div>
        <el-divider content-position="right" class="my-2">
          <span class="item-text">★ 更新于{{ methods.natureTime(article.update_time) }}</span>
        </el-divider>
      </div>
      <div
        class="article-content text-left my-2 py-1"
        v-code-highlight
        v-html='article_html'
        @click="methods.clickEvent"
      ></div>

    </div>
  </div>
  <div v-if="article_data.code == 405">
    <el-dialog
      :model-value="article_data.code == 405"
      width="30%"
      :show-close="false"
      destroy-on-close
      custom-class="cus-dialog"
      center
      title="输入密码访问"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="请输入文章密码" @keyup.enter="methods.getArticle(password)">
            <template #prefix>
              <svg-icon file-name="password" fill="var(--h2-color)"></svg-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="methods.getArticle(password)">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div v-if="article_data.code == 403">
    <el-empty :description="article_data.msg" image="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjU1NDQ1MDEzOTQ2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY5MzYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vbW9vbWJlb2Rmb21kcGpucG9jb2JlbW9pYWVtZWRua2cvZm9udHMvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL21vb21iZW9kZm9tZHBqbnBvY29iZW1vaWFlbWVkbmtnL2ZvbnRzL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGZlZWRiYWNrLWljb25mb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmMiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmY/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUudHRmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDY0LjFjMTI2LjA5MyA1NS44MjYgMjUyLjE4NyA5NC4zNzMgMzc4LjI4IDExNS42NHYzMzUuMzIzYzAgMTIwLjYyMS02MC4zOTUgMjMzLjIzLTE2MC44NzQgMjk5Ljk1OEw1MTIgOTU5LjQgMjk0LjU5NCA4MTUuMDJDMTk0LjExNCA3NDguMjkzIDEzMy43MiA2MzUuNjg0IDEzMy43MiA1MTUuMDYzVjE3OS43NDFDMjU5LjgxMyAxNTguNDczIDM4NS45MDcgMTE5LjkyNiA1MTIgNjQuMXoiIGZpbGw9IiNDNUM1QzUiIGZpbGwtb3BhY2l0eT0iLjUiIHAtaWQ9IjY5MzciPjwvcGF0aD48cGF0aCBkPSJNMzY3LjcxNCA0ODYuODc4Yy0xNS44NjUgMTguMS0yNS4zNzMgNDEuOTEtMjUuMzczIDY4LjMgMCA1Ny44ODQgNDUuNzUgMTAzLjM2NCAxMDMuOTc3IDEwMy4zNjQgMjYuMDUzIDAgNDkuNjEtOS4xMDYgNjcuNjg2LTI0LjM1NHYzMjMuODhMNTEyIDk1OS40IDI5NC41OTQgODE1LjAyQzE5NC4xMTQgNzQ4LjI5MyAxMzMuNzIgNjM1LjY4NCAxMzMuNzIgNTE1LjA2M3YtMjguMTg1aDIzMy45OTR6IG03OC42MDQgNi4yOGMzNS4zNTIgMCA2Mi4zODYgMjYuODc2IDYyLjM4NiA2Mi4wMiAwIDM1LjE0My0yNy4wMzQgNjIuMDE4LTYyLjM4NiA2Mi4wMTgtMzMuMjczIDAtNjIuMzg2LTI2Ljg3NS02Mi4zODYtNjIuMDE4IDAtMzUuMTQ0IDI3LjAzNC02Mi4wMiA2Mi4zODYtNjIuMDJ6TTUxMiA2NC4xMDJjMTI2LjA5MyA1NS44MjUgMjUyLjE4NyA5NC4zNzIgMzc4LjI4IDExNS42NHYzMDkuMjMxSDU0Ni4xOTJsMTEwLjE2LTEwOS41MTQtNTEuOTg5LTUxLjY4Mi0yOS4xMTQgMjguOTQyIDIyLjg3NSAyMi43NC0xNC41NTYgMTQuNDcxLTIyLjg3NS0yMi43NC0yOS4xMTQgMjguOTQyIDIyLjg3NSAyMi43NC00Mi41NTIgNDIuMjk0VjY0LjE0NGwwLjA5OC0wLjA0M3oiIGZpbGw9IiNBQkFCQUIiIGZpbGwtb3BhY2l0eT0iLjQ1IiBwLWlkPSI2OTM4Ij48L3BhdGg+PHBhdGggZD0iTTUzNS43MzggNDk5LjM2YzEwLjM5OCAxNi41NCAxNC41NTcgMzUuMTQ1IDE0LjU1NyA1NS44MTggMCA1Ny44ODQtNDUuNzUgMTAzLjM2NC0xMDMuOTc3IDEwMy4zNjQtNTguMjI3IDAtMTAzLjk3Ny00NS40OC0xMDMuOTc3LTEwMy4zNjQgMC01Ny44ODUgNDUuNzUtMTAzLjM2NSAxMDMuOTc3LTEwMy4zNjUgMjIuODc1IDAgNDEuNTkgNi4yMDIgNjAuMzA3IDE4LjYwNmw0Ny44MjktNDcuNTQ4LTIyLjg3NS0yMi43NCAyOS4xMTQtMjguOTQyIDIyLjg3NSAyMi43NCAxNC41NTYtMTQuNDcxLTIyLjg3NS0yMi43NCAyOS4xMTQtMjguOTQyIDUxLjk4OSA1MS42ODJMNTM1LjczOCA0OTkuMzZ6IG0tODkuNDIgMTE3LjgzNmMzNS4zNTIgMCA2Mi4zODYtMjYuODc1IDYyLjM4Ni02Mi4wMTggMC0zNS4xNDQtMjcuMDM0LTYyLjAyLTYyLjM4Ni02Mi4wMi0zNS4zNTIgMC02Mi4zODYgMjYuODc2LTYyLjM4NiA2Mi4wMiAwIDM1LjE0MyAyOS4xMTMgNjIuMDE4IDYyLjM4NiA2Mi4wMTh6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9Ii4zMDIiIHAtaWQ9IjY5MzkiPjwvcGF0aD48L3N2Zz4=" />
  </div>
</div>
<div v-if="article && article.opt.comments.show == 'true'" class="article-box p-2 mt-2">
  <h3 class="text-left cot-title">发表评论</h3>
  <div class="article-comment mt-2">
    <Comment v-if="article && article.opt.comments.allow == 'true'" :articleId="articleId" commentType="article" @getWallmasg="methods.getFirst()" />
  </div>
  <MsgCard ref="msgCard" :articleId="articleId" :allow="article.opt.comments.allow" commentType="article"/>
</div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { reactive, toRefs, onMounted,ref } from "vue";
import { GET } from "@/utils/http/request";
import { inisHelper } from "@/utils/helper";
import MsgCardV from "@/components/module/MsgCard";
import Comment from "@/components/module/Comment";
import MsgCard from "@/components/module/MsgCard";
export default {
  components: {MsgCardV,Comment,MsgCard},
  setup() {
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      loading: true,
      msgCard : ref(null),
      password:null,
      article_data:"",
      article_html:"",
      article: null,
      imgVisible: false,
      initialIndex: 0,
      imgList: [],
      articleId: route.params.id,
    });
    const methods = {
      initData() {
        methods.getArticle();
      },
      getArticle(password) {
        let article_pass = inisHelper.get.cookie(`articlePassword_${route.params.id}`);
        if (!article_pass) {
          article_pass = password;
        }
        let params = { id: route.params.id,password: article_pass };
        GET("article", { params }).then((res) => {
          state.article_data = res.data
          if (res.data.code == 200) {
            state.article = res.data.data;
            document.title =  INIS.title + " - " + state.article.title
            state.article_html = state.article.content.replace(/"[X]"/g, "[√]").replace(/"[ ]"/g, "[X]");
            state.article_html = state.article_html.replace(/btn /g, "el-button ").replace(/btn-primary/g,"el-button--primary").replace(/btn-success/g,"el-button--success");
            state.article_html = state.article_html.replace(/btn-rounded/g, "is-round").replace(/btn-warning/g,"el-button--warning").replace(/btn-danger/g,"el-button--danger").replace(/btn-outline-success/g,"el-button--success is-plain")
            state.article_html = state.article_html.replace(/btn-outline-info/g,"el-button--info is-plain").replace(/btn-outline-danger/g,"el-button--danger is-plain").replace(/btn-outline-warning/g,"el-button--warning is-plain")
            state.article_html = state.article_html.replace(/btn-outline-info/g,"el-button--info is-plain").replace(/btn-outline-danger/g,"el-button--danger is-plain").replace(/btn-outline-warning/g,"el-button--warning is-plain")
            var reg = /:\/\/(.*?)\//g
            var domain = reg.exec(INIS.api)[1];
               state.article_html = state.article_html.replace(/:[a-z]+:/g, function (match, capture) {
              return `<img class="emoji-img" src="//${domain}/storage/random/emoji/qq/${match.replace(/:/g,"")}.gif" align="absmiddle">`;
            });
            res.data.data.expand.images.forEach((element) => {
              state.imgList.push(element.src);
            });
            if (password && res.data.code == 200) {
              inisHelper.set.cookie(`articlePassword_${route.params.id}`, password, 7200);
            }
            state.loading = false
            store.dispatch("headCover", res.data.data.img_src);
          }else{
            inisHelper.clear.cookie(`articlePassword_${route.params.id}`)
          }
        });
      },
      natureTime(date = null) {
        const time = inisHelper.date.to.time(date);
        return inisHelper.time.nature(time, 5);
      },
      addClass(element,csName){
        if(!methods.hasClass(element,csName)){ element.className+=' '+csName; }
      },
      hasClass(element,csName){ return 　element.className.match(RegExp('(\\s|^)'+csName+'(\\s|$)'));  },
      clickEvent(e) {
        if (e.target.nodeName == "IMG" && e.target.className != "emoji-img") {
          state.imgList.forEach((item, index) => {
            if (e.target.src.indexOf(item) !== -1) {
              state.initialIndex = index;
            }
          });
          state.imgVisible = true;
        }else if (e.target.nodeName == "LI" && e.target.className == "nav-item"){
          var list = e.target.parentNode.querySelectorAll('li')
          list.forEach((item) => {
            item.children[0].classList.remove("active")
          })
          e.target.children[0].classList.add("active");
          var tab = e.target.children[0].href.split("#")[1]
          if(tab){
            var tabdom = document.getElementById(tab)
            tabdom.parentNode.childNodes.forEach((item) => {
              if(item.nodeName == "DIV"){
                item.setAttribute("class","tab-pane")
              }
            })
            if (tabdom.classList.value.indexOf("show active") == -1) {
              methods.addClass(tabdom, "show active");
            }
          }
        }
      },
      closeImg() {
        state.imgVisible = false;
      },
      switchViewer() {
        // console.log(1)
      },
      getFirst(){
        state.msgCard.methods.getFirst();
      },
   
    };
    onMounted(() => {
      methods.initData();
    });
    return { ...toRefs(state), methods };
  },
};
</script>

<style lang="less" scoped>
@import url(@/assets/css/code.css);
h2 {
  color: var(--h1-color);
}
.meta {
  span {
    color: var(--h2-color);
    font-size: 0.8rem;
    font-weight: 500;
  }
}
.article-box {
    background-color: var(--card-bg-color);
    border-radius: var(--border-radius);
}
.cot-title {
  color: var(--h2-color)
}
.h2s {
  height: 2rem;
}
</style>
