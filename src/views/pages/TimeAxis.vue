<template>
  <el-timeline class="text-left">
    <el-timeline-item
      v-for="(item, index) in ArticleList"
      :key="index"
      :timestamp="item.create_time.split(' ')[0]"
      placement="top"
      :hollow="true"
      type="primary"
    >
      <el-card @click="methods.goArticle(item.id)">
        <h4 class="mb-1">
          <span class="mr-1" v-for="(sort, id) in item.expand.sort" :key="id">{{
            sort.name
          }}</span>
          {{ item.title }}
        </h4>
        <p>{{ item.description }}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
  <div class="more-load cursor-pointer" @click="methods.loadMore">
    <div class="justify-center h-100">
      <svg-icon file-name="more" :class="isLoading ? 'rotate' : ''"></svg-icon>
      <span v-if="page < allpage" class="pl-1 item-text">加载更多...</span>
      <span v-if="page >= allpage" class="pl-1 item-text">没有更多内容了</span>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      page: 1,
      allpage: 1,
      isLoading: false,
      ArticleList: [],
    });
    const methods = {
      initData() {
        methods.getArticle(1);
      },
      getArticle(page) {
        state.isLoading = true;
        let params = { where: "is_show=1", limit: 12, page };
        GET("article/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            state.allpage = res.data.data.page;
            state.ArticleList = state.ArticleList.concat(res.data.data.data);
            if (state.page >= state.allpage) state.stopLoding = true;
            state.isLoading = false;
          }
        });
      },
      goArticle(id) {
        router.push({
          name: "album",
          params: { id },
        });
      },
      loadMore() {
        state.page += 1;
        if (state.page <= state.allpage) {
          methods.getArticle(state.page);
        }
      },
    };
    onMounted(() => {
      methods.initData();
    });
    return {
      ...toRefs(state),
      methods,
    };
  },
};
</script>

<style lang="less" scoped>
h4 {
  color: var(--text-color);
  span {
    background: var(--theme-color);
    padding: 2px 5px;
    border-radius: 2px;
    font-size: 0.875rem;
  }
}
p {
  color: var(--h2-color);
}
.more-load {
  border-radius: 10px;
  height: 1.5rem;
  padding: 5px 1rem;
  display: inline-block;
  background-color: var(--main-bg-color);
}
</style>
