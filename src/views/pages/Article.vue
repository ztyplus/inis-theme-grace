<template>
<div class="article-box p-2">
  <div v-if="article_data.code == 200">
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
    <div v-if="article" class="article">
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
          <span class="item-text">★ 更新于{{ methods.natureTime(article.create_time) }}</span>
        </el-divider>
      </div>
      <div
        class="article-content text-left my-2 py-1"
        v-code-highlight
        v-html="article.content"
        @click="methods.imagePreview"
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
          <el-input v-model="password" placeholder="请输入文章密码">
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
    <el-empty :description="article_data.msg" image="static/svg/permission.svg" />
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
      msgCard : ref(null),
      password:null,
      article_data:"",
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
            res.data.data.expand.images.forEach((element) => {
              state.imgList.push(element.src);
            });
            if (password && res.data.code == 200) {
              inisHelper.set.cookie(`articlePassword_${route.params.id}`, password, 7200);
            }
            store.dispatch("headCover", res.data.data.img_src);
          }
        });
      },
      natureTime(date = null) {
        const time = inisHelper.date.to.time(date);
        return inisHelper.time.nature(time, 5);
      },
      imagePreview(e) {
        if (e.target.nodeName == "IMG") {
          state.imgList.forEach((item, index) => {
            if (e.target.src.indexOf(item) !== -1) {
              state.initialIndex = index;
            }
          });
          state.imgVisible = true;
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

</style>
