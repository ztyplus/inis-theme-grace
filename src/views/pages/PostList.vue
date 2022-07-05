<template>
  <div class="text-right acslect">
    <el-dropdown  @command="methods.selectCategory">
      <span class="el-dropdown-link cursor-pointer">
        <svg-icon file-name="acsort"></svg-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in sortList" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
          <el-dropdown-item command="all">全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div class="post-list">

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
            <el-skeleton class="article-meta text-left" :loading="loading" animated>
              <template #template>
                    <el-skeleton-item variant="text" style="width: 15%" class="mt-1 mr-1 post-sort "/>
                    <el-skeleton-item variant="text" style="width: 15%" class="mt-1 mr-1 post-sort " />
                    <el-skeleton-item variant="text" style="width: 15%" class="mt-1 post-sort " />
              </template>
            </el-skeleton>
            <el-skeleton class="text-left my-1 h-1x h4" :loading="loading" animated>
              <template #template>
                <el-skeleton-item variant="h1" style="width: 100% " class=""/>
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
              <div class="views flex post-sort justify-center">
                  <svg-icon  file-name="view" class="" height=".8rem" width=".8rem"></svg-icon>
                  <span class="viewinfo ml-1">{{item.views}}</span>
              </div>
            </div>
          </div>
          <div class="blog-content">
            <div class="article-meta text-left">
              <div v-if="item.expand.sort.length != 0" class="mt-1 post-sort text-left justify-center">
                <svg-icon  file-name="arcsort" class="" height=".8rem" width=".8rem"></svg-icon>
                <span class="ml-1 item" v-for="(sort,index) in item.expand.sort" :key="index">{{sort.name}}</span>
              </div>
              <div v-if="item.expand.tag.length != 0" class="mt-1 post-sort text-left justify-center">
                <svg-icon  file-name="tags" class="" height=".8rem" width=".8rem"></svg-icon>
                <span class="ml-1 item" v-for="(tag,index) in item.expand.tag" :key="index">{{tag.name}}</span>
              </div>
              <div class=" mt-1 post-sort text-left justify-center">
                <svg-icon  file-name="date" class="" height=".84rem" width=".84rem"></svg-icon>
                <span class="ml-1 item">{{ item.create_time.split(" ")[0] }}</span>
              </div>
            </div>
            <h4 class="text-left my-1 h-1x h4">{{ item.title }}</h4>
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
    :current-page="page"
  />
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { GET } from "@/utils/http/request";
import { useRouter } from "vue-router";
import { inisHelper } from '@/utils/helper'
import SvgIcon from '@/components/tool/SvgIcon.vue';
export default {
  components: { SvgIcon },
  setup() {
    const router = useRouter();
    const grace_config = inisHelper.get.storage("grace_config")
    const state = reactive({
      loading: true,
      ArticleList: [],
      page: 1,
      allpage: 0,
      albumId: "",
      diaryId: "",
      sortList: [],
      sortId: null,
    });
    const methods = {
      initData() {
        if (grace_config && (grace_config.option.albumId || grace_config.option.diaryId)) {
          state.albumId = grace_config.option.albumId
          state.diaryId = grace_config.option.diaryId
        }
        methods.getArticle();
        methods.getSort()
      },
      getArticle() {
        state.ArticleList = [];
        let where = `is_show,=,1;sort_id,<>,|${state.albumId}|;sort_id,<>,|${state.diaryId}|`;
        if (state.sortId){
          where = `is_show,=,1;sort_id,like,%|${state.sortId}|%;`
        }
        let params = {
          where,
          limit: 8,
          page: state.page,
        };
        console.log(params);
        GET("article/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            state.allpage = res.data.data.page;
            state.ArticleList = res.data.data.data;
            state.loading = false
          }
        });
      },
      getSort(){
        let params = {
          limit: 99,
          where: `is_show,=,1;id,<>,${state.albumId};id,<>,${state.diaryId}` 
        }
        GET("article-sort/sql", { params }).then((res) => {
          if (res.data.code == 200) {
            state.sortList = res.data.data.data;
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
      selectCategory(val){
        state.page = 1
        if(val == 'all') state.sortId = null
        else state.sortId = val
        methods.getArticle()
      }
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
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
}
.article-meta::-webkit-scrollbar {
    opacity: 0;
    display: none;
}
.post-card:hover .cover img {
  transform: scale(1.08);
}
.post-sort {
  height: 1.2rem;
  display: inline-block;
  width:fit-content;
  padding: 2px 6px 3px;
  border-radius: var(--border-radius);
  background-color: var(--theme-color-3);
  .item {
    color: var(--theme-color)!important;
    line-height: .8rem;
    font-size: .8rem!important;
  }
}
.views {
  background-color: var(--theme-color-2);
  position: absolute;
  top: .5rem;
  right: .5rem;
  font-size: .8rem;
  color: #eee;
}
</style>
