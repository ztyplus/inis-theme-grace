<template>
  <div class="album-list">
    <el-row v-if="loading" :gutter="20" class="mt-2">
      <el-col
        :span="12"
        mobile
        class="flex-center"
        v-for="index in 8"
        :key="index"
      >
        <div class="post-card mb-2 cursor-pointer">
          <div class="layout-169">
            <div class="layout-card cover">
              <el-skeleton class="wh-100" :loading="loading" animated>
                <template #template>
                  <el-skeleton-item variant="image" class="wh-100" />
                </template>
              </el-skeleton>
            </div>
          </div>
          <div class="blog-content">
            <el-skeleton class="article-meta" :loading="loading" animated style="height:2rem">
              <template #template>
                <el-skeleton-item variant="h1" style="width: 100% " class="blog-category text-left justify-center"/>
              </template>
            </el-skeleton>
            <el-skeleton class="desc text-left h-2x p" :loading="loading" animated>
              <template #template>
                <el-skeleton-item variant="h1" style="width: 100% " class=""/>
                <el-skeleton-item variant="h1" style="width: 100% " class=""/>
              </template>
            </el-skeleton>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="!loading" :gutter="20" class="mt-2">
      <el-col
        :span="12"
        mobile
        class="flex-center"
        v-for="(item, index) in ArticleList"
        :key="index"
      >
        <div class="post-card mb-2 cursor-pointer" @click="methods.goArticle(item.id)">
          <div class="layout-169">
            <div class="layout-card cover">
              <img
                class="wh-100 transform"
                :src="item.img_src ? item.img_src : 'static/images/default-bg.jpg'"
              />
            </div>
          </div>
          <div class="blog-content">
            <div class="article-meta">
              <div class="blog-category text-left justify-center" style="height:2rem">
                <h4 class="text-left my-1 h-1x">{{ item.title }}</h4>
                <span class="dot mx-1"></span>
                <span>发布于{{ item.create_time.split(" ")[0] }}</span>
              </div>
            </div>
            <p class="desc text-left h-2x">{{ item.description }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-pagination
    background
    layout="prev, pager, next"
    :page-count="allpage"
    :page-size="8"
    :hide-on-single-page="true"
    @current-change="methods.handleCurrentChange"
  />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import { useRouter } from "vue-router";
import { inisHelper } from '@/utils/helper'
export default {
  setup() {
    const router = useRouter();
    const grace_config = inisHelper.get.storage("grace_config")
    const state = reactive({
      loading: true,
      ArticleList: [],
      page: 1,
      allpage: 2,
      albumId: ""
    });
    const methods = {
      initData() {
        if(grace_config.option.albumId){
          state.albumId = grace_config.option.albumId
        }else {
          ElMessage({ message: "请配置相册分类ID", type: "warning" });
        }
        methods.getArticle();
      },
      getArticle() {
        let params = { where: `is_show=1;sort_id=|${state.albumId}|`, limit: 8, page: state.page };
        GET("article/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            state.allpage = res.data.data.page;
            state.ArticleList = res.data.data.data;
            state.loading = false
          }
        });
      },
      handleCurrentChange(val) {
        state.page = val;
        methods.getArticle();
      },
      goArticle(id) {
        router.push({
          name: "album",
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
.cover {
  border-radius: var(--border-radius);
  overflow: hidden;
}
.post-card {
  background: var(--card-bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-2);
  .blog-content {
    padding: 0.5rem 1rem 1rem;
    span {
      color: var(--h2-color);
      font-size: 0.875rem;
      font-weight: 300;
    }
    h4 {
      color: var(--card-title-color);
    }
    .desc {
      color: var(--h2-color);
      line-height: 1.5rem;
      height: 3rem;
      font-size: 0.875rem;
      font-weight: 300;
    }
  }
}
.article-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}
.post-card:hover .cover img {
  transform: scale(1.08);
}
</style>
