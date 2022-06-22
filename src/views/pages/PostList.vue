<template>
  <div class="post-list">
    <el-row :gutter="20" class="mt-2">
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
            <div class="artivle-meta">
              <p class="blog-category text-left justify-center">
                <span>{{ item.expand.sort[0].name }}</span>
                <span class="dot mx-1"></span>
                <span>发布于{{ item.create_time.split(" ")[0] }}</span>
              </p>
            </div>
            <h4 class="text-left my-1 h-1x">{{ item.title }}</h4>
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
export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      ArticleList: [],
      page: 1,
      allpage: 0,
    });
    const methods = {
      initData() {
        methods.getArticle();
      },
      getArticle() {
        state.ArticleList = [];
        let params = {
          where: "is_show,=,1;sort_id,<>,|4|;sort_id,<>,|6|",
          limit: 8,
          page: state.page,
        };
        GET("article/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            state.allpage = res.data.data.page;
            state.ArticleList = res.data.data.data;
          }
        });
      },
      handleCurrentChange(val) {
        state.page = val;
        methods.getArticle();
      },
      goArticle(id) {
        router.push({
          name: "article",
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
  border-radius: var(--border-radius) var(--border-radius) 0 0;
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
.post-card::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--bg-gradient-jet);
  border-radius: inherit;
  z-index: -1;
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
