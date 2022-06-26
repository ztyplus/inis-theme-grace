<template>
  <div class="card" v-if="TopList.length != 0">
    <div class="layout-169 text-center mt-2">
      <el-carousel :interval="5000" indicator-position="none">
        <el-carousel-item v-for="(item, index) in TopList" :key="index">
          <div
            class="banner cursor-pointer"
            @click="methods.goArticle(item.expand.sort[0].name, item.id)"
          >
            <div
              class="wh-100 cover"
              :style="{
                'background-image':
                  'url(' + (item.img_src ? item.img_src : 'static/images/note.jpg') + ')',
              }"
            ></div>
            <span class="banner-title">{{ item.title }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
  <div v-if="TopList.length != 0">
    <Music v-if="music"/>
  </div>
  <div class="card">
    <div class="about article-content" v-html="About"></div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import { useRouter } from "vue-router";
import Music from "@/components/Music";
import { inisHelper } from "@/utils/helper";
export default {
  components: {
    Music,
  },

  setup() {
    const router = useRouter();
    const grace_config = inisHelper.get.storage("grace_config")
    const state = reactive({
      music: (grace_config ? grace_config.option.music : false),
      TopList: [],
      About: "",
    });
    const methods = {
      initData() {
        methods.getArticle();
        methods.getAbout();
      },
      getArticle() {
        if (state.TopList.length == 0) {
          let params = { where: "is_top=1;is_show=1;", limit: 10, cache: false };
          GET("article/sql", { params }).then((res) => {
            if (res.data.code == 200) {
              state.TopList = res.data.data.data;
              res.data.data.time = 3600;
            }
          });
        }
      },

      getAbout() {
        if (state.About == "") {
          let params = { alias: "about" };
          GET("page", { params }).then((res) => {
            if (res.data.code == 200) {
              state.About = res.data.data.content;
              res.data.time = 3600;
            }
          });
        }
      },
      goArticle(sort_name, id) {
        let route = "article";
        if (sort_name == "日记") route = "diary";
        else if (sort_name == "相册") route = "album";
        router.push({
          name: route,
          params: { id },
        });
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
@import url(@/assets/css/markdown.css);
.card {
  margin-bottom: 1.5rem;
  text-align: left;
}
.about {
  padding-top: 0;
}
.item-title {
  color: var(--h1-color);
}

.layout-169:after {
  padding-top: 56.25%;
  content: "";
  display: block;
}
.layout-169 {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  max-height: 280px;
}
.el-carousel,
.banner {
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 0;
}
:deep(.el-carousel__container) {
  height: 100%;
}
.cover {
  border-radius: var(--border-radius);
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
